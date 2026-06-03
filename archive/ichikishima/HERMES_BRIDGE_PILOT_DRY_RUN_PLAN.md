# Hermes Bridge Pilot — Dry-run Plan（実 Hermes 本体なし）

**目的**: 実 Hermes プロセスや外部通信なしで、Bridge 境界と **許可・禁止 API** が守られることを検証してから、「狭い許可」を実装する。

---

## 1. 実 Hermes 本体なしで確認すること

| # | 確認 |
|---|------|
| 1 | `runHermesLocalPilotTask` / `runLocalPilotFullLoop` が sandbox で完走する（既存 Vitest）。 |
| 2 | `routeHermesOperation` が `forbidden_boundary` と `blocked_zone_sensitive` を正しく分類する。 |
| 3 | Autonomy Zone 外パスへの read/write が拒否される（path-guard / denylist）。 |
| 4 | Approval Queue / Audit が **本文なし・JSONL 追記のみ**で整合している。 |
| 5 | `getHermesBridgePilotReadiness()` が **ゲート文書**（ADR / Ownership ×2 / Final Review / **`HERMES_BRIDGE_PAYLOAD_CONTRACT.md`** / Dry-run Plan / **Pilot SPEC** / **Operation Matrix**）に基づき `READY_FOR_HERMES_BRIDGE_PILOT_DRY_RUN` / `NOT_READY` を返す。論理 IPC チャネル名はコード定数 **`HERMES_BRIDGE_REGISTRY_IPC_CANDIDATE_RPCS`**（**`hermesBridge.registry.getReadiness` のみ**。**まだ `ipcMain` 未公開**）。 |

---

## 2. 実 Hermes に接続する段階で **追加で**確認すること（将来フェーズ）

- main プロセス RPC の expose リストが **`HERMES_BRIDGE_FINAL_REVIEW.md` と一致**する。
- renderer で `nodeIntegration: false`、`contextIsolation: true` を維持（Electron 選択時）。
- 外部プロセスヘルスチェック時も **許可された URL が固定リスト**のみ（別 SPEC）。

---

## 3. raw API が漏れていないか

| チェック | 合格基準 |
|----------|----------|
| grep / レビュー | renderer / preload に `require('fs')` などが混入していない |
| RPC リスト | Forbidden リストに載った名前が応答・メタデータに載らない |

---

## 4. Bridge API だけ渡せるか

- **許可リスト**は Final Review と本リポジトリ公開 export の **交差点**のみとする。
- すべての経路が `autonomy-zone` / `approval` / `audit` / Bridge レイヤ経由になること。

---

## 5. sandbox 内 dummy task に限定できるか

- Dry-run は **`sandbox/hermes-autonomy-zone` のみ**を対象にする。
- Zone root が project root と同一・OS root になる設定をコードが拒否すること。

---

## 6. 停止条件（即中止して人間へ）

- RPC に Forbidden 関数が混入した。
- UI 側からファイルパスの **絶対指定**のみで Zone をバイパスした。
- 外部 `fetch`/任意シェルを要求された。
- 承認後に実 delete/exec/network/git を自動実行させるコードが混入した。
- Hermes 「実ランタイム起動」を無人プロセスとして要求された。

---

## 7. テスト計画

| 層 | 内容 |
|----|------|
| 単体 | `tests/ichikishima/hermes/*`、`tests/hermes/zone/*`、`control-center-data-provider`、`hermes-bridge-readiness`。 |
| 統合ローカルのみ | Sandbox JSONL と Data Provider が **件数一致**しない場合は WARN のみで落とさず集計続行 |

---

## 8. 実接続前の人間レビュー項目（必須）

- [ ] `HERMES_BRIDGE_FINAL_REVIEW.md` を読み、異議なし。
- [ ] メインサービス側の expose 関数一覧と Forbidden リストの一致を双方で確認した。
- [ ] **承認後自動実行エンジンは存在しない**ことを再確認した。

---

関連: `CONTROL_CENTER_V1_API_CONTRACT.md`、`HERMES_BRIDGE_FINAL_REVIEW.md`

---

## 9. 多シナリオ Bridge Pilot Dry-run（次段階）

**実装**: `src/main/ichikishima/hermes/hermes-bridge-pilot-dry-run.ts`。**テスト**: `tests/ichikishima/hermes/hermes-bridge-pilot-dry-run.test.ts`。

| ID | 含意 |
|----|------|
| A `scenario_a_safe_file_task` | サンプル read/write と監査・Approval Report が通る |
| B `scenario_b_blocked_operations` | delete/exec/net/git は stubs でブロックし Approval Queue に流れる |
| C `scenario_c_bridge_requires_approval` | dependency_install／external_ai_escalation はキューのみ |
| D `scenario_d_forbidden_classification` | memory／MT5／env／policy_blocked が **早期拒否のみ** |
| E `scenario_e_mixed_classification` | 上記種別が混ざっても **raw ファイル本文なしで**結果を `HermesBridgePilotDryRun*` 型に収束 |

`runHermesBridgePilotDryRunSuite` はゲート準備済み時にすべて `passed` となり、`HERMES_BRIDGE_PILOT_NEXT_DRY_RUN_SCENARIOS_LABEL`（`**READY_FOR_HERMES_BRIDGE_PILOT_NEXT_DRY_RUN`**）を説明用文字列として返す。**実 Hermes 起動・`ipcMain`・HTTP listen・renderer は含まない**。各シナリオ開始前に **Hermes Bridge Payload v1 として `validateHermesBridgePayload` を通過**する（実行はしない）。

---

## 10. Hermes Payload Contract（Inbound v1）

- 文書: `HERMES_BRIDGE_PAYLOAD_CONTRACT.md`。
- 実装は **`hermes-bridge-payload.ts` の検証のみ**（fs / ipc / Hermes を起動しない）。
- **`readinessLabel` と `scenarioSuiteLabel` は分離**。Readiness：`READY_FOR_HERMES_BRIDGE_PILOT_DRY_RUN`。シナリオ Suite：`READY_FOR_HERMES_BRIDGE_PILOT_NEXT_DRY_RUN`（UI は短縮文言推奨、内部ラベルはそのままでも可）。
