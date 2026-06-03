# Autonomous Operation Remaining Blockers

**date:** 2026-05-21
**status:** ACTIVE BLOCKERS LIST — updated from productionReady precheck

---

## Critical Blockers (productionReady cannot proceed)

### BLOCKER-001: HB-01 Hermes/WSL 未実証

```text
status:   OPEN
impact:   productionReady に必要な中リスク Lv5 実証が不完全
mitigation: hb01_hermes_wsl_go + controlled pilot execution
resolution: HB-01 one-shot PASS + evidence commit
```

### BLOCKER-002: CC-03 Command Chat 未実証

```text
status:   OPEN
impact:   AI API 送信の安全性が未確認
mitigation: cc03_real_send_go + one-shot execution
resolution: CC-03 one-shot PASS + evidence commit
```

### BLOCKER-003: XACC-01 未判断

```text
status:   OPEN (判断待ち)
impact:   X account OAuth = 最高リスク / 明示的な GO or DEFER が必要
mitigation: xacc01_read_only_auth_go または明示的 DEFER 宣言
resolution: tk が GO or DEFER を選択
note:     DEFER でも productionReady の前提条件として文書化が必要
```

### BLOCKER-004: XS-AUTO-03 未実証

```text
status:   OPEN
impact:   スケジューラー経由の外部検索が未確認
mitigation: xs_auto_read_go + one-shot execution
resolution: XS-AUTO-03 one-shot PASS + evidence commit
note:     BLOCKER-001/002 より低リスク — 先行実施推奨
```

### BLOCKER-005: Human Review Session 未実施

```text
status:   OPEN (original blocker from precondition audit)
impact:   FINAL_HOLD_AND_FUTURE_GO_REGISTRY active items 未解消
mitigation: human review session (tk) で active items を review/close
resolution: tk がレビューセッションを実施して全 active items に判断
note:     LMO session と同時に実施可能
```

### BLOCKER-006: LMO Session 未実施

```text
status:   OPEN
impact:   A-limited operation の継続確認が未完了
mitigation: A-limited operation period + session log
resolution: LMO session 実施 + evidence
note:     Phase 5 の主要要件
```

---

## Important Gaps (productionReady の前提として推奨)

### GAP-01: Kill switch 未実装

```text
impact:   execution enabled の前提条件
status:   HOLD (EXE-01)
```

### GAP-02: Incident response drill 未実施

```text
impact:   productionReady の推奨前提
status:   HOLD (PRD-04)
```

### GAP-03: Rollback drill 未実施

```text
impact:   productionReady の推奨前提
status:   HOLD (PRD-05)
```

### GAP-04: Live IPC integration test 未整備

```text
impact:   test coverage のギャップ
status:   OPEN (BLOCKER-TEST-01 from precheck)
```

---

## Resolved Blockers (今日まで)

```text
BLOCKER-RUNTIME-01: Runtime observation (AT-14/AT-15 PASS → PARTIALLY RESOLVED)
OB-01:   One-shot local write PASS
DIS-01:  Read-only intake PASS
DIS-03:  One-shot reply PASS
SC-FACE-05: Display-only test PASS
```

---

## Resolution Order

```text
1. BLOCKER-004 (XS-AUTO-03) — 最低リスク / 先行
2. BLOCKER-002 (CC-03) — 中リスク / 先行
3. BLOCKER-001 (HB-01) — 中高リスク
4. BLOCKER-003 (XACC-01) — 最高リスク / 判断のみでもOK
5. BLOCKER-005 + BLOCKER-006 — 人間レビュー / LMO
6. GAP-01 (Kill switch) — execution enabled 直前
```
