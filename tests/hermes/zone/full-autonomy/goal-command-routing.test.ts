/**
 * [Goal: テスト] Step 4 — ローカル再現可能なテストケース + 期待結果
 *
 * 検証範囲:
 *   1. parseStepsFromLLM  — LLM出力→ステップ配列変換
 *   2. isGoalSlashCommand / isExclusiveSlashCommand — コマンドルーティング
 *   3. isCliCapacityError — "You've hit your session limit" 検出
 *   4. getActiveGoal      — active/paused のみ返す、completed は返さない
 *   5. formatGoalStatus / formatGoalPlanReady — Discord 2000字制限内
 *   6. createGoal / saveGoal — 永続化と status 遷移
 */

import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { mkdirSync, rmSync, existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import {
  parseStepsFromLLM,
  createGoal,
  saveGoal,
  getActiveGoal,
  formatGoalStatus,
  formatGoalPlanReady,
  L3_HOLD_PROMPT,
} from "../../../../scripts/lib/goal-engine.mjs";
import {
  isGoalSlashCommand,
  isCliCapacityError,
} from "../../../../scripts/lib/goal-slash-routing.mjs";

// ── ヘルパー: tmp ディレクトリ ────────────────────────────────────────────────

let tmpBase: string;
beforeEach(() => {
  tmpBase = join(tmpdir(), `goal-test-${Date.now()}`);
  mkdirSync(join(tmpBase, "goals"), { recursive: true });
});
afterEach(() => {
  if (existsSync(tmpBase)) rmSync(tmpBase, { recursive: true, force: true });
});

// ─── 1. parseStepsFromLLM ────────────────────────────────────────────────────

describe("parseStepsFromLLM", () => {
  it("JSON コードブロックをパースできる", () => {
    const text = `計画です:\n\`\`\`json\n[{"step":1,"description":"調査","agent":"shirube","autonomyLevel":1}]\n\`\`\``;
    const steps = parseStepsFromLLM(text);
    expect(steps).not.toBeNull();
    expect(steps).toHaveLength(1);
    expect(steps![0]).toMatchObject({
      step: 1,
      description: "調査",
      agent: "shirube",
      autonomyLevel: 1,
      status: "pending",
      result: null,
    });
  });

  it("裸の JSON 配列（コードブロックなし）をパースできる", () => {
    const text = `[{"step":1,"description":"ログ確認","autonomyLevel":2}]`;
    const steps = parseStepsFromLLM(text);
    expect(steps).not.toBeNull();
    expect(steps![0].agent).toBe("shikishima"); // デフォルト
    expect(steps![0].autonomyLevel).toBe(2);
  });

  it("autonomyLevel の別名 level も受け付ける", () => {
    const text = `[{"step":1,"description":"変更","level":3,"agent":"hajime"}]`;
    const steps = parseStepsFromLLM(text);
    expect(steps![0].autonomyLevel).toBe(3);
  });

  it("description の別名 task も受け付ける", () => {
    const text = `[{"step":1,"task":"タスク名","agent":"hajime","autonomyLevel":1}]`;
    const steps = parseStepsFromLLM(text);
    expect(steps![0].description).toBe("タスク名");
  });

  it("step フィールドがなければ 1-indexed index を使う", () => {
    const text = `[{"description":"A"},{"description":"B"}]`;
    const steps = parseStepsFromLLM(text);
    expect(steps![0].step).toBe(1);
    expect(steps![1].step).toBe(2);
  });

  it("不正な JSON は null を返す", () => {
    expect(parseStepsFromLLM("これはJSONではありません")).toBeNull();
  });

  it("配列でないオブジェクト は null を返す", () => {
    expect(parseStepsFromLLM('{"step":1}')).toBeNull();
  });

  it("空文字列 は null を返す", () => {
    expect(parseStepsFromLLM("")).toBeNull();
  });

  it("空配列は空配列を返す（null ではない）", () => {
    const steps = parseStepsFromLLM("[]");
    expect(Array.isArray(steps)).toBe(true);
    expect(steps).toHaveLength(0);
  });
});

// ─── 2. /goal コマンドルーティング ───────────────────────────────────────────

describe("isGoalSlashCommand (routing detection)", () => {
  it("/goal テスト は true", () => {
    expect(isGoalSlashCommand("/goal テスト")).toBe(true);
  });

  it("/goal（引数なし）は true", () => {
    expect(isGoalSlashCommand("/goal")).toBe(true);
  });

  it("/goal status は true", () => {
    expect(isGoalSlashCommand("/goal status")).toBe(true);
  });

  it("/goal go は true", () => {
    expect(isGoalSlashCommand("/goal go")).toBe(true);
  });

  it("/goals（複数形）は false — 誤検知防止", () => {
    expect(isGoalSlashCommand("/goals")).toBe(false);
  });

  it("chat message は false", () => {
    expect(isGoalSlashCommand("テストをお願い")).toBe(false);
  });

  it("!kaihatu は false", () => {
    expect(isGoalSlashCommand("!kaihatu テスト")).toBe(false);
  });
});

// ─── 3. isCliCapacityError ───────────────────────────────────────────────────

describe("isCliCapacityError (session limit 検出)", () => {
  it('"You\'ve hit your session limit" を検出する', () => {
    expect(isCliCapacityError("You've hit your session limit")).toBe(true);
  });

  it("rate limit を検出する", () => {
    expect(isCliCapacityError("rate limit exceeded")).toBe(true);
  });

  it("quota exceeded を検出する", () => {
    expect(isCliCapacityError("quota exceeded for this billing period")).toBe(true);
  });

  it("大文字小文字を問わず検出する", () => {
    expect(isCliCapacityError("RATE LIMIT")).toBe(true);
    expect(isCliCapacityError("Session Limit")).toBe(true);
  });

  it("通常のエラーメッセージは false", () => {
    expect(isCliCapacityError("file not found")).toBe(false);
    expect(isCliCapacityError("")).toBe(false);
  });

  it("null/undefined は false（クラッシュしない）", () => {
    expect(isCliCapacityError(null as unknown as string)).toBe(false);
  });
});

// ─── 4. getActiveGoal ────────────────────────────────────────────────────────

describe("getActiveGoal", () => {
  it("active な goal を返す", () => {
    createGoal(tmpBase, "テスト目標");
    const g = getActiveGoal(tmpBase);
    expect(g).not.toBeNull();
    expect(g!.description).toBe("テスト目標");
    expect(g!.status).toBe("active");
  });

  it("paused な goal を返す", () => {
    const goal = createGoal(tmpBase, "L3目標");
    goal.status = "paused";
    saveGoal(tmpBase, goal);
    const g = getActiveGoal(tmpBase);
    expect(g!.status).toBe("paused");
  });

  it("completed な goal は返さない", () => {
    const goal = createGoal(tmpBase, "完了済み");
    goal.status = "completed";
    saveGoal(tmpBase, goal);
    expect(getActiveGoal(tmpBase)).toBeNull();
  });

  it("cancelled な goal は返さない", () => {
    const goal = createGoal(tmpBase, "キャンセル済み");
    goal.status = "cancelled";
    saveGoal(tmpBase, goal);
    expect(getActiveGoal(tmpBase)).toBeNull();
  });

  it("goal が一件もなければ null を返す", () => {
    expect(getActiveGoal(tmpBase)).toBeNull();
  });

  it("複数ある場合は最新を優先する", async () => {
    // ID の生成が Date.now() ベースなので 2ms 待つ
    const g1 = createGoal(tmpBase, "古い目標");
    await new Promise((r) => setTimeout(r, 2));
    createGoal(tmpBase, "新しい目標");
    const g = getActiveGoal(tmpBase);
    // sort().reverse() → 辞書順逆 → タイムスタンプが大きい方が先
    expect(g!.id).not.toBe(g1.id);
    expect(g!.description).toBe("新しい目標");
  });
});

// ─── 5. formatGoalStatus / formatGoalPlanReady ───────────────────────────────

describe("formatGoalStatus", () => {
  it("Discord 2000字制限内に収まる", () => {
    const goal = createGoal(tmpBase, "長いテスト目標");
    goal.steps = Array.from({ length: 20 }, (_, i) => ({
      step: i + 1,
      description: `Step ${i + 1}: 非常に長いステップ説明が続きます。テスト用途のため意図的に長くしています。`,
      agent: "shikishima",
      autonomyLevel: 1,
      status: "pending" as const,
      result: null,
    }));
    const text = formatGoalStatus(goal);
    expect(text.length).toBeLessThanOrEqual(2000);
  });

  it("ステップ0件のときはプレースホルダを表示する", () => {
    const goal = createGoal(tmpBase, "空の目標");
    const text = formatGoalStatus(goal);
    expect(text).toMatch(/ステップ計画中/);
  });

  it("completed ステップに ✅ アイコンを表示する", () => {
    const goal = createGoal(tmpBase, "進捗テスト");
    goal.steps = [
      { step: 1, description: "完了ステップ", agent: "hajime", autonomyLevel: 1, status: "completed", result: "ok" },
    ];
    expect(formatGoalStatus(goal)).toMatch(/✅/);
  });
});

describe("formatGoalPlanReady", () => {
  it("Discord 2000字制限内に収まる", () => {
    const goal = createGoal(tmpBase, "計画テスト");
    goal.steps = Array.from({ length: 15 }, (_, i) => ({
      step: i + 1,
      description: `Step ${i + 1}: テスト用の長いステップ説明です。`,
      agent: "shikishima",
      autonomyLevel: i < 10 ? 2 : 3,
      status: "pending" as const,
      result: null,
    }));
    const text = formatGoalPlanReady(goal);
    expect(text.length).toBeLessThanOrEqual(2000);
  });

  it("L3ステップは「要確認」と表示される", () => {
    const goal = createGoal(tmpBase, "L3テスト");
    goal.steps = [
      { step: 1, description: "L3ステップ", agent: "hajime", autonomyLevel: 3, status: "pending", result: null },
    ];
    expect(formatGoalPlanReady(goal)).toMatch(/要確認/);
  });

  it("L1ステップは「自動」と表示される", () => {
    const goal = createGoal(tmpBase, "自動ステップ");
    goal.steps = [
      { step: 1, description: "L1ステップ", agent: "shirube", autonomyLevel: 1, status: "pending", result: null },
    ];
    expect(formatGoalPlanReady(goal)).toMatch(/自動/);
  });
});

describe("L3_HOLD_PROMPT", () => {
  it("L3+ では execution agent を tsumugi と表示する", () => {
    const prompt = L3_HOLD_PROMPT({
      step: 5,
      description: "file change",
      agent: "hajime",
      autonomyLevel: 3,
    });
    expect(prompt).toContain("Execution: tsumugi");
    expect(prompt).toContain("Agent (plan): hajime");
  });

  it("L2 では planner agent のみ表示する", () => {
    const prompt = L3_HOLD_PROMPT({
      step: 2,
      description: "read only",
      agent: "hajime",
      autonomyLevel: 2,
    });
    expect(prompt).toContain("Agent: hajime");
    expect(prompt).not.toContain("Execution:");
  });

  it("L4 PID ステップでは process 専用 HOLD を表示する", () => {
    const prompt = L3_HOLD_PROMPT({
      step: 7,
      description: "2 PID 解消に停止・再起動",
      agent: "shizume",
      autonomyLevel: 4,
    });
    expect(prompt).toContain("L4 process confirmation");
    expect(prompt).not.toContain("L3 file/config changes approved");
  });
});

// ─── 6. createGoal / saveGoal ステータス遷移 ─────────────────────────────────

describe("createGoal / saveGoal (state machine)", () => {
  it("新規 goal は active ステータスで作成される", () => {
    const g = createGoal(tmpBase, "初期状態テスト");
    expect(g.status).toBe("active");
    expect(g.steps).toHaveLength(0);
    expect(g.currentStep).toBe(0);
    expect(g.id).toMatch(/^goal-\d+$/);
  });

  it("saveGoal は updatedAt を更新する", async () => {
    const g = createGoal(tmpBase, "更新テスト");
    const before = g.updatedAt;
    await new Promise((r) => setTimeout(r, 5));
    g.status = "paused";
    saveGoal(tmpBase, g);
    const reloaded = getActiveGoal(tmpBase);
    expect(reloaded!.status).toBe("paused");
    expect(reloaded!.updatedAt).not.toBe(before);
  });

  it("active → paused → active のサイクルが成立する", () => {
    const g = createGoal(tmpBase, "サイクルテスト");
    g.status = "paused";
    saveGoal(tmpBase, g);
    expect(getActiveGoal(tmpBase)!.status).toBe("paused");

    g.status = "active";
    saveGoal(tmpBase, g);
    expect(getActiveGoal(tmpBase)!.status).toBe("active");
  });

  it("active → completed にすると getActiveGoal は null を返す", () => {
    const g = createGoal(tmpBase, "完了遷移テスト");
    g.status = "completed";
    saveGoal(tmpBase, g);
    expect(getActiveGoal(tmpBase)).toBeNull();
  });
});
