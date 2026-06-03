# しきしま実運用100% — Master Design

**Baseline:** aadea91
**Prepared:** 2026-05-19
**Worker:** ClaudeCode (docs-only)

---

## 実運用100%とは何か

実運用100%とは、AIが勝手に外へ出る状態ではない。
人間がGateを見て、必要なときにGOを出せる状態である。

AIは作るところまで。
鍵と発射ボタンは人間。

---

## 現在のベースライン

```
branch:         main
HEAD:           aadea91
origin/main:    aadea91
commits_ahead:  0
productionReady: false
execution:       disabled
rawValuesReported: false
```

---

## 100% の定義

### 100% ではないもの

```
× 完全自律AIが外部APIを自由に呼び出す
× productionReady が自動的に true になる
× execution が自動的に enabled になる
× 無制限の外部書き込み
× 無制限の SNS 投稿
× 無制限の WSL/Hermes 実行
× 無制限の StackChan/voice/mic/camera 操作
× 人間が止めても続く自律ループ
× raw token/secret/個人情報 の出力
```

### 100% であるもの

```
✓ 安全な管制室 UI / Control Center の目視確認完了
✓ Gate ダッシュボードで全 Level 5 操作が可視化
✓ すべての Level 5 操作が人間 GO なしに実行されない
✓ live snapshot が redacted のみで表示
✓ rollback/STOP 条件が全 Gate で文書化
✓ 最終受け入れ記録が作成済み
✓ 人間が任意の Gate を開けられる状態
```

---

## 安全不変条件

```yaml
productionReady: false   # 人間が明示変更するまで
execution: disabled      # 人間が明示変更するまで
rawValuesReported: false # 常時
external_write: blocked  # 明示 GO なし禁止
runtime: time_window GO のみ
git_push: 人間 GO のみ
```

---

## 人間の役割

| 役割 | 内容 |
|---|---|
| GO 判断 | Level 5 操作に明示的に GO を出す |
| HOLD 判断 | 問題があれば HOLD し ClaudeCode に修正依頼 |
| Gate 管理 | どの Gate をいつ開けるか決定 |
| 最終受け入れ | 実運用100%を宣言する |

---

## AI Worker の役割

| Worker | 役割 | Level |
|---|---|---|
| ClaudeCode | UI実装 / typecheck / evidence / docs | 1–4 |
| GPT | 設計 / GO文 / 方針整理 | 1–2 |
| Codex | push readiness review / lint | 3–4 |
| Human Gate | push / runtime / OAuth / 外部 | **5** |

---

## 残フェーズ概要

| Phase | タイトル | 状態 |
|---|---|---|
| 0 | Baseline Freeze | DONE |
| 1 | Runtime Visual Recheck Evidence | HOLD |
| 2 | Control Center Live Data 確認 | evidence 残 |
| 3 | Local UX 確認 | evidence 残 |
| 4 | Level 5 Gate 書類整備 | ほぼ完了 |
| 5 | CC-03 Command Chat 実送信 | BLOCKED |
| 6 | HB-01 Hermes Bridge WSL2 | BLOCKED |
| 7 | XS-01 x_search read-only | BLOCKED |
| 8 | Obsidian Local Note Gate | FUTURE |
| 9 | StackChan / Voice / Mic / Camera | FUTURE |
| 10 | Final 実運用100% 受け入れ | FUTURE |

詳細 → `SHIKISHIMA_REAL_OPERATION_100_PHASE_ROADMAP.md`

---

## GO/HOLD 判断ポイント

各フェーズの GO/HOLD は `SHIKISHIMA_REAL_OPERATION_100_GO_HOLD_MATRIX.md` を参照。

**共通原則:**
- AI (ClaudeCode) は Level 5 を自己承認できない
- GO には scope / date / time_window を必ず含める
- HOLD は問題を記録し ClaudeCode に修正依頼
- REJECT はそのフェーズを永続的に無効化

---

## 最終受け入れ条件

```
Phase 1–4: DONE または PASS
Phase 5–9: PASS または明示的に DEFERRED
rawValuesReported: false 維持
productionReady: false (人間宣言まで)
execution: disabled (人間宣言まで)
rollback/停止 手順: 文書化済み
最終受け入れ記録: 作成済み
```
