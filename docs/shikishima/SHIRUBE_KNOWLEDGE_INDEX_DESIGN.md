# しるべ Knowledge Index Design

## Purpose

The しるべ Knowledge Index groups project documents into safe, redacted
categories. It is not a search integration and does not write to Obsidian.

## Knowledge Categories

| Category | Example docs | Safe metadata |
|---|---|---|
| Roadmap | `REAL_OPERATION_ROADMAP.md` | version, status, phase |
| Final Vision | `SHIKISHIMA_FINAL_VISION.md` | topic, review state |
| Agent Permissions | `AGENT_NAMES_ROLES_AND_PERMISSIONS.md` | phase, approval state |
| Model Router | `MODEL_ROUTING_POLICY.md` | phase, risk level |
| しずめ Safety Gate | `SHIZUME_SAFETY_GATE_POLICY.md` | decision category |
| つむぎ Workflow | `TSUMUGI_IMPLEMENTATION_WORKFLOW.md` | task type |
| しるべ Logging | `SHIRUBE_LOGGING_POLICY.md` | redaction policy |
| Device Boundaries | `DEVICE_ROLES_AND_BOUNDARIES.md` | device role |
| StackChan Expression Plan | `STACKCHAN_EXPRESSION_ONLY_PLAN.md` | expression-only |
| Operation Runbook Draft | `MINIMUM_OPERATION_RUNBOOK_DRAFT.md` | draft state |

## Safety Rules

- Redacted-only indexing.
- No raw values.
- No direct Obsidian automation.
- No external search integration yet.
- No screenshots with private values.

この範囲では問題を検出していません。
