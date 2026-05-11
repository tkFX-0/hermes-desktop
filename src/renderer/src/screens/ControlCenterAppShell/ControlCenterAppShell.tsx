import { useCallback, useEffect, useState } from "react";
import { LayoutDashboard, RefreshCw } from "lucide-react";

import { useI18n } from "../../components/useI18n";
import {
  type ControlCenterShellPathResolutionStatus,
  type ControlCenterShellSnapshot,
  type ControlCenterShellSnapshotSourceLabel,
  parseControlCenterShellSnapshot,
} from "../../../../shared/ichikishima/control-center-shell-ui-contract";

type LoadState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; snapshot: ControlCenterShellSnapshot }
  | {
      kind: "error";
      titleKey:
        | "controlCenter.shell.unavailable"
        | "controlCenter.shell.readOnlyIpcFailed";
      detailCode: string;
    };

const cardStyle: React.CSSProperties = {
  background: "#161b22",
  border: "1px solid #30363d",
  borderRadius: 8,
  padding: 14,
  marginBottom: 12,
};

const muted: React.CSSProperties = { color: "#8b949e", fontSize: 12 };
const RAW_VALUES_HIDDEN_LABEL = "Raw values: hidden";

function clip(s: string, max: number): string {
  const txt = s.trim();
  return txt.length <= max ? txt : `${txt.slice(0, max)}…`;
}

const SOURCE_LABEL_I18N: Record<
  ControlCenterShellSnapshotSourceLabel,
  | "controlCenter.shell.snapshotSource.labels.development_snapshot_dev_only_source"
  | "controlCenter.shell.snapshotSource.labels.packaged_snapshot_path_resolution_pending"
> = {
  development_snapshot_dev_only_source:
    "controlCenter.shell.snapshotSource.labels.development_snapshot_dev_only_source",
  packaged_snapshot_path_resolution_pending:
    "controlCenter.shell.snapshotSource.labels.packaged_snapshot_path_resolution_pending",
};

const PATH_STATUS_I18N: Record<
  ControlCenterShellPathResolutionStatus,
  | "controlCenter.shell.snapshotSource.pathStatusLabels.dev_repo_layout_ok"
  | "controlCenter.shell.snapshotSource.pathStatusLabels.dev_repo_layout_marker_missing"
  | "controlCenter.shell.snapshotSource.pathStatusLabels.packaged_unverified_fallback_layout"
  | "controlCenter.shell.snapshotSource.pathStatusLabels.zone_outside_project_warning"
> = {
  dev_repo_layout_ok:
    "controlCenter.shell.snapshotSource.pathStatusLabels.dev_repo_layout_ok",
  dev_repo_layout_marker_missing:
    "controlCenter.shell.snapshotSource.pathStatusLabels.dev_repo_layout_marker_missing",
  packaged_unverified_fallback_layout:
    "controlCenter.shell.snapshotSource.pathStatusLabels.packaged_unverified_fallback_layout",
  zone_outside_project_warning:
    "controlCenter.shell.snapshotSource.pathStatusLabels.zone_outside_project_warning",
};

/** Read-only Control Center：`getAppSnapshot` のみ（hermesAPI 実行 API は呼ばない）。 */
export default function ControlCenterAppShell(): React.JSX.Element {
  const { t } = useI18n();
  const [state, setState] = useState<LoadState>({ kind: "idle" });

  const load = useCallback(async () => {
    setState({ kind: "loading" });
    const cc = window.ichikishimaControlCenter;
    if (!cc?.getAppSnapshot) {
      setState({
        kind: "error",
        titleKey: "controlCenter.shell.unavailable",
        detailCode: "preload_api_missing",
      });
      return;
    }
    try {
      const raw: unknown = await cc.getAppSnapshot();
      if (raw === undefined || raw === null) {
        setState({
          kind: "error",
          titleKey: "controlCenter.shell.unavailable",
          detailCode: "snapshot_null",
        });
        return;
      }
      const parsed = parseControlCenterShellSnapshot(raw);
      if (!parsed.ok) {
        setState({
          kind: "error",
          titleKey: "controlCenter.shell.unavailable",
          detailCode: parsed.errorCode,
        });
        return;
      }
      setState({ kind: "success", snapshot: parsed.snapshot });
    } catch {
      setState({
        kind: "error",
        titleKey: "controlCenter.shell.readOnlyIpcFailed",
        detailCode: "invoke_rejected",
      });
    }
  }, []);

  useEffect(() => {
    const tid = window.setTimeout(() => {
      void load();
    }, 0);
    return (): void => window.clearTimeout(tid);
  }, [load]);

  return (
    <div
      role="main"
      aria-label={String(t("controlCenter.shell.mainLandmarkLabel"))}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#0d1117",
        color: "#c9d1d9",
        overflow: "auto",
        padding: 20,
      }}
    >
      <header style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LayoutDashboard size={22} color="#58a6ff" aria-hidden />
          <h1 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>
            {t("controlCenter.shell.title")}
          </h1>
        </div>
        <p style={{ ...muted, margin: "8px 0 0" }}>
          {t("controlCenter.shell.subtitle")}
        </p>
        <p style={{ ...muted, margin: "6px 0 0", fontSize: 11 }}>
          {t("controlCenter.shell.packagingNote")}
        </p>
        <p style={{ ...muted, margin: "4px 0 0", fontSize: 11 }}>
          {t("controlCenter.shell.manualRefreshOnly")}
        </p>
        <p
          role="note"
          aria-label="Safety boundary notice"
          style={{
            margin: "8px 0 0",
            padding: "6px 10px",
            borderRadius: 5,
            border: "1px solid rgba(251,146,60,0.35)",
            background: "rgba(251,146,60,0.07)",
            color: "#fb923c",
            fontSize: 11,
            lineHeight: 1.5,
          }}
        >
          {t("controlCenter.shell.readinessSafetyBanner")}
        </p>
        <button
          type="button"
          onClick={() => void load()}
          disabled={state.kind === "loading"}
          aria-label={String(t("controlCenter.shell.refreshAria"))}
          style={{
            marginTop: 12,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 6,
            border: "1px solid #30363d",
            background: state.kind === "loading" ? "#21262d" : "#1f6feb",
            color: "#f0f6fc",
            cursor: state.kind === "loading" ? "wait" : "pointer",
            fontSize: 13,
          }}
        >
          <RefreshCw size={14} aria-hidden />
          {t("controlCenter.shell.refresh")}
        </button>
      </header>

      {state.kind === "loading" && (
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          style={{ padding: 24, ...muted }}
        >
          {t("controlCenter.shell.loading")}
        </div>
      )}

      {state.kind === "error" && (
        <section
          role="alert"
          style={{
            ...cardStyle,
            borderColor: "#da3633",
            background: "#1c2128",
          }}
        >
          <h2 style={{ fontSize: 15, margin: "0 0 8px", color: "#f85149" }}>
            {t("controlCenter.shell.errorTitle")}
          </h2>
          <p style={{ margin: 0, fontSize: 14 }}>{t(state.titleKey)}</p>
          <p style={{ ...muted, margin: "8px 0 0" }}>
            {t("controlCenter.shell.noActionsExecuted")}
          </p>
          <p
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 11,
              color: "#8b949e",
              margin: "10px 0 0",
            }}
          >
            {clip(`code:${state.detailCode}`, 120)}
          </p>
        </section>
      )}

      {state.kind === "success" && (
        <>
          <section
            role="region"
            aria-label={String(t("controlCenter.shell.snapshotSource.title"))}
            aria-describedby={
              state.snapshot.pendingPackagingResolution
                ? "cc-pending-packaging-flag"
                : undefined
            }
            style={{
              ...cardStyle,
              borderLeftWidth: 4,
              borderLeftStyle: "solid",
              borderLeftColor: state.snapshot.pendingPackagingResolution
                ? "#d29922"
                : "#3fb950",
            }}
          >
            <h2 style={{ fontSize: 14, margin: "0 0 10px", color: "#a371f7" }}>
              {t("controlCenter.shell.snapshotSource.title")}
            </h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 12px",
                fontSize: 13,
              }}
            >
              <li>
                <strong>
                  {t("controlCenter.shell.snapshotSource.runtimeMode")}
                </strong>
                {": "}
                {state.snapshot.pathResolutionRuntimeMode ===
                "electron_development"
                  ? t("controlCenter.shell.snapshotSource.runtimeDev")
                  : t(
                      "controlCenter.shell.snapshotSource.runtimePackagedPending",
                    )}
              </li>
              <li>
                <strong>
                  {t("controlCenter.shell.snapshotSource.sourceLabel")}
                </strong>
                {": "}
                {t(SOURCE_LABEL_I18N[state.snapshot.snapshotSourceLabel])}
              </li>
              <li>
                <strong>
                  {t("controlCenter.shell.snapshotSource.pathStatus")}
                </strong>
                {": "}
                {t(PATH_STATUS_I18N[state.snapshot.pathResolutionStatus])}
              </li>
              <li>
                <strong>productionReady</strong>:{" "}
                {String(state.snapshot.productionReady)} —{" "}
                {t("controlCenter.shell.productionNotReady")}
              </li>
              {state.snapshot.pendingPackagingResolution ? (
                <li
                  id="cc-pending-packaging-flag"
                  style={{ color: "#d29922", marginTop: 6 }}
                >
                  {t("controlCenter.shell.snapshotSource.pendingPackaging")}
                </li>
              ) : null}
              {state.snapshot.wsl2LocalValueValidationSummary
                .slotInventoryRefreshSummary ? (
                <li>
                  <strong>wsl2PackagingSafetyGate</strong>{" "}
                  <span style={muted}>
                    (enum-only assessment - no execution)
                  </span>
                  {": "}packagingGate=
                  {clip(
                    state.snapshot.wsl2LocalValueValidationSummary
                      .slotInventoryRefreshSummary.packagingGateStatus ??
                      "unresolved",
                    48,
                  )}{" "}
                  packagingRisk=
                  {clip(
                    state.snapshot.wsl2LocalValueValidationSummary
                      .slotInventoryRefreshSummary.packagingRiskLevel ??
                      "unknown",
                    24,
                  )}{" "}
                  packagingBlockers=
                  {clip(
                    state.snapshot.wsl2LocalValueValidationSummary.slotInventoryRefreshSummary.packagingBlockers?.join(
                      ", ",
                    ) ?? "none",
                    120,
                  )}{" "}
                  canRunWrapper=
                  {String(
                    state.snapshot.wsl2LocalValueValidationSummary
                      .slotInventoryRefreshSummary.canRunWrapper ?? false,
                  )}{" "}
                  decision remains HOLD; execution remains disabled; packaging
                  gate is non-execution readiness only.{" "}
                  {RAW_VALUES_HIDDEN_LABEL}
                </li>
              ) : null}
            </ul>
            <div style={{ fontSize: 12, ...muted }}>
              {t("controlCenter.shell.snapshotSource.linesTitle")}
            </div>
            <ul style={{ fontSize: 12, paddingLeft: 18, margin: "6px 0 0" }}>
              {state.snapshot.pathResolutionSafeSummaryLines.map((ln, idx) => (
                <li key={`prs-${idx}`}>{clip(ln, 220)}</li>
              ))}
            </ul>
          </section>

          <section style={cardStyle}>
            <h2 style={{ fontSize: 14, margin: "0 0 10px", color: "#58a6ff" }}>
              {t("controlCenter.shell.global")}
            </h2>
            <div
              role="group"
              aria-label={String(t("controlCenter.shell.statusAtAGlance"))}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                alignItems: "baseline",
                marginBottom: 12,
                padding: "10px 12px",
                borderRadius: 6,
                background: "#0d1117",
                border: "1px solid #30363d",
              }}
            >
              <span style={{ fontSize: 15 }}>
                <strong style={{ color: "#f85149" }}>
                  {state.snapshot.blockersCount}
                </strong>{" "}
                {t("controlCenter.shell.blockersShort")}
              </span>
              <span style={{ fontSize: 15 }}>
                <strong style={{ color: "#d29922" }}>
                  {state.snapshot.warningsCount}
                </strong>{" "}
                {t("controlCenter.shell.warningsShort")}
              </span>
            </div>
            <div
              style={{
                marginBottom: 14,
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #388bfd",
                background: "#0d1117",
              }}
            >
              <div style={{ ...muted, marginBottom: 6, fontSize: 11 }}>
                {t("controlCenter.shell.nextGoal")}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.45 }}>
                {clip(state.snapshot.nextRecommendedGoal, 400)}
              </div>
            </div>
            <p style={{ ...muted, margin: "0 0 10px", fontSize: 12 }}>
              {t("controlCenter.shell.operationalHints")}
            </p>
            <ul
              style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 13 }}
            >
              <li>
                <strong>appStatus</strong>: {state.snapshot.appStatus}
              </li>
              <li>
                <strong>generatedAtUnixMs</strong>:{" "}
                {state.snapshot.generatedAtUnixMs}
              </li>
              <li>
                <strong>productionReady</strong>:{" "}
                {String(state.snapshot.productionReady)} —{" "}
                {t("controlCenter.shell.productionNotReady")}
              </li>
              <li>
                <strong>bridgeReadinessLabel</strong>:{" "}
                {clip(state.snapshot.bridgeReadinessLabel, 200)}{" "}
                <span style={muted}>
                  ({t("controlCenter.shell.bridgeReadinessHint")})
                </span>
              </li>
              <li>
                <strong>scenarioSuiteLabel</strong>:{" "}
                {clip(state.snapshot.scenarioSuiteLabel, 160)}{" "}
                <span style={muted}>
                  ({t("controlCenter.shell.scenarioSuiteHint")})
                </span>
              </li>
              <li>
                <strong>{t("controlCenter.shell.controlledPilotLabel")}</strong>{" "}
                <span style={muted}>
                  ({t("controlCenter.shell.controlledPilotHint")})
                </span>
                {": "}
                {state.snapshot.controlledPilotPreflightStatus} ·
                controlledPilotCanRunOnceMeta=
                {String(state.snapshot.controlledPilotCanRunOnceMeta)}{" "}
                <span style={muted}>
                  · {t("controlCenter.shell.pilotMetaHint")}
                </span>
              </li>
              <li>
                <strong>{t("controlCenter.shell.realHermesLabel")}</strong>{" "}
                <span style={muted}>
                  ({t("controlCenter.shell.realHermesHint")})
                </span>
                {": "}
                {clip(state.snapshot.realHermesProcessStatus, 120)}
              </li>
              <li>
                <strong>{t("controlCenter.shell.wslWrapperLabel")}</strong>{" "}
                <span style={muted}>
                  ({t("controlCenter.shell.wslWrapperHint")})
                </span>
                {": "}
                {clip(state.snapshot.wsl2WrapperStatusLine, 160)}
              </li>
              <li>
                <strong>wsl2WrapperParameterSummary</strong>{" "}
                <span style={muted}>
                  (registry safe brief — no executable paths)
                </span>
                {": "}
                status=
                {clip(
                  state.snapshot.wsl2WrapperParameterSummary.parameterStatus,
                  48,
                )}{" "}
                · pending=
                {state.snapshot.wsl2WrapperParameterSummary.pendingFieldCount} ·
                confirmed=
                {
                  state.snapshot.wsl2WrapperParameterSummary.confirmedFieldCount
                }{" "}
                · rejected=
                {
                  state.snapshot.wsl2WrapperParameterSummary.rejectedFieldCount
                }{" "}
                · canRunWsl=
                {String(state.snapshot.wsl2WrapperParameterSummary.canRunWsl)}
              </li>
              <li>
                <strong>wsl2HumanValueStatusLine</strong>{" "}
                <span style={muted}>(human value packet — no raw paths)</span>
                {": "}
                {clip(state.snapshot.wsl2HumanValueStatusLine, 160)}
              </li>
              <li>
                <strong>wsl2HumanValuePacketSummary</strong>{" "}
                <span style={muted}>(sysnative_policy=V1 future gate)</span>
                {": "}
                status=
                {clip(
                  state.snapshot.wsl2HumanValuePacketSummary
                    .humanValuePacketStatus,
                  48,
                )}{" "}
                · pending=
                {state.snapshot.wsl2HumanValuePacketSummary.pendingFieldCount} ·
                rejected=
                {
                  state.snapshot.wsl2HumanValuePacketSummary.rejectedFieldCount
                }{" "}
                · policy=
                {clip(
                  state.snapshot.wsl2HumanValuePacketSummary.sysnativePolicy,
                  48,
                )}
              </li>
              <li>
                <strong>wsl2LocalValueValidationSummary</strong>{" "}
                <span style={muted}>(local-only validator — counts only)</span>
                {": "}
                decision=
                {clip(
                  state.snapshot.wsl2LocalValueValidationSummary.decision,
                  24,
                )}{" "}
                · status=
                {clip(
                  state.snapshot.wsl2LocalValueValidationSummary
                    .validationStatus,
                  80,
                )}{" "}
                · present=
                {
                  state.snapshot.wsl2LocalValueValidationSummary
                    .presentFieldCount
                }{" "}
                · missing=
                {
                  state.snapshot.wsl2LocalValueValidationSummary
                    .missingFieldCount
                }{" "}
                · placeholder=
                {
                  state.snapshot.wsl2LocalValueValidationSummary
                    .placeholderFieldCount
                }{" "}
                · rejected=
                {
                  state.snapshot.wsl2LocalValueValidationSummary
                    .rejectedFieldCount
                }{" "}
                · canRunWsl=
                {String(
                  state.snapshot.wsl2LocalValueValidationSummary.canRunWsl,
                )}
              </li>
              {state.snapshot.wsl2LocalValueValidationSummary
                .selectedDistroAvailabilitySummary ? (
                <li>
                  <strong>wsl2SelectedDistroAvailability</strong>{" "}
                  <span style={muted}>
                    (slot-only status — no distro/user/path)
                  </span>
                  {": "}slot=
                  {clip(
                    state.snapshot.wsl2LocalValueValidationSummary
                      .selectedDistroAvailabilitySummary.selectedSlot,
                    16,
                  )}{" "}
                  · availability=
                  {clip(
                    state.snapshot.wsl2LocalValueValidationSummary
                      .selectedDistroAvailabilitySummary.availability,
                    24,
                  )}{" "}
                  · inventoryCountComparison=
                  {clip(
                    state.snapshot.wsl2LocalValueValidationSummary
                      .selectedDistroAvailabilitySummary
                      .inventoryCountComparison,
                    48,
                  )}{" "}
                  · unixUserDiscovery=
                  {clip(
                    state.snapshot.wsl2LocalValueValidationSummary
                      .selectedDistroAvailabilitySummary.unixUserDiscovery,
                    32,
                  )}{" "}
                  · alternate=
                  {clip(
                    state.snapshot.wsl2LocalValueValidationSummary
                      .selectedDistroAvailabilitySummary
                      .alternateUnixUserDiscovery,
                    32,
                  )}{" "}
                  · failureCategory=
                  {clip(
                    state.snapshot.wsl2LocalValueValidationSummary
                      .selectedDistroAvailabilitySummary.failureCategory,
                    80,
                  )}{" "}
                  ﾂｷ localJsonUpdatedForDistroUserWrapper=
                  {String(
                    state.snapshot.wsl2LocalValueValidationSummary
                      .selectedDistroAvailabilitySummary
                      .localJsonUpdatedForDistroUserWrapper,
                  )}{" "}
                  ﾂｷ nextRequiredAction=
                  {clip(
                    state.snapshot.wsl2LocalValueValidationSummary
                      .selectedDistroAvailabilitySummary
                      .nextRequiredHumanAction,
                    120,
                  )}{" "}
                  ﾂｷ selected slot failed; choose another slot required ﾂｷ
                  beginnerSummary=slot count comparison is not a full content
                  match; decision remains HOLD; execution remains disabled{" "}
                  rawValuesReported=
                  {String(
                    state.snapshot.wsl2LocalValueValidationSummary
                      .selectedDistroAvailabilitySummary.rawValuesReported,
                  )}{" "}
                  ﾂｷ Execution=disabled
                </li>
              ) : null}
              {state.snapshot.wsl2LocalValueValidationSummary
                .slotInventoryRefreshSummary ? (
                <li>
                  <strong>wsl2CurrentSlotInventory</strong>{" "}
                  <span style={muted}>
                    (slot IDs only — raw distro names hidden)
                  </span>
                  {": "}status=
                  {clip(
                    state.snapshot.wsl2LocalValueValidationSummary
                      .slotInventoryRefreshSummary.distroDiscoveryStatus,
                    32,
                  )}{" "}
                  ﾂｷ count=
                  {
                    state.snapshot.wsl2LocalValueValidationSummary
                      .slotInventoryRefreshSummary.distroCount
                  }{" "}
                  ﾂｷ selectableSlots=
                  {clip(
                    state.snapshot.wsl2LocalValueValidationSummary.slotInventoryRefreshSummary.selectableSlots.join(
                      ", ",
                    ),
                    80,
                  )}{" "}
                  ﾂｷ selectedSlot=
                  {clip(
                    state.snapshot.wsl2LocalValueValidationSummary
                      .slotInventoryRefreshSummary.selectedSlot,
                    16,
                  )}{" "}
                  ﾂｷ availability=
                  {clip(
                    state.snapshot.wsl2LocalValueValidationSummary
                      .slotInventoryRefreshSummary.selectedAvailability ??
                      "pending",
                    24,
                  )}{" "}
                  ﾂｷ failureReason=
                  {clip(
                    state.snapshot.wsl2LocalValueValidationSummary
                      .slotInventoryRefreshSummary.selectedFailureReason ??
                      "pending",
                    80,
                  )}{" "}
                  ﾂｷ legacyInventoryConsistencyHidden; countConsistency=
                  {clip(
                    state.snapshot.wsl2LocalValueValidationSummary
                      .slotInventoryRefreshSummary.inventoryCountConsistency ??
                      "unknown",
                    32,
                  )}{" "}
                  ﾂｷ countConsistency=
                  {clip(
                    state.snapshot.wsl2LocalValueValidationSummary
                      .slotInventoryRefreshSummary.inventoryCountConsistency ??
                      "unknown",
                    32,
                  )}{" "}
                  ﾂｷ contentConsistency=
                  {clip(
                    state.snapshot.wsl2LocalValueValidationSummary
                      .slotInventoryRefreshSummary
                      .inventoryContentConsistency ?? "unknown",
                    32,
                  )}{" "}
                  ﾂｷ slotStatuses=
                  {clip(
                    state.snapshot.wsl2LocalValueValidationSummary.slotInventoryRefreshSummary.slotStatuses
                      ?.map((slot) => `${slot.slotId}:${slot.status}`)
                      .join(", ") ?? "unknown",
                    120,
                  )}{" "}
                  ﾂｷ previousSelectedSlot=
                  {clip(
                    state.snapshot.wsl2LocalValueValidationSummary
                      .slotInventoryRefreshSummary.previousSelectedSlot,
                    16,
                  )}{" "}
                  ﾂｷ previousReason=
                  {clip(
                    state.snapshot.wsl2LocalValueValidationSummary
                      .slotInventoryRefreshSummary.previousFailureReason,
                    80,
                  )}{" "}
                  ﾂｷ nextRequiredAction=
                  {clip(
                    state.snapshot.wsl2LocalValueValidationSummary
                      .slotInventoryRefreshSummary.nextRequiredHumanAction,
                    80,
                  )}{" "}
                  ﾂｷ selected slot failed before launch; slot count matches but
                  selected slot does not match current WSL inventory ﾂｷ decision
                  remains HOLD ﾂｷ execution remains disabled ﾂｷ{" "}
                  {RAW_VALUES_HIDDEN_LABEL}
                </li>
              ) : null}
            </ul>
          </section>

          {state.snapshot.blockers.length > 0 && (
            <section style={cardStyle}>
              <h2 style={{ fontSize: 14, margin: "0 0 8px" }}>
                {t("controlCenter.shell.blockers")}
              </h2>
              <ul style={{ fontSize: 12, paddingLeft: 18, margin: 0 }}>
                {state.snapshot.blockers.map((b) => (
                  <li key={`${b.code}-${b.message.slice(0, 20)}`}>
                    [{clip(b.code, 40)}] {clip(b.message, 180)}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {state.snapshot.warnings.length > 0 && (
            <section style={cardStyle}>
              <h2 style={{ fontSize: 14, margin: "0 0 8px" }}>
                {t("controlCenter.shell.warnings")}
              </h2>
              <ul style={{ fontSize: 12, paddingLeft: 18, margin: 0 }}>
                {state.snapshot.warnings.map((w) => (
                  <li key={`${w.code}-${w.message.slice(0, 20)}`}>
                    [{clip(w.code, 40)}] {clip(w.message, 180)}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section style={cardStyle}>
            <h2 style={{ fontSize: 14, margin: "0 0 10px" }}>
              {t("controlCenter.shell.rooms")}
            </h2>
            {state.snapshot.rooms.rooms.map((room) => (
              <div
                key={room.id}
                style={{
                  borderTop: "1px solid #30363d",
                  paddingTop: 10,
                  marginTop: 10,
                }}
              >
                <h3
                  style={{ fontSize: 13, margin: "0 0 4px", color: "#d2a8ff" }}
                >
                  {room.title}
                </h3>
                <p style={{ ...muted, margin: "0 0 8px" }}>
                  {clip(room.statusLine, 220)}
                </p>
                <div style={{ fontSize: 11, color: "#8b949e" }}>
                  {t("controlCenter.shell.roomActions")}
                </div>
                <ul
                  style={{ listStyle: "none", padding: 0, margin: "6px 0 0" }}
                >
                  {room.actions.map((a) => (
                    <li key={a.id} style={{ marginBottom: 6 }}>
                      <button
                        type="button"
                        disabled
                        title={a.disabledReason}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "6px 10px",
                          borderRadius: 4,
                          border: "1px solid #30363d",
                          background: "#0d1117",
                          color: "#6e7681",
                          cursor: "not-allowed",
                          fontSize: 12,
                        }}
                      >
                        {a.label}
                        <span style={{ display: "block", ...muted }}>
                          {clip(a.disabledReason, 200)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section style={cardStyle}>
            <h2 style={{ fontSize: 14, margin: "0 0 8px" }}>
              {t("controlCenter.shell.agentTeam")}
            </h2>
            <p style={{ fontSize: 12 }}>
              {t("controlCenter.shell.scheduler")}:{" "}
              {state.snapshot.agentTeamSummary.schedulerEnabled
                ? t("controlCenter.shell.schedulerUnexpected")
                : t("controlCenter.shell.schedulerOff")}
              {" · "}
              blockers≈{state.snapshot.agentTeamSummary.blockerCountApprox}{" "}
              warnings≈{state.snapshot.agentTeamSummary.warningCountApprox}
            </p>
            <p style={{ ...muted, margin: "6px 0 0", fontSize: 11 }}>
              {t("controlCenter.shell.schedulerHint")}
            </p>
            <ul style={{ fontSize: 11, paddingLeft: 16, margin: "8px 0 0" }}>
              {state.snapshot.agentTeamSummary.agents.slice(0, 12).map((ag) => (
                <li key={ag.id}>
                  {clip(ag.labelJa, 80)} ({ag.id})
                </li>
              ))}
            </ul>
          </section>

          <section style={cardStyle}>
            <h2 style={{ fontSize: 14, margin: "0 0 8px" }}>
              {t("controlCenter.shell.visualization")}
            </h2>
            <p style={{ fontSize: 12 }}>
              nodes≈{state.snapshot.visualizationModel.nodeCount}
            </p>
            <p style={{ ...muted, margin: "6px 0 0" }}>
              {clip(state.snapshot.visualizationModel.footerNote, 200)}
            </p>
          </section>

          <section style={cardStyle}>
            <h2 style={{ fontSize: 14, margin: "0 0 8px" }}>
              {t("controlCenter.shell.approvalAudit")}
            </h2>
            <p style={{ fontSize: 12 }}>
              approval≈
              {state.snapshot.approvalAuditSummary.approvalQueueApproxCount ??
                "—"}{" "}
              · audit≈
              {state.snapshot.approvalAuditSummary.auditApproxCount ?? "—"}
            </p>
            <div style={{ ...muted, marginTop: 6 }}>
              {t("controlCenter.shell.hints")}
            </div>
            <ul style={{ fontSize: 11, paddingLeft: 16, margin: "4px 0 0" }}>
              {state.snapshot.approvalAuditSummary.latestShortStatusHints.map(
                (h, i) => (
                  <li key={`${i}-${h.slice(0, 24)}`}>{clip(h, 120)}</li>
                ),
              )}
            </ul>
          </section>

          <section style={cardStyle}>
            <h2 style={{ fontSize: 14, margin: "0 0 8px" }}>
              {t("controlCenter.shell.memory")}
            </h2>
            <p style={{ fontSize: 12 }}>
              candidates≈{state.snapshot.memorySummary.candidateApproxCount}
            </p>
            <ul style={{ fontSize: 11, paddingLeft: 16, margin: "6px 0 0" }}>
              {state.snapshot.memorySummary.safeSummaryLines.map((line, i) => (
                <li key={`${i}-${line.slice(0, 40)}`}>{clip(line, 200)}</li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
