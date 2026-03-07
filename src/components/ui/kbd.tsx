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

const keyLabelMap: Record<string, string> = {
  command: "⌘",
  cmd: "⌘",
  control: "Ctrl",
  ctrl: "Ctrl",
  alt: "Alt",
  option: "Option",
  shift: "Shift",
  space: "Space",
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

function getKeyDisplay(item: KeyItem): string {
  const key = typeof item === "string" ? item : item.display;
  const lowerKey = key.toLowerCase();
  const label = keyLabelMap[lowerKey];
  if (label) return label;
  const symbol = keySymbolMap[lowerKey];
  if (symbol) return symbol;
  if (key.length === 1) return key.toUpperCase();
  return key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
}

export function Kbd({ keys = [], className }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center gap-0.5 rounded border border-(--border-subtle) bg-(--text-muted)/8 px-1 py-px font-mono text-[10px] font-medium leading-none text-(--text-muted)",
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
