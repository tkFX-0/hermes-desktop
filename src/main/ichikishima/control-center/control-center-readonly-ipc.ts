/**
 * Read-only IPC **登録準備** — Electron `ipcMain.handle` に依存しない（DI）。
 * 実行系・raw 系チャンネルは登録しない。
 */
import { buildControlCenterAppSnapshot } from "./control-center-app-snapshot";
import { readHermesWsl2WrapperLocalValueFileWithSlotInventoryForValidation } from "../hermes/hermes-wsl2-wrapper-local-value-file";
import type {
  ControlCenterDataProviderParams,
  ControlCenterReadonlyData,
} from "./control-center-data-provider";
import { getControlCenterReadonlyData } from "./control-center-data-provider";
import { buildControlCenterRoomsSnapshot } from "./control-center-rooms";
import { buildHermesControlledPilotDashboardSummary } from "../hermes/hermes-controlled-pilot-summary";
import type { HermesControlledPilotDashboardSummary } from "../hermes/hermes-controlled-pilot-summary";
import { buildVisualizationV1ReadonlyModel } from "../visualization/visualization-v1-model";
import type { VisualizationV1ReadonlyModel } from "../visualization/visualization-v1-model";
import { buildAgentTeamFoundationReadonlySummary } from "../agent-team/agent-supervisor";
import type { AgentTeamFoundationReadonlySummary } from "../agent-team/agent-supervisor";
import type { HermesBridgePilotReadiness } from "../hermes/hermes-bridge-readiness";
import { sanitizeHermesBridgeReadiness } from "./control-center-app-snapshot";
import { CONTROL_CENTER_READONLY_GET_APP_SNAPSHOT_IPC_CHANNEL } from "../../../shared/ichikishima/control-center-readonly-ipc-channel";

/** テスト用 `ipcMain` 互換最小面 */
export interface IpcMainLike {
  handle(
    channel: string,
    listener: (
      event: unknown,
      ...args: unknown[]
    ) => unknown | Promise<unknown>,
  ): void;
  removeHandler?(channel: string): void;
}

export interface ControlCenterReadonlyIpcRegisterOptions {
  /** プロジェクトごとの固定パラメータ（Zone 等） */
  getParams: () => ControlCenterDataProviderParams;
  nowUnixMs?: () => number;
}

export const CONTROL_CENTER_READONLY_IPC_APP_CHANNEL = {
  GET_APP_SNAPSHOT: CONTROL_CENTER_READONLY_GET_APP_SNAPSHOT_IPC_CHANNEL,
  GET_ROOMS: "controlCenter.readonly.getRooms",
  GET_HERMES_STATUS: "controlCenter.readonly.getHermesStatus",
  GET_APPROVAL_SUMMARY: "controlCenter.readonly.getApprovalSummary",
  GET_AUDIT_SUMMARY: "controlCenter.readonly.getAuditSummary",
  GET_CONTROLLED_PILOT_SUMMARY:
    "controlCenter.readonly.getControlledPilotSummary",
  GET_AGENT_TEAM_SUMMARY: "controlCenter.readonly.getAgentTeamSummary",
  GET_VISUALIZATION_MODEL: "controlCenter.readonly.getVisualizationModel",
} as const;

const ALL_CHANNELS: readonly string[] = [
  CONTROL_CENTER_READONLY_IPC_APP_CHANNEL.GET_APP_SNAPSHOT,
  CONTROL_CENTER_READONLY_IPC_APP_CHANNEL.GET_ROOMS,
  CONTROL_CENTER_READONLY_IPC_APP_CHANNEL.GET_HERMES_STATUS,
  CONTROL_CENTER_READONLY_IPC_APP_CHANNEL.GET_APPROVAL_SUMMARY,
  CONTROL_CENTER_READONLY_IPC_APP_CHANNEL.GET_AUDIT_SUMMARY,
  CONTROL_CENTER_READONLY_IPC_APP_CHANNEL.GET_CONTROLLED_PILOT_SUMMARY,
  CONTROL_CENTER_READONLY_IPC_APP_CHANNEL.GET_AGENT_TEAM_SUMMARY,
  CONTROL_CENTER_READONLY_IPC_APP_CHANNEL.GET_VISUALIZATION_MODEL,
];

function assertReadOnlyChannelName(channel: string): void {
  if (!channel.startsWith("controlCenter.readonly.")) {
    throw new Error(`ipc:channel_namespace_invalid:${channel}`);
  }
  const forbidden =
    /execute|\.run\.|rawFs|rawShell|rawNetwork|rawGit|^wsl\.|process\.run|hermes\.run|approval\.execute/i;
  if (forbidden.test(channel)) {
    throw new Error(`ipc:channel_forbidden_pattern:${channel}`);
  }
}

export function getControlCenterReadonlyIpcChannels(): readonly string[] {
  return ALL_CHANNELS;
}

export interface ControlCenterHermesStatusPayload {
  readonly bridgeReadiness: ReturnType<typeof sanitizeHermesBridgeReadiness>;
  readonly statusNotes: readonly string[];
  readonly localFullLoopReady: boolean;
}

function resolveNow(opts: ControlCenterReadonlyIpcRegisterOptions): number {
  return opts.nowUnixMs ? opts.nowUnixMs() : Date.now();
}

export function buildControlCenterReadonlyIpcHandlers(
  opts: ControlCenterReadonlyIpcRegisterOptions,
): Record<
  string,
  (event: unknown, ...args: unknown[]) => unknown | Promise<unknown>
> {
  const wrap =
    <T>(fn: () => T) =>
    (): Promise<T> =>
      Promise.resolve(fn());

  return {
    [CONTROL_CENTER_READONLY_IPC_APP_CHANNEL.GET_APP_SNAPSHOT]: wrap(() => {
      const params = opts.getParams();
      return buildControlCenterAppSnapshot({
        ...params,
        wsl2LocalValueValidationReport:
          readHermesWsl2WrapperLocalValueFileWithSlotInventoryForValidation({
            projectRoot: params.projectRoot,
          }),
        nowUnixMs: resolveNow(opts),
      });
    }),
    [CONTROL_CENTER_READONLY_IPC_APP_CHANNEL.GET_ROOMS]: wrap(() => {
      const p = opts.getParams();
      const data = getControlCenterReadonlyData(p);
      const cp = buildHermesControlledPilotDashboardSummary(
        undefined,
        undefined,
      );
      return buildControlCenterRoomsSnapshot({
        data,
        controlledPilotDashboard: cp,
        memoryCandidateApproxCount: null,
        nowUnixMs: resolveNow(opts),
      });
    }),
    [CONTROL_CENTER_READONLY_IPC_APP_CHANNEL.GET_HERMES_STATUS]: wrap(() => {
      const data = getControlCenterReadonlyData(opts.getParams());
      return extractHermesStatusPayload(data.readiness.hermesBridgePilot, data);
    }),
    [CONTROL_CENTER_READONLY_IPC_APP_CHANNEL.GET_APPROVAL_SUMMARY]: wrap(
      () => getControlCenterReadonlyData(opts.getParams()).approvalQueueSummary,
    ),
    [CONTROL_CENTER_READONLY_IPC_APP_CHANNEL.GET_AUDIT_SUMMARY]: wrap(
      () => getControlCenterReadonlyData(opts.getParams()).auditLogSummary,
    ),
    [CONTROL_CENTER_READONLY_IPC_APP_CHANNEL.GET_CONTROLLED_PILOT_SUMMARY]:
      wrap(
        (): HermesControlledPilotDashboardSummary =>
          buildHermesControlledPilotDashboardSummary(undefined, undefined),
      ),
    [CONTROL_CENTER_READONLY_IPC_APP_CHANNEL.GET_AGENT_TEAM_SUMMARY]: wrap(
      (): AgentTeamFoundationReadonlySummary => {
        const data = getControlCenterReadonlyData(opts.getParams());
        const blockerApprox = data.riskSummary.length;
        const warnApprox =
          data.readiness.hermesBridgePilot.blockers.length +
          data.readiness.hermesBridgePilot.requiredHumanReviews.length;
        return buildAgentTeamFoundationReadonlySummary(
          blockerApprox,
          warnApprox,
        );
      },
    ),
    [CONTROL_CENTER_READONLY_IPC_APP_CHANNEL.GET_VISUALIZATION_MODEL]: wrap(
      (): VisualizationV1ReadonlyModel =>
        buildVisualizationV1ReadonlyModel({
          ...opts.getParams(),
          nowUnixMs: resolveNow(opts),
        }),
    ),
  };
}

export function extractHermesStatusPayload(
  bridge: HermesBridgePilotReadiness,
  data: Pick<ControlCenterReadonlyData, "readiness">,
): ControlCenterHermesStatusPayload {
  return {
    bridgeReadiness: sanitizeHermesBridgeReadiness(bridge),
    statusNotes: [...data.readiness.statusNotes],
    localFullLoopReady: data.readiness.localFullLoopReady,
  };
}

/**
 * Electron 本体へ配線する前の **登録だけ**（`ipcMain` 互換を DI）。
 * 各チャンネル名を `assertReadOnlyChannelName` で検証してから `handle` する。
 */
export function registerControlCenterReadonlyIpcHandlers(
  ipcMainLike: IpcMainLike,
  opts: ControlCenterReadonlyIpcRegisterOptions,
): void {
  const handlers = buildControlCenterReadonlyIpcHandlers(opts);
  for (const channel of getControlCenterReadonlyIpcChannels()) {
    assertReadOnlyChannelName(channel);
    const fn = handlers[channel];
    if (typeof fn !== "function") {
      throw new Error(`ipc:missing_readonly_handler:${channel}`);
    }
    ipcMainLike.handle(channel, fn);
  }
}
