"use client";

import { CaretDownIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MOCK_FILE_TREE } from "@/constants/fileTree";
import { MOCK_PROJECTS } from "@/constants/projects";
import { MOCK_PROJECT_DIFFS } from "@/constants/projectDiffs";
import { useApp } from "@/context/app-context";
import { FileTreeItem } from "./file-tree-item";
import type { FileTreeFilter } from "./sidebar-right-header";
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

type FileTreePanelProps = {
  fileTreeFilter: FileTreeFilter;
};

export function FileTreePanel({ fileTreeFilter }: FileTreePanelProps) {
  const { activeFile, openFile, setActiveProject } = useApp();
  const [filesProjectExpanded, setFilesProjectExpanded] = useState<
    Record<string, boolean>
  >(() =>
    MOCK_PROJECTS.reduce<Record<string, boolean>>((acc, p) => {
      acc[p.id] = true;
      return acc;
    }, {})
  );

  const isFilesProjectExpanded = (projectId: string) =>
    filesProjectExpanded[projectId] !== false;
  const toggleFilesProject = (projectId: string) => {
    setFilesProjectExpanded((prev) => ({
      ...prev,
      [projectId]: !isFilesProjectExpanded(projectId),
    }));
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
                  <CaretDownIcon
                    className="size-3.5 shrink-0"
                    style={{ color: "var(--text-muted)" }}
                  />
                ) : (
                  <CaretRightIcon
                    className="size-3.5 shrink-0"
                    style={{ color: "var(--text-muted)" }}
                  />
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
                      {fileTreeFilter === "changed"
                        ? "No changed files"
                        : "No files"}
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
  );
}
