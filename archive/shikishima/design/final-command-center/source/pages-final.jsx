// pages-final.jsx — Final app surfaces: Settings, Help, Onboarding,
// IA Map and User Flows. All design-only, copy-only, JA-first, T()-ready.

// ════════════════════════════════════════════════════════════════
// Settings — local + read-only by default; risky toggles are LOCKED
// ════════════════════════════════════════════════════════════════
function DesktopSettingsPage({ width = 1400, height = 900, decision = 'HOLD' }) {
  const lang = useLang();
  return (
    <PageShell active="settings" decision={decision} width={width} height={height}
               sub={T('設定 — ローカル設定のみ', 'Settings — local preferences only')}>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <PageHeader
          kicker={T('SETTINGS · ローカル設定', 'SETTINGS · local preferences')}
          title={T('表示・チャット・データ鮮度の設定', 'Display · chat · data freshness')}
          right={<BadgeMonoF tone="ok">{T('LOCAL ONLY · 端末内', 'LOCAL ONLY · local device')}</BadgeMonoF>}
        />
        <div style={{ flex: 1, minHeight: 0, padding: '18px 22px', overflow: 'hidden',
                       display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SettingsGroup title={T('表示 / 表記', 'Display / Language')}>
              <SettingRow label={T('表示言語', 'Display language')}
                          options={['日本語', 'English']} active="日本語" />
              <SettingRow label={T('テーマ', 'Theme')}
                          options={[T('ライト', 'Light'), T('ダーク', 'Dark'), T('自動', 'Auto')]} active={T('ライト', 'Light')} />
              <SettingRow label={T('安全表示の密度', 'Safety strip density')}
                          options={[T('密', 'compact'), T('普通', 'normal'), T('広く', 'spacious')]} active={T('普通', 'normal')} />
              <SettingRow label={T('既定の起動ページ', 'Default landing page')}
                          options={[T('操作室', 'Operator'), T('チャット', 'Chat'), T('StackChan', 'StackChan')]} active={T('操作室', 'Operator')} />
              <SettingRow label={T('既定モード', 'Default mode')}
                          options={['OPERATOR', 'INSPECTOR']} active="OPERATOR" />
            </SettingsGroup>

            <SettingsGroup title={T('チャット動作', 'Chat behavior')}>
              <SettingRow label={T('送信ボタン表示', 'Send button label')}
                          options={[T('しきしまへ送信', 'Send to Shikishima'), T('送信のみ', 'Send')]}
                          active={T('しきしまへ送信', 'Send to Shikishima')} />
              <SettingRow label={T('安全注釈の表示', 'Show safety note')}
                          options={[T('常に', 'always'), T('初回のみ', 'first only')]} active={T('常に', 'always')} />
              <SettingRow label={T('テンプレ自動コピー', 'Auto-copy template')}
                          options={['ON', 'OFF']} active="OFF" />
            </SettingsGroup>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SettingsGroup title={T('データ鮮度', 'Data freshness')}>
              <SettingRow label={T('snapshot 更新間隔', 'snapshot refresh interval')}
                          options={['10s', '30s', '60s', T('手動のみ', 'manual only')]} active="30s" />
              <SettingRow label={T('stale 警告しきい値', 'stale threshold')}
                          options={['30s', '60s', '120s']} active="60s" />
              <SettingRow label={T('stale 時の挙動', 'on stale')}
                          options={[T('HOLDに切替', 'switch to HOLD'), T('警告のみ', 'warn only')]}
                          active={T('HOLDに切替', 'switch to HOLD')} />
            </SettingsGroup>

            <SettingsGroup title={T('通知 / Toast', 'Notification / Toast')}>
              <SettingRow label={T('toast 表示', 'show toasts')}
                          options={['ON', 'OFF']} active="ON" />
              <SettingRow label={T('toast 滞留時間', 'toast linger')}
                          options={['3s', '5s', '8s']} active="5s" />
              <SettingRow label={T('STOP は常時表示', 'STOP always visible')}
                          options={['ON', 'OFF']} active="ON" />
            </SettingsGroup>

            {/* LOCKED settings — future gates */}
            <SettingsGroup title={T('危険設定 — 別Gate必須', 'Risky settings — separate gate')} tone="lock">
              {[
                ['execution',           'disabled'],
                ['productionReady',     'false'],
                ['externalWrite',       'false'],
                ['autoPush',            'off'],
                ['autoSend',            'off'],
                ['autoRuntimeStart',    'off'],
                ['stackChanPhysical',   'disabled'],
                ['voice / camera / mic', 'disabled'],
              ].map(([k, v]) => (
                <div key={k} style={{
                  display: 'grid', gridTemplateColumns: '1fr auto 120px',
                  gap: 10, alignItems: 'center',
                  padding: '8px 10px',
                  background: sk.paper,
                  border: `1px solid ${sk.paper3}`,
                  marginBottom: 4,
                }}>
                  <span style={{ fontFamily: sk.mono, fontSize: 11, color: sk.ink2 }}>{k}</span>
                  <span style={{ fontFamily: sk.mono, fontSize: 11, color: sk.stop, fontWeight: 700 }}>{v}</span>
                  <BadgeMonoF tone="lock">{T('FUTURE GATE', 'FUTURE GATE')}</BadgeMonoF>
                </div>
              ))}
              <div style={{
                fontFamily: lang === 'en' ? sk.sans : sk.jp,
                fontSize: 11.5, color: sk.ink2, marginTop: 8, lineHeight: 1.55,
              }}>
                {T('危険な設定はこの画面から変更できません。productionReady / execution / 外部write / StackChan物理操作は別Gateが必要です。',
                   'Risky settings cannot be changed here. productionReady / execution / external write / StackChan physical op require a separate gate.')}
              </div>
            </SettingsGroup>
          </div>
        </div>
        <ChatInputBar />
      </div>
      <PageRightRail
        decision={decision}
        copyButtons={<>
          <CopyBtn kind="copy" glyph="⧉">{T('設定をJSON書出し', 'Export settings (JSON)')}</CopyBtn>
          <CopyBtn kind="show" glyph="⌕">{T('既定値を表示', 'Show defaults')}</CopyBtn>
          <CopyBtn kind="open" glyph="↗">{T('ヘルプを開く', 'Open Help')}</CopyBtn>
        </>}
      />
    </PageShell>
  );
}

function SettingsGroup({ title, tone, children }) {
  const lang = useLang();
  const c = tone === 'lock' ? sk.stop : sk.ink;
  return (
    <div style={{
      border: `1px solid ${tone === 'lock' ? sk.stop : sk.paper3}`,
      background: sk.paper,
    }}>
      <div style={{
        padding: '8px 14px',
        background: tone === 'lock' ? sk.stopSoft : sk.paper2,
        borderBottom: `1px solid ${tone === 'lock' ? sk.stop : sk.paper3}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{
          fontFamily: lang === 'en' ? sk.sans : sk.jp,
          fontSize: 13, fontWeight: 700, color: c, letterSpacing: 0.3,
        }}>{title}</span>
        {tone === 'lock' && <BadgeMonoF tone="lock">LOCKED</BadgeMonoF>}
      </div>
      <div style={{ padding: '10px 14px' }}>{children}</div>
    </div>
  );
}

function SettingRow({ label, options, active }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr auto',
      gap: 10, alignItems: 'center', padding: '6px 0',
      borderBottom: `1px solid ${sk.paper3}`,
    }}>
      <span style={{ fontFamily: sk.sans, fontSize: 12, color: sk.ink }}>{label}</span>
      <div style={{
        display: 'inline-flex', border: `1px solid ${sk.rule}`, borderRadius: 2,
      }}>
        {options.map(opt => {
          const on = opt === active;
          return (
            <span key={opt} style={{
              fontFamily: sk.mono, fontSize: 11, fontWeight: on ? 700 : 400,
              padding: '4px 10px',
              background: on ? sk.ink : 'transparent',
              color: on ? sk.paper : sk.ink2,
              borderRight: `1px solid ${sk.paper3}`,
            }}>{opt}</span>
          );
        })}
      </div>
    </div>
  );
}

function BadgeMonoF({ children, tone = 'ok' }) {
  const c = tone === 'ok' ? sk.pass : tone === 'lock' ? sk.stop :
            tone === 'warn' ? sk.hold : sk.ink3;
  return (
    <span style={{
      fontFamily: sk.mono, fontSize: 9.5, fontWeight: 700, letterSpacing: 1,
      color: c, border: `1px solid ${c}`,
      padding: '1px 6px', borderRadius: 2,
    }}>{children}</span>
  );
}

// ════════════════════════════════════════════════════════════════
// Help / Guide page
// ════════════════════════════════════════════════════════════════
function DesktopHelpPage({ width = 1400, height = 900, decision = 'HOLD' }) {
  const lang = useLang();
  return (
    <PageShell active="help" decision={decision} width={width} height={height}
               sub={T('ヘルプ — 用語と操作', 'Help — terms and operation')}>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <PageHeader
          kicker={T('HELP · 初回ガイド', 'HELP · first-time guide')}
          title={T('しきしまの読み方', 'How to read Shikishima')}
        />
        <div style={{ flex: 1, minHeight: 0, padding: '18px 22px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <HelpCard q={T('しきしまとは？', 'What is Shikishima?')}>
              {T('しきしまは「人間が判断し、人間が実行する」前提の安全管制ツールです。UIはチャット・状態ランプ・次の人間アクション・安全境界の4つを軸にします。',
                 'Shikishima is a safety command tool premised on "humans decide, humans execute." The UI revolves around chat, status lamps, the next human action, and the safety boundary.')}
            </HelpCard>

            <HelpCard q={T('GO とは？', 'What does GO mean?')}>
              {T('GOは「人間が次の手動承認を進めて良い」という明示判断です。システムが外部実行を始めるという意味ではありません。',
                 'GO is the explicit signal that the human may proceed to the next manual approval. It does not mean the system starts external execution.')}
            </HelpCard>

            <HelpCard q={T('HOLD / PASS / STOP / REJECT の意味', 'HOLD / PASS / STOP / REJECT')}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 6 }}>
                <HelpKVRow k="HOLD"     v={T('待機中。人間GOが必要。',     'holding; human GO is required')} />
                <HelpKVRow k="GO_READY" v={T('GO待ち。実行はしない。',     'awaiting human GO; system will not execute')} />
                <HelpKVRow k="PASS"     v={T('Gate通過。観測のみ次へ。',   'gate passed; observe and proceed')} />
                <HelpKVRow k="STOP"     v={T('停止中。CLIで人間が解除。',  'stopped; human releases via CLI')} />
                <HelpKVRow k="REJECT"   v={T('却下。再提出が必要。',       'rejected; resubmission required')} />
              </div>
            </HelpCard>

            <HelpCard q="manual_copy_only">
              {T('「コピー専用」。下書きやテンプレートをクリップボードにコピーするだけ。送信・push・実行・支払・予約は一切行いません。',
                 '"Copy-only." Drafts and templates can be copied to the clipboard — and that is all. No send / push / execute / pay / reserve will ever happen.')}
            </HelpCard>

            <HelpCard q={T('productionReady=false / execution=disabled', 'productionReady=false / execution=disabled')}>
              {T('本番化されていない・システム実行は無効、という意味。GO してもこれらは false / disabled のまま。',
                 'Means: not in production / system execution is disabled. These remain false / disabled even after GO.')}
            </HelpCard>

            <HelpCard q={T('外部write=false', 'externalWrite=false')}>
              {T('外部APIへの書込みは行わない。Outboxは下書きだけ。手で別チャネルに貼って送ります。',
                 'No external API writes. Outbox is drafts only — humans paste them into another channel manually.')}
            </HelpCard>

            <HelpCard q={T('StackChanは何をする？', 'What does StackChan do?')}>
              {T('StackChanは「しきしまの状態を見せる端末」です。物理操作・音声・カメラ・マイクは別Gateまで常にHOLDです。',
                 'StackChan is a terminal that displays Shikishima\'s state. Physical motion, voice, camera and mic remain HOLD until a separate gate.')}
            </HelpCard>

            <HelpCard q={T('トラブル時のSTOP手順', 'What to do on STOP')}>
              <ol style={{
                margin: 0, paddingLeft: 18,
                fontFamily: lang === 'en' ? sk.sans : sk.jp,
                fontSize: 12.5, color: sk.ink, lineHeight: 1.7,
              }}>
                <li>{T('STOPページで理由を読む', 'read the reason on the STOP page')}</li>
                <li>{T('safety / plan / external に分類', 'classify as safety / plan / external')}</li>
                <li>{T('ガード/証跡を再確認', 'recheck the guard and evidence')}</li>
                <li>{T('新しいGOテンプレを発行 (コピー専用)', 'issue a new GO template (copy-only)')}</li>
                <li>{T('CLI から人間操作で再開', 'restart via human-only CLI operation')}</li>
              </ol>
            </HelpCard>
          </div>

          <div style={{
            marginTop: 14, padding: '14px 18px',
            background: sk.bar, color: sk.barText,
            fontFamily: lang === 'en' ? sk.sans : sk.jp,
            fontSize: 13, lineHeight: 1.7,
          }}>
            <span style={{
              fontFamily: sk.mono, fontSize: 11, letterSpacing: 1.2,
              color: sk.barText2, marginRight: 10,
            }}>{T('原則', 'PRINCIPLE')}</span>
            {T('GOは自動実行の許可ではありません。GOは、次の人間確認ステップへ進むための明示判断です。',
               'GO is not a permission to execute automatically. GO is an explicit decision to advance to the next human verification step.')}
          </div>
        </div>
        <ChatInputBar />
      </div>
      <PageRightRail
        decision={decision}
        copyButtons={<>
          <CopyBtn kind="copy" glyph="⧉">{T('用語集をコピー', 'Copy glossary')}</CopyBtn>
          <CopyBtn kind="copy" glyph="⧉">{T('STOP 手順をコピー', 'Copy STOP steps')}</CopyBtn>
          <CopyBtn kind="open" glyph="↗">{T('Inspector を開く', 'Open Inspector')}</CopyBtn>
        </>}
      />
    </PageShell>
  );
}

function HelpCard({ q, children }) {
  const lang = useLang();
  return (
    <div style={{
      border: `1px solid ${sk.paper3}`,
      background: sk.paper,
      padding: '14px 16px',
    }}>
      <div style={{
        fontFamily: lang === 'en' ? sk.sans : sk.jp,
        fontWeight: 700, fontSize: 14, color: sk.ink, marginBottom: 6,
      }}>{q}</div>
      <div style={{
        fontFamily: lang === 'en' ? sk.sans : sk.jp,
        fontSize: 12.5, color: sk.ink2, lineHeight: 1.6,
      }}>{children}</div>
    </div>
  );
}

function HelpKVRow({ k, v }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '100px 1fr', gap: 10,
      padding: '4px 8px',
      background: sk.paper2,
    }}>
      <span style={{ fontFamily: sk.mono, fontSize: 11, fontWeight: 700, color: sk.ink }}>{k}</span>
      <span style={{ fontFamily: sk.sans, fontSize: 11.5, color: sk.ink2 }}>{v}</span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Onboarding — first-run flow (6 iPhone screens)
// ════════════════════════════════════════════════════════════════
const ONBOARDING_SCREENS = [
  { n: 1, kicker: 'WELCOME',
    title: { ja: 'しきしまへようこそ', en: 'Welcome to Shikishima' },
    body:  { ja: 'これは「人間が判断する」管制ツールです。\nまずは安全境界を確認してください。',
             en: 'This is a command tool premised on human decisions. First, review the safety boundary.' },
    glyph: '●',
    tone: 'go',
  },
  { n: 2, kicker: 'SAFETY',
    title: { ja: '勝手に動かない', en: 'It will not act on its own' },
    body:  { ja: 'このアプリは外部API書込み・push・実行・支払・予約をしません。\nproductionReady=false / execution=disabled。',
             en: 'This app never writes externally, never pushes, never executes, never pays, never reserves.\nproductionReady=false / execution=disabled.' },
    glyph: '✕',
    tone: 'lock',
  },
  { n: 3, kicker: 'MANUAL COPY ONLY',
    title: { ja: 'コピー専用', en: 'Copy-only' },
    body:  { ja: '下書きやテンプレートはクリップボードへコピーするだけ。\n手で別チャネル / CLI に貼ります。',
             en: 'Drafts and templates are copied to the clipboard.\nYou paste them manually into another channel or CLI.' },
    glyph: '⧉',
    tone: 'ok',
  },
  { n: 4, kicker: 'CHAT SEND',
    title: { ja: '送信 = アプリ内チャット', en: 'Send = in-app chat' },
    body:  { ja: '「しきしまへ送信」はアプリ内メッセージのみ。\n外部送信・push・実行は行いません。',
             en: '"Send to Shikishima" is in-app messaging only.\nNo external send / push / execute.' },
    glyph: '→',
    tone: 'go',
  },
  { n: 5, kicker: 'STACKCHAN',
    title: { ja: 'StackChanは顔の端末', en: 'StackChan is a face terminal' },
    body:  { ja: '接続済みでも、表示・表情だけ。\n物理操作・音声・カメラ・マイクは別Gateまで HOLD。',
             en: 'Even when connected — display and expression only.\nMotion, voice, camera and mic remain HOLD.' },
    glyph: '◉',
    tone: 'ok',
  },
  { n: 6, kicker: 'READY',
    title: { ja: '準備完了', en: 'Ready' },
    body:  { ja: '不明・古い・失敗時は常にHOLDとして扱います。\nさっそく操作室を開きましょう。',
             en: 'When uncertain, stale or failed — always default to HOLD.\nLet\'s open the Operator Room.' },
    glyph: '◯',
    tone: 'go',
  },
];

function MobileOnboarding({ index = 0 }) {
  const lang = useLang();
  const jp = lang !== 'en';
  const s = ONBOARDING_SCREENS[index];
  const toneColor = s.tone === 'lock' ? sk.stop : s.tone === 'ok' ? sk.pass : sk.go;
  return (
    <IOSDevice width={393} height={852}>
      {/* Top strip */}
      <div style={{ background: sk.bar, color: sk.barText, padding: '12px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{
            fontFamily: jp ? sk.jp : sk.sans, fontWeight: 700, fontSize: 14, letterSpacing: 1.5,
          }}>{T('しきしま', 'SHIKISHIMA')}</div>
          <div style={{
            fontFamily: sk.mono, fontSize: 10, letterSpacing: 0.8, color: sk.barText2,
          }}>{`STEP ${s.n} / ${ONBOARDING_SCREENS.length}`}</div>
        </div>
      </div>

      {/* Body */}
      <div style={{
        flex: 1, background: sk.paper,
        padding: '36px 24px 20px',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          fontFamily: sk.mono, fontSize: 11, color: sk.ink3, letterSpacing: 1.6,
        }}>{s.kicker}</div>

        <div style={{
          width: 88, height: 88, borderRadius: '50%',
          background: 'transparent',
          border: `2px solid ${toneColor}`,
          margin: '28px auto 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: sk.mono, fontSize: 36, color: toneColor,
        }}>{s.glyph}</div>

        <div style={{
          fontFamily: jp ? sk.jp : sk.sans, fontWeight: 700,
          fontSize: 22, color: sk.ink, textAlign: 'center', lineHeight: 1.3,
        }}>{jp ? s.title.ja : s.title.en}</div>

        <div style={{
          fontFamily: jp ? sk.jp : sk.sans, fontSize: 14,
          color: sk.ink2, marginTop: 16, lineHeight: 1.7,
          whiteSpace: 'pre-line', textAlign: 'center',
        }}>{jp ? s.body.ja : s.body.en}</div>

        {/* Progress dots */}
        <div style={{
          marginTop: 'auto', display: 'flex', justifyContent: 'center', gap: 6,
          paddingBottom: 18,
        }}>
          {ONBOARDING_SCREENS.map((_, i) => (
            <span key={i} style={{
              width: i === index ? 24 : 8, height: 8, borderRadius: 4,
              background: i === index ? sk.ink : sk.paper3,
            }}/>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 8 }}>
          <button style={{
            padding: '12px 14px',
            fontFamily: jp ? sk.jp : sk.sans, fontSize: 13, fontWeight: 600,
            background: sk.paper, color: sk.ink,
            border: `1px solid ${sk.rule}`, borderRadius: 2,
          }}>{index === 0 ? T('閉じる', 'Close') : T('戻る', 'Back')}</button>
          <button style={{
            padding: '12px 14px',
            fontFamily: jp ? sk.jp : sk.sans, fontSize: 13, fontWeight: 700,
            background: sk.ink, color: sk.paper,
            border: `1px solid ${sk.rule}`, borderRadius: 2,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <span>
              {index === ONBOARDING_SCREENS.length - 1
                ? T('操作室を開く', 'Open Operator')
                : index === 0
                ? T('はじめる', 'Begin')
                : T('次へ', 'Next')}
            </span>
            <span style={{ fontFamily: sk.mono, fontSize: 14 }}>→</span>
          </button>
        </div>

        <div style={{
          fontFamily: sk.mono, fontSize: 9, color: sk.ink3,
          textAlign: 'center', marginTop: 10, letterSpacing: 0.4,
        }}>{T('このボタンは内部画面遷移のみ。実行はしません。',
              'Buttons are internal navigation only. No execution.')}</div>
      </div>
    </IOSDevice>
  );
}

// ════════════════════════════════════════════════════════════════
// IA Map — full app information architecture
// ════════════════════════════════════════════════════════════════
const IA_ROWS = [
  { id: 'operator',  ja: '操作室',     en: 'Operator',  question: { ja: '今は安全か？次に何をすればいい？', en: 'Is it safe now? What\'s next?' },
    info: 'lamp · next · chat · safety strip · stackchan card',
    backend: 'safe-snapshot · local-chat',
    layout: '3-col / mobile stack',
    future: false },
  { id: 'chat',      ja: 'チャット',   en: 'Chat',      question: { ja: 'しきしまに何を聞く？', en: 'What to ask Shikishima?' },
    info: 'message list · input · template',
    backend: 'local-chat · safe-snapshot',
    layout: '3-col / mobile bottom input',
    future: false },
  { id: 'stackchan', ja: 'StackChan',  en: 'StackChan', question: { ja: 'StackChanは安全につながっているか？', en: 'Is StackChan safely linked?' },
    info: 'conn lamp · face · boundary panels · event log',
    backend: 'stackchan-status · safe-snapshot',
    layout: '3-col / mobile stack',
    future: false },
  { id: 'outbox',    ja: '下書き',     en: 'Outbox',    question: { ja: '送るべき下書きはあるか？', en: 'Any drafts to send?' },
    info: 'draft cards · risk tag · inactive stamps',
    backend: 'draft-outbox',
    layout: '3-col grid',
    future: false },
  { id: 'queue',     ja: '承認待ち',   en: 'Queue',     question: { ja: '人間判断を待っているものは？', en: 'What awaits human decision?' },
    info: 'critical/hold/waiting groups',
    backend: 'approval-queue',
    layout: 'table',
    future: false },
  { id: 'go',        ja: 'GO',         en: 'GO',        question: { ja: 'GOの要件は揃っているか？', en: 'Are GO requirements met?' },
    info: 'required fields · template preview',
    backend: 'evidence · safe-snapshot',
    layout: '2-col',
    future: false },
  { id: 'evidence',  ja: '証跡',       en: 'Evidence',  question: { ja: 'Gate通過の証跡はあるか？', en: 'Is the evidence in place?' },
    info: 'checklist · gate progress · commits',
    backend: 'evidence · push-readiness',
    layout: '2-col',
    future: false },
  { id: 'stop',      ja: 'STOP',       en: 'STOP',      question: { ja: 'なぜ止まっているか？再開条件は？', en: 'Why stopped? How to resume?' },
    info: 'history table · restart rule',
    backend: 'stop-history · safe-snapshot',
    layout: '2-col',
    future: false },
  { id: 'push',      ja: 'Push',       en: 'Push',      question: { ja: 'pushできる状態か？', en: 'Ready to push?' },
    info: 'git status · push GO template',
    backend: 'push-readiness',
    layout: '2-col',
    future: false },
  { id: 'inspector', ja: '詳細 / Inspector', en: 'Inspector', question: { ja: '監査のための全状態を見たい', en: 'Show full audit state' },
    info: 'audit grid · read-only',
    backend: 'all read-only services',
    layout: '12-col grid',
    future: false },
  { id: 'settings',  ja: '設定',       en: 'Settings',  question: { ja: '言語・テーマ・鮮度設定', en: 'Language / theme / freshness' },
    info: 'preferences · locked risky toggles',
    backend: 'local-settings (local-only)',
    layout: '2-col',
    future: false },
  { id: 'help',      ja: 'ヘルプ',     en: 'Help',      question: { ja: '用語と仕組みを知りたい', en: 'Learn terms and structure' },
    info: 'Q&A cards · principle banner',
    backend: 'static',
    layout: '2-col grid',
    future: false },
  // future-locked
  { id: 'agents',     ja: 'Agents',      en: 'Agents',    question: { ja: '別Gate', en: 'separate gate' },
    info: 'agent team detail', backend: 'agent service (future)',
    layout: '—', future: true },
  { id: 'connection', ja: 'Connection',  en: 'Connection', question: { ja: '別Gate', en: 'separate gate' },
    info: 'physical / network', backend: '(future)',
    layout: '—', future: true },
  { id: 'runtime',    ja: 'Runtime',     en: 'Runtime',    question: { ja: '別Gate', en: 'separate gate' },
    info: 'observation only', backend: 'runtime-observation (future)',
    layout: '—', future: true },
  { id: 'policies',   ja: 'Policies',    en: 'Policies',   question: { ja: '別Gate', en: 'separate gate' },
    info: 'governance edit (future)', backend: '(future)',
    layout: '—', future: true },
];

function IAMapCard({ width = 1400 }) {
  const lang = useLang();
  return (
    <div style={{
      width, background: sk.paper, padding: '32px 36px',
      fontFamily: sk.sans, color: sk.ink,
      border: `1px solid ${sk.rule}`,
    }}>
      <FinalPageHead num="C1"
        title={T('Information Architecture Map', 'Information Architecture Map')}
        sub={T('全ページ一覧 + 主な質問 + backend', 'pages · primary question · backend')} />
      <table style={{
        width: '100%', borderCollapse: 'collapse', marginTop: 18,
        fontFamily: sk.mono, fontSize: 11,
      }}>
        <thead>
          <tr style={{ background: sk.paper2 }}>
            {[T('ページ', 'PAGE'),
              T('ユーザーの主要質問', 'PRIMARY QUESTION'),
              T('主な情報', 'INFO'),
              T('backend service', 'BACKEND'),
              T('layout', 'LAYOUT'),
              T('状態', 'STATE')].map(h => (
              <th key={h} style={{
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
          {IA_ROWS.map(r => (
            <tr key={r.id}>
              <td style={{
                padding: '6px 10px', borderBottom: `1px solid ${sk.paper3}`,
                fontFamily: lang === 'en' ? sk.sans : sk.jp, fontWeight: 600,
                color: r.future ? sk.ink3 : sk.ink,
                textDecoration: r.future ? 'line-through' : 'none',
              }}>{lang === 'en' ? r.en : r.ja}</td>
              <td style={{
                padding: '6px 10px', borderBottom: `1px solid ${sk.paper3}`,
                fontFamily: lang === 'en' ? sk.sans : sk.jp, fontSize: 11,
                color: r.future ? sk.ink3 : sk.ink,
              }}>{lang === 'en' ? r.question.en : r.question.ja}</td>
              <td style={{
                padding: '6px 10px', borderBottom: `1px solid ${sk.paper3}`,
                color: r.future ? sk.ink3 : sk.ink2,
              }}>{r.info}</td>
              <td style={{
                padding: '6px 10px', borderBottom: `1px solid ${sk.paper3}`,
              }}>
                <code style={{
                  fontFamily: sk.mono, fontSize: 10,
                  color: r.future ? sk.ink3 : sk.go,
                  border: r.future ? `1px dashed ${sk.paper3}` : `1px solid ${sk.go}`,
                  padding: '1px 5px',
                }}>{r.backend}</code>
              </td>
              <td style={{
                padding: '6px 10px', borderBottom: `1px solid ${sk.paper3}`,
                color: r.future ? sk.ink3 : sk.ink2,
              }}>{r.layout}</td>
              <td style={{
                padding: '6px 10px', borderBottom: `1px solid ${sk.paper3}`,
              }}>
                {r.future
                  ? <BadgeMonoF tone="lock">{T('FUTURE GATE', 'FUTURE')}</BadgeMonoF>
                  : <BadgeMonoF tone="ok">{T('稼働', 'live')}</BadgeMonoF>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FinalPageHead({ num, title, sub }) {
  const lang = useLang();
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      borderBottom: `2px solid ${sk.rule}`, paddingBottom: 12,
    }}>
      <div>
        <div style={{
          fontFamily: sk.mono, fontSize: 11, color: sk.ink3, letterSpacing: 2,
        }}>{T('最終設計', 'FINAL DESIGN')} · §{num}</div>
        <div style={{
          fontFamily: lang === 'en' ? sk.sans : sk.jp,
          fontSize: 22, fontWeight: 600, color: sk.ink, marginTop: 4,
        }}>{title}</div>
      </div>
      <div style={{
        fontFamily: sk.mono, fontSize: 11, color: sk.ink3, letterSpacing: 1,
      }}>{sub}</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// User Flows A〜F
// ════════════════════════════════════════════════════════════════
const FLOWS = [
  { id: 'A', title: { ja: '日常チェック', en: 'Daily Check' },
    steps: [
      { ja: 'アプリを開く',                 en: 'Open the app' },
      { ja: 'メイン状態ランプを読む',        en: 'Read the main status lamp' },
      { ja: '次の人間アクションを確認',      en: 'Read the next human action' },
      { ja: '必要ならチャットで質問',        en: 'Ask in chat if needed' },
      { ja: 'GO/証跡テンプレをコピー',       en: 'Copy GO / evidence template' },
    ] },
  { id: 'B', title: { ja: 'Push証跡', en: 'Push Evidence' },
    steps: [
      { ja: 'Push ページを開く',                       en: 'Open Push' },
      { ja: 'branch / HEAD / commits_ahead を確認',   en: 'Confirm branch / HEAD / commits_ahead' },
      { ja: 'push GO テンプレをコピー',                en: 'Copy push GO template' },
      { ja: '人間がUI外で実行',                        en: 'Human executes outside UI' },
      { ja: '結果を Evidence で確認',                  en: 'Verify result in Evidence' },
    ] },
  { id: 'C', title: { ja: 'Runtime観測', en: 'Runtime Observation' },
    steps: [
      { ja: 'GO ページを開く',                  en: 'Open GO' },
      { ja: 'time_window を確認',               en: 'Confirm time_window' },
      { ja: 'approved_command を確認',          en: 'Confirm approved_command' },
      { ja: 'shutdown + port_close を確認',     en: 'Confirm shutdown + port_close' },
      { ja: 'UI外で観測 / 終了後ポート閉鎖',     en: 'Observe outside UI; close port after' },
      { ja: 'Evidence に結果記録',              en: 'Record result in Evidence' },
    ] },
  { id: 'D', title: { ja: '下書きレビュー', en: 'Draft Review' },
    steps: [
      { ja: 'Outbox を開く',                  en: 'Open Outbox' },
      { ja: 'draft-only アイテムを確認',       en: 'Review the draft-only item' },
      { ja: 'risk tag を確認',                 en: 'Check the risk tag' },
      { ja: 'manual_copy_only を確認',         en: 'Confirm manual_copy_only' },
      { ja: '手で別チャネルに貼る',            en: 'Paste into another channel manually' },
    ] },
  { id: 'E', title: { ja: 'STOP対応', en: 'STOP Handling' },
    steps: [
      { ja: 'STOPが発生',                       en: 'STOP occurs' },
      { ja: 'STOPページで理由を読む',           en: 'Read the reason on the STOP page' },
      { ja: 'HOLD / REJECT / STOP に分類',     en: 'Classify HOLD / REJECT / STOP' },
      { ja: '再開ルールに従う',                 en: 'Follow the restart rule' },
      { ja: '新GOを発行 (コピー専用)',          en: 'Issue a new GO (copy-only)' },
    ] },
  { id: 'F', title: { ja: 'StackChan接続', en: 'StackChan Connected' },
    steps: [
      { ja: 'StackChan ページを開く',                       en: 'Open StackChan' },
      { ja: '接続状態を確認',                                en: 'Check connection' },
      { ja: 'しきしまリンクを確認',                          en: 'Check Shikishima link' },
      { ja: '表示モードであることを確認',                    en: 'Confirm display-only' },
      { ja: '物理操作 HOLD を確認',                          en: 'Confirm physical operation HOLD' },
      { ja: '音声・カメラ・マイク disabled を確認',          en: 'Confirm voice / cam / mic disabled' },
    ] },
];

function UserFlowsCard({ width = 1400 }) {
  return (
    <div style={{
      width, background: sk.paper, padding: '32px 36px',
      fontFamily: sk.sans, color: sk.ink,
      border: `1px solid ${sk.rule}`,
    }}>
      <FinalPageHead num="C2"
        title={T('User Flows A〜F', 'User Flows A–F')}
        sub={T('代表的な6シナリオ', 'six canonical scenarios')} />
      <div style={{
        marginTop: 18,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14,
      }}>
        {FLOWS.map(f => <FlowCard key={f.id} f={f} />)}
      </div>
    </div>
  );
}

function FlowCard({ f }) {
  const lang = useLang();
  return (
    <div style={{
      border: `1px solid ${sk.paper3}`,
      background: sk.paper,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 10,
        padding: '10px 14px',
        background: sk.paper2,
        borderBottom: `1px solid ${sk.paper3}`,
      }}>
        <span style={{
          fontFamily: sk.mono, fontSize: 16, fontWeight: 700, color: sk.go,
        }}>Flow {f.id}</span>
        <span style={{
          fontFamily: lang === 'en' ? sk.sans : sk.jp,
          fontSize: 13, fontWeight: 600, color: sk.ink,
        }}>{lang === 'en' ? f.title.en : f.title.ja}</span>
      </div>
      <div style={{ padding: '12px 14px', flex: 1 }}>
        {f.steps.map((s, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '24px 1fr',
            gap: 8, alignItems: 'start', padding: '5px 0',
          }}>
            <div style={{
              fontFamily: sk.mono, fontSize: 10, color: sk.ink3,
              border: `1px solid ${sk.paper3}`, borderRadius: '50%',
              width: 22, height: 22,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{i + 1}</div>
            <div style={{
              fontFamily: lang === 'en' ? sk.sans : sk.jp,
              fontSize: 12, color: sk.ink, paddingTop: 3, lineHeight: 1.5,
            }}>{lang === 'en' ? s.en : s.ja}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  DesktopSettingsPage, DesktopHelpPage,
  MobileOnboarding, ONBOARDING_SCREENS,
  IAMapCard, UserFlowsCard,
  FinalPageHead, BadgeMonoF,
});
