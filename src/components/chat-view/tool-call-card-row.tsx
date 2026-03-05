"use client";

import { CheckCircleIcon, GearIcon } from "@phosphor-icons/react";
import type { ToolCallCard } from "@/types/message";

export function ToolCallCardRow({ card }: { card: ToolCallCard }) {
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
