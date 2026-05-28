# Full Autonomy Safety Governor Specification

Date: 2026-05-28  
Status: DESIGN (align with `shizume` / ichikishima zone)

---

## API (target)

```typescript
classifyAction(intent): RiskClass
evaluateRisk(context): RiskDecision
requireHumanGo(action): boolean
enforceCooldown(routeId): CooldownResult
blockRawLeak(payload): SanitizedPayload
preventRetryLoop(session): boolean
restoreHold(routeId): void
```

## States

```text
READY | BUSY | COOLDOWN | DEGRADED | BLOCKED | FAILED | NEEDS_HUMAN
```

## Decision Flow

```text
Intent → Preflight → classifyAction → evaluateRisk
  → if requireHumanGo → NEEDS_HUMAN (no execute)
  → if BLOCKED → STOP
  → if allowed scope → Executor (adapter) → Evidence → restoreHold
```

## Non-negotiable

```text
- shizume HOLD cannot be overridden by shikishima/tsumugi
- STOP > HOLD > ALLOW
- retry_loop: false by default
- rawValuesReported: false in all evidence
```

## Mapping to existing code

| Spec | Current |
|------|---------|
| route guard | `stackchan-*-route`, `evaluateStackChanActiveControlRoute` |
| zone blocks | `ichikishima/autonomy-zone` execute/network/git |
| human gate | GO markdown + ledger |

Phase 2+ で `ShikishimaUnifiedStateSnapshot` と統合予定。
