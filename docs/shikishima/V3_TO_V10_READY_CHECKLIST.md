# Shikishima v3 to v10 Readiness Checklist — v2.8.0

## Purpose

Per-stage readiness checklist. Use to confirm entry conditions before starting each stage.

- documentVersion: v2.8.0
- documentDate: 2026-05-12
- decision: HOLD / execution: disabled / productionReady: false

---

## v3 Entry Checklist

- [x] v2.0 complete
- [x] V3 Goal & Task Pack created
- [x] HOLD Gate Matrix created
- [x] Static Validation Plan created
- [x] Tomorrow Debug Package created
- [ ] tests/ichikishima CI guard verified (read files; no execution)
- [ ] G-01 issued (tests/ichikishima commit)
- [ ] G-02 issued (tests/hermes commit)
- [ ] G-03 issued (typecheck:node)

**v3 exit condition**: tests committed; typecheck PASS; V4 readiness package; human GO for v4

---

## v4 Entry Checklist

- [ ] tests/ichikishima committed (G-01)
- [ ] tests/hermes committed (G-02)
- [ ] typecheck:node PASS (G-03)
- [ ] typecheck:web PASS (G-04)
- [ ] eslint PASS (G-05) — or errors classified
- [ ] V4 Local Validation Prep Package reviewed
- [ ] Human GO for v4

**v4 exit condition**: vitest PASS; build PASS; all blockers fixed; V5 readiness package; human GO for v5

---

## v5 Entry Checklist

- [ ] v4 complete (typecheck/vitest/build PASS)
- [ ] V5 Dry-Run Prep reviewed
- [ ] Local-only value boundary confirmed
- [ ] Human GO for v5

**v5 exit condition**: Electron app runs stable locally; screens work; IPC read-only confirmed; V6 readiness package; human GO for v6

---

## v6 Entry Checklist

- [ ] v5 complete (app runs locally)
- [ ] V6 Wrapper/Hermes/WSL Readiness Pack reviewed
- [ ] Dummy/wrapper execution plan confirmed
- [ ] WSL available locally (verified)
- [ ] Hermes installed in WSL (verified)
- [ ] Human GO for v6 (G-09/G-10/G-11/G-12 separately)

**v6 exit condition**: Hermes responds locally; IPC bridge verified; V7 readiness package; human GO for v7

---

## v7 Entry Checklist

- [ ] v6 complete (Hermes validated)
- [ ] V7 Device Readiness Pack reviewed
- [ ] StackChan hardware physically present
- [ ] Hardware safety review complete (display-only confirmed)
- [ ] Human GO for v7 (G-14)

**v7 exit condition**: Face display on StackChan stable; no motion triggered; V8 readiness package; human GO for v8

---

## v8 Entry Checklist

- [ ] v7 complete (display stable)
- [ ] V8 Non-IO Expression Pack reviewed
- [ ] Voice I/O concept plan reviewed
- [ ] Human GO for v8
- [ ] G-15 (voice I/O) if audio needed
- [ ] G-16 (camera/mic) if vision needed

**v8 exit condition**: Animation concepts validated; voice concept reviewed; V9 readiness package; human GO for v9

---

## v9 Entry Checklist

- [ ] v8 complete
- [ ] V9 Controlled Pilot Final Prep reviewed
- [ ] Pilot scenario definition complete
- [ ] Rollback procedure confirmed
- [ ] Human monitor identified
- [ ] Human GO for v9 (G-23 per run)

**v9 exit condition**: Controlled pilot run complete; result reviewed; V10 readiness package; human GO for v10

---

## v10 Entry Checklist

- [ ] v9 complete (pilot run reviewed)
- [ ] V10 Final Review Package all sections PASS
- [ ] Safety audit complete
- [ ] Security review complete
- [ ] Raw value audit complete
- [ ] All HOLD gates G-01–G-16 satisfied
- [ ] Human issues G-18 (productionReady = true)
- [ ] Human issues G-19 (execution = enabled)

**v10 exit condition**: G-18 + G-19 issued; production deployment prepared

---

## Current Readiness Status

| Stage | Entry Conditions Met | Status |
|---|---|---|
| v3 | Partially (docs done; tests not committed) | IN PROGRESS |
| v4 | No (v3 not complete) | HOLD |
| v5 | No (v4 not complete) | HOLD |
| v6 | No (v5 not complete) | HOLD |
| v7 | No (v6 not complete) | HOLD |
| v8 | No (v7 not complete) | HOLD |
| v9 | No (v8 not complete) | HOLD |
| v10 | No (v9 not complete) | HOLD |

この範囲では問題を検出していません。
