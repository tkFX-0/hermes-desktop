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
| `shikishima.phase1.voice-completion` | **COMPLETED** | pilot scope; production voice remains separate GO |
| `shikishima.phase1.voice-evidence-push` | **COMPLETED** | origin @ 4f7566e |
| `shikishima.phase1.voice-one-shot-pilot` | **COMPLETED** | human audible PASS |
| `shikishima.phase1.voice-acceptance` | **COMPLETED** | `STACKCHAN_VOICE_PILOT_ACCEPTANCE_2026-05-28.md` |
| `shikishima.full-autonomy-unified-design-package` | **COMPLETED** | — |
| `shikishima.stackchan.voicevox-readiness-check` | **COMPLETED** | — |

---

## Phase 1 — Voice Completion (pilot completed)

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
- evidence updated (PASS)
- no second send
```

### G3: `shikishima.phase1.voice-acceptance`

```text
Done when:
- human audible PASS recorded
- STACKCHAN_VOICE_PILOT_ACCEPTANCE.md exists
```

### Parent G0: `shikishima.phase1.voice-completion`

```text
Done when: G1 + G2 (PASS) + G3 COMPLETED
```

---

## Phases 2–7 (StackChan voice pilot PASS — implementation 2026-05-26/28)

| Goal ID | Status | Code |
|---------|--------|------|
| `shikishima.phase2.unified-state-snapshot` | IN_PROGRESS | `ledger-snapshot-bridge.ts` |
| `shikishima.phase3.unified-output-policy` | IN_PROGRESS | `output-policy-integration.ts` |
| `shikishima.phase4.autonomous-proposal-engine` | IN_PROGRESS | `proposal-registry-bridge.ts` |
| `shikishima.phase5.local-autonomous-work` | IN_PROGRESS | `local-work-dry-run.ts` |
| `shikishima.phase6.external-action-controlled` | IN_PROGRESS | `external-effects-dry-run.ts` |
| `shikishima.phase7.secretary-planner` | IN_PROGRESS | `secretary-planner-only.ts` |
| Orchestrator | — | `run-full-autonomy-cycle.ts` |

```text
Done criteria (code): tests/hermes/zone/full-autonomy/full-autonomy-integration.test.ts green
StackChan: voice pilot PASS; production/Discord voice send still HOLD
Evidence: docs/shikishima/PHASES_2_7_INTEGRATION_EVIDENCE.md
```

See `FULL_AUTONOMY_ROADMAP.md`, `FULL_AUTONOMY_STACKCHAN_DEFERRED.md`.
