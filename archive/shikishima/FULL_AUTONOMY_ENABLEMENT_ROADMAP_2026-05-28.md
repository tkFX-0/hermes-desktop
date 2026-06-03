# Full Autonomy Enablement Roadmap — 2026-05-28

## Purpose

Turn each **「まだできない／別GOが要る」** item into an **ordered task chain**.  
Agent may advance **prep / docs / tests / dry-run** without GO.  
**External send, wall-clock Burn-in, flag ON, git push** always need explicit **許可GO**.

## Current baseline

| Item | Status |
|------|--------|
| Autonomy level (code) | **6** — Limited Autonomous Exec |
| Voice pilot | **PASS** (one-shot, human audible) |
| Burn-in | **Not started** (order: 15m smoke → 2h) |
| Level 8 | **Not declared** |
| `execution` | **disabled** (invariant until separate constitutional GO) |
| `productionReady` | **false** (invariant until separate constitutional GO) |

---

## Master order (do not skip gates)

```text
Track A — Evidence & gates (unblocks Level 8 declaration)
  A1 → A2 → A3 → A4

Track B — External voice (each needs its own GO)
  B1 → B2 → B3

Track C — Hermes always-on voice (after B or parallel prep)
  C1 → C2 → C3

Track D — Constitutional (never auto; human only)
  D1 git push
  D2 execution / productionReady ON
  D3 “人間確認なし完全自律” 宣言
```

Tracks **B** and **C** may run **prep** in parallel with **A**; **runtime send** must not start before the matching **許可GO**.

---

## Track A — Level 8 prerequisites

### A1 — 15-minute smoke Burn-in

| | |
|---|---|
| **Status** | **PASS** (2026-05-28) — see `FULL_AUTONOMY_BURN_IN_SMOKE_15M_EVIDENCE.md` |
| **Goal** | Runaway / leak / retry detection without sends |
| **Human GO required** | Done (`A1からGO`) |
| **Pass** | Zero STOP, zero raw leak, zero unapproved write, 15 ticks all pass |
| **Next** | Track **A2** (2h) |

### A2 — 2-hour Burn-in

| | |
|---|---|
| **Status** | **PASS** (2026-05-28, 120 ticks, exit 0) |
| **Evidence** | `FULL_AUTONOMY_BURN_IN_2H_EVIDENCE.md` |
| **Next** | Track **A4** (FA-12 / Level 8 declaration GO) |

### A3 — Acceptance matrix FA-07..11 → PASS

| | |
|---|---|
| **Agent without GO** | Done-criteria text, tests, dry-run evidence in docs |
| **Human GO required** | **Review GO** per FA row if criteria need human sign-off |
| **Blocks** | Level 8 until `acceptanceAllPass` |

### A4 — FA-12 final acceptance + Level 8 declaration

| | |
|---|---|
| **Status** | **DONE** (2026-05-28, pilot scope) |
| **Evidence** | `FULL_AUTONOMY_LEVEL_8_DECLARATION_2026-05-28.md` |
| **Note** | `execution` / `productionReady` remain OFF |

---

## Track B — Discord & StackChan voice

### B0 — Already done

- StackChan one-shot voice pilot PASS
- `discord-secretary-voice-bridge.ts` exists (default HOLD)

### B1 — Discord → StackChan **one-shot** (guarded)

| | |
|---|---|
| **Status** | **PASS** (2026-05-28) — `FULL_AUTONOMY_B1_DISCORD_STACKCHAN_VOICE_EVIDENCE.md` |
| **Human GO** | Done (`B1にA2`) |
| **Still HOLD after** | Auto-send (B2), production voice loop (B3) |

### B2 — Discord **auto** send / secretary loop

| | |
|---|---|
| **Status** | **PASS** (2026-05-28, 3 cycles, 30s cooldown) |
| **Evidence** | `FULL_AUTONOMY_B2_DISCORD_SECRETARY_EVIDENCE.md` |

### B3 — StackChan **continuous** production voice

| | |
|---|---|
| **Status** | **PASS** (2026-05-28, 3 phrases, 30s cooldown) |
| **Evidence** | `FULL_AUTONOMY_B3_STACKCHAN_VOICE_LOOP_EVIDENCE.md` |
| **Note** | Bounded pilot loop; not 24/7; `productionReady` still false |

---

## Track C — Hermes startup / Shadow / SideBot voice

### C1 — Design parity + env contract

| | |
|---|---|
| **Unblocks** | Clear path: Hermes TTS ≠ StackChan PCM path |
| **Agent without GO** | Docs alignment (`STACKCHAN_VOICE_CODEX_DESIGN_ALIGNMENT_REVIEW.md`), env table |
| **Human GO required** | No |

### C2 — Shadow / SideBot **one-shot** voice on Hermes start

| | |
|---|---|
| **Status** | **PASS** (2026-05-28) |
| **Evidence** | `FULL_AUTONOMY_C2_HERMES_SHADOW_VOICE_EVIDENCE.md` |

### C3 — Hermes **常時**音声 (bounded)

| | |
|---|---|
| **Status** | **PASS** (2026-05-28, 3 cycles) |
| **Evidence** | `FULL_AUTONOMY_C3_HERMES_SHADOW_VOICE_EVIDENCE.md` |
| **Note** | `SIDEBOT_HOLD` still on for real bot auto-start |

---

## Track D — Constitutional (never automated)

| Task | What | Human GO |
|------|------|----------|
| **D1** | `git push` | **Always** explicit per push |
| **D2** | `execution: enabled` | **Always** separate constitutional GO |
| **D3** | `productionReady: true` | **Always** separate; after A4 + ops sign-off |
| **D4** | Remove `humanGoApprovalRequired` | **Policy change** — not planned in pilot |

**Agent will not flip D1–D4 without your exact phrase.**

---

## Quick reference — blocked item → track

| できないこと | Track | First GO task |
|--------------|-------|----------------|
| Discord 自動発話・自動送信 | B2 | B1 first |
| StackChan 喋り続け | B3 | B1 + A1 recommended |
| Hermes 起動だけで常時音声 | C3 | C2 first |
| git push | D1 | Each push |
| 本番フラグ ON | D2/D3 | After A4 |
| 人間確認なし完全自律 | A4 + D3 | FA-12 + Burn-in |

---

## What the agent can do **now** (no GO)

1. Burn-in evidence templates + monitor checklist (A1 prep) — **done**: `FULL_AUTONOMY_BURN_IN_PLAN_2026-05-28.md`
2. FA-07..11 done-criteria drafts + unit tests (A3 prep)
3. Discord/StackChan operator one-shot guide (B1 prep)
4. Shadow voice env contract doc (C1 prep)
5. Run `runFullAutonomyPipeline({ voicePass: true, ... })` — **no send**

---

## Suggested next human action (pick one)

```text
許可GO。15分 smoke Burn-in を送信なし・execution=disabled のまま開始してください。
```

or (if you want Discord before long Burn-in):

```text
許可GO。Discord→StackChan 音声 1回のみ。人間同席・手動停止確認済み。
```

---

## Related docs

- `FULL_AUTONOMY_BURN_IN_PLAN_2026-05-28.md`
- `FULL_AUTONOMY_REVIEW_2026-05-28.md`
- `STACKCHAN_RESUME_NEXT_STEPS.md`
- `STACKCHAN_REAL_DEVICE_GO_OPERATOR_GUIDE.md`
- `EXPLICIT_PERMITTED_GO_POLICY.md`
