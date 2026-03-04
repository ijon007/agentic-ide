export type ToolCallStatus = "reading" | "wrote" | "running";

export interface ToolCallCard {
  id: string;
  verb: string;
  path?: string;
  status: ToolCallStatus;
  text?: string;
}

export interface DiffBlock {
  id: string;
  filePath: string;
  oldContent: string;
  newContent: string;
  unified?: string;
}

export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  toolCalls?: ToolCallCard[];
  diff?: DiffBlock;
  codeBlocks?: { language: string; code: string }[];
}
