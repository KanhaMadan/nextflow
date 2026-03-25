// src/types/index.ts
// Central type definitions for NextFlow

import { Node, Edge } from "reactflow";

// ─── Node Data Types ──────────────────────────────────────────────────────────

export type NodeType =
  | "textNode"
  | "imageUploadNode"
  | "videoUploadNode"
  | "llmNode"
  | "cropImageNode"
  | "extractFrameNode";

export interface BaseNodeData {
  label: string;
  isRunning?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  output?: string | null;
}

export interface TextNodeData extends BaseNodeData {
  type: "textNode";
  text: string;
}

export interface ImageUploadNodeData extends BaseNodeData {
  type: "imageUploadNode";
  imageUrl?: string;
  fileName?: string;
}

export interface VideoUploadNodeData extends BaseNodeData {
  type: "videoUploadNode";
  videoUrl?: string;
  fileName?: string;
}

export interface LLMNodeData extends BaseNodeData {
  type: "llmNode";
  model: string;
  systemPromptConnected?: boolean;
  userMessageConnected?: boolean;
  imagesConnected?: string[];
  result?: string;
}

export interface CropImageNodeData extends BaseNodeData {
  type: "cropImageNode";
  imageUrlConnected?: boolean;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  croppedImageUrl?: string;
}

export interface ExtractFrameNodeData extends BaseNodeData {
  type: "extractFrameNode";
  videoUrlConnected?: boolean;
  timestampConnected?: boolean;
  timestamp: string;
  extractedFrameUrl?: string;
}

export type AnyNodeData =
  | TextNodeData
  | ImageUploadNodeData
  | VideoUploadNodeData
  | LLMNodeData
  | CropImageNodeData
  | ExtractFrameNodeData;

export type FlowNode = Node<AnyNodeData>;
export type FlowEdge = Edge;

// ─── Workflow Types ───────────────────────────────────────────────────────────

export interface WorkflowState {
  id?: string;
  name: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

// ─── History Types ────────────────────────────────────────────────────────────

export type RunStatus = "RUNNING" | "SUCCESS" | "FAILED" | "PARTIAL";
export type RunScope = "FULL" | "PARTIAL" | "SINGLE";

export interface NodeRunEntry {
  id: string;
  nodeId: string;
  nodeType: string;
  nodeLabel: string | null;
  status: RunStatus;
  inputs: Record<string, unknown> | null;
  outputs: Record<string, unknown> | null;
  error: string | null;
  startedAt: string;
  completedAt: string | null;
  duration: number | null;
  triggerRunId: string | null;
}

export interface WorkflowRunEntry {
  id: string;
  workflowId: string;
  scope: RunScope;
  status: RunStatus;
  startedAt: string;
  completedAt: string | null;
  duration: number | null;
  nodeCount: number;
  errorMessage: string | null;
  nodeRuns?: NodeRunEntry[];
}

// ─── Execution Types ──────────────────────────────────────────────────────────

export interface ExecutePayload {
  workflowId: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  scope: RunScope;
  selectedNodeIds?: string[];
}

export interface NodeExecutionResult {
  nodeId: string;
  status: "success" | "failed";
  output?: string;
  error?: string;
  duration: number;
}

// ─── Sidebar Node Config ──────────────────────────────────────────────────────

export interface SidebarNodeConfig {
  type: NodeType;
  label: string;
  description: string;
  icon: string;
  color: string;
}

// ─── Gemini Models ────────────────────────────────────────────────────────────

export const GEMINI_MODELS = [
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-2.0-flash-exp",
  "gemini-1.0-pro",
] as const;

export type GeminiModel = (typeof GEMINI_MODELS)[number];

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
