# UI-03 — Page Data Requirements

## Document Status

```text
roadmapVersion: v3.71.0
date: 2026-05-17
task: UI-03 design
status: design_ready — not implementation approval
```

---

## Fallback Rules (global)

```text
missing snapshot     → HOLD lamp + "データ取得中" message
stale snapshot       → HOLD lamp + STALE badge + preserve last-known values
unknown state        → HOLD lamp (never leave lamp blank)
error from IPC       → HOLD lamp + error badge
redaction uncertain  → HOLD lamp + REDACTED placeholder
device uncertain     → HOLD lamp + DISPLAY_ONLY badge
external write uncert→ HOLD lamp + HOLD explanation
```

---

## Page: Operator (操作室)

| Field | Purpose | Source | Raw risk | Redaction | Missing fallback | Stale fallback |
|---|---|---|---|---|---|---|
| decision | Primary lamp | SafeSnapshotData | none | none | HOLD | HOLD |
| productionReady | Safety label | SafeSnapshotData | none | none | HOLD | HOLD |
| execution | Safety label | SafeSnapshotData | none | none | "disabled" | "disabled" |
| komashikiState | こましき display | SafeSnapshotData | none | none | HOLD | HOLD |
| phaseProgress | Progress indicator | SafeSnapshotData | none | none | omit | STALE badge |
| caveats | Caveat list | SafeSnapshotData | none | none | [] | STALE badge |
| nextHumanAction | Next action prompt | SafeSnapshotData | none | none | omit | STALE badge |
| generatedAtUnixMs | Freshness stamp | SafeSnapshotData | none | none | HOLD | STALE badge |

```text
Allowed UI behavior:   display-only, copy-only (summary)
Forbidden UI behavior: push, execute, external write, runtime start
```

---

## Page: Chat (チャット)

| Field | Purpose | Source | Raw risk | Redaction | Missing fallback | Stale fallback |
|---|---|---|---|---|---|---|
| message history | Chat display | LocalChatMessage[] | LOW — user text may contain drafts | omit sensitive fields | empty list | last-known |
| role | Speaker label | LocalChatMessage | none | none | "user" | last-known |
| content | Message body | LocalChatMessage | MED — may contain draft text | strip raw tokens if present | omit message | last-known |
| timestampUnixMs | Message time | LocalChatMessage | none | none | omit timestamp | last-known |
| decision (strip) | Safety strip | SafeSnapshotData | none | none | HOLD | HOLD |

```text
Allowed UI behavior:   local-chat-send (target:"local-chat-service" only)
                       display message history, copy message content
Forbidden UI behavior: external send, post, email, Slack, Discord
Safety wording:        "チャット送信のみ。外部送信・push・実行は行いません。"
```

---

## Page: StackChan / Face Terminal

| Field | Purpose | Source | Raw risk | Redaction | Missing fallback | Stale fallback |
|---|---|---|---|---|---|---|
| connection | Connection status | StackChanStatusData | LOW — status string | none | "not_arrived" | STALE badge |
| physicalOperation | Safety display | StackChanStatusData | none | must be false | false | false |
| voiceActive | Safety display | StackChanStatusData | none | must be false | false | false |
| cameraActive | Safety display | StackChanStatusData | none | must be false | false | false |
| micActive | Safety display | StackChanStatusData | none | must be false | false | false |
| faceState | Face display | StackChanStatusData | none | none | omit | STALE badge |
| decision (strip) | Safety strip | SafeSnapshotData | none | none | HOLD | HOLD |

```text
Allowed UI behavior:   display connection status, copy status summary
Forbidden UI behavior: connect device, move robot, activate voice/camera/mic
                       physical-operate, serial/USB/Wi-Fi access
```

---

## Page: Draft Outbox (下書き)

| Field | Purpose | Source | Raw risk | Redaction | Missing fallback | Stale fallback |
|---|---|---|---|---|---|---|
| id | Item identifier | UIDraftOutboxItem | none | none | HOLD | STALE badge |
| category | Draft category | UIDraftOutboxItem | none | none | omit | STALE badge |
| draftState | State display | UIDraftOutboxItem | none | none | HOLD | STALE badge |
| contentSafe | Draft body | UIDraftOutboxItem | HIGH — draft may contain PII/tokens | must be pre-redacted in main | REDACTED | REDACTED |
| externalWrite | Safety invariant | UIDraftOutboxItem | none | must be false | false | false |
| sent | Safety invariant | UIDraftOutboxItem | none | must be false | false | false |
| remoteCreated | Safety invariant | UIDraftOutboxItem | none | must be false | false | false |
| paymentOrReservation | Safety invariant | UIDraftOutboxItem | none | must be false | false | false |

```text
Allowed UI behavior:   display draft list, copy draft content (human copy only)
                       mark reviewed (local state only)
Forbidden UI behavior: send, create remote, pay, reserve, auto-post
```

---

## Page: Approval Queue (承認待ち)

| Field | Purpose | Source | Raw risk | Redaction | Missing fallback | Stale fallback |
|---|---|---|---|---|---|---|
| id | Item identifier | UIApprovalQueueItem | none | none | HOLD | STALE badge |
| title | Display title | UIApprovalQueueItem | LOW — may contain draft title | strip raw values | REDACTED | STALE badge |
| statusLabel | Status display | UIApprovalQueueItem | none | none | HOLD | STALE badge |
| riskLevel | Risk indicator | UIApprovalQueueItem | none | none | HOLD | STALE badge |
| requestedAtUnixMs | Request time | UIApprovalQueueItem | none | none | omit | STALE badge |
| displayOnly | Safety invariant | UIApprovalQueueItem | none | must be true | true | true |

```text
Allowed UI behavior:   display queue items (display-only), copy item summary
Forbidden UI behavior: approve execution, reject execution, auto-process
Note:                  Approve/Reject labels are copy-label actions only.
                       No automated execution from UI.
```

---

## Page: GO

| Field | Purpose | Source | Raw risk | Redaction | Missing fallback | Stale fallback |
|---|---|---|---|---|---|---|
| current obs status | Runtime obs state | RuntimeObsStatusData | none | none | HOLD | STALE badge |
| available templates | GO template list | EvidenceService | LOW — template text | strip raw values | [] | STALE badge |
| decision (strip) | Safety strip | SafeSnapshotData | none | none | HOLD | HOLD |

```text
Allowed UI behavior:   display GO templates (copy-only), copy GO phrase
Forbidden UI behavior: start runtime, auto-execute GO, open port 3030
Note:                  GO button copies text to clipboard. System does NOT execute.
```

---

## Page: Evidence (証跡)

| Field | Purpose | Source | Raw risk | Redaction | Missing fallback | Stale fallback |
|---|---|---|---|---|---|---|
| id | Record identifier | UIEvidenceRecord | none | none | HOLD | STALE badge |
| gate | Gate label | UIEvidenceRecord | none | none | omit | STALE badge |
| result | Result lamp | UIEvidenceRecord | none | none | HOLD | STALE badge |
| dateLabel | Date display | UIEvidenceRecord | none | none | omit | STALE badge |
| summaryLines | Summary text | UIEvidenceRecord | LOW — may contain status text | strip raw values | [] | STALE badge |

```text
Allowed UI behavior:   display evidence list, copy evidence summary
Forbidden UI behavior: delete evidence, overwrite evidence
```

---

## Page: STOP

| Field | Purpose | Source | Raw risk | Redaction | Missing fallback | Stale fallback |
|---|---|---|---|---|---|---|
| id | Event identifier | UIStopEvent | none | none | HOLD | STALE badge |
| dateLabel | Event date | UIStopEvent | none | none | omit | STALE badge |
| trigger | Trigger description | UIStopEvent | LOW — may contain state description | strip raw values | REDACTED | STALE badge |
| resolvedLabel | Resolution status | UIStopEvent | none | none | HOLD | STALE badge |

```text
Allowed UI behavior:   display STOP history, copy STOP event summary
Forbidden UI behavior: clear history, resume without review
Note:                  Empty STOP history is nominal (good state).
```

---

## Page: Push (Push)

| Field | Purpose | Source | Raw risk | Redaction | Missing fallback | Stale fallback |
|---|---|---|---|---|---|---|
| branch | Branch name | PushReadinessData | LOW — may contain branch names | none needed | "unknown" | STALE badge |
| commitsAhead | Commit count | PushReadinessData | none | none | HOLD | STALE badge |
| staged | Staged count | PushReadinessData | none | none | HOLD | STALE badge |
| trackedDirty | Dirty count | PushReadinessData | none | none | HOLD | STALE badge |
| pushGoReceived | GO state | PushReadinessData | none | none | false | false |

```text
Allowed UI behavior:   display push readiness, copy push-readiness summary
Forbidden UI behavior: git push from UI (NEVER)
Tooltip:               "pushはClaudeCodeのGOから行います"
```

---

## Page: Inspector (詳細)

```text
Aggregates fields from: SafeSnapshotData + UIEvidenceRecord +
                         StackChanStatusData + PushReadinessData
All fields: same rules as individual pages apply.
Fallback: HOLD for each service independently.
Stale: per-service STALE badge.
Allowed: display + copy-all-summary.
Forbidden: any execution, any write.
```

---

## Page: Settings (設定)

| Field | Purpose | Source | Raw risk | Redaction | Missing fallback | Stale fallback |
|---|---|---|---|---|---|---|
| language | Display language | LocalSettingsData | none | none | "ja" | last-known |
| theme | UI theme | LocalSettingsData | none | none | "light" | last-known |
| safetyStripDensity | Strip density | LocalSettingsData | none | none | "normal" | last-known |
| defaultPage | Landing page | LocalSettingsData | none | none | "operator" | last-known |
| snapshotRefreshInterval | Refresh rate | LocalSettingsData | none | none | 30 | last-known |
| staleThreshold | Stale limit | LocalSettingsData | none | none | 60 | last-known |
| toastEnabled | Toast display | LocalSettingsData | none | none | true | last-known |

```text
Locked (non-interactive, lock icon, cursor:not-allowed):
  productionReady toggle, execution toggle, external write toggle,
  StackChan physical toggle, voice/camera/mic toggle

Allowed UI behavior: read and modify safe local preferences
Forbidden UI behavior: unlock risky capabilities, external API write
```

---

## Page: Help (ヘルプ)

```text
Source: static content only (no IPC required)
Fields: safety policy text, operational rules, gate descriptions
Allowed: display, copy section
Forbidden: nothing applicable (pure read-only)
No data freshness concern (static).
```

---

この範囲では問題を検出していません。
