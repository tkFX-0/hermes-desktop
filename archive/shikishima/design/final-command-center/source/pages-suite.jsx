// pages-suite.jsx — Outbox / Queue / GO / Evidence / STOP / Push pages.
// Each page is a PageShell with a center main + standard PageRightRail.

// ────────── shared helpers ──────────
function PageHeader({ kicker, title, right }) {
  const lang = useLang();
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      padding: '14px 22px 12px', borderBottom: `1px solid ${sk.paper3}`,
      background: sk.paper,
    }}>
      <div>
        <div style={{
          fontFamily: sk.mono, fontSize: 10, letterSpacing: 1.6, color: sk.ink3,
        }}>{kicker}</div>
        <div style={{
          fontFamily: lang === 'en' ? sk.sans : sk.jp,
          fontWeight: 700, fontSize: 20, color: sk.ink, marginTop: 4,
        }}>{title}</div>
      </div>
      {right}
    </div>
  );
}

// Sticky note callout — used to make a strong text-only statement on a page.
function Callout({ tone = 'lock', children }) {
  const c = tone === 'lock' ? sk.stop : tone === 'go' ? sk.go : sk.ink3;
  const lang = useLang();
  return (
    <div style={{
      padding: '10px 14px',
      background: sk.paper, border: `1px solid ${c}`, borderLeft: `4px solid ${c}`,
      fontFamily: lang === 'en' ? sk.sans : sk.jp,
      fontSize: 12.5, color: sk.ink, lineHeight: 1.55,
    }}>
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// OUTBOX
// ════════════════════════════════════════════════════════════════
function DesktopOutboxPage({ width = 1400, height = 900, decision = 'HOLD' }) {
  const lang = useLang();
  return (
    <PageShell active="outbox" decision={decision} width={width} height={height}
               sub={T('Outbox — 下書きのみ保存', 'Outbox — drafts only')}>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <PageHeader
          kicker={T('OUTBOX · 外部行動候補', 'OUTBOX · external-action drafts')}
          title={T('下書きのみ・自動送信なし', 'Drafts only · no auto-send')}
          right={<div style={{ display: 'flex', gap: 6 }}>
            <span style={{
              fontFamily: sk.mono, fontSize: 11, color: sk.ink2,
              border: `1px solid ${sk.paper3}`, padding: '3px 9px', borderRadius: 2,
            }}>{T('下書き 3', 'drafts 3')}</span>
            <span style={{
              fontFamily: sk.mono, fontSize: 11, color: sk.ink2,
              border: `1px solid ${sk.paper3}`, padding: '3px 9px', borderRadius: 2,
            }}>{T('送信済 0', 'sent 0')}</span>
          </div>}
        />
        <div style={{ flex: 1, minHeight: 0, padding: '18px 22px', overflow: 'hidden' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14,
          }}>
            <DraftCard
              type="push"      channel="manual"
              title="GO_T_006.md"
              jp="Task 18 push GO テンプレート"
              en="Task 18 push GO template"
              risk="external_effect_after_human_GO"
            />
            <DraftCard
              type="evidence"  channel="manual"
              title="EV_S_006.md"
              jp="Gate 006 証跡サマリ"
              en="Gate 006 evidence summary"
              risk="none"
            />
            <DraftCard
              type="note"      channel="local"
              title="NOTE_dev.md"
              jp="開発メモ"
              en="developer notes"
              risk="none"
            />
          </div>

          {/* inactive stamps */}
          <div style={{ marginTop: 18 }}>
            <div style={{
              fontFamily: sk.mono, fontSize: 10, letterSpacing: 1.4, color: sk.ink3,
              marginBottom: 8,
            }}>{T('INACTIVE · 設計上UIに無いボタン', 'INACTIVE · buttons not present by design')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <InactiveStamp label="Send" />
              <InactiveStamp label="Create remote" />
              <InactiveStamp label="Post" />
              <InactiveStamp label="Pay" />
              <InactiveStamp label="Reserve" />
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <Callout tone="lock">
              {T(<>Outbox は <b>ローカル限定</b>。人間が手動でCLIまたは別チャネルに貼り付けます。
                  このUIには送信・push・投稿・支払・予約のボタンは存在しません。</>,
                 <>Outbox is <b>local-only</b>. A human pastes manually into the CLI
                   or another channel. There are no send / push / post / pay / reserve buttons in this UI.</>)}
            </Callout>
          </div>
        </div>
        <ChatInputBar />
      </div>
      <PageRightRail
        decision={decision}
        copyButtons={<>
          <CopyBtn kind="copy" glyph="⧉">{T('下書きをコピー', 'Copy draft')}</CopyBtn>
          <CopyBtn kind="copy" glyph="⧉">{T('レビューノート', 'Review note')}</CopyBtn>
          <CopyBtn kind="show" glyph="⌕">{T('詳細', 'Show details')}</CopyBtn>
          <CopyBtn kind="open" glyph="↗">{T('Inspector', 'Inspector')}</CopyBtn>
        </>}
      />
    </PageShell>
  );
}

function DraftCard({ type, channel, title, jp, en, risk }) {
  const lang = useLang();
  const riskTone = risk === 'none' ? sk.ink3 : sk.hold;
  return (
    <div style={{
      border: `1px solid ${sk.paper3}`,
      background: sk.paper,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        padding: '7px 12px',
        background: sk.paper2,
        borderBottom: `1px solid ${sk.paper3}`,
      }}>
        <span style={{ fontFamily: sk.mono, fontSize: 10, letterSpacing: 1.2, color: sk.ink2 }}>
          {type.toUpperCase()}
        </span>
        <span style={{ fontFamily: sk.mono, fontSize: 10, color: sk.ink3 }}>
          {channel}
        </span>
      </div>
      <div style={{ padding: '12px 14px', flex: 1 }}>
        <div style={{ fontFamily: sk.mono, fontSize: 13, fontWeight: 700, color: sk.ink }}>
          {title}
        </div>
        <div style={{
          fontFamily: lang === 'en' ? sk.sans : sk.jp,
          fontSize: 12, color: sk.ink2, marginTop: 4,
        }}>{lang === 'en' ? en : jp}</div>
        <div style={{ marginTop: 10, display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{
            fontFamily: sk.mono, fontSize: 9, color: sk.pass,
            border: `1px solid ${sk.pass}`, padding: '1px 6px', letterSpacing: 0.6,
          }}>READY</span>
          <span style={{
            fontFamily: sk.mono, fontSize: 9, color: riskTone,
            border: `1px dashed ${riskTone}`, padding: '1px 6px', letterSpacing: 0.4,
          }}>risk={risk}</span>
        </div>
      </div>
      <div style={{
        padding: '8px 12px 10px', borderTop: `1px solid ${sk.paper3}`,
        display: 'flex', gap: 6, flexWrap: 'wrap',
      }}>
        <CopyBtn kind="copy" glyph="⧉">{T('コピー', 'Copy')}</CopyBtn>
        <CopyBtn kind="show" glyph="⌕">{T('差分', 'Diff')}</CopyBtn>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// QUEUE
// ════════════════════════════════════════════════════════════════
function DesktopQueuePage({ width = 1400, height = 900, decision = 'HOLD' }) {
  return (
    <PageShell active="queue" decision={decision} width={width} height={height}
               sub={T('承認待ち — 人間判断キュー', 'Queue — human decisions')}>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <PageHeader
          kicker={T('QUEUE · 人間判断', 'QUEUE · human decisions')}
          title={T('承認 / 保留 / 再提出の待ち行列', 'Approve / hold / resubmit queue')}
          right={<div style={{ display: 'flex', gap: 6 }}>
            <CountChip label={T('CRITICAL', 'critical')} value={0} tone="stop" />
            <CountChip label={T('HOLD',     'holding')}  value={2} tone="hold" />
            <CountChip label={T('WAITING',  'waiting')}  value={3} tone="go" />
          </div>}
        />
        <div style={{ flex: 1, minHeight: 0, padding: '18px 22px', overflow: 'hidden' }}>
          <QueueGroup tone="hold"
            title={T('保留中 (HOLD)', 'Holding')}
            rows={[
              ['Q-0142', 'push_review',  'G-006', 'HOLD', '1m 12s'],
              ['Q-0141', 'evidence_ack', 'G-006', 'HOLD', '3m 04s'],
            ]}
          />
          <div style={{ height: 14 }}/>
          <QueueGroup tone="go"
            title={T('待機 (WAITING)', 'Waiting')}
            rows={[
              ['Q-0140', 'plan_step',  'G-005', 'WAITING', '12m'],
              ['Q-0138', 'bootstrap',  'G-003', 'WAITING', '32m'],
              ['Q-0137', 'plan_ack',   'G-003', 'WAITING', '36m'],
            ]}
          />
          <div style={{ height: 14 }}/>
          <Callout tone="lock">
            {T(<>承認 / 却下 / 実行 のボタンは設計上ここに存在しません。
                判断結果は <b>別チャネル (CLI / 別チーム承認)</b> で人間が行います。</>,
               <>Approve / reject / execute buttons do not exist here by design.
                Decisions happen via a <b>separate channel</b> (CLI / off-UI approval).</>)}
          </Callout>
          <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <InactiveStamp label="Approve execution" />
            <InactiveStamp label="Reject and mutate" />
            <InactiveStamp label="Push" />
            <InactiveStamp label="Start runtime" />
          </div>
        </div>
        <ChatInputBar />
      </div>
      <PageRightRail
        decision={decision}
        copyButtons={<>
          <CopyBtn kind="copy" glyph="⧉">{T('レビュー指示', 'Review instruction')}</CopyBtn>
          <CopyBtn kind="copy" glyph="⧉">{T('HOLD 理由テンプレ', 'HOLD reason template')}</CopyBtn>
          <CopyBtn kind="show" glyph="⌕">{T('証跡を開く', 'Open evidence')}</CopyBtn>
          <CopyBtn kind="open" glyph="↗">{T('Inspector', 'Inspector')}</CopyBtn>
        </>}
      />
    </PageShell>
  );
}

function CountChip({ label, value, tone }) {
  const c = tone === 'stop' ? sk.stop : tone === 'hold' ? sk.hold : sk.go;
  return (
    <div style={{
      fontFamily: sk.mono, fontSize: 11,
      padding: '3px 9px', border: `1px solid ${c}`, color: c,
      borderRadius: 2, letterSpacing: 0.6,
    }}>{label} {value}</div>
  );
}

function QueueGroup({ tone, title, rows }) {
  const lang = useLang();
  const c = tone === 'stop' ? sk.stop : tone === 'hold' ? sk.hold : sk.go;
  return (
    <div style={{ border: `1px solid ${sk.paper3}` }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        padding: '8px 14px',
        background: sk.paper2,
        borderBottom: `1px solid ${sk.paper3}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: c }}/>
          <span style={{
            fontFamily: lang === 'en' ? sk.sans : sk.jp,
            fontSize: 13, fontWeight: 700, color: sk.ink,
          }}>{title}</span>
        </div>
        <span style={{ fontFamily: sk.mono, fontSize: 10, color: sk.ink3 }}>
          {rows.length} {T('件', 'items')}
        </span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: sk.mono, fontSize: 11 }}>
        <thead>
          <tr style={{ background: sk.paper }}>
            {['ID', 'TYPE', 'GATE', 'STATE', T('経過', 'AGE')].map(h => (
              <th key={h} style={{
                textAlign: 'left', padding: '6px 14px',
                color: sk.ink3, fontWeight: 500, letterSpacing: 0.6,
                borderBottom: `1px solid ${sk.paper3}`,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) => (
                <td key={j} style={{
                  padding: '7px 14px', color: sk.ink,
                  borderBottom: i === rows.length - 1 ? 0 : `1px solid ${sk.paper3}`,
                }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// GO
// ════════════════════════════════════════════════════════════════
function DesktopGOPage({ width = 1400, height = 900, decision = 'GO_READY' }) {
  const lang = useLang();
  const fields = [
    { k: 'session_id',           v: 'S-2026-05-17-01',                    ok: true  },
    { k: 'time_window',          v: '14:00Z..14:30Z',                     ok: true  },
    { k: 'approved_command',     v: 'push (Task 18)',                     ok: true  },
    { k: 'scope',                v: 'origin/main',                        ok: true  },
    { k: 'shutdown_required',    v: 'true',                               ok: true  },
    { k: 'port_close_required',  v: 'true',                               ok: true  },
    { k: 'evidence_path',        v: './evidence/E-006-0142.md',           ok: true  },
    { k: 'approver',             v: T('未入力 (人間)', 'missing (human)'), ok: false },
  ];
  return (
    <PageShell active="go" decision={decision} width={width} height={height}
               sub={T('GO — テンプレートはコピー専用', 'GO — templates are copy-only')}>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <PageHeader
          kicker={T('GO · 必須項目', 'GO · required fields')}
          title="GO_T_006"
          right={<div style={{ display: 'flex', gap: 6 }}>
            <CopyBtn kind="copy" glyph="⧉">{T('GOテンプレをコピー', 'Copy GO template')}</CopyBtn>
          </div>}
        />
        <div style={{ flex: 1, minHeight: 0, padding: '18px 22px', overflow: 'hidden' }}>
          <Callout tone="lock">
            {T(<>GOテンプレートは <b>コピー専用</b> です。このUIからGO実行はできません。
                CLIまたは別チャネルで人間が承認・実行します。</>,
               <>GO templates are <b>copy-only</b>. GO execution does not happen from this UI;
                 a human approves and executes via CLI or a separate channel.</>)}
          </Callout>
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {/* Required fields panel */}
            <div style={{ border: `1px solid ${sk.paper3}`, background: sk.paper }}>
              <div style={{
                padding: '8px 12px', background: sk.paper2,
                borderBottom: `1px solid ${sk.paper3}`,
                fontFamily: sk.mono, fontSize: 11, letterSpacing: 1, color: sk.ink2,
              }}>{T('REQUIRED FIELDS · 必須項目', 'REQUIRED FIELDS')}</div>
              <div style={{ padding: '10px 14px' }}>
                {fields.map(f => (
                  <div key={f.k} style={{
                    display: 'grid', gridTemplateColumns: '180px 1fr 60px',
                    gap: 10, padding: '6px 0',
                    borderBottom: `1px solid ${sk.paper3}`,
                    fontFamily: sk.mono, fontSize: 11,
                  }}>
                    <span style={{ color: sk.ink3 }}>{f.k}</span>
                    <span style={{ color: sk.ink, fontWeight: 600 }}>{f.v}</span>
                    <span style={{ textAlign: 'right' }}>
                      {f.ok
                        ? <span style={{ color: sk.pass, fontWeight: 700 }}>READY</span>
                        : <span style={{ color: sk.stop, fontWeight: 700 }}>MISSING</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rendered template preview */}
            <div style={{ border: `1px solid ${sk.go}`, background: sk.paper }}>
              <div style={{
                padding: '8px 12px', background: sk.go, color: '#fff',
                fontFamily: sk.mono, fontSize: 11, letterSpacing: 1,
                display: 'flex', justifyContent: 'space-between',
              }}>
                <span>GO TEMPLATE · {T('プレビュー', 'preview')}</span>
                <span style={{ opacity: 0.8 }}>copy-only</span>
              </div>
              <pre style={{
                margin: 0, padding: '14px 16px',
                fontFamily: sk.mono, fontSize: 11, color: sk.ink, lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
              }}>{`## GO_T_006
session_id          = S-2026-05-17-01
time_window         = 14:00Z..14:30Z
approved_command    = push (Task 18)
scope               = origin/main
shutdown_required   = true
port_close_required = true
evidence_path       = ./evidence/E-006-0142.md
approver            = <missing — human>

# このテンプレートは外部実行を起動しません。
# 別チャネルで承認操作を行ってください。`}</pre>
            </div>
          </div>

          <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <InactiveStamp label="GO Execute" />
            <InactiveStamp label="Approve & run" />
            <InactiveStamp label="Auto push" />
          </div>
        </div>
        <ChatInputBar />
      </div>
      <PageRightRail
        decision={decision}
        copyButtons={<>
          <CopyBtn kind="copy" glyph="⧉">{T('GOテンプレ', 'GO template')}</CopyBtn>
          <CopyBtn kind="copy" glyph="⧉">{T('approver メモ', 'Approver note')}</CopyBtn>
          <CopyBtn kind="show" glyph="⌕">{T('証跡', 'Evidence')}</CopyBtn>
          <CopyBtn kind="open" glyph="↗">{T('Inspector', 'Inspector')}</CopyBtn>
        </>}
      />
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════
// EVIDENCE
// ════════════════════════════════════════════════════════════════
function DesktopEvidencePage({ width = 1400, height = 900, decision = 'HOLD' }) {
  return (
    <PageShell active="evidence" decision={decision} width={width} height={height}
               sub={T('証跡 — Gateごとに保存', 'Evidence — per gate')}>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <PageHeader
          kicker={T('EVIDENCE · 証跡', 'EVIDENCE')}
          title={T('Gate 006 · Push レビュー', 'Gate 006 · Push review')}
          right={<CopyBtn kind="copy" glyph="⧉">{T('証跡サマリをコピー', 'Copy evidence summary')}</CopyBtn>}
        />
        <div style={{ flex: 1, minHeight: 0, padding: '18px 22px', overflow: 'hidden',
                       display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ border: `1px solid ${sk.paper3}`, background: sk.paper }}>
            <div style={{
              padding: '8px 12px', background: sk.paper2,
              borderBottom: `1px solid ${sk.paper3}`,
              fontFamily: sk.mono, fontSize: 11, letterSpacing: 1, color: sk.ink2,
            }}>{T('EVIDENCE CHECKLIST', 'EVIDENCE CHECKLIST')}</div>
            <div style={{ padding: '10px 14px' }}>
              {[
                [true,  'E-006-0142', T('screenshot · 確認済み',   'screenshot · verified')],
                [true,  'E-006-0141', T('log diff · 確認済み',     'log diff · verified')],
                [true,  'E-006-0140', T('plan ack · 確認済み',     'plan ack · verified')],
                [false, 'E-006-0143', T('push 結果 (未確認)',       'push result (unverified)')],
                [true,  'hidden_raw', T('32 項目をマスク',          '32 fields masked')],
              ].map(([ok, id, t]) => (
                <div key={id} style={{
                  display: 'grid', gridTemplateColumns: '20px 160px 1fr',
                  gap: 10, padding: '6px 0',
                  borderBottom: `1px solid ${sk.paper3}`,
                  fontFamily: sk.mono, fontSize: 11,
                }}>
                  <span style={{ color: ok ? sk.pass : sk.hold, fontWeight: 700 }}>
                    {ok ? '✓' : '·'}
                  </span>
                  <span style={{ color: sk.ink3 }}>{id}</span>
                  <span style={{ color: sk.ink }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ border: `1px solid ${sk.paper3}`, background: sk.paper }}>
              <div style={{
                padding: '8px 12px', background: sk.paper2,
                borderBottom: `1px solid ${sk.paper3}`,
                fontFamily: sk.mono, fontSize: 11, letterSpacing: 1, color: sk.ink2,
              }}>{T('GATE PROGRESS · 通過状況', 'GATE PROGRESS')}</div>
              <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  ['G-003', 'Bootstrap',     'PASS'],
                  ['G-004', 'Plan ack',      'PASS'],
                  ['G-005', 'Pre-push',      'PASS'],
                  ['G-006', 'Push review',   'HOLD'],
                  ['G-007', 'Post-push',     null],
                ].map(([id, label, s]) => (
                  <div key={id} style={{
                    display: 'grid', gridTemplateColumns: '60px 1fr 90px',
                    gap: 10, alignItems: 'center',
                    fontFamily: sk.mono, fontSize: 11,
                  }}>
                    <span style={{ color: sk.ink3 }}>{id}</span>
                    <span style={{ color: s ? sk.ink : sk.ink3 }}>{label}</span>
                    <span style={{ textAlign: 'right' }}>
                      {s ? <MiniLamp state={s} /> : <span style={{ color: sk.ink3 }}>—</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ border: `1px solid ${sk.paper3}`, background: sk.paper }}>
              <div style={{
                padding: '8px 12px', background: sk.paper2,
                borderBottom: `1px solid ${sk.paper3}`,
                fontFamily: sk.mono, fontSize: 11, letterSpacing: 1, color: sk.ink2,
              }}>{T('LAST COMMITS · ローカル', 'LAST COMMITS · local')}</div>
              <div style={{ padding: '10px 14px', fontFamily: sk.mono, fontSize: 11, color: sk.ink, lineHeight: 1.7 }}>
                <div>e2c4d1a · evidence(006): screenshot</div>
                <div>9a01ff8 · push: task 18 prep</div>
                <div>440b32e · plan(005): ack reviewer</div>
                <div style={{ color: sk.ink3, marginTop: 6 }}>
                  {T('未push 3 / origin/main は前進していない', 'unpushed 3 / origin/main not advanced')}
                </div>
              </div>
            </div>
          </div>
        </div>
        <ChatInputBar />
      </div>
      <PageRightRail
        decision={decision}
        copyButtons={<>
          <CopyBtn kind="copy" glyph="⧉">{T('証跡サマリ', 'Evidence summary')}</CopyBtn>
          <CopyBtn kind="copy" glyph="⧉">{T('次のGOテンプレ', 'Next GO template')}</CopyBtn>
          <CopyBtn kind="show" glyph="⌕">{T('差分を表示', 'Show diffs')}</CopyBtn>
          <CopyBtn kind="open" glyph="↗">{T('Inspector', 'Inspector')}</CopyBtn>
        </>}
      />
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════
// STOP
// ════════════════════════════════════════════════════════════════
function DesktopStopPage({ width = 1400, height = 900, decision = 'HOLD' }) {
  return (
    <PageShell active="stop" decision={decision} width={width} height={height}
               sub={T('STOP — 履歴と解除条件', 'STOP — history and release')}>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <PageHeader
          kicker={T('STOP · 停止履歴', 'STOP · stop history')}
          title={T('現在の停止状態と過去のSTOP', 'Current stops and history')}
          right={<div style={{ display: 'flex', gap: 6 }}>
            <CountChip label={T('ACTIVE', 'active')}   value={0} tone="stop" />
            <CountChip label={T('RESOLVED','resolved')} value={3} tone="go" />
          </div>}
        />
        <div style={{ flex: 1, minHeight: 0, padding: '18px 22px', overflow: 'hidden',
                       display: 'grid', gridTemplateColumns: '1fr 380px', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
            <Callout tone="lock">
              {T('STOP後は、分類 → 安全対処 → 新GO発行 の順で再開します。',
                 'After STOP: classify → safe handling → issue new GO.')}
            </Callout>
            <div style={{ border: `1px solid ${sk.paper3}` }}>
              <div style={{
                padding: '8px 14px', background: sk.paper2,
                borderBottom: `1px solid ${sk.paper3}`,
                fontFamily: sk.mono, fontSize: 11, letterSpacing: 1, color: sk.ink2,
              }}>{T('履歴 (解除済み)', 'history (resolved)')}</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: sk.mono, fontSize: 11 }}>
                <thead>
                  <tr>
                    {['TS', T('理由', 'REASON'), T('分類', 'KIND'), T('解除', 'RELEASED')].map(h => (
                      <th key={h} style={{
                        textAlign: 'left', padding: '6px 14px',
                        color: sk.ink3, fontWeight: 500, letterSpacing: 0.6,
                        borderBottom: `1px solid ${sk.paper3}`,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['05-16 22:14Z', 'external_write_attempted', 'safety',  'H. (CLI)'],
                    ['05-16 14:02Z', 'raw_value_leak_guard',     'safety',  'H. (CLI)'],
                    ['05-15 09:31Z', 'agent_off_plan',           'plan',    'H. (CLI)'],
                  ].map((r, i) => (
                    <tr key={i}>
                      {r.map((c, j) => (
                        <td key={j} style={{
                          padding: '7px 14px', color: sk.ink,
                          borderBottom: `1px solid ${sk.paper3}`,
                        }}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ border: `1px solid ${sk.paper3}`, background: sk.paper, padding: '14px 16px' }}>
            <div style={{
              fontFamily: sk.mono, fontSize: 10, letterSpacing: 1.4, color: sk.ink3,
            }}>{T('NEXT SAFE RESTART · 再開ルール', 'NEXT SAFE RESTART')}</div>
            <ol style={{
              margin: '8px 0 0', paddingLeft: 18,
              fontFamily: sk.jp, fontSize: 13, color: sk.ink, lineHeight: 1.8,
            }}>
              <li>{T('停止理由を分類 (safety / plan / external)',
                     'classify the stop (safety / plan / external)')}</li>
              <li>{T('該当ガードの再確認',
                     're-verify the matching guard')}</li>
              <li>{T('証跡を更新',
                     'update the evidence')}</li>
              <li>{T('新規GOテンプレートを発行 (コピー専用)',
                     'issue a new GO template (copy-only)')}</li>
              <li>{T('CLIから人間操作で再開',
                     'restart via human-only CLI operation')}</li>
            </ol>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 5 }}>
              <SafetyChip k="auto_release" v="never" />
              <SafetyChip k="ui_release"   v="never" />
              <SafetyChip k="release_actor" v="human only (CLI)" />
            </div>
          </div>
        </div>
        <ChatInputBar />
      </div>
      <PageRightRail
        decision={decision}
        copyButtons={<>
          <CopyBtn kind="copy" glyph="⧉">{T('再開ルールをコピー', 'Copy restart rule')}</CopyBtn>
          <CopyBtn kind="copy" glyph="⧉">{T('STOP 分類メモ', 'STOP classification note')}</CopyBtn>
          <CopyBtn kind="show" glyph="⌕">{T('履歴詳細', 'History details')}</CopyBtn>
          <CopyBtn kind="open" glyph="↗">{T('Inspector', 'Inspector')}</CopyBtn>
        </>}
      />
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════
// PUSH
// ════════════════════════════════════════════════════════════════
function DesktopPushPage({ width = 1400, height = 900, decision = 'HOLD' }) {
  return (
    <PageShell active="push" decision={decision} width={width} height={height}
               sub={T('Push — 状態のみ表示', 'Push — status only')}>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <PageHeader
          kicker={T('PUSH · 状態', 'PUSH · status')}
          title={T('Task 18 · push 準備', 'Task 18 · push readiness')}
          right={<CopyBtn kind="copy" glyph="⧉">{T('Push GO テンプレ', 'Copy push GO template')}</CopyBtn>}
        />
        <div style={{ flex: 1, minHeight: 0, padding: '18px 22px', overflow: 'hidden',
                       display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ border: `1px solid ${sk.paper3}`, background: sk.paper }}>
            <div style={{
              padding: '8px 12px', background: sk.paper2,
              borderBottom: `1px solid ${sk.paper3}`,
              fontFamily: sk.mono, fontSize: 11, letterSpacing: 1, color: sk.ink2,
            }}>{T('GIT STATUS · 状態', 'GIT STATUS')}</div>
            <div style={{ padding: '10px 14px' }}>
              <KV label="branch"         value="feat/task-18" mono />
              <KV label="HEAD"           value="e2c4d1a"      mono />
              <KV label="origin/main"    value="440b32e"      mono />
              <KV label="commits_ahead"  value="3"            mono />
              <KV label="staged"         value="0"            mono />
              <KV label="dirty_tracked"  value="0"            mono />
              <KV label="approved_commit" value="e2c4d1a"     mono />
              <KV label="push_GO"        value={T('未取得 (人間が発行)', 'pending (human-issued)')} mono />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Callout tone="lock">
              {T(<>このUIから push は <b>実行できません</b>。人間GO後、CLIまたは別チャネルで実行してください。</>,
                 <>This UI <b>cannot push</b>. After a human GO, execute via CLI or a separate channel.</>)}
            </Callout>
            <div style={{ border: `1px solid ${sk.go}`, background: sk.paper }}>
              <div style={{
                padding: '8px 12px', background: sk.go, color: '#fff',
                fontFamily: sk.mono, fontSize: 11, letterSpacing: 1,
                display: 'flex', justifyContent: 'space-between',
              }}>
                <span>PUSH GO TEMPLATE · {T('プレビュー', 'preview')}</span>
                <span style={{ opacity: 0.8 }}>copy-only</span>
              </div>
              <pre style={{
                margin: 0, padding: '12px 14px',
                fontFamily: sk.mono, fontSize: 11, color: sk.ink, lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
              }}>{`## PUSH_GO_T_006
branch          = feat/task-18
approved_commit = e2c4d1a
scope           = origin/main
evidence_path   = ./evidence/E-006-0142.md
approver        = <missing — human>

# このテンプレートはpushを実行しません。
# CLI (git push) は人間が手で行ってください。`}</pre>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <InactiveStamp label="Push from UI" />
              <InactiveStamp label="Auto push" />
              <InactiveStamp label="Approve push automatically" />
            </div>
          </div>
        </div>
        <ChatInputBar />
      </div>
      <PageRightRail
        decision={decision}
        copyButtons={<>
          <CopyBtn kind="copy" glyph="⧉">{T('push GO テンプレ', 'push GO template')}</CopyBtn>
          <CopyBtn kind="copy" glyph="⧉">{T('git status サマリ', 'git status summary')}</CopyBtn>
          <CopyBtn kind="show" glyph="⌕">{T('証跡を開く', 'Open evidence')}</CopyBtn>
          <CopyBtn kind="open" glyph="↗">{T('Inspector', 'Inspector')}</CopyBtn>
        </>}
      />
    </PageShell>
  );
}

Object.assign(window, {
  DesktopOutboxPage, DesktopQueuePage, DesktopGOPage,
  DesktopEvidencePage, DesktopStopPage, DesktopPushPage,
  PageHeader, Callout, DraftCard, QueueGroup, CountChip,
});
