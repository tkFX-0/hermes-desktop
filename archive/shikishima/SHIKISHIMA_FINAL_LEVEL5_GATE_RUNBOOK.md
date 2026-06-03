# しきしま Level 5 Gate Runbook

**Baseline:** aadea91 | **Prepared:** 2026-05-19

---

## Level 5 とは

Level 5 操作は「AI が単独で判断・実行してはならない操作」。
人間が明示的な GO を出すまで、全て HOLD。

---

## Level 5 操作 全一覧

### 外部接続・実行系

| Gate ID | 操作 | 状態 |
|---|---|---|
| PUSH-GO | git push | 人間 GO のみ実施済み |
| RUNTIME-GO | runtime start (npm run dev) | time_window GO 必要 |
| CC-03 | Command Chat 実送信 | BLOCKED |
| HB-01 | Hermes Bridge / WSL2 | BLOCKED |
| OAUTH-GO | OAuth / login | HOLD |
| XS-READ | x_search / SNS 読み取り | FUTURE |
| OBS-LOCAL | Obsidian local note write | FUTURE |
| EXT-WRITE | 外部 API write | BLOCKED |
| EXT-SOCIAL | 投稿/返信/DM/いいね/フォロー | BLOCKED |
| EXT-PAYMENT | 購入/予約/決済 | BLOCKED |

### 物理・メディア系

| Gate ID | 操作 | 状態 |
|---|---|---|
| SC-PHYS | StackChan 物理動作 | FUTURE/未到着 |
| VOICE-OUT | 音声出力 | HOLD |
| MIC-IN | マイク入力 | HOLD |
| CAM-IN | カメラ入力 | HOLD |

### 状態変更系

| Gate ID | 操作 | 状態 |
|---|---|---|
| PROD-GATE | productionReady: true | LOCKED_FALSE |
| EXEC-GATE | execution: enabled | LOCKED_DISABLED |

---

## GO 文の必須フィールド (全 Level 5 共通)

```yaml
level5_go_required:
  gate_id:               # 上記 Gate ID
  date:                  # YYYY-MM-DD
  time_window:           # HH:MM–HH:MM JST (runtime/接続の場合)
  approved_action:       # 承認する具体的なコマンドまたはアクション
  scope:                 # 何まで許可か (それ以外は全て禁止)
  allowed_count:         # 許可する回数/頻度 (runtime は 1 session のみ等)
  forbidden_actions:     # 明示的に禁止する操作のリスト
  stop_conditions:       # どうなったら即停止か
  evidence_path:         # 証跡ファイルのパス
  rollback_shutdown:     # どうやって停止・戻すか
```

---

## 各 Gate の承認フォーム

詳細 → `SHIKISHIMA_REAL_OPERATION_100_LEVEL5_APPROVAL_FORMS.md`

---

## 絶対安全要件 (全 Level 5 共通)

```
productionReady: false (人間が変更するまで)
execution: disabled (人間が変更するまで)
rawValuesReported: false
外部 write: 明示 GO なしに実行しない
Level 5 の一括承認: 禁止
```

---

> AIは作るところまで。鍵と発射ボタンは人間。
