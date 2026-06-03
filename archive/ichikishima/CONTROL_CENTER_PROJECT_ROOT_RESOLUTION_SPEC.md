# Control Center — projectRoot / resourcesPath / userData / sandbox Resolution（read-only SPEC）

**位置づけ**: packaged Electron と dev ワークツリー両方で **read-only Snapshot の根拠パスが食い違わないため** の境界設計。実パッケージの常時起動検証やインストーラ作成は本 SPEC の対象外。

---

## 1. なぜ必要か

- 現状 `join(__dirname, '../..')` は **開発ビルド（ソース／dist の相対構造が安定）前提**であり、asar 組み込みやインストーラ配置では **チェックアウトリートが Electron ランタイムの外に存在しない**ことがある。
- Control Center が **状態を読むだけ**でも、`projectRoot` / `zoneRoot` がずれると **JSONL／docs 門の READY 判定が無意味または誤解を招く**。
- 「UI は完成寄りでも **snapshot の根拠はまだ開発用**」を **画面上で明示**する必要がある（後述）。

---

## 2. dev と packaged の違い（要点）

| 観点 | dev（開発） | packaged（Electron 配布物） |
|------|--------------|-------------------------------|
| `__dirname` 意味 | main 出力近傍から **ワークスペース近似** が取りやすい | `.asar`／`app/` 直下など **ソースツリーと別階層**になり得る |
| `docs/ichikishima` | ワークスペースに存在することが多い | **同梱されない構成**でもよい設計になり得る |
| 信頼度 | 「マーカー検出 + zone 内含」で高め | **`pendingPackagingResolution` とフォールバック候補**が必要 |

---

## 3. projectRoot の責務（論理）

- **read-only データの基準ディレクトリ**（NEXT_GOALS / Bridge 門 md / Zone などの **相対参照の起点**）。
- **Renderer / preload / IPC に絶対パス文字列として露出しない**。AppSnapshot へ載せるのは **`snapshotSourceLabel` / `pathResolutionStatus` / 短文 summaries のみ**。

---

## 4. zoneRoot の責務

- `projectRoot` 配下 **`sandbox/hermes-autonomy-zone` （既定セグメント）** を正とする。
- **project 外に解決される入力**は論理エラー。**provider 入力は sandbox 配下へ矯正**し、`zone_outside_project_warning` を付与する（データ破壊はしない）。

---

## 5. resourcesPath の扱い（候補のみ）

- `process.resourcesPath` は **単独では projectRoot に昇格しない**。
- packaged ヒューリスティックで **複数 candidate を総当たり**し、`docs/ichikishima` ディレクトリが見える最初の候補のみ優先。**見つからなければ既定フォールバック**に戻し **pending を維持**。

---

## 6. userData の扱い（候補のみ）

- `app.getPath("userData")` は **恒久ログ／SQLite／将来の恒久監査 JSONL** と混線させないため、この Goal では **projectRoot に採用しない**。
- メタのみ保持し Renderer へは **`userData` 文字を出さない**。

---

## 7. sandboxRoot の扱い

- 既定の **Hermes autonomy sandbox は `sandbox/hermes-autonomy-zone`** と固定（セグメント配列）。
- `sandboxRoot` という名前の独立 IPC は置かず、**論理上等価として zoneRoot と表記統一**（将来の名前空間分離時に再評価）。

---

## 8. read-only Snapshot source の表示方針（UI）

最低限 **次を常時表示**:

- **`Development snapshot / dev-only source`** 相当キーまたは **packaged pending** のラベル。
- **`productionReady: false`**（UI 複製）。
- **`Packaged path resolution pending`** が真のとき視覚的に区別できるバナー（色分けのみ可）。

載せない（禁止文言の例）:

- `production verified` · `packaged safe` · `本番 READY` · `real Hermes connected`。

---

## 9. dev-only label の条件

- Electron `app.isPackaged === false` かつ開発レイアウトとして **論理状態 `electron_development`** のとき、`snapshotSourceLabel = development_snapshot_dev_only_source`。  
  ドキュメントマーカー欠落でも **packaging pending フラグだけは立てない**（開発マシン構成の問題と区別）。

---

## 10. packaged pending / verified（`pendingPackagingResolution`）

- **既定**: packaged では `electron_packaged_pending` と `pendingPackagingResolution:true`。**コードだけで false にしない**。
- **`pendingPackagingResolution:false` の唯一の根拠**: `CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md` が **Go** で埋まった **あと**のリリース手順（人手）。評価項目の一覧は **`control-center-packaged-smoke-checklist.ts`** と `CONTROL_CENTER_PACKAGED_PATH_SMOKE_TEST_SPEC.md`。
- **packaged path verified ≠ `productionReady:true`**。後者は **別 MATRIX / Signoff**。
- **packaged path verified ≠ Hermes 実ランタイム READY**。

---

## 11. STOP GATE

次に **いずれか**に着手する際は、この SPEC を再評価:

- Approved execution / subprocess / Hermes runtime / EA/MT5 / memory SQLite 本番接続。
- Renderer への **追加 IPC**（単一 snapshot 経路ではない）。
- **packaged 自動 smoke**（Electron 自動起動）を CI に組む。**設計フェーズのみ**許可済み: `CONTROL_CENTER_PACKAGED_PATH_SMOKE_TEST_SPEC.md`。**実運用での自動起動は別承認**。

---

## 12. 将来の実行系との分離

- `projectRootResolution` メタと **Hermes Controlled Pilot／WSL／exec アダプタ** は **別モジュール**で保持。共通は **短文ラベルのみ**。Executable 経路や argv は Execution Gate 側の責務。

---

## 13. Packaged smoke（設計のみ・本 SPEC との関係）

- **本文書**: Resolver の論理。**実 packaged での証明は** `CONTROL_CENTER_PACKAGED_PATH_SMOKE_TEST_SPEC.md` と Signoff が正。
- **補助モジュール**（Electron 起動なし）: `control-center-packaged-smoke-checklist.ts`。

---

## 実装の正

- Resolver: `src/main/ichikishima/control-center/control-center-project-root-resolution.ts`
- Main 側 DI: `src/main/index.ts` の `getIchikishimaControlCenterReadonlyParams`
- Renderer 検証外形: `src/shared/ichikishima/control-center-shell-ui-contract.ts`
- Packaged smoke checklist（起動なし）: `src/main/ichikishima/control-center/control-center-packaged-smoke-checklist.ts`

## 関連

- `CONTROL_CENTER_PACKAGED_PATH_SMOKE_TEST_SPEC.md`
- `CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md`
- `CONTROL_CENTER_APP_SHELL_UI_SPEC.md`
- `WINDOWS_APP_PACKAGING_PLAN.md`
- `APP_ONLY_OPERATION_ROADMAP.md`
