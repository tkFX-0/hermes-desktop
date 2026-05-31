import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { mkdtempSync, mkdirSync, rmSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import {
  appendShirubeDailyLog,
  writeShirubeNote
} from "../../../../scripts/lib/obsidian-shirube-write.mjs";
import { checkObsidianVaultReady } from "../../../../scripts/lib/obsidian-vault-path.mjs";

describe("obsidian shirube write", () => {
  let root = "";

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "shiki-obs-"));
    const vault = join(root, "vault");
    writeFileSync(
      join(root, ".env.local"),
      `OBSIDIAN_VAULT_PATH=${vault.replace(/\\/g, "/")}\n`,
      "utf8"
    );
    mkdirSync(join(vault, "しきしま"), { recursive: true });
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("checkObsidianVaultReady passes with env vault", () => {
    const c = checkObsidianVaultReady(root);
    expect(c.vaultExists).toBe(true);
    expect(c.ready).toBe(true);
  });

  it("appendShirubeDailyLog creates Daily file", () => {
    const r = appendShirubeDailyLog(root, "テスト記録", { title: "test" });
    expect(r.ok).toBe(true);
    expect(existsSync(r.path!)).toBe(true);
    const text = readFileSync(r.path!, "utf8");
    expect(text).toContain("テスト記録");
  });

  it("writeShirubeNote writes inbox note", () => {
    const r = writeShirubeNote("タイトル", "# body", "inbox", root);
    expect(r.ok).toBe(true);
    expect(existsSync(r.path!)).toBe(true);
  });
});
