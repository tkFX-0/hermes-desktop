import { describe, expect, it } from "vitest";
import { checkDenylist } from "../../../src/main/ichikishima/autonomy-zone";

describe("Hermes Autonomy Zone denylist", () => {
  it("allows a normal sandbox path", () => {
    const result = checkDenylist("sandbox/hermes-autonomy-zone/notes/task.md");

    expect(result.ok).toBe(true);
  });

  it("rejects env, secret, token, and package credential paths", () => {
    const cases = [
      ["sandbox/.env.local/file.txt", ".env.local"],
      ["sandbox/secrets/file.txt", "secrets"],
      ["sandbox/token.txt/file.txt", "token.txt"],
      ["sandbox/.npmrc/file.txt", ".npmrc"],
      ["sandbox/.pypirc/file.txt", ".pypirc"],
    ] as const;

    for (const [pathValue, expectedRule] of cases) {
      const result = checkDenylist(pathValue);

      expect(result.ok).toBe(false);
      if (result.ok) continue;
      expect(result.matchedRule).toBe(expectedRule);
    }
  });

  it("rejects ssh and private key paths", () => {
    const cases = [
      ["sandbox/.ssh/config", ".ssh"],
      ["sandbox/id_rsa/file.txt", "id_rsa"],
      ["sandbox/client.pem/file.txt", "client.pem"],
      ["sandbox/private.key/file.txt", "private.key"],
    ] as const;

    for (const [pathValue, expectedRule] of cases) {
      const result = checkDenylist(pathValue);

      expect(result.ok).toBe(false);
      if (result.ok) continue;
      expect(result.matchedRule).toBe(expectedRule);
    }
  });

  it("rejects memory DB, MT5, EA, git, production, and trade history paths", () => {
    const cases = [
      ["sandbox/sessions.db/file.txt", "sessions.db"],
      ["sandbox/MT5/file.txt", "mt5"],
      ["sandbox/MQL5/Experts/file.txt", "mql5"],
      ["sandbox/PropFusion/file.txt", "propfusion"],
      ["sandbox/.git/config", ".git"],
      ["sandbox/production/config.json", "production"],
      ["sandbox/trade_history/report.csv", "trade_history"],
    ] as const;

    for (const [pathValue, expectedRule] of cases) {
      const result = checkDenylist(pathValue);

      expect(result.ok).toBe(false);
      if (result.ok) continue;
      expect(result.matchedRule).toBe(expectedRule);
    }
  });

  it("detects dangerous words in Windows-style paths", () => {
    const result = checkDenylist("sandbox\\MetaTrader\\terminal64.exe");

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.matchedRule).toBe("metatrader");
  });

  it("returns human-readable reason and reason code", () => {
    const result = checkDenylist("sandbox/api_key/file.txt");

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reasonCode).toBe("denied_substring");
    expect(result.reason).toContain("api_key");
  });
});
