/**
 * Per-agent reply dispatch — registry-backed (Groq / Claude / workers).
 * Grok Research HOLD respected via policy in registry.
 */

import {
  formatBotTrace,
  isGrokResearchHold,
  loadAgentModelRegistry
} from "./load-agent-models.mjs";
import { hermesChat, isHermesBackendEnabled } from "./hermes-backend.mjs";
import { resolveAgentReasoningRoute } from "./agent-reasoning-policy.mjs";
import { resolveDevPipelineConfig } from "./dev-pipeline-router.mjs";
import { runDevPipeline, formatDevTraceLine } from "./wsl-dev-runner.mjs";
import { recordDevPipelineRunGovernance } from "./governance-changelog.mjs";
import { stripClaudeCliNoise, isEmptyAgentText } from "./claude-cli-sanitize.mjs";

const DEV_AGENT_IDS = new Set(["tsumugi", "hajime"]);

const TSUMUGI_KW = /コード|実装|修正|バグ|stackchan|スタックチャン|typecheck|review|レビュー/i;

function envGetter(env) {
  const src = env ?? process.env;
  return (k) => src?.[k];
}

export function isLocalHumanCheckEnv(env = process.env) {
  const v = env?.SHIKISHIMA_DISCORD_HUMAN_CHECK_LOCAL;
  return v === "1" || v === "true";
}

/** ユーザーが Groq 明示指定したとき（しきしま deep でも Groq 優先） */
export function userRequestsGroqBackend(prompt) {
  return /groq\s*(で|を)?\s*(対話|会話|返答|テスト|希望)|Groqで|groqで|llama/i.test(
    String(prompt ?? ""),
  );
}

/**
 * @param {string} agentId
 */
export function buildLocalDispatchReply(agentId) {
  const reg = loadAgentModelRegistry();
  const entry = reg.agents?.[agentId];
  const name = entry?.displayName ?? agentId;
  return {
    ok: true,
    text:
      `【${name}】ローカル応答モード（API課金なし）。` +
      `順番テストは \`!agent-test\` または「順番での回答」を送信してください。`,
    trace: {
      agentId,
      backendUsed: "local-human-check",
      model: "none",
      grokResearchHeld: isGrokResearchHold(),
      traceLine: "local-human-check/none"
    }
  };
}

/**
 * @param {string} agentId
 * @param {string} prompt
 * @param {{ callGroq: Function, callClaude: Function, forceLocal?: boolean, env?: NodeJS.ProcessEnv }} deps
 */
export async function dispatchAgentReply(agentId, prompt, deps) {
  if (deps.forceLocal || isLocalHumanCheckEnv(deps.env)) {
    return buildLocalDispatchReply(agentId);
  }

  const reg = loadAgentModelRegistry();
  const entry = reg.agents?.[agentId];
  const route = resolveAgentReasoningRoute(agentId, reg);
  const trace = {
    agentId,
    primaryBackend: entry?.primaryBackend ?? "groq",
    backendUsed: "",
    model: "",
    reasoningLevel: route.reasoningLevel,
    grokResearchHeld: isGrokResearchHold(),
    traceLine: formatBotTrace(agentId)
  };

  if (agentId === "shikishima" && userRequestsGroqBackend(prompt)) {
    const groqModel = entry?.replyModels?.groq ?? "llama-3.3-70b-versatile";
    const g = await deps.callGroq(prompt, groqModel, route.maxTokens);
    const gText = stripClaudeCliNoise(g.text);
    if (g.ok && !isEmptyAgentText(gText)) {
      trace.backendUsed = "groq";
      trace.model = groqModel;
      trace.userGroqOverride = true;
      return { ok: true, text: gText, trace };
    }
    trace.userGroqOverrideFailed = true;
  }

  // Hermes 正式バックエンド (env で有効化されていれば最優先)。
  // 失敗時は既存 Groq/Claude 経路にフォールバックするので drop-in 安全。
  const getEnv = envGetter(deps.env);
  if (isHermesBackendEnabled(getEnv)) {
    const hermesModel = entry?.replyModels?.hermes;
    const r = await hermesChat({ prompt, model: hermesModel }, getEnv);
    if (r.ok && r.text) {
      trace.backendUsed = r.backend;
      trace.model = r.model;
      return { ok: true, text: r.text, trace };
    }
    // フォールバック理由を trace に残す (秘匿値なし)
    trace.hermesFallbackReason = r.reason ?? "hermes_unavailable";
  }

  if (!entry) {
    const fallback = await deps.callGroq(prompt, "llama-3.3-70b-versatile");
    trace.backendUsed = "groq";
    trace.model = "llama-3.3-70b-versatile";
    return { ok: fallback.ok, text: fallback.text, trace };
  }

  // しずめ — Claude only (safety; reasoning critical)
  if (agentId === "shizume") {
    const model = route.model;
    const r = await deps.callClaude(prompt, model, route.maxTokens);
    trace.backendUsed = "claude";
    trace.model = model;
    return { ok: r.ok, text: r.text, trace };
  }

  // 開発パイプライン (subscription-first: composer → claude → codex)
  const devCfg = resolveDevPipelineConfig(getEnv);
  if (
    devCfg.enabled &&
    DEV_AGENT_IDS.has(agentId) &&
    (TSUMUGI_KW.test(prompt) || agentId === "tsumugi")
  ) {
    const dev = await runDevPipeline({ prompt, agentId }, deps.env);
    if (dev.ok && dev.text) {
      trace.backendUsed = dev.backend;
      trace.model = dev.model;
      trace.devLane = dev.lane;
      trace.devTraceLine = formatDevTraceLine(dev);
      try {
        recordDevPipelineRunGovernance({
          agentId,
          backend: dev.backend ?? "dev",
          model: dev.model ?? cfg.composerModel,
          ok: true
        });
      } catch {
        /* non-fatal */
      }
      return { ok: true, text: dev.text, trace };
    }
    trace.devFallbackReason = dev.reason ?? "dev_pipeline_failed";
  }

  // つむぎ — worker path (Claude Code)
  if (agentId === "tsumugi" || entry.primaryBackend === "claude-code-worker") {
    const model = route.model;
    const prefix = TSUMUGI_KW.test(prompt)
      ? "[つむぎ・実装Worker] "
      : "[つむぎ] ";
    const r = await deps.callClaude(prefix + prompt, model, route.maxTokens);
    trace.backendUsed = "claude-code-worker";
    trace.model = model;
    return { ok: r.ok, text: stripClaudeCliNoise(r.text), trace };
  }

  // Route by reasoning policy (backend + model per agent/level)
  if (route.backend === "claude" || route.backend === "claude-code-worker") {
    const r = await deps.callClaude(prompt, route.model, route.maxTokens);
    if (r.ok) {
      trace.backendUsed = route.backend === "claude-code-worker" ? "claude-code-worker" : "claude";
      trace.model = route.model;
      return { ok: true, text: stripClaudeCliNoise(r.text), trace };
    }
    const g = await deps.callGroq(
      prompt,
      entry.replyModels?.groq ?? "llama-3.3-70b-versatile",
      route.maxTokens
    );
    trace.backendUsed = "groq";
    trace.model = entry.replyModels?.groq ?? "llama-3.3-70b-versatile";
    trace.hermesFallbackReason = "claude_failed_groq_fallback";
    return { ok: g.ok, text: stripClaudeCliNoise(g.text), trace };
  }

  // Groq-primary path
  const g = await deps.callGroq(prompt, route.model, route.maxTokens);
  const gText = stripClaudeCliNoise(g.text);
  if (g.ok && !isEmptyAgentText(gText)) {
    trace.backendUsed = "groq";
    trace.model = route.model;
    return { ok: true, text: gText, trace };
  }
  const claudeModel = entry.replyModels?.claude ?? "claude-sonnet-4-6";
  const c = await deps.callClaude(prompt, claudeModel, route.maxTokens);
  trace.backendUsed = "claude";
  trace.model = claudeModel;
  return { ok: c.ok, text: stripClaudeCliNoise(c.text), trace };
}

export { AGENT_TEAM_IDS, CANONICAL_AGENT_IDS } from "./canonical-agent-team.mjs";
