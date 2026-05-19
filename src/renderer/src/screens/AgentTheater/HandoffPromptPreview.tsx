/**
 * HandoffPromptPreview — display-only sample handoff prompt block.
 * No auto-send, no copy behavior, no API call.
 * Design spec: AT_11_WORKER_ROUTING_HANDOFF_PROMPT_PANEL_EVIDENCE.md
 */

interface HandoffPromptPreviewProps {
  readonly title: string;
  readonly preview: string;
  readonly accentColor: string;
  readonly lang?: "ja" | "en";
}

export function HandoffPromptPreview({ title, preview, accentColor, lang = "ja" }: HandoffPromptPreviewProps): React.JSX.Element {
  return (
    <div
      style={{
        background: "#0d1117",
        border: `1px solid ${accentColor}`,
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          background: "#161b22",
          borderBottom: "1px solid #21262d",
          padding: "4px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 8,
            fontWeight: 700,
            color: accentColor,
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 7,
            color: "#6e7681",
            border: "1px solid #21262d",
            borderRadius: 2,
            padding: "0 3px",
          }}
        >
          {lang === "ja" ? "表示のみ" : "display only"}
        </span>
      </div>

      {/* Prompt body */}
      <div style={{ padding: "8px 10px" }}>
        <p
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 9,
            color: "#c9d1d9",
            margin: 0,
            lineHeight: 1.5,
            whiteSpace: "pre-wrap" as const,
          }}
        >
          {preview}
        </p>
      </div>
    </div>
  );
}
