# Level 3 GO Wording Draft

## Document Status

```text
roadmapVersion: v3.15.0
status: go_draft — not approved
date_created: 2026-05-15
```

## This document does NOT approve Level 3.

Level 3 remains HOLD until all prerequisites are satisfied and this exact GO text is issued by the human.

---

## Prerequisites Before Issuing This GO

```text
[ ] B3 clean PASS 5/5 — all accepted
[ ] Human Review Decision Sheet for Level 3 — accepted
[ ] Level 3 scope document — reviewed and accepted
[ ] STOP conditions document — reviewed
[ ] Rollback plan — reviewed
[ ] Working tree: staged=0 / diff=0
[ ] No open security issues
```

---

## Level 3 Session GO Template

```text
I explicitly approve this one Level 3 controlled local operation session only.

Approved session:
shikishima-level3-session-YYYY-MM-DD-001

Approved time_window:
YYYY-MM-DD HH:MM-HH:MM JST

Approved purpose:
Level 3 controlled local operation — [specific purpose, one sentence].

Approved commands:
[exact command list — nothing implied]

Allowed scope:
[explicit list of what is allowed]

Forbidden scope:
- git push (without additional GO)
- productionReady true
- execution enabled beyond this session
- Level 4 / production
- robot motion
- voice activation
- deploy / Cloudflare
- raw values / secrets output

STOP immediately if:
- raw value or secret appears
- execution escapes approved scope
- unexpected network call
- robot motion triggers
- time_window expires
- any forbidden action is attempted

After session:
- Close app
- Record evidence
- Return to HOLD
- No further sessions without new GO
```

---

## Level 3 Safety Invariants

After any Level 3 session, these must still be true:

```text
decision: HOLD (return to HOLD after session)
execution: disabled (return to disabled after session)
productionReady: false (never changes)
rawValuesReported: false (always)
robotMotion: HOLD (separate approval)
Level 4+: not approved
```

---

この範囲では問題を検出していません
