// pages-states.jsx — Extended state matrix, empty/loading/error/stale states,
// toast notifications, command palette. Uses BadgeMonoF + FinalPageHead from
// pages-final.jsx.

// ════════════════════════════════════════════════════════════════
// Extended state matrix
// ════════════════════════════════════════════════════════════════
const EXT_STATES = [
  { code: 'HOLD',             color: sk.hold,   soft: sk.holdSoft,
    label:    { ja: '待機',         en: 'Holding' },
    msg:      { ja: 'まだ待機。人間GOが必要です。',
                en: 'Holding. Human GO required.' },
    next:     { ja: 'Task 18 push結果を確認',
                en: 'Confirm Task 18 push result' },
    allowed:  ['copy GO template', 'open inspector', 'show details'],
    forbidden:['execution', 'push', 'runtime start', 'external write'],
    fallback: 'self' },

  { code: 'GO_READY',         color: sk.go,     soft: sk.goSoft,
    label:    { ja: 'GO待ち',       en: 'GO ready' },
    msg:      { ja: '人間GOの判断待ち。実行はしません。',
                en: 'Awaiting human GO. System will not execute.' },
    next:     { ja: 'GOテンプレを別チャネルへ',
                en: 'Approve GO template on a separate channel' },
    allowed:  ['copy GO template', 'show details'],
    forbidden:['execute from UI', 'auto push'],
    fallback: 'HOLD' },

  { code: 'PASS',             color: sk.pass,   soft: sk.passSoft,
    label:    { ja: '通過',         en: 'Passed' },
    msg:      { ja: 'Gate通過。次のGateへ。',
                en: 'Gate passed. Proceed to next gate.' },
    next:     { ja: '次のGateの観測を開始',
                en: 'Start observation for next gate' },
    allowed:  ['copy evidence summary', 'open inspector'],
    forbidden:['re-execute', 'auto push'],
    fallback: 'HOLD' },

  { code: 'PASS_WITH_CAVEAT', color: '#9aa72f', soft: 'color-mix(in oklab, #9aa72f 18%, var(--paper))',
    label:    { ja: '通過 (注意)',  en: 'Pass w/ caveat' },
    msg:      { ja: '通過したが注意事項あり。確認後に進む。',
                en: 'Passed with caveats. Review before advancing.' },
    next:     { ja: '注意点を読み、再確認',
                en: 'Read caveats and re-verify' },
    allowed:  ['copy caveat summary', 'open inspector'],
    forbidden:['silently advance', 'execute'],
    fallback: 'HOLD' },

  { code: 'STOP',             color: sk.stop,   soft: sk.stopSoft,
    label:    { ja: '停止',         en: 'Stopped' },
    msg:      { ja: '停止中。人間の解除が必要です。',
                en: 'Stopped. Human release is required.' },
    next:     { ja: 'STOPページで分類 → CLIで解除',
                en: 'Classify on STOP → release via CLI' },
    allowed:  ['copy restart rule', 'open stop history'],
    forbidden:['auto release', 'UI release', 'execute'],
    fallback: 'self' },

  { code: 'REJECT',           color: sk.reject, soft: sk.rejectSoft,
    label:    { ja: '却下',         en: 'Rejected' },
    msg:      { ja: '却下。再提出を要求。',
                en: 'Rejected. Resubmission requested.' },
    next:     { ja: '理由を確認し、書き直し',
                en: 'Review reason and rewrite' },
    allowed:  ['copy reject reason', 'open draft'],
    forbidden:['auto resubmit', 'execute'],
    fallback: 'HOLD' },

  { code: 'UNKNOWN',          color: sk.ink3,   soft: sk.paper2,
    label:    { ja: '不明',         en: 'Unknown' },
    msg:      { ja: '状態が確定していません。安全のためHOLD扱い。',
                en: 'State not determined. Treated as HOLD for safety.' },
    next:     { ja: 'snapshotを更新 / Inspector確認',
                en: 'Refresh snapshot / open Inspector' },
    allowed:  ['refresh read-only snapshot', 'open inspector'],
    forbidden:['execute', 'push', 'auto runtime start'],
    fallback: 'HOLD' },

  { code: 'STALE',            color: sk.hold,   soft: sk.holdSoft,
    label:    { ja: '情報が古い',   en: 'Stale' },
    msg:      { ja: '最新確認まで HOLD として扱います。',
                en: 'Treated as HOLD until refreshed.' },
    next:     { ja: 'snapshot を refresh',
                en: 'Refresh the snapshot' },
    allowed:  ['refresh read-only snapshot', 'copy safety note'],
    forbidden:['execute', 'push', 'external write'],
    fallback: 'HOLD' },

  { code: 'ERROR',            color: sk.stop,   soft: sk.stopSoft,
    label:    { ja: 'エラー',       en: 'Error' },
    msg:      { ja: '状態を確認できません。安全のためHOLD扱い。',
                en: 'Cannot read state. Treated as HOLD for safety.' },
    next:     { ja: 'Inspector でログ確認 → 人間判断',
                en: 'Inspect logs → human decision' },
    allowed:  ['copy error summary', 'open inspector'],
    forbidden:['execute', 'push', 'runtime start'],
    fallback: 'HOLD' },
];

function StateMatrixCard({ width = 1400 }) {
  const lang = useLang();
  return (
    <div style={{
      width, background: sk.paper, padding: '32px 36px',
      fontFamily: sk.sans, color: sk.ink,
      border: `1px solid ${sk.rule}`,
    }}>
      <FinalPageHead num="C3"
        title={T('Extended State Matrix', 'Extended State Matrix')}
        sub="HOLD · GO_READY · PASS · PASS_WITH_CAVEAT · STOP · REJECT · UNKNOWN · STALE · ERROR" />
      <table style={{
        width: '100%', borderCollapse: 'collapse', marginTop: 18,
        fontFamily: sk.mono, fontSize: 11,
      }}>
        <thead>
          <tr style={{ background: sk.paper2 }}>
            {['lamp',
              T('短文', 'short label'),
              T('一行説明', 'one-line message'),
              T('次の人間アクション', 'next human action'),
              T('許可', 'allowed'),
              T('禁止', 'forbidden'),
              T('既定 fallback', 'default fallback')].map((h, i) => (
              <th key={i} style={{
                textAlign: 'left', padding: '7px 10px',
                color: sk.ink3, fontWeight: 500, letterSpacing: 0.6,
                borderBottom: `1px solid ${sk.paper3}`,
                fontSize: 10,
                fontFamily: lang === 'en' ? sk.sans : sk.jp,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {EXT_STATES.map(s => (
            <tr key={s.code}>
              <td style={{
                padding: '8px 10px', borderBottom: `1px solid ${sk.paper3}`,
                width: 160,
              }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '4px 10px', border: `1px solid ${s.color}`,
                  background: s.soft, borderRadius: 2,
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }}/>
                  <span style={{ fontFamily: sk.mono, fontSize: 11, fontWeight: 700, color: s.color }}>{s.code}</span>
                </div>
              </td>
              <td style={{
                padding: '8px 10px', borderBottom: `1px solid ${sk.paper3}`,
                fontFamily: lang === 'en' ? sk.sans : sk.jp,
                fontSize: 12, color: sk.ink, fontWeight: 600,
              }}>{lang === 'en' ? s.label.en : s.label.ja}</td>
              <td style={{
                padding: '8px 10px', borderBottom: `1px solid ${sk.paper3}`,
                fontFamily: lang === 'en' ? sk.sans : sk.jp,
                fontSize: 11.5, color: sk.ink2,
              }}>{lang === 'en' ? s.msg.en : s.msg.ja}</td>
              <td style={{
                padding: '8px 10px', borderBottom: `1px solid ${sk.paper3}`,
                fontFamily: lang === 'en' ? sk.sans : sk.jp,
                fontSize: 11.5, color: sk.ink,
              }}>{lang === 'en' ? s.next.en : s.next.ja}</td>
              <td style={{ padding: '8px 10px', borderBottom: `1px solid ${sk.paper3}` }}>
                <ChipList items={s.allowed} tone="ok" />
              </td>
              <td style={{ padding: '8px 10px', borderBottom: `1px solid ${sk.paper3}` }}>
                <ChipList items={s.forbidden} tone="lock" />
              </td>
              <td style={{
                padding: '8px 10px', borderBottom: `1px solid ${sk.paper3}`,
                fontFamily: sk.mono, fontSize: 11, color: s.fallback === 'self' ? sk.ink3 : sk.stop,
                fontWeight: 700,
              }}>{s.fallback === 'self' ? '—' : s.fallback}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{
        marginTop: 18, padding: '12px 16px',
        background: sk.bar, color: sk.barText,
        fontFamily: sk.jp, fontSize: 13, lineHeight: 1.7,
      }}>
        <span style={{
          fontFamily: sk.mono, fontSize: 11, letterSpacing: 1.2,
          color: sk.barText2, marginRight: 10,
        }}>RULE</span>
        {T('UNKNOWN / STALE / ERROR は必ず HOLD に fallback する。',
           'UNKNOWN / STALE / ERROR always fall back to HOLD.')}
      </div>
    </div>
  );
}

function ChipList({ items, tone }) {
  const c = tone === 'lock' ? sk.stop : sk.pass;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      {items.map((it, i) => (
        <span key={i} style={{
          fontFamily: sk.mono, fontSize: 9.5,
          color: tone === 'lock' ? sk.ink3 : sk.ink,
          border: `1px solid ${sk.paper3}`, padding: '1px 5px',
          textDecoration: tone === 'lock' ? 'line-through' : 'none',
          textDecorationColor: c,
        }}>{it}</span>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Empty / Loading / Error / Stale gallery
// ════════════════════════════════════════════════════════════════
function EmptyStatesCard({ width = 1400 }) {
  return (
    <div style={{
      width, background: sk.paper, padding: '32px 36px',
      fontFamily: sk.sans, color: sk.ink,
      border: `1px solid ${sk.rule}`,
    }}>
      <FinalPageHead num="C4"
        title={T('Empty · Loading · Error · Stale States', 'Empty · Loading · Error · Stale')}
        sub={T('全ページ共通の挙動', 'shared behavior across all pages')} />

      <div style={{
        marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14,
      }}>
        <StateSwatch
          kind="empty"
          title={T('Empty · まだ無い', 'Empty')}
          glyph="◯"
          tone="neutral"
          examples={[
            { page: 'Outbox',    ja: 'まだ下書きはありません。',         en: 'No drafts yet.' },
            { page: 'Queue',     ja: '承認待ちはありません。',             en: 'No items awaiting decision.' },
            { page: 'Evidence',  ja: 'このGateの証跡はまだありません。', en: 'No evidence yet for this gate.' },
            { page: 'StackChan', ja: 'StackChanはまだ接続されていません。', en: 'StackChan is not yet connected.' },
          ]}
          rule={T('Empty は不安にさせない。落ち着いた一行で。',
                  'Empty must not alarm. One calm line.')}
        />
        <StateSwatch
          kind="loading"
          title={T('Loading · 読み込み中', 'Loading')}
          glyph="◐"
          tone="info"
          examples={[
            { page: T('全ページ', 'all pages'),
              ja: '安全スナップショットを確認中...',
              en: 'Verifying safe snapshot…' },
          ]}
          rule={T('読み込み中も lamp は前回値 + STALE バッジで保護表示。',
                  'During load show last lamp + STALE badge for safety.')}
        />
        <StateSwatch
          kind="error"
          title={T('Error · 取得失敗', 'Error')}
          glyph="✕"
          tone="lock"
          examples={[
            { page: T('全ページ', 'all pages'),
              ja: '状態を確認できません。安全のためHOLDとして扱います。',
              en: 'Cannot read state. Treated as HOLD for safety.' },
          ]}
          rule={T('Error は必ずHOLDへ。原因はInspectorで読む。',
                  'On error always HOLD. Investigate in Inspector.')}
        />
        <StateSwatch
          kind="stale"
          title={T('Stale · 古い可能性', 'Stale')}
          glyph="◌"
          tone="warn"
          examples={[
            { page: T('全ページ', 'all pages'),
              ja: 'この情報は古い可能性があります。最新確認まで実行しないでください。',
              en: 'This data may be stale. Do not execute until refreshed.' },
          ]}
          rule={T('rawLAN IP / token / secret path は stale でも出さない。',
                  'Even when stale, never show raw LAN IP / tokens / secret paths.')}
        />
      </div>

      <div style={{
        marginTop: 18, padding: '12px 16px',
        background: sk.paper2, border: `1px dashed ${sk.rule}`,
        fontFamily: sk.jp, fontSize: 13, color: sk.ink, lineHeight: 1.7,
      }}>
        <span style={{
          fontFamily: sk.mono, fontSize: 11, letterSpacing: 1.2,
          color: sk.ink3, marginRight: 10,
        }}>RULE</span>
        {T(<>データが <b>stale / unavailable / inconsistent</b> の時、UIは必ず <b>HOLD</b> を表示する。理由とともに。</>,
           <>When data is <b>stale / unavailable / inconsistent</b>, the UI must show <b>HOLD</b>, with reason.</>)}
      </div>
    </div>
  );
}

function StateSwatch({ kind, title, glyph, tone, examples, rule }) {
  const lang = useLang();
  const c = tone === 'lock' ? sk.stop : tone === 'warn' ? sk.hold :
            tone === 'info' ? sk.go : sk.ink3;
  return (
    <div style={{
      border: `1.5px solid ${c}`,
      background: sk.paper,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 12px', background: c, color: '#fff',
      }}>
        <span style={{
          fontFamily: sk.mono, fontSize: 11, letterSpacing: 1, fontWeight: 700,
        }}>{kind.toUpperCase()}</span>
        <span style={{ fontFamily: sk.mono, fontSize: 18 }}>{glyph}</span>
      </div>
      <div style={{ padding: '12px 14px', flex: 1 }}>
        <div style={{
          fontFamily: lang === 'en' ? sk.sans : sk.jp,
          fontSize: 13, fontWeight: 700, color: sk.ink, marginBottom: 8,
        }}>{title}</div>
        {examples.map((ex, i) => (
          <div key={i} style={{
            padding: '7px 10px', marginBottom: 6,
            background: sk.paper2, border: `1px solid ${sk.paper3}`, borderLeft: `3px solid ${c}`,
          }}>
            <div style={{
              fontFamily: sk.mono, fontSize: 9.5, color: sk.ink3, letterSpacing: 0.5,
              marginBottom: 3,
            }}>{ex.page}</div>
            <div style={{
              fontFamily: lang === 'en' ? sk.sans : sk.jp,
              fontSize: 11.5, color: sk.ink, lineHeight: 1.5,
            }}>{lang === 'en' ? ex.en : ex.ja}</div>
          </div>
        ))}
        <div style={{
          fontFamily: lang === 'en' ? sk.sans : sk.jp,
          fontSize: 10.5, color: sk.ink3, marginTop: 8, lineHeight: 1.5,
          paddingTop: 8, borderTop: `1px dashed ${sk.paper3}`,
        }}>
          <span style={{
            fontFamily: sk.mono, fontSize: 9, fontWeight: 700, color: c,
            border: `1px solid ${c}`, padding: '0 4px', marginRight: 6,
          }}>RULE</span>
          {rule}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Toast / Notification design
// ════════════════════════════════════════════════════════════════
function ToastsCard({ width = 1400 }) {
  const lang = useLang();
  const toasts = [
    { kind: 'info',    color: sk.go,
      ja: 'GOテンプレートをコピーしました。',
      en: 'GO template copied.' },
    { kind: 'success', color: sk.pass,
      ja: '証跡サマリーをコピーしました。',
      en: 'Evidence summary copied.' },
    { kind: 'warning', color: sk.hold,
      ja: '状態が古い可能性があります。HOLDとして扱います。',
      en: 'State may be stale. Treated as HOLD.' },
    { kind: 'stop',    color: sk.stop,
      ja: 'STOP状態を検出しました。Inspectorで理由を確認。',
      en: 'STOP detected. See Inspector for the reason.' },
    { kind: 'error',   color: sk.reject,
      ja: '状態取得に失敗。安全のためHOLD扱い。',
      en: 'Failed to read state. Treated as HOLD.' },
    { kind: 'observ.',  color: sk.ink3,
      ja: 'Runtime observation 終了。ポート閉鎖済み。',
      en: 'Runtime observation ended. Port closed.' },
  ];
  return (
    <div style={{
      width, background: sk.paper, padding: '32px 36px',
      fontFamily: sk.sans, color: sk.ink,
      border: `1px solid ${sk.rule}`,
    }}>
      <FinalPageHead num="C5"
        title={T('Toast · Notification', 'Toast · Notification')}
        sub={T('情報・成功・警告・STOP・エラーの5系統', 'info / success / warning / stop / error')} />
      <div style={{
        marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14,
      }}>
        {toasts.map((t, i) => <Toast key={i} t={t} />)}
      </div>

      <div style={{ marginTop: 20 }}>
        <SubHeadFinal label={T('FORBIDDEN · toastに置かない操作', "FORBIDDEN · never on toast")} tone="lock" />
        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['Approve from toast', 'Push from toast', 'Execute from toast',
            'Start runtime from toast', 'Operate StackChan from toast']
            .map(s => <InactiveStamp key={s} label={s} />)}
        </div>
      </div>
    </div>
  );
}

function Toast({ t }) {
  const lang = useLang();
  return (
    <div style={{
      border: `1px solid ${t.color}`,
      borderLeft: `4px solid ${t.color}`,
      background: sk.paper,
      padding: '10px 14px',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <span style={{
        width: 10, height: 10, borderRadius: '50%',
        background: t.color, flex: '0 0 auto',
        boxShadow: `0 0 8px ${t.color}66`,
      }}/>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: sk.mono, fontSize: 9.5, letterSpacing: 1, color: t.color,
          fontWeight: 700, marginBottom: 3,
        }}>{t.kind.toUpperCase()}</div>
        <div style={{
          fontFamily: lang === 'en' ? sk.sans : sk.jp,
          fontSize: 13, color: sk.ink, lineHeight: 1.5,
        }}>{lang === 'en' ? t.en : t.ja}</div>
      </div>
      <span style={{
        fontFamily: sk.mono, fontSize: 10, color: sk.ink3, letterSpacing: 0.4,
      }}>5s</span>
    </div>
  );
}

function SubHeadFinal({ label, tone }) {
  const lang = useLang();
  const c = tone === 'lock' ? sk.stop : sk.pass;
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

// ════════════════════════════════════════════════════════════════
// Command Palette / Quick Actions
// ════════════════════════════════════════════════════════════════
function CommandPaletteCard({ width = 1200 }) {
  const lang = useLang();
  const allowed = [
    { kbd: '⌘ K',  ja: 'GOテンプレートをコピー',           en: 'Copy GO template',         tag: 'copy' },
    { kbd: '⌘ E',  ja: '証跡テンプレをコピー',              en: 'Copy evidence template',  tag: 'copy' },
    { kbd: '⌘ P',  ja: 'push GOテンプレをコピー',           en: 'Copy push GO template',    tag: 'copy' },
    { kbd: '⌘ S',  ja: '安全メモをコピー',                  en: 'Copy safety note',         tag: 'copy' },
    { kbd: '⌘ I',  ja: 'Inspector を開く',                  en: 'Open Inspector',           tag: 'open' },
    { kbd: '⌘ X',  ja: 'STOP ページを開く',                 en: 'Open STOP page',           tag: 'open' },
    { kbd: '⌘ R',  ja: '安全 snapshot を refresh',          en: 'Refresh read-only snapshot', tag: 'show' },
  ];
  const forbidden = [
    'Execute', 'Push', 'Start runtime',
    'Enable productionReady', 'Enable execution',
    'Send email', 'Create calendar event', 'Create GitHub issue', 'Post social',
    'Pay', 'Reserve',
    'Move StackChan', 'Enable voice / camera / mic',
  ];

  return (
    <div style={{
      width, background: sk.paper, padding: '32px 36px',
      fontFamily: sk.sans, color: sk.ink,
      border: `1px solid ${sk.rule}`,
    }}>
      <FinalPageHead num="C6"
        title={T('Command Palette · Quick Actions', 'Command Palette · Quick Actions')}
        sub={T('Cmd+K 風の検索バー · コピー/読込み専用', 'Cmd+K-style palette · copy / read only')} />

      <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 22 }}>
        <div>
          {/* mock palette */}
          <div style={{
            border: `1px solid ${sk.rule}`,
            background: sk.paper2,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 14px', borderBottom: `1px solid ${sk.paper3}`,
              background: sk.paper,
            }}>
              <span style={{ fontFamily: sk.mono, fontSize: 14, color: sk.ink3 }}>⌕</span>
              <span style={{
                fontFamily: lang === 'en' ? sk.sans : sk.jp, fontSize: 14, color: sk.ink3,
              }}>{T('検索 — copy / open / show のみ',
                    'search — copy / open / show only')}</span>
              <span style={{ marginLeft: 'auto', fontFamily: sk.mono, fontSize: 10, color: sk.ink3 }}>esc</span>
            </div>
            {allowed.map((a, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '50px 1fr 60px',
                gap: 12, alignItems: 'center',
                padding: '10px 14px',
                background: i === 0 ? sk.goSoft : sk.paper,
                borderBottom: `1px solid ${sk.paper3}`,
              }}>
                <BadgeMonoF tone={a.tag === 'copy' ? 'ok' : a.tag === 'open' ? 'neutral' : 'warn'}>
                  {a.tag.toUpperCase()}
                </BadgeMonoF>
                <span style={{
                  fontFamily: lang === 'en' ? sk.sans : sk.jp,
                  fontSize: 13, color: sk.ink,
                }}>{lang === 'en' ? a.en : a.ja}</span>
                <span style={{
                  fontFamily: sk.mono, fontSize: 11, color: sk.ink3,
                  textAlign: 'right', letterSpacing: 0.5,
                }}>{a.kbd}</span>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 12,
            fontFamily: lang === 'en' ? sk.sans : sk.jp,
            fontSize: 11.5, color: sk.ink3, lineHeight: 1.6,
            padding: '10px 12px',
            border: `1px dashed ${sk.paper3}`, background: sk.paper2,
          }}>
            <span style={{
              fontFamily: sk.mono, fontSize: 9.5, fontWeight: 700, color: sk.go,
              marginRight: 6, padding: '0 4px', border: `1px solid ${sk.go}`,
            }}>NOTE</span>
            {T('Command Palette はコピー/読込みのみ。実行コマンドは登録されない。',
               'The palette is copy / read only. Execution commands are never registered.')}
          </div>
        </div>

        <div>
          <SubHeadFinal label={T('FORBIDDEN · 登録しないコマンド', 'FORBIDDEN · never registered')} tone="lock" />
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {forbidden.map(c => (
              <code key={c} style={{
                fontFamily: sk.mono, fontSize: 11, color: sk.ink2,
                padding: '5px 10px',
                border: `1px solid ${sk.paper3}`,
                background: sk.paper,
                textDecoration: 'line-through', textDecorationColor: sk.stop,
              }}>{c}</code>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  EXT_STATES, StateMatrixCard, EmptyStatesCard, ToastsCard, CommandPaletteCard,
  ChipList, StateSwatch, Toast, SubHeadFinal,
});
