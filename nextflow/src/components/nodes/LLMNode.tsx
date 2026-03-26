"use client";

import { memo, useCallback } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { LLMNodeData, GEMINI_MODELS } from "@/types";
import { useWorkflowStore } from "@/store/workflowStore";
import { Brain, Trash2, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const LLMNode = memo(({ id, data, selected }: NodeProps<LLMNodeData>) => {
  const { updateNodeData, removeNode } = useWorkflowStore();

  const handleModelChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateNodeData(id, { model: e.target.value });
    },
    [id, updateNodeData]
  );

  return (
    <div
      className={cn(
        "custom-node w-72 group",
        selected && "selected",
        data.isRunning && "node-running",
        data.hasError && "node-error"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-node-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-purple-500/20 flex items-center justify-center">
            <Brain size={12} className="text-purple-400" />
          </div>
          <span className="text-xs font-semibold text-text-primary truncate max-w-[140px]">
            {data.label}
          </span>
          {data.isRunning && (
            <div className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
          )}
        </div>
        <button
          onClick={() => removeNode(id)}
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-error/20 hover:text-error text-text-muted transition-all"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Body */}
      <div className="p-3 space-y-3">
        {/* Model Selector */}
        <div>
          <label className="text-[10px] font-medium text-text-secondary uppercase tracking-wider mb-1.5 block">
            Model
          </label>
          <div className="relative">
            <select
              value={data.model}
              onChange={handleModelChange}
              className="w-full appearance-none bg-surface-2 border border-border rounded-md px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:border-primary transition-colors pr-7"
            >
              {GEMINI_MODELS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            />
          </div>
        </div>

        {/* Input Handles Info */}
        <div className="space-y-1">
          <label className="text-[10px] font-medium text-text-secondary uppercase tracking-wider block">
            Inputs
          </label>
          <div className="space-y-1.5">
            {[
              { id: "system_prompt", label: "System Prompt", color: "text-blue-400", optional: true },
              { id: "user_message", label: "User Message", color: "text-green-400", optional: false },
              { id: "images", label: "Images (multi)", color: "text-amber-400", optional: true },
            ].map((handle) => (
              <div key={handle.id} className="flex items-center gap-2 text-[10px]">
                <div className={cn("w-1.5 h-1.5 rounded-full bg-current", handle.color)} />
                <span className={handle.color}>{handle.label}</span>
                {handle.optional && (
                  <span className="text-text-muted opacity-60">optional</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Result Display */}
        {data.isRunning && (
          <div className="bg-surface-2 border border-border rounded-md p-2.5 flex items-center gap-2">
            <div className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin flex-shrink-0" />
            <span className="text-[10px] text-text-secondary">
              Running via Trigger.dev…
            </span>
          </div>
        )}

        {data.result && !data.isRunning && (
          <div className="bg-surface-2 border border-primary/20 rounded-md p-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles size={10} className="text-primary" />
              <span className="text-[10px] font-medium text-primary">
                Result
              </span>
            </div>
            <p className="text-[10px] text-text-secondary leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto">
              {data.result}
            </p>
          </div>
        )}

        {data.hasError && (
          <div className="bg-error/10 border border-error/20 rounded-md p-2.5">
            <p className="text-[10px] text-error">{data.errorMessage}</p>
          </div>
        )}
      </div>

      {/* Input Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="system_prompt"
        style={{ top: "38%", left: -6 }}
        className="!w-3 !h-3 !bg-node-bg !border-2 !border-blue-500 hover:!bg-blue-500"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="user_message"
        style={{ top: "52%", left: -6 }}
        className="!w-3 !h-3 !bg-node-bg !border-2 !border-green-500 hover:!bg-green-500"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="images"
        style={{ top: "66%", left: -6 }}
        className="!w-3 !h-3 !bg-node-bg !border-2 !border-amber-500 hover:!bg-amber-500"
      />

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !bg-node-bg !border-2 !border-purple-500 hover:!bg-purple-500"
        style={{ right: -6 }}
      />
    </div>
  );
});

LLMNode.displayName = "LLMNode";
export default LLMNode;
