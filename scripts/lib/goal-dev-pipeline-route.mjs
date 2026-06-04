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
  const explicit =
    detail.length > 0 &&
    (
      /承認|許可|着手してよい|実行してよい|変更してよい/i.test(detail) ||
      /L3|ファイル変更|設定変更|コード変更|dev pipeline/i.test(detail)
    ) &&
    !/完走してください|進めてください|続けてください|再開してください/i.test(detail);
  return { detail, explicit };
}

export function classifyGoalStepResult(text) {
  const body = String(text ?? "");
  const holdPatterns = [
    /\bDRIFT_FOUND\b/i,
    /\bHOLD\b/i,
    /停止を継続/,
    /承認とみなさない/,
    /条件を満たしていない/,
    /未確定/,
    /確認待ち/,
    /要確認/,
    /ブロックされました/,
    /blocked/i
  ];
  const reason = holdPatterns.find((re) => re.test(body))?.source ?? null;
  return {
    okToComplete: !reason,
    reason
  };
}

export function formatGoalStepResultForDiscord(text, maxLen = 400) {
  const raw = String(text ?? "").replace(/\r\n/g, "\n").trim();
  const lines = raw.split("\n");
  const filtered = lines.filter((line) => {
    const t = line.trim();
    if (!t) return true;
    return !/shell|sandbox|spawn setup|Node REPL|GitHub|connector|コネクタ|シェル|端末実行|ローカル実行基盤|読み取り失敗|読取にも失敗|外部送信|typescript-expert/i.test(t);
  });
  const cleaned = filtered.join("\n").replace(/\n{3,}/g, "\n\n").trim() || raw;
  return [...cleaned].slice(0, maxLen).join("");
}
