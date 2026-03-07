"use client";

import {
  GitBranchIcon,
  GitCommitIcon,
  GitDiffIcon,
  GitForkIcon,
  GitMergeIcon,
  GitPullRequestIcon,
} from "@phosphor-icons/react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxSearchInput,
  ComboboxTrigger,
} from "@/components/ui/combobox";

const DEFAULT_BRANCHES = ["main", "develop"];

export type BranchState = "main" | "merge" | "fork" | "pr" | "commit" | "branch";

const BRANCH_ICONS: Record<BranchState, typeof GitBranchIcon> = {
  main: GitDiffIcon,
  merge: GitMergeIcon,
  fork: GitForkIcon,
  pr: GitPullRequestIcon,
  commit: GitCommitIcon,
  branch: GitBranchIcon,
};

function getBranchState(
  branch: string,
  branchStates?: Partial<Record<string, BranchState>>
): BranchState {
  if (branch === "main" || branch === "master") return "main";
  return branchStates?.[branch] ?? "branch";
}

function getBranchIcon(
  branch: string,
  branchStates?: Partial<Record<string, BranchState>>
) {
  const state = getBranchState(branch, branchStates);
  return BRANCH_ICONS[state];
}

export function BranchSelector({
  value,
  onValueChange,
  branches = DEFAULT_BRANCHES,
  branchStates,
  className,
}: {
  value: string;
  onValueChange: (branch: string) => void;
  branches?: string[];
  branchStates?: Partial<Record<string, BranchState>>;
  className?: string;
}) {
  const selectedBranch = useMemo(
    () => (value && branches.includes(value) ? value : branches[0] ?? "main"),
    [value, branches]
  );
  const TriggerIcon = getBranchIcon(selectedBranch, branchStates);

  return (
    <Combobox<string>
      value={selectedBranch}
      onValueChange={(b) => b != null && onValueChange(b)}
      items={branches}
      itemToStringLabel={(b) => b}
      itemToStringValue={(b) => b}
      isItemEqualToValue={(a, b) => a === b}
    >
      <ComboboxTrigger
        render={
          <Button
            className={className ?? "gap-1.5 min-w-[72px] justify-between text-xs"}
            variant="ghost"
          />
        }
      >
        <TriggerIcon className="size-3.5 shrink-0" />
        {selectedBranch}
      </ComboboxTrigger>
      <ComboboxContent
        align="start"
        className="min-w-[200px] w-(--anchor-width) rounded"
      >
        <ComboboxSearchInput placeholder="Search branches…" />
        <ComboboxEmpty>No branches found.</ComboboxEmpty>
        <ComboboxList className="rounded-b">
          {(branch: string) => {
            const Icon = getBranchIcon(branch, branchStates);
            return (
              <ComboboxItem key={branch} value={branch} className="cursor-pointer">
                <Icon className="size-3.5 shrink-0" />
                {branch}
              </ComboboxItem>
            );
          }}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
