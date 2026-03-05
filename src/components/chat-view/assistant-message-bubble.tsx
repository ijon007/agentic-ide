"use client";

import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/message";
import { CodeBlock } from "./code-block";
import { DiffBlock } from "./diff-block";
import { MessageContent } from "./blocks/message-content";
import { PlanningBlock } from "./blocks/planning-block";
import { SubagentBlock } from "./blocks/subagent-block";
import { ThinkingBlock } from "./blocks/thinking-block";
import { ToolCallsSection } from "./blocks/tool-calls-section";

export function AssistantMessageBubble({ msg }: { msg: ChatMessage }) {
  return (
    <div className="flex justify-start">
      <div
        className={cn(
          "w-full max-w-full rounded-md py-2 pl-2 leading-normal",
          "flex flex-col gap-2"
        )}
        style={{ color: "var(--text-primary)" }}
      >
        {msg.thinking != null && msg.thinking !== "" && (
          <ThinkingBlock content={msg.thinking} />
        )}
        {msg.planning && <PlanningBlock />}
        <MessageContent content={msg.content} markdown />
        {msg.toolCalls && msg.toolCalls.length > 0 && (
          <ToolCallsSection toolCalls={msg.toolCalls} />
        )}
        {msg.codeBlocks?.map((block, i) => (
          <div key={i} className="w-full">
            <CodeBlock code={block.code} language={block.language} />
          </div>
        ))}
        {msg.diff && (
          <DiffBlock
            filePath={msg.diff.filePath}
            newContent={msg.diff.newContent}
            oldContent={msg.diff.oldContent}
            unified={msg.diff.unified}
          />
        )}
        {msg.subagent && <SubagentBlock block={msg.subagent} />}
      </div>
    </div>
  );
}
