# Phases 1–7 Implementation Evidence

Date: 2026-05-26  
Status: **IMPLEMENTATION (code + unit tests)** — Phase 1 device audible **still HOLD** until human visual

---

## Phase 1 — Voice Completion

| Item | Status |
|------|--------|
| Guarded speak protocol parity (`subtitle`, `nod`, extended WS frames ≥126B) | **DONE** (`stackchan-voice-guarded-speak.ts`) |
| One-shot pilot retry on device | **SENT** 2026-05-26 許可GO — transport ok; human **HOLD** (faint/muffled, VOICEVOX not intelligible on device) |
| Explicit Permitted GO policy | `docs/shikishima/EXPLICIT_PERMITTED_GO_POLICY.md` |
| `phase1.voice-acceptance` | **HOLD** |

Hypothesis addressed: PCM chunks (1920 bytes) require WebSocket extended length headers; missing `subtitle` may block speaker path on firmware.

---

## Phase 2 — Unified State Snapshot

| Deliverable | Location |
|-------------|----------|
| `ShikishimaUnifiedStateSnapshot` | `src/main/shikishima-full-autonomy/snapshot-types.ts` |
| Builder | `build-unified-snapshot.ts` |

---

## Phase 3 — Unified Output Policy

| Deliverable | Location |
|-------------|----------|
| Surface plans (stackchan/discord/electron/evidence) | `unified-output-policy.ts` |

---

## Phase 4 — Autonomous Proposal Engine

| Deliverable | Location |
|-------------|----------|
| Draft-only proposals (`execution: disabled`) | `proposal-engine.ts` |

---

## Phase 5 — Controlled Local Autonomous Work

| Deliverable | Location |
|-------------|----------|
| Bounded path evaluator | `local-autonomous-work.ts` |

---

## Phase 6 — External Action Controlled Autonomy

| Deliverable | Location |
|-------------|----------|
| Registry | `external-effect-registry.ts` |
| Evaluator (dry-run / HOLD gates) | `evaluate-external-effect.ts` |
| Safety governor | `safety-governor.ts` |

---

## Phase 7 — StackChan Secretary Mode

| Deliverable | Location |
|-------------|----------|
| Secretary session planner | `secretary-mode.ts` |
| Discord → voice bridge (default OFF) | `discord-secretary-voice-bridge.ts` |
| Env flag | `SHIKISHIMA_DISCORD_VOICE_BRIDGE=1` |

**Not wired** into `scripts/shikishima-bot.mjs` in this step — import bridge only when Phase 1 audible PASS + Phase 6 GO.

---

## Verification (this session)

```text
npm run test -- tests/hermes/zone/full-autonomy
npm run typecheck:node
```

Device send: **not performed** in this session.
