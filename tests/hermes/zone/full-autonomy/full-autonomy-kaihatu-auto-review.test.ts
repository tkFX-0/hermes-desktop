import { describe, expect, it } from "vitest";
import {
  buildShizumeAutoReviewVerdict,
  buildShizumeStructuredVerdict,
  formatShizumeStructuredVerdictBlock,
  gatherDesignReviewInput,
  parseShizumeStructuredVerdict,
  runDesignReviewChecklistLocal,
  SHIZUME_VERDICT_FENCE
} from "../../../../scripts/lib/kaihatu-auto-review.mjs";
import { parseDevSlashCommand } from "../../../../scripts/lib/discord-dev-commands.mjs";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "../../../..");

describe("kaihatu auto review", () => {
  it("parses kaihatu-test and alias !kaihatu test", () => {
    expect(parseDevSlashCommand("!kaihatu-test")).toEqual({
      type: "kaihatu-test",
      instruction: "自動レビュー動作確認"
    });
    expect(parseDevSlashCommand("!kaihatu test レビュー確認")).toEqual({
      type: "kaihatu-test",
      instruction: "レビュー確認"
    });
    expect(parseDevSlashCommand("!kaihatu 本実装")).toEqual({
      type: "kaihatu",
      instruction: "本実装"
    });
  });

  it("builds HOLD when vitest or kaihatu fails", () => {
    const input = gatherDesignReviewInput(ROOT);
    const checklist = runDesignReviewChecklistLocal(input);
    const hold = buildShizumeAutoReviewVerdict({
      instruction: "x",
      kaihatuOk: false,
      testMode: false,
      checklist,
      vitest: { ok: true, passCount: 10, failCount: 0, summary: "passed=10" }
    });
    expect(hold.decision).toBe("HOLD");
    expect(hold.blockers).toContain("kaihatu_dev_failed");
    expect(hold.structured?.verdict).toBe("HOLD");
    expect(hold.structured?.risk).toContain("開発パイプライン失敗");

    const vitestFail = buildShizumeAutoReviewVerdict({
      instruction: "x",
      kaihatuOk: true,
      testMode: false,
      checklist,
      vitest: { ok: false, passCount: 9, failCount: 1, summary: "failed=1" }
    });
    expect(vitestFail.decision).toBe("HOLD");
    expect(vitestFail.blockers).toContain("vitest_zone_failed");
    expect(vitestFail.structured?.verdict).toBe("HOLD");
    expect(vitestFail.structured?.risk).toContain("zone vitest 失敗");
  });

  it("maps GO_PREPARED legacy decision to structured GO", () => {
    const input = gatherDesignReviewInput(ROOT);
    const checklist = runDesignReviewChecklistLocal(input);
    const go = buildShizumeAutoReviewVerdict({
      instruction: "ok",
      kaihatuOk: true,
      testMode: false,
      checklist,
      vitest: { ok: true, passCount: 10, failCount: 0, summary: "passed=10" }
    });
    expect(go.decision).toBe("GO_PREPARED");
    expect(go.structured).toEqual({
      verdict: "GO",
      reason: "自動レビュー通過。この範囲では問題を検出していません。",
      risk: [],
      action: ["マージ/本番は別途人間 GO。"]
    });
  });

  it("emits STOP when dev and vitest both fail", () => {
    const input = gatherDesignReviewInput(ROOT);
    const checklist = runDesignReviewChecklistLocal(input);
    const stop = buildShizumeAutoReviewVerdict({
      instruction: "x",
      kaihatuOk: false,
      testMode: false,
      checklist,
      vitest: { ok: false, passCount: 0, failCount: 3, summary: "failed=3" }
    });
    expect(stop.decision).toBe("HOLD");
    expect(stop.structured?.verdict).toBe("STOP");
    expect(stop.structured?.risk).toEqual(
      expect.arrayContaining(["開発パイプライン失敗", "zone vitest 失敗"])
    );
    expect(stop.structured?.action[0]).toMatch(/操作を止めて/);
  });

  it("emits STOP on safety-critical checklist hold (11.3a)", () => {
    const checklist = [
      { id: "11.3a", autoResult: "hold", prompt: "不変条件コード検証" },
      { id: "11.3b", autoResult: "pass", prompt: "execution disabled" }
    ];
    const structured = buildShizumeStructuredVerdict({
      decision: "HOLD",
      blockers: ["design_checklist_hold"],
      checklist,
      kaihatuOk: false,
      vitestOk: false,
      needsHuman: true
    });
    expect(structured.verdict).toBe("STOP");
    expect(structured.risk).toContain("安全不変条件の自動検証に失敗");
  });

  it("formats and parses machine-readable shizume verdict block", () => {
    const structured = {
      verdict: "HOLD" as const,
      reason: "zone vitest 失敗のため HOLD。",
      risk: ["zone vitest 失敗"],
      action: ["オペレーター確認をお願いします。"]
    };
    const block = formatShizumeStructuredVerdictBlock(structured);
    expect(block).toContain(SHIZUME_VERDICT_FENCE);
    expect(block).toContain('"verdict":"HOLD"');
    const parsed = parseShizumeStructuredVerdict(`しずめレビュー\n${block}`);
    expect(parsed).toEqual(structured);
  });

  it("design checklist uses repo files", () => {
    const input = gatherDesignReviewInput(ROOT);
    expect(input.phases2to10CodePresent).toBe(true);
    expect(input.invariantsVerified).toBe(true);
    const checklist = runDesignReviewChecklistLocal(input);
    expect(checklist.some((c) => c.autoResult === "pass")).toBe(true);
  });

  it("treats StackChan as sealed unless explicitly unsealed and hold is off", () => {
    const root = mkdtempSync(join(tmpdir(), "kaihatu-review-"));
    try {
      writeFileSync(join(root, ".env.local"), "", "utf8");
      expect(gatherDesignReviewInput(root).stackchanDeferred).toBe(true);

      writeFileSync(
        join(root, ".env.local"),
        "SHIKISHIMA_STACKCHAN_UNSEAL=1\nSHIKISHIMA_STACKCHAN_HOLD=1\n",
        "utf8"
      );
      expect(gatherDesignReviewInput(root).stackchanDeferred).toBe(true);

      writeFileSync(
        join(root, ".env.local"),
        "SHIKISHIMA_STACKCHAN_UNSEAL=1\nSHIKISHIMA_STACKCHAN_HOLD=0\n",
        "utf8"
      );
      expect(gatherDesignReviewInput(root).stackchanDeferred).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
