export interface Chat {
  id: string;
  projectId: string;
  timestamp: Date;
  title: string;
}

/** Per-chat state for sidebar list: generating, finished task, pending diffs, branch/worktree states */
export interface ChatListMeta {
  hasFinishedTask?: boolean;
  pendingAdditions?: number;
  pendingDeletions?: number;
  /** Branch was merged */
  branchMerged?: boolean;
  /** Branch is open (current or in use) */
  branchOpened?: boolean;
  /** Worktree is open for this chat */
  worktreeOpen?: boolean;
  /** Number of branches created in this chat (for badge) */
  branchesCount?: number;
  /** Number of worktrees created in this chat (for badge) */
  worktreesCount?: number;
}
