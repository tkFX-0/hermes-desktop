# Post-100 Gate 006 — Runtime Observation GO Template

## Document Status

```text
roadmapVersion: v3.60.0
date: 2026-05-17
gate: Post-100 Gate 006
name: Runtime Observation GO Template
status: design_ready — not yet executed
```

---

## Purpose

このテンプレートは Gate 006 のランタイム観察セッションを承認するために人間が使う。
Level 3-A セッション GO と同等の形式。

---

## GO Template (fill for each session)

```text
===== GATE 006 RUNTIME OBSERVATION GO =====

I approve Gate 006 Runtime Observation Session [NNN].
session_id: gate006-session-[NNN]
date: [YYYY-MM-DD]

Scope:
  runtime_start:                 approved
  port_3030_open:                approved (local only, time-limited)
  MOBILE_CONSOLE_PHASE_2C_ENABLED: true (local commit only; must NOT push)
  iPhone console access:         approved (same-LAN; read-only)
  observation:                   approved (read-only snapshot; redacted)
  runtime_stop:                  approved

time_window: [YYYY-MM-DD HH:MM-HH:MM JST]
  runtime must be stopped before time_window ends

Not approved:
  productionReady true:          NOT approved
  execution enabled:             NOT approved
  external API write:            NOT approved
  autonomous loop:               NOT approved
  push ENABLED=true commit:      NOT approved
  push without separate GO:      NOT approved

Human confirmation:
  [ ] I understand ENABLED=true commit is local-only and must NOT be pushed
  [ ] I understand runtime must stop before time_window ends
  [ ] I understand observation is read-only
  [ ] I approve this session

===== END GO =====
```

---

## Post-Session Push GO Template

```text
===== GATE 006 EVIDENCE PUSH GO =====

I accept Gate 006 Session [NNN] evidence.
evidence_commit: [commit hash]
observation_result: [PASS / FAIL / PASS_WITH_CAVEAT]

I approve push of evidence commit [hash] to origin/main.
Evidence is docs-only.
ENABLED=true commit is NOT included in push.

===== END PUSH GO =====
```

---

## GO Validity

```text
Each GO is valid for:
  - the specific session_id stated
  - the stated time_window only
  - the specific scope listed above

A new GO is required for each new session.
A push GO is separate from the session GO.
```

---

この範囲では問題を検出していません。
