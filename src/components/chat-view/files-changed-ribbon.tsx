"use client";

import { CheckIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export function FilesChangedRibbon({
  fileCount,
  onAcceptAll,
  onRejectAll,
}: {
  fileCount: number;
  onAcceptAll?: () => void;
  onRejectAll?: () => void;
}) {
  return (
    <div
      className="flex min-h-10 shrink-0 items-center justify-between gap-4 px-4 py-2"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
        {fileCount} file{fileCount !== 1 ? "s" : ""} changed
      </span>
      <div className="flex gap-2">
        <Button
          className="h-7 gap-1.5 bg-(--success) text-white text-xs hover:bg-(--success)/90"
          size="sm"
          onClick={onAcceptAll}
        >
          <CheckIcon className="size-3.5" />
          Accept all
        </Button>
        <Button
          className="h-7 gap-1.5 border-(--border-default) text-(--text-primary) text-xs hover:bg-(--bg-elevated)"
          size="sm"
          variant="outline"
          onClick={onRejectAll}
        >
          <XIcon className="size-3.5" />
          Reject all
        </Button>
      </div>
    </div>
  );
}
