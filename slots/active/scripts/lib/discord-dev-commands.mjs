/**
 * !kaihatu / !kaihatuslot — 司令部屋の開発指示（subscription-first dev lane）
 */

import { resolveDevPipelineConfig } from "./dev-pipeline-router.mjs";
import { runDevPipeline } from "./wsl-dev-runner.mjs";
import { recordDevPipelineRunGovernance } from "./governance-changelog.mjs";
import { isPaidApiExplicitlyAllowed } from "./billing-policy.mjs";
import { safeDiscordContent } from "./discord-text-safe.mjs";
import { formatDevTraceLine } from "./wsl-dev-runner.mjs";
import { runKaihatuAutoReview } from "./kaihatu-auto-review.mjs";

/**
 * @param {string} content
 * @returns {{ type: "kaihatu"|"kaihatu-test"|"kaihatuslot", instruction: string } | null}
 */
export function parseDevSlashCommand(content) {
  const t = String(content ?? "").trim();
  const test = t.match(/^!kaihatu-test(?:\s+([\s\S]+))?$/i);
  const testAlias = t.match(/^!kaihatu\s+test(?:\s+([\s\S]+))?$/i);
  const testMatch = test ?? testAlias;
  if (testMatch) {
    const instruction = (testMatch[1] ?? "自動レビュー動作確認").trim();
    return instruction.length > 0 ? { type: "kaihatu-test", instruction } : null;
  }
  const slot = t.match(/^!kaihatuslot\s+([\s\S]+)$/i);
  if (slot) {
    const instruction = slot[1].trim();
    return instruction.length > 0 ? { type: "kaihatuslot", instruction } : null;
  }
  const dev = t.match(/^!kaihatu\s+([\s\S]+)$/i);
  if (dev) {
    const instruction = dev[1].trim();
    return instruction.length > 0 ? { type: "kaihatu", instruction } : null;
  }
  return null;
}

/**
 * @param {Record<string, string>} env
 */
export function validateKaihatuGate(env) {
  const cfg = resolveDevPipelineConfig((k) => env[k] ?? process.env[k]);
  const issues = [];
  if (!cfg.enabled) issues.push("SHIKISHIMA_DEV_PIPELINE_ENABLED=0");
  if (isPaidApiExplicitlyAllowed((k) => env[k] ?? process.env[k])) {
    issues.push("ALLOW_PAID_API=1 (kaihatu は subscription レーン推奨)");
  }
  return { ok: issues.length === 0, cfg, issues };
}

/**
 * @param {string} instruction
 * @param {Record<string, string>} env
 */
export async function runKaihatuDev(instruction, env = process.env) {
  const gate = validateKaihatuGate(env);
  if (!gate.ok) {
    return {
      ok: false,
      agentId: "shizume",
      text: safeDiscordContent(
        `🛡️ **しずめ** — !kaihatu は開発レーン未準備\n` +
          gate.issues.map((i) => `- ${i}`).join("\n") +
          "\n\n`!dev-pipeline` で WSL 状態を確認してください。"
      )
    };
  }

  const dev = await runDevPipeline(
    { prompt: `[開発指示] ${instruction}`, agentId: "tsumugi" },
    env
  );

  if (dev.ok && dev.text) {
    try {
      recordDevPipelineRunGovernance({
        agentId: "tsumugi",
        backend: dev.backend ?? "dev",
        model: dev.model ?? "unknown",
        ok: true
      });
    } catch {
      /* non-fatal */
    }
    const devLine = formatDevTraceLine(dev);
    const body =
      `🪡 **つむぎ** — !kaihatu 受付\n` +
      `指示: ${instruction.slice(0, 200)}${instruction.length > 200 ? "…" : ""}\n\n` +
      dev.text +
      (devLine ? `\n\n—\n${devLine}` : "");
    return {
      ok: true,
      agentId: "tsumugi",
      text: safeDiscordContent(body)
    };
  }

  return {
    ok: false,
    agentId: "shizume",
    text: safeDiscordContent(
      `🛡️ **しずめ** — 開発パイプライン失敗: ${dev.reason ?? "unknown"}\n` +
        "WSL `claude` ログインと `node scripts/shikishima-wsl-dev-preflight.mjs` を確認。"
    )
  };
}

/**
 * @param {string} instruction
 */
/**
 * @param {string} root
 * @param {string} instruction
 * @param {Record<string, string>} env
 */
export function runKaihatuTestReview(root, instruction, env = process.env) {
  return runKaihatuAutoReview({
    root,
    instruction,
    kaihatuOk: true,
    testMode: true,
    operatorUserId: env.DISCORD_OPERATOR_USER_ID ?? ""
  });
}

export function buildKaihatuslotStartMessage(instruction) {
  return safeDiscordContent(
    `🪡 **つむぎ** — !kaihatuslot 受付\n` +
      `目標: ${instruction.slice(0, 300)}\n\n` +
      "スロットを開き、自律ループを開始します（スロット内のみ・本番適用は HOLD）。"
  );
}
