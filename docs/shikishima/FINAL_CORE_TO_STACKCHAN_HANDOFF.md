# Final Core to StackChan Handoff

Date: 2026-05-27

---

## Purpose

Define how Shikishima moves from **Final Core Acceptance** to the **StackChan phase** without blurring safety boundaries.

---

## Handoff Rule

```text
Final Shikishima Core must be ACCEPTED_AS_FINAL_CORE_100 before StackChan active integration.
Current status: ACCEPTED (Rally 9, pushed).
```

---

## What Core 100 Includes

```text
- Operator review pipeline
- Human Gate Queue repo-local operation
- Discord dry-run and one-shot path (send HOLD pending credentials)
- External Action Guard / Controlled Autonomy
- Runtime read-only Status Board + IPC + visual confirmation
```

---

## What Core 100 Excludes

```text
- StackChan connection or control
- productionReady true
- execution enabled
- Discord actual send completion
- Autonomous external execution
- Cursor Automations as unsupervised executor
```

---

## StackChan First Phase

```text
Phase 0 (this prep): docs-only — PREPARED_ONLY
Phase 1 (Rally 10): Baseline observation only — read-only, human present
Phase 2 (Rally 11): Safety readiness — gates before any active control
Phase 3+: Display / face / controlled pilot — each requires separate GO
```

---

## StackChan Is Not Part of Final Core 100

```text
Final Core 100 = guarded review / display / decision-control core complete.
StackChan = next physical interface phase on separate rails.
```

---

## Preserved Safety Across Handoff

```text
productionReady: false
execution: disabled
Discord send: HOLD_PENDING_LOCAL_CREDENTIALS
StackChan active control: HOLD
Obsidian actual write: HOLD
git push: separate human GO per rally
```

---

## Recommended Tomorrow Sequence

```text
1. Push StackChan Phase 0 prep docs (if still local)
2. /goalmacro shikishima.stackchan-baseline-observation (human present)
3. /goalmacro shikishima.stackchan-safety-readiness
```

Optional parallel track (env configured):

```text
/goalmacro shikishima.discord-one-shot-send-completion
```

---

## Prep Document Index

| Document | Role |
|----------|------|
| `STACKCHAN_PHASE0_READINESS_PREP.md` | Phase 0 summary |
| `STACKCHAN_BASELINE_OBSERVATION_GO_DRAFT.md` | Future GO template |
| `STACKCHAN_SAFETY_BOUNDARY.md` | HOLD matrix |
| `STACKCHAN_BASELINE_OBSERVATION_EVIDENCE_TEMPLATE.md` | Rally 10 evidence form |
