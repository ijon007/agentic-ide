import { createRoot } from "react-dom/client";
import React from "react";
import { FileIcon, FolderIcon, ChatCircleIcon } from "@phosphor-icons/react";
import { getRefLabel } from "@/utils/attachment";
import type { RefAttachment } from "@/utils/attachment";

export function createRefAttachmentChip(
  attachment: RefAttachment,
  id: string,
  onRemoveAttachment?: (id: string) => void
): HTMLSpanElement {
  const span = document.createElement("span");
  span.contentEditable = "false";
  span.dataset.attachmentId = id;
  span.className =
    "inline-flex h-5 max-w-28 shrink-0 items-center gap-1 rounded border px-1.5 py-0.5 align-baseline text-[11px]";
  span.style.borderColor = "var(--border-subtle, #444)";
  span.style.backgroundColor = "var(--bg-elevated, #333)";
  span.style.color = "var(--text-foreground, #fff)";
  span.style.fontSize = "0.875rem";
  const iconWrap = document.createElement("span");
  iconWrap.className = "flex shrink-0 items-center text-muted-foreground";
  const Icon =
    attachment.type === "file" || attachment.type === "projectFile"
      ? FileIcon
      : attachment.type === "chat"
        ? ChatCircleIcon
        : FolderIcon;
  const iconRoot = createRoot(iconWrap);
  iconRoot.render(
    React.createElement(Icon, { size: 14, className: "shrink-0" })
  );
  const labelSpan = document.createElement("span");
  labelSpan.className = "min-w-0 truncate text-sm";
  labelSpan.textContent = getRefLabel(attachment);
  const btn = document.createElement("button");
  btn.type = "button";
  btn.setAttribute("aria-label", "Remove");
  btn.className = "shrink-0 rounded p-0 opacity-70 hover:opacity-100";
  btn.textContent = "\u00D7";
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    iconRoot.unmount();
    span.remove();
    onRemoveAttachment?.(id);
  });
  span.appendChild(iconWrap);
  span.appendChild(labelSpan);
  span.appendChild(btn);
  return span;
}
