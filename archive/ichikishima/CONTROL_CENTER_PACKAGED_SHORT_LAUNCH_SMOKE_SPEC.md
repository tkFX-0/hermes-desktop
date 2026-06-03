# Control Center — Packaged **Short Launch** Smoke（設計 SPEC）

**位置づけ**: **実際の packaged / unpacked 生成物**を **短命**だけ起動し path・Snapshot・Renderer 安全を **人手で観測**するための **設計**。  
本ファイルは **契約と観測項目**の固定。**ドキュメント作成のみでは smoke は完了しない**。  
関連: `CONTROL_CENTER_PACKAGED_PATH_SMOKE_TEST_SPEC.md`、`CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_RUNNER_CONTRACT.md`、`CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md`。  
補助コード: `control-center-packaged-short-launch-contract.ts`（**Electron 起動なし・証拠評価のみ**）。

---

## 1. 目的

- **build smoke（Stage 1）**と **§9 完全解除（Signoff Go）**の間の **中間ゲート**として、**時間上限付き**の **packaged 短命起動**で観測可能な事実を揃える。
- **short launch 成功**は **`pendingPackagingResolution:false` の十分条件ではない**（本 SPEC §9、`CONTROL_CENTER_PACKAGED_PATH_SMOKE_TEST_SPEC.md` §9 と整合）。
- **Composer2 内継続**前提: Codex 引き継ぎ文書は本 Goal では作らない（§15）。

---

## 2. build smoke との違い

| 観点 | build smoke（Stage 1） | short launch smoke（本 SPEC） |
|------|------------------------|-------------------------------|
| 主目的 | TS / bundle / import / main・preload・renderer **ビルド破綻の検知** | **packaged 実行時**の Snapshot・path メタ・UI 安全の **短命観測** |
| 典型コマンド | `npm run build`（`electron-vite build` のみ） | **別承認**の `build:unpack` 等で生成した **成果物**の **短命起動**（本リポの標準スクリプトは要確認） |
| `app.getPath` / `resourcesPath` | **検証しない** | **観測対象**（ただし Renderer に生文字列を出さない） |
| `getAppSnapshot` | **ビルド済みコードの静的整合のみ**では不十分 | **実行時**に成功・パース可能であること（観測） |
| **`pendingPackagingResolution:false`** | **根拠にならない** | **単体では根拠にならない**（Signoff・§9 満足が必要） |

---

## 3. packaged path smoke との関係

- **packaged path smoke**（`CONTROL_CENTER_PACKAGED_PATH_SMOKE_TEST_SPEC.md` §3）は **全面観点（P1〜P9）**。
- **short launch**は **時間・観測コストを抑えたサブセット**として先に走らせる **オプションの段階**。失敗時は **full packaged smoke を実施しない**。
- **Signoff 最終 Go** と **§9 解除**は **引き続き** `CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md` と full SPEC に準拠。short launch だけで **「packaged verified」**と書かない（§13）。

---

## 4. short launch の定義

- **生成物**: `electron-builder --dir` 等で得た **unpacked ディレクトリ**上の **製品 exe**、または**同等の短命起動可能な packaged 成果物**（installer **実行**や **サイレント更新は別門**）。
- **短命**: 運用で定める **上限ウォールクロック**（例: 数分未満）内に **起動→観測→（必要なら）正常終了または操作者による終了**。
- **自動 E2E ではない**: 人手または**将来**の runner（`CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_RUNNER_CONTRACT.md`）が許可する範囲のみ。

---

## 5. 起動してよい条件

次を **すべて**満たすこと（人手が判断）。

- **事前**: **electron-vite build smoke** または同等の **ビルド成功記録**がある（`CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md` § Build smoke 参照）。
- **承認**: **ユーザーまたは Composer2 明示**で「short launch smoke **実施**」Goal が承認されている。
- **環境**: テスト用ユーザーデータ。**本番 `.env` / secrets / 本番 memory DB を読まない**方針。
- **禁止ツールの不使用**: 目的外の **実 Hermes / `wsl.exe` / Controlled Pilot 実 `execFile`** を起動しない。

---

## 6. 起動してはいけない条件

次のいずれかなら **実施しない**（safe pending）。

- `npm install` / 依存追加が必要。
- **証拠記録**（Signoff 欄・観測メモ）を **残せない**。
- **ヘッドレス専用ランナーが未整備**で、対話的に長寿命プロセスが残る懸念が解消しない。
- CI だけで無人実行が求められる（本 smoke は **人手ゲート**が主）。

---

## 7. 観測する項目

観測は **短文ラベル・真偽・件数**に留める（**raw の絶対パス・stdout 全文は保存しない**）。`control-center-packaged-short-launch-contract.ts` の checklist ID と対応可能。

- **時刻・継続時間**: 起動から主要観測までの **秒数**（上限比較用。ログファイルに **stdout ダンプ禁止**）。
- **終了**: **終了コード**が分かる場合は **分類のみ**（OK / 非0 / 不明）。**全文は保存しない**。
- **Snapshot**: `getAppSnapshot` が **成功**し、UI が **パース拒否を成功扱いにしていない**。
- **path メタ**: `snapshotSourceLabel` / `pathResolutionRuntimeMode` / `pathResolutionStatus` / `pendingPackagingResolution` の **運用ラベルとしての一致**（短文）。
- **Renderer**: Control Center Shell が **エラー表示規約**に沿う（成功偽装なし）。**raw パス非表示**。
- **境界**: **実行系 IPC なし**。**実 Hermes / wsl / execFile（目的外）なし**。

---

## 8. 観測してはいけない情報（記録禁止）

- **raw absolute path**（ディスク全体・ユーザー profile の実パス）。
- **secrets**、**.env**、**API キー**、**memory 本文**。
- **Bridge raw payload 全文**、**stdout/stderr 全文**。
- **「packaged verified」** の **Signoff なし**での表現、**`productionReady:true`** の暗示。

---

## 9. 成功条件（short launch として）

次を **運用者が**満たすと **short launch smoke 成功**と呼んよい（文書上）。**自動判定はコードモジュールの evidence 形のみ**。

- §5 を満たし、§6 に該当しない。
- §7 の各項目が **期待どおり**（Go のチェックがつく）。
- **`productionReady`** は **false のまま**観測される。
- **`pendingPackagingResolution:false` にコード変更しない**（§10 と Signoff 手順）。

---

## 10. 失敗条件

- 起動 **ハング**（タイムアウト超過）または **クラッシュ**で観測不能。
- `getAppSnapshot` **失敗**・Renderer が **エラーを隠す**。
- **raw パス・secrets** が画面に出る。
- **目的外プロセス**（実 Hermes / `wsl.exe` / 許可外 exec）が走る。

失敗時は **Signoff Hold/Reject**、`pendingPackagingResolution:true` 維持、**再設計または再ビルド**後に再試行。

---

## 11. タイムアウト方針

- **短**: デフォルト上限は運用で固定（例: **120s 観測ウィンドウ** — 本数値は実 Goal で確定可）。
- **runner**（将来）も **上限越えで打ち切り**可能に設計（`CONTROL_CENTER_PACKAGED_SHORT_LAUNCH_RUNNER_CONTRACT.md` §4）。
- **timeout しても** **stdout 全文をログに貼らない**。

---

## 12. ログ方針

- **短文メタのみ**（例: `decision=complete_for_signoff` / `timeout` / `exit_nonzero`）。
- **チェックリスト**は `CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md` の **Short launch** 節に **チェックのみ**。
- **リポジトリに証拠ディレクトリを作らない**（別 Goal・承認付きでない限り）。

---

## 13. Signoff 方針

- **short launch 成功**は **`CONTROL_CENTER_PACKAGED_PATH_SIGNOFF.md` の Short launch 節**に **Go** が付いた状態を指す（人手）。
- **§9 の `pendingPackagingResolution:false`** は、**full packaged path smoke / Signoff** が **別途 Go** のときのみリリース手順で実施（本 SPEC だけでは解除しない）。

---

## 14. STOP GATE（本 Goal 範囲と別承認）

次は **別 Goal**（本 SPEC の閲覧だけでは着手しない）。

- **実際の** `build:unpack` / `build:win` / Electron **起動**。
- **installer 作成・署名**。
- **`pendingPackagingResolution:false` のコード変更**（証拠なし）。
- **Codex / 外部 handoff 文書**の作成（本件では不要）。
- **実 Hermes / WSL / execFile 実機**。

---

## 15. Composer2 継続時の確認事項

- **build smoke** は成功済みか（Signoff § Build smoke）。
- **short launch** は **設計・契約・チェックリスト**まで完了し、**実起動は未**でもよい（本リポの状態）。
- 次は **ユーザー承認のもと**（または Composer2 明示 Goal）で **実 short launch** または **safe pending 記録**。
- **この範囲では問題を検出していません** — 実 smoke 未実施時は **証拠 empty** により `control-center-packaged-short-launch-contract` は **常に pending** 判定となる。

---

## 16. ゲート再掲（`pendingPackagingResolution` / `productionReady` / verified）

- **build smoke 成功だけでは `pendingPackagingResolution:false` にしない**。
- **short launch smoke 成功後も `productionReady:false` は維持**（別ゲート）。
- **Signoff なしに「packaged verified」表現を使わない**。
- **raw absolute path / secrets / raw payload / stdout 全文は記録しない**。
## 2026-05-06 Pre-Execution Pack Status

- This pack did not run a packaged short launch smoke.
- The current status is HOLD until a separate short-launch Goal explicitly approves a short-lived packaged launch.
- `build:unpack`, `build:win`, installer creation, signing, raw path capture, and long-lived Electron launch remain out of scope.
- `productionReady:false` and `pendingPackagingResolution:true` remain the expected state.
