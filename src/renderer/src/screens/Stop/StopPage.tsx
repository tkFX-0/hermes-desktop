/**
 * StopPage — STOP event history display.
 * Copy-only. Cannot clear history or resume without human review.
 * Empty history = nominal (good state).
 */

import type { UIStopEvent } from "../../types/service-contracts";

interface StopPageProps {
  readonly events: readonly UIStopEvent[];
  readonly onCopy: (id: string) => void;
  readonly stale?: boolean;
  readonly lang?: "ja" | "en";
}

export function StopPage({
  events,
  onCopy,
  stale = false,
  lang = "ja",
}: StopPageProps) {
  const isNominal = events.length === 0;

  return (
    <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <p style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, letterSpacing: 2, color: "var(--stop, #dc2626)", margin: 0 }}>
          STOP
        </p>
        {stale && (
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "var(--hold, #d97706)", border: "1px solid var(--hold, #d97706)", padding: "1px 5px", borderRadius: 2 }}>
            STALE
          </span>
        )}
      </div>

      {isNominal ? (
        <div style={{ padding: "16px", background: "var(--pass-soft, #dcfce7)", border: "1px solid var(--pass, #16a34a)", borderRadius: 4, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 20, color: "var(--pass, #16a34a)" }}>✓</span>
          <p style={{ fontFamily: lang === "en" ? '"IBM Plex Sans", "Inter", system-ui, sans-serif' : '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif', fontSize: 13, color: "var(--pass, #16a34a)", margin: 0 }}>
            {lang === "ja" ? "STOPイベントなし（正常）" : "No STOP events (nominal)"}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {events.map((ev) => (
            <div key={ev.id} style={{ padding: "12px 14px", background: "var(--stop-soft, #fee2e2)", border: "1px solid var(--stop, #dc2626)", borderRadius: 4 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "var(--stop, #dc2626)", fontWeight: 700 }}>
                    STOP
                  </span>
                  <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "var(--ink3, #9ca3af)" }}>
                    {ev.dateLabel}
                  </span>
                  <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "var(--ink2, #374151)" }}>
                    {ev.resolvedLabel}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onCopy(ev.id)}
                  aria-label={`${lang === "ja" ? "STOPイベントをコピー" : "Copy STOP event"}`}
                  style={{ padding: "3px 8px", fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 10, color: "var(--ink, #111827)", background: "var(--paper, #ffffff)", border: "1px solid var(--rule, #e5e7eb)", borderRadius: 3, cursor: "pointer" }}
                >
                  {lang === "ja" ? "コピー" : "Copy"}
                </button>
              </div>
              <p style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 11, color: "var(--stop, #dc2626)", margin: 0 }}>
                {ev.trigger}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
