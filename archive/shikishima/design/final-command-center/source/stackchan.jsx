// stackchan.jsx — StackChan 管制室 (Control Room).
// New primitives in this file:
//   CONN_STATES, ConnLamp, BoundaryPanel, FacePreview, EventLog
//   DesktopStackChan, MobileStackChan, StackChanMiniCard
// Conventions follow shikishima.jsx — no execution verbs, copy-only buttons,
// safety boundary always visible. All strings via T(ja, en).

// ────────── Connection states ──────────
// Separate from Shikishima decision states because they describe the link
// to the physical device, not the project's safety gate.
const CONN_STATES = {
  DISCONNECTED: { code: 'DISCONNECTED', color: 'var(--ink3)',   soft: 'var(--paper2)',
                  jp: '未接続',     en: 'Not connected' },
  CONNECTING:   { code: 'CONNECTING',   color: sk.go,            soft: sk.goSoft,
                  jp: '接続待機中', en: 'Connecting' },
  CONNECTED:    { code: 'CONNECTED',    color: sk.pass,          soft: sk.passSoft,
                  jp: '接続済み',   en: 'Connected' },
  STALE:        { code: 'STALE',        color: sk.hold,          soft: sk.holdSoft,
                  jp: '応答遅延',   en: 'Stale' },
  ERROR:        { code: 'ERROR',        color: sk.stop,          soft: sk.stopSoft,
                  jp: '接続不安定', en: 'Connection error' },
};

// ────────── Expression mapping ──────────
// StackChan's "face" always follows Shikishima's decision state. Expression
// is display-only — never implies physical motion.
const EXPRESSIONS = {
  HOLD:     { glyph: '(･_･;)',  jp: '待機中',  en: 'holding'      },
  GO_READY: { glyph: '(･ω･)',   jp: '判断準備', en: 'review ready'  },
  PASS:     { glyph: '(´ᴗ`)',   jp: '通過完了', en: 'passed'        },
  STOP:     { glyph: '(！_！)', jp: '注意',    en: 'caution'       },
  REJECT:   { glyph: '(×_×)',   jp: '却下',    en: 'rejected'      },
};

// When physically disconnected, override to a "no signal" face.
const EXPR_OFFLINE = { glyph: '(  _  )', jp: 'オフライン', en: 'offline' };

// ────────── ConnLamp ──────────
// Same vocabulary as Lamp but for the connection state of the physical device.
function ConnLamp({ state = 'DISCONNECTED', size = 'lg' }) {
  const s = CONN_STATES[state] || CONN_STATES.DISCONNECTED;
  const lang = useLang();
  const isLg = size === 'lg';
  const phrase = lang === 'en' ? s.en : s.jp;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: isLg ? 14 : 10,
      padding: isLg ? '14px 18px' : '8px 10px',
      background: s.soft,
      border: `1.5px solid ${s.color}`,
      borderRadius: 4,
    }}>
      <div style={{
        width: isLg ? 18 : 10, height: isLg ? 18 : 10, borderRadius: '50%',
        background: s.color,
        boxShadow: `0 0 0 ${isLg ? 3 : 2}px ${s.soft}, 0 0 ${isLg ? 12 : 6}px ${s.color}88`,
        flex: '0 0 auto',
      }}/>
      <div>
        <div style={{
          fontFamily: sk.mono, fontWeight: 700,
          fontSize: isLg ? 14 : 11,
          letterSpacing: 1, color: s.color, lineHeight: 1,
        }}>{s.code}</div>
        <div style={{
          fontFamily: lang === 'en' ? sk.sans : sk.jp, fontSize: isLg ? 12 : 10,
          color: sk.ink, marginTop: 3,
        }}>{phrase}</div>
      </div>
    </div>
  );
}

// ────────── BoundaryPanel ──────────
// Strong "this is locked" container. Top strip is dark. Inside: title, big
// state word, helper paragraph, KV flags.
function BoundaryPanel({ kicker, title, state, jp, en, flags = [], tone = 'lock' }) {
  const lang = useLang();
  // Tone colors: 'lock' uses red lock, 'mute' uses ink3 (disabled)
  const color = tone === 'lock' ? sk.stop : sk.ink3;
  return (
    <div style={{
      border: `1.5px solid ${color}`,
      background: sk.paper,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '7px 12px', background: color, color: sk.paper,
        fontFamily: sk.mono, fontSize: 10, letterSpacing: 1.4,
      }}>
        <span>{kicker}</span>
        <span style={{ opacity: 0.7 }}>{state}</span>
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div style={{
          fontFamily: lang === 'en' ? sk.sans : sk.jp,
          fontWeight: 600, fontSize: 14, color: sk.ink, lineHeight: 1.4,
        }}>{title}</div>
        <div style={{
          fontFamily: lang === 'en' ? sk.sans : sk.jp,
          fontSize: 11.5, color: sk.ink2, marginTop: 6, lineHeight: 1.55,
        }}>{lang === 'en' ? en : jp}</div>

        {flags.length > 0 && (
          <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {flags.map(([k, v]) => (
              <SafetyChip key={k} k={k} v={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ────────── FacePreview ──────────
// The big kaomoji. Picks expression from Shikishima decision, but overrides
// to OFFLINE when disconnected. Always labeled.
function FacePreview({ decision = 'HOLD', conn = 'CONNECTED', big = true }) {
  const lang = useLang();
  const e = (conn === 'DISCONNECTED' || conn === 'ERROR') ? EXPR_OFFLINE : EXPRESSIONS[decision];
  const label = lang === 'en' ? e.en : e.jp;
  return (
    <div style={{
      border: `1px solid ${sk.paper3}`,
      background: sk.paper2,
      padding: big ? '24px 18px 18px' : '14px 12px 12px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: big ? 16 : 8,
    }}>
      <div style={{
        fontFamily: sk.mono, fontSize: 9, letterSpacing: 1.4, color: sk.ink3,
      }}>{T('現在の表情', 'CURRENT EXPRESSION')}</div>
      <div style={{
        fontFamily: sk.mono, fontWeight: 600,
        fontSize: big ? 64 : 32, color: sk.ink,
        lineHeight: 1, letterSpacing: 0,
        // tabular alignment so swap doesn't shift box width
        fontVariantNumeric: 'tabular-nums',
      }}>{e.glyph}</div>
      <div style={{
        fontFamily: sk.mono, fontSize: big ? 11 : 10, color: sk.ink3,
      }}>
        {`${decision} → `}
        <span style={{ color: sk.ink, fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{
        fontFamily: lang === 'en' ? sk.sans : sk.jp,
        fontSize: big ? 11 : 10, color: sk.ink3,
        textAlign: 'center', lineHeight: 1.5, marginTop: big ? 6 : 2,
      }}>
        {T('表情は表示のみ。物理操作を意味しない。',
           'Expression is display-only. It does not imply motion.')}
      </div>
    </div>
  );
}

// ────────── EventLog ──────────
function EventLog({ rows, conn = 'CONNECTED' }) {
  const lang = useLang();
  const hb = {
    CONNECTED:    { jp: 'active',      en: 'active' },
    CONNECTING:   { jp: '開始待ち',    en: 'not started' },
    DISCONNECTED: { jp: '未開始',      en: 'not started' },
    STALE:        { jp: 'stale',       en: 'stale' },
    ERROR:        { jp: '切断',        en: 'disconnected' },
  }[conn] || { jp: '—', en: '—' };

  return (
    <div style={{
      border: `1px solid ${sk.paper3}`,
      background: sk.paper,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 12px', background: sk.paper2,
        borderBottom: `1px solid ${sk.paper3}`,
      }}>
        <span style={{ fontFamily: sk.mono, fontSize: 10, letterSpacing: 1.2, color: sk.ink2 }}>
          {T('EVENT LOG · 読み取り専用 · raw値マスク',
             'EVENT LOG · read-only · raw values masked')}
        </span>
        <span style={{ fontFamily: sk.mono, fontSize: 10, color: sk.ink3 }}>
          heartbeat = {lang === 'en' ? hb.en : hb.jp}
        </span>
      </div>
      <div style={{
        padding: '8px 12px', overflow: 'hidden',
        fontFamily: sk.mono, fontSize: 11, color: sk.ink, lineHeight: 1.65,
      }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: 12 }}>
            <span style={{ color: sk.ink3, flex: '0 0 auto' }}>{r[0]}</span>
            <span>{lang === 'en' ? r[2] : r[1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Per-connection event lists.
function eventsFor(conn) {
  if (conn === 'DISCONNECTED') return [
    ['17:00', '管制室を開いた',                  'control room opened'],
    ['17:00', 'StackChan未接続を確認',           'StackChan not connected, confirmed'],
    ['17:00', 'しきしまリンク 待機中',           'Shikishima link waiting'],
    ['17:00', '物理操作 HOLD を維持',            'physical operation HOLD maintained'],
    ['17:00', '音声/カメラ/マイク disabled',     'voice / camera / mic disabled'],
  ];
  if (conn === 'CONNECTED') return [
    ['17:05', 'StackChan 接続要求受領',          'StackChan connection request received'],
    ['17:05', 'デバイス識別 verified_local',     'device identity verified_local_device'],
    ['17:06', 'しきしま安全状態を同期',           'Shikishima safety state synced'],
    ['17:06', 'productionReady=false 確認',      'productionReady=false confirmed'],
    ['17:06', '表情を holding に設定',           'expression set to holding'],
    ['17:07', '物理操作 HOLD を維持',            'physical operation HOLD maintained'],
  ];
  if (conn === 'STALE') return [
    ['17:05', 'StackChan 接続成立',              'StackChan connection established'],
    ['17:06', 'しきしま安全状態を同期',           'Shikishima safety state synced'],
    ['17:09', 'heartbeat 遅延を検知',            'heartbeat delay detected'],
    ['17:10', '物理操作 HOLD を維持 (安全側)',   'physical operation HOLD maintained (safe-side)'],
    ['17:10', '音声/カメラ/マイク disabled 維持','voice / camera / mic remain disabled'],
  ];
  return [
    ['17:05', '接続を試行',                       'connection attempted'],
    ['17:06', '応答途絶を検知',                   'response loss detected'],
    ['17:06', 'StackChan を locked 状態に',       'StackChan moved to locked state'],
    ['17:06', '物理操作 HOLD を維持',             'physical operation HOLD maintained'],
    ['17:06', '人間の確認待ち',                   'awaiting human verification'],
  ];
}

// ────────── DesktopStackChan ──────────
function DesktopStackChan({ conn = 'CONNECTED', decision = 'HOLD',
                             width = 1200, height = 820 }) {
  const lang = useLang();
  const jp = lang !== 'en';
  const c = CONN_STATES[conn];

  // Banner sentence varies by connection state.
  const bannerText = {
    DISCONNECTED: {
      ja: 'StackChanはまだ接続されていません。接続後も、最初は表示のみで開始します。',
      en: 'StackChan is not yet connected. After connection, it starts in display-only mode.',
    },
    CONNECTING: {
      ja: '接続を試行中。安全のため物理操作はHOLDのまま開始します。',
      en: 'Connection in progress. Physical operation will remain HOLD on startup.',
    },
    CONNECTED: {
      ja: 'StackChanはしきしまに接続されています。現在は表示端末として同期中です。物理操作はまだ許可されていません。',
      en: 'StackChan is connected to Shikishima as a display terminal. Physical operation is not yet permitted.',
    },
    STALE: {
      ja: '接続状態を確認できません。安全のためStackChan操作はHOLDです。',
      en: 'Cannot verify connection status. StackChan operation is held for safety.',
    },
    ERROR: {
      ja: '接続が不安定です。StackChanは locked 状態に移行しました。人間の確認が必要です。',
      en: 'Connection is unstable. StackChan has moved to locked state. Human verification is required.',
    },
  }[conn];

  // Display link state depends on connection.
  const displayLink = (conn === 'CONNECTED') ? 'active' :
                      (conn === 'STALE') ? 'stale' : 'inactive';

  return (
    <div style={{
      width, height, background: sk.paper,
      fontFamily: sk.sans, color: sk.ink,
      display: 'flex', flexDirection: 'column',
      border: `1px solid ${sk.rule}`,
    }}>
      <Topbar mode="OPERATOR" sub={T('StackChan 管制室', 'StackChan Control Room')} />

      {/* Canonical PageTabs — StackChan active */}
      <PageTabs active="stackchan" />

      {/* Banner: connection state + Shikishima decision */}
      <div style={{
        padding: '14px 22px',
        background: sk.paper,
        borderBottom: `1px solid ${sk.paper3}`,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18,
        alignItems: 'center',
      }}>
        <div>
          <div style={{
            fontFamily: sk.mono, fontSize: 10, letterSpacing: 1.6, color: sk.ink3,
          }}>{T('CONNECTION · 接続状態', 'CONNECTION')}</div>
          <div style={{ marginTop: 6 }}>
            <ConnLamp state={conn} size="lg" />
          </div>
        </div>
        <div>
          <div style={{
            fontFamily: sk.mono, fontSize: 10, letterSpacing: 1.6, color: sk.ink3,
          }}>{T('SHIKISHIMA DECISION · しきしま判断', 'SHIKISHIMA DECISION')}</div>
          <div style={{ marginTop: 6 }}>
            <Lamp state={decision} size="lg" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{
        flex: 1, minHeight: 0, padding: 20,
        display: 'grid', gridTemplateColumns: '360px 1fr 360px', gap: 16,
      }}>
        {/* LEFT — Face preview + Shikishima link */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          <FacePreview decision={decision} conn={conn} />
          <ShikishimaLinkPanel conn={conn} decision={decision} />
        </div>

        {/* CENTER — Lamps grid + Device status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          <PanelTitle kicker={T('SAFETY LAMPS · 状態ランプ', 'SAFETY LAMPS')}
                      title={T('3秒で読める安全状態', 'safety state readable in 3 seconds')} />
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
          }}>
            <LampRow label={T('しきしま判断', 'Shikishima')} value={decision} kind="decision"/>
            <LampRow label={T('接続', 'Connection')}        value={conn}     kind="conn"/>
            <LampRow label={T('表示リンク', 'Display link')} value={displayLink} kind="boolStr"/>
            <LampRow label={T('物理操作', 'Physical op')}    value="HOLD"     kind="hold"/>
            <LampRow label={T('音声', 'Voice')}              value="disabled" kind="off"/>
            <LampRow label={T('カメラ', 'Camera')}           value="disabled" kind="off"/>
            <LampRow label={T('マイク', 'Microphone')}       value="disabled" kind="off"/>
            <LampRow label={T('Execution', 'Execution')}     value="disabled" kind="off"/>
          </div>
          <DeviceStatus conn={conn} />
        </div>

        {/* RIGHT — boundary panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          <BoundaryPanel
            kicker={T('VOICE / CAMERA / MIC · 境界', 'VOICE / CAMERA / MIC · BOUNDARY')}
            state="disabled"
            title={T('音声・カメラ・マイクはまだ使用しません。',
                     'Voice, camera and microphone are not yet used.')}
            jp="別Gate・別GOが必要です。このUIには有効化ボタンはありません。"
            en="A separate gate and separate GO are required. There are no enable buttons in this UI."
            flags={[['voice','disabled'],['camera','disabled'],['microphone','disabled'],
                    ['wake_word','disabled'],['auto_speech','disabled']]}
            tone="mute"
          />
          <BoundaryPanel
            kicker={T('PHYSICAL OPERATION · 物理操作', 'PHYSICAL OPERATION')}
            state="HOLD"
            title={T('物理操作はまだ許可されていません。',
                     'Physical operation is not yet permitted.')}
            jp="StackChanの首振り・サーボ・物理動作は別Gateまで常にHOLDです。接続済みでも変わりません。"
            en="Servo, head motion and any physical action remain HOLD until a separate gate approves them — even when connected."
            flags={[['robotMotion','HOLD'],['servo_control','disabled'],
                    ['physical_operation','false'],['motion_profile','none'],
                    ['device_operation_gate','not_approved']]}
            tone="lock"
          />
        </div>
      </div>

      {/* Bottom — copy buttons + sentence + event log */}
      <div style={{
        padding: '14px 20px 16px',
        borderTop: `1px solid ${sk.paper3}`,
        background: sk.paper2,
        display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16,
      }}>
        <div>
          <div style={{
            fontFamily: jp ? sk.jp : sk.sans, fontSize: 13, color: sk.ink, lineHeight: 1.55,
          }}>{lang === 'en' ? bannerText.en : bannerText.ja}</div>
          <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <CopyBtn kind="copy" glyph="⧉">{T('接続チェックリストをコピー', 'Copy connection checklist')}</CopyBtn>
            <CopyBtn kind="copy" glyph="⧉">{T('StackChan GO テンプレ', 'Copy StackChan GO template')}</CopyBtn>
            <CopyBtn kind="copy" glyph="⧉">{T('安全ノート', 'Copy safety note')}</CopyBtn>
            <CopyBtn kind="show" glyph="⌕">{T('Inspector を開く', 'Show Inspector')}</CopyBtn>
          </div>
        </div>
        <EventLog rows={eventsFor(conn)} conn={conn} />
      </div>
    </div>
  );
}

// ────────── Sub-panels (desktop) ──────────
function ShikishimaLinkPanel({ conn, decision }) {
  const lang = useLang();
  const linkState = {
    DISCONNECTED: { code: 'WAITING',  jp: '待機中', en: 'waiting' },
    CONNECTING:   { code: 'SYNC…',    jp: '同期中', en: 'syncing' },
    CONNECTED:    { code: 'ACTIVE',   jp: '稼働中', en: 'active'  },
    STALE:        { code: 'STALE',    jp: '遅延',   en: 'stale'   },
    ERROR:        { code: 'ERROR',    jp: 'エラー', en: 'error'   },
  }[conn];
  const lineColor = (conn === 'CONNECTED') ? sk.pass :
                    (conn === 'STALE') ? sk.hold :
                    (conn === 'ERROR') ? sk.stop : sk.ink3;
  return (
    <div style={{
      border: `1px solid ${sk.paper3}`, background: sk.paper,
      padding: '14px 14px 16px',
    }}>
      <div style={{
        fontFamily: sk.mono, fontSize: 10, letterSpacing: 1.6, color: sk.ink3,
      }}>{T('SHIKISHIMA LINK · リンク状態', 'SHIKISHIMA LINK')}</div>
      {/* visual: Project → Console → Terminal */}
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Node label={T('しきしま計画', 'Shikishima Plan')} sub="project" tone="dark" />
        <Pipe color={lineColor} label={T('safety gate', 'safety gate')} />
        <Node label={T('しきしま Private Console', 'Shikishima Private Console')} sub="controller" />
        <Pipe color={lineColor} label={T('display / expression', 'display / expression')} />
        <Node label="StackChan" sub={T('表示・顔の端末', 'display + face terminal')} tone="end" />
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <SafetyChip k="link_status"  v={linkState.code} />
        <SafetyChip k="decision"     v={decision} />
        <SafetyChip k="safety_source" v="ShikishimaSafetyGate" />
      </div>
      <div style={{
        marginTop: 10,
        fontFamily: lang === 'en' ? sk.sans : sk.jp,
        fontSize: 11, color: sk.ink3, lineHeight: 1.55,
      }}>
        {T('StackChanは、しきしまの状態を表示する端末です。外部操作や物理動作は、別GOなしでは実行されません。',
           'StackChan is a terminal that displays Shikishima\'s state. No external action or physical motion happens without a separate GO.')}
      </div>
    </div>
  );
}

function Node({ label, sub, tone }) {
  const isDark = tone === 'dark';
  const isEnd  = tone === 'end';
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 10px',
      background: isDark ? sk.bar : sk.paper,
      color: isDark ? sk.barText : sk.ink,
      border: `1px solid ${isDark ? sk.rule : sk.paper3}`,
      borderLeft: isEnd ? `3px solid ${sk.pass}` : (isDark ? `1px solid ${sk.rule}` : `1px solid ${sk.paper3}`),
    }}>
      <span style={{ fontFamily: sk.sans, fontSize: 12, fontWeight: 600 }}>{label}</span>
      <span style={{ fontFamily: sk.mono, fontSize: 10, opacity: 0.7 }}>{sub}</span>
    </div>
  );
}

function Pipe({ color, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', height: 14,
    }}>
      <span style={{
        width: 2, height: '100%', background: color, opacity: 0.6,
      }}/>
      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9, color: 'var(--ink3)', letterSpacing: 0.6 }}>
        ↓ {label}
      </span>
    </div>
  );
}

function DeviceStatus({ conn }) {
  const lang = useLang();
  const v = {
    DISCONNECTED: {
      arrival: T('arrived',       'arrived'),
      connection: T('not_connected', 'not_connected'),
      identity: T('unknown',      'unknown'),
      role:     T('display_terminal (pending)', 'display_terminal (pending)'),
      battery:  T('unknown',      'unknown'),
      heartbeat: T('none',        'none'),
    },
    CONNECTING: {
      arrival: 'arrived',
      connection: 'pairing_required',
      identity: T('verifying…',   'verifying…'),
      role:     'display_terminal',
      battery:  'connected',
      heartbeat: T('開始待ち',     'not started'),
    },
    CONNECTED: {
      arrival:  'arrived',
      connection: 'connected',
      identity: 'verified_local_device',
      role:     'display_terminal',
      battery:  'ok',
      heartbeat: T('active · 17:07:04Z', 'active · 17:07:04Z'),
    },
    STALE: {
      arrival:  'arrived',
      connection: 'connected (stale)',
      identity: 'verified_local_device',
      role:     'display_terminal',
      battery:  'ok',
      heartbeat: T('stale · 17:06:11Z', 'stale · 17:06:11Z'),
    },
    ERROR: {
      arrival:  'arrived',
      connection: 'error',
      identity: 'verified_local_device',
      role:     'display_terminal (locked)',
      battery:  'unknown',
      heartbeat: T('disconnected', 'disconnected'),
    },
  }[conn];
  return (
    <div style={{
      border: `1px solid ${sk.paper3}`, background: sk.paper,
      padding: '12px 14px 14px', flex: 1, minHeight: 0,
    }}>
      <div style={{
        fontFamily: sk.mono, fontSize: 10, letterSpacing: 1.6, color: sk.ink3,
      }}>{T('DEVICE STATUS · 端末状態', 'DEVICE STATUS')}</div>
      <div style={{ marginTop: 6 }}>
        <KV label="device_arrival"   value={v.arrival}    mono />
        <KV label="connection"       value={v.connection} mono />
        <KV label="device_identity"  value={v.identity}   mono />
        <KV label="terminal_role"    value={v.role}       mono />
        <KV label="physical_ready"   value="future_gate_required" mono />
        <KV label="battery_or_power" value={v.battery}    mono />
        <KV label="last_heartbeat"   value={v.heartbeat}  mono />
      </div>
    </div>
  );
}

// ────────── Lamp row · used in the lamp grid ──────────
// Compact per-lamp row tuned to whatever value type it represents.
function LampRow({ label, value, kind }) {
  const lang = useLang();

  let dotColor, fg, bg, bord, valueText;
  if (kind === 'decision') {
    const s = STATES[value] || STATES.HOLD;
    dotColor = s.color; fg = s.color; bg = s.soft; bord = s.color; valueText = s.code;
  } else if (kind === 'conn') {
    const s = CONN_STATES[value] || CONN_STATES.DISCONNECTED;
    dotColor = s.color; fg = s.color; bg = s.soft; bord = s.color; valueText = s.code;
  } else if (kind === 'hold') {
    dotColor = sk.hold; fg = sk.hold; bg = sk.holdSoft; bord = sk.hold; valueText = 'HOLD';
  } else if (kind === 'off') {
    dotColor = sk.ink3; fg = sk.ink2; bg = sk.paper2; bord = sk.paper3;
    valueText = String(value).toUpperCase();
  } else if (kind === 'boolStr') {
    const v = String(value).toLowerCase();
    const isOn = (v === 'active');
    const isWarn = (v === 'stale');
    dotColor = isOn ? sk.pass : (isWarn ? sk.hold : sk.ink3);
    fg = dotColor; bg = isOn ? sk.passSoft : (isWarn ? sk.holdSoft : sk.paper2);
    bord = isOn ? sk.pass : (isWarn ? sk.hold : sk.paper3);
    valueText = v.toUpperCase();
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 10px',
      background: bg,
      border: `1px solid ${bord}`,
      borderRadius: 2,
    }}>
      <span style={{
        width: 9, height: 9, borderRadius: '50%', background: dotColor,
        boxShadow: `0 0 0 2px ${bg}, 0 0 6px ${dotColor}88`,
        flex: '0 0 auto',
      }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: lang === 'en' ? sk.sans : sk.jp,
          fontSize: 10.5, color: sk.ink2, letterSpacing: 0.2,
        }}>{label}</div>
        <div style={{
          fontFamily: sk.mono, fontSize: 11.5, fontWeight: 700, color: fg,
          letterSpacing: 0.8, marginTop: 1,
        }}>{valueText}</div>
      </div>
    </div>
  );
}

// ────────── StackChanMiniCard ──────────
// Compact card for the main Operator View.
function StackChanMiniCard({ conn = 'DISCONNECTED', decision = 'HOLD' }) {
  const lang = useLang();
  const c = CONN_STATES[conn];
  const e = (conn === 'DISCONNECTED' || conn === 'ERROR') ? EXPR_OFFLINE : EXPRESSIONS[decision];
  const display = (conn === 'CONNECTED') ? 'active' : (conn === 'STALE' ? 'stale' : 'inactive');
  return (
    <div style={{
      border: `1px solid ${sk.paper3}`,
      background: sk.paper,
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '6px 10px',
        background: sk.paper2,
        borderBottom: `1px solid ${sk.paper3}`,
      }}>
        <span style={{
          fontFamily: sk.mono, fontSize: 10, letterSpacing: 1.2, color: sk.ink2,
        }}>STACKCHAN</span>
        <span style={{ fontFamily: sk.mono, fontSize: 10, color: c.color }}>
          {c.code}
        </span>
      </div>
      <div style={{ padding: '10px 12px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{
          fontFamily: sk.mono, fontSize: 24, color: sk.ink, flex: '0 0 auto',
          minWidth: 64, textAlign: 'center',
        }}>{e.glyph}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <KV label={T('表示', 'display')}    value={display}   mono />
          <KV label={T('物理', 'physical')}   value="HOLD"     mono />
          <KV label="v / c / m"               value="disabled" mono />
        </div>
      </div>
      <div style={{
        padding: '6px 10px 10px',
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: lang === 'en' ? sk.sans : sk.jp,
          fontSize: 10, color: sk.ink3,
        }}>{T('表示端末として接続', 'connected as display terminal')}</span>
        <span style={{ fontFamily: sk.mono, fontSize: 10, color: sk.ink3, cursor: 'pointer' }}>
          {T('管制室を開く ↗', 'Open Control Room ↗')}
        </span>
      </div>
    </div>
  );
}

Object.assign(window, {
  CONN_STATES, EXPRESSIONS, EXPR_OFFLINE,
  ConnLamp, BoundaryPanel, FacePreview, EventLog,
  DesktopStackChan, StackChanMiniCard, LampRow,
});
