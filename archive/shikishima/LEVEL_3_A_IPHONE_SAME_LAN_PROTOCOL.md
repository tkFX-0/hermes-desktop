# Level 3-A iPhone Same-LAN Observation Protocol

## Document Status

```text
roadmapVersion: v3.32.0
date: 2026-05-16
status: protocol_design_only — apply during a future Level 3-A run
```

---

## 1. Purpose

iPhone same-LAN observation confirms that the Phase 2C server is reachable
and the redacted snapshot is visible on iPhone Safari.

```text
iPhone observation IS:
- read-only status confirmation
- human-operated visual check
- evidence that RustDesk is no longer required for observation

iPhone observation IS NOT:
- execution approval
- productionReady approval
- autonomous operation
- external network access
```

---

## 2. Human Actions (iPhone side)

The human is solely responsible for all iPhone operations:

```text
- physically open iPhone Safari
- navigate to http://<LAN_IP>:3030/mobile/health
  (confirm { "ok": true } without token)
- navigate to http://<LAN_IP>:3030/mobile/ui
- visually confirm the page loads
- enter the pairing token manually from the Electron UI
  (token is displayed in Electron — do not copy it into chat)
- tap "接続して状態を確認" (connect)
- visually confirm the redacted snapshot fields
- confirm: decision = HOLD / execution = disabled / productionReady = false
- confirm: rawValuesReported = false / level3 = not_approved
- confirm: no raw values, no secrets visible
- close the Safari page after confirmation
```

---

## 3. ClaudeCode Actions (evidence side)

ClaudeCode may only:

```text
- provide the checklist to fill
- record result fields in redacted form
- never request the raw pairing token
- never request the raw LAN IP
- record: iphone_health_check: PASS / NG
- record: iphone_snapshot_visible: yes / no
- record: raw_token_in_chat: false (must remain false)
- record: raw_lan_ip_in_chat: false (must remain false)
```

---

## 4. Required Checks

| Check | Expected | Notes |
|---|---|---|
| /mobile/health | { "ok": true } | no token needed |
| /mobile/ui | page loads | no token needed |
| /mobile/snapshot via /mobile/ui | visible with token | JS fetch with Bearer |
| snapshot_without_token | rejected 401 | Safari address bar confirms |
| snapshot_invalid_token | rejected 401 | via /mobile/ui with wrong token |
| decision | HOLD | |
| execution | disabled | |
| productionReady | false | |
| rawValuesReported | false | |
| level3 | not_approved | |
| raw_values_visible | false | |
| secrets_visible | false | |
| token_input_masked | true | type=password field |

---

## 5. Forbidden

```text
- raw pairing token copied into chat or transcript
- raw LAN IP pasted into chat or transcript
- external network exposure
- 0.0.0.0 binding
- wildcard CORS
- execution endpoint
- push endpoint
- file write endpoint
- token logging in any output
- screenshot of token shared in any medium
```

---

## 6. Post-Observation

After iPhone observation is complete:

```text
1. human confirms all visual checks PASS
2. close Safari page
3. ClaudeCode records result in evidence template
4. proceed to runtime shutdown per runbook
5. confirm port 3030 closes after shutdown
```

---

## Safety Boundary

```text
decision          : HOLD
execution         : disabled
productionReady   : false
rawValuesReported : false
Level 3           : not approved (this protocol is design only)
raw_token         : never reported
raw_lan_ip        : never reported
```

---

この範囲では問題を検出していません。
