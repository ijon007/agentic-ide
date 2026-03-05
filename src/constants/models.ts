import type { Model } from "@/types/model";

export const MOCK_MODELS: Model[] = [
  { id: "composer-1.5", name: "Composer 1.5", provider: "Cursor" },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI" },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic" },
  { id: "codestral", name: "Codestral", provider: "Mistral" },
];
