# Final Readiness Matrix（ドラフト）

**更新方針**: 各 Area は **コードテストまたは人手ゲート文献** と突合。**OK は自動承認しない**。

| Area | Current status（短文） | Ready? | Blocker | Next Goal | Human approval? | Risk |
|------|-------------------------|--------|---------|-----------|-----------------|------|
| Hermes Autonomy Zone | sandbox read/write gate 実装済 | partial | Zone 外 delete/exec 恒久禁止の継続監査 | 監査自動化しない | Maybe | misuse path |
| Approval Queue | JSONL stub 済 | yes-readonly | execution engine 無し | approval execute 別門 | Yes | leakage |
| Audit Log | JSONL stub 済 | yes-readonly | sqlite 恒久化無し | 本番恒久は別フェーズ | Yes | size |
| Review Mode | 型+stub | partial | Shadow との境界再確認 docs | SPEC 読了 | Low | UX |
| Memory Candidate | 抽出 stub | partial | persistence STOP | MEMORY_GOVERNANCE + DB gate | Yes | PI |
| Local Pilot | full loop READY ラベル | yes-lab | 実 Hermes 無し | 実機 Goal | Yes | subprocess |
| Hermes Bridge | dry-run pilot 複数シナリオ | yes-lab | 実ランタイム無し | real connection preflight | Yes | API surface |
| Payload Contract | ingress 検証済 | yes | 実入力未検証 | 実機短文 smoke | Yes | parser |
| Receiver Queue | in-memory lane | stub | persistence 無し | bridge integration | Yes | TTL |
| Stage 0 Adapter | in-memory | stub | handshake のみ | staged roadmap | Medium | misuse |
| Stage 1 File Handoff | marker / inbox stub | stub | stdin/stdout Stage1 経路無し | handoff Goal | Yes | cleanup |
| Controlled Pilot Code | adapter + config 検証 | yes-code | メタ値未確定・execFile 実行無し | 値確定+pilot human run | Yes | exec |
| WSL2 Wrapper | 契約 + registry + **human value packet** + 値確認 SPEC + dummy `.sh.sample`（**配置・実行禁止**） + `hermes-wsl2-wrapper-config` + **LOCAL_VALUE_FILL_IN_RUNBOOK / USER_NEXT_ACTION_CHECKLIST / LOCAL_VALUE_VALIDATOR_RUNBOOK / MANUAL_PLACEMENT_PLAN / VALUE_SIGNOFF（redacted テンプレ）** | prepared / HOLD | Distro/script/**実値未確認なら HOLD**・**local JSON 作成済み**・**validator rerun HOLD: present=13 / missing=0 / placeholder=6 / rejected=0**・**manual placement design prepared**・**Sysnative V1 未許可**・**`wsl.exe` 未実行** | **ユーザー記入・validator/redacted summary・redacted Signoff** → 手動配置 review → pilot 前 gate | Yes | wsl power |
| WSL local-only values | local JSON exists / gitignored / untracked / unstaged | HOLD | placeholder=6 / missing=0 / rejected=0 | user fills remaining local-only values, rerun validator | Yes | raw value leakage |
| Redacted Signoff | template supports validator result counts and policy booleans | HOLD | local validator is not GO | redacted Signoff review after GO only | Yes | confusing GO with execution |
| WSL dummy manual placement | manual placement plan prepared | no | local validator HOLD; no Signoff review | manual placement review after GO + redacted Signoff | Yes | WSL boundary crossing |
| WSL dummy validation | dummy sample reviewed statically only | no | no WSL placement, no wrapper execution | separate non-execution validation review | Yes | payload / stdout confusion |
| Controlled Pilot pre-signoff | runbook/final gate updated | no | no redacted Signoff GO; no execution approval | pre-execution review only | Yes | accidental process execution |
| wsl.exe execution | explicitly blocked | no | requires separate Very High / Pro preflight Goal | wsl.exe execution pre-review | Yes | broad execution surface |
| real Hermes process | explicitly blocked | no | real Hermes not started, no pilot approval | real Hermes Controlled Pilot review | Yes | real runtime side effects |
| execFile controlled pilot | explicitly blocked | no | real `execFile` not approved | Controlled Pilot real-machine Goal | Yes | subprocess |
| Control Center Snapshot | getAppSnapshot canonical path + retired getSnapshot guard + preload + Renderer shell + path resolver | yes-readonly | packaged 実機 smoke **記録無し**；**short launch 設計のみ 2026-05-03** | **実短命起動 / Signoff** | Medium | leakage |
| Read-only IPC | main + preload + Renderer（Ichikishima Control Center namespace は `getAppSnapshot` のみ。既存 `window.hermesAPI` は別 namespace） | yes-min | **`pendingPackagingResolution:false` は Signoff Go のみ** | 同上 | Medium | channel sprawl |
| Static Shell | mock + guideline + Renderer 親和 `appShellParityPreview` | yes-mock | packaged 本番 read 精度 | smoke 実行後に再評価 | Medium | UX |
| Visualization | viz v1 model | meta-only | レイアウト無し | canvas/engine | Medium | glam |
| Agent Team Foundation | dry-run registry off | stump | scheduler/tick STOP | autonomy policy | Yes | runaway AI |
| Windows Packaging | docs + packaged smoke 設計 + build smoke + **short launch 設計・契約・TS** | no | **実 packaged 短命起動**ログ・Signoff 未取得 | **short launch 実施 or safe pending**／INSTALLER Goal | Yes | signing |
| App-only Operation | roadmap + shell + resolver + smoke **設計ゲート** + **read-only UI polish** + **build smoke（Stage 1）** + **short launch 設計・契約** | partial | **人手 packaged 短命起動 smoke ログ未取得**・単独 app 未到達 | **short launch 実施 / safe pending**・Signoff／WSL 確定 | Medium | habit |
| EA/MT5 future | 隔離方針のみ | blocked | メインとは分離 | dedicated goal | Yes | finance |

関連: `ROADMAP_STATUS.md`、`NEXT_GOALS.md`、`DATE_CONSISTENCY_NOTES.md`、`HERMES_BRIDGE_FINAL_REVIEW.md`、`CONTROL_CENTER_PACKAGED_PATH_SMOKE_TEST_SPEC.md`、`CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md`、`CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_SMOKE_SPEC.md`、`HERMES_WSL2_WRAPPER_PARAMETER_REGISTRY_SPEC.md`、`HERMES_WSL2_WRAPPER_VALUE_CONFIRMATION.md`、`HERMES_WSL2_WRAPPER_HUMAN_VALUE_PACKET.md`、`HERMES_WSL2_WRAPPER_LOCAL_VALUE_FILL_IN_RUNBOOK.md`、`HERMES_WSL2_WRAPPER_USER_NEXT_ACTION_CHECKLIST.md`、`HERMES_WSL2_WRAPPER_LOCAL_VALUE_VALIDATOR_RUNBOOK.md`、`HERMES_WSL2_DUMMY_WRAPPER_MANUAL_PLACEMENT_PLAN.md`、`HERMES_WSL2_WRAPPER_VALUE_SIGNOFF.md`
## 2026-05-06 Pre-Execution Pack Addendum

| Area | Current status | Ready? | Blocker | Next Goal | Human approval? | Risk |
|------|----------------|--------|---------|-----------|-----------------|------|
| Packaged short launch smoke | SPEC / runner contract / Signoff template prepared; not executed in this pack | HOLD | no approved packaged short launch evidence; no build:unpack/build:win/installer | separate packaged short launch Goal with explicit approval | Yes | packaged runtime / path evidence |
| WSL dummy execution | not executed | no | no WSL placement; local validator HOLD; Signoff review not ready | dummy-only execution review after placement GO | Yes | crossing from docs into process execution |
| Dummy payload validation | not run; stdout contract reviewed statically only | no | no dummy execution; raw stdout must not be stored | dummy payload validation after dummy-only run approval | Yes | raw payload / stdout leakage |
| Real Hermes wrapper | not ready; dummy result absent and upstream CLI still unconfirmed | no | dummy phases incomplete; real wrapper contract not signed off | real wrapper preflight after dummy success | Yes | real runtime side effects |
| Approval execution | explicitly blocked | no | approval execution is outside read-only / dummy scope | dedicated Approval execution gate | Yes | unintended action |
| Memory DB | explicitly blocked | no | production persistence not approved | Memory governance / DB gate | Yes | persistence / personal data |
| EA/MT5 | explicitly blocked | no | trading room is future-only and isolated | dedicated EA/MT5 Goal | Yes | financial execution |
## 2026-05-06 Discovery-Only Fill-In Update

| Area | Current status | Ready? | Blocker | Next Goal | Human approval? | Risk |
|------|----------------|--------|---------|-----------|-----------------|------|
| WSL local-only values | discovery-only fill-in partially completed; fixed non-ambiguous fields recorded local-only | HOLD | distro selection ambiguous; placeholder=3 | select intended distro without sharing raw values, rerun validator | Yes | raw value leakage / wrong distro |
| Redacted Signoff | updated with discovery-only result | HOLD | local validator is not GO | redacted Signoff review after validator GO | Yes | confusing discovery with execution |
| WSL dummy placement | still blocked | no | local values HOLD; no Signoff GO | manual placement review after GO | Yes | WSL boundary crossing |
## 2026-05-06 Intended Distro Slot Selection Update

| Area | Current status | Ready? | Blocker | Next Goal | Human approval? | Risk |
|------|----------------|--------|---------|-----------|-----------------|------|
| WSL intended distro | local-only slot map prepared; selectedSlot none | HOLD | user has not chosen slotId | selected distro local-only resolution after inventory comparison | Yes | wrong distro selection |
| Unix user discovery | not performed | no | selectedSlot missing | discovery-only after slot selection and inventory match | Yes | raw value leakage |
| Wrapper path fill-in | not performed | no | distro/user unresolved | local-only wrapperPath fill-in after unix user discovery | Yes | wrong path |
## 2026-05-06 Selected Slot Resolution Update

| Area | Current status | Ready? | Blocker | Next Goal | Human approval? | Risk |
|------|----------------|--------|---------|-----------|-----------------|------|
| WSL selected distro | slot-02 selected; inventory comparison matched | HOLD | unix user discovery-only failed | redacted selected distro availability investigation or choose another slot | Yes | wrong or unavailable distro |
| Unix user discovery | attempted with selected slot only | no | discovery failed | retry only after availability status is understood | Yes | raw stdout leakage |
| Wrapper path fill-in | not performed | no | unix user unavailable | fill local-only after unix user discovery succeeds | Yes | wrong path |
## 2026-05-06 Selected Distro Availability Investigation Update

| Area | Current status | Ready? | Blocker | Next Goal | Human approval? | Risk |
|------|----------------|--------|---------|-----------|-----------------|------|
| WSL selected distro availability | slot-02 resolved; inventory matched | HOLD | whoami and `$USER` discovery failed | human-side availability verification without sharing raw values | Yes | wrong or unavailable distro |
| Unix user discovery | failed by both allowed methods | no | selected distro could not complete discovery-only | retry only after availability is verified | Yes | raw stdout leakage |
| Wrapper path fill-in | not performed | no | unix user unavailable | fill local-only after unix user discovery succeeds | Yes | wrong path |
## 2026-05-06 Availability HOLD Hardening Update

| Area | Current status | Ready? | Blocker | Next Goal | Human approval? | Risk |
|------|----------------|--------|---------|-----------|-----------------|------|
| WSL selected distro availability | selectedSlot=slot-02 resolved; inventory matched; both discovery methods failed | HOLD | selected distro availability not human-confirmed | wait for `slot-02 availability: ok/failed/choose_another_slot` | Yes | unavailable or wrong distro |
| Control Center WSL status | redacted HOLD reason model prepared | yes-readonly | execution remains forbidden | display/read-only monitoring only | Yes | confusing HOLD with execution |
| WSL wrapperPath fill-in | not performed | no | unixUser unavailable | only after availability ok and discovery succeeds | Yes | wrong path |
## 2026-05-07 Control Center HOLD Status Sprint Update

| Area | Current status | Ready? | Blocker | Next Goal | Human approval? | Risk |
|------|----------------|--------|---------|-----------|-----------------|------|
| Control Center WSL HOLD display | selectedSlot availability blocker shown as slot-only redacted status | yes-readonly | user-side availability confirmation missing | wait for `slot-02 availability: ok/failed/choose_another_slot` | Yes | confusing HOLD with execution |
| Raw value leakage guard | parser/tests check slot-only availability status | partial | broader UI/E2E not run | continue read-only guard tests | Yes | accidental path/user leak |
| WSL execution | disabled | no | HOLD state | separate gated Goal only after human confirmation | Yes | execution boundary crossing |
## 2026-05-07 Legacy GET_SNAPSHOT IPC Blocker Fix

| Area | Current status | Ready? | Blocker | Next Goal | Human approval? | Risk |
|------|----------------|--------|---------|-----------|-----------------|------|
| Legacy GET_SNAPSHOT IPC | retired from registered channels and handlers | yes-readonly | none in this scope | Claude Code re-review B-1 | No | stale clients expecting legacy channel |
| Raw API arrays on IPC wire | guarded by tests for app snapshot path and legacy channel absence | yes-readonly | broader review pending | read-only review | No | future regression |
| Preload namespace | `getAppSnapshot` only | yes-readonly | none in this scope | keep namespace guard | No | channel sprawl |
## 2026-05-07 Docs Cleanup / Tech Debt Tracking

| Area | Current status | Ready? | Blocker | Next Goal | Human approval? | Risk |
|------|----------------|--------|---------|-----------|-----------------|------|
| getAppSnapshot canonical docs | updated in primary contracts | yes-readonly | historical docs may still mention retired name as context | optional historical docs sweep | No | stale wording |
| Legacy getSnapshot | retired/deprecated annotation added | yes-readonly | none in code path | keep re-registration guard tests | No | accidental revival |
| redactedSummaryLines slimming | removed from GET_APP_SNAPSHOT wire payload; validator report keeps Signoff-only lines | yes-readonly | keep regression guard | snapshot guard tests during future changes | No | accidental reintroduction |
## 2026-05-07 Selected Slot Failed / Reselection Flow

| Area | Current status | Ready? | Blocker | Next Goal | Human approval? | Risk |
|------|----------------|--------|---------|-----------|-----------------|------|
| WSL selected slot | selectedSlot=slot-02; availability=failed; reason=distro_not_in_current_wsl_list | HOLD | selected slot is not usable in current WSL inventory | choose another slot ID only | Yes | wrong distro selection |
| Slot reselection | slot IDs only; raw distro names not reported | partial | human must choose next slot | selected slot resolution after slot ID choice | Yes | raw value leakage |
| WSL execution | disabled | no | HOLD state | separate gated Goal only after safe selection | Yes | execution boundary crossing |
## 2026-05-07 Refreshed Slot Inventory

| Area | Current status | Ready? | Blocker | Next Goal | Human approval? | Risk |
|------|----------------|--------|---------|-----------|-----------------|------|
| WSL current inventory | refreshed; distroCount=3; selectableSlots=slot-01/slot-02/slot-03 | HOLD | selectedSlot is none | user selects one slot ID only | Yes | wrong slot selection |
| Previous selected slot | slot-02 failed with reason=distro_not_in_current_wsl_list | no | old slot is not usable | do not reuse old slot without fresh selection | Yes | stale slot map |
| WSL execution | disabled | no | no selected slot and no unix user | separate gated Goal after slot selection | Yes | execution boundary crossing |
## 2026-05-07 Refreshed Selected Slot Recorded

| Area | Current status | Ready? | Blocker | Next Goal | Human approval? | Risk |
|------|----------------|--------|---------|-----------|-----------------|------|
| WSL selected slot | selectedSlot=slot-01 from refreshed inventory | HOLD | availability not verified; unixUser unresolved | verify selected slot availability locally / bounded discovery goal | Yes | wrong or unavailable distro |
| Previous failed slot | slot-02 failed with reason=distro_not_in_current_wsl_list | no | stale slot | keep as redacted history only | No | stale selection reuse |
| WSL execution | disabled | no | no `wsl.exe -d` approval in this goal | separate gated Goal | Yes | execution boundary crossing |
## 2026-05-07 Slot-01 Availability Failed / Inventory Consistency

| Area | Current status | Ready? | Blocker | Next Goal | Human approval? | Risk |
|------|----------------|--------|---------|-----------|-----------------|------|
| WSL selected slot | slot-01 availability=failed; reason=distro_not_in_current_wsl_list | HOLD | selected slot cannot be trusted for unixUser discovery | refresh or validate slot inventory consistency | Yes | stale / mismapped slot |
| Inventory consistency | matched by redacted count/order/content enum; counts 3 / 3 | partial | raw names remain hidden, no user-facing resolution yet | consistency review without raw disclosure | Yes | false confidence if raw map stale |
| WSL execution | disabled | no | no safe selected distro | separate gated Goal only after consistency review | Yes | execution boundary crossing |
## 2026-05-07 Count-Matched Inventory Mismatch Classification

| Area | Current status | Ready? | Blocker | Next Goal | Human approval? | Risk |
|------|----------------|--------|---------|-----------|-----------------|------|
| Inventory count | inventoryCountConsistency=matched, counts 3 / 3 | yes-redacted | content differs by slot | choose matched slot ID or rebuild map | Yes | count-only false confidence |
| Inventory content | inventoryContentConsistency=partial; slot-01 mismatch, slot-02/slot-03 matched | HOLD | selected slot failed | choose_matched_slot_id | Yes | wrong slot selection |
| WSL execution | disabled | no | no selected matched slot verified | separate gated discovery Goal | Yes | execution boundary crossing |
| Legacy inventoryConsistency wording | retired for new summaries; split fields required | HOLD | old wording could imply full content match | keep inventoryCountConsistency=matched and inventoryContentConsistency=partial | Yes | ambiguous status wording |
| Raw values reported | rawValuesReported=false | yes-redacted | raw values remain local-only | choose_matched_slot_id using slot IDs only | Yes | raw value leakage |

## 2026-05-07 Local-Only Slot Map Repair HOLD

| Area | Current status | Ready? | Blocker | Next Goal | Human approval? | Risk |
|------|----------------|--------|---------|-----------|-----------------|------|
| Slot selection | selectedSlot=unresolved; previousSelectedSlot=slot-01 | HOLD | distro_name_mismatch and clean exact-match inputs unavailable | update_local_only_slot_map_or_hold | Yes | wrong distro selection |
| Exact-match readiness | not_ready | no | placeholder/corrupted/null-or-empty quality states remain local-only | repair local-only values without raw disclosure | Yes | false match from visual similarity |
| Execution | disabled; productionReady=false; pendingPackagingResolution=true | no | HOLD state | separate gated goal only after exact match | Yes | execution boundary crossing |

## 2026-05-07 Human-Confirmed Matched Slot

| Area | Current status | Ready? | Blocker | Next Goal | Human approval? | Risk |
|------|----------------|--------|---------|-----------|-----------------|------|
| Slot confirmation | selectedSlot=slot-02; selectedSlotStatus=matched; matchCount=1 | HOLD | packaging safety gate unresolved | resolve_packaging_safety_gate | Yes | confusing selection with execution approval |
| Previous selected slot | previousSelectedSlot=slot-01; previousSelectedSlotStatus=mismatch | no | mismatch history | keep as redacted history | No | stale slot reuse |
| Execution | disabled; productionReady=false; pendingPackagingResolution=true | no | HOLD state | packaging safety gate review only | Yes | execution boundary crossing |

## 2026-05-07 Packaging Safety Gate Readiness

| Area | Current status | Ready? | Blocker | Next Goal | Human approval? | Risk |
|------|----------------|--------|---------|-----------|-----------------|------|
| Packaging safety gate | packagingGateStatus=resolved_without_execution; packagingRiskLevel=low; packagingBlockers=none | yes-readonly | non-execution review still required | review_non_execution_readiness_before_go_policy | Yes | confusing readiness with execution approval |
| Slot confirmation | selectedSlot=slot-02; selectedSlotStatus=matched; exactMatchResult=single_match; matchCount=1 | HOLD | execution remains forbidden | review_non_execution_readiness_before_go_policy | Yes | wrong transition to GO |
| Execution | disabled; canRunWsl=false; canRunHermes=false; canRunWrapper=false; canRunOnce=false | no | HOLD state | separate explicit execution goal only | Yes | execution boundary crossing |
| Production readiness | productionReady=false; pendingPackagingResolution=true | no | full Signoff evidence not complete | keep Signoff gate explicit | Yes | premature productionReady |
| Raw values reported | rawValuesReported=false | yes-redacted | raw values remain local-only | keep reports enum-only | Yes | raw value leakage |

## 2026-05-07 Exact-Match Validation After Local-Only Update

| Area | Current status | Ready? | Blocker | Next Goal | Human approval? | Risk |
|------|----------------|--------|---------|-----------|-----------------|------|
| Exact match | exactMatchResult=no_match; matchedSlotCount=0 | no | no exact slot ID match | update_local_only_slot_map_or_hold | Yes | false positive match |
| Slot selection | selectedSlot=unresolved | HOLD | validation only; no automatic selection | repair local-only exact-match inputs | Yes | wrong distro selection |
| Execution | disabled; productionReady=false; pendingPackagingResolution=true | no | HOLD state | separate gated goal only after exact match and human confirmation | Yes | execution boundary crossing |
