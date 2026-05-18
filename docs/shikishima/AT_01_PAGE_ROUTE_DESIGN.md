# AT-01 Agent Theater Page Route Design

## Document Status

```
date:            2026-05-18
status:          docs-only design — NOT implementation GO
phase:           AT-01
source_changed:  false
```

---

## Decision Summary

| Decision | Value | Reason |
|---|---|---|
| Page ID | `"theater"` | Clear, unique, matches concept |
| Tab label (ja) | `管制室` | 管制室 = control room; matches concept |
| Tab label (en) | `Theater` | Matches AT naming |
| Tab position | index 0 (before operator) | Agent Theater is the primary daily surface |
| Component path | `src/renderer/src/screens/AgentTheater/` | Consistent with other screen directories |
| Main component | `AgentTheaterPage.tsx` | Matches naming convention |
| Sub-components | `AgentCard.tsx`, `SlotStatusBar.tsx` | Bounded scope |
| Types file | `src/renderer/src/types/agent-theater-types.ts` | Separated from service-contracts.ts |
| Pose source | Derived from `decision` prop (HOLD → all agents waiting) | No new IPC needed for AT-02 |
| PageRightRail | Reused as-is from existing component | Consistent with OperatorPage pattern |
| PageShell | Inherited via Layout wrapping (no change) | Same as all other pages |

---

## Files Changed in AT-02

| File | Change Type | Description |
|---|---|---|
| `src/shared/ichikishima/ui-page-types.ts` | MODIFY | Add `"theater"` to `PageId`, `ALL_PAGE_IDS`, `PAGE_CONTRACTS` |
| `src/renderer/src/screens/Layout/Layout.tsx` | MODIFY | Add `case "theater":` to `renderCcPage()` |
| `src/renderer/src/screens/AgentTheater/AgentTheaterPage.tsx` | CREATE | Main page component |
| `src/renderer/src/screens/AgentTheater/AgentCard.tsx` | CREATE | Single agent card (ghost shape + name + pose label) |
| `src/renderer/src/screens/AgentTheater/SlotStatusBar.tsx` | CREATE | Slot status table |
| `src/renderer/src/types/agent-theater-types.ts` | CREATE | AgentId, PoseState, SlotStatus types |

Total: **6 files** (3 new, 3 modified)

CSS: No new CSS classes needed for AT-02 placeholder (inline styles + existing tokens).
AT-05 will add CSS keyframes — not part of AT-02.

---

## Type Design

### `src/renderer/src/types/agent-theater-types.ts`

```typescript
export type AgentId =
  | "shikishima"
  | "shizume"
  | "hajime"
  | "tsumugi"
  | "shirube";

export type PoseState =
  | "idle"
  | "thinking"
  | "working"
  | "handoff_send"
  | "handoff_receive"
  | "waiting_human_go"
  | "pass"
  | "hold_stop_blocked";

export interface SlotStatus {
  readonly slotId: string;
  readonly labelJa: string;
  readonly labelEn: string;
  readonly workerLabel: string;      // e.g. "Grok-Hermes (pending)"
  readonly status: "active" | "idle" | "hold";
  readonly gateRequired?: string;   // e.g. "GHG-03"
}

export type AgentPoseMap = Readonly<Record<AgentId, PoseState>>;
```

---

## Props Design

### `AgentTheaterPageProps`

```typescript
interface AgentTheaterPageProps {
  readonly decision: string;                    // drives pose derivation
  readonly agentPoses?: AgentPoseMap;           // override auto-derived poses
  readonly slotStatuses?: readonly SlotStatus[];
  readonly lang?: "ja" | "en";
}
```

### Pose Derivation (AT-02 default — no override)

Decision → all-agent pose mapping (AT-02 uses a simple rule):

```typescript
function deriveAllPoses(decision: string): AgentPoseMap {
  // HOLD / STALE / UNKNOWN / ERROR → all agents waiting
  if (decision === "HOLD" || decision === "STALE" || decision === "UNKNOWN" || decision === "ERROR") {
    return { shikishima: "waiting_human_go", shizume: "idle", hajime: "idle", tsumugi: "idle", shirube: "idle" };
  }
  // STOP → all blocked
  if (decision === "STOP") {
    return allAgents("hold_stop_blocked");
  }
  // PASS / PASS_WITH_CAVEAT → evidence recording
  if (decision === "PASS" || decision === "PASS_WITH_CAVEAT") {
    return { shikishima: "handoff_receive", shizume: "pass", hajime: "pass", tsumugi: "pass", shirube: "working" };
  }
  // GO_READY → awaiting human
  if (decision === "GO_READY") {
    return { shikishima: "waiting_human_go", shizume: "working", hajime: "working", tsumugi: "working", shirube: "idle" };
  }
  // Default → idle
  return allAgents("idle");
}
```

---

## AgentCard Design (AT-02 placeholder — no sprite)

```
┌─────────────────────┐
│  ●  (CSS circle,    │  ← CSS ghost placeholder (white + blue border)
│     20×28px)        │     flag color dot in top-right corner
│                     │
│  [name label]       │  ← agent name (ja/en)
│  [pose badge]       │  ← pose state text
└─────────────────────┘
```

CSS ghost placeholder = `border-radius: 50% 50% 45% 45%` (ghost head shape)
Flag color = CSS background-color from agent flag color map
No image asset required in AT-02.

---

## `PAGE_CONTRACTS` Entry to Add

```typescript
{
  id: "theater",
  labelJa: "管制室",
  labelEn: "Theater",
  primaryServices: ["safe-snapshot-service"],
  unavailableFallback: "HOLD",
},
```

Position: first entry (before "operator").

---

## `renderCcPage()` Case to Add

```typescript
case "theater":
  return (
    <AgentTheaterPage
      decision={toOperatorPageData(null).decision}
      lang={ccSettings.language === "en" ? "en" : "ja"}
    />
  );
```

---

## Default Slot Statuses (AT-02 hardcoded)

In AT-02, slotStatuses will be a hardcoded constant (no live data binding yet):

```typescript
const DEFAULT_SLOT_STATUSES: readonly SlotStatus[] = [
  { slotId: "SLOT-CONVERSE",    labelJa: "会話",     labelEn: "Converse",   workerLabel: "Grok-Hermes (pending)", status: "hold", gateRequired: "GHG-03" },
  { slotId: "SLOT-PLAN",        labelJa: "計画",     labelEn: "Plan",       workerLabel: "—",                    status: "idle"  },
  { slotId: "SLOT-SAFETY",      labelJa: "安全確認", labelEn: "Safety",     workerLabel: "しずめ",               status: "active" },
  { slotId: "SLOT-DEV-CODEX",   labelJa: "開発(Codex)",   labelEn: "Dev (Codex)",   workerLabel: "—", status: "hold", gateRequired: "scoped GO" },
  { slotId: "SLOT-DEV-CC",      labelJa: "開発(CC)", labelEn: "Dev (CC)",   workerLabel: "—",                    status: "hold", gateRequired: "scoped GO" },
  { slotId: "SLOT-RECORD",      labelJa: "記録",     labelEn: "Record",     workerLabel: "しるべ",               status: "active" },
  { slotId: "SLOT-SOCIAL",      labelJa: "社会認知", labelEn: "Social",     workerLabel: "x_search (pending)",   status: "hold", gateRequired: "XS-03" },
];
```

---

## Layout Sketch (AT-02)

```
<PageShell> (existing wrapper)
  <div className="cc-theater-outer">   ← new div, flex row
    <div className="cc-theater-main">  ← flex-grow
      <section> Agent Stage (5 × AgentCard) </section>
      <section> Handoff Row (text arrows) </section>
      <section> SlotStatusBar </section>
    </div>
    <aside className="cc-operator-side">  ← reuse existing CSS class
      <PageRightRail decision={decision} lang={lang} />
    </aside>
  </div>
```

Agent Stage uses `display: flex; flex-wrap: wrap; gap: 12px` for 5 cards.
No new CSS class required for AT-02 — reuse `cc-operator-side` pattern.

---

## AT-02 Auto-Proceed Decision

AT-02 meets all auto-proceed conditions:
- Unambiguous scope (6 files listed exactly)
- No package/dependency change
- No runtime during implementation
- No external write
- No safety invariant change
- UI-only
- TypeScript-checkable
- Vitest-verifiable (type safety)

AT-02 implementation GO can follow immediately after this design doc is committed.

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_
