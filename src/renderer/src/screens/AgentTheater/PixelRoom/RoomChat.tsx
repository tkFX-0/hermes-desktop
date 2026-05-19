/**
 * RoomChat — compact dark-themed chat panel for the pixel room.
 * Sits below PixelRoomView in the ROOM tab.
 * Display-only history + local chat input. No external send/push/exec.
 * PXR-01 (static display; messaging goes through local-chat-service only).
 */

import { useRef, useEffect } from "react";
import { ChatInputBar } from "../../../components/Shell/ChatInputBar";
import type { LocalChatMessage } from "../../../types/service-contracts";

interface RoomChatProps {
  readonly messages: readonly LocalChatMessage[];
  readonly onSend: (content: string) => void;
  readonly lang?: "ja" | "en";
}

const EMPTY_LABEL = {
  ja: "まだメッセージはありません。しきしまに話しかけましょう。",
  en: "No messages yet. Talk to Shikishima.",
} as const;

/* ── Single message bubble (dark variant) ── */
function DarkBubble({ message, lang = "ja" }: { message: LocalChatMessage; lang?: "ja" | "en" }): React.JSX.Element {
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
        gap: 2,
      }}
    >
      <div
        style={{
          maxWidth: "80%",
          padding: "7px 11px",
          background: isUser ? "#1d3a6e" : "#161b22",
          color: isUser ? "#cae0ff" : "#c9d1d9",
          border: `1px solid ${isUser ? "#2a4a8a" : "#21262d"}`,
          borderRadius: isUser ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
          fontFamily: '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
          fontSize: 12,
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
          color: "#6e7681",
          paddingLeft: isUser ? 0 : 3,
          paddingRight: isUser ? 3 : 0,
        }}
      >
        {isUser ? "you" : "しきしま"} · {time}
      </span>
    </div>
  );
}

/* ── Dark chat input (overrides ChatInputBar light theme) ── */
function DarkChatInput({ onSend, lang = "ja" }: { onSend: (c: string) => void; lang?: "ja" | "en" }): React.JSX.Element {
  return (
    <div
      style={{
        borderTop: "1px solid #21262d",
        background: "#0d1117",
      }}
    >
      <ChatInputBar onSend={onSend} lang={lang} />
    </div>
  );
}

/* ── Main RoomChat panel ── */
export function RoomChat({ messages, onSend, lang = "ja" }: RoomChatProps): React.JSX.Element {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      style={{
        background: "#0d1117",
        border: "1px solid #21262d",
        borderTop: "none",
        borderRadius: "0 0 8px 8px",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      {/* Chat header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "7px 14px",
          borderBottom: "1px solid #161b22",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 10,
            letterSpacing: 1.8,
            color: "#8b949e",
            textTransform: "uppercase",
          }}
        >
          {lang === "ja" ? "チャット · SHIKISHIMA" : "CHAT · SHIKISHIMA"}
        </span>
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 9,
            color: "#3fb950",
            border: "1px solid rgba(63,185,80,0.3)",
            borderRadius: 2,
            padding: "1px 5px",
          }}
        >
          local-only
        </span>
      </div>

      {/* Message list */}
      <div
        role="log"
        aria-label={lang === "ja" ? "チャット履歴" : "Chat history"}
        aria-live="polite"
        style={{
          height: 200,
          overflowY: "auto",
          padding: "10px 14px 6px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {messages.length === 0 ? (
          <p
            style={{
              fontFamily: '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
              fontSize: 12,
              color: "#484f58",
              textAlign: "center",
              margin: "auto",
            }}
          >
            {EMPTY_LABEL[lang]}
          </p>
        ) : (
          messages.map((msg) => (
            <DarkBubble key={msg.id} message={msg} lang={lang} />
          ))
        )}
        <div ref={bottomRef} aria-hidden />
      </div>

      {/* Input */}
      <DarkChatInput onSend={onSend} lang={lang} />
    </div>
  );
}
