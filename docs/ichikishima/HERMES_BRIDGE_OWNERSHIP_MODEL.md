# Hermes Bridge — オーナーシップモデル（ルーティングと混線防止）

**位置づけ**: **Hermes Bridge** が **Control Center Local API** や **UI Snapshot** 経路と混線しないことを、**責務の所有者**レベルで固定する。**実装追加を要求しない**。  
**前提 ADR**: `ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md`

---

## 1. Bridge のオーナーシップ（何を所有するか）

| 項目 | Hermes Bridge Owner の責務 |
|------|----------------------------|
| **操作許可リスト** | `HERMES_BRIDGE_ALLOWED_APIS` / `HERMES_BRIDGE_FORBIDDEN_APIS`（**機械的正は TS**、`HERMES_BRIDGE_API_REGISTRY.md`）。 |
| **分類規則** | `routeHermesOperation` 等での `forbidden` / blocked / **`bridge_requires_approval`** / allowed の振り分け。 |
| **Pilot 入力** | `runHermesLocalPilotTask` 等 — **sandbox・実本体とは別論点**での検証。**実ランタイム起動はしない**（別 Goal／承認）。 |
| **横断ログ** | approval／audit／review **候補**の生成。**実行はしない**。 |

---

## 2. 所有しないもの（明示的非責務）

Bridge は次を **提供しない／所有しない**:

| 非負務 | 理由 |
|--------|------|
| **Dashboard Snapshot の HTTP 転送** | `GET /snapshot` は **Control Center Local API**。Bridge は混載しない。 |
| **`controlCenter.readonly.*` の実装細部** | 読取の集約は **`getControlCenterReadonlyData`**。Bridge は読取 RPC のオーナーではない（readiness メタのみ `hermesBridge.readonly.*` で触れうる）。 |
| **ユーザー承認の自動確定** | Queue／Review は **人の前に置く**。 |
| **承認済み項目の自動実行** | **別実行エンジン Goal** とし、Bridge と同一名前空間に載せない。 |

---

## 3. 論理名前空間（Bridge 側）

### 許可（設計）

```text
hermesBridge.readonly.*
hermesBridge.pilot.*
hermesBridge.registry.*
```

- **`readonly`**: readiness、レジストリ列挙、メタのみ。
- **`pilot`**: sandbox Pilot 入力・結果処理（実行は許可リスト内のスタブのみ）。
- **`registry`**: **`hermesBridge.registry.getReadiness` の論理のみ** を将来 IPC メタへ（**状態・件数・要約**。**API 完全一覧は返さない**）。機械的正は **`HERMES_BRIDGE_REGISTRY_IPC_CANDIDATE_RPCS`**（**単一要素**）。

### 禁止（Bridge にも載せない）

```text
hermesBridge.raw.*
rawFs.*
rawShell.*
rawNetwork.*
rawGit.*
approval.execute.*
controlCenter.execute.*
localApi.hermesRun.*
snapshot.execute.*
mt5.*
memoryDb.write.*
```

（`CONTROL_CENTER_V1_IPC_CONTRACT.md` §4 / `ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md` §3 と整合。）

---

## 4. Control Center Local API との混線防止

```text
Control Center Local API   … UI / Dashboard read-only Snapshot 専用
Hermes Bridge              … Hermes／Pilot 操作のルーティング専用
```

- Local API が **Hermes を起動または操作しない**。
- Bridge が **`/snapshot` 相当の応答を返さない**（Snapshot は Provider 側の単一関数）。

---

## 5. Approval Queue / Audit / Review との関係（オーナーの境界）

| コンポーネント | Bridge の関わり |
|----------------|----------------|
| Approval Queue | 項目生成・保存（JSONL **追記**）。**キュー項目の実行エンジンは Bridge が持たない**。 |
| Audit | イベント記録の候補。Bridge は **ログを広く送信しない**。 |
| Review Mode | レポート評価。**承認確定しない**。 |

---

## 関連

- `ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md`
- `CONTROL_CENTER_OWNERSHIP_MODEL.md`
- `HERMES_BRIDGE_FINAL_REVIEW.md`
- `HERMES_BRIDGE_API_REGISTRY.md`
- `HERMES_BRIDGE_CONTRACT.md`
- `HERMES_BRIDGE_PILOT_SPEC.md`
- `HERMES_BRIDGE_OPERATION_MATRIX.md`
