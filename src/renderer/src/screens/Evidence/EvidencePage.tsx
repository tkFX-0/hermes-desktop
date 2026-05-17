/**
 * EvidencePage — Evidence records display and copy.
 * Copy-only. No delete or overwrite.
 */

import type { UIEvidenceRecord } from "../../types/service-contracts";

interface EvidencePageProps {
  readonly records: readonly UIEvidenceRecord[];
  readonly onCopy: (id: string) => void;
  readonly stale?: boolean;
  readonly lang?: "ja" | "en";
}

const RESULT_COLOR: Record<string, string> = {
  PASS: "var(--pass, #16a34a)",
  PASS_WITH_CAVEAT: "#9aa72f",
  HOLD: "var(--hold, #d97706)",
  REJECT: "var(--reject, #991b1b)",
};

export function EvidencePage({
  records,
  onCopy,
  stale = false,
  lang = "ja",
}: EvidencePageProps) {
  return (
    <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <p style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, letterSpacing: 2, color: "var(--ink3, #9ca3af)", margin: 0 }}>
          {lang === "ja" ? "証跡 · EVIDENCE" : "EVIDENCE"}
        </p>
        {stale && (
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "var(--hold, #d97706)", border: "1px solid var(--hold, #d97706)", padding: "1px 5px", borderRadius: 2 }}>
            STALE
          </span>
        )}
      </div>

      {records.length === 0 ? (
        <p style={{ fontFamily: '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif', fontSize: 13, color: "var(--ink3, #9ca3af)", textAlign: "center", padding: "40px 0" }}>
          {lang === "ja" ? "証跡はありません" : "No evidence records"}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {records.map((rec) => {
            const color = RESULT_COLOR[rec.result] ?? "var(--ink3, #6b7280)";
            return (
              <div key={rec.id} style={{ padding: "12px 14px", background: "var(--paper2, #f3f4f6)", border: "1px solid var(--rule, #e5e7eb)", borderLeft: `3px solid ${color}`, borderRadius: "0 4px 4px 0" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 11, fontWeight: 700, color }}>
                      {rec.result}
                    </span>
                    <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "var(--ink3, #9ca3af)" }}>
                      {rec.gate}
                    </span>
                    <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "var(--ink3, #9ca3af)" }}>
                      {rec.dateLabel}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCopy(rec.id)}
                    aria-label={`${lang === "ja" ? "証跡をコピー" : "Copy evidence"}: ${rec.gate}`}
                    style={{ padding: "3px 8px", fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 10, color: "var(--ink, #111827)", background: "var(--paper, #ffffff)", border: "1px solid var(--rule, #e5e7eb)", borderRadius: 3, cursor: "pointer" }}
                  >
                    {lang === "ja" ? "コピー" : "Copy"}
                  </button>
                </div>
                {rec.summaryLines.length > 0 && (
                  <ul style={{ margin: 0, padding: "0 0 0 14px", display: "flex", flexDirection: "column", gap: 2 }}>
                    {rec.summaryLines.map((line, i) => (
                      <li key={i} style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "var(--ink2, #374151)" }}>
                        {line}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
