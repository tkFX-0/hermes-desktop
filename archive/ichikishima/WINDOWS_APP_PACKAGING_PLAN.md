# Windows アプリ Packaging 計画（**ビルド禁止フェーズ**）

**STOP**: installer / CI artifact / electron-builder 実行は **別 Goal**。

---

## 1. 対象アプリ運用像

単一 Control Center が **読取 IPC** と将来の許可リスト実行のみ公開。

---

## 2. Electron / Tauri / WebView2 の比較（再掲・短縮）

| 項目 | Electron | Tauri | WebView2 |
|------|----------|-------|----------|
| raw fs 露出リスク | 高（preload 設計依存） | 中〜低 | API 経由 |

---

## 3. packaging ゲートに入る前条件

| # | gate |
|---|------|
| 1 | read-only IPC 本配線 + レビュー |
| 2 | secrets モデル確定 |
| 3 | 署名・更新チャネル運用決定 |

---

## 4. pending

| 項目 | status |
|------|--------|
| 最終 shell 選択 | deferred |
| コード署名鍵管理 | deferred |
| アップデーター | deferred |
| **Snapshot `projectRoot` の packaged 実機検証** | **resolver prepared**。**build smoke 実施済**。**short launch 設計・契約・評価 TS 納品済（実起動なし）**。packaged 短命**起動ログは未** |

関連: `CONTROL_CENTER_ARCHITECTURE.md`、`CONTROL_CENTER_PROJECT_ROOT_RESOLUTION_SPEC.md`、`CONTROL_CENTER_PACKAGED_PATH_SMOKE_TEST_SPEC.md`、`CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md`、`CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_SMOKE_SPEC.md`

---

## 5. packaged path smoke（設計ゲート）

| 項目 | 状態 |
|------|------|
| resolver / UI pending ラベル | **prepared** |
| **electron-vite build smoke（bundle のみ）** | **実施済（2026-05-03）** — `npm run build`。**packaged 観測ではない**（`CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md` § Build smoke）。 |
| **packaged short launch smoke（設計・契約・TS 評価）** | **文書・`control-center-packaged-short-launch-contract.ts` 整備済（2026-05-03）**。**実アプリ短命起動は未**（`CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_SMOKE_SPEC.md`）。**Codex handoff 文書なし**。 |
| **実 packaged 短命起動 smoke** | **未実施（別 Goal）** |
| `pendingPackagingResolution:false` | **Signoff Go のみ**。`FINAL_READINESS_MATRIX.md` の blocker 参照 |

**Smoke で見る観点**（詳細は `CONTROL_CENTER_PACKAGED_PATH_SMOKE_TEST_SPEC.md`）: `getAppSnapshot` 成功、`userData/resourcesPath/projectRoot` **非露出**、sandbox／approval／audit／handoff 論理、実行系 IPC 無し、`productionReady:false` 維持。
