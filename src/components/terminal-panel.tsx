"use client";

import "@xterm/xterm/css/xterm.css";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import { PlusIcon, TerminalIcon, XIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { spawn, type IPty } from "tauri-pty";
import { Button } from "@/components/ui/button";

const XTERM_THEME = {
  background: "#0e0e0e",
  foreground: "#c8c8c8",
  cursor: "#c8c8c8",
  cursorAccent: "#0e0e0e",
  selectionBackground: "#252525",
  selectionForeground: "#e8e8e8",
};

const GIT_BASH_PATH = "C:\\Program Files\\Git\\bin\\bash.exe";
const GIT_BASH_PATH_ALT = "C:\\Program Files (x86)\\Git\\bin\\bash.exe";

function getShell(): { file: string; args: string[]; fallback?: { file: string; args: string[] } } {
  if (typeof navigator !== "undefined" && navigator.platform.toLowerCase().startsWith("win")) {
    return {
      file: GIT_BASH_PATH,
      args: ["--login", "-i"],
      fallback: { file: "powershell.exe", args: [] },
    };
  }
  return { file: "/bin/bash", args: ["--login"] };
}

function spawnShell(cols: number, rows: number): IPty {
  const { file, args, fallback } = getShell();
  try {
    return spawn(file, args, { cols, rows });
  } catch {
    if (fallback) {
      return spawn(fallback.file, fallback.args, { cols, rows });
    }
    throw new Error(`Failed to spawn shell: ${file}`);
  }
}

function useIsTauri(): boolean {
  const [isTauri, setIsTauri] = useState(false);
  useEffect(() => {
    setIsTauri(typeof window !== "undefined" && "__TAURI__" in window);
  }, []);
  return isTauri;
}

interface TabState {
  id: string;
  label: string;
}

interface TerminalInstanceProps {
  tabId: string;
  isVisible: boolean;
}

function TerminalInstance({ tabId, isVisible }: TerminalInstanceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const ptyRef = useRef<IPty | null>(null);
  const dataDisposableRef = useRef<{ dispose: () => void } | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const cleanup = useCallback(() => {
    if (dataDisposableRef.current) {
      dataDisposableRef.current.dispose();
      dataDisposableRef.current = null;
    }
    if (ptyRef.current) {
      try {
        ptyRef.current.kill();
      } catch {
        /* ignore */
      }
      ptyRef.current = null;
    }
    if (resizeObserverRef.current && containerRef.current) {
      resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
    }
    if (termRef.current) {
      termRef.current.dispose();
      termRef.current = null;
    }
    fitAddonRef.current = null;
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const term = new Terminal({
      theme: XTERM_THEME,
      fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
      fontSize: 12,
      cursorBlink: true,
    });
    termRef.current = term;

    const fitAddon = new FitAddon();
    fitAddonRef.current = fitAddon;
    term.loadAddon(fitAddon);
    term.open(container);
    fitAddon.fit();

    let pty: IPty;
    try {
      pty = spawnShell(term.cols, term.rows);
    } catch (err) {
      term.dispose();
      fitAddonRef.current = null;
      termRef.current = null;
      return;
    }
    ptyRef.current = pty;

    const dataDisposable = pty.onData((data: Uint8Array) => {
      term.write(data);
    });
    dataDisposableRef.current = dataDisposable;

    term.onData((data: string) => {
      pty.write(data);
    });

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
      pty.resize(term.cols, term.rows);
    });
    resizeObserver.observe(container);
    resizeObserverRef.current = resizeObserver;

    return () => {
      cleanup();
    };
  }, [tabId, cleanup]);

  useEffect(() => {
    if (!isVisible || !containerRef.current || !fitAddonRef.current || !termRef.current) return;
    fitAddonRef.current.fit();
    if (ptyRef.current) {
      ptyRef.current.resize(termRef.current.cols, termRef.current.rows);
    }
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      className="terminal-container size-full min-h-0 overflow-hidden p-2"
      style={{
        visibility: isVisible ? "visible" : "hidden",
        position: "absolute",
        inset: 0,
        backgroundColor: "var(--bg-base)",
      }}
    />
  );
}

function nextTabLabel(tabs: TabState[]): string {
  const n = tabs.length + 1;
  return n === 1 ? "terminal" : `terminal ${n}`;
}

export function TerminalPanel() {
  const [tabs, setTabs] = useState<TabState[]>(() => [{ id: crypto.randomUUID(), label: "terminal" }]);
  const [activeTabId, setActiveTabId] = useState<string | null>(() => null);
  const isTauri = useIsTauri();

  const activeId = activeTabId ?? tabs[0]?.id ?? null;

  const addTab = useCallback(() => {
    const newTab: TabState = {
      id: crypto.randomUUID(),
      label: nextTabLabel(tabs),
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, [tabs.length]);

  const closeTab = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTabs((prev) => {
      const next = prev.filter((t) => t.id !== id);
      setActiveTabId((current) => {
        if (current === id) {
          const idx = prev.findIndex((t) => t.id === id);
          if (next.length === 0) return null;
          return next[Math.min(idx, next.length - 1)]?.id ?? next[0].id;
        }
        return current;
      });
      return next;
    });
  }, []);

  if (!isTauri) {
    return (
      <div
        className="flex h-full flex-col items-center justify-center gap-2 border-t p-4 text-center text-sm"
        style={{
          backgroundColor: "var(--bg-base)",
          borderColor: "var(--border-default)",
          color: "var(--text-secondary)",
        }}
      >
        <p>Terminal is only available in the desktop app.</p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Run with Tauri to use the integrated terminal.
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex h-full flex-col border-t"
      style={{
        backgroundColor: "var(--bg-base)",
        borderColor: "var(--border-default)",
      }}
    >
      <div
        className="flex h-8 shrink-0 items-center gap-0.5 border-b px-1"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className="flex items-center gap-1.5 rounded px-2 py-1.5 font-mono text-[11px] transition-colors hover:bg-(--bg-elevated)"
              style={{
                color: activeId === tab.id ? "var(--text-primary)" : "var(--text-secondary)",
                backgroundColor: activeId === tab.id ? "var(--bg-elevated)" : "transparent",
              }}
              type="button"
              onClick={() => setActiveTabId(tab.id)}
            >
              <TerminalIcon className="size-3.5 shrink-0" />
              <span className="truncate">{tab.label}</span>
              {tabs.length > 1 && (
                <span
                  className="rounded p-0.5 hover:bg-(--bg-overlay)"
                  role="button"
                  tabIndex={0}
                  onClick={(e) => closeTab(tab.id, e)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      closeTab(tab.id, e as unknown as React.MouseEvent);
                    }
                  }}
                  aria-label="Close tab"
                >
                  <XIcon className="size-3" style={{ color: "var(--text-muted)" }} />
                </span>
              )}
            </button>
          ))}
        </div>
        <Button
          className="h-6 shrink-0 gap-1 px-2 text-(--text-muted) text-[10px] hover:bg-(--bg-elevated) hover:text-(--text-secondary)"
          size="xs"
          variant="ghost"
          type="button"
          onClick={addTab}
        >
          <PlusIcon className="size-3" />
          New
        </Button>
      </div>
      <div className="terminal-panel-content min-h-0 flex-1">
        {tabs.map((tab) => (
          <TerminalInstance
            key={tab.id}
            tabId={tab.id}
            isVisible={activeId === tab.id}
          />
        ))}
      </div>
    </div>
  );
}
