# Shikishima v6 Redacted Execution Report Template — v2.8.3

## Purpose

Template for reporting v6 execution results (dummy/wrapper/WSL/Hermes) in redacted form.

- documentVersion: v2.8.3 / decision: HOLD / execution: disabled / productionReady: false

---

## Redaction Rules (always apply first)

Replace before writing any report:
- All absolute paths → `[redacted-path]`
- All usernames → `[redacted-user]`
- WSL distribution name → `[wsl-distro]`
- All local ports → `[local-port]`
- All API keys/tokens → `[secret]`
- All RunPod endpoints → `[runpod-endpoint]`
- Hermes home path → `[hermes-home]`

---

## Dummy Process Report Template

```
=== DUMMY PROCESS RESULT (G-09) ===
Date: [YYYY-MM-DD]
Duration: [N seconds]
Exit code: [0 / non-zero]
External connections: [none / ALERT]
Response schema: [valid / invalid]
Raw value detected: [no / ALERT: redacted]
Result: [PASS / HOLD]
rawValuesReported: false
```

---

## Wrapper Report Template

```
=== WRAPPER RESULT (G-10) ===
Date: [YYYY-MM-DD]
Duration: [N seconds]
Exit code: [0 / non-zero]
IPC response schema: [valid / invalid]
External connections: [none / ALERT]
Result: [PASS / HOLD]
rawValuesReported: false
```

---

## WSL Report Template

```
=== WSL EXECUTION RESULT (G-11) ===
Date: [YYYY-MM-DD]
Command category: [specified in GO statement]
Duration: [N seconds]
Exit code: [0 / non-zero]
Distribution: [wsl-distro]
Output summary: [brief; no raw values]
External connections: [none / ALERT]
Result: [PASS / HOLD]
rawValuesReported: false
```

---

## Hermes Report Template

```
=== HERMES EXECUTION RESULT (G-12) ===
Date: [YYYY-MM-DD]
Duration: [N seconds]
Exit code: [0 / non-zero]
Response fields: [field names only — no values]
Response schema: [valid / invalid]
External connections: [none / ALERT]
Hermes home: [hermes-home]
Result: [PASS / HOLD]
rawValuesReported: false
```

この範囲では問題を検出していません。
