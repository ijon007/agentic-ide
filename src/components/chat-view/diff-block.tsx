"use client";

import { FileCodeIcon, CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";
import { parseUnifiedDiff, getLangFromPath, getDiffStats } from "@/utils/diff";
import { useState, useEffect } from "react";
import { codeToHtml } from "shiki";
import { Button } from "../ui/button";

const MAX_VISIBLE_LINES = 4;
const LINE_HEIGHT_REM = 1.75;

function basename(path: string): string {
  const i = path.lastIndexOf("/");
  return i >= 0 ? path.slice(i + 1) : path;
}

function isMetaLine(line: { content: string; hunkStart?: unknown }): boolean {
  if (line.hunkStart) return true;
  const c = line.content;
  return c.startsWith("--- ") || c.startsWith("+++ ");
}

function extractCodeHtml(fullHtml: string): string {
  const m = fullHtml.match(/<code[^>]*>([\s\S]*?)<\/code>/);
  return m ? m[1] : fullHtml;
}

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
  const [expanded, setExpanded] = useState(false);
  const lines = unified ? parseUnifiedDiff(unified) : [];
  const stats = lines.length > 0 ? getDiffStats(lines) : { adds: 0, removes: 0 };
  const visibleLines = lines.filter((l) => !isMetaLine(l));
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
    <div
      className="group relative overflow-hidden rounded"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div
        className="flex items-center justify-between gap-2 border-b px-3 py-2"
        style={{
          borderColor: "var(--border-subtle)",
          color: "var(--text-secondary)",
        }}
      >
        <div className="flex min-w-0 items-center gap-2">
          <FileCodeIcon className="size-3.5 shrink-0" style={{ color: "var(--accent)" }} />
          <span className="truncate font-mono text-[11px]">{basename(filePath)}</span>
        </div>
        {visibleLines.length > 0 && (
          <span className="shrink-0 font-mono tabular-nums text-[11px]" style={{ color: "var(--text-muted)" }}>
            {stats.adds > 0 && <span style={{ color: "var(--diff-add-text)" }}>+{stats.adds}</span>}
            {stats.adds > 0 && stats.removes > 0 && " "}
            {stats.removes > 0 && <span style={{ color: "var(--diff-remove-text)" }}>-{stats.removes}</span>}
            {stats.adds === 0 && stats.removes === 0 && "—"}
          </span>
        )}
      </div>
      <div
        className="relative font-mono text-[11px]"
        style={
          visibleLines.length > 0 && !expanded
            ? { maxHeight: `${MAX_VISIBLE_LINES * LINE_HEIGHT_REM}rem`, overflow: "hidden" }
            : { maxHeight: "16rem", overflow: "auto" }
        }
      >
        {visibleLines.length > 0 ? (
          <div>
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
        {hasMore && !expanded && visibleLines.length > 0 && (
          <div
            className="absolute bottom-0 left-0 right-0 flex justify-center pt-4 pb-1 opacity-0 transition-opacity group-hover:opacity-100"
            style={{
              background: "linear-gradient(to top, var(--bg-surface) 10%, transparent)",
            }}
          >
            <Button 
              size="icon"
              variant="ghost"
              onClick={() => setExpanded(true)}
              aria-label="Expand to show all lines"
            >
              <CaretDownIcon className="size-4" />
            </Button>
          </div>
        )}
        {hasMore && expanded && visibleLines.length > 0 && (
          <div
            className="sticky bottom-0 left-0 right-0 flex justify-center pt-2 pb-1 opacity-0 transition-opacity group-hover:opacity-100"
            style={{
              background: "linear-gradient(to top, var(--bg-surface) 10%, transparent)",
            }}
          >
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setExpanded(false)}
              aria-label="Collapse"
            >
              <CaretUpIcon className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
