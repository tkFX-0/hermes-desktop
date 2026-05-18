/**
 * OutboxPage — Draft Outbox display.
 * Draft-only. No send, create, pay, or reserve.
 * Copy draft content button only.
 */

import type { UIDraftOutboxItem } from "../../types/service-contracts";
import { InactiveStamp } from "../../components/Shell/InactiveStamp";

interface OutboxPageProps {
  readonly items: readonly UIDraftOutboxItem[];
  readonly onCopy: (id: string, content: string) => void;
  readonly stale?: boolean;
  readonly lang?: "ja" | "en";
}

const STATE_LABEL: Record<string, { ja: string; en: string; color: string }> =
  {
    draft_only: { ja: "下書き", en: "Draft", color: "var(--ink3, #6b7280)" },
    waiting_human: {
      ja: "人間レビュー待ち",
      en: "Waiting review",
      color: "var(--hold, #d97706)",
    },
    held: { ja: "HOLD", en: "HOLD", color: "var(--hold, #d97706)" },
    rejected: {
      ja: "却下",
      en: "Rejected",
      color: "var(--reject, #991b1b)",
    },
    expired: { ja: "期限切れ", en: "Expired", color: "var(--ink3, #6b7280)" },
    archived: { ja: "アーカイブ", en: "Archived", color: "var(--ink3, #6b7280)" },
  };

export function OutboxPage({
  items,
  onCopy,
  stale = false,
  lang = "ja",
}: OutboxPageProps) {
  return (
    <div style={{ padding: "var(--page-pd-v, 18px) var(--page-pd-h, 22px)", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <p style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, letterSpacing: 2, color: "var(--ink3, #9ca3af)", margin: 0 }}>
          {lang === "ja" ? "下書き · OUTBOX" : "DRAFT OUTBOX"}
        </p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <InactiveStamp label={lang === "ja" ? "送信" : "send"} lang={lang} />
          <InactiveStamp label={lang === "ja" ? "作成" : "create"} lang={lang} />
        </div>
      </div>

      {stale && (
        <div style={{ padding: "6px 12px", background: "var(--hold-soft, #fef3c7)", border: "1px solid var(--hold, #d97706)", borderRadius: 3, fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "var(--hold, #d97706)" }}>
          STALE
        </div>
      )}

      {items.length === 0 ? (
        <p style={{ fontFamily: '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif', fontSize: 13, color: "var(--ink3, #9ca3af)", textAlign: "center", padding: "40px 0" }}>
          {lang === "ja" ? "下書きはありません" : "No drafts"}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((item) => {
            const s = STATE_LABEL[item.draftState] ?? STATE_LABEL.draft_only!;
            return (
              <div key={item.id} style={{ padding: "12px 14px", background: "var(--paper2, #f3f4f6)", border: "1px solid var(--rule, #e5e7eb)", borderRadius: 4 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: s.color, border: `1px solid ${s.color}`, padding: "1px 6px", borderRadius: 2 }}>
                      {lang === "ja" ? s.ja : s.en}
                    </span>
                    <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "var(--ink3, #9ca3af)" }}>
                      {item.category}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCopy(item.id, item.contentSafe)}
                    aria-label={lang === "ja" ? "下書きをコピー" : "Copy draft"}
                    style={{ padding: "4px 10px", fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 11, color: "var(--ink, #111827)", background: "var(--paper, #ffffff)", border: "1px solid var(--rule, #e5e7eb)", borderRadius: 3, cursor: "pointer" }}
                  >
                    {lang === "ja" ? "コピー" : "Copy"}
                  </button>
                </div>
                <p style={{ fontFamily: '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif', fontSize: 12, color: "var(--ink2, #374151)", margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" as const }}>
                  {item.contentSafe}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
