"use client";

import {
  CaretDownIcon,
  ImageIcon,
  InfinityIcon,
  PaperPlaneTiltIcon,
  StopIcon,
} from "@phosphor-icons/react";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MOCK_MODELS } from "@/constants/models";

export function ChatInputBottomBar({
  compact,
  model,
  setSelectedModel,
  isRunning,
  setIsRunning,
  onImageChange,
  onSend,
}: {
  compact?: boolean;
  model: { id: string; name: string };
  setSelectedModel: (id: string) => void;
  isRunning: boolean;
  setIsRunning: (v: boolean) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
}) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center justify-between gap-3 px-2 py-2">
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                className="gap-1.5 rounded-full"
                variant="secondary"
              />
            }
          >
            <InfinityIcon className="size-3.5 shrink-0" />
            Agent
            <CaretDownIcon className="size-3 shrink-0 opacity-70" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="min-w-[120px] border bg-(--bg-overlay)"
          >
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => {}}
            >
              Agent
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                className="gap-1.5"
                variant="ghost"
              />
            }
          >
            {model.name}
            <CaretDownIcon className="size-3 shrink-0 opacity-70" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="min-w-[160px] border"
          >
            <DropdownMenuRadioGroup
              value={model.id}
              onValueChange={(v) => v && setSelectedModel(v)}
            >
              {MOCK_MODELS.map((m) => (
                <DropdownMenuRadioItem
                  key={m.id}
                  value={m.id}
                  className="cursor-pointer"
                >
                  {m.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
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
            className="h-8 w-8 shrink-0 rounded-full bg-(--error) hover:bg-(--error)/90"
            onClick={() => setIsRunning(false)}
            size="icon"
          >
            <StopIcon className="size-4" />
          </Button>
        ) : (
          <Button
            onClick={onSend}
            size="icon"
            className="bg-foreground hover:bg-foreground/70 text-black rounded-full"
          >
            <PaperPlaneTiltIcon className="size-4" weight="fill" />
          </Button>
        )}
      </div>
    </div>
  );
}
