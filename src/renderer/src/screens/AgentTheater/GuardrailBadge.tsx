/**
 * GuardrailBadge — compact status badge for GuardedActionStatus.
 * Display-only. No clickable controls.
 * Design spec: AT_10_RUNAWAY_GUARD_PANEL_EVIDENCE.md
 */

import type { GuardedActionStatus } from "../../types/agent-theater-types";

const STATUS_CONFIG: Record<
  GuardedActionStatus,
  { color: string; labelJa: string; labelEn: string }
> = {
  HUMAN_GO_REQUIRED: { color: "#f0883e", labelJa: "HUMAN GO", labelEn: "HUMAN GO"  },
  READ_ONLY_GO:      { color: "#f59e0b", labelJa: "READ ONLY", labelEn: "READ ONLY" },
  LOCAL_GO_REQUIRED: { color: "#58a6ff", labelJa: "LOCAL GO",  labelEn: "LOCAL GO"  },
  BLOCKED:           { color: "#f85149", labelJa: "BLOCKED",   labelEn: "BLOCKED"   },
  LOCKED_FALSE:      { color: "#8b949e", labelJa: "LOCKED",    labelEn: "LOCKED"    },
  LOCKED_DISABLED:   { color: "#8b949e", labelJa: "LOCKED",    labelEn: "LOCKED"    },
  DISABLED:          { color: "#6e7681", labelJa: "DISABLED",  labelEn: "DISABLED"  },
};

interface GuardrailBadgeProps {
  readonly status: GuardedActionStatus;
  readonly lang?: "ja" | "en";
}

export function GuardrailBadge({ status, lang = "ja" }: GuardrailBadgeProps): React.JSX.Element {
  const { color, labelJa, labelEn } = STATUS_CONFIG[status];
  return (
    <span
      style={{
        fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
        fontSize: 7,
        fontWeight: 700,
        color,
        border: `1px solid ${color}`,
        borderRadius: 2,
        padding: "1px 4px",
        whiteSpace: "nowrap" as const,
        flexShrink: 0,
        letterSpacing: 0.3,
      }}
    >
      {lang === "ja" ? labelJa : labelEn}
    </span>
  );
}
