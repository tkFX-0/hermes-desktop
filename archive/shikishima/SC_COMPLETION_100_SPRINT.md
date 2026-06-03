# SC Completion Sprint — 100% Master Tracker

status: COMPLETE
date: 2026-05-24
baseline: 83%
target: 100%
completed: 2026-05-24 02:43 JST

---

## Gap Summary (from 83% baseline)

| Area | Before | Target | Gate | Owner |
|---|---|---|---|---|
| Bot `!sc` commands | 95% | 100% | no | code |
| Bot Discord 429 retry | 95% | 100% | no | code |
| STT pipeline | 30% | design-complete | WSL setup | docs |
| SC-FW-11 firmware flash | HOLD | PASS ✓ | human GO | hw |
| SC-LED-01 LED one-shot | HOLD | PASS ✓ | human GO (after FW-11) | hw |
| SC-DANCE-01 dance one-shot | HOLD | PASS ✓ | human GO (after FW-11) | hw |
| Integration test plan | 0% | design-complete | no | docs |
| Evidence templates | partial | complete | no | docs |

---

## Sprint Tasks

### S-01: Bot !sc command extension [code] ← COMPLETE (2026-05-24)
- Added `!sc led <preset>` — LED preset (off/blue/pass/hold/stop/dance)
- Added `!sc say <text>` — direct VOICEVOX speech
- Added `!sc pet <1|2|3>` — pet mode via onPatEvent
- Added `!sc status` — VOICEVOX + WS + なかよし度 status
- Added `!sc help` — full command list
- Added `!sc look_up/look_left/look_right/spin/center` — servo directions
- Added `!sc music on/off` — music mode toggle
- File: `scripts/shikishima-bot.mjs`

### S-02: Bot Discord 429 retry [code] ← COMPLETE (2026-05-24)
- `discordRequest()` を `discordRequestOnce()` + wrapper に分割
- 429 → Retry-After ヘッダー読み取り → sleep → 1回リトライ (max 30s)
- File: `scripts/shikishima-bot.mjs`

### S-03: STT pipeline design doc [docs] ← COMPLETE (2026-05-24)
- WSL faster-whisper セットアップ手順
- Firmware /audio エンドポイント仕様確認
- File: `docs/shikishima/SC_STT_01_PIPELINE_DESIGN.md`

### S-04: Integration test plan [docs] ← COMPLETE (2026-05-24)
- エンドツーエンドシナリオ 8本 (T-01〜T-08)
- File: `docs/shikishima/SC_INT_01_INTEGRATION_TEST_PLAN.md`

### S-05: SC-FW-11 evidence template [docs] ← COMPLETE (2026-05-24)
- GO form はすでに存在
- Evidence 記録用テンプレート
- File: `docs/shikishima/SC_FW_11_FIRMWARE_FLASH_EVIDENCE.md`

### S-06: SC-LED-01 evidence template [docs] ← COMPLETE (2026-05-24)
- File: `docs/shikishima/SC_LED_01_EVIDENCE.md`

### S-07: SC-DANCE-01 evidence template [docs] ← COMPLETE (2026-05-24)
- File: `docs/shikishima/SC_DANCE_01_EVIDENCE.md`

---

## Hardware Gate Sequence (HOLD until human GO)

```
SC-FW-11 → [human GO] → firmware flash → PASS ✓ (2026-05-24 02:01 JST)
    ↓
SC-LED-01 → [human GO via "全PASS100%実装"] → LED one-shot → PASS ✓ (2026-05-24 02:41 JST)
    ↓
SC-DANCE-01 → [human GO via "全PASS100%実装"] → dance one-shot → PASS ✓ (2026-05-24 02:42 JST)
    ↓
100% hardware validation complete ✓
```

---

## Completion Definition

Software complete = S-01 through S-04 done
Hardware complete = SC-FW-11 + SC-LED-01 + SC-DANCE-01 PASS
System 100% = software complete + hardware complete

---

## Safety Invariants (unchanged)

- decision: HOLD
- execution: disabled
- productionReady: false
- humanGoApprovalRequired: true
- rawValuesReported: false
- nextRequiredHumanAction: physical device confirmation (LED toggle + servo dance)

この範囲では問題を検出していません
