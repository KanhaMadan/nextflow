// src/components/nodes/ExtractFrameNode.tsx
"use client";

import { memo, useCallback } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { ExtractFrameNodeData } from "@/types";
import { useWorkflowStore } from "@/store/workflowStore";
import { Film, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ExtractFrameNode = memo(
  ({ id, data, selected }: NodeProps<ExtractFrameNodeData>) => {
    const { updateNodeData, removeNode, edges } = useWorkflowStore();

    const videoConnected = edges.some(
      (e) => e.target === id && e.targetHandle === "video_url"
    );
    const timestampConnected = edges.some(
      (e) => e.target === id && e.targetHandle === "timestamp"
    );

    const handleTimestampChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        updateNodeData(id, { timestamp: e.target.value });
      },
      [id, updateNodeData]
    );

    return (
      <div
        className={cn(
          "custom-node w-64 group",
          selected && "selected",
          data.isRunning && "node-running",
          data.hasError && "node-error"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-node-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-pink-500/20 flex items-center justify-center">
              <Film size={12} className="text-pink-400" />
            </div>
            <span className="text-xs font-semibold text-text-primary truncate max-w-[130px]">
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
          {/* Connection indicators */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[10px]">
              <div
                className={cn(
                  "w-2 h-2 rounded-full border",
                  videoConnected ? "bg-pink-500 border-pink-500" : "bg-transparent border-border"
                )}
              />
              <span className={videoConnected ? "text-pink-400" : "text-text-muted"}>
                video_url {videoConnected ? "— connected" : "— waiting"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <div
                className={cn(
                  "w-2 h-2 rounded-full border",
                  timestampConnected ? "bg-amber-500 border-amber-500" : "bg-transparent border-border"
                )}
              />
              <span className={timestampConnected ? "text-amber-400" : "text-text-muted"}>
                timestamp {timestampConnected ? "— connected" : "— manual"}
              </span>
            </div>
          </div>

          {/* Timestamp input (disabled if connected) */}
          <div>
            <label className="text-[10px] text-text-secondary mb-1 block">
              Timestamp (seconds or "50%")
            </label>
            <input
              type="text"
              value={data.timestamp}
              onChange={handleTimestampChange}
              disabled={timestampConnected}
              placeholder="e.g. 5 or 50%"
              className="w-full bg-surface-2 border border-border rounded-md px-2.5 py-1.5 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Extracted frame preview */}
          {data.extractedFrameUrl && (
            <div>
              <p className="text-[10px] text-text-secondary mb-1">
                Extracted Frame:
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.extractedFrameUrl}
                alt="Extracted frame"
                className="w-full h-24 object-cover rounded-md border border-border"
              />
            </div>
          )}

          {data.isRunning && (
            <div className="flex items-center gap-2 text-[10px] text-text-secondary">
              <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              Extracting frame via Trigger.dev…
            </div>
          )}

          {data.hasError && (
            <p className="text-[10px] text-error bg-error/10 rounded px-2 py-1">
              {data.errorMessage}
            </p>
          )}
        </div>

        {/* Input: video_url */}
        <Handle
          type="target"
          position={Position.Left}
          id="video_url"
          style={{ top: "40%", left: -6 }}
          className="!w-3 !h-3 !bg-node-bg !border-2 !border-pink-500 hover:!bg-pink-500"
        />
        {/* Input: timestamp */}
        <Handle
          type="target"
          position={Position.Left}
          id="timestamp"
          style={{ top: "57%", left: -6 }}
          className="!w-3 !h-3 !bg-node-bg !border-2 !border-amber-500 hover:!bg-amber-500"
        />

        {/* Output Handle */}
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          className="!w-3 !h-3 !bg-node-bg !border-2 !border-pink-500 hover:!bg-pink-500"
          style={{ right: -6 }}
        />
      </div>
    );
  }
);

ExtractFrameNode.displayName = "ExtractFrameNode";
export default ExtractFrameNode;
