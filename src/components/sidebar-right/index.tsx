"use client";

import { useState } from "react";
import { DiffViewPanel } from "@/components/diff-view-panel";
import { useApp } from "@/context/app-context";
import { FileTreePanel } from "./file-tree-panel";
import {
  type FileTreeFilter,
  SidebarRightHeader,
} from "./sidebar-right-header";

export function SidebarRight() {
  const { sidebarRightView, setSidebarRightView } = useApp();
  const [fileTreeFilter, setFileTreeFilter] = useState<FileTreeFilter>("all");

  return (
    <aside
      className="flex h-full w-full flex-col border-l"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <SidebarRightHeader
        view={sidebarRightView}
        onViewChange={setSidebarRightView}
        fileTreeFilter={fileTreeFilter}
        onFileTreeFilterChange={setFileTreeFilter}
      />

      {sidebarRightView === "diffs" ? (
        <DiffViewPanel />
      ) : (
        <FileTreePanel fileTreeFilter={fileTreeFilter} />
      )}
    </aside>
  );
}
