/**
 * つむぎ SKILLS — 実装
 * SK-TSU-03: typecheck / SK-TSU-06: debug
 */

import { execFile } from "child_process";
import { join } from "path";
import type { SkillInput, SkillOutput, AgentContext } from "./skill-types";
import { claudeCodeTask } from "../claude-code-service";

const PROJECT_ROOT = join(__dirname, "../../..");

// ─── SK-TSU-03: typecheck ─────────────────────────────────────────────────────

function runNpmScript(script: string, cwd: string): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve) => {
    execFile(
      "cmd",
      ["/c", `npm run ${script} 2>&1`],
      { cwd, timeout: 60_000, maxBuffer: 512 * 1024 },
      (err, stdout) => {
        resolve({ stdout: stdout || "", stderr: "", code: (err?.code as number | undefined) ?? 0 });
      }
    );
  });
}

export async function skillTypecheck(input: SkillInput, _ctx: AgentContext): Promise<SkillOutput> {
  const start = Date.now();
  const scope = (input.params?.scope as string) ?? "node";

  const scriptMap: Record<string, string> = {
    node: "typecheck:node",
    web:  "typecheck:web",
    all:  "typecheck",
  };
  const script = scriptMap[scope] ?? "typecheck:node";

  const { stdout, code } = await runNpmScript(script, PROJECT_ROOT);

  const errors = stdout.match(/error TS\d+:/g) ?? [];
  const pass = code === 0 && errors.length === 0;

  const result = pass
    ? `[typecheck] PASS — エラー0件 (${script})`
    : [
        `[typecheck] FAIL — ${errors.length}件のエラー (${script})`,
        "",
        stdout.split("\n").filter((l) => l.includes("error TS") || l.includes("Error:")).slice(0, 20).join("\n"),
      ].join("\n");

  return {
    success: pass,
    result,
    data: { errors: errors.length, pass, script },
    sideEffects: pass ? [] : [`typecheck失敗: ${errors.length}件のエラー`],
    durationMs: Date.now() - start,
  };
}

// ─── SK-TSU-06: debug ─────────────────────────────────────────────────────────

const DEBUG_PROMPT_PREFIX =
  "[デバッグモード] あなたはエラーを診断する専門家です。\n" +
  "以下の形式で回答してください:\n" +
  "1. **根本原因** (1〜2行)\n" +
  "2. **影響ファイル** (パス一覧)\n" +
  "3. **修正手順** (番号付き)\n" +
  "4. **再発防止策** (任意)\n\n" +
  "エラーログ:\n";

export async function skillDebug(input: SkillInput, _ctx: AgentContext): Promise<SkillOutput> {
  const start = Date.now();

  const result = await claudeCodeTask(
    DEBUG_PROMPT_PREFIX + input.raw,
    "claude-sonnet-4-6"
  );

  return {
    success: result.success,
    result: result.success ? result.output : `[debug失敗] ${result.error}`,
    durationMs: Date.now() - start,
  };
}
