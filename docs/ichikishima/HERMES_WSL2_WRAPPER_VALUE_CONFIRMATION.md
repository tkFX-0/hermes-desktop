# Hermes WSL2 Wrapper — 値確認（人手・**実行なし**）

**位置づけ**: `wsl.exe` / wrapper / `execFile` に入る **前**に、registry に載せるべき値を **ユーザーが文書に照らして記入・承認**するためのチェックリスト。**プロセス起動なし**。**WSL 内への配置・自動コピーなし**。

関連: `HERMES_WSL2_WRAPPER_CONTRACT.md`、`HERMES_WSL2_WRAPPER_PARAMETER_REGISTRY_SPEC.md`、`hermes-wsl2-wrapper-parameter-registry.ts`、dummy sample `sandbox/hermes-autonomy-zone/dummy-hermes/hermes-bridge-payload-once.sh.sample`（**実行しない**）。**Human value packet（人手パケット）**: `HERMES_WSL2_WRAPPER_HUMAN_VALUE_PACKET.md`。**記入〜検証〜redacted Signoff（人手 Runbook・実行なし）**: `HERMES_WSL2_WRAPPER_LOCAL_VALUE_FILL_IN_RUNBOOK.md`、`HERMES_WSL2_WRAPPER_LOCAL_VALUE_VALIDATOR_RUNBOOK.md`、`HERMES_WSL2_WRAPPER_VALUE_SIGNOFF.md`。**local-only 保管**: `HERMES_WSL2_WRAPPER_LOCAL_VALUE_STORAGE_POLICY.md`。

追記（2026-05-05）: local-only values are validated through the redacted-only validator pipeline. `GO` means redacted Signoff review may proceed; it does not allow `wsl.exe`, real Hermes, or real `execFile`. Placeholder or unconfirmed values remain `HOLD`.

追記（2026-05-06）: current validator decision is `HOLD`. WSL dummy wrapper manual placement design is prepared, but no WSL placement, wrapper execution, `wsl.exe`, real Hermes, or real `execFile` has been performed.

---

## 1. 目的

- Distro / unix user / wrapper 論理パス / `wsl.exe` 許可パス等の **未確定を pending として可視化**する。
- 「1 本の固定 argv」の前提が満たされているか **Go / Hold / Reject** で分類する。

---

## 2. ユーザーが確認する値（概要）

| 区分 | 内容 |
|------|------|
| 必須 | `distroName`, `unixUser`, `wrapperScriptPathInsideWsl`, `allowedExecutableId`, `payloadSchemaVersion`, `signoffSource`, `operatorLabel`, `timeoutMs`, `maxStdoutBytes`, `maxStderrBytes` |
| 任意 | `windowsWslExecutableCandidate`（省略可・既定は System32 hint）, `registryVersion`, `expectedPayloadSchemaVersion`, `logLevel` |
| 禁止 | PATH 解決 wsl、WindowsApps エイリアス、`.cmd` / `.bat` 経由、`/mnt/c` 系 wrapper、raw payload 永続化など（契約書参照） |

---

## 3. distroName

- WSL ディストリビューション識別子（`wsl.exe -d` に渡す名前）。
- **英数字・`.` `_` `-` のみ**（registry 検証に整合）。未記入 → **pending**。

---

## 4. unixUser

- WSL 内 POSIX ユーザー（ホームは `/home/<unixUser>` とみなす）。
- **小文字始まり、`[a-z0-9_-]`** に整合。未記入 → **pending**。

---

## 5. wrapperPath（`wrapperScriptPathInsideWsl`）

- **v1 固定**: `/home/<UnixUser>/.hermes-bridge/hermes-bridge-payload-once.sh` と **厳密一致**のみ（registry が受理）。
- **`~` / `$HOME` / 相対 / `..` / `/mnt/` / `/tmp` / `/var/tmp` / Downloads 配下 / メタ文字**は **Reject**。

---

## 6. Windows `wsl.exe` path

- **V1 許可**: `C:\Windows\System32\wsl.exe` の **正規化後 exact match のみ**。
- **V1.1 候補（コード未許可）**: `C:\Windows\Sysnative\wsl.exe`（32bit 宿主回避が必要な場合のみ検討）。
- **Reject**: `%LOCALAPPDATA%\…\WindowsApps\wsl.exe`, PATH 検索結果, `wsl.cmd`, `wsl.bat`, PowerShell / `cmd /c` 経由, 相対パス, UNC, ユーザー任意 exe。

---

## 7. allowedExecutableId

- v1: **`wsl-hermes-bridge-wrapper-v1`** のみ。

---

## 8. fixed argv

```text
["-d", "<DistroName>", "--", "/home/<UnixUser>/.hermes-bridge/hermes-bridge-payload-once.sh"]
```

- 追加引数なし。シェル経由文字列なし。環境変数の受け渡しなし（別契約・別 Goal）。

---

## 9. timeout / byte limits

- registry 必須数値。上限は registry 実装の design cap に従う。

---

## 10. signoffSource / signoffAtUnixMs / operatorLabel

- **signoffSource**: 人手テンプレ・会議 ID 等の **短文ラベル**（secret 不可）。
- **signoffAtUnixMs**: 運用で記録する場合は **別紙 Signoff** またはテンプレの時刻欄（registry 必須フィールドではない）。
- **operatorLabel**: 作業者ロールの **識別子**（PII・token 不可）。

---

## 11. Go / Hold / Reject

| 判定 | 条件 |
|------|------|
| **Go（文書上）** | 上記すべて **契約と registry 検証に整合**し、Runbook / Final Gate の該当 STOP を満たす（**まだ wsl 起動しない**）。 |
| **Hold** | 一部 **pending** — 値未記入または dummy sample のみで WSL 配置前。 |
| **Reject** | PATH wsl、wrapper 禁止パターン、メタ文字、schema 不一致、`logLevel` が `silent`|`minimal` 以外 等。 |

---

## 12. 実行前 STOP GATE

次は **明示承認された別 Goal** のみ。

- `wsl.exe` 実行、wrapper 実実行、`execFile` 実機、child_process、外部通信、`npm install`、**自動 WSL 配置**。
