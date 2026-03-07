"use client";

import { CaretDownIcon, CloudIcon, DesktopIcon, FolderOpenIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type EnvironmentId = "local" | "worktree" | "cloud";

const ENVIRONMENTS: { id: EnvironmentId; label: string; Icon: typeof DesktopIcon }[] = [
  { id: "local", label: "Local", Icon: DesktopIcon },
  { id: "worktree", label: "Worktree", Icon: FolderOpenIcon },
  { id: "cloud", label: "Cloud", Icon: CloudIcon },
];

export function EnvironmentSelector({
  value,
  onValueChange,
  className,
}: {
  value: EnvironmentId;
  onValueChange: (id: EnvironmentId) => void;
  className?: string;
}) {
  const current = ENVIRONMENTS.find((e) => e.id === value) ?? ENVIRONMENTS[0];
  const Icon = current.Icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            className={className ?? "gap-1.5 min-w-[72px] justify-between text-xs"}
            variant="ghost"
          />
        }
      >
        <Icon className="size-3" weight="bold" />
        {current.label}
        <CaretDownIcon className="size-3 shrink-0 opacity-70" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-[120px] border bg-(--bg-overlay)"
      >
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(v) => v && onValueChange(v as EnvironmentId)}
        >
          {ENVIRONMENTS.map((env) => {
            return (
              <DropdownMenuRadioItem
                key={env.id}
                value={env.id}
                className="cursor-pointer"
              >
                <env.Icon className="size-3" weight="bold" />
                {env.label}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
