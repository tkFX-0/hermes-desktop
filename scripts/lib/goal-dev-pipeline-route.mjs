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
