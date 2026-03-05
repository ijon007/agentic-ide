import { useCallback } from "react";
import { getTextBeforeCursor } from "@/utils/contentEditable";
import { isDuplicateFile } from "@/utils/attachment";
import {
  createAttachmentId,
  type Attachment,
  type ImageAttachment,
} from "@/types/attachment";
import type { AtMentionItem } from "./at-mention-dropdown";
import type { RefAttachment } from "@/utils/attachment";

export function useContentHandlers(
  contentEditableRef: React.RefObject<HTMLDivElement | null>,
  attachments: Attachment[],
  addAttachment: (a: Attachment) => void,
  onAddAttachment: ((a: Attachment) => void) | undefined,
  onRemoveAttachment: ((id: string) => void) | undefined,
  setIsContentEmpty: (v: boolean) => void,
  parseAtMentionFromText: (before: string) => void,
  atMentionOpen: boolean,
  atMentionItems: AtMentionItem[],
  highlightedIndex: number,
  setHighlightedIndex: (v: number | ((i: number) => number)) => void,
  handleSelectAtItem: (item: AtMentionItem) => void,
  closeAtMention: () => void
) {
  const handleContentInput = useCallback(() => {
    const el = contentEditableRef.current;
    if (!el) return;
    setIsContentEmpty(el.innerText.trim() === "");
    parseAtMentionFromText(getTextBeforeCursor(el));
  }, [contentEditableRef, parseAtMentionFromText, setIsContentEmpty]);

  const handleContentKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const el = contentEditableRef.current;
      if (!el) return;
      if (e.key === "Backspace") {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          if (range.collapsed && range.startOffset === 0) {
            const prev = range.startContainer.previousSibling;
            if (
              prev &&
              prev.nodeType === Node.ELEMENT_NODE &&
              (prev as Element).getAttribute("data-attachment-id")
            ) {
              e.preventDefault();
              const id = (prev as Element).getAttribute("data-attachment-id");
              prev.remove();
              if (id) onRemoveAttachment?.(id);
              return;
            }
          }
        }
      }
      if (atMentionOpen && atMentionItems.length > 0) {
        if (e.key === "Escape") {
          e.preventDefault();
          closeAtMention();
          return;
        }
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setHighlightedIndex((i) =>
            i < atMentionItems.length - 1 ? i + 1 : 0
          );
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setHighlightedIndex((i) =>
            i > 0 ? i - 1 : atMentionItems.length - 1
          );
          return;
        }
        if (e.key === "Enter" && atMentionItems[highlightedIndex]) {
          e.preventDefault();
          handleSelectAtItem(atMentionItems[highlightedIndex]);
          return;
        }
      }
    },
    [
      contentEditableRef,
      atMentionOpen,
      atMentionItems,
      highlightedIndex,
      handleSelectAtItem,
      onRemoveAttachment,
      closeAtMention,
      setHighlightedIndex,
    ]
  );

  const handleContentPaste = useCallback(
    (e: React.ClipboardEvent) => {
      const files = e.clipboardData?.files;
      if (files?.length && onAddAttachment) {
        const imageFiles = Array.from(files).filter((f) =>
          f.type.startsWith("image/")
        );
        if (imageFiles.length > 0) {
          e.preventDefault();
          for (const file of imageFiles) {
            if (!isDuplicateFile(attachments, file)) {
              addAttachment({
                type: "image",
                file,
                id: createAttachmentId(),
              } satisfies ImageAttachment);
            }
          }
          return;
        }
      }
      document.execCommand(
        "insertText",
        false,
        e.clipboardData?.getData("text/plain") ?? ""
      );
      e.preventDefault();
    },
    [onAddAttachment, attachments, addAttachment]
  );

  return { handleContentInput, handleContentKeyDown, handleContentPaste };
}
