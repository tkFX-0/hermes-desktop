# しきしま実運用100% — GO/HOLD Matrix

**Baseline:** aadea91 | **Prepared:** 2026-05-19

---

## 原則

```
AI (ClaudeCode) は Level 5 を自己承認できない
ClaudeCode は runtime を自己承認できない
ClaudeCode は外部書き込みを自己承認できない
ClaudeCode は productionReady: true を自己設定できない
ClaudeCode は execution: enabled を自己設定できない
人間が scope を明示した GO が必要
```

---

## GO 文の必須フィールド

```yaml
go_required_fields:
  target:          # 何に対して GO か
  date:            # YYYY-MM-DD
  time_window:     # HH:MM–HH:MM JST (runtime/接続の場合)
  approved_action: # 承認するコマンドまたはアクション
  scope:           # 何まで許可か (それ以外は禁止)
  stop_conditions: # どうなったら即停止か
  evidence_path:   # 証跡ファイルパス
```

---

## Phase 別 GO/HOLD

### Phase 0 — Baseline

| 判断 | 条件 |
|---|---|
| GO | HEAD == origin/main / commits_ahead == 0 / clean tree |
| HOLD | dirty files / unexpected commits |
| REJECT | productionReady: true または execution: enabled が発見された |
| STOP | 上記に加え raw value が発見された場合 |

### Phase 1 — Runtime Visual Recheck

| 判断 | 条件 |
|---|---|
| GO | 人間が date/time_window 記入 + 明示的に「GO」と発言 |
| HOLD | 不確認の STOP 条件あり / time_window 未設定 |
| REJECT | 重大な安全問題が発見された |
| STOP (実行中) | raw value / productionReady: true / execution: enabled / Level 5 ボタン動作 |
| 証拠 | evidence doc 作成・commit |
| 判断者 | **人間のみ** |

### Phase 2–3 — Live Data / UX 確認

| 判断 | 条件 |
|---|---|
| GO | redacted のみ / UX 安定 |
| HOLD | raw value / 重大 layout 崩れ |
| 証拠 | evidence doc |
| 判断者 | **人間のみ** (Level 4 docs は ClaudeCode 作成可) |

### Phase 4 — Level 5 Gate 書類

| 判断 | 条件 |
|---|---|
| GO | 全 Level 5 承認フォーム完備 |
| HOLD | フォーム不足 / STOP 条件未定義 |
| 判断者 | 人間がレビュー → ClaudeCode が追記修正可 |

### Phase 5–9 — Level 5 実運用

| 判断 | 条件 |
|---|---|
| GO | 個別 GO フォームに全必須フィールド記入 + 明示的に「GO」 |
| HOLD | フォーム未記入 / 条件不明 |
| DEFERRED | 明示的に「このフェーズは後回し」と記録 |
| REJECT | 永続的に無効化 |
| STOP | 想定外の動作 / raw value / 意図しない外部接続 |
| 判断者 | **人間のみ** |

**重要: Level 5 の一括承認は禁止。各 Gate を個別に承認すること。**

### Phase 10 — 最終受け入れ

| 判断 | 条件 |
|---|---|
| GO | Phase 1–4 DONE / Phase 5–9 PASS or DEFERRED / 全書類完備 |
| PASS_WITH_CAVEAT | 一部課題ありだが受け入れ可 (caveat 記録必須) |
| HOLD | 未解決の重大問題あり |
| REJECT | 重大な安全問題 |
| 判断者 | **人間のみ** |
