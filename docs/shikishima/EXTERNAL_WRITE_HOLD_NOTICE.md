# External Write — HOLD Notice

## Status: HOLD

**External writes are NOT approved.**

---

## Current State in Code

```typescript
interface UIDraftOutboxItem extends SafetyInvariants {
  readonly externalWrite: false;      // TypeScript literal
  readonly sent: false;               // TypeScript literal
  readonly remoteCreated: false;      // TypeScript literal
  readonly paymentOrReservation: false; // TypeScript literal
}

interface LocalChatSendPayload {
  readonly target: "local-chat-service"; // Literal — never an external service
}
```

External write is a TypeScript literal type in the data contracts.
Changing this requires separate code change with human review.

---

## What External Write Means

External writes include:
- Email send
- Calendar event creation
- GitHub issue or PR creation
- Social media post
- Any API call that modifies external state
- Purchase, reservation, or payment

---

## Current UI Behavior

- **OutboxPage**: displays drafts only. No "Send" button. Copy-only.
- **QueuePage**: displays approval queue. No "Approve and Send" button. Display only.
- **GoPage**: displays GO decision. No push button. Display only.
- **ChatInputBar**: sends to `local-chat-service` only. Not an external service.
- **CommandSettings**: `外部書き込みの許可` in locked capabilities — non-interactive.

---

## Path to External Write Approval

```
1. GATE-PR-01 (productionReady) complete
2. GATE-EX-01 (execution) complete
3. GATE-EW-01 (external write general) complete
4. Per-service Gate (email / calendar / GitHub / social / payment)
5. Per-action explicit human GO
```

---

_Created: 2026-05-17_
_externalWrite: false_
_productionReady: false_
_execution: disabled_
