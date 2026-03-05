"use client";

import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/message";
import { MessageContent } from "./blocks/message-content";

export function UserMessageBubble({ msg }: { msg: ChatMessage }) {
  return (
    <div className="flex justify-end">
      <div
        className={cn(
          "max-w-[80%] rounded-md py-2 leading-normal",
          "border border-foreground/10 bg-(--bg-elevated) px-3",
          "transition-colors hover:border-foreground/15 focus-within:border-foreground/20"
        )}
        style={{ color: "var(--text-primary)" }}
      >
        <MessageContent content={msg.content} />
        {msg.attachments && msg.attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {msg.attachments.map((a) => (
              <AttachmentChip key={a.id} attachment={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AttachmentChip({
  attachment,
}: {
  attachment: ChatMessage["attachments"] extends (infer A)[] ? A : never;
}) {
  if (!attachment) return null;
  const label =
    attachment.type === "chat"
      ? attachment.title ?? `Chat ${attachment.chatId.slice(0, 8)}`
      : attachment.type === "project"
        ? attachment.name ?? `Project ${attachment.projectId.slice(0, 8)}`
        : attachment.type === "projectFile"
          ? attachment.path
          : attachment.type === "image"
            ? attachment.name ?? "Image"
            : "Attachment";
  return (
    <span
      className="inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[11px] font-medium"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
        color: "var(--text-secondary)",
      }}
    >
      {attachment.type === "image" && (
        <img
          alt=""
          className="size-4 rounded object-cover"
          src={attachment.url}
        />
      )}
      {label}
    </span>
  );
}
