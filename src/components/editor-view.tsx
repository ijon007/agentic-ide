"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/app-context";
import { XIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.Editor),
  { ssr: false }
);

export function EditorView() {
  const {
    openFiles,
    activeFile,
    closeFile,
    setActiveFile,
  } = useApp();

  const handleCloseFile = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    closeFile(path);
  };

  const placeholderContent = `// Welcome to Forge IDE
// Open a file from the file tree to start editing.

function hello() {
  console.log("Hello, world!");
}
`;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden" style={{ backgroundColor: "var(--bg-base)" }}>
      {openFiles.length > 0 ? (
        <>
          <div
            className="flex h-9 shrink-0 items-center border-b"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            {openFiles.map((path) => (
              <div
                key={path}
                role="tab"
                tabIndex={0}
                className={cn(
                  "group flex cursor-pointer items-center gap-2 border-r px-3 py-1.5 font-mono text-xs transition-colors",
                  activeFile === path && "border-b-2 border-[var(--accent)]"
                )}
                style={{
                  borderColor: "var(--border-subtle)",
                  borderBottomColor:
                    activeFile === path ? "var(--accent)" : "transparent",
                  color:
                    activeFile === path
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                  backgroundColor:
                    activeFile === path ? "var(--bg-base)" : "transparent",
                }}
                onClick={() => setActiveFile(path)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveFile(path);
                  }
                }}
              >
                <span className="max-w-[120px] truncate">
                  {path.split("/").pop()}
                </span>
                <button
                  type="button"
                  className="opacity-0 hover:opacity-100 group-hover:opacity-70"
                  onClick={(e) => handleCloseFile(e, path)}
                >
                  <XIcon className="size-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="relative flex min-h-0 flex-1">
            <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
              <MonacoEditor
                height="100%"
                defaultLanguage="typescript"
                value={placeholderContent}
                theme="vs-dark"
                options={{
                  automaticLayout: true,
                  fontFamily: "Geist Mono, monospace",
                  fontSize: 12,
                  scrollbar: {
                    verticalScrollbarSize: 4,
                    horizontalScrollbarSize: 4,
                  },
                  minimap: { enabled: false },
                  padding: { top: 12 },
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <div
          className="flex flex-1 items-center justify-center font-mono text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          Open a file from the file tree
        </div>
      )}
    </div>
  );
}
