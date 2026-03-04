"use client";

import {
  CheckCircleIcon,
  CheckIcon,
  CopyIcon,
  GearIcon,
  PaperPlaneTiltIcon,
  StopIcon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_MESSAGES } from "@/constants/messages";
import { MOCK_MODELS } from "@/constants/models";
import { useApp } from "@/context/app-context";
import { cn } from "@/lib/utils";
import type { ToolCallCard } from "@/types/message";
import { parseUnifiedDiff } from "@/utils/diff";

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
          className="size-1.5 animate-pulse rounded-full"
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
          className="truncate font-mono"
          style={{ color: isSuccess ? "var(--success)" : "var(--accent)" }}
        >
          {card.path ?? card.text}
        </span>
      )}
    </div>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="relative overflow-hidden rounded"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <Button
        className="absolute top-1 right-1 text-(--text-muted) hover:bg-(--bg-elevated) hover:text-(--text-primary)"
        onClick={handleCopy}
        size="icon-xs"
        variant="ghost"
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
      className="overflow-hidden rounded"
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
            className={cn(
              "h-6 px-2 text-(--text-secondary) text-[10px] hover:text-(--text-primary)",
              mode === "unified" && "bg-(--bg-elevated) text-(--text-primary)"
            )}
            onClick={() => setMode("unified")}
            size="xs"
            variant="ghost"
          >
            Unified
          </Button>
          <Button
            className={cn(
              "h-6 px-2 text-(--text-secondary) text-[10px] hover:text-(--text-primary)",
              mode === "sidebyside" &&
                "bg-(--bg-elevated) text-(--text-primary)"
            )}
            onClick={() => setMode("sidebyside")}
            size="xs"
            variant="ghost"
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
                className="px-3 py-0.5"
                key={i}
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
          <div className="grid grid-cols-2 divide-x divide-(--border-subtle)">
            <div className="p-3">
              <div
                className="mb-1 text-[10px] uppercase"
                style={{ color: "var(--text-muted)" }}
              >
                Old
              </div>
              <pre
                className="wrap-break-words whitespace-pre-wrap"
                style={{ color: "var(--diff-remove-text)" }}
              >
                {oldContent}
              </pre>
            </div>
            <div className="p-3">
              <div
                className="mb-1 text-[10px] uppercase"
                style={{ color: "var(--text-muted)" }}
              >
                New
              </div>
              <pre
                className="wrap-break-words whitespace-pre-wrap"
                style={{ color: "var(--diff-add-text)" }}
              >
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
        <Button
          className="h-6 bg-(--success) text-white text-xs hover:bg-(--success)/90"
          size="sm"
        >
          Accept
        </Button>
        <Button
          className="h-6 border-(--border-default) text-(--text-primary) text-xs hover:bg-(--bg-elevated)"
          size="sm"
          variant="outline"
        >
          Reject
        </Button>
      </div>
    </div>
  );
}

export function ChatView() {
  const { selectedModel } = useApp();
  const [input, setInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const model =
    MOCK_MODELS.find((m) => m.id === selectedModel) ?? MOCK_MODELS[0];

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) {
      return;
    }
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, []);

  return (
    <div
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
      data-panel="chat"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-4 p-4">
          {MOCK_MESSAGES.map((msg) => (
            <div
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
              key={msg.id}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-2.5 text-[13px] leading-normal",
                  msg.role === "user" &&
                    "border border-(--border-subtle) border-l-accent border-l-2 bg-(--bg-elevated)"
                )}
                style={{ color: "var(--text-primary)" }}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1">
                    {msg.toolCalls.map((card) => (
                      <ToolCallCardRow card={card} key={card.id} />
                    ))}
                  </div>
                )}
                {msg.codeBlocks?.map((block, i) => (
                  <div className="mt-2" key={i}>
                    <CodeBlock code={block.code} language={block.language} />
                  </div>
                ))}
                {msg.diff && (
                  <div className="mt-2">
                    <DiffBlock
                      filePath={msg.diff.filePath}
                      newContent={msg.diff.newContent}
                      oldContent={msg.diff.oldContent}
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
        <div
          className="flex items-center justify-between font-mono text-[10px]"
          style={{ color: "var(--text-muted)" }}
        >
          <span>{model.name}</span>
          <span>~0 tokens</span>
        </div>
        <div className="flex gap-2">
          <Textarea
            className="max-h-[120px] min-h-[36px] resize-none border-border bg-(--bg-elevated) px-3 py-2 text-[13px] focus-visible:ring-1 focus-visible:ring-accent"
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            ref={textareaRef}
            rows={1}
            value={input}
          />
          {isRunning ? (
            <Button
              className="shrink-0 bg-(--error) hover:bg-(--error)/90"
              onClick={() => setIsRunning(false)}
              size="icon"
            >
              <StopIcon className="size-4" />
            </Button>
          ) : (
            <Button
              className="shrink-0 bg-accent hover:bg-(--accent-hover)"
              onClick={() => setIsRunning(true)}
              size="icon"
            >
              <PaperPlaneTiltIcon className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
