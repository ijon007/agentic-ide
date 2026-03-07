"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/context/app-context";
import { MOCK_PROJECTS } from "@/constants/projects";
import { AutomaticTab } from "./automatic-tab";
import { CommitActionButtons } from "./commit-action-buttons";
import {
  type ManualTabState,
  ManualTab,
} from "./manual-tab";

function getInitialManualState(activeProject: string | null): ManualTabState {
  const projectId =
    activeProject && MOCK_PROJECTS.some((p) => p.id === activeProject)
      ? activeProject
      : MOCK_PROJECTS[0]?.id ?? "";
  return {
    projectId,
    includeUnstaged: true,
    commitMessage: "",
    nextStep: "commit",
  };
}

export function CommitsDialogPanel() {
  const { commitsDialogOpen, setCommitsDialogOpen, activeProject } = useApp();
  const [automaticInstructions, setAutomaticInstructions] = useState("");
  const [manualState, setManualState] = useState<ManualTabState>(() =>
    getInitialManualState(activeProject)
  );

  const handleCommit = () => {
    // UI-only: wire to git later
  };

  const handleCommitAndPush = () => {
    // UI-only: wire to git later
  };

  return (
    <Dialog
      open={commitsDialogOpen}
      onOpenChange={setCommitsDialogOpen}
    >
      <DialogContent
        className="flex max-h-[90vh] w-full max-w-[420px] flex-col gap-0 overflow-hidden p-0 ring-(--border-subtle)"
        showCloseButton
        style={{ backgroundColor: "var(--bg-surface)" }}
      >
        <DialogHeader
          className="border-b px-4 py-2"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <DialogTitle
            className="font-medium text-sm"
            style={{ color: "var(--text-primary)" }}
          >
            Commit your changes
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList
            variant="line"
            className="mt-2 w-full px-2 py-1 rounded bg-transparent text-sm"
          >
            <TabsTrigger
              value="automatic"
              className="w-full"
            >
              Automatic
            </TabsTrigger>
            <TabsTrigger
              value="manual"
              className="w-full"
            >
              Manual
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto px-4 pb-4 pt-1">
            <TabsContent value="automatic" className="mt-0">
              <AutomaticTab
                instructions={automaticInstructions}
                onInstructionsChange={setAutomaticInstructions}
              />
            </TabsContent>
            <TabsContent value="manual" className="mt-0">
              <ManualTab
                state={manualState}
                onStateChange={(patch) =>
                  setManualState((s) => ({ ...s, ...patch }))
                }
              />
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter
          className="border-t px-4 py-3"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <CommitActionButtons
            onCommit={handleCommit}
            onCommitAndPush={handleCommitAndPush}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
