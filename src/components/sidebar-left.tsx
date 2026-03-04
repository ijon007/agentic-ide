"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApp } from "@/context/app-context";
import { MOCK_PROJECTS } from "@/constants/projects";
import { MOCK_CHATS } from "@/constants/chats";
import { formatTimestamp, truncate } from "@/utils/format";
import {
  FolderIcon,
  CaretRightIcon,
  ChatCircleIcon,
  PlusIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function SidebarLeft() {
  const {
    activeProject,
    activeChat,
    setActiveProject,
    openChat,
  } = useApp();
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set([activeProject ?? "1"])
  );
  const toggleProject = (id: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleNewChat = () => {
    openChat(`new-${Date.now()}`);
  };

  const handleSelectChat = (id: string) => {
    openChat(id);
  };

  return (
    <aside
      className="flex h-full w-full min-w-0 flex-col border-r"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div className="flex flex-col gap-2 p-3">
        <Button
          className="w-full justify-center"
          variant="ghost"
          onClick={handleNewChat}
        >
          <PlusIcon className="size-4" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1 scrollbar-hidden" hideScrollbar>
        <div className="flex flex-col gap-0.5 px-2 pb-4">
          {MOCK_PROJECTS.map((project) => {
            const isExpanded = expandedProjects.has(project.id);
            const projectChats = MOCK_CHATS.filter(
              (c) => c.projectId === project.id
            );

            return (
              <div key={project.id} className="flex flex-col">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-[var(--bg-elevated)]"
                  style={{ color: "var(--text-primary)" }}
                  onClick={() => {
                    toggleProject(project.id);
                    setActiveProject(project.id);
                  }}
                >
                    <CaretRightIcon
                      className={cn(
                        "size-4 shrink-0 transition-transform",
                      isExpanded && "rotate-90"
                    )}
                    style={{ color: "var(--text-secondary)" }}
                  />
                  <FolderIcon
                    className="size-4 shrink-0"
                    style={{ color: "var(--text-secondary)" }}
                  />
                  <span className="min-w-0 truncate">{project.name}</span>
                </button>

                {isExpanded &&
                  projectChats.map((chat) => {
                    const isActive = activeChat === chat.id;

                    return (
                      <div key={chat.id} className="ml-4 flex flex-col">
                        <button
                          type="button"
                          className={cn(
                            "group flex items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors",
                            isActive &&
                              "border-l-2 border-[var(--selection-border)] bg-[var(--selection-bg)]"
                          )}
                          style={{
                            color: isActive
                              ? "var(--text-primary)"
                              : "var(--text-secondary)",
                            borderLeftColor: isActive
                              ? "var(--selection-border)"
                              : "transparent",
                          }}
                          onClick={() => handleSelectChat(chat.id)}
                        >
                          <ChatCircleIcon
                            className="size-4 shrink-0"
                            style={{ color: "var(--text-muted)" }}
                          />
                          <span className="min-w-0 flex-1 truncate">
                            {truncate(chat.title, 28)}
                          </span>
                          <span
                            className="hidden text-xs font-mono group-hover:inline"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {formatTimestamp(chat.timestamp)}
                          </span>
                        </button>
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
