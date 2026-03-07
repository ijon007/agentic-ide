"use client";

import { ArrowsClockwiseIcon, FolderIcon, GitDiffIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FileTreeFilter = "all" | "changed";

type SidebarRightView = "diffs" | "files";

type SidebarRightHeaderProps = {
  view: SidebarRightView;
  onViewChange: (view: SidebarRightView) => void;
  fileTreeFilter: FileTreeFilter;
  onFileTreeFilterChange: (filter: FileTreeFilter) => void;
};

export function SidebarRightHeader({
  view,
  onViewChange,
  fileTreeFilter,
  onFileTreeFilterChange,
}: SidebarRightHeaderProps) {
  const isFiles = view === "files";
  const isDiffs = view === "diffs";

  return (
    <div
      className="flex flex-col border-b"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <div
        className="flex items-end gap-0.5 px-2 pt-2"
        role="tablist"
        aria-label="Panel view"
      >
        <Button
          className={cn(
            "flex items-center justify-center flex-row gap-1 px-2 text-[13px] font-medium transition-colors",
            "border-transparent text-(--text-muted) hover:text-(--text-secondary)",
            isDiffs && "text-(--text-primary)"
          )}
          variant="ghost"
          onClick={() => onViewChange("diffs")}
          title="Diffs"
          role="tab"
          aria-selected={isDiffs}
        >
          <GitDiffIcon className="size-4" weight="bold" />
          <span>Diffs</span>
        </Button>
        <Button
          className={cn(
            "flex items-center justify-center flex-row gap-1 px-2 text-[13px] font-medium transition-colors",
            "border-transparent text-(--text-muted) hover:text-(--text-secondary)",
            isFiles && "text-(--text-primary)"
          )}
          variant="ghost"
          onClick={() => onViewChange("files")}
          title="Files"
          role="tab"
          aria-selected={isFiles}
        >
          <FolderIcon className="size-4" weight="bold" />
          <span>Files</span>
        </Button>
      </div>

      {isFiles && (
        <div
          className="flex items-center justify-between gap-2 border-t px-2 py-1.5"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <div
            className="flex items-center gap-0.5 rounded p-0.5"
            style={{ backgroundColor: "var(--bg-elevated)" }}
            role="group"
            aria-label="File filter"
          >
            <button
              type="button"
              className={cn(
                "rounded px-2 py-1 text-sm font-medium transition-colors cursor-pointer",
                fileTreeFilter === "all"
                  ? "bg-(--bg-surface) text-(--text-primary) shadow-sm"
                  : "text-(--text-muted) hover:text-(--text-secondary)"
              )}
              onClick={() => onFileTreeFilterChange("all")}
            >
              All
            </button>
            <button
              type="button"
              className={cn(
                "rounded px-2 py-1 text-sm font-medium transition-colors cursor-pointer",
                fileTreeFilter === "changed"
                  ? "bg-(--bg-surface) text-(--text-primary) shadow-sm"
                  : "text-(--text-muted) hover:text-(--text-secondary)"
              )}
              onClick={() => onFileTreeFilterChange("changed")}
            >
              Changed
            </button>
          </div>
          <Button
            variant="ghost"
            title="Refresh file list"
            size="icon"
            className="h-6 w-6 shrink-0"
          >
            <ArrowsClockwiseIcon className="size-3" weight="bold" />
          </Button>
        </div>
      )}
    </div>
  );
}
