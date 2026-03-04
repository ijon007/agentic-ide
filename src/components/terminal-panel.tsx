"use client";

import { Button } from "@/components/ui/button";
import { useApp } from "@/context/app-context";
import { MOCK_PROJECTS } from "@/constants/projects";
import { PlusIcon } from "@phosphor-icons/react";
export function TerminalPanel() {
  const { activeProject } = useApp();
  const project = MOCK_PROJECTS.find((p) => p.id === activeProject);

  return (
    <div
      className="flex h-full flex-col border-t"
      style={{
        backgroundColor: "var(--bg-base)",
        borderColor: "var(--border-default)",
      }}
    >
      <div
        className="flex h-8 items-center justify-between border-b px-2 shrink-0"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded px-2 py-1 font-mono text-[11px] transition-colors hover:bg-[var(--bg-elevated)]"
            style={{ color: "var(--text-secondary)" }}
          >
            terminal
          </button>
          <Button
            variant="ghost"
            size="xs"
            className="h-5 gap-1 px-2 text-[10px] text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-secondary)]"
          >
            <PlusIcon className="size-3" />
            New
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-3 font-mono text-xs" style={{ color: "var(--text-code)" }}>
        <div>
          user@{project?.name ?? "project"} ~{project?.path ?? "/path/to/project"} $
        </div>
      </div>
    </div>
  );
}
