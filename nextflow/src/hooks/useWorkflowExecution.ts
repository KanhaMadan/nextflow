// Core execution engine: topological sort, parallel execution, Trigger.dev integration

"use client";

import { useCallback } from "react";
import { useWorkflowStore } from "@/store/workflowStore";
import { FlowNode, FlowEdge, RunScope } from "@/types";

// ── Topological sort + parallel grouping ─────────────────────────────────────
function buildExecutionGroups(
  nodes: FlowNode[],
  edges: FlowEdge[],
  selectedIds?: string[]
): FlowNode[][] {
  const targetNodes = selectedIds
    ? nodes.filter((n) => selectedIds.includes(n.id))
    : nodes;

  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  for (const node of targetNodes) {
    inDegree.set(node.id, 0);
    adj.set(node.id, []);
  }

  for (const edge of edges) {
    if (
      inDegree.has(edge.source) &&
      inDegree.has(edge.target)
    ) {
      adj.get(edge.source)!.push(edge.target);
      inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
    }
  }

  const groups: FlowNode[][] = [];
  let frontier = targetNodes.filter((n) => inDegree.get(n.id) === 0);

  while (frontier.length > 0) {
    groups.push(frontier);
    const next: FlowNode[] = [];
    for (const node of frontier) {
      for (const neighbor of adj.get(node.id) ?? []) {
        const newDeg = (inDegree.get(neighbor) ?? 1) - 1;
        inDegree.set(neighbor, newDeg);
        if (newDeg === 0) {
          const neighborNode = targetNodes.find((n) => n.id === neighbor);
          if (neighborNode) next.push(neighborNode);
        }
      }
    }
    frontier = next;
  }

  return groups;
}

// ── Get output value for a node (from its data) ──────────────────────────────
function getNodeOutput(node: FlowNode): string | null {
  const data = node.data as unknown as Record<string, unknown>;
  if (data.output) return data.output as string;
  if (data.result) return data.result as string;
  if (data.text) return data.text as string;
  if (data.imageUrl) return data.imageUrl as string;
  if (data.videoUrl) return data.videoUrl as string;
  if (data.croppedImageUrl) return data.croppedImageUrl as string;
  if (data.extractedFrameUrl) return data.extractedFrameUrl as string;
  return null;
}

export function useWorkflowExecution() {
  const store = useWorkflowStore();

  // ── Save workflow to DB ───────────────────────────────────────────────────
  const saveWorkflow = useCallback(async () => {
    const { nodes, edges, workflowName, workflowId, setIsSaving, setWorkflowId } = store;
    setIsSaving(true);
    try {
      const res = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes, edges, name: workflowName, id: workflowId }),
      });
      const json = await res.json();
      if (json.id) setWorkflowId(json.id);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  }, [store]);

  // ── Execute a single node via /api/execute ────────────────────────────────
  const executeNode = useCallback(
    async (
      node: FlowNode,
      nodes: FlowNode[],
      edges: FlowEdge[],
      workflowRunId: string
    ): Promise<{ success: boolean; output?: string; error?: string; duration: number }> => {
      const start = Date.now();
      const data = node.data as unknown as Record<string, unknown>;

      // Build inputs from connected upstream nodes
      const incomingEdges = edges.filter((e) => e.target === node.id);
      const inputs: Record<string, unknown> = {};

      for (const edge of incomingEdges) {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        if (!sourceNode) continue;
        const output = getNodeOutput(sourceNode);
        const handle = edge.targetHandle ?? "input";

        if (handle === "images") {
          // Multi image support
          if (!inputs.images) inputs.images = [];
          if (output) (inputs.images as string[]).push(output);
        } else {
          inputs[handle] = output;
        }
      }

      try {
        const res = await fetch("/api/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nodeId: node.id,
            nodeType: node.type,
            nodeData: data,
            inputs,
            workflowRunId,
          }),
        });

        const json = await res.json();
        const duration = Date.now() - start;

        if (json.success) {
          return { success: true, output: json.output, duration };
        } else {
          return { success: false, error: json.error ?? "Execution failed", duration };
        }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : "Network error",
          duration: Date.now() - start,
        };
      }
    },
    []
  );

  // ── Main execute function ─────────────────────────────────────────────────
  const executeWorkflow = useCallback(
    async (scope: RunScope, selectedNodeIds?: string[]) => {
      const {
        nodes,
        edges,
        workflowId,
        setIsExecuting,
        setNodeRunning,
        setNodeError,
        setNodeOutput,
        updateNodeData,
        addRunEntry,
      } = store;

      if (!workflowId) {
        await saveWorkflow();
      }

      setIsExecuting(true);
      const runStart = Date.now();

      // Create a DB run entry first
      let workflowRunId = `run-${Date.now()}`;
      try {
        const res = await fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workflowId: store.workflowId,
            scope,
            selectedNodeIds,
            nodeCount: scope === "SINGLE" ? 1 : nodes.length,
          }),
        });
        const json = await res.json();
        if (json.id) workflowRunId = json.id;
      } catch {}

      const targetNodes =
        scope === "SINGLE" && selectedNodeIds
          ? nodes.filter((n) => selectedNodeIds.includes(n.id))
          : scope === "PARTIAL" && selectedNodeIds
          ? nodes.filter((n) => selectedNodeIds.includes(n.id))
          : nodes;

      const groups = buildExecutionGroups(targetNodes, edges, selectedNodeIds);

      let overallStatus: "SUCCESS" | "FAILED" | "PARTIAL" = "SUCCESS";

      for (const group of groups) {
        // Execute group in parallel (independent branches)
        const results = await Promise.allSettled(
          group.map(async (node) => {
            // Text nodes — no execution needed, just propagate
            if (node.type === "textNode") {
              const text = (node.data as unknown as Record<string, unknown>).text as string;
              setNodeOutput(node.id, text ?? "");
              return { nodeId: node.id, success: true };
            }

            // Upload nodes — already have output from file upload
            if (
              node.type === "imageUploadNode" ||
              node.type === "videoUploadNode"
            ) {
              const output = getNodeOutput(node);
              if (output) {
                setNodeOutput(node.id, output);
                return { nodeId: node.id, success: true };
              }
              return { nodeId: node.id, success: false, error: "No file uploaded" };
            }

            // Execution nodes — call Trigger.dev via API
            setNodeRunning(node.id, true);
            const result = await executeNode(node, nodes, edges, workflowRunId);

            if (result.success && result.output) {
              setNodeOutput(node.id, result.output);
              // Also update specific display fields
              if (node.type === "llmNode") {
                updateNodeData(node.id, { result: result.output });
              } else if (node.type === "cropImageNode") {
                updateNodeData(node.id, { croppedImageUrl: result.output });
              } else if (node.type === "extractFrameNode") {
                updateNodeData(node.id, { extractedFrameUrl: result.output });
              }
            } else {
              setNodeError(node.id, result.error ?? "Execution failed");
              overallStatus = overallStatus === "SUCCESS" ? "PARTIAL" : "FAILED";
            }

            return { nodeId: node.id, ...result };
          })
        );
      }

      setIsExecuting(false);

      // Update run status
      const duration = Date.now() - runStart;
      try {
        await fetch(`/api/history/${workflowRunId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: overallStatus, duration }),
        });
      } catch {}

      addRunEntry({
        id: workflowRunId,
        workflowId: store.workflowId ?? "",
        scope,
        status: overallStatus,
        startedAt: new Date(runStart).toISOString(),
        completedAt: new Date().toISOString(),
        duration,
        nodeCount: targetNodes.length,
        errorMessage: null,
      });
    },
    [store, saveWorkflow, executeNode]
  );

  return { executeWorkflow, saveWorkflow };
}
