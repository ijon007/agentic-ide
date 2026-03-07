"use client";

import { CenterPanel } from "@/components/center-panel";
import { CommitsDialogPanel } from "@/components/commits-dialog";
import { GlobalCommandPalette } from "@/components/command-palette";
import { SettingsPanel } from "@/components/settings/settings-panel";
import { SidebarLeft } from "@/components/sidebar-left";
import { SidebarRight } from "@/components/sidebar-right";
import { TerminalPanel } from "@/components/terminal-panel";
import { Titlebar } from "@/components/titlebar";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import type { TerminalLayoutMode } from "@/context/app-context";
import { AppProvider, useApp } from "@/context/app-context";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

function SidebarsAndCenter() {
  const { sidebarLeftVisible, sidebarRightVisible } = useApp();
  return (
    <ResizablePanelGroup
      className="h-full"
      id="forge-sidebars"
      key={`sidebars-${sidebarLeftVisible}-${sidebarRightVisible}`}
      orientation="horizontal"
    >
      {sidebarLeftVisible && (
        <ResizablePanel
          className="min-w-[100px]"
          defaultSize="12"
          maxSize="35"
          minSize="8"
        >
          <SidebarLeft />
        </ResizablePanel>
      )}
      <ResizablePanel
        className="min-w-0"
        defaultSize={
          sidebarLeftVisible && sidebarRightVisible
            ? "72"
            : sidebarLeftVisible || sidebarRightVisible
              ? "86"
              : "100"
        }
        minSize="25"
      >    
        <CenterPanel />
      </ResizablePanel>
      {sidebarRightVisible && (
        <ResizablePanel
          className="min-w-[200px]"
          defaultSize="12"
          maxSize="35"
          minSize="8"
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
    terminalLayoutMode,
    sidebarLeftVisible,
    sidebarRightVisible,
  } = useApp();

  useKeyboardShortcuts();

  const showTerminal = terminalVisible;
  const mode: TerminalLayoutMode = terminalLayoutMode;

  if (!showTerminal) {
    return (
      <ResizablePanelGroup
        className="flex min-h-0 flex-1"
        id="forge-main-horizontal"
        orientation="horizontal"
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
        className="flex min-h-0 flex-1"
        id="forge-main-vertical"
        key="full"
        orientation="vertical"
      >
        <ResizablePanel defaultSize="70" minSize="0">
          <SidebarsAndCenter />
        </ResizablePanel>
        <ResizablePanel defaultSize="30" maxSize="100" minSize="10">
          <TerminalPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }

  if (mode === "center") {
    return (
      <ResizablePanelGroup
        className="flex min-h-0 flex-1"
        id="forge-main-center-mode"
        key="center"
        orientation="horizontal"
      >
        {sidebarLeftVisible && (
          <ResizablePanel
            className="min-w-[100px]"
            defaultSize="12"
            maxSize="35"
            minSize="8"
          >
            <SidebarLeft />
          </ResizablePanel>
        )}
        <ResizablePanel
          className="min-w-0"
          defaultSize={sidebarLeftVisible && sidebarRightVisible ? "76" : "88"}
          minSize="25"
        >
          <ResizablePanelGroup className="h-full" orientation="vertical">
            <ResizablePanel defaultSize="70" minSize="5">
              <CenterPanel />
            </ResizablePanel>
            <ResizablePanel defaultSize="30" maxSize="95" minSize="10">
              <TerminalPanel />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        {sidebarRightVisible && (
          <ResizablePanel
            className="min-w-[200px]"
            defaultSize="12"
            maxSize="35"
            minSize="8"
          >
            <SidebarRight />
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    );
  }

  if (mode === "center-right") {
    return (
      <ResizablePanelGroup
        className="flex min-h-0 flex-1"
        id="forge-main-center-right-mode"
        key="center-right"
        orientation="horizontal"
      >
        {sidebarLeftVisible && (
          <ResizablePanel
            className="min-w-[100px]"
            defaultSize="12"
            maxSize="35"
            minSize="8"
          >
            <SidebarLeft />
          </ResizablePanel>
        )}
        <ResizablePanel
          className="min-w-0"
          defaultSize={sidebarLeftVisible ? "88" : "100"}
          minSize="25"
        >
          <ResizablePanelGroup className="h-full" orientation="vertical">
            <ResizablePanel defaultSize="70" minSize="5">
              <ResizablePanelGroup className="h-full" orientation="horizontal">
                <ResizablePanel
                  className="min-w-0"
                  defaultSize={sidebarRightVisible ? "72" : "100"}
                  minSize="25"
                >
                  <CenterPanel />
                </ResizablePanel>
                {sidebarRightVisible && (
                  <ResizablePanel
                    className="min-w-[200px]"
                    defaultSize="28"
                    maxSize="50"
                    minSize="8"
                  >
                    <SidebarRight />
                  </ResizablePanel>
                )}
              </ResizablePanelGroup>
            </ResizablePanel>
            <ResizablePanel defaultSize="30" maxSize="95" minSize="10">
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
        className="flex min-h-0 flex-1"
        id="forge-main-center-left-mode"
        key="center-left"
        orientation="horizontal"
      >
        <ResizablePanel
          className="min-w-0"
          defaultSize={sidebarRightVisible ? "88" : "100"}
          minSize="25"
        >
          <ResizablePanelGroup className="h-full" orientation="vertical">
            <ResizablePanel defaultSize="70" minSize="5">
              <ResizablePanelGroup className="h-full" orientation="horizontal">
                {sidebarLeftVisible && (
                  <ResizablePanel
                    className="min-w-[100px]"
                    defaultSize="28"
                    maxSize="50"
                    minSize="8"
                  >
                    <SidebarLeft />
                  </ResizablePanel>
                )}
                <ResizablePanel
                  className="min-w-0"
                  defaultSize={sidebarLeftVisible ? "72" : "100"}
                  minSize="25"
                >
                  <CenterPanel />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            <ResizablePanel defaultSize="30" maxSize="95" minSize="10">
              <TerminalPanel />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        {sidebarRightVisible && (
          <ResizablePanel
            className="min-w-[200px]"
            defaultSize="12"
            maxSize="35"
            minSize="8"
          >
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
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <Titlebar />
      <MainContentLayout />
      <SettingsPanel />
      <CommitsDialogPanel />
      <GlobalCommandPalette />
    </div>
  );
}

export function AppShell() {
  return (
    <AppProvider>
      <AppShellInner />
    </AppProvider>
  );
}
