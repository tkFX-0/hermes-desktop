# Autonomous Operation Acceptance Criteria

**date:** 2026-05-21
**status:** PLANNING — no version is currently approved

---

## Version 1 — Human-Supervised (current candidate)

**Description:** All external actions require explicit human GO per action. AI builds and prepares; human decides and fires.

**Requirements:**
```text
✓ All Level 5 gate forms prepared
✓ One-shot pattern proven (OB-01 / DIS-01 / DIS-03)
✓ Gate always restored to HOLD after each action
✓ Evidence committed per action
✓ typecheck PASS on all committed code
✓ productionReady: false
✓ execution: disabled
```

**Status: ACTIVE CANDIDATE — most criteria met**

---

## Version 2 — Limited Autonomous Read-only

**Description:** Read-only recurring tasks (search, intake) run on human-approved schedule without per-run GO.

**Requirements:**
```text
□ XS-AUTO recurring read-only PASS (Phase 3)
□ Discord read-only periodic intake PASS
□ Rate limit / cooldown enforced in code
□ Evidence auto-generated per run
□ No write actions in recurring path
□ Per-schedule GO (not per-run)
□ Manual kill switch tested
```

**Status: NOT MET — Phase 3 not started**

---

## Version 3 — Controlled External Write

**Description:** Tightly templated external writes (Discord reply, Command Chat) on template whitelist.

**Requirements:**
```text
□ Template whitelist implemented and tested (DIS-04 / CC-04)
□ Channel/user restriction enforced in code (DIS-05)
□ Send-count cap enforced in code (CC-05)
□ Loop prevention in code (DIS-07 / CC-06)
□ Kill switch implemented (EXE-01)
□ Incident rollback tested
□ At least 3 supervised write cycles completed
```

**Status: NOT MET — Phase 4 not started**

---

## Version 4 — productionReady true

**Description:** System safe for regular supervised operation.

**Requirements:**
```text
□ All Phase 1/2/3 criteria met
□ BLOCKER-005 resolved
□ LMO session completed
□ Incident response drill conducted
□ Rollback drill conducted
□ No active critical blockers
□ productionReady_go issued by tk
```

**Status: NOT MET — ~35-40% complete (risk-weighted)**

---

## Version 5 — execution enabled

**Description:** Limited execution enabled within strict scope.

**Requirements:**
```text
□ productionReady: true (Version 4)
□ Kill switch tested end-to-end
□ Execution scope whitelist in code
□ Process supervision active
□ Per-run evidence logs
□ execution_enabled_go issued by tk
```

**Status: NOT MET — Version 4 not met**
