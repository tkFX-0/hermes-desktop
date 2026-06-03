# Shikishima v6 Wrapper / Hermes / WSL Readiness Pack — v2.8.3

## Purpose

Complete readiness package for v6 limited execution validation.
No execution in this document. All items require GO.

- documentVersion: v2.8.3 / decision: HOLD / execution: disabled / productionReady: false

---

## v6 Goal

Validate Hermes connectivity through WSL using dummy/wrapper; confirm IPC bridge; local-only only.

## Entry Conditions

- [ ] v5 complete (app runs stably locally)
- [ ] Dummy/wrapper execution plan reviewed (V3_DUMMY_WRAPPER_EXECUTION_PLAN.md)
- [ ] WSL/Hermes execution plan reviewed (V3_WSL_HERMES_EXECUTION_PLAN.md)
- [ ] Human GO for v6

## Gate Sequence

```
G-09 (dummy) → G-10 (wrapper) → G-11 (WSL) → G-12 (Hermes) → [G-13 RunPod, optional]
```

Each gate is independent. Prior gate completion is prerequisite but not automatic unlock.

## Critical Safety Rules for v6

1. **Local-only**: No external network during any v6 execution
2. **No RunPod without G-13**: Do not touch RunPod endpoint
3. **No real Hermes without G-12**: Dummy path only for G-09/G-10
4. **Redacted output only**: No raw WSL paths in any report
5. **One execution at a time**: Kill previous before next

## v6 Exit Conditions

- [ ] Dummy process: exits cleanly; no network; response schema valid
- [ ] Wrapper: executes; IPC response schema valid
- [ ] WSL: command executes; output redacted; no unexpected behavior
- [ ] Hermes: responds locally; no external API; IPC bridge verified
- [ ] V7 Readiness Package created
- [ ] Human GO for v7

## What Remains HOLD After v6

- RunPod: G-13 only (if explicitly needed)
- StackChan: G-14
- Voice I/O: G-15
- Camera/microphone: G-16
- robot motion: G-22

この範囲では問題を検出していません。
