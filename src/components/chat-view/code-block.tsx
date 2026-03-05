"use client";

import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CodeBlock({
  language,
  code,
}: {
  language: string;
  code: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="relative overflow-hidden rounded"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <Button
        className="absolute top-1 right-1 text-(--text-muted) hover:bg-(--bg-elevated) hover:text-(--text-primary)"
        onClick={handleCopy}
        size="icon-xs"
        variant="ghost"
      >
        {copied ? (
          <CheckIcon className="size-3" />
        ) : (
          <CopyIcon className="size-3" />
        )}
      </Button>
      <pre
        className="overflow-x-auto p-4 pr-10 font-mono text-xs"
        style={{ color: "var(--text-code)" }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
