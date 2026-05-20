/**
 * HumanGateStatusPanel (AT-10) — Level 5 gate status display.
 * Shows current HOLD / IMPLEMENTED / PASS state of all active Level 5 gates.
 * Display-only. No execution. No external actions. No buttons that trigger real operations.
 * Design spec: FUTURE_GATE_REGISTRY.md — Level 4/5 Transition Gates section.
 */

interface GateRow {
  readonly id: string;
  readonly label: string;
  readonly status: "HOLD" | "IPC_IMPL" | "PASS" | "REJECT";
  readonly detail: string;
  readonly goRequired: string;
}

const LEVEL5_GATES: readonly GateRow[] = [
  {
    id: "L5-OB-01",
    label: "Obsidian local write",
    status: "IPC_IMPL",
    detail: "OB01_DRY_RUN=true",
    goRequired: "ob01_local_write_go",
  },
  {
    id: "L5-DIS-01",
    label: "Discord read-only intake",
    status: "IPC_IMPL",
    detail: "DIS01_HOLD=true",
    goRequired: "dis01_read_only_go",
  },
  {
    id: "L5-DIS-03",
    label: "Discord one-shot reply",
    status: "HOLD",
    detail: "send handler not implemented",
    goRequired: "dis03_reply_go",
  },
  {
    id: "L5-XS-AUTO",
    label: "XS-AUTO read-only patrol",
    status: "HOLD",
    detail: "display-only UI only",
    goRequired: "xs_auto_read_go",
  },
  {
    id: "L5-HB-01",
    label: "Hermes / WSL connection",
    status: "HOLD",
    detail: "bridge code exists, pilot=HOLD",
    goRequired: "hb01_hermes_wsl_go",
  },
  {
    id: "L5-CC-03",
    label: "Command Chat one-shot send",
    status: "HOLD",
    detail: "display-only, onSend not wired",
    goRequired: "cc03_real_send_go",
  },
  {
    id: "L5-XACC-R",
    label: "X account read-only OAuth",
    status: "HOLD",
    detail: "design docs only",
    goRequired: "xacc01_read_only_auth_go",
  },
  {
    id: "L5-XACC-W",
    label: "X write / post / reply",
    status: "HOLD",
    detail: "XACC-01 must pass first",
    goRequired: "xacc_write_go",
  },
  {
    id: "L5-SC-DISP",
    label: "StackChan display-only",
    status: "HOLD",
    detail: "SC-FACE-01 confirmation pending",
    goRequired: "stackchan_display_go",
  },
  {
    id: "L5-SC-PHYS",
    label: "StackChan physical / motion",
    status: "HOLD",
    detail: "requires SC-DISP first",
    goRequired: "stackchan_motion_go",
  },
  {
    id: "L5-PROD",
    label: "productionReady: true",
    status: "HOLD",
    detail: "all L5 gates must pass first",
    goRequired: "productionReady_go (Critical)",
  },
  {
    id: "L5-EXEC",
    label: "execution: enabled",
    status: "HOLD",
    detail: "productionReady must be true first",
    goRequired: "execution_go (Critical)",
  },
];

function statusColor(status: GateRow["status"]): string {
  switch (status) {
    case "PASS":    return "#3fb950";
    case "IPC_IMPL": return "#58a6ff";
    case "HOLD":    return "#f0883e";
    case "REJECT":  return "#f85149";
  }
}

function statusLabel(status: GateRow["status"]): string {
  switch (status) {
    case "IPC_IMPL": return "IPC IMPL";
    default: return status;
  }
}

interface HumanGateStatusPanelProps {
  readonly lang?: "ja" | "en";
}

export function HumanGateStatusPanel({ lang = "ja" }: HumanGateStatusPanelProps): React.JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, marginTop: 16 }}>
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          flexWrap: "wrap" as const,
          borderBottom: "1px solid #21262d",
          paddingBottom: 8,
        }}
      >
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 12, fontWeight: 700, color: "#c9d1d9" }}>
          {lang === "ja" ? "Level 5 ゲート状態 · AT-10" : "Level 5 Gate Status · AT-10"}
        </span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#f0883e", border: "1px solid #f0883e44", borderRadius: 2, padding: "2px 6px" }}>
            display-only
          </span>
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#6e7681", border: "1px solid #6e768144", borderRadius: 2, padding: "2px 6px" }}>
            no execution
          </span>
        </div>
      </div>

      {/* Runaway guard strip */}
      <div
        style={{
          background: "#0d2119",
          border: "1px solid #3fb95033",
          borderRadius: 4,
          padding: "8px 14px",
          display: "flex",
          flexWrap: "wrap" as const,
          gap: 10,
        }}
      >
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, fontWeight: 700, color: "#3fb950" }}>
          {lang === "ja" ? "暴走ガード" : "Runaway Guard"}
        </span>
        {[
          { k: "OB01_DRY_RUN", v: "true" },
          { k: "DIS01_HOLD", v: "true" },
          { k: "productionReady", v: "false" },
          { k: "execution", v: "disabled" },
          { k: "rawValuesReported", v: "false" },
        ].map(({ k, v }) => (
          <span key={k} style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10 }}>
            <span style={{ color: "#8b949e" }}>{k}: </span>
            <span style={{ color: "#3fb950" }}>{v}</span>
          </span>
        ))}
      </div>

      {/* Gate table */}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 3 }}>
        {LEVEL5_GATES.map((gate) => (
          <div
            key={gate.id}
            style={{
              background: "#161b22",
              border: "1px solid #21262d",
              borderRadius: 3,
              padding: "6px 12px",
              display: "grid",
              gridTemplateColumns: "80px 1fr 90px",
              gap: 8,
              alignItems: "center",
            }}
          >
            <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 9, color: "#6e7681" }}>
              {gate.id}
            </span>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 1 }}>
              <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#c9d1d9" }}>
                {gate.label}
              </span>
              <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 9, color: "#6e7681" }}>
                {gate.detail}
              </span>
            </div>
            <span
              style={{
                fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                fontSize: 10,
                color: statusColor(gate.status),
                textAlign: "right" as const,
              }}
            >
              {statusLabel(gate.status)}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ background: "#161b22", border: "1px solid #6e768133", borderRadius: 4, padding: "8px 12px" }}>
        <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 11, color: "#8b949e", lineHeight: 1.5 }}>
          {lang === "ja"
            ? "AIは作るところまで。鍵と発射ボタンは人間。各ゲートは個別の human GO が必要です。"
            : "AI builds up to the gate. Human holds the key and the launch button. Each gate requires individual human GO."}
        </span>
      </div>
    </div>
  );
}
