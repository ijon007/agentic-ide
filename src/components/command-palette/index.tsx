"use client";

import { useApp } from "@/context/app-context";
import { CommandPaletteDialog } from "./command-palette-dialog";

export function GlobalCommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useApp();

  return (
    <CommandPaletteDialog
      open={commandPaletteOpen}
      onOpenChange={setCommandPaletteOpen}
    />
  );
}
