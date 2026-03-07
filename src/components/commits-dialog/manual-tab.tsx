"use client";

import {
  ArrowUpIcon,
  CaretDownIcon,
  CheckIcon,
  GitCommitIcon,
  GithubLogoIcon,
} from "@phosphor-icons/react";
import { MOCK_PROJECTS } from "@/constants/projects";
import type { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type ManualNextStep = "commit" | "commitAndPush" | "commitAndCreatePR";

export interface ManualTabState {
  projectId: string;
  includeUnstaged: boolean;
  commitMessage: string;
  nextStep: ManualNextStep;
}

const NEXT_STEPS: {
  value: ManualNextStep;
  label: string;
  subtext?: string;
  Icon: typeof GitCommitIcon;
}[] = [
  { value: "commit", label: "Commit", Icon: GitCommitIcon },
  { value: "commitAndPush", label: "Commit and push", Icon: ArrowUpIcon },
  {
    value: "commitAndCreatePR",
    label: "Commit and create PR",
    subtext: "Requires GH CLI",
    Icon: GithubLogoIcon,
  },
];

export function ManualTab({
  state,
  onStateChange,
  projects = MOCK_PROJECTS,
}: {
  state: ManualTabState;
  onStateChange: (patch: Partial<ManualTabState>) => void;
  projects?: Project[];
}) {
  const { projectId, includeUnstaged, commitMessage, nextStep } = state;
  const selectedProject = projects.find((p) => p.id === projectId);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label
          className="font-medium text-sm"
          style={{ color: "var(--text-primary)" }}
        >
          Project
        </label>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="default"
                className="w-full justify-between border-(--border-subtle) bg-(--bg-elevated) text-sm font-normal text-(--text-primary) hover:bg-(--bg-elevated)"
              >
                {selectedProject?.name ?? "Select project"}
                <CaretDownIcon className="size-4 shrink-0 opacity-70" />
              </Button>
            }
          />
          <DropdownMenuContent
            className="min-w-(--anchor-width) border-(--border-subtle) bg-(--bg-overlay)"
            align="start"
          >
            <DropdownMenuRadioGroup
              value={projectId}
              onValueChange={(v) => onStateChange({ projectId: v })}
            >
              {projects.map((p) => (
                <DropdownMenuRadioItem key={p.id} value={p.id}>
                  {p.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between gap-2">
        <label
          className="font-medium text-sm"
          style={{ color: "var(--text-primary)" }}
          htmlFor="commits-include-unstaged"
        >
          Include unstaged
        </label>
        <Switch
          id="commits-include-unstaged"
          checked={includeUnstaged}
          onCheckedChange={(v) => onStateChange({ includeUnstaged: v })}
          size="sm"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          className="font-medium text-sm"
          style={{ color: "var(--text-primary)" }}
          htmlFor="commits-message"
        >
          Commit message
        </label>
        <Textarea
          id="commits-message"
          placeholder="Leave blank to autogenerate a commit message"
          value={commitMessage}
          onChange={(e) => onStateChange({ commitMessage: e.target.value })}
          className="min-h-20 resize-none text-sm"
          style={{
            backgroundColor: "var(--bg-elevated)",
            borderColor: "var(--border-subtle)",
          }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span
          className="font-medium text-sm"
          style={{ color: "var(--text-primary)" }}
        >
          Next steps
        </span>
        <div
          className="flex flex-col rounded-md border p-1"
          style={{
            borderColor: "var(--border-subtle)",
            backgroundColor: "var(--bg-elevated)",
          }}
        >
          {NEXT_STEPS.map(({ value, label, subtext, Icon }) => (
            <Button
              key={value}
              onClick={() => onStateChange({ nextStep: value })}
              className={cn(
                "flex w-full items-center gap-2 text-left text-sm transition-colors cursor-pointer rounded",
                nextStep === value && "bg-(--selection-bg) hover:bg-(--selection-bg)"
              )}
            >
              <Icon className="size-4 shrink-0" weight="bold" />
              <span className="flex-1">{label}</span>
              {subtext && (
                <span
                  className="text-xs text-muted-foreground"
                  style={{ color: "var(--text-muted)" }}
                >
                  {subtext}
                </span>
              )}
              {nextStep === value && (
                <CheckIcon className="size-4 shrink-0" weight="bold" />
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
