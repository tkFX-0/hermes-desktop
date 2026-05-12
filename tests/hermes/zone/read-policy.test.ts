import { mkdtempSync, mkdirSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { afterEach, describe, expect, it } from "vitest";
import { checkReadAllowed } from "../../../src/main/ichikishima/autonomy-zone";

const tempRoots: string[] = [];

function makeZoneRoot(): string {
  const projectRoot = mkdtempSync(join(tmpdir(), "hermes-read-policy-test-"));
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

describe("Hermes Autonomy Zone read policy", () => {
  it("allows a normal file path inside the Zone root", () => {
    const zoneRoot = makeZoneRoot();
    const result = checkReadAllowed({
      zoneRoot,
      targetPath: "work/notes.md",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.reasonCode).toBeNull();
    expect(result.reason).toBeNull();
    expect(result.relativePath).toContain("work");
  });

  it("rejects traversal outside the Zone root", () => {
    const zoneRoot = makeZoneRoot();
    const result = checkReadAllowed({
      zoneRoot,
      targetPath: "../outside.md",
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reasonCode).toBe("DENIED_BY_PATH_GUARD");
    expect(result.reason).toContain("Zone root");
  });

  it("rejects absolute paths outside the Zone root", () => {
    const zoneRoot = makeZoneRoot();
    const outsideRoot = mkdtempSync(join(tmpdir(), "hermes-read-outside-"));
    tempRoots.push(outsideRoot);

    const result = checkReadAllowed({
      zoneRoot,
      targetPath: join(outsideRoot, "file.txt"),
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reasonCode).toBe("DENIED_BY_PATH_GUARD");
  });

  it("rejects denylisted read targets", () => {
    const zoneRoot = makeZoneRoot();
    const cases = [
      ["work/.env.local", ".env.local"],
      ["work/secrets/file.txt", "secrets"],
      ["work/token.txt", "token.txt"],
      ["work/.git/config", ".git"],
      ["work/sessions.db", "sessions.db"],
      ["work/MT5/config.txt", "mt5"],
      ["work/trade_history/report.csv", "trade_history"],
    ] as const;

    for (const [targetPath, matchedRule] of cases) {
      const result = checkReadAllowed({ zoneRoot, targetPath });

      expect(result.ok).toBe(false);
      if (result.ok) continue;
      expect(result.reasonCode).toBe("DENIED_BY_DENYLIST");
      expect(result.matchedRule).toBe(matchedRule);
    }
  });

  it("detects dangerous keywords in Windows-style paths", () => {
    const zoneRoot = makeZoneRoot();
    const result = checkReadAllowed({
      zoneRoot,
      targetPath: "work\\MetaTrader\\config.txt",
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reasonCode).toBe("DENIED_BY_DENYLIST");
    expect(result.matchedRule).toBe("metatrader");
  });

  it("rejects empty, control-character, home, and env expansion inputs", () => {
    const zoneRoot = makeZoneRoot();
    const cases = [
      "",
      "work/\0bad.txt",
      "~/work.txt",
      "work/%APPDATA%/file.txt",
    ];

    for (const targetPath of cases) {
      const result = checkReadAllowed({ zoneRoot, targetPath });

      expect(result.ok).toBe(false);
      if (result.ok) continue;
      expect(result.reasonCode).toBe("DENIED_BY_PATH_GUARD");
    }
  });
});
