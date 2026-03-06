"use client";

import { useEffect } from "react";
import {
  SHORTCUT_REGISTRY,
  eventToKeyArray,
  keysToShortcutId,
} from "@/constants/keyboard-shortcuts";
import { useApp } from "@/context/app-context";

export function useKeyboardShortcuts() {
  const {
    shortcutOverrides,
    setCommandPaletteOpen,
    closeChat,
    activeChat,
    openChat,
    openChats,
    closeFile,
    activeFile,
    toggleTerminal,
    toggleSidebarLeft,
    toggleSidebarRight,
    toggleCodePanel,
  } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = eventToKeyArray(e);
      const id = keysToShortcutId(keys, shortcutOverrides, SHORTCUT_REGISTRY);
      if (!id) return;

      e.preventDefault();

      switch (id) {
        case "commandPalette":
          setCommandPaletteOpen(true);
          break;
        case "closeTab": {
          const activeEl = document.activeElement as Element | null;
          const inChatPanel = activeEl?.closest?.('[data-panel="chat"]');
          const editorPanel = document.querySelector('[data-panel="editor"]');
          if (inChatPanel && activeChat) {
            closeChat(activeChat);
          } else if (editorPanel?.contains(activeEl as Node) && activeFile) {
            closeFile(activeFile);
          }
          break;
        }
        case "toggleTerminal":
          toggleTerminal();
          break;
        case "closeOrNewChat":
          if (activeChat) {
            closeChat(activeChat);
          } else if (openChats.length === 0) {
            openChat(`new-${Date.now()}`);
          }
          break;
        case "newChatPane":
          openChat(`new-${Date.now()}`);
          break;
        case "toggleSidebarLeft":
          toggleSidebarLeft();
          break;
        case "toggleCodePanel":
          toggleCodePanel();
          break;
        case "toggleSidebarRight":
          toggleSidebarRight();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    shortcutOverrides,
    setCommandPaletteOpen,
    closeChat,
    activeChat,
    openChat,
    openChats,
    closeFile,
    activeFile,
    toggleTerminal,
    toggleSidebarLeft,
    toggleSidebarRight,
    toggleCodePanel,
  ]);
}
