# StackChan Display Route Implementation Options

Date: 2026-05-28
Companion: `STACKCHAN_DISPLAY_ROUTE_DESIGN.md`

---

## Comparison Matrix

| Option | Reaches device | Risk | Pilot-ready | Status |
|--------|:--------------:|:----:|:-----------:|--------|
| A — Docs / manual | No | Lowest | No | Current Rally 13 HOLD state |
| B — Pure local preview | No | Low | No | **Exists today** (`stackchan-display-preview`) |
| C — Guarded one-shot route | Yes | Medium (controlled) | After impl GO | **Preferred future** |
| D — Reuse `stackchanFaceLocal` directly | Yes | High | No | **Not approved** |
| E — Active control route | Yes | Critical | Forbidden | **Forbidden** for display-only |

---

## Option A: Docs-only / Manual Display

**Status:** safest; not an automated pilot route.

Operator manually sets StackChan face to match preview table while reading Shikishima Status Board.

| Pros | Cons |
|------|------|
| No code change | Not reproducible as automated evidence |
| No network send from Shikishima | Does not close Display-only Pilot 100% |

Use for: emergency communication only; not Rally acceptance.

---

## Option B: Pure Local Preview Only

**Status:** safe; does not reach device.

**Exists:** `src/shared/stackchan-display-preview/`, renderer Mobile Console “preview only” copy.

| Pros | Cons |
|------|------|
| Tested (vitest) | Rally 13 correctly HOLD — no device path |
| No network | Hermes desktop preview ≠ StackChan hardware |

Required baseline for Option C; insufficient alone for pilot PASS.

---

## Option C: Guarded One-shot Display Route

**Status:** preferred future implementation.

### Requirements

```text
explicit implementation GO (separate from pilot retry GO)
accept only StackChanDisplayIntent enum
use createStackChanDisplayPreview + evaluateStackChanDisplayPilotReadiness
new stackchanDisplayRouteAdapter module (src/main or guarded subfolder per impl GO)
wrap device send — never call stackchanFaceLocal directly from callers
map faceMood → fixed face_mode allowlist
one send per pilot GO; no retry loop
evidence file with redacted enums
tests: active-control flags remain false; unknown intent → no send
preflight + external-action guard integration
actual device send disabled in unit tests (mock transport)
```

### Suggested Module Boundaries (Design)

```text
src/shared/stackchan-display-preview/          — unchanged pure contract
src/shared/stackchan-display-pilot-readiness/  — unchanged pure contract
src/main/stackchan-display-route-adapter.ts    — future (impl GO)
src/main/stackchan-display-route-guard.ts      — future (impl GO)
```

IPC/preload/renderer exposure: **separate GO** after adapter proven in main-only tests.

---

## Option D: Reusing Existing Local Service Directly

**Status:** not approved.

`stackchanFaceLocal(emotion: string)`:

- Accepts arbitrary emotion string, not display intent
- Opens WebSocket via `connectWs` without display-only guard
- Registered as high-risk `device_display`; `shadowModeCovered: false`
- Same module hosts voice (`stackchanSayLocal`) and dance (`stackchanDanceLocal`)

**Reason:** Display-only pilot would inherit active-control module coupling and bypass intent/readiness contracts.

**If ever used:** only through Option C adapter with fixed mapping and guard — never direct call from pilot flow.

---

## Option E: Active Control Route

**Status:** forbidden for display-only phase.

Includes: voice pipeline, dance, pet mode, firmware, STT inbound server, autonomous loops.

Remains behind separate Human GOs per `STACKCHAN_GATE_MATRIX.md`.

---

## Recommendation

```text
Implement Option C only, under stackchan-display-route-implementation GO.
Keep Option B as mandatory pre-step validation.
Do not pursue Option D without Option C guard.
Never use Option E for display pilot.
```

---

## Decision Record

```text
selected_option: C (design approved)
route_guard_layer: ROUTE_GUARD_IMPLEMENTED (pure shared; no device wiring)
device_adapter: not implemented
display_pilot_execution: HOLD
active_control: HOLD
```
