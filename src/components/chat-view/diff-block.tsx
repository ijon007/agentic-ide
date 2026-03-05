"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parseUnifiedDiff } from "@/utils/diff";
import { useState } from "react";

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
  const lines = unified ? parseUnifiedDiff(unified) : [];

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
      <div className="max-h-48 overflow-auto font-mono text-[11px]">
        {mode === "unified" && lines.length > 0 ? (
          <div>
            {lines.map((line, i) => (
              <div
                className="px-3 py-0.5"
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
                {line.type === "add" && "+"}
                {line.type === "remove" && "-"}
                {line.content}
              </div>
            ))}
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
      <div
        className="flex gap-2 border-t px-3 py-2"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <Button
          className="h-6 bg-(--success) text-white text-xs hover:bg-(--success)/90"
          size="sm"
        >
          Accept
        </Button>
        <Button
          className="h-6 border-(--border-default) text-(--text-primary) text-xs hover:bg-(--bg-elevated)"
          size="sm"
          variant="outline"
        >
          Reject
        </Button>
      </div>
    </div>
  );
}
