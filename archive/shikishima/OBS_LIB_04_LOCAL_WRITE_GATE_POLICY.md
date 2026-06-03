# OBS-LIB-04 Local Write Gate Policy

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** HOLD — local write gate not yet opened

---

## Gate State

```yaml
obsidian_local_write_enabled: false  (literal type — cannot be changed at runtime)
dryRunOnly:                   true   (literal type)
```

These are TypeScript literal types in `LibrarySettings`. No runtime override is possible.

---

## Dry-Run Mode (Current)

Allowed now:
- Markdown generation in memory
- Markdown preview in UI
- Report HTML/React preview in UI
- Dry-run output path display (redacted)
- Queue status display

Not allowed until OB-01 GO:
- Any file write to vault
- Any directory creation in vault
- Any file rename or delete in vault
- Any vault path access from main process

---

## Human GO Required

To open actual local write, user must issue `ob01_local_write_go` with:

```text
ob01_local_write_go:
  date:
  time_window_jst:
  vault_path:              (exact path — not shown in evidence)
  allowed_folders:         (e.g. 30_Evidence/ only)
  allowed_note_types:      (Evidence / Handoff / Research)
  note_template:           (from LIB_02)
  rawValues_check:         true
  stop_if:
  evidence_file:
```

---

## No Automatic Background Write

```text
FORBIDDEN:
  - automatic write on timer
  - write on app startup
  - write on tab switch
  - write loop
  - batch write without per-item confirmation
```

Every write requires explicit user action (button click or IPC call from human).

---

## Overwrite Prevention

```text
- use unique filename (YYYY-MM-DD_<slug> with timestamp suffix if collision)
- do not silently overwrite existing files
- on collision: fail and report, do not overwrite
```

---

## STOP Conditions

```text
STOP if:
  - raw path appears in evidence, chat, or logs
  - write target is outside vault_root
  - rawValues check fails before write
  - write loop starts
  - cloud sync starts unexpectedly
  - productionReady true appears
  - execution enabled appears
```

---

## Safety

```yaml
productionReady:         false
execution:               disabled
rawValuesReported:       false
local_write:             HOLD
automatic_write:         forbidden
background_write_loop:   forbidden
cloud_sync:              forbidden
```
