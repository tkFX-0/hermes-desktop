# Control Center — Packaged Path Smoke Test（設計 SPEC）

**位置づけ**: 実 **packaged Electron** で path・Snapshot・UI が意図通りかを **人手＋短命起動**で確認するための **テスト設計のみ**。  
本ドキュメントの作成だけでは検証は完了しない。**Electron 自動起動・CI packaged ビルドは別 Goal**。  
関連: `CONTROL_CENTER_PROJECT_ROOT_RESOLUTION_SPEC.md`、`CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md`。

---

## 1. 目的

- **`pendingPackagingResolution` を false にできる根拠**を、再現可能な **観測項目**に落とす。
- **resolver の単体テストが緑**であることと、**実配布物で正しいディレクトリを見ている**ことは **別問題**であることを組織内で固定する。

---

## 2. なぜ resolver だけでは証明にならないか

- dev では `__dirname` 相対・マーカー検出が通りやすいが、**asar / インストール先**では `app.getPath` / `resourcesPath` / 実ファイル配置が **開発マシンと一致しない**。
- 候補列挙は **ヒューリスティック**であり、**最後の真実は実アプリ上の観測**（docs マーカー・zone 配下 JSONL の有無など）になる。
- よって **「prepared は十分」「実 packaged の正しさは未証明」** の二層を維持する。

---

## 3. packaged smoke で確認する項目（必須観点）

次を **順不同で**すべて満たすこと（詳細は §9 の解除条件と Signoff と整合）。

| # | 観点 | 確認内容（要約） |
|---|------|------------------|
| P1 | 起動 | packaged ビルドが **短命に起動**し、異常終了しない |
| P2 | Snapshot | **`getAppSnapshot`（read-only IPC）が成功**し、パース拒否にならない |
| P3 | ラベル | `snapshotSourceLabel` が **Signoff で定義する「packaged verified」状態**（コード上の別ラベル導入は **Signoff 承認後のリリース作業**） |
| P4 | Path メタ | `pathResolutionRuntimeMode` / `pathResolutionStatus` / `pendingPackagingResolution` が **期待値**（§9） |
| P5 | Sandbox | **zone／approval／audit／handoff** の解決が **誤ったルートを指していない**（相対論理・件数・存在。本文ダンプはしない） |
| P6 | Renderer 安全 | **raw 絶対パス・userData・resourcesPath・env・secrets** が UI に出ていない |
| P7 | production | **`productionReady` は false のまま**（別ゲート。smoke で true にしない） |
| P8 | IPC 境界 | **実行系 IPC・任意 invoke・raw preload 拡張がない** |
| P9 | 副次プロセス | **実 Hermes / `wsl.exe` / `execFile` / child_process** が **smoke の目的外で起動していない**（プロセス監視または運用確認） |

---

## 4. app.getPath / resourcesPath / userData の期待（smoke 観測）

- **projectRoot**: `docs/ichikishima` マーカーが **解決ルートで見える**こと（本リポジトリの同梱方針に従う）。
- **resourcesPath**: **候補探索の入力**として整合し、**Renderer に文字列を出さない**。
- **userData**: **ログ／将来の恒久 DB** 用として **projectRoot と混同されない**こと。UI・Snapshot の **安全要約にパスを載せない**。

---

## 5. sandbox / approval / audit / handoff の期待

- **sandbox（zone）**: `projectRoot` 配下の論理パスに一致し、`zone_outside_project_warning` が **不本意に常時発火していない**。
- **approval / audit**: 集計が **空であること**と **存在する場合の件数**が、**誤った別ドライブ・別ユーザ profile** を指していない（人手の対照チェック）。
- **handoff**: Stage 1 inbox が **想定 relative 配下**を参照している（パス文字列の画面表示はしない）。

---

## 6. renderer に表示してよい情報

- `snapshotSourceLabel` / `pathResolutionStatus` の **短文キー相当**。
- **packaged verified** と **packaged pending** の **意味が区別できるラベル**（Signoff 後にコード反映する場合の方針）。
- `pathResolutionSafeSummaryLines` 相当の **マスク済み短文**（**絶対パスパターンを含まない**）。

---

## 7. renderer に表示してはいけない情報

- `projectRoot` / zone / userData / resourcesPath / exe パスの **生文字列**。
- env・secrets・raw payload・stdio 全文・API 識別子配列ダンプ。
- **「本番 READY」「production verified」「real Hermes connected」「packaged safe」** の誤認表現。

---

## 8. productionReady:false 維持

- packaged path smoke が **すべて Go**でも **`productionReady:true` にしない**。  
  production は **署名・運用ポリシー・実行系門**など **別 MATRIX / Signoff**。

---

## 9. pendingPackagingResolution:false 解除条件

**次をすべて満たし、`CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md` が Go で埋まったときのみ**コード／設定で `pendingPackagingResolution` を false にできる（人手リリース作業）。

1. packaged build でアプリが起動する。
2. `getAppSnapshot` が成功する。
3. `snapshotSourceLabel` が「packaged path smoke 済み」の **運用定義**に合致（必要なら **新 enum をリリース**）。
4. sandbox / approval / audit / handoff の解決が期待通り（§5）。
5. Renderer に raw 絶対パス・secrets がない（§6–7）。
6. **`productionReady` は別ゲートのため false のまま**（§8）。
7. **実行系 IPC がない**（§3 P8）。
8. **実 Hermes / wsl.exe / execFile が smoke に付随して起動していない**（§3 P9）。

解除は **自動テストでは行わない**（本 SPEC フェーズ）。

---

## 10. smoke 失敗時の戻し方

- **`pendingPackagingResolution` は true のまま**維持（または明示的に戻す）。
- Signoff は **Hold / Reject** とし、resolver 側のヒューリスティックまたは **パッケージ同梱物**を修正後に **再 smoke**。
- ユーザー向け文言は **「packaged pending」** を復帰ラベルに戻す。

---

## 11. STOP GATE

以下は **別承認 Goal** とする（本 SPEC の範囲外で着手しない）。

- Electron **自動** E2E、CI での **自動 packaged** ビルド、installer 実行。
- `pendingPackagingResolution` を **証拠なしで false にするコード変更**。
- **実 Hermes / WSL / exec** を smoke の一部として実行。
- Renderer への **追加 IPC**（`getAppSnapshot` 以外）。

---

## 12. 補助コード

- **`control-center-packaged-smoke-checklist.ts`**: チェックリスト構造・ゲート要約・**証拠オブジェクト**に基づく評価（**実 packaging / Electron 起動なし**）。
- **`control-center-packaged-short-launch-contract.ts`**: **短命起動 smoke** 用チェックリスト・証拠評価（**実起動なし**）。仕様: `CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_SMOKE_SPEC.md`。

---

## 13. Task A 結果メモ（Final Read-only Validation Pack · 2026-05-06）

- **実 packaged 短命 smoke**: **未実施**（Electron 起動・`electron-builder` は本パックでは実行しなかった）。
- **根拠記録**: `CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md` § Task A 記録。
- **`pendingPackagingResolution`**: **証拠まで false にしない方針維持**。

---

## 14. electron-vite **build smoke**（packaged smoke ではない · Stage 1）

**これは §3 の packaged path smoke と別物**。`app.getPath` / `resourcesPath` / **`getAppSnapshot` の実行時検証**は含まない。  
**bundle / TS / main・preload・renderer のビルド破綻**を検知するだけ。

| 項目 | 内容 |
|------|------|
| 許可 script（例） | `npm run build`（=`npm run typecheck` → `electron-vite build`。**`electron-builder` なし**） |
| 禁止 | Electron アプリ長寿命起動、`electron-vite preview`/`dev`、`build:unpack` / `build:win` 等（installer / unpack dir 生成）、実 Hermes / `wsl.exe` / **実機 `execFile`**、`npm install` |
| packaged smoke との関係 | build が通っても **`pendingPackagingResolution:false` の根拠にならない**（§9 解除条件は packaged 短命起動＋ Signoff のまま）。 |
| `productionReady` | **別ゲート**。**build の成否のみでは true にしない**（§8 整合）。 |

**記録場所**: `CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md` § Build smoke 記録。  
**開発マシン実施ログ（参考）**: 2026-05-03 — `npm run build` 成功（main / preload / renderer の production build 完了）。

---

## 15. Packaged **short launch** smoke（中間ゲート · 設計）

**詳細は正本** `CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_SMOKE_SPEC.md`。  
build smoke（§14）と full packaged path smoke（§3 / §9）の **中間**。**build 成功のみでは `pendingPackagingResolution:false` にしない**。補助コードは **`control-center-packaged-short-launch-contract.ts`**。**実 short launch は未実施でも設計・契約・チェックリストは準備済み（Composer2 継続・Codex handoff なし）**。
