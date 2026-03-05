"use client";

import type { ChatMessage } from "@/types/message";
import { UserMessageBubble } from "./user-message-bubble";
import { AssistantMessageBubble } from "./assistant-message-bubble";

export function MessageBubble({ msg }: { msg: ChatMessage }) {
  return msg.role === "user" ? (
    <UserMessageBubble msg={msg} />
  ) : (
    <AssistantMessageBubble msg={msg} />
  );
}
