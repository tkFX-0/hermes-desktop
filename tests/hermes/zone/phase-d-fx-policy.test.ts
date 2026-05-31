import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const charterPath = join(
  process.cwd(),
  "docs/shikishima/PHASE_D_FX_EA_GO_CHARTER_2026-06.md"
);

describe("Phase D FX/EA charter (F1 mock)", () => {
  it("charter exists and marks F2 live trading HOLD", () => {
    expect(existsSync(charterPath)).toBe(true);
    const text = readFileSync(charterPath, "utf-8");
    expect(text).toMatch(/F2.*HOLD/i);
    expect(text).toMatch(/既存 EA/);
  });

  it("global safety invariants remain documented in CLAUDE.md", () => {
    const claudePath = join(process.cwd(), "CLAUDE.md");
    const text = readFileSync(claudePath, "utf-8");
    expect(text).toMatch(/execution\s*=\s*disabled/);
    expect(text).toMatch(/decision\s*=\s*HOLD/);
  });
});
