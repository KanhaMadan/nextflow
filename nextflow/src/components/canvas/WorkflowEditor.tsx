// src/components/canvas/WorkflowEditor.tsx
"use client";

import { ReactFlowProvider } from "reactflow";
import TopBar from "./TopBar";
import WorkflowCanvas from "./WorkflowCanvas";
import LeftSidebar from "@/components/sidebar/LeftSidebar";
import RightSidebar from "@/components/sidebar/RightSidebar";

export default function WorkflowEditor() {
  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
        {/* Top navigation bar */}
        <TopBar />

        {/* Main area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar */}
          <LeftSidebar />

          {/* Canvas — fills remaining space */}
          <main className="flex-1 relative overflow-hidden">
            <WorkflowCanvas />
          </main>

          {/* Right sidebar — conditionally shown */}
          <RightSidebar />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
