# Control Center — Packaged Path Smoke（人手 Signoff）

**用途**: **`pendingPackagingResolution` を false にする**ときの **記録専用**。**コードや CI は自動では埋めない**。  
関連: `CONTROL_CENTER_PACKAGED_PATH_SMOKE_TEST_SPEC.md`。  
**注意**: **`packaged verified`（path smoke 済み）でも `productionReady:false` は維持**（別ゲート）。**Hermes 実接続 READY ではない**。

---

## 手順

1. `CONTROL_CENTER_PACKAGED_PATH_SMOKE_TEST_SPEC.md` に沿って **短命 packaged 起動**で観測する（別 Goal）。
2. すべて §解除条件を満たしたら下文を埋める。
3. **Go** のときのみ、リポジトリの **別リリース手順**で `pendingPackagingResolution` / ラベル更新を適用する。

---

## 記録（コピー用テンプレート）

### メタ

| 項目 | 記入 |
|------|------|
| Smoke 実施日（UTC 推奨） | |
| 実施者（氏名または handle） | |
| build kind（例: unpacked dir / installer / portable） | |
| app version / git SHA | |

### Snapshot / path メタ（観測値・短文のみ）

| 項目 | 記入 |
|------|------|
| `snapshotSourceLabel`（運用ラベル。絶対パスは書かない） | |
| `pathResolutionRuntimeMode` | |
| `pathResolutionStatus` | |
| **解除対象**: `pendingPackagingResolution` を **false にしてよい** | ☐ はい（Go のみ） |

### 機能分解確認（チェックのみ・本文はリンクや別紙）

| 項目 | OK |
|------|-----|
| sandbox 解決が期待どおり（誤ディレクトリでない） | ☐ |
| approval 集計／保存先論理が期待どおり | ☐ |
| audit 集計／保存先論理が期待どおり | ☐ |
| handoff inbox／marker 論理が期待どおり | ☐ |

### Renderer ・安全（観測）

| 項目 | OK |
|------|-----|
| raw **絶対パス**が Renderer に **表示されていない** | ☐ |
| secrets / env が **表示されていない** | ☐ |

### 境界（実行系なし）

| 項目 | OK |
|------|-----|
| 実行系 IPC が **存在しない／露出していない** | ☐ |
| **`productionReady` は false のまま** | ☐ |
| **実 Hermes が起動していない** | ☐ |
| **`wsl.exe` が実行されていない** | ☐ |
| **`execFile` / child_process が実行されていない** | ☐ |

### 総合判定

| 判定 | ☐ Go ☐ Hold ☐ Reject |
|------|------------------------|
| 備考（短文。パス全文・secrets は書かない） | |

---

## Task A 記録 — Final Read-only Validation Pack（自動 smoke **未実施**, 2026-05-06）

| 項目 | 内容 |
|------|------|
| 実施したか | **していない**（短命 packaged / Electron 自動 smoke は未実行） |
| 理由 | `electron-vite dev|preview` は **対話的・長寿命**。`build` / `build:unpack` は **フルビルド + electron-builder**。リポに **ヘッドレス packaged Control Center 専用スクリプトが無い**。ユーザー指示の **npm install・外部通信・installer** は行わない前提。 |
| レビューした scripts | `package.json`: `dev`, `start`, `build`, `build:unpack`, `build:win`, … |
| **`pendingPackagingResolution:false` にできるか** | **できない**（証拠なし。**true 維持**） |
| **`productionReady`** | **false 維持（別ゲート）** |
| 本番 READY 表現 | **使用していない** |

---

## Build smoke 記録 — electron-vite build（Stage 1 · **packaged smoke ではない**, 2026-05-03）

| 項目 | 内容 |
|------|------|
| **実施したか** | **した**（**Electron アプリの起動なし**。**packaged アプリ・installer 作成なし**） |
| **実行 script** | `npm run build`（内部: `npm run typecheck` → `electron-vite build`。`electron-builder` 未使用） |
| **結果** | **成功** — main (`out/main/index.js`)、preload (`out/preload/index.js`)、renderer（`out/renderer/`）の production bundle が出力された |
| **packaged verified とは** | **書かない**。本記録は **build smoke のみ**。§3 の P1〜P9 / §9 は **未充足** のまま |
| **`pendingPackagingResolution`** | **`true` 維持**（本記録だけでは §9 に到達しない） |
| **`productionReady`** | **`false` 維持**（別ゲート） |
| **次段** | **packaged short launch smoke** は **別 Goal**（短命起動＋人手観測＋この Signoff を Go で埋める作業） |

---

## Short launch smoke 記録テンプレ（**短命 packaged 起動 · 別 Goal で実施**）

**本節はテンプレのみ。本 Goal では欄を埋めない。** 正本: `CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_SMOKE_SPEC.md`、`CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_RUNNER_CONTRACT.md`。証拠評価: `control-center-packaged-short-launch-contract.ts`（**Electron 起動なし**）。

### メタ

| 項目 | 記入 |
|------|------|
| 実施日時（UTC 推奨） | |
| 実施者（氏名または handle） | |
| **実施コマンド**（短文。argv 全文・exe 絶対パスは書かない） | |
| build kind（例: electron-builder `--dir` / unpacked / その他） | |
| app version / git SHA（短文） | |

### 起動・時間

| 項目 | 記入 |
|------|------|
| **起動から主要観測までの時間**（秒または分・概算） | |
| **timeout 設定**（上限） | |
| 終了カテゴリ（0 / 非0 / 手動終了 / 不明） | |

### Snapshot / path メタ（短文のみ）

| 項目 | 記入 |
|------|------|
| `snapshotSourceLabel` | |
| `pathResolutionRuntimeMode` | |
| `pathResolutionStatus` | |
| `pendingPackagingResolution` | |
| `productionReady` | |

### 安全・非表示確認

| 項目 | OK |
|------|-----|
| raw **絶対パス**が Renderer に **表示されていない** | ☐ |
| secrets / env / raw payload が **表示されていない** | ☐ |
| 実行系 IPC が **露出していない**（`getAppSnapshot` のみ） | ☐ |

### 境界（副次プロセス）

| 項目 | OK |
|------|-----|
| **実 Hermes が起動していない** | ☐ |
| **`wsl.exe` が実行されていない** | ☐ |
| **許可外 `execFile` / child_process が実行されていない** | ☐ |

### 総合判定（Short launch）

| 判定 | ☐ Go ☐ Hold ☐ Reject |
|------|------------------------|
| 備考（短文。**stdout 全文・生パス・secrets 禁止**） | |

**注意**: Short launch **Go** でも **`productionReady:false` 維持**。**`pendingPackagingResolution:false`** は **full path smoke / §9 / 別 Signoff** のみ。**build smoke 成功だけでは false にしない**。

---

## 禁止

- 証拠のない **`pendingPackagingResolution:false`**。
- 「本番 READY」「Hermes READY」との **混同文**。
- このテンプレに **生パス・API キー**を貼ること。
## 2026-05-06 Pre-Execution Pack Note

| Item | Status |
|------|--------|
| Packaged short launch smoke | HOLD / not executed |
| Reason | No approved short-launch execution evidence was produced in this pack. `build:unpack`, `build:win`, installer creation, signing, and long-lived Electron launch remain out of scope. |
| `productionReady` | false must remain unchanged |
| `pendingPackagingResolution` | true must remain unchanged unless a later full Signoff explicitly clears it |
| Raw path / stdout / secrets | not recorded |
| Next goal | Separate packaged short launch smoke Goal, with short-lived launch constraints and redacted evidence only |
