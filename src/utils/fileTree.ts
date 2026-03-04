import type { FileTreeNode } from "@/types/fileTree";

export function buildTreeFromPaths(paths: string[]): FileTreeNode[] {
  const root: Map<string, FileTreeNode> = new Map();

  for (const path of paths) {
    const parts = path.split("/");
    let currentPath = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue;
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isFile = i === parts.length - 1;

      if (!root.has(currentPath)) {
        root.set(currentPath, {
          name: part,
          path: currentPath,
          type: isFile ? "file" : "folder",
          ...(isFile ? {} : { children: [] }),
        });
      }
    }
  }

  function buildHierarchy(nodes: FileTreeNode[]): FileTreeNode[] {
    const result: FileTreeNode[] = [];
    const seen = new Set<string>();

    for (const node of nodes) {
      if (seen.has(node.path)) continue;
      seen.add(node.path);

      if (node.type === "folder" && node.children) {
        node.children = buildHierarchy(
          nodes.filter((n) => n.path.startsWith(node.path + "/") && !n.path.slice(node.path.length + 1).includes("/"))
        );
      }
      result.push(node);
    }

    return result.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }

  return buildHierarchy(Array.from(root.values()));
}

export function getFileIcon(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  const icons: Record<string, string> = {
    ts: "file-ts",
    tsx: "file-tsx",
    js: "file-js",
    jsx: "file-jsx",
    json: "file-json",
    css: "file-css",
    html: "file-html",
    md: "file-md",
    rs: "file-rs",
  };
  return icons[ext] ?? "file";
}
