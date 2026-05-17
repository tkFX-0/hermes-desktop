# Limited Manual Operation — STOP and Incident Playbook

## STOP Triggers

```
STOP immediately if:
1. Raw value exposure: Windows path / LAN IP / API key / token visible in UI
2. productionReady: true appears
3. execution: enabled appears
4. Any external send/create/push/pay/reserve action succeeds
5. StackChan physical operation becomes active
6. Voice / camera / mic becomes active
7. Runtime cannot be stopped (Ctrl+C fails within 30s)
8. Port 3030 remains open after shutdown
9. Tracked git file becomes dirty during session
10. Unexpected network connection detected
```

## Immediate STOP Procedure

```
1. Press Ctrl+C in terminal
2. If no response within 10s: taskkill /F /IM electron.exe (Windows)
3. Verify port 3030 closed
4. Run git status --short — record dirty files (do NOT auto-commit)
5. Record: time, trigger, what was observed
6. Do not push without human review
7. Create STOP record file
```

## STOP Record File

Create: `docs/shikishima/LMO_STOP_RECORD_[YYYY-MM-DD].md`

```
date:           [YYYY-MM-DD]
time:           [HH:MM JST]
session_number: [N]
trigger:        [exact condition]
stop_method:    Ctrl+C / taskkill
process_stopped: yes / no
port_3030_after: closed / open
git_dirty:      [list or NONE]
raw_values:     [description or NONE]
external_action: [description or NONE]
next_action:    await human review
```

## Incident Levels

```
LEVEL-1 (Minor):
  - Cosmetic issue or unexpected layout
  - No safety invariant violated
  - Action: note in session log, continue or end session

LEVEL-2 (Caution):
  - Unexpected data appears (but no raw value)
  - STALE state not triggering when expected
  - Action: end session, record, human review before next session

LEVEL-3 (STOP):
  - Any item in STOP Triggers list
  - Action: immediate STOP, no further operation until human clears

LEVEL-4 (Critical):
  - External action appears to have executed
  - productionReady: true observed
  - Raw credentials exposed
  - Action: immediate STOP, human must review all logs before any next action
```

## Rollback Procedure (if tracked files were modified)

```
Only after human GO:
1. git diff (review what changed)
2. If modification is safe: git checkout -- <file> (restore)
3. If modification is unknown: STOP and report to human
4. Do NOT git reset --hard without explicit human instruction
```

## Post-Incident Requirements

```
[ ] STOP record file created
[ ] Human notified
[ ] No further sessions until human clearance
[ ] Root cause identified
[ ] Fix documented before resuming
```

---

_Created: 2026-05-17_
_productionReady: false_
_execution: disabled_
