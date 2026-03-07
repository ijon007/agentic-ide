"use client";

import {
  ArrowsClockwiseIcon,
  CaretDownIcon,
  CaretRightIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
  GitDiffIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DiffViewPanel } from "@/components/diff-view-panel";
import { MOCK_FILE_TREE } from "@/constants/fileTree";
import { MOCK_PROJECTS } from "@/constants/projects";
import { MOCK_PROJECT_DIFFS } from "@/constants/projectDiffs";
import { useApp } from "@/context/app-context";
import { cn } from "@/lib/utils";
import type { FileTreeNode } from "@/types/fileTree";

function filterTreeToChangedOnly(
  nodes: FileTreeNode[],
  changedPaths: Set<string>
): FileTreeNode[] {
  const result: FileTreeNode[] = [];
  for (const node of nodes) {
    if (node.type === "file") {
      if (changedPaths.has(node.path)) result.push(node);
    } else {
      const filteredChildren = node.children
        ? filterTreeToChangedOnly(node.children, changedPaths)
        : [];
      if (filteredChildren.length > 0) {
        result.push({ ...node, children: filteredChildren });
      }
    }
  }
  return result;
}

function FileTreeItem({
  node,
  depth,
  activeFile,
  onSelect,
}: {
  node: FileTreeNode;
  depth: number;
  activeFile: string | null;
  onSelect: (path: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const isFolder = node.type === "folder";
  const isActive = activeFile === node.path;

  const handleClick = () => {
    if (isFolder) {
      setOpen((o) => !o);
    } else {
      onSelect(node.path);
    }
  };

  const statusColor =
    node.status === "modified"
      ? "var(--warning)"
      : node.status === "new"
        ? "var(--success)"
        : node.status === "deleted"
          ? "var(--error)"
          : undefined;

  return (
    <div className="flex flex-col">
      <button
        className={cn(
          "flex items-center gap-2 rounded px-2 py-1 text-left transition-colors hover:bg-(--bg-elevated)",
          isActive && "bg-(--selection-bg)"
        )}
        onClick={handleClick}
        style={{
          paddingLeft: 12 + depth * 12,
          color:
            statusColor ??
            (isActive ? "var(--text-primary)" : "var(--text-secondary)"),
          textDecoration:
            node.status === "deleted" ? "line-through" : undefined,
        }}
        type="button"
      >
        {isFolder ? (
          <>
            {open ? (
              <CaretDownIcon className="size-4 shrink-0" />
            ) : (
              <CaretRightIcon className="size-4 shrink-0" />
            )}
            {open ? (
              <FolderOpenIcon
                className="size-4 shrink-0"
                style={{ color: "var(--text-secondary)" }}
              />
            ) : (
              <FolderIcon
                className="size-4 shrink-0"
                style={{ color: "var(--text-secondary)" }}
              />
            )}
          </>
        ) : (
          <>
            <span className="w-[22px] shrink-0" />
            <FileIcon
              className="size-4 shrink-0"
              style={{ color: "var(--text-muted)" }}
            />
          </>
        )}
        <span
          className={cn(
            "min-w-0 truncate text-sm",
            isFolder ? "font-sans" : "font-mono"
          )}
        >
          {node.name}
        </span>
        {node.status === "modified" && (
          <span
            className="ml-auto size-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: "var(--warning)" }}
          />
        )}
      </button>
      {isFolder && open && node.children && (
        <div className="flex flex-col">
          {node.children.map((child) => (
            <FileTreeItem
              activeFile={activeFile}
              depth={depth + 1}
              key={child.path}
              node={child}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type FileTreeFilter = "all" | "changed";

export function SidebarRight() {
  const {
    activeProject,
    activeFile,
    openFile,
    setActiveProject,
    sidebarRightView,
    setSidebarRightView,
  } = useApp();
  const [fileTreeFilter, setFileTreeFilter] = useState<FileTreeFilter>("all");
  const [filesProjectExpanded, setFilesProjectExpanded] = useState<Record<string, boolean>>(() =>
    MOCK_PROJECTS.reduce<Record<string, boolean>>((acc, p) => {
      acc[p.id] = true;
      return acc;
    }, {})
  );

  const isFiles = sidebarRightView === "files";
  const isDiffs = sidebarRightView === "diffs";

  const isFilesProjectExpanded = (projectId: string) => filesProjectExpanded[projectId] !== false;
  const toggleFilesProject = (projectId: string) => {
    setFilesProjectExpanded((prev) => ({ ...prev, [projectId]: !isFilesProjectExpanded(projectId) }));
  };

  const getTreeForProject = (projectId: string): FileTreeNode[] => {
    const raw = MOCK_FILE_TREE[projectId] ?? [];
    if (fileTreeFilter !== "changed") return raw;
    const changedPaths = new Set(
      (MOCK_PROJECT_DIFFS[projectId] ?? []).map((f) => f.filePath)
    );
    return filterTreeToChangedOnly(raw, changedPaths);
  };

  return (
    <aside
      className="flex h-full w-full min-w-0 flex-col border-l"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div
        className="flex flex-col gap-1.5 border-b px-2 py-2"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-0.5">
            <Button
              className={cn(
                "h-6 min-w-0 gap-1 px-1.5 text-sm text-(--text-muted) hover:bg-(--bg-elevated) hover:text-(--text-secondary)",
                isDiffs && "bg-(--bg-elevated) text-(--text-primary)"
              )}
              variant="ghost"
              onClick={() => setSidebarRightView("diffs")}
              title="Diffs"
            >
              <GitDiffIcon className="size-3.5 shrink-0" />
              <span className="truncate">Diffs</span>
            </Button>
            <Button
              className={cn(
                "h-6 min-w-0 gap-1 px-1.5 text-sm text-(--text-muted) hover:bg-(--bg-elevated) hover:text-(--text-secondary)",
                isFiles && "bg-(--bg-elevated) text-(--text-primary)"
              )}
              variant="ghost"
              onClick={() => setSidebarRightView("files")}
              title="Files"
            >
              <FolderIcon className="size-3.5 shrink-0" />
              <span className="truncate">Files</span>
            </Button>
          </div>
        </div>
        {isFiles && (
          <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              className={cn(
                "rounded px-1.5 py-0.5 text-sm font-medium transition-colors cursor-pointer",
                fileTreeFilter === "all"
                  ? "bg-(--bg-elevated) text-(--text-primary)"
                  : "text-(--text-muted) hover:bg-(--bg-elevated) hover:text-(--text-secondary)"
              )}
              onClick={() => setFileTreeFilter("all")}
            >
              All
            </button>
            <button
              type="button"
              className={cn(
                "rounded px-1.5 py-0.5 text-sm font-medium transition-colors cursor-pointer",
                fileTreeFilter === "changed"
                  ? "bg-(--bg-elevated) text-(--text-primary)"
                  : "text-(--text-muted) hover:bg-(--bg-elevated) hover:text-(--text-secondary)"
              )}
              onClick={() => setFileTreeFilter("changed")}
            >
              Changed
            </button>
          </div>
          <Button
            variant="ghost"
            title="Refresh"
            size="icon"
          >
            <ArrowsClockwiseIcon className="size-3" weight="bold" />
          </Button>
          </div>
        )}
      </div>

      {sidebarRightView === "diffs" ? (
        <DiffViewPanel />
      ) : (
        <ScrollArea className="scrollbar-hidden flex-1" hideScrollbar>
          <div className="py-1">
            {MOCK_PROJECTS.map((project) => {
              const expanded = isFilesProjectExpanded(project.id);
              const tree = getTreeForProject(project.id);
              return (
                <div
                  key={project.id}
                  className="border-b last:border-b-0"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  <button
                    type="button"
                    className="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left transition-colors hover:bg-(--bg-elevated)"
                    onClick={() => toggleFilesProject(project.id)}
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
                      {project.name}
                    </span>
                  </button>
                  {expanded && (
                    <div className="pb-1 pl-0.5">
                      {tree.length === 0 ? (
                        <div
                          className="px-2 py-3 text-center text-[11px]"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {fileTreeFilter === "changed" ? "No changed files" : "No files"}
                        </div>
                      ) : (
                        tree.map((node) => (
                          <FileTreeItem
                            activeFile={activeFile}
                            depth={0}
                            key={`${project.id}-${node.path}`}
                            node={node}
                            onSelect={(path) => {
                              setActiveProject(project.id);
                              openFile(path);
                            }}
                          />
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </aside>
  );
}
