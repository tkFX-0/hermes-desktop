# しきしま実運用100% — Phase Roadmap

**Baseline:** aadea91
**Prepared:** 2026-05-19

---

## Phase 0 — Baseline Freeze

**状態:** DONE

**目的:** aadea91 を現在の既知良好ベースラインとして確定する。

**確認項目:**
- [x] HEAD == origin/main == aadea91
- [x] commits_ahead == 0
- [x] staged == 0
- [x] tracked_dirty == 0
- [x] runtime 停止中
- [x] Level 5 ブロック中
- [x] productionReady: false
- [x] execution: disabled
- [x] rawValuesReported: false

**GO条件:** 全て PASS → Phase 1 へ
**HOLD条件:** 未解決の tracked_dirty / commits_ahead → 修正後再確認

---

## Phase 1 — Runtime Visual Recheck Evidence

**状態:** HOLD — 人間 time_window GO 待ち

**目的:** AT-07〜AT-15 と Room Layout の実 UI を目視確認し、証跡を記録する。

**確認対象:**
- Agent Theater diamond room layout
- AT-07 Control Room (5エージェント配置、HandoffLane)
- AT-08 Worker Status Panel
- AT-09 Resume Queue / Cooldown
- AT-10 Runaway Guard
- AT-11 Worker Routing
- AT-12 Gate Dashboard (12ゲート)
- AT-13 Visual Polish (スペーシング、文字サイズ)
- AT-15 UI Scale-Up (フォント読みやすさ)
- テーマトグル (☀/🌙/🖥)
- Ctrl+wheel zoom 動作
- CC live snapshot (PageShell safety strip)

**必要な人間 GO フォーム:**
```yaml
at14_runtime_visual_recheck_go:
  date:
  time_window_start:       # HH:MM JST
  time_window_end:
  approved_command:        npm run dev
  observation_target:      Agent Theater / 管制室 / Control Center
  shutdown_method:         Ctrl+C
  evidence_file:           docs/shikishima/AT14_ROOM_VISUAL_EVIDENCE_YYYY-MM-DD.md
```

**STOP 条件:**
- raw secret/token/IP/local path が表示された
- productionReady: true が表示された
- execution: enabled が表示された
- Level 5 ボタンが動作した
- runtime が停止しない
- git status が unexpected に変化した
- 安全ラベルが隠れる重大 overflow

**成果物:** evidence doc → commit → push GO
**GO/HOLD:** 人間が PASS / PASS_WITH_CAVEAT / HOLD / REJECT を判断

---

## Phase 2 — Control Center Live Data Stabilization

**状態:** 実装済み (75e690b)、evidence 未作成

**目的:** CC-01/02 live snapshot ポーリングが安全に動作することを確認する。

**確認対象:**
- PageShell safety strip に live snapshot 反映
- OperatorPage に live data 反映
- Stale/Fresh 切り替え動作
- redacted のみ表示 (raw token/path/IP/secret なし)
- IPC エラー時の fallback (stale 表示)

**タスク:**
- [ ] visual confirmation (runtime 観察は Phase 1 と兼用可)
- [ ] evidence doc 作成 (Level 4)
- [ ] commit

**GO条件:** redacted/safe な live data が表示 → Phase 3 へ
**HOLD条件:** raw value / misleading state が表示 → source fix 後再確認

---

## Phase 3 — Local UX Real Operation Stabilization

**状態:** 実装済み (75e690b)、evidence 未作成

**目的:** 日常的なローカル操作が快適であることを確認する。

**確認対象:**
- ウィンドウサイズ復元 (window-bounds.json)
- Ctrl+wheel zoom / Ctrl+0 リセット
- テーマトグル dark/light/system
- ナビ順序 (CC / Mobile Console 先頭)
- クリティカルなレイアウト崩れなし

**タスク:**
- [ ] visual confirmation (Phase 1 と兼用可)
- [ ] evidence doc 作成
- [ ] commit

**GO条件:** ローカル UX 安定 → Phase 4 へ

---

## Phase 4 — Level 5 Gate 準備書類完備

**状態:** 大部分完了、最終確認残

**目的:** Level 5 操作の承認フォームと停止手順を完備する。

**確認対象:**
- CC-03 承認フォーム
- HB-01 承認フォーム
- XS-01 承認フォーム
- OAuth gate policy
- Obsidian local note gate policy
- productionReady 最終 gate policy
- execution enable 最終 gate policy
- StackChan / voice / mic / camera gate policy (Phase 9 docs)

**タスク:**
- [x] CC-03 フォーム (LEVEL5_BLOCKED_TASKS.md)
- [x] HB-01 フォーム (LEVEL5_BLOCKED_TASKS.md)
- [x] XS-01 フォーム (LEVEL5_BLOCKED_TASKS.md)
- [x] OAuth gate policy
- [x] Obsidian gate policy
- [x] productionReady gate policy
- [x] execution gate policy
- [ ] Phase 9 StackChan/Voice/Mic/Camera gate policy → 本パッケージで完了

**GO条件:** 全 Level 5 Gate 書類完備 → Phase 5〜10 へ (個別に)

---

## Phase 5 — CC-03 Command Chat 実送信テスト

**状態:** BLOCKED — 人間 GO 待ち

**目的:** Command Chat から実際に 1 回だけメッセージを送信するテストを行う。

**必要な人間 GO フォーム:**
```yaml
cc03_command_chat_send_go:
  date:
  time_window_start:
  time_window_end:
  endpoint_or_target:
  test_message_content:
  max_messages_in_window: 1
  forbidden_actions:
    - repeat_send
    - autonomous_retry
    - external_unintended_write
  stop_conditions:
    - wrong_endpoint
    - raw_value_output
    - productionReady_true
    - execution_enabled
  shutdown_method:
  evidence_file:
```

**GO/HOLD:** 人間が個別に判断 (Phase 1〜4 完了後推奨)

---

## Phase 6 — HB-01 Hermes Bridge WSL2 接続テスト

**状態:** BLOCKED — 人間 GO 待ち

**目的:** WSL2 上の Hermes と接続する制御されたテストを行う。

**必要な人間 GO フォーム:**
```yaml
hb01_hermes_bridge_go:
  date:
  time_window_start:
  time_window_end:
  wsl2_target:
  approved_command:
  connection_scope:      # localhost only / LAN only
  max_duration_minutes:
  stop_conditions:
    - unexpected_external_network
    - raw_value_output
    - productionReady_true
    - execution_enabled
  shutdown_method:
  evidence_file:
```

**GO/HOLD:** 人間が個別に判断

---

## Phase 7 — XS-01 x_search read-only Gate

**状態:** BLOCKED — XS-READ gate 未開放

**目的:** read-only での SNS/Web 認識を有効化する。

**必要な人間 GO フォーム:**
```yaml
xs01_xsread_gate_go:
  source:
  topic:
  read_only_confirmed: true
  no_write: true
  no_post_no_reply_no_dm: true
  no_like_no_follow: true
  evidence_file:
```

**絶対禁止:** 投稿/返信/DM/いいね/フォロー/削除/アカウント変更

**GO/HOLD:** 人間が個別に判断

---

## Phase 8 — Obsidian / Local Note 実運用 Gate

**状態:** FUTURE / HOLD

**目的:** Obsidian vault への限定的な書き込みを人間承認下で有効化する。

**必要な人間 GO フォーム:** `PHASE5_OBSIDIAN_GATE_POLICY.md` 参照

**GO/HOLD:** 人間が個別に判断

---

## Phase 9 — StackChan / Voice / Mic / Camera 将来統合

**状態:** FUTURE / HOLD

**目的:** 物理デバイス・音声・カメラ・マイク統合を安全に計画する。

**作成必要:**
- StackChan display-only plan (docs)
- StackChan 物理動作 gate
- voice output gate
- mic input gate
- camera input gate
- emergency stop policy

**Level:** docs は Level 4 / 物理動作/音声 は Level 5 + 別途 Gate

**GO/HOLD:** 人間が各能力を個別に判断

---

## Phase 10 — 最終受け入れ / 実運用100% 宣言

**状態:** FUTURE

**目的:** しきしま実運用準備100%を正式に宣言する。

**条件:**
```
Phase 1–4: DONE または PASS
Phase 5–9: PASS または明示的 DEFERRED
rawValuesReported: false
productionReady: false (人間宣言まで)
execution: disabled (人間宣言まで)
rollback/停止手順: 文書化済み
最終受け入れ記録: 作成済み
```

**重要:** Level 5 の一部が DEFERRED でも、その旨を明示すれば100%を宣言可能。

---

## AIは作るところまで。鍵と発射ボタンは人間。
