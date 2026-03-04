export type ToolCallStatus = "reading" | "wrote" | "running";

export interface ToolCallCard {
  id: string;
  path?: string;
  status: ToolCallStatus;
  text?: string;
  verb: string;
}

export interface DiffBlock {
  filePath: string;
  id: string;
  newContent: string;
  oldContent: string;
  unified?: string;
}

export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  codeBlocks?: { language: string; code: string }[];
  content: string;
  diff?: DiffBlock;
  id: string;
  role: MessageRole;
  toolCalls?: ToolCallCard[];
}
