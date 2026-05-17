/**
 * StackChanPage — StackChan Control Room.
 * Display-only. Physical operation remains HOLD.
 * No voice/camera/mic activation. No serial/USB/Wi-Fi device access.
 * Shows connection status and face state only.
 */

import type { StackChanStatusData } from "../../types/service-contracts";

interface StackChanPageProps {
  readonly status: StackChanStatusData;
  readonly onCopyStatus: () => void;
  readonly lang?: "ja" | "en";
}

const CONNECTION_LABEL: Record<
  StackChanStatusData["connection"],
  { ja: string; en: string; color: string }
> = {
  not_arrived: {
    ja: "未到着",
    en: "Not arrived",
    color: "var(--ink3, #9ca3af)",
  },
  arrived_not_connected: {
    ja: "到着済み・未接続",
    en: "Arrived, not connected",
    color: "var(--hold, #d97706)",
  },
  connected: {
    ja: "接続済み",
    en: "Connected",
    color: "var(--pass, #16a34a)",
  },
  unknown: {
    ja: "不明",
    en: "Unknown",
    color: "var(--ink3, #9ca3af)",
  },
};

const HOLD_NOTE = {
  ja: "StackChan物理操作・voice/camera/micはHOLD。ClaudeCodeのGOが必要です。",
  en: "StackChan physical operation / voice / camera / mic: HOLD. ClaudeCode GO required.",
} as const;

interface StatusRowProps {
  readonly label: string;
  readonly value: string;
  readonly locked?: boolean;
}

function StatusRow({ label, value, locked }: StatusRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 0",
        borderBottom: "1px solid var(--rule, #e5e7eb)",
      }}
    >
      <span
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize: 11,
          color: "var(--ink3, #9ca3af)",
          minWidth: 180,
          flexShrink: 0,
        }}
      >
        {label}:
      </span>
      <span
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize: 11,
          fontWeight: 600,
          color: locked
            ? "var(--hold, #d97706)"
            : "var(--pass, #16a34a)",
        }}
      >
        {value}
      </span>
      {locked && (
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 9,
            color: "var(--hold, #d97706)",
            border: "1px solid var(--hold, #d97706)",
            padding: "0 4px",
            borderRadius: 2,
          }}
          aria-label="HOLD — ClaudeCode GO required"
        >
          HOLD
        </span>
      )}
    </div>
  );
}

export function StackChanPage({
  status,
  onCopyStatus,
  lang = "ja",
}: StackChanPageProps) {
  const conn =
    CONNECTION_LABEL[status.connection] ?? CONNECTION_LABEL.unknown;

  return (
    <div
      style={{
        padding: "18px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <p
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 10,
            letterSpacing: 2,
            color: "var(--ink3, #9ca3af)",
            margin: 0,
          }}
        >
          STACKCHAN
        </p>
        {status.stale && (
          <span
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 10,
              color: "var(--hold, #d97706)",
              border: "1px solid var(--hold, #d97706)",
              padding: "1px 5px",
              borderRadius: 2,
            }}
          >
            STALE
          </span>
        )}
      </div>

      {/* HOLD notice */}
      <div
        style={{
          padding: "8px 12px",
          background: "var(--hold-soft, #fef3c7)",
          border: "1px solid var(--hold, #d97706)",
          borderRadius: 3,
        }}
      >
        <p
          style={{
            fontFamily:
              lang === "en"
                ? '"IBM Plex Sans", "Inter", system-ui, sans-serif'
                : '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
            fontSize: 11,
            color: "var(--hold, #d97706)",
            margin: 0,
          }}
        >
          {HOLD_NOTE[lang]}
        </p>
      </div>

      {/* Connection status */}
      <section aria-label="Connection status">
        <p
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 10,
            letterSpacing: 1,
            color: "var(--ink3, #9ca3af)",
            margin: "0 0 8px",
          }}
        >
          {lang === "ja" ? "接続状態" : "CONNECTION"}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 14px",
            background: "var(--paper2, #f3f4f6)",
            border: `1px solid ${conn.color}`,
            borderRadius: 4,
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: conn.color,
              flexShrink: 0,
            }}
            aria-hidden
          />
          <span
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 12,
              fontWeight: 700,
              color: conn.color,
              letterSpacing: 0.5,
            }}
          >
            {status.connection.toUpperCase()}
          </span>
          <span
            style={{
              fontFamily:
                lang === "en"
                  ? '"IBM Plex Sans", "Inter", system-ui, sans-serif'
                  : '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
              fontSize: 12,
              color: "var(--ink2, #374151)",
            }}
          >
            {lang === "ja" ? conn.ja : conn.en}
          </span>
        </div>
      </section>

      {/* Face state */}
      {status.faceState && (
        <section aria-label="Face state">
          <p
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 10,
              letterSpacing: 1,
              color: "var(--ink3, #9ca3af)",
              margin: "0 0 8px",
            }}
          >
            {lang === "ja" ? "フェイス状態" : "FACE STATE"}
          </p>
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
            {status.faceState}
          </div>
        </section>
      )}

      {/* Safety invariants */}
      <section aria-label="Safety invariants">
        <p
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 10,
            letterSpacing: 1,
            color: "var(--ink3, #9ca3af)",
            margin: "0 0 8px",
          }}
        >
          {lang === "ja" ? "安全状態（すべてHOLD）" : "SAFETY STATE (all HOLD)"}
        </p>
        <div
          style={{
            background: "var(--paper2, #f3f4f6)",
            border: "1px solid var(--rule, #e5e7eb)",
            borderRadius: 4,
            padding: "0 14px",
          }}
        >
          <StatusRow
            label="physical_operation"
            value={String(status.physicalOperation)}
            locked
          />
          <StatusRow
            label="voice_active"
            value={String(status.voiceActive)}
            locked
          />
          <StatusRow
            label="camera_active"
            value={String(status.cameraActive)}
            locked
          />
          <StatusRow
            label="mic_active"
            value={String(status.micActive)}
            locked
          />
        </div>
      </section>

      {/* Copy button */}
      <button
        type="button"
        onClick={onCopyStatus}
        aria-label={lang === "ja" ? "接続状態をコピー" : "Copy connection status"}
        style={{
          padding: "8px 16px",
          fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif',
          fontSize: 12,
          color: "var(--ink, #111827)",
          background: "var(--paper2, #f3f4f6)",
          border: "1px solid var(--rule, #e5e7eb)",
          borderRadius: 4,
          cursor: "pointer",
          alignSelf: "flex-start",
        }}
      >
        {lang === "ja" ? "接続状態をコピー" : "Copy connection status"}
      </button>
    </div>
  );
}
