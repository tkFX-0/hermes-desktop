/**
 * 全員品質レビュー — 6 エージェントが PASS / NEEDS_WORK を返す
 */

export const TEAM_REVIEWERS = [
  {
    id: "shikishima",
    label: "しきしま",
    aspect: "元のアイデアの目標を満たしているか",
    check: (ctx) => ctx.artifacts.meetsGoal,
  },
  {
    id: "hajime",
    label: "はじめ",
    aspect: "計画の受入条件を達成しているか",
    check: (ctx) => ctx.artifacts.meetsAcceptance,
  },
  {
    id: "tsumugi",
    label: "つむぎ",
    aspect: "コード品質・保守性・テスト充足",
    check: (ctx) => ctx.artifacts.hasTests && ctx.artifacts.hasCode,
  },
  {
    id: "shizume",
    label: "しずめ",
    aspect: "安全・品質・副作用",
    check: (ctx) => ctx.artifacts.checkGreen && !ctx.artifacts.safetyHold,
  },
  {
    id: "shirube",
    label: "しるべ",
    aspect: "ドキュメント完全性(README/使用例)",
    check: (ctx) => ctx.artifacts.hasReadme,
  },
  {
    id: "research",
    label: "リサーチ君",
    aspect: "既存ソリューションと比較して競争力があるか",
    check: (ctx) => ctx.artifacts.competitive !== false,
  },
];

/**
 * @param {{ idea: { title: string, completionCriteria?: string }, artifacts: object, round?: number }} ctx
 */
export function runTeamQualityReview(ctx) {
  const round = Number(ctx.round ?? 1);
  const reviews = TEAM_REVIEWERS.map((reviewer) => {
    const pass = Boolean(reviewer.check(ctx));
    return {
      agent: reviewer.id,
      label: reviewer.label,
      aspect: reviewer.aspect,
      verdict: pass ? "PASS" : "NEEDS_WORK",
      reason: pass
        ? `${reviewer.label}: 基準を満たしています`
        : `${reviewer.label}: ${reviewer.aspect} が未達`,
      suggestion: pass ? "" : `${reviewer.aspect} を改善してください`,
    };
  });
  const needsWork = reviews.filter((r) => r.verdict === "NEEDS_WORK");
  const allPass = needsWork.length === 0;
  const summary = allPass
    ? `全員 PASS (ラウンド ${round})`
    : `NEEDS_WORK: ${needsWork.map((r) => r.label).join(", ")}`;
  return { allPass, reviews, summary, round, needsWork };
}

/**
 * @param {{ allPass: boolean, reviews: object[], round: number }} result
 */
export function formatTeamReviewForDiscord(result, ideaTitle) {
  const lines = [
    `📋 **全員品質レビュー** — ${ideaTitle} (ラウンド ${result.round}/3)`,
    "",
  ];
  for (const r of result.reviews) {
    const icon = r.verdict === "PASS" ? "✅" : "🔄";
    lines.push(`${icon} **${r.label}**: ${r.verdict} — ${r.reason}`);
    if (r.suggestion) lines.push(`   → ${r.suggestion}`);
  }
  lines.push("");
  lines.push(result.allPass ? "✅ **全員 PASS** — 完成品配置へ進みます" : `🔄 **要改善** — ${result.summary}`);
  return lines.join("\n").slice(0, 1900);
}

/**
 * @param {string} root
 * @param {{ title: string, completionCriteria?: string }} idea
 * @param {object} [opts]
 */
export function buildDefaultArtifacts(root, idea, opts = {}) {
  const checkGreen = opts.checkGreen ?? false;
  const hasReadme = opts.hasReadme ?? false;
  const hasTests = opts.hasTests ?? false;
  const hasCode = opts.hasCode ?? false;
  const meetsGoal = opts.meetsGoal ?? (hasCode && hasReadme);
  const meetsAcceptance = opts.meetsAcceptance ?? meetsGoal;
  const safetyHold = opts.safetyHold ?? false;
  const competitive = opts.competitive ?? true;
  const outputPath = opts.outputPath ?? `outputs/${String(idea.title).slice(0, 40)}/`;
  return {
    root,
    outputPath,
    hasCode,
    hasTests,
    hasReadme,
    checkGreen,
    meetsGoal,
    meetsAcceptance,
    safetyHold,
    competitive,
  };
}
