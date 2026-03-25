// src/components/sidebar/LeftSidebar.tsx
"use client";

import { useState, useCallback } from "react";
import { useReactFlow } from "reactflow";
import { useWorkflowStore } from "@/store/workflowStore";
import {
  Type,
  ImageIcon,
  Video,
  Brain,
  Crop,
  Film,
  Search,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FlowNode, NodeType } from "@/types";

interface NodeConfig {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  defaultData: Record<string, unknown>;
}

const NODE_CONFIGS: NodeConfig[] = [
  {
    type: "textNode",
    label: "Text",
    description: "Simple text input with output handle",
    icon: <Type size={16} />,
    color: "text-blue-400",
    bgColor: "bg-blue-500/15 hover:bg-blue-500/25 border-blue-500/20",
    defaultData: { type: "textNode", label: "Text Node", text: "" },
  },
  {
    type: "imageUploadNode",
    label: "Upload Image",
    description: "Upload image via Transloadit (jpg, png, webp, gif)",
    icon: <ImageIcon size={16} />,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/20",
    defaultData: { type: "imageUploadNode", label: "Upload Image" },
  },
  {
    type: "videoUploadNode",
    label: "Upload Video",
    description: "Upload video via Transloadit (mp4, mov, webm)",
    icon: <Video size={16} />,
    color: "text-orange-400",
    bgColor: "bg-orange-500/15 hover:bg-orange-500/25 border-orange-500/20",
    defaultData: { type: "videoUploadNode", label: "Upload Video" },
  },
  {
    type: "llmNode",
    label: "Run LLM",
    description: "Run Google Gemini via Trigger.dev",
    icon: <Brain size={16} />,
    color: "text-purple-400",
    bgColor: "bg-purple-500/15 hover:bg-purple-500/25 border-purple-500/20",
    defaultData: {
      type: "llmNode",
      label: "LLM Node",
      model: "gemini-1.5-flash",
    },
  },
  {
    type: "cropImageNode",
    label: "Crop Image",
    description: "Crop image with FFmpeg via Trigger.dev",
    icon: <Crop size={16} />,
    color: "text-teal-400",
    bgColor: "bg-teal-500/15 hover:bg-teal-500/25 border-teal-500/20",
    defaultData: {
      type: "cropImageNode",
      label: "Crop Image",
      xPercent: 0,
      yPercent: 0,
      widthPercent: 100,
      heightPercent: 100,
    },
  },
  {
    type: "extractFrameNode",
    label: "Extract Frame",
    description: "Extract frame from video via Trigger.dev",
    icon: <Film size={16} />,
    color: "text-pink-400",
    bgColor: "bg-pink-500/15 hover:bg-pink-500/25 border-pink-500/20",
    defaultData: {
      type: "extractFrameNode",
      label: "Extract Frame",
      timestamp: "0",
    },
  },
];

export default function LeftSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const { addNode } = useWorkflowStore();
  const { screenToFlowPosition } = useReactFlow();

  const filtered = NODE_CONFIGS.filter(
    (n) =>
      n.label.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddNode = useCallback(
    (config: NodeConfig) => {
      const position = screenToFlowPosition({
        x: window.innerWidth / 2 - 120,
        y: window.innerHeight / 2 - 60,
      });

      const newNode: FlowNode = {
        id: `${config.type}-${Date.now()}`,
        type: config.type,
        position,
        data: config.defaultData as FlowNode["data"],
      };

      addNode(newNode);
    },
    [addNode, screenToFlowPosition]
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent, config: NodeConfig) => {
      e.dataTransfer.setData("application/reactflow", config.type);
      e.dataTransfer.setData(
        "application/nodedefaults",
        JSON.stringify(config.defaultData)
      );
      e.dataTransfer.effectAllowed = "move";
    },
    []
  );

  return (
    <aside
      className={cn(
        "sidebar-left flex flex-col h-full transition-all duration-300 z-10",
        collapsed ? "w-12" : "w-56"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-primary" />
            <span className="text-xs font-semibold text-text-primary">
              Nodes
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-1 rounded hover:bg-surface-2 text-text-muted hover:text-text-primary transition-colors",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {!collapsed && (
        <>
          {/* Search */}
          <div className="px-3 py-2 border-b border-border">
            <div className="relative">
              <Search
                size={12}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search nodes..."
                className="w-full bg-surface-2 border border-border rounded-md pl-7 pr-2.5 py-1.5 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Section label */}
          <div className="px-3 pt-3 pb-1.5">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">
              Quick Access
            </span>
          </div>

          {/* Node Buttons */}
          <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1.5">
            {filtered.map((config) => (
              <button
                key={config.type}
                onClick={() => handleAddNode(config)}
                draggable
                onDragStart={(e) => handleDragStart(e, config)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg border transition-all text-left cursor-grab active:cursor-grabbing",
                  config.bgColor
                )}
              >
                <span className={config.color}>{config.icon}</span>
                <div className="min-w-0">
                  <p className={cn("text-xs font-medium", config.color)}>
                    {config.label}
                  </p>
                  <p className="text-[9px] text-text-muted leading-tight mt-0.5 truncate">
                    {config.description}
                  </p>
                </div>
              </button>
            ))}

            {filtered.length === 0 && (
              <p className="text-[10px] text-text-muted text-center py-4">
                No nodes found
              </p>
            )}
          </div>
        </>
      )}

      {/* Collapsed icons */}
      {collapsed && (
        <div className="flex-1 flex flex-col items-center py-3 gap-2">
          {NODE_CONFIGS.map((config) => (
            <button
              key={config.type}
              onClick={() => handleAddNode(config)}
              title={config.label}
              className={cn(
                "w-8 h-8 rounded-lg border flex items-center justify-center transition-all",
                config.bgColor,
                config.color
              )}
            >
              {config.icon}
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}
