# StackChan Display Route Implementation GO Draft

Date: 2026-05-28
Status: **DRAFT — NOT ACTIVE GO**

Companion: `STACKCHAN_DISPLAY_ROUTE_DESIGN.md`, `STACKCHAN_DISPLAY_ROUTE_BOUNDARY.md`

---

## Placeholder Macro

```text
/goalmacro shikishima.stackchan-display-route-implementation
```

---

## Human GO Placeholder

```text
I approve implementation of a minimal guarded StackChan display-only route.

This is NOT approval to execute a Display Pilot on device.
This is NOT approval for Active Control, motion, dance, voice, mic, camera, or firmware.
```

---

## Preconditions

```text
STACKCHAN_DISPLAY_ROUTE_DESIGN.md status: DESIGN_PREPARED
Display Pilot Rally 13: HOLD (documented)
origin/main includes route design docs (after push of design commit)
```

---

## Authorized Scope (Future — When GO Active)

```text
create guarded display route adapter in src/main (exact paths in GO)
map StackChanDisplayIntent → preview → guarded one-shot send
integrate evaluateStackChanDisplayPilotReadiness at send boundary
integrate external-action guard / preflight for device_display
unit tests with mocked transport (no real device required for PASS)
update implementation evidence doc
local commit; push only with separate push GO
```

---

## Implementation May Create Only If

```text
accepts only StackChanDisplayIntent enum (no free-form emotion strings)
uses existing display preview + pilot readiness contracts
does not call stackchanSayLocal, stackchanDanceLocal, stackchanPetMode
does not read or record raw SSID / password / IP / device ID / token
actual device send remains disabled or mocked unless separately approved in same GO
tests prove motion/voice/firmware flags remain false
one-shot semantics enforced in adapter
```

---

## Forbidden Under Implementation GO

```text
IPC/preload/renderer wiring (separate GO)
actual Display Pilot retry (separate GO: stackchan-display-pilot-retry)
motion / dance / voice / mic / camera / firmware
Discord send / external API write
package.json changes without Dependency Change GO
productionReady true / execution enabled
git push without push GO
```

---

## Required Deliverables (Future)

```text
docs/shikishima/STACKCHAN_DISPLAY_ROUTE_IMPLEMENTATION_EVIDENCE.md
src/main/stackchan-display-route-adapter.ts (name per GO)
tests under tests/hermes/zone/ or tests/main/ per GO file allowlist
```

---

## Success Criteria (Future)

```text
status: IMPLEMENTATION_PREPARED | PASS
adapter rejects invalid intent / failed readiness
mocked send records exactly one face_mode payload shape
no regression in full test suite
actual_display_pilot: still HOLD until pilot-retry GO
```

---

## This Draft Does Not Approve

```text
actual Display Pilot on hardware
StackChan connection command for production use
network calls in CI without mock
push to remote
```
