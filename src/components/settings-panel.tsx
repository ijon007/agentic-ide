"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApp } from "@/context/app-context";
import { MOCK_MODELS } from "@/constants/models";
import { EyeIcon, EyeSlashIcon, CopyIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
  const [activeSection, setActiveSection] = useState<SettingsSection>("appearance");

  return (
    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
      <DialogContent
        showCloseButton={true}
        className="flex h-[520px] max-w-[720px] w-[90vw] p-0 gap-0 overflow-hidden ring-[var(--border-subtle)]"
        style={{
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <aside
          className="w-44 shrink-0 flex flex-col border-r py-3"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "px-3 py-2 text-left text-xs font-medium transition-colors",
                activeSection === section.id
                  ? "bg-[var(--selection-bg)]"
                  : "hover:bg-[var(--bg-elevated)]"
              )}
              style={{
                color:
                  activeSection === section.id
                    ? "var(--text-primary)"
                    : "var(--text-muted)",
              }}
            >
              {section.label}
            </button>
          ))}
        </aside>
        <div className="flex-1 flex flex-col min-w-0">
          <DialogHeader className="border-b px-4 py-3" style={{ borderColor: "var(--border-subtle)" }}>
            <DialogTitle
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Settings
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto p-4">
            {activeSection === "appearance" && (
              <section>
                <h3
                  className="mb-3 text-[11px] font-medium uppercase tracking-wider"
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
                  className="mb-3 text-[11px] font-medium uppercase tracking-wider"
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
                        type={showApiKey ? "text" : "password"}
                        placeholder="sk-..."
                        className="h-8 border-[var(--border-default)] bg-[var(--bg-elevated)] text-xs"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 border-[var(--border-default)]"
                        onClick={() => setShowApiKey((s) => !s)}
                      >
                        {showApiKey ? (
                          <EyeSlashIcon className="size-3.5" />
                        ) : (
                          <EyeIcon className="size-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 border-[var(--border-default)]"
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
                          key={model.id}
                          className={cn(
                            "flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-[var(--bg-elevated)]",
                            selectedModel === model.id &&
                              "bg-[var(--selection-bg)]"
                          )}
                        >
                          <input
                            type="radio"
                            name="model"
                            checked={selectedModel === model.id}
                            onChange={() => setSelectedModel(model.id)}
                            className="size-3"
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
                  className="mb-3 text-[11px] font-medium uppercase tracking-wider"
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
