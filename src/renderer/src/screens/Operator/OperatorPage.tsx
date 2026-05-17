/**
 * OperatorPage — Command Center Operator View.
 * Displays safety lamps, current gate/phase status, and caveats.
 * Display-only. All data via props. No IPC. No side effects.
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
  return (
    <div
      style={{
        padding: "18px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        minHeight: 0,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <div>
          <p
            style={{
              ...SECTION_HEADING,
              marginBottom: 2,
            }}
          >
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

        {/* Refresh button (display-only action) */}
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

      {/* Safety invariants */}
      <section aria-label="Safety invariants">
        <p style={SECTION_HEADING}>
          {lang === "ja" ? "安全状態" : "SAFETY STATE"}
        </p>
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          {[
            {
              label: "productionReady",
              value: String(data.productionReady),
              ok: true,
            },
            { label: "execution", value: data.execution, ok: false },
            {
              label: "stale",
              value: String(data.stale),
              ok: !data.stale,
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 10px",
                background: "var(--paper2, #f3f4f6)",
                border: "1px solid var(--rule, #e5e7eb)",
                borderRadius: 3,
              }}
            >
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
                  color: item.ok
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
  );
}
