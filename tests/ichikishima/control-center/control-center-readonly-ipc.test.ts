import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  assertAppSnapshotContainsNoApiNameArrays,
  buildControlCenterAppSnapshot,
} from "../../../src/main/ichikishima/control-center/control-center-app-snapshot";
import {
  CONTROL_CENTER_READONLY_IPC_APP_CHANNEL,
  buildControlCenterReadonlyIpcHandlers,
  getControlCenterReadonlyIpcChannels,
  registerControlCenterReadonlyIpcHandlers,
} from "../../../src/main/ichikishima/control-center/control-center-readonly-ipc";

import type { ControlCenterDataProviderParams } from "../../../src/main/ichikishima/control-center/control-center-data-provider";

describe("control-center-readonly-ipc", () => {
  const projectRoot = path.resolve(__dirname, "../../..");
  const zoneRoot = path.join(projectRoot, "sandbox", "hermes-autonomy-zone");

  const getParams = (): ControlCenterDataProviderParams => ({
    projectRoot,
    zoneRoot,
    dateUtc: "2099-12-06",
    pilotLoop: null as const,
  });

  it("registers read-only channels only", () => {
    const recorded: string[] = [];
    const mock = {
      handle(ch: string) {
        recorded.push(ch);
      },
    };
    registerControlCenterReadonlyIpcHandlers(mock, { getParams });
    const set = new Set(recorded.sort());
    for (const c of getControlCenterReadonlyIpcChannels()) {
      expect(set.has(c)).toBe(true);
      expect(/execute/i.test(c)).toBe(false);
    }
    expect(
      recorded.some((ch) => /approval\.execute|hermes\.run/i.test(ch)),
    ).toBe(false);
    expect(recorded).not.toContain("controlCenter.readonly.getSnapshot");
    const rawish = ["rawFs", "rawShell", "rawNetwork", "rawGit"] as const;
    for (const ch of recorded) {
      for (const token of rawish) {
        expect(ch.includes(token)).toBe(false);
      }
    }
  });

  it("handler getAppSnapshot returns sanitized bundle with embedded summaries", async () => {
    const handlers = buildControlCenterReadonlyIpcHandlers({
      getParams,
      nowUnixMs: () => 171_010_020_030,
    });
    const fn =
      handlers[CONTROL_CENTER_READONLY_IPC_APP_CHANNEL.GET_APP_SNAPSHOT];
    expect(fn).toBeDefined();
    const out = (await fn(undefined)) as ReturnType<
      typeof buildControlCenterAppSnapshot
    >;
    assertAppSnapshotContainsNoApiNameArrays(out);
    expect(out.agentTeamSummary.productionReady).toBe(false);
    expect(out.visualizationModel.nodes.length).toBeGreaterThan(0);
    expect(out.approvalAuditSummary.unavailableApproval).toBeTypeOf("boolean");
    const wire = JSON.stringify(out);
    expect(wire).not.toMatch(/"allowedApis"\s*:\s*\[/);
    expect(wire).not.toMatch(/"forbiddenApis"\s*:\s*\[/);
    expect(wire).not.toMatch(/"redactedSummaryLines"\s*:\s*\[/);
    expect("redactedSummaryLines" in out.wsl2LocalValueValidationSummary).toBe(
      false,
    );
  });

  it("retires legacy getSnapshot channel so raw API arrays cannot leak", () => {
    const handlers = buildControlCenterReadonlyIpcHandlers({ getParams });
    const channels = getControlCenterReadonlyIpcChannels();

    expect(channels).not.toContain("controlCenter.readonly.getSnapshot");
    expect(Object.keys(handlers)).not.toContain(
      "controlCenter.readonly.getSnapshot",
    );
    const wire = JSON.stringify({
      channels,
      handlerKeys: Object.keys(handlers),
    });
    expect(wire).not.toMatch(/"allowedApis"\s*:\s*\[/);
    expect(wire).not.toMatch(/"forbiddenApis"\s*:\s*\[/);
  });

  it("handlers object has no execute-prefixed channel keys", () => {
    const h = buildControlCenterReadonlyIpcHandlers({ getParams });
    const rawTokens = ["rawFs", "rawShell", "rawNetwork", "rawGit"] as const;
    for (const key of Object.keys(h)) {
      expect(key.startsWith("controlCenter.readonly.")).toBe(true);
      expect(key.includes("execute")).toBe(false);
      for (const t of rawTokens) {
        expect(key.includes(t)).toBe(false);
      }
    }
  });

  it("handler getVisualizationModel returns bounded JSON", async () => {
    const handlers = buildControlCenterReadonlyIpcHandlers({ getParams });
    const fn =
      handlers[CONTROL_CENTER_READONLY_IPC_APP_CHANNEL.GET_VISUALIZATION_MODEL];
    expect(fn).toBeDefined();
    const out = await fn(undefined);
    const w = JSON.stringify(out);
    expect(w.length).toBeLessThan(80_000);
    expect(
      typeof (out as { generatedAtUnixMs?: unknown }).generatedAtUnixMs,
    ).toBe("number");
  });

  it("handler getAgentTeamSummary keeps scheduler off", async () => {
    const handlers = buildControlCenterReadonlyIpcHandlers({ getParams });
    const fn =
      handlers[CONTROL_CENTER_READONLY_IPC_APP_CHANNEL.GET_AGENT_TEAM_SUMMARY];
    const out = await fn(undefined);
    const o = out as {
      schedulerEnabled: boolean;
      agents: { autoRun: boolean; autoApprove: boolean }[];
    };
    expect(o.schedulerEnabled).toBe(false);
    expect(o.agents.every((a) => a.autoRun === false)).toBe(true);
    expect(o.agents.every((a) => a.autoApprove === false)).toBe(true);
  });
});
