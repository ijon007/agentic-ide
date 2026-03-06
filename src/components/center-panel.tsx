"use client";

import type { ReactNode } from "react";
import { ChatPane } from "@/components/chat-view/chat-pane";
import { ChatView } from "@/components/chat-view";
import { EditorView } from "@/components/editor-view";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useApp } from "@/context/app-context";

function ChatGrid({ chatIds }: { chatIds: string[] }) {
  const n = chatIds.length;
  if (n === 0) return null;
  if (n === 1) {
    return (
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <ChatPane chatId={chatIds[0]} />
      </div>
    );
  }
  if (n === 2) {
    return (
      <ResizablePanelGroup
        className="h-full min-h-0 w-full"
        id="chat-grid-2"
        orientation="horizontal"
      >
        <ResizablePanel defaultSize={50} minSize={15} className="min-w-0 overflow-hidden">
          <ChatPane chatId={chatIds[0]} />
        </ResizablePanel>
        <ResizableHandle
          className="w-px shrink-0"
          style={{ backgroundColor: "var(--border-default)" }}
          withHandle={false}
        />
        <ResizablePanel defaultSize={50} minSize={15} className="min-w-0 overflow-hidden">
          <ChatPane chatId={chatIds[1]} />
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }
  if (n === 3) {
    return (
      <ResizablePanelGroup
        className="h-full min-h-0 w-full"
        id="chat-grid-3"
        orientation="horizontal"
      >
        <ResizablePanel defaultSize={33.33} minSize={15} className="min-w-0 overflow-hidden">
          <ChatPane chatId={chatIds[0]} />
        </ResizablePanel>
        <ResizableHandle
          className="w-px shrink-0"
          style={{ backgroundColor: "var(--border-default)" }}
          withHandle={false}
        />
        <ResizablePanel defaultSize={33.33} minSize={15} className="min-w-0 overflow-hidden">
          <ChatPane chatId={chatIds[1]} />
        </ResizablePanel>
        <ResizableHandle
          className="w-px shrink-0"
          style={{ backgroundColor: "var(--border-default)" }}
          withHandle={false}
        />
        <ResizablePanel defaultSize={33.34} minSize={15} className="min-w-0 overflow-hidden">
          <ChatPane chatId={chatIds[2]} />
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }
  const cols = Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);
  const rowSize = 100 / rows;
  const handleStyle = { backgroundColor: "var(--border-default)" };
  const verticalChildren: ReactNode[] = [];
  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    if (rowIndex > 0) {
      verticalChildren.push(
        <ResizableHandle
          key={`v-${rowIndex}`}
          className="h-px w-full shrink-0"
          style={handleStyle}
          withHandle={false}
        />
      );
    }
    const start = rowIndex * cols;
    const rowChatIds = chatIds.slice(start, start + cols);
    const colSize = 100 / rowChatIds.length;
    const rowPanels: ReactNode[] = [];
    rowChatIds.forEach((id, colIndex) => {
      if (colIndex > 0) {
        rowPanels.push(
          <ResizableHandle
            key={`h-${rowIndex}-${colIndex}`}
            className="w-px shrink-0"
            style={handleStyle}
            withHandle={false}
          />
        );
      }
      rowPanels.push(
        <ResizablePanel
          key={id}
          defaultSize={colSize}
          minSize={15}
          className="min-w-0 overflow-hidden"
        >
          <ChatPane chatId={id} />
        </ResizablePanel>
      );
    });
    verticalChildren.push(
      <ResizablePanel
        key={rowIndex}
        defaultSize={rowSize}
        minSize={10}
        className="min-h-0 overflow-hidden"
      >
        <ResizablePanelGroup
          className="h-full min-h-0 w-full"
          id={`chat-grid-row-${rowIndex}`}
          orientation="horizontal"
        >
          {rowPanels}
        </ResizablePanelGroup>
      </ResizablePanel>
    );
  }
  return (
    <ResizablePanelGroup
      className="h-full min-h-0 w-full"
      id="chat-grid-multi"
      orientation="vertical"
    >
      {verticalChildren}
    </ResizablePanelGroup>
  );
}

export function CenterPanel() {
  const { openFiles, openChats, codePanelVisible } = useApp();
  const hasFiles = openFiles.length > 0;
  const hasChats = openChats.length > 0;
  const showCodePanel = codePanelVisible && hasFiles;

  if (!(hasChats || hasFiles)) {
    return (
      <main className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
        <ChatView />
      </main>
    );
  }

  if (hasChats && !showCodePanel) {
    return (
      <main className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
        <ChatGrid chatIds={openChats} />
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

  if (showCodePanel) {
    return (
      <main className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
        <ResizablePanelGroup
          className="h-full min-h-0 w-full"
          id="forge-center-panels"
          orientation="horizontal"
        >
          <ResizablePanel className="min-w-0 overflow-hidden" defaultSize={50} minSize={15}>
            <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
              <ChatGrid chatIds={openChats} />
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

  return (
    <main className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
      <ChatView />
    </main>
  );
}
