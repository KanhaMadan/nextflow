"use client";

import { useEffect, useState } from "react";
import { useWorkflowStore } from "@/store/workflowStore";
import { WorkflowRunEntry, NodeRunEntry, RunStatus } from "@/types";
import {
  History,
  X,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { cn, formatDuration, formatTimestamp, truncate } from "@/lib/utils";

const StatusIcon = ({ status }: { status: RunStatus }) => {
  const props = { size: 12 };
  if (status === "SUCCESS") return <CheckCircle2 {...props} className="text-success" />;
  if (status === "FAILED") return <XCircle {...props} className="text-error" />;
  if (status === "RUNNING") return <Clock {...props} className="text-warning animate-pulse" />;
  return <AlertCircle {...props} className="text-accent" />;
};

const StatusBadge = ({ status }: { status: RunStatus }) => {
  const map: Record<RunStatus, string> = {
    SUCCESS: "badge-success",
    FAILED: "badge-failed",
    RUNNING: "badge-running",
    PARTIAL: "badge-partial",
  };
  return (
    <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wide", map[status])}>
      {status}
    </span>
  );
};

const NodeRunRow = ({ run }: { run: NodeRunEntry }) => (
  <div className="ml-4 border-l border-border pl-3 py-1.5">
    <div className="flex items-center gap-1.5">
      <StatusIcon status={run.status} />
      <span className="text-[10px] font-medium text-text-secondary">
        {run.nodeLabel ?? run.nodeType} ({run.nodeId.slice(0, 8)})
      </span>
      <span className="text-[10px] text-text-muted ml-auto">
        {formatDuration(run.duration)}
      </span>
    </div>
    {run.outputs && (
      <p className="text-[9px] text-text-muted mt-0.5 ml-4">
        Output:{" "}
        {truncate(
          typeof run.outputs === "object"
            ? JSON.stringify(run.outputs)
            : String(run.outputs),
          60
        )}
      </p>
    )}
    {run.error && (
      <p className="text-[9px] text-error mt-0.5 ml-4">{run.error}</p>
    )}
  </div>
);

const RunItem = ({ run }: { run: WorkflowRunEntry }) => {
  const [expanded, setExpanded] = useState(false);
  const [nodeRuns, setNodeRuns] = useState<NodeRunEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const { workflowId } = useWorkflowStore();

  const handleExpand = async () => {
    if (!expanded && nodeRuns.length === 0) {
      setLoading(true);
      try {
        const res = await fetch(`/api/history/${run.id}`);
        const json = await res.json();
        setNodeRuns(json.nodeRuns ?? []);
      } catch {}
      setLoading(false);
    }
    setExpanded(!expanded);
  };

  const scopeLabel = run.scope === "FULL" ? "Full Workflow" : run.scope === "SINGLE" ? "Single Node" : `${run.nodeCount} nodes selected`;

  return (
    <div className="border border-border rounded-lg overflow-hidden mb-2">
      <button
        onClick={handleExpand}
        className="w-full flex items-start gap-2 px-3 py-2.5 hover:bg-surface-2 transition-colors text-left"
      >
        {expanded ? (
          <ChevronDown size={12} className="text-text-muted mt-0.5 flex-shrink-0" />
        ) : (
          <ChevronRight size={12} className="text-text-muted mt-0.5 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <StatusBadge status={run.status} />
            <span className="text-[10px] text-text-muted">{scopeLabel}</span>
            <span className="text-[10px] text-text-muted ml-auto">
              {formatDuration(run.duration)}
            </span>
          </div>
          <p className="text-[10px] text-text-muted mt-0.5">
            {formatTimestamp(run.startedAt)}
          </p>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border bg-surface/50 px-2 py-2">
          {loading ? (
            <div className="flex items-center gap-2 py-2 px-2">
              <div className="w-3 h-3 border border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="text-[10px] text-text-muted">Loading…</span>
            </div>
          ) : nodeRuns.length > 0 ? (
            nodeRuns.map((nr) => <NodeRunRow key={nr.id} run={nr} />)
          ) : (
            <p className="text-[10px] text-text-muted px-2 py-1">
              No node details available
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default function RightSidebar() {
  const { historyOpen, toggleHistory, runHistory, setRunHistory, workflowId } =
    useWorkflowStore();

  useEffect(() => {
    if (historyOpen && workflowId) {
      fetch(`/api/history?workflowId=${workflowId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.runs) setRunHistory(data.runs);
        })
        .catch(() => {});
    }
  }, [historyOpen, workflowId, setRunHistory]);

  if (!historyOpen) return null;

  return (
    <aside className="sidebar-right w-72 flex flex-col h-full z-10 animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <History size={14} className="text-primary" />
          <span className="text-xs font-semibold text-text-primary">
            Workflow History
          </span>
        </div>
        <button
          onClick={toggleHistory}
          className="p-1 rounded hover:bg-surface-2 text-text-muted hover:text-text-primary transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Run list */}
      <div className="flex-1 overflow-y-auto p-3">
        {runHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
            <History size={28} className="text-text-muted opacity-40" />
            <div>
              <p className="text-xs font-medium text-text-secondary">
                No runs yet
              </p>
              <p className="text-[10px] text-text-muted mt-1">
                Run your workflow to see execution history here
              </p>
            </div>
          </div>
        ) : (
          runHistory.map((run) => <RunItem key={run.id} run={run} />)
        )}
      </div>
    </aside>
  );
}
