/**
 * RoomChatInline — しきしまとのチャット
 * Layout: 入力バー → 履歴リスト（常時表示・最新が下）
 */

import { useRef, useEffect } from "react";
import { ChatInputBar } from "../../components/Shell/ChatInputBar";
import type { LocalChatMessage } from "../../types/service-contracts";

interface RoomChatInlineProps {
  readonly messages: readonly LocalChatMessage[];
  readonly onSend: (content: string) => void | Promise<void>;
  readonly lang?: "ja" | "en";
  readonly stackchanOnline?: boolean;
}

function Bubble({ message, lang = "ja" }: { message: LocalChatMessage; lang?: "ja" | "en" }): React.JSX.Element {
  const isUser = message.role === "user";
  const isThinking = message.content === "…";
  const time = new Date(message.timestampUnixMs).toLocaleTimeString(
    lang === "ja" ? "ja-JP" : "en-US",
    { hour: "2-digit", minute: "2-digit" },
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", gap: 2 }}>
      <div
        style={{
          maxWidth: "88%",
          padding: "7px 11px",
          background: isUser ? "#1d3a6e" : "#161b22",
          color: isUser ? "#cae0ff" : "#c9d1d9",
          border: `1px solid ${isUser ? "#2a4a8a" : "#21262d"}`,
          borderRadius: isUser ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
          fontFamily: '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
          fontSize: 13,
          lineHeight: 1.6,
          wordBreak: "break-word",
          opacity: isThinking ? 0.5 : 1,
          fontStyle: isThinking ? "italic" : "normal",
          whiteSpace: "pre-wrap",
        }}
      >
        {message.content}
      </div>
      <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, color: "#6e7681" }}>
        {isUser ? "you" : "しきしま"} · {time}
      </span>
    </div>
  );
}

export function RoomChatInline({ messages, onSend, lang = "ja", stackchanOnline = false }: RoomChatInlineProps): React.JSX.Element {
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
      }}
    >
      {/* Input bar + StackChan status badge */}
      <div style={{ borderBottom: messages.length > 0 ? "1px solid #21262d" : "none" }}>
        <ChatInputBar onSend={onSend} lang={lang} />
        <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 12px 4px" }}>
          <span
            title={stackchanOnline ? "StackChan connected" : "StackChan offline"}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: stackchanOnline ? "#3fb950" : "#484f58",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, color: stackchanOnline ? "#3fb950" : "#484f58" }}>
            {stackchanOnline ? "StackChan" : "StackChan offline"}
          </span>
        </div>
      </div>

      {/* History — always visible below input, scrollable */}
      {messages.length > 0 && (
        <div
          role="log"
          aria-label={lang === "ja" ? "チャット履歴" : "Chat history"}
          aria-live="polite"
          style={{
            maxHeight: 320,
            overflowY: "auto",
            padding: "10px 14px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {messages.map((msg) => (
            <Bubble key={msg.id} message={msg} lang={lang} />
          ))}
          <div ref={bottomRef} aria-hidden />
        </div>
      )}
    </div>
  );
}
