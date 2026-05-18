# AT-04 Visual Recheck GO Package

## Document Status

```
date:            2026-05-19
status:          GO package — runtime approval NOT yet issued
baseline_commit: c214819 == origin/main
runtime_started: false
```

---

## Purpose

Define the conditions, scope, and checklist for the AT-04 runtime visual recheck.
This document is NOT itself a runtime GO. Runtime requires a separate explicit human GO
with date, time_window, and approved command.

---

## Current Baseline

```
branch:          main
head:            c214819
origin_main:     c214819
commits_ahead:   0
staged:          0
tracked_dirty:   0
```

---

## Visual Recheck Target

The following changes are confirmed pushed and pending visual review:

| Commit | Subject |
|---|---|
| c214819 | feat: refine pixel ghost visual alignment |
| 3d99293 | feat: replace CSS ghost placeholder with inline SVG characters (AT-03) |
| f89e107 | docs: record AT-08 Agent Theater runtime recheck evidence (PASS) |

**AT-04 key change**: `GhostSvg.tsx` — refined inline SVG characters with:
- Improved headset/mic boom (しきしま)
- Safety helmet + HOLD sign (しずめ)
- Folded map + route + thinking bubble (はじめ)
- Construction helmet ridges + toolbox + wrench (つむぎ)
- Headphones + logbook + bookmark (しるべ)

---

## Runtime GO Requirements

This document is NOT a runtime GO. Runtime requires ALL of the following to be explicitly provided by the human:

```
date:              (human provides)
time_window:       HH:MM-HH:MM JST (human provides)
approved_command:  npm run dev
shutdown_method:   taskkill /F /IM electron.exe OR Ctrl+C
observer:          human (visual, PC)
```

---

## During Runtime — Forbidden

```
- source code edits
- image asset additions
- OAuth login
- Hermes run
- x_search execution
- external API calls
- git push
- reading or printing tokens
- staging untracked image files
```

---

## After Shutdown — Required Checks

```
- port 3030 closed
- staged: 0
- tracked_dirty: 0 (unless evidence doc is intentionally created after observation)
- productionReady: false
- execution: disabled
- rawValuesReported: false
```

---

## Reference

- Checklist: `AT_04_VISUAL_RECHECK_CHECKLIST.md`
- Evidence template: `AT_04_VISUAL_RECHECK_EVIDENCE_TEMPLATE.md`

---

_Created: 2026-05-19_
_productionReady: false_
_execution: disabled_
