"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApp } from "@/context/app-context";
import { MOCK_PROJECTS } from "@/constants/projects";
import { MOCK_FILE_TREE } from "@/constants/fileTree";
import type { FileTreeNode } from "@/types/fileTree";
import {
  FolderIcon,
  FolderOpenIcon,
  FileIcon,
  CaretRightIcon,
  CaretDownIcon,
  ArrowsClockwiseIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
        type="button"
        className={cn(
          "flex items-center gap-2 rounded px-2 py-1 text-left transition-colors hover:bg-[var(--bg-elevated)]",
          isActive && "bg-[var(--selection-bg)]"
        )}
        style={{
          paddingLeft: 12 + depth * 12,
          color: statusColor ?? (isActive ? "var(--text-primary)" : "var(--text-secondary)"),
          textDecoration: node.status === "deleted" ? "line-through" : undefined,
        }}
        onClick={handleClick}
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
              key={child.path}
              node={child}
              depth={depth + 1}
              activeFile={activeFile}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function SidebarRight() {
  const { activeProject, activeFile, openFile } = useApp();
  const project = MOCK_PROJECTS.find((p) => p.id === activeProject);
  const tree = activeProject ? MOCK_FILE_TREE[activeProject] ?? [] : [];

  return (
    <aside
      className="flex h-full w-full min-w-0 flex-col border-l"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div
        className="flex h-9 items-center justify-between border-b px-3"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <span
          className="truncate text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          {project?.name ?? "No project"}
        </span>
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-secondary)]"
        >
          <ArrowsClockwiseIcon className="size-3.5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 scrollbar-hidden" hideScrollbar>
        <div className="py-2">
          {tree.map((node) => (
            <FileTreeItem
              key={node.path}
              node={node}
              depth={0}
              activeFile={activeFile}
              onSelect={openFile}
            />
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
