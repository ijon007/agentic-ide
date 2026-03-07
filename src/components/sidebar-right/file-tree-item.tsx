"use client";

import {
  CaretDownIcon,
  CaretRightIcon,
  FolderIcon,
  FolderOpenIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { FileIcon } from "@react-symbols/icons/utils";
import { cn } from "@/lib/utils";
import type { FileTreeNode } from "@/types/fileTree";

export function FileTreeItem({
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
            <span className="size-4 shrink-0 flex items-center justify-center">
              <FileIcon fileName={node.name} width={16} height={16} />
            </span>
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
