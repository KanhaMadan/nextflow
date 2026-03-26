"use client";

import { useState, useCallback } from "react";
import { useWorkflowStore } from "@/store/workflowStore";
import { UserButton } from "@clerk/nextjs";
import {
  Play,
  Save,
  History,
  Download,
  Upload,
  Zap,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkflowExecution } from "@/hooks/useWorkflowExecution";

export default function TopBar() {
  const {
    workflowName,
    setWorkflowName,
    isSaving,
    isExecuting,
    toggleHistory,
    historyOpen,
    nodes,
    edges,
    workflowId,
  } = useWorkflowStore();

  const { executeWorkflow, saveWorkflow } = useWorkflowExecution();
  const [editingName, setEditingName] = useState(false);
  const [runMenuOpen, setRunMenuOpen] = useState(false);

  const handleNameBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setEditingName(false);
      if (!e.target.value.trim()) setWorkflowName("Untitled Workflow");
    },
    [setWorkflowName]
  );

  return (
    <header className="topbar flex items-center justify-between px-4 py-2.5 h-12">
      {/* Left: Logo + Workflow name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Zap size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold text-text-primary hidden sm:block">
            NextFlow
          </span>
        </div>

        <div className="h-4 w-px bg-border" />

        {editingName ? (
          <input
            autoFocus
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={(e) => e.key === "Enter" && setEditingName(false)}
            className="bg-surface-2 border border-primary rounded px-2 py-0.5 text-sm font-medium text-text-primary focus:outline-none w-48"
          />
        ) : (
          <button
            onClick={() => setEditingName(true)}
            className="text-sm font-medium text-text-primary hover:text-primary transition-colors truncate max-w-[200px]"
          >
            {workflowName}
          </button>
        )}
      </div>

      {/* Center — status */}
      {isExecuting && (
        <div className="flex items-center gap-2 text-xs text-warning">
          <Loader2 size={12} className="animate-spin" />
          <span>Executing workflow…</span>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Save */}
        <button
          onClick={saveWorkflow}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-2 border border-transparent hover:border-border transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Save size={12} />
          )}
          <span className="hidden sm:block">Save</span>
        </button>

        {/* Export JSON */}
        <button
          onClick={() => {
            const json = JSON.stringify({ nodes, edges, name: workflowName }, null, 2);
            const blob = new Blob([json], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${workflowName.replace(/\s+/g, "-")}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-2 border border-transparent hover:border-border transition-all"
          title="Export as JSON"
        >
          <Download size={12} />
          <span className="hidden sm:block">Export</span>
        </button>

        {/* History */}
        <button
          onClick={toggleHistory}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
            historyOpen
              ? "bg-primary/20 text-primary border border-primary/30"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-2 border border-transparent hover:border-border"
          )}
        >
          <History size={12} />
          <span className="hidden sm:block">History</span>
        </button>

        {/* Run button with dropdown */}
        <div className="relative">
          <div className="flex">
            <button
              onClick={() => executeWorkflow("FULL")}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-l-md text-xs font-semibold bg-primary hover:bg-primary-hover text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExecuting ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Play size={12} />
              )}
              Run
            </button>
            <button
              onClick={() => setRunMenuOpen(!runMenuOpen)}
              disabled={isExecuting}
              className="px-1.5 py-1.5 rounded-r-md text-xs font-semibold bg-primary hover:bg-primary-hover text-white border-l border-primary-hover transition-all disabled:opacity-50"
            >
              <ChevronDown size={12} />
            </button>
          </div>

          {runMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setRunMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-44 bg-surface border border-border rounded-lg shadow-xl z-20 overflow-hidden">
                {[
                  { label: "Run Full Workflow", scope: "FULL" as const },
                  { label: "Run Selected Nodes", scope: "PARTIAL" as const },
                ].map((item) => (
                  <button
                    key={item.scope}
                    onClick={() => {
                      executeWorkflow(item.scope);
                      setRunMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors"
                  >
                    <Play size={10} className="text-primary" />
                    {item.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="h-4 w-px bg-border" />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-7 h-7",
            },
          }}
        />
      </div>
    </header>
  );
}
