# Phase 3 Agent Permission Review

## Purpose

This package makes the 5-agent authority model review-ready for human approval.
It is documentation only and is not execution approval.

Current state:

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false
- phaseStatus: review_ready_for_human_approval

## Agent Summary

| Agent | Role | Primary boundary |
|---|---|---|
| しきしま / しき | Orchestrator and user-facing control room | Can organize and summarize, but cannot approve GO alone. |
| しずめ | Safety gate | Can block and classify risk, but cannot grant high-risk GO alone. |
| つむぎ / つむ | Implementation and documentation agent | Can prepare approved patches, but cannot bypass しずめ. |
| はじめ | Planning and decomposition agent | Can plan next steps, but cannot trigger implementation automatically. |
| しるべ | Record, navigation, and handoff agent | Can create redacted logs, but cannot store raw values. |

Only しき and つむ are nicknames. しずめ, はじめ, and しるべ have no nicknames.

## Permission Matrix

| Agent | Can plan | Can draft docs | Can edit docs | Can edit code | Can run tests | Can run WSL | Can run Hermes | Can run wrapper | Can start RunPod | Can control robot | Can approve GO | Can push git | Can handle raw values | Default decision |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| しきしま / しき | yes | prepare only | via approved task | no by default | no by default | no | no | no | no | no | no | no | no | HOLD |
| しずめ | safety planning only | policy docs only | via approved task | no | no | no | no | no | no | no | cannot approve GO alone | no | no | HOLD or REJECT |
| つむぎ / つむ | implementation planning | yes | when approved | when approved | when allowed | no without separate approval | no | no | no | no | no | no without explicit approval | no | HOLD until scoped |
| はじめ | yes | planning docs only | no by default | no | no | no | no | no | no | no | no | no | no | HOLD |
| しるべ | navigation planning | redacted logs only | redacted docs only | no | no | no | no | no | no | no | no | no | no | HOLD |

## Required Deferrals

- Any WSL, Hermes, wrapper, dummy, packaged smoke, RunPod, robot, install, external network, git push, or productionReady change is deferred to a separate scoped approval.
- Local-only or private values require redaction review and must not be recorded in tracked docs.
- A docs approval does not approve execution.
- A commit approval does not approve push.

## Human Approval Points

Human approval is required before:

- changing decision from HOLD to GO.
- enabling any execution path.
- running WSL, Hermes, wrapper, dummy, packaged smoke, RunPod, or robot flows.
- pushing git changes.
- writing directly to an Obsidian vault.
- storing any local-only value outside a local-only ignored file.

## Review Checklist

- [ ] 5-agent responsibilities are understandable.
- [ ] No agent can approve GO alone.
- [ ] しずめ can block high-risk work.
- [ ] つむぎ cannot bypass しずめ.
- [ ] しるべ is redacted-only.
- [ ] Execution remains disabled.
- [ ] decision remains HOLD.

この範囲では問題を検出していません。
