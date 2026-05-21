# Hermes Allowed Executable — Controlled Pilot 登録テンプレート（**実設定ファイルではない**）

**これはチェックリスト用の Markdown だけである。**自動ロードしない。Secrets / API キー / `.env` **を書かない**。

**関連**: `HERMES_WSL2_WRAPPER_PARAMETER_REGISTRY_SPEC.md`（実行前パラメータ検証のみ・**起動しない**）、`HERMES_WSL2_WRAPPER_VALUE_CONFIRMATION.md`（人手記入・**実行なし**）、`HERMES_WSL2_WRAPPER_HUMAN_VALUE_PACKET.md`（**人手パケット**・Sysnative **V1 拒否**）。

```
adapterKind（省略可: native_executable | wsl_wrapper）:
allowedExecutableId: 
executablePath（絶対、手入力）:
expectedSha256（任意・未実装検証でも可）:
allowedArgv(JSON 固定配列 1 本):
allowedCwd:
timeoutMs:
maxStdoutBytes:
maxStderrBytes:
signoffSource:
signoffAtUnixMs:
operatorLabel:
notes（短文・秘密情報なし）:
---
approval checkbox（人手）:

[ ] HERMES_EXECUTION_SPEC_DISCOVERY に沿って argv と stdout が確認済み

[ ] HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md §12 に実機単発許可を記載した

[ ] `validateHermesControlledPilotConfig` OK（実装または手元検証）

[ ] `evaluateHermesControlledPilotPreflight` が GO_READY（実行はしない）

[ ] Executable が cmd/powershell/bash 経由ではない

[ ] 外部通信・.env・常駐が不要である
```

運用決定後、値は **ユーザーが Composer2 に転記**して次 Goal とする。このテンプレをリポ secrets にしない。
