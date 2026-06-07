import { describe, expect, it } from "vitest";
import {
  buildAutonomyScopePromptBlock,
  classifyAutonomyRequest,
} from "../../../../scripts/lib/autonomy-scope-calibration.mjs";

describe("autonomy scope calibration", () => {
  it("allows MQL5 code writing at L0-L2 without §7 HOLD", () => {
    const scope = classifyAutonomyRequest("MQL5のコードを書いて");
    expect(scope.decision).toBe("GO");
    expect(scope.band).toBe("L0-L2");
    expect(scope.sealed).toBe(false);
    expect(scope.autonomyLevel).toBeGreaterThanOrEqual(1);
    expect(scope.autonomyLevel).toBeLessThanOrEqual(2);
  });

  it("HOLDs MT5 live connect and real order requests under §7", () => {
    const scope = classifyAutonomyRequest("MT5に接続して発注して");
    expect(scope.decision).toBe("HOLD");
    expect(scope.band).toBe("§7");
    expect(scope.sealed).toBe(true);
    expect(scope.sealedCategory).toBe("mt5_live_or_real_order");
  });

  it("does not §7 HOLD on research/backtest/simulation keywords alone", () => {
    for (const text of [
      "EAのバックテスト設計をして",
      "トレード戦略をリサーチして",
      "外部EAを参考にMQL5の下書きを作って",
    ]) {
      const scope = classifyAutonomyRequest(text);
      expect(scope.sealed, text).toBe(false);
      expect(scope.decision, text).toBe("GO");
      expect(scope.band, text).toBe("L0-L2");
    }
  });

  it("HOLDs StackChan physical control under §7", () => {
    const scope = classifyAutonomyRequest("StackChanのサーボを動かして");
    expect(scope.decision).toBe("HOLD");
    expect(scope.sealedCategory).toBe("stackchan_physical_control");
  });

  it("requires tk approval for L3+ operations", () => {
    const scope = classifyAutonomyRequest("変更をgit pushして");
    expect(scope.decision).toBe("HOLD");
    expect(scope.band).toBe("L3+");
    expect(scope.needsTkApproval).toBe(true);
    expect(scope.sealed).toBe(false);
  });

  it("documents narrow §7 and broad L0-L2 in prompt block", () => {
    const block = buildAutonomyScopePromptBlock();
    expect(block).toContain("§7封印");
    expect(block).toContain("MQL5コード作成");
    expect(block).toContain("キーワード単体では §7 HOLD にしない");
  });
});
