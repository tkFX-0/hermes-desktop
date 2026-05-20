# LIB-03 Obsidian Local Write Gate (OB-01)

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** HOLD — OB-01 gate not yet issued
**gate:** explicit ob01_local_write_go required

---

## Summary

HOLD until OB-01 explicit GO.

When OB-01 is issued, Shikishima may write to one approved Obsidian vault folder.
Phase 1-2 (manual/copy-only) must succeed first.

---

## Prerequisite Phases

Before OB-01 can open:

```text
Phase 1: vault created by human, files added manually — must be complete
Phase 2: Shikishima generates Markdown, human saves — must be verified
Phase 3: OB-01 gate GO — allows direct local write to approved folder only
```

---

## Allowed After OB-01 GO

```text
- write to one approved vault folder only (e.g. shikishima-library/30_Evidence/)
- approved note types only (Evidence / Handoff / Research)
- one write per explicit GO or per approved write session
- rawValues check before every write
```

---

## Forbidden (always)

```text
- write to vault root
- write to folders not in approved list
- write token / password / secret / API key
- write raw local IP or local-only path
- write personal identifiers of third parties
- overwrite existing notes without human approval
- delete vault files
- rename vault structure
- write executable code or scripts into vault
```

---

## Required GO Fields

```text
ob01_local_write_go:
  date:
  time_window_jst:
  vault_path:              (exact local path to approved folder)
  allowed_folders:         (e.g. 30_Evidence/ only)
  allowed_note_types:      (Evidence / Handoff / Research)
  note_template:           (which template from LIB_02)
  rawValues_check:         true
  stop_if:
  evidence_file:
```

---

## rawValues Pre-Write Checklist

Before every write to Obsidian:

- [ ] token: not present in content
- [ ] password: not present
- [ ] secret / API key: not present
- [ ] raw local IP: not present
- [ ] raw local-only path (C:\Users\...): not present
- [ ] personal PII of third parties: not present
- [ ] Discord / X auth data: not present

If any check fails: STOP, do not write.

---

## STOP Conditions

```text
STOP if:
- vault_path is not confirmed to exist
- approved folder is not accessible
- rawValues pre-write check fails
- write would overwrite without approval
- write scope expands beyond approved folders
- error occurs during write
- productionReady true appears
- execution enabled appears
```

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
obsidian_connected: false
local_write:        HOLD
ob01_go_issued:     false
```
