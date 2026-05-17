/**
 * CommandHelpPage — Safety policy, operational rules, and gate descriptions.
 * Static display only. No actions, no external links.
 */

interface CommandHelpPageProps {
  readonly lang?: "ja" | "en";
}

const SECTION: React.CSSProperties = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 8,
  padding: "14px",
  background: "var(--paper2, #f3f4f6)",
  border: "1px solid var(--rule, #e5e7eb)",
  borderRadius: 4,
};

const HEADING: React.CSSProperties = {
  fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
  fontSize: 10,
  letterSpacing: 2,
  color: "var(--ink3, #9ca3af)",
  margin: "0 0 4px",
};

const BODY_STYLE = (lang: "ja" | "en"): React.CSSProperties => ({
  fontFamily:
    lang === "en"
      ? '"IBM Plex Sans", "Inter", system-ui, sans-serif'
      : '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
  fontSize: 11,
  color: "var(--ink2, #374151)",
  margin: 0,
  lineHeight: 1.6,
});

interface RuleItemProps {
  readonly label: string;
  readonly value: string;
  readonly variant?: "hold" | "pass" | "stop" | "neutral";
  readonly lang: "ja" | "en";
}

function RuleItem({ label, value, variant = "neutral", lang }: RuleItemProps) {
  const color =
    variant === "hold"
      ? "var(--hold, #d97706)"
      : variant === "pass"
        ? "var(--pass, #16a34a)"
        : variant === "stop"
          ? "var(--stop, #dc2626)"
          : "var(--ink, #111827)";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "5px 0",
        borderBottom: "1px solid var(--rule, #e5e7eb)",
      }}
    >
      <span
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize: 10,
          color: "var(--ink3, #9ca3af)",
          minWidth: 160,
          flexShrink: 0,
          paddingTop: 1,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily:
            lang === "en"
              ? '"IBM Plex Mono", ui-monospace, monospace'
              : '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
          fontSize: 11,
          color,
          fontWeight: variant !== "neutral" ? 600 : 400,
        }}
      >
        {value}
      </span>
    </div>
  );
}

const SAFETY_INVARIANTS_JA: readonly { label: string; value: string; variant: RuleItemProps["variant"] }[] = [
  { label: "productionReady", value: "false（恒久的ロック）", variant: "hold" },
  { label: "execution", value: "disabled（恒久的ロック）", variant: "hold" },
  { label: "rawValuesReported", value: "false（表示値は全て要約/REDACTED済み）", variant: "hold" },
  { label: "externalWrite", value: "false（外部送信不可）", variant: "hold" },
  { label: "physicalOperation", value: "false（StackChan物理操作不可）", variant: "hold" },
];

const SAFETY_INVARIANTS_EN: readonly { label: string; value: string; variant: RuleItemProps["variant"] }[] = [
  { label: "productionReady", value: "false (permanently locked)", variant: "hold" },
  { label: "execution", value: "disabled (permanently locked)", variant: "hold" },
  { label: "rawValuesReported", value: "false (display values are always summarized/redacted)", variant: "hold" },
  { label: "externalWrite", value: "false (no external writes)", variant: "hold" },
  { label: "physicalOperation", value: "false (StackChan physical ops blocked)", variant: "hold" },
];

const DECISION_TABLE_JA: readonly { state: string; meaning: string; variant: RuleItemProps["variant"] }[] = [
  { state: "HOLD", meaning: "操作不可。データ未受信またはstale。人間の確認待ち。", variant: "hold" },
  { state: "GO_READY", meaning: "人間GOが揃った。次アクションは人間のみ実施可。", variant: "pass" },
  { state: "PASS", meaning: "前回アクション完了・正常。次アクションはHOLDから再確認。", variant: "pass" },
  { state: "PASS_WITH_CAVEAT", meaning: "完了だが条件付き注意事項あり。", variant: "neutral" },
  { state: "STOP", meaning: "異常検知。即時停止。人間介入必須。", variant: "stop" },
  { state: "STALE", meaning: "データ期限切れ。常にHOLDへフォールバック。", variant: "hold" },
];

const DECISION_TABLE_EN: readonly { state: string; meaning: string; variant: RuleItemProps["variant"] }[] = [
  { state: "HOLD", meaning: "No action allowed. Data not received or stale. Awaiting human confirmation.", variant: "hold" },
  { state: "GO_READY", meaning: "Human GO received. Next action by human only.", variant: "pass" },
  { state: "PASS", meaning: "Previous action completed normally. Next action requires re-confirmation from HOLD.", variant: "pass" },
  { state: "PASS_WITH_CAVEAT", meaning: "Completed with conditional caveats.", variant: "neutral" },
  { state: "STOP", meaning: "Anomaly detected. Immediate stop. Human intervention required.", variant: "stop" },
  { state: "STALE", meaning: "Data expired. Always falls back to HOLD.", variant: "hold" },
];

const GATE_LIST_JA: readonly { gate: string; title: string; status: string }[] = [
  { gate: "Gate 001", title: "初期アーキテクチャ確定", status: "PASS" },
  { gate: "Gate 002", title: "Electron IPC 基盤", status: "PASS" },
  { gate: "Gate 003", title: "スナップショット + Redaction 基盤", status: "PASS" },
  { gate: "Gate 004", title: "監査準備 + dry-run 分類", status: "PASS" },
  { gate: "Gate 005", title: "productionReady 事前チェック", status: "HOLD" },
  { gate: "Gate 006", title: "制御下ランタイム観測", status: "PASS" },
  { gate: "Gate 007", title: "GO/承認ワーディング強化", status: "PASS" },
];

const GATE_LIST_EN: readonly { gate: string; title: string; status: string }[] = [
  { gate: "Gate 001", title: "Initial architecture confirmed", status: "PASS" },
  { gate: "Gate 002", title: "Electron IPC foundation", status: "PASS" },
  { gate: "Gate 003", title: "Snapshot + redaction foundation", status: "PASS" },
  { gate: "Gate 004", title: "Audit readiness + dry-run classification", status: "PASS" },
  { gate: "Gate 005", title: "productionReady pre-check", status: "HOLD" },
  { gate: "Gate 006", title: "Controlled runtime observation", status: "PASS" },
  { gate: "Gate 007", title: "GO/approval wording hardening", status: "PASS" },
];

export function CommandHelpPage({ lang = "ja" }: CommandHelpPageProps) {
  const invariants = lang === "ja" ? SAFETY_INVARIANTS_JA : SAFETY_INVARIANTS_EN;
  const decisionTable = lang === "ja" ? DECISION_TABLE_JA : DECISION_TABLE_EN;
  const gateList = lang === "ja" ? GATE_LIST_JA : GATE_LIST_EN;

  return (
    <div
      style={{
        padding: "18px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        maxWidth: 700,
      }}
    >
      {/* Page header */}
      <div>
        <p
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 10,
            letterSpacing: 2,
            color: "var(--ink3, #9ca3af)",
            margin: "0 0 2px",
          }}
        >
          {lang === "ja" ? "ヘルプ / 安全方針" : "HELP / SAFETY POLICY"}
        </p>
        <p style={BODY_STYLE(lang)}>
          {lang === "ja"
            ? "このアプリはコマンドセンターのモニタリングUIです。外部への書き込み・実行・物理操作はすべてHOLDです。"
            : "This app is a Command Center monitoring UI. All external writes, execution, and physical operations are HOLD."}
        </p>
      </div>

      {/* Safety invariants */}
      <div style={SECTION}>
        <p style={HEADING}>
          {lang === "ja" ? "安全不変条件" : "SAFETY INVARIANTS"}
        </p>
        {invariants.map((row) => (
          <RuleItem
            key={row.label}
            label={row.label}
            value={row.value}
            variant={row.variant}
            lang={lang}
          />
        ))}
      </div>

      {/* Decision state table */}
      <div style={SECTION}>
        <p style={HEADING}>
          {lang === "ja" ? "判定ステート一覧" : "DECISION STATE REFERENCE"}
        </p>
        {decisionTable.map((row) => (
          <div
            key={row.state}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "5px 0",
              borderBottom: "1px solid var(--rule, #e5e7eb)",
            }}
          >
            <span
              style={{
                fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                fontSize: 10,
                color:
                  row.variant === "pass"
                    ? "var(--pass, #16a34a)"
                    : row.variant === "stop"
                      ? "var(--stop, #dc2626)"
                      : row.variant === "hold"
                        ? "var(--hold, #d97706)"
                        : "var(--ink3, #9ca3af)",
                fontWeight: 700,
                minWidth: 140,
                flexShrink: 0,
                paddingTop: 1,
              }}
            >
              {row.state}
            </span>
            <span style={BODY_STYLE(lang)}>{row.meaning}</span>
          </div>
        ))}
      </div>

      {/* Gate status */}
      <div style={SECTION}>
        <p style={HEADING}>
          {lang === "ja" ? "ゲート進捗（しきしま計画）" : "GATE PROGRESS (ICHIKISHIMA)"}
        </p>
        {gateList.map((row) => (
          <div
            key={row.gate}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "5px 0",
              borderBottom: "1px solid var(--rule, #e5e7eb)",
            }}
          >
            <span
              style={{
                fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                fontSize: 10,
                color: "var(--ink3, #9ca3af)",
                minWidth: 70,
                flexShrink: 0,
              }}
            >
              {row.gate}
            </span>
            <span
              style={{
                fontFamily:
                  lang === "en"
                    ? '"IBM Plex Sans", "Inter", system-ui, sans-serif'
                    : '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
                fontSize: 11,
                color: "var(--ink2, #374151)",
                flex: 1,
              }}
            >
              {row.title}
            </span>
            <span
              style={{
                fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                fontSize: 10,
                fontWeight: 700,
                color:
                  row.status === "PASS"
                    ? "var(--pass, #16a34a)"
                    : row.status === "HOLD"
                      ? "var(--hold, #d97706)"
                      : "var(--ink3, #9ca3af)",
                border: `1px solid ${row.status === "PASS" ? "var(--pass, #16a34a)" : "var(--hold, #d97706)"}`,
                padding: "1px 6px",
                borderRadius: 2,
              }}
            >
              {row.status}
            </span>
          </div>
        ))}
      </div>

      {/* Locked capabilities reminder */}
      <div
        style={{
          ...SECTION,
          border: "1px solid var(--hold, #d97706)",
          background: "var(--hold-soft, #fef3c7)",
        }}
      >
        <p
          style={{
            ...HEADING,
            color: "var(--hold, #d97706)",
          }}
        >
          {lang === "ja" ? "HOLDの機能一覧" : "HOLD CAPABILITIES"}
        </p>
        {(lang === "ja"
          ? [
              "productionReady: true への変更",
              "execution の有効化",
              "外部書き込み（メール・カレンダー・GitHub等）",
              "StackChan 物理操作",
              "voice / camera / mic の有効化",
              "git push（ClaudeCode GOが必要）",
            ]
          : [
              "Change productionReady to true",
              "Enable execution",
              "External writes (email, calendar, GitHub, etc.)",
              "StackChan physical operation",
              "Enable voice / camera / mic",
              "git push (requires ClaudeCode GO)",
            ]
        ).map((item) => (
          <p
            key={item}
            style={{
              fontFamily:
                lang === "en"
                  ? '"IBM Plex Sans", "Inter", system-ui, sans-serif'
                  : '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
              fontSize: 11,
              color: "var(--hold, #d97706)",
              margin: 0,
              paddingLeft: 6,
            }}
          >
            {lang === "ja" ? "🔒 " : ""}
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
