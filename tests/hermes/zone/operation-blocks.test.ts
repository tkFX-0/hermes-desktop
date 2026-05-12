import { existsSync, mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { afterEach, describe, expect, it } from "vitest";
import {
  executeCommand,
  requestGitOperation,
  requestNetworkAccess,
} from "../../../src/main/ichikishima/autonomy-zone";

const tempRoots: string[] = [];

function makeTempRoot(): string {
  const root = mkdtempSync(join(tmpdir(), "hermes-operation-block-test-"));
  tempRoots.push(root);
  return root;
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("Hermes Autonomy Zone operation blocks", () => {
  it("blocks command execution without running it", () => {
    const root = makeTempRoot();
    const markerPath = join(root, "executed.txt");
    const result = executeCommand({
      command: "node",
      args: [
        "-e",
        `require('fs').writeFileSync(${JSON.stringify(markerPath)}, 'x')`,
      ],
      cwd: root,
      requestId: "req_execute",
      actor: "hermes",
    });

    expect(result.ok).toBe(false);
    expect(result.reasonCode).toBe("EXECUTE_REQUIRES_APPROVAL");
    expect(result.executed).toBe(false);
    expect(existsSync(markerPath)).toBe(false);
    expect(result.approvalRequestCandidate).toMatchObject({
      actionType: "execute",
      requiresUserApproval: true,
    });
    expect(result.auditEventCandidate).toMatchObject({
      action: "execute",
      status: "denied",
      contentIncluded: false,
    });
  });

  it("blocks network access without sending a request", () => {
    const result = requestNetworkAccess({
      url: "https://example.invalid/should-not-fetch",
      method: "GET",
      requestId: "req_network",
      actor: "hermes",
    });

    expect(result.ok).toBe(false);
    expect(result.reasonCode).toBe("NETWORK_REQUIRES_APPROVAL");
    expect(result.executed).toBe(false);
    expect(result.approvalRequestCandidate.externalUrls).toEqual([
      "https://example.invalid/should-not-fetch",
    ]);
    expect(result.auditEventCandidate.action).toBe("network");
  });

  it("blocks git operations without invoking git", () => {
    const root = makeTempRoot();
    const result = requestGitOperation({
      operation: "push",
      args: ["origin", "main"],
      repositoryPath: root,
      requestId: "req_git",
      actor: "hermes",
    });

    expect(result.ok).toBe(false);
    expect(result.reasonCode).toBe("GIT_REQUIRES_APPROVAL");
    expect(result.executed).toBe(false);
    expect(result.approvalRequestCandidate.commands).toEqual([
      "git push origin main",
    ]);
    expect(result.auditEventCandidate.action).toBe("git");
  });
});
