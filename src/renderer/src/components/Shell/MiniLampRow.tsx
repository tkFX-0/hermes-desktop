import type { LampState } from "../../../../shared/ichikishima/ui-page-types";

interface LampEntry {
  readonly label: string;
  readonly state: LampState;
}

interface MiniLampRowProps {
  readonly lamps: readonly LampEntry[];
  readonly compact?: boolean;
}

const STATE_COLORS: Readonly<Partial<Record<LampState, string>>> = {
  HOLD: "var(--hold, #d97706)",
  GO_READY: "var(--go, #2563eb)",
  PASS: "var(--pass, #16a34a)",
  PASS_WITH_CAVEAT: "#9aa72f",
  STOP: "var(--stop, #dc2626)",
  REJECT: "var(--reject, #991b1b)",
  STALE: "var(--hold, #d97706)",
  DISABLED: "var(--ink3, #6b7280)",
  NOT_APPROVED: "var(--hold, #d97706)",
  DISPLAY_ONLY: "var(--ink3, #6b7280)",
  DRAFT_ONLY: "var(--ink3, #6b7280)",
  COPY_ONLY: "var(--ink3, #6b7280)",
  READ_ONLY: "var(--ink3, #6b7280)",
  REDACTED: "var(--ink3, #6b7280)",
};

function lampColor(state: LampState): string {
  return STATE_COLORS[state] ?? "var(--ink3, #6b7280)";
}

export function MiniLampRow({ lamps, compact = false }: MiniLampRowProps) {
  const size = compact ? 8 : 10;
  const gap = compact ? 8 : 12;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap,
        flexWrap: "wrap",
      }}
    >
      {lamps.map((lamp) => (
        <div
          key={lamp.label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
          aria-label={`${lamp.label}: ${lamp.state}`}
        >
          <span
            style={{
              width: size,
              height: size,
              borderRadius: "50%",
              background: lampColor(lamp.state),
              flexShrink: 0,
              display: "inline-block",
            }}
            aria-hidden
          />
          <span
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: compact ? 10 : 11,
              color: "var(--ink2, #6b7280)",
              userSelect: "none",
            }}
          >
            {lamp.label}
          </span>
        </div>
      ))}
    </div>
  );
}
