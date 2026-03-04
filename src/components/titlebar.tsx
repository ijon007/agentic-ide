"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp } from "@/context/app-context";
import type { TerminalLayoutMode } from "@/context/app-context";
import { MOCK_MODELS } from "@/constants/models";
import { MOCK_PROJECTS } from "@/constants/projects";
import { TerminalLayoutIcon } from "@/components/terminal-layout-icons";
import { GearIcon, ChatCircleIcon, FolderIcon, CaretDownIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const TERMINAL_LAYOUT_OPTIONS: { mode: TerminalLayoutMode; label: string }[] = [
  { mode: "full", label: "Full width at bottom" },
  { mode: "center", label: "Center panel only" },
  { mode: "center-right", label: "Center + right sidebar" },
  { mode: "center-left", label: "Center + left sidebar" },
];

export function Titlebar() {
  const {
    activeProject,
    selectedModel,
    setSelectedModel,
    settingsOpen,
    setSettingsOpen,
    terminalVisible,
    toggleTerminal,
    terminalLayoutMode,
    setTerminalLayoutMode,
    sidebarLeftVisible,
    sidebarRightVisible,
    toggleSidebarLeft,
    toggleSidebarRight,
  } = useApp();

  const project = MOCK_PROJECTS.find((p) => p.id === activeProject);
  const model = MOCK_MODELS.find((m) => m.id === selectedModel) ?? MOCK_MODELS[0];

  return (
    <header
      className="flex h-10 shrink-0 items-center justify-between border-b px-3"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
      }}
      data-tauri-drag-region
    >
      <div className="flex items-center gap-3">
        <span
          className="font-semibold text-[11px] uppercase tracking-wider"
          style={{ color: "var(--text-primary)" }}
        >
          forge
        </span>
        {project && (
          <span
            className="font-mono text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            {project.name}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Select
          value={model.id}
          onValueChange={(v) => { if (typeof v === "string") setSelectedModel(v); }}
        >
          <SelectTrigger
            className="h-7 min-w-0 border-0 bg-transparent px-2 text-xs hover:bg-[var(--bg-elevated)]"
            size="sm"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MOCK_MODELS.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className={cn(
                  "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]",
                  sidebarLeftVisible && "text-[var(--accent)]"
                )}
                onClick={toggleSidebarLeft}
              >
                <ChatCircleIcon className="size-3.5" />
              </Button>
            }
          />
          <TooltipContent
            side="bottom"
            className="text-[11px] bg-[var(--bg-overlay)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
          >
            Toggle chats (Ctrl+L)
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className={cn(
                  "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]",
                  sidebarRightVisible && "text-[var(--accent)]"
                )}
                onClick={toggleSidebarRight}
              >
                <FolderIcon className="size-3.5" />
              </Button>
            }
          />
          <TooltipContent
            side="bottom"
            className="text-[11px] bg-[var(--bg-overlay)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
          >
            Toggle files (Ctrl+B)
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className={cn(
                        "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] gap-0.5",
                        terminalVisible && "text-[var(--accent)]"
                      )}
                    />
                  }
                >
                  <TerminalLayoutIcon mode={terminalLayoutMode} />
                  <CaretDownIcon className="size-2.5 opacity-70" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="min-w-[220px] bg-[var(--bg-overlay)] border-[var(--border-subtle)]"
                >
                  <DropdownMenuRadioGroup
                    value={terminalLayoutMode}
                    onValueChange={(v) => {
                      if (v) {
                        setTerminalLayoutMode(v as TerminalLayoutMode);
                        if (!terminalVisible) toggleTerminal();
                      }
                    }}
                  >
                    {TERMINAL_LAYOUT_OPTIONS.map(({ mode, label }) => (
                      <DropdownMenuRadioItem key={mode} value={mode}>
                        <TerminalLayoutIcon mode={mode} className="mr-2" />
                        {label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={toggleTerminal}>
                    Hide terminal
                    <DropdownMenuShortcut>Ctrl+&#96;</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            }
          />
          <TooltipContent
            side="bottom"
            className="text-[11px] bg-[var(--bg-overlay)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
          >
            Terminal layout (Ctrl+`)
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                onClick={() => setSettingsOpen(true)}
              >
                <GearIcon className="size-3.5" />
              </Button>
            }
          />
          <TooltipContent
            side="bottom"
            className="text-[11px] bg-[var(--bg-overlay)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
          >
            Settings
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
