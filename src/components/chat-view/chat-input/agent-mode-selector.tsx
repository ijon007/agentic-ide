"use client";

import { CaretDownIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AGENT_MODES } from "@/constants/chat-selectors";
import type { AgentModeId } from "@/constants/chat-selectors";

export function AgentModeSelector({
  value,
  onValueChange,
}: {
  value: AgentModeId;
  onValueChange: (mode: AgentModeId) => void;
}) {
  const current = AGENT_MODES.find((m) => m.id === value) ?? AGENT_MODES[0];
  const Icon = current.Icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            className="gap-1.5"
            variant="ghost"
          />
        }
      >
        <Icon className="size-3.5 shrink-0" />
        {current.label}
        <CaretDownIcon className="size-3 shrink-0 opacity-70" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-[120px] border bg-(--bg-overlay)"
      >
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(v) => v && onValueChange(v as AgentModeId)}
        >
          {AGENT_MODES.map((mode) => {
            const ModeIcon = mode.Icon;
            return (
              <DropdownMenuRadioItem
                key={mode.id}
                value={mode.id}
                className="cursor-pointer"
              >
                <ModeIcon className="size-3.5 shrink-0" />
                {mode.label}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
