import { Button } from "@/components/ui/button";
import { ArrowUpIcon } from "@phosphor-icons/react";

export function CommitActionButtons({
  onCommit,
  onCommitAndPush,
}: {
  onCommit: () => void;
  onCommitAndPush: () => void;
}) {
  return (
    <div className="flex gap-2 w-full">
      <Button
        onClick={onCommitAndPush}
        className="bg-foreground text-background hover:bg-foreground/80 w-full"
      >
        <span className="text-sm font-medium">Continue</span>
      </Button>
    </div>
  );
}
