# Hermes WSL2 Wrapper — Value Signoff（**redacted テンプレ・実行なし**）

**位置づけ**: ユーザーが local-only JSON で実値を揃えたあとに残す **承認記録**。**repo に載せてよいのは redacted 版のみ**。実 distro 名・unix user 文字列・実パス全文は **書かない**。

関連: `HERMES_WSL2_WRAPPER_LOCAL_VALUE_FILL_IN_RUNBOOK.md`、`HERMES_WSL2_WRAPPER_USER_NEXT_ACTION_CHECKLIST.md`、`HERMES_WSL2_WRAPPER_LOCAL_VALUE_STORAGE_POLICY.md`、`HERMES_WSL2_WRAPPER_HUMAN_VALUE_PACKET.md`。

**禁止**: このテンプレに **実値を手書きしてコミット**すること。必要なら **ローカルコピーや別システム**にのみ完全版を保管。

---

## 記録メタ（redacted でよい）

| 項目 | 記入例（**実環境では伏せてよい項目は伏せる**） |
|------|-------------------------------------|
| 記入日（UTC 推奨） | YYYY-MM-DD |
| 実施者ラベル | 役割名のみ（例: `platform_operator`）。**本名・メールは repo に書かない** |

---

## パラメータ確認（値は書かず **confirmed のみ**）

| 項目 | redacted での書き方 | ユーザー私記（repo に書かない） |
|------|---------------------|----------------------------------|
| distroName | `redacted` / **pattern OK** とだけ記す | 実 distro 識別子 |
| unixUser | `redacted` / **POSIX OK** とだけ記す | 実ユーザー |
| wrapperPath | `redacted` / **expectedWrapperPath と一致済** | 実パス（規定形 1 のみ許可） |
| windowsWslExePath | **System32 exact match confirmed**（文字列本文は書かない） | `C:\Windows\System32\wsl.exe` |
| allowedExecutableId | `wsl-hermes-bridge-wrapper-v1` **confirmed** | 同上 |
| fixed argv pattern | **4 要素 pattern confirmed**（中身は HERMES_WSL2_WRAPPER_CONTRACT.md 参照のみ） | 実 argv |
| timeoutMs | **within cap confirmed**（数値は書いてもよいが design cap 内であること） | 実値 |
| maxStdoutBytes / maxStderrBytes | **within cap confirmed** | 実値 |
| expectedPayloadSchemaVersion | **`hermes-bridge-payload/v1` confirmed** | 同上 |
| logLevel | **`silent`** または **`minimal` confirmed** | 同上 |

---

## 政策確認（チェックのみ）

| 項目 | ☑ |
|------|---|
| **Sysnative** は **V1 では使用しない**（`HERMES_WSL2_WRAPPER_HUMAN_VALUE_PACKET.md`） | ☐ |
| **raw value を repo にコミットしていない**（`.gitignore` の実ファイルは add しない） | ☐ |
| **チャット・PR に local JSON 全文や実パスを貼っていない**（redacted summary のみ） | ☐ |
| **`wsl.exe` はまだ実行していない**（本 Signoff は実行前ゲート） | ☐ |
| **実 Hermes は起動していない** | ☐ |
| **`execFile` 実機は実行していない** | ☐ |
| **Control Center には raw path を出していない**（safe summary のみの契約） | ☐ |

---

## Validator result（redacted only）

Current redacted validator rerun (2026-05-06): `HOLD`, present=13, missing=0, placeholder=6, rejected=0. Raw values are not recorded. This is not a `GO` Signoff. Next action: user fills remaining local-only values and reruns validator.

| 項目 | 記録 |
|------|------|
| decision | `GO` / `HOLD` / `REJECT` |
| validationStatus | redacted status only |
| presentFieldCount | count only |
| missingFieldCount | count only |
| placeholderFieldCount | count only |
| rejectedFieldCount | count only |
| System32 exact match confirmed? | yes / no |
| Sysnative rejected V1? | yes / no |
| wrapper path policy passed? | yes / no / unknown |
| payload schema version confirmed? | yes / no |
| raw values not recorded confirmed | yes |
| `wsl.exe` not executed confirmed | yes |
| real Hermes not executed confirmed | yes |
| real `execFile` not executed confirmed | yes |
| WSL placement not performed confirmed | yes |
| next required action | `user_fills_remaining_values` / `redacted_signoff_review` / `fix_invalid_local_values` |

If placeholders remain, record `HOLD`. This is an expected safe result, not a failure.

```text
（ここには createHermesWsl2WrapperRedactedValidationReport の redacted summary lines のみを貼る。
raw distro / unix user / wrapper path / windowsWslExePath / argv / JSON は貼らない）
```

---

## 総合判定

| Go | Hold | Reject |
|----|------|--------|
| ☐ | ☐ | ☐ |

- **Go**: `validateHermesWsl2WrapperHumanValuePacket` が **`packet_complete_execution_forbidden`**、拒否ゼロ。**redacted Signoff review に進めるだけで、実行はまだ別 Goal**。
- **Hold**: pending または追加レビュー中。
- **Reject**: 検証 reject — 修正後に再記入。

**実施者サイン（短文・redacted）**:  
`_______________________________________`

**備考（redacted のみ）**:  

```text
（例: summarizeRedactedLocalValuePacket の lines をここに貼る。実パス・distro・unix user の文字列は含めない）
```
## 2026-05-06 Discovery-Only Fill-In Result

| Item | Redacted result |
|------|-----------------|
| WSL discovery-only performed | yes |
| Discovery boundary | distro list only; unix user discovery not run because distro selection was ambiguous |
| Local JSON updated | yes, fixed non-ambiguous local-only fields only |
| Raw values recorded | no |
| Decision | HOLD |
| present / missing / placeholder / rejected | 13 / 0 / 3 / 0 |
| System32 exact match policy | local-only fixed value recorded; raw path not recorded here |
| Sysnative V1 | rejected / not used |
| Wrapper path policy | unknown until distro/user selection is unambiguous |
| Payload schema version | confirmed as local-only fixed value |
| `wsl.exe` beyond discovery | no |
| Real Hermes executed | no |
| Real `execFile` pilot executed | no |
| WSL placement performed | no |
| Next required action | select the intended distro without sharing raw values, then rerun validator |
## 2026-05-06 Intended Distro Slot Selection Result

| Item | Redacted result |
|------|-----------------|
| Distro discovery-only command | allowed System32 list-only command |
| distroDiscoveryStatus | multiple |
| distroCount | 3 |
| selectableSlots | slot-01 / slot-02 / slot-03 |
| selectedSlot | none |
| Decision | HOLD |
| Raw distro names recorded outside local-only storage | no |
| Unix user discovery | not performed |
| Wrapper path generation | not performed |
| Local value distroName confirmation | not performed |
| `wsl.exe -d` | not executed |
| WSL placement / wrapper / dummy / real Hermes | not executed |
| Next required action | user chooses one slotId only |
## 2026-05-06 Selected Slot Resolution Attempt

| Item | Redacted result |
|------|-----------------|
| selectedSlot | slot-02 |
| Inventory comparison before resolution | matched |
| Slot resolution | resolved locally |
| Unix user discovery-only | failed |
| Local JSON distro/user/wrapper fill-in | not completed |
| Decision | HOLD |
| present / missing / placeholder / rejected | 13 / 0 / 3 / 0 |
| Raw distro/user/path recorded outside local-only storage | no |
| `wsl.exe -d` scope | `whoami` only |
| WSL file creation / placement | no |
| Wrapper / dummy / real Hermes | not executed |
| Real `execFile` pilot | not executed |
| Next required action | investigate selected distro availability without reporting raw values, or choose another slot |
## 2026-05-06 Selected Distro Availability Investigation

| Item | Redacted result |
|------|-----------------|
| selectedSlot | slot-02 |
| System32 WSL executable precheck | passed |
| Inventory comparison | matched |
| Slot resolution | resolved locally |
| `whoami` discovery-only | failed |
| alternate `$USER` discovery-only | failed |
| failureCategory | whoami_failed_and_user_env_failed |
| Local JSON distro/user/wrapper fields updated | no |
| Decision | HOLD |
| present / missing / placeholder / rejected | 13 / 0 / 3 / 0 |
| Raw stdout/stderr recorded | no |
| Raw distro/user/path recorded outside local-only storage | no |
| WSL file creation / placement | no |
| Wrapper / dummy / real Hermes | not executed |
| Real `execFile` pilot | not executed |
| Next required action | user verifies selected distro availability locally without sharing raw values |
## 2026-05-06 Availability HOLD Hardening

| Item | Redacted result |
|------|-----------------|
| selectedSlot | slot-02 |
| slotResolution | resolved locally |
| inventoryCountComparison | count_matched_content_unverified |
| unixUserDiscovery | failed |
| alternateUnixUserDiscovery | failed |
| failureCategory | whoami_failed_and_user_env_failed |
| localJsonUpdatedForDistroUserWrapper | false |
| present / missing / placeholder / rejected | 13 / 0 / 3 / 0 |
| decision | HOLD |
| nextRequiredHumanAction | verify selected slot availability locally |
| allowed next user responses | `slot-02 availability: ok` / `slot-02 availability: failed` / `slot-02 availability: choose_another_slot` |
| raw values reported | false |
| WSL placement / wrapper / dummy / real Hermes / real execFile | not performed |

## 2026-05-07 Packaging Safety Gate Readiness

| Item | Redacted result |
|------|-----------------|
| selectedSlot | slot-02 |
| selectedSlotStatus | matched |
| exactMatchResult | single_match |
| matchCount | 1 |
| packagingGateStatus | resolved_without_execution |
| packagingRiskLevel | low |
| packagingBlockers | none |
| decision | HOLD |
| execution | disabled |
| productionReady | false |
| pendingPackagingResolution | true |
| rawValuesReported | false |
| canRunWsl / canRunHermes / canRunWrapper / canRunOnce | false / false / false / false |
| nextRequiredHumanAction | review_non_execution_readiness_before_go_policy |
| Raw distro/user/path/WSL list/slot map recorded in docs | no |
| WSL placement / wrapper / dummy / real Hermes / real execFile | not performed |
## 2026-05-07 Control Center HOLD Status Sprint

| Item | Redacted result |
|------|-----------------|
| selectedSlot | slot-02 |
| Status | HOLD |
| Control Center display | slot-only availability blocker shown |
| inventoryCountComparison | count_matched_content_unverified |
| slotResolution | resolved locally |
| unixUserDiscovery | failed |
| alternateUnixUserDiscovery | failed |
| failureCategory | whoami_failed_and_user_env_failed |
| localJsonUpdatedForDistroUserWrapper | false |
| nextRequiredHumanAction | verify selected slot availability locally |
| rawValuesReported | false |
| Execution | disabled |
| productionReady | false |
| pendingPackagingResolution | true |
## 2026-05-07 Selected Slot Failed / Reselection Required

| Item | Redacted result |
|------|-----------------|
| selectedSlot | slot-02 |
| availability | failed |
| reason | distro_not_in_current_wsl_list |
| decision | HOLD |
| nextRequiredHumanAction | choose_another_slot |
| rawValuesReported | false |
| Execution | disabled |
| Raw distro/user/path/WSL list/slot map recorded in docs | no |
| WSL placement / wrapper / dummy / real Hermes / real execFile | not performed |
## 2026-05-07 Refreshed Slot Selection Recorded

| Item | Redacted result |
|------|-----------------|
| selectedSlot | slot-01 |
| previousSelectedSlot | slot-02 |
| previousFailureReason | distro_not_in_current_wsl_list |
| decision | HOLD |
| nextRequiredHumanAction | verify_selected_slot_availability_locally |
| rawValuesReported | false |
| Execution | disabled |
| Raw distro/user/path/WSL list/slot map recorded in docs | no |
| WSL `-d` / whoami / placement / wrapper / dummy / real Hermes / real execFile | not performed |

## 2026-05-07 Inventory Consistency Wording Hardening

| Item | Redacted result |
|------|-----------------|
| inventoryConsistency | retired legacy count/content-ambiguous field; not a full-content match |
| inventoryCountConsistency | matched |
| inventoryContentConsistency | partial |
| slotStatuses | slot-01:mismatch / slot-02:matched / slot-03:matched |
| decision | HOLD |
| execution | disabled |
| rawValuesReported | false |
| nextRequiredHumanAction | choose_matched_slot_id |

## 2026-05-07 Local-Only Slot Map Repair HOLD

| Item | Redacted result |
|------|-----------------|
| selectedSlot | unresolved |
| previousSelectedSlot | slot-01 |
| previousSelectedSlotStatus | mismatch |
| slotSelectionStatus | unresolved |
| slotSelectionFailureReason | distro_name_mismatch |
| inventoryContentConsistency | mismatched |
| decision | HOLD |
| execution | disabled |
| productionReady | false |
| pendingPackagingResolution | true |
| rawValuesReported | false |
| exactMatchReadiness | not_ready |
| nextRequiredHumanAction | update_local_only_slot_map_or_hold |

## 2026-05-07 Human-Confirmed Matched Slot

| Item | Redacted result |
|------|-----------------|
| selectedSlot | slot-02 |
| selectedSlotStatus | matched |
| previousSelectedSlot | slot-01 |
| previousSelectedSlotStatus | mismatch |
| exactMatchReadiness | ready |
| exactMatchResult | single_match |
| matchedSlotId | slot-02 |
| matchCount | 1 |
| decision | HOLD |
| execution | disabled |
| productionReady | false |
| pendingPackagingResolution | true |
| rawValuesReported | false |
| nextRequiredHumanAction | resolve_packaging_safety_gate |

## 2026-05-07 Exact-Match Validation After Local-Only Update

| Item | Redacted result |
|------|-----------------|
| selectedSlot | unresolved |
| exactMatchResult | no_match |
| matchedSlotCount | 0 |
| decision | HOLD |
| execution | disabled |
| productionReady | false |
| pendingPackagingResolution | true |
| rawValuesReported | false |
| nextRequiredHumanAction | update_local_only_slot_map_or_hold |
## 2026-05-07 Count-Matched Inventory Mismatch Classification

| Item | Redacted result |
|------|-----------------|
| selectedSlot | slot-01 |
| availability | failed |
| failureReason | distro_not_in_current_wsl_list |
| inventoryCountConsistency | matched |
| inventoryContentConsistency | partial |
| slotStatuses | slot-01:mismatch / slot-02:matched / slot-03:matched |
| slotMapCount / currentInventoryCount | 3 / 3 |
| decision | HOLD |
| nextRequiredHumanAction | choose_matched_slot_id |
| rawValuesReported | false |
| Execution | disabled |
| Raw distro/user/path/WSL list/slot map recorded in docs | no |
## 2026-05-07 Slot-01 Availability Failed / Inventory Consistency Check

| Item | Redacted result |
|------|-----------------|
| selectedSlot | slot-01 |
| availability | failed |
| failureReason | distro_not_in_current_wsl_list |
| previousSelectedSlot | slot-02 |
| previousFailureReason | distro_not_in_current_wsl_list |
| inventoryConsistency | retired legacy count/content-ambiguous field; use split fields below |
| inventoryCountConsistency | matched |
| inventoryContentConsistency | partial |
| slotStatuses | slot-01:mismatch / slot-02:matched / slot-03:matched |
| slotMapCount / currentInventoryCount | 3 / 3 |
| decision | HOLD |
| nextRequiredHumanAction | choose_matched_slot_id |
| rawValuesReported | false |
| Execution | disabled |
| Raw distro/user/path/WSL list/slot map recorded in docs | no |
| WSL `-d` / whoami / placement / wrapper / dummy / real Hermes / real execFile | not performed |
## 2026-05-07 Refreshed Slot Inventory for Reselection

| Item | Redacted result |
|------|-----------------|
| distroDiscoveryStatus | refreshed |
| distroCount | 3 |
| selectableSlots | slot-01 / slot-02 / slot-03 |
| selectedSlot | none |
| previousSelectedSlot | slot-02 |
| previousFailureReason | distro_not_in_current_wsl_list |
| decision | HOLD |
| nextRequiredHumanAction | select_slot_id |
| rawValuesReported | false |
| Execution | disabled |
| Raw distro/user/path/WSL list/slot map recorded in docs | no |
| WSL placement / wrapper / dummy / real Hermes / real execFile | not performed |
