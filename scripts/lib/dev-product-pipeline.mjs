/**
 * dev-scheduler — IDEAS.md pending → /goal 自動起動 → 全員レビュー → 完成品
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import {
  pickNextPendingIdea,
  readIdeas,
  slugifyIdeaTitle,
  updateIdeaStatus,
} from "./ideas-md.mjs";
import { appendCompletedIdeaToState } from "./idea-state-md.mjs";
import { runTeamQualityReview, formatTeamReviewForDiscord } from "./team-quality-review.mjs";
import { evaluateMergeGate } from "./discord-operator-commands.mjs";
import { isNpmCheckGreen } from "./npm-check-state.mjs";
import { readTokenTrackerQueue, latestTokenUsageForSource } from "./tokentracker-readonly.mjs";

export const PIPELINE_STATE_FILE = "dev-product-pipeline.json";
export const MAX_REVIEW_ROUNDS = 3;
export const MAX_IDEA_MS = 24 * 60 * 60 * 1000;
const DEFAULT_TICK_MS = 10 * 60 * 1000;
const DEFAULT_TOKEN_SPIKE = 80_000;

/**
 * @param {string | undefined} value
 * @param {boolean} defaultValue
 */
function envTruthy(value, defaultValue) {
  if (value === undefined || value === "") return defaultValue;
  const v = String(value).trim().toLowerCase();
  if (v === "0" || v === "false" || v === "off" || v === "no") return false;
  if (v === "1" || v === "true" || v === "on" || v === "yes") return true;
  return defaultValue;
}

/**
 * @param {(key: string) => string | undefined} [getEnv]
 */
export function resolveDevPipelineConfig(getEnv = (key) => process.env[key]) {
  const tickMin = Number(getEnv("SHIKISHIMA_DEV_PIPELINE_TICK_MIN") ?? "10");
  const tickMs = Number(getEnv("SHIKISHIMA_DEV_PIPELINE_TICK_MS") ?? String(DEFAULT_TICK_MS));
  const tokenSpike = Number(getEnv("SHIKISHIMA_DEV_PIPELINE_TOKEN_SPIKE") ?? String(DEFAULT_TOKEN_SPIKE));
  return {
    enabled: envTruthy(getEnv("SHIKISHIMA_DEV_PIPELINE_ENABLED"), true),
    tickMs: Number.isFinite(tickMs) && tickMs >= 30_000 ? Math.floor(tickMs) : DEFAULT_TICK_MS,
    tickMin: Number.isFinite(tickMin) && tickMin > 0 ? tickMin : 10,
    maxRounds: MAX_REVIEW_ROUNDS,
    maxIdeaMs: MAX_IDEA_MS,
    tokenSpikeThreshold: Number.isFinite(tokenSpike) && tokenSpike > 0 ? tokenSpike : DEFAULT_TOKEN_SPIKE,
  };
}

function pipelineStatePath(memoryDir) {
  return join(memoryDir, PIPELINE_STATE_FILE);
}

export function defaultPipelineState() {
  return {
    phase: "idle",
    activeIdeaTitle: null,
    goalId: null,
    round: 1,
    startedAt: null,
    feedback: [],
    lastAction: null,
  };
}

export function loadPipelineState(memoryDir) {
  const path = pipelineStatePath(memoryDir);
  if (!existsSync(path)) return defaultPipelineState();
  try {
    return { ...defaultPipelineState(), ...JSON.parse(readFileSync(path, "utf8")) };
  } catch {
    return defaultPipelineState();
  }
}

export function savePipelineState(memoryDir, state) {
  mkdirSync(memoryDir, { recursive: true });
  writeFileSync(pipelineStatePath(memoryDir), JSON.stringify(state, null, 2), "utf8");
}

/**
 * @param {{ idea: { title: string, completionCriteria?: string }, feedback?: string[] }} input
 */
export function buildProductPipelineSteps(input) {
  const idea = input.idea;
  const fb =
    (input.feedback ?? []).length > 0
      ? `\n改善フィードバック:\n${(input.feedback ?? []).join("\n")}`
      : "";
  const criteria = idea.completionCriteria ? `\n完成条件: ${idea.completionCriteria}` : "";
  return [
    {
      step: 1,
      description: `計画策定: ${idea.title}${criteria}${fb}`,
      agent: "hajime",
      autonomyLevel: 2,
      status: "pending",
      result: null,
    },
    {
      step: 2,
      description: `調査: ${idea.title}`,
      agent: "shirube",
      autonomyLevel: 2,
      status: "pending",
      result: null,
    },
    {
      step: 3,
      description: `実装: ${idea.title}`,
      agent: "tsumugi",
      autonomyLevel: 2,
      status: "pending",
      result: null,
    },
    {
      step: 4,
      description: `レビュー: ${idea.title}`,
      agent: "shizume",
      autonomyLevel: 2,
      status: "pending",
      result: null,
    },
    {
      step: 5,
      description: `記録: ${idea.title}`,
      agent: "shirube",
      autonomyLevel: 2,
      status: "pending",
      result: null,
    },
  ];
}

export function buildGoalDescriptionFromIdea(idea, feedback = []) {
  const fb = feedback.length ? `\n\n改善フィードバック:\n${feedback.join("\n")}` : "";
  return `【自律開発】${idea.title}\n完成条件: ${idea.completionCriteria ?? "README + テスト"}${fb}`;
}

/**
 * @param {object} [options]
 */
export function detectTokenUsageSpike(options = {}) {
  const env = options.env ?? process.env;
  const threshold = Number(
    env.SHIKISHIMA_DEV_PIPELINE_TOKEN_SPIKE ?? DEFAULT_TOKEN_SPIKE
  );
  const queue = readTokenTrackerQueue(options);
  if (!queue.ok) return { slowDown: false, reason: queue.error };
  const latest = latestTokenUsageForSource(queue.entries, "claude");
  if (!latest) return { slowDown: false, reason: "no_usage" };
  const used = latest.billableTotalTokens;
  return {
    slowDown: used >= threshold,
    used,
    threshold,
    reason: used >= threshold ? "token_spike" : "under_threshold",
  };
}

/**
 * @param {string} root
 * @param {{ title: string }} idea
 * @param {object} [opts]
 */
export function scanProductArtifacts(root, idea, opts = {}) {
  const slug = slugifyIdeaTitle(idea.title);
  const outputDir = join(root, "outputs", slug);
  const hasOutputDir = existsSync(outputDir);
  const hasReadme =
    existsSync(join(outputDir, "README.md")) ||
    existsSync(join(root, "README.md")) ||
    Boolean(opts.hasReadme);
  const hasTests = Boolean(opts.hasTests ?? opts.checkGreen);
  const hasCode = Boolean(opts.hasCode ?? (hasOutputDir || opts.checkGreen));
  const checkGreen = Boolean(opts.checkGreen);
  return {
    outputPath: hasOutputDir ? `outputs/${slug}/` : `outputs/${slug}/`,
    hasCode,
    hasTests,
    hasReadme,
    checkGreen,
    meetsGoal: hasCode && hasReadme && checkGreen,
    meetsAcceptance: hasCode && hasTests && hasReadme,
    safetyHold: false,
    competitive: true,
  };
}

/**
 * @param {string} root
 * @param {{ title: string, completionCriteria?: string }} idea
 * @param {string} summary
 */
export function finalizeProductOutput(root, idea, summary) {
  const slug = slugifyIdeaTitle(idea.title);
  const dir = join(root, "outputs", slug);
  mkdirSync(dir, { recursive: true });
  const manifest = {
    title: idea.title,
    completionCriteria: idea.completionCriteria ?? "",
    completedAt: new Date().toISOString(),
    summary: summary.slice(0, 500),
  };
  writeFileSync(join(dir, "PRODUCT.json"), JSON.stringify(manifest, null, 2), "utf8");
  const readmePath = join(dir, "README.md");
  if (!existsSync(readmePath)) {
    writeFileSync(
      readmePath,
      `# ${idea.title}\n\n${idea.completionCriteria ?? ""}\n\n## サマリー\n\n${summary}\n`,
      "utf8"
    );
  }
  return { path: `outputs/${slug}/`, dir };
}

/**
 * @param {string} memoryDir
 * @param {string} root
 * @param {object} deps
 */
export async function runDevProductPipelineTick(memoryDir, root, deps = {}) {
  const now = deps.now ?? (() => Date.now());
  const notify = deps.notify ?? (() => {});
  const config = deps.config ?? resolveDevPipelineConfig();
  const state = loadPipelineState(memoryDir);
  const tokenSpike = deps.detectTokenSpike?.() ?? detectTokenUsageSpike({ env: deps.env });
  const result = { action: "idle", state, notifications: [] };

  if (tokenSpike.slowDown && state.phase === "idle") {
    result.action = "slow_down";
    result.reason = "token_spike";
    return result;
  }

  const elapsed =
    state.startedAt && state.phase !== "idle"
      ? now() - Date.parse(state.startedAt)
      : 0;
  if (state.startedAt && elapsed > config.maxIdeaMs && state.phase !== "idle") {
    await holdIdea(memoryDir, state, "24時間超過 — 一旦停止", notify, deps);
    result.action = "hold_timeout";
    result.state = loadPipelineState(memoryDir);
    return result;
  }

  if (state.phase === "idle") {
    const activeGoal = deps.getActiveGoal?.();
    if (activeGoal && activeGoal.status !== "completed" && activeGoal.status !== "cancelled") {
      result.action = "blocked_active_goal";
      return result;
    }
    const { ideas } = readIdeas(memoryDir);
    const next = pickNextPendingIdea(ideas);
    if (!next) {
      result.action = "idle_no_pending";
      return result;
    }
    updateIdeaStatus(memoryDir, next.title, "in_progress");
    const start = await deps.startGoalFromIdea?.(next);
    if (!start?.ok) {
      updateIdeaStatus(memoryDir, next.title, "pending");
      result.action = "start_failed";
      result.error = start?.error ?? "unknown";
      return result;
    }
    state.phase = "goal_running";
    state.activeIdeaTitle = next.title;
    state.goalId = start.goalId ?? null;
    state.round = 1;
    state.startedAt = new Date(now()).toISOString();
    state.feedback = [];
    state.lastAction = "started_goal";
    savePipelineState(memoryDir, state);
    await notify(`🚀 **自律開発開始**: ${next.title}\n優先度: ${next.priority} → /goal パイプライン起動`, "shikishima");
    result.action = "started";
    result.state = state;
    return result;
  }

  if (state.phase === "goal_running") {
    const goal = state.goalId ? deps.getGoal?.(state.goalId) : null;
    if (!goal) {
      result.action = "waiting_goal";
      return result;
    }
    if (goal.status === "paused") {
      const failed = goal.steps?.find((s) => s.status === "failed" || s.status === "paused");
      const holdReason = failed
        ? `しずめ/Goal HOLD — Step ${failed.step}: ${failed.description}`
        : "Goal paused — 手動確認待ち";
      await holdIdea(memoryDir, state, holdReason, notify, deps);
      result.action = "hold_goal_paused";
      result.state = loadPipelineState(memoryDir);
      return result;
    }
    if (goal.status !== "completed") {
      result.action = "goal_running";
      return result;
    }
    updateIdeaStatus(memoryDir, state.activeIdeaTitle, "review");
    const gate = deps.evaluateShizumeGate?.() ?? evaluateShizumeGateDefault(root, memoryDir, deps);
    if (!gate.go) {
      await holdIdea(memoryDir, state, gate.reason ?? "しずめ HOLD/STOP", notify, deps);
      result.action = "hold_shizume";
      result.state = loadPipelineState(memoryDir);
      return result;
    }
    if (deps.autoMerge) {
      const mergeResult = await deps.autoMerge();
      if (!mergeResult?.ok) {
        await holdIdea(memoryDir, state, mergeResult?.text ?? "自動マージ失敗", notify, deps);
        result.action = "hold_merge";
        result.state = loadPipelineState(memoryDir);
        return result;
      }
    }
    state.phase = "team_review";
    state.lastAction = "goal_completed";
    savePipelineState(memoryDir, state);
    result.action = "team_review_next";
    result.state = state;
  }

  if (state.phase === "team_review") {
    const { ideas } = readIdeas(memoryDir);
    const idea = ideas.find((i) => i.title === state.activeIdeaTitle);
    if (!idea) {
      resetPipelineIdle(memoryDir);
      result.action = "idea_missing_reset";
      return result;
    }
    const checkGreen = deps.isCheckGreen?.() ?? isNpmCheckGreen(memoryDir);
    const artifacts =
      deps.scanArtifacts?.(idea) ??
      scanProductArtifacts(root, idea, { checkGreen, hasTests: checkGreen, hasCode: checkGreen, hasReadme: checkGreen });
    const review = runTeamQualityReview({ idea, artifacts, round: state.round });
    await notify(formatTeamReviewForDiscord(review, idea.title), "shikishima");
    if (!review.allPass) {
      if (state.round >= config.maxRounds) {
        await holdIdea(
          memoryDir,
          state,
          `3ラウンド未達: ${review.summary}. tkの判断を待ちます`,
          notify,
          deps
        );
        result.action = "hold_max_rounds";
        result.state = loadPipelineState(memoryDir);
        return result;
      }
      state.round += 1;
      state.feedback = review.needsWork.map((r) => `${r.label}: ${r.suggestion || r.reason}`);
      state.phase = "goal_running";
      state.lastAction = "retry_review";
      savePipelineState(memoryDir, state);
      updateIdeaStatus(memoryDir, idea.title, "in_progress");
      await notify(
        `🔄 **${idea.title}** ラウンド${state.round}/${config.maxRounds}: ${review.summary}`,
        "shikishima"
      );
      const retry = await deps.startGoalFromIdea?.(idea, { feedback: state.feedback, round: state.round });
      if (retry?.ok) state.goalId = retry.goalId ?? state.goalId;
      savePipelineState(memoryDir, state);
      result.action = "retry";
      result.state = state;
      return result;
    }
    const summary = review.summary;
    const output = finalizeProductOutput(root, idea, summary);
    appendCompletedIdeaToState(memoryDir, idea, output.path, summary);
    updateIdeaStatus(memoryDir, idea.title, "completed");
    await notify(
      `✅ **${idea.title}** 完成。${output.path} に配置。\n${summary}`,
      "shikishima"
    );
    resetPipelineIdle(memoryDir);
    result.action = "completed";
    result.outputPath = output.path;
    result.state = loadPipelineState(memoryDir);
    return result;
  }

  return result;
}

export function resolveCurrentGitBranch(root, spawnFn = spawnSync) {
  const r = spawnFn("git", ["branch", "--show-current"], { cwd: root, encoding: "utf-8", shell: true });
  if (r.status !== 0) return null;
  return String(r.stdout ?? "").trim() || null;
}

function evaluateShizumeGateDefault(root, memoryDir, deps) {
  const gate = evaluateMergeGate(root, {
    memoryDir,
    testMode: Boolean(deps.testMode),
    operatorUserId: deps.operatorUserId ?? "",
  });
  const verdict =
    gate.structuredVerdict?.verdict ??
    gate.review?.structuredVerdict?.verdict ??
    gate.review?.verdict?.decision ??
    "";
  const checkGreen = deps.isCheckGreen?.() ?? isNpmCheckGreen(memoryDir);
  if (verdict === "STOP") {
    return { go: false, reason: "しずめ STOP — 安全境界", review: gate.review };
  }
  if (verdict === "HOLD" || gate.review?.needsHuman) {
    return { go: false, reason: "しずめ HOLD — 自動進行停止", review: gate.review };
  }
  if (!checkGreen) {
    return { go: false, reason: "npm run check 未通過", review: gate.review };
  }
  if (gate.ok || verdict === "GO" || verdict === "GO_PREPARED") {
    return { go: true, review: gate.review };
  }
  return { go: false, reason: gate.reason ?? `しずめ verdict=${verdict || "unknown"}`, review: gate.review };
}

async function holdIdea(memoryDir, state, reason, notify, deps) {
  if (state.activeIdeaTitle) {
    updateIdeaStatus(memoryDir, state.activeIdeaTitle, "hold");
  }
  await notify(`⏸ **${state.activeIdeaTitle ?? "アイデア"}** ${reason}. tkの判断を待ちます`, "shizume");
  deps.onHold?.(state, reason);
  resetPipelineIdle(memoryDir);
}

function resetPipelineIdle(memoryDir) {
  savePipelineState(memoryDir, defaultPipelineState());
}
