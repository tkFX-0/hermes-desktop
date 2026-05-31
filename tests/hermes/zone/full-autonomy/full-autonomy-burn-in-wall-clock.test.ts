import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  evaluateBurnInWallClock,
  readBurnInWallClockStore,
  recordBurnInWallClockTick,
  writeBurnInWallClockStore
} from "../../../../src/main/shikishima-full-autonomy/burn-in-wall-clock-store";

describe("burn-in wall-clock store", () => {
  let root: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "shiki-burn-"));
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("requires humanGoAcknowledged for wallClockPass", () => {
    recordBurnInWallClockTick(root, "t1", "autonomy.maintenance");
    recordBurnInWallClockTick(root, "t2", "autonomy.maintenance");
    recordBurnInWallClockTick(root, "t3", "discord.read");
    const partial = evaluateBurnInWallClock(root);
    expect(partial.simulationPass).toBe(true);
    expect(partial.wallClockPass).toBe(false);

    const store = readBurnInWallClockStore(root);
    writeBurnInWallClockStore(root, { ...store, humanGoAcknowledged: true });
    const full = evaluateBurnInWallClock(root);
    expect(full.wallClockPass).toBe(true);
  });
});
