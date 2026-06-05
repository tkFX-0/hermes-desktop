/**
 * Human GO batch checklist — code readiness vs live activation (no secrets).
 */

import { evaluateBurnInWallClock } from "./burn-in-wall-clock-store";
import { hasConstitutionalGoScope, resolveConstitutionalGo } from "./constitutional-go-state";
import { buildGapTracker, type GapTrackerInput } from "./gap-tracker";
import { resolveOperationalRelease } from "./operational-release-state";
import { resolveObsidianVaultPath } from "./obsidian-vault-path";

export type HumanGoItemStatus = "READY" | "PARTIAL" | "HOLD" | "BLOCKED";

export interface HumanGoReadinessItem {
  id: string;
  label: string;
  status: HumanGoItemStatus;
  humanGoRequired: boolean;
  note: string;
}

export interface HumanGoReadinessReport {
  generatedAtIso: string;
  items: readonly HumanGoReadinessItem[];
  /** Always HOLD for automation until Track D + explicit scopes (reporting only). */
  decisionForAutomation: "HOLD" | "PARTIAL" | "GO_PREPARED";
  openGapCount: number;
  constitutionalActive: boolean;
  operationalActivated: boolean;
}

export interface HumanGoReadinessInput {
  projectRoot?: string;
  voicePass?: boolean;
  stackchanConnected?: boolean;
  phase8CodeDone?: boolean;
  burnInPass?: boolean;
  schedulerCapsIntegrated?: boolean;
  obsidianWriteDryRunReady?: boolean;
  discordReadDryRunReady?: boolean;
  hermesSubprocessBridgeReady?: boolean;
  shadowSttOptIn?: boolean;
  wslCodexPresent?: boolean;
  devPipelineEnabled?: boolean;
}

export function buildHumanGoReadiness(
  input: HumanGoReadinessInput = {}
): HumanGoReadinessReport {
  const root = input.projectRoot ?? process.cwd();
  const release = resolveOperationalRelease(root);
  const constitutional = resolveConstitutionalGo(root);
  const burnEval = evaluateBurnInWallClock(root);
  const vaultConfigured = resolveObsidianVaultPath(root) !== "";

  const gapInput: GapTrackerInput = {
    stackchanConnected: input.stackchanConnected ?? false,
    voicePass: input.voicePass ?? false,
    phase8CodeDone: input.phase8CodeDone ?? true,
    burnInPass: input.burnInPass ?? burnEval.simulationPass,
    sidebotHold: !release.sidebotHoldReleased,
    burnInWallClockPass: burnEval.wallClockPass,
    pilotVoiceTracksComplete: true,
    trackDOperationalRelease: release.activated,
    sidebotHoldReleased: release.sidebotHoldReleased,
    obsidianWriteDryRunReady: input.obsidianWriteDryRunReady ?? true,
    schedulerCapsIntegrated: input.schedulerCapsIntegrated ?? true,
    discordReadDryRunReady: input.discordReadDryRunReady ?? true,
    constitutionalAllGoActive: constitutional.active,
    obsidianActualWriteEnabled: hasConstitutionalGoScope("obsidian_write", root),
    hermesSubprocessBridgeReady: input.hermesSubprocessBridgeReady ?? true,
    shadowSttOptIn: input.shadowSttOptIn ?? hasConstitutionalGoScope("shadow_stt", root)
  };

  const gaps = buildGapTracker(gapInput);
  const openGaps = gaps.filter((g) => g.status === "OPEN").length;

  const items: HumanGoReadinessItem[] = [
    {
      id: "track_d",
      label: "Track D operational release",
      status: release.activated ? "READY" : "HOLD",
      humanGoRequired: true,
      note: release.activated
        ? `source=${release.source}`
        : ".shikishima-memory/operational-release.local.json"
    },
    {
      id: "constitutional",
      label: "Constitutional GO scopes",
      status: constitutional.active ? "PARTIAL" : "HOLD",
      humanGoRequired: true,
      note: constitutional.active
        ? `scopes=${constitutional.scopes.length}`
        : "constitutional-go.local.json or env"
    },
    {
      id: "obsidian_write",
      label: "Obsidian actual write (E3b)",
      status: hasConstitutionalGoScope("obsidian_write", root)
        ? vaultConfigured
          ? "READY"
          : "PARTIAL"
        : "HOLD",
      humanGoRequired: true,
      note: vaultConfigured ? "vault path resolved" : "set OBSIDIAN_VAULT_PATH later"
    },
    {
      id: "burn_in_wall",
      label: "Burn-in wall-clock",
      status: burnEval.wallClockPass
        ? "READY"
        : burnEval.simulationPass
          ? "PARTIAL"
          : "HOLD",
      humanGoRequired: true,
      note: `ticks=${burnEval.tickCount} humanAck=${burnEval.humanGoAcknowledged}`
    },
    {
      id: "agent_team_tick",
      label: "Agent team scheduled tick",
      status:
        release.activated && release.agentTeamTickEnabled ? "PARTIAL" : "HOLD",
      humanGoRequired: true,
      note: release.agentTeamTickEnabled
        ? `every ${release.agentTeamTickIntervalMinutes}m (ops file)`
        : "set agentTeamTickEnabled in operational-release"
    },
    {
      id: "dev_pipeline",
      label: "Dev pipeline (subscription)",
      status: input.devPipelineEnabled ? "PARTIAL" : "HOLD",
      humanGoRequired: false,
      note: "composer→claude; codex leg optional"
    },
    {
      id: "codex_leg",
      label: "Codex WSL worker leg",
      status: input.wslCodexPresent ? "PARTIAL" : "HOLD",
      humanGoRequired: true,
      note: "WK-01 auto-launch remains HOLD"
    },
    {
      id: "unbounded_discord",
      label: "24/7 unbounded Discord send",
      status: "BLOCKED",
      humanGoRequired: false,
      note: "not a target — capped scheduler only"
    }
  ];

  let decisionForAutomation: HumanGoReadinessReport["decisionForAutomation"] = "HOLD";
  if (release.activated && constitutional.active && openGaps === 0) {
    decisionForAutomation = "GO_PREPARED";
  } else if (release.activated || constitutional.active) {
    decisionForAutomation = "PARTIAL";
  }

  return {
    generatedAtIso: new Date().toISOString(),
    items,
    decisionForAutomation,
    openGapCount: openGaps,
    constitutionalActive: constitutional.active,
    operationalActivated: release.activated
  };
}

export function formatHumanGoReadinessDiscord(report: HumanGoReadinessReport): string {
  const lines = report.items.map(
    (i) =>
      `- **${i.id}** \`${i.status}\`${i.humanGoRequired ? " (要GO)" : ""}: ${i.note}`
  );
  return (
    "📋 **人間GO 一括確認リスト** (実装済み・有効化は別)\n" +
    `自動判定: \`${report.decisionForAutomation}\` / openGaps=${report.openGapCount}\n` +
  `憲法GO: ${report.constitutionalActive ? "ON" : "OFF"} / TrackD: ${report.operationalActivated ? "ON" : "OFF"}\n\n` +
    lines.join("\n") +
    "\n\n詳細: `node scripts/shikishima-human-go-readiness.mjs`"
  );
}
