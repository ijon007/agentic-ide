"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Kbd, formatShortcutKeys, parseShortcutString } from "@/components/ui/kbd";
import {
  getShortcutById,
  SHORTCUT_REGISTRY,
} from "@/constants/keyboard-shortcuts";
import { useApp } from "@/context/app-context";

export function KeyboardShortcutsSection() {
  const { shortcutOverrides, setShortcutOverrides } = useApp();
  const [editingShortcutId, setEditingShortcutId] = useState<string | null>(null);
  const [shortcutInputValue, setShortcutInputValue] = useState("");

  const getEffectiveKeys = (shortcutId: string) => {
    const def = getShortcutById(shortcutId);
    if (!def) return [];
    return shortcutOverrides[shortcutId] ?? def.defaultKeys;
  };

  const startEditingShortcut = (id: string) => {
    const keys = getEffectiveKeys(id);
    setEditingShortcutId(id);
    setShortcutInputValue(formatShortcutKeys(keys));
  };

  const saveShortcut = (id: string) => {
    const parsed = parseShortcutString(shortcutInputValue);
    if (parsed.length > 0) {
      setShortcutOverrides((prev) => ({ ...prev, [id]: parsed }));
    } else {
      const def = getShortcutById(id);
      if (def) {
        setShortcutOverrides((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }
    }
    setEditingShortcutId(null);
  };

  return (
    <section>
      <div className="flex flex-col gap-2">
        {SHORTCUT_REGISTRY.map((def) => (
          <div
            className="flex items-center justify-between gap-4 rounded-lg py-2"
            key={def.id}
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <span
              className="text-xs"
              style={{ color: "var(--text-primary)" }}
            >
              {def.label}
            </span>
            {editingShortcutId === def.id ? (
              <Input
                autoFocus
                className="h-7 w-32 bg-(--bg-elevated) text-xs font-mono focus-visible:ring-px focus-visible:ring-(--border-subtle)"
                onBlur={() => saveShortcut(def.id)}
                onChange={(e) =>
                  setShortcutInputValue(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                value={shortcutInputValue}
              />
            ) : (
              <button
                className="cursor-pointer rounded border border-(--border-subtle) bg-transparent px-1.5 py-0.5 font-mono text-sm transition-colors hover:bg-(--bg-elevated) focus:outline-none focus-visible:ring-1 focus-visible:ring-(--border-subtle)"
                onClick={() => startEditingShortcut(def.id)}
                type="button"
              >
                <Kbd keys={getEffectiveKeys(def.id)} />
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
