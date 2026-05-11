/**
 * Packaged **short launch** smoke — checklist and evidence evaluation only.
 * No Electron, no child_process, no packaging. Actual launch is manual / separate Goal.
 *
 * @see CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_SMOKE_SPEC.md
 * @see CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_RUNNER_CONTRACT.md
 */

export const CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_ITEM_IDS = [
  "launch_within_timeout_budget",
  "exit_category_acceptable_or_documented",
  "get_app_snapshot_ok",
  "snapshot_source_label_observed_short_launch",
  "path_resolution_meta_observed",
  "renderer_no_raw_absolute_paths",
  "renderer_error_ui_honest",
  "renderer_no_secrets_or_raw_payload_visible",
  "production_ready_remains_false",
  "pending_packaging_not_cleared_without_full_signoff",
  "no_execution_ipc_exposed",
  "no_real_hermes_for_smoke",
  "no_wsl_exe_for_smoke",
  "no_unauthorized_execfile_or_child_process_for_smoke",
  "logs_follow_no_stdout_full_dump_policy",
] as const;

export type ControlCenterPackagedShortLaunchItemId =
  (typeof CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_ITEM_IDS)[number];

export type ControlCenterPackagedShortLaunchEvidence = Partial<
  Record<ControlCenterPackagedShortLaunchItemId, boolean>
>;

export type ControlCenterPackagedShortLaunchChecklistRow = {
  readonly id: ControlCenterPackagedShortLaunchItemId;
  readonly group:
    | "launch"
    | "snapshot"
    | "paths"
    | "renderer_safety"
    | "gate"
    | "execution_boundary"
    | "logging";
  /** Short prompt for Signoff; no absolute paths. */
  readonly prompt: string;
};

export type ControlCenterPackagedShortLaunchEvaluation = {
  /**
   * `pending` — evidence missing or empty.
   * `rejected` — at least one item explicitly false.
   * `complete_for_signoff` — all items true; operator may record Short launch Go on CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md (still does not flip productionReady).
   */
  readonly decision: "pending" | "rejected" | "complete_for_signoff";
  readonly missingItemIds: readonly ControlCenterPackagedShortLaunchItemId[];
  readonly rejectedItemIds: readonly ControlCenterPackagedShortLaunchItemId[];
  readonly safeSummaryLines: readonly string[];
};

const ROWS: readonly ControlCenterPackagedShortLaunchChecklistRow[] = [
  {
    id: "launch_within_timeout_budget",
    group: "launch",
    prompt:
      "Packaged short launch observed within the agreed wall-clock budget (no hang past timeout).",
  },
  {
    id: "exit_category_acceptable_or_documented",
    group: "launch",
    prompt:
      "Exit outcome is acceptable category or documented (no full stdout capture).",
  },
  {
    id: "get_app_snapshot_ok",
    group: "snapshot",
    prompt:
      "Read-only getAppSnapshot succeeds and snapshot parses in the packaged runtime.",
  },
  {
    id: "snapshot_source_label_observed_short_launch",
    group: "snapshot",
    prompt:
      "snapshotSourceLabel observed as expected for short launch (short text, no raw paths).",
  },
  {
    id: "path_resolution_meta_observed",
    group: "paths",
    prompt:
      "pathResolutionRuntimeMode / pathResolutionStatus / pending flag observed as expected.",
  },
  {
    id: "renderer_no_raw_absolute_paths",
    group: "renderer_safety",
    prompt:
      "Renderer shows no raw absolute paths for projectRoot/userData/resourcesPath.",
  },
  {
    id: "renderer_error_ui_honest",
    group: "renderer_safety",
    prompt:
      "Errors are shown explicitly; snapshot parse failure is not shown as success.",
  },
  {
    id: "renderer_no_secrets_or_raw_payload_visible",
    group: "renderer_safety",
    prompt:
      "Renderer shows no secrets, env values, or raw bridge payload text.",
  },
  {
    id: "production_ready_remains_false",
    group: "gate",
    prompt:
      "productionReady remains false (separate gate; smoke never promotes to true).",
  },
  {
    id: "pending_packaging_not_cleared_without_full_signoff",
    group: "gate",
    prompt:
      "pendingPackagingResolution not set false without full packaged Signoff (§9); may remain true after short launch.",
  },
  {
    id: "no_execution_ipc_exposed",
    group: "execution_boundary",
    prompt:
      "No execution IPC or arbitrary invoke exposed beyond read-only getAppSnapshot.",
  },
  {
    id: "no_real_hermes_for_smoke",
    group: "execution_boundary",
    prompt: "Real Hermes was not started during short launch smoke.",
  },
  {
    id: "no_wsl_exe_for_smoke",
    group: "execution_boundary",
    prompt: "wsl.exe was not executed during short launch smoke.",
  },
  {
    id: "no_unauthorized_execfile_or_child_process_for_smoke",
    group: "execution_boundary",
    prompt:
      "No unauthorized execFile/child_process for smoke (policy exceptions documented elsewhere only).",
  },
  {
    id: "logs_follow_no_stdout_full_dump_policy",
    group: "logging",
    prompt:
      "Operator logs: no full stdout/stderr dumps; no raw payload archives in the repo.",
  },
];

export function createControlCenterPackagedShortLaunchChecklist(): readonly ControlCenterPackagedShortLaunchChecklistRow[] {
  return ROWS;
}

/** Policy lines safe for docs or snapshot footers (no paths). */
export function summarizeControlCenterPackagedShortLaunchReadiness(): readonly string[] {
  return [
    "Packaged short launch smoke: evidence-only evaluation; this module does not start Electron.",
    "Empty evidence keeps decision pending; never implies packaged verified or production ready.",
    "pendingPackagingResolution:false requires full CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md path, not short launch alone.",
    "Do not record raw absolute paths, secrets, or full stdout in Signoff.",
  ];
}

export function evaluateControlCenterPackagedShortLaunchEvidence(
  evidence: ControlCenterPackagedShortLaunchEvidence | null | undefined,
): ControlCenterPackagedShortLaunchEvaluation {
  const ids = CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_ITEM_IDS;
  if (evidence == null || Object.keys(evidence).length === 0) {
    return {
      decision: "pending",
      missingItemIds: [...ids],
      rejectedItemIds: [],
      safeSummaryLines: [
        ...summarizeControlCenterPackagedShortLaunchReadiness(),
        "Evidence empty: packaged short launch gate remains pending.",
      ],
    };
  }

  const missing: ControlCenterPackagedShortLaunchItemId[] = [];
  const rejected: ControlCenterPackagedShortLaunchItemId[] = [];
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
        ...summarizeControlCenterPackagedShortLaunchReadiness(),
        "Short launch evidence rejected: at least one required item is false.",
      ],
    };
  }
  if (missing.length > 0) {
    return {
      decision: "pending",
      missingItemIds: missing,
      rejectedItemIds: [],
      safeSummaryLines: [
        ...summarizeControlCenterPackagedShortLaunchReadiness(),
        "Short launch evidence incomplete: some checklist items are unset.",
      ],
    };
  }

  return {
    decision: "complete_for_signoff",
    missingItemIds: [],
    rejectedItemIds: [],
    safeSummaryLines: [
      ...summarizeControlCenterPackagedShortLaunchReadiness(),
      "All short launch checklist items true in evidence; Short launch section of Signoff may record Go (productionReady still false).",
    ],
  };
}
