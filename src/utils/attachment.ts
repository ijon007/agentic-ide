import type { Attachment } from "@/types/attachment";

export type RefAttachment = Extract<
  Attachment,
  { type: "file" | "projectFile" | "chat" | "project" }
>;

export function isDuplicateFile(
  attachments: Attachment[],
  file: File
): boolean {
  return attachments.some((a) => {
    if (a.type === "file" || a.type === "image") {
      return a.file.name === file.name && a.file.size === file.size;
    }
    return false;
  });
}

export function isImageAttachment(a: Attachment): a is Attachment & { type: "image" } {
  return a.type === "image";
}

export function isRefAttachment(
  a: Attachment
): a is Attachment & { type: "file" | "projectFile" | "chat" | "project" } {
  return (
    a.type === "file" ||
    a.type === "projectFile" ||
    a.type === "chat" ||
    a.type === "project"
  );
}

export function getRefLabel(a: RefAttachment): string {
  return a.type === "file"
    ? a.file.name
    : a.type === "projectFile"
      ? a.path.split("/").pop() ?? a.path
      : a.type === "chat"
        ? a.title ?? a.chatId
        : a.name ?? a.projectId;
}
