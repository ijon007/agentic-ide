export type ToolCallStatus =
  | "pending"
  | "running"
  | "success"
  | "error"
  | "reading"   /* legacy: same as running */
  | "wrote";    /* legacy: same as success */

export type ToolCallCard =
  | {
      kind: "read_file";
      id: string;
      path: string;
      status: ToolCallStatus;
      error?: string;
    }
  | {
      kind: "write_file";
      id: string;
      path: string;
      status: ToolCallStatus;
      error?: string;
    }
  | {
      kind: "run_command";
      id: string;
      text: string;
      status: ToolCallStatus;
      output?: string;
      error?: string;
    }
  | {
      kind: "search";
      id: string;
      query: string;
      path?: string;
      resultCount?: number;
      status?: ToolCallStatus;
    }
  | {
      kind: "web_search";
      id: string;
      query: string;
      summary?: string;
      status?: ToolCallStatus;
    }
  | {
      kind: "apply_patch";
      id: string;
      path: string;
      status: ToolCallStatus;
      error?: string;
    }
  | {
      kind: "generic";
      id: string;
      verb: string;
      path?: string;
      text?: string;
      status: ToolCallStatus;
      error?: string;
    }
  /** Legacy format (no kind) - treat as generic when rendering */
  | {
      id: string;
      verb: string;
      path?: string;
      text?: string;
      status: ToolCallStatus;
    };

export function isLegacyToolCall(
  card: ToolCallCard
): card is { id: string; verb: string; path?: string; text?: string; status: ToolCallStatus } {
  return !("kind" in card);
}

export function normalizeToolCall(card: ToolCallCard): ToolCallCard & { kind: string } {
  if (isLegacyToolCall(card)) {
    return { kind: "generic", ...card };
  }
  return card as ToolCallCard & { kind: string };
}

export interface DiffBlock {
  filePath: string;
  id: string;
  newContent: string;
  oldContent: string;
  unified?: string;
}

export type SubagentStatus = "pending" | "running" | "done" | "error";

export interface SubagentBlock {
  id: string;
  name?: string;
  status: SubagentStatus;
  summary?: string;
  messages: ChatMessage[];
}

export interface FilesChangedBlock {
  files: DiffBlock[];
}

/** Serializable attachment for display in chat history */
export type DisplayAttachment =
  | { type: "chat"; chatId: string; title?: string; id: string }
  | { type: "project"; projectId: string; name?: string; id: string }
  | { type: "projectFile"; projectId: string; path: string; projectName?: string; id: string }
  | { type: "image"; id: string; url: string; name?: string };

export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  attachments?: DisplayAttachment[];
  codeBlocks?: { language: string; code: string }[];
  content: string;
  diff?: DiffBlock;
  filesChanged?: FilesChangedBlock;
  id: string;
  role: MessageRole;
  subagent?: SubagentBlock;
  toolCalls?: ToolCallCard[];
}
