export type FileStatus = "normal" | "modified" | "new" | "deleted";

export interface FileTreeNode {
  children?: FileTreeNode[];
  name: string;
  path: string;
  status?: FileStatus;
  type: "file" | "folder";
}
