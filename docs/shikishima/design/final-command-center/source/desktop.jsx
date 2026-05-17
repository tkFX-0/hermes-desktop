// desktop.jsx — Desktop (PC) Operator View + Inspector View.
// All strings via T(ja, en).

// ─────────────────────────────────────────────────────────────
// Desktop Operator View
// ─────────────────────────────────────────────────────────────
function DesktopOperator({ state = 'HOLD', width = 1200, height = 760 }) {
  const lang = useLang();
  const jp = lang !== 'en';
  return (
    <div style={{
      width, height, background: sk.paper,
      fontFamily: sk.sans, color: sk.ink,
      display: 'flex', flexDirection: 'column',
      border: `1px solid ${sk.rule}`,
    }}>
      <Topbar mode="OPERATOR" sub={T('操作室 / 日常運用', 'Operator Room / daily use')} />
      <PageTabs active="operator" />
      <SafetyStrip decision={state} />

      <div style={{
        flex: 1, display: 'grid',
        gridTemplateColumns: '280px 1fr 320px',
        minHeight: 0,
      }}>
        {/* LEFT — Session / Gate timeline */}
        <div style={{
          borderRight: `1px solid ${sk.paper3}`,
          padding: '20px 18px',
          background: sk.paper,
          overflow: 'hidden',
        }}>
          <PanelTitle kicker="SESSION" title={T('セッション', 'Session')} />

          <KV label="Session"     value="S-2026-05-17-01" mono />
          <KV label={T('現在のGate', 'Current gate')} value="Gate 006" mono />
          <KV label={T('計画', 'Plan')} value="Task 18 → 19 → 20" mono />
          <KV label={T('操作者', 'Operator')} value={T('H. (1名)', 'H. (single human)')} mono />
          <KV label={T('直近STOP', 'Last STOP')} value="—" mono />

          <div style={{ height: 16 }}/>
          <PanelTitle kicker="GATE TIMELINE" title={T('進行', 'Progress')} />
          {[
            { id: '003', labelJp: 'Bootstrap',   labelEn: 'Bootstrap',  state: 'PASS' },
            { id: '004', labelJp: 'Plan ack',    labelEn: 'Plan ack',   state: 'PASS' },
            { id: '005', labelJp: 'Pre-push',    labelEn: 'Pre-push',   state: 'PASS' },
            { id: '006', labelJp: 'Pushレビュー', labelEn: 'Push review', state },
            { id: '007', labelJp: 'Post-push',   labelEn: 'Post-push',  state: '·' },
            { id: '008', labelJp: 'クローズ',     labelEn: 'Close',       state: '·' },
          ].map(g => (
            <div key={g.id} style={{
              display: 'grid', gridTemplateColumns: '46px 1fr 76px',
              gap: 8, alignItems: 'center',
              padding: '7px 0',
              borderTop: `1px solid ${sk.paper3}`,
              fontFamily: sk.mono, fontSize: 11,
            }}>
              <span style={{ color: sk.ink3 }}>G-{g.id}</span>
              <span style={{
                fontFamily: jp ? sk.jp : sk.sans, fontSize: 12,
                color: g.state === '·' ? sk.ink3 : sk.ink,
              }}>{jp ? g.labelJp : g.labelEn}</span>
              <span style={{ textAlign: 'right' }}>
                {g.state === '·'
                  ? <span style={{ color: sk.ink3 }}>—</span>
                  : <MiniLamp state={g.state} />}
              </span>
            </div>
          ))}
        </div>

        {/* CENTER — Lamp + Next + Chat */}
        <div style={{
          padding: '24px 28px',
          display: 'flex', flexDirection: 'column', gap: 18,
          minHeight: 0,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <PanelTitle kicker="CURRENT STATE" title={T('現在のステート', 'Current state')} />
              <Lamp state={state} size="lg" />
            </div>
            <div>
              <PanelTitle
                kicker={T('NEXT · 次の必要アクション', 'NEXT · Required human action')}
                title={T('次にやる事', 'What to do next')}
                right={<span style={{ fontFamily: sk.mono, fontSize: 10, color: sk.ink3 }}>HUMAN ONLY</span>}
              />
              <NextActionCard state={state} />
            </div>
          </div>

          {/* Chat */}
          <div style={{
            flex: 1, minHeight: 0,
            border: `1px solid ${sk.paper3}`, background: sk.paper,
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 16px',
              background: sk.paper2,
              borderBottom: `1px solid ${sk.paper3}`,
            }}>
              <span style={{
                fontFamily: sk.mono, fontSize: 10, letterSpacing: 1.4, color: sk.ink2,
              }}>{T('CHAT · 状況会話', 'CHAT · situation')}</span>
              <span style={{
                fontFamily: sk.mono, fontSize: 10, color: sk.stop,
                border: `1px solid ${sk.stop}`, padding: '2px 7px',
                borderRadius: 2, letterSpacing: 0.6,
              }}>{T('送信 = チャットのみ', 'send = chat only')}</span>
            </div>
            <div style={{ flex: 1, padding: '18px 22px', overflow: 'hidden' }}>
              <DesktopChat state={state} />
            </div>
            <ChatInputBar />
          </div>
        </div>

        {/* RIGHT — Safety + Copy buttons */}
        <div style={{
          borderLeft: `1px solid ${sk.paper3}`,
          padding: '20px 18px',
          background: sk.paper2,
          display: 'flex', flexDirection: 'column', gap: 18,
        }}>
          <div>
            <PanelTitle kicker="SAFETY BOUNDARY" title={T('安全境界 — 常時表示', 'Safety boundary — always shown')} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <SafetyChip k="execution"         v="disabled" />
              <SafetyChip k="productionReady"   v="false" />
              <SafetyChip k="external_write"    v="false" />
              <SafetyChip k="rawValuesReported" v="false" />
              <SafetyChip k="auto_send"         v="off" />
              <SafetyChip k="auto_push"         v="off" />
              <SafetyChip k="auto_pay"          v="off" />
            </div>
            <div style={{
              fontFamily: jp ? sk.jp : sk.sans, fontSize: 11, color: sk.ink2,
              marginTop: 12, lineHeight: 1.55,
            }}>
              {jp ? (<>
                GO は <b>人間が次の手動承認を進めて良い</b> という意味。<br/>
                <span style={{ color: sk.ink3 }}>≠ システムが外部実行する</span>
              </>) : (<>
                GO means <b>the human may proceed with the next manual approval</b>.<br/>
                <span style={{ color: sk.ink3 }}>≠ the system performs external actions</span>
              </>)}
            </div>
          </div>

          <div>
            <PanelTitle kicker={T('ALLOWED · 許可済みアクション', 'ALLOWED · permitted actions')} title="Copy-only" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <CopyBtn kind="copy" glyph="⧉">{T('GOテンプレート (.md)', 'GO template (.md)')}</CopyBtn>
              <CopyBtn kind="copy" glyph="⧉">{T('Evidence サマリ', 'Evidence summary')}</CopyBtn>
              <CopyBtn kind="show" glyph="⌕">{T('詳細を表示', 'Show full details')}</CopyBtn>
              <CopyBtn kind="open" glyph="↗">{T('Inspectorを開く', 'Open Inspector View')}</CopyBtn>
            </div>
          </div>

          {/* StackChan mini card · summary link to dedicated control room */}
          <div>
            <PanelTitle kicker="STACKCHAN" title={T('表示・顔の端末', 'display + face terminal')} />
            <StackChanMiniCard conn="CONNECTED" decision={state} />
          </div>

          <div style={{ marginTop: 'auto' }}>
            <div style={{
              fontFamily: sk.mono, fontSize: 9, color: sk.ink3,
              letterSpacing: 1, marginBottom: 6,
            }}>{T('BLOCKED · 設計上不可', 'BLOCKED · not possible by design')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {['send', 'push', 'approve_exec', 'runtime_start', 'pay', 'reserve', 'gh_remote_create', 'calendar_create']
                .map(b => (
                  <span key={b} style={{
                    fontFamily: sk.mono, fontSize: 10,
                    padding: '2px 7px',
                    color: sk.ink3,
                    border: `1px solid ${sk.paper3}`,
                    textDecoration: 'line-through',
                  }}>{b}</span>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* footer */}
      <div style={{
        padding: '8px 20px',
        borderTop: `1px solid ${sk.paper3}`,
        background: sk.paper2,
        display: 'flex', justifyContent: 'space-between',
        fontFamily: sk.mono, fontSize: 10, color: sk.ink3, letterSpacing: 0.6,
      }}>
        <span>{T('しきしま · operator view · 3秒で状態を把握',
                 'shikishima · operator view · understand state in 3s')}</span>
        <span>build 0.6.0-dev · local-only · no telemetry</span>
      </div>
    </div>
  );
}

function KV({ label, value, mono }) {
  const lang = useLang();
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '6px 0',
      borderBottom: `1px solid ${sk.paper3}`,
    }}>
      <span style={{
        fontFamily: sk.mono, fontSize: 10, color: sk.ink3, letterSpacing: 0.6,
      }}>{label}</span>
      <span style={{
        fontFamily: mono ? sk.mono : (lang === 'en' ? sk.sans : sk.jp),
        fontSize: 12, color: sk.ink, fontWeight: 500,
      }}>{value}</span>
    </div>
  );
}

function NextActionCard({ state }) {
  const lang = useLang();
  const jp = lang !== 'en';
  const map = {
    HOLD: {
      tag: T('レビュー · 約30秒', 'REVIEW · ~30s'),
      title: T('Task 18 のpush結果を確認してください。',
               'Please confirm the push result of Task 18.'),
      body:  T('evidence は揃っています。Push が想定どおりに到達したか、別チャネル(GitHub Actions / 通知) で確認してください。',
               'Evidence is ready. Confirm via a separate channel (GitHub Actions / notifications) whether the push landed as expected.'),
    },
    GO_READY: {
      tag: T('承認 · 90秒', 'APPROVE · 90s'),
      title: T('GOテンプレートをコピーし、別チャネルで承認してください。',
               'Copy the GO template and approve on a separate channel.'),
      body:  T('このUIではGOは送信されません。テンプレを別チャネル (チーム / CLI) に貼ってから承認操作を行ってください。',
               'GO is never sent from this UI. Paste the template into another channel (team / CLI) and perform the approval there.'),
    },
    PASS: {
      tag: T('観測 · 5分', 'OBSERVE · 5m'),
      title: T('Gate 007 の観測ログを開始してください。',
               'Start observation logs for Gate 007.'),
      body:  T('Gate 006 通過。Gate 007 では外部影響を観測のみ。書込みは引き続き禁止。',
               'Gate 006 passed. At Gate 007 external effects are observed only. Writes remain prohibited.'),
    },
    STOP: {
      tag: T('調査', 'INVESTIGATE'),
      title: T('停止理由を確認し、解除条件を満たすまで待機。',
               'Check the STOP reason and wait until release conditions are met.'),
      body:  T('外部write attemptを検出。解除はCLIから人間操作のみ。Inspectorで詳細を確認してください。',
               'External write attempt detected. Release is human-only via CLI. Check details in Inspector.'),
    },
    REJECT: {
      tag: T('書き直し', 'REWRITE'),
      title: T('却下理由を Draft で確認し、再提出を作成してください。',
               'Review the reject reason in Draft and prepare a resubmission.'),
      body:  T('再提出は別Gateで人間レビューに戻ります。自動再投稿は行われません。',
               'Resubmissions return to human review at a separate gate. No automatic re-post.'),
    },
  };
  const n = map[state] || map.HOLD;
  return (
    <div style={{
      border: `1.5px solid ${sk.rule}`,
      background: sk.paper, minHeight: 96,
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        padding: '8px 14px', background: sk.bar, color: sk.barText,
        fontFamily: sk.mono, fontSize: 10, letterSpacing: 1.2,
      }}>
        <span>{T('HUMAN · 次の必要アクション', 'HUMAN · required action')}</span>
        <span style={{ color: sk.barText2 }}>{n.tag}</span>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <div style={{
          fontFamily: jp ? sk.jp : sk.sans, fontSize: 16, fontWeight: 600,
          color: sk.ink, lineHeight: 1.45,
        }}>{n.title}</div>
        <div style={{
          fontFamily: jp ? sk.jp : sk.sans, fontSize: 12, color: sk.ink2,
          marginTop: 8, lineHeight: 1.55,
        }}>{n.body}</div>
      </div>
    </div>
  );
}

function DesktopChat({ state }) {
  if (state === 'HOLD') {
    return <>
      <ChatRow speaker="H">{T('次に何をすればいい？', 'What should I do next?')}</ChatRow>
      <ChatRow speaker="S">
        <div>{T('Gate 006 の observation evidence は揃っています。',
                'Observation evidence for Gate 006 is ready.')}</div>
        <div style={{ marginTop: 6 }}>
          {T(<>Gate 007 に進むには <b>push GO</b> が必要です。Task 18 の push 結果を確認してください。</>,
             <>To advance to Gate 007 a <b>push GO</b> is required. Please confirm the push result of Task 18.</>)}
        </div>
      </ChatRow>
      <ChatRow speaker="S" mono dim>
        <div>evidence_id = E-006-0142</div>
        <div>gate         = 006 → 007</div>
        <div>last_check   = 14:01:53Z (1m ago)</div>
      </ChatRow>
      <ChatRow speaker="H">
        {T('テンプレ見せて。送信はしない。',
           'Show me the template. Do not send.')}
      </ChatRow>
    </>;
  }
  if (state === 'GO_READY') {
    return <>
      <ChatRow speaker="S">
        {T('Evidence は確認済みです。GOテンプレートを用意しました。',
           'Evidence is verified. GO template is prepared.')}<br/>
        <span style={{ color: sk.ink2, fontSize: 13 }}>
          {T('このUIでは送信されません。別チャネルで承認操作をお願いします。',
             'This UI does not send. Please approve via a separate channel.')}
        </span>
      </ChatRow>
      <ChatRow speaker="S" mono dim>
        <div>template      = GO_T_006.md</div>
        <div>recipient     = (manual paste — not auto-sent)</div>
        <div>required_acks = 1 (you)</div>
      </ChatRow>
      <ChatRow speaker="H">
        {T('コピーだけして、CLIで進める。',
           'Just copy it; I will proceed via CLI.')}
      </ChatRow>
    </>;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// Inspector View — read-only audit grid
// ─────────────────────────────────────────────────────────────
function DesktopInspector({ width = 1400, height = 880 }) {
  return (
    <div style={{
      width, height, background: sk.paper,
      fontFamily: sk.sans, color: sk.ink,
      display: 'flex', flexDirection: 'column',
      border: `1px solid ${sk.rule}`,
    }}>
      <Topbar mode="INSPECTOR" sub={T('監査 / 開発レビュー', 'Audit / development review')} />
      <PageTabs active="inspector" />

      <div style={{
        background: sk.bar, color: sk.barText,
        padding: '8px 20px',
        display: 'flex', justifyContent: 'space-between',
        fontFamily: sk.mono, fontSize: 11, letterSpacing: 1,
      }}>
        <span>{T('READ-ONLY · 監査ビュー · このビューからは何も実行されません',
                 'READ-ONLY · audit view · nothing executes from this view')}</span>
        <span style={{ color: sk.barText2 }}>session = S-2026-05-17-01 · gate = 006</span>
      </div>

      <div style={{
        display: 'flex', gap: 0,
        background: sk.paper2,
        borderBottom: `1px solid ${sk.paper3}`,
        padding: '0 20px',
      }}>
        {['STATUS', 'B3', 'QUEUE', 'OUTBOX', 'FACE', 'GO', 'EVIDENCE', 'STOP', 'PUSH', 'AG', 'CONNECTION']
          .map((t, i) => (
            <div key={t} style={{
              padding: '11px 14px',
              fontFamily: sk.mono, fontSize: 11, letterSpacing: 1,
              color: i === 0 ? sk.ink : sk.ink3,
              borderBottom: i === 0 ? `2px solid ${sk.ink}` : '2px solid transparent',
              fontWeight: i === 0 ? 700 : 400,
            }}>{t}</div>
          ))}
      </div>

      <div style={{
        flex: 1, minHeight: 0,
        padding: 20,
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'auto auto 1fr',
        gap: 16,
        overflow: 'hidden',
      }}>
        <InspectPanel title="Status" kicker="01" span={3}>
          <KV label="state" value="HOLD" mono />
          <KV label="gate"  value={T('006 (Pushレビュー)', '006 (Push review)')} mono />
          <KV label="seq"   value="14:02:11Z" mono />
          <KV label="stops" value={T('0 件 active', '0 active')} mono />
          <KV label="rejects" value="0" mono />
          <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
            <MiniLamp state="HOLD" />
            <MiniLamp state="PASS" />
          </div>
        </InspectPanel>

        <InspectPanel title="B3 / Boundary 3" kicker="02" span={3}>
          <SafetyList />
        </InspectPanel>

        <InspectPanel title={T('承認キュー', 'Approval Queue')} kicker="03" span={6}>
          <Table head={['ID', 'TYPE', 'GATE', 'STATE', T('経過', 'AGE')]} rows={[
            ['Q-0142', 'push_review',  'G-006', 'HOLD',   '1m 12s'],
            ['Q-0141', 'evidence_ack', 'G-006', 'PASS',   '3m 04s'],
            ['Q-0140', 'plan_step',    'G-005', 'PASS',   '12m'],
            ['Q-0139', 'plan_step',    'G-005', 'REJECT', '14m'],
            ['Q-0138', 'bootstrap',    'G-003', 'PASS',   '32m'],
          ]} />
        </InspectPanel>

        <InspectPanel title={T('Draft Outbox · 下書き', 'Draft Outbox')} kicker="04" span={4}>
          <Table head={['DRAFT', 'CHANNEL', 'STATE']} rows={[
            ['GO_T_006.md', 'manual', 'READY'],
            ['EV_S_006.md', 'manual', 'READY'],
            ['NOTE_dev.md', 'local',  'DRAFT'],
          ]}/>
          <div style={{
            fontFamily: sk.mono, fontSize: 10, color: sk.ink3,
            marginTop: 8, padding: '6px 8px',
            border: `1px dashed ${sk.paper3}`,
          }}>
            {T('outbox = ローカル限定 · 自動送信なし · 人間が手で貼る',
               'outbox = local-only · no auto-send · human pastes manually')}
          </div>
        </InspectPanel>

        <InspectPanel title={T('Push状況', 'Push status')} kicker="05" span={4}>
          <KV label="last_push" value="Task 18 · 14:01:53Z" mono />
          <KV label="ack"       value={T('pending (手動)', 'pending (manual)')} mono />
          <KV label="remote"    value="github.com/private/—" mono />
          <KV label="auto_push" value="off" mono />
          <KV label="auto_remote_create" value="blocked" mono />
        </InspectPanel>

        <InspectPanel title={T('STOP履歴', 'STOP history')} kicker="06" span={4}>
          <Table head={['TS', T('理由', 'REASON'), T('解除者', 'RELEASED BY')]} rows={[
            ['05-16 22:14Z', 'external_write_attempted', 'H. (CLI)'],
            ['05-16 14:02Z', 'raw_value_leak_guard',     'H. (CLI)'],
            ['05-15 09:31Z', 'agent_off_plan',           'H. (CLI)'],
          ]}/>
        </InspectPanel>

        <InspectPanel title={T('Evidence サマリ', 'Evidence summary')} kicker="07" span={4}>
          <KV label="E-006-0142" value={T('screenshot · ok', 'screenshot · ok')} mono />
          <KV label="E-006-0141" value="log diff · ok" mono />
          <KV label="E-006-0140" value="plan ack · ok" mono />
          <KV label="hidden_raw" value={T('32項目をマスク', '32 fields masked')} mono />
        </InspectPanel>

        <InspectPanel title={T('Agent Team / StackChan / Face', 'Agent Team / StackChan / Face')} kicker="08" span={4}>
          <Table head={[T('エージェント', 'AGENT'), T('役割', 'ROLE'), 'STATE']} rows={[
            ['AG-plan',   T('プランナー', 'planner'),   'idle'],
            ['AG-review', T('レビュア', 'reviewer'),    'idle'],
            ['AG-face',   'StackChan (face)',           'speaking'],
            ['AG-watch',  T('B3 ガード', 'B3 guard'),   'armed'],
          ]}/>
          <div style={{
            fontFamily: sk.mono, fontSize: 10, color: sk.ink3, marginTop: 8,
          }}>
            {T('face_terminal = 表示のみ · 入力なし',
               'face_terminal = display-only · no input')}
          </div>
        </InspectPanel>

        <InspectPanel title={T('Runtime観測', 'Runtime observation')} kicker="09" span={4}>
          <KV label="runtime"        value={T('paused (gate)', 'paused (gate)')} mono />
          <KV label="auto_start"     value="off" mono />
          <KV label="observed_calls" value={T('0 外部呼出し', '0 external')} mono />
          <KV label="cpu / mem"      value="2% / 318MB" mono />
          <KV label="uptime"         value="3h 42m" mono />
        </InspectPanel>
      </div>
    </div>
  );
}

function InspectPanel({ title, kicker, span = 3, children }) {
  return (
    <div style={{
      gridColumn: `span ${span}`,
      border: `1px solid ${sk.paper3}`,
      background: sk.paper,
      padding: '14px 14px 12px',
      minHeight: 0,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        paddingBottom: 8, marginBottom: 10,
        borderBottom: `1px solid ${sk.paper3}`,
      }}>
        <div style={{
          fontFamily: sk.mono, fontSize: 11, letterSpacing: 1,
          color: sk.ink, fontWeight: 600,
        }}>{title}</div>
        <div style={{
          fontFamily: sk.mono, fontSize: 10, color: sk.ink3, letterSpacing: 1.2,
        }}>{kicker}</div>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>{children}</div>
    </div>
  );
}

function Table({ head, rows }) {
  return (
    <table style={{
      width: '100%', borderCollapse: 'collapse',
      fontFamily: sk.mono, fontSize: 11,
    }}>
      <thead>
        <tr>
          {head.map((h, i) => (
            <th key={i} style={{
              textAlign: 'left', padding: '5px 6px',
              color: sk.ink3, fontWeight: 500, letterSpacing: 0.6,
              borderBottom: `1px solid ${sk.paper3}`,
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => {
              const isState = head[j] === 'STATE' && STATES[c];
              return (
                <td key={j} style={{
                  padding: '5px 6px', color: sk.ink,
                  borderBottom: `1px solid ${sk.paper3}`,
                  whiteSpace: 'nowrap',
                }}>
                  {isState ? <MiniLamp state={c} /> : c}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SafetyList() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <SafetyChip k="execution"          v="disabled" />
      <SafetyChip k="productionReady"    v="false" />
      <SafetyChip k="external_write"     v="false" />
      <SafetyChip k="rawValuesReported"  v="false" />
      <SafetyChip k="auto_send"          v="off" />
      <SafetyChip k="auto_pay"           v="off" />
      <SafetyChip k="auto_reserve"       v="off" />
    </div>
  );
}

Object.assign(window, { DesktopOperator, DesktopInspector, NextActionCard, KV });
