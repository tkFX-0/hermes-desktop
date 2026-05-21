/**
 * AIUsageManualInputNotice — safety strip for AI Usage Cockpit.
 * Always visible. Reminds users that data is manual/estimated only.
 */

interface AIUsageManualInputNoticeProps {
  readonly lang?: "ja" | "en";
}

export function AIUsageManualInputNotice({ lang = "ja" }: AIUsageManualInputNoticeProps): React.JSX.Element {
  return (
    <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 4, padding: "6px 12px", display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
      {[
        { k: "token_stored", v: "false", c: "#3fb950" },
        { k: "api_called", v: "false", c: "#3fb950" },
        { k: "scraping", v: "false", c: "#3fb950" },
        { k: "data", v: lang === "ja" ? "手動/推定のみ" : "manual/estimated only", c: "#58a6ff" },
        { k: "productionReady", v: "false", c: "#f0883e" },
        { k: "execution", v: "disabled", c: "#f0883e" },
      ].map(({ k, v, c }) => (
        <span key={k} style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9 }}>
          <span style={{ color: "#484f58" }}>{k}: </span>
          <span style={{ color: c }}>{v}</span>
        </span>
      ))}
    </div>
  );
}
