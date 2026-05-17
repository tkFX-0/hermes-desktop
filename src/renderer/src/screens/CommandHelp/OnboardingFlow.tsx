/**
 * OnboardingFlow — First-run onboarding wizard.
 * Static + step-navigation only. No external calls. No data writes.
 * Calls onComplete when the user reaches the final step.
 */

import { useState } from "react";

interface OnboardingFlowProps {
  readonly onComplete: () => void;
  readonly lang?: "ja" | "en";
}

interface Step {
  readonly id: string;
  readonly titleJa: string;
  readonly titleEn: string;
  readonly bodyJa: readonly string[];
  readonly bodyEn: readonly string[];
  readonly highlight?: "hold" | "pass" | "neutral";
}

const STEPS: readonly Step[] = [
  {
    id: "welcome",
    titleJa: "ようこそ — コマンドセンターへ",
    titleEn: "Welcome to Command Center",
    bodyJa: [
      "このアプリはしきしま計画のコマンドセンターUIです。",
      "すべての操作は「表示・コピー・ローカルチャット」に限定されています。",
      "外部への書き込み・push・実行はいずれもHOLDです。",
    ],
    bodyEn: [
      "This app is the Command Center UI for the Ichikishima project.",
      "All operations are limited to display, copy, and local chat.",
      "External writes, push, and execution are all HOLD.",
    ],
    highlight: "neutral",
  },
  {
    id: "safety-invariants",
    titleJa: "安全不変条件",
    titleEn: "Safety Invariants",
    bodyJa: [
      "productionReady: false — 変更不可",
      "execution: disabled — 変更不可",
      "rawValuesReported: false — 表示値は全て要約済み",
      "externalWrite: false — 外部送信は行いません",
      "physicalOperation: false — StackChan操作は行いません",
      "",
      "これらは全てTypeScriptのリテラル型として実装されています。",
    ],
    bodyEn: [
      "productionReady: false — immutable",
      "execution: disabled — immutable",
      "rawValuesReported: false — all display values are summarized",
      "externalWrite: false — no external sends",
      "physicalOperation: false — no StackChan physical ops",
      "",
      "These are enforced as TypeScript literal types throughout.",
    ],
    highlight: "hold",
  },
  {
    id: "decision-states",
    titleJa: "判定ステートについて",
    titleEn: "Decision States",
    bodyJa: [
      "HOLD — データなし・stale・操作不可。常にデフォルト。",
      "GO_READY — 人間GOが揃った状態。次アクションは人間が実施。",
      "PASS — 前回アクション正常完了。",
      "STOP — 異常検知。人間介入が必須。",
      "",
      "staleデータは常にHOLDにフォールバックします。",
      "GO_READY / PASSが表示されても、実行は人間のみが判断します。",
    ],
    bodyEn: [
      "HOLD — No data, stale, or action blocked. Always the default.",
      "GO_READY — Human GO received. Next action by human only.",
      "PASS — Previous action completed normally.",
      "STOP — Anomaly detected. Human intervention required.",
      "",
      "Stale data always falls back to HOLD.",
      "Even when GO_READY/PASS is shown, execution is human-only.",
    ],
    highlight: "neutral",
  },
  {
    id: "pages",
    titleJa: "ページ構成",
    titleEn: "Page Layout",
    bodyJa: [
      "Operator — メイン状態パネル（ランプグリッド）",
      "Chat — ローカルチャット（外部未接続）",
      "StackChan — 接続状態モニター",
      "Outbox — 下書き確認（表示のみ）",
      "Queue — 承認キュー（表示のみ）",
      "GO — GO判定パネル（表示のみ）",
      "Evidence — 証跡ログ（表示のみ）",
      "Stop — STOPイベント履歴",
      "Push — push準備状態（表示のみ）",
      "Settings — ローカル設定",
    ],
    bodyEn: [
      "Operator — Main status panel (lamp grid)",
      "Chat — Local chat (no external connection)",
      "StackChan — Connection status monitor",
      "Outbox — Draft review (display only)",
      "Queue — Approval queue (display only)",
      "GO — GO decision panel (display only)",
      "Evidence — Evidence log (display only)",
      "Stop — STOP event history",
      "Push — Push readiness (display only)",
      "Settings — Local preferences",
    ],
    highlight: "neutral",
  },
  {
    id: "complete",
    titleJa: "準備完了",
    titleEn: "Ready",
    bodyJa: [
      "オンボーディング完了です。",
      "",
      "このヘルプページはいつでも「ヘルプ」タブから確認できます。",
      "設定は「設定」タブで変更できます。",
      "",
      "不明点はClaudeCodeのGOを待ってください。",
    ],
    bodyEn: [
      "Onboarding complete.",
      "",
      "This help page is always available from the Help tab.",
      "Preferences can be changed in the Settings tab.",
      "",
      "For any questions, await ClaudeCode GO.",
    ],
    highlight: "pass",
  },
];

export function OnboardingFlow({ onComplete, lang = "ja" }: OnboardingFlowProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;

  const highlightColor =
    step.highlight === "hold"
      ? "var(--hold, #d97706)"
      : step.highlight === "pass"
        ? "var(--pass, #16a34a)"
        : "var(--ink3, #9ca3af)";

  const bodyLines = lang === "ja" ? step.bodyJa : step.bodyEn;

  return (
    <div
      style={{
        padding: "24px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        maxWidth: 560,
        margin: "0 auto",
      }}
    >
      {/* Step indicator */}
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {STEPS.map((s, i) => (
          <div
            key={s.id}
            style={{
              width: i === stepIndex ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background:
                i < stepIndex
                  ? "var(--pass, #16a34a)"
                  : i === stepIndex
                    ? highlightColor
                    : "var(--rule, #e5e7eb)",
              transition: "width 0.2s ease, background 0.2s ease",
            }}
            aria-hidden
          />
        ))}
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 9,
            color: "var(--ink3, #9ca3af)",
            marginLeft: 4,
          }}
        >
          {stepIndex + 1} / {STEPS.length}
        </span>
      </div>

      {/* Step content */}
      <div
        style={{
          padding: "20px",
          background: "var(--paper2, #f3f4f6)",
          border: `1px solid ${highlightColor}`,
          borderRadius: 6,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          minHeight: 200,
        }}
      >
        <p
          style={{
            fontFamily:
              lang === "en"
                ? '"IBM Plex Sans", "Inter", system-ui, sans-serif'
                : '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
            fontSize: 15,
            fontWeight: 700,
            color: highlightColor,
            margin: 0,
          }}
        >
          {lang === "ja" ? step.titleJa : step.titleEn}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {bodyLines.map((line, i) =>
            line === "" ? (
              <div key={i} style={{ height: 6 }} />
            ) : (
              <p
                key={i}
                style={{
                  fontFamily:
                    lang === "en"
                      ? '"IBM Plex Mono", ui-monospace, monospace'
                      : '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
                  fontSize: 11,
                  color: "var(--ink2, #374151)",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {line}
              </p>
            )
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        {!isFirst && (
          <button
            type="button"
            onClick={() => setStepIndex((i) => i - 1)}
            aria-label={lang === "ja" ? "前のステップ" : "Previous step"}
            style={{
              padding: "8px 16px",
              fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif',
              fontSize: 12,
              color: "var(--ink2, #374151)",
              background: "var(--paper, #ffffff)",
              border: "1px solid var(--rule, #d1d5db)",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {lang === "ja" ? "戻る" : "Back"}
          </button>
        )}
        {!isLast ? (
          <button
            type="button"
            onClick={() => setStepIndex((i) => i + 1)}
            aria-label={lang === "ja" ? "次のステップ" : "Next step"}
            style={{
              padding: "8px 20px",
              fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif',
              fontSize: 12,
              color: "var(--paper, #ffffff)",
              background: highlightColor,
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {lang === "ja" ? "次へ" : "Next"}
          </button>
        ) : (
          <button
            type="button"
            onClick={onComplete}
            aria-label={lang === "ja" ? "完了" : "Complete onboarding"}
            style={{
              padding: "8px 24px",
              fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif',
              fontSize: 12,
              fontWeight: 700,
              color: "var(--paper, #ffffff)",
              background: "var(--pass, #16a34a)",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {lang === "ja" ? "完了" : "Done"}
          </button>
        )}
      </div>
    </div>
  );
}
