/**
 * GoPage — GO template copy-only page.
 * Templates are copy-only. System does NOT execute on copy.
 * GO is a human authorization phrase, not a button action.
 */

interface GoTemplate {
  readonly id: string;
  readonly title: string;
  readonly content: string;
}

interface GoPageProps {
  readonly templates: readonly GoTemplate[];
  readonly onCopyTemplate: (id: string, content: string) => void;
  readonly currentObsStatus?: string;
  readonly stale?: boolean;
  readonly lang?: "ja" | "en";
}

const NOTE = {
  ja: "これはコピー用テンプレートです。自動実行は行いません。",
  en: "These are copy-only templates. System does not execute automatically.",
} as const;

export function GoPage({
  templates,
  onCopyTemplate,
  currentObsStatus,
  stale = false,
  lang = "ja",
}: GoPageProps) {
  return (
    <div style={{ padding: "var(--page-pd-v, 18px) var(--page-pd-h, 22px)", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <p style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, letterSpacing: 2, color: "var(--ink3, #9ca3af)", margin: 0 }}>
          GO
        </p>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "var(--ink3, #9ca3af)" }}>
          COPY_ONLY
        </span>
      </div>

      {/* Safety note */}
      <div style={{ padding: "8px 12px", background: "var(--paper2, #f3f4f6)", border: "1px solid var(--rule, #e5e7eb)", borderRadius: 3 }}>
        <p style={{ fontFamily: lang === "en" ? '"IBM Plex Sans", "Inter", system-ui, sans-serif' : '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif', fontSize: 11, color: "var(--ink2, #374151)", margin: 0 }}>
          {NOTE[lang]}
        </p>
      </div>

      {currentObsStatus && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "var(--ink3, #9ca3af)" }}>
            {lang === "ja" ? "観察状態:" : "Observation status:"}
          </span>
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "var(--ink, #111827)" }}>
            {currentObsStatus}
          </span>
          {stale && (
            <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 9, color: "var(--hold, #d97706)", border: "1px solid var(--hold, #d97706)", padding: "0 4px", borderRadius: 2 }}>
              STALE
            </span>
          )}
        </div>
      )}

      {templates.length === 0 ? (
        <p style={{ fontFamily: '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif', fontSize: 13, color: "var(--ink3, #9ca3af)", textAlign: "center", padding: "40px 0" }}>
          {lang === "ja" ? "GOテンプレートはありません" : "No GO templates"}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {templates.map((t) => (
            <div key={t.id} style={{ border: "1px solid var(--rule, #e5e7eb)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", background: "var(--paper2, #f3f4f6)", borderBottom: "1px solid var(--rule, #e5e7eb)" }}>
                <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 12, fontWeight: 600, color: "var(--ink, #111827)" }}>
                  {t.title}
                </span>
                <button
                  type="button"
                  onClick={() => onCopyTemplate(t.id, t.content)}
                  aria-label={`${lang === "ja" ? "GOフレーズをコピー" : "Copy GO phrase"}: ${t.title}`}
                  style={{ padding: "4px 10px", fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 11, color: "var(--go, #2563eb)", background: "var(--paper, #ffffff)", border: "1px solid var(--go, #2563eb)", borderRadius: 3, cursor: "pointer" }}
                >
                  {lang === "ja" ? "GOフレーズをコピー" : "Copy GO phrase"}
                </button>
              </div>
              <pre style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 11, color: "var(--ink, #111827)", margin: 0, padding: "12px 14px", background: "var(--paper, #ffffff)", whiteSpace: "pre-wrap" as const, wordBreak: "break-word" as const }}>
                {t.content}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
