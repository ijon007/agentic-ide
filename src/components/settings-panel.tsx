"use client";

import { CopyIcon, EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MOCK_MODELS } from "@/constants/models";
import { useApp } from "@/context/app-context";
import { cn } from "@/lib/utils";

type SettingsSection = "appearance" | "models" | "account";

const SECTIONS: { id: SettingsSection; label: string }[] = [
  { id: "appearance", label: "Appearance" },
  { id: "models", label: "Models & API Keys" },
  { id: "account", label: "Account" },
];

export function SettingsPanel() {
  const { settingsOpen, setSettingsOpen, selectedModel, setSelectedModel } =
    useApp();
  const [showApiKey, setShowApiKey] = useState(false);
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("appearance");

  return (
    <Dialog onOpenChange={setSettingsOpen} open={settingsOpen}>
      <DialogContent
        className="flex h-[520px] w-[90vw] max-w-[720px] gap-0 overflow-hidden p-0 ring-(--border-subtle)"
        showCloseButton={true}
        style={{
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <aside
          className="flex w-44 shrink-0 flex-col border-r py-3"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          {SECTIONS.map((section) => (
            <button
              className={cn(
                "px-3 py-2 text-left font-medium text-xs transition-colors",
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
              {section.label}
            </button>
          ))}
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
            {activeSection === "appearance" && (
              <section>
                <h3
                  className="mb-3 font-medium text-[11px] uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Appearance
                </h3>
                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Theme: Dark (only option for now)
                  </label>
                </div>
              </section>
            )}
            {activeSection === "models" && (
              <section>
                <h3
                  className="mb-3 font-medium text-[11px] uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Models & API Keys
                </h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label
                      className="mb-1.5 block text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      OpenAI API Key
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
                    <label
                      className="mb-2 block text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Default Model
                    </label>
                    <div className="flex flex-col gap-1">
                      {MOCK_MODELS.map((model) => (
                        <label
                          className={cn(
                            "flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-(--bg-elevated)",
                            selectedModel === model.id && "bg-(--selection-bg)"
                          )}
                          key={model.id}
                        >
                          <input
                            checked={selectedModel === model.id}
                            className="size-3"
                            name="model"
                            onChange={() => setSelectedModel(model.id)}
                            type="radio"
                          />
                          <span
                            className="text-xs"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {model.name}
                          </span>
                          <span
                            className="text-[10px]"
                            style={{ color: "var(--text-muted)" }}
                          >
                            ({model.provider})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}
            {activeSection === "account" && (
              <section>
                <h3
                  className="mb-3 font-medium text-[11px] uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Account
                </h3>
                <div
                  className="rounded px-3 py-2 text-xs"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Not signed in. Account features coming soon.
                </div>
              </section>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
