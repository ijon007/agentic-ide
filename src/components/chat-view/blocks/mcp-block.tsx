"use client";

import { CaretDownIcon, CaretUpIcon, PlugIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import type { ToolCallStatus } from "@/types/message";

const MAX_VISIBLE_LINES = 4;
const LINE_HEIGHT_REM = 1.75;

function getStatusColor(status: ToolCallStatus): string {
  switch (status) {
    case "success":
    case "wrote":
      return "var(--success)";
    case "error":
      return "var(--error)";
    case "running":
    case "reading":
      return "var(--accent)";
    default:
      return "var(--text-muted)";
  }
}

function formatContent(
  args?: Record<string, unknown>,
  result?: string,
  error?: string
): string {
  const parts: string[] = [];
  if (args && Object.keys(args).length > 0) {
    parts.push("Arguments:\n" + JSON.stringify(args, null, 2));
  }
  if (error) {
    parts.push("Error:\n" + error);
  } else if (result) {
    parts.push("Result:\n" + result);
  }
  return parts.join("\n\n") || "";
}

export function MCPBlock({
  server,
  toolName,
  arguments: args,
  result,
  error,
  status,
}: {
  server: string;
  toolName: string;
  arguments?: Record<string, unknown>;
  result?: string;
  error?: string;
  status: ToolCallStatus;
}) {
  const [open, setOpen] = useState(true);
  const [linesExpanded, setLinesExpanded] = useState(false);
  const content = formatContent(args, result, error);
  const lines = content ? content.split("\n") : [];
  const hasMore = lines.length > MAX_VISIBLE_LINES;
  const visibleCount = linesExpanded ? lines.length : Math.min(lines.length, MAX_VISIBLE_LINES);
  const visibleLines = lines.slice(0, visibleCount);
  const title = `${server} / ${toolName}`;

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="group overflow-hidden rounded w-full"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <CollapsibleTrigger
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left transition-colors hover:bg-(--bg-elevated) cursor-pointer"
      >
        <div className="flex items-center gap-2 min-w-0">
          <PlugIcon
            className="size-4"
          />
          <span
            className="truncate font-mono text-xs"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </span>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent
        className="border-t w-full"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div
          className="relative font-mono text-[11px]"
          style={
            lines.length > 0 && !linesExpanded
              ? { maxHeight: `${MAX_VISIBLE_LINES * LINE_HEIGHT_REM}rem`, overflow: "hidden" }
              : { maxHeight: "16rem", overflow: "auto" }
          }
        >
          {lines.length > 0 ? (
            <div
              className="px-3 py-2"
              style={{
                color: error ? "var(--error)" : "var(--text-code)",
                backgroundColor: "#1e1e1e",
              }}
            >
              {visibleLines.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap wrap-break-word">
                  {line || " "}
                </div>
              ))}
            </div>
          ) : (
            <div
              className="px-3 py-2"
              style={{
                color: "var(--text-muted)",
                backgroundColor: "#1e1e1e",
              }}
            >
              {status === "running" || status === "reading"
                ? "Running..."
                : status === "pending"
                  ? "Pending..."
                  : "No result"}
            </div>
          )}
          {hasMore && !linesExpanded && lines.length > 0 && (
            <div
              className="absolute bottom-0 left-0 right-0 flex justify-center pt-4 pb-1 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
              style={{
                background: "linear-gradient(to top, var(--bg-surface) 10%, transparent)",
              }}
            >
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setLinesExpanded(true)}
                aria-label="Expand to show all lines"
              >
                <CaretDownIcon className="size-4" />
              </Button>
            </div>
          )}
          {hasMore && linesExpanded && lines.length > 0 && (
            <div
              className="sticky bottom-0 left-0 right-0 flex justify-center pt-2 pb-1 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
              style={{
                background: "linear-gradient(to top, var(--bg-surface) 10%, transparent)",
              }}
            >
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setLinesExpanded(false)}
                aria-label="Collapse"
              >
                <CaretUpIcon className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
