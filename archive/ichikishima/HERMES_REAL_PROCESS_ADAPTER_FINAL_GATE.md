# Real Hermes Process Adapter — Final Gate（`execFile` 安全枠チェックリスト）

**位置づけ**: Node `child_process.execFile` の **最小実装**に際して固定する境界。**本番 Hermes 常駐／自動 Go ではない**。  
**正コード（Controlled Pilot コードパス実装済み・本番 READY ではない）**: `src/main/ichikishima/hermes/hermes-real-process-adapter.ts` — **`runRealHermesProcessAdapter` は既定 `disabled`**。`enableRealProcessExecution` と `humanSignoffConfirmed` の **両方が明示 true**、`controlledPilot`（**`HermesRealProcessControlledPilotPolicy`**: 許可 **`allowedExecutableId`**・allowlist パス・**固定 argv のみ**・短文 signoff メタ）が揃うときのみ **`execFile`のみ**（`spawn`/`exec`/shell:true 禁止）。**stdout は Bridge JSON → `validateHermesBridgePayload` 必須**。結果に **短文 `signoffEvidence` のみ**（stdio 全文・payload 全文・handle なし）。  
**単体試験**は **`__testOnlySimulateExec`** で subprocess を起動しない。**実 Hermes 本体の利用はユーザー環境の明示パスと明示承認時のみ**。  
**親関係**: `HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`、`HERMES_REAL_CONNECTION_PILOT_SCOPE.md`、`HERMES_REAL_PILOT_MINIMAL_PIPELINE_CONTRACT.md`、`HERMES_BRIDGE_PAYLOAD_CONTRACT.md`、`HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`、`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md`（**§12**）、`HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md`（**E-25**）。

**追記（2026-05-05）**: WSL2 wrapper route must pass the local-only value validator before any later execution Goal. `HOLD` means local values are still placeholder / unconfirmed. `REJECT` means invalid local values. `GO` only permits redacted Signoff review; it does not permit `wsl.exe`, real Hermes, or real `execFile`.

**追記（2026-05-06）**: Current local-only validator decision is `HOLD`. Dummy wrapper manual placement design is prepared, but WSL placement and execution remain blocked.

---

## 1. 目的

- **任意シェル・任意コマンド・全文ログ保存**を防ぎ、`execFile` 最小境界を固定する。
- **実 Hermes 接続を自動 Go にしない**。本ゲートの確認は **人手**。
- **Controlled Pilot Run** のうち **コード側の政策・証跡メタ** は **実装済み**。**実バイナリ 1 発の実機検証** は **別ユーザー承認・短命のみ**。

---

## 2. 現在の到達状態（リポジトリ前提）

- **NousResearch/hermes-agent（実 Hermes 本流）**は README 上 **ネイティブ Windows を Quick Install 対象としていない**。**Windows では WSL2 経路が本命**（`ADR_REAL_HERMES_WSL2_CONNECTION.md`）。**`wsl.exe` allowlist**は **実行口が広い**ため **argv 厳格固定 + wrapper 契約**（`HERMES_WSL2_WRAPPER_CONTRACT.md`）が先。
- Stage 0 / 1 接続適配、Receiver Queue、Payload `hermes-bridge-payload/v1`、**Real Pilot Minimal Pipeline** がコード化済み。
- **`HERMES_WSL2_WRAPPER_LOCAL_VALUE_FILL_IN_RUNBOOK.md`** / **`HERMES_WSL2_WRAPPER_VALUE_SIGNOFF.md`**: **人手で local JSON を埋めた後**の検証・**redacted Signoff** の手順（**`wsl.exe` / execFile 未実行**。validator の **実ファイル読込・コマンド実行は次 Goal**）。

---

## 3. 次 Goal（設計上）

- **Controlled Pilot 実機 1 回** — ユーザー指定の **許可バイナリ 1 系統**・固定 argv・監督下・**短命**。**Vitest で実起動しない前提を崩さない**（手動または別承認のスモークのみ）。
- **Control Center read-only IPC 準備**（別 Goal）。

※ **実施＝自動 Go ではない**。**人手承認の別 Goal**。

### Controlled Pilot — 実機前準備のみ（2026-05-03 追記）

**実Hermes本体起動・実 `execFile` はまだしない**。次をリポジトリに用意済み（オブジェクトのみ）：

- **`HERMES_EXECUTION_SPEC_DISCOVERY.md`**、`HERMES_CONTROLLED_PILOT_RUNBOOK.md`、`HERMES_ALLOWED_EXECUTABLE_TEMPLATE.md`、`HERMES_CONTROLLED_PILOT_RESULT_REPORT_TEMPLATE.md`
- **`hermes-controlled-pilot-config.ts`**（必須フィールド検証）、**`hermes-controlled-pilot-preflight.ts`**（`GO_READY` / `NO_GO`・実行なし）、**`hermes-controlled-pilot-summary.ts`**（将来 CC へ渡す短文要約・実行ファイル絶対パス非露出）

**実機 1 回**は、`executablePath`・`allowedExecutableId`・固定 `argv`・`cwd`・timeout／出力上限・`signoff*`・`operatorLabel` をユーザーが **すべて提示し承認された別 Goal** のみ。**それまでは自動実行しない**。

---

## 4. 継続禁止（実装後も変えない上位境界）

- **実 Hermes 本番／常駐プロセス Go 扱い**。
- **`spawn` / `exec()` / `shell:true` / 任意シェル**。
- stdin/stdout を介した **一般 Bridge adapter** の恒久配線（Stage 2）。
- **socket / HTTP listen / `ipcMain.handle` / preload・renderer**。
- **`src/main/index.ts` 恒久配線**、**`npm install`**、**外部送信**。
- **`.env` / secrets の `process.env` 丸ごと渡し**。
- **Audit/Approval/Control Center** への **stdout/stderr 全文・raw payload・process handle**。

---

## 5. `child_process` を使う場合の条件（次実装 Goal の拘束）

以下を **すべて**満たすリビジョンでのみコード化を許容する設計とする。

1. **ユーザーが別メッセージ／チケットで「Process Adapter Minimal Implementation Goal」を明示承認**している。
2. **`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md` §12** と **`HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md` E-25** が **レビュアにより確認済み**（未チェックなら **実装に着手しない**）。
3. **Preflight**（`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`）の **Stop 条件**に反しない。

---

## 6. 許可コマンドの固定方針

- **実行バイナリはホワイトリスト**（例：リポまたは Zone 配下の **明示パス一覧に限定**。将来は **単一構成キー→解決済みパス** の対応表のみ）。
- **引数は列挙型または Allowlist のみ**。**ユーザー入力文字列から argv を組み立てない**（テンプレ＋検証のみ）。

---

## 7. 任意コマンド禁止

- **シェルに渡す自由形式のコマンド文字列は禁止**（`/bin/sh -c` 型、`cmd /c` 型、`powershell -Command` 型を含む）。
- **`Hermes が送った任意文字列を shell に渡す`パターンは禁止**。

---

## 8. `shell: true` 禁止

- Node の `spawn` 等で **`shell: true`（および同等のシェル介在オプション）を使わない**。
- Windows でも **shell 迂回でコマンド文字列実行を増幅しない**（必要な実装詳細は次 Goal のコードレビューで固定）。

---

## 9. 作業ディレクトリ（`cwd`）制限

- **`cwd` は `sandbox/hermes-autonomy-zone` に相当する Zone root**、または **文書で列挙した「明示安全ディレクトリ」に限定**。`projectRoot` 直下の恣意パス、`userData`、`OS temp` を **ユーザー入力だけで選択不可**。
- **`..` を含む相対、`symlink/junction` で Zone 外に出る経路は path-guard 方針に従い **fail-closed**。

---

## 10. 環境変数の扱い

- **継承 env は最小**。**親プロセスの環境丸ごと透過しない**ことを既定とする。
- **`PATH` は必要最小の固定**（許可された解決済み実行ファイルのみ使う構成を推奨）。
- **`.env` を読み込んで子プロセスに渡さない**。**API キーや secrets をプロセス環境へ載せない**。

---

## 11. stdin 制限

- **stdin は既定で閉じるまたは空**。**Hermes が送った任意データを標準入力にそのまま流し込む**経路は **禁止**。
- Bridge **payload の本文**を subprocess stdin に載せない（Ingress は **JSON 検証 → Receiver の既存規律**に残す）。

---

## 12. stdout / stderr 上限

- メモリ上で **増分読み込み**。合計サイズまたは行数が **コード定数上限**を超えたら **読み取り打ち切り**し、**短文の reasonCode のみ**を上位層へ返す設計。
- **全文を Approval Queue／Audit／Control Center に保存しない**。既存 **`maskAuditSensitiveText`** と **Payload §15 / Receiver Queue 契約**に整合。

---

## 13. timeout

- **`timeoutMs` は必須**。未指定での **無期限待ち禁止**。
- 上限はコード定数＋運用レビュー（次 Goal で具体値をロック）。

---

## 14. kill 方針

- timeout または **親プロセス側の明示キャンセル**発生時、**子ツリーに対して best-effort kill**（OS によって `kill`/`taskkill`/tree kill の扱いは次 Goal で **レビュア承認済みコード** に限定）。
- **ゾンビ恒久放置防止**は **親側の監視責務**（実装詳細は次 Goal）。

---

## 15. retry 方針

- **既定はリトライなし**または **単回・指数ではない短命リトライのみ**。**無限ループ禁止**。
- リトライのたびに **短文 diagnostic のみ**。stdout/stderr バッファ複製禁止。

---

## 16. process handle を返さない

- 公開 API が **`ChildProcess`** または **PID を外部公開**しない。**ログ・Audit・Snapshot に生 PID を載せない**（要約のみ可）。

---

## 17. stdout / stderr 全文を保持しない

- 長寿命バッファ、ダンプファイルへの **自動追記無制限**禁止。
- 「デバッグのため」の **恒久 raw ログ** は **別承認・別経路**（本パイプラインとは分離）。

---

## 18. payload validation との関係

- **実プロセス出力に Hermes と称するデータが現れても**、Ingress として組み込むなら **`validateHermesBridgePayload` を必ず通過**させる。**生テキストをそのまま `enqueuePayload` にしない**。

---

## 19. Receiver Queue との関係

- 受理済み **`HermesBridgePayload` は既存キュー規律**：**`validated` 全文をログ・Snapshot に複製しない**（`HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`）。

---

## 20. fail-closed 方針

- forbidden / validation 失敗 / path 異常 / env 異常は **すべて拒否**。**「繋ぐことが最優先」構文は禁止**。

---

## 21. Audit / Approval / Review との関係

- プロセス起動イベントは **`contentIncluded:false`** と **短文 reasonCode**。**標準出力のコピーを Audit に載せない**。
- Approval Report／Review Mode は **断片説明のみ**。**全文の貼り付け禁止**。

---

## 22. rollback

- コード導入前：本チェックリストを **`[ ]`** に戻すか、Revert。
- コード導入後：**プロセス機能をフラグまたは stub に戻す**、Hermes を **明示に落とさない**。データ面は Sandbox 成果物のみ影響を受ける設計とする。

---

## 23. Go / No-Go 条件

**Go（次 Goal「Process Adapter Minimal Implementation」にコード着手してよい文書状態）**:

- 本ファイルが **`docs/ichikishima/` にあり**、§5–§14 の禁止・必須が **レビュア合意済み**。
- **Signoff §12** と **E-25** が **チェック済み**。
- **ユーザー明示承認**済みチケット／メモが残っている。

**No-Go**:

- §4 の禁止に触れるような **試験コードが先行**している。
- **任意コマンド**や **`shell:true`** が設計書に現れている（却下）。
- **stdout/stderr 全文保管**や **環境への secrets 注入**が許可されている読みになる。

---

## 関連一覧

`HERMES_REAL_PILOT_MINIMAL_PIPELINE_CONTRACT.md`、`HERMES_REAL_CONNECTION_PRE_FLIGHT_REVIEW.md`、`HERMES_REAL_CONNECTION_PILOT_SCOPE.md`、`HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md`、`HERMES_BRIDGE_PILOT_ENTRY_CRITERIA.md`、`HERMES_BRIDGE_PAYLOAD_CONTRACT.md`、`HERMES_BRIDGE_RECEIVER_QUEUE_CONTRACT.md`、`HERMES_CONNECTION_ADAPTER_CONTRACT.md`
## 2026-05-06 Pre-Execution Pack Status

- Real Hermes and real `execFile` remain blocked.
- Dummy phases do not grant permission to run the real process adapter.
- A future real-process Goal must separately confirm redacted Signoff, fixed argv, timeout, allowlist, no raw stdout/stderr storage, and human approval.
