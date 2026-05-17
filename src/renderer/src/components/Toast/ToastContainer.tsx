/**
 * ToastContainer — fixed-position notification toasts.
 * Display only. Dismiss via onDismiss callback.
 * No external calls. lingerSeconds controls auto-dismiss timing upstream.
 */

import { useEffect } from "react";

export type ToastVariant = "info" | "pass" | "hold" | "stop";

export interface ToastItem {
  readonly id: string;
  readonly message: string;
  readonly variant: ToastVariant;
  readonly lingerSeconds: number;
}

interface ToastContainerProps {
  readonly toasts: readonly ToastItem[];
  readonly onDismiss: (id: string) => void;
}

const VARIANT_STYLE: Record<ToastVariant, { background: string; border: string; color: string }> = {
  info: {
    background: "var(--paper2, #f3f4f6)",
    border: "1px solid var(--rule, #d1d5db)",
    color: "var(--ink2, #374151)",
  },
  pass: {
    background: "var(--pass-soft, #dcfce7)",
    border: "1px solid var(--pass, #16a34a)",
    color: "var(--pass, #16a34a)",
  },
  hold: {
    background: "var(--hold-soft, #fef3c7)",
    border: "1px solid var(--hold, #d97706)",
    color: "var(--hold, #d97706)",
  },
  stop: {
    background: "var(--stop-soft, #fee2e2)",
    border: "1px solid var(--stop, #dc2626)",
    color: "var(--stop, #dc2626)",
  },
};

interface SingleToastProps {
  readonly toast: ToastItem;
  readonly onDismiss: (id: string) => void;
}

function SingleToast({ toast, onDismiss }: SingleToastProps) {
  const style = VARIANT_STYLE[toast.variant];

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.lingerSeconds * 1000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.lingerSeconds, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "10px 14px",
        background: style.background,
        border: style.border,
        borderRadius: 4,
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        minWidth: 240,
        maxWidth: 380,
        pointerEvents: "auto",
      }}
    >
      <p
        style={{
          fontFamily: '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
          fontSize: 12,
          color: style.color,
          margin: 0,
          flex: 1,
          wordBreak: "break-word",
        }}
      >
        {toast.message}
      </p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="閉じる"
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize: 12,
          color: style.color,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0 2px",
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        zIndex: 1000,
        pointerEvents: "none",
      }}
      aria-label="通知"
    >
      {toasts.map((t) => (
        <SingleToast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
