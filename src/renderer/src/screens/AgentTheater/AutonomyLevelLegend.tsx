/**
 * AutonomyLevelLegend — compact Level 1-5 boundary display.
 * Shows which levels are AI-workable and which require human GO.
 * Display-only. No execute/push/send.
 * Design spec: AT_08_SLOT_WORKER_STATUS_PANEL_EVIDENCE.md
 */

const LEVELS = [
  { num: 1, ja: "指示書作成",     en: "Instruction drafting" },
  { num: 2, ja: "Worker実装",     en: "Worker implementation" },
  { num: 3, ja: "typecheck / lint / test", en: "typecheck / lint / test" },
  { num: 4, ja: "evidence / ローカルcommit", en: "evidence / local commit" },
  { num: 5, ja: "push / runtime / OAuth / 外部接続", en: "push / runtime / OAuth / ext. connect" },
] as const;

const LEVEL5_ACTIONS = [
  "push",
  "runtime",
  "OAuth",
  "x_search",
  "Obsidian write",
  "external write",
] as const;

interface AutonomyLevelLegendProps {
  readonly lang?: "ja" | "en";
}

export function AutonomyLevelLegend({ lang = "ja" }: AutonomyLevelLegendProps): React.JSX.Element {
  return (
    <div
      style={{
        background: "#0d1117",
        border: "1px solid #21262d",
        borderRadius: 4,
        padding: "10px 12px",
      }}
    >
      {/* Level rows */}
      {LEVELS.map((level) => {
        const isHuman = level.num === 5;
        const isAiMax = level.num === 4;
        return (
          <div
            key={level.num}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: level.num < LEVELS.length ? 4 : 0,
            }}
          >
            <span
              style={{
                fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                fontSize: 8,
                color: isHuman ? "#f0883e" : "#6e7681",
                minWidth: 46,
                flexShrink: 0,
              }}
            >
              Lv {level.num}
            </span>
            <span
              style={{
                fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                fontSize: 8,
                color: isHuman ? "#f0883e" : "#8b949e",
                flex: 1,
                minWidth: 0,
              }}
            >
              {lang === "ja" ? level.ja : level.en}
            </span>
            {isAiMax && (
              <span
                style={{
                  fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                  fontSize: 7,
                  color: "#3fb950",
                  border: "1px solid #3fb950",
                  borderRadius: 2,
                  padding: "0 3px",
                  whiteSpace: "nowrap" as const,
                  flexShrink: 0,
                }}
              >
                {lang === "ja" ? "AI作業OK" : "AI OK"}
              </span>
            )}
            {isHuman && (
              <span
                style={{
                  fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                  fontSize: 7,
                  color: "#f0883e",
                  border: "1px solid #f0883e",
                  borderRadius: 2,
                  padding: "0 3px",
                  whiteSpace: "nowrap" as const,
                  flexShrink: 0,
                }}
              >
                {lang === "ja" ? "人間GO必須" : "HUMAN GO"}
              </span>
            )}
          </div>
        );
      })}

      {/* Divider */}
      <div style={{ height: 1, background: "#21262d", margin: "8px 0" }} />

      {/* Level 5 action badges */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 8 }}>
        {LEVEL5_ACTIONS.map((action) => (
          <span
            key={action}
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 7,
              color: "#f0883e",
              border: "1px solid #21262d",
              borderRadius: 2,
              padding: "1px 4px",
              whiteSpace: "nowrap" as const,
            }}
          >
            {action}: human GO
          </span>
        ))}
      </div>

      {/* Tagline */}
      <p
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize: 8,
          color: "#6e7681",
          margin: 0,
          fontStyle: "italic",
        }}
      >
        {lang === "ja"
          ? "AIは作るところまで。鍵と発射ボタンは人間。"
          : "AI builds. Humans hold the keys."}
      </p>
    </div>
  );
}
