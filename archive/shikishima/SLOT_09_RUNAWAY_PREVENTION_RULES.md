# SLOT-09 Runaway Prevention Rules

## Purpose

This document defines the worker runaway prevention rules for Shikishima.

The goal is to let AI workers help with drafting, implementation, checks, evidence, and local commits without letting them cross external or operational boundaries by themselves.

## Hard Prevention Rules

- No API auto-use.
- No OAuth auto-start.
- No x_search auto-run without read-only GO.
- No runtime auto-start.
- No git push without GO.
- No external write without GO.
- No productionReady true.
- No execution enabled.
- No loop without a stop condition.
- No autonomous subscription, payment, purchase, or reservation flow.
- No secret, token, raw value, or local-only value output.

## Loop Control

Every autonomous worker loop should have:

- a maximum step count
- a defined scope
- a defined verification command or evidence target
- a STOP condition
- a cooldown behavior
- a human escalation path

Suggested fields:

```yaml
max_steps:
current_step:
task_scope:
allowed_files:
verification:
stop_if:
cooldown_if:
needs_human_if:
evidence_file:
```

## Cooldown Detection

Use COOLDOWN when:

- worker usage limits are reached
- model quota or reset wait appears
- the worker is unstable or only suitable for small tasks
- another worker should continue a Level 1-4 task later

Cooldown does not authorize Level 5 actions.

## NEEDS_HUMAN Stop Behavior

Use NEEDS_HUMAN when the next action is:

- git push
- runtime start
- OAuth
- x_search / social read
- external connection
- external write
- Obsidian local write
- productionReady true
- execution enabled
- payment / purchase / reservation
- secret/token/raw value handling

When NEEDS_HUMAN occurs:

1. Stop.
2. Leave staged files clean unless a scoped commit was already approved.
3. Record the exact next requested human decision.
4. Provide a copyable GO template if helpful.
5. Do not continue by choosing a workaround.

## Audit and Evidence Requirement

Level 4 work should produce a record:

- files changed
- commands run
- checks passed or failed
- safety boundary
- commit hash when committed
- next human GO required when relevant

## Plain-Language Summary

AIは職人。
鍵と発射ボタンは人間が持つ。

AI can do careful workshop work.
The human keeps the keys, outside-world buttons, and final launch decisions.

## Safety Boundary

- productionReady: false
- execution: disabled
- rawValuesReported: false
- external writes: HOLD
- autonomous runtime: HOLD
- uncontrolled loop: REJECT
