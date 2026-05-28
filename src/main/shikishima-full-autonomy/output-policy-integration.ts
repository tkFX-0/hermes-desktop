/**
 * Phase 3 — unified output policy bundle (text only, no send).
 */

import type { ShikishimaUnifiedStateSnapshot } from "./snapshot-types";
import {
  planAllSurfaceOutputs,
  planSurfaceOutput,
  type OutputSurface,
  type SurfaceOutputPlan
} from "./unified-output-policy";

export const OUTPUT_POLICY_VERSION = "phase3-v1" as const;

export interface UnifiedOutputBundle {
  policyVersion: typeof OUTPUT_POLICY_VERSION;
  snapshot: ShikishimaUnifiedStateSnapshot;
  outputs: readonly SurfaceOutputPlan[];
  discordBody: string;
  electronBody: string;
  evidenceBody: string;
  stackchanBody: string;
}

export function buildUnifiedOutputBundle(
  snapshot: ShikishimaUnifiedStateSnapshot
): UnifiedOutputBundle {
  const outputs = planAllSurfaceOutputs(snapshot);
  const pick = (surface: OutputSurface): string =>
    outputs.find((o) => o.surface === surface)?.body ?? "";

  return {
    policyVersion: OUTPUT_POLICY_VERSION,
    snapshot,
    outputs,
    stackchanBody: pick("stackchan"),
    discordBody: pick("discord"),
    electronBody: pick("electron"),
    evidenceBody: pick("evidence")
  };
}

export function formatOutputBundleForEvidence(bundle: UnifiedOutputBundle): string {
  return [
    `policy=${bundle.policyVersion}`,
    `decision=${bundle.snapshot.globalDecision}`,
    `stackchan=${bundle.stackchanBody.length}chars`,
    `discord=${bundle.discordBody.length}chars`,
    `electron=${bundle.electronBody.length}chars`,
    `evidence=${bundle.evidenceBody.length}chars`
  ].join("\n");
}

export function planSurfaceOutputFromBundle(
  bundle: UnifiedOutputBundle,
  surface: OutputSurface
): SurfaceOutputPlan {
  return planSurfaceOutput(bundle.snapshot, surface);
}
