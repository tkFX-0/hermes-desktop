function normalizeAgentId(agentId) {
  return String(agentId ?? "").trim().toLowerCase();
}

export function shouldRouteGoalStepToDevPipeline(step) {
  const level = Number(step?.autonomyLevel ?? 0);
  return level >= 3 && normalizeAgentId(step?.agent) === "tsumugi";
}

export function buildGoalDevPipelineInstruction(goal, step) {
  const goalText = String(goal?.description ?? "").trim();
  const stepNo = Number(step?.step ?? 0) || "?";
  const level = Number(step?.autonomyLevel ?? 0) || 0;
  const description = String(step?.description ?? "").trim();
  return [
    `[Goal] ${goalText}`,
    `[Step ${stepNo} / L${level} / tsumugi] ${description}`,
    "",
    "AGENTS.md section 5/6 must be followed.",
    "Work on a branch, do not push, do not merge to main, do not use --yolo or raw API keys.",
    "Report what/why/risk/rollback in Japanese."
  ].join("\n");
}

export function parseGoalGoApproval(subcommand) {
  const t = String(subcommand ?? "").trim();
  const match = t.match(/^go(?:\s+([\s\S]+))?$/i);
  if (!match) return null;
  const detail = String(match[1] ?? "").trim();
  const genericRequest =
    /(?:\u5b8c\u8d70\u3057\u3066\u304f\u3060\u3055\u3044|\u9032\u3081\u3066\u304f\u3060\u3055\u3044|\u7d9a\u3051\u3066\u304f\u3060\u3055\u3044|\u518d\u958b\u3057\u3066\u304f\u3060\u3055\u3044)/i.test(detail);
  const explicit =
    detail.length > 0 &&
    !genericRequest &&
    (
      /(?:\u627f\u8a8d|\u8a31\u53ef|\u7740\u624b\u3057\u3066\u3088\u3044|\u5b9f\u884c\u3057\u3066\u3088\u3044|\u5909\u66f4\u3057\u3066\u3088\u3044)/i.test(detail) ||
      /(?:L3|\u30d5\u30a1\u30a4\u30eb\u5909\u66f4|\u8a2d\u5b9a\u5909\u66f4|\u30b3\u30fc\u30c9\u5909\u66f4|dev pipeline)/i.test(detail)
    );
  return { detail, explicit };
}
