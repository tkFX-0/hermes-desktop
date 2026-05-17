/**
 * StackChanMobilePage — Compact StackChan status for iPhone view.
 * Display-only. Physical operation / voice / camera / mic: HOLD.
 */

import type { StackChanStatusData } from "../../types/service-contracts";

interface StackChanMobilePageProps {
  readonly status: StackChanStatusData;
  readonly lang?: "ja" | "en";
}

const CONNECTION_COLOR: Record<StackChanStatusData["connection"], string> = {
  not_arrived: "var(--ink3, #9ca3af)",
  arrived_not_connected: "var(--hold, #d97706)",
  connected: "var(--pass, #16a34a)",
  unknown: "var(--ink3, #9ca3af)",
};

const CONNECTION_LABEL_JA: Record<StackChanStatusData["connection"], string> = {
  not_arrived: "未到着",
  arrived_not_connected: "未接続",
  connected: "接続済み",
  unknown: "不明",
};

export function StackChanMobilePage({
  status,
  lang = "ja",
}: StackChanMobilePageProps) {
  const color = CONNECTION_COLOR[status.connection] ?? "var(--ink3, #9ca3af)";
  const connLabel =
    lang === "ja"
      ? CONNECTION_LABEL_JA[status.connection] ?? "不明"
      : status.connection.replace(/_/g, " ");

  return (
    <div
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 10,
            letterSpacing: 2,
            color: "var(--ink3, #9ca3af)",
          }}
        >
          STACKCHAN
        </span>
        {status.stale && (
          <span
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 9,
              color: "var(--hold, #d97706)",
              border: "1px solid var(--hold, #d97706)",
              padding: "0 4px",
              borderRadius: 2,
            }}
          >
            STALE
          </span>
        )}
      </div>

      {/* Connection card */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px",
          background: "var(--paper2, #f3f4f6)",
          border: `1px solid ${color}`,
          borderRadius: 8,
          minHeight: 44,
        }}
      >
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: color,
            flexShrink: 0,
          }}
          aria-hidden
        />
        <div>
          <p
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 12,
              fontWeight: 700,
              color,
              margin: 0,
            }}
          >
            {connLabel}
          </p>
          {status.faceState && (
            <p
              style={{
                fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                fontSize: 10,
                color: "var(--ink3, #9ca3af)",
                margin: "2px 0 0",
              }}
            >
              {status.faceState}
            </p>
          )}
        </div>
      </div>

      {/* HOLD banner */}
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
            fontFamily:
              lang === "en"
                ? '"IBM Plex Sans", "Inter", system-ui, sans-serif'
                : '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
            fontSize: 10,
            color: "var(--hold, #d97706)",
            margin: 0,
          }}
        >
          {lang === "ja"
            ? "物理操作・voice・camera・mic: HOLD"
            : "Physical / voice / camera / mic: HOLD"}
        </p>
      </div>

      {/* Compact invariant row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
        }}
      >
        {[
          { label: "physical", value: String(status.physicalOperation) },
          { label: "voice", value: String(status.voiceActive) },
          { label: "camera", value: String(status.cameraActive) },
          { label: "mic", value: String(status.micActive) },
        ].map((row) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "3px 7px",
              background: "var(--paper2, #f3f4f6)",
              border: "1px solid var(--rule, #e5e7eb)",
              borderRadius: 3,
            }}
          >
            <span
              style={{
                fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                fontSize: 9,
                color: "var(--ink3, #9ca3af)",
              }}
            >
              {row.label}:
            </span>
            <span
              style={{
                fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                fontSize: 9,
                fontWeight: 700,
                color: "var(--hold, #d97706)",
              }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
