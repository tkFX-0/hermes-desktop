# Session-009 iPhone Observation — GO Draft
date: 2026-05-15
status: draft — NOT approved
note: This document does NOT approve Session-009.
      Session-009 requires Phase 2C complete + explicit human time_window GO.

---

## Prerequisites Before This GO May Be Issued

```
[ ] Phase 2B-1 IPC path complete and pushed
[ ] Phase 2B-2 localhost server module complete and pushed
[ ] Phase 2C same-LAN server with pairing token implemented and pushed
[ ] iPhone confirmed on same Wi-Fi network as Windows PC
[ ] iPhone Safari / PWA shows live redacted status (Phase 5 PASS)
[ ] dataSource = redacted_snapshot_phase2c_same_lan confirmed on iPhone
[ ] No raw values visible on iPhone
[ ] No token visible in iPhone display
[ ] Human is ready to observe iPhone screen (not PC screen)
[ ] Working tree: staged=0 / dirty=0
```

---

## Session-009 GO Template (not approved — fill in and issue to ClaudeCode)

```
I explicitly approve this one Level B3 daily operation session only.

Approved session:
shikishima-session-2026-05-15-009

Approved time_window:
2026-05-15 HH:MM-HH:MM JST

Approved purpose:
Level B3 clean B3 PASS #5 — iPhone Private Console real-status observation.
Confirm that the iPhone Private Console displays live redacted Shikishima
status without RustDesk, showing:
  decision = HOLD
  execution = disabled
  productionReady = false
  rawValuesReported = false
  Level 3 = not_approved

Observation surface: iPhone Safari / PWA
RustDesk required: false
PC visual observation required: false

Hard timing rule:
Server activation must not occur until at least +30 seconds
after the approved_window_start.

Required observation checks:
1. iPhone shows live status (dataSource = phase2c or live)
2. decision = HOLD visible on iPhone
3. execution = disabled visible on iPhone
4. productionReady = false visible on iPhone
5. rawValuesReported = false visible on iPhone (or "raw値: 非表示")
6. Level 3 = not_approved visible on iPhone
7. No raw values visible on iPhone screen
8. No pairing token visible on iPhone screen
9. No local-only values visible on iPhone screen
10. No execution buttons visible or enabled
11. No push button visible or enabled
12. No Level 3 approval button visible or enabled
13. Observation complete before time_window expires

STOP immediately if:
  - Raw value appears on iPhone screen
  - Token appears on iPhone screen
  - execution enabled appears
  - productionReady: true appears
  - deploy prompt appears
  - robot / voice / camera prompt appears
  - unexpected external operation appears
  - time_window expires before observation complete

After session:
  - Disable Phase 2C server (or leave enabled)
  - Record evidence
  - Return to HOLD
  - Do not approve Level 3 automatically
  - Push evidence docs after readiness check

Forbidden:
  - Level 3 approval
  - productionReady true
  - execution enabled
  - robot motion
  - voice activation
  - raw values output
  - git push without explicit push GO
```

---

## Success Classification

If all checks pass:
```text
result:             CLEAN_B3_PASS
session:            Session-009
observation_surface: iPhone
rustdesk_used:      false
clean_b3_pass:      5/5 candidate
```

---

## Evidence Doc Template

After PASS, create:
`docs/shikishima/LEVEL_B3_SESSION_009_IPHONE_EVIDENCE.md`

Contents:
```text
session:              shikishima-session-2026-05-15-009
result:               CLEAN_B3_PASS
date:                 2026-05-15
observation_surface:  iPhone Private Console (Safari/PWA)
rustdesk_used:        false
pc_visual_required:   false
time_window:          HH:MM-HH:MM JST
launch_time:          HH:MM:SS (must be +30s after window start)
decision_visible:     HOLD
execution_visible:    disabled
productionReady_visible: false
rawValuesReported_visible: false (or "non表示" shown)
level3_visible:       not_approved
dataSource:           redacted_snapshot_phase2c_same_lan
raw_values_visible:   false
token_raw_reported:   false
lan_ip_raw_reported:  false
```

---

この範囲では問題を検出していません
