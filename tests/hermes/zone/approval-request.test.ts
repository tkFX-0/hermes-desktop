import { describe, expect, it } from "vitest";
import {
  createApprovalRequest,
  type ApprovalRequest,
} from "../../../src/main/ichikishima/autonomy-zone";

describe("Hermes Autonomy Zone approval request", () => {
  it("creates a safe approval request JSON object", () => {
    const request = createApprovalRequest({
      requestId: "req_approval",
      actionType: "execute",
      actor: "hermes",
      targetPaths: ["sandbox/hermes-autonomy-zone/work"],
      commands: ["npm test -- tests/hermes/zone/example.test.ts"],
      externalUrls: [],
      riskLevel: "high",
      reason: "Command execution needs user approval",
      expectedResult: "Run a test command after approval",
      rollbackPlan: "No command runs before approval",
      testPlan: "Review command and working directory",
    });

    expect(request).toMatchObject({
      requestId: "req_approval",
      actionType: "execute",
      actor: "hermes",
      riskLevel: "high",
      requiresUserApproval: true,
    });
    expect(request.createdAt).toEqual(expect.any(String));

    const parsed = JSON.parse(JSON.stringify(request)) as ApprovalRequest;
    expect(parsed.requiresUserApproval).toBe(true);
    expect(parsed.commands).toEqual([
      "npm test -- tests/hermes/zone/example.test.ts",
    ]);
  });

  it("normalizes optional arrays to empty arrays", () => {
    const request = createApprovalRequest({
      actionType: "network",
      actor: "ichikishima",
      riskLevel: "medium",
      reason: "Network request needs review",
      expectedResult: "No request is sent before approval",
      rollbackPlan: "No rollback needed before approval",
      testPlan: "Review URL and payload",
    });

    expect(request.targetPaths).toEqual([]);
    expect(request.commands).toEqual([]);
    expect(request.externalUrls).toEqual([]);
  });
});
