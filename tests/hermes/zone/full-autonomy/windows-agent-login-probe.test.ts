import { describe, expect, it } from "vitest";

/** Mirrors probeWindowsAgentLogin heuristics in shikishima-wsl-dev-preflight.mjs */
function detectAgentLoggedIn(statusOutput: string): boolean {
  const out = statusOutput.trim();
  return (
    /logged\s+in\s+as\s+\S+/i.test(out) ||
    (/logged\s+in|authenticated/i.test(out) && !/not\s+logged|login\s+required/i.test(out))
  );
}

describe("windows agent login probe", () => {
  it("detects Logged in as email", () => {
    expect(detectAgentLoggedIn("✓ Logged in as user@example.com")).toBe(true);
  });

  it("rejects not logged in", () => {
    expect(detectAgentLoggedIn("Not logged in. Run: agent login")).toBe(false);
  });
});
