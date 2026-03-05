import { MOCK_CHATS } from "@/constants/chats";
import { MOCK_FILE_TREE } from "@/constants/fileTree";
import { MOCK_PROJECTS } from "@/constants/projects";
import type { FileTreeNode } from "@/types/fileTree";

function flattenFiles(nodes: FileTreeNode[]): { path: string; name: string }[] {
  const result: { path: string; name: string }[] = [];
  for (const node of nodes) {
    if (node.type === "file") {
      result.push({ path: node.path, name: node.name });
    }
    if (node.children) {
      result.push(...flattenFiles(node.children));
    }
  }
  return result;
}

export type CommandPaletteProjectItem = {
  type: "project";
  id: string;
  title: string;
  subtitle: string;
};

export type CommandPaletteChatItem = {
  type: "chat";
  id: string;
  projectId: string;
  title: string;
  subtitle: string;
};

export type CommandPaletteFileItem = {
  type: "file";
  path: string;
  projectId: string;
  title: string;
  subtitle: string;
};

export type CommandPaletteItem =
  | CommandPaletteProjectItem
  | CommandPaletteChatItem
  | CommandPaletteFileItem;

export function getCommandPaletteItems(): {
  projects: CommandPaletteProjectItem[];
  chats: CommandPaletteChatItem[];
  files: CommandPaletteFileItem[];
} {
  const projects: CommandPaletteProjectItem[] = MOCK_PROJECTS.map(
    (project) => {
      const chatCount = MOCK_CHATS.filter(
        (c) => c.projectId === project.id
      ).length;
      return {
        type: "project",
        id: project.id,
        title: project.name,
        subtitle: `${chatCount} chat${chatCount === 1 ? "" : "s"}`,
      };
    }
  );

  const projectMap = new Map(MOCK_PROJECTS.map((p) => [p.id, p]));

  const chats: CommandPaletteChatItem[] = [...MOCK_CHATS]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .map((chat) => {
      const project = projectMap.get(chat.projectId);
      return {
        type: "chat",
        id: chat.id,
        projectId: chat.projectId,
        title: chat.title,
        subtitle: project?.name ?? "",
      };
    });

  const files: CommandPaletteFileItem[] = [];
  for (const project of MOCK_PROJECTS) {
    const tree = MOCK_FILE_TREE[project.id];
    if (!tree) continue;
    const flatFiles = flattenFiles(tree);
    for (const file of flatFiles) {
      files.push({
        type: "file",
        path: file.path,
        projectId: project.id,
        title: file.name,
        subtitle: project.name,
      });
    }
  }
  files.sort((a, b) => a.path.localeCompare(b.path));

  return { projects, chats, files };
}
