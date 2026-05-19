# AT-14 Runtime Visual Recheck Package

## Purpose

AT-14 prepares one combined human visual recheck for Agent Theater items AT-07
through AT-13. This document is not runtime execution approval.

Runtime remains HOLD until explicit human GO.

## Required Runtime GO Fields

```yaml
runtime_visual_recheck_request:
  date:
  time_window:
  approved_command: npm run dev
  observation_scope:
  stop_conditions:
  shutdown_method:
  post_run_checks:
  evidence_file:
```

## Visual Recheck Targets

- AT-07 Control Room Layout
- AT-07 Handoff Motion
- AT-08 Worker Status Panel
- AT-09 Resume Queue / Cooldown Panel
- AT-10 Runaway Guard Panel, if implemented
- AT-11 Worker Routing Panel, if implemented
- AT-12 Gate Dashboard, if implemented
- AT-13 Final Visual Polish, if implemented

## Stop Conditions

Stop if:

- runtime opens an unexpected external connection
- OAuth starts
- x_search runs
- Obsidian write occurs
- external API write occurs
- productionReady becomes true
- execution becomes enabled
- raw value, secret, token, or local-only value is shown
- UI exposes active push/runtime/external action controls

## Shutdown Method

The runtime GO must include how to stop the app and how to verify that it
stopped. Port checks should be recorded if relevant.

## Evidence Template

```yaml
at14_runtime_visual_recheck:
  result:
  date:
  time_window:
  command:
  observed_sections:
  screenshots_taken:
  runtime_started:
  runtime_stopped:
  port_closed_after:
  raw_values_reported:
  productionReady:
  execution:
  level5_actions_enabled:
  notes:
```

## Safety Boundary

- this package does not start runtime
- no runtime start without human GO
- no git push without human GO
- no OAuth without human GO
- no x_search without read-only GO
- no Obsidian write without local note GO
- no external API write
- no productionReady true
- no execution enabled
- no raw value output
- no secrets or tokens
- no image asset import unless AT-05 later approves it

Plain-language rule:

AIは作るところまで。
鍵と発射ボタンは人間。

