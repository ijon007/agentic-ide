"use client";

import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import { Button } from "@/components/ui/button";

export function CodeBlock({
  language,
  code,
}: {
  language: string;
  code: string;
}) {
  const [copied, setCopied] = useState(false);
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    codeToHtml(code, {
      lang: language || "plaintext",
      theme: "dark-plus",
    }).then((highlighted) => {
      if (!cancelled) setHtml(highlighted);
    });
    return () => {
      cancelled = true;
    };
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div
        className="flex items-center justify-between border-b px-2 py-1"
        style={{
          borderColor: "var(--border-subtle)",
          color: "var(--text-muted)",
        }}
      >
        <span className="font-mono text-xs uppercase">
          {language || "plaintext"}
        </span>
        <Button
          className="h-5 text-(--text-muted) hover:bg-(--bg-elevated) hover:text-(--text-primary)"
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
      </div>
      <div
        className="overflow-x-auto font-mono text-xs [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-0"
        style={{
          // Match Shiki dark-plus theme background so padding and code area are the same
          backgroundColor: "#1e1e1e",
        }}
      >
        {html ? (
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            style={{ color: "var(--text-code)" }}
            className="p-2"
          />
        ) : (
          <pre style={{ color: "var(--text-code)" }}>
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
