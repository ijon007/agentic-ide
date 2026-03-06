"use client";

import {
  CopyIcon,
  CpuIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyboardIcon,
  PlugIcon,
  SignOutIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Kbd, formatShortcutKeys, parseShortcutString } from "@/components/ui/kbd";
import { Switch } from "@/components/ui/switch";
import { MOCK_ACP_LIST } from "@/constants/chat-selectors";
import {
  getShortcutById,
  SHORTCUT_REGISTRY,
} from "@/constants/keyboard-shortcuts";
import { MOCK_MODELS } from "@/constants/models";
import { useApp } from "@/context/app-context";
import { cn } from "@/lib/utils";

type SettingsSection = "account" | "keyboardShortcuts" | "models" | "acpList";

const SECTIONS: { id: SettingsSection; label: string; Icon: typeof UserCircleIcon }[] = [
  { id: "account", label: "Account", Icon: UserCircleIcon },
  { id: "keyboardShortcuts", label: "Keyboard shortcuts", Icon: KeyboardIcon },
  { id: "models", label: "Models", Icon: CpuIcon },
  { id: "acpList", label: "ACP list", Icon: PlugIcon },
];

export function SettingsPanel() {
  const {
    settingsOpen,
    setSettingsOpen,
    selectedModel,
    setSelectedModel,
    enabledModelIds,
    setEnabledModelIds,
    installedAcpIds,
    setInstalledAcpIds,
    syncLayoutsAcrossWindows,
    setSyncLayoutsAcrossWindows,
    systemNotifications,
    setSystemNotifications,
    systemTrayIcon,
    setSystemTrayIcon,
    completionSound,
    setCompletionSound,
    shortcutOverrides,
    setShortcutOverrides,
  } = useApp();

  const [showApiKey, setShowApiKey] = useState(false);
  const [activeSection, setActiveSection] = useState<SettingsSection>("account");
  const [editingShortcutId, setEditingShortcutId] = useState<string | null>(null);
  const [shortcutInputValue, setShortcutInputValue] = useState("");

  const getEffectiveKeys = (shortcutId: string) => {
    const def = getShortcutById(shortcutId);
    if (!def) return [];
    return shortcutOverrides[shortcutId] ?? def.defaultKeys;
  };

  const startEditingShortcut = (id: string) => {
    const keys = getEffectiveKeys(id);
    setEditingShortcutId(id);
    setShortcutInputValue(formatShortcutKeys(keys));
  };

  const saveShortcut = (id: string) => {
    const parsed = parseShortcutString(shortcutInputValue);
    if (parsed.length > 0) {
      setShortcutOverrides((prev) => ({ ...prev, [id]: parsed }));
    } else {
      const def = getShortcutById(id);
      if (def) {
        setShortcutOverrides((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }
    }
    setEditingShortcutId(null);
  };

  const toggleModelEnabled = (modelId: string) => {
    setEnabledModelIds((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : [...prev, modelId]
    );
  };

  const installAcp = (acpId: string) => {
    setInstalledAcpIds((prev) =>
      prev.includes(acpId) ? prev : [...prev, acpId]
    );
  };

  return (
    <Dialog onOpenChange={setSettingsOpen} open={settingsOpen}>
      <DialogContent
        className="flex h-[520px] w-[90vw] max-w-[720px] gap-0 overflow-hidden p-0 ring-(--border-subtle)"
        showCloseButton={true}
        style={{ backgroundColor: "var(--bg-surface)" }}
      >
        <aside
          className="flex w-44 shrink-0 flex-col border-r py-3"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          {SECTIONS.map((section) => {
            const Icon = section.Icon;
            return (
              <button
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-left font-medium text-xs transition-colors",
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
                <Icon className="size-4 shrink-0" />
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
              Settings
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto p-4">
            {activeSection === "account" && (
              <section className="flex flex-col gap-6">
                <div>
                  <h3
                    className="mb-2 font-medium text-[11px] uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Profile
                  </h3>
                  <div
                    className="rounded-lg px-3 py-3 text-xs"
                    style={{
                      backgroundColor: "var(--bg-elevated)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Not signed in. Account features coming soon.
                  </div>
                </div>
                <Button
                  className="w-fit"
                  onClick={() => {}}
                  size="sm"
                  variant="outline"
                >
                  <SignOutIcon className="mr-2 size-3.5" />
                  Log out
                </Button>
                <div>
                  <div className="flex items-center justify-between gap-4 rounded-lg py-2">
                    <div>
                      <p
                        className="text-xs font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Sync layouts across windows
                      </p>
                      <p
                        className="text-[11px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Keep sidebar and panel layout in sync across all windows
                      </p>
                    </div>
                    <Switch
                      checked={syncLayoutsAcrossWindows}
                      onCheckedChange={setSyncLayoutsAcrossWindows}
                    />
                  </div>
                </div>
                <div>
                  <h3
                    className="mb-3 font-medium text-[11px] uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Notifications
                  </h3>
                  <div className="flex flex-col gap-1">
                    <div
                      className="flex items-center justify-between gap-4 rounded-lg border-b py-3"
                      style={{ borderColor: "var(--border-subtle)" }}
                    >
                      <div>
                        <p
                          className="text-xs font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          System Notifications
                        </p>
                        <p
                          className="text-[11px]"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Show system notifications when Agent completes or
                          needs attention
                        </p>
                      </div>
                      <Switch
                        checked={systemNotifications}
                        onCheckedChange={setSystemNotifications}
                      />
                    </div>
                    <div
                      className="flex items-center justify-between gap-4 rounded-lg border-b py-3"
                      style={{ borderColor: "var(--border-subtle)" }}
                    >
                      <div>
                        <p
                          className="text-xs font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          System Tray Icon
                        </p>
                        <p
                          className="text-[11px]"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Show Cursor in system tray
                        </p>
                      </div>
                      <Switch
                        checked={systemTrayIcon}
                        onCheckedChange={setSystemTrayIcon}
                      />
                    </div>
                    <div
                      className="flex items-center justify-between gap-4 rounded-lg py-3"
                      style={{ borderColor: "var(--border-subtle)" }}
                    >
                      <div>
                        <p
                          className="text-xs font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Completion Sound
                        </p>
                        <p
                          className="text-[11px]"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Play a sound when Agent finishes responding
                        </p>
                      </div>
                      <Switch
                        checked={completionSound}
                        onCheckedChange={setCompletionSound}
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeSection === "keyboardShortcuts" && (
              <section>
                <h3
                  className="mb-3 font-medium text-[11px] uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Keyboard shortcuts
                </h3>
                <p
                  className="mb-4 text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Click a shortcut to edit. Type the new keys and blur to save.
                </p>
                <div className="flex flex-col gap-2">
                  {SHORTCUT_REGISTRY.map((def) => (
                    <div
                      className="flex items-center justify-between gap-4 rounded-lg py-2"
                      key={def.id}
                      style={{ borderColor: "var(--border-subtle)" }}
                    >
                      <span
                        className="text-xs"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {def.label}
                      </span>
                      {editingShortcutId === def.id ? (
                        <Input
                          autoFocus
                          className="h-7 w-32 border-(--border-default) bg-(--bg-elevated) text-xs font-mono"
                          onBlur={() => saveShortcut(def.id)}
                          onChange={(e) =>
                            setShortcutInputValue(e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                          value={shortcutInputValue}
                        />
                      ) : (
                        <button
                          className="cursor-pointer rounded border border-(--border-default) bg-(--bg-elevated) px-2 py-1 font-mono text-[10px] transition-colors hover:bg-(--selection-bg)"
                          onClick={() => startEditingShortcut(def.id)}
                          type="button"
                        >
                          <Kbd keys={getEffectiveKeys(def.id)} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeSection === "models" && (
              <section className="flex flex-col gap-4">
                <div>
                  <label
                    className="mb-1.5 block text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Custom API Key
                  </label>
                  <div className="flex gap-1">
                    <Input
                      className="h-8 border-(--border-default) bg-(--bg-elevated) text-xs"
                      placeholder="sk-..."
                      type={showApiKey ? "text" : "password"}
                    />
                    <Button
                      className="h-8 w-8 shrink-0 border-(--border-default)"
                      onClick={() => setShowApiKey((s) => !s)}
                      size="icon"
                      variant="outline"
                    >
                      {showApiKey ? (
                        <EyeSlashIcon className="size-3.5" />
                      ) : (
                        <EyeIcon className="size-3.5" />
                      )}
                    </Button>
                    <Button
                      className="h-8 w-8 shrink-0 border-(--border-default)"
                      size="icon"
                      variant="outline"
                    >
                      <CopyIcon className="size-3.5" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p
                    className="mb-3 text-[11px]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Toggle which models appear in the model selector.
                  </p>
                  <div className="flex flex-col gap-2">
                    {MOCK_MODELS.map((model) => (
                      <div
                        className="flex items-center justify-between gap-4 rounded-lg borderpy-2.5 pl-3 pr-2"
                        key={model.id}
                        style={{
                          borderColor: "var(--border-subtle)",
                          backgroundColor: "var(--bg-elevated)",
                        }}
                      >
                        <div className="min-w-0 flex-1 p-2">
                          <p
                            className="text-xs font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {model.name}
                          </p>
                          <p
                            className="text-[11px]"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {model.provider} · {model.contextWindow}
                            {model.thinking ? " · Extended thinking" : ""}
                          </p>
                          <p
                            className="mt-0.5 text-[11px]"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {model.description}
                          </p>
                        </div>
                        <Switch
                          checked={enabledModelIds.includes(model.id)}
                          onCheckedChange={() => toggleModelEnabled(model.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {activeSection === "acpList" && (
              <section>
                <h3
                  className="mb-3 font-medium text-sm tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  ACP list
                </h3>
                <p
                  className="mb-4 text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Install ACPs to add them to the chat ACP selector.
                </p>
                <div className="flex flex-col gap-2">
                  {MOCK_ACP_LIST.map((acp) => {
                    const isInstalled = installedAcpIds.includes(acp.id);
                    const Icon = acp.Icon;
                    return (
                      <div
                        className="flex items-center justify-between gap-4 rounded-lg border py-2.5 pl-3 pr-2"
                        key={acp.id}
                        style={{
                          borderColor: "var(--border-subtle)",
                          backgroundColor: "var(--bg-elevated)",
                        }}
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3 p-2">
                          <Icon
                            className="size-5 shrink-0"
                          />
                          <div>
                            <p
                              className="text-xs font-medium"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {acp.name}
                            </p>
                            {acp.description && (
                              <p
                                className="text-[11px]"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                {acp.description}
                              </p>
                            )}
                          </div>
                        </div>
                        {isInstalled ? (
                          <Badge
                            className="shrink-0"
                            variant="secondary"
                          >
                            Added
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => installAcp(acp.id)}
                          >
                            Install
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
