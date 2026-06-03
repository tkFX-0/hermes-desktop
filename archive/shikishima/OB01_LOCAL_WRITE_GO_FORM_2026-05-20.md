# OB-01 Local Write GO Form

**date:** 2026-05-20
**status:** AWAITING HUMAN GO — fill all fields and return as GO message
**worker:** ClaudeCode (will execute after GO)

---

## What this GO enables

- `OB01_DRY_RUN` を `false` に変更
- `shikishima-library/30_Evidence/` へのファイル書き込みを有効化
- LibraryMarkdownPreview の "Export dry-run" ボタンが実際の書き込みになる

## What this GO does NOT enable

```text
- DIS01_HOLD=false (Discord read は別GO)
- 30_Evidence/ 以外のフォルダへの書き込み
- productionReady=true
- execution=enabled
- vault root raw pathの表示
- 外部API
- git push (別GO)
```

---

## GO Form Template — copy, fill, and return

```text
ob01_local_write_go:
  date:                2026-05-20
  time_window_jst:     [例: 23:00-23:30]
  vault_path:          [記入不要 — shikishima-library/30_Evidence/ 固定]
  allowed_folders:     30_Evidence/ only
  allowed_note_types:  Evidence / Handoff / Research / Development
  note_template:       libraryExportTemplates.ts (generateMarkdown)
  rawValues_check:     true
  stop_if:             token appears / path outside 30_Evidence/ / overwrite confirmed
  evidence_file:       docs/shikishima/OB01_WRITE_EVIDENCE_2026-05-20.md
```

---

## Implementation after GO

ClaudeCode が実行する変更:

```typescript
// src/main/library-export.ts — line 17
// Before:
const OB01_DRY_RUN = true;
// After:
const OB01_DRY_RUN = false;
```

変更後:
- typecheck:node 確認
- commit: `fix(ob01): enable local write — OB-01 GO authorized`
- push: 別途 push GO が必要

---

## Path safety (変更なし)

```text
VAULT_ROOT:   homedir()/Desktop/プロジェクトファイル/shikishima-library
ALLOWED_ROOT: VAULT_ROOT/30_Evidence/
containment:  normalize(join(ALLOWED_ROOT, filename)).startsWith(ALLOWED_ROOT + sep)
filename_check: /[/\\]/.test(filename) → reject / must end with .md
```

---

## Safety after GO

```yaml
OB01_DRY_RUN:       false (GOにより変更)
DIS01_HOLD:         true (変更なし)
productionReady:    false
execution:          disabled
rawValuesReported:  false
vault_path_shown:   false (redactedPath のみ返却)
```
