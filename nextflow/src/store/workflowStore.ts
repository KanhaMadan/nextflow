// src/store/workflowStore.ts
// Zustand store — central state for the entire workflow canvas

import { create } from "zustand";
import { temporal } from "zustand/middleware";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  NodeChange,
  EdgeChange,
  MarkerType,
} from "reactflow";
import {
  FlowNode,
  FlowEdge,
  AnyNodeData,
  RunStatus,
  WorkflowRunEntry,
} from "@/types";

interface WorkflowStore {
  // ── Canvas State ──────────────────────────────────────────
  nodes: FlowNode[];
  edges: FlowEdge[];
  workflowId: string | null;
  workflowName: string;
  isSaving: boolean;
  isExecuting: boolean;

  // ── History ───────────────────────────────────────────────
  historyOpen: boolean;
  runHistory: WorkflowRunEntry[];

  // ── Selected for partial run ──────────────────────────────
  selectedNodeIds: string[];

  // ── Actions ───────────────────────────────────────────────
  setNodes: (nodes: FlowNode[]) => void;
  setEdges: (edges: FlowEdge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: FlowNode) => void;
  updateNodeData: (nodeId: string, data: Partial<AnyNodeData>) => void;
  setNodeRunning: (nodeId: string, running: boolean) => void;
  setNodeError: (nodeId: string, error: string | null) => void;
  setNodeOutput: (nodeId: string, output: string) => void;
  removeNode: (nodeId: string) => void;

  setWorkflowId: (id: string) => void;
  setWorkflowName: (name: string) => void;
  setIsSaving: (saving: boolean) => void;
  setIsExecuting: (executing: boolean) => void;

  toggleHistory: () => void;
  setRunHistory: (history: WorkflowRunEntry[]) => void;
  addRunEntry: (entry: WorkflowRunEntry) => void;

  loadWorkflow: (
    nodes: FlowNode[],
    edges: FlowEdge[],
    id: string,
    name: string
  ) => void;
  resetCanvas: () => void;
}

const SAMPLE_NODES: FlowNode[] = [
  {
    id: "sample-text-1",
    type: "textNode",
    position: { x: 80, y: 200 },
    data: {
      type: "textNode",
      label: "System Prompt",
      text: "You are a professional marketing copywriter. Generate a compelling one-paragraph product description.",
    },
  },
  {
    id: "sample-text-2",
    type: "textNode",
    position: { x: 80, y: 420 },
    data: {
      type: "textNode",
      label: "Product Details",
      text: "Product: Wireless Bluetooth Headphones. Features: Noise cancellation, 30-hour battery, foldable design.",
    },
  },
  {
    id: "sample-image-1",
    type: "imageUploadNode",
    position: { x: 80, y: 640 },
    data: {
      type: "imageUploadNode",
      label: "Product Photo",
    },
  },
  {
    id: "sample-crop-1",
    type: "cropImageNode",
    position: { x: 420, y: 580 },
    data: {
      type: "cropImageNode",
      label: "Crop Image",
      xPercent: 10,
      yPercent: 10,
      widthPercent: 80,
      heightPercent: 80,
    },
  },
  {
    id: "sample-video-1",
    type: "videoUploadNode",
    position: { x: 80, y: 880 },
    data: {
      type: "videoUploadNode",
      label: "Demo Video",
    },
  },
  {
    id: "sample-extract-1",
    type: "extractFrameNode",
    position: { x: 420, y: 860 },
    data: {
      type: "extractFrameNode",
      label: "Extract Frame",
      timestamp: "50%",
    },
  },
  {
    id: "sample-llm-1",
    type: "llmNode",
    position: { x: 760, y: 300 },
    data: {
      type: "llmNode",
      label: "LLM: Product Description",
      model: "gemini-1.5-flash",
    },
  },
  {
    id: "sample-text-3",
    type: "textNode",
    position: { x: 760, y: 660 },
    data: {
      type: "textNode",
      label: "Social Media Prompt",
      text: "You are a social media manager. Create a tweet-length marketing post based on the product image and video frame.",
    },
  },
  {
    id: "sample-llm-2",
    type: "llmNode",
    position: { x: 1100, y: 560 },
    data: {
      type: "llmNode",
      label: "LLM: Marketing Summary",
      model: "gemini-1.5-flash",
    },
  },
];

const SAMPLE_EDGES: FlowEdge[] = [
  {
    id: "e-text1-llm1",
    source: "sample-text-1",
    target: "sample-llm-1",
    targetHandle: "system_prompt",
    animated: true,
    style: { stroke: "#7c3aed", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#7c3aed" },
  },
  {
    id: "e-text2-llm1",
    source: "sample-text-2",
    target: "sample-llm-1",
    targetHandle: "user_message",
    animated: true,
    style: { stroke: "#7c3aed", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#7c3aed" },
  },
  {
    id: "e-image-crop",
    source: "sample-image-1",
    target: "sample-crop-1",
    targetHandle: "image_url",
    animated: true,
    style: { stroke: "#7c3aed", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#7c3aed" },
  },
  {
    id: "e-crop-llm1",
    source: "sample-crop-1",
    target: "sample-llm-1",
    targetHandle: "images",
    animated: true,
    style: { stroke: "#7c3aed", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#7c3aed" },
  },
  {
    id: "e-video-extract",
    source: "sample-video-1",
    target: "sample-extract-1",
    targetHandle: "video_url",
    animated: true,
    style: { stroke: "#7c3aed", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#7c3aed" },
  },
  {
    id: "e-llm1-llm2",
    source: "sample-llm-1",
    target: "sample-llm-2",
    targetHandle: "user_message",
    animated: true,
    style: { stroke: "#7c3aed", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#7c3aed" },
  },
  {
    id: "e-text3-llm2",
    source: "sample-text-3",
    target: "sample-llm-2",
    targetHandle: "system_prompt",
    animated: true,
    style: { stroke: "#7c3aed", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#7c3aed" },
  },
  {
    id: "e-extract-llm2",
    source: "sample-extract-1",
    target: "sample-llm-2",
    targetHandle: "images",
    animated: true,
    style: { stroke: "#7c3aed", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#7c3aed" },
  },
];

export const useWorkflowStore = create<WorkflowStore>()((set, get) => ({
  nodes: SAMPLE_NODES,
  edges: SAMPLE_EDGES,
  workflowId: null,
  workflowName: "Product Marketing Kit Generator",
  isSaving: false,
  isExecuting: false,
  historyOpen: false,
  runHistory: [],
  selectedNodeIds: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) =>
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) as FlowNode[] })),

  onEdgesChange: (changes) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) as FlowEdge[] })),

  onConnect: (connection) =>
    set((state) => ({
      edges: addEdge(
        {
          ...connection,
          animated: true,
          style: { stroke: "#7c3aed", strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#7c3aed" },
        },
        state.edges
      ) as FlowEdge[],
    })),

  addNode: (node) =>
    set((state) => ({ nodes: [...state.nodes, node] })),

  updateNodeData: (nodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
      ),
    })),

  setNodeRunning: (nodeId, running) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, isRunning: running } } : n
      ),
    })),

  setNodeError: (nodeId, error) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, hasError: !!error, errorMessage: error ?? undefined, isRunning: false } }
          : n
      ),
    })),

  setNodeOutput: (nodeId, output) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, output, isRunning: false, hasError: false } }
          : n
      ),
    })),

  removeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      ),
    })),

  setWorkflowId: (id) => set({ workflowId: id }),
  setWorkflowName: (name) => set({ workflowName: name }),
  setIsSaving: (saving) => set({ isSaving: saving }),
  setIsExecuting: (executing) => set({ isExecuting: executing }),

  toggleHistory: () => set((state) => ({ historyOpen: !state.historyOpen })),
  setRunHistory: (history) => set({ runHistory: history }),
  addRunEntry: (entry) =>
    set((state) => ({ runHistory: [entry, ...state.runHistory] })),

  loadWorkflow: (nodes, edges, id, name) =>
    set({ nodes, edges, workflowId: id, workflowName: name }),

  resetCanvas: () =>
    set({
      nodes: [],
      edges: [],
      workflowId: null,
      workflowName: "Untitled Workflow",
    }),
}));
