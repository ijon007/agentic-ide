"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "@/context/app-context";
import {
  createAttachmentId,
  type Attachment,
  type ImageAttachment,
} from "@/types/attachment";
import { getContentForSubmit } from "@/utils/contentEditable";
import {
  isDuplicateFile,
  isImageAttachment,
  isRefAttachment,
  type RefAttachment,
} from "@/utils/attachment";
import { cn } from "@/lib/utils";
import { AtMentionDropdown } from "./at-mention-dropdown";
import { ChatInputBottomBar } from "./chat-input-bottom-bar";
import { ContentEditableArea } from "./content-editable-area";
import { AttachmentsStrip } from "./attachments-strip";
import { useAtMention } from "./use-at-mention";
import { useAtMentionItems } from "./use-at-mention-items";
import { useContentHandlers } from "./use-content-handlers";

export function ChatInput({
  input,
  setInput,
  isRunning,
  setIsRunning,
  textareaRef,
  model,
  compact = false,
  attachments = [],
  onAddAttachment,
  onRemoveAttachment,
  onSend,
}: {
  input: string;
  setInput: (v: string) => void;
  isRunning: boolean;
  setIsRunning: (v: boolean) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  model: { id: string; name: string };
  compact?: boolean;
  attachments?: Attachment[];
  onAddAttachment?: (a: Attachment) => void;
  onRemoveAttachment?: (id: string) => void;
  onSend?: (text: string, attachments: Attachment[]) => void;
}) {
  const { setSelectedModel, activeChat, activeProject } = useApp();
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const [isContentEmpty, setIsContentEmpty] = useState(true);

  const addAttachment = useCallback(
    (a: Attachment) => onAddAttachment?.(a),
    [onAddAttachment]
  );
  const removeAttachment = useCallback(
    (id: string) => onRemoveAttachment?.(id),
    [onRemoveAttachment]
  );

  const atMention = useAtMention(
    contentEditableRef,
    onAddAttachment,
    onRemoveAttachment,
    setIsContentEmpty
  );
  const atMentionItems = useAtMentionItems(
    atMention.atMentionQuery,
    activeChat,
    activeProject
  );

  const contentHandlers = useContentHandlers(
    contentEditableRef,
    attachments,
    addAttachment,
    onAddAttachment,
    onRemoveAttachment,
    setIsContentEmpty,
    atMention.parseAtMentionFromText,
    atMention.atMentionOpen,
    atMentionItems,
    atMention.highlightedIndex,
    atMention.setHighlightedIndex,
    atMention.handleSelectAtItem,
    atMention.closeAtMention
  );

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files?.length || !onAddAttachment) return;
      for (const file of Array.from(files)) {
        if (file.type.startsWith("image/") && !isDuplicateFile(attachments, file)) {
          addAttachment({
            type: "image",
            file,
            id: createAttachmentId(),
          } satisfies ImageAttachment);
        }
      }
      e.target.value = "";
    },
    [onAddAttachment, attachments, addAttachment]
  );

  const handleSend = useCallback(() => {
    if (isRunning) return;
    const el = contentEditableRef.current;
    if (!el) return;
    const { text, refIds } = getContentForSubmit(el);
    const orderedRefs = refIds
      .map((id) => attachments.find((a) => a.id === id))
      .filter((a): a is RefAttachment => a != null && isRefAttachment(a));
    onSend?.(text, [...orderedRefs, ...attachments.filter(isImageAttachment)]);
    setIsRunning(true);
    el.innerHTML = "";
    setIsContentEmpty(true);
    setInput("");
  }, [isRunning, attachments, onSend, setInput]);

  useEffect(() => {
    if (input === "" && contentEditableRef.current) {
      contentEditableRef.current.innerHTML = "";
      setIsContentEmpty(true);
    }
  }, [input]);

  return (
    <div
      className="flex w-full max-w-4xl flex-col overflow-hidden rounded-lg"
      style={{
        backgroundColor: "#282828",
        minHeight: compact ? 70 : 140,
      }}
    >
      <AttachmentsStrip attachments={attachments} onRemove={removeAttachment} />
      <div
        ref={atMention.inputAnchorRef}
        className={cn("relative flex flex-1 flex-col", !compact && "min-h-0")}
      >
        <ContentEditableArea
          contentEditableRef={contentEditableRef}
          textareaRef={textareaRef}
          compact={compact}
          isContentEmpty={isContentEmpty}
          onInput={contentHandlers.handleContentInput}
          onKeyDown={contentHandlers.handleContentKeyDown}
          onPaste={contentHandlers.handleContentPaste}
        />
      </div>
      {atMention.atMentionOpen && (
        <AtMentionDropdown
          items={atMentionItems}
          highlightedIndex={atMention.highlightedIndex}
          onSelect={atMention.handleSelectAtItem}
          onHighlightChange={atMention.setHighlightedIndex}
          dropdownRef={atMention.atDropdownRef}
          position={atMention.dropdownPosition}
        />
      )}
      <ChatInputBottomBar
        compact={compact}
        model={model}
        setSelectedModel={setSelectedModel}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        onImageChange={handleImageChange}
        onSend={handleSend}
      />
    </div>
  );
}
