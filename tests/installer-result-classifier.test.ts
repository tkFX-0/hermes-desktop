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

  it("classifies Windows PowerShell installer hint as windows_manual_installer_required", () => {
    const result = classifyInstallResult({
      exitCode: 1,
      hermesVerified: false,
      log: "Hermes Agent Installer\nWindows detected. Please use the PowerShell installer:\nirm https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.ps1 | iex\n",
    });

    expect(result.status).toBe("windows_manual_installer_required");
    expect(result.status).not.toBe("fail");
    expect(result.finalSuccessMarker).toBe(false);
  });

  it("classifies exit code 1 with Windows hint as windows_manual_installer_required not unknown failure", () => {
    const result = classifyInstallResult({
      exitCode: 1,
      hermesVerified: false,
      log: "Running official Hermes install script...\nWindows detected. Please use the PowerShell installer:\n",
    });

    expect(result.status).toBe("windows_manual_installer_required");
    expect(result.status).not.toBe("fail");
  });

  it("does not classify as windows_manual_installer_required when hint is absent", () => {
    const result = classifyInstallResult({
      exitCode: 1,
      hermesVerified: false,
      log: "Some other error occurred.\n",
    });

    expect(result.status).toBe("fail");
    expect(result.status).not.toBe("windows_manual_installer_required");
  });
});
