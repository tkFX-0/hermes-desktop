# Full Autonomy — /goal Definition Specification

Date: 2026-05-28

---

## Purpose

Cursor 内で `/goal` を定義し、自走完了まで一貫した完了判定を行うための規約。

---

## /goal Block Template

```markdown
# /goal shikishima.<goal-id>

## Summary
（1–2 文）

## Autonomy Level
（0–8 from FULL_AUTONOMY_LEVEL_MATRIX.md）

## Human GO Policy
- /goal まで: 全 GO（2026-05-28 運用）
- 本 goal 内 device/send/push: （明示 / 禁止）

## Scope
### Allowed
- 

### Forbidden
- 

## Entry Criteria
- 

## Done Criteria
- [ ] 
- [ ] evidence: `docs/shikishima/...`
- [ ] tests: typecheck + vitest PASS
- [ ] ledger updated
- [ ] safety invariants unchanged

## STOP Conditions
- raw value in diff
- test fail without fix scope
- human visual required → HOLD
- package.json change without approval

## Deliverables
| File | Action |
|------|--------|

## Next Goal
（完了後の 1 マクロのみ）
```

---

## goal-id 命名

```text
shikishima.<domain>.<action>

例:
shikishima.full-autonomy.unified-design-package
shikishima.stackchan.voice-one-shot-pilot-retry
shikishima.phase2.unified-state-snapshot
```

---

## 完了 vs HOLD vs STOP

| Status | 条件 |
|--------|------|
| **COMPLETED** | Done Criteria 全て + 検証実行済み |
| **HOLD** | 環境・GO・目視・VOICEVOX 等 |
| **STOP** | 安全違反・仕様曖昧・禁止領域侵入 |

---

## Ledger 更新

完了時 `AUTONOMY_GOAL_LEDGER.md`:

```text
active_goal: none | <next>
last_completed_goal: shikishima.<goal-id>
```

---

## Relation to /goalmacro

```text
/goalmacro = 実行手順書（Composer が読む）
/goal      = 完了定義（Cursor 内ゴールオブジェクト）
```

両方を同じ ID で揃える。
