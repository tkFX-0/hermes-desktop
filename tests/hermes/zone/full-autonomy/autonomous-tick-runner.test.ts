import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

describe("autonomous-tick-runner.mjs", () => {
  let projectRoot: string;

  beforeEach(() => {
    projectRoot = mkdtempSync(join(tmpdir(), "auto-tick-"));
    mkdirSync(join(projectRoot, ".shikishima-memory"), { recursive: true });
    process.env.VITEST = "true";
  });

  afterEach(() => {
    rmSync(projectRoot, { recursive: true, force: true });
    delete process.env.VITEST;
  });

  it("blocks maintenance when track D not active", async () => {
    const { runCappedAutonomousTickMjs } = await import(
      "../../../../scripts/lib/autonomous-tick-runner.mjs"
    );
    const tick = await runCappedAutonomousTickMjs(projectRoot, "autonomy.maintenance");
    expect(tick.allowed).toBe(false);
    expect(tick.reasons).toContain("track_d_not_active");
  });

  it("allows maintenance when track D + caps OK", async () => {
    writeFileSync(
      join(projectRoot, ".shikishima-memory", "operational-release.local.json"),
      JSON.stringify({
        trackDGoAcknowledged: true,
        executionEnabled: true,
        productionReady: true,
      }),
      "utf-8",
    );
    const { runCappedAutonomousTickMjs } = await import(
      "../../../../scripts/lib/autonomous-tick-runner.mjs"
    );
    delete process.env.VITEST;
    const tick = await runCappedAutonomousTickMjs(projectRoot, "autonomy.maintenance");
    process.env.VITEST = "true";
    expect(tick.allowed).toBe(true);
    expect(tick.maintenance?.pipeline?.decisionForAutomation).toBeDefined();
  });
});
