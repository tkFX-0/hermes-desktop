// backend.jsx — Backend integration design (docs-only / design-only).
//
// All artboards in this file describe the *local* backend layer for the
// existing Electron + TypeScript + React/Vite app. No source code is
// produced — these screens are the specification.
//
// Exports (window.*):
//   BackendArchitectureCard
//   BackendServiceMapCard
//   PreloadApiCard
//   BackendDataModelCard
//   PageBackendWiringCard
//   BackendPhasePlanCard
//   BackendDocsCard

// ────────── shared header ──────────
function BPageHead({ num, title, sub }) {
  const lang = useLang();
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      borderBottom: `2px solid ${sk.rule}`, paddingBottom: 12,
    }}>
      <div>
        <div style={{
          fontFamily: sk.mono, fontSize: 11, color: sk.ink3, letterSpacing: 2,
        }}>{T('バックエンド設計', 'BACKEND DESIGN')} · §B{num}</div>
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

function CardFrame({ width, children, padding = '32px 36px' }) {
  return (
    <div style={{
      width, background: sk.paper, padding,
      fontFamily: sk.sans, color: sk.ink,
      border: `1px solid ${sk.rule}`,
    }}>{children}</div>
  );
}

function BadgeMono({ children, tone = 'ok' }) {
  const c = tone === 'ok' ? sk.pass : tone === 'lock' ? sk.stop : sk.ink3;
  return (
    <span style={{
      fontFamily: sk.mono, fontSize: 10, fontWeight: 700, letterSpacing: 1,
      color: c, border: `1px solid ${c}`,
      padding: '1px 6px', borderRadius: 2,
    }}>{children}</span>
  );
}

// ════════════════════════════════════════════════════════════════
// §B1 · 3-layer architecture
// ════════════════════════════════════════════════════════════════
function BackendArchitectureCard({ width = 1200 }) {
  return (
    <CardFrame width={width}>
      <BPageHead num="1"
        title={T('Local Backend — 3 層アーキテクチャ', 'Local Backend — 3-Layer Architecture')}
        sub="renderer · preload · main" />

      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <LayerCard
          tag="LAYER 1"
          name={T('Renderer · UI', 'Renderer · UI')}
          host="React / Vite"
          allowed={[
            T('表示・page切替', 'display · page switching'),
            T('chat入力UI', 'chat input UI'),
            T('copy-only buttons', 'copy-only buttons'),
            T('status lamps', 'status lamps'),
          ]}
          forbidden={[
            T('外部API書込み', 'external API write'),
            'git push', 'runtime start',
            T('StackChan物理操作', 'StackChan physical op'),
            'enable voice / camera / mic',
            'productionReady=true',
            'execution=enabled',
          ]}
        />
        <Arrow label={T('typed IPC のみ', 'typed IPC only')} />
        <LayerCard
          tag="LAYER 2"
          name={T('Preload · Safe Bridge', 'Preload · Safe Bridge')}
          host="contextBridge / typed channel"
          allowed={[
            'getSafeSnapshot()',
            'submitLocalChatMessage()',
            'createDraftOnlyItem()',
            'getApprovalQueue() / getEvidenceSummary()',
            'getStackChanStatus() / getPushReadiness()',
            'getStopHistory()',
          ]}
          forbidden={[
            'pushNow()', 'sendEmail()', 'createCalendarEvent()',
            'createGitHubIssue()', 'postSocial()', 'pay()', 'reserve()',
            'startRuntime()', 'enableExecution()',
            'setProductionReadyTrue()',
            'moveStackChan()', 'enableVoice/Camera/Mic()',
          ]}
        />
        <Arrow label={T('IPC handler', 'IPC handler')} />
        <LayerCard
          tag="LAYER 3"
          name={T('Electron Main · Local Backend', 'Electron Main · Local Backend')}
          host="src/main/shikishima/*-service.ts"
          allowed={[
            'safe-snapshot-service',
            'local-chat-service',
            'draft-outbox-service',
            'approval-queue-service',
            'evidence-service',
            'stop-history-service',
            'push-readiness-service',
            'stackchan-status-service',
            'runtime-observation-status-service',
          ]}
          forbidden={[
            T('always-on daemon', 'always-on daemon'),
            T('外部書込み', 'external write'),
            T('新規依存追加 (別GO)', 'new dependency (separate GO)'),
            'cloud backend', 'Express server',
          ]}
        />
      </div>

      <div style={{
        marginTop: 22, padding: '14px 18px',
        background: sk.bar, color: sk.barText,
        fontFamily: sk.jp, fontSize: 13, lineHeight: 1.7,
      }}>
        <span style={{
          fontFamily: sk.mono, fontSize: 11, letterSpacing: 1.2,
          color: sk.barText2, marginRight: 10,
        }}>{T('原則', 'PRINCIPLE')}</span>
        {T(<>新しい巨大バックエンドは足さない。既存 Electron app の <b>main / preload / renderer</b> 構成に Local Backend Layer を整理して載せるだけ。新規パッケージは <BadgeMono tone="lock">SEPARATE GO</BadgeMono>。</>,
           <>Do not add a new big backend. Just organize a Local Backend Layer inside the existing Electron app (main / preload / renderer). Any new package requires <BadgeMono tone="lock">SEPARATE GO</BadgeMono>.</>)}
      </div>
    </CardFrame>
  );
}

function LayerCard({ tag, name, host, allowed, forbidden }) {
  const lang = useLang();
  return (
    <div style={{
      border: `1.5px solid ${sk.rule}`,
      background: sk.paper,
      display: 'grid', gridTemplateColumns: '170px 1fr 1fr',
    }}>
      <div style={{
        background: sk.bar, color: sk.barText,
        padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        <span style={{
          fontFamily: sk.mono, fontSize: 10, letterSpacing: 1.6, color: sk.barText2,
        }}>{tag}</span>
        <span style={{
          fontFamily: lang === 'en' ? sk.sans : sk.jp,
          fontSize: 15, fontWeight: 700, lineHeight: 1.3,
        }}>{name}</span>
        <span style={{ fontFamily: sk.mono, fontSize: 10, color: sk.barText2 }}>{host}</span>
      </div>
      <ListCol title={T('ALLOWED · 担当', 'ALLOWED · scope')} tone="ok" items={allowed} />
      <ListCol title={T('FORBIDDEN · 直接NG', 'FORBIDDEN · not direct')} tone="lock" items={forbidden} />
    </div>
  );
}

function ListCol({ title, tone, items }) {
  const c = tone === 'ok' ? sk.pass : sk.stop;
  return (
    <div style={{ padding: '12px 14px', borderLeft: `1px solid ${sk.paper3}` }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        paddingBottom: 8, marginBottom: 8,
        borderBottom: `1px solid ${sk.paper3}`,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: c }}/>
        <span style={{
          fontFamily: sk.mono, fontSize: 10, letterSpacing: 1.4, color: sk.ink2,
          fontWeight: 600,
        }}>{title}</span>
      </div>
      <ul style={{
        margin: 0, paddingLeft: 16, fontFamily: sk.mono, fontSize: 11,
        color: sk.ink, lineHeight: 1.7,
      }}>
        {items.map((s, i) => (
          <li key={i} style={{
            textDecoration: tone === 'lock' ? 'line-through' : 'none',
            textDecorationColor: tone === 'lock' ? sk.stop : 'inherit',
            color: tone === 'lock' ? sk.ink2 : sk.ink,
          }}>{s}</li>
        ))}
      </ul>
    </div>
  );
}

function Arrow({ label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: 'var(--ink3)',
      letterSpacing: 1, padding: '2px 0',
    }}>
      <span style={{
        width: 1, height: 18, background: 'var(--ink3)', display: 'inline-block',
      }}/>
      <span>↓ {label}</span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// §B2 · Service map
// ════════════════════════════════════════════════════════════════
const SERVICES = [
  { num: 1, file: 'safe-snapshot-service.ts',
    name:    { ja: 'Safe Snapshot',          en: 'Safe Snapshot' },
    purpose: { ja: 'UI全ページが参照する1つの安全なstateオブジェクト',
               en: 'one redacted snapshot consumed by every UI page' },
    allow:  ['decision', 'execution', 'productionReady', 'externalWrite',
             'rawValuesReported', 'runtime', 'portStatus', 'currentGate',
             'nextAction', 'evidenceStatus', 'stackChanStatus', 'mobileConsoleStatus'],
    forbid: ['raw tokens', 'raw LAN IP', 'API keys', 'OAuth secrets',
             'private credentials', 'secret paths'],
    invariant: 'no raw / redacted always' },

  { num: 2, file: 'local-chat-service.ts',
    name:    { ja: 'Local Chat',             en: 'Local Chat' },
    purpose: { ja: 'チャットUIをローカル管制室の会話として支える',
               en: 'powers the chat UI as local command-center conversation' },
    allow:  ['store local message', 'summarize safe state',
             'gen copy-only GO template', 'gen evidence template',
             'suggest next human action'],
    forbid: ['external send', 'agent autonomous exec', 'git push',
             'runtime start', 'mail/calendar/GH/social write',
             'pay / reserve', 'StackChan physical op'],
    invariant: 'send = local chat only' },

  { num: 3, file: 'draft-outbox-service.ts',
    name:    { ja: 'Draft Outbox',           en: 'Draft Outbox' },
    purpose: { ja: '下書きのみのアイテム管理',
               en: 'manage draft-only items' },
    allow:  ['draft_created', 'review_requested',
             'approved_for_manual_copy', 'hold', 'rejected',
             'expired', 'archived'],
    forbid: ['sent', 'posted', 'created_remote',
             'paid', 'reserved', 'executed'],
    invariant: 'external_write_by_system = false' },

  { num: 4, file: 'approval-queue-service.ts',
    name:    { ja: 'Approval Queue',         en: 'Approval Queue' },
    purpose: { ja: '人間レビューを待つ提案を保持',
               en: 'hold proposed actions for human review' },
    allow:  ['display queue', 'copy review instruction',
             'mark local review status (docs/local-only)',
             'record HOLD / REJECT reason'],
    forbid: ['approve execution', 'external write',
             'push', 'runtime start',
             'send / post / create / pay / reserve'],
    invariant: 'use approved_for_manual_copy (not plain approved)' },

  { num: 5, file: 'evidence-service.ts',
    name:    { ja: 'Evidence',               en: 'Evidence' },
    purpose: { ja: 'docs/shikishima 証跡の読み取り専用サマリ',
               en: 'read-only summary of docs/shikishima evidence' },
    allow:  ['latest evidence summary', 'current gate',
             'last pushed commit', 'pending local commit',
             'checklist result', 'copy evidence summary'],
    forbid: ['auto-modify evidence without GO',
             'push evidence', 'mark productionReady true',
             'mark execution enabled'],
    invariant: 'read-only by default' },

  { num: 6, file: 'stop-history-service.ts',
    name:    { ja: 'STOP History / Incident', en: 'STOP History / Incident' },
    purpose: { ja: 'STOP / HOLD / REJECT 履歴と再開ルール',
               en: 'track STOP / HOLD / REJECT and the restart rule' },
    allow:  ['active_stop_conditions', 'resolved_stop_conditions',
             'incident_level', 'hold_reason', 'reject_reason',
             'restart_rule', 'next_safe_action'],
    forbid: ['auto release', 'UI release'],
    invariant: 'release_actor = human only (CLI)' },

  { num: 7, file: 'push-readiness-service.ts',
    name:    { ja: 'Push Readiness',         en: 'Push Readiness' },
    purpose: { ja: 'git の準備状態のみを表示',
               en: 'expose git readiness as data only' },
    allow:  ['branch', 'HEAD', 'origin/main', 'commits_ahead',
             'staged', 'dirty_tracked',
             'approved_commit', 'push_go_required'],
    forbid: ['push from UI', 'auto push', 'auto approve push'],
    invariant: 'no side effect from this service' },

  { num: 8, file: 'stackchan-status-service.ts',
    name:    { ja: 'StackChan Status',       en: 'StackChan Status' },
    purpose: { ja: 'StackChan を表示・顔の端末として表現',
               en: 'represent StackChan as display / face terminal' },
    allow:  ['device_arrival', 'connection', 'link_status',
             'display_link', 'expression_state', 'heartbeat',
             'physical_operation', 'voice', 'camera', 'microphone'],
    forbid: ['move servo', 'start motion',
             'enable voice / camera / mic',
             'physical pair-and-operate'],
    invariant: 'physical_operation default = HOLD' },

  { num: 9, file: 'runtime-observation-status-service.ts',
    name:    { ja: 'Runtime Observation',    en: 'Runtime Observation' },
    purpose: { ja: '承認済み時間窓のruntime観測のみ',
               en: 'record runtime observation in approved windows only' },
    allow:  ['approved_time_window', 'approved_runtime_command',
             'runtime_started', 'port_3030_opened',
             'iPhone_observation', 'shutdown_completed',
             'port_3030_closed_after'],
    forbid: ['always-on runtime',
             'runtime start without time_window',
             'runtime start from UI button',
             'port left open after observation'],
    invariant: 'time-windowed only · port closes after' },
];

function BackendServiceMapCard({ width = 1400 }) {
  return (
    <CardFrame width={width}>
      <BPageHead num="2"
        title={T('Local Backend Service Map', 'Local Backend Service Map')}
        sub={T('9 services · src/main/shikishima/*', '9 services · src/main/shikishima/*')} />
      <div style={{
        marginTop: 22,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14,
      }}>
        {SERVICES.map(s => <ServiceCard key={s.num} s={s} />)}
      </div>
    </CardFrame>
  );
}

function ServiceCard({ s }) {
  const lang = useLang();
  return (
    <div style={{
      border: `1px solid ${sk.paper3}`,
      background: sk.paper,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        padding: '10px 12px', background: sk.paper2,
        borderBottom: `1px solid ${sk.paper3}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      }}>
        <div>
          <div style={{
            fontFamily: sk.mono, fontSize: 9, letterSpacing: 1.4, color: sk.ink3,
          }}>SERVICE · 0{s.num}</div>
          <div style={{
            fontFamily: lang === 'en' ? sk.sans : sk.jp,
            fontSize: 14, fontWeight: 700, color: sk.ink, marginTop: 2,
          }}>{lang === 'en' ? s.name.en : s.name.ja}</div>
        </div>
        <BadgeMono tone="neutral">design-only</BadgeMono>
      </div>
      <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{
          fontFamily: sk.mono, fontSize: 10, color: sk.ink3, letterSpacing: 0.4,
          padding: '4px 6px', background: sk.paper2,
          borderLeft: `2px solid ${sk.ink3}`,
        }}>{s.file}</div>
        <div style={{
          fontFamily: lang === 'en' ? sk.sans : sk.jp,
          fontSize: 12, color: sk.ink2, lineHeight: 1.55,
        }}>{lang === 'en' ? s.purpose.en : s.purpose.ja}</div>

        <MiniList label={T('ALLOWED', 'ALLOWED')} tone="ok" items={s.allow} />
        <MiniList label={T('FORBIDDEN', 'FORBIDDEN')} tone="lock" items={s.forbid} />

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <BadgeMono tone="lock">INVARIANT</BadgeMono>
          <span style={{ fontFamily: sk.mono, fontSize: 10, color: sk.ink2 }}>
            {s.invariant}
          </span>
        </div>
      </div>
    </div>
  );
}

function MiniList({ label, tone, items }) {
  const c = tone === 'ok' ? sk.pass : sk.stop;
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: c }}/>
        <span style={{
          fontFamily: sk.mono, fontSize: 9, letterSpacing: 1, color: sk.ink3,
          fontWeight: 700,
        }}>{label}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {items.map((it, i) => (
          <span key={i} style={{
            fontFamily: sk.mono, fontSize: 9.5, color: tone === 'lock' ? sk.ink3 : sk.ink,
            border: `1px solid ${tone === 'lock' ? sk.paper3 : sk.paper3}`,
            padding: '1px 5px',
            textDecoration: tone === 'lock' ? 'line-through' : 'none',
            textDecorationColor: c,
          }}>{it}</span>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// §B3 · Preload Safe API Contract
// ════════════════════════════════════════════════════════════════
function PreloadApiCard({ width = 1200 }) {
  const allowed = [
    ['getSafeSnapshot()',           'SafetySnapshot',
     T('UI全画面の常時表示用 snapshot', 'always-on snapshot for every UI page')],
    ['submitLocalChatMessage(msg)', 'LocalChatAck',
     T('チャット送信はローカル保存のみ', 'chat send = local store only')],
    ['createDraftOnlyItem(input)',  'DraftItem',
     T('下書きのみ。送信しない', 'draft only · never sent')],
    ['getApprovalQueue()',          'QueueItem[]',
     T('人間判断待ちを返す', 'returns items awaiting human decision')],
    ['getEvidenceSummary()',        'EvidenceSummary',
     T('docs/shikishima 証跡サマリ', 'docs/shikishima evidence summary')],
    ['getStackChanStatus()',        'StackChanStatus',
     T('表示端末としての状態のみ', 'state-only · as display terminal')],
    ['getPushReadiness()',          'PushReadiness',
     T('git 状態のみ', 'git status only')],
    ['getStopHistory()',            'StopHistory',
     T('STOP/HOLD/REJECT履歴', 'STOP / HOLD / REJECT history')],
  ];
  const forbidden = [
    'pushNow()', 'sendEmail()', 'createCalendarEvent()',
    'createGitHubIssue()', 'postSocial()',
    'pay()', 'reserve()',
    'startRuntime()', 'enableExecution()',
    'setProductionReadyTrue()',
    'moveStackChan()', 'enableVoice()', 'enableCamera()', 'enableMic()',
  ];
  return (
    <CardFrame width={width}>
      <BPageHead num="3"
        title={T('Safe Preload API Contract', 'Safe Preload API Contract')}
        sub="window.shikishima.*" />

      <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 22 }}>
        {/* Allowed */}
        <div>
          <SubHeadBack label={T('ALLOWED · UIへ通して良い', 'ALLOWED · safe to expose')} tone="ok" />
          <table style={{
            width: '100%', borderCollapse: 'collapse', marginTop: 10,
            fontFamily: sk.mono, fontSize: 11,
          }}>
            <thead>
              <tr>
                <th style={thStyle}>API</th>
                <th style={thStyle}>RETURNS</th>
                <th style={thStyle}>{T('説明', 'note')}</th>
              </tr>
            </thead>
            <tbody>
              {allowed.map(([api, ret, note]) => (
                <tr key={api}>
                  <td style={tdStyle}>
                    <code style={{ color: sk.go, fontWeight: 600 }}>{api}</code>
                  </td>
                  <td style={{ ...tdStyle, color: sk.ink2 }}>{ret}</td>
                  <td style={{ ...tdStyle, fontFamily: sk.jp, fontSize: 11.5, color: sk.ink }}>{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Forbidden */}
        <div>
          <SubHeadBack label={T('FORBIDDEN · 設計上UIに出さない', 'FORBIDDEN · never expose')} tone="bad" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
            {forbidden.map(api => (
              <div key={api} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 10px', border: `1px solid ${sk.paper3}`, background: sk.paper,
              }}>
                <span style={{
                  fontFamily: sk.mono, fontSize: 10, fontWeight: 700, color: sk.stop,
                }}>✕</span>
                <code style={{
                  fontFamily: sk.mono, fontSize: 11.5, color: sk.ink,
                  textDecoration: 'line-through', textDecorationColor: sk.stop,
                }}>{api}</code>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        marginTop: 22, padding: '14px 18px',
        background: sk.bar, color: sk.barText,
        fontFamily: sk.jp, fontSize: 13, lineHeight: 1.7,
      }}>
        <span style={{
          fontFamily: sk.mono, fontSize: 11, letterSpacing: 1.2,
          color: sk.barText2, marginRight: 10,
        }}>{T('原則', 'PRINCIPLE')}</span>
        {T(<>preload は <b>読込 + 下書き + ローカルchat</b> までを通す。
            実行系・外部書込み・runtime起動・StackChan物理操作は全て preload にも置かない。</>,
           <>preload exposes only <b>reads + drafts + local chat</b>.
             Execution, external writes, runtime start and StackChan motion never appear in preload either.</>)}
      </div>
    </CardFrame>
  );
}

const thStyle = {
  textAlign: 'left', padding: '6px 10px',
  color: 'var(--ink3)', fontWeight: 500, letterSpacing: 0.6,
  borderBottom: `1px solid var(--paper3)`,
};
const tdStyle = {
  padding: '6px 10px', color: 'var(--ink)',
  borderBottom: `1px solid var(--paper3)`,
};

function SubHeadBack({ label, tone }) {
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

// ════════════════════════════════════════════════════════════════
// §B4 · Data model
// ════════════════════════════════════════════════════════════════
function BackendDataModelCard({ width = 1200 }) {
  const tsBlock = `// docs/shikishima/SAFE_PRELOAD_API_CONTRACT.md
// design-only · no runtime code yet.

type DecisionState =
  | "HOLD" | "GO_READY" | "PASS" | "STOP" | "REJECT";

type SafetySnapshot = {
  decision:            DecisionState;
  execution:           "disabled" | "enabled";
  productionReady:     boolean;        // expected: false
  externalWrite:       boolean;        // expected: false
  rawValuesReported:   boolean;        // expected: false
  runtime:             "stopped" | "running" | "unknown";
  currentGate:         string;         // e.g. "G-006"
  nextAction:          string;         // ja-first short sentence
};

type DraftActionType =
  | "manual_copy_only"
  | "audit_only"
  | "rejected_external_write_request";

type ApprovalState =
  | "waiting_for_human"
  | "approved_for_manual_copy"
  | "hold"
  | "rejected"
  | "needs_revision"
  | "expired";

type StackChanConnection =
  | "not_arrived"
  | "not_connected"
  | "pairing_required"
  | "connected"
  | "stale"
  | "error";`;
  return (
    <CardFrame width={width}>
      <BPageHead num="4"
        title={T('Data Model — TypeScript 型', 'Data Model — TypeScript types')}
        sub={T('docs only · 実装は別GO', 'docs only · implementation is separate GO')} />

      <div style={{
        marginTop: 22, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18,
      }}>
        <pre style={{
          margin: 0, padding: '16px 18px',
          background: sk.bar, color: sk.barText,
          fontFamily: sk.mono, fontSize: 12, lineHeight: 1.6,
          border: `1px solid ${sk.rule}`,
          overflow: 'auto', whiteSpace: 'pre',
        }}>{tsBlock}</pre>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Invariant
            k="productionReady"
            v="false"
            jp="本番化されていない。GOしてもfalseのまま"
            en="not in production; remains false even after GO" />
          <Invariant
            k="execution"
            v="disabled"
            jp="システム実行は無効"
            en="system execution is disabled" />
          <Invariant
            k="externalWrite"
            v="false"
            jp="外部書込みは行わない"
            en="never writes externally" />
          <Invariant
            k="rawValuesReported"
            v="false"
            jp="raw値はreportに出ない"
            en="raw values never appear in reports" />
          <Invariant
            k="runtime"
            v="stopped"
            jp="既定は停止 · 時間窓承認時のみ稼働"
            en="default stopped · running only in approved window" />
          <Invariant
            k="StackChan.physical_operation"
            v="HOLD"
            jp="物理操作は接続済みでも常にHOLD"
            en="physical op always HOLD, even when connected" />
        </div>
      </div>
    </CardFrame>
  );
}

function Invariant({ k, v, jp, en }) {
  const lang = useLang();
  return (
    <div style={{
      border: `1px solid ${sk.paper3}`,
      background: sk.paper,
      padding: '10px 12px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <code style={{ fontFamily: sk.mono, fontSize: 11, color: sk.ink2 }}>{k}</code>
        <code style={{
          fontFamily: sk.mono, fontSize: 11, fontWeight: 700, color: sk.stop,
          border: `1px solid ${sk.stop}`, padding: '0 6px',
        }}>{v}</code>
      </div>
      <div style={{
        fontFamily: lang === 'en' ? sk.sans : sk.jp,
        fontSize: 11.5, color: sk.ink2, marginTop: 4, lineHeight: 1.5,
      }}>{lang === 'en' ? en : jp}</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// §B5 · Page × Backend wiring
// ════════════════════════════════════════════════════════════════
const WIRING = [
  { page: { ja: '操作室 / Operator',       en: 'Operator' },
    services: ['safe-snapshot', 'local-chat'],
    fields: 'decision · execution · nextAction · evidenceStatus',
    copyOnly: 'GO template · evidence · details · inspector',
    forbidden: 'send (chat-only allowed) · push · pay · reserve · execute',
    stale: { ja: 'lamp を STALE 表示、操作禁止 (CLI解除のみ)',
             en: 'show STALE on lamp; UI disabled (release via CLI only)' } },
  { page: { ja: 'チャット / Chat',          en: 'Chat' },
    services: ['safe-snapshot', 'local-chat'],
    fields: 'messages[] · template · system safety notes',
    copyOnly: 'GO template · evidence · HOLD reason',
    forbidden: 'auto-send · external mail · GH issue · post · execute',
    stale: { ja: '送信ボタンを inactive にし、理由を表示',
             en: 'disable send and show reason' } },
  { page: { ja: 'StackChan 管制室',         en: 'StackChan' },
    services: ['stackchan-status', 'safe-snapshot'],
    fields: 'connection · expression_state · heartbeat · physical_operation',
    copyOnly: 'connection checklist · GO template · safety note',
    forbidden: 'move · enable voice/cam/mic · physical_operation=GO',
    stale: { ja: 'STALE → 表情OFFLINE / 物理 HOLD 維持',
             en: 'STALE → expression OFFLINE / physical HOLD' } },
  { page: { ja: 'Outbox / 下書き',          en: 'Outbox' },
    services: ['draft-outbox', 'safe-snapshot'],
    fields: 'drafts[].state · risk · channel · external_write_by_system',
    copyOnly: 'draft body · review note',
    forbidden: 'send · post · create remote · pay · reserve',
    stale: { ja: '下書き表示はキャッシュ、操作は inactive',
             en: 'show cached drafts; controls inactive' } },
  { page: { ja: 'Queue / 承認待ち',          en: 'Queue' },
    services: ['approval-queue', 'safe-snapshot'],
    fields: 'items[].state · reason · age · category',
    copyOnly: 'review instruction · HOLD reason',
    forbidden: 'approve execution · reject-and-mutate',
    stale: { ja: '件数のみ表示、判断は別チャネル',
             en: 'show counts only; decisions move off-UI' } },
  { page: { ja: 'GO',                       en: 'GO' },
    services: ['safe-snapshot', 'evidence'],
    fields: 'required_fields · approver · evidence_path',
    copyOnly: 'GO template',
    forbidden: 'GO execute · auto push · approve-and-run',
    stale: { ja: 'MISSING フィールドを表示',
             en: 'show MISSING fields' } },
  { page: { ja: '証跡 / Evidence',          en: 'Evidence' },
    services: ['evidence', 'push-readiness'],
    fields: 'checklist · gates · commits · hidden_raw_count',
    copyOnly: 'evidence summary · next GO template',
    forbidden: 'auto-modify · mark productionReady true',
    stale: { ja: '前回スナップショットを薄色で表示',
             en: 'show last snapshot in muted style' } },
  { page: { ja: 'STOP',                     en: 'STOP' },
    services: ['stop-history', 'safe-snapshot'],
    fields: 'active_stops · resolved_stops · restart_rule',
    copyOnly: 'restart rule · STOP classification',
    forbidden: 'auto release · UI release',
    stale: { ja: '履歴のみ、解除は人間CLI',
             en: 'history only; release is human via CLI' } },
  { page: { ja: 'Push',                     en: 'Push' },
    services: ['push-readiness', 'evidence'],
    fields: 'branch · HEAD · commits_ahead · staged · approved_commit',
    copyOnly: 'push GO template · git status summary',
    forbidden: 'push from UI · auto push',
    stale: { ja: 'commits_ahead を「不明」と表示',
             en: 'show commits_ahead as unknown' } },
  { page: { ja: 'Inspector',                en: 'Inspector' },
    services: ['safe-snapshot (full readable)', 'all read-only services'],
    fields: 'all redacted fields',
    copyOnly: 'detail copies only',
    forbidden: 'any action',
    stale: { ja: '"snapshot stale" バナー',
             en: '"snapshot stale" banner' } },
];

function PageBackendWiringCard({ width = 1400 }) {
  const lang = useLang();
  return (
    <CardFrame width={width}>
      <BPageHead num="5"
        title={T('Page × Backend 配線', 'Page × Backend Wiring')}
        sub={T('どのページが何を読むか', 'which page reads what')} />

      <table style={{
        width: '100%', borderCollapse: 'collapse', marginTop: 18,
        fontFamily: sk.mono, fontSize: 11,
      }}>
        <thead>
          <tr style={{ background: sk.paper2 }}>
            {[T('ページ', 'PAGE'),
              T('backend service', 'backend service'),
              T('読み取り項目', 'fields'),
              T('copy-only', 'copy-only'),
              T('FORBIDDEN', 'FORBIDDEN'),
              T('stale 時の挙動', 'on stale')].map(h => (
              <th key={h} style={{
                ...thStyle, fontSize: 10, padding: '8px 10px',
                fontFamily: lang === 'en' ? sk.sans : sk.jp,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {WIRING.map((w, i) => (
            <tr key={i}>
              <td style={{ ...tdStyle, fontFamily: lang === 'en' ? sk.sans : sk.jp, fontWeight: 600 }}>
                {lang === 'en' ? w.page.en : w.page.ja}
              </td>
              <td style={tdStyle}>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {w.services.map(s => (
                    <code key={s} style={{
                      fontFamily: sk.mono, fontSize: 10, color: sk.go,
                      border: `1px solid ${sk.go}`, padding: '1px 5px',
                    }}>{s}</code>
                  ))}
                </div>
              </td>
              <td style={{ ...tdStyle, color: sk.ink }}>{w.fields}</td>
              <td style={{ ...tdStyle, color: sk.ink2 }}>{w.copyOnly}</td>
              <td style={{ ...tdStyle, color: sk.stop, textDecoration: 'line-through' }}>
                {w.forbidden}
              </td>
              <td style={{
                ...tdStyle, fontFamily: lang === 'en' ? sk.sans : sk.jp, fontSize: 11,
                color: sk.ink,
              }}>{lang === 'en' ? w.stale.en : w.stale.ja}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardFrame>
  );
}

// ════════════════════════════════════════════════════════════════
// §B6 · Implementation Phase Plan
// ════════════════════════════════════════════════════════════════
const PHASES = [
  { id: 'B-1', state: 'now',
    title: { ja: 'docs-only · 契約定義',         en: 'docs-only · contracts' },
    bullets: [
      { ja: 'architecture doc を作成',           en: 'create architecture docs' },
      { ja: 'local backend services を定義',     en: 'define local backend services' },
      { ja: 'safe preload API を定義',           en: 'define safe preload API' },
      { ja: 'data model を定義',                 en: 'define data model' },
    ],
    deny: [
      { ja: 'ソース変更なし',                    en: 'no source change' },
      { ja: '依存変更なし',                      en: 'no dep change' },
    ],
    requireGo: false,
  },
  { id: 'B-2', state: 'next',
    title: { ja: 'type-only scaffold', en: 'type-only scaffold' },
    bullets: [
      { ja: 'TypeScript の型 / interface のみ追加', en: 'add TypeScript types / interfaces only' },
      { ja: 'runtime behavior 変更なし',            en: 'no runtime behavior change' },
    ],
    deny: [
      { ja: '依存追加なし',                      en: 'no dependency added' },
      { ja: '外部書込みなし',                    en: 'no external write' },
    ],
    requireGo: true,
  },
  { id: 'B-3', state: 'later',
    title: { ja: 'read-only services', en: 'read-only services' },
    bullets: [
      { ja: 'getSafeSnapshot',         en: 'getSafeSnapshot' },
      { ja: 'getEvidenceSummary',      en: 'getEvidenceSummary' },
      { ja: 'getStackChanStatus',      en: 'getStackChanStatus' },
      { ja: 'getPushReadiness',        en: 'getPushReadiness' },
      { ja: 'getStopHistory',          en: 'getStopHistory' },
    ],
    deny: [{ ja: 'Write系API なし', en: 'no write APIs' }],
    requireGo: true,
  },
  { id: 'B-4', state: 'later',
    title: { ja: 'local chat · draft-only', en: 'local chat · draft-only' },
    bullets: [
      { ja: 'submitLocalChatMessage',  en: 'submitLocalChatMessage' },
      { ja: 'createDraftOnlyItem',     en: 'createDraftOnlyItem' },
      { ja: 'createApprovalQueueItem', en: 'createApprovalQueueItem' },
    ],
    deny: [{ ja: 'local-only / manual_copy_only のみ', en: 'local-only / manual_copy_only' }],
    requireGo: true,
  },
  { id: 'B-5', state: 'gated',
    title: { ja: 'runtime observation bridge', en: 'runtime observation bridge' },
    bullets: [
      { ja: '承認時間窓のみ',                       en: 'approved windows only' },
      { ja: 'UIに runtime 起動ボタンを置かない',    en: 'no runtime start button in UI' },
    ],
    deny: [{ ja: 'always-on runtime なし', en: 'no always-on runtime' }],
    requireGo: true,
  },
  { id: 'B-6', state: 'future',
    title: { ja: '外部連携 draft 計画', en: 'external integration planning' },
    bullets: [
      { ja: 'Gmail draft',         en: 'Gmail draft' },
      { ja: 'Calendar draft',      en: 'Calendar draft' },
      { ja: 'GitHub issue draft',  en: 'GitHub issue draft' },
      { ja: 'Social post draft',   en: 'Social post draft' },
    ],
    deny: [{ ja: '外部書込みは HOLD のまま', en: 'external write remains HOLD' }],
    requireGo: true,
  },
];

function BackendPhasePlanCard({ width = 1400 }) {
  return (
    <CardFrame width={width}>
      <BPageHead num="6"
        title={T('Implementation Phase Plan', 'Implementation Phase Plan')}
        sub="B-1 → B-6" />

      <div style={{
        marginTop: 22,
        display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10,
      }}>
        {PHASES.map(p => <PhaseColumn key={p.id} p={p} />)}
      </div>

      <div style={{
        marginTop: 22, padding: '14px 18px',
        background: sk.paper2, border: `1px dashed ${sk.rule}`,
        fontFamily: sk.jp, fontSize: 13, color: sk.ink, lineHeight: 1.7,
      }}>
        <span style={{
          fontFamily: sk.mono, fontSize: 11, letterSpacing: 1.2,
          color: sk.ink3, marginRight: 10,
        }}>HUMAN GO</span>
        {T(<>Phase B-2 以降はそれぞれ <BadgeMono tone="lock">SEPARATE GO</BadgeMono> が必須。
            <code style={{ fontFamily: sk.mono, fontSize: 12 }}>npm install</code>{' '}
            <code style={{ fontFamily: sk.mono, fontSize: 12 }}>git push</code>{' '}
            <code style={{ fontFamily: sk.mono, fontSize: 12 }}>npm run dev</code>{' '}
            は今回のGOには含まれない。</>,
           <>Phase B-2 onward each require <BadgeMono tone="lock">SEPARATE GO</BadgeMono>.
            <code style={{ fontFamily: sk.mono, fontSize: 12 }}> npm install</code>{' '}
            <code style={{ fontFamily: sk.mono, fontSize: 12 }}>git push</code>{' '}
            <code style={{ fontFamily: sk.mono, fontSize: 12 }}>npm run dev</code>{' '}
            are NOT covered by this GO.</>)}
      </div>
    </CardFrame>
  );
}

function PhaseColumn({ p }) {
  const lang = useLang();
  const stateColors = {
    now:    { color: sk.go,   bg: sk.goSoft,   label: T('進行中', 'now') },
    next:   { color: sk.hold, bg: sk.holdSoft, label: T('次', 'next') },
    later:  { color: sk.ink3, bg: sk.paper2,   label: T('後で', 'later') },
    gated:  { color: sk.stop, bg: sk.stopSoft, label: T('要GO', 'gated') },
    future: { color: sk.reject, bg: sk.rejectSoft, label: T('遠く', 'future') },
  }[p.state];
  return (
    <div style={{
      border: `1px solid ${sk.paper3}`,
      background: sk.paper,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        background: stateColors.bg, padding: '10px 12px',
        borderBottom: `1.5px solid ${stateColors.color}`,
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        }}>
          <span style={{
            fontFamily: sk.mono, fontSize: 14, fontWeight: 700, color: stateColors.color,
          }}>{p.id}</span>
          <BadgeMono tone={p.state === 'now' ? 'ok' : p.state === 'gated' ? 'lock' : 'neutral'}>
            {stateColors.label}
          </BadgeMono>
        </div>
        <div style={{
          fontFamily: lang === 'en' ? sk.sans : sk.jp,
          fontSize: 12, fontWeight: 600, color: sk.ink, marginTop: 4, lineHeight: 1.3,
        }}>{lang === 'en' ? p.title.en : p.title.ja}</div>
      </div>
      <div style={{ padding: '10px 12px', flex: 1 }}>
        <ul style={{
          margin: 0, paddingLeft: 14,
          fontFamily: sk.mono, fontSize: 10, color: sk.ink, lineHeight: 1.7,
        }}>
          {p.bullets.map((b, i) => (
            <li key={i}>{typeof b === 'string' ? b : (lang === 'en' ? b.en : b.ja)}</li>
          ))}
        </ul>
        <div style={{
          marginTop: 10, paddingTop: 8,
          borderTop: `1px dashed ${sk.paper3}`,
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {p.deny.map((d, i) => (
            <span key={i} style={{
              fontFamily: sk.mono, fontSize: 9.5, color: sk.stop,
              letterSpacing: 0.3,
            }}>✕ {typeof d === 'string' ? d : (lang === 'en' ? d.en : d.ja)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// §B7 · Required docs listing
// ════════════════════════════════════════════════════════════════
function BackendDocsCard({ width = 1200 }) {
  const lang = useLang();
  const create = [
    'docs/shikishima/FRONTEND_BACKEND_INTEGRATION_ARCHITECTURE.md',
    'docs/shikishima/LOCAL_BACKEND_SERVICE_MAP.md',
    'docs/shikishima/SAFE_PRELOAD_API_CONTRACT.md',
    'docs/shikishima/COMMAND_CENTER_CHAT_BACKEND_POLICY.md',
    'docs/shikishima/STACKCHAN_BACKEND_STATUS_CONTRACT.md',
    'docs/shikishima/BACKEND_IMPLEMENTATION_PHASE_PLAN.md',
  ];
  const update = [
    'docs/shikishima/ROADMAP_CHANGELOG.md',
    'docs/shikishima/DEVELOPMENT_TEMPO_DASHBOARD.md',
    'docs/shikishima/README.md',
  ];
  const verify = [
    'git branch --show-current',
    'git rev-parse origin/main',
    'git rev-list --count origin/main..HEAD',
    'git status --short',
    'git diff --check',
  ];
  return (
    <CardFrame width={width}>
      <BPageHead num="7"
        title={T('docs-only 成果物', 'Docs-only Deliverables')}
        sub={T('ClaudeCode への渡し方', 'handoff to ClaudeCode')} />

      <div style={{
        marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18,
      }}>
        <div>
          <SubHeadBack label={T('作成する', 'CREATE')} tone="ok" />
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {create.map(f => <FileRow key={f} path={f} action="create" />)}
          </div>
          <div style={{ height: 16 }}/>
          <SubHeadBack label={T('既存を更新', 'UPDATE if appropriate')} tone="ok" />
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {update.map(f => <FileRow key={f} path={f} action="update" />)}
          </div>
        </div>
        <div>
          <SubHeadBack label={T('検証コマンド (read-only)', 'VERIFICATION (read-only)')} tone="ok" />
          <pre style={{
            margin: '10px 0 0', padding: '12px 14px',
            background: sk.bar, color: sk.barText,
            fontFamily: sk.mono, fontSize: 11, lineHeight: 1.7,
            border: `1px solid ${sk.rule}`,
          }}>{verify.join('\n')}</pre>

          <div style={{ height: 16 }}/>
          <SubHeadBack label={T('絶対に実行しない', 'NEVER RUN')} tone="bad" />
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {['npm install', 'npm update', 'npm run dev', 'git push',
              T('外部API呼び出し', 'external API call'),
              T('StackChan 物理接続', 'StackChan physical connect'),
              T('voice / camera / mic 起動', 'voice / camera / mic activation')]
              .map((c, i) => (
                <code key={i} style={{
                  fontFamily: sk.mono, fontSize: 11, color: sk.ink2,
                  padding: '4px 10px',
                  border: `1px dashed ${sk.stop}`,
                  textDecoration: 'line-through', textDecorationColor: sk.stop,
                }}>{c}</code>
              ))}
          </div>

          <div style={{ height: 16 }}/>
          <SubHeadBack label={T('推奨 commit', 'SUGGESTED COMMIT')} tone="ok" />
          <code style={{
            display: 'block', marginTop: 10,
            fontFamily: sk.mono, fontSize: 11, color: sk.ink,
            padding: '8px 12px', background: sk.paper2,
            border: `1px solid ${sk.paper3}`,
          }}>docs: design backend integration for command center</code>
          <div style={{
            fontFamily: lang === 'en' ? sk.sans : sk.jp,
            fontSize: 11, color: sk.ink3, marginTop: 6,
          }}>{T('push しない。', 'Do not push.')}</div>
        </div>
      </div>
    </CardFrame>
  );
}

function FileRow({ path, action }) {
  const c = action === 'create' ? sk.go : sk.hold;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '6px 10px', border: `1px solid ${sk.paper3}`, background: sk.paper,
    }}>
      <BadgeMono tone={action === 'create' ? 'ok' : 'neutral'}>
        {action === 'create' ? T('新規', 'CREATE') : T('更新', 'UPDATE')}
      </BadgeMono>
      <code style={{ fontFamily: sk.mono, fontSize: 11, color: sk.ink, flex: 1 }}>
        {path}
      </code>
    </div>
  );
}

Object.assign(window, {
  BackendArchitectureCard, BackendServiceMapCard, PreloadApiCard,
  BackendDataModelCard, PageBackendWiringCard,
  BackendPhasePlanCard, BackendDocsCard,
});
