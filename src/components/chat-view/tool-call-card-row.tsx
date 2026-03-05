"use client";

import {
  CheckCircleIcon,
  XCircleIcon,
  FileIcon,
  PencilSimpleIcon,
  TerminalIcon,
  MagnifyingGlassIcon,
  GlobeIcon,
  CodeIcon,
  GearIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  type ToolCallCard,
  normalizeToolCall,
  isLegacyToolCall,
} from "@/types/message";
import { Badge } from "@/components/ui/badge";

const isRunning = (s: ToolCallCard["status"]) =>
  s === "running" || s === "reading";
const isSuccess = (s: ToolCallCard["status"]) =>
  s === "success" || s === "wrote";
const isError = (s: ToolCallCard["status"]) => s === "error";
const isPending = (s: ToolCallCard["status"]) => s === "pending";

function getToolLabel(card: ToolCallCard & { kind: string }): string {
  if (isLegacyToolCall(card)) return card.verb;
  switch (card.kind) {
    case "read_file":
      return "Read file";
    case "write_file":
      return "Write file";
    case "run_command":
      return "Run command";
    case "search":
      return "Search";
    case "web_search":
      return "Web search";
    case "apply_patch":
      return "Apply patch";
    default:
      return (card as { verb?: string }).verb ?? "Tool";
  }
}

function getToolDetail(card: ToolCallCard & { kind: string }): string | undefined {
  if (isLegacyToolCall(card)) return card.path ?? card.text;
  switch (card.kind) {
    case "read_file":
    case "write_file":
    case "apply_patch":
      return card.path;
    case "run_command":
      return card.text;
    case "search":
    case "web_search":
      return card.query;
    default:
      return (card as { path?: string; text?: string }).path ??
        (card as { path?: string; text?: string }).text;
  }
}

function ToolIcon({
  card,
  status,
}: {
  card: ToolCallCard & { kind: string };
  status: ToolCallCard["status"];
}) {
  const iconColor = isError(status)
    ? "var(--error)"
    : isSuccess(status)
      ? "var(--success)"
      : isRunning(status)
        ? "var(--accent)"
        : "var(--text-muted)";

  if (isLegacyToolCall(card)) {
    return <GearIcon className="size-3.5 shrink-0" style={{ color: iconColor }} />;
  }

  const Icon =
    card.kind === "read_file"
      ? FileIcon
      : card.kind === "write_file"
        ? PencilSimpleIcon
        : card.kind === "run_command"
          ? TerminalIcon
          : card.kind === "search"
            ? MagnifyingGlassIcon
            : card.kind === "web_search"
              ? GlobeIcon
              : card.kind === "apply_patch"
                ? CodeIcon
                : GearIcon;

  return <Icon className="size-3.5 shrink-0" style={{ color: iconColor }} />;
}

export function ToolCallCardRow({
  card,
  expandable,
}: {
  card: ToolCallCard;
  expandable?: boolean;
}) {
  const normalized = normalizeToolCall(card);
  const status = normalized.status;
  const [expanded, setExpanded] = useState(false);
  const hasExpandableContent =
    expandable &&
    ("output" in normalized
      ? !!normalized.output
      : "error" in normalized && !!normalized.error);

  return (
    <div
      className="w-full rounded-md px-2 py-1 text-[11px]"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div className="flex min-h-7 items-center gap-2">
        {isPending(status) ? (
          <span
            className="size-1.5 shrink-0 animate-pulse rounded-full"
            style={{ backgroundColor: "var(--text-muted)" }}
          />
        ) : isRunning(status) ? (
          <span
            className="size-1.5 shrink-0 animate-pulse rounded-full"
            style={{ backgroundColor: "var(--accent)" }}
          />
        ) : isError(status) ? (
          <XCircleIcon
            className="size-3.5 shrink-0"
            style={{ color: "var(--error)" }}
          />
        ) : isSuccess(status) ? (
          <CheckCircleIcon
            className="size-3.5 shrink-0"
            style={{ color: "var(--success)" }}
          />
        ) : (
          <ToolIcon card={normalized} status={status} />
        )}
        {getToolDetail(normalized) && (
          <span
            className="truncate font-mono"
            style={{
              color: isSuccess(status)
                ? ""
                : isError(status)
                  ? "var(--error)"
                  : "var(--accent)",
            }}
          >
            {getToolDetail(normalized)}
          </span>
        )}
        <Badge
          className="shrink-0 px-1.5 py-0 text-[10px]"
          variant="outline"
          style={{
            borderColor: "var(--border-subtle)",
            color: "var(--text-muted)",
          }}
        >
          {getToolLabel(normalized)}
        </Badge>
        {"resultCount" in normalized && normalized.resultCount != null && (
          <span
            className="shrink-0 text-[10px]"
            style={{ color: "var(--text-muted)" }}
          >
            {normalized.resultCount} result
            {normalized.resultCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>
      {hasExpandableContent && (
        <>
          <button
            type="button"
            className={cn(
              "mt-1.5 flex items-center gap-1 text-[10px]",
              "hover:underline"
            )}
            style={{ color: "var(--text-muted)" }}
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? "Hide" : "Show"} details
          </button>
          {expanded && (
            <pre
              className="mt-1 max-h-24 overflow-auto rounded border px-2 py-1.5 font-mono text-[10px]"
              style={{
                backgroundColor: "var(--bg-elevated)",
                borderColor: "var(--border-subtle)",
                color:
                  "error" in normalized && normalized.error
                    ? "var(--error)"
                    : "var(--text-code)",
              }}
            >
              {"output" in normalized
                ? normalized.output
                : "error" in normalized
                  ? normalized.error
                  : ""}
            </pre>
          )}
        </>
      )}
    </div>
  );
}
