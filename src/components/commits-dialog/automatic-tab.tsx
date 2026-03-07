"use client";

import { Textarea } from "@/components/ui/textarea";

const AGENT_MESSAGE =
  "The agent will commit every change, it will commit all the changes from the different projects by itself separately.";

export function AutomaticTab({
  instructions,
  onInstructionsChange,
}: {
  instructions: string;
  onInstructionsChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p
        className="text-sm/relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        {AGENT_MESSAGE}
      </p>
      <div className="flex flex-col gap-1.5">
        <label
          className="font-medium text-sm"
          style={{ color: "var(--text-primary)" }}
          htmlFor="commits-automatic-instructions"
        >
          Instructions for the agent
        </label>
        <Textarea
          id="commits-automatic-instructions"
          placeholder="Optional instructions for how the agent should commit..."
          value={instructions}
          onChange={(e) => onInstructionsChange(e.target.value)}
          className="min-h-20 resize-none text-sm"
          style={{
            backgroundColor: "var(--bg-elevated)",
            borderColor: "var(--border-subtle)",
          }}
        />
      </div>
    </div>
  );
}
