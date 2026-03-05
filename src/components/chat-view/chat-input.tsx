"use client";

import {
  CaretDownIcon,
  ImageIcon,
  InfinityIcon,
  PaperPlaneTiltIcon,
  StopIcon,
} from "@phosphor-icons/react";
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
import { useApp } from "@/context/app-context";
import { InputGroupTextarea } from "@/components/ui/input-group";

export function ChatInput({
  input,
  setInput,
  isRunning,
  setIsRunning,
  textareaRef,
  model,
  compact = false,
}: {
  input: string;
  setInput: (v: string) => void;
  isRunning: boolean;
  setIsRunning: (v: boolean) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  model: { id: string; name: string };
  compact?: boolean;
}) {
  const { setSelectedModel } = useApp();

  if (!compact) {
    return (
      <div
        className="flex w-full max-w-4xl flex-col overflow-hidden rounded-lg"
        style={{
          backgroundColor: "#282828",
          minHeight: 140,
        }}
      >
        <div className="flex flex-1 flex-col">
          <InputGroupTextarea
            ref={textareaRef as React.RefObject<HTMLTextAreaElement>}
            className="w-full flex-1 resize-none bg-transparent px-4 pt-4 text-lg outline-none placeholder:font-normal"
            onChange={(e) => setInput(e.target.value)}
            placeholder="Plan, @ for context, / for commands"
            rows={3}
            value={input}
          />
        </div>
        <div
          className="flex items-center justify-between gap-3 px-2 py-2"
        >
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
            <Button
              size="icon"
              variant="ghost"
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
                onClick={() => setIsRunning(true)}
                size="icon"
                className="bg-foreground hover:bg-foreground/70 text-black rounded-full"
              >
                <PaperPlaneTiltIcon className="size-4" weight="fill" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex w-full max-w-4xl flex-col overflow-hidden rounded-lg"
      style={{
        backgroundColor: "#282828",
        minHeight: 70,
      }}
    >
      <div className="flex flex-1 flex-col min-h-0">
        <InputGroupTextarea
          ref={textareaRef as React.RefObject<HTMLTextAreaElement>}
          className="w-full flex-1 min-h-9 resize-none bg-transparent px-4 pt-3 pb-1 text-lg outline-none placeholder:font-normal"
          onChange={(e) => setInput(e.target.value)}
          placeholder="Plan, @ for context, / for commands"
          rows={1}
          value={input}
        />
      </div>
      <div className="flex items-center justify-between gap-3 px-2 py-2">
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button className="gap-1.5" variant="secondary" />
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
                <Button className="gap-1.5" variant="ghost" />
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
          <Button size="icon" variant="ghost">
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
              onClick={() => setIsRunning(true)}
              size="icon"
              className="bg-foreground hover:bg-foreground/70 text-black rounded-full"
            >
              <PaperPlaneTiltIcon className="size-4" weight="fill" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
