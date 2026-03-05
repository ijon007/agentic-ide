"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parseUnifiedDiff, toSideBySideLines } from "@/utils/diff";
import { useState } from "react";

const MAX_VISIBLE_LINES = 24;

export function DiffBlock({
  filePath,
  oldContent,
  newContent,
  unified,
}: {
  filePath: string;
  oldContent: string;
  newContent: string;
  unified?: string;
}) {
  const [mode, setMode] = useState<"unified" | "sidebyside">("unified");
  const [expanded, setExpanded] = useState(false);
  const lines = unified ? parseUnifiedDiff(unified) : [];
  const sideBySide = toSideBySideLines(lines);
  const hasMore = lines.length > MAX_VISIBLE_LINES;
  const visibleCount = expanded ? lines.length : Math.min(lines.length, MAX_VISIBLE_LINES);
  const visibleSideBySide = expanded
    ? sideBySide
    : sideBySide.slice(0, MAX_VISIBLE_LINES);

  return (
    <div
      className="overflow-hidden rounded"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div
        className="flex items-center justify-between border-b px-3 py-2"
        style={{
          borderColor: "var(--border-subtle)",
          color: "var(--text-secondary)",
        }}
      >
        <span className="font-mono text-[11px]">{filePath}</span>
        <div className="flex gap-1">
          <Button
            className={cn(
              "h-6 px-2 text-(--text-secondary) text-[10px] hover:text-(--text-primary)",
              mode === "unified" && "bg-(--bg-elevated) text-(--text-primary)"
            )}
            onClick={() => setMode("unified")}
            size="xs"
            variant="ghost"
          >
            Unified
          </Button>
          <Button
            className={cn(
              "h-6 px-2 text-(--text-secondary) text-[10px] hover:text-(--text-primary)",
              mode === "sidebyside" &&
                "bg-(--bg-elevated) text-(--text-primary)"
            )}
            onClick={() => setMode("sidebyside")}
            size="xs"
            variant="ghost"
          >
            Side by side
          </Button>
        </div>
      </div>
      <div className="max-h-64 overflow-auto font-mono text-[11px]">
        {mode === "unified" && lines.length > 0 ? (
          <div>
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
        ) : mode === "sidebyside" && sideBySide.length > 0 ? (
          <div className="grid grid-cols-[1fr_1fr]">
            <div
              className="border-r"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <div
                className="border-b px-2 py-1 text-[10px] uppercase"
                style={{ color: "var(--text-muted)" }}
              >
                Old
              </div>
              {visibleSideBySide.map((row, i) => (
                <div
                  className={cn(
                    "flex",
                    row.type === "remove" && "bg-(--diff-remove)"
                  )}
                  key={i}
                  style={{
                    color:
                      row.type === "remove"
                        ? "var(--diff-remove-text)"
                        : "var(--text-code)",
                  }}
                >
                  <div
                    className="w-10 shrink-0 select-none border-r px-1 py-0.5 text-right tabular-nums"
                    style={{
                      borderColor: "var(--border-subtle)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {row.oldLineNum ?? ""}
                  </div>
                  <pre className="min-w-0 flex-1 overflow-x-auto px-2 py-0.5 whitespace-pre">
                    {row.oldContent}
                  </pre>
                </div>
              ))}
            </div>
            <div>
              <div
                className="border-b px-2 py-1 text-[10px] uppercase"
                style={{ color: "var(--text-muted)" }}
              >
                New
              </div>
              {visibleSideBySide.map((row, i) => (
                <div
                  className={cn(
                    "flex",
                    row.type === "add" && "bg-(--diff-add)"
                  )}
                  key={i}
                  style={{
                    color:
                      row.type === "add"
                        ? "var(--diff-add-text)"
                        : "var(--text-code)",
                  }}
                >
                  <div
                    className="w-10 shrink-0 select-none border-r px-1 py-0.5 text-right tabular-nums"
                    style={{
                      borderColor: "var(--border-subtle)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {row.newLineNum ?? ""}
                  </div>
                  <pre className="min-w-0 flex-1 overflow-x-auto px-2 py-0.5 whitespace-pre">
                    {row.newContent}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 divide-x divide-(--border-subtle)">
            <div className="p-3">
              <div
                className="mb-1 text-[10px] uppercase"
                style={{ color: "var(--text-muted)" }}
              >
                Old
              </div>
              <pre
                className="wrap-break-words whitespace-pre-wrap"
                style={{ color: "var(--diff-remove-text)" }}
              >
                {oldContent}
              </pre>
            </div>
            <div className="p-3">
              <div
                className="mb-1 text-[10px] uppercase"
                style={{ color: "var(--text-muted)" }}
              >
                New
              </div>
              <pre
                className="wrap-break-words whitespace-pre-wrap"
                style={{ color: "var(--diff-add-text)" }}
              >
                {newContent}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
