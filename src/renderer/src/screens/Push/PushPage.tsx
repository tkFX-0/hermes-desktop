/**
 * PushPage — Push readiness display-only.
 * The UI NEVER triggers git push. This is display and copy only.
 * pushGoReceived shows whether a human GO has been received externally.
 */

import type { PushReadinessData } from "../../types/service-contracts";

interface PushPageProps {
  readonly data: PushReadinessData;
  readonly onCopySummary: () => void;
  readonly lang?: "ja" | "en";
}

const PUSH_NOTE = {
  ja: "pushはClaudeCodeのGOから行います。このページはpush準備状態の表示のみです。",
  en: "Push is performed via ClaudeCode GO. This page shows push readiness only.",
} as const;

export function PushPage({ data, onCopySummary, lang = "ja" }: PushPageProps) {
  const isClean = data.commitsAhead === 0 && data.staged === 0 && data.trackedDirty === 0;

  return (
    <div style={{ padding: "var(--page-pd-v, 18px) var(--page-pd-h, 22px)", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <p style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, letterSpacing: 2, color: "var(--ink3, #9ca3af)", margin: 0 }}>
          PUSH
        </p>
        {data.stale && (
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "var(--hold, #d97706)", border: "1px solid var(--hold, #d97706)", padding: "1px 5px", borderRadius: 2 }}>
            STALE
          </span>
        )}
      </div>

      {/* Safety note */}
      <div style={{ padding: "8px 12px", background: "var(--paper2, #f3f4f6)", border: "1px solid var(--rule, #e5e7eb)", borderRadius: 3 }}>
        <p style={{ fontFamily: lang === "en" ? '"IBM Plex Sans", "Inter", system-ui, sans-serif' : '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif', fontSize: 11, color: "var(--ink2, #374151)", margin: 0 }}>
          {PUSH_NOTE[lang]}
        </p>
      </div>

      {/* Readiness summary */}
      <div style={{ padding: "14px", background: isClean ? "var(--pass-soft, #dcfce7)" : "var(--hold-soft, #fef3c7)", border: `1px solid ${isClean ? "var(--pass, #16a34a)" : "var(--hold, #d97706)"}`, borderRadius: 4 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { label: "branch", value: data.branch },
            { label: "commits_ahead", value: String(data.commitsAhead), warn: data.commitsAhead > 0 },
            { label: "staged", value: String(data.staged), warn: data.staged > 0 },
            { label: "tracked_dirty", value: String(data.trackedDirty), warn: data.trackedDirty > 0 },
            { label: "push_go_received", value: String(data.pushGoReceived) },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 11, color: "var(--ink3, #9ca3af)", minWidth: 120 }}>
                {row.label}:
              </span>
              <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 11, fontWeight: 600, color: row.warn ? "var(--hold, #d97706)" : isClean ? "var(--pass, #16a34a)" : "var(--ink, #111827)" }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Copy summary */}
      <button
        type="button"
        onClick={onCopySummary}
        aria-label={lang === "ja" ? "push準備状況をコピー" : "Copy push readiness summary"}
        style={{ padding: "8px 16px", fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 12, color: "var(--ink, #111827)", background: "var(--paper2, #f3f4f6)", border: "1px solid var(--rule, #e5e7eb)", borderRadius: 4, cursor: "pointer", alignSelf: "flex-start" }}
      >
        {lang === "ja" ? "push準備状況をコピー" : "Copy push readiness summary"}
      </button>
    </div>
  );
}
