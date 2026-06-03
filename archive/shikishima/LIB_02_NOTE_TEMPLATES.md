# LIB-02 Note Templates

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** DESIGN — templates only, no Obsidian files created

---

## Template 1: Research Note

Folder: `10_Research/`
Naming: `YYYY-MM-DD_<topic>.md`

```markdown
---
id: research-YYYY-MM-DD-<slug>
type: research
status: PASS / HOLD / NOTE
gate: <gate-id>
date: YYYY-MM-DD
source: x_search / web / internal
related_commit:
productionReady: false
execution: disabled
rawValuesReported: false
level5: HOLD
---

# <Title>

## Summary

## Shikishima Relevance

## GO / HOLD / REJECT

## Evidence

## Next Action
```

---

## Template 2: Development Note

Folder: `20_Development/`
Naming: `YYYY-MM-DD_<task-id>_<subject>.md`

```markdown
---
id: dev-YYYY-MM-DD-<task-id>
type: development
status: COMPLETE / IN_PROGRESS / HOLD
date: YYYY-MM-DD
worker: ClaudeCode / Codex / human
commit:
typecheck: PASS / FAIL / not_run
eslint: clean / warnings / errors
productionReady: false
execution: disabled
rawValuesReported: false
push: not_performed / performed
---

# <Task Title>

## Objective

## Changed Files

## Result Summary

## Safety Check

- [ ] source_changed: display-only only
- [ ] package_changed: false
- [ ] token_created: false
- [ ] external_api_write: false
- [ ] git_push_performed: false

## Next Action
```

---

## Template 3: Evidence Note

Folder: `30_Evidence/`
Naming: `YYYY-MM-DD_<gate-id>_EVIDENCE.md`

```markdown
---
id: evidence-YYYY-MM-DD-<gate-id>
type: evidence
gate: <gate-id>
status: PASS / HOLD / STOP
date: YYYY-MM-DD
confirmed_by: tk
productionReady: false
execution: disabled
rawValuesReported: false
---

# <Gate> Evidence — <PASS/HOLD/STOP>

## Scope

## Verified

## Safety

```yaml
docs_only:           true/false
source_changed:      true/false
token_created:       false
external_api_write:  false
git_push:            not_performed/performed
productionReady:     false
execution:           disabled
rawValuesReported:   false
```

## Human Sign-off

Reviewer:
Date:
Decision:
```

---

## Template 4: Decision Note

Folder: `40_Decisions/`
Naming: `YYYY-MM-DD_<decision-id>_DECISION.md`

```markdown
---
id: decision-YYYY-MM-DD-<slug>
type: decision
status: GO / HOLD / DEFER
date: YYYY-MM-DD
decided_by: tk
productionReady: false
execution: disabled
rawValuesReported: false
---

# Decision: <Subject>

## Context

## Options Considered

## Decision

## Rationale

## Scope

## Does NOT approve

## Next Action
```

---

## Template 5: Handoff Note

Folder: `60_Handoffs/`
Naming: `YYYY-MM-DD_HANDOFF_<target>.md`

```markdown
---
id: handoff-YYYY-MM-DD-<target>
type: handoff
target: ClaudeCode / Codex / human / next_session
date: YYYY-MM-DD
origin_main:
commits_ahead:
productionReady: false
execution: disabled
rawValuesReported: false
---

# Handoff — <Target> — <Date>

## Current State

## Completed This Session

## Pending (HOLD)

## Next Session First Actions

## Task Prompts

### ClaudeCode

### Codex

## Forbidden (remains HOLD)

## Safety
```

---

## rawValues Policy for All Templates

```text
FORBIDDEN in any template field:
  - token / password / secret / API key
  - raw local IP address
  - raw local-only path (e.g. C:\Users\...)
  - personal identifiers of third parties
  - Discord / X authentication data
```

If a value must be referenced, use a redacted placeholder:
```text
commit: <hash>  ← OK (public)
token: [redacted]  ← if ever needed
local_path: [local-only]  ← never log raw
```
