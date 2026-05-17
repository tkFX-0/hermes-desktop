/**
 * MessageBubble — single message display for Command Center Chat.
 * Display-only. No actions.
 */

import type { LocalChatMessage } from "../../types/service-contracts";

interface MessageBubbleProps {
  readonly message: LocalChatMessage;
  readonly lang?: "ja" | "en";
}

export function MessageBubble({ message, lang = "ja" }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const time = new Date(message.timestampUnixMs).toLocaleTimeString(
    lang === "ja" ? "ja-JP" : "en-US",
    { hour: "2-digit", minute: "2-digit" },
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        gap: 3,
      }}
    >
      <div
        style={{
          maxWidth: "80%",
          padding: "8px 12px",
          background: isUser
            ? "var(--go, #2563eb)"
            : "var(--paper2, #f3f4f6)",
          color: isUser ? "#ffffff" : "var(--ink, #111827)",
          borderRadius: isUser ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
          fontFamily:
            lang === "en"
              ? '"IBM Plex Sans", "Inter", system-ui, sans-serif'
              : '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
          fontSize: 13,
          lineHeight: 1.6,
          wordBreak: "break-word" as const,
        }}
      >
        {message.content}
      </div>
      <span
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize: 9,
          color: "var(--ink3, #9ca3af)",
          paddingLeft: isUser ? 0 : 4,
          paddingRight: isUser ? 4 : 0,
        }}
        aria-label={`Sent at ${time}`}
      >
        {time}
      </span>
    </div>
  );
}
