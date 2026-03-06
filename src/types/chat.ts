export interface Chat {
  id: string;
  projectId: string;
  timestamp: Date;
  title: string;
}

/** Per-chat state for sidebar list: generating, finished task, pending (unaccepted) line diffs */
export interface ChatListMeta {
  hasFinishedTask?: boolean;
  pendingAdditions?: number;
  pendingDeletions?: number;
}
