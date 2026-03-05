"use client";

import { useEffect, useState } from "react";
import { CommandPaletteDialog } from "./command-palette-dialog";

export function GlobalCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <CommandPaletteDialog open={open} onOpenChange={setOpen} />
  );
}
