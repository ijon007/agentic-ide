import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  getRangeForCharacterOffset,
  getTextBeforeCursor,
} from "@/utils/contentEditable";
import {
  createAttachmentId,
  type ChatAttachment,
  type ProjectAttachment,
  type ProjectFileAttachment,
} from "@/types/attachment";
import type { AtMentionItem } from "./at-mention-dropdown";
import type { RefAttachment } from "@/utils/attachment";
import { createRefAttachmentChip } from "./ref-chip-factory";

export function useAtMention(
  contentEditableRef: React.RefObject<HTMLDivElement | null>,
  onAddAttachment: ((a: RefAttachment) => void) | undefined,
  onRemoveAttachment: ((id: string) => void) | undefined,
  setIsContentEmpty: (v: boolean) => void
) {
  const [atMentionOpen, setAtMentionOpen] = useState(false);
  const [atMentionQuery, setAtMentionQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [dropdownPosition, setDropdownPosition] = useState<{
    bottom: number;
    left: number;
    width: number;
  } | null>(null);
  const atDropdownRef = useRef<HTMLDivElement>(null);
  const inputAnchorRef = useRef<HTMLDivElement>(null);

  const createChipSpan = useCallback(
    (attachment: RefAttachment, id: string) =>
      createRefAttachmentChip(attachment, id, onRemoveAttachment),
    [onRemoveAttachment]
  );

  useLayoutEffect(() => {
    if (!atMentionOpen || !inputAnchorRef.current) {
      setDropdownPosition(null);
      return;
    }
    const rect = inputAnchorRef.current.getBoundingClientRect();
    setDropdownPosition({
      bottom: window.innerHeight - rect.top,
      left: rect.left,
      width: rect.width,
    });
  }, [atMentionOpen, atMentionQuery]);

  useEffect(() => {
    const dropdown = atDropdownRef.current;
    const child = dropdown?.children[highlightedIndex] as HTMLElement | undefined;
    if (!dropdown || !child) return;
    const itemTop = child.offsetTop;
    const itemBottom = itemTop + child.offsetHeight;
    const scrollTop = dropdown.scrollTop;
    const containerHeight = dropdown.clientHeight;
    if (itemBottom > scrollTop + containerHeight) {
      dropdown.scrollTop = itemBottom - containerHeight;
    } else if (itemTop < scrollTop) {
      dropdown.scrollTop = itemTop;
    }
  }, [highlightedIndex]);

  useEffect(() => {
    if (!atMentionOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        atDropdownRef.current?.contains(target) ||
        inputAnchorRef.current?.contains(target)
      ) {
        return;
      }
      setAtMentionOpen(false);
      setAtMentionQuery("");
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [atMentionOpen]);

  const parseAtMentionFromText = useCallback((beforeCursor: string) => {
    const lastAt = beforeCursor.lastIndexOf("@");
    if (lastAt === -1) {
      setAtMentionOpen(false);
      setAtMentionQuery("");
      return;
    }
    const afterAt = beforeCursor.slice(lastAt + 1);
    if (afterAt.includes(" ") || afterAt.includes("\n")) {
      setAtMentionOpen(false);
      setAtMentionQuery("");
      return;
    }
    setAtMentionOpen(true);
    setAtMentionQuery(afterAt);
    setHighlightedIndex(0);
  }, []);

  const handleSelectAtItem = useCallback(
    (item: AtMentionItem) => {
      const container = contentEditableRef.current;
      if (!container || !onAddAttachment) return;
      const before = getTextBeforeCursor(container);
      const lastAt = before.lastIndexOf("@");
      if (lastAt === -1) {
        setAtMentionOpen(false);
        return;
      }
      const range = getRangeForCharacterOffset(container, lastAt, before.length);
      if (!range) {
        setAtMentionOpen(false);
        return;
      }
      const id = createAttachmentId();
      let attachment: RefAttachment;
      if (item.kind === "file") {
        attachment = {
          type: "projectFile",
          projectId: item.projectId,
          path: item.path,
          projectName: item.projectName,
          id,
        } satisfies ProjectFileAttachment;
      } else if (item.kind === "chat") {
        attachment = {
          type: "chat",
          chatId: item.chatId,
          title: item.title,
          id,
        } satisfies ChatAttachment;
      } else {
        attachment = {
          type: "project",
          projectId: item.projectId,
          name: item.name,
          id,
        } satisfies ProjectAttachment;
      }
      onAddAttachment(attachment);
      range.deleteContents();
      const chip = createChipSpan(attachment, id);
      range.insertNode(chip);
      range.collapse(false);
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
      setAtMentionOpen(false);
      setAtMentionQuery("");
      container.focus();
      setIsContentEmpty(container.innerText.trim() === "");
    },
    [onAddAttachment, createChipSpan, contentEditableRef]
  );

  const closeAtMention = useCallback(() => {
    setAtMentionOpen(false);
    setAtMentionQuery("");
  }, []);

  return {
    atMentionOpen,
    atMentionQuery,
    highlightedIndex,
    setHighlightedIndex,
    dropdownPosition,
    atDropdownRef,
    inputAnchorRef,
    parseAtMentionFromText,
    handleSelectAtItem,
    closeAtMention,
  };
}
