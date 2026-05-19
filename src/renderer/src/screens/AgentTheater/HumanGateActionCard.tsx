/**
 * HumanGateActionCard — display-only card for one human-gated action.
 * No action buttons. No toggles. No clickable execution controls.
 * Design spec: AT_10_RUNAWAY_GUARD_PANEL_EVIDENCE.md
 */

import type { GuardedActionStatus } from "../../types/agent-theater-types";
import { GuardrailBadge } from "./GuardrailBadge";

const STATUS_ACCENT: Record<GuardedActionStatus, string> = {
  HUMAN_GO_REQUIRED: "#f0883e",
  READ_ONLY_GO:      "#f59e0b",
  LOCAL_GO_REQUIRED: "#58a6ff",
  BLOCKED:           "#f85149",
  LOCKED_FALSE:      "#8b949e",
  LOCKED_DISABLED:   "#8b949e",
  DISABLED:          "#6e7681",
};

export interface GuardedActionData {
  readonly id: string;
  readonly nameJa: string;
  readonly nameEn: string;
  readonly plainJa: string;
  readonly plainEn: string;
  readonly status: GuardedActionStatus;
}

interface HumanGateActionCardProps {
  readonly action: GuardedActionData;
  readonly lang?: "ja" | "en";
}

export function HumanGateActionCard({ action, lang = "ja" }: HumanGateActionCardProps): React.JSX.Element {
  const accent = STATUS_ACCENT[action.status];
  return (
    <div
      style={{
        background: "#161b22",
        border: "1px solid #21262d",
        borderLeft: `3px solid ${accent}`,
        borderRadius: 4,
        padding: "7px 10px",
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        minWidth: 0,
      }}
    >
      {/* Label column */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" as const, gap: 2 }}>
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 9,
            fontWeight: 700,
            color: accent,
            whiteSpace: "nowrap" as const,
          }}
        >
          {lang === "ja" ? action.nameJa : action.nameEn}
        </span>
        <span
          style={{
            fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif',
            fontSize: 9,
            color: "#8b949e",
            lineHeight: 1.3,
          }}
        >
          {lang === "ja" ? action.plainJa : action.plainEn}
        </span>
      </div>

      {/* Status badge */}
      <GuardrailBadge status={action.status} lang={lang} />
    </div>
  );
}
