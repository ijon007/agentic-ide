"use client";

import { cn } from "@/lib/utils";

const keySymbolMap: Record<string, string> = {
  command: "⌘",
  cmd: "⌘",
  control: "⌃",
  ctrl: "⌃",
  alt: "⌥",
  option: "⌥",
  shift: "⇧",
  space: "␣",
  arrowleft: "←",
  left: "←",
  arrowdown: "↓",
  down: "↓",
  arrowup: "↑",
  up: "↑",
  arrowright: "→",
  right: "→",
  enter: "↵",
  return: "↵",
  backtick: "`",
  "`": "`",
};

export type KeyItem = string | { display: string; key: string };

export interface KbdProps {
  keys: KeyItem[];
  className?: string;
}

function getKeyDisplay(item: KeyItem): string {
  const key = typeof item === "string" ? item : item.display;
  const lowerKey = key.toLowerCase();
  return keySymbolMap[lowerKey] ?? key.length === 1 ? key.toUpperCase() : key;
}

export function Kbd({ keys = [], className }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center gap-0.5 rounded border border-(--border-default) bg-(--bg-elevated) px-1.5 py-0.5 font-mono text-[10px] font-medium text-(--text-secondary)",
        className
      )}
    >
      {keys.map((item, index) => (
        <span key={index} className={index > 0 ? "ml-0.5" : ""}>
          {getKeyDisplay(item)}
        </span>
      ))}
    </kbd>
  );
}

/** Normalize a key string (e.g. "ctrl", "Control") to lowercase canonical form for comparison. */
export function normalizeKeyKey(key: string): string {
  const k = key.toLowerCase().trim();
  if (k === "control" || k === "ctrl") return "ctrl";
  if (k === "meta" || k === "command" || k === "cmd") return "cmd";
  if (k === "alt" || k === "option") return "alt";
  if (k === "shift") return "shift";
  if (k === " ") return "space";
  return k;
}

/** Parse a shortcut string like "Ctrl+Shift+K" into an array of canonical keys. */
export function parseShortcutString(str: string): string[] {
  if (!str.trim()) return [];
  return str
    .split(/\+/)
    .map((s) => normalizeKeyKey(s))
    .filter(Boolean);
}

/** Format keys array for display (e.g. ["ctrl", "shift", "k"] -> "Ctrl+Shift+K"). */
export function formatShortcutKeys(keys: string[]): string {
  const labels: Record<string, string> = {
    ctrl: "Ctrl",
    cmd: "Ctrl",
    alt: "Alt",
    shift: "Shift",
    space: "Space",
  };
  return keys
    .map((k) => labels[k] ?? (k.length === 1 ? k.toUpperCase() : k))
    .join("+");
}
