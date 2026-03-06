export interface Model {
  id: string;
  name: string;
  provider: string;
  /** Whether the model supports extended thinking/reasoning. */
  thinking: boolean;
  /** Context window size (e.g. "128K", "200K"). */
  contextWindow: string;
  /** Short description of the model. */
  description: string;
}
