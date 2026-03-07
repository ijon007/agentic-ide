export interface ShortcutDef {
  id: string;
  label: string;
  defaultKeys: string[];
}

export const SHORTCUT_REGISTRY: ShortcutDef[] = [
  { id: "commandPalette", label: "Command palette", defaultKeys: ["ctrl", "k"] },
  { id: "closeTab", label: "Close tab", defaultKeys: ["ctrl", "w"] },
  { id: "toggleTerminal", label: "Toggle terminal", defaultKeys: ["ctrl", "j"] },
  {
    id: "closeOrNewChat",
    label: "Close chat / New chat",
    defaultKeys: ["ctrl", "shift", "l"],
  },
  {
    id: "newChatPane",
    label: "New chat pane",
    defaultKeys: ["ctrl", "shift", "n"],
  },
  {
    id: "toggleSidebarLeft",
    label: "Toggle chats sidebar",
    defaultKeys: ["ctrl", "l"],
  },
  {
    id: "toggleCodePanel",
    label: "Toggle code panel",
    defaultKeys: ["ctrl", "shift", "b"],
  },
  {
    id: "toggleSidebarRight",
    label: "Toggle files sidebar",
    defaultKeys: ["ctrl", "b"],
  },
  {
    id: "openDiffView",
    label: "Diff view",
    defaultKeys: ["ctrl", "shift", "d"],
  },
];

export function getShortcutById(id: string): ShortcutDef | undefined {
  return SHORTCUT_REGISTRY.find((s) => s.id === id);
}

const KEY_MAP: Record<string, string> = {
  Backquote: "`",
  Minus: "-",
  Equal: "=",
  BracketLeft: "[",
  BracketRight: "]",
  Backslash: "\\",
  Semicolon: ";",
  Quote: "'",
  Comma: ",",
  Period: ".",
  Slash: "/",
};

/** Serialize a KeyboardEvent to canonical key array for comparison (order: ctrl, alt, shift, meta, key). */
export function eventToKeyArray(e: KeyboardEvent): string[] {
  const parts: string[] = [];
  if (e.ctrlKey) parts.push("ctrl");
  if (e.altKey) parts.push("alt");
  if (e.shiftKey) parts.push("shift");
  if (e.metaKey) parts.push("cmd");
  const key = KEY_MAP[e.key] ?? (e.key.length === 1 ? e.key.toLowerCase() : e.key.toLowerCase());
  if (key && !parts.includes(key)) parts.push(key);
  return parts;
}

export function keysToShortcutId(
  keys: string[],
  overrides: Record<string, string[]>,
  registry: ShortcutDef[]
): string | null {
  const sortedKeys = [...keys].sort();
  const keyStr = sortedKeys.join("+");
  for (const def of registry) {
    const effective = overrides[def.id] ?? def.defaultKeys;
    const effectiveStr = [...effective].sort().join("+");
    if (effectiveStr === keyStr) return def.id;
  }
  return null;
}
