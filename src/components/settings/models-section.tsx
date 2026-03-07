"use client";

import { BrainIcon, CopyIcon, EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { MOCK_MODELS } from "@/constants/models";
import { useApp } from "@/context/app-context";

export function ModelsSection() {
  const { enabledModelIds, setEnabledModelIds } = useApp();
  const [showApiKey, setShowApiKey] = useState(false);

  const toggleModelEnabled = (modelId: string) => {
    setEnabledModelIds((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : [...prev, modelId]
    );
  };

  return (
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
              <EyeSlashIcon className="size-4" />
            ) : (
              <EyeIcon className="size-4" />
            )}
          </Button>
          <Button
            className="h-8 w-8 shrink-0 border-(--border-default)"
            size="icon"
            variant="outline"
          >
            <CopyIcon className="size-4" />
          </Button>
        </div>
      </div>
      <div>
        <p
          className="mb-3 text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Toggle which models appear in the model selector.
        </p>
        <div className="flex flex-col gap-2">
          {MOCK_MODELS.map((model) => (
            <div
              className="flex items-center justify-between gap-4 rounded border p-2"
              key={model.id}
              style={{
                borderColor: "var(--border-subtle)",
                backgroundColor: "var(--bg-elevated)",
              }}
            >
              <div className="flex flex-col items-start justify-center">
                <p
                  className="flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {model.name}
                  {model.thinking && (
                    <BrainIcon className="size-3 shrink-0" weight="bold" />
                  )}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  {model.provider} · {model.contextWindow}
                  {model.thinking ? " · Extended thinking" : ""}
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
  );
}
