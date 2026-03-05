"use client";

import { CaretDownIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { SubagentBlock as SubagentBlockType } from "@/types/message";
import { UserMessageBubble } from "../user-message-bubble";
import { AssistantMessageBubble } from "../assistant-message-bubble";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function SubagentBlock({ block }: { block: SubagentBlockType }) {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="overflow-hidden rounded w-full"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <CollapsibleTrigger
        className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-(--bg-elevated) cursor-pointer"
      >
        {open ? (
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
      </CollapsibleTrigger>
      {block.messages.length > 0 && (
        <CollapsibleContent
          className="border-t px-3 py-2 w-full"
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
        </CollapsibleContent>
      )}
    </Collapsible>
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
