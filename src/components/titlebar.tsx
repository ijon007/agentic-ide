"use client";

import {
  CaretDownIcon,
  ChatCircleIcon,
  FolderIcon,
  GearIcon,
  MinusIcon,
  SquareIcon,
  SquaresFourIcon,
  XIcon,
} from "@phosphor-icons/react";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useCallback, useEffect, useState } from "react";
import { TerminalLayoutIcon } from "@/components/terminal-layout-icons";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MOCK_MODELS } from "@/constants/models";
import { MOCK_PROJECTS } from "@/constants/projects";
import type { TerminalLayoutMode } from "@/context/app-context";
import { useApp } from "@/context/app-context";
import { cn } from "@/lib/utils";

const TERMINAL_LAYOUT_OPTIONS: { mode: TerminalLayoutMode; label: string }[] = [
  { mode: "full", label: "Full width at bottom" },
  { mode: "center", label: "Center panel only" },
  { mode: "center-right", label: "Center + right sidebar" },
  { mode: "center-left", label: "Center + left sidebar" },
];

function useIsMaximized() {
  const [isMaximized, setIsMaximized] = useState(false);

  const update = useCallback(async () => {
    try {
      const maximized = await getCurrentWebviewWindow().isMaximized();
      setIsMaximized(maximized);
    } catch {
      /* not in Tauri */
    }
  }, []);

  useEffect(() => {
    update();
    let unlisten: (() => void) | undefined;
    void (async () => {
      try {
        unlisten = await getCurrentWebviewWindow().listen("tauri://resize", update);
      } catch {
        /* not in Tauri */
      }
    })();
    return () => {
      unlisten?.();
    };
  }, [update]);

  return isMaximized;
}

export function Titlebar() {
  const isMaximized = useIsMaximized();
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
  const model =
    MOCK_MODELS.find((m) => m.id === selectedModel) ?? MOCK_MODELS[0];

  return (
    <header
      className="flex h-10 shrink-0 items-center justify-between border-b px-3"
      data-tauri-drag-region
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
      }}
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
          onValueChange={(v) => {
            if (typeof v === "string") {
              setSelectedModel(v);
            }
          }}
          value={model.id}
        >
          <SelectTrigger
            className="h-7 min-w-0 border-0 bg-transparent px-2 text-xs hover:bg-(--bg-elevated)"
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
                className={cn(
                  "text-(--text-secondary) hover:bg-(--bg-elevated) hover:text-(--text-primary)",
                  sidebarLeftVisible && "text-accent"
                )}
                onClick={toggleSidebarLeft}
                size="icon-sm"
                variant="ghost"
              >
                <ChatCircleIcon className="size-3.5" />
              </Button>
            }
          />
          <TooltipContent
            className="border border-(--border-subtle) bg-(--bg-overlay) text-[11px] text-(--text-primary)"
            side="bottom"
          >
            Toggle chats (Ctrl+L)
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                className={cn(
                  "text-(--text-secondary) hover:bg-(--bg-elevated) hover:text-(--text-primary)",
                  sidebarRightVisible && "text-accent"
                )}
                onClick={toggleSidebarRight}
                size="icon-sm"
                variant="ghost"
              >
                <FolderIcon className="size-3.5" />
              </Button>
            }
          />
          <TooltipContent
            className="border border-(--border-subtle) bg-(--bg-overlay) text-[11px] text-(--text-primary)"
            side="bottom"
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
                      className={cn(
                        "gap-0.5 text-(--text-secondary) hover:bg-(--bg-elevated) hover:text-(--text-primary)",
                        terminalVisible && "text-accent"
                      )}
                      size="icon-sm"
                      variant="ghost"
                    />
                  }
                >
                  <TerminalLayoutIcon mode={terminalLayoutMode} />
                  <CaretDownIcon className="size-2.5 opacity-70" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="min-w-[220px] border-(--border-subtle) bg-(--bg-overlay)"
                >
                  <DropdownMenuRadioGroup
                    onValueChange={(v) => {
                      if (v) {
                        setTerminalLayoutMode(v as TerminalLayoutMode);
                        if (!terminalVisible) {
                          toggleTerminal();
                        }
                      }
                    }}
                    value={terminalLayoutMode}
                  >
                    {TERMINAL_LAYOUT_OPTIONS.map(({ mode, label }) => (
                      <DropdownMenuRadioItem key={mode} value={mode}>
                        <TerminalLayoutIcon className="mr-2" mode={mode} />
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
            className="border border-(--border-subtle) bg-(--bg-overlay) text-[11px] text-(--text-primary)"
            side="bottom"
          >
            Terminal layout (Ctrl+`)
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                className="text-(--text-secondary) hover:bg-(--bg-elevated) hover:text-(--text-primary)"
                onClick={() => setSettingsOpen(true)}
                size="icon-sm"
                variant="ghost"
              >
                <GearIcon className="size-3.5" />
              </Button>
            }
          />
          <TooltipContent
            className="border border-(--border-subtle) bg-(--bg-overlay) text-[11px] text-(--text-primary)"
            side="bottom"
          >
            Settings
          </TooltipContent>
        </Tooltip>
        <div
          className="ml-2 flex items-center border-l pl-2"
            style={{ borderColor: "var(--border-subtle)" }}
        >
            <button
            className="flex size-8 items-center justify-center rounded-lg text-(--text-secondary) transition-colors hover:bg-(--bg-elevated) hover:text-(--text-primary) cursor-pointer"
            onClick={async () => {
              try {
                await getCurrentWebviewWindow().minimize();
              } catch {
                /* not in Tauri */
              }
            }}
            title="Minimize"
            type="button"
          >
            <MinusIcon className="size-4" weight="bold" />
          </button>
          <button
            className="flex size-8 items-center justify-center rounded-lg text-(--text-secondary) transition-colors hover:bg-(--bg-elevated) hover:text-(--text-primary) cursor-pointer"
            onClick={() => {
              try {
                getCurrentWebviewWindow().toggleMaximize();
              } catch {
                /* not in Tauri */
              }
            }}
            title={isMaximized ? "Restore" : "Maximize"}
            type="button"
          >
            {isMaximized ? (
              <SquaresFourIcon className="size-3.5" weight="regular" />
            ) : (
              <SquareIcon className="size-3.5" weight="regular" />
            )}
          </button>
          <button
            className="flex size-8 items-center justify-center rounded-lg text-(--text-secondary) transition-colors hover:bg-(--error)/20 hover:text-(--error) cursor-pointer"
            onClick={async () => {
              try {
                await getCurrentWebviewWindow().close();
              } catch {
                /* not in Tauri */
              }
            }}
            title="Close"
            type="button"
          >
            <XIcon className="size-4" weight="bold" />
          </button>
        </div>
      </div>
    </header>
  );
}
