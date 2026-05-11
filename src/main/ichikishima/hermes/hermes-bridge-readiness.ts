import { existsSync } from "node:fs";
import { join } from "node:path";

import { validatePathInput } from "../autonomy-zone/path-guard";

import {
  HERMES_BRIDGE_ALLOWED_APIS,
  HERMES_BRIDGE_FORBIDDEN_APIS,
  HERMES_BRIDGE_READINESS_REQUIREMENTS,
} from "./hermes-bridge-api-registry";

export type HermesBridgePilotLabel =
  | "READY_FOR_HERMES_BRIDGE_PILOT_DRY_RUN"
  | "NOT_READY";

export interface HermesBridgePilotReadiness {
  ready: boolean;
  label: HermesBridgePilotLabel;
  blockers: string[];
  requiredHumanReviews: string[];
  allowedApis: string[];
  forbiddenApis: string[];
}

const DOC_REL = [
  "ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md",
  "CONTROL_CENTER_OWNERSHIP_MODEL.md",
  "HERMES_BRIDGE_OWNERSHIP_MODEL.md",
  "HERMES_BRIDGE_FINAL_REVIEW.md",
  "HERMES_BRIDGE_PAYLOAD_CONTRACT.md",
  "HERMES_BRIDGE_RECEIVER_QUEUE.md",
  "HERMES_BRIDGE_PILOT_DRY_RUN_PLAN.md",
  "HERMES_BRIDGE_PILOT_SPEC.md",
  "HERMES_BRIDGE_OPERATION_MATRIX.md",
] as const;

function resolveDocPath(projectRoot: string, name: string): string | null {
  const projErr = validatePathInput(projectRoot, "projectRoot");
  if (projErr) return null;
  if (!safeDocBasename(name)) return null;
  try {
    return join(projectRoot, "docs", "ichikishima", name);
  } catch {
    return null;
  }
}

/** `docs/ichikishima` 直下の単一ファイル名のみ許可する。 */
function safeDocBasename(name: string): boolean {
  if (!name.endsWith(".md")) return false;
  if (name.includes("/") || name.includes("\\")) return false;
  if (name.includes("..")) return false;
  return /^[a-zA-Z0-9][a-zA-Z0-9._-]+\.md$/.test(name);
}

export function projectHasHermesBridgeGateDocs(projectRoot: string): {
  ok: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  for (const leaf of DOC_REL) {
    const resolved = resolveDocPath(projectRoot, leaf);
    if (!resolved || !existsSync(resolved)) {
      missing.push(`docs/ichikishima/${leaf}`);
    }
  }
  return { ok: missing.length === 0, missing };
}

export function getHermesBridgePilotReadiness(input: {
  projectRoot: string;
}): HermesBridgePilotReadiness {
  const baseReviews = [...HERMES_BRIDGE_READINESS_REQUIREMENTS];
  const requiredHumanReviews = [
    "HERMES_BRIDGE_FINAL_REVIEW が人間レビュー済みであること（HERMES_BRIDGE_API_REGISTRY と突合せ）",
    ...baseReviews,
  ];

  const blockers: string[] = [];

  const projErr = validatePathInput(input.projectRoot, "projectRoot");
  if (projErr) {
    blockers.push(projErr.reason);
    return {
      ready: false,
      label: "NOT_READY",
      blockers,
      requiredHumanReviews,
      allowedApis: [...HERMES_BRIDGE_ALLOWED_APIS],
      forbiddenApis: [...HERMES_BRIDGE_FORBIDDEN_APIS],
    };
  }

  const docCheck = projectHasHermesBridgeGateDocs(input.projectRoot);
  if (!docCheck.ok) {
    blockers.push(
      ...docCheck.missing.map((p) => `missing gate document: ${p}`),
    );
  }

  const ready = blockers.length === 0;

  return {
    ready,
    label: ready ? "READY_FOR_HERMES_BRIDGE_PILOT_DRY_RUN" : "NOT_READY",
    blockers,
    requiredHumanReviews,
    allowedApis: [...HERMES_BRIDGE_ALLOWED_APIS],
    forbiddenApis: [...HERMES_BRIDGE_FORBIDDEN_APIS],
  };
}
