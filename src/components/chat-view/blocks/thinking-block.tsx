"use client";

import { CaretRightIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MessageContent } from "./message-content";
import { cn } from "@/lib/utils";

export function ThinkingBlock({ content }: { content: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full">
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center gap-1.5 py-0.5 text-left text-sm transition-colors hover:opacity-90 cursor-pointer",
          "text-(--text-muted)"
        )}
      >
        <CaretRightIcon
          className={cn("size-3 transition-transform", open && "rotate-90")}
        />
        <span
          className="inline-block bg-clip-text text-transparent bg-size-[200%_100%]"
          style={{
            backgroundImage:
              "linear-gradient(90deg, var(--text-muted) 0%, var(--text-secondary) 50%, var(--text-muted) 100%)",
            animation: "text-shimmer 2s ease-in-out infinite",
          }}
        >
          Thinking
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div
          className="mt-1 pl-5 text-sm prose prose-sm dark:prose-invert max-w-none opacity-50"
        >
          <div
            className="[&_pre]:rounded [&_pre]:bg-(--bg-surface) [&_pre]:p-3 [&_pre]:text-xs [&_code]:rounded [&_code]:bg-(--bg-surface) [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
            style={{ color: "var(--text-secondary)" }}
          >
            <MessageContent content={content} markdown />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
