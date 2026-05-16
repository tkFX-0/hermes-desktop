import { describe, expect, it } from "vitest";
import { classifyInstallResult } from "../src/main/installer";

describe("classifyInstallResult", () => {
  it("classifies a clean successful installer log as pass", () => {
    const result = classifyInstallResult({
      exitCode: 0,
      hermesVerified: true,
      log: "Repository ready\nInstallation complete!\n",
    });

    expect(result.status).toBe("pass");
    expect(result.finalSuccessMarker).toBe(true);
  });

  it("keeps uv.lock fallback as a non-fatal warning when install completes", () => {
    const result = classifyInstallResult({
      exitCode: 0,
      hermesVerified: true,
      log: "uv.lock sync failed\nNote: installed via fallback tier (all).\nInstallation Complete!\n",
    });

    expect(result.status).toBe("pass_with_warning");
    expect(result.fallbackWarning).toBe(true);
  });

  it("clears a stale non-zero exit when success marker and hermes verification agree", () => {
    const result = classifyInstallResult({
      exitCode: 128,
      hermesVerified: true,
      log: "Repository ready\nInstallation Complete!\n",
    });

    expect(result.status).toBe("pass_with_warning");
  });

  it("does not hide a fatal git pull error without a final success marker", () => {
    const result = classifyInstallResult({
      exitCode: 128,
      hermesVerified: true,
      log: "fatal: Cannot fast-forward to multiple branches.\n",
    });

    expect(result.status).toBe("fail");
    expect(result.finalSuccessMarker).toBe(false);
  });
});
