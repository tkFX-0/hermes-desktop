# Hermes WSL2 Wrapper — Parameter Registry（SPEC）

**位置づけ**: **`wsl.exe` / wrapper / `execFile` 実行に入る前**に、Distro / unix user / wrapper 論理パス / 出力上限 / signoff メタ等を **検証・要約のみ**で保持する **registry**。**プロセス起動なし**。  
実装: `hermes-wsl2-wrapper-parameter-registry.ts`。関連: `HERMES_WSL2_WRAPPER_CONTRACT.md`、`HERMES_WSL2_WRAPPER_VALUE_CONFIRMATION.md`、`hermes-wsl2-wrapper-config.ts`、`HERMES_CONTROLLED_PILOT_RUNBOOK.md`。

## 1. 目的

- 未確定パラメータを **pending** として可視化し、**unsafe 入力を拒否**する。
- Control Center には **カウント・ステータス・次アクション短文**のみ渡し、**raw 絶対パス・argv 全文・stdout/payload 全文**を載せない。
- 将来の Controlled Pilot / WSL invoke Goal への **型安全な受け皿**とする。

---

## 2. なぜ registry が必要か

- `.env`・手書き Runbook・チャットに値を散らすと **混入・誤実行**のリスクが上がる。
- **固定 argv 政策**（4 トークン厳格）と **executableId** をコードで一箇所に束ねる。
- `pendingPackagingResolution` や **packaged smoke** と独立した **WSL 接続パラメータ**レイヤを分離する。

---

## 3. pending value の扱い

- **必須キー**（`HERMES_WSL2_REGISTRY_FIELD_KEYS` に準拠）が **空または欠落** → `status: "pending"`、`pendingFields` に列挙。
- **任意**: `windowsWslExecutableCandidate` — 無しでも registry は `registry_ready_execution_forbidden` に到達し得る（**既定 System32 hint**のみ）。

---

## 4. confirmed value の扱い

- **妥当と判定された**フィールド名を **`confirmedFields`** に入れるのみ（値そのものは Renderer へ返さない）。
- **ユーザーが「確定」と思っても** `summarize*` は **自動実行フラグを true にしない**。

---

## 5. forbidden value の扱い

- **shell メタ文字**、`..`、**secret/token/API_KEY 様**、`curl`/`npm`/`rm`/`git push` 等の **ポリシー外断片** → `rejected`、`status: "rejected"`。
- **Windows の `wsl.exe` 候補**は **`\` を含む**ため、汎用 `unsafeText` ではなく **形専用**。**V1: 正規化後が `c:\windows\system32\wsl.exe` と完全一致のみ**（類似パスの部分一致は **拒否**）。**Sysnative** は **Human value packet / 本 registry で V1 拒否**。定数 `CANONICAL_WSL_EXE_SYSNATIVE_LOWER` は **V1.1 文書ゲート**（`HERMES_WSL2_WRAPPER_HUMAN_VALUE_PACKET.md` §11）。
- **拒否方針**: PATH lookup、WindowsApps エイリアス、`.cmd` / `.bat`、`powershell` / `cmd /c`、相対パス、UNC、ユーザー任意 exe。

### 5b. wrapper 論理パス（追加禁止）

- **`/home/<unixUser>/.hermes-bridge/hermes-bridge-payload-once.sh` 厳密一致**のみ。`~`/`$HOME`、相対、`/mnt/`、`/tmp`、`/var/tmp`、`Downloads` 配下、空白、glob 的文字は **`isForbiddenWrapperPathPolicy`** で拒否。

---

## 6. fixed argv pattern

- 厳格形: `["-d", "<DistroName>", "--", "/home/<unixUser>/.hermes-bridge/hermes-bridge-payload-once.sh"]`
- `wrapperScriptPathInsideWsl` は **`expectedWrapperPathForUnixUser(unixUser)` と一致**必須（改変禁止・追加引数禁止）。
- **`allowedExecutableId`** は **`wsl-hermes-bridge-wrapper-v1`** のみが v1 registry として受理。

---

## 6b. 任意メタ（argv に含めない）

- **`registryVersion`**: 短文（実装の安全 RE）。推奨: `RECOMMENDED_REGISTRY_DOCUMENT_VERSION`。
- **`expectedPayloadSchemaVersion`**: 任意。設定時は **`hermes-bridge-payload/v1` のみ**（`payloadSchemaVersion` と二重申告のときも **同一名前空間**に限る）。
- **`logLevel`**: `"silent"` \| `"minimal"` のみ。**wrapper 引数・環境変数に渡さない**。

---

## 7. secrets 禁止

- 全文字列フィールド（`windowsWslExecutableCandidate` は token 検査のみ）で **SECRET/TOKEN/.env** 等を拒否。
- **環境変数の受け渡し・丸ごと passthrough**は registry の外（**別契約・別 Goal**）。

---

## 8. path 露出制限

- **Renderer / Safe summary**に **Windows 生パス・WSL 生絶対パス全文**を載せない。
- `createHermesWsl2WrapperPreparedInvocationPreview` は **REDACTED ラベル**のみ。

---

## 9. Control Center 表示方針

- `ControlCenterAppSnapshot.wsl2WrapperParameterSummary`（`HermesWsl2WrapperSafeSummary`）を表示。
- **`canRunWsl: false` / `canRunBridgeOnceViaWsl: false` / `productionReady: false`** を不変条件とする。
- `wsl2WrapperStatusLine` は **短文 1 行**（status・件数のみ）。

---

## 10. Signoff との関係

- **人手 Signoff**で値が揃った後も、**このモジュール単体では exec しない**。
- `signoffSource` / `operatorLabel` / `payloadSchemaVersion` は **registry 必須フィールド**として **欠落時 pending**。

---

## 11. STOP GATE

次は **別 Goal**（本 SPEC の閲覧のみでは実行しない）。

- **`wsl.exe` 実起動**、**wrapper 実実行**、**execFile 実機**、**child_process**。
- **`pendingPackagingResolution:false` / `productionReady:true` の自動遷移**。
- **raw stdout / stderr / payload の Repository 永続化**。

---

## 12. 次の実行 Goal との境界

- **Parameter values confirmation（人手）**: `HERMES_WSL2_WRAPPER_VALUE_CONFIRMATION.md`。
- **WSL dummy wrapper sample（`.sh.sample`）**: `sandbox/hermes-autonomy-zone/dummy-hermes/hermes-bridge-payload-once.sh.sample` — **実行・配置・wsl 呼び出し禁止**。
- **Controlled Pilot 実機前 Signoff**（`HERMES_CONTROLLED_PILOT_RUNBOOK.md`）— **registry が `registry_ready_execution_forbidden` でも Pilot Go は別ゲート**。
