# Morning Review Report

（**2026-05-05 追記**：**WSL local value fill-in 手順確認 / namespace 明確化 / 日付整合チェック** — `HERMES_WSL2_WRAPPER_USER_NEXT_ACTION_CHECKLIST.md` と `DATE_CONSISTENCY_NOTES.md` を追加。Control Center の `getAppSnapshot` only は **Ichikishima Control Center namespace 限定**で、既存 `window.hermesAPI` は別 namespace。2026-05-06 / 2026-05-07 は **human confirmation pending**。**wsl.exe・実 Hermes・execFile 実機・Electron 起動なし**。）

（**2026-05-05 追記**：**WSL local-only value file creation** — `wsl-wrapper-values.local.json` を local-only に作成。**gitignored / untracked / unstaged**。raw 値は report / docs / Git に出していない。ユーザー実値は未提供のため推測記入せず、validator 実ファイル読込は次 Goal。**wsl.exe・実 Hermes・execFile 実機・Electron 起動なし**。）

（**2026-05-05 追記**：**WSL local-only validator / redacted summary / Signoff pipeline** — local-only file reader + validator + Control Center safe summary + Signoff result section を追加。placeholder / 未確認値は `HOLD`、危険値は `REJECT`、完全検証は redacted Signoff review 用 `GO`。raw 値は report / docs / Git に出さない。**wsl.exe・実 Hermes・execFile 実機・Electron 起動なし**。）

（**2026-05-06 追記**：**WSL local values validation → redacted Signoff preparation → dummy wrapper manual placement design** — redacted-only 再確認は `HOLD`（present=13 / missing=0 / placeholder=6 / rejected=0）。`HERMES_WSL2_DUMMY_WRAPPER_MANUAL_PLACEMENT_PLAN.md` を追加。WSL内配置・wrapper実行・`wsl.exe`・実 Hermes・execFile 実機なし。raw 値は report / docs / Git に出していない。）

（**2026-05-06 追記**：**WSL local-only values fill-in completion + validator rerun** — redacted-only rerun は `HOLD`（present=13 / missing=0 / placeholder=6 / rejected=0）。raw 値は report / docs / Git に出していない。次はユーザーが local-only values を埋めて再 validator。）

（**2026-05-06 追記**：**WSL pre-execution readiness pack** — readiness matrix を local values / redacted Signoff / dummy placement / dummy validation / pre-signoff / `wsl.exe` / real Hermes / `execFile` に分離。実行系は not ready。`GO` は redacted Signoff review のみ。）

（**2026-05-03**：**WSL2 local value fill-in / redacted Signoff 準備** — `HERMES_WSL2_WRAPPER_LOCAL_VALUE_FILL_IN_RUNBOOK.md`・`HERMES_WSL2_WRAPPER_VALUE_SIGNOFF.md`・`validateLocalOnlyValuePacketShape` / `summarizeRedactedLocalValuePacket`。**実値未入力・`wsl.exe` / execFile 未**。**2026-05-03**：**WSL2 human value packet** — `HERMES_WSL2_WRAPPER_HUMAN_VALUE_PACKET.md`・`hermes-wsl2-wrapper-human-value-packet.ts`・Snapshot `wsl2HumanValue*`。Sysnative **V1 拒否**。**値の実コミット・実行なし**。**2026-05-03**：**WSL2 wrapper — 値確認 SPEC + dummy `.sh.sample` + registry allowlist／wrapper path 厳格化** — `HERMES_WSL2_WRAPPER_VALUE_CONFIRMATION.md`・Sysnative は **コード未許可**・`registryVersion`/`logLevel` メタ。**wsl 配置・`wsl.exe` 実行・execFile 実機なし**。**2026-05-03**：**WSL2 Hermes Wrapper parameter registry** — SPEC + `hermes-wsl2-wrapper-parameter-registry.ts` + Vitest。Control Center Snapshot に安全サマリ。**`wsl.exe`・実 Hermes・execFile 実機・child_process は未**。**2026-05-03**：**packaged short launch smoke 設計・runner 契約・`control-center-packaged-short-launch-contract.ts`（実起動なし）** — `CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_*`・Signoff Short launch **テンプレのみ**。**Codex handoff 文書なし**。**2026-05-03**：**electron-vite build smoke（Stage 1）** — `npm run build`（`typecheck` + `electron-vite build`）。**packaged 短命起動・installer・`electron-builder` なし**。`pendingPackagingResolution:true` / `productionReady:false` 維持。**2026-05-07**：**dummy process test local-only 化** — 静的 `dummy-hermes-stub-design-static.test.ts` を CI 既定、`spawnSync` は `RUN_DUMMY_HERMES_LOCAL_PROCESS` + 明示 `vitest run` のみ。**2026-05-06**：**Final Read-only Validation Pack** — A: packaged smoke 自動未実施（Signoff 記録）/ B: Control Center read-only UI polish / C: dummy CJS + Vitest node 1 回経路。**実 Hermes・wsl.exe・Electron 短命起動・npm install なし**。**2026-05-05（続）**：**packaged path smoke 設計** — SPEC / Signoff テンプレ / checklist helper + Vitest。実短命起動は未。**2026-05-05 追記**：**Control Center packaged path resolver** — `CONTROL_CENTER_PROJECT_ROOT_RESOLUTION_SPEC.md` + 実装 + UI ラベル。**実 packaged 起動検証は未**。**2026-05-03 追記**：**Controlled Pilot 実機前準備** — discovery／runbook／許可／結果テンプレ、config／preflight／summary コード。**実Hermes起動・`execFile` 実運用は未**。次はユーザーがパス／argv／signoff を揃えた Goal のみ。**2026-05-05**：**WSL2 ADR** — ネイティブ `hermes.exe` 前提撤去、`wsl.exe`+wrapper 契約文書、config に `adapterKind`。**2026-05-03（続）**：**App Management Foundation + Final Preparation Pack（read-only / dry-run stub）** — rooms／app snapshot／readonly IPC準備、`hermes-wsl2-wrapper-config`、Approval/Audit・Memory summaries、Visualization／Agent Team メタ、`HERMES_WSL2_DUMMY_WRAPPER_PLAN.md` + sandbox dummy（自動実行しない）、matrix／runbook。`productionReady:false`。**Electron main 恒久 IPC・実Hermes／WSL 起動無し**。）

## 1. どこまで完了したか

Hermes Autonomy Zoneは、ローカルSandbox内で安全に試験運用できる最小状態まで到達した。

イツキシマは、Shadow Modeの仕様書、状態モデル、沈黙ゲートスタブ、Hermesレポート審査スタブ、可視化イベント型まで作成した。

## 2. Hermes Autonomy ZoneはREADY_FOR_LOCAL_PILOTか

`READY_FOR_LOCAL_PILOT`

意味:

- ローカルSandbox内の試験運用に入れる。
- Hermes本体完全連携や本番運用を意味しない。
- 外部通信、git操作、既存EA/MT5連携を許可するものではない。

## 3. イツキシマはSHADOW_MODE_READYか

`SHADOW_MODE_READY`

意味:

- 自動発話しない。
- 通知しない。
- memory DBを更新しない。
- Hermes変更レポートを審査するための最小型とスタブがある。

## 4. 実行したテスト

```text
npm test -- tests/hermes/zone/config.test.ts tests/hermes/zone/denylist.test.ts tests/hermes/zone/path-guard.test.ts tests/hermes/zone/read-policy.test.ts tests/hermes/zone/read-wrapper.test.ts tests/hermes/zone/write-policy.test.ts tests/hermes/zone/write-wrapper.test.ts tests/hermes/zone/delete-wrapper.test.ts tests/hermes/zone/operation-blocks.test.ts tests/hermes/zone/approval-request.test.ts tests/hermes/zone/autonomy-zone-smoke.test.ts tests/hermes/zone/autonomy-zone-pilot.test.ts tests/ichikishima/core/state.test.ts tests/ichikishima/core/silence-gate.test.ts tests/ichikishima/review/hermes-report-reviewer.test.ts tests/ichikishima/visualization/events.test.ts
npm run typecheck:node
npx eslint src/main/ichikishima/autonomy-zone src/main/ichikishima/core src/main/ichikishima/review src/main/ichikishima/visualization tests/hermes/zone tests/ichikishima
```

## 5. 成功したテスト

- 関連テスト: 18ファイル / 101件成功。
- Node側typecheck: 成功。
- 対象ESLint: 成功。
- ReadLints: この範囲では問題を検出していません。

## 6. 失敗したテスト

最終状態で失敗したテストはない。

途中でESLintが `silence-gate.ts` の未使用引数を検出したため、`void input` で明示的にスタブ引数として扱うよう修正し、再実行で成功した。

## 7. 未実行テスト

- Electron起動。
- UIテスト。
- 全体アプリテスト。
- 実監査ログ保存テスト。
- AuditLogger／正規化パイプライン単体テスト（仕様のみ作成、コード未実装）。
- 承認キューUI/実行テスト。
- Hermes本体連携テスト。
- イツキシマ自動発話/通知テスト。

## 8. 触っていない重要領域

- 既存EA本体。
- MT5関連。
- `.env`。
- APIキー。
- secrets。
- memory DB。
- 本番設定。
- git push。
- 外部通信。
- 自動売買関連。
- 取引履歴。
- 個人情報。

## 9. 作成・変更ファイル一覧

Hermes Autonomy Zone:

- `src/main/ichikishima/autonomy-zone/approval-request.ts`
- `src/main/ichikishima/autonomy-zone/delete-wrapper.ts`
- `src/main/ichikishima/autonomy-zone/operation-blocks.ts`
- `src/main/ichikishima/autonomy-zone/write-wrapper.ts`
- `src/main/ichikishima/autonomy-zone/types.ts`
- `src/main/ichikishima/autonomy-zone/index.ts`
- `tests/hermes/zone/autonomy-zone-pilot.test.ts`
- `tests/hermes/zone/autonomy-zone-smoke.test.ts`
- `tests/hermes/zone/approval-request.test.ts`
- `tests/hermes/zone/delete-wrapper.test.ts`
- `tests/hermes/zone/operation-blocks.test.ts`
- `tests/hermes/zone/write-wrapper.test.ts`

Runbook / Readiness / Pilot:

- `docs/ichikishima/HERMES_AUTONOMY_ZONE_RUNBOOK.md`
- `docs/ichikishima/HERMES_AUTONOMY_ZONE_READINESS_CHECKLIST.md`
- `docs/ichikishima/IMPLEMENTATION_HANDOFF.md`
- `sandbox/hermes-autonomy-zone/README.md`
- `sandbox/hermes-autonomy-zone/sample/safe-sample.txt`
- `sandbox/hermes-autonomy-zone/output/.gitkeep`
- `sandbox/hermes-autonomy-zone/tmp/.gitkeep`

Ichikishima Shadow Mode:

- `docs/ichikishima/ICHIKISHIMA_SHADOW_MODE_SPEC.md`
- `docs/ichikishima/HERMES_REPORT_REVIEW_SPEC.md`
- `src/main/ichikishima/core/state.ts`
- `src/main/ichikishima/core/silence-gate.ts`
- `src/main/ichikishima/review/hermes-report-reviewer.ts`
- `src/main/ichikishima/visualization/events.ts`
- `tests/ichikishima/core/state.test.ts`
- `tests/ichikishima/core/silence-gate.test.ts`
- `tests/ichikishima/review/hermes-report-reviewer.test.ts`
- `tests/ichikishima/visualization/events.test.ts`

## 10. 残っているリスク

- `writeZoneFile` はZone内の許可済みテキスト書き込みを実行するため、今後Hermes本体に接続する前に呼び出し経路のレビューが必要。
- 監査ログ本体はまだ保存しないため、現時点ではaudit event candidateを呼び出し側が保持する必要がある。
- approval request candidateは生成のみで、承認UIや実行制御はまだない。
- イツキシマはShadow Modeであり、判断精度の実運用評価はまだ。

## 11. 次にやるべきこと

1. このレポートとReadiness Checklistを人間が確認する。
2. ChatGPTへレビュー依頼を出す。
3. 監査ログ本体の仕様書とテスト設計を作る。
4. 承認キューUI/実行の仕様書とテスト設計を作る。
5. Hermes本体連携は、その後に限定的な接続仕様から始める。

## 12. ChatGPTにレビュー依頼すべき内容

```text
【ChatGPTレビュー依頼】

現在のStep:
Hermes Autonomy Zone READY_FOR_LOCAL_PILOT / Ichikishima SHADOW_MODE_READY

今回やったこと:
- Hermes Autonomy Zoneのsafe read/write、危険操作ブロック、approval request candidate、auditEventCandidate、pilot workspace、smoke testを整備
- イツキシマShadow Modeの仕様、状態モデル、沈黙ゲートスタブ、Hermesレポート審査スタブ、可視化イベント型を整備

判断してほしいこと:
1. READY_FOR_LOCAL_PILOTとして承認してよいか
2. SHADOW_MODE_READYとして承認してよいか
3. 監査ログ本体へ進む前の不足仕様はあるか
4. Hermes本体連携前に追加すべき安全テストはあるか
5. 危険な見落としがあるか

制約:
- 既存EA本体、MT5、.env、APIキー、secrets、memory DB、本番設定、git push、外部通信には触れていない
- delete / execute / network / gitは実行せずブロックのみ
- イツキシマは自動発話、通知、memory DB更新をしない
```

## 13. ユーザーが朝確認すべき項目

1. `docs/ichikishima/HERMES_AUTONOMY_ZONE_READINESS_CHECKLIST.md`
2. `docs/ichikishima/MORNING_REVIEW_REPORT.md`
3. 最後の変更レポート
4. `sandbox/hermes-autonomy-zone/README.md`
5. `docs/ichikishima/ICHIKISHIMA_SHADOW_MODE_SPEC.md`

## 14. 本稼働に進めない理由

ここでいう本稼働を「ローカルSandbox内試験運用」とするなら進める。

ただし、次はまだ禁止:

- Hermes本体完全連携。
- 既存EA/MT5連携。
- 外部通信。
- git操作。
- delete / execute / networkの実行。
- イツキシマ自動発話。
- memory DB自動更新。

## 15. まだ禁止される操作

- 実delete。
- 実execute。
- 実network。
- 実git操作。
- git push。
- 外部送信。
- npm install / 依存追加。
- UI実装。
- Electron起動周り変更。
- MT5/EA。
- memory DB。
- `.env` / APIキー / secrets。

## 16. Goal形式プロンプト後の追加完了内容

追加Goalで完了したこと:

- Hermes本体連携前レビュー基盤を作成。
- イツキシマReview Mode仕様、型、安全側判定、テストを追加。
- 話す価値スコア仕様、型、安全側判定、テストを追加。
- Memory Governance仕様を作成し、Memory Designへ接続。
- Agent Team Architectureを作成。
- Local / Cloud Escalation Policyを作成し、Cursor Agent Escalationへ接続。
- Agent Visualization Implementation Planを作成し、Requirementsへ接続。
- Suppressive Agent Architectureを作成。
- NEXT_GOALSとGOAL_COMPLETION_REPORTを作成。

## 17. READY状態

- Hermes Autonomy Zone: `READY_FOR_LOCAL_PILOT` 維持。
- Ichikishima: `SHADOW_MODE_READY` 維持。

## 18. 追加Goalで実行したテスト

```text
npm test -- tests/ichikishima/review/review-mode.test.ts tests/ichikishima/core/speak-value.test.ts
npm run typecheck:node
```

最終検証結果:

- 関連テスト: 18ファイル / 101件成功。
- Node側typecheck: 成功。
- 対象ESLint: 成功。
- 禁止操作混入検索: 実行コードは検出なし。`git push` はHermesレポート審査用の禁止語リスト内のみ検出。

## 19. 次に実装すべきGoal候補

詳細は `NEXT_GOALS.md` を参照する。

優先候補:

1. イツキシマReview Mode実装Goal。
2. 記憶候補管理Goal。
3. Hermes本体連携前レビューGoal。
4. 承認UI設計Goal。
5. 可視化V1 Goal。

## 20. ChatGPTにレビュー依頼すべき内容

```text
【ChatGPTレビュー依頼】

現在の状態:
- Hermes Autonomy Zone: READY_FOR_LOCAL_PILOT
- Ichikishima: SHADOW_MODE_READY
- Goal: 実運用前コアの設計・型・安全側スタブ・テスト・レビュー資料を整備済み

確認してほしいこと:
1. Hermes本体連携前レビュー基盤に不足がないか
2. Review Modeの判定項目が安全か
3. Speak Value Scoreが自動発話へ進みすぎていないか
4. Memory Governanceがmemory DB直接操作を防げているか
5. Agent Team構想が無秩序なAI会議になっていないか
6. Local/Cloud Escalationで渡してはいけない情報が明確か
7. Visualization計画がUI実装や依存追加へ進みすぎていないか
8. 次に選ぶべきGoalは何か

制約:
- 既存EA/MT5/.env/APIキー/secrets/memory DB/本番設定/git push/外部通信には触れていない
- 自動発話、通知、memory DB更新、Hermes本体完全接続は未実装
```

## 21. Review Mode実用化Goalの追加完了内容

追加で完了したこと:

- `evaluateReviewMode` が変更レポート文字列または構造化入力を受け取れるようになった。
- 禁止領域、外部通信、git push、依存追加、MT5、EA本体、`.env`、secrets、memory DB、自動発話、通知を高リスク検出できるようになった。
- 実行テスト、未実行テスト、戻し方、触っていない重要領域を確認できるようになった。
- 実装コード変更で実行テストがない場合は `hold` に倒すようにした。
- 次工程がHermes本体連携など高リスク境界の場合は `nextStepRisk` に入るようにした。
- `reviewHermesReport` をReview Mode実用判定に接続した。

維持したこと:

- 自動承認しない。
- 自動発話しない。
- 通知しない。
- memory DB更新しない。
- 外部通信しない。
- Hermes本体完全連携しない。

追加テスト:

```text
npm test -- tests/ichikishima/review/hermes-report-reviewer.test.ts tests/ichikishima/review/review-mode.test.ts
npm test -- tests/ichikishima/review/hermes-report-reviewer.test.ts tests/ichikishima/review/review-mode.test.ts tests/ichikishima/core/state.test.ts tests/ichikishima/core/silence-gate.test.ts tests/ichikishima/core/speak-value.test.ts tests/ichikishima/visualization/events.test.ts
npm run typecheck:node
npx eslint src/main/ichikishima/review tests/ichikishima/review
```

最終検証結果:

- Review関連テスト: 6ファイル / 25件成功。
- Node側typecheck: 成功。
- Review対象ESLint: 成功。
- ReadLints: この範囲では問題を検出していません。
- 禁止操作混入検索: 実行コードは検出なし。`git push` はReview Modeの禁止語検出リスト内のみ検出。

## 22. Memory Candidate / Memory Agent候補Goalの追加完了内容

追加で完了したこと:

- `MEMORY_CANDIDATE_SPEC.md` を作成。
- `MEMORY_AGENT_SPEC.md` を作成。
- `MEMORY_GOVERNANCE_SPEC.md` にMemory Candidate管理を追記。
- `src/main/ichikishima/memory/memory-candidate.ts` を追加。
- `extractMemoryCandidates` で記憶候補の抽出・分類・拒否候補化を実装。
- `tests/ichikishima/memory/memory-candidate.test.ts` を追加。

維持したこと:

- memory DBを読まない。
- memory DBへ書かない。
- SQLite接続しない。
- 既存memory機能へ直接接続しない。
- 自動保存しない。
- safety policyを自動更新しない。
- long-term profileを自動更新しない。
- 外部通信しない。
- UI実装しない。
- 自動発話/通知しない。

追加テスト:

```text
npm test -- tests/ichikishima/memory/memory-candidate.test.ts
npm test -- tests/ichikishima/memory/memory-candidate.test.ts tests/ichikishima/review/hermes-report-reviewer.test.ts tests/ichikishima/review/review-mode.test.ts tests/ichikishima/core/state.test.ts tests/ichikishima/core/silence-gate.test.ts tests/ichikishima/core/speak-value.test.ts tests/ichikishima/visualization/events.test.ts
npm run typecheck:node
npx eslint src/main/ichikishima/memory tests/ichikishima/memory
```

最終検証結果:

- Memory関連テスト: 7ファイル / 37件成功。
- Node側typecheck: 成功。
- Memory対象ESLint: 成功。
- ReadLints: この範囲では問題を検出していません。
- 禁止操作混入検索: DB接続、SQLite接続、外部通信、危険操作コードは検出なし。`git push禁止` は安全ポリシー分類語内のみ検出。

## 23. Approval Report UI/CLI前段Goalの追加完了内容

追加で完了したこと:

- `APPROVAL_REPORT_SPEC.md` を作成。
- `src/main/ichikishima/approval/approval-report.ts` を追加。
- `createApprovalReport` でReview Mode結果を承認レポートへ変換できるようにした。
- `renderApprovalReportMarkdown` でユーザー向けMarkdownを生成できるようにした。
- `renderApprovalReportJson` で機械向けJSONを生成できるようにした。
- Memory Candidate結果の要約を承認レポートに含められるようにした。
- 秘密情報らしき文字列をマスクする処理を追加した。
- `tests/ichikishima/approval/approval-report.test.ts` を追加。

維持したこと:

- UI実装しない。
- Electron / React画面を作らない。
- 自動承認しない。
- 承認実行処理を作らない。
- ファイル反映処理を作らない。
- Hermes本体完全連携しない。
- memory DBを読まない、書かない。
- 外部通信しない。
- git操作しない。
- npm install / 依存追加しない。

追加テスト:

```text
npm test -- tests/ichikishima/approval/approval-report.test.ts
npm test -- tests/ichikishima/approval/approval-report.test.ts tests/ichikishima/memory/memory-candidate.test.ts tests/ichikishima/review/hermes-report-reviewer.test.ts tests/ichikishima/review/review-mode.test.ts tests/ichikishima/core/state.test.ts tests/ichikishima/core/silence-gate.test.ts tests/ichikishima/core/speak-value.test.ts tests/ichikishima/visualization/events.test.ts
npm run typecheck:node
npx eslint src/main/ichikishima/approval tests/ichikishima/approval
```

最終検証結果:

- Approval関連テスト: 8ファイル / 44件成功。
- Node側typecheck: 成功。
- Approval対象ESLint: 成功。
- ReadLints: この範囲では問題を検出していません。
- 禁止操作混入検索: UI、外部通信、DB接続、SQLite接続、危険操作コード、git pushは検出なし。

## 24. 監査ログ本体仕様・テスト設計Goalの追加完了内容

追加で完了したこと:

- `AUDIT_LOG_SPEC.md` を作成（目的、`auditEventCandidate` / `AuditLogRecord`、保存可/不可、`kind`、保存先候補、append-only、マスク、サイズ・ローテーション案、実装しない範囲）。
- `AUDIT_LOG_TEST_PLAN.md` を作成（TC-AUD-* 形式のテスト設計のみ。コード・Vitest は追加していない）。
- `IMPLEMENTATION_HANDOFF.md` に監査ログセクションと次工程（AuditLogger スタブ）を追記。
- `GOAL_COMPLETION_REPORT.md` に本Goalの達成記録を追記。

維持したこと:

- `src/` と `tests/` の追加・変更なし。
- ファイル/DB 書き込み、SQLite、memory DB、外部通信なし。
- npm install / 依存追加なし。
- UI、AuditLogger 実装、Hermes本体連携なし。

本ステップにおける検証:

- 本Goalは **ドキュメントのみ**のため **`npm test` / typecheck / ESLint は実行していない**（コード差分が無い）。

次の推奨検証（別Goalで実施）:

- AuditLogger スタブ・型追加後に、該当範囲の unit テストと typecheck を実行する。

## 25. AuditLogger スタブ・型・仕様準拠テスト Goal の追加完了内容

追加で完了したこと:

- `src/main/ichikishima/audit/audit-log.ts` と `src/main/ichikishima/audit/index.ts` を追加。
- `NormalizeAuditEventInput` と `normalizeAuditEvent` / `createAuditLogRecord`、`maskAuditSensitiveText`、`saveAuditLog`（`NOT_IMPLEMENTATION`）。
- `tests/ichikishima/audit/audit-log.test.ts` を追加。
- `IMPLEMENTATION_HANDOFF.md` / `GOAL_COMPLETION_REPORT.md` / `AUDIT_LOG_SPEC.md` を更新。

（注）`saveAuditLog` の実ファイル追記は、この後記載の **§26 Goal** で追加された。

維持したこと:

- `saveAuditLog` はファイル/DB に書き込まない。
- 外部通信、memory DB、`npm install` / 依存追加、Hermes本体連携なし。

追加テスト:

```text
npm test -- tests/ichikishima/audit/audit-log.test.ts
npm test -- tests/ichikishima/
npm run typecheck:node
npx eslint src/main/ichikishima/audit tests/ichikishima/audit
```

最終検証結果:

- Ichikishima テスト: 9ファイル / 56件成功（`audit-log.test.ts` を含む）。
- Node側typecheck: 成功。
- Audit 対象ESLint: 成功。
- ReadLints: この範囲では問題を検出していません。

## 26. AuditLogger 最小実装（JSONL・Zone sandbox）Goal の追加完了内容

追加で完了したこと:

- `src/main/ichikishima/audit/audit-save.ts` を追加し、`saveAuditLog(record, SaveAuditLogOptions)` で Hermes autonomy zone 以内に **`audit-<UTC日付>.jsonl` を追記**できるようにした（`appendFileSync` のみ）。
- `sanitizeRecordForPersistence`（`audit-log.ts`）により、保存前に `content` 混入拒否、`contentIncluded:false` 強制、**8 KiB** 上限検証を実施。
- `sandbox/hermes-autonomy-zone/audit/README.md` と `.gitkeep` を追加。
- `AUDIT_LOG_SPEC.md` / `AUDIT_LOG_TEST_PLAN.md` / `IMPLEMENTATION_HANDOFF.md` / `GOAL_COMPLETION_REPORT.md` を更新。

維持したこと:

- SQLite/memory DB、Electron userData 既定、自動ローテーション、Hermes メイン自動連携、外部通信、UI、`npm install` / 依存追加なし。

検証:

```text
npm test -- tests/ichikishima/audit/audit-log.test.ts
npm test -- tests/ichikishima/
npm run typecheck:node
npx eslint src/main/ichikishima/audit tests/ichikishima/audit
```

最終検証結果:

- Ichikishima テスト: 9ファイル / 69件成功。
- Node側typecheck: 成功。
- ReadLints（当該ソース）: この範囲では問題を検出していません。

## 27. Approval Queue Core（sandbox JSONL）Goal の追加完了内容

追加で完了したこと:

- `docs/ichikishima/APPROVAL_QUEUE_SPEC.md` を追加し、`ApprovalQueueItem` / 状態 / append-only / 監査連携方針を明文化（Windows symlink/junction は通常CI必須としない旨を含む）。
- `src/main/ichikishima/approval/approval-queue*.ts` と `tests/ichikishima/approval/*.test.ts` を追加（queue / store / adapters / pilot）。
- `ApprovalQueueItem` の `requiresUserApproval:true` / `autoExecutable:false` を不変化、`UUID` 形状の `approvalId` がマスク規則で衝突しないよう保護。
- `saveApprovalQueueItem` / `readApprovalQueueItems` / `appendApprovalQueueStatusEvent` が **Zone 検証済み `approval/` のみ**へ JSONL 追記する。
- `AuditLogRecord.kind` に `approval_queue_item_created` / `approval_queue_status_changed` を追加し、`saveAuditLog` と接続可能な候補を返す。

維持したこと:

- Hermes本体自動連携なし、実行エンジンなし、UIなし、SQLite/userData、外部通信、`npm install` / 依存追加、git、`MT5`/EA、`.env`/secrets 読取なし。

検証コマンド（推奨バンドル）:

```text
npx vitest run tests/ichikishima/approval tests/ichikishima/audit tests/hermes/zone/autonomy-zone-pilot.test.ts
npm run typecheck:node
npx eslint src/main/ichikishima/approval src/main/ichikishima/audit tests/ichikishima/approval tests/ichikishima/audit
```

最終検証結果（本セッション時点）:

- 上記Vitestバンドル / typecheck / ESLint は成功。
- IDE診断は当該ソース範囲で「この範囲では問題を検出していません」。

## 28. Ichikishima Control Center（V0 仕様のみ）Goal の追加完了内容

追加で完了したこと:

- `CONTROL_CENTER_SPEC.md`：目的・アプリ方針・状態バッジ・セキュリティ・V0 でやらないこと。
- `CONTROL_CENTER_ARCHITECTURE.md`：FE 候補比較表、論理バックエンド API、レイヤ構成。
- `CONTROL_CENTER_ROOMS.md`：Hermes / Ichikishima / Approval / Audit / Memory / Visualization / Escalation の Room 要件。
- `CONTROL_CENTER_PIPELINES.md`：許可パイプライン案と恒久禁止リスト。
- `CONTROL_CENTER_IMPLEMENTATION_PLAN.md`：V0〜V7 と hermes-desktop との分担。
- `IMPLEMENTATION_HANDOFF.md` / `GOAL_COMPLETION_REPORT.md` / `NEXT_GOALS.md` に **並行実装しない境界** を追記。

維持したこと:

- **UI・Electron/React・依存追加・外部通信・Hermes本体・memory DB・MT5/EA・自動発話**に未着手。

検証:

- **ドキュメントのみ**のため自動テストの追加なし。**実装コード変更なし**。

最終確認:

- この範囲では問題を検出していません。

## 29. （追記・2026-05-03）Hermes Bridge + Local Pilot Full Loop & read-only Status

ハイライト:

- `READY_FOR_LOCAL_FULL_LOOP` と `CONTROL_CENTER_V1_DESIGN_READY`（read-only ステータスのみ）までの実装チェーンを Sandbox + Vitest で検証済み。
- 新規 Spec: `ROADMAP_STATUS.md`、`IMPLEMENTATION_GAP_ANALYSIS.md`、`HERMES_BRIDGE_CONTRACT.md`、`HERMES_LOCAL_PILOT_RUNBOOK.md`、`ICHIKISHIMA_ORCHESTRATOR_SPEC.md`、`LOCAL_PILOT_FULL_LOOP_SPEC.md`。

推奨コマンド（バンドル例）:

```text
npx vitest run tests/ichikishima/hermes tests/ichikishima/orchestrator tests/ichikishima/pilot tests/ichikishima/control-center tests/hermes/zone
npm run typecheck:node
npx eslint src/main/ichikishima/hermes src/main/ichikishima/orchestrator src/main/ichikishima/pilot src/main/ichikishima/control-center tests/ichikishima/hermes tests/ichikishima/orchestrator tests/ichikishima/pilot tests/ichikishima/control-center
```

まだしないこと:

- Hermes実行本番接続／外部通信／UIアプリウィンドウ／memory DB自動更新／自動発話。

この範囲では問題を検出していません。

## 30. （追記・総点検後半）Bridge Final Review と Control Center V1 準備ゲート

確認内容:

1. `READY_FOR_LOCAL_FULL_LOOP` 維持（pilot テスト）、`CONTROL_CENTER_V1_DESIGN_READY`（条件付き control-center 試験）。
2. `HERMES_BRIDGE_FINAL_REVIEW.md` で **実接続前ゲート** を文書化。
3. `control-center-status.ts` を V1 read-only 向けに拡張（ドキュメントパス、blocked 近似、risk 短文、次Goalヒント）。
4. `CONTROL_CENTER_*` / `NEXT_GOALS.md` の順序と禁止事項の再整理。

推奨検証コマンド:

```text
npx vitest run tests/ichikishima/pilot tests/ichikishima/hermes tests/ichikishima/orchestrator tests/ichikishima/control-center tests/ichikishima/approval tests/ichikishima/audit tests/hermes/zone
npm run typecheck:node
npx eslint src/main/ichikishima/control-center src/main/ichikishima/hermes src/main/ichikishima/orchestrator src/main/ichikishima/pilot tests/ichikishima
```

まだしないこと:

- 実Hermes起動、UI本実装、外部通信、DB、npm install、EA/MT5。

ChatGPTレビュー推奨:

- Final Review の許可APIと **将来のElectron/Tauri main境界**の整合。

この範囲では問題を検出していません。

## 31. （追記）Control Center V1 read-only Contract / Data Provider / Bridge Pilot dry-run 準備

確認内容:

1. `CONTROL_CENTER_V1_API_CONTRACT.md` で Renderer 境界（read-only RPC のみ）を固定。
2. `getControlCenterReadonlyData` が **件数・カード・相対 doc パス・risk 短文**に留まる（commands 全文・環境変数無し）。
3. `approval-queue-summary` / `audit-log-summary` が **本文を返さない**（壊 JSONL は `parseFailures`）。
4. `HERMES_BRIDGE_PILOT_DRY_RUN_PLAN.md` と `getHermesBridgePilotReadiness`（ゲート md ファイル存在のみ）が揃っている。
5. **実行系 HUD・パイプライン実行 UI は未実装**。**Electron Renderer に read-only App Shellあり** — `window.ichikishimaControlCenter.getAppSnapshot()` のみ。**実 Hermes・HTTP listen・自動ポーリングなし**。詳細 **`CONTROL_CENTER_APP_SHELL_UI_SPEC.md`**。

推奨検証コマンド（抜粋）:

```text
npx vitest run tests/ichikishima/control-center tests/ichikishima/approval/approval-queue-summary.test.ts tests/ichikishima/audit/audit-log-summary.test.ts tests/ichikishima/hermes/hermes-bridge-readiness.test.ts
npm run typecheck:node
npx eslint src/main/ichikishima/control-center/control-center-data-provider.ts src/main/ichikishima/hermes/hermes-bridge-readiness.ts src/main/ichikishima/approval/approval-queue-summary.ts src/main/ichikishima/audit/audit-log-summary.ts tests/ichikishima/control-center/control-center-data-provider.test.ts
```

この範囲では問題を検出していません。

## 32. （追記）Control Center V1 read-only UI 設計ゲート（→ Renderer read-only App Shell まで到達）

確認内容:

1. `CONTROL_CENTER_V1_UI_SPEC.md` / `CONTROL_CENTER_V1_SECURITY_MODEL.md` / `CONTROL_CENTER_V1_IPC_CONTRACT.md` / `CONTROL_CENTER_V1_SCREEN_SPEC.md` / `CONTROL_CENTER_V1_IMPLEMENTATION_READINESS.md` が揃っている。
2. 論理 RPC は current canonical **`controlCenter.readonly.getAppSnapshot`**（legacy `getSnapshot` retired）。実行系名前空間（`*.execute.*`）は V1 で作らない。
3. `getControlCenterReadonlyData` が `ipcBinding` を含み、`CONTROL_CENTER_V1_SCREEN_SPEC` のカード分解と整合。
4. `HERMES_BRIDGE_ALLOWED_APIS` を **`hermes-bridge-api-registry.ts` に単一化**し Final Review §1 冒頭から参照。

推奨検証（抜粋）:

```text
npx vitest run tests/ichikishima/control-center tests/ichikishima/hermes/hermes-bridge-api-registry.test.ts
npm run typecheck:node
npx eslint src/main/ichikishima/control-center/control-center-data-provider.ts src/main/ichikishima/hermes/hermes-bridge-api-registry.ts src/main/ichikishima/hermes/hermes-bridge-readiness.ts tests/ichikishima/control-center/control-center-data-provider.test.ts tests/ichikishima/hermes/hermes-bridge-api-registry.test.ts
```

この範囲では問題を検出していません。

## 33. （追記）Control Center V1 UI Shell（文書＋静的 mock）

確認内容:

1. `CONTROL_CENTER_V1_UI_SHELL_SPEC.md`、`CONTROL_CENTER_V1_UI_DATA_CONTRACT.md`、`CONTROL_CENTER_V1_LOCALHOST_SECURITY.md`、`CONTROL_CENTER_V1_UI_SHELL_TEST_PLAN.md` が揃っている。
2. 静的モック `docs/ichikishima/mockups/control-center-v1-readonly.html` — **disabled のみ／`<script>` 無し／CDN 無し**。
3. `control-center-readonly-snapshot-contract.test.ts` で `ipcBinding`・読取不変条件を確認。
4. **Electron 起動・HTTP bind・npm install は未実施**。

```text
npx vitest run tests/ichikishima/control-center tests/ichikishima/hermes/hermes-bridge-api-registry.test.ts
npm run typecheck:node
npx eslint src/main/ichikishima/control-center/control-center-data-provider.ts tests/ichikishima/control-center/control-center-readonly-snapshot-contract.test.ts
```

この範囲では問題を検出していません。

## 34. （追記）Control Center V1 Static Read-only Shell

確認内容:

1. `mockups/control-center-v1-static-shell.{html,css,js}` — **CDN 無し**。パイプライン相当 `<button>` は **`class="pipeline"` + `disabled`**。ローカル JSON は **埋め込み**または **`<input type="file">` + `FileReader` のみ**（外向き `fetch`・HTTP サーバ無し）。
2. `mockups/control-center-v1-snapshot.sample.json` — `getControlCenterReadonlyData` 互換フィールド。**`requiresUserApproval: true`** / **`canExecuteDangerousActions: false`**。**識別子配列（allowedApis/forbiddenApis の詳細）は載せない**（件数フィールドと整合）。**任意** `appShellParityPreview` — Renderer App Shell の Memory / Agent Team / Visualization 短文に親和。
3. `tests/ichikishima/control-center/control-center-static-shell.test.ts` で mockup ソースの禁止パターン・JSON ・ Provider 整合を確認。
4. **Electron・実 IPC・Hermes 実起動・npm install・127.0.0.1 バインドは未実施**。

```text
npx vitest run tests/ichikishima/control-center
npm run typecheck:node
npx eslint tests/ichikishima/control-center/control-center-static-shell.test.ts
```

この範囲では問題を検出していません。

## 35. （追記）Hermes Bridge Pilot（実本体なし）＋ Static Shell JSON ガイドライン

確認内容:

1. `HERMES_BRIDGE_PILOT_SPEC.md` / `HERMES_BRIDGE_OPERATION_MATRIX.md` 作成。`routeHermesOperation` に **`bridge_requires_approval`**（`dependency_install` / `external_ai_escalation`）。`policy_blocked` の dependency は **forbidden**。
2. `runHermesLocalPilotTask` が上記を **承認キューのみ**で処理（自動実行なし）。read/write は Zone API。
3. `getHermesBridgePilotReadiness` のラベル **`READY_FOR_HERMES_BRIDGE_PILOT_DRY_RUN`**（ゲート文書 4 本）。
4. `CONTROL_CENTER_STATIC_SHELL_JSON_GUIDELINES.md` と Static Shell バナー／リンク追記。
5. **実 Hermes／localhost server／Electron／外部通信／npm install 無し**。

```text
npx vitest run tests/ichikishima/hermes tests/ichikishima/pilot tests/ichikishima/control-center
npm run typecheck:node
npx eslint src/main/ichikishima/hermes/hermes-bridge.ts src/main/ichikishima/hermes/hermes-local-pilot.ts src/main/ichikishima/hermes/hermes-bridge-readiness.ts src/main/ichikishima/pilot/local-pilot-full-loop.ts tests/ichikishima/hermes/hermes-bridge-pilot.test.ts
```

この範囲では問題を検出していません。

## 36. （追記）Control Center Local read-only API — Threat Model / 実装前設計

確認内容:

1. `CONTROL_CENTER_LOCAL_API_THREAT_MODEL.md`、`CONTROL_CENTER_LOCAL_API_CONTRACT.md`、`CONTROL_CENTER_LOCAL_API_IMPLEMENTATION_GATE.md`、`CONTROL_CENTER_LOCAL_API_TEST_PLAN.md` が揃い、`CONTROL_CENTER_V1_LOCALHOST_SECURITY.md` / IPC / UI Data Contract とクロスリンク済み。
2. `src/main/ichikishima/control-center/local-api-contract.ts` — **`GET /snapshot` のみ**、禁止パス／禁止 HTTP メソッド定数。**`listen`・HTTP・外部通信無し**。 
3. `tests/ichikishima/control-center/local-api-contract.test.ts` が緑。既存 Snapshot 試験と併せ **control-center 配下**を維持。

```text
npx vitest run tests/ichikishima/control-center
npm run typecheck:node
npx eslint src/main/ichikishima/control-center/local-api-contract.ts tests/ichikishima/control-center/local-api-contract.test.ts
```

この範囲では問題を検出していません。

## 37. （追記）Control Center Local HTTP V1 minimal（`127.0.0.1`・`GET /snapshot`）

確認内容:

1. `src/main/ichikishima/control-center/local-api-server.ts` — **`127.0.0.1` のみ** bind、**`0.0.0.0` 拒否**。**`GET /snapshot`** のみ 200。**HEAD/OPTIONS は 405 本文無し**。POST 等 `/snapshot` は 405 JSON。禁止パス **404**。`getControlCenterReadonlyData` 経由。**CORS ヘッダなし**。同一プロセス **二重 listen 拒否**、`stop` でポート解放。**`npm install`/外部通信/child_process/`fetch`/Electron preload 変更なし**。
2. `local-api-contract.ts` — 禁止メソッドに **`HEAD`/`OPTIONS`**。定数 **`CONTROL_CENTER_LOCAL_API_MAX_SNAPSHOT_BODY_BYTES_GUESS`** と **507（Snapshot サイズ上限）** 整合。
3. **`local-api-server.test.ts`** と **`local-api-contract.test.ts`** が `tests/ichikishima/control-center` に含まれる。

```text
npx vitest run tests/ichikishima/control-center
npm run typecheck:node
npx eslint src/main/ichikishima/control-center/local-api-server.ts src/main/ichikishima/control-center/local-api-contract.ts tests/ichikishima/control-center/local-api-server.test.ts tests/ichikishima/control-center/local-api-contract.test.ts
```

この範囲では問題を検出していません。

## 38. （追記）ADR — IPC 本命／Local HTTP 補助／Hermes Bridge 混線防止

確認内容:

1. `ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md` が **採用**（設計のみ・コード変更なし）。IPC read-only が **Electron UI 本命**、Local HTTP は **補助・明示起動**、Hermes Bridge は **Dashboard Snapshot と分離**。論理名前空間の許可／禁止一覧を収録。
2. `CONTROL_CENTER_OWNERSHIP_MODEL.md` — CC UI／Local HTTP の **起動オーナー** と Static Shell の位置付け。
3. `HERMES_BRIDGE_OWNERSHIP_MODEL.md` — Bridge が **Snapshot HTTP を負わない**こと等。「混線しない」不変条件。

```text
# コード変更・追加 listen 無し のため自動テストは省略可。必要時:
npm run typecheck:node
```

この範囲では問題を検出していません。

## 39. （追記）Hermes Bridge Final Review — コード正・IPC メタ突合

確認内容:

1. `DOC_REL`: ADR・Ownership×2 を含む **8 文書**（`HERMES_BRIDGE_PAYLOAD_CONTRACT.md` 含む）。欠落時 `NOT_READY`。`tests/ichikishima/hermes/hermes-bridge-readiness.test.ts`
2. **`HERMES_BRIDGE_REGISTRY_IPC_CANDIDATE_RPCS`** / **`HERMES_BRIDGE_REGISTRY_IPC_EXPLICITLY_FORBIDDEN_RPCS`** と `CONTROL_CENTER_V1_IPC_CONTRACT.md` §9 整合。
3. **`HERMES_BRIDGE_OPERATION_MATRIX.md`** に **`routeHermesOperation` tier** と `DEPENDENCY_INSTALL_POLICY_BLOCKED` 明示。
4. **`HERMES_BRIDGE_FINAL_REVIEW.md` §8 チェックリスト**。

```text
npx vitest run tests/ichikishima/hermes tests/ichikishima/control-center
npm run typecheck:node
npx eslint src/main/ichikishima/hermes/hermes-bridge-api-registry.ts src/main/ichikishima/hermes/hermes-bridge-readiness.ts tests/ichikishima/hermes/hermes-bridge-registry-ipc-candidate.test.ts tests/ichikishima/hermes/hermes-bridge-api-registry.test.ts tests/ichikishima/hermes/hermes-bridge-pilot.test.ts
```

この範囲では問題を検出していません。

## 40. （追記）Hermes Bridge Final Review 人手クローズ準備／Registry IPC 一本化

確認内容:

1. `HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md` — チェックリスト・承認記録テンプレ（実装無し）。
2. `HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md` — **Pilot dry-run 次段階**の必須条件。
3. **`HERMES_BRIDGE_REGISTRY_IPC_CANDIDATE_RPCS`** は **`hermesBridge.registry.getReadiness` のみ**。`getAllowedApis` / `getForbiddenApis` / `pilot.getReadiness` は **`HERMES_BRIDGE_REGISTRY_IPC_EXPLICITLY_FORBIDDEN_RPCS`** で当面禁止。
4. `CONTROL_CENTER_V1_IPC_CONTRACT.md` §9 / `HERMES_BRIDGE_API_REGISTRY.md` §6 と整合。

```text
npx vitest run tests/ichikishima/hermes/hermes-bridge-api-registry.test.ts tests/ichikishima/hermes/hermes-bridge-registry-ipc-candidate.test.ts tests/ichikishima/hermes/hermes-bridge-readiness.test.ts
npm run typecheck:node
npx eslint src/main/ichikishima/hermes/hermes-bridge-api-registry.ts tests/ichikishima/hermes/hermes-bridge-api-registry.test.ts tests/ichikishima/hermes/hermes-bridge-registry-ipc-candidate.test.ts --max-warnings 0
```

この範囲では問題を検出していません。

## 41. （追記）Hermes Bridge Pilot Dry-run 次段階（シナリオ A〜E）

確認内容:

1. `hermes-bridge-pilot-dry-run.ts` — Scenario A〜E（safe / blocked / `bridge_requires_approval` / forbidden / mixed）。`summarizeHermesBridgePilotDryRunForControlCenterSnapshot` は集計文字列のみ。
2. `continueAfterForbiddenClassification` — mixed で `partial`。forbidden のみは既定どおり早期 `failed`。
3. `tests/ichikishima/hermes/hermes-bridge-pilot-dry-run.test.ts`。**実 Hermes／listen／preload／外部通信／npm install 無し**。

```text
npx vitest run tests/ichikishima/hermes/hermes-bridge-pilot-dry-run.test.ts tests/ichikishima/hermes/hermes-local-pilot.test.ts tests/ichikishima/pilot/local-pilot-full-loop.test.ts
npm run typecheck:node
npx eslint src/main/ichikishima/hermes/hermes-bridge-pilot-dry-run.ts src/main/ichikishima/hermes/hermes-local-pilot.ts tests/ichikishima/hermes/hermes-bridge-pilot-dry-run.test.ts
```

この範囲では問題を検出していません。

## 42. （追記）Hermes Bridge Payload Contract / Validation（v1）

確認内容:

1. `docs/ichikishima/HERMES_BRIDGE_PAYLOAD_CONTRACT.md` — inbound Hermes メタ JSON v1 と fail-closed／`partial` 限定許可。
2. `hermes-bridge-payload.ts` — `validateHermesBridgePayload`。**実実行・Hermes・FS なし**。
3. `hermes-bridge-pilot-dry-run.ts` — 各 Scenario 開始前に `validateHermesBridgePayload` が通過。

```text
npx vitest run tests/ichikishima/hermes
npm run typecheck:node
npx eslint src/main/ichikishima/hermes/hermes-bridge-payload.ts tests/ichikishima/hermes/hermes-bridge-payload.test.ts src/main/ichikishima/hermes/hermes-bridge-pilot-dry-run.ts
```

この範囲では問題を検出していません。

## 43. （追記）Hermes 実接続 Pilot 直前レビュー（Preflight）

確認内容:

1. `HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md` / `HERMES_REAL_CONNECTION_PILOT_SCOPE.md` — Go/No-Go・最小スコープ。実 Hermes 起動なし。
2. **`HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`** と Payload **§15** — validated/raw wire をログ・UI・Snapshot に丸ごと載せない。
3. **`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md` §11**、`HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md` **E-16〜E-22**、`NEXT_GOALS.md` Goal RP-Preflight。

```text
npx vitest run tests/ichikishima/hermes
npm run typecheck:node
npx eslint src/main/ichikishima/hermes/hermes-bridge-payload.ts src/main/ichikishima/hermes/hermes-bridge-receiver-queue.ts
```

この範囲では問題を検出していません。

## 44. （追記）Hermes Connection Adapter Stage 0 / Control Center 安全要約

確認内容:

1. `HERMES_CONNECTION_ADAPTER_CONTRACT.md` — Stage 0〜3、禁止経路、validated 伝搬禁止。
2. `hermes-connection-adapter.ts` — **`in_memory` のみ**、Receiver 前段、lane fail-closed。
3. `hermes-bridge-readiness-summary.ts` — **詳細 API 配列・validated 全文・secrets を返さない**要約。
4. `hermes-bridge-payload.ts` — `SUSPICIOUS_CONTENT`（JSON エスケープ後の `\n` 経由の `PASSWORD=` 等を含む）。

```text
npx vitest run tests/ichikishima/hermes tests/ichikishima/control-center
npm run typecheck:node
npx eslint src/main/ichikishima/hermes/hermes-connection-adapter.ts src/main/ichikishima/hermes/hermes-bridge-readiness-summary.ts src/main/ichikishima/hermes/hermes-bridge-payload.ts src/main/ichikishima/hermes/index.ts tests/ichikishima/hermes/hermes-connection-adapter.test.ts tests/ichikishima/hermes/hermes-bridge-readiness-summary.test.ts tests/ichikishima/hermes/hermes-bridge-payload.test.ts
```

この範囲では問題を検出していません。

## 45. （追記）Hermes Connection Stage 1 — Sandbox File Handoff

確認内容:

1. `HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md`、`hermes-file-handoff-adapter.ts` — inbox 平坦のみ、marker のみ、stdin/stdout・実プロセス無し。
2. `sandbox/hermes-autonomy-zone/handoff/`（`README.md`、`.gitkeep`）。

```text
npx vitest run tests/ichikishima/hermes
npm run typecheck:node
npx eslint src/main/ichikishima/hermes/hermes-file-handoff-adapter.ts tests/ichikishima/hermes/hermes-file-handoff-adapter.test.ts
```

この範囲では問題を検出していません。

## 46. （追記）Stage 1 — marker collision policy / 手動 cleanup Runbook

確認内容:

1. `hermes-file-handoff-adapter.ts` — **marker 上書き禁止**（UTC `YYYYMMDD-HHmmss` + 同一秒衝突時 `.1` 連番。上限 `HANDOFF_MARKER_COLLISION_MAX_ATTEMPTS`）。
2. `HERMES_CONNECTION_FILE_HANDOFF_CONTRACT.md` §5 / §5.1 / §7.1 — 命名・衝突・**inbox 自動削除なし**・手動 cleanup。
3. `sandbox/hermes-autonomy-zone/handoff/README.md` — Cleanup Runbook（**自動 cleanup 禁止**は V1）。

```text
npx vitest run tests/ichikishima/hermes
npm run typecheck:node
npx eslint src/main/ichikishima/hermes/hermes-file-handoff-adapter.ts tests/ichikishima/hermes/hermes-file-handoff-adapter.test.ts
```

この範囲では問題を検出していません。

## 47. （追記）Real Pilot Minimal Pipeline（統合経路・実プロセス無し）

確認内容:

1. `HERMES_REAL_PILOT_MINIMAL_PIPELINE_CONTRACT.md`、`hermes-real-pilot-minimal.ts` — Stage 1 handoff → Receiver → Local Pilot → 承認／監査。
2. `hermes-real-process-adapter.ts` — **`runRealHermesProcessAdapter` が常時 disabled**（実 Node spawn/exec 不使用）。
3. `hermes-real-pilot-summary.ts` — Control Center 向け **短文要約のみ**。
4. テスト: `tests/ichikishima/hermes/hermes-real-pilot-minimal.test.ts` ほか。

```text
npx vitest run tests/ichikishima/hermes
npx vitest run tests/ichikishima/pilot tests/ichikishima/approval tests/ichikishima/audit tests/ichikishima/orchestrator tests/ichikishima/control-center
npm run typecheck:node
npx eslint --max-warnings 0 src/main/ichikishima/hermes/hermes-real-pilot-minimal.ts src/main/ichikishima/hermes/hermes-real-pilot-summary.ts src/main/ichikishima/hermes/hermes-real-process-adapter.ts tests/ichikishima/hermes/hermes-real-pilot-minimal.test.ts tests/ichikishima/hermes/hermes-real-pilot-summary.test.ts tests/ichikishima/hermes/hermes-real-process-adapter.test.ts
```

この範囲では問題を検出していません。

## 48. （追記）Real Hermes Process Adapter Final Gate（文書のみ・subprocess なし）

確認内容:

1. **`HERMES_REAL_PROCESS_ADAPTER_FINAL_GATE.md`** — **`child_process` 解禁直前**の条件・`shell:true` 禁止・任意コマンド禁止・cwd/env/stdin/stdout/stderr 上限・timeout/kill・process handle 非公開・validation/Receiver との関係・Go/No-Go。
2. **`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md` §12**、**`HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md` E-25**、**`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md` §22**、**`HERMES_REAL_CONNECTION_PILOT_SCOPE.md` §0.1** が Final Gate と整合。
3. **`hermes-real-process-adapter.ts`** — **`runRealHermesProcessAdapter` が常時 disabled**。`child_process` の import なし。

```text
npx vitest run tests/ichikishima/hermes/hermes-real-process-adapter.test.ts
npx vitest run tests/ichikishima/hermes
npm run typecheck:node
npx eslint --max-warnings 0 src/main/ichikishima/hermes/hermes-real-process-adapter.ts tests/ichikishima/hermes/hermes-real-process-adapter.test.ts
```

この範囲では問題を検出していません。

## 49. （追記）Real Hermes Process Adapter Minimal（execFile・テストのみ subprocess）

確認内容:

1. `HERMES_REAL_PROCESS_ADAPTER_FINAL_GATE.md` — execFile のみ、`shell:true`/spawn/exec 禁止、ゲートフラグ、`__testOnlySimulateExec`。
2. Phase 7 ドキュメント整合（Pipeline / Preflight / Pilot scope / SIGNOFF §11–12 / E-24–E25 / ROADMAP / NEXT_GOALS / GOAL§32）。

```text
npx vitest run tests/ichikishima/hermes tests/ichikishima/pilot tests/ichikishima/approval tests/ichikishima/audit tests/ichikishima/orchestrator tests/ichikishima/control-center tests/hermes/zone
npm run typecheck:node
npx eslint --max-warnings 0 src/main/ichikishima/hermes/hermes-real-process-adapter.ts src/main/ichikishima/hermes/hermes-real-pilot-minimal.ts src/main/ichikishima/hermes/hermes-real-pilot-summary.ts src/main/ichikishima/autonomy-zone/path-guard.ts tests/ichikishima/hermes/hermes-real-process-adapter.test.ts
```

この範囲では問題を検出していません。

## 50. （追記）Controlled Pilot コードパス（`controlledPilot` / `signoffEvidence`）

確認内容:

1. `hermes-real-process-adapter.ts` — Controlled Pilot policy、`runRealHermesProcessAdapterWithPolicy`、`signoffEvidence` は短文メタのみ。
2. `hermes-real-pilot-summary.ts` — `REAL_HERMES_PROCESS_CONTROLLED_PILOT_CODE_READY`（本番 READY ではない）。
3. Vitest / typecheck / 対象 ESLint（Controlled Pilot 追加分）。

```text
npx vitest run tests/ichikishima/hermes tests/ichikishima/pilot tests/ichikishima/approval tests/ichikishima/audit tests/ichikishima/orchestrator tests/ichikishima/control-center
npm run typecheck:node
npx eslint --max-warnings 0 src/main/ichikishima/hermes/hermes-real-process-adapter.ts src/main/ichikishima/hermes/hermes-real-pilot-summary.ts tests/ichikishima/hermes/hermes-real-process-adapter.test.ts tests/ichikishima/hermes/hermes-real-pilot-summary.test.ts
```

この範囲では問題を検出していません。

## 51. （追記）preload — `window.ichikishimaControlCenter.getAppSnapshot()` のみ（2026-05-03）

1. `src/preload/ichikishima-control-center.ts` + `src/preload/index.ts` の **`exposeInMainWorld("ichikishimaControlCenter", …)`**。
2. `src/shared/ichikishima/control-center-readonly-ipc-channel.ts` と main `GET_APP_SNAPSHOT` の一致を契約テストで固定。
3. `tests/ichikishima/control-center/control-center-preload-contract.test.ts`。

未着手: Control Center 専用 Renderer 画面、実行系 API、packaged `projectRoot` 最終解決。

この範囲では問題を検出していません。


（**2026-05-06 discovery-only fill-in**）Bounded WSL discovery-only reduced placeholders from 6 to 3, but multiple distros made automatic selection ambiguous. Decision remains HOLD. Raw values were not reported; WSL placement, wrapper execution, real Hermes, real execFile, packaged smoke, Approval execution, Memory DB, and EA/MT5 remain untouched.
（**2026-05-06 availability HOLD hardening**）selectedSlot=slot-02 remains resolved, but both unix user discovery-only methods failed. The app/docs now keep this as redacted HOLD until the user replies with one of: `slot-02 availability: ok`, `slot-02 availability: failed`, `slot-02 availability: choose_another_slot`. Raw values were not reported and execution boundaries remain closed.
（**2026-05-07 Control Center HOLD status sprint**）Control Center now shows the selectedSlot=slot-02 availability blocker as slot-only redacted HOLD status with rawValuesReported=false and Execution=disabled. User-side availability confirmation is still pending.
（**2026-05-07 B-1 fix**）Legacy `GET_SNAPSHOT` IPC was retired from registered channels/handlers. `GET_APP_SNAPSHOT` remains the sanitized path, and tests cover raw `allowedApis` / `forbiddenApis` array absence on the IPC wire.
（**2026-05-07 docs cleanup**）Primary Control Center contracts now mark `getAppSnapshot` as canonical and legacy `getSnapshot` as retired. `redactedSummaryLines` wire slimming is tracked in `CONTROL_CENTER_TECH_DEBT.md`.

（**2026-05-07 wire-safe summary slimming**）GET_APP_SNAPSHOT no longer carries `redactedSummaryLines` in `wsl2LocalValueValidationSummary`. Renderer keeps structured HOLD status fields only. Hermes validator reports still keep redacted lines for Signoff/docs workflows. Execution remains forbidden.

（**2026-05-07 selected slot reselection**）slot-02 is now a failed selected slot with reason `distro_not_in_current_wsl_list`. Next action is `choose_another_slot` by slot ID only. Raw WSL inventory, distro names, unix users, wrapper paths, local-only JSON, and slot map content remain unreported.

（**2026-05-07 refreshed slot inventory**）Bounded list-only discovery refreshed current selectable slots. Redacted status: distroDiscoveryStatus=refreshed, distroCount=3, selectableSlots=slot-01/slot-02/slot-03, selectedSlot=none, previousSelectedSlot=slot-02, previousFailureReason=distro_not_in_current_wsl_list, nextRequiredHumanAction=select_slot_id. Raw distro names remain local-only.

（**2026-05-07 refreshed selected slot**）User selected slot-01 from refreshed inventory. Redacted status is selectedSlot=slot-01, previousSelectedSlot=slot-02, previousFailureReason=distro_not_in_current_wsl_list, decision=HOLD, nextRequiredHumanAction=verify_selected_slot_availability_locally. Raw WSL values remain local-only and execution remains disabled.

（**2026-05-07 slot-01 availability failed**）slot-01 is now failed before launch with reason `distro_not_in_current_wsl_list`. Redacted inventory consistency is matched, with slotMapCount=3 and currentInventoryCount=3. Next action is `refresh_or_validate_slot_inventory_consistency`; no raw WSL names or slot-map contents are reported.

（**2026-05-07 count/content split**）Count consistency and content consistency are now separated. Redacted state: inventoryCountConsistency=matched, inventoryContentConsistency=partial, slotStatuses=slot-01:mismatch / slot-02:matched / slot-03:matched. Next action is `choose_matched_slot_id`; execution remains disabled.

（**2026-05-07 wording hardening**）Legacy `inventoryConsistency` is count/content-ambiguous and must not be read as full content match. Canonical redacted state is inventoryCountConsistency=matched, inventoryContentConsistency=partial, slotStatuses=slot-01:mismatch / slot-02:matched / slot-03:matched, decision=HOLD, execution=disabled, rawValuesReported=false, nextRequiredHumanAction=`choose_matched_slot_id`.

（**2026-05-07 local-only repair HOLD**）Slot selection is unresolved because clean exact-match inputs are not available. Redacted state: selectedSlot=unresolved, previousSelectedSlot=slot-01, slotSelectionFailureReason=distro_name_mismatch, inventoryContentConsistency=mismatched, decision=HOLD, execution=disabled, productionReady=false, pendingPackagingResolution=true, rawValuesReported=false, nextRequiredHumanAction=`update_local_only_slot_map_or_hold`.

（**2026-05-07 exact-match validation**）Local-only distro fields were compared internally without exposing raw values. Redacted result: exactMatchResult=no_match, matchedSlotCount=0, selectedSlot=unresolved, decision=HOLD, execution=disabled, productionReady=false, pendingPackagingResolution=true, rawValuesReported=false, nextRequiredHumanAction=`update_local_only_slot_map_or_hold`.

（**2026-05-07 human-confirmed matched slot**）Human confirmed matchedSlotId=slot-02. Redacted state: selectedSlot=slot-02, selectedSlotStatus=matched, previousSelectedSlot=slot-01, previousSelectedSlotStatus=mismatch, exactMatchReadiness=ready, exactMatchResult=single_match, matchCount=1, decision=HOLD, execution=disabled, productionReady=false, pendingPackagingResolution=true, rawValuesReported=false, nextRequiredHumanAction=`resolve_packaging_safety_gate`.

（**2026-05-07 packaging safety gate readiness**）Packaging gate resolved as non-execution readiness only. Redacted state: selectedSlot=slot-02, selectedSlotStatus=matched, packagingGateStatus=resolved_without_execution, packagingRiskLevel=low, packagingBlockers=none, canRunWsl=false, canRunHermes=false, canRunWrapper=false, canRunOnce=false, decision=HOLD, execution=disabled, productionReady=false, pendingPackagingResolution=true, rawValuesReported=false, nextRequiredHumanAction=`review_non_execution_readiness_before_go_policy`.
