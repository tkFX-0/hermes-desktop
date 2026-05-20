/**
 * DiscordInboxPanel — DIS-01 read-only Discord intake display.
 * Shows channel status and read gate. Actual read requires DIS-01 GO.
 * No send, reply, DM, or post actions. Read-only gate enforced by DIS01_HOLD.
 * Design spec: DIS_01_DISCORD_READ_ONLY_GATE_DESIGN.md
 */

import { useState } from "react";

interface DiscordReadResult {
  dis01Status: "HOLD" | "ACTIVE";
  readCount: number;
  messages?: Array<{
    id: string;
    authorName: string;
    contentPreview: string;
    timestamp: string;
  }>;
  error?: string;
}

type ReadState =
  | { phase: "idle" }
  | { phase: "running" }
  | { phase: "done"; result: DiscordReadResult }
  | { phase: "error"; error: string };

const APPROVED_CHANNEL_ID = "1498670816366428208";

interface DiscordInboxPanelProps {
  readonly lang?: "ja" | "en";
}

export function DiscordInboxPanel({ lang = "ja" }: DiscordInboxPanelProps): React.JSX.Element {
  const [readState, setReadState] = useState<ReadState>({ phase: "idle" });

  async function handleRead(): Promise<void> {
    setReadState({ phase: "running" });
    try {
      const result = await window.hermesAPI.shikishimaDiscordRead(10);
      setReadState({ phase: "done", result });
    } catch (e) {
      setReadState({ phase: "error", error: (e as Error).message });
    }
  }

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
          {lang === "ja" ? "Discord 受信トレイ · DIS-01" : "Discord Inbox · DIS-01"}
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#6e7681", border: "1px solid #6e768144", borderRadius: 2, padding: "2px 6px" }}>
            read-only
          </span>
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#f0883e", border: "1px solid #f0883e44", borderRadius: 2, padding: "2px 6px" }}>
            DIS-01: HOLD
          </span>
        </div>
      </div>

      {/* Channel info */}
      <div
        style={{
          background: "#161b22",
          border: "1px solid #21262d",
          borderRadius: 4,
          padding: "10px 14px",
          display: "flex",
          flexWrap: "wrap" as const,
          gap: 8,
        }}
      >
        {[
          { label: "channel_id", value: APPROVED_CHANNEL_ID, color: "#c9d1d9" },
          { label: "scope", value: "read-only", color: "#3fb950" },
          { label: "send", value: "REJECT", color: "#f85149" },
          { label: "reply", value: "REJECT", color: "#f85149" },
          { label: "DM", value: "REJECT", color: "#f85149" },
          { label: "token", value: "from env / never logged", color: "#8b949e" },
          { label: "dis01_exec", value: "HOLD", color: "#f0883e" },
        ].map(({ label, value, color }) => (
          <span key={label} style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10 }}>
            <span style={{ color: "#8b949e" }}>{label}: </span>
            <span style={{ color }}>{value}</span>
          </span>
        ))}
      </div>

      {/* Read control */}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => void handleRead()}
            disabled={readState.phase === "running"}
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 11,
              color: readState.phase === "running" ? "#6e7681" : "#c9d1d9",
              background: "#161b22",
              border: "1px solid #30363d",
              borderRadius: 4,
              padding: "5px 14px",
              cursor: readState.phase === "running" ? "wait" : "pointer",
            }}
          >
            {readState.phase === "running"
              ? (lang === "ja" ? "確認中..." : "Checking...")
              : (lang === "ja" ? "Read (DIS-01)" : "Read (DIS-01)")}
          </button>
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#6e7681" }}>
            {lang === "ja" ? "実行には DIS-01 GO が必要" : "DIS-01 GO required for execution"}
          </span>
        </div>

        {/* Result display */}
        {readState.phase === "done" && (
          <div
            style={{
              background: "#161b22",
              border: "1px solid #21262d",
              borderRadius: 4,
              padding: "10px 14px",
              display: "flex",
              flexDirection: "column" as const,
              gap: 6,
            }}
          >
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
              <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#8b949e" }}>
                dis01_status: <span style={{ color: readState.result.dis01Status === "HOLD" ? "#f0883e" : "#3fb950" }}>
                  {readState.result.dis01Status}
                </span>
              </span>
              <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#8b949e" }}>
                readCount: <span style={{ color: "#c9d1d9" }}>{readState.result.readCount}</span>
              </span>
              {readState.result.error && (
                <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#f0883e" }}>
                  {readState.result.error}
                </span>
              )}
            </div>
            {readState.result.messages && readState.result.messages.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 4, maxHeight: 200, overflowY: "auto" as const }}>
                {readState.result.messages.map((m) => (
                  <div key={m.id} style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 3, padding: "5px 8px" }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 2 }}>
                      <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#58a6ff" }}>{m.authorName}</span>
                      <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 9, color: "#6e7681" }}>{m.timestamp.slice(0, 16)}</span>
                    </div>
                    <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 11, color: "#8b949e" }}>{m.contentPreview}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {readState.phase === "error" && (
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#f85149" }}>
            error: {readState.error}
          </span>
        )}
      </div>

      {/* Gate notice */}
      <div style={{ background: "#161b22", border: "1px solid #6e768133", borderRadius: 4, padding: "8px 12px" }}>
        <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 11, color: "#8b949e", lineHeight: 1.5 }}>
          {lang === "ja"
            ? "読み取り専用。送信・返信・DM・スレッドへの参加はすべて Level 5。実行には DIS-01 GO が必要です。"
            : "Read-only only. Send, reply, DM, thread join: all Level 5. Execution requires DIS-01 GO."}
        </span>
      </div>
    </div>
  );
}
