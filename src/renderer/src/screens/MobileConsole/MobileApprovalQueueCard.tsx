import type {
  ApprovalQueueItem,
  MobileConsoleSnapshot,
} from "../../../../shared/mobile-console";

const card: React.CSSProperties = {
  background: "#161b22",
  border: "1px solid #30363d",
  borderRadius: 8,
  padding: 14,
  marginBottom: 12,
};

const heading: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: "#58a6ff",
  marginBottom: 8,
};

const muted: React.CSSProperties = { color: "#8b949e", fontSize: 12 };

const riskColor: Record<ApprovalQueueItem["riskLevel"], string> = {
  low: "#3fb950",
  medium: "#d29922",
  high: "#fb923c",
  critical: "#f85149",
};

function pill(color: string): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 999,
    padding: "2px 8px",
    background: `${color}18`,
    border: `1px solid ${color}55`,
    color,
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
  };
}

function ApprovalItemCard({ item }: { item: ApprovalQueueItem }): React.JSX.Element {
  const color = riskColor[item.riskLevel] ?? "#8b949e";

  return (
    <div style={{ ...card, background: "#0d1117" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#e6edf3", lineHeight: 1.4 }}>
          {item.title}
        </div>
        <span style={pill("#58a6ff")}>display-only</span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        <span style={pill(color)}>{item.riskLevel}</span>
        <span style={pill("#8b949e")}>{item.decisionState}</span>
        <span style={pill("#a371f7")}>{item.actionKind}</span>
      </div>

      <div style={{ fontSize: 12, color: "#c9d1d9", lineHeight: 1.5, marginBottom: 8 }}>
        {item.summary}
      </div>

      <div style={{ fontSize: 12, color: "#c9d1d9", lineHeight: 1.6 }}>
        <div><span style={muted}>required: </span>{item.requiredHumanAction}</div>
        {item.blockedReason && <div><span style={muted}>blocked: </span>{item.blockedReason}</div>}
        {item.safeNextStep && <div><span style={muted}>next: </span>{item.safeNextStep}</div>}
        {item.evidenceRef && <div><span style={muted}>evidence: </span>{item.evidenceRef}</div>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 10 }}>
        {["Approve inactive", "Hold inactive", "Reject inactive"].map((label) => (
          <button
            key={label}
            type="button"
            disabled
            style={{
              border: "1px solid #30363d",
              background: "#21262d",
              color: "#8b949e",
              borderRadius: 5,
              padding: "6px 4px",
              fontSize: 10,
              cursor: "not-allowed",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface Props {
  snapshot: MobileConsoleSnapshot;
}

export default function MobileApprovalQueueCard({ snapshot }: Props): React.JSX.Element {
  const { approvalQueue, approvalQueueSummary } = snapshot;

  return (
    <div>
      <div style={card}>
        <div style={heading}>Approval Queue</div>
        <div style={{ ...muted, lineHeight: 1.5, marginBottom: 12 }}>
          Human decision guidance only. This panel cannot approve, push, start runtime,
          enable execution, or operate devices.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          {[
            { label: "total", value: approvalQueueSummary.total, color: "#58a6ff" },
            { label: "waiting", value: approvalQueueSummary.waitingHuman, color: "#d29922" },
            { label: "held", value: approvalQueueSummary.held, color: "#a371f7" },
            { label: "critical", value: approvalQueueSummary.critical, color: "#f85149" },
          ].map((item) => (
            <div
              key={item.label}
              style={{ background: "#0d1117", border: `1px solid ${item.color}44`, borderRadius: 6, padding: "8px 6px", textAlign: "center" }}
            >
              <div style={{ color: item.color, fontSize: 18, fontWeight: 700 }}>{item.value}</div>
              <div style={{ color: "#8b949e", fontSize: 10 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {approvalQueue.map((item) => (
        <ApprovalItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
