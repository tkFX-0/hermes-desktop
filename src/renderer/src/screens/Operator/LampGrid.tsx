/**
 * LampGrid — status lamp grid for the Operator page.
 * Displays key safety state lamps: color + code + phrase (never color alone).
 * Read-only display. No interactive actions.
 */

const LAMP_DEFINITIONS: ReadonlyArray<{
  readonly key: string;
  readonly labelJa: string;
  readonly labelEn: string;
  readonly color: string;
  readonly textColor?: string;
}> = [
  {
    key: "HOLD",
    labelJa: "まだ待機。人間GOが必要です。",
    labelEn: "Holding. Human GO is required.",
    color: "var(--hold-soft, #fef3c7)",
    textColor: "var(--hold, #d97706)",
  },
  {
    key: "GO_READY",
    labelJa: "人間GOの判断待ち。実行はしません。",
    labelEn: "Awaiting human GO. System will not execute.",
    color: "var(--go-soft, #dbeafe)",
    textColor: "var(--go, #2563eb)",
  },
  {
    key: "PASS",
    labelJa: "Gate通過。次のGateへ。",
    labelEn: "Gate passed. Proceed to the next gate.",
    color: "var(--pass-soft, #dcfce7)",
    textColor: "var(--pass, #16a34a)",
  },
  {
    key: "STOP",
    labelJa: "停止中。人間の解除が必要です。",
    labelEn: "Stopped. Human release is required.",
    color: "var(--stop-soft, #fee2e2)",
    textColor: "var(--stop, #dc2626)",
  },
];

interface LampCardProps {
  readonly code: string;
  readonly isActive: boolean;
  readonly lang: "ja" | "en";
}

function LampCard({ code, isActive, lang }: LampCardProps) {
  const def = LAMP_DEFINITIONS.find((d) => d.key === code);
  const color = def?.textColor ?? "var(--ink3, #6b7280)";
  const bg = def?.color ?? "var(--paper2, #f3f4f6)";
  const phrase =
    def
      ? lang === "en"
        ? def.labelEn
        : def.labelJa
      : code;

  return (
    <div
      aria-label={`${code}: ${phrase}`}
      style={{
        padding: "12px 14px",
        background: isActive ? bg : "var(--paper2, #f3f4f6)",
        border: isActive
          ? `1.5px solid ${color}`
          : "1px solid var(--rule, #e5e7eb)",
        borderRadius: 4,
        opacity: isActive ? 1 : 0.45,
        transition: "opacity 0.15s",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 5,
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: isActive ? color : "var(--ink3, #6b7280)",
            flexShrink: 0,
          }}
          aria-hidden
        />
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 12,
            fontWeight: 700,
            color: isActive ? color : "var(--ink3, #6b7280)",
            letterSpacing: 1,
          }}
        >
          {code}
        </span>
      </div>
      <p
        style={{
          fontFamily:
            lang === "en"
              ? '"IBM Plex Sans", "Inter", system-ui, sans-serif'
              : '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
          fontSize: 11,
          color: isActive ? color : "var(--ink3, #9ca3af)",
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {phrase}
      </p>
    </div>
  );
}

interface LampGridProps {
  readonly activeDecision: string;
  readonly lang?: "ja" | "en";
}

export function LampGrid({ activeDecision, lang = "ja" }: LampGridProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 10,
      }}
    >
      {LAMP_DEFINITIONS.map((def) => (
        <LampCard
          key={def.key}
          code={def.key}
          isActive={activeDecision === def.key}
          lang={lang}
        />
      ))}
    </div>
  );
}
