# StackChan Display State Mapping

Date: 2026-05-28
Companion: `STACKCHAN_DISPLAY_ONLY_PREVIEW_SPEC.md`

---

| Shikishima State | StackChan Display Label | Face / Mood | Allowed? | Notes |
|------------------|-------------------------|-------------|:--------:|-------|
| FINAL_CORE_ACCEPTED | Core OK | calm / happy | yes | display-only |
| STACKCHAN_BASELINE_PASS | StackChan OK | happy | yes | display-only |
| SAFETY_READINESS_PREPARED | Safety Ready | calm | yes | display-only |
| HOLD | HOLD | neutral / caution | yes | display-only |
| PASS | PASS | happy | yes | display-only |
| STOP | STOP | alert | yes | display-only |
| WAITING_FOR_HUMAN | Human? | waiting | yes | display-only |
| NEEDS_HUMAN_GO | GO? | waiting / caution | yes | display-only |
| DISCORD_HOLD | Discord HOLD | neutral | yes | display-only |
| EXECUTION_DISABLED | Exec OFF | calm | yes | must remain true |
| PRODUCTION_READY_FALSE | Prod OFF | calm | yes | must remain true |

---

## Rules

```text
Display-only states must not trigger commands.
Display state changes must not send motion, voice, or external actions.
Unknown intents map to safe HOLD display (pure contract).
```

---

## Pure Contract

Implementation: `src/shared/stackchan-display-preview/stackchan-display-preview.ts`
