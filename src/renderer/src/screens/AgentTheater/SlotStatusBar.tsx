/**
 * SlotStatusBar — compact slot/worker/gate status table.
 * Display-only. Design spec: SLOT_WORKER_ROUTING_DESIGN.md
 */

import type { SlotStatus } from "../../types/agent-theater-types";

const STATUS_STYLE: Readonly<Record<
  SlotStatus["status"],
  { color: string; labelJa: string; labelEn: string }
>> = {
  active: { color: "var(--pass, #16a34a)", labelJa: "稼働",  labelEn: "active" },
  idle:   { color: "var(--ink3, #9ca3af)", labelJa: "待機",  labelEn: "idle" },
  hold:   { color: "var(--hold, #d97706)", labelJa: "HOLD",  labelEn: "HOLD" },
};

interface SlotStatusBarProps {
  readonly slots: readonly SlotStatus[];
  readonly lang?: "ja" | "en";
}

export function SlotStatusBar({ slots, lang = "ja" }: SlotStatusBarProps) {
  return (
    <div
      style={{
        border: "1px solid var(--rule, #e5e7eb)",
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      {slots.map((slot, i) => {
        const st = STATUS_STYLE[slot.status];
        return (
          <div
            key={slot.slotId}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 10px",
              background: i % 2 === 0 ? "var(--paper2, #f3f4f6)" : "var(--paper, #ffffff)",
              borderTop: i > 0 ? "1px solid var(--rule, #e5e7eb)" : "none",
            }}
          >
            <span
              style={{
                fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                fontSize: 9,
                color: "var(--ink3, #9ca3af)",
                letterSpacing: 0.5,
                minWidth: 56,
                flexShrink: 0,
              }}
            >
              {slot.slotId.replace("SLOT-", "")}
            </span>

            <span
              style={{
                fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif',
                fontSize: 11,
                color: "var(--ink2, #374151)",
                flex: 1,
                minWidth: 0,
              }}
            >
              {lang === "ja" ? slot.labelJa : slot.labelEn}
            </span>

            <span
              style={{
                fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                fontSize: 9,
                color: "var(--ink3, #9ca3af)",
                flexShrink: 0,
              }}
            >
              {slot.workerLabel}
            </span>

            <span
              style={{
                fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                fontSize: 9,
                color: st.color,
                border: `1px solid ${st.color}`,
                borderRadius: 2,
                padding: "1px 5px",
                flexShrink: 0,
              }}
            >
              {lang === "ja" ? st.labelJa : st.labelEn}
            </span>

            {slot.gateRequired && (
              <span
                style={{
                  fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                  fontSize: 9,
                  color: "var(--hold, #d97706)",
                  flexShrink: 0,
                }}
              >
                {slot.gateRequired}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
