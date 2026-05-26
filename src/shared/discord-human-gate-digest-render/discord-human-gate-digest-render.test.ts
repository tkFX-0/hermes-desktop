import { describe, expect, it } from "vitest";
import {
  docsOnlySafeContract,
  missingVerificationHoldContract,
  productionReadyRejectedContract,
  sourceAndTestsSafeContract
} from "../worker-task-contract/worker-task-contract-fixtures";
import type { WorkerTaskContract } from "../worker-task-contract/worker-task-contract-types";
import type { GoalRunnerDryRunInput } from "../goal-runner-dry-run/goal-runner-dry-run-types";
import { createHumanGateQueueDisplayTargetItemFromContract } from "../human-gate-queue-display-target/human-gate-queue-display-target";
import { createDiscordHumanGateMessageDraft } from "../discord-human-gate-message-render/discord-human-gate-message-render";
import type { DiscordHumanGateMessageDraft } from "../discord-human-gate-message-render/discord-human-gate-message-render-types";
import {
  createDiscordHumanGateDigestDraft,
  renderDiscordHumanGateDigestPreview
} from "./discord-human-gate-digest-render";
import type { DiscordHumanGateDigestDraft } from "./discord-human-gate-digest-render-types";

function makeDryRunInput(
  contract: WorkerTaskContract,
  overrides: Partial<GoalRunnerDryRunInput> = {}
): GoalRunnerDryRunInput {
  return {
    goalId: contract.goalId,
    taskId: contract.taskId,
    title: contract.summary,
    contract,
    requestedBy: "composer",
    ...overrides
  };
}

function draftFromContract(contract: WorkerTaskContract): DiscordHumanGateMessageDraft {
  return createDiscordHumanGateMessageDraft(
    createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(contract))
  );
}

function expectDigestInvariants(digest: DiscordHumanGateDigestDraft): void {
  expect(digest.surface).toBe("discord-human-gate-digest");
  expect(digest.draftOnly).toBe(true);
  expect(digest.sendReady).toBe(false);
  expect(digest.externalWrite).toBe(false);
  expect(digest.safety.discordSend).toBe(false);
  expect(digest.safety.webhookUsed).toBe(false);
  expect(digest.safety.botStarted).toBe(false);
  expect(digest.safety.tokenRead).toBe(false);
  expect(digest.safety.productionReady).toBe(false);
  expect(digest.safety.execution).toBe("disabled");
  expect(digest.safety.redacted).toBe(true);
  expect(digest.safetyChips.some((chip) => chip.includes("review-only"))).toBe(true);
  expect(digest.footerNotice).toContain("No Discord send");
}

describe("discord human gate digest render", () => {
  it("creates safe empty digest", () => {
    const digest = createDiscordHumanGateDigestDraft([]);

    expect(digest.itemCount).toBe(0);
    expect(digest.countsByStatusTone.preview).toBe(0);
    expect(digest.countsByStatusTone.review).toBe(0);
    expect(digest.countsByStatusTone.hold).toBe(0);
    expect(digest.countsByStatusTone.rejected).toBe(0);
    expectDigestInvariants(digest);
    expect(digest.nextHumanActionLabel).toContain("explicit human GO");
  });

  it("creates digest from one safe draft", () => {
    const digest = createDiscordHumanGateDigestDraft([draftFromContract(docsOnlySafeContract)]);

    expect(digest.itemCount).toBe(1);
    expectDigestInvariants(digest);
  });

  it("creates deterministic counts for mixed drafts", () => {
    const drafts = [
      draftFromContract(docsOnlySafeContract),
      draftFromContract(sourceAndTestsSafeContract),
      draftFromContract(missingVerificationHoldContract),
      draftFromContract(productionReadyRejectedContract)
    ];
    const digest = createDiscordHumanGateDigestDraft(drafts);

    expect(digest.itemCount).toBe(4);
    const sum =
      digest.countsByStatusTone.preview +
      digest.countsByStatusTone.review +
      digest.countsByStatusTone.hold +
      digest.countsByStatusTone.rejected;
    expect(sum).toBe(4);
    expect(digest.highlights).toHaveLength(4);
    expectDigestInvariants(digest);
  });

  it("renders digest preview string only", () => {
    const digest = createDiscordHumanGateDigestDraft([draftFromContract(docsOnlySafeContract)]);
    const preview = renderDiscordHumanGateDigestPreview(digest);

    expect(typeof preview).toBe("string");
    expect(preview).toContain("no Discord send");
  });

  it("does not mutate message draft inputs", () => {
    const drafts = [draftFromContract(docsOnlySafeContract), draftFromContract(sourceAndTestsSafeContract)];
    const before = JSON.stringify(drafts);

    createDiscordHumanGateDigestDraft(drafts);

    expect(JSON.stringify(drafts)).toBe(before);
  });
});
