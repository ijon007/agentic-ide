"use client";

import { CaretDownIcon, CaretRightIcon, FileCodeIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { DiffBlock } from "@/types/message";
import { parseUnifiedDiff, getDiffStats } from "@/utils/diff";
import { UnifiedDiffView } from "./unified-diff-view";

function basename(path: string): string {
  const i = path.lastIndexOf("/");
  return i >= 0 ? path.slice(i + 1) : path;
}

function FileDiffRow({
  file,
  onOpenFile,
}: {
  file: DiffBlock;
  onOpenFile?: (path: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const name = basename(file.filePath);
  const stats = file.unified
    ? getDiffStats(parseUnifiedDiff(file.unified))
    : { adds: 0, removes: 0 };

  return (
    <div
      className={cn(
        "border-b last:border-b-0",
        expanded && "bg-(--bg-elevated)"
      )}
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <div className="flex w-full items-center gap-2 px-3 py-2">
        <button
          type="button"
          className="shrink-0 p-0.5 transition-colors hover:bg-(--bg-elevated) rounded"
          onClick={() => setExpanded((e) => !e)}
          aria-label={expanded ? "Collapse diff" : "Expand diff"}
        >
          {expanded ? (
            <CaretDownIcon className="size-3.5" style={{ color: "var(--text-muted)" }} />
          ) : (
            <CaretRightIcon className="size-3.5" style={{ color: "var(--text-muted)" }} />
          )}
        </button>
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-2 text-left transition-colors hover:bg-(--bg-elevated) rounded py-0.5 -mx-1 px-1"
          onClick={() => onOpenFile?.(file.filePath)}
        >
          <FileCodeIcon className="size-3.5 shrink-0" style={{ color: "var(--accent)" }} />
          <span className="min-w-0 flex-1 truncate font-mono text-[11px]" style={{ color: "var(--text-primary)" }}>
            {name}
          </span>
          <span
            className="shrink-0 font-mono tabular-nums text-[11px]"
            style={{ color: "var(--text-muted)" }}
          >
            {stats.adds > 0 && <span style={{ color: "var(--diff-add-text)" }}>+{stats.adds}</span>}
            {stats.adds > 0 && stats.removes > 0 && " "}
            {stats.removes > 0 && <span style={{ color: "var(--diff-remove-text)" }}>-{stats.removes}</span>}
            {stats.adds === 0 && stats.removes === 0 && "—"}
          </span>
        </button>
      </div>
      {expanded && file.unified && (
        <div className="border-t px-2 pb-2" style={{ borderColor: "var(--border-subtle)" }}>
          <UnifiedDiffView unified={file.unified} filePath={file.filePath} />
        </div>
      )}
    </div>
  );
}
