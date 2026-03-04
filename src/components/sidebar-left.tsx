"use client";

import {
  CaretRightIcon,
  ChatCircleIcon,
  FolderIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MOCK_CHATS } from "@/constants/chats";
import { MOCK_PROJECTS } from "@/constants/projects";
import { useApp } from "@/context/app-context";
import { cn } from "@/lib/utils";
import { formatTimestamp, truncate } from "@/utils/format";

export function SidebarLeft() {
  const { activeProject, activeChat, setActiveProject, openChat } = useApp();
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set([activeProject ?? "1"])
  );
  const toggleProject = (id: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
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
          onClick={handleNewChat}
          variant="outline"
        >
          <PlusIcon className="size-4" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="scrollbar-hidden flex-1" hideScrollbar>
        <div className="flex flex-col gap-0.5 px-2 pb-4">
          {MOCK_PROJECTS.map((project) => {
            const isExpanded = expandedProjects.has(project.id);
            const projectChats = MOCK_CHATS.filter(
              (c) => c.projectId === project.id
            );

            return (
              <div className="flex flex-col" key={project.id}>
                <button
                  className="flex items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-(--bg-elevated)"
                  onClick={() => {
                    toggleProject(project.id);
                    setActiveProject(project.id);
                  }}
                  style={{ color: "var(--text-primary)" }}
                  type="button"
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
                      <div className="ml-4 flex flex-col" key={chat.id}>
                        <button
                          className={cn(
                            "group flex items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors",
                            isActive &&
                              "border-(--selection-border) border-l-2 bg-(--selection-bg)"
                          )}
                          onClick={() => handleSelectChat(chat.id)}
                          style={{
                            color: isActive
                              ? "var(--text-primary)"
                              : "var(--text-secondary)",
                            borderLeftColor: isActive
                              ? "var(--selection-border)"
                              : "transparent",
                          }}
                          type="button"
                        >
                          <ChatCircleIcon
                            className="size-4 shrink-0"
                            style={{ color: "var(--text-muted)" }}
                          />
                          <span className="min-w-0 flex-1 truncate">
                            {truncate(chat.title, 28)}
                          </span>
                          <span
                            className="hidden font-mono text-xs group-hover:inline"
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
