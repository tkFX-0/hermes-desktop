/**
 * OperatorPage — Command Center Operator View.
 * Displays safety lamps, current gate/phase status, and caveats.
 * Display-only. All data via props. No IPC. No side effects.
 *
 * Layout (responsive via CSS class cc-operator-grid):
 *   ≥900px: 2-column (main content | status sidebar)
 *   <900px: single column
 */

import type { OperatorPageDisplayData } from "../../utils/snapshot-to-page";
import { LampGrid } from "./LampGrid";

interface OperatorPageProps {
  readonly data: OperatorPageDisplayData;
  readonly komashikiState?: string;
  readonly phaseProgress?: string;
  readonly currentSession?: string;
  readonly caveats?: readonly string[];
  readonly nextHumanAction?: string;
  readonly onRefresh?: () => void;
  readonly lang?: "ja" | "en";
}

const SECTION_HEADING: React.CSSProperties = {
  fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
  fontSize: 10,
  letterSpacing: 2,
  color: "var(--ink3, #9ca3af)",
  margin: "0 0 8px",
  textTransform: "uppercase" as const,
};

const CHIP_BASE: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 5,
  padding: "4px 10px",
  background: "var(--paper2, #f3f4f6)",
  border: "1px solid var(--rule, #e5e7eb)",
  borderRadius: 3,
};

export function OperatorPage({
  data,
  komashikiState,
  phaseProgress,
  currentSession,
  caveats,
  nextHumanAction,
  onRefresh,
  lang = "ja",
}: OperatorPageProps) {
  const decisionColor =
    data.decision === "PASS" || data.decision === "PASS_WITH_CAVEAT"
      ? "var(--pass, #16a34a)"
      : data.decision === "GO_READY"
        ? "var(--go, #2563eb)"
        : data.decision === "STOP"
          ? "var(--stop, #dc2626)"
          : "var(--hold, #d97706)";

  return (
    <div
      style={{
        padding: "var(--page-pd-v, 18px) var(--page-pd-h, 22px)",
        minHeight: 0,
      }}
    >
      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div>
          <p style={{ ...SECTION_HEADING, marginBottom: 2 }}>
            {lang === "ja" ? "操作室 · OPERATOR" : "OPERATOR"}
          </p>
          {phaseProgress && (
            <p
              style={{
                fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif',
                fontSize: 13,
                color: "var(--ink2, #374151)",
                margin: 0,
              }}
            >
              {phaseProgress}
              {currentSession && (
                <span
                  style={{
                    marginLeft: 10,
                    fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                    fontSize: 11,
                    color: "var(--ink3, #9ca3af)",
                  }}
                >
                  {currentSession}
                </span>
              )}
            </p>
          )}
        </div>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            aria-label={lang === "ja" ? "スナップショットを更新" : "Refresh snapshot"}
            style={{
              padding: "6px 12px",
              fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif',
              fontSize: 11,
              color: "var(--ink2, #374151)",
              background: "var(--paper2, #f3f4f6)",
              border: "1px solid var(--rule, #e5e7eb)",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {lang === "ja" ? "更新" : "Refresh"}
          </button>
        )}
      </div>

      {/* Responsive grid: main | sidebar */}
      <div className="cc-operator-grid">
        {/* ── MAIN column ── */}
        <div className="cc-operator-main" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Safety invariant chips */}
          <section aria-label="Safety invariants">
            <p style={SECTION_HEADING}>
              {lang === "ja" ? "安全状態" : "SAFETY STATE"}
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { label: "productionReady", value: String(data.productionReady), pass: true },
                { label: "execution", value: data.execution, pass: false },
                { label: "stale", value: String(data.stale), pass: !data.stale },
              ].map((item) => (
                <div key={item.label} style={CHIP_BASE}>
                  <span
                    style={{
                      fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                      fontSize: 10,
                      color: "var(--ink3, #9ca3af)",
                    }}
                  >
                    {item.label}:{" "}
                  </span>
                  <span
                    style={{
                      fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                      fontSize: 10,
                      fontWeight: 700,
                      color: item.pass
                        ? "var(--pass, #16a34a)"
                        : "var(--hold, #d97706)",
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Lamp grid */}
          <section aria-label="Decision lamps">
            <p style={SECTION_HEADING}>
              {lang === "ja" ? "状態ランプ" : "STATE LAMPS"}
            </p>
            <LampGrid
              activeDecision={data.staleBadge ? "HOLD" : data.decision}
              lang={lang}
            />
          </section>

          {/* こましき state */}
          {komashikiState && (
            <section aria-label="Komashiki state">
              <p style={SECTION_HEADING}>こましき</p>
              <div
                style={{
                  padding: "10px 14px",
                  background: "var(--paper2, #f3f4f6)",
                  border: "1px solid var(--rule, #e5e7eb)",
                  borderRadius: 4,
                  fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                  fontSize: 12,
                  color: "var(--ink, #111827)",
                }}
              >
                {komashikiState}
              </div>
            </section>
          )}

          {/* Caveats */}
          {caveats && caveats.length > 0 && (
            <section aria-label="Caveats">
              <p style={SECTION_HEADING}>
                {lang === "ja" ? "注意事項" : "CAVEATS"}
              </p>
              <ul
                style={{
                  margin: 0,
                  padding: "0 0 0 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {caveats.map((c, i) => (
                  <li
                    key={i}
                    style={{
                      fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                      fontSize: 11,
                      color: "var(--hold, #d97706)",
                    }}
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Next human action */}
          {nextHumanAction && (
            <section aria-label="Next human action">
              <p style={SECTION_HEADING}>
                {lang === "ja" ? "次のアクション" : "NEXT ACTION"}
              </p>
              <p
                style={{
                  fontFamily:
                    lang === "en"
                      ? '"IBM Plex Sans", "Inter", system-ui, sans-serif'
                      : '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
                  fontSize: 12,
                  color: "var(--ink, #111827)",
                  margin: 0,
                  padding: "10px 14px",
                  background: "var(--paper2, #f3f4f6)",
                  border: "1px solid var(--rule, #e5e7eb)",
                  borderRadius: 4,
                  lineHeight: 1.6,
                }}
              >
                {nextHumanAction}
              </p>
            </section>
          )}
        </div>

        {/* ── SIDEBAR column (desktop ≥900px only) ── */}
        <aside
          className="cc-operator-side"
          aria-label={lang === "ja" ? "状態サマリー" : "Status summary"}
        >
          {/* Decision badge */}
          <div
            style={{
              padding: "14px",
              background: "var(--paper2, #f3f4f6)",
              border: `2px solid ${decisionColor}`,
              borderRadius: 6,
              display: "flex",
              flexDirection: "column",
              gap: 6,
              alignItems: "center",
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: decisionColor,
              }}
              aria-hidden
            />
            <span
              style={{
                fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                fontSize: 14,
                fontWeight: 700,
                color: decisionColor,
                letterSpacing: 1,
              }}
            >
              {data.staleBadge ?? data.decision}
            </span>
            <span
              style={{
                fontFamily:
                  lang === "en"
                    ? '"IBM Plex Sans", "Inter", system-ui, sans-serif'
                    : '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
                fontSize: 10,
                color: "var(--ink3, #9ca3af)",
                textAlign: "center",
              }}
            >
              {lang === "ja"
                ? "まだ待機。人間GOが必要です。"
                : "Holding. Human GO required."}
            </span>
          </div>

          {/* Data source */}
          <div
            style={{
              padding: "8px 10px",
              background: "var(--paper2, #f3f4f6)",
              border: "1px solid var(--rule, #e5e7eb)",
              borderRadius: 4,
            }}
          >
            <p
              style={{
                fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                fontSize: 9,
                color: "var(--ink3, #9ca3af)",
                margin: "0 0 4px",
                letterSpacing: 1,
              }}
            >
              DATA SOURCE
            </p>
            <p
              style={{
                fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                fontSize: 10,
                color: "var(--ink2, #374151)",
                margin: 0,
                wordBreak: "break-all",
              }}
            >
              {data.dataSource}
            </p>
          </div>

          {/* Blocked actions reminder */}
          <div
            style={{
              padding: "8px 10px",
              background: "var(--hold-soft, #fef3c7)",
              border: "1px solid var(--hold, #d97706)",
              borderRadius: 4,
            }}
          >
            <p
              style={{
                fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                fontSize: 9,
                color: "var(--hold, #d97706)",
                margin: "0 0 6px",
                letterSpacing: 1,
              }}
            >
              BLOCKED
            </p>
            {[
              lang === "ja" ? "実行" : "execute",
              "push",
              lang === "ja" ? "外部送信" : "ext. write",
              lang === "ja" ? "物理操作" : "physical",
            ].map((label) => (
              <p
                key={label}
                style={{
                  fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                  fontSize: 9,
                  color: "var(--hold, #d97706)",
                  margin: "2px 0",
                  textDecoration: "line-through",
                  opacity: 0.7,
                }}
              >
                {label}
              </p>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
