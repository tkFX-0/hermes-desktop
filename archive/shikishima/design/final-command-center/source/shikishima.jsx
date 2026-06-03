// shikishima.jsx — shared tokens + primitives.
// Theme: CSS variables on <html data-theme="light|dark">. Components just
// reference var(--…) via the `sk` map; no hooks needed for color.
// Language: React context. Use the T(ja, en) hook *inside* a component to
// pick the right string. Default is Japanese.

// ───────── Theme tokens (CSS-var refs) ─────────
// The actual var values live in index.html's <style> so both themes share
// one source of truth. Components opacity-blend over these.
const sk = {
  paper:    'var(--paper)',
  paper2:   'var(--paper2)',
  paper3:   'var(--paper3)',
  ink:      'var(--ink)',
  ink2:     'var(--ink2)',
  ink3:     'var(--ink3)',
  rule:     'var(--rule)',
  // header / inverse strip (always dark-ish on light, near-paper on dark)
  bar:      'var(--bar)',
  barText:  'var(--bar-text)',
  barText2: 'var(--bar-text-2)',
  // State colors. Soft variants are the *background* paired with the state
  // accent and are theme-aware (low alpha in dark mode).
  hold:      'var(--hold)',
  holdSoft:  'var(--hold-soft)',
  go:        'var(--go)',
  goSoft:    'var(--go-soft)',
  pass:      'var(--pass)',
  passSoft:  'var(--pass-soft)',
  stop:      'var(--stop)',
  stopSoft:  'var(--stop-soft)',
  reject:    'var(--reject)',
  rejectSoft:'var(--reject-soft)',
  // Type
  jp:   '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
  sans: '"IBM Plex Sans", "Inter", system-ui, sans-serif',
  mono: '"IBM Plex Mono", "JetBrains Mono", ui-monospace, Menlo, monospace',
};

// ───────── Language context + T(ja, en) hook ─────────
const LangCtx = React.createContext('ja');
function useLang() { return React.useContext(LangCtx); }
function T(ja, en) {
  return React.useContext(LangCtx) === 'en' ? en : ja;
}

// State definitions: code is universal; jp / en are the human strings.
const STATES = {
  HOLD: {
    code: 'HOLD',
    color: sk.hold, soft: sk.holdSoft,
    jp: 'まだ待機。人間GOが必要です。',
    en: 'Holding. Human GO is required.',
  },
  GO_READY: {
    code: 'GO_READY',
    color: sk.go, soft: sk.goSoft,
    jp: '人間GOの判断待ち。実行はしません。',
    en: 'Awaiting human GO. System will not execute.',
  },
  PASS: {
    code: 'PASS',
    color: sk.pass, soft: sk.passSoft,
    jp: 'Gate通過。次のGateへ。',
    en: 'Gate passed. Proceed to the next gate.',
  },
  STOP: {
    code: 'STOP',
    color: sk.stop, soft: sk.stopSoft,
    jp: '停止中。人間の解除が必要です。',
    en: 'Stopped. Human release is required.',
  },
  REJECT: {
    code: 'REJECT',
    color: sk.reject, soft: sk.rejectSoft,
    jp: '却下。再提出を要求。',
    en: 'Rejected. Resubmission requested.',
  },
};

// ───────── lamp · the headline indicator ─────────
function Lamp({ state = 'HOLD', size = 'lg', showText = true }) {
  const s = STATES[state] || STATES.HOLD;
  const isLg = size === 'lg';
  const lang = useLang();
  const phrase = lang === 'en' ? s.en : s.jp;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: isLg ? 18 : 10,
      padding: isLg ? '22px 24px' : '10px 12px',
      background: s.soft,
      border: `1.5px solid ${s.color}`,
      borderRadius: 4,
      minHeight: isLg ? 96 : 'auto',
    }}>
      <div style={{
        width: isLg ? 26 : 12, height: isLg ? 26 : 12, borderRadius: '50%',
        background: s.color,
        boxShadow: `0 0 0 ${isLg ? 4 : 2}px ${s.soft}, 0 0 ${isLg ? 18 : 8}px ${s.color}88`,
        flex: '0 0 auto',
      }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: sk.mono, fontWeight: 600,
          fontSize: isLg ? 28 : 13,
          letterSpacing: isLg ? 1.5 : 0.6,
          color: s.color, lineHeight: 1,
        }}>{s.code}</div>
        {showText && (
          <div style={{
            fontFamily: lang === 'en' ? sk.sans : sk.jp, fontWeight: 500,
            fontSize: isLg ? 15 : 11,
            color: sk.ink, marginTop: isLg ? 8 : 3, lineHeight: 1.4,
          }}>{phrase}</div>
        )}
      </div>
    </div>
  );
}

function MiniLamp({ state }) {
  const s = STATES[state] || STATES.HOLD;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: sk.mono, fontSize: 11, color: s.color,
      padding: '3px 8px',
      border: `1px solid ${s.color}`,
      background: s.soft,
      borderRadius: 2, letterSpacing: 0.5, fontWeight: 600,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.color }}/>
      {s.code}
    </span>
  );
}

// ───────── safety chip · KV flag ─────────
function SafetyChip({ k, v, tone = 'safe' }) {
  const tones = {
    safe:    { fg: sk.ink,  border: sk.rule, dot: sk.stop, bg: sk.paper },
    neutral: { fg: sk.ink2, border: sk.paper3, dot: sk.ink3, bg: sk.paper },
    warn:    { fg: '#fff',  border: sk.stop, dot: sk.stop, bg: sk.stop },
  };
  const t = tones[tone] || tones.safe;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      fontFamily: sk.mono, fontSize: 11,
      padding: '5px 10px',
      border: `1px solid ${t.border}`,
      background: t.bg,
      color: t.fg, borderRadius: 2,
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: t.dot, flex: '0 0 auto',
      }}/>
      <span style={{ opacity: 0.7 }}>{k}</span>
      <span style={{ opacity: 0.4 }}>=</span>
      <span style={{ fontWeight: 600 }}>{v}</span>
    </div>
  );
}

// ───────── chat row · H: / Shikishima: ─────────
function ChatRow({ speaker = 'H', children, mono = false, dim = false }) {
  const isBot = speaker !== 'H';
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '88px 1fr',
      gap: 14, alignItems: 'start',
      marginBottom: 14,
    }}>
      <div style={{
        fontFamily: sk.mono, fontSize: 11, color: sk.ink3,
        letterSpacing: 0.6, paddingTop: 10, textAlign: 'right',
      }}>
        {isBot ? 'Shikishima:' : 'H:'}
      </div>
      <div style={{
        fontFamily: mono ? sk.mono : sk.jp,
        fontSize: mono ? 12 : 14,
        color: dim ? sk.ink2 : sk.ink,
        background: isBot ? sk.paper2 : 'transparent',
        border: isBot ? `1px solid ${sk.paper3}` : `1px dashed ${sk.paper3}`,
        padding: '10px 14px',
        borderRadius: 2,
        lineHeight: 1.55,
      }}>
        {children}
      </div>
    </div>
  );
}

// ───────── copy-only button ─────────
function CopyBtn({ children, glyph = '⧉', kind = 'copy' }) {
  const labels = { copy: 'COPY', open: 'OPEN', show: 'SHOW' };
  return (
    <button style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      padding: '9px 14px',
      fontFamily: sk.sans, fontSize: 13, fontWeight: 500,
      background: sk.paper,
      color: sk.ink,
      border: `1px solid ${sk.rule}`,
      borderRadius: 2,
      cursor: 'pointer',
      textAlign: 'left',
    }}>
      <span style={{
        fontFamily: sk.mono, fontSize: 10, fontWeight: 700,
        letterSpacing: 0.8, color: sk.ink3,
        padding: '2px 6px', border: `1px solid ${sk.paper3}`,
        borderRadius: 2,
      }}>{labels[kind] || labels.copy}</span>
      <span style={{ flex: 1 }}>{children}</span>
      <span style={{ color: sk.ink3, fontFamily: sk.mono, fontSize: 14 }}>{glyph}</span>
    </button>
  );
}

// ───────── section header & framing ─────────
function PanelTitle({ kicker, title, right }) {
  const lang = useLang();
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      paddingBottom: 8, marginBottom: 14,
      borderBottom: `1px solid ${sk.paper3}`,
    }}>
      <div>
        {kicker && (
          <div style={{
            fontFamily: sk.mono, fontSize: 10, color: sk.ink3,
            letterSpacing: 1.4, textTransform: 'uppercase',
          }}>{kicker}</div>
        )}
        <div style={{
          fontFamily: lang === 'en' ? sk.sans : sk.jp, fontWeight: 600,
          fontSize: 14, color: sk.ink, marginTop: 2,
        }}>{title}</div>
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

// Header strip used by both operator views.
function Topbar({ mode = 'OPERATOR', sub }) {
  const lang = useLang();
  const wm = T('しきしま', 'SHIKISHIMA');
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 20px',
      background: sk.bar, color: sk.barText,
      borderBottom: `2px solid ${sk.rule}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <div style={{
          fontFamily: lang === 'en' ? sk.sans : sk.jp,
          fontWeight: 700, fontSize: 18, letterSpacing: 2,
        }}>{wm}</div>
        <div style={{
          fontFamily: sk.mono, fontSize: 11, color: sk.barText2, letterSpacing: 1,
        }}>PRIVATE CONSOLE · v0.6</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          fontFamily: sk.mono, fontSize: 10, color: sk.barText2, letterSpacing: 1,
        }}>MODE</span>
        <div style={{
          display: 'inline-flex', border: `1px solid ${sk.paper3}`, borderRadius: 2,
          overflow: 'hidden',
        }}>
          {['OPERATOR', 'INSPECTOR'].map(m => (
            <div key={m} style={{
              fontFamily: sk.mono, fontSize: 11, letterSpacing: 0.8,
              padding: '5px 12px',
              background: m === mode ? sk.paper : 'transparent',
              color:      m === mode ? sk.ink   : sk.barText2,
              fontWeight: m === mode ? 700 : 400,
            }}>{m}</div>
          ))}
        </div>
        {sub && (
          <span style={{
            fontFamily: lang === 'en' ? sk.sans : sk.jp,
            fontSize: 11, color: sk.barText2, marginLeft: 4,
          }}>{sub}</span>
        )}
      </div>
    </div>
  );
}

Object.assign(window, {
  sk, STATES, LangCtx, useLang, T,
  Lamp, MiniLamp, SafetyChip, ChatRow, CopyBtn, PanelTitle, Topbar,
});
