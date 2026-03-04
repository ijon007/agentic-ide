"use client";

import { useApp } from "@/context/app-context";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ChatView } from "@/components/chat-view";
import { EditorView } from "@/components/editor-view";

export function CenterPanel() {
  const { openFiles, openChats } = useApp();
  const hasFiles = openFiles.length > 0;
  const hasChats = openChats.length > 0;

  if (!hasChats && !hasFiles) {
    return (
      <main className="flex h-full flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
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
      <main className="flex h-full flex-col">
        <ChatView />
      </main>
    );
  }

  if (!hasChats && hasFiles) {
    return (
      <main className="flex h-full flex-col">
        <EditorView />
      </main>
    );
  }

  return (
    <main className="flex h-full min-h-0 min-w-0 flex-col">
      <ResizablePanelGroup
        orientation="horizontal"
        className="h-full min-h-0 w-full"
        id="forge-center-panels"
      >
        <ResizablePanel defaultSize={50} minSize={15} className="min-w-0">
          <div className="flex h-full min-h-0 flex-col">
            <ChatView />
          </div>
        </ResizablePanel>
        <ResizableHandle
          withHandle={false}
          className="shrink-0 w-px"
          style={{ backgroundColor: "var(--border-default)" }}
        />
        <ResizablePanel defaultSize={50} minSize={15} className="min-w-0">
          <div className="flex h-full min-h-0 flex-col">
            <EditorView />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
