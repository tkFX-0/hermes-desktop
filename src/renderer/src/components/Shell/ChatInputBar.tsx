/**
 * ChatInputBar — local chat send only.
 * Sends ONLY to local-chat-service. No external service. No email. No API.
 * Safety note is always displayed alongside the send button.
 */

import { useState, useCallback } from "react";

interface ChatInputBarProps {
  /** Called when user submits a message. Target is always local-chat-service. */
  readonly onSend: (content: string) => void;
  readonly disabled?: boolean;
  readonly placeholder?: string;
  readonly lang?: "ja" | "en";
}

const SAFETY_NOTE = {
  ja: "チャット送信のみ。外部送信・push・実行は行いません。",
  en: "Local chat only. No external send, push, or execution.",
} as const;

const SEND_LABEL = {
  ja: "しきしまへ送信",
  en: "Send to Shikishima",
} as const;

export function ChatInputBar({
  onSend,
  disabled = false,
  placeholder,
  lang = "ja",
}: ChatInputBarProps) {
  const [value, setValue] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = value.trim();
      if (!trimmed || disabled) return;
      onSend(trimmed);
      setValue("");
    },
    [value, disabled, onSend],
  );

  const placeholderText =
    placeholder ??
    (lang === "ja"
      ? "しきしまに話しかける…"
      : "Talk to Shikishima...");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        padding: "8px 16px 10px",
        borderTop: "1px solid var(--rule, #e5e7eb)",
        background: "var(--paper, #ffffff)",
        flexShrink: 0,
      }}
    >
      {/* Safety note — always visible */}
      <p
        style={{
          fontFamily: '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
          fontSize: 10,
          color: "var(--ink3, #9ca3af)",
          margin: 0,
          userSelect: "none",
        }}
        aria-live="polite"
      >
        {SAFETY_NOTE[lang]}
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: 8, alignItems: "flex-end" }}
      >
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            // Submit on Enter (without Shift)
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent);
            }
          }}
          disabled={disabled}
          placeholder={placeholderText}
          rows={2}
          aria-label={lang === "ja" ? "メッセージを入力" : "Enter message"}
          style={{
            flex: 1,
            resize: "none",
            padding: "8px 10px",
            fontFamily: '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
            fontSize: 13,
            color: "var(--ink, #111827)",
            background: "var(--paper2, #f9fafb)",
            border: "1px solid var(--rule, #d1d5db)",
            borderRadius: 4,
            outline: "none",
            minHeight: 44, // accessibility: tap target >= 44px
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--go, #2563eb)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--rule, #d1d5db)";
          }}
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          aria-label={SEND_LABEL[lang]}
          style={{
            padding: "10px 16px",
            fontFamily: '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
            fontSize: 12,
            fontWeight: 600,
            color:
              disabled || !value.trim()
                ? "var(--ink3, #9ca3af)"
                : "var(--bar-text, #ffffff)",
            background:
              disabled || !value.trim()
                ? "var(--paper3, #e5e7eb)"
                : "var(--go, #2563eb)",
            border: "none",
            borderRadius: 4,
            cursor: disabled || !value.trim() ? "not-allowed" : "pointer",
            minHeight: 44, // accessibility: tap target >= 44px
            minWidth: 80,
            flexShrink: 0,
            transition: "background 0.1s",
          }}
        >
          {SEND_LABEL[lang]}
        </button>
      </form>
    </div>
  );
}
