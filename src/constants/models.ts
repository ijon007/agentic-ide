import type { Model } from "@/types/model";

export const MOCK_MODELS: Model[] = [
  {
    id: "composer-1.5",
    name: "Composer 1.5",
    provider: "Cursor",
    thinking: true,
    contextWindow: "200K",
    description: "Cursor's flagship model for code and long-context tasks.",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    thinking: false,
    contextWindow: "128K",
    description: "Fast, capable model for coding and general tasks.",
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    thinking: true,
    contextWindow: "200K",
    description: "Strong reasoning and coding with extended thinking.",
  },
  {
    id: "codestral",
    name: "Codestral",
    provider: "Mistral",
    thinking: false,
    contextWindow: "32K",
    description: "Efficient model optimized for code completion.",
  },
];
