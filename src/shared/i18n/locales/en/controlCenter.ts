export default {
  shell: {
    title: "Control Center (read-only)",
    subtitle:
      "View-only Ichikishima dashboard. No actions are executed from this screen.",
    mainLandmarkLabel: "Control Center read-only dashboard",
    loading: "Loading snapshot…",
    refresh: "Refresh snapshot (read-only)",
    refreshAria: "Refresh Control Center snapshot using read-only IPC",
    unavailable: "Control Center snapshot is unavailable.",
    readOnlyIpcFailed: "Read-only IPC failed.",
    noActionsExecuted: "No actions were executed.",
    productionNotReady: "Not production ready (read-only foundation).",
    emptyState: "No snapshot data.",
    parseError: "Snapshot validation failed.",
    rooms: "Rooms",
    roomActions: "Actions (all disabled)",
    global: "Overview",
    statusAtAGlance: "Status at a glance",
    blockersShort: "blockers",
    warningsShort: "warnings",
    nextRecommendedGoalShort: "next goal",
    operationalHints:
      "Operational hints (read-only; not live execution status)",
    readinessSafetyBanner:
      "Display Only — Readiness labels are non-execution review states. READY_* values do not approve execution, GO, or productionReady. decision=HOLD / execution=disabled / productionReady=false.",
    bridgeReadinessHint: "non-execution design label — not GO or execution approval",
    scenarioSuiteHint: "non-execution label — not productionReady",
    pilotMetaHint: "not execution approval — HOLD remains current",
    controlledPilotLabel: "Controlled Pilot",
    controlledPilotHint:
      "Awaiting configured values / preflight — not a live pilot run — not execution approval",
    realHermesLabel: "Real Hermes process",
    realHermesHint: "Not running — no live Hermes in this read-only UI",
    wslWrapperLabel: "WSL2 wrapper",
    wslWrapperHint: "Design / path pending — wsl.exe is not executed here",
    schedulerHint: "Scheduler stays off in dry-run policy",
    manualRefreshOnly: "Manual refresh only; no auto-polling.",
    blockers: "Blockers",
    warnings: "Warnings",
    nextGoal: "Next recommended goal",
    agentTeam: "Agent Team (dry-run)",
    scheduler: "Scheduler",
    schedulerOff: "disabled",
    schedulerUnexpected: "unexpected state",
    visualization: "Visualization (meta)",
    approvalAudit: "Approval / Audit (summary)",
    memory: "Memory candidates (summary)",
    hints: "Status hints",
    counts: "Approximate counts",
    errorTitle: "Could not load Control Center",
    packagingNote:
      "Snapshot source is development-oriented until packaged projectRoot is verified. productionReady stays false.",
    snapshotSource: {
      title: "Snapshot source (read-only)",
      runtimeMode: "Runtime mode",
      sourceLabel: "Source label",
      pathStatus: "Path resolution status",
      pendingPackaging: "Packaged path resolution pending",
      linesTitle: "Safe signals (no absolute paths)",
      runtimeDev: "Development (unpackaged layout)",
      runtimePackagedPending: "Packaged (path resolution pending)",
      labels: {
        development_snapshot_dev_only_source:
          "Development snapshot / dev-only source",
        packaged_snapshot_path_resolution_pending:
          "Packaged snapshot — path resolution pending",
      },
      pathStatusLabels: {
        dev_repo_layout_ok: "Development repo layout detected",
        dev_repo_layout_marker_missing: "docs/ichikishima marker missing",
        packaged_unverified_fallback_layout:
          "Packaged fallback layout (unverified)",
        zone_outside_project_warning:
          "Zone path was corrected under projectRoot",
      },
    },
  },
} as const;
