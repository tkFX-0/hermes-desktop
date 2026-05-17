/**
 * CommandChatPage — Command Center local chat page.
 * Sends to local-chat-service ONLY. No external service. No API.
 * Safety note always visible. Display-only message history.
 *
 * Layout (responsive via CSS classes):
 *   ≥900px: left status panel + main chat area
 *   <900px: single column (status banner + messages + input)
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

const DECISION_LABEL: Record<string, { ja: string; color: string }> = {
  HOLD:             { ja: "まだ待機", color: "var(--hold, #d97706)" },
  GO_READY:         { ja: "GO待ち",   color: "var(--go, #2563eb)"  },
  PASS:             { ja: "通過",     color: "var(--pass, #16a34a)" },
  PASS_WITH_CAVEAT: { ja: "通過(注意)",color: "#9aa72f"             },
  STOP:             { ja: "停止",     color: "var(--stop, #dc2626)" },
};

export function CommandChatPage({
  messages,
  safety,
  onSend,
  lang = "ja",
}: CommandChatPageProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const decision = safety.stale ? "HOLD" : safety.decisionStrip;
  const decInfo = DECISION_LABEL[decision] ?? DECISION_LABEL["HOLD"]!;

  return (
    <div className="cc-chat-outer">
      {/* ── Left status panel (desktop ≥900px only) ── */}
      <aside
        className="cc-chat-status-panel"
        aria-label={lang === "ja" ? "チャット状態" : "Chat status"}
      >
        {/* Decision badge */}
        <div
          style={{
            padding: "12px 10px",
            background: "var(--paper, #ffffff)",
            border: `2px solid ${decInfo.color}`,
            borderRadius: 6,
            display: "flex",
            flexDirection: "column",
            gap: 5,
            alignItems: "center",
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: decInfo.color,
            }}
            aria-hidden
          />
          <span
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 11,
              fontWeight: 700,
              color: decInfo.color,
              letterSpacing: 1,
            }}
          >
            {decision}
          </span>
          <span
            style={{
              fontFamily: '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
              fontSize: 9,
              color: "var(--ink3, #9ca3af)",
              textAlign: "center",
            }}
          >
            {decInfo.ja}
          </span>
          {safety.stale && (
            <span
              style={{
                fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                fontSize: 9,
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

        {/* Message stats */}
        <div
          style={{
            padding: "8px 10px",
            background: "var(--paper, #ffffff)",
            border: "1px solid var(--rule, #e5e7eb)",
            borderRadius: 4,
          }}
        >
          <p
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 9,
              color: "var(--ink3, #9ca3af)",
              margin: "0 0 4px",
              letterSpacing: 1,
            }}
          >
            {lang === "ja" ? "メッセージ" : "MESSAGES"}
          </p>
          <p
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 16,
              fontWeight: 700,
              color: "var(--ink, #111827)",
              margin: 0,
            }}
          >
            {messages.length}
          </p>
        </div>

        {/* Safety note */}
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
              fontFamily: '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
              fontSize: 9,
              color: "var(--hold, #d97706)",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {lang === "ja"
              ? "ローカルチャットのみ。外部送信・push・実行は行いません。"
              : "Local chat only. No external send/push/execute."}
          </p>
        </div>
      </aside>

      {/* ── Main chat area ── */}
      <div className="cc-chat-main">
        {/* Stale banner (mobile: shows here; desktop: shown in sidebar) */}
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
    </div>
  );
}
