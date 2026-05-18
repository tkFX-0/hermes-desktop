# Slot Worker Routing Design

## Document Status

```
date:            2026-05-18
status:          docs-only routing design
execution:       disabled
productionReady: false
```

---

## Purpose

Define the Slot-based worker assignment system for Shikishima.
Each Slot handles a specific work category. Workers (AI providers, tools, agents) are assigned to Slots.
No Slot activates a worker without an explicit GO.

---

## Slot Definitions

### SLOT-CONVERSE

```
purpose:         Primary conversation with the user / Shikishima personality response
candidate_worker: Grok-Hermes OAuth (primary, HOLD until GHG-03+)
                  Gemini Flash (fallback, HOLD until Gemini gate)
                  GPT / Claude (manual escalation, per-session GO)
allowed_actions:
  - chat message generation
  - context-aware response
  - reference current x_search digest if available (read-only)
  - draft suggestion for human review
forbidden_actions:
  - execute commands
  - push code
  - OAuth login
  - external write
required_GO:     GHG-05 minimum (chat-only dry run)
required_evidence: redacted provider status confirmed
STOP_conditions:
  - tool use triggered without tool GO
  - external write triggered
```

### SLOT-PLAN

```
purpose:         Task decomposition, next-step design, instruction parsing
candidate_worker: GPT / Claude (high quality)
                  Grok-Hermes OAuth (candidate)
allowed_actions:
  - analyze task request
  - produce structured plan
  - identify allowed files and commands
  - produce GO draft template
forbidden_actions:
  - execute any part of plan autonomously
  - modify source files
  - push
required_GO:     scoped per-task GO
```

### SLOT-SAFETY

```
purpose:         Safety invariant checking, HOLD/STOP/REJECT decisions
candidate_worker: しずめ rule-based checks (primary)
                  human review (always final decision)
                  GPT / Claude (for complex safety review, manual escalation only)
allowed_actions:
  - check productionReady / execution / rawValues invariants
  - verify redaction boundary
  - check for forbidden patterns in output
  - raise HOLD / STOP if triggered
forbidden_actions:
  - approve any action autonomously (human is final)
  - modify safety invariants
required_GO:     human always required for PASS decision
```

### SLOT-DEV-CODEX

```
purpose:         Code implementation via Codex worker
candidate_worker: Codex
allowed_with_scoped_GO:
  - edit files listed in allowed_files
  - run approved static checks
  - run approved tests
  - create local commit
  - write evidence docs
forbidden_without_separate_GO:
  - git push
  - npm run dev
  - runtime start
  - install packages
  - read API keys or tokens
  - external API call
  - OAuth login
  - external write
required_GO:     explicit scoped GO naming: files / commands / tests / commit scope
STOP_conditions:
  - touches files outside allowed scope
  - attempts push without explicit push GO
  - attempts runtime without time_window GO
```

### SLOT-DEV-CLAUDECODE

```
purpose:         Code implementation via ClaudeCode worker
candidate_worker: ClaudeCode
allowed_with_scoped_GO:   (same as SLOT-DEV-CODEX)
forbidden_without_GO:     (same as SLOT-DEV-CODEX)
additional_rule:
  - ClaudeCode web chat UI must not be automated; only official CLI/API worker surface
required_GO:     same as SLOT-DEV-CODEX
```

### SLOT-RECORD

```
purpose:         Evidence recording, roadmap changelog, audit log
candidate_worker: しるべ / docs worker
allowed_actions:
  - create evidence .md files
  - update ROADMAP_CHANGELOG.md
  - update DEVELOPMENT_TEMPO_DASHBOARD.md
  - commit docs files (with human GO)
forbidden_actions:
  - include raw token / LAN IP / API key in any doc
  - commit source files that weren't in the approved scope
  - push without push GO
required_GO:     commit GO; push GO separate
```

### SLOT-PROVIDER-RESEARCH

```
purpose:         Research new provider capabilities, update architecture docs
candidate_worker: ClaudeCode / Codex (docs-only mode)
                  Human browser research
allowed_actions:
  - read official docs and announcements
  - write docs/shikishima research files
  - commit docs
forbidden_actions:
  - run hermes / install hermes
  - OAuth login
  - API call
  - modify source
required_GO:     none for docs-only; separate GO for any runtime
```

### SLOT-SOCIAL-AWARENESS

```
purpose:         x_search / web_search result observation and digest draft
candidate_worker: Grok-Hermes + x_search (HOLD until XS-03)
                  web_search (HOLD until web gate)
allowed_with_gate_pass:
  - read x_search results (manual query, human GO)
  - summarize results
  - add summary to Draft Outbox (draft_only)
  - show result in redacted UI surface
forbidden_always:
  - post to X
  - reply to X posts
  - DM any account
  - autonomous scheduled search without XS-08 GO
required_GO:     XS-03 minimum + human present
```

---

## Slot Status Display Format

For Agent Theater Slot Status Bar:

```
| Slot ID               | Worker (pending/active) | Status | Gate |
|-----------------------|------------------------|--------|------|
| SLOT-CONVERSE         | Grok-Hermes (pending)  | HOLD   | GHG-03 |
| SLOT-PLAN             | —                      | idle   | — |
| SLOT-SAFETY           | しずめ rule-based      | active | — |
| SLOT-DEV-CODEX        | —                      | HOLD   | scoped GO |
| SLOT-DEV-CLAUDECODE   | —                      | HOLD   | scoped GO |
| SLOT-RECORD           | しるべ                 | active | — |
| SLOT-PROVIDER-RESEARCH| —                      | idle   | — |
| SLOT-SOCIAL-AWARENESS | x_search (pending)     | HOLD   | XS-03 |
```

---

## Routing Rules

```
message received           → SLOT-CONVERSE (if provider ready) else buffer
complex task planning      → SLOT-PLAN
any source change          → SLOT-DEV-CODEX or SLOT-DEV-CLAUDECODE (scoped GO)
safety check               → SLOT-SAFETY (always)
docs / evidence            → SLOT-RECORD
provider / feature research → SLOT-PROVIDER-RESEARCH
social / x news            → SLOT-SOCIAL-AWARENESS (if XS-03+ passed)
unknown / ambiguous        → HOLD + human review
```

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
