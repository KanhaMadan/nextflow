"use client";

import { memo, useCallback } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { TextNodeData } from "@/types";
import { useWorkflowStore } from "@/store/workflowStore";
import { Type, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TextNode = memo(({ id, data, selected }: NodeProps<TextNodeData>) => {
  const { updateNodeData, removeNode } = useWorkflowStore();

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeData(id, { text: e.target.value });
    },
    [id, updateNodeData]
  );

  return (
    <div
      className={cn(
        "custom-node w-64",
        selected && "selected",
        data.isRunning && "node-running",
        data.hasError && "node-error"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-node-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center">
            <Type size={12} className="text-blue-400" />
          </div>
          <span className="text-xs font-semibold text-text-primary truncate max-w-[120px]">
            {data.label}
          </span>
        </div>
        <button
          onClick={() => removeNode(id)}
          className="opacity-0 group-hover:opacity-100 hover:opacity-100 p-1 rounded hover:bg-error/20 hover:text-error text-text-muted transition-all"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Body */}
      <div className="p-3">
        <textarea
          value={data.text}
          onChange={handleTextChange}
          placeholder="Enter text..."
          rows={4}
          className="w-full bg-surface-2 border border-border rounded-md px-2.5 py-2 text-xs text-text-primary placeholder-text-muted resize-none focus:outline-none focus:border-primary transition-colors font-mono leading-relaxed"
        />
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!w-3 !h-3 !bg-node-bg !border-2 !border-blue-500 hover:!bg-blue-500"
        style={{ right: -6 }}
      />
    </div>
  );
});

TextNode.displayName = "TextNode";
export default TextNode;
