"use client";

import { memo, useCallback } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { CropImageNodeData } from "@/types";
import { useWorkflowStore } from "@/store/workflowStore";
import { Crop, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}

const Slider = ({ label, value, onChange, disabled }: SliderProps) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <span className="text-[10px] text-text-secondary">{label}</span>
      <span className="text-[10px] text-primary font-mono">{value}%</span>
    </div>
    <input
      type="range"
      min={0}
      max={100}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      disabled={disabled}
      className="w-full h-1 accent-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>
);

const CropImageNode = memo(
  ({ id, data, selected }: NodeProps<CropImageNodeData>) => {
    const { updateNodeData, removeNode, edges } = useWorkflowStore();

    const imageConnected = edges.some(
      (e) => e.target === id && e.targetHandle === "image_url"
    );

    const handleChange = useCallback(
      (field: keyof CropImageNodeData, value: number) => {
        updateNodeData(id, { [field]: value });
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
            <div className="w-6 h-6 rounded-md bg-teal-500/20 flex items-center justify-center">
              <Crop size={12} className="text-teal-400" />
            </div>
            <span className="text-xs font-semibold text-text-primary">
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
          {/* Image URL input handle indicator */}
          <div className="flex items-center gap-2 text-[10px]">
            <div
              className={cn(
                "w-2 h-2 rounded-full border",
                imageConnected
                  ? "bg-teal-500 border-teal-500"
                  : "bg-transparent border-border"
              )}
            />
            <span
              className={
                imageConnected ? "text-teal-400" : "text-text-muted"
              }
            >
              image_url{" "}
              {imageConnected ? "— connected" : "— waiting for connection"}
            </span>
          </div>

          {/* Crop parameters */}
          <div className="space-y-2.5">
            <Slider
              label="X Position"
              value={data.xPercent}
              onChange={(v) => handleChange("xPercent", v)}
              disabled={false}
            />
            <Slider
              label="Y Position"
              value={data.yPercent}
              onChange={(v) => handleChange("yPercent", v)}
            />
            <Slider
              label="Width"
              value={data.widthPercent}
              onChange={(v) => handleChange("widthPercent", v)}
            />
            <Slider
              label="Height"
              value={data.heightPercent}
              onChange={(v) => handleChange("heightPercent", v)}
            />
          </div>

          {/* Output preview */}
          {data.croppedImageUrl && (
            <div>
              <p className="text-[10px] text-text-secondary mb-1">Output:</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.croppedImageUrl}
                alt="Cropped"
                className="w-full h-24 object-cover rounded-md border border-border"
              />
            </div>
          )}

          {data.isRunning && (
            <div className="flex items-center gap-2 text-[10px] text-text-secondary">
              <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              Running FFmpeg via Trigger.dev…
            </div>
          )}

          {data.hasError && (
            <p className="text-[10px] text-error bg-error/10 rounded px-2 py-1">
              {data.errorMessage}
            </p>
          )}
        </div>

        {/* Input: image_url */}
        <Handle
          type="target"
          position={Position.Left}
          id="image_url"
          style={{ top: "35%", left: -6 }}
          className="!w-3 !h-3 !bg-node-bg !border-2 !border-teal-500 hover:!bg-teal-500"
        />

        {/* Output Handle */}
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          className="!w-3 !h-3 !bg-node-bg !border-2 !border-teal-500 hover:!bg-teal-500"
          style={{ right: -6 }}
        />
      </div>
    );
  }
);

CropImageNode.displayName = "CropImageNode";
export default CropImageNode;
