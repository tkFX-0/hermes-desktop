// stackchan-mobile.jsx — iPhone 15 Pro (393×852) StackChan Control Room.
// Same primitives as the desktop version, stacked vertically.

function MobileStackChan({ conn = 'CONNECTED', decision = 'HOLD' }) {
  const lang = useLang();
  const jp = lang !== 'en';

  const sentence = {
    DISCONNECTED: {
      ja: 'StackChanはまだ接続されていません。接続後も、最初は表示のみで開始します。',
      en: 'Not yet connected. Starts as display-only after connection.',
    },
    CONNECTING: {
      ja: '接続を試行中。物理操作はHOLDのまま開始します。',
      en: 'Connecting. Physical operation will remain HOLD on startup.',
    },
    CONNECTED: {
      ja: 'StackChanはしきしまに接続されています。現在は表示端末として同期中です。物理操作はまだ許可されていません。',
      en: 'Connected. Currently syncing as a display terminal. Physical operation is not yet permitted.',
    },
    STALE: {
      ja: '接続状態を確認できません。安全のため操作はHOLDです。',
      en: 'Cannot verify connection. Operation is held for safety.',
    },
    ERROR: {
      ja: '接続が不安定です。locked状態に移行しました。人間の確認が必要です。',
      en: 'Connection unstable. Moved to locked state. Human verification required.',
    },
  }[conn];

  const displayLink = (conn === 'CONNECTED') ? 'active' :
                      (conn === 'STALE') ? 'stale' : 'inactive';

  return (
    <IOSDevice width={393} height={852}>
      {/* Top app strip */}
      <div style={{
        background: sk.bar, color: sk.barText,
        padding: '10px 16px 12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div style={{
              fontFamily: jp ? sk.jp : sk.sans, fontWeight: 700, fontSize: 14, letterSpacing: 1.5,
            }}>{T('しきしま', 'SHIKISHIMA')}</div>
            <div style={{
              fontFamily: jp ? sk.jp : sk.sans, fontSize: 11, color: sk.barText2,
            }}>{T('StackChan 管制室', 'StackChan Control Room')}</div>
          </div>
          <div style={{
            fontFamily: sk.mono, fontSize: 10, letterSpacing: 0.8,
            color: sk.barText2, border: `1px solid ${sk.paper3}`,
            padding: '3px 8px', borderRadius: 2,
          }}>STACKCHAN</div>
        </div>
      </div>

      {/* Page tabs */}
      <PageTabs active="stackchan" compact />

      {/* Body */}
      <div style={{
        flex: 1, background: sk.paper,
        padding: '12px 12px 12px',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {/* Connection banner */}
        <div>
          <div style={{
            fontFamily: sk.mono, fontSize: 9, letterSpacing: 1.4, color: sk.ink3,
            marginBottom: 4,
          }}>{T('CONNECTION · 接続状態', 'CONNECTION')}</div>
          <ConnLamp state={conn} size="lg" />
        </div>

        {/* Decision + Face side-by-side */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 130px', gap: 10,
        }}>
          <div>
            <div style={{
              fontFamily: sk.mono, fontSize: 9, letterSpacing: 1.4, color: sk.ink3,
              marginBottom: 4,
            }}>{T('しきしま判断', 'SHIKISHIMA')}</div>
            <Lamp state={decision} size="lg" />
          </div>
          <div>
            <FacePreview decision={decision} conn={conn} big={false} />
          </div>
        </div>

        {/* Lamps grid */}
        <div>
          <div style={{
            fontFamily: sk.mono, fontSize: 9, letterSpacing: 1.4, color: sk.ink3,
            marginBottom: 4,
          }}>{T('SAFETY LAMPS · 安全ランプ', 'SAFETY LAMPS')}</div>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6,
          }}>
            <LampRow label={T('表示リンク', 'Display')}  value={displayLink} kind="boolStr" />
            <LampRow label={T('物理操作', 'Physical')}   value="HOLD"        kind="hold" />
            <LampRow label={T('音声', 'Voice')}          value="disabled"    kind="off" />
            <LampRow label={T('カメラ', 'Camera')}       value="disabled"    kind="off" />
            <LampRow label={T('マイク', 'Mic')}          value="disabled"    kind="off" />
            <LampRow label="Execution"                   value="disabled"    kind="off" />
          </div>
        </div>

        {/* Boundary panels stacked */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <CompactBoundary
            kicker={T('音声 / カメラ / マイク', 'VOICE / CAMERA / MIC')}
            state="disabled"
            jp="まだ使用しません。別Gate・別GOが必要です。"
            en="Not used. A separate gate and GO are required."
            flags={[['voice','disabled'],['camera','disabled'],['mic','disabled']]}
            tone="mute"
          />
          <CompactBoundary
            kicker={T('物理操作', 'PHYSICAL OPERATION')}
            state="HOLD"
            jp="サーボ・首振り・物理動作は別Gateまで常にHOLD。接続済みでも同じ。"
            en="Servo, head and any motion remain HOLD until a separate gate — even when connected."
            flags={[['robotMotion','HOLD'],['servo','disabled'],['physical','false']]}
            tone="lock"
          />
        </div>

        {/* Sentence */}
        <div style={{
          fontFamily: jp ? sk.jp : sk.sans, fontSize: 11.5, color: sk.ink2,
          lineHeight: 1.5,
          padding: '8px 10px',
          border: `1px dashed ${sk.paper3}`, background: sk.paper2,
        }}>{lang === 'en' ? sentence.en : sentence.ja}</div>

        {/* Copy buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <CopyBtn kind="copy" glyph="⧉">{T('接続チェック', 'Checklist')}</CopyBtn>
          <CopyBtn kind="copy" glyph="⧉">{T('GO テンプレ', 'GO template')}</CopyBtn>
          <CopyBtn kind="copy" glyph="⧉">{T('安全ノート', 'Safety note')}</CopyBtn>
          <CopyBtn kind="show" glyph="⌕">{T('Inspector', 'Inspector')}</CopyBtn>
        </div>

        {/* Heartbeat strip */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: sk.mono, fontSize: 9, color: sk.ink3, letterSpacing: 0.4,
          paddingTop: 2,
        }}>
          <span>{T('表示のみ · 物理は別Gate', 'display-only · physical needs another gate')}</span>
          <span>heartbeat = {conn === 'CONNECTED' ? 'active' : conn === 'STALE' ? 'stale' : '—'}</span>
        </div>
      </div>
    </IOSDevice>
  );
}

// Slim mobile variant of BoundaryPanel — shorter copy, smaller chips.
function CompactBoundary({ kicker, state, jp, en, flags, tone }) {
  const lang = useLang();
  const color = tone === 'lock' ? sk.stop : sk.ink3;
  return (
    <div style={{ border: `1.5px solid ${color}`, background: sk.paper }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        padding: '5px 10px', background: color, color: sk.paper,
        fontFamily: sk.mono, fontSize: 9, letterSpacing: 1.2,
      }}>
        <span>{kicker}</span>
        <span style={{ opacity: 0.7 }}>{state}</span>
      </div>
      <div style={{ padding: '8px 10px' }}>
        <div style={{
          fontFamily: lang === 'en' ? sk.sans : sk.jp, fontSize: 11.5,
          color: sk.ink2, lineHeight: 1.5,
        }}>{lang === 'en' ? en : jp}</div>
        <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {flags.map(([k, v]) => <SafetyChip key={k} k={k} v={v} />)}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MobileStackChan, CompactBoundary });
