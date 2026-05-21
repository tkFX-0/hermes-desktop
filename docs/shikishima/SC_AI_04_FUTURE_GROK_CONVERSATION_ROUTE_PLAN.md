# SC-AI-04 Future Grok Conversation Route Plan

date: 2026-05-21
status: FUTURE_PLAN
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false

This document records the future route where Shikishima's agent-side Grok /
X-linked capability may become the conversation backend for StackChan.

No new API, OAuth, X login, x_search execution, external write, productionReady
true, or execution enabled is approved here.

---

## Target

Future desired shape:

```text
user -> Shikishima agent -> Grok-backed answer -> StackChan face/voice output
```

But the near-term goal remains simpler:

```text
user -> one text prompt -> one answer -> evidence
```

---

## Gate Requirements

Before Grok can be used as a conversation route:

- XACC / Grok route must already be approved for the exact purpose
- token/secret storage policy must be confirmed
- no raw token output
- no social write
- no autonomous loop
- no productionReady true
- no execution enabled

---

## Safe Intermediate Step

Use Grok only as a future design target while proving:

1. local text dialogue contract
2. one-shot evidence format
3. StackChan fixed speech route
4. gate restoration to HOLD

---

## Not Approved

- X OAuth
- x_search
- X post/reply/DM/like/follow
- external API write
- background conversation daemon
- voice loop
- microphone always-on
- StackChan motion/dance

