"use client";

import { ImageIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Attachment } from "@/types/attachment";
import { Button } from "@/components/ui/button";

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
        "flex flex-row items-center gap-1 rounded border overflow-hidden px-0.5",
        "border-foreground/20 bg-(--bg-elevated)"
      )}
    >
      <ImageIcon className="size-3" />
      <span className="text-sm">{attachment.file.name}</span>
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={onRemove}
      >
        <XIcon className="size-3" />
      </Button>
    </div>
  );
}
