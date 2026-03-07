import {
  ChatsIcon,
  InfinityIcon,
  ListChecksIcon,
} from "@phosphor-icons/react";
import type { ComponentType } from "react";

export type AcpIconProps = { className?: string; weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone" };

export type AgentModeId = "agent" | "plan" | "ask";

export interface AcpItem {
  id: string;
  name: string;
  description?: string;
  /** Path to provider logo (e.g. /acp-logos/cursor.svg). */
  logo: string;
}

export interface AgentModeItem {
  id: AgentModeId;
  label: string;
  Icon: ComponentType<AcpIconProps>;
}

export const MOCK_ACP_LIST: AcpItem[] = [
  {
    id: "cursor",
    name: "Cursor",
    description: "Cursor's AI-powered coding assistant.",
    logo: "/acp-logos/CUBE_25D.svg",
  },
  {
    id: "opencode",
    name: "OpenCode",
    description: "Open-source coding assistant.",
    logo: "/acp-logos/opencode.svg",
  },
  {
    id: "codex",
    name: "Codex",
    description: "Codex agent for code generation and editing.",
    logo: "/acp-logos/chat.svg",
  },
  {
    id: "claude-code",
    name: "Claude Code",
    description: "Anthropic's Claude for coding tasks.",
    logo: "/acp-logos/claude-color.svg",
  },
  {
    id: "gemini",
    name: "Gemini",
    description: "Google's Gemini for coding and reasoning.",
    logo: "/acp-logos/gemini.svg",
  },
];

export const AGENT_MODES: AgentModeItem[] = [
  { id: "agent", label: "Agent", Icon: InfinityIcon },
  { id: "plan", label: "Plan", Icon: ListChecksIcon },
  { id: "ask", label: "Ask", Icon: ChatsIcon },
];

export const DEFAULT_ACP_ID = MOCK_ACP_LIST[0]?.id ?? "cursor";