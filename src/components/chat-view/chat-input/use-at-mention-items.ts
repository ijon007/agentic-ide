import { useMemo } from "react";
import { MOCK_CHATS } from "@/constants/chats";
import { MOCK_FILE_TREE } from "@/constants/fileTree";
import { MOCK_PROJECTS } from "@/constants/projects";
import { flattenFileTree } from "@/utils/fileTree";
import type { AtMentionItem } from "./at-mention-dropdown";

export function useAtMentionItems(
  atMentionQuery: string,
  activeChat: string | null,
  activeProject: string | null
): AtMentionItem[] {
  const projectNames = useMemo(
    () => Object.fromEntries(MOCK_PROJECTS.map((p) => [p.id, p.name])),
    []
  );
  const flatFiles = useMemo(
    () => flattenFileTree(MOCK_FILE_TREE, projectNames),
    [projectNames]
  );

  return useMemo((): AtMentionItem[] => {
    const q = atMentionQuery.toLowerCase().trim();
    const files: AtMentionItem[] = flatFiles.map((f) => ({
      kind: "file",
      projectId: f.projectId,
      path: f.path,
      projectName: f.projectName,
    }));
    const chats: AtMentionItem[] = MOCK_CHATS.filter((c) => c.id !== activeChat).map(
      (c) => {
        const p = MOCK_PROJECTS.find((x) => x.id === c.projectId);
        return {
          kind: "chat" as const,
          chatId: c.id,
          title: c.title,
          projectName: p?.name,
        };
      }
    );
    const projects: AtMentionItem[] = MOCK_PROJECTS.filter(
      (p) => p.id !== activeProject
    ).map((p) => ({ kind: "project" as const, projectId: p.id, name: p.name }));

    const all = [...files, ...chats, ...projects];
    if (!q) return all;
    return all.filter((item) => {
      const search =
        item.kind === "file"
          ? `${item.path} ${item.projectName ?? ""}`.toLowerCase()
          : item.kind === "chat"
            ? `${item.title} ${item.projectName ?? ""}`.toLowerCase()
            : `${item.name} ${item.projectId}`.toLowerCase();
      return search.includes(q);
    });
  }, [atMentionQuery, flatFiles, activeChat, activeProject]);
}
