/**
 * CommandChatPage — Command Center local chat page.
 * Sends to local-chat-service ONLY. No external service. No API.
 * Safety note always visible. Display-only message history.
 */

import { useRef, useEffect } from "react";
import type { LocalChatMessage } from "../../types/service-contracts";
import type { ChatPageDisplayData } from "../../utils/snapshot-to-page";
import { ChatInputBar } from "../../components/Shell/ChatInputBar";
import { MessageBubble } from "./MessageBubble";

interface CommandChatPageProps {
  readonly messages: readonly LocalChatMessage[];
  readonly safety: ChatPageDisplayData;
  readonly onSend: (content: string) => void;
  readonly lang?: "ja" | "en";
}

const EMPTY_LABEL = {
  ja: "まだメッセージはありません。\nしきしまに話しかけてみましょう。",
  en: "No messages yet.\nTalk to Shikishima.",
} as const;

export function CommandChatPage({
  messages,
  safety,
  onSend,
  lang = "ja",
}: CommandChatPageProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
      }}
    >
      {/* Stale banner */}
      {safety.stale && (
        <div
          role="alert"
          style={{
            padding: "6px 16px",
            background: "var(--hold-soft, #fef3c7)",
            borderBottom: "1px solid var(--hold, #d97706)",
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 10,
            color: "var(--hold, #d97706)",
            letterSpacing: 0.5,
          }}
        >
          STALE —{" "}
          {lang === "ja"
            ? "スナップショットが古くなっています"
            : "Snapshot is stale"}
        </div>
      )}

      {/* Message list */}
      <div
        role="log"
        aria-label={lang === "ja" ? "チャット履歴" : "Chat history"}
        aria-live="polite"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: "16px 16px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.length === 0 ? (
          <p
            style={{
              fontFamily:
                lang === "en"
                  ? '"IBM Plex Sans", "Inter", system-ui, sans-serif'
                  : '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
              fontSize: 13,
              color: "var(--ink3, #9ca3af)",
              textAlign: "center",
              margin: "auto",
              whiteSpace: "pre-line",
            }}
          >
            {EMPTY_LABEL[lang]}
          </p>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} lang={lang} />
          ))
        )}
        <div ref={bottomRef} aria-hidden />
      </div>

      {/* Chat input — always at bottom */}
      <ChatInputBar onSend={onSend} lang={lang} />
    </div>
  );
}
