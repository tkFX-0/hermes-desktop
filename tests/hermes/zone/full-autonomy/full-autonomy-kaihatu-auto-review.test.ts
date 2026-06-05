import { describe, expect, it } from "vitest";
import {
  buildShizumeAutoReviewVerdict,
  gatherDesignReviewInput,
  runDesignReviewChecklistLocal
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

    const vitestFail = buildShizumeAutoReviewVerdict({
      instruction: "x",
      kaihatuOk: true,
      testMode: false,
      checklist,
      vitest: { ok: false, passCount: 9, failCount: 1, summary: "failed=1" }
    });
    expect(vitestFail.decision).toBe("HOLD");
    expect(vitestFail.blockers).toContain("vitest_zone_failed");
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
