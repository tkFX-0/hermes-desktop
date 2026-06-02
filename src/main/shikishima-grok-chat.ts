// Shikishima Grok Chat — sealed legacy adapter.
// Used where legacy callers still expect the GrokChatResult shape.

export interface GrokChatResult {
  success: boolean;
  reply: string;
  durationMs: number;
  error?: string;
}

// Grok model labels are kept only for compatibility with existing callers.
export type GrokModel = "grok-4.3" | "grok-build-0.1";

export function selectGrokModel(
  _complexity: "simple" | "medium" | "complex",
): GrokModel {
  return "grok-4.3";
}

export function grokChat(
  _userMessage: string,
  _model: GrokModel = "grok-4.3",
): Promise<GrokChatResult> {
  const start = Date.now();
  return Promise.resolve({
    success: false,
    reply: "",
    durationMs: Date.now() - start,
    error: "grok_hermes_sealed_2026_06"
  });
}

// Legacy quota check is sealed with the chat route.
export async function checkXPremiumQuota(): Promise<{ available: boolean; note: string }> {
  return { available: false, note: "Grok/Hermes route sealed" };
}
