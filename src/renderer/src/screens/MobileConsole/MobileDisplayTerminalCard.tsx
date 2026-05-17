import type {
  DisplayExpressionState,
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
  color: "#a371f7",
  marginBottom: 8,
};

const muted: React.CSSProperties = { color: "#8b949e", fontSize: 12 };

const expressionColor: Record<DisplayExpressionState, string> = {
  neutral: "#8b949e",
  listening: "#58a6ff",
  thinking: "#d29922",
  holding: "#a371f7",
  caution: "#fb923c",
  rejected: "#f85149",
  review_ready: "#58a6ff",
  pass: "#3fb950",
  pass_with_caveat: "#d29922",
  push_waiting: "#d29922",
  runtime_running: "#58a6ff",
  stop: "#f85149",
  sleepy: "#8b949e",
};

function faceGlyph(state: DisplayExpressionState): string {
  switch (state) {
    case "stop":
      return "(X_X)";
    case "pass":
      return "(^_^)";
    case "pass_with_caveat":
      return "(^_^;)";
    case "push_waiting":
      return "(o_o)";
    case "caution":
      return "(! !)";
    case "sleepy":
      return "(-.-)";
    default:
      return "(-_-)";
  }
}

interface Props {
  snapshot: MobileConsoleSnapshot;
}

export default function MobileDisplayTerminalCard({ snapshot }: Props): React.JSX.Element {
  const { displayTerminalPreview: preview, displayTerminalSummary: summary } = snapshot;
  const color = expressionColor[preview.expressionState] ?? "#8b949e";

  return (
    <div>
      <div style={card}>
        <div style={heading}>StackChan / Face Terminal Preview</div>
        <div style={{ ...muted, lineHeight: 1.5 }}>
          Display-only preparation. Physical device not connected. StackChan has not arrived.
          No robot motion, no voice, no camera, no microphone, no execution.
        </div>
      </div>

      <div style={{ ...card, background: "#0d1117", border: `1px solid ${color}66` }}>
        <div
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 36,
            textAlign: "center",
            color,
            background: "#161b22",
            border: "1px solid #30363d",
            borderRadius: 8,
            padding: 18,
            marginBottom: 12,
          }}
        >
          {faceGlyph(preview.expressionState)}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#e6edf3", marginBottom: 6 }}>
          {preview.displayLabel}
        </div>
        <div style={{ fontSize: 12, color: "#c9d1d9", lineHeight: 1.6, marginBottom: 8 }}>
          {preview.displayMessage}
        </div>
        <div style={{ fontSize: 11, color: "#8b949e", lineHeight: 1.5 }}>
          {preview.safetyNote}
        </div>
      </div>

      <div style={{ ...card }}>
        {[
          ["terminal", preview.terminalKind],
          ["connection", preview.connectionState],
          ["expression", preview.expressionState],
          ["device arrival", summary.deviceArrivalStatus],
          ["physical test", summary.physicalTestStatus],
          ["connection attempted", String(summary.connectionAttempted)],
          ["physical operation", String(preview.physicalOperation)],
          ["voice/camera/mic", preview.voiceEnabled || preview.cameraEnabled || preview.microphoneEnabled ? "enabled" : "disabled"],
          ["execution", preview.execution],
          ["productionReady", String(preview.productionReady)],
        ].map(([label, value]) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              padding: "6px 0",
              borderBottom: "1px solid #21262d",
              fontSize: 12,
            }}
          >
            <span style={muted}>{label}</span>
            <span style={{ color: "#c9d1d9", fontFamily: "ui-monospace, monospace", textAlign: "right" }}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
