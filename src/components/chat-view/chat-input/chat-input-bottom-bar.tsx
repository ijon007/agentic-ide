"use client";

import {
  ImageIcon,
  PaperPlaneTiltIcon,
  StopIcon,
} from "@phosphor-icons/react";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import type { AgentModeId } from "@/constants/chat-selectors";
import { AcpSelector } from "./acp-selector";
import { AgentModeSelector } from "./agent-mode-selector";
import { ModelSelector } from "./model-selector";

export function ChatInputBottomBar({
  compact,
  model,
  setSelectedModel,
  selectedAcpId,
  setSelectedAcpId,
  agentMode,
  setAgentMode,
  isRunning,
  setIsRunning,
  onImageChange,
  onSend,
}: {
  compact?: boolean;
  model: { id: string; name: string };
  setSelectedModel: (id: string) => void;
  selectedAcpId: string;
  setSelectedAcpId: (id: string) => void;
  agentMode: AgentModeId;
  setAgentMode: (mode: AgentModeId) => void;
  isRunning: boolean;
  setIsRunning: (v: boolean) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
}) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center justify-between gap-3 px-2 py-2">
      <div className="flex items-center gap-1">
        <AcpSelector
          value={selectedAcpId}
          onValueChange={setSelectedAcpId}
        />
        <AgentModeSelector
          value={agentMode}
          onValueChange={setAgentMode}
        />
        <ModelSelector
          value={model}
          onValueChange={setSelectedModel}
        />
      </div>
      <div className="flex items-center gap-1">
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onImageChange}
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={() => imageInputRef.current?.click()}
        >
          <ImageIcon className="size-4" />
        </Button>
        {isRunning ? (
          <Button
            className="rounded-full bg-(--error) hover:bg-(--error)/90 flex items-center justify-center"
            onClick={() => setIsRunning(false)}
            size="icon"
          >
            <StopIcon className="size-4" weight="fill" />
          </Button>
        ) : (
          <Button
            onClick={onSend}
            size="icon"
            className="bg-foreground hover:bg-foreground/70 text-black rounded-full "
          >
            <PaperPlaneTiltIcon className="size-4" weight="fill" />
          </Button>
        )}
      </div>
    </div>
  );
}
