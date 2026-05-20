/**
 * WorkerRoutingPanel (AT-11) — worker routing and handoff prompt display.
 * Shows which worker handles which task type, current handoff rules, prompt template.
 * Display-only. No worker execution. No remote control.
 * Design spec: FUTURE_GATE_REGISTRY.md — AT-11
 */

interface RoutingRow {
  readonly worker: string;
  readonly scope: string;
  readonly level: string;
  readonly status: "ACTIVE" | "COPY_ONLY" | "HOLD";
}

const ROUTING_TABLE: readonly RoutingRow[] = [
  { worker: "ClaudeCode", scope: "Implementation, docs, IPC, UI, commits", level: "L1–4", status: "ACTIVE" },
  { worker: "Codex", scope: "Push readiness review, independent code audit", level: "L3–4", status: "COPY_ONLY" },
  { worker: "Human Gate", scope: "L5: push, runtime, OAuth, external send", level: "L5", status: "ACTIVE" },
  { worker: "WK-05 Auto", scope: "Worker auto-execution adapter", level: "L5+", status: "HOLD" },
];

const HANDOFF_TEMPLATE = `handoff:
  from:    [ClaudeCode / Codex / Human]
  to:      [next worker]
  task:    [description]
  state:   [commit hash / doc path]
  blocked: [blocker or none]
  gate:    [required GO or none]`;

function statusColor(s: RoutingRow["status"]): string {
  switch (s) {
    case "ACTIVE":    return "#3fb950";
    case "COPY_ONLY": return "#58a6ff";
    case "HOLD":      return "#f0883e";
  }
}

interface WorkerRoutingPanelProps {
  readonly lang?: "ja" | "en";
}

export function WorkerRoutingPanel({ lang = "ja" }: WorkerRoutingPanelProps): React.JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, marginTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" as const, borderBottom: "1px solid #21262d", paddingBottom: 8 }}>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 12, fontWeight: 700, color: "#c9d1d9" }}>
          {lang === "ja" ? "ワーカー ルーティング · AT-11" : "Worker Routing · AT-11"}
        </span>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#6e7681", border: "1px solid #6e768144", borderRadius: 2, padding: "2px 6px" }}>display-only</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" as const, gap: 3 }}>
        {ROUTING_TABLE.map((row) => (
          <div key={row.worker} style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 3, padding: "7px 12px", display: "grid", gridTemplateColumns: "110px 1fr 56px 72px", gap: 8, alignItems: "center" }}>
            <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#c9d1d9", fontWeight: 600 }}>{row.worker}</span>
            <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 10, color: "#8b949e" }}>{row.scope}</span>
            <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 9, color: "#6e7681", textAlign: "center" as const }}>{row.level}</span>
            <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 9, color: statusColor(row.status), textAlign: "right" as const }}>{row.status}</span>
          </div>
        ))}
      </div>

      <div>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#8b949e", display: "block", marginBottom: 5 }}>
          {lang === "ja" ? "引き継ぎテンプレート" : "Handoff Template"}
        </span>
        <pre style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 9, color: "#6e7681", background: "#161b22", border: "1px solid #21262d", borderRadius: 3, padding: "8px 12px", margin: 0, whiteSpace: "pre-wrap" as const, lineHeight: 1.6 }}>{HANDOFF_TEMPLATE}</pre>
      </div>

      <div style={{ background: "#161b22", border: "1px solid #6e768133", borderRadius: 4, padding: "8px 12px" }}>
        <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 11, color: "#8b949e" }}>
          {lang === "ja" ? "WK-05 自動実行・WK-06 リモート制御はすべて HOLD。" : "WK-05 auto-execution / WK-06 remote control: all HOLD."}
        </span>
      </div>
    </div>
  );
}
