"use client";

import type { Attachment } from "@/types/attachment";
import { isImageAttachment } from "@/utils/attachment";
import { ImageChip } from "./image-chip";

export function AttachmentsStrip({
  attachments,
  onRemove,
}: {
  attachments: Attachment[];
  onRemove: (id: string) => void;
}) {
  const imageAttachments = attachments.filter(isImageAttachment);
  if (imageAttachments.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-3 pt-3">
      {imageAttachments.map((a) => (
        <ImageChip
          key={a.id}
          attachment={a}
          onRemove={() => onRemove(a.id)}
        />
      ))}
    </div>
  );
}
