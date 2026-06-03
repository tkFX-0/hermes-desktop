# A限定運用 → Level 5 Runbook

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** RUNBOOK — operational guide for safe gate progression

---

## Core Principle

```text
一度に1ゲートだけ開ける。
1つのGOで1つのアクションだけ実行する。
証跡を残す。
ゲートを閉じてから次を判断する。
```

---

## Daily A限定運用 Flow

Each session follows this pattern:

```text
Step 1: しきしま — 現在地サマリー
  - 現在のHEAD / commits_ahead
  - 前回証跡の確認
  - HOLD中のゲート一覧

Step 2: しずめ — GO/HOLD/DEFER 分類
  - 本日候補ゲートを分類
  - STOP条件を再確認
  - rawValues チェック

Step 3: むすび — 次のゲート選択
  - LEVEL_5_GATE_OPENING_ORDER.md から最優先候補を選ぶ
  - 依存条件を確認
  - GO形式のフィールドを確認

Step 4: つむぎ — タスク準備
  - 必要なタスクプロンプトを作成
  - 証跡ファイルパスを設定
  - 許可アクション・禁止アクションを列挙

Step 5: しるべ — 証跡パス準備
  - evidence_file パスを確定
  - shikishima-library/ 対象フォルダを確認

Step 6: Human — GO発行
  - 人間が明示的にGOを出す
  - GO形式: 日付・time_window・exact_action・run_count・stop_if

Step 7: Worker — スコープ実行
  - ClaudeCode / Codex / human が1アクションを実行
  - run_countを超えたら即停止
  - STOP条件に触れたら即停止

Step 8: 証跡記録
  - evidence_file に結果を記録
  - rawValues チェック（token/secret/raw pathなし）
  - git add → git commit (push は別途 GO)

Step 9: ゲートクローズ
  - gate_auto_close: true
  - 次のアクションは HOLD に戻る

Step 10: 次セッションの判断
  - 人間がゲートの結果を確認
  - 次のゲートを選ぶかどうか判断
  - 今日はここまで、も正解
```

---

## Rules

```text
1. One gate per session (recommended)
   ゲートを欲張らない。1つ開けたら1つ閉じる。

2. No simultaneous gates
   2つのゲートを同時に開けない。

3. Fixed run count
   GO に run_count を明記する。上限を超えたら自動停止。

4. Evidence required
   証跡なしのゲート実行は認めない。

5. STOP conditions defined first
   GOを出す前に STOP条件を確認する。

6. Human holds the key
   AIは作るところまで。人間がGOを出す。鍵は人間が持つ。

7. Return to HOLD
   ゲートが閉じたら次は必ずHOLDに戻る。
```

---

## Session Checklist (Before Any Level 5 Gate)

```text
- [ ] Level 4 confirmed (LEVEL_4_FINAL_CONFIRMATION_RECORD.md)
- [ ] Gate prerequisites met (gate-specific doc)
- [ ] Exact action specified (not "any")
- [ ] Run count fixed (integer)
- [ ] STOP conditions written
- [ ] Evidence path set
- [ ] rawValues check planned
- [ ] Rollback / disable path known
- [ ] Human has reviewed the GO form
```

---

## What NOT To Do

```text
NEVER:
  - open two gates in one session without review between
  - issue a GO without all required fields
  - skip evidence recording
  - retry automatically after STOP
  - issue a "blanket Level 5 GO"
  - escalate from Level 4 without explicit per-gate GO
  - run a Level 5 action at background
  - ignore STOP conditions because "it looks fine"
```

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
level5_gates:       HOLD
```
