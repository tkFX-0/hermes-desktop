# Control Center V1 — UI 方式比較と推奨（Read-only Dashboard）

**位置づけ**: Ichikishima Control Center を **別 Repo または分離ディレクトリ** で立ち上げる前提の UI 方式選定。  
**今回の境界**: 実装は **しない**（コード・画面・依存追加なし）。本書は **設計確定のみ**。

---

## 1. 比較対象

| # | 方式 |
|---|------|
| 1 | **Browser UI + local backend**（FastAPI / Express / 既存ローカル HTTP 等） |
| 2 | **Electron + React**（main / preload / renderer 分離） |
| 3 | **Tauri + React** |
| 4 | **WebView2**（ホストは .NET / Win32 等） |
| 5 | **既存 FastAPI + ブラウザ UI**（1 の派生・既存資産がある場合） |

---

## 2. 比較観点（要約表）

| 観点 | Browser + local backend | Electron + React | Tauri + React | WebView2 | FastAPI + ブラウザ |
|------|-------------------------|-------------------|---------------|----------|-------------------|
| Windows 個人アプリとしての扱いやすさ | 中（ブラウザタブ常駐） | 高 | 中高 | 高 | 中高 |
| セキュリティ（権限縮小のしやすさ） | 高（UI は HTTP/WS の contract のみ） | **設定次第**（preload 限定が必須） | **設定次第**（capabilities 理解が要る） | 高〜中（ホスト実装依存） | 高 |
| raw fs 漏洩リスク | **低**（UI が fs を持たない） | **高〜低**（`nodeIntegration:false` が命） | 中〜低 | 低〜中 |
| Renderer 権限分離 | 明確（DOM のみ） | **preload が境界** | **Tauri の権限モデルが境界** | WebView とホスト間 API |
| 既存コード（hermes-desktop）との相性 | 離脱しやすい | 親和性はあるが **renderer 依存を増やすと危険** | 中 | 別言語ホスト時は低 |
| 将来 React Flow / Three.js | 可 | 可 | 可 | 可 | 可 |
| 実装コスト（V1 read-only のみ） | **低〜中** | 中〜高（安全設定の儀式） | 中（Rust 周りの学習） | 中〜高 |
| 配布のしやすさ | 中（ランタイム＋ブラウザ） | 中（サイズ・更新） | 良 | 良（単体EXE寄り） |
| デバッグのしやすさ | **高**（ブラウザ DevTools） | 高 | 中 | 中 |

---

## 3. V1 での現時点推奨

**第 1 候補**: **Browser UI + local backend**（またはプロジェクトが既に持つ **FastAPI + ブラウザ** があればそれを活用）。

理由:

1. UI に **Node / fs / child_process を載せない**のが最も説明しやすい。
2. **read-only** のみの phase では、**1 本の集約 API**（`controlCenter.readonly.getSnapshot` → `getControlCenterReadonlyData` 相当）を HTTP で返すだけにしやすい。
3. hermes-desktop を **参考のみ**にし、閉じた read-only 管制盤を別プロセスで持てる。

**第 2 候補**: **Electron** を使う場合は **必須条件**を満たすこと:

- `nodeIntegration: false`
- `contextIsolation: true`
- **preload 経由の限定 API のみ**（read-only 1 本から開始）
- Renderer から `fs` / `child_process` / `net` / `git` を **直接 import しない**

**Tauri / WebView2**: チームの習熟度と配布形態で後から評価。V1 は **安全第一で Browser 経路が最短路**。

---

## 4. V1 でやらないこと

- 「アプリ感」だけを理由に権限広めの Electron シェルを採用すること。
- Renderer に実行系名前空間（`*.execute.*`）を早期に増やすこと。
- Hermes **実本体**の常駐起動ボタン（V1 は **無効または非表示**）。

---

## 5. 関連文書

- `CONTROL_CENTER_V1_SECURITY_MODEL.md`
- `CONTROL_CENTER_V1_IPC_CONTRACT.md`
- `CONTROL_CENTER_V1_SCREEN_SPEC.md`
- `CONTROL_CENTER_V1_IMPLEMENTATION_READINESS.md`
- `HERMES_BRIDGE_FINAL_REVIEW.md`
## 2026-05-07 B-1 Cleanup Addendum

- Read-only renderer data must come from `controlCenter.readonly.getAppSnapshot`.
- Legacy `controlCenter.readonly.getSnapshot` is retired and must not be reintroduced.
