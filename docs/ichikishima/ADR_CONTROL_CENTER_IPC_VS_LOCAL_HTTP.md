# ADR: Control Center — IPC 本命 と Local HTTP（補助）の分界

**ステータス**: 採用（設計のみ・本書はコード変更を伴わない）  
**日付**: 2026-05-03  
**読み順**: 本書 → `CONTROL_CENTER_OWNERSHIP_MODEL.md` / `HERMES_BRIDGE_OWNERSHIP_MODEL.md` → `CONTROL_CENTER_V1_IPC_CONTRACT.md` / `CONTROL_CENTER_LOCAL_API_CONTRACT.md`

---

## 1. 結論

1. **Control Center V1 の本命経路は IPC read-only の一本化**（将来 Electron とする場合: **renderer → preload 限定 → `controlCenter.readonly.getSnapshot` → main → `getControlCenterReadonlyData`**）。
2. **Local HTTP (`127.0.0.1` `GET /snapshot`) は補助**であり、**常時 listen しない**。**明示的起動／停止**・露出時間の最小化を前提とする。V1.5 候補で **token／Origin／明示フラグ**を別 ADR で検討する。
3. **Static Shell**（ドキュメント配下の HTML）は **レイアウト・契約確認用 mock**。本番運用パイプラインへの組み込みは **Electron IPC 側を正**として設計レビューする。
4. **Hermes Bridge** は **Hermes／疑似 Pilot の操作ルーティング**用。**Control Center Local API と混ぜない**（同一ポートに Hermes 操作用 RPC を載せない、Bridge が UI Snapshot を返す経路も持たない）。

---

## 2. 推奨経路

### UI（Electron 本命・未実装の間はこの形を設計固定）

```text
renderer
  └─ preload で露出される論理 RPC のみ（allowlist）
       └─ controlCenter.readonly.getSnapshot
            └─ main: getControlCenterReadonlyData
```

### Local HTTP（補助・任意）

```text
GET http://127.0.0.1:<port>/snapshot
  └─ node:http、`local-api-server.ts`
  └─ 成功時ペイロードは論理的に IPC Snapshot と同等（契約どおり）
  └─ 起動オーナーシップ・常時運用しないことは CONTROL_CENTER_OWNERSHIP_MODEL に従う
```

### Hermes Bridge

```text
Hermes / 疑似 Hermes Pilot 入力
  └─ hermesBridge.pilot.*（論理名前空間）／既存モジュール（routeHermesOperation 等）
  └─ Zone / Approval Queue（追記のみ） / Audit（追記のみ） / Review Mode
```

---

## 3. 論理名前空間

### 3.1 許可（read-only／pilot メタのみ）

```text
controlCenter.readonly.*
approvalQueue.readonly.*
auditLog.readonly.*
hermesBridge.readonly.*
hermesBridge.pilot.*
hermesBridge.registry.*
```

※ `registry` は **許可／禁止 API レジストリの参照・readiness メタ**等に限定。**実行は載せない**。実装詳細は `HERMES_BRIDGE_API_REGISTRY.md`。

### 3.2 禁止（V1 では IPC／HTTP のいずれにも載せない）

```text
rawFs.*
rawShell.*
rawNetwork.*
rawGit.*
approval.execute.*
controlCenter.execute.*
localApi.hermesRun.*
snapshot.execute.*
hermesBridge.raw.*
mt5.*
memoryDb.write.*
```

既存の `CONTROL_CENTER_V1_IPC_CONTRACT.md` §4 の禁止リストと **意図的に整合**すること。細部の綴り差（例: `shell.*` と `rawShell.*`）は **「生シェルを露出する名前」禁止** とみなして同一視する。

### 3.3 Hermes Bridge — 将来 IPC（preload）の読取メタ候補

**まだ実装しない**が、preload に載せうる論理名はコード **`HERMES_BRIDGE_REGISTRY_IPC_CANDIDATE_RPCS`**（**単一：`hermesBridge.registry.getReadiness`**）と一致させる。**返却は要約のみ** — allowed/forbidden の**完全一覧は IPC で返さない**。

一覧誤解防止のため、**当面 IPC に載せない論理チャネル**は **`HERMES_BRIDGE_REGISTRY_IPC_EXPLICITLY_FORBIDDEN_RPCS`**（含: `…getAllowedApis` / `…getForbiddenApis` / `hermesBridge.pilot.getReadiness` / pilot.run 等）。

---

## 4. 起動オーナー（要約）

| コンポーネント | オーナーの意味 |
|----------------|----------------|
| Control Center UI プロセス | **誰がウィンドウを開き、preload によって何を許可するか**を決める。 |
| Local HTTP API | **誰が `startControlCenterLocalApiServer` を呼ぶか**。常時自動起動のデフォルトにしない。 |
| Hermes Bridge | **Hermes／Pilot の操作列**をどこまで許可リストに載せるか（`hermes-bridge-api-registry.ts` が機械的正）。 |
| Audit / Approval 永続化 | Zone 内 JSONL 追記の **経路所有者** — キュー実行・自動承認とは分離（詳細は各 Ownership Model）。 |
| ユーザー承認 | **実行の最終トリガは人**。Review／Queue は **確定しない**（現行ポリシー）。 |

詳細は `CONTROL_CENTER_OWNERSHIP_MODEL.md` / `HERMES_BRIDGE_OWNERSHIP_MODEL.md`。

---

## 5. 起動・停止（Local HTTP）

- **デフォルト常時 ON にしない**。開発・確認・明示オプションでのみ listen。
- **`stopControlCenterLocalApiServer` が可能**であることは実装済み（`local-api-server.ts`）。運用側で解放を保証する。
- **起動中は Control Center に「Local API UP」状態を見せる**（将来 UI／Snapshot の `disabledActions` 等で表現。**実装 Goal は別承認**。本 ADR は方針のみ）。
- **実行系 HTTP API は追加しない**。V1 は `GET /snapshot` のみ維持。

---

## 6. 混線防止（不変条件）

| 区間 | 不変 |
|------|------|
| Local API と Hermes | Local API は **Hermes 操作・Pilot 入力を HTTP で受けない**。 |
| Bridge と Snapshot | Hermes Bridge 経路は **UI Snapshot 本文を返す役割を持たない**。 |
| Approval Queue | **承認キューは実行しない**（追記／状態遷移の記録まで）。 |
| Audit Log | **監査は操作を実行しない**。 |
| Review Mode | **承認確定しない**／自動許可しない。 |

---

## 7. 次 Goal 候補

1. **Hermes Bridge Final Review** の継続・人手ゲート達成ログの確定。
2. **Control Center IPC read-only** の preload への **最小バインド**（別 Goal・レビュー必須）。
3. **Local HTTP V1.5** — token／Origin allowlist／明示 enable フラグの別 ADR。
4. **Hermes Bridge Pilot** 次段（実ランタイム前の許可リスト増減のみ、混線しないこと）。
5. **Control Center App Management Snapshot** と **readonly IPC 準備**（現状: **`control-center-readonly-ipc.ts`** が handler 構築。**main 恒久配線は未着手でも可**。`CONTROL_CENTER_READONLY_IPC_APP_CONTRACT.md`）。

---

## 8. 補足（App Management Foundation · read-only）

`buildControlCenterAppSnapshot` が返す **App Snapshot は識別子配列・stdio・secrets を含めない**。`registerControlCenterReadonlyIpcHandlers` は **`ipcMain` 互換を DI**。Electron 本番ウィンドウ・preload での自動公開は **従来どおり別 Goal**。本命経路は引き続き **IPC が正** とする（§1）。

---

## 関連ドキュメント

- `CONTROL_CENTER_OWNERSHIP_MODEL.md`
- `HERMES_BRIDGE_OWNERSHIP_MODEL.md`
- `CONTROL_CENTER_V1_IPC_CONTRACT.md`
- `CONTROL_CENTER_LOCAL_API_CONTRACT.md`
- `CONTROL_CENTER_READONLY_IPC_APP_CONTRACT.md`
- `CONTROL_CENTER_APP_MANAGEMENT_FOUNDATION_SPEC.md`
- `CONTROL_CENTER_LOCAL_API_THREAT_MODEL.md`
- `HERMES_BRIDGE_FINAL_REVIEW.md`
- `HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md`
- `HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md`
- `HERMES_BRIDGE_API_REGISTRY.md`
- `NEXT_GOALS.md` / `IMPLEMENTATION_HANDOFF.md` / `ROADMAP_STATUS.md`
## 2026-05-07 B-1 Cleanup Addendum

- Current canonical IPC is `controlCenter.readonly.getAppSnapshot`.
- Historical `controlCenter.readonly.getSnapshot` references are retired legacy context.
- Do not reintroduce legacy `getSnapshot` as a registered IPC handler or local HTTP mirror.
