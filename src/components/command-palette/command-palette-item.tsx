"use client";

import {
  ChatCircleIcon,
  FileIcon,
  FolderIcon,
} from "@phosphor-icons/react";

export type CommandPaletteItemType = "project" | "chat" | "file";

interface CommandPaletteItemProps {
  type: CommandPaletteItemType;
  title: string;
  subtitle?: string;
}

export function CommandPaletteItem({
  type,
  title,
  subtitle,
}: CommandPaletteItemProps) {
  const Icon =
    type === "project"
      ? FolderIcon
      : type === "chat"
        ? ChatCircleIcon
        : FileIcon;

  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <div className="flex items-center gap-2">
        <Icon
          className="size-4 shrink-0"
          style={{ color: "var(--text-muted)" }}
        />
        <span className="min-w-0 truncate text-sm" style={{ color: "var(--text-primary)" }}>
          {title}
        </span>
      </div>
      {subtitle && (
        <span
          className="truncate pl-6 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
}
