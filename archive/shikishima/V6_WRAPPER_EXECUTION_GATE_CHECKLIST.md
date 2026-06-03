# Shikishima v6 Wrapper Execution Gate Checklist — v2.8.3

## Purpose

Checklist for issuing G-09, G-10, G-11, G-12.

- documentVersion: v2.8.3 / decision: HOLD / execution: disabled / productionReady: false

---

## G-09: Dummy Process

- [ ] tests/ichikishima committed (G-01)
- [ ] dummy-hermes-path.ts: path confirmed not a real Hermes binary
- [ ] No external network active
- [ ] Environment: local dev only
- [ ] RUN_DUMMY_HERMES_LOCAL_PROCESS will be set; CI will NOT be true

**GO**: `"GO G-09: Approve dummy process execution. [date]."`

---

## G-10: Wrapper

- [ ] G-09 completed successfully
- [ ] Wrapper code reviewed: no real Hermes path
- [ ] No external network in wrapper execution path

**GO**: `"GO G-10: Approve wrapper execution. [date]."`

---

## G-11: WSL

- [ ] WSL 2 available: confirmed (check `wsl --version` at time of run)
- [ ] Target distribution active
- [ ] Command scope specified in GO statement
- [ ] No external network
- [ ] Emergency stop ready: `wsl --shutdown`

**GO**: `"GO G-11: Approve WSL execution. Command: [specified]. [date]."`

---

## G-12: Hermes

- [ ] G-11 complete
- [ ] Hermes binary confirmed installed in WSL
- [ ] Local-only scope: no RunPod, no external API
- [ ] Response schema reviewed (expected fields known)

**GO**: `"GO G-12: Approve Hermes execution. Scope: [specified]. [date]."`

この範囲では問題を検出していません。
