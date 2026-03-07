"use client";

import { CaretDownIcon, CaretRightIcon } from "@phosphor-icons/react";
import { FileIcon } from "@react-symbols/icons/utils";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MOCK_PROJECTS } from "@/constants/projects";
import { MOCK_PROJECT_DIFFS } from "@/constants/projectDiffs";
import { useApp } from "@/context/app-context";
import { cn } from "@/lib/utils";
import type { DiffBlock } from "@/types/message";
import { parseUnifiedDiff, getDiffStats } from "@/utils/diff";
import { UnifiedDiffView } from "@/components/chat-view/blocks/unified-diff-view";

function FileDiffRow({
  file,
  onOpenFile,
}: {
  file: DiffBlock;
  onOpenFile?: (path: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
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
          className="shrink-0 rounded p-0.5 transition-colors hover:bg-(--bg-elevated)"
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
          className="-mx-1 flex min-w-0 flex-1 items-center gap-2 rounded px-1 py-0.5 text-left transition-colors hover:bg-(--bg-elevated)"
          onClick={() => onOpenFile?.(file.filePath)}
        >
          <span className="size-3.5 shrink-0 flex items-center justify-center">
            <FileIcon
              fileName={file.filePath.split("/").pop() ?? file.filePath}
              width={14}
              height={14}
            />
          </span>
          <span
            className="min-w-0 flex-1 truncate font-mono text-sm"
            style={{ color: "var(--text-primary)" }}
          >
            {file.filePath}
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

export function DiffViewPanel() {
  const { openFile } = useApp();
  const [projectExpanded, setProjectExpanded] = useState<Record<string, boolean>>({});

  const projectsWithDiffs = (Object.keys(MOCK_PROJECT_DIFFS) as string[])
    .map((projectId) => {
      const project = MOCK_PROJECTS.find((p) => p.id === projectId);
      const files = MOCK_PROJECT_DIFFS[projectId] ?? [];
      return { projectId, project, files };
    })
    .filter(({ files }) => files.length > 0);

  const totalFiles = projectsWithDiffs.reduce((n, { files }) => n + files.length, 0);

  const isProjectExpanded = (projectId: string) =>
    projectExpanded[projectId] !== false;

  const toggleProject = (projectId: string) => {
    setProjectExpanded((prev) => ({ ...prev, [projectId]: !isProjectExpanded(projectId) }));
  };

  return (
    <div className="flex h-full w-full min-w-0 flex-col">
      <div
        className="flex flex-col border-b p-2"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div className="flex items-center justify-between gap-1">
          <span
            className="truncate font-medium text-sm"
            style={{ color: "var(--text-primary)" }}
          >
            Unstaged ({totalFiles})
          </span>
        </div>
        {projectsWithDiffs.length > 1 && (
          <span
            className="truncate font-mono text-[11px]"
            style={{ color: "var(--text-secondary)" }}
          >
            {projectsWithDiffs.length} projects
          </span>
        )}
      </div>
      <ScrollArea className="scrollbar-hidden flex-1" hideScrollbar>
        <div className="py-1 px-2">
          {projectsWithDiffs.length === 0 ? (
            <div
              className="px-3 py-6 text-center text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              No changes
            </div>
          ) : (
            projectsWithDiffs.map(({ projectId, project, files }) => {
              const expanded = isProjectExpanded(projectId);
              return (
                <div
                  key={project?.id ?? "unknown"}
                  className="border-b last:border-b-0 py-1"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  <button
                    type="button"
                    className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-left transition-colors hover:bg-(--bg-elevated)"
                    onClick={() => toggleProject(projectId)}
                    aria-expanded={expanded}
                  >
                    {expanded ? (
                      <CaretDownIcon className="size-3.5 shrink-0" style={{ color: "var(--text-muted)" }} />
                    ) : (
                      <CaretRightIcon className="size-3.5 shrink-0" style={{ color: "var(--text-muted)" }} />
                    )}
                    <span
                      className="min-w-0 flex-1 truncate font-medium text-[11px] uppercase tracking-wider"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {project?.name ?? "Unknown"} ({files.length})
                    </span>
                  </button>
                  {expanded &&
                    files.map((file) => (
                      <FileDiffRow
                        key={file.id}
                        file={file}
                        onOpenFile={openFile}
                      />
                    ))}
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
