"use client";

import type { ToolCallCard } from "@/types/message";
import { ToolCallCardRow } from "../tool-call-card-row";
import { TerminalBlock } from "./terminal-block";

function isRunCommand(card: ToolCallCard): card is Extract<ToolCallCard, { kind: "run_command" }> {
  return "kind" in card && card.kind === "run_command";
}

export function ToolCallsSection({ toolCalls }: { toolCalls: ToolCallCard[] }) {
  if (!toolCalls.length) return null;
  return (
    <div className="mt-2 flex w-full flex-col gap-1">
      {toolCalls.map((card) =>
        isRunCommand(card) ? (
          <TerminalBlock
            key={card.id}
            command={card.text}
            output={card.output}
            error={card.error}
            status={card.status}
          />
        ) : (
          <ToolCallCardRow card={card} expandable key={card.id} />
        )
      )}
    </div>
  );
}
