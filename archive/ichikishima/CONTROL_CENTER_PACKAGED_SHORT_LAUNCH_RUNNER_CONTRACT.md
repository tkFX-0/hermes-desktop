# Control Center — Packaged Short Launch **Runner 契約**（設計）

**用途**: **将来**の smoke runner または **人手オペレータ**が従う **許可境界**。  
本リポの **`control-center-packaged-short-launch-contract.ts`** は **この契約に沿った証拠オブジェクトの評価のみ**。**Electron を起動しない**。**child_process を使わない**。

関連: `CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_SMOKE_SPEC.md`、`CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md`。

---

## 1. runner の目的

- packaged 成果物に対する **短命起動 smoke** を **再現可能**にし、**観測結果**を checklist evidence に落とすための **枠組み**を提供する。
- **CI での無承認自動起動**を **本命としない**（人手ゲート・別 Goal）。

---

## 2. runner が許される範囲（将来の実装時）

- **ユーザー承認済み**の環境でのみ、**文書化されたコマンド**（例: unpacked exe の起動）を **timeout 付き**で実行する **余地**（別 repo スクリプト／将来 Goal）。
- **観測**: 画面・短いメタ（成功/失敗分類）。**フル stdout 保存はしない**。
- **証拠**を `evaluateControlCenterPackagedShortLaunchEvidence` に渡せる形（boolean map）にする。

---

## 3. runner が絶対にしてはいけないこと

- **実 Hermes プロセス**、**`wsl.exe`**、**許可外 `execFile`**、**`shell: true`**。
- **目的外の `child_process`**（dummy bridge 以外・別契約のもの）。
- **`npm install` / 依存追加**、**外部への通信**、**`.env` / secrets の読み込み記録**。
- **`pendingPackagingResolution:false`** または **`productionReady:true`** への **自動変更**。
- **Signoff なし**で **「packaged verified」** と記録すること。

**本 Goal で追加した TypeScript モジュール**は **runner 実装ではなく**、**チェックリストと評価式のみ**。

---

## 4. timeout

- 既定の **観測上限**は SPEC と一致させる（`CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_SMOKE_SPEC.md` §11）。
- 超過時は **失敗または Hold**。**stdout 全文を貼らない**。

---

## 5. app exit

- **終了コード**は **カテゴリのみ**記録可（0 / 非0 / 不明）。** argv・path 全文禁止**。
- **ゾンビプロセス**を残さない（OS 依存の後始末は runner 側の責務・別設計）。

---

## 6. snapshot 取得確認

- **read-only IPC** `getAppSnapshot` が **成功**し、Snapshot が **スキーマ上拒否されない**こと（観測）。
- **validated 全文**をログに出さない。

---

## 7. renderer 表示確認

- **エラー時は明示エラー UI**（成功の偽装なし）。**raw 絶対パス・secrets 非表示**（`CONTROL_CENTER_APP_SHELL_UI_SPEC.md` 整合）。

---

## 8. `productionReady:false` 確認

- Snapshot / UI 上 **`productionReady` が true になっていない**こと。**smoke で true にしない**。

---

## 9. `pendingPackagingResolution` 確認

- short launch 単体の後も **通常は true のまま**。**false にするのは Signoff §9 とリリース手順のみ**。

---

## 10. 実行系 IPC がないこと

- `getAppSnapshot` 以外の **invoke 追加**がないこと。**任意 `ipcRenderer` 露出なし**。

---

## 11. 戻し方

- Signoff を **Hold** に戻す。
- コードで pending フラグを触った場合は **revert**（本契約モジュールは **触らない**）。
- 再 smoke は **ビルド／パッケージ修正**後に **新しい記録**で。

---

## 12. Composer2 での次実行手順（実 smoke 用・別 Goal）

1. `CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_SMOKE_SPEC.md` §5–§6 を再確認。
2. `CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md` の **Short launch** テンプレを開く。
3. `npm run build` 済みであることを確認（Build smoke）。
4. **承認された環境のみ**で `build:unpack` 等を検討（**本 Goal では実行しない**）。
5. 観測結果を **短文**で記入。**パス全文・stdout 禁止**。
6. evidence を boolean map にし、`evaluateControlCenterPackagedShortLaunchEvidence` で **pending / rejected / complete_for_signoff** を確認（自動は補助のみ）。

---

## コード対応表

| 契約節 | TS の主な checklist ID（参考） |
|--------|----------------------------------|
| §4 timeout | `launch_within_timeout_budget` |
| §5 exit | `exit_category_acceptable_or_documented` |
| §6 snapshot | `get_app_snapshot_ok` |
| §7 renderer | `renderer_no_raw_absolute_paths`, `renderer_error_ui_honest` |
| §8 | `production_ready_remains_false` |
| §9 | `pending_packaging_not_cleared_without_full_signoff` |
| §10 | `no_execution_ipc_exposed` |
| §3 境界 | `no_real_hermes`, `no_wsl_exe`, `no_unauthorized_execfile_or_child_process` |

（実装は `control-center-packaged-short-launch-contract.ts` を正とする。）
## 2026-05-06 Pre-Execution Pack Status

- Runner contract remains design-only in this pack.
- No packaged app, Electron process, or runner process was launched.
- No raw path, argv, stdout, stderr, payload, env, or secrets should be added as evidence.
- Next use requires a separate packaged short launch smoke Goal with short-lived execution limits and redacted checklist evidence.
