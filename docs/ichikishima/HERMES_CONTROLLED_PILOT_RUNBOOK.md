# Hermes Controlled Pilot Runbook（実機単発）

**実 Hermes は起動しない**場合は、この Runbook とテンプレの記入のみ行う。**実機単発は必ず別セッションで、ユーザーが全値を明示したときのみ**実施する。

---

## 1. 目的

許可済み実行ファイルを **短命・単発**で起動し、stdout が **単一 Bridge payload JSON**であり、検証済み情報が **Receiver → Minimal Pipeline** に流れることを **人が確認**する。本番常駐・本番 READY とは無関係。

**プラットフォーム（2026-05-05）**: [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) は **ネイティブ Windows exe 前提ではない**。**Windows では WSL2 上の `hermes`／**`wsl.exe` 経由の wrapper**が本命候補（`ADR_REAL_HERMES_WSL2_CONNECTION.md`）。**`wsl.exe` は実行口が広い**ため **argv 厳格固定 + 別ゲート**が必須。

**local value validator gate（2026-05-05）**: WSL2 wrapper route は `HERMES_WSL2_WRAPPER_LOCAL_VALUE_VALIDATOR_RUNBOOK.md` の redacted-only result を確認する。`HOLD` はユーザー実値未記入または placeholder 残り、`REJECT` は修正必須。`GO` でもこの Runbook の実機手順へ自動遷移しない。

**manual placement design（2026-05-06）**: `HERMES_WSL2_DUMMY_WRAPPER_MANUAL_PLACEMENT_PLAN.md` is prepared for future manual review. This Runbook remains blocked while local validator is `HOLD`.

---

## 2. 実行前チェック（必須）

- `validateHermesControlledPilotConfig` が **OK**。
- `evaluateHermesControlledPilotPreflight` が **GO_READY**（ただし**自動実行しない**）。
- SIGNOFF **`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md` §12** に「Controlled Pilot **実機 1 回**を許可」と短文記載済み。
- **argv・stdout が Hermes 側で成立する**ことがドキュメント／メモで確認済み。
- Electron **IPC で Hermes ingress を公開していない**ことを確認済み。

---

## 2.5 WSL2 wrapper パラメータ registry（コード・検証のみ）

- `hermes-wsl2-wrapper-parameter-registry.ts` + `HERMES_WSL2_WRAPPER_PARAMETER_REGISTRY_SPEC.md`。**実行はしない**。値は人手で埋め、**欠落は pending**。**`wsl.exe` 実起動は別承認**。
- **`HERMES_WSL2_WRAPPER_HUMAN_VALUE_PACKET.md`**: 人手 Signoff・**Sysnative V1.1 文書ゲート**。
- **`HERMES_WSL2_WRAPPER_LOCAL_VALUE_FILL_IN_RUNBOOK.md`** / **`HERMES_WSL2_WRAPPER_VALUE_SIGNOFF.md`**: **local JSON 記入〜検証〜 redacted Signoff の手順**（**実行なし**。実ファイル読込ヘルパーは別 Goal）。
- **`hermes-wsl2-wrapper-human-value-packet.ts`**: `validateHermesWsl2WrapperHumanValuePacket`、`validateLocalOnlyValuePacketShape`、`summarizeRedactedLocalValuePacket`（**メモリ上のみ・`fs` なし**）。Control Center に **`wsl2HumanValuePacketSummary`**。
- **V1 `executablePath`**: **`C:\Windows\System32\wsl.exe` の exact match のみ**（PATH／WindowsApps／`.cmd` は拒否）。wrapper POSIX パスは **厳密一致 + 禁止セグメント**参照（契約 §3b）。
- **dummy 設計物**: `sandbox/hermes-autonomy-zone/dummy-hermes/hermes-bridge-payload-once.sh.sample` — **WSL にコピーしない**。**`wsl.exe` で呼ばない**。

---

## 3. ユーザーが用意する値（全て明示・欠落なら実行しない）

| 項目 | 説明 |
|------|------|
| executablePath | 絶対パス（**`wsl.exe` の例: `C:\Windows\System32\wsl.exe`**。WSL 内スクリプトは argv の第 4 引数で固定） |
| adapterKind | 省略時 `native_executable` 相当。**`wsl.exe` では `wsl_wrapper` 必須**（実装: `hermes-controlled-pilot-config`） |
| allowedExecutableId | 短文キー |
| argv | **固定配列 1 本**のみ |
| cwd | Zone / sandbox 許可範囲 |
| timeoutMs | 短命 |
| maxStdoutBytes | サイズ上限 |
| maxStderrBytes | サイズ上限 |
| humanSignoffConfirmed | literal `true` |
| enableRealProcessExecution | literal `true` |
| signoffSource | 例: SIGNOFF §12 参照テキスト |
| signoffAtUnixMs | 承認時刻 |
| operatorLabel | 例: `user` |

---

## 4. Composer2 / 自動化側が確認する値

テンプレ `HERMES_ALLOWED_EXECUTABLE_TEMPLATE.md` と **同一項目**であること。  
コードは **allowlist ・ argv 完全一致・ cwd 許可・gate フラグ・timeout/size** で拒否しうる。

---

## 5. 実行してよい条件

- セクション 2・3 がすべて満たされる。
- 実装は **`child_process.execFile` のみ**（`spawn`/`exec`/shell は禁止）。
- **1 回**で終わる設計であり、実行後プロセスが **残らない**こと。

---

## 6. 実行してはいけない条件

- argv に任意ユーザー入力／任意ファイルパス。
- stderr/stdout を **全文恒久保存**する計画がある。
- Control Center に **executable 絶対パス**や **payload 全文**を渡す計画がある。
- **npm install・外部通信・.env/secrets を子プロセスに渡す**。

---

## 7. 実行手順（論理）

1. 設定をテンプレに転記する。  
2. `validateHermesControlledPilotConfig` → OK。  
3. `evaluateHermesControlledPilotPreflight` → GO_READY。  
4. `createHermesControlledPilotPreparedRun` で **`internalAdapterOptions` を確認**（**このリポでは自動実行禁止**）。  
5. **別 Goal / ユーザー明示のときのみ**、`runHermesRealProcessAdapterWithPolicy` または相当の単発実行をユーザーの監督下で行う。

---

## 8. 成功時の確認項目

`HERMES_CONTROLLED_PILOT_RESULT_REPORT_TEMPLATE.md` の **短文メタ**のみを確認（stdout/stderr 全文・payload 全文は保存しない）。

---

## 9. 失敗時

- Fail-closed。allowlist／argv／timeout／サイズ／JSON／schema で拒否または失敗扱い。  
- ログに **stderr/stdout 全文を載せない**。  
- 「preflight が自動 Go」を誤認しない。

---

## 10. ロールバック

- アプリ恒久配線はしていないので、コード・マーカーだけ差し戻し。Sandbox 産物がある場合のみ人手で削除計画へ。

---

## 11. 証跡

- `signoffEvidence` メタのみ。本文ログは増幅しない。  
- テンプレに **allowedExecutableId / argv のラベル**を残す。

---

## 12. 残すもの / 消していいもの

- **残す**: テンプレ・Runbook での許可記録、短文結果レポートテンプレ。  
- **消してよい（保存しない）**: stdout/stderr 全文、raw payload、`internalAdapterOptions` の外部公開。

---

## 13. 本番 READY ではない

Controlled Pilot が成功しても **Hermes 本番運用 READY とは宣言しない**。次ステップは **別 Goal** とする。
## 2026-05-06 Pre-Execution Pack Status

- Controlled Pilot remains HOLD.
- Real Hermes was not started.
- Real `execFile` was not executed.
- Dummy placement / dummy execution / dummy payload validation were not completed in this pack.
- Next movement toward Controlled Pilot requires local-only values to reach GO, redacted Signoff review, and a separate real-process preflight Goal.
