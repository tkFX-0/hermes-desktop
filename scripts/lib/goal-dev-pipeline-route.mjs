import { execFileSync } from "node:child_process";

export function shouldRouteGoalStepToDevPipeline(step) {
  const level = Number(step?.autonomyLevel ?? 0);
  return level >= 3;
}

/** L0-L2 steps: read-only analysis/investigation via dev pipeline (no writes allowed). */
export function shouldRouteGoalStepToReadOnlyPipeline(step) {
  const level = Number(step?.autonomyLevel ?? 0);
  return level <= 2;
}

/** L3+ dev-pipeline steps always execute as tsumugi regardless of planner agent. */
export function resolveGoalStepExecutionAgent(step) {
  return shouldRouteGoalStepToDevPipeline(step)
    ? "tsumugi"
    : String(step?.agent ?? "shikishima");
}

/**
 * Build a read-only instruction prompt for L0-L2 steps.
 * (a) Embeds explicit "READ ONLY" constraint to prevent writes at prompt level.
 *     Cursor agent --mode ask enforces this at tool level.
 */
export function buildGoalReadOnlyInstruction(goal, step) {
  const goalText = String(goal?.description ?? "").trim();
  const stepNo = Number(step?.step ?? 0) || "?";
  const level = Number(step?.autonomyLevel ?? 0) || 0;
  const description = String(step?.description ?? "").trim();
  const agent = String(step?.agent ?? "shikishima");
  return [
    `[Goal] ${goalText}`,
    `[Step ${stepNo} / L${level} / ${agent}] ${description}`,
    "",
    "READ ONLY — do NOT create, write, edit, or delete any files.",
    "Do NOT run git commit, git add, rm, mv, or any destructive operation.",
    "Read files and report findings only. This step has no write permission.",
    "A git status check will run after this step; any modification is a read-only violation.",
    "AGENTS.md section 5/6 must be followed.",
    "Report findings in Japanese."
  ].join("\n");
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
    "For PID/process cleanup: run read-only preflight first; do NOT taskkill or `preflight --clean` without explicit L4 human approval.",
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

const INTERNAL_STEP_LINE =
  /(?:sandbox|spawn setup|node_repl|GitHub|connector|shell_command|MCP|\u30b7\u30a7\u30eb|\u30b3\u30cd\u30af\u30bf|\u30ed\u30fc\u30ab\u30eb(?:\u8aad\u53d6|\u8aad\u307f\u53d6\u308a|\u5b9f\u884c)|\u7aef\u672b\u5b9f\u884c|\u8aad\u307f\u53d6\u308a\u5931\u6557|\u8aad\u53d6\u306b\u3082\u5931\u6557)/i;

export function formatGoalStepResultForDiscord(text, maxLen = 400) {
  const raw = String(text ?? "").replace(/\r\n/g, "\n").trim();
  const filtered = raw
    .split("\n")
    .filter((line) => !INTERNAL_STEP_LINE.test(line.trim()))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const cleaned = filtered || raw;
  return [...cleaned].slice(0, maxLen).join("");
}

/**
 * (b) Read-only violation guard: detect uncommitted changes after an L0-L2 step.
 * @param {string} repoRoot
 * @returns {{ dirty: boolean, summary: string }}
 */
export function checkReadOnlyViolation(repoRoot) {
  try {
    const out = execFileSync("git", ["status", "--porcelain"], {
      cwd: repoRoot,
      encoding: "utf8",
      timeout: 10_000
    }).trim();
    if (!out) return { dirty: false, summary: "clean" };
    const lines = out.split("\n").filter(Boolean);
    return {
      dirty: true,
      summary: lines.slice(0, 5).join(", ") + (lines.length > 5 ? ` … (${lines.length} total)` : "")
    };
  } catch (e) {
    return { dirty: false, summary: `git_status_error: ${String(e?.message ?? e).slice(0, 80)}` };
  }
}

/**
 * Revert uncommitted changes after a read-only violation.
 * Restores tracked files and removes new untracked files.
 * @param {string} repoRoot
 * @returns {{ reverted: boolean, error?: string }}
 */
export function revertReadOnlyViolation(repoRoot) {
  try {
    execFileSync("git", ["checkout", "--", "."], { cwd: repoRoot, encoding: "utf8", timeout: 15_000 });
    execFileSync("git", ["clean", "-f"], { cwd: repoRoot, encoding: "utf8", timeout: 15_000 });
    return { reverted: true };
  } catch (e) {
    return { reverted: false, error: String(e?.message ?? e).slice(0, 120) };
  }
}
