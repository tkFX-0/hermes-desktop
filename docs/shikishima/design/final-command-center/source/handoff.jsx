// handoff.jsx — Design Tokens, A11y, Responsive rules, Component API spec,
// QA checklist, ClaudeCode implementation handoff.
// All design-only, JA-first, T()-ready. Uses primitives from earlier files.

// ════════════════════════════════════════════════════════════════
// Design Tokens + A11y + Responsive (combined card)
// ════════════════════════════════════════════════════════════════
function DesignTokensCard({ width = 1400 }) {
  const lang = useLang();
  return (
    <div style={{
      width, background: sk.paper, padding: '32px 36px',
      fontFamily: sk.sans, color: sk.ink,
      border: `1px solid ${sk.rule}`,
    }}>
      <FinalPageHead num="C7"
        title={T('Design Tokens · A11y · Responsive', 'Design Tokens · A11y · Responsive')}
        sub={T('実装に渡せる物量', 'production-grade hand-off detail')} />

      <div style={{
        marginTop: 22, display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 16,
      }}>
        {/* Colors */}
        <div>
          <SubHeadFinal label={T('Colors · 色トークン', 'Colors · color tokens')} tone="ok" />
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              ['--paper',  'paper',  'surface base'],
              ['--paper2', 'paper2', 'panel / card'],
              ['--paper3', 'paper3', 'divider / inset'],
              ['--ink',    'ink',    'text primary'],
              ['--ink2',   'ink2',   'text secondary'],
              ['--ink3',   'ink3',   'text tertiary / hint'],
              ['--rule',   'rule',   'strong line / border'],
            ].map(([v, k, note]) => (
              <SwatchRow key={v} cssVar={v} jsRef={`sk.${k}`} note={note} />
            ))}
          </div>
          <div style={{ height: 10 }}/>
          <SubHeadFinal label={T('State colors · 状態色', 'State colors')} tone="ok" />
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              ['--hold',     'HOLD',             'amber'],
              ['--go',       'GO_READY',         'blue'],
              ['--pass',     'PASS',             'green'],
              ['#9aa72f',    'PASS_WITH_CAVEAT', 'yellow-green'],
              ['--stop',     'STOP',             'red'],
              ['--reject',   'REJECT',           'dark red'],
              ['--ink3',     'DISABLED / UNKNOWN','gray'],
              ['--hold',     'STALE',            'amber'],
              ['--pass',     'CONNECTED',        'green'],
            ].map(([v, label, note]) => (
              <SwatchRow key={label} cssVar={v} jsRef={label} note={note} state />
            ))}
          </div>
        </div>

        {/* Typography + Spacing + Radius */}
        <div>
          <SubHeadFinal label={T('Typography · 書体', 'Typography')} tone="ok" />
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <TypeSample family={sk.jp}   name="jp"   sample={T('しきしま 操作室 — 状態を3秒で読む', 'しきしま 操作室 — 状態を3秒で読む')} />
            <TypeSample family={sk.sans} name="sans" sample="IBM Plex Sans — UI chrome / headings" />
            <TypeSample family={sk.mono} name="mono" sample="IBM Plex Mono — codes / flags / data" />
          </div>

          <div style={{ height: 14 }}/>
          <SubHeadFinal label={T('Spacing · 余白', 'Spacing')} tone="ok" />
          <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 28, 32, 36].map(n => (
              <div key={n} style={{
                fontFamily: sk.mono, fontSize: 10, color: sk.ink2,
                border: `1px solid ${sk.paper3}`,
                padding: '4px 8px', background: sk.paper2,
              }}>{n}</div>
            ))}
          </div>

          <div style={{ height: 14 }}/>
          <SubHeadFinal label={T('Radius / Borders / Shadows', 'Radius / Borders / Shadows')} tone="ok" />
          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            <ShapeSample label="radius=2" style={{ borderRadius: 2 }} />
            <ShapeSample label="radius=4" style={{ borderRadius: 4 }} />
            <ShapeSample label="border 1px" style={{ border: `1px solid ${sk.rule}` }} />
            <ShapeSample label="border 1.5" style={{ border: `1.5px solid ${sk.rule}` }} />
            <ShapeSample label="dashed" style={{ border: `1px dashed ${sk.rule}` }} />
            <ShapeSample label="no shadow" style={{}} />
          </div>
        </div>

        {/* A11y + Responsive */}
        <div>
          <SubHeadFinal label={T('Accessibility · A11y', 'Accessibility')} tone="ok" />
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {[
              T('ランプは色 + ラベルを必ず併記', 'lamps pair color with text label'),
              T('色だけで状態を示さない', 'never indicate state by color alone'),
              T('iPhone のタップ標的 44px 以上', 'tap target ≥ 44px on iPhone'),
              T('高コントラスト (WCAG AA 目安)', 'high contrast (WCAG AA baseline)'),
              T('キーボード focus 表示を残す', 'keep keyboard focus rings'),
              T('safe-area padding を尊重', 'respect safe-area padding'),
              T('小さい critical text を作らない', 'no tiny critical status text'),
              T('読込中も lamp 値は推定保持 + STALE バッジ', 'preserve last lamp value + STALE on load'),
            ].map((t, i) => (
              <div key={i} style={{
                fontFamily: lang === 'en' ? sk.sans : sk.jp,
                fontSize: 11.5, color: sk.ink, lineHeight: 1.5,
                padding: '6px 10px', background: sk.paper2,
                borderLeft: `3px solid ${sk.pass}`,
              }}>✓ {t}</div>
            ))}
          </div>

          <div style={{ height: 14 }}/>
          <SubHeadFinal label={T('Responsive · ブレークポイント', 'Responsive · breakpoints')} tone="ok" />
          <div style={{ marginTop: 10 }}>
            <BPRow label="mobile"     width="393"  use={T('iPhone 15 Pro 専用', 'iPhone 15 Pro target')} />
            <BPRow label="tablet"     width="768"  use={T('縦持ち端末 (将来)', 'portrait tablets (future)')} />
            <BPRow label="desktop"    width="1200" use={T('PC 操作室の基準幅', 'PC operator base')} />
            <BPRow label="wide"       width="1400" use={T('Inspector / Workflow', 'Inspector / Workflow')} />
          </div>

          <div style={{ height: 14 }}/>
          <SubHeadFinal label={T('Mobile 優先度', 'Mobile priority')} tone="ok" />
          <ol style={{
            margin: '8px 0 0', paddingLeft: 18,
            fontFamily: lang === 'en' ? sk.sans : sk.jp,
            fontSize: 11.5, color: sk.ink, lineHeight: 1.7,
          }}>
            <li>{T('メイン状態ランプ', 'main status lamp')}</li>
            <li>{T('次の人間アクション', 'next human action')}</li>
            <li>{T('チャット', 'chat')}</li>
            <li>{T('安全ランプ', 'safety lamps')}</li>
            <li>{T('StackChan ミニカード', 'StackChan mini card')}</li>
            <li>{T('詳細は展開時のみ', 'details only when opened')}</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function SwatchRow({ cssVar, jsRef, note, state }) {
  const isCss = cssVar.startsWith('--');
  const bg = isCss ? `var(${cssVar})` : cssVar;
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '24px 1fr 1fr 1fr',
      gap: 8, alignItems: 'center',
      padding: '3px 6px', borderBottom: `1px solid ${sk.paper3}`,
    }}>
      <div style={{
        width: 18, height: 18, background: bg,
        border: `1px solid ${sk.paper3}`,
      }}/>
      <code style={{ fontFamily: sk.mono, fontSize: 10.5, color: sk.ink2 }}>{cssVar}</code>
      <code style={{
        fontFamily: sk.mono, fontSize: 10.5,
        color: state ? sk.ink : sk.ink3,
      }}>{jsRef}</code>
      <span style={{ fontFamily: sk.mono, fontSize: 10, color: sk.ink3 }}>{note}</span>
    </div>
  );
}

function TypeSample({ family, name, sample }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '50px 1fr',
      gap: 10, alignItems: 'center',
      padding: '5px 8px', borderBottom: `1px solid ${sk.paper3}`,
    }}>
      <code style={{ fontFamily: sk.mono, fontSize: 10, color: sk.ink3 }}>sk.{name}</code>
      <span style={{ fontFamily: family, fontSize: 13, color: sk.ink }}>{sample}</span>
    </div>
  );
}

function ShapeSample({ label, style }) {
  return (
    <div style={{
      ...style,
      background: sk.paper2, border: style.border || `1px solid ${sk.paper3}`,
      padding: '14px 8px', textAlign: 'center',
    }}>
      <div style={{ fontFamily: sk.mono, fontSize: 10, color: sk.ink2 }}>{label}</div>
    </div>
  );
}

function BPRow({ label, width, use }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '70px 70px 1fr',
      gap: 10, alignItems: 'center',
      padding: '5px 8px', borderBottom: `1px solid ${sk.paper3}`,
    }}>
      <code style={{ fontFamily: sk.mono, fontSize: 11, color: sk.ink, fontWeight: 600 }}>{label}</code>
      <code style={{ fontFamily: sk.mono, fontSize: 11, color: sk.go }}>{width}px</code>
      <span style={{ fontFamily: sk.sans, fontSize: 11, color: sk.ink2 }}>{use}</span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Component API · TypeScript handoff
// ════════════════════════════════════════════════════════════════
function ComponentApiCard({ width = 1400 }) {
  const tsBlock = `// docs/shikishima/COMPONENT_API.md (design-only)
// React component shapes for the implementation phase. No source yet.

type DecisionState =
  | "HOLD" | "GO_READY" | "PASS" | "PASS_WITH_CAVEAT"
  | "STOP" | "REJECT" | "STALE" | "UNKNOWN" | "ERROR";

type StatusLampProps = {
  state:        DecisionState;
  label:        string;          // ja-first short phrase
  description?: string;
  updatedAt?:   string;          // ISO
};

type PageTabsProps = {
  active:
    | "operator" | "chat" | "stackchan"
    | "outbox" | "queue" | "go" | "evidence" | "stop" | "push"
    | "inspector" | "settings" | "help";
  compact?: boolean;
};

type ChatInputBarProps = {
  // SEND means in-app chat only. Label MUST include "しきしまへ送信"
  // or an equivalent unambiguous "chat-only" phrase.
  onSendChatLocal: (text: string) => Promise<{ ok: boolean }>;
  // TEMPLATE is copy-only.
  onCopyTemplate: () => Promise<void>;
  // Hard guarantees declared at type level:
  readonly noExternalSend: true;
  readonly noPush:         true;
  readonly noExecute:      true;
};

type StackChanFacePreviewProps = {
  decision: DecisionState;
  conn:
    | "DISCONNECTED" | "CONNECTING" | "CONNECTED" | "STALE" | "ERROR";
  // expression follows decision; OFFLINE override on disconnect.
  expression?:
    | "neutral" | "listening" | "thinking" | "holding"
    | "caution" | "rejected" | "review_ready" | "completed_static_only";
};

type CopyOnlyButtonProps = {
  kind: "copy" | "open" | "show";
  glyph?: string;
  // No \`onExecute\` here by design.
  onCopy?: () => void;
  onOpen?: () => void;
  onShow?: () => void;
};

type SafetyLampRowProps = {
  decision:            DecisionState;
  execution:           "disabled" | "enabled";
  productionReady:     boolean;
  externalWrite:       boolean;
  rawValuesReported:   boolean;
  runtime:             "stopped" | "running" | "unknown";
  stackChan?:          { conn: string; physical: "HOLD" | "disabled" };
};`;

  const componentList = [
    ['AppShell', 'top-level wrapper'],
    ['Topbar', 'wordmark + mode toggle'],
    ['PageTabs', 'canonical 12-tab nav'],
    ['SafetyStrip', 'always-on safety chips row'],
    ['StatusLamp / MiniLamp', 'decision indicator'],
    ['SafetyLampRow', 'invariant flag row'],
    ['NextActionCard', 'next human action'],
    ['ChatPanel', 'message list'],
    ['ChatInputBar', 'send-to-Shikishima + template'],
    ['CopyOnlyButton', 'copy / open / show variants'],
    ['InactiveStamp', 'visualized blocked actions'],
    ['InspectorDrawer', 'audit view collapsible'],
    ['EvidenceCard', 'gate evidence + checklist'],
    ['PushStatusCard', 'git readiness card'],
    ['StopHistoryCard', 'stop history rows'],
    ['StackChanMiniCard', 'operator-rail summary'],
    ['StackChanConnectionCard', 'banner state'],
    ['StackChanFacePreview', 'kaomoji face'],
    ['DraftCard', 'draft outbox tile'],
    ['QueueItemCard', 'queue row'],
    ['RiskBadge', 'risk label'],
    ['StateBadge', 'state pill'],
    ['Toast', '5 kinds: info/success/warning/stop/error'],
    ['Modal / Drawer', 'read-only mostly'],
    ['SettingsCard', 'preference group'],
    ['HelpCard', 'Q + answer'],
    ['EmptyState / LoadingState / ErrorState / StaleState', 'shared placeholders'],
  ];

  return (
    <div style={{
      width, background: sk.paper, padding: '32px 36px',
      fontFamily: sk.sans, color: sk.ink,
      border: `1px solid ${sk.rule}`,
    }}>
      <FinalPageHead num="C8"
        title={T('Component API Handoff (TypeScript)', 'Component API Handoff (TypeScript)')}
        sub={T('実装フェーズ向けの型定義 · 設計のみ', 'types for the implementation phase · design only')} />

      <div style={{
        marginTop: 22, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18,
      }}>
        <pre style={{
          margin: 0, padding: '16px 18px',
          background: sk.bar, color: sk.barText,
          fontFamily: sk.mono, fontSize: 11, lineHeight: 1.6,
          border: `1px solid ${sk.rule}`,
          overflow: 'auto', whiteSpace: 'pre',
          maxHeight: 640,
        }}>{tsBlock}</pre>

        <div>
          <SubHeadFinal label={T('実装対象コンポーネント', 'Components to implement')} tone="ok" />
          <div style={{
            marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4,
            maxHeight: 580, overflow: 'hidden',
          }}>
            {componentList.map(([name, note]) => (
              <div key={name} style={{
                display: 'grid', gridTemplateColumns: '1fr 1.4fr',
                gap: 10, alignItems: 'baseline',
                padding: '5px 8px',
                borderBottom: `1px solid ${sk.paper3}`,
              }}>
                <code style={{ fontFamily: sk.mono, fontSize: 11, color: sk.ink, fontWeight: 600 }}>{name}</code>
                <span style={{ fontFamily: sk.mono, fontSize: 10.5, color: sk.ink2 }}>{note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// QA / Acceptance + ClaudeCode Handoff (combined)
// ════════════════════════════════════════════════════════════════
const QA_CHECKS = [
  { ja: '全ページに canonical PageTabs が存在する',                en: 'every page renders the canonical PageTabs' },
  { ja: '主要ページに SafetyStrip が常時表示',                       en: 'primary pages always show SafetyStrip' },
  { ja: '危険そうなボタンは copy-only か absent',                    en: 'risky-looking buttons are copy-only or absent' },
  { ja: 'UI に push ボタンが存在しない',                              en: 'no push button exists in the UI' },
  { ja: 'UI に runtime 起動ボタンが存在しない',                       en: 'no runtime start button exists in the UI' },
  { ja: '外部 send / post / create / pay / reserve ボタンが無い',     en: 'no external send / post / create / pay / reserve buttons' },
  { ja: 'StackChan の物理操作ボタンが無い',                            en: 'no StackChan physical operation buttons' },
  { ja: 'voice / camera / mic 有効化ボタンが無い',                     en: 'no voice / camera / mic enable buttons' },
  { ja: 'Chat の送信が「しきしまへ送信」とラベリング',                  en: 'chat send labelled "Send to Shikishima"' },
  { ja: 'Chat 入力下に safety annotation が必ず表示',                  en: 'safety annotation always shown under chat input' },
  { ja: 'stale data は HOLD に fallback',                              en: 'stale data falls back to HOLD' },
  { ja: 'error data は HOLD に fallback',                              en: 'error data falls back to HOLD' },
  { ja: 'mobile のタップ標的は 44px 以上',                              en: 'mobile tap targets ≥ 44px' },
  { ja: 'Inspector は mobile では既定で折畳み',                         en: 'Inspector collapsed by default on mobile' },
  { ja: 'Settings から危険設定を有効化できない',                        en: 'Settings cannot enable risky capabilities' },
  { ja: 'Help が GO / HOLD / manual_copy_only を説明',                  en: 'Help explains GO / HOLD / manual_copy_only' },
  { ja: 'raw値 / token / IP / 秘密パス を表示しない',                   en: 'never shows raw values / tokens / IPs / secret paths' },
  { ja: 'LANG / THEME 切替が全画面で動く',                              en: 'LANG / THEME toggle works on every screen' },
];

function QaHandoffCard({ width = 1400 }) {
  const lang = useLang();
  return (
    <div style={{
      width, background: sk.paper, padding: '32px 36px',
      fontFamily: sk.sans, color: sk.ink,
      border: `1px solid ${sk.rule}`,
    }}>
      <FinalPageHead num="C9"
        title={T('QA & ClaudeCode Handoff', 'QA & ClaudeCode Handoff')}
        sub={T('受け入れ基準 + 実装引き継ぎ', 'acceptance checklist + implementation handoff')} />

      <div style={{
        marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18,
      }}>
        {/* QA */}
        <div>
          <SubHeadFinal label={T('QA · 受け入れチェック', 'QA · acceptance checks')} tone="ok" />
          <div style={{
            marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            {QA_CHECKS.map((c, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '20px 1fr',
                gap: 8, alignItems: 'baseline',
                padding: '6px 10px',
                background: sk.paper, border: `1px solid ${sk.paper3}`,
                borderLeft: `3px solid ${sk.pass}`,
              }}>
                <span style={{
                  fontFamily: sk.mono, fontSize: 11, color: sk.pass, fontWeight: 700,
                }}>✓</span>
                <span style={{
                  fontFamily: lang === 'en' ? sk.sans : sk.jp,
                  fontSize: 11.5, color: sk.ink, lineHeight: 1.5,
                }}>{lang === 'en' ? c.en : c.ja}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Handoff */}
        <div>
          <SubHeadFinal label={T('Handoff · 実装で触る可能性のあるファイル', 'Handoff · files likely affected')} tone="ok" />
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              'src/renderer/AppShell.tsx',
              'src/renderer/PageTabs.tsx',
              'src/renderer/components/ChatPanel.tsx',
              'src/renderer/components/ChatInputBar.tsx',
              'src/renderer/components/SafetyStrip.tsx',
              'src/renderer/pages/Operator/*',
              'src/renderer/pages/Chat/*',
              'src/renderer/pages/StackChan/*',
              'src/renderer/pages/Outbox/*',
              'src/renderer/pages/Queue/*',
              'src/renderer/pages/GO/*',
              'src/renderer/pages/Evidence/*',
              'src/renderer/pages/Stop/*',
              'src/renderer/pages/Push/*',
              'src/renderer/pages/Inspector/*',
              'src/renderer/pages/Settings/*',
              'src/renderer/pages/Help/*',
              'src/renderer/i18n/ja.ts',
              'src/preload/shikishima-bridge.ts',
              'src/main/shikishima/*-service.ts',
            ].map(f => (
              <code key={f} style={{
                fontFamily: sk.mono, fontSize: 10.5, color: sk.ink,
                padding: '4px 10px',
                background: sk.paper, border: `1px solid ${sk.paper3}`,
              }}>{f}</code>
            ))}
          </div>

          <div style={{ height: 14 }}/>
          <SubHeadFinal label={T('実装で してはいけないこと', 'Implementation must NOT')} tone="lock" />
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              T('execution を有効化', 'enable execution'),
              T('productionReady=true', 'set productionReady=true'),
              T('外部 write API を追加', 'add external write API'),
              T('UI に push を追加', 'add UI push'),
              T('UI に runtime 起動ボタンを追加', 'add UI runtime start button'),
              T('StackChan 物理操作を追加', 'add StackChan physical op'),
              T('voice / camera / mic 起動を追加', 'add voice / camera / mic activation'),
              T('別GO 無しで新規依存追加', 'add new dependency without separate GO'),
            ].map((s, i) => (
              <div key={i} style={{
                fontFamily: lang === 'en' ? sk.sans : sk.jp,
                fontSize: 11.5, color: sk.stop,
                padding: '4px 10px',
                border: `1px dashed ${sk.stop}`,
                background: sk.paper,
                textDecoration: 'line-through',
              }}>{s}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        marginTop: 22, padding: '14px 18px',
        background: sk.bar, color: sk.barText,
        fontFamily: sk.jp, fontSize: 13, lineHeight: 1.7,
      }}>
        <span style={{
          fontFamily: sk.mono, fontSize: 11, letterSpacing: 1.2,
          color: sk.barText2, marginRight: 10,
        }}>FINAL RULE</span>
        {T('不明・古い・矛盾・部分失敗の時は: HOLD を表示 · 理由を説明 · 次の安全な人間アクションを示す · コピー専用テンプレを提供 · 実行はしない。',
           'When uncertain, stale, inconsistent or partly failed: show HOLD · explain why · show next safe human action · offer copy-only template · do not execute.')}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Final deliverables index (summary card)
// ════════════════════════════════════════════════════════════════
function FinalIndexCard({ width = 1200 }) {
  const lang = useLang();
  const items = [
    'IA Map (§C1)',
    'User Flows A-F (§C2)',
    'Extended State Matrix (§C3)',
    'Empty / Loading / Error / Stale (§C4)',
    'Toast / Notification (§C5)',
    'Command Palette (§C6)',
    'Design Tokens · A11y · Responsive (§C7)',
    'Component API (TS) (§C8)',
    'QA · Handoff (§C9)',
    'Onboarding (mobile, 6 screens)',
    'Settings · Help (PC)',
    'Operator / Chat / StackChan / Outbox / Queue / GO / Evidence / STOP / Push / Inspector',
    'Backend Architecture · Service Map · Preload Contract · Phase Plan (§B)',
    'State Lamp Reference · Button Policy · Safety Wording',
  ];
  return (
    <div style={{
      width, background: sk.paper, padding: '32px 36px',
      fontFamily: sk.sans, color: sk.ink,
      border: `1px solid ${sk.rule}`,
    }}>
      <FinalPageHead num="C10"
        title={T('最終 Deliverables Index', 'Final Deliverables Index')}
        sub={T('このキャンバスに含まれるもの', 'everything contained in this canvas')} />

      <div style={{
        marginTop: 22,
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6,
      }}>
        {items.map((s, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '24px 1fr',
            gap: 10, alignItems: 'baseline',
            padding: '6px 10px',
            background: sk.paper2,
            border: `1px solid ${sk.paper3}`,
          }}>
            <span style={{
              fontFamily: sk.mono, fontSize: 10, color: sk.go, fontWeight: 700,
            }}>{String(i + 1).padStart(2, '0')}</span>
            <span style={{
              fontFamily: sk.sans, fontSize: 12, color: sk.ink,
            }}>{s}</span>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 18, padding: '12px 14px',
        background: sk.bar, color: sk.barText,
        fontFamily: lang === 'en' ? sk.sans : sk.jp,
        fontSize: 12.5, lineHeight: 1.7,
      }}>
        <span style={{
          fontFamily: sk.mono, fontSize: 10.5, letterSpacing: 1.2,
          color: sk.barText2, marginRight: 8,
        }}>NEXT</span>
        {T('ClaudeCode への引き渡しは docs-only から開始 (Phase B-1)。実装フェーズ B-2 以降は別GOが必須。',
           'Handoff to ClaudeCode begins docs-only (Phase B-1). Implementation B-2 and after requires a separate GO each.')}
      </div>
    </div>
  );
}

Object.assign(window, {
  DesignTokensCard, ComponentApiCard, QaHandoffCard, FinalIndexCard,
  QA_CHECKS,
});
