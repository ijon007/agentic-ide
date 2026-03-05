"use client";

import {
  ChatCircleIcon,
  FileIcon,
  FolderIcon,
} from "@phosphor-icons/react";
import { createPortal } from "react-dom";
import React from "react";
import { cn } from "@/lib/utils";

export type AtMentionItem =
  | { kind: "file"; projectId: string; path: string; projectName?: string }
  | { kind: "chat"; chatId: string; title: string; projectName?: string }
  | { kind: "project"; projectId: string; name: string };

export function AtMentionDropdown({
  items,
  highlightedIndex,
  onSelect,
  onHighlightChange,
  dropdownRef,
  position,
}: {
  items: AtMentionItem[];
  highlightedIndex: number;
  onSelect: (item: AtMentionItem) => void;
  onHighlightChange: (index: number) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  position: { bottom: number; left: number; width: number } | null;
}) {
  if (!position || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={dropdownRef}
      className="z-100 max-h-48 overflow-y-auto rounded-lg border border-(--border-subtle) bg-(--bg-overlay) p-1 shadow-lg"
      style={{
        position: "fixed",
        bottom: position.bottom + 4,
        left: position.left,
        width: Math.max(position.width, 280),
        maxHeight: "12rem",
      }}
    >
      {items.length === 0 ? (
        <div className="px-2 py-2 text-xs text-muted-foreground">
          No matches
        </div>
      ) : (
        items.map((item, i) => (
          <button
            key={
              item.kind === "file"
                ? `file-${item.projectId}-${item.path}`
                : item.kind === "chat"
                  ? `chat-${item.chatId}`
                  : `project-${item.projectId}`
            }
            type="button"
            className={cn(
              "flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors",
              i === highlightedIndex
                ? "bg-(--bg-elevated) text-foreground"
                : "text-muted-foreground hover:bg-(--bg-elevated) hover:text-foreground"
            )}
            onMouseEnter={() => onHighlightChange(i)}
            onClick={() => onSelect(item)}
          >
            {item.kind === "file" ? (
              <>
                <FileIcon className="size-3.5 shrink-0" />
                <span className="min-w-0 truncate">{item.path}</span>
                {item.projectName && (
                  <span className="ml-1 shrink-0 truncate text-muted-foreground">
                    ({item.projectName})
                  </span>
                )}
              </>
            ) : item.kind === "chat" ? (
              <>
                <ChatCircleIcon className="size-3.5 shrink-0" />
                <span className="min-w-0 truncate">{item.title}</span>
                {item.projectName && (
                  <span className="ml-1 shrink-0 truncate text-muted-foreground">
                    ({item.projectName})
                  </span>
                )}
              </>
            ) : (
              <>
                <FolderIcon className="size-3.5 shrink-0" />
                <span className="min-w-0 truncate">{item.name}</span>
              </>
            )}
          </button>
        ))
      )}
    </div>,
    document.body
  );
}
