"use client";

import { useEffect } from "react";
import { AppProvider, useApp } from "@/context/app-context";
import type { TerminalLayoutMode } from "@/context/app-context";
import { Titlebar } from "@/components/titlebar";
import { SidebarLeft } from "@/components/sidebar-left";
import { SidebarRight } from "@/components/sidebar-right";
import { CenterPanel } from "@/components/center-panel";
import { TerminalPanel } from "@/components/terminal-panel";
import { SettingsPanel } from "@/components/settings-panel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

function SidebarsAndCenter() {
  const { sidebarLeftVisible, sidebarRightVisible } = useApp();
  return (
    <ResizablePanelGroup
      key={`sidebars-${sidebarLeftVisible}-${sidebarRightVisible}`}
      orientation="horizontal"
      className="h-full"
      id="forge-sidebars"
    >
      {sidebarLeftVisible && (
        <ResizablePanel
          defaultSize="12"
          minSize="8"
          maxSize="35"
          className="min-w-[100px]"
        >
          <SidebarLeft />
        </ResizablePanel>
      )}
      <ResizablePanel
        defaultSize={
          sidebarLeftVisible && sidebarRightVisible
            ? "72"
            : sidebarLeftVisible || sidebarRightVisible
              ? "86"
              : "100"
        }
        minSize="25"
        className="min-w-0"
      >
        <CenterPanel />
      </ResizablePanel>
      {sidebarRightVisible && (
        <ResizablePanel
          defaultSize="12"
          minSize="8"
          maxSize="35"
          className="min-w-[100px]"
        >
          <SidebarRight />
        </ResizablePanel>
      )}
    </ResizablePanelGroup>
  );
}

function MainContentLayout() {
  const {
    terminalVisible,
    toggleTerminal,
    terminalLayoutMode,
    sidebarLeftVisible,
    sidebarRightVisible,
    toggleSidebarLeft,
    toggleSidebarRight,
  } = useApp();

  const { closeChat, activeChat } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "`") {
        e.preventDefault();
        toggleTerminal();
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        if (activeChat) closeChat(activeChat);
      }
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        toggleSidebarLeft();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebarRight();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTerminal, toggleSidebarLeft, toggleSidebarRight, closeChat, activeChat]);

  const showTerminal = terminalVisible;
  const mode: TerminalLayoutMode = terminalLayoutMode;

  if (!showTerminal) {
    return (
      <ResizablePanelGroup
        orientation="horizontal"
        className="flex flex-1 min-h-0"
        id="forge-main-horizontal"
      >
        <ResizablePanel defaultSize="100" minSize="0">
          <SidebarsAndCenter />
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }

  if (mode === "full") {
    return (
      <ResizablePanelGroup
        key="full"
        orientation="vertical"
        className="flex flex-1 min-h-0"
        id="forge-main-vertical"
      >
        <ResizablePanel defaultSize="70" minSize="0">
          <SidebarsAndCenter />
        </ResizablePanel>
        <ResizablePanel defaultSize="30" minSize="10" maxSize="100">
          <TerminalPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }

  if (mode === "center") {
    return (
      <ResizablePanelGroup
        key="center"
        orientation="horizontal"
        className="flex flex-1 min-h-0"
        id="forge-main-center-mode"
      >
        {sidebarLeftVisible && (
          <ResizablePanel defaultSize="12" minSize="8" maxSize="35" className="min-w-[100px]">
            <SidebarLeft />
          </ResizablePanel>
        )}
        <ResizablePanel
          defaultSize={sidebarLeftVisible && sidebarRightVisible ? "76" : "88"}
          minSize="25"
          className="min-w-0"
        >
          <ResizablePanelGroup orientation="vertical" className="h-full">
            <ResizablePanel defaultSize="70" minSize="5">
              <CenterPanel />
            </ResizablePanel>
            <ResizablePanel defaultSize="30" minSize="10" maxSize="95">
              <TerminalPanel />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        {sidebarRightVisible && (
          <ResizablePanel defaultSize="12" minSize="8" maxSize="35" className="min-w-[100px]">
            <SidebarRight />
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    );
  }

  if (mode === "center-right") {
    return (
      <ResizablePanelGroup
        key="center-right"
        orientation="horizontal"
        className="flex flex-1 min-h-0"
        id="forge-main-center-right-mode"
      >
        {sidebarLeftVisible && (
          <ResizablePanel defaultSize="12" minSize="8" maxSize="35" className="min-w-[100px]">
            <SidebarLeft />
          </ResizablePanel>
        )}
        <ResizablePanel
          defaultSize={sidebarLeftVisible ? "88" : "100"}
          minSize="25"
          className="min-w-0"
        >
          <ResizablePanelGroup orientation="vertical" className="h-full">
            <ResizablePanel defaultSize="70" minSize="5">
              <ResizablePanelGroup orientation="horizontal" className="h-full">
                <ResizablePanel
                  defaultSize={sidebarRightVisible ? "72" : "100"}
                  minSize="25"
                  className="min-w-0"
                >
                  <CenterPanel />
                </ResizablePanel>
                {sidebarRightVisible && (
                  <ResizablePanel defaultSize="28" minSize="8" maxSize="50" className="min-w-[100px]">
                    <SidebarRight />
                  </ResizablePanel>
                )}
              </ResizablePanelGroup>
            </ResizablePanel>
            <ResizablePanel defaultSize="30" minSize="10" maxSize="95">
              <TerminalPanel />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }

  if (mode === "center-left") {
    return (
      <ResizablePanelGroup
        key="center-left"
        orientation="horizontal"
        className="flex flex-1 min-h-0"
        id="forge-main-center-left-mode"
      >
        <ResizablePanel
          defaultSize={sidebarRightVisible ? "88" : "100"}
          minSize="25"
          className="min-w-0"
        >
          <ResizablePanelGroup orientation="vertical" className="h-full">
            <ResizablePanel defaultSize="70" minSize="5">
              <ResizablePanelGroup orientation="horizontal" className="h-full">
                {sidebarLeftVisible && (
                  <ResizablePanel defaultSize="28" minSize="8" maxSize="50" className="min-w-[100px]">
                    <SidebarLeft />
                  </ResizablePanel>
                )}
                <ResizablePanel
                  defaultSize={sidebarLeftVisible ? "72" : "100"}
                  minSize="25"
                  className="min-w-0"
                >
                  <CenterPanel />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            <ResizablePanel defaultSize="30" minSize="10" maxSize="95">
              <TerminalPanel />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        {sidebarRightVisible && (
          <ResizablePanel defaultSize="12" minSize="8" maxSize="35" className="min-w-[100px]">
            <SidebarRight />
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    );
  }

  return null;
}

function AppShellInner() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-screen w-screen min-w-[900px] min-h-[600px] flex-col overflow-hidden">
        <Titlebar />
        <MainContentLayout />
        <SettingsPanel />
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={() => window.history.back()}>
          Back
          <ContextMenuShortcut>Alt+←</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => window.location.reload()}>
          Refresh
          <ContextMenuShortcut>Ctrl+R</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export function AppShell() {
  return (
    <AppProvider>
      <AppShellInner />
    </AppProvider>
  );
}
