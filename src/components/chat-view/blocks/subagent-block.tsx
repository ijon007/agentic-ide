"use client";

import { CaretDownIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { SubagentBlock as SubagentBlockType } from "@/types/message";
import { UserMessageBubble } from "../user-message-bubble";
import { AssistantMessageBubble } from "../assistant-message-bubble";

export function SubagentBlock({ block }: { block: SubagentBlockType }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      className="overflow-hidden rounded"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <button
        type="button"
        className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-(--bg-elevated)"
        onClick={() => setExpanded((e) => !e)}
      >
        {expanded ? (
          <CaretDownIcon className="size-3.5 shrink-0" style={{ color: "var(--text-muted)" }} />
        ) : (
          <CaretRightIcon className="size-3.5 shrink-0" style={{ color: "var(--text-muted)" }} />
        )}
        <span className="font-medium text-xs" style={{ color: "var(--text-primary)" }}>
          {block.name ?? "Subagent"}
        </span>
        <StatusBadge status={block.status} />
        {block.summary && (
          <span className="truncate text-[11px]" style={{ color: "var(--text-muted)" }}>
            {block.summary}
          </span>
        )}
      </button>
      {expanded && block.messages.length > 0 && (
        <div
          className="border-t px-3 py-2"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <div className="flex flex-col gap-4">
            {block.messages.map((m) =>
              m.role === "user" ? (
                <UserMessageBubble key={m.id} msg={m} />
              ) : (
                <AssistantMessageBubble key={m.id} msg={m} />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: SubagentBlockType["status"];
}) {
  const styles: Record<SubagentBlockType["status"], string> = {
    pending: "var(--text-muted)",
    running: "var(--accent)",
    done: "var(--success)",
    error: "var(--error)",
  };
  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 text-[10px] font-medium uppercase",
        status === "running" && "animate-pulse"
      )}
      style={{
        backgroundColor: `${styles[status]}20`,
        color: styles[status],
      }}
    >
      {status}
    </span>
  );
}
