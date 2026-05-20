/**
 * DiscordDraftPanel (DIS-02) — local draft response preparation.
 * Drafts are local only. No Discord write. No send button.
 * DIS-03 GO required to actually send any message.
 * Design spec: DIS_02_DISCORD_DRAFT_RESPONSE_PLAN.md
 */

import { useState } from "react";
import type { Dis02Draft, Dis02Classification } from "../../types/discord-draft-types";

// Example drafts based on DIS-01 intake (2026-05-21 one-shot read)
const EXAMPLE_DRAFTS: readonly Dis02Draft[] = [
  {
    messageId: "dis01-read-2026-05-21",
    authorName: "Itsukishima",
    contentPreview: "ヘルメス：合格候補 1件 (7候補中) attack20k_pkg_floor0_cond40b5_.. min 31,469 / med 43,201 JPY 8run",
    timestamp: "2026-04-30T11:23",
    userRequestSummary: "EA バックテスト結果の定期報告。合格候補1件、最良候補の成績サマリー。",
    shikishimaResponseDraft: "了解です。合格候補 1件 確認しました。attack20k_pkg_floor0 系が最良候補として継続中ですね。引き続き監視します。",
    classification: "GO",
    level5Detected: false,
    level5Description: "none",
    requiredHumanConfirmation: [],
    forbiddenActionsDetected: false,
    nextGate: "DIS-03 reply GO (optional — not required for monitoring)",
  },
];

function classColor(c: Dis02Classification): string {
  switch (c) {
    case "GO":    return "#3fb950";
    case "HOLD":  return "#f0883e";
    case "DEFER": return "#6e7681";
  }
}

interface CopyState { id: string; phase: "idle" | "copied" }

interface DiscordDraftPanelProps {
  readonly lang?: "ja" | "en";
}

export function DiscordDraftPanel({ lang = "ja" }: DiscordDraftPanelProps): React.JSX.Element {
  const [copyState, setCopyState] = useState<CopyState>({ id: "", phase: "idle" });

  function handleCopy(draft: Dis02Draft): void {
    const text = [
      `[DIS-02 draft — local only]`,
      `summary: ${draft.userRequestSummary}`,
      `draft: ${draft.shikishimaResponseDraft}`,
      `classification: ${draft.classification}`,
      `level5: ${draft.level5Detected ? draft.level5Description : "none"}`,
      `next_gate: ${draft.nextGate}`,
    ].join("\n");
    void navigator.clipboard.writeText(text).then(() => {
      setCopyState({ id: draft.messageId, phase: "copied" });
      setTimeout(() => setCopyState({ id: "", phase: "idle" }), 2000);
    });
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
          {lang === "ja" ? "Discord 下書き · DIS-02" : "Discord Draft · DIS-02"}
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#58a6ff", border: "1px solid #58a6ff44", borderRadius: 2, padding: "2px 6px" }}>
            local only
          </span>
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#f85149", border: "1px solid #f8514944", borderRadius: 2, padding: "2px 6px" }}>
            no send
          </span>
        </div>
      </div>

      {/* Status strip */}
      <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 4, padding: "8px 14px", display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
        {[
          { k: "discord_write", v: "none", c: "#3fb950" },
          { k: "send_button", v: "absent", c: "#3fb950" },
          { k: "draft_local", v: "true", c: "#58a6ff" },
          { k: "dis03_required", v: "to send", c: "#f0883e" },
        ].map(({ k, v, c }) => (
          <span key={k} style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10 }}>
            <span style={{ color: "#8b949e" }}>{k}: </span>
            <span style={{ color: c }}>{v}</span>
          </span>
        ))}
      </div>

      {/* Draft list */}
      {EXAMPLE_DRAFTS.map((draft) => (
        <div
          key={draft.messageId}
          style={{
            background: "#161b22",
            border: "1px solid #21262d",
            borderRadius: 4,
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column" as const,
            gap: 8,
          }}
        >
          {/* Message header */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const }}>
            <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#58a6ff" }}>{draft.authorName}</span>
            <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 9, color: "#6e7681" }}>{draft.timestamp}</span>
            <span style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 9,
              color: classColor(draft.classification),
              border: `1px solid ${classColor(draft.classification)}44`,
              borderRadius: 2,
              padding: "1px 5px",
            }}>
              {draft.classification}
            </span>
            {draft.level5Detected && (
              <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 9, color: "#f85149", border: "1px solid #f8514944", borderRadius: 2, padding: "1px 5px" }}>
                L5 DETECTED
              </span>
            )}
          </div>

          {/* Intake content */}
          <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 3, padding: "5px 10px" }}>
            <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 9, color: "#6e7681" }}>intake: </span>
            <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 10, color: "#8b949e" }}>{draft.contentPreview}</span>
          </div>

          {/* Summary */}
          <div>
            <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 9, color: "#6e7681", display: "block", marginBottom: 2 }}>summary:</span>
            <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 11, color: "#c9d1d9" }}>{draft.userRequestSummary}</span>
          </div>

          {/* Draft */}
          <div style={{ background: "#0d2119", border: "1px solid #3fb95033", borderRadius: 3, padding: "8px 10px" }}>
            <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 9, color: "#3fb950", display: "block", marginBottom: 3 }}>
              {lang === "ja" ? "下書き (local only):" : "draft (local only):"}
            </span>
            <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 11, color: "#c9d1d9", lineHeight: 1.5 }}>
              {draft.shikishimaResponseDraft}
            </span>
          </div>

          {/* Next gate + copy button */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 6 }}>
            <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 9, color: "#6e7681" }}>
              next: {draft.nextGate}
            </span>
            <button
              onClick={() => handleCopy(draft)}
              style={{
                fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                fontSize: 10,
                color: copyState.id === draft.messageId && copyState.phase === "copied" ? "#3fb950" : "#8b949e",
                background: "#0d1117",
                border: "1px solid #30363d",
                borderRadius: 3,
                padding: "3px 10px",
                cursor: "pointer",
              }}
            >
              {copyState.id === draft.messageId && copyState.phase === "copied"
                ? (lang === "ja" ? "コピー済み" : "Copied")
                : (lang === "ja" ? "下書きをコピー" : "Copy Draft")}
            </button>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div style={{ background: "#161b22", border: "1px solid #6e768133", borderRadius: 4, padding: "8px 12px" }}>
        <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 11, color: "#8b949e", lineHeight: 1.5 }}>
          {lang === "ja"
            ? "下書きはローカルのみ。Discord への送信には DIS-03 GO が必要です。送信・返信・DM ボタンはありません。"
            : "Drafts are local only. Sending to Discord requires DIS-03 GO. No send / reply / DM buttons."}
        </span>
      </div>
    </div>
  );
}
