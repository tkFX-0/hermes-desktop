/**
 * Per-agent reasoning level → model route + prompt modifiers.
 * Fixes: one static prompt/model for all agents regardless of intended depth.
 */

import { loadAgentModelRegistry } from "./load-agent-models.mjs";

/** @typedef {"quick"|"standard"|"deep"|"critical"} ReasoningLevel */

const LEVEL_ORDER = ["quick", "standard", "deep", "critical"];

const DEFAULT_LEVEL = "standard";

const LENGTH_HINT = {
  quick: "50字以内で要点のみ。",
  standard: "100〜180字。自然な会話調。",
  deep: "150〜350字。推論過程を簡潔に示し、ため口・フレンドリーで話す。",
  critical: "120〜250字。事実と安全を最優先。断定は避ける。"
};

const TONE_MODIFIER = {
  quick: "[推論: quick] テンポよく短く。",
  standard: "[推論: standard] 落ち着いて分かりやすく。",
  deep: "[推論: deep] 思考を一段踏み込み、口調はくだけて親しみやすく。",
  critical: "[推論: critical] リスクと根拠を明示。禁止フレーズ遵守。"
};

/**
 * @param {string|undefined} level
 * @returns {ReasoningLevel}
 */
export function normalizeReasoningLevel(level) {
  const s = String(level ?? DEFAULT_LEVEL).toLowerCase();
  return LEVEL_ORDER.includes(s) ? /** @type {ReasoningLevel} */ (s) : DEFAULT_LEVEL;
}

/**
 * Pick model/backend for agent at its configured reasoning level.
 * @param {string} agentId
 * @param {object} [registry]
 */
export function resolveAgentReasoningRoute(agentId, registry = loadAgentModelRegistry()) {
  const entry = registry.agents?.[agentId];
  const level = normalizeReasoningLevel(entry?.reasoningLevel);
  const models = entry?.replyModels ?? {};
  const profile = entry?.reasoningProfile?.[level] ?? {};

  let backend = profile.backend ?? entry?.primaryBackend ?? "groq";
  let model =
    profile.model ??
    models[profile.modelKey] ??
    models.groq ??
    models.claude ??
    "llama-3.3-70b-versatile";

  if (level === "quick" && models.groqQuick) {
    backend = profile.backend ?? "groq";
    model = profile.model ?? models.groqQuick;
  }
  if (level === "deep" || level === "critical") {
    if (models.claudeDeep) model = profile.model ?? models.claudeDeep;
    else if (models.claude && (backend === "claude" || profile.preferClaude)) {
      model = profile.model ?? models.claude;
      backend = "claude";
    } else if (models.groqDeep) {
      model = profile.model ?? models.groqDeep;
      backend = "groq";
    }
  }

  const maxTokens = profile.maxTokens ?? (level === "quick" ? 512 : level === "deep" ? 2048 : 1024);

  return {
    agentId,
    reasoningLevel: level,
    backend,
    model,
    maxTokens,
    lengthHint: LENGTH_HINT[level],
    toneModifier: TONE_MODIFIER[level],
    governanceVersion: registry.governanceVersion ?? registry.version ?? "unknown"
  };
}

/**
 * Merge persona + reasoning tone (agent-personas.json reasoningModifiers optional).
 * @param {string} agentId
 * @param {string} basePersona
 * @param {object|null} personas
 * @param {ReasoningLevel} level
 */
export function buildAgentPersonaBlock(agentId, basePersona, personas, level) {
  const extra = personas?.[agentId]?.reasoningModifiers?.[level];
  const tone = extra ?? TONE_MODIFIER[level];
  return `${basePersona}\n${tone}`;
}
