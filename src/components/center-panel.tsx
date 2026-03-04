"use client";

import { ChatView } from "@/components/chat-view";
import { EditorView } from "@/components/editor-view";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useApp } from "@/context/app-context";

export function CenterPanel() {
  const { openFiles, openChats } = useApp();
  const hasFiles = openFiles.length > 0;
  const hasChats = openChats.length > 0;

  if (!(hasChats || hasFiles)) {
    return (
      <main
        className="flex h-full flex-col"
        style={{ backgroundColor: "var(--bg-base)" }}
      >
        <div
          className="flex flex-1 items-center justify-center font-mono text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          Select a chat or open a file
        </div>
      </main>
    );
  }

  if (hasChats && !hasFiles) {
    return (
      <main className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
        <ChatView />
      </main>
    );
  }

  if (!hasChats && hasFiles) {
    return (
      <main className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
        <EditorView />
      </main>
    );
  }

  return (
    <main className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
      <ResizablePanelGroup
        className="h-full min-h-0 w-full"
        id="forge-center-panels"
        orientation="horizontal"
      >
        <ResizablePanel className="min-w-0 overflow-hidden" defaultSize={50} minSize={15}>
          <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
            <ChatView />
          </div>
        </ResizablePanel>
        <ResizableHandle
          className="w-px shrink-0"
          style={{ backgroundColor: "var(--border-default)" }}
          withHandle={false}
        />
        <ResizablePanel className="min-w-0 overflow-hidden" defaultSize={50} minSize={15}>
          <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
            <EditorView />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
