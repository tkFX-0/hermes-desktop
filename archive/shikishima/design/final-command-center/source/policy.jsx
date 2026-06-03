// policy.jsx — reference cards: state lamps, button policy, safety wording.
// All strings via T(ja, en).

// ── State lamp reference ─────────────────────────────────────
function LampSpecCard({ width = 1200 }) {
  return (
    <div style={{
      width, background: sk.paper, padding: '32px 36px',
      fontFamily: sk.sans, color: sk.ink,
      border: `1px solid ${sk.rule}`,
    }}>
      <PageHead num="01"
        title={T('状態ランプ定義', 'State Lamps')}
        sub="HOLD / GO_READY / PASS / STOP / REJECT" />

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14,
        marginTop: 18,
      }}>
        {['HOLD', 'GO_READY', 'PASS', 'STOP', 'REJECT'].map(k => (
          <LampSpec key={k} k={k} />
        ))}
      </div>

      <div style={{
        marginTop: 28, padding: '14px 18px',
        border: `1px dashed ${sk.rule}`,
        fontFamily: sk.jp, fontSize: 13, color: sk.ink, lineHeight: 1.7,
      }}>
        {T(
          <><b>原則:</b> 色だけに依存しない。すべてのランプは{' '}
            <span style={{ fontFamily: sk.mono, fontSize: 12 }}>code</span>{' '}
            と短い日本語/英語の文を併記する。色覚多様性・暗所運用・印刷ログでも判別可能であること。</>,
          <><b>Rule:</b> never depend on color alone. Every lamp pairs a{' '}
            <span style={{ fontFamily: sk.mono, fontSize: 12 }}>code</span>{' '}
            with a short phrase. Must remain legible for color-blind operators, in dim rooms, and in printed logs.</>
        )}
      </div>
    </div>
  );
}

function PageHead({ num, title, sub }) {
  const lang = useLang();
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      borderBottom: `2px solid ${sk.rule}`, paddingBottom: 12,
    }}>
      <div>
        <div style={{
          fontFamily: sk.mono, fontSize: 11, color: sk.ink3, letterSpacing: 2,
        }}>{T('運用ハンドブック', 'OPS HANDBOOK')} · §{num}</div>
        <div style={{
          fontFamily: lang === 'en' ? sk.sans : sk.jp,
          fontSize: 22, fontWeight: 600,
          color: sk.ink, marginTop: 4,
        }}>{title}</div>
      </div>
      <div style={{
        fontFamily: sk.mono, fontSize: 11, color: sk.ink3, letterSpacing: 1,
      }}>{sub}</div>
    </div>
  );
}

function LampSpec({ k }) {
  const s = STATES[k];
  const lang = useLang();
  const jp = lang !== 'en';
  const phrase = jp ? s.jp : s.en;
  const meta = {
    HOLD: {
      semantics: T('システムが人間の判断を待っている',     'system is waiting for the human'),
      actor:     T('人間が確認',                         'human reviews'),
      urgency:   'low',
    },
    GO_READY: {
      semantics: T('人間GOがリクエストされた',            'human GO has been requested'),
      actor:     T('人間が判断',                         'human decides'),
      urgency:   'med',
    },
    PASS: {
      semantics: T('Gateを通過した',                     'gate has been cleared'),
      actor:     T('システムは観測のみ',                  'system observes'),
      urgency:   'low',
    },
    STOP: {
      semantics: T('全自動進行を停止中',                  'all auto-progress halted'),
      actor:     T('人間が解除',                         'human releases'),
      urgency:   'high',
    },
    REJECT: {
      semantics: T('提出が却下された',                    'submission was rejected'),
      actor:     T('人間が書き直す',                      'human rewrites'),
      urgency:   'med',
    },
  };
  const m = meta[k];
  return (
    <div style={{
      border: `1px solid ${sk.paper3}`,
      background: sk.paper,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        background: s.soft, borderBottom: `1.5px solid ${s.color}`,
        padding: '18px 14px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: '50%', background: s.color,
          boxShadow: `0 0 0 3px ${s.soft}, 0 0 14px ${s.color}80`,
        }}/>
        <div style={{
          fontFamily: sk.mono, fontWeight: 700, fontSize: 18,
          color: s.color, letterSpacing: 1.4,
        }}>{s.code}</div>
      </div>
      <div style={{ padding: '14px 14px 16px' }}>
        <div style={{
          fontFamily: jp ? sk.jp : sk.sans, fontSize: 13, color: sk.ink,
          lineHeight: 1.5, marginBottom: 12, minHeight: 64,
        }}>{phrase}</div>
        <KV label={T('意味', 'meaning')} value={m.semantics} />
        <KV label={T('行為者', 'actor')}  value={m.actor} />
        <KV label={T('緊急度', 'urgency')} value={m.urgency} mono />
      </div>
    </div>
  );
}

// ── Button policy ────────────────────────────────────────────
function ButtonPolicyCard({ width = 1200 }) {
  return (
    <div style={{
      width, background: sk.paper, padding: '32px 36px',
      fontFamily: sk.sans, color: sk.ink,
      border: `1px solid ${sk.rule}`,
    }}>
      <PageHead num="02"
        title={T('ボタン方針 — Copy-only', 'Button Policy — Copy-only')}
        sub={T('許可 · 禁止 · 理由', 'Allowed · Blocked · Why')} />

      <div style={{
        marginTop: 24,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28,
      }}>
        {/* Allowed */}
        <div>
          <SubHead label={T('ALLOWED · このUIに置いて良いボタン',
                            'ALLOWED · buttons permitted on this UI')} tone="ok" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
            {[
              { t: T('GOテンプレートをコピー', 'Copy GO template'),
                d: T('GOメッセージをクリップボードにコピー',
                     'clipboard copy of the GO message'),
                kind: 'copy', glyph: '⧉' },
              { t: T('Evidenceテンプレートをコピー', 'Copy evidence template'),
                d: T('evidenceサマリをクリップボードにコピー',
                     'clipboard copy of the evidence summary'),
                kind: 'copy', glyph: '⧉' },
              { t: T('詳細を表示', 'Show details'),
                d: T('読み取り専用の詳細パネルを開く',
                     'open a read-only detail panel'),
                kind: 'show', glyph: '⌕' },
              { t: T('Inspectorを開く', 'Open Inspector View'),
                d: T('監査ビューへ切替 (依然として読み取り専用)',
                     'switch to audit view (still read-only)'),
                kind: 'open', glyph: '↗' },
            ].map(b => (
              <div key={b.t} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <CopyBtn kind={b.kind} glyph={b.glyph}>{b.t}</CopyBtn>
                <div style={{
                  fontFamily: sk.jp, fontSize: 12, color: sk.ink2,
                  paddingTop: 10, flex: 1,
                }}>{b.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Blocked */}
        <div>
          <SubHead label={T('BLOCKED · 設計上UIに置かない',
                            'BLOCKED · never present in this UI')} tone="bad" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 14 }}>
            {[
              ['Send',                 T('外部送信', 'external send')],
              ['Push',                 T('リモートpush', 'remote push')],
              ['Approve execution',    T('実行承認 / one-click GO', 'one-click GO / execute approval')],
              ['Runtime start',        T('runtime 自動起動', 'auto runtime start')],
              ['External write',       T('外部書込み', 'external write')],
              ['Payment',              T('決済', 'payment')],
              ['Reservation',          T('予約', 'reservation')],
              ['GitHub remote create', T('リモートrepo作成', 'remote repo create')],
              ['Calendar create',      T('予定作成', 'calendar create')],
            ].map(([en, jp]) => (
              <div key={en} style={{
                display: 'grid', gridTemplateColumns: '24px 1fr 1fr',
                gap: 10, alignItems: 'center',
                padding: '7px 10px',
                borderBottom: `1px solid ${sk.paper3}`,
              }}>
                <span style={{ fontFamily: sk.mono, fontSize: 12, color: sk.stop }}>✕</span>
                <span style={{
                  fontFamily: sk.sans, fontSize: 13, color: sk.ink,
                  textDecoration: 'line-through', textDecorationColor: sk.stop,
                }}>{en}</span>
                <span style={{ fontFamily: sk.jp, fontSize: 12, color: sk.ink2 }}>{jp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        marginTop: 28, padding: '14px 18px',
        background: sk.bar, color: sk.barText,
        fontFamily: sk.jp, fontSize: 13, lineHeight: 1.7,
      }}>
        <span style={{
          fontFamily: sk.mono, fontSize: 11, letterSpacing: 1.2,
          color: sk.barText2, marginRight: 10,
        }}>{T('理由', 'WHY')}</span>
        {T(
          <>本UIは <b>chat + lamps + 次の人間アクション</b> のみを担当する。
             外部影響を起こす操作はすべてCLIまたは別チャネル経由の <b>人間操作</b> 限定。
             UIにボタンを置くと「押せる=押して良い」と誤読される。だからUIに置かない。</>,
          <>This UI is responsible only for <b>chat + lamps + next human action</b>.
             Any operation that produces external effects must be a <b>human action</b>
             via CLI or a separate channel. If a button exists in the UI it will be
             read as "tappable = ok to tap". So it does not exist in this UI.</>
        )}
      </div>
    </div>
  );
}

function SubHead({ label, tone }) {
  const lang = useLang();
  const c = tone === 'ok' ? sk.pass : sk.stop;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      paddingBottom: 8, borderBottom: `1.5px solid ${c}`,
    }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: c }}/>
      <span style={{
        fontFamily: lang === 'en' ? sk.sans : sk.jp,
        fontSize: 13, fontWeight: 600, color: sk.ink, letterSpacing: 0.4,
      }}>{label}</span>
    </div>
  );
}

// ── Safety wording reference ─────────────────────────────────
function SafetyWordingCard({ width = 1200 }) {
  return (
    <div style={{
      width, background: sk.paper, padding: '32px 36px',
      fontFamily: sk.sans, color: sk.ink,
      border: `1px solid ${sk.rule}`,
    }}>
      <PageHead num="03"
        title={T('安全境界の言い回し', 'Safety Wording')}
        sub={T('正式文字列 (日本語 + machine)', 'canonical strings, JP + machine')} />

      <div style={{
        marginTop: 24,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28,
      }}>
        <div>
          <SubHead label={T('HEADLINE · 画面上部', 'HEADLINE · top of screen')} tone="ok" />
          <Quote big
            jp="しきしま 操作室"
            en="Shikishima · Operator Room" />
          <Quote big
            jp="まだ待機。人間GOが必要です。"
            en="Holding. Human GO is required." />
          <Quote
            jp="次の必要アクション"
            en="NEXT · Required human action" />
          <Quote
            jp="Task 18 のpush結果を確認してください。"
            en="Please confirm the push result of Task 18." />
        </div>

        <div>
          <SubHead label={T('SAFETY STRIP · 常時表示', 'SAFETY STRIP · always visible')} tone="ok" />
          <div style={{
            marginTop: 14, padding: 14,
            border: `1px dashed ${sk.rule}`, background: sk.paper2,
          }}>
            <div style={{
              fontFamily: sk.mono, fontSize: 12, color: sk.ink, lineHeight: 1.9,
            }}>
              {T('実行 disabled / 本番 false / 外部write false / raw値 非表示',
                 'exec disabled / prod false / external_write false / raw hidden')}
            </div>
            <div style={{
              fontFamily: sk.mono, fontSize: 10, color: sk.ink3,
              marginTop: 6, lineHeight: 1.7,
            }}>
              execution=disabled · productionReady=false · external_write=false · rawValuesReported=false
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <SubHead label={T('MEANING · GOの定義', 'MEANING · the meaning of GO')} tone="ok" />
            <div style={{
              marginTop: 12,
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
            }}>
              <Meaning verdict="YES"
                jp="人間が次の手動承認を進めて良い"
                en="the human may proceed to the next manual approval" />
              <Meaning verdict="NO"
                jp="システムが外部実行を始める"
                en="the system starts external execution" />
              <Meaning verdict="YES"
                jp="次のGateに観測を移して良い"
                en="observation may move to the next gate" />
              <Meaning verdict="NO"
                jp="送信・支払・予約を実行する"
                en="send / pay / reserve are performed" />
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <SubHead label={T("WORDING DO / DON'T", "WORDING DO / DON'T")} tone="ok" />
        <div style={{
          marginTop: 12,
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
        }}>
          <DoDont kind="do"
            label={T('GOテンプレートをコピー', 'Copy GO template')}
            jp="人間が別チャネルで判断する前提。"
            en="Assumes the human decides on a separate channel." />
          <DoDont kind="dont"
            label={T('送信', 'Send')}
            jp="「押せば外部に届く」という誤読を招く。"
            en="Invites the misread that pressing reaches the outside." />
          <DoDont kind="do"
            label={T('Inspectorを開く', 'Open Inspector')}
            jp="view切替であり、何も実行しない。"
            en="A view switch; nothing is executed." />
          <DoDont kind="dont"
            label={T('Approve / Execute', 'Approve / Execute')}
            jp="このUIには承認も実行も置かない。"
            en="No approval and no execution belong on this UI." />
          <DoDont kind="do"
            label={T('詳細を表示', 'Show details')}
            jp="読込のみ。raw値はマスクしたまま。"
            en="Read-only. Raw values stay masked." />
          <DoDont kind="dont"
            label={T('ワンクリックGO', 'One-click GO')}
            jp="設計上、1クリックで進む手段は存在しない。"
            en="By design no single click can advance the system." />
        </div>
      </div>
    </div>
  );
}

function Quote({ jp, en, big }) {
  const lang = useLang();
  const text = lang === 'en' ? en : jp;
  return (
    <div style={{ padding: '12px 0', borderBottom: `1px solid ${sk.paper3}` }}>
      <div style={{
        fontFamily: lang === 'en' ? sk.sans : sk.jp,
        fontWeight: big ? 600 : 500,
        fontSize: big ? 18 : 14, color: sk.ink, lineHeight: 1.5,
      }}>{text}</div>
      <div style={{
        fontFamily: sk.mono, fontSize: 11, color: sk.ink3, marginTop: 4,
      }}>{lang === 'en' ? jp : en}</div>
    </div>
  );
}

function Meaning({ verdict, jp, en }) {
  const lang = useLang();
  const ok = verdict === 'YES';
  const text = lang === 'en' ? en : jp;
  return (
    <div style={{
      display: 'flex', gap: 10, alignItems: 'flex-start',
      padding: '8px 10px',
      border: `1px solid ${ok ? sk.pass : sk.stop}`,
      background: ok ? sk.passSoft : sk.stopSoft,
    }}>
      <span style={{
        fontFamily: sk.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1,
        color: ok ? sk.pass : sk.stop,
        border: `1px solid ${ok ? sk.pass : sk.stop}`,
        padding: '2px 6px', background: sk.paper,
      }}>{verdict}</span>
      <span style={{
        fontFamily: lang === 'en' ? sk.sans : sk.jp,
        fontSize: 13, color: sk.ink, lineHeight: 1.5,
      }}>{text}</span>
    </div>
  );
}

function DoDont({ kind, label, jp, en }) {
  const lang = useLang();
  const isDo = kind === 'do';
  const c = isDo ? sk.pass : sk.stop;
  const desc = lang === 'en' ? en : jp;
  return (
    <div style={{
      padding: '10px 12px',
      background: sk.paper,
      border: `1px solid ${sk.paper3}`,
      borderLeft: `3px solid ${c}`,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4,
      }}>
        <span style={{
          fontFamily: sk.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1,
          color: c,
        }}>{isDo ? 'DO' : "DON'T"}</span>
        <span style={{
          fontFamily: sk.sans, fontWeight: 600, fontSize: 14, color: sk.ink,
          textDecoration: isDo ? 'none' : 'line-through',
          textDecorationColor: sk.stop,
        }}>{label}</span>
      </div>
      <div style={{
        fontFamily: lang === 'en' ? sk.sans : sk.jp,
        fontSize: 12, color: sk.ink2, lineHeight: 1.55,
      }}>{desc}</div>
    </div>
  );
}

Object.assign(window, { LampSpecCard, ButtonPolicyCard, SafetyWordingCard });
