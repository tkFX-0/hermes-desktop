// pages-chat.jsx — dedicated Chat page (desktop + iPhone).
// Center column: chat list + input bar. Left rail: status. Right rail: standard.

// ────────── Desktop Chat Page ──────────
function DesktopChatPage({ width = 1400, height = 900, decision = 'HOLD' }) {
  const lang = useLang();
  const rows = chatRowsFor(decision);
  return (
    <PageShell active="chat" decision={decision} width={width} height={height}
               sub={T('チャット — 操作室への相談', 'Chat — talk to Shikishima')}>
      {/* LEFT — compact status */}
      <div style={{
        width: 260, flex: '0 0 auto',
        borderRight: `1px solid ${sk.paper3}`,
        padding: '18px 16px',
        display: 'flex', flexDirection: 'column', gap: 12,
        overflow: 'hidden',
      }}>
        <PanelTitle kicker={T('STATE · 現在のステート', 'STATE')} title={T('判断', 'Decision')} />
        <Lamp state={decision} size="lg" />
        <div style={{ height: 6 }}/>
        <PanelTitle kicker={T('CHAT 種別', 'CHAT KINDS')} title={T('メッセージの種類', 'Message kinds')} />
        <ChatLegend />
      </div>

      {/* CENTER — chat list + input bar */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{
          padding: '10px 22px',
          background: sk.paper2,
          borderBottom: `1px solid ${sk.paper3}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{
            fontFamily: sk.mono, fontSize: 11, letterSpacing: 1.4, color: sk.ink2,
          }}>{T('しきしま Chat · 状況会話', 'Shikishima Chat · situation')}</span>
          <span style={{
            fontFamily: sk.mono, fontSize: 10, color: sk.stop,
            border: `1px solid ${sk.stop}`, padding: '2px 7px',
            letterSpacing: 0.6, borderRadius: 2,
          }}>{T('送信 = チャットのみ', 'send = chat only')}</span>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ChatPanel rows={rows} />
        </div>
        <ChatInputBar />
      </div>

      {/* RIGHT — standard right rail */}
      <PageRightRail
        decision={decision}
        copyButtons={<>
          <CopyBtn kind="copy" glyph="⧉">{T('GOテンプレート', 'GO template')}</CopyBtn>
          <CopyBtn kind="copy" glyph="⧉">{T('証跡テンプレート', 'Evidence template')}</CopyBtn>
          <CopyBtn kind="copy" glyph="⧉">{T('HOLD 理由テンプレ', 'HOLD reason template')}</CopyBtn>
          <CopyBtn kind="show" glyph="⌕">{T('詳細を表示', 'Show details')}</CopyBtn>
          <CopyBtn kind="open" glyph="↗">{T('Inspector を開く', 'Open Inspector')}</CopyBtn>
        </>}
      />
    </PageShell>
  );
}

// ────────── Chat rows per decision state ──────────
function chatRowsFor(decision) {
  if (decision === 'HOLD') return [
    { speaker: 'H', children: T('次に何をすればいい？', 'What should I do next?') },
    { speaker: 'S', children: (
      <>
        <div>{T('Gate 006 の observation evidence は揃っています。',
                'Observation evidence for Gate 006 is ready.')}</div>
        <div style={{ marginTop: 6 }}>
          {T(<>Gate 007 に進むには <b>push GO</b> が必要です。Task 18 の push 結果を確認してください。</>,
             <>To advance to Gate 007 a <b>push GO</b> is required. Please confirm the push result of Task 18.</>)}
        </div>
      </>
    )},
    { kind: 'safety', children: (
      <>productionReady=false / execution=disabled / external_write=false / rawValuesReported=false</>
    )},
    { speaker: 'H', children: T('GO テンプレ作って。送信はしない。', 'Draft the GO template. Do not send.') },
    { kind: 'template', children: T(
      `## GO_T_006
session_id      = S-2026-05-17-01
time_window     = 14:00Z..14:30Z
approved_command= push (Task 18)
scope           = origin/main
shutdown_required = true
port_close_required = true
evidence_path   = ./evidence/E-006-0142.md`,
      `## GO_T_006
session_id      = S-2026-05-17-01
time_window     = 14:00Z..14:30Z
approved_command= push (Task 18)
scope           = origin/main
shutdown_required = true
port_close_required = true
evidence_path   = ./evidence/E-006-0142.md`,
    )},
    { speaker: 'S', dim: true, mono: true, children: T(
      '上記をクリップボードに置きました。CLI / 別チャネルへ手で貼ってください。',
      'Copied to clipboard. Paste manually into the CLI / a separate channel.'
    )},
  ];
  if (decision === 'GO_READY') return [
    { speaker: 'S', children: T(
      'Evidence は確認済みです。GOテンプレートを用意しました。送信はこのUIでは行われません。',
      'Evidence verified. GO template is ready. This UI will not send.'
    )},
    { speaker: 'H', children: T('テンプレ見せて。', 'Show the template.') },
    { kind: 'template', children: T(
      `## GO_T_006
session_id      = S-2026-05-17-01
time_window     = 14:00Z..14:30Z
approved_command= push (Task 18)
scope           = origin/main
evidence_path   = ./evidence/E-006-0142.md`,
      `## GO_T_006 (truncated)`
    )},
    { kind: 'safety', children: T(
      '送信 = チャット送信のみ。外部実行 / push / 支払 / 予約は不可。',
      'send = chat only. No external execution / push / pay / reserve.'
    )},
    { speaker: 'H', children: T('CLI で承認した。次は？', 'Approved via CLI. What next?') },
  ];
  if (decision === 'STOP') return [
    { speaker: 'S', children: (
      <div style={{ color: sk.stop, fontWeight: 600 }}>
        {T('STOPがかかっています。外部write attemptを検出。',
           'A STOP is active. External write attempt detected.')}
      </div>
    )},
    { kind: 'safety', children: T(
      'STOP後は、分類 → 安全対処 → 新GO発行 の順で再開します。',
      'After STOP: classify → safe handling → issue new GO.'
    )},
    { speaker: 'H', children: T('解除条件は？', 'Release conditions?') },
    { speaker: 'S', children: T(
      'Inspector で停止理由を確認、解除はCLIから人間操作のみ。',
      'Check the reason in Inspector; release is human-only via CLI.'
    )},
  ];
  return [];
}

// ────────── Chat legend (left rail) ──────────
function ChatLegend() {
  const items = [
    { dot: sk.ink3, label: 'Human',        jp: '人間', en: 'human input' },
    { dot: sk.go,   label: 'Shikishima',   jp: 'しきしまの応答', en: 'response' },
    { dot: sk.stop, label: 'System safety', jp: '安全注釈',   en: 'invariants' },
    { dot: sk.go,   label: 'Template',     jp: 'GO テンプレ', en: 'copy-only' },
    { dot: sk.hold, label: 'HOLD warning', jp: 'HOLD 注意',  en: 'hold' },
    { dot: sk.stop, label: 'STOP warning', jp: 'STOP 注意',  en: 'stop' },
  ];
  const lang = useLang();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((it) => (
        <div key={it.label} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '5px 8px',
          background: sk.paper, border: `1px solid ${sk.paper3}`, borderRadius: 2,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%', background: it.dot,
            boxShadow: `0 0 4px ${it.dot}`,
          }}/>
          <span style={{ fontFamily: sk.mono, fontSize: 10, color: sk.ink2, flex: 1 }}>
            {it.label}
          </span>
          <span style={{
            fontFamily: lang === 'en' ? sk.sans : sk.jp,
            fontSize: 10, color: sk.ink3,
          }}>{lang === 'en' ? it.en : it.jp}</span>
        </div>
      ))}
    </div>
  );
}

// ────────── Mobile Chat Page (iPhone 15 Pro) ──────────
function MobileChatPage({ decision = 'HOLD' }) {
  const lang = useLang();
  const jp = lang !== 'en';
  return (
    <IOSDevice width={393} height={852}>
      {/* Topbar */}
      <div style={{ background: sk.bar, color: sk.barText, padding: '10px 16px 11px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div style={{
              fontFamily: jp ? sk.jp : sk.sans, fontWeight: 700, fontSize: 14, letterSpacing: 1.5,
            }}>{T('しきしま', 'SHIKISHIMA')}</div>
            <div style={{ fontFamily: jp ? sk.jp : sk.sans, fontSize: 11, color: sk.barText2 }}>
              {T('チャット', 'Chat')}
            </div>
          </div>
          <div style={{
            fontFamily: sk.mono, fontSize: 10, letterSpacing: 0.8,
            color: sk.barText2, border: `1px solid ${sk.paper3}`,
            padding: '3px 8px', borderRadius: 2,
          }}>CHAT</div>
        </div>
      </div>

      {/* Tabs — horizontally scrollable */}
      <PageTabs active="chat" compact />

      {/* Safety strip — slim */}
      <div style={{
        padding: '7px 12px',
        borderBottom: `1px solid ${sk.paper3}`,
        background: sk.paper,
        display: 'flex', gap: 5, flexWrap: 'wrap',
      }}>
        <MiniLamp state={decision} />
        <SafetyChip k="exec"  v="disabled" />
        <SafetyChip k="prod"  v="false" />
        <SafetyChip k="ext_w" v="false" />
      </div>

      {/* Chat list */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', background: sk.paper }}>
        <MobileChatList rows={chatRowsFor(decision)} />
      </div>

      {/* Input bar */}
      <ChatInputBar compact />
    </IOSDevice>
  );
}

// Tighter mobile chat list — uses CompactChat shape from mobile.jsx is hard
// to import from outside its scope, so we render inline here.
function MobileChatList({ rows }) {
  const lang = useLang();
  const jp = lang !== 'en';
  return (
    <div style={{ padding: '10px 12px', overflow: 'hidden' }}>
      {rows.map((r, i) => {
        if (r.kind === 'safety') return (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '52px 1fr', gap: 8, marginBottom: 8,
          }}>
            <div style={{
              fontFamily: sk.mono, fontSize: 9, color: sk.stop, paddingTop: 6, textAlign: 'right',
            }}>System</div>
            <div style={{
              fontFamily: sk.mono, fontSize: 10.5, color: sk.ink2, lineHeight: 1.6,
              background: sk.paper2, border: `1px solid ${sk.stop}`, borderLeft: `3px solid ${sk.stop}`,
              padding: '6px 9px',
            }}>{r.children}</div>
          </div>
        );
        if (r.kind === 'template') return (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '52px 1fr', gap: 8, marginBottom: 8,
          }}>
            <div style={{
              fontFamily: sk.mono, fontSize: 9, color: sk.go, paddingTop: 6, textAlign: 'right',
            }}>Tmpl</div>
            <div style={{
              fontFamily: sk.mono, fontSize: 10, color: sk.ink, lineHeight: 1.5,
              background: sk.paper2, border: `1px solid ${sk.go}`, borderLeft: `3px solid ${sk.go}`,
              padding: '6px 9px', whiteSpace: 'pre-wrap',
            }}>{r.children}</div>
          </div>
        );
        const isBot = r.speaker === 'S';
        return (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '52px 1fr', gap: 8, marginBottom: 8,
          }}>
            <div style={{
              fontFamily: sk.mono, fontSize: 10, color: sk.ink3, paddingTop: 6, textAlign: 'right',
            }}>{isBot ? 'Shiki' : 'H'}</div>
            <div style={{
              fontFamily: r.mono ? sk.mono : (jp ? sk.jp : sk.sans),
              fontSize: r.mono ? 11 : 12.5,
              color: r.dim ? sk.ink2 : sk.ink,
              background: isBot ? sk.paper2 : 'transparent',
              border: isBot ? `1px solid ${sk.paper3}` : `1px dashed ${sk.paper3}`,
              padding: '6px 9px', lineHeight: 1.45,
            }}>{r.children}</div>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { DesktopChatPage, MobileChatPage, chatRowsFor });
