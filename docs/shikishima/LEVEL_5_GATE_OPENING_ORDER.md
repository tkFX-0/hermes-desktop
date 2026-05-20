# Level 5 Gate Opening Order

**date:** 2026-05-20
**worker:** ClaudeCode
**status:** RECOMMENDED ORDER — no gate open yet

---

## Recommended Order

Start with the lowest-risk gates. Each gate requires its own human GO.

| # | Gate | Risk | Required Before |
|---|---|---|---|
| 1 | Obsidian local write test | Low | ob01_local_write_go |
| 2 | Discord read-only intake | Low-Medium | dis01_read_only_go |
| 3 | Worker copy-only bridge confirm | Low | human manual step |
| 4 | XS-AUTO one-shot read-only run | Low-Medium | xs_auto_read_go |
| 5 | HB-01 Hermes/WSL controlled connection | Medium | hb01_hermes_wsl_go |
| 6 | CC-03 Command Chat one-shot | Medium-High | cc03_real_send_go |
| 7 | StackChan display-only / expression link | Medium | stackchan-display-go |
| 8 | Discord one-shot reply | Medium | dis03_reply_go |
| 9 | X account read-only OAuth | Medium | xacc_read_go |
| 10 | X write / post / reply | High | xacc_write_go |
| 11 | StackChan physical / motion | High | stackchan-motion-go |
| 12 | productionReady true | Critical | productionReady-go |
| 13 | execution enabled | Critical | execution-go |

---

## Risk Classification

### Low Risk

```text
- Obsidian local write:
    Purely local. No external service. Worst case: wrong file in vault.
    Rollback: delete the file.

- Worker bridge:
    Human copies prompt manually. No automation. No external call.
```

### Low-Medium Risk

```text
- Discord read-only:
    No send. Read one channel only. Token local-only.
    Risk: token exposure if mishandled.

- XS-AUTO one-shot read-only:
    Public search only. No write. No OAuth.
    Risk: rate limit or unexpected private data.
```

### Medium Risk

```text
- HB-01 Hermes/WSL:
    Local bridge. WSL process. No external connection by default.
    Risk: unexpected WSL process behavior, scope expansion.

- StackChan display-only:
    Expression/display only. No physical motion.
    Risk: unexpected serial/USB connection.

- Discord one-shot reply:
    One message. One channel. Verbatim content.
    Risk: wrong channel, loop, token exposure.
```

### Medium-High Risk

```text
- CC-03 Command Chat:
    External AI API write. One message.
    Risk: unexpected send scope, loop, API errors.
```

### High Risk

```text
- X write / post / reply:
    Public social write. Permanent. Reputation risk.

- StackChan physical / motion:
    Physical robot. Unexpected movement.
```

### Critical Risk

```text
- productionReady true:
    Enables app for real operational use. Irreversible shift in posture.
    Requires all Level 5 gates to have passed first.

- execution enabled:
    Allows autonomous agent execution. Maximum risk.
    Last gate, never first.
```

---

## How to Use This Order

```text
1. Pick gate #1 (Obsidian local write)
2. Issue ob01_local_write_go with all required fields
3. Execute, record evidence
4. Close gate
5. Review result
6. Decide: proceed to #2 or stay at #1 for another session
7. Repeat

Never skip ahead.
Never open two gates simultaneously.
```

---

## Safety

```yaml
productionReady:    false
execution:          disabled
rawValuesReported:  false
all_gates:          HOLD
```
