// mobile.jsx — Mobile Operator View · iPhone 15 Pro (393×852, 6.1")
// All visible strings use T(ja, en).

function MobileOperator({ state = 'HOLD', taskId = 18, gate = 'Gate 006' }) {
  const lang = useLang();
  const jp = lang !== 'en';

  // Per-state NEXT action and tag.
  const nextActions = {
    HOLD: {
      tag: T('レビュー · 30秒', 'REVIEW · 30s'),
      text: T('Task 18 のpush結果を確認してください。',
              'Please confirm the push result of Task 18.'),
    },
    GO_READY: {
      tag: T('承認 · 90秒', 'APPROVE · 90s'),
      text: T('GOテンプレートをコピーし、別チャネルで承認してください。',
              'Copy the GO template and approve on a separate channel.'),
    },
    PASS: {
      tag: T('観測 · 5分', 'OBSERVE · 5m'),
      text: T('Gate 007 の観測ログを開始してください。',
              'Start observation logs for Gate 007.'),
    },
    STOP: {
      tag: T('調査', 'INVESTIGATE'),
      text: T('停止理由を確認し、解除条件を満たすまで待機。',
              'Check the STOP reason and wait until release conditions are met.'),
    },
    REJECT: {
      tag: T('書き直し', 'REWRITE'),
      text: T('却下理由をDraftで確認し、再提出を作成してください。',
              'Check the reject reason in the Draft and prepare a resubmission.'),
    },
  };
  const na = nextActions[state] || nextActions.HOLD;

  return (
    // iPhone 15 Pro logical resolution = 393 × 852 pt (6.1").
    <IOSDevice width={393} height={852}>
      {/* Top app strip — dark control-panel header */}
      <div style={{
        background: sk.bar, color: sk.barText,
        padding: '12px 18px 14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <div style={{
              fontFamily: jp ? sk.jp : sk.sans,
              fontWeight: 700, fontSize: 16, letterSpacing: 2,
            }}>{T('しきしま', 'SHIKISHIMA')}</div>
            <div style={{
              fontFamily: jp ? sk.jp : sk.sans, fontSize: 11, color: sk.barText2,
            }}>{T('操作室', 'Operator Room')}</div>
          </div>
          <div style={{
            fontFamily: sk.mono, fontSize: 10, letterSpacing: 0.8,
            color: sk.barText2, border: `1px solid ${sk.paper3}`,
            padding: '3px 8px', borderRadius: 2,
          }}>OPERATOR</div>
        </div>
      </div>

      {/* Page tabs — compact horizontal scrolling */}
      <PageTabs active="operator" compact />

      {/* Body */}
      <div style={{
        flex: 1, background: sk.paper,
        padding: '16px 14px 12px',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>

        {/* Headline lamp */}
        <Lamp state={state} size="lg" />

        {/* Next action */}
        <div style={{
          border: `1.5px solid ${sk.rule}`,
          background: sk.paper,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '7px 12px', background: sk.bar, color: sk.barText,
          }}>
            <span style={{
              fontFamily: sk.mono, fontSize: 10, letterSpacing: 1.4,
            }}>{T('NEXT · 次の必要アクション', 'NEXT · Required human action')}</span>
            <span style={{
              fontFamily: sk.mono, fontSize: 10, color: sk.barText2,
            }}>{na.tag}</span>
          </div>
          <div style={{
            padding: '12px 14px',
            fontFamily: jp ? sk.jp : sk.sans,
            fontSize: 14, color: sk.ink, lineHeight: 1.5,
          }}>{na.text}</div>
        </div>

        {/* Safety strip — always visible */}
        <div style={{
          border: `1px dashed ${sk.rule}`,
          background: 'color-mix(in oklab, var(--stop) 5%, var(--paper))',
          padding: '10px 12px',
        }}>
          <div style={{
            fontFamily: sk.mono, fontSize: 9, letterSpacing: 1.2,
            color: sk.ink3, marginBottom: 6,
          }}>{T('SAFETY BOUNDARY · 安全境界', 'SAFETY BOUNDARY')}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            <SafetyChip k="execution"      v="disabled" />
            <SafetyChip k="production"     v="false" />
            <SafetyChip k="external_write" v="false" />
            <SafetyChip k="raw_values"     v="hidden" />
          </div>
        </div>

        {/* Chat tail */}
        <div style={{
          flex: 1, minHeight: 0,
          border: `1px solid ${sk.paper3}`,
          background: sk.paper,
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 12px',
            borderBottom: `1px solid ${sk.paper3}`,
            background: sk.paper2,
          }}>
            <span style={{
              fontFamily: sk.mono, fontSize: 10, letterSpacing: 1.2, color: sk.ink2,
            }}>{T('CHAT · 状況会話 (読み取り専用)', 'CHAT · situation (read-only)')}</span>
            <span style={{ fontFamily: sk.mono, fontSize: 9, color: sk.ink3 }}>
              no-execute
            </span>
          </div>
          <div style={{
            flex: 1, padding: '12px 12px 4px', overflow: 'hidden',
          }}>
            <MobileChat state={state} gate={gate} taskId={taskId} />
          </div>
        </div>

        {/* Copy-only buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <CopyBtn kind="copy" glyph="⧉">{T('GOテンプレート',  'GO template')}</CopyBtn>
          <CopyBtn kind="copy" glyph="⧉">{T('Evidence',         'Evidence')}</CopyBtn>
          <CopyBtn kind="show" glyph="⌕">{T('詳細を表示',       'Show details')}</CopyBtn>
          <CopyBtn kind="open" glyph="↗">{T('Inspector',        'Inspector')}</CopyBtn>
        </div>

        {/* Footnote */}
        <div style={{
          fontFamily: sk.mono, fontSize: 9, color: sk.ink3, letterSpacing: 0.4,
          textAlign: 'center', paddingTop: 2,
        }}>
          {T('GO = 人間が次の手動承認を進めて良い · ≠ システム実行',
             'GO = human may proceed to manual approval · ≠ system executes')}
        </div>
      </div>
    </IOSDevice>
  );
}

// Per-state mobile chat tail.
function MobileChat({ state, gate, taskId }) {
  if (state === 'HOLD') {
    return <>
      <CompactChat speaker="H">{T('次に何をすればいい？', 'What should I do next?')}</CompactChat>
      <CompactChat speaker="S">
        <div>{T(
          `${gate} の観測evidenceが揃いました。`,
          `Observation evidence for ${gate} is ready.`,
        )}</div>
        <div style={{ marginTop: 4 }}>
          {T('Gate 007 へ進むには push GO が必要です。',
             'A push GO is required before moving to Gate 007.')}
        </div>
      </CompactChat>
      <CompactChat speaker="S" dim mono>
        <span style={{ color: sk.ink3 }}>note:</span>{' '}
        {T(`Task ${taskId} push結果未確認。`,
           `Task ${taskId} push result is unconfirmed.`)}
      </CompactChat>
    </>;
  }
  if (state === 'GO_READY') {
    return <>
      <CompactChat speaker="S">
        {T('evidence確認OK。人間GOの判断をお願いします。',
           'Evidence is verified. Human GO decision required.')}
      </CompactChat>
      <CompactChat speaker="S" dim mono>
        <span style={{ color: sk.ink3 }}>template ready:</span> GO_T_006.md
      </CompactChat>
      <CompactChat speaker="H">{T('テンプレだけ見せて。', 'Just show me the template.')}</CompactChat>
    </>;
  }
  if (state === 'STOP') {
    return <>
      <CompactChat speaker="S">
        <div style={{ color: sk.stop, fontWeight: 600 }}>
          {T('STOPがかかっています。', 'A STOP is currently active.')}
        </div>
        <div style={{ marginTop: 4 }}>
          {T(`外部write attemptを検出 (Task ${taskId})。`,
             `External write attempt detected (Task ${taskId}).`)}
        </div>
      </CompactChat>
      <CompactChat speaker="S" dim mono>
        reason: external_write_attempted · ts=14:02:11Z
      </CompactChat>
      <CompactChat speaker="H">{T('解除条件は？', 'What are the release conditions?')}</CompactChat>
      <CompactChat speaker="S">
        {T('Inspector で停止理由を確認、解除はCLIから人間操作のみ。',
           'Check the reason in Inspector. Release is human-only via CLI.')}
      </CompactChat>
    </>;
  }
  return null;
}

// Tighter chat row for the mobile panel.
function CompactChat({ speaker = 'H', children, mono = false, dim = false }) {
  const lang = useLang();
  const jp = lang !== 'en';
  const isBot = speaker === 'S';
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '56px 1fr', gap: 8,
      marginBottom: 8, alignItems: 'start',
    }}>
      <div style={{
        fontFamily: sk.mono, fontSize: 10, letterSpacing: 0.4,
        color: sk.ink3, paddingTop: 6, textAlign: 'right',
      }}>{isBot ? 'Shikishima' : 'H'}</div>
      <div style={{
        fontFamily: mono ? sk.mono : (jp ? sk.jp : sk.sans),
        fontSize: mono ? 11 : 12.5,
        color: dim ? sk.ink2 : sk.ink,
        background: isBot ? sk.paper2 : 'transparent',
        border: isBot ? `1px solid ${sk.paper3}` : `1px dashed ${sk.paper3}`,
        padding: '6px 10px',
        lineHeight: 1.45,
      }}>{children}</div>
    </div>
  );
}

Object.assign(window, { MobileOperator });
