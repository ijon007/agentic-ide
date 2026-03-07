"use client";

import { CaretDownIcon, CheckIcon, XIcon } from "@phosphor-icons/react";
import { FileIcon as SymbolFileIcon } from "@react-symbols/icons/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { DiffBlock } from "@/types/message";
import { getDiffStats, parseUnifiedDiff } from "@/utils/diff";

function basename(path: string): string {
  const i = path.lastIndexOf("/");
  return i >= 0 ? path.slice(i + 1) : path;
}

function getFileStats(file: DiffBlock): { adds: number; removes: number } {
  if (!file.unified) return { adds: 0, removes: 0 };
  return getDiffStats(parseUnifiedDiff(file.unified));
}

function FileIcon({ path }: { path: string }) {
  const fileName = path.split("/").pop() ?? path;
  return (
    <span className="size-3.5 shrink-0 flex items-center justify-center">
      <SymbolFileIcon fileName={fileName} width={14} height={14} />
    </span>
  );
}

export function FilesChangedRibbon({
  files,
  onAcceptAll,
  onRejectAll,
}: {
  files: DiffBlock[];
  onAcceptAll?: () => void;
  onRejectAll?: () => void;
}) {
  const count = files.length;
  if (count === 0) return null;

  return (
    <Collapsible className="group w-full max-w-4xl shrink-0">
      <div
        className="overflow-hidden rounded-md border"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <div className="flex w-full items-center justify-between gap-3 px-3 py-1">
          <CollapsibleTrigger
            className={cn(
              "group/trigger flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded py-0 pr-2 transition-colors [&]:outline-none"
            )}
            aria-label="Toggle files list"
          >
            <CaretDownIcon
              className="size-3.5 shrink-0 -rotate-90 transition-transform group-data-panel-open/trigger:rotate-0"
              style={{ color: "var(--text-muted)" }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {count} file{count !== 1 ? "s" : ""} changed
            </span>
          </CollapsibleTrigger>
          <div className="flex shrink-0 gap-1.5">
            <Button
              className="flex items-center gap-1"
              size="sm"
              variant="outline"
              onClick={onAcceptAll}
            >
              <CheckIcon className="size-3" />
              <span className="text-xs">Accept all</span>
            </Button>
            <Button
              className="flex items-center gap-1"
              size="sm"
              variant="outline"
              onClick={onRejectAll}
            >
              <XIcon className="size-3" />
              <span className="text-xs">Reject all</span>
            </Button>
          </div>
        </div>
        <CollapsibleContent>
          <div className="max-h-48 overflow-y-auto py-1">
            {files.map((file) => {
            const stats = getFileStats(file);
            const name = basename(file.filePath);
            return (
              <div
                key={file.id}
                className="flex items-center gap-2 px-3 py-1.5 text-[11px]
                  hover:bg-(--bg-elevated)"
                style={{ color: "var(--text-primary)" }}
              >
                <FileIcon path={file.filePath} />
                <span className="min-w-0 flex-1 truncate font-mono">
                  {name}
                </span>
                <span className="shrink-0 tabular-nums">
                  {stats.adds > 0 && (
                    <span style={{ color: "var(--diff-add-text)" }}>
                      +{stats.adds}
                    </span>
                  )}
                  {stats.adds > 0 && stats.removes > 0 && " "}
                  {stats.removes > 0 && (
                    <span style={{ color: "var(--diff-remove-text)" }}>
                      -{stats.removes}
                    </span>
                  )}
                  {stats.adds === 0 && stats.removes === 0 && "—"}
                </span>
              </div>
            );
          })}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
