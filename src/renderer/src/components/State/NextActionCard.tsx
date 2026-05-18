/**
 * NextActionCard — Context-aware next human action card.
 * Design spec: desktop.jsx NextActionCard.
 * Display-only. No buttons. No actions from this UI.
 * Shows HUMAN ONLY tag — never implies automated execution.
 */

interface NextActionContent {
  readonly tag: { ja: string; en: string };
  readonly title: { ja: string; en: string };
  readonly body: { ja: string; en: string };
}

const DECISION_ACTIONS: Record<string, NextActionContent> = {
  HOLD: {
    tag:   { ja: "レビュー · 約30秒", en: "REVIEW · ~30s" },
    title: { ja: "最新状態を確認してください。",
             en: "Please confirm the current state." },
    body:  { ja: "HOLDは安全側です。スナップショットを更新し、状況を確認してから次のアクションを検討してください。",
             en: "HOLD is the safe state. Refresh the snapshot, review the situation, then decide the next action." },
  },
  GO_READY: {
    tag:   { ja: "承認 · 90秒", en: "APPROVE · 90s" },
    title: { ja: "GOテンプレートをコピーし、別チャネルで承認してください。",
             en: "Copy the GO template and approve on a separate channel." },
    body:  { ja: "このUIではGOは送信されません。テンプレを別チャネル（チーム / CLI）に貼ってから承認操作を行ってください。",
             en: "GO is never sent from this UI. Paste the template into another channel (team / CLI) and perform the approval there." },
  },
  PASS: {
    tag:   { ja: "観測 · 5分", en: "OBSERVE · 5m" },
    title: { ja: "Gate通過。次のGateの観測を開始してください。",
             en: "Gate passed. Start observation for the next gate." },
    body:  { ja: "前回Gateは通過しました。次のGateでは外部影響を観測のみ。書込みは引き続き禁止です。",
             en: "Previous gate passed. At the next gate observe external effects only. Writes remain prohibited." },
  },
  PASS_WITH_CAVEAT: {
    tag:   { ja: "確認 · 5分", en: "REVIEW · 5m" },
    title: { ja: "注意事項を確認してから次のGateへ進んでください。",
             en: "Review caveats before advancing to the next gate." },
    body:  { ja: "通過しましたが条件付きです。注意事項をすべて確認し、問題がないことを人間が確認してください。",
             en: "Passed with conditions. Human must verify all caveats are understood before advancing." },
  },
  STOP: {
    tag:   { ja: "調査", en: "INVESTIGATE" },
    title: { ja: "停止理由を確認し、解除条件を満たすまで待機してください。",
             en: "Check the STOP reason and wait until release conditions are met." },
    body:  { ja: "解除はCLIから人間操作のみです。Inspectorで詳細を確認し、安全を確認してから解除を検討してください。",
             en: "Release is human-only via CLI. Check details in Inspector and verify safety before considering release." },
  },
  REJECT: {
    tag:   { ja: "書き直し", en: "REWRITE" },
    title: { ja: "却下理由を確認し、再提出を作成してください。",
             en: "Review the reject reason and prepare a resubmission." },
    body:  { ja: "再提出は別Gateで人間レビューに戻ります。自動再投稿は行われません。",
             en: "Resubmissions return to human review at a separate gate. No automatic re-post." },
  },
  STALE: {
    tag:   { ja: "更新 · 30秒", en: "REFRESH · 30s" },
    title: { ja: "スナップショットを更新してください。",
             en: "Please refresh the snapshot." },
    body:  { ja: "データが古くなっています。安全のためHOLDとして扱います。更新後に状態を再確認してください。",
             en: "Data is stale. Treated as HOLD for safety. Re-verify state after refreshing." },
  },
  UNKNOWN: {
    tag:   { ja: "確認", en: "CHECK" },
    title: { ja: "状態が不明です。Inspectorで確認してください。",
             en: "State is unknown. Check via Inspector." },
    body:  { ja: "状態が確定していません。安全のためHOLDとして扱います。Inspectorでログを確認してください。",
             en: "State is not determined. Treated as HOLD for safety. Review logs in Inspector." },
  },
  ERROR: {
    tag:   { ja: "確認", en: "CHECK" },
    title: { ja: "状態を確認できません。Inspectorでログを確認してください。",
             en: "Cannot read state. Check logs in Inspector." },
    body:  { ja: "状態の読み取りに失敗しました。安全のためHOLDとして扱います。",
             en: "Failed to read state. Treated as HOLD for safety." },
  },
};

interface NextActionCardProps {
  readonly decision: string;
  /** Override the default text for specific context */
  readonly customAction?: string;
  readonly lang?: "ja" | "en";
}

export function NextActionCard({
  decision,
  customAction,
  lang = "ja",
}: NextActionCardProps) {
  const content = DECISION_ACTIONS[decision] ?? DECISION_ACTIONS["HOLD"]!;
  const tag = lang === "ja" ? content.tag.ja : content.tag.en;
  const title = customAction ?? (lang === "ja" ? content.title.ja : content.title.en);
  const body = lang === "ja" ? content.body.ja : content.body.en;

  const jp = lang === "ja";

  return (
    <div
      role="status"
      aria-label={lang === "ja" ? "次の必要アクション" : "Required human action"}
      style={{
        border: "1.5px solid var(--rule, #e5e7eb)",
        background: "var(--paper, #ffffff)",
        borderRadius: 4,
        overflow: "hidden",
        minHeight: 96,
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "7px 14px",
          background: "var(--bar, #1a1f2e)",
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 10,
            letterSpacing: 1.2,
            color: "var(--bar-text, #f9fafb)",
          }}
        >
          {lang === "ja" ? "HUMAN · 次の必要アクション" : "HUMAN · required action"}
        </span>
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 10,
            color: "var(--bar-text-2, #9ca3af)",
            whiteSpace: "nowrap",
          }}
        >
          {tag}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
        <p
          style={{
            fontFamily: jp
              ? '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif'
              : '"IBM Plex Sans", "Inter", system-ui, sans-serif',
            fontSize: 14,
            fontWeight: 600,
            color: "var(--ink, #111827)",
            margin: 0,
            lineHeight: 1.45,
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontFamily: jp
              ? '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif'
              : '"IBM Plex Sans", "Inter", system-ui, sans-serif',
            fontSize: 11,
            color: "var(--ink2, #374151)",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}
