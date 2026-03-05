"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export function MessageContent({
  content,
  markdown = false,
}: {
  content: string;
  markdown?: boolean;
}) {
  if (!markdown) {
    return <div className="whitespace-pre-wrap">{content}</div>;
  }

  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none",
        "[&_pre]:rounded [&_pre]:bg-(--bg-surface) [&_pre]:p-3 [&_pre]:text-xs",
        "[&_code]:rounded [&_code]:bg-(--bg-surface) [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[11px]",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
        "[&_a]:text-(--accent) [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-(--accent-hover)",
        "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
        "[&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-semibold"
      )}
      style={{ color: "var(--text-primary)" }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
