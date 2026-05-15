import { useState } from "react";

const card: React.CSSProperties = { background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: 14, marginBottom: 12 };
const heading: React.CSSProperties = { fontSize: 15, fontWeight: 600, color: "#d29922", marginBottom: 12 };
const muted: React.CSSProperties = { color: "#8b949e", fontSize: 12 };
const codeBox: React.CSSProperties = {
  background: "#0d1117",
  border: "1px solid #30363d",
  borderRadius: 6,
  padding: 10,
  fontSize: 11,
  fontFamily: "ui-monospace, monospace",
  color: "#c9d1d9",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  marginBottom: 8,
  lineHeight: 1.5,
};

const SESSION_009_GO = `I explicitly approve this one Level B3 daily operation session only.

Approved session:
shikishima-session-2026-05-15-009

Approved time_window:
2026-05-15 HH:MM-HH:MM JST

Approved purpose:
Level B3 clean B3 PASS #5 — iPhone Private Console safe display observation.
Confirm that the iPhone console is visible and does not expose raw values,
secrets, local-only values, unsafe GO labels, execution enabled state,
or productionReady true state.

Hard timing rule:
+30 seconds after approved_window_start

Required pre-run checks:
- branch = main
- commits_ahead = 0
- staged_files = 0
- modified_tracked_files = 0
- raw_values_detected = false

decision: HOLD
execution: disabled
productionReady: false`;

const PUSH_GO = `I explicitly approve git push for the audited commit only.

Approved commit:
[commit_hash] [commit_subject]

Approved command:
git push origin main

Required pre-push state:
- branch = main
- commits_ahead = 1
- staged_files = 0
- tracked_dirty = 0
- docs-only or verified source changes
- no raw values / secrets
- no Level 3 approval
- no productionReady true
- no execution enabled

Forbidden:
- pushing extra commits
- Level 3 / productionReady / execution approval`;

const DRAFTS = [
  { id: "session-009", label: "Session-009 GO テンプレート", text: SESSION_009_GO },
  { id: "push-go", label: "Push GO テンプレート", text: PUSH_GO },
];

export default function MobileGoDrafts(): React.JSX.Element {
  const [copied, setCopied] = useState<string | null>(null);

  function handleCopy(id: string, text: string): void {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <div>
      <div style={{ ...card, background: "#0d1117", border: "1px solid rgba(251,146,60,0.4)" }}>
        <div style={{ fontSize: 12, color: "#fb923c", lineHeight: 1.5 }}>
          ⚠ このGOテキストはコピー専用です。<br />
          このUIから自動実行・自動承認はされません。<br />
          コピー後、ClaudeCodeまたはチャットに貼り付けてください。
        </div>
      </div>

      {DRAFTS.map((d) => (
        <div key={d.id} style={card}>
          <div style={heading}>{d.label}</div>
          <div style={codeBox}>{d.text}</div>
          <button
            type="button"
            onClick={() => handleCopy(d.id, d.text)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 6,
              border: "1px solid #30363d",
              background: copied === d.id ? "#238636" : "#1f6feb",
              color: "#f0f6fc",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {copied === d.id ? "コピー完了 ✓" : "コピー (実行なし)"}
          </button>
        </div>
      ))}

      <div style={{ ...muted, textAlign: "center", padding: "8px 0" }}>
        コピーのみ — 実行なし / 承認なし / pushなし
      </div>
    </div>
  );
}
