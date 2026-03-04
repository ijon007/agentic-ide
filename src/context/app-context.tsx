"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type TerminalLayoutMode = "full" | "center" | "center-right" | "center-left";

interface AppState {
  activeProject: string | null;
  activeChat: string | null;
  openChats: string[];
  selectedModel: string;
  openFiles: string[];
  activeFile: string | null;
  terminalVisible: boolean;
  terminalLayoutMode: TerminalLayoutMode;
  sidebarLeftVisible: boolean;
  sidebarRightVisible: boolean;
  settingsOpen: boolean;
}

interface AppContextValue extends AppState {
  setActiveProject: (id: string | null) => void;
  setActiveChat: (id: string | null) => void;
  setOpenChats: (ids: string[]) => void;
  setSelectedModel: (id: string) => void;
  setOpenFiles: (paths: string[]) => void;
  setActiveFile: (path: string | null) => void;
  setTerminalVisible: (visible: boolean) => void;
  setTerminalLayoutMode: (mode: TerminalLayoutMode) => void;
  setSettingsOpen: (open: boolean) => void;
  openFile: (path: string) => void;
  closeFile: (path: string) => void;
  openChat: (id: string) => void;
  closeChat: (id: string) => void;
  toggleTerminal: () => void;
  toggleSidebarLeft: () => void;
  toggleSidebarRight: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const initialState: AppState = {
  activeProject: "1",
  activeChat: "c1",
  openChats: ["c1"],
  selectedModel: "gpt-4o",
  openFiles: [],
  activeFile: null,
  terminalVisible: false,
  terminalLayoutMode: "full",
  sidebarLeftVisible: true,
  sidebarRightVisible: true,
  settingsOpen: false,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const setActiveProject = useCallback((id: string | null) => {
    setState((s) => ({ ...s, activeProject: id }));
  }, []);

  const setActiveChat = useCallback((id: string | null) => {
    setState((s) => ({ ...s, activeChat: id }));
  }, []);

  const setOpenChats = useCallback((ids: string[]) => {
    setState((s) => ({ ...s, openChats: ids }));
  }, []);

  const setSelectedModel = useCallback((id: string) => {
    setState((s) => ({ ...s, selectedModel: id }));
  }, []);

  const setOpenFiles = useCallback((paths: string[]) => {
    setState((s) => ({ ...s, openFiles: paths }));
  }, []);

  const setActiveFile = useCallback((path: string | null) => {
    setState((s) => ({ ...s, activeFile: path }));
  }, []);

  const setTerminalVisible = useCallback((visible: boolean) => {
    setState((s) => ({ ...s, terminalVisible: visible }));
  }, []);

  const setTerminalLayoutMode = useCallback((mode: TerminalLayoutMode) => {
    setState((s) => ({ ...s, terminalLayoutMode: mode }));
  }, []);

  const setSettingsOpen = useCallback((open: boolean) => {
    setState((s) => ({ ...s, settingsOpen: open }));
  }, []);

  const openFile = useCallback((path: string) => {
    setState((s) => {
      const openFiles = s.openFiles.includes(path)
        ? s.openFiles
        : [...s.openFiles, path];
      return {
        ...s,
        openFiles,
        activeFile: path,
      };
    });
  }, []);

  const closeFile = useCallback((path: string) => {
    setState((s) => {
      const openFiles = s.openFiles.filter((p) => p !== path);
      const activeFile =
        s.activeFile === path
          ? openFiles[openFiles.length - 1] ?? null
          : s.activeFile;
      return {
        ...s,
        openFiles,
        activeFile,
      };
    });
  }, []);

  const openChat = useCallback((id: string) => {
    setState((s) => {
      const openChats = s.openChats.includes(id)
        ? s.openChats
        : [...s.openChats, id];
      return {
        ...s,
        openChats,
        activeChat: id,
      };
    });
  }, []);

  const closeChat = useCallback((id: string) => {
    setState((s) => {
      const openChats = s.openChats.filter((c) => c !== id);
      const activeChat =
        s.activeChat === id
          ? openChats[openChats.length - 1] ?? null
          : s.activeChat;
      return {
        ...s,
        openChats,
        activeChat,
      };
    });
  }, []);

  const toggleTerminal = useCallback(() => {
    setState((s) => ({ ...s, terminalVisible: !s.terminalVisible }));
  }, []);

  const toggleSidebarLeft = useCallback(() => {
    setState((s) => ({ ...s, sidebarLeftVisible: !s.sidebarLeftVisible }));
  }, []);

  const toggleSidebarRight = useCallback(() => {
    setState((s) => ({ ...s, sidebarRightVisible: !s.sidebarRightVisible }));
  }, []);

  const value: AppContextValue = {
    ...state,
    setActiveProject,
    setActiveChat,
    setOpenChats,
    setSelectedModel,
    setOpenFiles,
    setActiveFile,
    setTerminalVisible,
    setTerminalLayoutMode,
    setSettingsOpen,
    openFile,
    closeFile,
    openChat,
    closeChat,
    toggleTerminal,
    toggleSidebarLeft,
    toggleSidebarRight,
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
