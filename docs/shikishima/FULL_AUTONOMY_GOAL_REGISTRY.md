# Full Autonomy Goal Registry

Date: 2026-05-28  
Mode: **Goal-based completion** (not section-by-section)

Parent goal: `shikishima.full-autonomous-operation` → Level 8 (long-term)

---

## Completion Rule

```text
A goal is COMPLETED only when ALL done criteria pass and evidence exists.
Sub-goals must COMPLETE before parent advances.
Do NOT mark parent COMPLETED when only a design section is written.
```

---

## Goal Tree

| Goal ID | Status | Depends on |
|---------|--------|------------|
| `shikishima.full-autonomous-operation` | IN_PROGRESS | Phase 1–10 |
| `shikishima.phase1.voice-completion` | **IN_PROGRESS** | G2 HOLD blocks parent |
| `shikishima.phase1.voice-evidence-push` | **IN_PROGRESS** | push this run |
| `shikishima.phase1.voice-one-shot-pilot` | **HOLD** | ws_or_pcm_failed |
| `shikishima.phase1.voice-acceptance` | **PENDING** | G2 PASS + human visual |
| `shikishima.full-autonomy-unified-design-package` | **COMPLETED** | — |
| `shikishima.stackchan.voicevox-readiness-check` | **COMPLETED** | — |

---

## Phase 1 — Voice Completion (active)

### G1: `shikishima.phase1.voice-evidence-push`

```text
Done when:
- origin/main includes b6abde8 (full autonomy design)
- origin/main includes VOICEVOX readiness + motion visual docs if committed
- working_tree clean
```

### G2: `shikishima.phase1.voice-one-shot-pilot`

```text
Done when:
- one guarded voice send attempted (STACKCHAN_VOICE_PILOT_ACK)
- evidence updated (PASS | HOLD)
- no second send
```

### G3: `shikishima.phase1.voice-acceptance`

```text
Done when:
- human visual PASS recorded OR explicit HOLD
- STACKCHAN_VOICE_PILOT_ACCEPTANCE.md exists
```

### Parent G0: `shikishima.phase1.voice-completion`

```text
Done when: G1 + G2 (PASS) + G3 COMPLETED
```

---

## Future phases (not started)

```text
shikishima.phase2.unified-state-snapshot
shikishima.phase3.unified-output-policy
...
```

See `FULL_AUTONOMY_ROADMAP.md`.
