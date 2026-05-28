# Full Autonomy Roadmap

Date: 2026-05-28  
Parent: `SHIKISHIMA_FULL_AUTONOMOUS_OPERATION_DESIGN.md`

---

## Phase 1: Voice Completion（直近）

| Step | Macro | Status |
|------|-------|--------|
| V0 | `full-autonomy-unified-design-package` | **DONE** (this package) |
| V0b | `voicevox-readiness-check` | PASS (local) |
| V1 | voicevox-readiness evidence commit/push | pending |
| V2 | `stackchan-voice-one-shot-pilot-retry` | pending GO+window |
| V3 | voice pilot acceptance | pending visual |

---

## Phase 2: Unified State Snapshot

Deliverables:

```text
ShikishimaUnifiedStateSnapshot (type spec)
StackChanStateSnapshot
ExternalEffectStateSnapshot
HumanGateStateSnapshot
ModelTraceSnapshot
```

Done when: 全サーフェスで同一 HOLD 理由が説明可能。

---

## Phase 3: Unified Output Policy

Done when: StackChan=短い / Discord=確認向け / Electron=詳細 / Evidence=完全。

---

## Phase 4: Autonomous Proposal Engine

Done when: next rally + GO draft 自動生成、**実行はしない**。

---

## Phase 5: Controlled Local Autonomous Work

Done when: docs/types/tests/ledger が bounded scope で自走。

---

## Phase 6: External Action Controlled Autonomy

Done when: read/write, draft/send, dry/actual が分離され after-action HOLD。

---

## Phase 7: StackChan Secretary Mode

Done when: 家側 AP として GO 確認・状態報告が guarded 経路のみ。

Includes: **Discord 受信文 → しきしま判断 → StackChan 読み上げ**（`SHIKISHIMA_DISCORD_STACKCHAN_VOICE_FUTURE_DESIGN.md`）。  
Not in scope until Phase 1 voice pilot audible PASS + Phase 6 Discord gates.

---

## Phase 8: Scheduler / Recovery

Done when: cooldown, max_attempts, degraded, manual override。

---

## Phase 9: Limited Burn-in

```text
2h / 6h / 24h / 3-day 候補
合格: no runaway, no raw leak, no unapproved write/push
```

---

## Phase 10: Full Autonomous Operation Acceptance

```text
FULL_AUTONOMY_OPERATION_ACCEPTANCE.md
FULL_AUTONOMY_BURN_IN_EVIDENCE.md
FULL_AUTONOMY_SAFETY_REVIEW.md
```

---

## Progress Tracking

更新先: `AUTONOMY_GOAL_LEDGER.md` active_goal + 本ファイル Step Status
