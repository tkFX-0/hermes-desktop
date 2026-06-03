# Command Center UI State Label Policy

## Document Status

```text
roadmapVersion: v3.67.0
date: 2026-05-17
gate: Post-100 Gate 007
name: UI State Label Policy
status: POLICY_DEFINED — applies to UI-02 and all subsequent implementation phases
```

---

## Core Rule

```text
State labels are display semantics only.
They must not trigger side effects.
A label change is never an execution trigger.
A label change is never an external write trigger.
A label change is never a state machine transition with real-world effects.
```

---

## Canonical State Labels

### HOLD

```text
code:    HOLD
color:   --hold (amber)
soft:    --hold-soft
jp:      まだ待機。人間GOが必要です。
en:      Holding. Human GO is required.
semantics: system is waiting for human judgment
actor:   human reviews
urgency: low
icon:    pause / clock
display: always pair color + code + short phrase
```

### GO_READY

```text
code:    GO_READY
color:   --go (blue)
soft:    --go-soft
jp:      人間GOの判断待ち。実行はしません。
en:      Awaiting human GO. System will not execute.
semantics: human GO has been requested; system waits
actor:   human decides
urgency: normal
icon:    question / pending
important: "実行はしません" / "System will not execute" must always be visible
           alongside GO_READY. This label never means "executing".
```

### PASS

```text
code:    PASS
color:   --pass (green)
soft:    --pass-soft
jp:      Gate通過。次のGateへ。
en:      Gate passed. Proceed to the next gate.
semantics: gate condition met; human may proceed
actor:   human proceeds
urgency: low
icon:    check
```

### PASS_WITH_CAVEAT

```text
code:    PASS_WITH_CAVEAT
color:   #9aa72f (yellow-green)
jp:      条件付き通過。注意事項を確認してください。
en:      Conditional pass. Check caveats before proceeding.
semantics: gate met with known caveats
actor:   human reviews caveats then proceeds
urgency: medium
icon:    check with warning
```

### STOP

```text
code:    STOP
color:   --stop (red)
soft:    --stop-soft
jp:      停止中。人間の解除が必要です。
en:      Stopped. Human release is required.
semantics: operation halted; human must review before resuming
actor:   human reviews STOP_EVENT then releases
urgency: high
icon:    stop / octagon
```

### REJECT

```text
code:    REJECT
color:   --reject (dark red)
soft:    --reject-soft
jp:      却下。再提出を要求。
en:      Rejected. Resubmission requested.
semantics: item rejected; cannot be reused as-is
actor:   human decides on resubmission
urgency: medium
icon:    x / reject
```

### STALE

```text
code:    STALE
color:   --hold (amber, same as HOLD)
jp:      データが古くなっています。
en:      Data is stale.
semantics: snapshot/data not refreshed within threshold
actor:   system shows badge; human may refresh
urgency: low-medium
display: show STALE badge + last-known lamp values (preserve values)
         do NOT show blank / unknown when stale
```

### DISPLAY_ONLY

```text
code:    DISPLAY_ONLY
color:   --ink3 (gray)
jp:      表示のみ。
en:      Display only.
semantics: this element shows information; no interactive action
actor:   none
```

### DRAFT_ONLY

```text
code:    DRAFT_ONLY
color:   --ink3 (gray)
jp:      下書きのみ。送信・作成・決済しません。
en:      Draft only. No send, create, or payment.
semantics: content is draft; system takes no external action
actor:   human copies manually if approved
```

### COPY_ONLY

```text
code:    COPY_ONLY
color:   --ink3 (gray)
jp:      コピーのみ。
en:      Copy only.
semantics: button/action copies to clipboard; no external side effect
```

### NOT_APPROVED

```text
code:    NOT_APPROVED
color:   --hold (amber) or --ink3 (gray)
jp:      未承認。ClaudeCodeのGOが必要です。
en:      Not approved. ClaudeCode GO required.
semantics: capability has not received explicit GO
actor:   human provides explicit GO when ready
display: lock icon required
```

### DISABLED

```text
code:    DISABLED
color:   --ink3 (gray)
jp:      無効。
en:      Disabled.
semantics: capability or setting is disabled (invariant)
display: lock icon required for locked settings
         cursor: not-allowed
```

### READ_ONLY

```text
code:    READ_ONLY
color:   --ink3 (gray)
jp:      読み取り専用。
en:      Read only.
semantics: view without modification
```

### REDACTED

```text
code:    REDACTED
color:   --ink3 (gray)
jp:      非表示（安全のため）。
en:      Redacted (for safety).
semantics: raw value not displayed; rawValuesReported: false enforced
display: show REDACTED placeholder, never show raw value
```

---

## Fallback Rules

```text
STALE data:
  → display STALE badge + last-known lamp values
  → decision fallback: HOLD
  → do NOT show blank or unknown

UNKNOWN status:
  → decision fallback: HOLD
  → label: HOLD (not empty)

MISSING snapshot:
  → decision fallback: HOLD
  → show "スナップショット取得中" + HOLD lamp

RUNTIME UNAVAILABLE:
  → decision fallback: HOLD
  → do not show GO_READY or PASS if runtime cannot be confirmed

REDACTION UNCERTAINTY:
  → if rawValuesReported status cannot be confirmed
  → fallback: HOLD + REDACTED placeholder

DEVICE CONNECTION UNCERTAINTY:
  → StackChan / voice / camera / mic unknown
  → fallback: HOLD + DISPLAY_ONLY

EXTERNAL WRITE UNCERTAINTY:
  → if any external write status cannot be confirmed
  → fallback: HOLD

ANY ERROR STATE:
  → fallback: HOLD
  → show error badge + HOLD lamp
  → preserve last-known values if available
```

---

## Label Display Rules

```text
1. Never use color alone to indicate state.
   Always pair: color + code text + short phrase.

2. In printed logs and evidence files:
   Always include code text (HOLD / PASS / STOP etc.)
   Color information is lost in print.

3. For accessibility (WCAG AA):
   State text must meet contrast ratio against background.
   Use soft background (sk.*Soft) with full-saturation text (sk.*).

4. For iPhone (393px):
   Lamp text ≥ 13px.
   Tap targets ≥ 44px for any interactive lamp/button.
   safe-area padding applied.

5. Loading state:
   Show skeleton + preserve last-known lamp values.
   Do NOT clear lamps while loading — STALE is safer than blank.
```

---

この範囲では問題を検出していません。
