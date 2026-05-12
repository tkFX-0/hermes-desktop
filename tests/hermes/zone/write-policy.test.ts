import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { afterEach, describe, expect, it } from "vitest";
import { checkWriteAllowed } from "../../../src/main/ichikishima/autonomy-zone";

const tempRoots: string[] = [];

function makeZoneRoot(): string {
  const projectRoot = mkdtempSync(join(tmpdir(), "hermes-write-policy-test-"));
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

describe("Hermes Autonomy Zone write policy", () => {
  it("allows a normal new file path inside the Zone root", () => {
    const zoneRoot = makeZoneRoot();
    mkdirSync(join(zoneRoot, "work"), { recursive: true });

    const result = checkWriteAllowed({
      zoneRoot,
      targetPath: "work/notes.md",
      contentBytes: 10,
      maxBytes: 1024,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.reasonCode).toBeNull();
    expect(result.reason).toBeNull();
    expect(result.overwrite).toBe(false);
    expect(result.createDirs).toBe(false);
    expect(result.relativePath).toContain("work");
  });

  it("rejects traversal outside the Zone root", () => {
    const zoneRoot = makeZoneRoot();
    const result = checkWriteAllowed({
      zoneRoot,
      targetPath: "../outside.md",
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reasonCode).toBe("DENIED_BY_PATH_GUARD");
  });

  it("rejects absolute paths outside the Zone root", () => {
    const zoneRoot = makeZoneRoot();
    const outsideRoot = mkdtempSync(join(tmpdir(), "hermes-write-outside-"));
    tempRoots.push(outsideRoot);

    const result = checkWriteAllowed({
      zoneRoot,
      targetPath: join(outsideRoot, "file.txt"),
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reasonCode).toBe("DENIED_BY_PATH_GUARD");
  });

  it("rejects denylisted write targets", () => {
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
      const result = checkWriteAllowed({ zoneRoot, targetPath });

      expect(result.ok).toBe(false);
      if (result.ok) continue;
      expect(result.reasonCode).toBe("DENIED_BY_DENYLIST");
      expect(result.matchedRule).toBe(matchedRule);
    }
  });

  it("detects dangerous keywords in Windows-style paths", () => {
    const zoneRoot = makeZoneRoot();
    const result = checkWriteAllowed({
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
      const result = checkWriteAllowed({ zoneRoot, targetPath });

      expect(result.ok).toBe(false);
      if (result.ok) continue;
      expect(result.reasonCode).toBe("DENIED_BY_PATH_GUARD");
    }
  });

  it("rejects invalid maxBytes and contentBytes", () => {
    const zoneRoot = makeZoneRoot();
    const invalidMaxBytes = checkWriteAllowed({
      zoneRoot,
      targetPath: "work/notes.md",
      maxBytes: Number.NaN,
    });
    const invalidContentBytes = checkWriteAllowed({
      zoneRoot,
      targetPath: "work/notes.md",
      contentBytes: Number.POSITIVE_INFINITY,
      maxBytes: 5,
    });

    expect(invalidMaxBytes.ok).toBe(false);
    if (!invalidMaxBytes.ok) {
      expect(invalidMaxBytes.reasonCode).toBe("INVALID_WRITE_OPTIONS");
    }

    expect(invalidContentBytes.ok).toBe(false);
    if (!invalidContentBytes.ok) {
      expect(invalidContentBytes.reasonCode).toBe("INVALID_WRITE_OPTIONS");
    }
  });

  it("rejects content that exceeds maxBytes", () => {
    const zoneRoot = makeZoneRoot();
    const result = checkWriteAllowed({
      zoneRoot,
      targetPath: "work/notes.md",
      contentBytes: 10,
      maxBytes: 5,
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reasonCode).toBe("FILE_TOO_LARGE");
  });

  it("rejects existing files when overwrite is false", () => {
    const zoneRoot = makeZoneRoot();
    mkdirSync(join(zoneRoot, "work"), { recursive: true });
    writeFileSync(join(zoneRoot, "work", "notes.md"), "existing", "utf8");

    const result = checkWriteAllowed({
      zoneRoot,
      targetPath: "work/notes.md",
      overwrite: false,
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reasonCode).toBe("FILE_ALREADY_EXISTS");
  });

  it("allows existing files when overwrite is true", () => {
    const zoneRoot = makeZoneRoot();
    mkdirSync(join(zoneRoot, "work"), { recursive: true });
    writeFileSync(join(zoneRoot, "work", "notes.md"), "existing", "utf8");

    const result = checkWriteAllowed({
      zoneRoot,
      targetPath: "work/notes.md",
      overwrite: true,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.overwrite).toBe(true);
  });

  it("rejects missing parent directories when createDirs is false", () => {
    const zoneRoot = makeZoneRoot();
    const result = checkWriteAllowed({
      zoneRoot,
      targetPath: "missing/notes.md",
      createDirs: false,
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reasonCode).toBe("PARENT_DIRECTORY_MISSING");
  });

  it("accepts createDirs as an input without creating directories", () => {
    const zoneRoot = makeZoneRoot();
    const result = checkWriteAllowed({
      zoneRoot,
      targetPath: "missing/notes.md",
      createDirs: true,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.createDirs).toBe(true);
  });

  it("rejects directories as write targets", () => {
    const zoneRoot = makeZoneRoot();
    mkdirSync(join(zoneRoot, "work", "notes.md"), { recursive: true });

    const result = checkWriteAllowed({
      zoneRoot,
      targetPath: "work/notes.md",
      overwrite: true,
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reasonCode).toBe("TARGET_IS_DIRECTORY");
  });

  it("rejects writes through a junction or symlink that resolves outside the Zone", () => {
    const zoneRoot = makeZoneRoot();
    const outsideRoot = mkdtempSync(join(tmpdir(), "hermes-write-link-out-"));
    tempRoots.push(outsideRoot);
    symlinkSync(outsideRoot, join(zoneRoot, "link-out"), "junction");

    const result = checkWriteAllowed({
      zoneRoot,
      targetPath: "link-out/notes.md",
      createDirs: true,
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reasonCode).toBe("DENIED_BY_PATH_GUARD");
  });
});
