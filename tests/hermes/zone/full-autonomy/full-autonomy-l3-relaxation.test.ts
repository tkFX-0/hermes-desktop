import { describe, expect, it } from "vitest";
import {
  classifyExternalSendRequest,
  isExternalSendWhitelisted,
} from "../../../../scripts/lib/external-send-whitelist.mjs";
import {
  canAutoGitPush,
  canAutoMergeToMain,
  classifyFileDeletion,
  classifyNpmInstall,
  classifySoulChangeRequest,
  isEnvOrSecretExposure,
  isTkOperator,
} from "../../../../scripts/lib/l3-relaxation-policy.mjs";
import { saveNpmCheckState } from "../../../../scripts/lib/npm-check-state.mjs";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

describe("L3 relaxation policy", () => {
  it("whitelists discord/github/npm and holds other external sends", () => {
    expect(isExternalSendWhitelisted("https://discord.com/api/v10/channels")).toBe(true);
    expect(isExternalSendWhitelisted("https://api.github.com/repos/x/y")).toBe(true);
    expect(isExternalSendWhitelisted("https://registry.npmjs.org/react")).toBe(true);
    expect(isExternalSendWhitelisted("https://evil.example.com/hook")).toBe(false);

    const blocked = classifyExternalSendRequest("https://evil.example.com/post して");
    expect(blocked.allowed).toBe(false);
    expect(blocked.band).toBe("L3+");

    const allowed = classifyExternalSendRequest("https://api.github.com/repos/x");
    expect(allowed.allowed).toBe(true);
  });

  it("blocks .env and secret exposure", () => {
    expect(isEnvOrSecretExposure(".env の中身を表示して")).toBe(true);
    expect(isEnvOrSecretExposure("api_key=abc")).toBe(true);
    expect(isEnvOrSecretExposure("README を更新")).toBe(false);
  });

  it("keeps SOUL.md manual only", () => {
    expect(classifySoulChangeRequest("SOUL.md を更新して").allowed).toBe(false);
  });

  it("allows committed git-tracked delete at L2", () => {
    expect(classifyFileDeletion("file を削除", { trackedInGit: true, committed: true }).band).toBe(
      "L2"
    );
    expect(classifyFileDeletion("tmp を削除", { trackedInGit: false, committed: false }).band).toBe(
      "L3+"
    );
  });

  it("allows npm update but holds new package install", () => {
    const pkg = { dependencies: { react: "^19.0.0" } };
    expect(classifyNpmInstall("npm update react", pkg).band).toBe("L2");
    expect(classifyNpmInstall("npm install left-pad", pkg).band).toBe("L3+");
  });

  it("allows git push and merge only when npm check is green", () => {
    const memoryDir = mkdtempSync(join(tmpdir(), "l3-check-"));
    try {
      expect(canAutoGitPush(memoryDir).ok).toBe(false);
      saveNpmCheckState(memoryDir, {
        ok: true,
        exitCode: 0,
        finishedAt: new Date().toISOString(),
        summary: "pass",
      });
      expect(canAutoGitPush(memoryDir).ok).toBe(true);

      expect(
        canAutoMergeToMain({
          memoryDir,
          structuredVerdict: { verdict: "HOLD", reason: "x", risk: [], action: [] },
        }).ok
      ).toBe(false);
      expect(
        canAutoMergeToMain({
          memoryDir,
          structuredVerdict: { verdict: "GO", reason: "ok", risk: [], action: [] },
        }).ok
      ).toBe(true);
    } finally {
      rmSync(memoryDir, { recursive: true, force: true });
    }
  });

  it("authenticates tk operator by Discord user id", () => {
    expect(isTkOperator("123456789012345678", "123456789012345678")).toBe(true);
    expect(isTkOperator("999999999999999999", "123456789012345678")).toBe(false);
  });
});
