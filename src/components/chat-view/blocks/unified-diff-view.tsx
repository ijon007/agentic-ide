"use client";

import { useState } from "react";
import { parseUnifiedDiff } from "@/utils/diff";

const MAX_VISIBLE_LINES = 24;

export function UnifiedDiffView({ unified }: { unified: string }) {
  const lines = parseUnifiedDiff(unified);
  const [expanded, setExpanded] = useState(false);
  const hasMore = lines.length > MAX_VISIBLE_LINES;
  const visibleCount = expanded ? lines.length : Math.min(lines.length, MAX_VISIBLE_LINES);

  return (
    <div className="max-h-64 overflow-auto font-mono text-[11px]">
      {lines.slice(0, visibleCount).map((line, i) => (
        <div
          className="flex"
          key={i}
          style={{
            backgroundColor:
              line.type === "add"
                ? "var(--diff-add)"
                : line.type === "remove"
                  ? "var(--diff-remove)"
                  : undefined,
            color:
              line.type === "add"
                ? "var(--diff-add-text)"
                : line.type === "remove"
                  ? "var(--diff-remove-text)"
                  : "var(--text-code)",
          }}
        >
          <div
            className="w-12 shrink-0 select-none border-r px-2 py-0.5 text-right tabular-nums"
            style={{
              borderColor: "var(--border-subtle)",
              color: "var(--text-muted)",
            }}
          >
            {line.lineNumber ?? ""}
          </div>
          <div className="min-w-0 flex-1 px-2 py-0.5">
            {line.type === "add" && "+"}
            {line.type === "remove" && "-"}
            {line.content}
          </div>
        </div>
      ))}
      {hasMore && !expanded && (
        <button
          type="button"
          className="w-full py-2 text-[10px] hover:bg-(--bg-elevated)"
          style={{ color: "var(--accent)" }}
          onClick={() => setExpanded(true)}
        >
          Show {lines.length - MAX_VISIBLE_LINES} more lines
        </button>
      )}
    </div>
  );
}
