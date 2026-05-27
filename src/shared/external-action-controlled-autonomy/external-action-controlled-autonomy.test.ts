import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  createControlledAutonomyProposal,
  createDefaultExternalActionRouteRegistry,
  evaluateExternalActionGuard,
  findExternalActionRoute,
  renderControlledAutonomyProposalMarkdown,
  renderExternalActionRouteRegistryMarkdown
} from "./external-action-controlled-autonomy";
import type { ExternalActionRouteState } from "./external-action-controlled-autonomy-types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const HUMAN_GO = "Rally 5 external action guard validation";

function route(
  routeId: ExternalActionRouteState["routeId"],
  overrides: Partial<ExternalActionRouteState> = {}
): ExternalActionRouteState {
  const registry = createDefaultExternalActionRouteRegistry();
  const base = findExternalActionRoute(registry, routeId);
  if (!base) {
    throw new Error(`missing route ${routeId}`);
  }
  return { ...base, ...overrides };
}

describe("external action controlled autonomy", () => {
  it("does not import Node fs in implementation module", () => {
    const source = readFileSync(
      join(__dirname, "external-action-controlled-autonomy.ts"),
      "utf8"
    );

    expect(source).not.toMatch(/from\s+["']node:fs["']/);
    expect(source).not.toMatch(/from\s+["']fs["']/);
  });

  it("registers default route statuses", () => {
    const routes = createDefaultExternalActionRouteRegistry();

    expect(findExternalActionRoute(routes, "discord_one_shot_send")).toMatchObject({
      status: "HOLD_PENDING_LOCAL_CREDENTIALS",
      implemented: true,
      actualExecutionCount: 0
    });
    expect(
      findExternalActionRoute(routes, "human_gate_queue_repo_local_mutation")
    ).toMatchObject({
      status: "EXECUTED_ONCE",
      actualExecutionCount: 1
    });
    expect(findExternalActionRoute(routes, "git_push")).toMatchObject({
      status: "HOLD_PENDING_HUMAN_GO"
    });
    expect(findExternalActionRoute(routes, "runtime_start")).toMatchObject({
      status: "HOLD_PENDING_HUMAN_GO"
    });
    expect(findExternalActionRoute(routes, "obsidian_write")).toMatchObject({
      status: "HOLD_PENDING_IMPLEMENTATION",
      implemented: false
    });
    expect(findExternalActionRoute(routes, "external_api_write")).toMatchObject({
      status: "HOLD_PENDING_HUMAN_GO",
      implemented: false
    });
  });

  it("holds discord route pending local credentials for external one-shot", () => {
    const result = evaluateExternalActionGuard({
      surface: "external-action-guard-input",
      route: route("discord_one_shot_send"),
      requestedAction: "external_one_shot",
      humanGoReference: HUMAN_GO,
      localCredentialPresence: { available: false, labelOnly: true },
      redacted: true
    });

    expect(result.decision).toBe("HOLD_NEEDS_LOCAL_CREDENTIALS");
    expect(result.mayExecuteExternalOneShot).toBe(false);
    expect(result.safety.actualDiscordSend).toBe(false);
    expect(result.safety.networkCall).toBe(false);
  });

  it("allows preview for any implemented route", () => {
    const result = evaluateExternalActionGuard({
      surface: "external-action-guard-input",
      route: route("discord_one_shot_send"),
      requestedAction: "preview",
      redacted: true
    });

    expect(result.decision).toBe("ALLOW_PREVIEW");
    expect(result.mayPreview).toBe(true);
  });

  it("holds when human GO is missing", () => {
    const result = evaluateExternalActionGuard({
      surface: "external-action-guard-input",
      route: route("git_push"),
      requestedAction: "external_one_shot",
      redacted: true
    });

    expect(result.decision).toBe("HOLD_NEEDS_HUMAN_GO");
  });

  it("allows external one-shot when ready and credentials present", () => {
    const readyDiscord = route("discord_one_shot_send", {
      status: "READY_CANDIDATE",
      actualExecutionCount: 0
    });
    const result = evaluateExternalActionGuard({
      surface: "external-action-guard-input",
      route: readyDiscord,
      requestedAction: "external_one_shot",
      humanGoReference: HUMAN_GO,
      localCredentialPresence: { available: true, labelOnly: true },
      redacted: true
    });

    expect(result.decision).toBe("ALLOW_EXTERNAL_ONE_SHOT");
    expect(result.mayExecuteExternalOneShot).toBe(true);
    expect(result.safety.actualDiscordSend).toBe(false);
  });

  it("rejects external one-shot when execution count exceeded", () => {
    const executedDiscord = route("discord_one_shot_send", {
      status: "READY_CANDIDATE",
      actualExecutionCount: 1
    });
    const result = evaluateExternalActionGuard({
      surface: "external-action-guard-input",
      route: executedDiscord,
      requestedAction: "external_one_shot",
      humanGoReference: HUMAN_GO,
      localCredentialPresence: { available: true, labelOnly: true },
      redacted: true
    });

    expect(result.decision).toBe("REJECT_UNSAFE");
  });

  it("allows repo-local one-shot for queue route with human GO", () => {
    const result = evaluateExternalActionGuard({
      surface: "external-action-guard-input",
      route: route("human_gate_queue_repo_local_mutation"),
      requestedAction: "repo_local_one_shot",
      humanGoReference: HUMAN_GO,
      redacted: true
    });

    expect(result.decision).toBe("ALLOW_REPO_LOCAL_ONE_SHOT");
    expect(result.safety.repoLocalWrite).toBe(true);
    expect(result.safety.actualDiscordSend).toBe(false);
  });

  it("rejects unscoped repo-local request on discord route", () => {
    const result = evaluateExternalActionGuard({
      surface: "external-action-guard-input",
      route: route("discord_one_shot_send"),
      requestedAction: "repo_local_one_shot",
      humanGoReference: HUMAN_GO,
      redacted: true
    });

    expect(result.decision).toBe("REJECT_UNSCOPED");
  });

  it("creates controlled autonomy proposal without executing", () => {
    const routes = createDefaultExternalActionRouteRegistry();
    const proposal = createControlledAutonomyProposal({
      routes,
      requestedActions: [
        { routeId: "discord_one_shot_send", requestedAction: "preview" },
        {
          routeId: "discord_one_shot_send",
          requestedAction: "external_one_shot",
          humanGoReference: HUMAN_GO,
          localCredentialPresence: { available: false, labelOnly: true }
        },
        {
          routeId: "human_gate_queue_repo_local_mutation",
          requestedAction: "repo_local_one_shot",
          humanGoReference: HUMAN_GO
        },
        { routeId: "git_push", requestedAction: "external_one_shot", humanGoReference: HUMAN_GO }
      ],
      redacted: true
    });

    expect(proposal.proposalOnly).toBe(true);
    expect(proposal.safety.actualExecution).toBe(false);
    expect(proposal.status).toBe("READY_FOR_HUMAN_REVIEW");
    expect(proposal.actionPlans.some((plan) => plan.guardDecision === "ALLOW_REPO_LOCAL_ONE_SHOT")).toBe(
      true
    );
    expect(
      proposal.actionPlans.some((plan) => plan.guardDecision === "HOLD_NEEDS_LOCAL_CREDENTIALS")
    ).toBe(true);
    expect(proposal.recommendedNextHumanAction).toContain("SHIKISHIMA_DISCORD");
  });

  it("renders registry and proposal markdown", () => {
    const routes = createDefaultExternalActionRouteRegistry();
    const registryMd = renderExternalActionRouteRegistryMarkdown(routes);
    const proposal = createControlledAutonomyProposal({
      routes,
      requestedActions: [{ routeId: "discord_one_shot_send", requestedAction: "preview" }],
      redacted: true
    });
    const proposalMd = renderControlledAutonomyProposalMarkdown(proposal);

    expect(registryMd).toContain("discord_one_shot_send");
    expect(registryMd).toContain("HOLD_PENDING_LOCAL_CREDENTIALS");
    expect(proposalMd).toContain("Controlled Autonomy Proposal");
    expect(proposalMd).toContain("productionReady: false");
  });
});
