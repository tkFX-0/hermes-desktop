import { describe, expect, it } from "vitest";
import {
  classifyInstallResult,
  getInstallerObservationPolicy,
} from "../src/main/installer";

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

describe("getInstallerObservationPolicy", () => {
  it("windows_manual_installer_required is non-blocking in controlled observation mode", () => {
    const policy = getInstallerObservationPolicy(
      "windows_manual_installer_required",
    );
    expect(policy.blocking).toBe(false);
    expect(policy.autoInstallAllowed).toBe(false);
    expect(policy.manualActionRequired).toBe(true);
  });

  it("windows_manual_installer_required does not imply install success", () => {
    const policy = getInstallerObservationPolicy(
      "windows_manual_installer_required",
    );
    expect(policy.installSuccess).toBe(false);
  });

  it("fail is blocking and allows auto-install retry", () => {
    const policy = getInstallerObservationPolicy("fail");
    expect(policy.blocking).toBe(true);
    expect(policy.autoInstallAllowed).toBe(true);
    expect(policy.installSuccess).toBe(false);
  });

  it("pass is non-blocking with install success", () => {
    const policy = getInstallerObservationPolicy("pass");
    expect(policy.blocking).toBe(false);
    expect(policy.installSuccess).toBe(true);
    expect(policy.manualActionRequired).toBe(false);
  });

  it("pass_with_warning is non-blocking with install success", () => {
    const policy = getInstallerObservationPolicy("pass_with_warning");
    expect(policy.blocking).toBe(false);
    expect(policy.installSuccess).toBe(true);
  });
});
