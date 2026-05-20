# OBS-LIB-01 Local Vault Connection Plan

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** DESIGN — path policy defined, no connection
**gate:** OB-01 local write gate HOLD

---

## Local Folder Path Policy

```text
vault_root:  local filesystem only (e.g. C:\...\shikishima-library)
display:     always redacted — show "...\shikishima-library" only
log:         never write raw path to evidence, screenshots, or chat
cloud_sync:  disabled (never Obsidian Sync, Google Drive, Dropbox)
```

## Redacted Path Display

Raw path must not appear in:
- UI labels
- evidence files
- GitHub docs
- screenshots
- logs

Use redacted form: `...\shikishima-library` or `[library root]`

---

## Folder Structure (already created)

```text
shikishima-library/
  00_Inbox/
  10_Research/
  20_Development/
  30_Evidence/
  40_Decisions/
  50_Gates/
  60_Handoffs/
  70_Daily_Logs/
  80_Post100/
  90_Archive/
  _templates/
  _index.md
```

## Local Write Gate

```yaml
localWriteEnabled:  false  (typed as literal false)
dryRunOnly:         true   (typed as literal true)
```

Local write is enabled only after explicit `ob01_local_write_go`.

## Validation Rules

Before any write (future):
1. target path must be inside vault_root
2. folder must be in approved folder list
3. file must use approved naming: `YYYY-MM-DD_<slug>.md`
4. rawValues pre-write check must pass (no tokens/secrets/raw paths)
5. overwrite protection: use unique filename or fail

## No Cloud Sync

```text
FORBIDDEN:
  Obsidian Sync
  iCloud Drive
  Google Drive sync
  Dropbox
  OneDrive
  any cloud storage
```

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
local_write:        HOLD
cloud_sync:         disabled
```
