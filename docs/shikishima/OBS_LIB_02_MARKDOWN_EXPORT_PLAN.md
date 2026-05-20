# OBS-LIB-02 Markdown Export Plan

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** IMPLEMENTED — generateMarkdown() generates preview in memory

---

## Frontmatter Schema

```yaml
---
id:              <category>-<date>-<slug>
type:            research / development / evidence / decision / handoff
status:          draft / ready / dry_run / exported / failed / hold
date:            YYYY-MM-DD
related_gate:    <gate-id> (optional)
related_commit:  <hash> (optional)
source:          x_search / runtime / internal (optional)
tags:            [tag1, tag2]
productionReady: false
execution:       disabled
rawValuesReported: false
level5:          HOLD
---
```

## Body Template

```markdown
# Title

## Summary

## Main Points

## Shikishima Relevance

## Evidence / Notes

## GO / HOLD / DEFER

## Next Action

## Safety

- productionReady: false
- execution: disabled
- rawValuesReported: false
```

---

## Supported Categories

| Category | Folder | Naming |
|---|---|---|
| research | 10_Research/ | YYYY-MM-DD_<slug>.md |
| development | 20_Development/ | YYYY-MM-DD_<task-id>_<slug>.md |
| evidence | 30_Evidence/ | YYYY-MM-DD_<gate-id>_EVIDENCE.md |
| decision | 40_Decisions/ | YYYY-MM-DD_<slug>_DECISION.md |
| handoff | 60_Handoffs/ | YYYY-MM-DD_HANDOFF_<target>.md |

---

## rawValues Safety Rules

Markdown must NOT contain:
```text
token / password / secret / API key
raw local IP address
raw local-only path (e.g. C:\Users\...)
personal PII of third parties
Discord / X authentication data
```

---

## Implementation Status

```yaml
generateMarkdown():   IMPLEMENTED (libraryExportTemplates.ts)
generateFilename():   IMPLEMENTED
preview_in_memory:    IMPLEMENTED (LibraryMarkdownPreview.tsx)
actual_file_write:    HOLD (OB-01 gate)
```
