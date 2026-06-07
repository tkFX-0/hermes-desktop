/**
 * tk 専用 Discord 開発者コマンド (!merge / !push / !check / !restart / !status / !log)
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { runKaihatuAutoReview } from "./kaihatu-auto-review.mjs";
import {
  canAutoGitPush,
  canAutoMergeToMain,
  isTkOperator,
} from "./l3-relaxation-policy.mjs";
import {
  isNpmCheckGreen,
  loadNpmCheckState,
  runNpmCheckAndRecord,
} from "./npm-check-state.mjs";
import { listPendingMemoryProposals } from "./memory-dreaming.mjs";
import { safeDiscordContent } from "./discord-text-safe.mjs";

/**
 * @param {string} content
 */
export function parseOperatorDevCommand(content) {
  const t = String(content ?? "").trim();
  const merge = t.match(/^!merge(?:\s+(\S+))?$/i);
  if (merge) return { type: "merge", branch: merge[1] ?? null };
  if (/^!push\b/i.test(t)) return { type: "push" };
  if (/^!check\b/i.test(t)) return { type: "check" };
  if (/^!restart\b/i.test(t)) return { type: "restart" };
  const log = t.match(/^!log(?:\s+(\d+))?$/i);
  if (log) return { type: "log", lines: log[1] ? Number(log[1]) : 20 };
  return null;
}

/**
 * @param {string} authorId
 * @param {string} operatorUserId
 */
export function assertTkOperator(authorId, operatorUserId) {
  if (!operatorUserId) {
    return { ok: false, error: "operator_not_configured", message: "DISCORD_OPERATOR_USER_ID 未設定" };
  }
  if (!isTkOperator(authorId, operatorUserId)) {
    return { ok: false, error: "operator_only", message: "tk（DISCORD_OPERATOR_USER_ID）のみ実行可能" };
  }
  return { ok: true };
}

/**
 * @param {string} root
 * @param {object} [opts]
 */
export function evaluateMergeGate(root, opts = {}) {
  const memoryDir = opts.memoryDir ?? join(root, ".shikishima-memory");
  const review = runKaihatuAutoReview({
    root,
    instruction: opts.instruction ?? "operator !merge gate",
    kaihatuOk: true,
    testMode: Boolean(opts.testMode),
    operatorUserId: opts.operatorUserId ?? "",
  });
  const gate = canAutoMergeToMain({
    memoryDir,
    structuredVerdict: review.structuredVerdict ?? review.verdict?.structured,
  });
  return {
    ...gate,
    review,
    structuredVerdict: review.structuredVerdict ?? review.verdict?.structured,
  };
}

function gitSpawn(args, root, spawnFn = spawnSync) {
  const r = spawnFn("git", args, { cwd: root, encoding: "utf-8", shell: true });
  return {
    ok: r.status === 0,
    status: r.status ?? 1,
    stdout: String(r.stdout ?? "").trim(),
    stderr: String(r.stderr ?? "").trim(),
  };
}

function readBotPid(root) {
  const pidPath = join(root, ".shikishima-bot.pid");
  if (!existsSync(pidPath)) return null;
  const n = parseInt(readFileSync(pidPath, "utf-8").trim(), 10);
  return Number.isFinite(n) ? n : null;
}

function readLogTail(root, lines = 20) {
  const logPath = join(root, "shikishima-bot.log");
  if (!existsSync(logPath)) return "(ログファイルなし)";
  const text = readFileSync(logPath, "utf-8");
  return text.split(/\r?\n/).slice(-lines).join("\n");
}

/**
 * @param {object} cmd
 * @param {object} deps
 */
export function executeOperatorDevCommand(cmd, deps) {
  const root = deps.root;
  const memoryDir = deps.memoryDir ?? join(root, ".shikishima-memory");
  const spawnFn = deps.spawnFn ?? spawnSync;

  const auth = assertTkOperator(deps.authorId, deps.operatorUserId);
  if (!auth.ok) {
    return {
      ok: false,
      agentId: "shizume",
      text: safeDiscordContent(`🛡️ **しずめ** — ${auth.message}`),
      error: auth.error,
    };
  }

  if (cmd.type === "check") {
    if (deps.skipCheckRun) {
      const state = loadNpmCheckState(memoryDir);
      return {
        ok: state.ok,
        agentId: state.ok ? "shirube" : "shizume",
        text: safeDiscordContent(
          state.ok
            ? `✅ **check** — npm run check 緑\n${state.summary}`
            : `🛡️ **しずめ** — check 失敗\n${state.summary}`
        ),
      };
    }
    const state = runNpmCheckAndRecord(root, memoryDir, { spawnFn });
    return {
      ok: state.ok,
      agentId: state.ok ? "shirube" : "shizume",
      text: safeDiscordContent(
        state.ok
          ? `✅ **check** — npm run check 緑\n${state.summary}`
          : `🛡️ **しずめ** — check 失敗 (exit ${state.exitCode})\n${state.summary}`
      ),
    };
  }

  if (cmd.type === "merge") {
    const branch = cmd.branch;
    if (!branch) {
      return {
        ok: false,
        agentId: "shizume",
        text: safeDiscordContent("🛡️ **しずめ** — 用法: `!merge <branch>`"),
        error: "missing_branch",
      };
    }
    const gate = deps.evaluateMergeGate
      ? deps.evaluateMergeGate()
      : evaluateMergeGate(root, {
          memoryDir,
          operatorUserId: deps.operatorUserId,
          testMode: deps.mergeTestMode ?? false,
        });
    if (!gate.ok) {
      return {
        ok: false,
        agentId: "shizume",
        text: safeDiscordContent(
          `🛡️ **しずめ** — !merge HOLD\n` +
            `- ${gate.reason}\n` +
            (gate.structuredVerdict
              ? `- structured: ${gate.structuredVerdict.verdict} — ${gate.structuredVerdict.reason}`
              : "")
        ),
        error: "merge_gate_hold",
        gate,
      };
    }
    const checkout = gitSpawn(["checkout", "main"], root, spawnFn);
    if (!checkout.ok) {
      return {
        ok: false,
        agentId: "shizume",
        text: safeDiscordContent(`🛡️ **しずめ** — main checkout 失敗\n${checkout.stderr}`),
      };
    }
    const merge = gitSpawn(["merge", branch, "--no-edit"], root, spawnFn);
    return {
      ok: merge.ok,
      agentId: merge.ok ? "shikishima" : "shizume",
      text: safeDiscordContent(
        merge.ok
          ? `🏯 **!merge** — \`${branch}\` → main 完了（しずめ GO + check 緑）\ntk は事後に git log で確認してください。`
          : `🛡️ **しずめ** — merge 失敗\n${merge.stderr || merge.stdout}`
      ),
    };
  }

  if (cmd.type === "push") {
    const pushGate = canAutoGitPush(memoryDir);
    if (!pushGate.ok) {
      return {
        ok: false,
        agentId: "shizume",
        text: safeDiscordContent(`🛡️ **しずめ** — !push HOLD: ${pushGate.reason}`),
        error: "push_gate_hold",
      };
    }
    const push = gitSpawn(["push", "origin", "main"], root, spawnFn);
    return {
      ok: push.ok,
      agentId: push.ok ? "shikishima" : "shizume",
      text: safeDiscordContent(
        push.ok
          ? "🏯 **!push** — origin/main へ push 完了（check 緑）"
          : `🛡️ **しずめ** — push 失敗\n${push.stderr || push.stdout}`
      ),
    };
  }

  if (cmd.type === "restart") {
    return {
      ok: true,
      agentId: "shikishima",
      text: safeDiscordContent(
        "💥 **!restart** — preflight --clean --restart-dev を開始します。\n15〜30秒後に `!status` で確認。"
      ),
      scheduleRestart: true,
    };
  }

  if (cmd.type === "status") {
    const branch = gitSpawn(["branch", "--show-current"], root, spawnFn);
    const check = loadNpmCheckState(memoryDir);
    const pending = listPendingMemoryProposals(memoryDir);
    const gate = evaluateMergeGate(root, {
      memoryDir,
      operatorUserId: deps.operatorUserId,
      testMode: deps.mergeTestMode ?? true,
    });
    const lines = [
      "📊 **operator status**",
      `branch: ${branch.stdout || "unknown"}`,
      `bot PID: ${readBotPid(root) ?? "unknown"} (self ${process.pid})`,
      `npm check: ${check.ok ? "green" : "red"} (${check.finishedAt ?? "never"})`,
      `しずめ merge gate: ${gate.ok ? "GO" : "HOLD"} — ${gate.reason}`,
      `pending memory proposals: ${pending.length}`,
      `check cache fresh: ${isNpmCheckGreen(memoryDir) ? "yes" : "no"}`,
    ];
    return { ok: true, agentId: "shikishima", text: safeDiscordContent(lines.join("\n")) };
  }

  if (cmd.type === "log") {
    const n = Number.isFinite(cmd.lines) && cmd.lines > 0 ? Math.min(cmd.lines, 80) : 20;
    const tail = readLogTail(root, n);
    return {
      ok: true,
      agentId: "shirube",
      text: safeDiscordContent(`📜 **log** (last ${n})\n\`\`\`\n${tail.slice(0, 1800)}\n\`\`\``),
    };
  }

  return { ok: false, agentId: "shizume", text: "unknown command", error: "unknown" };
}

export function buildOperatorCommandsHelp() {
  return [
    "**tk 専用開発者コマンド**（`DISCORD_OPERATOR_USER_ID` 認証）",
    "`!merge <branch>` — main にマージ（しずめ GO + check 緑）",
    "`!push` — origin/main へ push（check 緑）",
    "`!check` — npm run check 実行・結果記録",
    "`!restart` — bot 再起動（preflight --clean --restart-dev）",
    "`!status` — branch / PID / check / merge gate / pending HOLD",
    "`!log [n]` — 直近 n 行の bot ログ（default 20）",
  ].join("\n");
}
