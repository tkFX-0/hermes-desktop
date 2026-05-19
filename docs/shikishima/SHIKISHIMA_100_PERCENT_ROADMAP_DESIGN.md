# しきしま 100% Roadmap Design

**Baseline:** 75e690b
**Prepared:** 2026-05-19
**Worker:** ClaudeCode (docs-only)

---

## 100% の定義

100% は「完全自律AI」ではない。
100% は「**人間がすべての Gate を任意に開けられる状態**」である。

- 全計画 UI / 管制室 機能が安全に表示確認済み
- Gate ダッシュボードで全 Level 5 操作が可視化・管理済み
- すべての Level 5 操作が人間 GO なしに実行されない
- ロールバック・停止手順が文書化済み
- 最終受け入れ記録が作成済み

詳細 → `SHIKISHIMA_100_PERCENT_DEFINITION_OF_DONE.md`

---

## フェーズ概要

| Phase | タイトル | Level | 状態 |
|---|---|---|---|
| 1 | 現ベースライン確定 | 1–4 | **DONE** |
| 2 | Agent Theater 目視確認 | L5 (runtime) | **HOLD** |
| 3 | Control Center live data 安定化 | 1–4 | 実装済、evidence 残 |
| 4 | UI 品質 / ローカル UX 安定化 | 1–4 | 実装済、evidence 残 |
| 5 | Level 5 Gate 準備書類 | 1–4 (準備) | 本 docs で完了 |
| 6 | CC-03 Command Chat 実送信テスト | L5 | **BLOCKED** |
| 7 | HB-01 Hermes Bridge WSL2 接続 | L5 | **BLOCKED** |
| 8 | XS-01 x_search read-only gate | L5 | **BLOCKED** |
| 9 | StackChan / Voice / Camera / Mic | L5 + 物理 | **FUTURE** |
| 10 | 最終受け入れ / 100% 完了 | L5 (宣言) | **FUTURE** |

---

## Phase 1 — 現ベースライン確定

**目的:** 75e690b を既知良好ベースラインとして固定する

**タスク:**
- [x] HEAD == origin/main == 75e690b 確認
- [x] clean working tree 確認
- [x] runtime が停止中であること確認
- [x] Level 5 ブロック状態確認
- [x] docs が現状を正確に反映

**状態:** DONE

---

## Phase 2 — Agent Theater 目視確認 (AT-14)

**目的:** AT-07〜AT-13 の実装を runtime で目視確認する

**タスク:**
- [ ] 人間が `AT_14_RUNTIME_VISUAL_RECHECK_GO_TEMPLATE.md` に date/time_window を記入
- [ ] 明示的に「AT-14 runtime visual recheck GO」と言う
- [ ] 承認コマンド `npm run dev` のみ実行
- [ ] Agent Theater / 管制室 を目視確認
  - AT-07 Control Room Layout + HandoffLane
  - AT-08 Worker Status + Slot Status
  - AT-09 Resume Queue / Cooldown
  - AT-10 Runaway Guard
  - AT-11 Worker Routing
  - AT-12 Gate Dashboard
  - AT-13 Visual Polish
- [ ] Ctrl+C で停止
- [ ] git status --short 確認
- [ ] evidence doc 作成
- [ ] evidence commit/push

**Level:** runtime 起動 = Level 5

**STOP 条件:**
- productionReady: true が表示
- execution: enabled が表示
- push/OAuth/外部write ボタンが機能
- raw token/secret/path が表示

**状態:** HOLD — 人間 time_window GO 待ち

---

## Phase 3 — Control Center live data 安定化

**目的:** CC-01/02 ポーリングが安全・安定していることを確認する

**タスク:**
- [ ] PageShell safety strip にスナップショット値が表示されることを確認
- [ ] Stale / Fresh 表示が正しいことを確認
- [ ] redacted のみ (raw token/path/secret/IP なし)
- [ ] IPC エラー時の fallback (stale表示) を確認
- [ ] evidence doc 作成 (docs-only / Level 4)
- runtime 観察は Phase 2 の time_window GO 内で兼ねても可

**Level:** docs 準備 = Level 1–4 / runtime 観察 = Level 5

**状態:** 実装済 (75e690b)、evidence 未作成

---

## Phase 4 — UI 品質 / ローカル UX 安定化

**目的:** UI-01/02 が期待通り動作することを確認する

**タスク:**
- [ ] UI-01: ウィンドウサイズを変更し再起動後に復元されることを確認
  - `userData/window-bounds.json` ローカルのみ (git ignore)
  - raw パス非表示確認
- [ ] UI-02: ☀ / 🌙 / 🖥 トグルが正しくテーマを切り替えることを確認
  - `localStorage` に保存 (THEME_STORAGE_KEY)
  - dark / light / system すべて動作確認
- [ ] evidence doc 作成

**Level:** Level 1–4

**状態:** 実装済 (75e690b)、evidence 未作成

---

## Phase 5 — Level 5 Gate 準備書類

**目的:** Level 5 操作の承認フォームと手順書を完備する

**タスク:**
- [x] CC-03 承認フォーム (`LEVEL5_BLOCKED_TASKS.md`)
- [x] HB-01 承認フォーム (`LEVEL5_BLOCKED_TASKS.md`)
- [x] XS-01 承認フォーム (`LEVEL5_BLOCKED_TASKS.md`)
- [x] Level 5 Gate Plan (`SHIKISHIMA_LEVEL5_GATE_PLAN_TO_100.md`) ← 本 docs
- [ ] OAuth future gate plan
- [ ] Obsidian local note gate plan (既存 docs 参照)
- [ ] external write gate policy (既存 docs 参照)
- [ ] productionReady 最終 gate policy
- [ ] execution enable 最終 gate policy

**Level:** 準備書類 = Level 1–4 / 実際の実行 = Level 5

**状態:** 本 docs package で大部分完了

---

## Phase 6 — CC-03 Command Chat 実送信テスト

**目的:** Command Chat から実際にメッセージを Hermes へ送信する

**必要な人間 GO フォーム:**
```yaml
cc03_command_chat_send_go:
  date:
  time_window_start:
  time_window_end:
  test_message_content:
  destination_endpoint:
  approved_ui_action:
  stop_conditions:
  shutdown_method:
  evidence_file:
```

**安全要件:**
- 外図への意図しない送信なし
- 自律的な繰り返し送信なし
- raw value / secret 非表示
- productionReady: false 維持
- execution: disabled 維持

**状態:** BLOCKED — 人間 GO 待ち

---

## Phase 7 — HB-01 Hermes Bridge WSL2 接続

**目的:** WSL2 上の Hermes と desktop を接続する

**必要な人間 GO フォーム:**
```yaml
hb01_hermes_bridge_go:
  date:
  time_window_start:
  time_window_end:
  wsl2_target:
  approved_command:
  connection_scope:
  stop_conditions:
  shutdown_method:
  evidence_file:
```

**安全要件:**
- raw ローカルパス/token を chat/docs に出力しない
- 制御されていない exec なし
- 外部ネットワーク: 別途承認が必要
- productionReady: false 維持
- execution: disabled 維持

**状態:** BLOCKED — 人間 GO 待ち

---

## Phase 8 — XS-01 x_search read-only gate

**目的:** SNS/Web の read-only 認識を将来有効化する

**必要な人間 GO フォーム:**
```yaml
xs01_xsread_gate_go:
  date:
  time_window_start:
  time_window_end:
  source:
  topic:
  read_only_scope:
  no_write_confirmed: true
  evidence_file:
```

**安全要件 (絶対):**
- 要約/読み取り/draft のみ
- 投稿/返信/DM/いいね/フォローなし
- アカウント変更なし
- 自律的ポーリングなし (別途承認なしに)

**状態:** BLOCKED — XS-READ gate 未開放

---

## Phase 9 — StackChan / Voice / Camera / Mic 将来統合

**目的:** 物理デバイス・音声・カメラ・マイク統合を将来的に安全に行う

**タスク (docs-only / Level 4):**
- [ ] StackChan display-only plan (既存あり)
- [ ] StackChan 物理動作 gate policy
- [ ] 音声出力 gate policy
- [ ] マイク入力 gate policy
- [ ] カメラ入力 gate policy
- [ ] ローカル音声パイプライン plan
- [ ] 緊急停止ポリシー

**Level:** 準備書類 = Level 1–4 / 物理動作 = Level 5 + 別途 Gate

**状態:** FUTURE / HOLD

---

## Phase 10 — 最終受け入れ / 100% 完了宣言

**目的:** 100% 完了として記録する

**条件 (全て満たすこと):**
- [ ] Phase 1–4 すべて DONE
- [ ] Phase 2 runtime 目視確認 PASS
- [ ] Level 5 gate 準備書類 完備
- [ ] Phase 6/7/8 の controlled test がPASS または明示的に defer
- [ ] rawValuesReported: false 維持
- [ ] productionReady: false (人間が変更するまで)
- [ ] execution: disabled (人間が変更するまで)
- [ ] ロールバック/停止手順 文書化
- [ ] 最終受け入れ記録 作成

**状態:** FUTURE — Phase 2–9 完了後

---

## 重要原則

> AIは作るところまで。
> 鍵と発射ボタンは人間。
