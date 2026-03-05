"use client";

import React from "react";
import { cn } from "@/lib/utils";

const PLACEHOLDER = "Plan, @ for context, / for commands";

export function ContentEditableArea({
  contentEditableRef,
  textareaRef,
  compact,
  isContentEmpty,
  onInput,
  onKeyDown,
  onPaste,
}: {
  contentEditableRef: React.RefObject<HTMLDivElement | null>;
  textareaRef: React.RefObject<HTMLTextAreaElement | HTMLDivElement | null>;
  compact?: boolean;
  isContentEmpty: boolean;
  onInput: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onPaste: (e: React.ClipboardEvent) => void;
}) {
  return (
    <div className="relative min-h-0 flex-1 pt-3 pb-1">
      <div
        ref={(el) => {
          (contentEditableRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          if (textareaRef && el)
            (textareaRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        contentEditable
        className={cn(
          "min-h-9 w-full flex-1 resize-none bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground",
          compact ? "" : ""
        )}
        data-placeholder={PLACEHOLDER}
        onInput={onInput}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        suppressContentEditableWarning
      />
      {isContentEmpty && (
        <span
          className={cn(
            "pointer-events-none absolute left-3 text-sm text-muted-foreground top-3"
          )}
          aria-hidden
        >
          {PLACEHOLDER}
        </span>
      )}
    </div>
  );
}
