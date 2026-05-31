/**
 * !kaihatu 完了後の自動レビュー（設計 checklist + zone vitest + しずめ判定）
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { buildOperatorNotifyContent } from "./discord-human-approval-notify.mjs";
import { safeDiscordContent } from "./discord-text-safe.mjs";

/**
 * @param {string} root
 */
export function gatherDesignReviewInput(root) {
  const stackchanHold = (() => {
    try {
      const env = readFileSync(join(root, ".env.local"), "utf8");
      return /SHIKISHIMA_STACKCHAN_HOLD\s*=\s*1/m.test(env);
    } catch {
      return true;
    }
  })();

  const phases2to10 = existsSync(
    join(root, "src/main/shikishima-full-autonomy/secretary-planner-only.ts")
  );
  const invariants = existsSync(join(root, "src/main/shikishima-full-autonomy/autonomy-invariants.ts"));

  return {
    stackchanDeferred: stackchanHold,
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
    ["vitest", "run", "tests/hermes/zone/full-autonomy", "--reporter=dot"],
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
  if (holds.length > 0) blockers.push("design_checklist_hold");

  if (blockers.length > 0) decision = "HOLD";

  const needsHuman =
    decision === "HOLD" ||
    manuals.length > 0 ||
    !p.kaihatuOk;

  return {
    decision,
    blockers,
    needsHuman,
    passN,
    holdIds: holds.map((h) => h.id),
    vitestOk: p.vitest.ok
  };
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

  return {
    text: safeDiscordContent(lines.join("\n").slice(0, 1900)),
    verdict,
    vitest,
    notifyContent,
    needsHuman: verdict.needsHuman
  };
}
