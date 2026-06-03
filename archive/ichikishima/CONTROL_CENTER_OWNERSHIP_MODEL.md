# Control Center — オーナーシップモデル（UI / IPC / Local HTTP）

**位置づけ**: **Static Shell**、将来の **Control Center アプリ UI**、**Local HTTP read-only API**、および **IPC の論理 RPC** が混線しないよう、**誰が何を決め・何を起動するか**を固定する。**コード実装の義務は生じさせない**。  
**前提 ADR**: `ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md`

---

## 1. スコープ

本書は次のみを対象とする：

- Control Center が **ユーザーに見せる読み取りデータ**の取得経路（IPC 本命）。
- **`127.0.0.1` Local API** の **運用上の所有者**と **いつ listen してよいか**。
- **Snapshot に含まれうる readiness／表示状態**との関係。

**対象外**: Hermes 本体プロセス、`hermes-desktop` メインへの実 IPC ワイヤー、`npm install`、EA/MT5。

---

## 2. オーナー一覧

### 2.1 Control Center UI Owner

| 項目 | 内容 |
|------|------|
| **決めること** | どの論理 RPC を preload 経由で renderer に許可するか。現在の正規経路は **`controlCenter.readonly.getAppSnapshot` のみ**。Legacy `getSnapshot` is retired. |
| **しないこと** | raw Node、ファイルピッカー以外の広い fs、Hermes Pilot の直接入力、実行系名前空間の露出。 |

### 2.2 Local HTTP API Owner

| 項目 | 内容 |
|------|------|
| **決めること** | `startControlCenterLocalApiServer` / `stop` を **誰が呼ぶか**（例: メインプロセスの開発メニュー、CLI、将来の単一フラグ）。 |
| **原則** | **デフォルト常駐しない**。**明示起動**のみ。停止可能であること（実装済み）。 |
| **しないこと** | Hermes の操作入力を HTTP で受ける。CORS でブロード公開する。`0.0.0.0` bind。 |

### 2.3 Snapshot データ責務（論理）

| 項目 | 内容 |
|------|------|
| **正** | `getControlCenterReadonlyData` が返す **`ControlCenterReadonlyData`**（`CONTROL_CENTER_V1_UI_DATA_CONTRACT.md`）。 |
| **経路の二重** | IPC と Local HTTP は **結果の論理複製**のみ。オーナーシップとしては **異なる運用レイヤ**（ADR 参照）。 |

### 2.4 状態表示 Owner（将来 UI）

Local API が **.listen している間**は、Snapshot または専用カードで **「Local HTTP: ON / OFF」** と **bound port（必要最小限）** をユーザーに見せることを推奨（**実 UI 実装は別 Goal**）。  
**クエリ・Authorization のログ垂れ禁止**ポリシーは `CONTROL_CENTER_LOCAL_API_THREAT_MODEL.md` に従う。

---

## 3. Static Shell の位置付け

- **オーナー**: ドキュメント／開発者ワークフロー（リポジトリ内 mock）。
- **目的**: **レイアウト確認**と **`getControlCenterReadonlyData` 互換 JSON** のレビュー。
- **Electron 本命 UI との関係**: 置き換えではなく **参照用**。短命の便利のためだけに Local HTTP へ載せ換える場合、CORS／Origin／port 問題が増えるため **ADR で IPC を本命**としている。

---

## 4. 他コンポーネントとの分界

| 隣接 | ルール |
|------|--------|
| **Hermes Bridge** | Control Center が **Hermes を HTTP で駆動しない**。Bridge が **Dashboard Snapshot を提供しない**。詳細は `HERMES_BRIDGE_OWNERSHIP_MODEL.md`。 |
| **Approval / Audit** | Snapshot には **summary のみ**。キュー実行・ログ全文送信はしない（既契約）。 |

---

## 関連

- `ADR_CONTROL_CENTER_IPC_VS_LOCAL_HTTP.md`
- `CONTROL_CENTER_V1_IPC_CONTRACT.md`
- `CONTROL_CENTER_LOCAL_API_CONTRACT.md`
- `CONTROL_CENTER_V1_LOCALHOST_SECURITY.md`
- `CONTROL_CENTER_LOCAL_API_THREAT_MODEL.md`
- `HERMES_BRIDGE_OWNERSHIP_MODEL.md`
## 2026-05-07 B-1 Cleanup Addendum

- Ownership decision is now `controlCenter.readonly.getAppSnapshot` only for the Ichikishima Control Center preload namespace.
- Legacy `controlCenter.readonly.getSnapshot` is retired and must not be revived without a new security review.
