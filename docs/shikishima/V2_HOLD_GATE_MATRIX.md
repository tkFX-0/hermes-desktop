# V2 HOLD Gate Matrix — v1.3.1

## Purpose

This document lists every action that is currently HOLD and must not proceed
without explicit human GO. It serves as a gate checklist before any v1.3.x
implementation task is started.

- matrixVersion: v1.3.1
- matrixDate: 2026-05-12
- decision: HOLD
- execution: disabled
- productionReady: false
- rawValuesReported: false

---

## Gate Table

| Gate | Status | GO Condition | Notes |
|---|---|---|---|
| tests/ichikishima/ commit | HOLD | Human review of test content (v1.5.0) | 69 files; dummy-hermes-path.ts review needed |
| tests/hermes/ commit | HOLD | Coordinate with tests/ichikishima/ | 12 files; autonomy-zone tests |
| docs/ichikishima/ merge/archive | HOLD | Phase E-prep plan approved | 127 files; legacy docs |
| sandbox/ gitignore and stage | HOLD | Full gitignore audit; never stage sensitive content | ~4,553 files; local-only risk |
| Phase D src rename | HOLD | Separate scoped human GO for rename | High-risk: all imports must update |
| Phase E repo rename (GitHub) | HOLD | GitHub repo rename decision + DNS/URL coordination | Requires external action |
| appId change | HOLD | macOS/Win app registration decision | Changing breaks existing installs |
| win.executableName change | HOLD | User-visible .exe name decision | Separate optional decision |
| publish.repo change | HOLD | Only after GitHub repo is actually renamed | External URL; must match reality |
| dev-app-update.yml repo change | HOLD | Only after GitHub repo is actually renamed | Same as publish.repo |
| build / npm run build | HOLD | All pre-build checks passed; no dirty source | Not approved in this session |
| test / vitest run | HOLD | Test suite reviewed and approved | Not approved in this session |
| typecheck / eslint run | HOLD | Verified safe to run | Not approved in this session |
| npm install (full) | HOLD | Only --package-lock-only is approved | Full install may alter lockfile |
| npm update / audit fix | HOLD | Separate dependency update decision | May change versions |
| git push | HOLD | Separate explicit human approval | Never auto-push |
| StackChan connection/control | HOLD | Phase 9 approval + hardware present | Robot motion safety gate |
| WSL execution | HOLD | WSL bridge approved separately | Not in scope |
| Hermes/wrapper/dummy execution | HOLD | Phase 10 supervised operation approval | Not in scope |
| RunPod execution | HOLD | Explicit on-demand approval | Not in scope |
| external network (non-update) | HOLD | Scoped approval per use case | Not in scope |
| voice I/O / microphone / camera | HOLD | Phase 8+ device approval | Not in scope |
| raw value / secret output | NEVER | N/A — always forbidden | rawValuesReported must remain false |
| productionReady: true | HOLD | Full Phase 0-10 approval sequence | Not in v2.0 scope |
| GO transition | HOLD | Explicit scoped human GO per phase | Never auto-transition |

---

## Currently Unlocked Actions

These actions do NOT require a HOLD gate and may proceed in v1.3.x:

| Action | Scope |
|---|---|
| docs/shikishima/ file creation and edits | Documentation only |
| Roadmap / changelog / schema / tempo updates | Documentation only |
| Audit and classification documents | Audit-only / redacted-only |
| npm install --package-lock-only | Only for lockfile sync, verified |
| git add / git commit (docs-only) | Commit docs/shikishima changes |
| Reading source files | Read-only audit |
| Redacted-only content review | No raw values output |

---

## Gate Evaluation Procedure

Before starting any task that might cross a gate:

1. Check this matrix for the relevant gate.
2. If gate status is HOLD, stop and report to human.
3. Do not proceed until explicit GO is confirmed in the session.
4. Record the GO decision in the task completion report.
5. A GO for one gate does not unlock other gates.

---

## Safety Invariants (Must Never Change)

```text
decision: HOLD
execution: disabled
productionReady: false
humanGoApprovalRequired: true
rawValuesReported: false
robotMotion: HOLD
```

この範囲では問題を検出していません。
