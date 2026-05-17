/**
 * QueuePage — Approval Queue display-only.
 * Approve/Hold/Reject labels are copy-label actions only.
 * No automated execution from UI.
 */

import type { UIApprovalQueueItem } from "../../types/service-contracts";

interface QueuePageProps {
  readonly items: readonly UIApprovalQueueItem[];
  readonly onCopySummary: (id: string) => void;
  readonly stale?: boolean;
  readonly lang?: "ja" | "en";
}

const RISK_COLOR: Record<string, string> = {
  low: "var(--pass, #16a34a)",
  medium: "var(--hold, #d97706)",
  high: "var(--stop, #dc2626)",
};

export function QueuePage({
  items,
  onCopySummary,
  stale = false,
  lang = "ja",
}: QueuePageProps) {
  return (
    <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <p style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, letterSpacing: 2, color: "var(--ink3, #9ca3af)", margin: 0 }}>
          {lang === "ja" ? "承認待ち · QUEUE" : "APPROVAL QUEUE"}
        </p>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "var(--ink3, #9ca3af)" }}>
          DISPLAY_ONLY
        </span>
      </div>

      {stale && (
        <div style={{ padding: "6px 12px", background: "var(--hold-soft, #fef3c7)", border: "1px solid var(--hold, #d97706)", borderRadius: 3, fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "var(--hold, #d97706)" }}>
          STALE
        </div>
      )}

      {items.length === 0 ? (
        <p style={{ fontFamily: '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif', fontSize: 13, color: "var(--ink3, #9ca3af)", textAlign: "center", padding: "40px 0" }}>
          {lang === "ja" ? "承認待ち項目はありません" : "No items in queue"}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((item) => (
            <div key={item.id} style={{ padding: "12px 14px", background: "var(--paper2, #f3f4f6)", border: "1px solid var(--rule, #e5e7eb)", borderRadius: 4 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                  <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: RISK_COLOR[item.riskLevel] ?? "var(--ink3)", border: `1px solid ${RISK_COLOR[item.riskLevel] ?? "var(--ink3)"}`, padding: "1px 5px", borderRadius: 2, flexShrink: 0 }}>
                    {item.riskLevel.toUpperCase()}
                  </span>
                  <span style={{ fontFamily: '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif', fontSize: 12, color: "var(--ink, #111827)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                    {item.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onCopySummary(item.id)}
                  aria-label={lang === "ja" ? "承認記録をコピー" : "Copy approval record"}
                  style={{ padding: "4px 10px", fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 11, color: "var(--ink, #111827)", background: "var(--paper, #ffffff)", border: "1px solid var(--rule, #e5e7eb)", borderRadius: 3, cursor: "pointer", flexShrink: 0, marginLeft: 8 }}
                >
                  {lang === "ja" ? "コピー" : "Copy"}
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "var(--ink3, #9ca3af)" }}>
                  {item.statusLabel}
                </span>
                <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 9, color: "var(--ink3, #9ca3af)", border: "1px solid var(--rule, #e5e7eb)", padding: "0 4px", borderRadius: 2 }}>
                  DISPLAY_ONLY
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
