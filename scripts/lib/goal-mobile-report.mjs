const MAX_SUMMARY_CHARS = 1200;
const DEFAULT_ATTACHMENT_THRESHOLD = 900;

const SECRET_LINE =
  /^\s*(?:[\w.-]*_)?(?:token|secret|password|passwd|api[_-]?key|authorization|cookie|session|relay-cookies|\.env)\s*[:=]/i;
const SECRET_WORD =
  /(?:token|secret|password|passwd|api[_-]?key|authorization|cookie|relay-cookies|\.env)/gi;
const IPV4 = /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g;
const URL_SECRET_QUERY = /([?&](?:token|key|secret|password|auth|session)=)[^&\s]+/gi;

export function redactGoalReportText(text) {
  return String(text ?? "")
    .split(/\r?\n/)
    .map((line) => {
      if (SECRET_LINE.test(line)) return "[REDACTED_SECRET_LINE]";
      return line
        .replace(URL_SECRET_QUERY, "$1[REDACTED]")
        .replace(IPV4, "[REDACTED_IP]")
        .replace(SECRET_WORD, "[REDACTED_SECRET_KEY]");
    })
    .join("\n");
}

function clip(text, maxChars) {
  const chars = [...String(text ?? "")];
  return chars.length <= maxChars ? chars.join("") : `${chars.slice(0, maxChars - 1).join("")}…`;
}

function normalizeSteps(goal) {
  return Array.isArray(goal?.steps) ? goal.steps : [];
}

function stepLine(step) {
  const no = step?.step ?? "?";
  const status = step?.status ?? "unknown";
  const agent = step?.agent ?? "unknown";
  const desc = String(step?.description ?? "").trim();
  return `Step ${no}: ${status} / ${agent} / ${clip(desc, 46)}`;
}

export function buildGoalMobileSummary(goal) {
  const steps = normalizeSteps(goal);
  const completed = steps.filter((s) => s.status === "completed").length;
  const holds = steps.filter((s) => s.status === "paused" || Number(s.autonomyLevel ?? 0) >= 3 && s.status !== "completed");
  const failed = steps.filter((s) => s.status === "failed");
  const visibleSteps = steps.slice(0, 4).map(stepLine);
  const more = steps.length > visibleSteps.length ? [`…ほか ${steps.length - visibleSteps.length} step`] : [];
  const next =
    failed.length > 0
      ? "/goal status で失敗箇所を確認"
      : holds.length > 0
        ? "残HOLDを確認して、必要なら明示GO"
        : "次の目標を入力できます";

  const lines = [
    "✅ /goal 完了",
    "",
    `目標: ${clip(goal?.description ?? "", 90)}`,
    `結論: ${completed}/${steps.length} step 完了`,
    `残HOLD: ${holds.length} / 失敗: ${failed.length}`,
    "",
    "主要ステップ:",
    ...visibleSteps,
    ...more,
    "",
    `次: ${next}`,
  ];
  return clip(redactGoalReportText(lines.join("\n")), MAX_SUMMARY_CHARS);
}

export function buildGoalDetailMarkdown(goal) {
  const steps = normalizeSteps(goal);
  const lines = [
    `# /goal 完了レポート`,
    "",
    `- Goal: ${goal?.description ?? ""}`,
    `- Status: ${goal?.status ?? ""}`,
    `- Created: ${goal?.createdAt ?? ""}`,
    `- Updated: ${goal?.updatedAt ?? ""}`,
    "",
    "## Steps",
    "",
  ];
  for (const step of steps) {
    lines.push(
      `### Step ${step?.step ?? "?"}`,
      "",
      `- Status: ${step?.status ?? ""}`,
      `- Agent: ${step?.agent ?? ""}`,
      `- Autonomy: L${step?.autonomyLevel ?? ""}`,
      `- Description: ${step?.description ?? ""}`,
      `- Result: ${step?.result ?? ""}`,
      ""
    );
  }
  return redactGoalReportText(lines.join("\n"));
}

export function buildGoalMobileReport(goal, options = {}) {
  const detail = buildGoalDetailMarkdown(goal);
  const threshold = Number(options.attachmentThreshold ?? DEFAULT_ATTACHMENT_THRESHOLD);
  return {
    content: buildGoalMobileSummary(goal),
    attachmentText: detail.length > threshold ? detail : "",
    filename: `goal-report-${String(goal?.id ?? Date.now()).replace(/[^a-zA-Z0-9_.-]/g, "_")}.md`,
    redaction: {
      secretLinePattern: true,
      secretKeywordPattern: true,
      ipv4Pattern: true,
      secretQueryPattern: true,
    },
  };
}
