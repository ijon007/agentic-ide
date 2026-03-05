"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

export type TerminalLayoutMode =
  | "full"
  | "center"
  | "center-right"
  | "center-left";

type FocusedCenterPanel = "chat" | "editor" | null;

interface AppState {
  activeChat: string | null;
  activeFile: string | null;
  activeProject: string | null;
  codePanelVisible: boolean;
  focusedCenterPanel: FocusedCenterPanel;
  openChats: string[];
  openFiles: string[];
  selectedModel: string;
  settingsOpen: boolean;
  sidebarLeftVisible: boolean;
  sidebarRightVisible: boolean;
  terminalLayoutMode: TerminalLayoutMode;
  terminalVisible: boolean;
}

interface AppContextValue extends AppState {
  closeChat: (id: string) => void;
  closeFile: (path: string) => void;
  openChat: (id: string) => void;
  openFile: (path: string) => void;
  setActiveChat: (id: string | null) => void;
  setActiveFile: (path: string | null) => void;
  setActiveProject: (id: string | null) => void;
  setFocusedCenterPanel: (panel: FocusedCenterPanel) => void;
  setOpenChats: (ids: string[]) => void;
  setOpenFiles: (paths: string[]) => void;
  setSelectedModel: (id: string) => void;
  setSettingsOpen: (open: boolean) => void;
  setTerminalLayoutMode: (mode: TerminalLayoutMode) => void;
  setTerminalVisible: (visible: boolean) => void;
  toggleCodePanel: () => void;
  toggleSidebarLeft: () => void;
  toggleSidebarRight: () => void;
  toggleTerminal: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

/** Default: chat sidebar + chat view only; no file sidebar, no code panel, no terminal. */
const initialState: AppState = {
  activeProject: "1",
  activeChat: null,
  openChats: [],
  selectedModel: "composer-1.5",
  openFiles: [],
  activeFile: null,
  codePanelVisible: false,
  focusedCenterPanel: null,
  terminalVisible: false,
  terminalLayoutMode: "full",
  sidebarLeftVisible: true,
  sidebarRightVisible: false,
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

  const setFocusedCenterPanel = useCallback((panel: FocusedCenterPanel) => {
    setState((s) => ({ ...s, focusedCenterPanel: panel }));
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
        codePanelVisible: true,
      };
    });
  }, []);

  const closeFile = useCallback((path: string) => {
    setState((s) => {
      const openFiles = s.openFiles.filter((p) => p !== path);
      const activeFile =
        s.activeFile === path ? (openFiles.at(-1) ?? null) : s.activeFile;
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
        s.activeChat === id ? (openChats.at(-1) ?? null) : s.activeChat;
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

  const toggleCodePanel = useCallback(() => {
    setState((s) => ({ ...s, codePanelVisible: !s.codePanelVisible }));
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
    setFocusedCenterPanel,
    toggleCodePanel,
    toggleTerminal,
    toggleSidebarLeft,
    toggleSidebarRight,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within AppProvider");
  }
  return ctx;
}
