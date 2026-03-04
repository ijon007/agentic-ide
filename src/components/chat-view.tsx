"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApp } from "@/context/app-context";
import { MOCK_MESSAGES } from "@/constants/messages";
import { MOCK_MODELS } from "@/constants/models";
import type { ToolCallCard } from "@/types/message";
import {
  PaperPlaneTiltIcon,
  StopIcon,
  CopyIcon,
  CheckIcon,
  GearIcon,
  CheckCircleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { parseUnifiedDiff } from "@/utils/diff";
import { MOCK_CHATS } from "@/constants/chats";

function ToolCallCardRow({ card }: { card: ToolCallCard }) {
  const isRunning = card.status === "running";
  const isSuccess = card.status === "wrote";

  return (
    <div
      className="flex h-7 items-center gap-2 rounded px-3 text-[11px]"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      {isRunning ? (
        <span
          className="animate-pulse size-1.5 rounded-full"
          style={{ backgroundColor: "var(--accent)" }}
        />
      ) : isSuccess ? (
        <CheckCircleIcon
          className="size-3.5 shrink-0"
          style={{ color: "var(--success)" }}
        />
      ) : (
        <GearIcon
          className="size-3.5 shrink-0"
          style={{ color: "var(--text-muted)" }}
        />
      )}
      <span style={{ color: "var(--text-muted)" }}>{card.verb}</span>
      {(card.path ?? card.text) && (
        <span
          className="font-mono truncate"
          style={{ color: isSuccess ? "var(--success)" : "var(--accent)" }}
        >
          {card.path ?? card.text}
        </span>
      )}
    </div>
  );
}

function CodeBlock({
  language,
  code,
}: {
  language: string;
  code: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="relative rounded overflow-hidden"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <Button
        variant="ghost"
        size="icon-xs"
        className="absolute right-1 top-1 text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
        onClick={handleCopy}
      >
        {copied ? (
          <CheckIcon className="size-3" />
        ) : (
          <CopyIcon className="size-3" />
        )}
      </Button>
      <pre
        className="overflow-x-auto p-4 pr-10 font-mono text-xs"
        style={{ color: "var(--text-code)" }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

function DiffBlock({
  filePath,
  oldContent,
  newContent,
  unified,
}: {
  filePath: string;
  oldContent: string;
  newContent: string;
  unified?: string;
}) {
  const [mode, setMode] = useState<"unified" | "sidebyside">("unified");
  const lines = unified ? parseUnifiedDiff(unified) : [];

  return (
    <div
      className="rounded overflow-hidden"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div
        className="flex items-center justify-between border-b px-3 py-2"
        style={{
          borderColor: "var(--border-subtle)",
          color: "var(--text-secondary)",
        }}
      >
        <span className="font-mono text-[11px]">{filePath}</span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="xs"
            className={cn(
              "h-6 px-2 text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
              mode === "unified" && "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
            )}
            onClick={() => setMode("unified")}
          >
            Unified
          </Button>
          <Button
            variant="ghost"
            size="xs"
            className={cn(
              "h-6 px-2 text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
              mode === "sidebyside" && "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
            )}
            onClick={() => setMode("sidebyside")}
          >
            Side by side
          </Button>
        </div>
      </div>
      <div className="max-h-48 overflow-auto font-mono text-[11px]">
        {mode === "unified" && lines.length > 0 ? (
          <div>
            {lines.map((line, i) => (
              <div
                key={i}
                className="px-3 py-0.5"
                style={{
                  backgroundColor:
                    line.type === "add"
                      ? "var(--diff-add)"
                      : line.type === "remove"
                        ? "var(--diff-remove)"
                        : undefined,
                  color:
                    line.type === "add"
                      ? "var(--diff-add-text)"
                      : line.type === "remove"
                        ? "var(--diff-remove-text)"
                        : "var(--text-code)",
                }}
              >
                {line.type === "add" && "+"}
                {line.type === "remove" && "-"}
                {line.content}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 divide-x divide-[var(--border-subtle)]">
            <div className="p-3">
              <div className="mb-1 text-[10px] uppercase" style={{ color: "var(--text-muted)" }}>
                Old
              </div>
              <pre className="whitespace-pre-wrap break-words" style={{ color: "var(--diff-remove-text)" }}>
                {oldContent}
              </pre>
            </div>
            <div className="p-3">
              <div className="mb-1 text-[10px] uppercase" style={{ color: "var(--text-muted)" }}>
                New
              </div>
              <pre className="whitespace-pre-wrap break-words" style={{ color: "var(--diff-add-text)" }}>
                {newContent}
              </pre>
            </div>
          </div>
        )}
      </div>
      <div
        className="flex gap-2 border-t px-3 py-2"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <Button size="sm" className="h-6 text-xs bg-[var(--success)] text-white hover:bg-[var(--success)]/90">
          Accept
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-6 text-xs border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
        >
          Reject
        </Button>
      </div>
    </div>
  );
}

function getChatTitle(id: string): string {
  if (id.startsWith("new-")) return "New Chat";
  const chat = MOCK_CHATS.find((c) => c.id === id);
  return chat?.title ?? "Chat";
}

export function ChatView() {
  const {
    selectedModel,
    openChats,
    activeChat,
    setActiveChat,
    closeChat,
  } = useApp();
  const [input, setInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const model = MOCK_MODELS.find((m) => m.id === selectedModel) ?? MOCK_MODELS[0];

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  const handleCloseChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    closeChat(id);
  };

  return (
    <div
      className="flex flex-1 flex-col"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      {openChats.length > 0 && (
        <div
          className="flex h-9 shrink-0 items-center border-b"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          {openChats.map((id) => {
            const isActive = activeChat === id;
            return (
              <div
                key={id}
                role="tab"
                tabIndex={0}
                className={cn(
                  "group flex cursor-pointer items-center gap-2 border-r px-3 py-1.5 text-xs transition-colors",
                  isActive && "border-b-2 border-[var(--accent)]"
                )}
                style={{
                  borderColor: "var(--border-subtle)",
                  borderBottomColor: isActive ? "var(--accent)" : "transparent",
                  color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                  backgroundColor: isActive ? "var(--bg-base)" : "transparent",
                }}
                onClick={() => setActiveChat(id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveChat(id);
                  }
                }}
              >
                <span className="max-w-[140px] truncate">{getChatTitle(id)}</span>
                <button
                  type="button"
                  className="opacity-0 hover:opacity-100 group-hover:opacity-70"
                  onClick={(e) => handleCloseChat(e, id)}
                  title="Close chat (Ctrl+Shift+L)"
                >
                  <XIcon className="size-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-4 p-4">
          {MOCK_MESSAGES.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-2.5 text-[13px] leading-[1.5]",
                  msg.role === "user" &&
                    "border border-[var(--border-subtle)] border-l-2 border-l-[var(--accent)] bg-[var(--bg-elevated)]"
                )}
                style={{ color: "var(--text-primary)" }}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1">
                    {msg.toolCalls.map((card) => (
                      <ToolCallCardRow key={card.id} card={card} />
                    ))}
                  </div>
                )}
                {msg.codeBlocks?.map((block, i) => (
                  <div key={i} className="mt-2">
                    <CodeBlock language={block.language} code={block.code} />
                  </div>
                ))}
                {msg.diff && (
                  <div className="mt-2">
                    <DiffBlock
                      filePath={msg.diff.filePath}
                      oldContent={msg.diff.oldContent}
                      newContent={msg.diff.newContent}
                      unified={msg.diff.unified}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div
        className="flex flex-col gap-2 border-t p-3"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <div className="flex items-center justify-between text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
          <span>{model.name}</span>
          <span>~0 tokens</span>
        </div>
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[36px] max-h-[120px] resize-none border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-2 text-[13px] focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
            rows={1}
          />
          {isRunning ? (
            <Button
              size="icon"
              className="shrink-0 bg-[var(--error)] hover:bg-[var(--error)]/90"
              onClick={() => setIsRunning(false)}
            >
              <StopIcon className="size-4" />
            </Button>
          ) : (
            <Button
              size="icon"
              className="shrink-0 bg-[var(--accent)] hover:bg-[var(--accent-hover)]"
              onClick={() => setIsRunning(true)}
            >
              <PaperPlaneTiltIcon className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
