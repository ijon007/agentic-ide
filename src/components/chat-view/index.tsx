"use client";

import { MOCK_MESSAGES } from "@/constants/messages";
import { MOCK_MODELS } from "@/constants/models";
import { useApp } from "@/context/app-context";
import type { Attachment } from "@/types/attachment";
import type { ChatMessage, DiffBlock } from "@/types/message";
import { useEffect, useMemo, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput } from "./chat-input";
import { MessageBubble } from "./message-bubble";
import { FilesChangedRibbon } from "./files-changed-ribbon";

function collectChangedFiles(msgs: ChatMessage[]): DiffBlock[] {
  const files: DiffBlock[] = [];
  function walk(m: ChatMessage) {
    if (m.diff) files.push(m.diff);
    if (m.filesChanged?.files) files.push(...m.filesChanged.files);
    if (m.subagent?.messages) m.subagent.messages.forEach(walk);
  }
  msgs.forEach(walk);
  return files;
}

export function ChatView() {
  const { activeChat, selectedModel } = useApp();
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const model =
    MOCK_MODELS.find((m) => m.id === selectedModel) ?? MOCK_MODELS[0];
  const messages = activeChat === "c1" ? MOCK_MESSAGES : [];
  const isEmpty = messages.length === 0;
  const changedFiles = useMemo(() => collectChangedFiles(messages), [messages]);

  const handleSend = (text: string, atts: Attachment[]) => {
    setInput("");
    setAttachments([]);
    setIsRunning(true);
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) {
      return;
    }
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, []);

  if (isEmpty) {
    return (
      <div
        className="flex min-h-0 w-full flex-1 flex-col items-center justify-center overflow-hidden px-4 py-8"
        data-panel="chat"
        style={{ backgroundColor: "var(--bg-base)" }}
      >
        <div className="flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-5xl font-bold tracking-tight text-foreground font-mono">
              Start building
            </h1>
            <span className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
              NOX Agent
            </span>
          </div>
          <ChatInput
            attachments={attachments}
            compact={false}
            input={input}
            setInput={setInput}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            textareaRef={textareaRef}
            model={model}
            onAddAttachment={(a) => setAttachments((prev) => [...prev, a])}
            onRemoveAttachment={(id) =>
              setAttachments((prev) => prev.filter((x) => x.id !== id))
            }
            onSend={handleSend}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
      data-panel="chat"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <ScrollArea className="min-h-0 flex-1" hideScrollbar={false}>
        <div className="flex w-full justify-center py-4 pb-0">
          <div className="flex w-full max-w-4xl flex-col gap-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="flex shrink-0 flex-col w-full" style={{ backgroundColor: "var(--bg-base)" }}>
        {changedFiles.length > 0 && (
          <FilesChangedRibbon
            fileCount={changedFiles.length}
            onAcceptAll={() => {}}
            onRejectAll={() => {}}
          />
        )}
        <div className="flex w-full justify-center px-4 py-3 pt-1">
          <ChatInput
            attachments={attachments}
            compact
            input={input}
            setInput={setInput}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            textareaRef={textareaRef}
            model={model}
            onAddAttachment={(a) => setAttachments((prev) => [...prev, a])}
            onRemoveAttachment={(id) =>
              setAttachments((prev) => prev.filter((x) => x.id !== id))
            }
            onSend={handleSend}
          />
        </div>
      </div>
    </div>
  );
}
