"use client";

import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/message";
import { CodeBlock } from "./code-block";
import { DiffBlock } from "./diff-block";
import { ToolCallCardRow } from "./tool-call-card-row";

export function MessageBubble({ msg }: { msg: ChatMessage }) {
  return (
    <div
      className={cn(
        "flex",
        msg.role === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded py-2 leading-normal",
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
  );
}
