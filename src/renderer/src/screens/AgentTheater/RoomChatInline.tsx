/**
 * RoomChatInline — chat input bar attached below PixelRoomStage,
 * with history accessible via a right-side dropdown toggle.
 * Input is always visible. History folds/unfolds on the right.
 */

import { useState, useRef, useEffect } from "react";
import { ChatInputBar } from "../../components/Shell/ChatInputBar";
import type { LocalChatMessage } from "../../types/service-contracts";

interface RoomChatInlineProps {
  readonly messages: readonly LocalChatMessage[];
  readonly onSend: (content: string) => void;
  readonly lang?: "ja" | "en";
}

function Bubble({
  message,
  lang = "ja",
}: {
  message: LocalChatMessage;
  lang?: "ja" | "en";
}): React.JSX.Element {
  const isUser = message.role === "user";
  const time = new Date(message.timestampUnixMs).toLocaleTimeString(
    lang === "ja" ? "ja-JP" : "en-US",
    { hour: "2-digit", minute: "2-digit" },
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column" as const,
        alignItems: isUser ? "flex-end" : "flex-start",
        gap: 2,
      }}
    >
      <div
        style={{
          maxWidth: "85%",
          padding: "6px 10px",
          background: isUser ? "#1d3a6e" : "#161b22",
          color: isUser ? "#cae0ff" : "#c9d1d9",
          border: `1px solid ${isUser ? "#2a4a8a" : "#21262d"}`,
          borderRadius: isUser ? "8px 8px 2px 8px" : "8px 8px 8px 2px",
          fontFamily: '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
          fontSize: 12,
          lineHeight: 1.5,
          wordBreak: "break-word" as const,
        }}
      >
        {message.content}
      </div>
      <span
        style={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: 9,
          color: "#6e7681",
        }}
      >
        {isUser ? "you" : "しきしま"} · {time}
      </span>
    </div>
  );
}

export function RoomChatInline({
  messages,
  onSend,
  lang = "ja",
}: RoomChatInlineProps): React.JSX.Element {
  const [historyOpen, setHistoryOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (historyOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, historyOpen]);

  return (
    <div style={{ position: "relative" as const }}>
      {/* History dropdown — overlays above input bar, right-aligned */}
      {historyOpen && (
        <div
          style={{
            position: "absolute" as const,
            bottom: "100%",
            right: 0,
            width: 320,
            maxHeight: 240,
            background: "#161b22",
            border: "1px solid #30363d",
            borderRadius: "6px 6px 0 0",
            overflowY: "auto" as const,
            zIndex: 30,
            padding: "10px 12px",
            display: "flex",
            flexDirection: "column" as const,
            gap: 8,
          }}
        >
          {messages.length === 0 ? (
            <span
              style={{
                fontFamily: '"Noto Sans JP", system-ui, sans-serif',
                fontSize: 11,
                color: "#484f58",
                textAlign: "center" as const,
                padding: "16px 0",
              }}
            >
              {lang === "ja" ? "まだメッセージはありません" : "No messages yet"}
            </span>
          ) : (
            messages.map((msg) => (
              <Bubble key={msg.id} message={msg} lang={lang} />
            ))
          )}
          <div ref={bottomRef} aria-hidden />
        </div>
      )}

      {/* Bottom bar: input (flex-1) + history toggle (right) */}
      <div
        style={{
          background: "#0d1117",
          border: "1px solid #21262d",
          borderTop: "none",
          borderRadius: "0 0 8px 8px",
          display: "flex",
          alignItems: "stretch",
        }}
      >
        {/* Input */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <ChatInputBar onSend={onSend} lang={lang} />
        </div>

        {/* History toggle button */}
        <button
          type="button"
          onClick={() => setHistoryOpen((h) => !h)}
          aria-label={
            historyOpen ? "チャット履歴を閉じる" : "チャット履歴を開く"
          }
          style={{
            background: historyOpen ? "#161b22" : "none",
            border: "none",
            borderLeft: "1px solid #21262d",
            borderRadius: "0 0 8px 0",
            padding: "0 12px",
            cursor: "pointer",
            color: historyOpen ? "#58a6ff" : "#6e7681",
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 10,
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            flexShrink: 0,
            transition: "color 0.15s",
            minWidth: 42,
          }}
        >
          <span>履歴</span>
          <span style={{ fontSize: 8 }}>{historyOpen ? "▲" : "▼"}</span>
          {messages.length > 0 && (
            <span style={{ fontSize: 9, color: "#3fb950", marginTop: 1 }}>
              {messages.length}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
