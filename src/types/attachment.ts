export interface FileAttachment {
  type: "file";
  file: File;
  id: string;
}

export interface ImageAttachment {
  type: "image";
  file: File;
  id: string;
}

export interface ChatAttachment {
  type: "chat";
  chatId: string;
  title?: string;
  id: string;
}

export interface ProjectAttachment {
  type: "project";
  projectId: string;
  name?: string;
  id: string;
}

export interface ProjectFileAttachment {
  type: "projectFile";
  projectId: string;
  path: string;
  projectName?: string;
  id: string;
}

export type Attachment =
  | FileAttachment
  | ImageAttachment
  | ChatAttachment
  | ProjectAttachment
  | ProjectFileAttachment;

export function createAttachmentId(): string {
  return crypto.randomUUID();
}
