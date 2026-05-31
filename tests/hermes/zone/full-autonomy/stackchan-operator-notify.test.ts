import { describe, expect, it, afterEach } from "vitest";
import {
  OPERATOR_NOTIFY_INTENTS,
  parseCodexHookNotifyIntent,
  parseCursorHookNotifyIntent,
  resolveOperatorNotifyPhrase,
  workflowStageToNotifyIntent,
  isOperatorNotifyIntent,
  shouldDebounceOperatorNotify,
  markOperatorNotifyDebounce
} from "../../../../scripts/lib/stackchan-operator-notify.mjs";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

describe("stackchan operator notify", () => {
  const prev = { ...process.env };

  afterEach(() => {
    process.env = { ...prev };
  });

  it("exposes distinct phrases per intent", () => {
    const phrases = OPERATOR_NOTIFY_INTENTS.map((i) => resolveOperatorNotifyPhrase(i));
    const unique = new Set(phrases);
    expect(unique.size).toBe(OPERATOR_NOTIFY_INTENTS.length);
  });

  it("parses cursor plan mode", () => {
    expect(parseCursorHookNotifyIntent({ mode: "plan" })).toBe("plan_selection_needed");
  });

  it("parses cursor question", () => {
    expect(parseCursorHookNotifyIntent({ status: "completed", needs_input: true })).toBe(
      "operator_question"
    );
  });

  it("parses human judgment", () => {
    expect(parseCursorHookNotifyIntent({ status: "awaiting_approval" })).toBe(
      "human_judgment_needed"
    );
  });

  it("defaults to cursor complete", () => {
    expect(parseCursorHookNotifyIntent({ status: "completed" })).toBe("cursor_answer_complete");
  });

  it("parses codex answer complete", () => {
    expect(parseCodexHookNotifyIntent({ status: "completed" })).toBe("codex_answer_complete");
  });

  it("parses codex question", () => {
    expect(parseCodexHookNotifyIntent({ status: "needs_input", question: "確認しますか" })).toBe(
      "codex_operator_question"
    );
  });

  it("parses codex selection needed", () => {
    expect(parseCodexHookNotifyIntent({ status: "completed", choose: ["A", "B"] })).toBe(
      "codex_selection_needed"
    );
  });

  it("respects codex env override intent", () => {
    process.env.SHIKISHIMA_CODEX_NOTIFY_INTENT = "codex_selection_needed";
    expect(parseCodexHookNotifyIntent({ status: "completed" })).toBe("codex_selection_needed");
  });

  it("respects env override intent", () => {
    process.env.SHIKISHIMA_CURSOR_NOTIFY_INTENT = "operator_question";
    expect(parseCursorHookNotifyIntent({ mode: "plan" })).toBe("operator_question");
  });

  it("workflow human stage maps to workflow_human_gate", () => {
    expect(workflowStageToNotifyIntent("eval", "human")).toBe("workflow_human_gate");
  });

  it("per-intent debounce is independent", () => {
    const dir = mkdtempSync(join(tmpdir(), "op-notify-"));
    markOperatorNotifyDebounce(dir, "cursor_answer_complete");
    expect(shouldDebounceOperatorNotify(dir, "cursor_answer_complete", 60_000)).toBe(true);
    expect(shouldDebounceOperatorNotify(dir, "human_judgment_needed", 60_000)).toBe(false);
    rmSync(dir, { recursive: true, force: true });
  });

  it("can disable single intent via env", () => {
    process.env.SHIKISHIMA_OPERATOR_NOTIFY_PLAN_SELECTION_NEEDED = "0";
    expect(isOperatorNotifyIntent("plan_selection_needed")).toBe(false);
    expect(isOperatorNotifyIntent("cursor_answer_complete")).toBe(true);
  });
});
