import {
  ChatCircleIcon,
  CodeIcon,
  InfinityIcon,
  ListChecksIcon,
} from "@phosphor-icons/react";
import type { ComponentType } from "react";

/** Placeholder until official ACP icons are added. */
const AcpPlaceholderIcon = CodeIcon as ComponentType<{ className?: string }>;

export type AgentModeId = "agent" | "plan" | "ask";

export interface AcpItem {
  id: string;
  name: string;
  description?: string;
  Icon: ComponentType<{ className?: string }>;
}

export interface AgentModeItem {
  id: AgentModeId;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}

export const MOCK_ACP_LIST: AcpItem[] = [
  {
    id: "cursor",
    name: "Cursor",
    description: "Cursor's AI-powered coding assistant.",
    Icon: AcpPlaceholderIcon,
  },
  {
    id: "opencode",
    name: "OpenCode",
    description: "Open-source coding assistant.",
    Icon: AcpPlaceholderIcon,
  },
  {
    id: "codex",
    name: "Codex",
    description: "Codex agent for code generation and editing.",
    Icon: AcpPlaceholderIcon,
  },
  {
    id: "claude-code",
    name: "Claude Code",
    description: "Anthropic's Claude for coding tasks.",
    Icon: AcpPlaceholderIcon,
  },
];

export const AGENT_MODES: AgentModeItem[] = [
  { id: "agent", label: "Agent", Icon: InfinityIcon },
  { id: "plan", label: "Plan", Icon: ListChecksIcon },
  { id: "ask", label: "Ask", Icon: ChatCircleIcon },
];

export const DEFAULT_ACP_ID = MOCK_ACP_LIST[0]?.id ?? "cursor";
