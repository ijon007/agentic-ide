"use client";

import { XIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Attachment } from "@/types/attachment";

export function ImageChip({
  attachment,
  onRemove,
}: {
  attachment: Attachment & { type: "image" };
  onRemove: () => void;
}) {
  const [previewUrl] = useState(() => URL.createObjectURL(attachment.file));
  useEffect(() => () => URL.revokeObjectURL(previewUrl), [previewUrl]);
  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded border overflow-hidden",
        "border-(--border-subtle) bg-(--bg-elevated)"
      )}
    >
      <img
        alt=""
        className="size-8 shrink-0 object-cover"
        src={previewUrl}
      />
      <button
        type="button"
        className="rounded p-0.5 text-muted-foreground hover:bg-(--bg-overlay) hover:text-foreground"
        onClick={onRemove}
        aria-label="Remove image"
      >
        <XIcon className="size-3" />
      </button>
    </div>
  );
}
