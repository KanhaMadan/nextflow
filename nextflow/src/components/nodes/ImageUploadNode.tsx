// src/components/nodes/ImageUploadNode.tsx
"use client";

import { memo, useCallback, useRef } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { ImageUploadNodeData } from "@/types";
import { useWorkflowStore } from "@/store/workflowStore";
import { ImageIcon, Upload, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

// TRANSLOADIT_AUTH_KEY = {ENTER YOUR TRANSLOADIT AUTH KEY} — from .env.local
const TRANSLOADIT_AUTH_KEY = process.env.NEXT_PUBLIC_TRANSLOADIT_AUTH_KEY;

const ImageUploadNode = memo(
  ({ id, data, selected }: NodeProps<ImageUploadNodeData>) => {
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
          // Upload via our API route which handles Transloadit auth
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const json = await res.json();
          if (json.url) {
            updateNodeData(id, {
              imageUrl: json.url,
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
        } catch (err) {
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
        imageUrl: undefined,
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
            <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center">
              <ImageIcon size={12} className="text-emerald-400" />
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
          {data.imageUrl ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.imageUrl}
                alt="Uploaded"
                className="w-full h-36 object-cover rounded-md border border-border"
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
                    Click to upload image
                  </span>
                  <span className="text-[9px] opacity-60">
                    jpg, jpeg, png, webp, gif
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
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Output Handle */}
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          className="!w-3 !h-3 !bg-node-bg !border-2 !border-emerald-500 hover:!bg-emerald-500"
          style={{ right: -6 }}
        />
      </div>
    );
  }
);

ImageUploadNode.displayName = "ImageUploadNode";
export default ImageUploadNode;
