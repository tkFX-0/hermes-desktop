# Hermes WSL2 Wrapper — Contract（文書のみ・**実行しない**）

**位置づけ**: Windows 上 `wsl.exe` + **固定 argv** で呼び出す **WSL 内の単一シェルスクリプト**が、stdout に **`hermes-bridge-payload/v1`** 準拠の **JSON オブジェクト 1 本だけ**を書き、exit するまでの契約。**wrapper の作成・実行は別 Goal**。

関連: `HERMES_WSL2_WRAPPER_PARAMETER_REGISTRY_SPEC.md`、`HERMES_WSL2_WRAPPER_VALUE_CONFIRMATION.md`、`HERMES_WSL2_WRAPPER_VALUE_SIGNOFF.md`（redacted Signoff）、`HERMES_WSL2_WRAPPER_LOCAL_VALUE_FILL_IN_RUNBOOK.md`（人手記入手順）、`HERMES_WSL2_WRAPPER_LOCAL_VALUE_VALIDATOR_RUNBOOK.md`、`HERMES_WSL2_WRAPPER_LOCAL_VALUE_STORAGE_POLICY.md`。**実値コミット禁止**・human value packet: `HERMES_WSL2_WRAPPER_HUMAN_VALUE_PACKET.md`、`hermes-wsl2-wrapper-parameter-registry.ts`（**検証のみ・起動なし**）。

追記（2026-05-05）: local-only value validation is prepared as a redacted-only pre-execution gate. Control Center may show decision, counts, and policy booleans only. It must not show raw distro, unix user, wrapper path, Windows executable path, argv, JSON, env, or secrets.

追記（2026-05-06）: `HERMES_WSL2_DUMMY_WRAPPER_MANUAL_PLACEMENT_PLAN.md` defines the future manual placement design. It does not authorize placement or execution.

---

## 1. 目的

- 公式 `hermes` CLI は **対話／サブコマンド中心**であり、`bridge-payload-once` 相当の stdout 契約は **hermes-desktop 側の想定**と乖離し得る。
- **WSL 内 wrapper** が、その乖離を**境界で吸収**し、Process Adapter が期待する **単一 JSON stdout** に收斂させる。

---

## 2. 置き場所候補（WSL 内・POSIX パス）

- 例: `/home/<unix_user>/.hermes-bridge/hermes-bridge-payload-once.sh`
- **リポジトリ外・ホーム配下**を推奨（権限・秘密・パス漏えいは別途管理）。パスは **Controlled Pilot テンプレで人手記入**。

---

## 3. 固定 argv（Windows 側 `execFile` に渡す形の例・候補）

**実行しない**。記入用のみ。

```text
executablePath: C:\Windows\System32\wsl.exe
argv:
  ["-d", "<DistroName>", "--", "/home/<unix_user>/.hermes-bridge/hermes-bridge-payload-once.sh"]
```

- `<DistroName>` / `<unix_user>` / スクリプトパスは **未確定のままテンプレに placeholders**。
- **`adapterKind: "wsl_wrapper"`**（config 拡張）と **argv 4 要素厳格**は `hermes-controlled-pilot-config.ts` で検証される。

---

## 3a. Windows `wsl.exe` — allowlist（V1）

- **許可（exact match のみ・registry コード整合）**: `C:\Windows\System32\wsl.exe`（`\` と大文字は正規化で吸収）。
- **V1.1 検討用（コードでは未許可）**: `C:\Windows\Sysnative\wsl.exe` — **packaged 32bit / ia32 と System32 リダイレクトの実測がある場合のみ** 別 Goal で **2 本 exact allowlist** を検討（`HERMES_WSL2_WRAPPER_HUMAN_VALUE_PACKET.md` §11）。
- **拒否**: `%LOCALAPPDATA%\Microsoft\WindowsApps\wsl.exe`、PATH 解決、`wsl.cmd` / `wsl.bat`、`powershell` / `cmd /c wsl`、相対パス、UNC、ユーザー任意 exe。

---

## 3b. Wrapper POSIX パス — 厳密一致と禁止

- **推奨・v1 受理**: `/home/<unix_user>/.hermes-bridge/hermes-bridge-payload-once.sh` のみ（`registry` の `expectedWrapperPathForUnixUser` と一致）。
- **拒否**: `~` / `$HOME`、相対、`..`、shell メタ文字、`/mnt/`（特に `/mnt/c/...`）、`/tmp`、`/var/tmp`、`Downloads` 配下、任意の別パス。

---

## 4. stdout 契約

- **1 行・単一オブジェクト JSON のみ**（前後にログ・バナー・TUI 出力なし）。
- **`payloadSchemaVersion`**: **`hermes-bridge-payload/v1`**（フラット `"v1"` 不可）。
- **`validateHermesBridgePayload` 成功**を実機成功の必要条件とする（hermes-desktop 側）。
- **参考（WSL ではない）**: Windows 上 **`node sandbox/hermes-autonomy-zone/dummy-hermes/dummy-hermes-bridge-payload-once.cjs`** は **stdout に 1 行**出すスタブ。**シェル sample（実行・配置禁止）**: `sandbox/hermes-autonomy-zone/dummy-hermes/hermes-bridge-payload-once.sh.sample`。**CI 既定**: **`dummy-hermes-stub-design-static.test.ts`**（子プロセスなし）。**ローカル明示**: **`dummy-hermes-stub-design.process-local.test.ts`**（`RUN_DUMMY_HERMES_LOCAL_PROCESS` 設定時のみ `spawnSync`）。

---

## 5. stderr 契約

- **短文・上限付き**。stderr 全文を Audit / Approval / Control Center / ファイル恒久に載せない。
- 人が読むのは **短文コード＋行数上限**まで（Result テンプレ準拠）。

---

## 6. exitCode / signal 契約

- **非ゼロ exit** → 失敗扱い・fail-closed。
- **timeout / kill** で **常駐しない**（単発）。

---

## 7. secrets 禁止

- wrapper 内で `.env` を読み、`API_KEY` 等を stdout／子プロセス環境に載せない。
- **親から `process.env` 丸ごと渡し禁止**（Final Gate 共通）。

---

## 8. 外部通信禁止

- wrapper 内からの **curl / fetch / install** 等は Controlled Pilot の初回では**禁止**（別 Goal で明示されない限り）。

---

## 9. payloadSchemaVersion

- **`hermes-bridge-payload/v1`** のみ（`HERMES_BRIDGE_PAYLOAD_CONTRACT.md` と同一名前空間）。

---

## 10. bridge payload の生成方法（方針のみ）

- **将来**: 公式 CLI が取れる情報だけを使う／または **最小 JSON を構築するコード**を wrapper 内に限定する。
- **今**: 実装しない。本契約は **「出すべき形」**の固定のみ。

---

## 11. wrapper を実行する前の確認（人手）

- SIGNOFF・Runbook・`validateHermesControlledPilotConfig`・preflight **GO_READY**。
- **argv がテンプレと完全一致**。
- **`wsl.exe` 専用ゲート**（広い実行口であること）をレビュアが理解していること。

---

## 12. Windows 側からの呼び出し方候補（論理）

- **`execFile` のみ** — `spawn` / `exec` / `shell:true` 禁止。
- **cwd** は Zone 規則内（`hermes-real-process-adapter` と同様に検証）。

---

## 13. まだ実行しないこと

- **wrapper ファイルの作成・保存の自動化**。
- **`wsl.exe` / wrapper の実起動**。
- **`hermes` 単体の `bridge-payload-once` 直叩き**（公式未確認のまま）。

---

## 14. pending 値一覧（未確定でも STOP しない論理項目）

| key | status | reason |
|-----|--------|--------|
| `DistroName` | pending | requires user value |
| `unix_user` / home 構造 | pending | requires user value |
| wrapper 実ファイル | pending | deferred / separate goal |
| `stdout` 実機単一行 JSON 検証 | pending | requires separate goal |
| `execFile` argv 実測 | blocked | STOP GATE（別承認） |

---

## 15. 関連

- `ADR_REAL_HERMES_WSL2_CONNECTION.md`
- `HERMES_EXECUTION_SPEC_DISCOVERY.md`
- `HERMES_CONTROLLED_PILOT_RUNBOOK.md`
## 2026-05-06 Discovery-Only Fill-In Note

- Bounded discovery-only use of the allowed System32 WSL executable was performed.
- Multiple distros made automatic selection unsafe, so wrapper identity remains HOLD.
- No wrapper execution, no WSL placement, no real Hermes, and no real `execFile` occurred.
- GO still means redacted Signoff review only, not execution permission.
