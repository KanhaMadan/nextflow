// src/components/canvas/WorkflowCanvas.tsx
"use client";

import { useCallback, useRef } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  SelectionMode,
} from "reactflow";
import "reactflow/dist/style.css";

import { useWorkflowStore } from "@/store/workflowStore";
import { FlowNode } from "@/types";
import TextNode from "@/components/nodes/TextNode";
import ImageUploadNode from "@/components/nodes/ImageUploadNode";
import VideoUploadNode from "@/components/nodes/VideoUploadNode";
import LLMNode from "@/components/nodes/LLMNode";
import CropImageNode from "@/components/nodes/CropImageNode";
import ExtractFrameNode from "@/components/nodes/ExtractFrameNode";

const nodeTypes = {
  textNode: TextNode,
  imageUploadNode: ImageUploadNode,
  videoUploadNode: VideoUploadNode,
  llmNode: LLMNode,
  cropImageNode: CropImageNode,
  extractFrameNode: ExtractFrameNode,
};

// Default node data per type for drag-drop
const defaultDataMap: Record<string, Record<string, unknown>> = {
  textNode: { type: "textNode", label: "Text Node", text: "" },
  imageUploadNode: { type: "imageUploadNode", label: "Upload Image" },
  videoUploadNode: { type: "videoUploadNode", label: "Upload Video" },
  llmNode: { type: "llmNode", label: "LLM Node", model: "gemini-1.5-flash" },
  cropImageNode: {
    type: "cropImageNode",
    label: "Crop Image",
    xPercent: 0,
    yPercent: 0,
    widthPercent: 100,
    heightPercent: 100,
  },
  extractFrameNode: {
    type: "extractFrameNode",
    label: "Extract Frame",
    timestamp: "0",
  },
};

function Canvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
  } = useWorkflowStore();

  const { screenToFlowPosition } = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData("application/reactflow");
      if (!nodeType) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const defaultData = defaultDataMap[nodeType] ?? { label: nodeType };
      const newNode: FlowNode = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: defaultData as FlowNode["data"],
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        // ReactFlow handles deletion internally via selected nodes
      }
    },
    []
  );

  return (
    <div
      ref={reactFlowWrapper}
      className="flex-1 h-full"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        deleteKeyCode={["Delete", "Backspace"]}
        selectionMode={SelectionMode.Partial}
        selectionOnDrag
        panOnDrag={[1, 2]}
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: "#7c3aed", strokeWidth: 2 },
        }}
        proOptions={{ hideAttribution: true }}
      >
        {/* Dot grid background — Krea style */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.2}
          color="#2a2a3d"
        />

        {/* Controls (zoom in/out/fit) */}
        <Controls
          position="bottom-left"
          showInteractive={false}
          style={{ marginBottom: "12px", marginLeft: "12px" }}
        />

        {/* MiniMap bottom-right */}
        <MiniMap
          position="bottom-right"
          style={{ marginBottom: "12px", marginRight: "12px" }}
          nodeColor={(node) => {
            const colorMap: Record<string, string> = {
              textNode: "#3b82f6",
              imageUploadNode: "#10b981",
              videoUploadNode: "#f97316",
              llmNode: "#7c3aed",
              cropImageNode: "#14b8a6",
              extractFrameNode: "#ec4899",
            };
            return colorMap[node.type ?? ""] ?? "#555577";
          }}
          maskColor="rgba(10, 10, 15, 0.7)"
        />
      </ReactFlow>
    </div>
  );
}

export default function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <Canvas />
    </ReactFlowProvider>
  );
}
