# UI-03 — Redaction and Freshness Policy

## Document Status

```text
roadmapVersion: v3.71.0
date: 2026-05-17
task: UI-03 design
status: POLICY_DEFINED — applies to UI-03 implementation and all subsequent phases
```

---

## Core Principles

```text
Principle 1 — Redacted-only
  The renderer NEVER receives raw values.
  Redaction happens in main or preload before IPC.
  The renderer trusts received values are safe.
  The renderer must NOT hide raw values — they must not be sent.

Principle 2 — Omit over partial
  If a field cannot be fully redacted, omit it entirely.
  Partial redaction (e.g., showing 4 chars of a token) is forbidden.
  Omission triggers the missing-field HOLD fallback.

Principle 3 — rawValuesReported: false must be provable
  Any snapshot returned from IPC must have rawValuesReported: false.
  If this field is missing or true, the snapshot fails validation.
  parseControlCenterShellSnapshot() enforces this for existing snapshots.

Principle 4 — HOLD is the universal fallback
  No component may render GO_READY or PASS without confirmed, fresh,
  non-redacted-uncertain data.
```

---

## Raw Value Risk Severity Table

| Risk category | Example (placeholder only — no real values) | UI handling | Required fallback | STOP required |
|---|---|---|---|---|
| Raw API key / token | `sk-...` pattern | Must never appear | REDACTED placeholder → HOLD | YES |
| Raw LAN IP address | `192.168.x.x` pattern | Must never appear | REDACTED placeholder → HOLD | YES |
| Local file path | `C:\Users\...` pattern | Must never appear | REDACTED placeholder → HOLD | YES |
| Raw credential / password | Any auth string | Must never appear | REDACTED placeholder → HOLD | YES |
| Device serial / USB / Wi-Fi ID | Hardware identifier | Must never appear | REDACTED placeholder → HOLD | YES |
| Email address (real) | `user@domain` pattern | Must never appear | REDACTED placeholder → HOLD | YES |
| Calendar external ID | Calendar service identifier | Must never appear | REDACTED placeholder → HOLD | YES |
| GitHub remote URL with auth | `https://token@github.com/...` | Must never appear | REDACTED placeholder → HOLD | YES |
| Purchase / reservation / payment info | Order ID, card hint | Must never appear | REDACTED placeholder → HOLD | YES |
| Voice / camera / mic device info | Device name or ID | Must never appear | REDACTED placeholder → HOLD | YES |
| StackChan serial/USB/Wi-Fi ID | Physical device identifier | Must never appear | REDACTED placeholder → HOLD | YES |
| Local-only JSON field value | Internal state value | Must not expose | REDACTED placeholder → HOLD | YES if exposed |
| Draft content (approved_for_manual_copy) | General text | May appear if pre-redacted | Show as-is if safe; REDACTED if uncertain | NO if clean |
| Generic status string | "pending", "disabled", "HOLD" | Safe to show | None needed | NO |
| Timestamp / counter | Unix ms, count | Safe to show | Omit if missing (HOLD) | NO |

---

## Snapshot Freshness Policy

```text
Freshness is determined by comparing:
  current time vs. snapshot.generatedAtUnixMs

Stale threshold (placeholder — confirm at GO time):
  default: 60 seconds
  configurable via LocalSettingsData.staleThresholdSeconds (30 | 60 | 120)

Behavior when stale:
  show STALE badge on affected lamps
  preserve last-known values (do NOT blank the display)
  decision fallback: HOLD
  do NOT show GO_READY or PASS for a stale snapshot

Behavior when generatedAtUnixMs is missing:
  treat as missing → HOLD immediately
  do NOT assume freshness

Behavior when generatedAtUnixMs is in the future (clock skew):
  treat as stale → HOLD
```

---

## Missing Field Policy

```text
Any required field that is undefined or null in the IPC response:
  show the field's fallback value (see UI_03_PAGE_DATA_REQUIREMENTS.md)
  most fallbacks are: HOLD / REDACTED / false / []
  do NOT substitute a raw value as a "helpful" default
```

---

## Unknown Value Policy

```text
Any field whose value is not in the expected enum:
  treat as unknown
  display: HOLD lamp
  label: "状態不明" / "Unknown"
  do NOT display the raw unknown string in a state lamp
```

---

## Error Policy

```text
IPC call fails or times out:
  display: HOLD lamp + error badge
  message: "データ取得に失敗しました" / "Data unavailable"
  preserve: last-known values if available (STALE + HOLD)
  do NOT retry automatically without a user action (refresh-snapshot button)
```

---

## UI Labels for Safe/Unsafe States

```text
Safe states (display as-is):
  "HOLD" / "GO_READY" / "PASS" / "PASS_WITH_CAVEAT" / "STOP" / "REJECT"
  (these are canonical state codes, not raw values)

Redacted value label:
  "[REDACTED]" (RedactedPlaceholder constant from ui-safety-types.ts)

Missing value label:
  "—" (em dash) or omit entirely (depending on field importance)

Stale value badge:
  "STALE" badge adjacent to lamp/field

Unknown value label:
  "状態不明" / "Unknown"

Error state label:
  "データ取得失敗" / "Data unavailable" + HOLD lamp
```

---

## Audit Log Requirements

```text
The main process must log (to local audit only, never to renderer):
  - when a field is redacted before IPC
  - when rawValuesReported check fails
  - when a snapshot timestamp is missing or in the future

The renderer must NOT log raw values to console or external service.
The renderer audit log (if any) must contain only safe status strings.
```

---

## Allowed Summary Format

```text
Safe summary strings may contain:
  state codes: "HOLD", "PASS", "STOP" etc.
  count numbers: 3, 0, 12
  timestamp labels: "2026-05-17 17:05 JST"
  progress labels: "60% candidate"
  caveat codes: "windows_manual_installer_required_non_blocking"
  generic phrases: "Gate 004 audit readiness PASS"

Safe summary strings must NOT contain:
  raw tokens or API keys
  raw LAN IPs or local paths
  real email addresses
  real account names or handles
  any value from the forbidden raw value categories above
```

---

## Forbidden Raw Output Format

```text
The following patterns must never appear in any renderer-visible string:

  /sk-[A-Za-z0-9]{20,}/           (API key-like pattern)
  /192\.168\.\d+\.\d+/            (LAN IP pattern)
  /[A-Za-z]:\\Users\\/            (Windows user path pattern)
  /\/home\/\w+\//                  (Unix home path pattern)
  /github\.com\/[^/]+\/[^/]+\.git/ (GitHub remote URL pattern)
  any regex matching credential patterns from the risk table above

If detected in a summary field, the field must be replaced with REDACTED.
The existing summaryLineLooksLikeLeakedAbsolutePath() function in
control-center-shell-ui-contract.ts implements a partial version of this.
UI-03 implementation should reuse or extend this pattern.
```

---

この範囲では問題を検出していません。
