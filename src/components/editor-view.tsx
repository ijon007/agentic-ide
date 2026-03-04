"use client";

import { XIcon } from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import { useApp } from "@/context/app-context";
import { cn } from "@/lib/utils";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.Editor),
  { ssr: false }
);

function useForgeTheme() {
  return (monaco: { editor: { defineTheme: (name: string, theme: object) => void } }) => {
    monaco.editor.defineTheme("forge-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0e0e0e",
      },
    });
  };
}

export function EditorView() {
  const { openFiles, activeFile, closeFile, setActiveFile } = useApp();
  const beforeMount = useForgeTheme();

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
    <div
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      {openFiles.length > 0 ? (
        <>
          <div
            className="flex h-9 shrink-0 items-stretch"
            style={{ backgroundColor: "var(--bg-surface)" }}
          >
            {openFiles.map((path) => (
              <div
                className={cn(
                  "group flex cursor-pointer items-center gap-2 border-r px-3 py-1.5 font-mono text-xs transition-colors",
                  activeFile !== path && "border-b"
                )}
                key={path}
                onClick={() => setActiveFile(path)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveFile(path);
                  }
                }}
                role="tab"
                style={{
                  borderColor: "var(--border-subtle)",
                  color:
                    activeFile === path
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                  backgroundColor:
                    activeFile === path ? "var(--bg-base)" : "transparent",
                }}
                tabIndex={0}
              >
                <span className="max-w-[120px] truncate">
                  {path.split("/").pop()}
                </span>
                <button
                  className="opacity-0 hover:opacity-100 group-hover:opacity-70"
                  onClick={(e) => handleCloseFile(e, path)}
                  type="button"
                >
                  <XIcon className="size-3" />
                </button>
              </div>
            ))}
            <div
              className="min-w-0 flex-1 border-b"
              style={{ borderColor: "var(--border-subtle)" }}
            />
          </div>
          <div className="relative flex min-h-0 flex-1">
            <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
              <MonacoEditor
                beforeMount={beforeMount}
                defaultLanguage="typescript"
                height="100%"
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
                theme="forge-dark"
                value={placeholderContent}
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
