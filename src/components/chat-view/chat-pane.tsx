"use client";

import {
  ChatCircleIcon,
  CheckCircleIcon,
  SpinnerIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useCallback } from "react";
import { MOCK_CHATS } from "@/constants/chats";
import { useApp } from "@/context/app-context";
import { truncate } from "@/utils/format";
import { ChatView } from "./index";
import { Button } from "@/components/ui/button";

interface ChatPaneProps {
  chatId: string;
}

export function ChatPane({ chatId }: ChatPaneProps) {
  const {
    closeChat,
    chatListMeta,
    generatingChatId,
    setActiveChat,
  } = useApp();

  const chat = MOCK_CHATS.find((c) => c.id === chatId);
  const title = chat ? truncate(chat.title, 28) : "New chat";
  const isGenerating = generatingChatId === chatId;
  const meta = chatListMeta[chatId];
  const hasFinishedTask = meta?.hasFinishedTask;

  const handleFocus = useCallback(() => {
    setActiveChat(chatId);
  }, [chatId, setActiveChat]);

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      closeChat(chatId);
    },
    [chatId, closeChat]
  );

  return (
    <div
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
      data-panel="chat"
      onFocusCapture={handleFocus}
      tabIndex={0}
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <div className="flex shrink-0 items-center justify-between gap-2 px-3 py-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {isGenerating ? (
            <SpinnerIcon
              className="size-4 shrink-0 animate-spin"
              style={{ color: "var(--text-muted)" }}
              weight="bold"
            />
          ) : hasFinishedTask ? (
            <CheckCircleIcon
              className="size-4 shrink-0"
              style={{ color: "var(--text-primary)" }}
              weight="fill"
            />
          ) : (
            <ChatCircleIcon
              className="size-4 shrink-0"
              style={{ color: "var(--text-muted)" }}
            />
          )}
          <span
            className="min-w-0 truncate text-sm"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </span>
        </div>
        <Button
          aria-label="Close chat"
          className="size-7 shrink-0 p-0"
          onClick={handleClose}
          variant="ghost"
        >
          <XIcon className="size-4" weight="bold" />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden" onClick={handleFocus}>
        <ChatView chatId={chatId} />
      </div>
    </div>
  );
}
