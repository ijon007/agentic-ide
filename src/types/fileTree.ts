export type FileStatus = "normal" | "modified" | "new" | "deleted";

export interface FileTreeNode {
  name: string;
  path: string;
  type: "file" | "folder";
  status?: FileStatus;
  children?: FileTreeNode[];
}
