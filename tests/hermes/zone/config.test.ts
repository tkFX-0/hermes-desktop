import { mkdtempSync, mkdirSync, rmSync, symlinkSync } from "fs";
import { homedir, tmpdir } from "os";
import { join, parse, resolve } from "path";
import { afterEach, describe, expect, it } from "vitest";
import {
  resolveZoneConfig,
  validateZoneRoot,
} from "../../../src/main/ichikishima/autonomy-zone";

const tempRoots: string[] = [];

function makeProjectRoot(): string {
  const root = mkdtempSync(join(tmpdir(), "hermes-zone-test-"));
  tempRoots.push(root);
  return root;
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("Hermes Autonomy Zone root config", () => {
  it("allows a safe sandbox path", () => {
    const projectRoot = makeProjectRoot();
    const result = resolveZoneConfig({ projectRoot });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.config.source).toBe("default");
    expect(result.config.root).toContain(
      resolve(projectRoot, "sandbox", "hermes-autonomy-zone"),
    );
  });

  it("reads a configured root before env/default", () => {
    const projectRoot = makeProjectRoot();
    const result = resolveZoneConfig({
      projectRoot,
      configuredRoot: "sandbox/custom_zone",
      env: { HERMES_AUTONOMY_ZONE_ROOT: "sandbox/from_env" },
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.config.source).toBe("configured");
    expect(result.config.root).toContain(
      resolve(projectRoot, "sandbox", "custom_zone"),
    );
  });

  it("reads the env root when no configured root is provided", () => {
    const projectRoot = makeProjectRoot();
    const result = resolveZoneConfig({
      projectRoot,
      env: { HERMES_AUTONOMY_ZONE_ROOT: "sandbox/from_env" },
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.config.source).toBe("env");
    expect(result.config.root).toContain(
      resolve(projectRoot, "sandbox", "from_env"),
    );
  });

  it("rejects project root itself", () => {
    const projectRoot = makeProjectRoot();
    const result = validateZoneRoot(projectRoot, projectRoot);

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.reasonCode).toBe("project_root");
    expect(result.reason).toBe("Zone root must not be project root");
  });

  it("rejects traversal outside project root", () => {
    const projectRoot = makeProjectRoot();
    const result = validateZoneRoot(projectRoot, "../outside-zone");

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.reasonCode).toBe("outside_project_root");
  });

  it("rejects absolute paths outside project root", () => {
    const projectRoot = makeProjectRoot();
    const outsideRoot = mkdtempSync(join(tmpdir(), "hermes-zone-outside-"));
    tempRoots.push(outsideRoot);

    const result = validateZoneRoot(projectRoot, join(outsideRoot, "sandbox"));

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.reasonCode).toBe("outside_project_root");
  });

  it("rejects OS root", () => {
    const projectRoot = makeProjectRoot();
    const result = validateZoneRoot(projectRoot, parse(projectRoot).root);

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.reasonCode).toBe("os_root");
  });

  it("rejects user home", () => {
    const projectRoot = makeProjectRoot();
    const result = validateZoneRoot(projectRoot, homedir());

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.reasonCode).toBe("user_home");
  });

  it("rejects .env paths", () => {
    const projectRoot = makeProjectRoot();
    const result = validateZoneRoot(
      projectRoot,
      "sandbox/.env.local/playground",
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.reasonCode).toBe("denied_path");
    expect(result.matchedRule).toBe(".env.local");
  });

  it("rejects .git paths", () => {
    const projectRoot = makeProjectRoot();
    const result = validateZoneRoot(projectRoot, "sandbox/.git/playground");

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.reasonCode).toBe("denied_path");
    expect(result.matchedRule).toBe(".git");
  });

  it("rejects paths containing MT5 keywords", () => {
    const projectRoot = makeProjectRoot();
    const result = validateZoneRoot(projectRoot, "sandbox/MT5/playground");

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.reasonCode).toBe("denied_path");
    expect(result.matchedRule).toBe("mt5");
  });

  it("rejects memory DB paths", () => {
    const projectRoot = makeProjectRoot();
    const result = validateZoneRoot(
      projectRoot,
      "sandbox/sessions.db/playground",
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.reasonCode).toBe("denied_path");
    expect(result.matchedRule).toBe("sessions.db");
  });

  it("rejects secrets paths", () => {
    const projectRoot = makeProjectRoot();
    const result = validateZoneRoot(projectRoot, "sandbox/secrets/playground");

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.reasonCode).toBe("denied_path");
    expect(result.matchedRule).toBe("secrets");
  });

  it("rejects token and private key file-like path segments", () => {
    const projectRoot = makeProjectRoot();

    const tokenResult = validateZoneRoot(
      projectRoot,
      "sandbox/token.txt/playground",
    );
    const keyResult = validateZoneRoot(
      projectRoot,
      "sandbox/client.pem/playground",
    );

    expect(tokenResult.ok).toBe(false);
    if (!tokenResult.ok) {
      expect(tokenResult.reasonCode).toBe("denied_path");
      expect(tokenResult.matchedRule).toBe("token.txt");
    }

    expect(keyResult.ok).toBe(false);
    if (!keyResult.ok) {
      expect(keyResult.reasonCode).toBe("denied_path");
      expect(keyResult.matchedRule).toBe("client.pem");
    }
  });

  it("rejects implicit environment or home expansion syntax", () => {
    const projectRoot = makeProjectRoot();

    const homeResult = validateZoneRoot(projectRoot, "~/sandbox");
    const envResult = validateZoneRoot(
      projectRoot,
      "sandbox/%APPDATA%/playground",
    );

    expect(homeResult.ok).toBe(false);
    if (!homeResult.ok) {
      expect(homeResult.reasonCode).toBe("invalid_path_input");
    }

    expect(envResult.ok).toBe(false);
    if (!envResult.ok) {
      expect(envResult.reasonCode).toBe("invalid_path_input");
    }
  });

  it("uses the safe default for empty or undefined roots", () => {
    const projectRoot = makeProjectRoot();

    const emptyResult = validateZoneRoot(projectRoot, "");
    const undefinedResult = validateZoneRoot(projectRoot, undefined);

    expect(emptyResult.ok).toBe(true);
    expect(undefinedResult.ok).toBe(true);
  });

  it("detects dangerous keywords in Windows-style paths", () => {
    const projectRoot = makeProjectRoot();
    const result = validateZoneRoot(
      projectRoot,
      "sandbox\\MetaTrader\\playground",
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.reasonCode).toBe("denied_path");
    expect(result.matchedRule).toBe("metatrader");
  });

  it("rejects a symlink or junction that resolves outside project root", () => {
    const projectRoot = makeProjectRoot();
    const outsideRoot = mkdtempSync(
      join(tmpdir(), "hermes-zone-linked-outside-"),
    );
    tempRoots.push(outsideRoot);

    const linkPath = join(projectRoot, "sandbox", "linked-outside");
    mkdirSync(join(projectRoot, "sandbox"), { recursive: true });

    try {
      symlinkSync(outsideRoot, linkPath, "junction");
    } catch {
      // Some Windows policies disable symlink/junction creation in test contexts.
      return;
    }

    const result = validateZoneRoot(
      projectRoot,
      "sandbox/linked-outside/playground",
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.reasonCode).toBe("outside_project_root");
  });

  it("rejects dangerous requested path names before realpath removes symlink names", () => {
    const projectRoot = makeProjectRoot();
    const safeTarget = join(projectRoot, "sandbox", "safe-target");
    const dangerousLinkPath = join(projectRoot, "sandbox", "MT5");
    mkdirSync(safeTarget, { recursive: true });

    try {
      symlinkSync(safeTarget, dangerousLinkPath, "junction");
    } catch {
      // Some Windows policies disable symlink/junction creation in test contexts.
      return;
    }

    const result = validateZoneRoot(projectRoot, "sandbox/MT5/playground");

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.reasonCode).toBe("denied_path");
    expect(result.matchedRule).toBe("mt5");
  });
});
