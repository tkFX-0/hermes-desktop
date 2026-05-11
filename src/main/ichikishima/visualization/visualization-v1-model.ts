import { buildAgentTeamFoundationReadonlySummary } from "../agent-team/agent-supervisor";
import { buildAgentTeamVisualizationNodes } from "./agent-team-visualization-model";
import {
  getControlCenterReadonlyData,
  type ControlCenterDataProviderParams,
} from "../control-center/control-center-data-provider";
import { summarizeHermesWsl2WrapperConfig } from "../hermes/hermes-wsl2-wrapper-config";
import { buildHermesControlledPilotDashboardSummary } from "../hermes/hermes-controlled-pilot-summary";

export interface VisualizationV1EdgeStub {
  readonly fromLabel: string;
  readonly toLabel: string;
  readonly edgeRole: string;
}

export interface VisualizationV1NodeStub {
  readonly id: string;
  readonly kind: "supervisor_hub" | "gate_stub" | "pipeline_stub" | "room_stub";
  readonly statusLabel: string;
}

export interface VisualizationV1ReadonlyModel {
  readonly generatedAtUnixMs: number;
  readonly nodes: readonly VisualizationV1NodeStub[];
  readonly edges: readonly VisualizationV1EdgeStub[];
  readonly blockerCountApprox: number;
  readonly warningCountApprox: number;
  readonly footerNote: string;
}

export interface BuildVisualizationParams extends ControlCenterDataProviderParams {
  readonly nowUnixMs?: number;
}

/**
 * 「安全メタのみ」の可視化用グラフ論理。**座標計算や Three.js は持たない**。
 */
export function buildVisualizationV1ReadonlyModel(
  p: BuildVisualizationParams,
): VisualizationV1ReadonlyModel {
  const ts = p.nowUnixMs ?? Date.now();
  const bundle = getControlCenterReadonlyData(p);
  const blockerApprox = bundle.riskSummary.length;
  const warnApprox =
    bundle.readiness.hermesBridgePilot.blockers.length +
    bundle.readiness.hermesBridgePilot.requiredHumanReviews.length;

  const pilotDash = buildHermesControlledPilotDashboardSummary(
    undefined,
    undefined,
  );
  const wslSum = summarizeHermesWsl2WrapperConfig({});
  const teamNodes = buildAgentTeamVisualizationNodes();
  const teamSum = buildAgentTeamFoundationReadonlySummary(
    blockerApprox,
    warnApprox,
  );

  const nodes: VisualizationV1NodeStub[] = [
    {
      id: "viz_supervisor",
      kind: "supervisor_hub",
      statusLabel: `scheduler_disabled:${teamSum.schedulerEnabled ? "unexpected" : "ok"}`,
    },
    {
      id: "viz_gate_approval",
      kind: "gate_stub",
      statusLabel: "approval_gate_stub",
    },
    {
      id: "viz_gate_audit",
      kind: "gate_stub",
      statusLabel: "audit_gate_stub",
    },
    {
      id: "viz_gate_memory",
      kind: "gate_stub",
      statusLabel: "memory_gate_stub",
    },
    {
      id: "viz_room_controlled_pilot",
      kind: "room_stub",
      statusLabel: `${pilotDash.controlledPilotPreflightStatus}:dry_run_outline`,
    },
    {
      id: "viz_wsl_wrapper_outline",
      kind: "room_stub",
      statusLabel: `wsl2:${wslSum.outcome}`,
    },
    ...teamNodes.map(
      (n): VisualizationV1NodeStub => ({
        id: `viz_agent:${n.id}`,
        kind: "pipeline_stub",
        statusLabel: n.statusLabel.slice(0, 48),
      }),
    ),
  ];

  const edges: VisualizationV1EdgeStub[] = [
    {
      fromLabel: "supervisor_hub",
      toLabel: "approval_gate_stub",
      edgeRole: "read_only_outline",
    },
    {
      fromLabel: "supervisor_hub",
      toLabel: "audit_gate_stub",
      edgeRole: "read_only_outline",
    },
  ];

  return {
    generatedAtUnixMs: ts,
    nodes: Object.freeze(nodes),
    edges: Object.freeze(edges),
    blockerCountApprox: teamSum.blockerCountApprox,
    warningCountApprox: teamSum.warningCountApprox,
    footerNote:
      "visualization_meta_only:no_layout_engine:no_live_process:no_stdio_full_text",
  };
}
