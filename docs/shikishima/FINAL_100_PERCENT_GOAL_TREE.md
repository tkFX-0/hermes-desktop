# Final Shikishima 100% Goal Tree

## Document Status

- roadmapVersion: v3.1.3
- status: final_100_goal_tree / HOLD
- execution: disabled
- productionReady: false
- date: 2026-05-14

This document does not approve execution, productionReady true, Level 2
execution, Level 3, external services, WSL/Hermes/wrapper, Electron dev-mode,
robot/StackChan, voice/camera/mic, secrets/raw/local-only values, package
changes, source changes, deploy, Cloudflare, or git push.

## Universal Rules

Every goal in this tree observes these rules:

1. A goal does not approve execution unless it is explicitly an execution GO
   and the human has provided an exact time window and exact command list.
2. Git push always requires a separate explicit human approval.
3. productionReady true is never inferred from validation success.
4. External services, deploy, Cloudflare, WSL/Hermes/wrapper, Electron
   dev-mode, StackChan, robot, voice, camera, mic, secrets, raw values, and
   local-only values remain HOLD unless the specific goal explicitly scopes
   and receives separate human GO.

---

## /goal shikishima.final-100

**Definition of 100%:** All 12 child goals below are complete and evidenced.
All tracks have human acceptance records. productionReady true is explicitly
issued. G-18/G-19 equivalent are issued.

**Current gate:** Level 2 GO pending.

**Required evidence:** All child goal evidence records + human acceptance package.

**Required human GO:** G-ProductionReady (equivalent to G-18/G-19); separate
explicit human issue.

**STOP conditions:** Any child goal fails; productionReady inference attempted;
safety gate bypassed.

**What remains HOLD:** All child goals not yet started; productionReady true;
execution enabled.

**Next child goal:** /goal shikishima.safety-core-100 (in progress)

---

## /goal shikishima.safety-core-100

**Definition of 100%:** GO/HOLD/REJECT system verified; raw value redaction
verified; human approval gates verified; stop/rollback/incident handling verified;
productionReady cannot be inferred; execution enabled requires explicit GO.

**Current gate:** Level 2 execution will provide additional evidence.

**Required evidence:** Level 1 PASS evidence; Level 2 PASS evidence;
app observation evidence; rollback test record.

**Required human GO:** G-Level-2 (immediate); G-App-Obs (next).

**STOP conditions:** Any gate bypass attempt; raw value exposure; productionReady
inference.

**What remains HOLD:** Long-term reliability testing pending production.

**Next child goal:** /goal shikishima.validation-gate-100

---

## /goal shikishima.validation-gate-100

**Definition of 100%:** Level 1 and Level 2 local controlled validation evidenced
and accepted. Acceptance package complete.

**Current gate:** Level 2 GO wording review complete. Human must fill time window
and issue GO.

**Required evidence:** Level 1 evidence (v3.0.0 DONE); Level 2 evidence (pending).

**Required human GO:** G-Level-2 with exact command list and time window.

**STOP conditions:** Time window blank; pre-run verification fails; stop condition
triggered during run.

**What remains HOLD:** Level 2 execution; Level 2 evidence record pending run.

**Next child goal:** /goal shikishima.local-app-100

---

## /goal shikishima.local-app-100

**Definition of 100%:** App launches locally under approved observation; Control
Center UI observable; no raw/local-only values exposed; observation evidence
recorded.

**Current gate:** HOLD — requires Level 2 validation evidence first.

**Required evidence:** App observation evidence (redacted); working tree unchanged
after observation; safety boundary confirmation.

**Required human GO:** G-App-Obs with exact observation scope, time window, and
output policy.

**STOP conditions:** App attempts external service connection; raw values in
output; scope expands; human cannot monitor.

**What remains HOLD:** Electron dev-mode launch; app observation execution.

**Next child goal:** /goal shikishima.local-mvp-100

---

## /goal shikishima.local-mvp-100

**Definition of 100%:** Human can use Shikishima for real local work; daily
operation checklist exists; Obsidian-ready logs exist; review workflow exists;
safe local session definition exists; stop conditions exist.

**Current gate:** HOLD — requires local app observation first.

**Required evidence:** Operation planning docs; checklist; log format; session
definition.

**Required human GO:** Per-session human decision (no autonomous operation).

**STOP conditions:** Autonomous operation attempted; productionReady inferred.

**What remains HOLD:** Practical operation; external integrations; device/voice.

**Next child goal:** /goal shikishima.five-agent-100

---

## /goal shikishima.five-agent-100

**Definition of 100%:** All 5 agent roles (しきしま / まもり / つむぎ /
みちびき / しるべ) defined and implemented; permissions separated; escalation
and handoff rules exist; no agent can bypass human approval.

**Current gate:** HOLD — requires Local MVP foundation first.

**Required evidence:** Implementation docs; permission matrix; escalation test
records; safety gate verification per agent.

**Required human GO:** G-5Agent per agent activation; no agent auto-activates.

**STOP conditions:** Agent bypasses human approval; raw values in agent output;
agent attempts external service without GO.

**What remains HOLD:** Agent implementation; agent integration; all agent GOs.

**Next child goal:** /goal shikishima.memory-obsidian-100

---

## /goal shikishima.memory-obsidian-100

**Definition of 100%:** Logs are redacted; Obsidian-ready records generated;
decision history searchable; handoffs preserved; raw/local-only data not stored
unsafely.

**Current gate:** HOLD — parallel with Track 5 (5-Agent).

**Required evidence:** Log sample (redacted); Obsidian export record; handoff
record; storage policy confirmation.

**Required human GO:** G-5Agent (memory system activates with agent system).

**STOP conditions:** Raw values in logs; unredacted data stored; search exposes
private content.

**What remains HOLD:** Memory integration; Obsidian pipeline; knowledge indexing.

**Next child goal:** /goal shikishima.voice-100

---

## /goal shikishima.voice-100

**Definition of 100%:** Voice input path scoped; voice output path scoped; mic
requires explicit approval; no unsafe audio storage; voice evidence and rollback
rules exist.

**Current gate:** HOLD — Track E component; separate Track E approval required.

**Required evidence:** Voice scope proposal; GO wording; voice run evidence;
audio storage policy confirmation.

**Required human GO:** G-Voice with exact scope (input only / output only / both);
separate mic approval; separate camera approval if applicable.

**STOP conditions:** Mic activates without GO; audio stored unsafely; scope
expands; raw audio in output.

**What remains HOLD:** Voice track entirely; mic; camera; audio storage.

**Next child goal:** /goal shikishima.external-integration-100

---

## /goal shikishima.external-integration-100

**Definition of 100%:** All external services explicitly listed; separate GO per
service; Cloudflare/deploy separately approved; token/secret handling verified;
network boundaries documented; rollback plan exists.

**Current gate:** HOLD — Track E component; separate Track E approval required.

**Required evidence:** Service list; per-service GO record; token policy; network
boundary doc; rollback test record.

**Required human GO:** G-External per service. No shared GO covers multiple
services.

**STOP conditions:** Unapproved service contact; token/secret exposed; scope
expands to unapproved service.

**What remains HOLD:** All external services; Cloudflare; deploy; API integrations.

**Next child goal:** /goal shikishima.wrapper-execution-100

---

## /goal shikishima.wrapper-execution-100

**Definition of 100%:** WSL/Hermes/wrapper execution gated; no raw/local-only
values exposed; wrapper requires explicit GO; dummy/RunPod paths separately
gated; rollback evidence exists.

**Current gate:** HOLD — Track E component; separate Track E approval required.

**Required evidence:** Wrapper contract; execution gate doc; rollback test;
redacted output sample.

**Required human GO:** G-WSL per execution type (WSL separate from Hermes
separate from wrapper).

**STOP conditions:** Wrapper starts without GO; raw values in wrapper output;
WSL state persists unexpectedly.

**What remains HOLD:** All WSL/Hermes/wrapper execution.

**Next child goal:** /goal shikishima.robot-device-100

---

## /goal shikishima.robot-device-100

**Definition of 100%:** Robot/device scope defined; expression-only mode defined;
motion control HOLD until separate GO; device connection requires GO; no
autonomous device action; physical safety stop exists; evidence logs exist.

**Current gate:** HOLD — Track E component; separate Track E approval required.

**Required evidence:** Device scope doc; expression contract; safety stop plan;
connection evidence; motion HOLD confirmation.

**Required human GO:** G-Device per device (StackChan separate from other
devices); expression-only GO separate from motion GO.

**STOP conditions:** Unexpected device motion; device connects without GO; raw
hardware values in output.

**What remains HOLD:** StackChan connection; robot motion; device expression mode.

**Next child goal:** /goal shikishima.production-readiness-100

---

## /goal shikishima.production-readiness-100

**Definition of 100%:** All prior tracks have evidence; human acceptance package
complete; productionReady true explicitly issued; G-18/G-19 equivalent issued;
rollback/incident process tested; long-term checklist exists.

**Current gate:** HOLD — all prior tracks must be complete.

**Required evidence:** All track evidence + acceptance packages; G-18/G-19
human issuance record.

**Required human GO:** G-ProductionReady = explicit human statement naming all
tracks as accepted and productionReady true issued. Cannot be inferred.

**STOP conditions:** productionReady inferred from validation success; any prior
track evidence missing; G-18/G-19 not issued.

**What remains HOLD:** productionReady true; execution enabled; full production
operation.

**Next child goal:** /goal shikishima.long-term-reliability-100

---

## /goal shikishima.long-term-reliability-100

**Definition of 100%:** Operation checklist complete; incident history documented
(redacted); maintenance plan exists; safety boundary has been maintained over
multiple sessions without violation.

**Current gate:** HOLD — requires production readiness first.

**Required evidence:** Operation log (redacted); incident history (if any,
redacted); maintenance schedule; safety boundary audit.

**Required human GO:** Ongoing per-session human decisions; no autonomous
long-term operation.

**STOP conditions:** Safety boundary violation; autonomous session without GO;
raw values in operation logs.

**What remains HOLD:** Long-term operation; automated maintenance; autonomous
scheduling.

**Next child goal:** /goal shikishima.final-100 (all children complete)

---

## Goal Tree Summary

```
/goal shikishima.final-100
  ├── /goal shikishima.safety-core-100          [in progress]
  ├── /goal shikishima.validation-gate-100      [Level 2 GO pending]
  ├── /goal shikishima.local-app-100            [HOLD]
  ├── /goal shikishima.local-mvp-100            [HOLD]
  ├── /goal shikishima.five-agent-100           [HOLD]
  ├── /goal shikishima.memory-obsidian-100      [HOLD]
  ├── /goal shikishima.voice-100                [HOLD — Track E]
  ├── /goal shikishima.external-integration-100 [HOLD — Track E]
  ├── /goal shikishima.wrapper-execution-100    [HOLD — Track E]
  ├── /goal shikishima.robot-device-100         [HOLD — Track E]
  ├── /goal shikishima.production-readiness-100 [HOLD — all tracks required]
  └── /goal shikishima.long-term-reliability-100 [HOLD — production first]
```

## Safety Boundary

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- robotMotion: HOLD
- All Track E goals (voice/external/wrapper/robot): absolute HOLD
- production-readiness-100: absolute HOLD until all tracks complete
- future_git_push: not approved
