# Discord One-shot Send Evidence

Date: 2026-05-26
Rally: Discord Send Unlock 2 — One-shot Actual Send (Rally 4)
Result: HOLD (credentials not configured in environment)

---

## 1. Baseline

```text
origin/main after Rally 3 push: 8ca01e5
rally_3_pushed_commits: fb648fe, dded766, 8ca01e5
rally_4_implementation: local (not pushed)
```

---

## 2. Transport and Send

```text
transport: bot_token_rest
target_label: operator-review
endpoint_style: Discord REST Create Message (POST, one request)
allowed_mentions_parse: [] (empty)
content_length_policy: preferred <= 1900, hard max <= 2000
implementation_contract: src/shared/discord-send-one-shot/
implementation_tool: tools/shikishima-discord-one-shot-send.mjs
```

---

## 3. Actual Send Outcome

```text
preflight_status: HOLD
actual_discord_send: false
actual_send_count: 0
simulated_send_count: not applicable
network_call: false
external_api_write: false
message_reference: REDACTED_MESSAGE_ID_ABSENT
gate_restored_hold: true
```

Missing environment variables (names only):

```text
SHIKISHIMA_DISCORD_BOT_TOKEN
SHIKISHIMA_DISCORD_OPERATOR_REVIEW_CHANNEL_ID
SHIKISHIMA_DISCORD_OPERATOR_REVIEW_TARGET_LABEL
```

---

## 4. Safety Boundary

```text
raw_token_printed: false
raw_channel_id_printed: false
raw_message_id_printed: false
raw_values_reported: false
webhook_used: false
bot_runtime_started: false
gateway_used: false
auto_retry: false
auto_reply: false
human_gate_queue_doc_modified: false
obsidian_actual_write: false
runtime_started: false
productionReady: false
execution: disabled
package_changed: false
```

---

## 5. Verification

```text
typecheck_web: PASS
typecheck_node: PASS
vitest: PASS (1336 passed, 1 skipped)
git_diff_check: PASS
one_shot_preflight_ready_case: PASS
missing_credential_hold_case: PASS
invalid_target_blocked_case: PASS
send_count_limit_one_case: PASS
tool_preflight_hold_without_network: PASS
```

---

## 6. Rollback

```text
git restore docs/shikishima/DISCORD_ONE_SHOT_SEND_EVIDENCE.md
remove src/shared/discord-send-one-shot/
remove tools/shikishima-discord-one-shot-send.mjs
revert ledger Rally 4 entries
```

---

## 7. Resume One-shot Send

Set the three `SHIKISHIMA_DISCORD_*` environment variables locally (never commit values), regenerate payload via vitest export test, then run:

```powershell
node tools/shikishima-discord-one-shot-send.mjs --input <payload.json>
```

After a successful send, update this evidence with `Result: PASS`, `actual_send_count: 1`, and `message_reference: REDACTED_MESSAGE_ID_PRESENT`.

---

## 8. Notes

```text
No webhook URL, bot token, channel ID, message ID, or local machine paths were recorded.
READY_TO_SEND_ONCE permits one POST only inside Rally 4 GO.
Discord send gate remains HOLD until explicit next Human GO.
Next recommended macro goal: /goalmacro shikishima.external-action-guard-controlled-autonomy
```
