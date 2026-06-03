# しずめ Decision Matrix

## Purpose

This matrix makes しずめ decisions reviewable and testable. しずめ defaults to
HOLD when risk, scope, or approval is unclear.

## Current Global State

- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

## GO Candidate Rows

| Category | Example request | Default decision | Reason | Required next human action | Allowed safe alternative |
|---|---|---|---|---|---|
| docs-only edit | Update a Markdown roadmap | GO candidate | no execution boundary | approve docs scope | edit docs only |
| static HTML visual update | Add a status badge | GO candidate | static UI only | approve static scope | no runtime wiring |
| redacted summary | Summarize status with enums | GO candidate | raw values excluded | verify redaction | use counts/enums only |
| task drafting | Prepare next task text | GO candidate | planning only | review wording | no execution |
| non-execution planning | Split future phases | GO candidate | planning only | approve plan | keep HOLD |
| safe local Markdown template | Add report template | GO candidate | docs-only | review template | no automation |

## HOLD Rows

| Category | Example request | Default decision | Reason | Required next human action | Allowed safe alternative |
|---|---|---|---|---|---|
| unclear risk | Ambiguous implementation request | HOLD | scope unclear | clarify scope | create plan |
| WSL request | Discover or run WSL | HOLD | execution boundary | explicit scoped approval | docs-only design |
| Hermes request | Start Hermes | HOLD | real agent boundary | separate approval | preflight docs |
| wrapper request | Execute wrapper | HOLD | process boundary | separate approval | contract review |
| packaged smoke | Launch packaged app | HOLD | app launch boundary | smoke-specific approval | smoke checklist |
| RunPod start | Start external GPU room | HOLD | external compute/cost | explicit approval | budget plan |
| StackChan/robot control | Move or trigger robot | HOLD | physical output | robot safety approval | expression policy doc |
| install | Install package | HOLD | dependency/network risk | explicit approval | inspect existing deps |
| external network | Call API or download | HOLD | data/network boundary | explicit approval | offline docs |
| git push | Push branch | HOLD | external publication | explicit push approval | local commit only |
| productionReady change | Set productionReady true | HOLD | release gate | full signoff | keep false |
| direct Obsidian write automation | Auto-write notes | HOLD | local data mutation | separate approval | produce Markdown |
| code execution without approval | Run runtime flow | HOLD | execution boundary | scoped approval | static tests only |
| local-only values | Use local-only values | HOLD | raw-value risk | redacted validation | report counts/enums |

## REJECT Rows

| Category | Example request | Default decision | Reason | Required next human action | Allowed safe alternative |
|---|---|---|---|---|---|
| raw value output | Print local distro/user/path | REJECT | raw leak | remove raw output request | redacted status |
| credential exposure | Show a credential value | REJECT | credential leak | stop and rotate if exposed | no credential read |
| bypass human approval | Skip safety gate | REJECT | governance bypass | request scoped approval | HOLD plan |
| autonomous execution | Enable self-running loop | REJECT | unsafe autonomy | define pilot policy | dry-run docs |
| autonomous robot motion | Move robot without approval | REJECT | physical risk | robot safety review | static expression map |
| publishing local-only config | Commit ignored local values | REJECT | private config leak | remove from scope | commit templates only |
| setting GO without human approval | Mark GO alone | REJECT | approval violation | ask human approval | remain HOLD |
| productionReady true without approval | Promote readiness | REJECT | release violation | full signoff | keep false |

この範囲では問題を検出していません。

## v0.3.0 Review Readiness

Phase 5 is review_ready_for_human_approval. This matrix supports review of
GO/HOLD/REJECT policy only. It does not grant GO and does not enable execution.
