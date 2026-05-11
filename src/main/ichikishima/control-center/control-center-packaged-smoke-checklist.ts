/**
 * Packaged path smoke — checklist structure and evidence evaluation (no Electron, no packaging).
 * Actual smoke runs are manual / separate Goal; this module only encodes the gate shape.
 */

export const CONTROL_CENTER_PACKAGED_SMOKE_ITEM_IDS = [
  "packaged_build_starts",
  "get_app_snapshot_ok",
  "snapshot_source_label_packaged_path_verified",
  "path_resolution_meta_expected",
  "sandbox_resolution_expected",
  "approval_resolution_expected",
  "audit_resolution_expected",
  "handoff_resolution_expected",
  "renderer_no_raw_absolute_paths",
  "renderer_no_secrets_or_env",
  "production_ready_remains_false",
  "no_execution_ipc_exposed",
  "no_real_hermes_for_smoke",
  "no_wsl_exe_for_smoke",
  "no_execfile_or_child_process_for_smoke",
] as const;

export type ControlCenterPackagedSmokeItemId =
  (typeof CONTROL_CENTER_PACKAGED_SMOKE_ITEM_IDS)[number];

export type ControlCenterPackagedSmokeEvidence = Partial<
  Record<ControlCenterPackagedSmokeItemId, boolean>
>;

export type ControlCenterPackagedSmokeChecklistRow = {
  readonly id: ControlCenterPackagedSmokeItemId;
  readonly group:
    | "launch"
    | "snapshot"
    | "paths"
    | "renderer_safety"
    | "execution_boundary";
  /** Short prompt for Signoff; no absolute paths. */
  readonly prompt: string;
};

export type ControlCenterPackagedSmokeGateEvaluation = {
  /**
   * `pending` — evidence missing or empty.
   * `rejected` — at least one item explicitly false.
   * `complete_for_signoff` — all items true; operator may close Signoff and then clear pending in a release step.
   */
  readonly decision: "pending" | "rejected" | "complete_for_signoff";
  readonly missingItemIds: readonly ControlCenterPackagedSmokeItemId[];
  readonly rejectedItemIds: readonly ControlCenterPackagedSmokeItemId[];
  readonly safeSummaryLines: readonly string[];
};

const ROWS: readonly ControlCenterPackagedSmokeChecklistRow[] = [
  {
    id: "packaged_build_starts",
    group: "launch",
    prompt: "Packaged build starts without immediate crash (short manual run).",
  },
  {
    id: "get_app_snapshot_ok",
    group: "snapshot",
    prompt: "Read-only getAppSnapshot IPC succeeds and parses.",
  },
  {
    id: "snapshot_source_label_packaged_path_verified",
    group: "snapshot",
    prompt:
      "Snapshot source label matches packaged path smoke verified policy (post-release label if needed).",
  },
  {
    id: "path_resolution_meta_expected",
    group: "paths",
    prompt:
      "pathResolutionRuntimeMode / pathResolutionStatus / pending flag match expected observation.",
  },
  {
    id: "sandbox_resolution_expected",
    group: "paths",
    prompt:
      "Sandbox / zone resolution points to expected layout (not wrong drive/profile).",
  },
  {
    id: "approval_resolution_expected",
    group: "paths",
    prompt:
      "Approval queue paths and counts align with expected packaged layout.",
  },
  {
    id: "audit_resolution_expected",
    group: "paths",
    prompt: "Audit log paths and counts align with expected packaged layout.",
  },
  {
    id: "handoff_resolution_expected",
    group: "paths",
    prompt:
      "Handoff inbox/marker logic references expected relative locations.",
  },
  {
    id: "renderer_no_raw_absolute_paths",
    group: "renderer_safety",
    prompt:
      "Renderer shows no raw absolute paths for projectRoot/userData/resourcesPath.",
  },
  {
    id: "renderer_no_secrets_or_env",
    group: "renderer_safety",
    prompt: "Renderer shows no secrets or env values from snapshot.",
  },
  {
    id: "production_ready_remains_false",
    group: "renderer_safety",
    prompt: "productionReady stays false (separate gate from packaged path).",
  },
  {
    id: "no_execution_ipc_exposed",
    group: "execution_boundary",
    prompt:
      "No execution IPC or arbitrary invoke exposed beyond read-only snapshot.",
  },
  {
    id: "no_real_hermes_for_smoke",
    group: "execution_boundary",
    prompt: "Real Hermes was not started during smoke.",
  },
  {
    id: "no_wsl_exe_for_smoke",
    group: "execution_boundary",
    prompt: "wsl.exe was not executed during smoke.",
  },
  {
    id: "no_execfile_or_child_process_for_smoke",
    group: "execution_boundary",
    prompt: "execFile / child_process was not used during smoke.",
  },
];

export function createControlCenterPackagedSmokeChecklist(): readonly ControlCenterPackagedSmokeChecklistRow[] {
  return ROWS;
}

/** Policy lines safe for docs or snapshot footers (no paths). */
export function summarizeControlCenterPackagedSmokeGate(): readonly string[] {
  return [
    "Packaged path smoke: design-only in repo; evidence must be recorded in CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md.",
    "pendingPackagingResolution:false only after all checklist items are true in evidence and Signoff is Go.",
    "packaged path verified is not production ready and not Hermes runtime ready.",
    "Do not show raw absolute paths in the renderer summary.",
  ];
}

export function evaluateControlCenterPackagedSmokeEvidence(
  evidence: ControlCenterPackagedSmokeEvidence | null | undefined,
): ControlCenterPackagedSmokeGateEvaluation {
  const ids = CONTROL_CENTER_PACKAGED_SMOKE_ITEM_IDS;
  if (evidence == null || Object.keys(evidence).length === 0) {
    return {
      decision: "pending",
      missingItemIds: [...ids],
      rejectedItemIds: [],
      safeSummaryLines: [
        ...summarizeControlCenterPackagedSmokeGate(),
        "Evidence empty: packaged path gate remains pending.",
      ],
    };
  }

  const missing: ControlCenterPackagedSmokeItemId[] = [];
  const rejected: ControlCenterPackagedSmokeItemId[] = [];
  for (const id of ids) {
    const v = evidence[id];
    if (v === undefined) missing.push(id);
    else if (v === false) rejected.push(id);
  }

  if (rejected.length > 0) {
    return {
      decision: "rejected",
      missingItemIds: missing,
      rejectedItemIds: rejected,
      safeSummaryLines: [
        ...summarizeControlCenterPackagedSmokeGate(),
        "Smoke evidence rejected: at least one required item is false.",
      ],
    };
  }
  if (missing.length > 0) {
    return {
      decision: "pending",
      missingItemIds: missing,
      rejectedItemIds: [],
      safeSummaryLines: [
        ...summarizeControlCenterPackagedSmokeGate(),
        "Smoke evidence incomplete: some checklist items are unset.",
      ],
    };
  }

  return {
    decision: "complete_for_signoff",
    missingItemIds: [],
    rejectedItemIds: [],
    safeSummaryLines: [
      ...summarizeControlCenterPackagedSmokeGate(),
      "All packaged smoke checklist items true in evidence; Signoff may record Go before code changes pending flag.",
    ],
  };
}
