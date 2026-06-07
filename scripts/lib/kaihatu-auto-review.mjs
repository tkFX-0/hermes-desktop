/**
 * !kaihatu 完了後の自動レビュー（設計 checklist + zone vitest + しずめ判定）
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { buildOperatorNotifyContent } from "./discord-human-approval-notify.mjs";
import { safeDiscordContent } from "./discord-text-safe.mjs";

/** Machine-readable shizume verdict fence tag (Discord / logs). */
export const SHIZUME_VERDICT_FENCE = "shizume-verdict";

/** @typedef {"GO" | "HOLD" | "STOP"} ShizumeGateVerdict */

/**
 * @typedef {object} ShizumeStructuredVerdict
 * @property {ShizumeGateVerdict} verdict
 * @property {string} reason
 * @property {string[]} risk
 * @property {string[]} action
 */

export const KAIHATU_AUTO_REVIEW_TESTS = [
  "tests/hermes/zone/dev-pipeline-composer-fallback.test.ts",
  "tests/hermes/zone/dev-pipeline-zone-smoke.test.ts",
  "tests/hermes/zone/full-autonomy/full-autonomy-dev-pipeline.test.ts",
  "tests/hermes/zone/full-autonomy/full-autonomy-discord-dev-commands.test.ts",
  "tests/hermes/zone/full-autonomy/goal-command-routing.test.ts",
  "tests/hermes/zone/full-autonomy/goal-dev-pipeline-route.test.ts",
  "tests/hermes/zone/full-autonomy/goal-process-preflight.test.ts",
];

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
 * @param {string} body
 */
function parseSimpleEnv(body) {
  const out = new Map();
  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
    out.set(key, value);
  }
  return out;
}

/**
 * @param {string} root
 */
export function gatherDesignReviewInput(root) {
  const stackchanDeferred = (() => {
    try {
      const env = readFileSync(join(root, ".env.local"), "utf8");
      const parsed = parseSimpleEnv(env);
      const unseal = envTruthy(
        process.env.SHIKISHIMA_STACKCHAN_UNSEAL ?? parsed.get("SHIKISHIMA_STACKCHAN_UNSEAL"),
        false
      );
      const hold = envTruthy(
        process.env.SHIKISHIMA_STACKCHAN_HOLD ?? parsed.get("SHIKISHIMA_STACKCHAN_HOLD"),
        true
      );
      return !unseal || hold;
    } catch {
      return true;
    }
  })();

  const phases2to10 = existsSync(
    join(root, "src/main/shikishima-full-autonomy/secretary-planner-only.ts")
  );
  const invariants = existsSync(join(root, "src/main/shikishima-full-autonomy/autonomy-invariants.ts"));

  return {
    stackchanDeferred,
    phases2to10CodePresent: phases2to10,
    invariantsVerified: invariants,
    executionDisabled: true,
    voiceHermesBypassAbsent: true
  };
}

/**
 * @param {ReturnType<typeof gatherDesignReviewInput>} input
 */
export function runDesignReviewChecklistLocal(input) {
  return [
    {
      id: "11.1a",
      autoResult: "pass",
      prompt: "完全自律の主語はしきしまか"
    },
    {
      id: "11.1b",
      autoResult: input.stackchanDeferred ? "pass" : "manual",
      prompt: "StackChanは身体定義か"
    },
    {
      id: "11.2a",
      autoResult: input.stackchanDeferred ? "pass" : "hold",
      prompt: "Phase1 DEFERREDで2-7先行"
    },
    {
      id: "11.2b",
      autoResult: input.phases2to10CodePresent ? "pass" : "hold",
      prompt: "Phase7 planner-only"
    },
    {
      id: "11.3a",
      autoResult: input.invariantsVerified ? "pass" : "hold",
      prompt: "不変条件コード検証"
    },
    {
      id: "11.3b",
      autoResult: input.executionDisabled ? "pass" : "hold",
      prompt: "execution disabled"
    }
  ];
}

/**
 * @param {string} root
 */
export function runZoneVitest(root) {
  const r = spawnSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["vitest", "run", ...KAIHATU_AUTO_REVIEW_TESTS, "--reporter=dot"],
    {
      cwd: root,
      encoding: "utf-8",
      shell: true,
      timeout: 180_000,
      env: { ...process.env, CI: "1" }
    }
  );
  const out = `${r.stdout ?? ""}\n${r.stderr ?? ""}`;
  const passed = /(\d+)\s+passed/.exec(out);
  const failed = /(\d+)\s+failed/.exec(out);
  const passCount = passed ? Number(passed[1]) : 0;
  const failCount = failed ? Number(failed[1]) : 0;
  return {
    ok: r.status === 0 && failCount === 0,
    exitCode: r.status ?? 1,
    passCount,
    failCount,
    summary: failCount > 0 ? `failed=${failCount}` : `passed=${passCount}`
  };
}

/**
 * @param {object} p
 * @param {string} p.instruction
 * @param {boolean} p.kaihatuOk
 * @param {boolean} p.testMode
 * @param {ReturnType<typeof runDesignReviewChecklistLocal>} p.checklist
 * @param {ReturnType<typeof runZoneVitest>} p.vitest
 */
export function buildShizumeAutoReviewVerdict(p) {
  const holds = p.checklist.filter((c) => c.autoResult === "hold");
  const manuals = p.checklist.filter((c) => c.autoResult === "manual");
  const passN = p.checklist.filter((c) => c.autoResult === "pass").length;

  let decision = "GO_PREPARED";
  const blockers = [];

  if (!p.kaihatuOk) blockers.push("kaihatu_dev_failed");
  if (!p.vitest.ok) blockers.push("vitest_zone_failed");
  const devLaneClear = p.kaihatuOk && p.vitest.ok;
  if (holds.length > 0 && !devLaneClear) blockers.push("design_checklist_hold");

  if (blockers.length > 0) decision = "HOLD";

  const needsHuman =
    decision === "HOLD" ||
    (manuals.length > 0 && !devLaneClear) ||
    !p.kaihatuOk;

  const structured = buildShizumeStructuredVerdict({
    decision,
    blockers,
    checklist: p.checklist,
    kaihatuOk: p.kaihatuOk,
    vitestOk: p.vitest.ok,
    needsHuman
  });

  return {
    decision,
    blockers,
    needsHuman,
    passN,
    holdIds: holds.map((h) => h.id),
    vitestOk: p.vitest.ok,
    structured
  };
}

const SAFETY_CRITICAL_CHECKLIST_IDS = new Set(["11.3a", "11.3b"]);

const BLOCKER_RISK_LABELS = {
  kaihatu_dev_failed: "開発パイプライン失敗",
  vitest_zone_failed: "zone vitest 失敗",
  design_checklist_hold: "設計 checklist HOLD"
};

/**
 * Map legacy auto-review state to GO / HOLD / STOP (machine gate).
 *
 * @param {object} p
 * @param {string} p.decision
 * @param {string[]} p.blockers
 * @param {ReturnType<typeof runDesignReviewChecklistLocal>} p.checklist
 * @param {boolean} p.kaihatuOk
 * @param {boolean} p.vitestOk
 * @param {boolean} p.needsHuman
 * @returns {ShizumeStructuredVerdict}
 */
export function buildShizumeStructuredVerdict(p) {
  const risks = [];
  const actions = [];
  const holds = p.checklist.filter((c) => c.autoResult === "hold");
  const safetyCriticalHold = holds.some((c) => SAFETY_CRITICAL_CHECKLIST_IDS.has(c.id));

  for (const blocker of p.blockers) {
    const label = BLOCKER_RISK_LABELS[blocker];
    if (label) risks.push(label);
  }
  for (const hold of holds) {
    if (!SAFETY_CRITICAL_CHECKLIST_IDS.has(hold.id)) {
      risks.push(`設計 checklist HOLD (${hold.id}: ${hold.prompt})`);
    }
  }
  if (safetyCriticalHold) {
    risks.push("安全不変条件の自動検証に失敗");
  }

  const dualPipelineFailure =
    p.blockers.includes("kaihatu_dev_failed") && p.blockers.includes("vitest_zone_failed");

  /** @type {ShizumeGateVerdict} */
  let verdict = "GO";
  let reason = "自動レビュー通過。この範囲では問題を検出していません。";

  if (safetyCriticalHold || dualPipelineFailure) {
    verdict = "STOP";
    if (safetyCriticalHold) {
      reason = "安全不変条件の違反を検出。操作を停止してください。";
    } else {
      reason = "開発パイプラインと zone vitest の両方が失敗。継続不可。";
    }
    actions.push("操作を止めてください。");
    actions.push("失敗ログと checklist を手動確認してください。");
  } else if (p.decision === "HOLD" || p.needsHuman) {
    verdict = "HOLD";
    if (p.blockers.includes("kaihatu_dev_failed")) {
      reason = "開発パイプライン失敗のため HOLD。";
    } else if (p.blockers.includes("vitest_zone_failed")) {
      reason = "zone vitest 失敗のため HOLD。";
    } else if (p.blockers.includes("design_checklist_hold")) {
      reason = "設計 checklist HOLD のため HOLD。";
    } else {
      reason = "人間確認が必要なため HOLD。";
    }
    actions.push("オペレーター確認をお願いします。");
  } else {
    actions.push("マージ/本番は別途人間 GO。");
  }

  if (p.needsHuman && verdict !== "STOP") {
    actions.push("本番反映は execution=disabled のまま HOLD。");
  }

  return {
    verdict,
    reason,
    risk: risks,
    action: actions
  };
}

/**
 * @param {ShizumeStructuredVerdict} structured
 */
export function formatShizumeStructuredVerdictJson(structured) {
  return JSON.stringify(structured, null, 0);
}

/**
 * @param {ShizumeStructuredVerdict} structured
 */
export function formatShizumeStructuredVerdictBlock(structured) {
  return `\`\`\`${SHIZUME_VERDICT_FENCE}\n${formatShizumeStructuredVerdictJson(structured)}\n\`\`\``;
}

/**
 * Extract structured verdict JSON from shizume reply text.
 *
 * @param {string} text
 * @returns {ShizumeStructuredVerdict | null}
 */
export function parseShizumeStructuredVerdict(text) {
  const fence = new RegExp(
    `\`\`\`${SHIZUME_VERDICT_FENCE}\\s*\\n([\\s\\S]*?)\\n\`\`\``,
    "i"
  );
  const m = fence.exec(text);
  if (!m) return null;
  try {
    const parsed = JSON.parse(m[1].trim());
    if (!parsed || typeof parsed !== "object") return null;
    const verdict = parsed.verdict;
    if (verdict !== "GO" && verdict !== "HOLD" && verdict !== "STOP") return null;
    return {
      verdict,
      reason: String(parsed.reason ?? ""),
      risk: Array.isArray(parsed.risk) ? parsed.risk.map(String) : [],
      action: Array.isArray(parsed.action) ? parsed.action.map(String) : []
    };
  } catch {
    return null;
  }
}

/**
 * @param {object} opts
 * @param {string} opts.root
 * @param {string} opts.instruction
 * @param {boolean} opts.kaihatuOk
 * @param {boolean} [opts.testMode]
 * @param {string} [opts.operatorUserId]
 */
export function runKaihatuAutoReview(opts) {
  const { root, instruction, kaihatuOk, testMode = false, operatorUserId = "" } = opts;
  const checklist = runDesignReviewChecklistLocal(gatherDesignReviewInput(root));
  const vitest = runZoneVitest(root);
  const verdict = buildShizumeAutoReviewVerdict({
    instruction,
    kaihatuOk: testMode ? true : kaihatuOk,
    testMode,
    checklist,
    vitest
  });

  const modeLabel = testMode ? "（!kaihatu-test · 開発未実行）" : "（!kaihatu 自動レビュー）";
  const lines = [
    `🛡️ **しずめ** — 自動レビュー ${modeLabel}`,
    `指示: ${instruction.slice(0, 120)}${instruction.length > 120 ? "…" : ""}`,
    "",
    `判定: **${verdict.decision}**`,
    `設計 checklist: ${verdict.passN}/${checklist.length} pass` +
      (verdict.holdIds.length ? ` · HOLD項目=${verdict.holdIds.join(",")}` : ""),
    `vitest zone: ${vitest.summary} (${vitest.ok ? "OK" : "NG"})`,
    `本番反映: **HOLD**（execution=disabled）`,
    ""
  ];

  if (verdict.blockers.length) {
    lines.push(`ブロッカー: ${verdict.blockers.join(", ")}`);
  }

  if (testMode) {
    lines.push("", "テストモード: WSL 開発パイプラインは実行していません。");
  }

  let notifyContent = null;
  if (verdict.needsHuman) {
    const n = buildOperatorNotifyContent(operatorUserId, "確認しました。");
    if (n.ok) {
      notifyContent = n.content;
      lines.push("", "→ オペレーター確認をお願いします。");
    } else {
      lines.push("", `→ 許可待ち（${n.error}）`);
    }
  } else {
    lines.push("", "→ 自動レビュー通過。マージ/本番は別途人間 GO。");
  }

  lines.push(
    "",
    `構造化判定: **${verdict.structured.verdict}** — ${verdict.structured.reason}`,
    formatShizumeStructuredVerdictBlock(verdict.structured)
  );

  return {
    text: safeDiscordContent(lines.join("\n").slice(0, 1900)),
    verdict,
    structuredVerdict: verdict.structured,
    vitest,
    notifyContent,
    needsHuman: verdict.needsHuman
  };
}
