import { mkdtempSync, mkdirSync, rmSync, symlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { afterEach, describe, expect, it } from "vitest";
import {
  checkZonePath,
  validatePathInput,
} from "../../../src/main/ichikishima/autonomy-zone";

const tempRoots: string[] = [];

function makeZoneRoot(): string {
  const projectRoot = mkdtempSync(join(tmpdir(), "hermes-path-guard-test-"));
  const zoneRoot = join(projectRoot, "sandbox", "hermes-autonomy-zone");
  mkdirSync(zoneRoot, { recursive: true });
  tempRoots.push(projectRoot);
  return zoneRoot;
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("Hermes Autonomy Zone path guard", () => {
  it("allows a normal path inside the sandbox", () => {
    const zoneRoot = makeZoneRoot();
    const result = checkZonePath({
      zoneRoot,
      targetPath: "work/task.md",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.inZone).toBe(true);
    expect(result.relativePath).toContain("work");
  });

  it("rejects traversal outside the Zone root", () => {
    const zoneRoot = makeZoneRoot();
    const result = checkZonePath({
      zoneRoot,
      targetPath: "../outside.md",
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reasonCode).toBe("outside_zone");
  });

  it("rejects absolute paths outside the Zone root", () => {
    const zoneRoot = makeZoneRoot();
    const outsideRoot = mkdtempSync(join(tmpdir(), "hermes-path-outside-"));
    tempRoots.push(outsideRoot);

    const result = checkZonePath({
      zoneRoot,
      targetPath: join(outsideRoot, "file.txt"),
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reasonCode).toBe("outside_zone");
  });

  it("rejects symlink or junction targets outside the Zone root", () => {
    const zoneRoot = makeZoneRoot();
    const outsideRoot = mkdtempSync(
      join(tmpdir(), "hermes-path-linked-outside-"),
    );
    tempRoots.push(outsideRoot);
    const linkPath = join(zoneRoot, "linked-outside");

    try {
      symlinkSync(outsideRoot, linkPath, "junction");
    } catch {
      // Some Windows policies disable symlink/junction creation in test contexts.
      return;
    }

    const result = checkZonePath({
      zoneRoot,
      targetPath: "linked-outside/file.txt",
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reasonCode).toBe("outside_zone");
  });

  it("rejects empty, control-character, home, and env expansion inputs", () => {
    const cases = [
      "",
      "work/\0bad.txt",
      "~/work.txt",
      "work/%APPDATA%/file.txt",
    ];

    for (const pathValue of cases) {
      const result = validatePathInput(pathValue);

      expect(result?.ok).toBe(false);
      if (!result || result.ok) continue;
      expect(result.reasonCode).toBe("invalid_path_input");
    }
  });
});
