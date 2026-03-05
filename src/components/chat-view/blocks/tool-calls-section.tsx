"use client";

import type { ToolCallCard } from "@/types/message";
import { ToolCallCardRow } from "../tool-call-card-row";

export function ToolCallsSection({ toolCalls }: { toolCalls: ToolCallCard[] }) {
  if (!toolCalls.length) return null;
  return (
    <div className="mt-2 flex w-full flex-col gap-1">
      {toolCalls.map((card) => (
        <ToolCallCardRow card={card} expandable key={card.id} />
      ))}
    </div>
  );
}
