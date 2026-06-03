# CC Live Snapshot Evidence

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** CODE_VERIFIED

---

## Purpose

Confirm that the Control Center live snapshot display is safe:
- raw values are not exposed to the UI
- productionReady and execution are type-enforced constants
- Command Chat remains display-only
- no external send/write actions are reachable from the snapshot path

---

## Snapshot Pipeline — Code Verification

### 1. IPC boundary

```
window.ichikishimaControlCenter.getAppSnapshot()
```

Returns an opaque `unknown`. The renderer never accesses raw fields directly.

### 2. Schema validation

```ts
parseControlCenterShellSnapshot(raw)
// → { ok: true, snapshot } or { ok: false, errorCode }
```

If parsing fails, `holdSummary(0, errorCode)` is shown — no raw data leaks through
on error.

Source: `shared/ichikishima/control-center-shell-ui-contract`

### 3. Safe summary mapping

```ts
snapshotToSafeSummary(snapshot, intervalSec)
```

This layer:
- Applies stale detection (forced HOLD when stale)
- Redacts sensitive fields
- Produces `SafeSnapshotSummary` (UI-safe shape only)

Source: `shared/ichikishima/ui-snapshot-helpers`

### 4. Per-page data mappers

`snapshot-to-page.ts`:

```ts
export function toOperatorPageData(summary): OperatorPageDisplayData {
  return {
    decision: s.stale ? "HOLD" : s.decision,
    productionReady: false,   // ← hardcoded, not from snapshot
    execution: "disabled",    // ← hardcoded, not from snapshot
    stale: s.stale,
    ...
  };
}
```

`productionReady` and `execution` are **never sourced from the snapshot**.
They are compile-time constants in `OperatorPageDisplayData`.

### 5. Type enforcement in SafetyStrip

```ts
interface SafetyStripProps {
  readonly productionReady: false;   // literal type — only false accepted
  readonly execution: "disabled";    // literal type — only "disabled" accepted
  ...
}
```

No snapshot value can override these. Any attempt to pass a different value
is a TypeScript compile error.

---

## CommandChatPage — Display-Only Verification

`CommandChatPage.tsx`:
- Renders messages from `LocalChatMessage[]` (local only)
- Shows decision badge from `ChatPageDisplayData` (safe summary, no raw values)
- `onSend` goes to `local-chat-service` only (no external API)
- No external network call is made from this component

Safety note is always shown:
```tsx
// Safety note — always visible at top of chat
// "Command Chat はローカル専用です..."
```

---

## Raw Value Protection Confirmation

| Category | Protected? | Method |
|---|---|---|
| LAN IP / local path | Yes | `snapshotToSafeSummary` redacts before UI |
| API tokens | Yes | never included in snapshot shape |
| Raw model responses | Yes | displayed as user content, no system leak |
| productionReady | Yes | hardcoded `false`, type-enforced |
| execution | Yes | hardcoded `"disabled"`, type-enforced |
| rawValues field in UI | Always "hidden" | SafetyStrip chip hardcoded |

---

## External Send / Write — Verification

No component in the snapshot display chain has:
- fetch / XMLHttpRequest to external URLs
- IPC calls that write to external services
- OAuth handlers
- x_search calls
- Obsidian write calls

The IPC exposed to renderer is:
- `getAppSnapshot()` — read-only, returns display data
- `sendLocalChat(message)` — local chat only, no external routing

---

## Pass Condition

```yaml
snapshot_pipeline:         PASS  # code verified
productionReady_enforced:  PASS  # literal type
execution_enforced:        PASS  # literal type
raw_value_protection:      PASS  # redacted before display
command_chat_local_only:   PASS  # no external service
external_write:            PASS  # no send path in snapshot UI
```

---

## Safety

```yaml
productionReady:   false
execution:         disabled
rawValuesReported: false
git_push:          not performed
```
