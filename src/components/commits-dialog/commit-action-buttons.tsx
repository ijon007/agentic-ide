"use client";

import { Button } from "@/components/ui/button";

export function CommitActionButtons({
  onCommit,
  onCommitAndPush,
}: {
  onCommit: () => void;
  onCommitAndPush: () => void;
}) {
  return (
    <div className="flex gap-2">
      <Button
        variant="default"
        onClick={onCommit}
        className="flex-1"
      >
        Commit
      </Button>
      <Button
        onClick={onCommitAndPush}
        className="flex-1"
        variant="outline"
      >
        Commit and Push
      </Button>
    </div>
  );
}
