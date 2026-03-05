"use client";

import type { ToolCallCard } from "@/types/message";
import { ToolCallCardRow } from "../tool-call-card-row";
import { TerminalBlock } from "./terminal-block";
import { MCPBlock } from "./mcp-block";

function isRunCommand(card: ToolCallCard): card is Extract<ToolCallCard, { kind: "run_command" }> {
  return "kind" in card && card.kind === "run_command";
}

function isMCPCall(card: ToolCallCard): card is Extract<ToolCallCard, { kind: "mcp_call" }> {
  return "kind" in card && card.kind === "mcp_call";
}

function renderToolCall(card: ToolCallCard) {
  if (isRunCommand(card)) {
    return (
      <TerminalBlock
        key={card.id}
        command={card.text}
        output={card.output}
        error={card.error}
        status={card.status}
      />
    );
  }
  if (isMCPCall(card)) {
    return (
      <MCPBlock
        key={card.id}
        server={card.server}
        toolName={card.toolName}
        arguments={card.arguments}
        result={card.result}
        error={card.error}
        status={card.status}
      />
    );
  }
  return <ToolCallCardRow card={card} expandable key={card.id} />;
}

export function ToolCallsSection({ toolCalls }: { toolCalls: ToolCallCard[] }) {
  if (!toolCalls.length) return null;
  return (
    <div className="mt-2 flex w-full flex-col gap-1">
      {toolCalls.map(renderToolCall)}
    </div>
  );
}
