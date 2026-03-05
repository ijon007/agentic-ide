"use client";

import { useState, useEffect } from "react";
import { parseUnifiedDiff, getLangFromPath } from "@/utils/diff";
import { codeToHtml } from "shiki";

const MAX_VISIBLE_LINES = 24;

function isMetaLine(line: { content: string; hunkStart?: unknown }): boolean {
  if (line.hunkStart) return true;
  const c = line.content;
  return c.startsWith("--- ") || c.startsWith("+++ ");
}

function extractCodeHtml(fullHtml: string): string {
  const m = fullHtml.match(/<code[^>]*>([\s\S]*?)<\/code>/);
  return m ? m[1] : fullHtml;
}

export function UnifiedDiffView({
  unified,
  filePath = "",
}: {
  unified: string;
  filePath?: string;
}) {
  const lines = parseUnifiedDiff(unified);
  const visibleLines = lines.filter((l) => !isMetaLine(l));
  const [expanded, setExpanded] = useState(false);
  const hasMore = visibleLines.length > MAX_VISIBLE_LINES;
  const visibleCount = expanded ? visibleLines.length : Math.min(visibleLines.length, MAX_VISIBLE_LINES);
  const [lineHtmls, setLineHtmls] = useState<string[]>([]);
  const lang = getLangFromPath(filePath);

  useEffect(() => {
    let cancelled = false;
    const toHighlight = visibleLines.slice(0, visibleCount);
    Promise.all(
      toHighlight.map((line) =>
        codeToHtml(line.content || " ", { lang, theme: "dark-plus" }).then(extractCodeHtml)
      )
    ).then((htmls) => {
      if (!cancelled) setLineHtmls(htmls);
    });
    return () => {
      cancelled = true;
    };
  }, [unified, visibleCount, lang]);

  return (
    <div className="max-h-64 overflow-auto font-mono text-[11px]">
      {visibleLines.slice(0, visibleCount).map((line, i) => (
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
          <div className="min-w-0 flex-1 px-2 py-0.5 [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-0">
            {lineHtmls[i] !== undefined ? (
              <code dangerouslySetInnerHTML={{ __html: lineHtmls[i] }} />
            ) : (
              <span>{line.content}</span>
            )}
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
          Show {visibleLines.length - MAX_VISIBLE_LINES} more lines
        </button>
      )}
    </div>
  );
}
