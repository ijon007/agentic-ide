"use client";

import { FileCodeIcon, XIcon } from "@phosphor-icons/react";
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
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
      data-panel="editor"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      {openFiles.length > 0 ? (
        <>
          <div
            className="flex h-9 min-w-0 shrink-0"
            style={{ backgroundColor: "var(--bg-surface)" }}
          >
            <div className="min-w-0 flex-1 overflow-x-auto overflow-y-hidden scrollbar-hidden">
              <div className="flex h-full shrink-0 items-stretch">
            {openFiles.map((path) => (
              <div
                className={cn(
                  "group flex shrink-0 cursor-pointer items-center gap-2 border-r px-3 py-1.5 font-mono text-xs transition-colors",
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
                <FileCodeIcon className="size-3 shrink-0" />
                <span className="max-w-[120px] truncate">
                  {path.split("/").pop()}
                </span>
                <button
                  className={cn(
                    "cursor-pointer",
                    activeFile === path ? "opacity-70" : "opacity-0 group-hover:opacity-70"
                  )}
                  onClick={(e) => handleCloseFile(e, path)}
                  title="Close file (Ctrl+W)"
                  type="button"
                >
                  <XIcon className="size-3" />
                </button>
              </div>
            ))}
              </div>
            </div>
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
