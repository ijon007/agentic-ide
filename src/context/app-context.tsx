"use client";

import { MOCK_MODELS } from "@/constants/models";
import { DEFAULT_ACP_ID, MOCK_ACP_LIST } from "@/constants/chat-selectors";
import type { AgentModeId } from "@/constants/chat-selectors";
import type { ChatListMeta } from "@/types/chat";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const SETTINGS_STORAGE_KEY = "agentic-ide-settings";

interface PersistedSettings {
  enabledModelIds?: string[];
  installedAcpIds?: string[];
  syncLayoutsAcrossWindows?: boolean;
  systemNotifications?: boolean;
  systemTrayIcon?: boolean;
  completionSound?: boolean;
  shortcutOverrides?: Record<string, string[]>;
}

function loadPersistedSettings(): PersistedSettings {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as PersistedSettings;
  } catch {
    return {};
  }
}

function savePersistedSettings(settings: PersistedSettings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* ignore */
  }
}

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
  agentMode: AgentModeId;
  chatListMeta: Record<string, ChatListMeta>;
  codePanelVisible: boolean;
  commandPaletteOpen: boolean;
  completionSound: boolean;
  enabledModelIds: string[];
  focusedCenterPanel: FocusedCenterPanel;
  generatingChatId: string | null;
  installedAcpIds: string[];
  openChats: string[];
  openFiles: string[];
  selectedAcpId: string;
  selectedModel: string;
  settingsOpen: boolean;
  shortcutOverrides: Record<string, string[]>;
  sidebarLeftVisible: boolean;
  sidebarRightVisible: boolean;
  syncLayoutsAcrossWindows: boolean;
  systemNotifications: boolean;
  systemTrayIcon: boolean;
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
  setChatListMeta: (chatId: string, meta: Partial<ChatListMeta>) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setCompletionSound: (v: boolean) => void;
  setEnabledModelIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  setFocusedCenterPanel: (panel: FocusedCenterPanel) => void;
  setGeneratingChatId: (id: string | null) => void;
  setInstalledAcpIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  setOpenChats: (ids: string[]) => void;
  setOpenFiles: (paths: string[]) => void;
  setAgentMode: (mode: AgentModeId) => void;
  setSelectedAcpId: (id: string) => void;
  setSelectedModel: (id: string) => void;
  setSettingsOpen: (open: boolean) => void;
  setShortcutOverrides: (
    overrides:
      | Record<string, string[]>
      | ((prev: Record<string, string[]>) => Record<string, string[]>)
  ) => void;
  setSyncLayoutsAcrossWindows: (v: boolean) => void;
  setSystemNotifications: (v: boolean) => void;
  setSystemTrayIcon: (v: boolean) => void;
  setTerminalLayoutMode: (mode: TerminalLayoutMode) => void;
  setTerminalVisible: (visible: boolean) => void;
  toggleCodePanel: () => void;
  toggleSidebarLeft: () => void;
  toggleSidebarRight: () => void;
  toggleTerminal: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function getInitialState(): AppState {
  const persisted = loadPersistedSettings();
  const defaultModelIds = MOCK_MODELS.map((m) => m.id);
  const defaultAcpIds = [MOCK_ACP_LIST[0]?.id ?? "cursor"].filter(Boolean);
  return {
    activeProject: "1",
    activeChat: null,
    chatListMeta: {
      c1: { hasFinishedTask: true },
      c2: {},
      c3: { pendingAdditions: 5, pendingDeletions: 2 },
      c4: { hasFinishedTask: true, pendingAdditions: 3, pendingDeletions: 1 },
    },
    openChats: [],
    generatingChatId: "c2",
    selectedModel: "composer-1.5",
    selectedAcpId: DEFAULT_ACP_ID,
    agentMode: "agent",
    openFiles: [],
    activeFile: null,
    codePanelVisible: false,
    commandPaletteOpen: false,
    completionSound: persisted.completionSound ?? true,
    enabledModelIds: persisted.enabledModelIds ?? defaultModelIds,
    focusedCenterPanel: null,
    installedAcpIds: persisted.installedAcpIds ?? defaultAcpIds,
    shortcutOverrides: persisted.shortcutOverrides ?? {},
    syncLayoutsAcrossWindows: persisted.syncLayoutsAcrossWindows ?? false,
    systemNotifications: persisted.systemNotifications ?? true,
    systemTrayIcon: persisted.systemTrayIcon ?? true,
    terminalVisible: false,
    terminalLayoutMode: "full",
    sidebarLeftVisible: true,
    sidebarRightVisible: false,
    settingsOpen: false,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(getInitialState);

  useEffect(() => {
    savePersistedSettings({
      completionSound: state.completionSound,
      enabledModelIds: state.enabledModelIds,
      installedAcpIds: state.installedAcpIds,
      shortcutOverrides: state.shortcutOverrides,
      syncLayoutsAcrossWindows: state.syncLayoutsAcrossWindows,
      systemNotifications: state.systemNotifications,
      systemTrayIcon: state.systemTrayIcon,
    });
  }, [
    state.completionSound,
    state.enabledModelIds,
    state.installedAcpIds,
    state.shortcutOverrides,
    state.syncLayoutsAcrossWindows,
    state.systemNotifications,
    state.systemTrayIcon,
  ]);

  const setGeneratingChatId = useCallback((id: string | null) => {
    setState((s) => ({ ...s, generatingChatId: id }));
  }, []);

  const setChatListMeta = useCallback((chatId: string, meta: Partial<ChatListMeta>) => {
    setState((s) => ({
      ...s,
      chatListMeta: {
        ...s.chatListMeta,
        [chatId]: { ...s.chatListMeta[chatId], ...meta },
      },
    }));
  }, []);

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

  const setSelectedAcpId = useCallback((id: string) => {
    setState((s) => ({ ...s, selectedAcpId: id }));
  }, []);

  const setAgentMode = useCallback((mode: AgentModeId) => {
    setState((s) => ({ ...s, agentMode: mode }));
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

  const setCommandPaletteOpen = useCallback((open: boolean) => {
    setState((s) => ({ ...s, commandPaletteOpen: open }));
  }, []);

  const setCompletionSound = useCallback((v: boolean) => {
    setState((s) => ({ ...s, completionSound: v }));
  }, []);

  const setEnabledModelIds = useCallback(
    (ids: string[] | ((prev: string[]) => string[])) => {
      setState((s) => {
        const nextIds = typeof ids === "function" ? ids(s.enabledModelIds) : ids;
        const selectedStillEnabled = nextIds.includes(s.selectedModel);
        const nextSelected = selectedStillEnabled
          ? s.selectedModel
          : nextIds[0] ?? s.selectedModel;
        return {
          ...s,
          enabledModelIds: nextIds,
          selectedModel: nextSelected,
        };
      });
    },
    []
  );

  const setInstalledAcpIds = useCallback(
    (ids: string[] | ((prev: string[]) => string[])) => {
      setState((s) => {
        const nextIds = typeof ids === "function" ? ids(s.installedAcpIds) : ids;
        const selectedStillInstalled = nextIds.includes(s.selectedAcpId);
        const nextAcp = selectedStillInstalled
          ? s.selectedAcpId
          : nextIds[0] ?? s.selectedAcpId;
        return {
          ...s,
          installedAcpIds: nextIds,
          selectedAcpId: nextAcp,
        };
      });
    },
    []
  );

  const setShortcutOverrides = useCallback(
    (
      overrides:
        | Record<string, string[]>
        | ((prev: Record<string, string[]>) => Record<string, string[]>)
    ) => {
      setState((s) => ({
        ...s,
        shortcutOverrides:
          typeof overrides === "function" ? overrides(s.shortcutOverrides) : overrides,
      }));
    },
    []
  );

  const setSyncLayoutsAcrossWindows = useCallback((v: boolean) => {
    setState((s) => ({ ...s, syncLayoutsAcrossWindows: v }));
  }, []);

  const setSystemNotifications = useCallback((v: boolean) => {
    setState((s) => ({ ...s, systemNotifications: v }));
  }, []);

  const setSystemTrayIcon = useCallback((v: boolean) => {
    setState((s) => ({ ...s, systemTrayIcon: v }));
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
    setChatListMeta,
    setCommandPaletteOpen,
    setCompletionSound,
    setEnabledModelIds,
    setInstalledAcpIds,
    setOpenChats,
    setGeneratingChatId,
    setSelectedModel,
    setSelectedAcpId,
    setAgentMode,
    setOpenFiles,
    setActiveFile,
    setShortcutOverrides,
    setSyncLayoutsAcrossWindows,
    setSystemNotifications,
    setSystemTrayIcon,
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
