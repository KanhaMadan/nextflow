// src/components/nodes/VideoUploadNode.tsx
"use client";

import { memo, useCallback, useRef } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { VideoUploadNodeData } from "@/types";
import { useWorkflowStore } from "@/store/workflowStore";
import { Video, Upload, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

const VideoUploadNode = memo(
  ({ id, data, selected }: NodeProps<VideoUploadNodeData>) => {
    const { updateNodeData, removeNode } = useWorkflowStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        updateNodeData(id, { isRunning: true, fileName: file.name });

        try {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const json = await res.json();
          if (json.url) {
            updateNodeData(id, {
              videoUrl: json.url,
              fileName: file.name,
              isRunning: false,
              output: json.url,
            });
          } else {
            updateNodeData(id, {
              isRunning: false,
              hasError: true,
              errorMessage: json.error || "Upload failed",
            });
          }
        } catch {
          updateNodeData(id, {
            isRunning: false,
            hasError: true,
            errorMessage: "Upload failed",
          });
        }
      },
      [id, updateNodeData]
    );

    const handleClear = useCallback(() => {
      updateNodeData(id, {
        videoUrl: undefined,
        fileName: undefined,
        output: undefined,
        hasError: false,
        errorMessage: undefined,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, [id, updateNodeData]);

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
            <div className="w-6 h-6 rounded-md bg-orange-500/20 flex items-center justify-center">
              <Video size={12} className="text-orange-400" />
            </div>
            <span className="text-xs font-semibold text-text-primary truncate max-w-[120px]">
              {data.label}
            </span>
          </div>
          <button
            onClick={() => removeNode(id)}
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-error/20 hover:text-error text-text-muted transition-all"
          >
            <Trash2 size={12} />
          </button>
        </div>

        {/* Body */}
        <div className="p-3">
          {data.videoUrl ? (
            <div className="relative">
              <video
                src={data.videoUrl}
                controls
                className="w-full h-32 rounded-md border border-border bg-black object-contain"
              />
              <button
                onClick={handleClear}
                className="absolute top-1.5 right-1.5 w-5 h-5 bg-background/80 rounded-full flex items-center justify-center hover:bg-error/80 text-text-secondary hover:text-white transition-all"
              >
                <X size={10} />
              </button>
              <p className="mt-1.5 text-[10px] text-text-muted truncate">
                {data.fileName}
              </p>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={data.isRunning}
              className="w-full h-24 border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all text-text-muted hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {data.isRunning ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <span className="text-[10px]">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={18} />
                  <span className="text-[10px] font-medium">
                    Click to upload video
                  </span>
                  <span className="text-[9px] opacity-60">
                    mp4, mov, webm, m4v
                  </span>
                </>
              )}
            </button>
          )}

          {data.hasError && (
            <p className="mt-2 text-[10px] text-error bg-error/10 rounded px-2 py-1">
              {data.errorMessage}
            </p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/mov,video/webm,video/m4v,.m4v"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Output Handle */}
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          className="!w-3 !h-3 !bg-node-bg !border-2 !border-orange-500 hover:!bg-orange-500"
          style={{ right: -6 }}
        />
      </div>
    );
  }
);

VideoUploadNode.displayName = "VideoUploadNode";
export default VideoUploadNode;
