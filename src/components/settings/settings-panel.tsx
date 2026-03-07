"use client";

import {
  CpuIcon,
  KeyboardIcon,
  PlugIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApp } from "@/context/app-context";
import { cn } from "@/lib/utils";
import { AccountSection } from "./account-section";
import { AcpListSection } from "./acp-list-section";
import { KeyboardShortcutsSection } from "./keyboard-shortcuts-section";
import { ModelsSection } from "./models-section";

export type SettingsSection = "account" | "keyboardShortcuts" | "models" | "acpList";

const SECTIONS: { id: SettingsSection; label: string; Icon: typeof UserCircleIcon }[] = [
  { id: "account", label: "Account", Icon: UserCircleIcon },
  { id: "keyboardShortcuts", label: "Keyboard shortcuts", Icon: KeyboardIcon },
  { id: "models", label: "Models", Icon: CpuIcon },
  { id: "acpList", label: "ACP list", Icon: PlugIcon },
];

export function SettingsPanel() {
  const { settingsOpen, setSettingsOpen } = useApp();
  const [activeSection, setActiveSection] = useState<SettingsSection>("account");

  return (
    <Dialog onOpenChange={setSettingsOpen} open={settingsOpen}>
      <DialogContent
        className="flex h-[520px] w-[90vw] max-w-[720px] gap-0 overflow-hidden p-0 ring-(--border-subtle)"
        showCloseButton={true}
        style={{ backgroundColor: "var(--bg-surface)" }}
      >
        <aside
          className="flex shrink-0 flex-col border-r py-3"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          {SECTIONS.map((section) => {
            const Icon = section.Icon;
            return (
              <button
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-left font-medium text-sm transition-colors cursor-pointer",
                  activeSection === section.id
                    ? "bg-(--selection-bg)"
                    : "hover:bg-(--bg-elevated)"
                )}
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                style={{
                  color:
                    activeSection === section.id
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                }}
                type="button"
              >
                <Icon className="size-4 shrink-0" weight="bold" />
                {section.label}
              </button>
            );
          })}
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <DialogHeader
            className="border-b px-4 py-3"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <DialogTitle
              className="font-medium text-sm"
              style={{ color: "var(--text-primary)" }}
            >
              {SECTIONS.find((s) => s.id === activeSection)?.label ?? "Settings"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto p-4">
            {activeSection === "account" && <AccountSection />}
            {activeSection === "keyboardShortcuts" && <KeyboardShortcutsSection />}
            {activeSection === "models" && <ModelsSection />}
            {activeSection === "acpList" && <AcpListSection />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
