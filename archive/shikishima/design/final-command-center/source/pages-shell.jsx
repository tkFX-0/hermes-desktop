// pages-shell.jsx — Frontend shell shared by every primary page.
// Provides: PageShell (Topbar + PageTabs + safety strip + body),
//           ChatPanel + ChatInputBar (chat-only send, never executes),
//           SafetyStrip, MiniLampRow,
//           StatusKVList — a thin KV bar used in many pages.

// ────────── PageTabs ──────────
// The full nav for the daily-use surfaces. `active` is the canonical id.
//
// Tabs are NAVIGATION ONLY. They never execute actions or approve GO.
// Inactive tabs are dim ink3; the active one gets an underline + bold mono.
const PAGES = [
  { id: 'operator',  ja: '操作室',    en: 'Operator'  },
  { id: 'chat',      ja: 'チャット',  en: 'Chat'      },
  { id: 'stackchan', ja: 'StackChan', en: 'StackChan' },
  { id: 'outbox',    ja: '下書き',    en: 'Outbox'    },
  { id: 'queue',     ja: '承認待ち',  en: 'Queue'     },
  { id: 'go',        ja: 'GO',        en: 'GO'        },
  { id: 'evidence',  ja: '証跡',      en: 'Evidence'  },
  { id: 'stop',      ja: 'STOP',      en: 'STOP'      },
  { id: 'push',      ja: 'Push',      en: 'Push'      },
  { id: 'inspector', ja: '詳細',      en: 'Inspector' },
  { id: 'settings',  ja: '設定',      en: 'Settings'  },
  { id: 'help',      ja: 'ヘルプ',    en: 'Help'      },
];

function PageTabs({ active = 'operator', compact = false }) {
  const lang = useLang();
  return (
    <div style={{
      display: 'flex', gap: 0,
      background: sk.paper2,
      borderBottom: `1px solid ${sk.paper3}`,
      padding: compact ? '0 8px' : '0 20px',
      overflowX: 'auto', flexWrap: 'nowrap',
      // hide scrollbars (touch-friendly horizontal scroll)
      scrollbarWidth: 'none',
    }}>
      {PAGES.map((p) => {
        const isActive = p.id === active;
        return (
          <div key={p.id} style={{
            padding: compact ? '8px 10px' : '11px 14px',
            fontFamily: lang === 'en' ? sk.sans : sk.jp,
            fontSize: compact ? 11 : 12, letterSpacing: 0.3,
            color: isActive ? sk.ink : sk.ink3,
            fontWeight: isActive ? 700 : 500,
            borderBottom: isActive ? `2px solid ${sk.ink}` : '2px solid transparent',
            whiteSpace: 'nowrap', flex: '0 0 auto',
            cursor: 'pointer',
          }}>{lang === 'en' ? p.en : p.ja}</div>
        );
      })}
    </div>
  );
}

// ────────── SafetyStrip ──────────
// One-line "always on" safety summary visible at the top of every page.
function SafetyStrip({ decision = 'HOLD' }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '7px 20px',
      background: sk.paper, borderBottom: `1px solid ${sk.paper3}`,
      flexWrap: 'wrap', gap: 8,
    }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        <MiniLamp state={decision} />
        <SafetyChip k="execution"        v="disabled" />
        <SafetyChip k="productionReady"  v="false" />
        <SafetyChip k="external_write"   v="false" />
        <SafetyChip k="rawValues"        v="hidden" />
        <SafetyChip k="runtime"          v="stopped" />
        <SafetyChip k="stackchan"        v="connected/HOLD" />
      </div>
      <span style={{ fontFamily: sk.mono, fontSize: 10, color: sk.ink3, letterSpacing: 0.4 }}>
        {T('安全境界 · 常時表示', 'safety boundary · always visible')}
      </span>
    </div>
  );
}

// ────────── PageShell ──────────
// Wraps every page with: Topbar / PageTabs / SafetyStrip / body.
// The body is whatever children you pass.
function PageShell({ active, decision = 'HOLD', sub, children,
                     width = 1400, height = 900 }) {
  const lang = useLang();
  return (
    <div style={{
      width, height, background: sk.paper,
      fontFamily: sk.sans, color: sk.ink,
      display: 'flex', flexDirection: 'column',
      border: `1px solid ${sk.rule}`,
      overflow: 'hidden',
    }}>
      <Topbar mode="OPERATOR" sub={sub} />
      <PageTabs active={active} />
      <SafetyStrip decision={decision} />
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
        {children}
      </div>
      <div style={{
        padding: '7px 20px',
        borderTop: `1px solid ${sk.paper3}`,
        background: sk.paper2,
        display: 'flex', justifyContent: 'space-between',
        fontFamily: sk.mono, fontSize: 10, color: sk.ink3, letterSpacing: 0.5,
      }}>
        <span>{T('しきしま · Private Console', 'shikishima · private console')}</span>
        <span>{T('このUIから外部実行は発生しません', 'this UI never performs external execution')}</span>
      </div>
    </div>
  );
}

// ────────── ChatInputBar ──────────
// The send button. Allowed meaning ONLY: send a chat message inside this UI.
// The safety note under the input is the canonical wording.
function ChatInputBar({ compact = false }) {
  const lang = useLang();
  const jp = lang !== 'en';
  return (
    <div style={{
      background: sk.paper2,
      borderTop: `1px solid ${sk.paper3}`,
      padding: compact ? '8px 10px 10px' : '12px 16px 14px',
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: compact ? '1fr 92px 60px' : '1fr 130px 96px',
        gap: 6, alignItems: 'stretch',
      }}>
        <div style={{
          background: sk.paper, border: `1px solid ${sk.rule}`,
          padding: compact ? '9px 12px' : '11px 14px',
          fontFamily: jp ? sk.jp : sk.sans, fontSize: compact ? 12 : 13,
          color: sk.ink3, borderRadius: 2,
          minHeight: compact ? 36 : 44, display: 'flex', alignItems: 'center',
        }}>
          {T('しきしまに確認したいことを入力…',
             'Ask Shikishima what to do next…')}
        </div>
        {/* SEND — chat-only. Distinct color = action allowed within boundary,
            distinct label = "しきしまへ送信" to remove ambiguity. */}
        <button style={{
          background: sk.go, color: '#fff',
          border: `1px solid ${sk.go}`, borderRadius: 2,
          padding: compact ? '0 8px' : '0 12px',
          fontFamily: jp ? sk.jp : sk.sans, fontSize: compact ? 12 : 13, fontWeight: 700,
          cursor: 'pointer', letterSpacing: 0.4,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <span style={{
            fontFamily: sk.mono, fontSize: 9, fontWeight: 700, letterSpacing: 0.8,
            opacity: 0.85, border: '1px solid rgba(255,255,255,.4)',
            padding: '1px 4px', borderRadius: 2,
          }}>CHAT</span>
          {T('しきしまへ送信', 'Send to Shikishima')}
        </button>
        {/* TEMPLATE — copy-only */}
        <button style={{
          background: sk.paper, color: sk.ink,
          border: `1px solid ${sk.rule}`, borderRadius: 2,
          padding: compact ? '0 6px' : '0 10px',
          fontFamily: jp ? sk.jp : sk.sans, fontSize: compact ? 11 : 12, fontWeight: 600,
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <span style={{
            fontFamily: sk.mono, fontSize: 9, fontWeight: 700, letterSpacing: 0.8,
            color: sk.ink3, border: `1px solid ${sk.paper3}`,
            padding: '1px 4px', borderRadius: 2,
          }}>COPY</span>
          {T('テンプレ', 'Template')}
        </button>
      </div>
      {/* Safety annotation — canonical text */}
      <div style={{
        fontFamily: jp ? sk.jp : sk.sans, fontSize: compact ? 10 : 11,
        color: sk.ink3, lineHeight: 1.5,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{
          fontFamily: sk.mono, fontSize: 9, fontWeight: 700, letterSpacing: 0.8,
          color: sk.stop, border: `1px solid ${sk.stop}`, padding: '1px 5px',
          borderRadius: 2,
        }}>SAFE</span>
        {T('チャット送信のみ。外部送信 / push / 実行は行いません。',
           'Chat message only. This does not push, execute, or write externally.')}
      </div>
    </div>
  );
}

// ────────── ChatPanel ──────────
// Renders a list of chat rows with optional system safety notes. Used inside
// the dedicated Chat page and in the Chat mini-panel on other pages.
function ChatPanel({ rows = [], compact = false }) {
  return (
    <div style={{
      flex: 1, minHeight: 0,
      padding: compact ? '12px 12px 4px' : '18px 22px',
      overflow: 'hidden',
    }}>
      {rows.map((r, i) => {
        if (r.kind === 'safety') return <SystemSafetyNote key={i}>{r.children}</SystemSafetyNote>;
        if (r.kind === 'template') return <TemplateMessage key={i}>{r.children}</TemplateMessage>;
        return (
          <ChatRow key={i} speaker={r.speaker || 'S'} mono={r.mono} dim={r.dim}>
            {r.children}
          </ChatRow>
        );
      })}
    </div>
  );
}

// "System" message — sits between H/Shikishima rows and prints invariants.
function SystemSafetyNote({ children }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '88px 1fr', gap: 14,
      marginBottom: 14, alignItems: 'start',
    }}>
      <div style={{
        fontFamily: sk.mono, fontSize: 11, color: sk.stop,
        letterSpacing: 0.6, paddingTop: 10, textAlign: 'right',
      }}>System:</div>
      <div style={{
        fontFamily: sk.mono, fontSize: 11, color: sk.ink2,
        background: sk.paper2,
        border: `1px solid ${sk.stop}`,
        borderLeft: `3px solid ${sk.stop}`,
        padding: '8px 12px', lineHeight: 1.7,
      }}>
        {children}
      </div>
    </div>
  );
}

// "Template" message — formatted block (e.g. GO template draft inline).
function TemplateMessage({ children }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '88px 1fr', gap: 14,
      marginBottom: 14, alignItems: 'start',
    }}>
      <div style={{
        fontFamily: sk.mono, fontSize: 11, color: sk.go,
        letterSpacing: 0.6, paddingTop: 10, textAlign: 'right',
      }}>Template:</div>
      <div style={{
        fontFamily: sk.mono, fontSize: 11, color: sk.ink, background: sk.paper2,
        border: `1px solid ${sk.go}`,
        borderLeft: `3px solid ${sk.go}`,
        padding: '10px 12px', lineHeight: 1.6, whiteSpace: 'pre-wrap',
      }}>
        {children}
      </div>
    </div>
  );
}

// ────────── PageRightRail ──────────
// Standard right rail with: Next action card + safety lamps + copy buttons.
// Used by Operator/Chat/StackChan/Outbox/Queue/…/Push so the surface stays
// consistent.
function PageRightRail({ decision = 'HOLD',
                          nextAction = null,
                          copyButtons = null,
                          extra = null,
                          width = 320 }) {
  const lang = useLang();
  return (
    <div style={{
      width, flex: '0 0 auto',
      borderLeft: `1px solid ${sk.paper3}`,
      padding: '18px 18px',
      background: sk.paper2,
      display: 'flex', flexDirection: 'column', gap: 14,
      overflow: 'hidden',
    }}>
      <div>
        <PanelTitle kicker={T('NEXT · 次の必要アクション', 'NEXT · required action')}
                    title={T('次にやる事', 'What to do next')} />
        {nextAction || <NextActionCard state={decision} />}
      </div>
      <div>
        <PanelTitle kicker="SAFETY" title={T('安全境界 · 常時', 'Safety boundary · always')} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <SafetyChip k="execution"         v="disabled" />
          <SafetyChip k="productionReady"   v="false" />
          <SafetyChip k="external_write"    v="false" />
          <SafetyChip k="rawValuesReported" v="false" />
        </div>
      </div>
      <div>
        <PanelTitle kicker="COPY-ONLY" title={T('許可済みアクション', 'permitted actions')} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {copyButtons || (<>
            <CopyBtn kind="copy" glyph="⧉">{T('GOテンプレート', 'GO template')}</CopyBtn>
            <CopyBtn kind="copy" glyph="⧉">{T('証跡サマリ', 'Evidence summary')}</CopyBtn>
            <CopyBtn kind="show" glyph="⌕">{T('詳細', 'Details')}</CopyBtn>
            <CopyBtn kind="open" glyph="↗">{T('Inspector', 'Inspector')}</CopyBtn>
          </>)}
        </div>
      </div>
      {extra}
    </div>
  );
}

// ────────── InactiveStamp ──────────
// "Send inactive", "Push inactive" etc — looks like a button but clearly
// not. For Outbox/Queue/Push where we want to label what is *missing* by design.
function InactiveStamp({ label }) {
  const lang = useLang();
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: sk.sans, fontSize: 12, fontWeight: 600,
      color: sk.ink3, background: 'transparent',
      border: `1px dashed ${sk.ink3}`,
      borderRadius: 2, padding: '5px 10px',
      letterSpacing: 0.3,
      textDecoration: 'line-through',
    }}>
      <span style={{
        fontFamily: sk.mono, fontSize: 9, fontWeight: 700, letterSpacing: 0.8,
        color: sk.ink3, border: `1px solid ${sk.paper3}`,
        padding: '1px 4px', borderRadius: 2, textDecoration: 'none',
      }}>OFF</span>
      {label}
      <span style={{
        fontFamily: lang === 'en' ? sk.sans : sk.jp, fontSize: 9, opacity: 0.7,
        textDecoration: 'none',
      }}>· {T('設計上 inactive', 'inactive by design')}</span>
    </span>
  );
}

Object.assign(window, {
  PAGES, PageTabs, SafetyStrip, PageShell, PageRightRail,
  ChatInputBar, ChatPanel, SystemSafetyNote, TemplateMessage, InactiveStamp,
});
