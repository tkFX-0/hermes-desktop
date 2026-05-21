# Hermes WSL2 Wrapper — Human Value Confirmation **Packet**（人手・**実行なし**）

**位置づけ**: 実行 Goal に入る前に、WSL2 wrapper に必要な値を **人手で記入・照合・Signoff** するための **パケット**（文書＋コード検証の対象型）。**`wsl.exe` / `execFile` / child_process は呼ばない**。  
実装: `hermes-wsl2-wrapper-human-value-packet.ts`。registry 本体は `hermes-wsl2-wrapper-parameter-registry.ts` に委譲。

関連: `HERMES_WSL2_WRAPPER_CONTRACT.md`、`HERMES_WSL2_WRAPPER_PARAMETER_REGISTRY_SPEC.md`、`HERMES_WSL2_WRAPPER_VALUE_CONFIRMATION.md`、`HERMES_WSL2_WRAPPER_LOCAL_VALUE_STORAGE_POLICY.md`（**`sandbox/.../local-only/`** の example のみコミット可）。**人手記入〜redacted Signoff（実行なし）**: `HERMES_WSL2_WRAPPER_LOCAL_VALUE_FILL_IN_RUNBOOK.md`、`HERMES_WSL2_WRAPPER_LOCAL_VALUE_VALIDATOR_RUNBOOK.md`、`HERMES_WSL2_WRAPPER_VALUE_SIGNOFF.md`。実装: `hermes-wsl2-wrapper-human-value-packet.ts`（`validateLocalOnlyValuePacketShape`、`summarizeRedactedLocalValuePacket`、**`fs` 不使用**）。registry 本体は `hermes-wsl2-wrapper-parameter-registry.ts` に委譲。

追記（2026-05-05）: local-only validator pipeline は placeholder / 未確認値を `HOLD`、危険値を `REJECT`、完全検証済みを `GO` とする。`GO` でも WSL 実行は別 Goal。raw 値は validator report / Control Center / Signoff に出さない。

追記（2026-05-06）: current local-only check is `HOLD` because placeholders remain. Manual dummy wrapper placement is design-only in `HERMES_WSL2_DUMMY_WRAPPER_MANUAL_PLACEMENT_PLAN.md`.

---

## 1. 目的

- **未記入は pending**、**危険値は rejected**、揃っても **自動実行は禁止**（`packet_complete_execution_forbidden`）を一貫させる。
- Control Center には **要約・件数・次アクション・sysnative 方針ラベルのみ**渡し、**raw 絶対パス・argv 全文**を出さない。

---

## 2. 記入前の注意

- **値の実入力はリポジトリにコミットしない**運用を推奨（ローカルメモ・別保管）。この Goal は **型と検証とテンプレ**まで。
- **Secrets / `.env` / token** を禁止語として扱う（検証で reject）。

---

## 3. 記入してよい値

- **distroName** — WSL のディストリ名（registry の distro 規則と整合）。
- **unixUser** — `/home/<user>` 前提の POSIX ユーザー名。
- **wrapperPath** — **厳密一致** `/home/<unixUser>/.hermes-bridge/hermes-bridge-payload-once.sh` のみ。
- **windowsWslExePath** — **V1**: `C:\Windows\System32\wsl.exe` の **正規化後 exact match** のみ（省略可）。
- **allowedExecutableId** — `wsl-hermes-bridge-wrapper-v1` のみ。
- **timeoutMs / maxStdoutBytes / maxStderrBytes** — registry の design cap 内。
- **expectedPayloadSchemaVersion** — `hermes-bridge-payload/v1`。
- **logLevel** — `silent` | `minimal`（**registry メタ**・argv に含めない）。
- **signoffSource / operatorLabel** — 短文ラベル。
- **signoffAtUnixMs** — 任意。設定時は妥当な ms 範囲のみ。

---

## 4. 記入してはいけない値

- PATH 解決に依存した `wsl.exe` 表示結果、**WindowsApps** のエイリアス、`.cmd` / `.bat`、シェル経由コマンドライン文字列。
- **`C:\Windows\Sysnative\wsl.exe`**（**V1 コードでは拒否**。V1.1 は **別 Goal / 実測後**）。
- **任意の wrapper パス**、**`/mnt/c/...`**, **`/tmp`**, **tilde**, **`$HOME`**, メタ文字。
- API キー・パスワード・生 payload・stdout/stderr 全文。

---

## 5. 値ごとの許可条件（概要）

| 値 | 許可条件 |
|----|----------|
| windowsWslExePath | 未記入 **または** System32 canonical **exact** |
| wrapperPath | `expectedWrapperPathForUnixUser(unixUser)` と **完全一致** |
| allowedExecutableId | 固定 v1 キーのみ |
| expectedPayloadSchemaVersion | `hermes-bridge-payload/v1` |

---

## 6. 値ごとの拒否条件（概要）

| 値 | 拒否例 |
|----|--------|
| windowsWslExePath | Sysnative（V1）、部分一致のもっともらしいパス、ドライブ付き別物 |
| wrapperPath | 禁止セグメント（`/mnt/` 等）、スペース、不一致 |
| signoffAtUnixMs | 範囲外・非有限 |

---

## 7. redaction / 表示方針

- **Renderer / Shell**: `redactHermesWsl2WrapperHumanValuePacketForRenderer` — **真偽・整形ラベル・REDACATED argv ラベル**のみ。
- **禁止**: raw `C:\...`、生 POSIX 全文、環境変数、payload 本文。

---

## 8. Signoff 欄（運用）

- 人手テンプレ（許可 Executable / Pilot Result 系）に **同じ値の再宣言**を載せる場合は、**短文**に留める。
- **Sysnative を許可する判断**が必要な場合は **別紙** — `HERMES_REAL_PROCESS_ADAPTER_FINAL_GATE.md` および本書の V1.1 節を参照。**実測ログ**は `GOAL_COMPLETION_REPORT.md` に残す運用を推奨。

---

## 9. Hold / Reject 条件

- **Hold（pending）**: 必須キー欠落。
- **Reject**: 上記禁止値・registry reject・Sysnative（V1）。
- **Complete（文書上）**: `packet_complete_execution_forbidden` — **それでも exec はしない**。

---

## 10. 次 Goal への渡し方

- 記入済みパケットは **registry と同型にマッピング**可能（`humanValuePacketToRegistry`）。
- **実行**は `HERMES_CONTROLLED_PILOT_RUNBOOK.md`・Final Gate・**別承認 Goal** のみ。

---

## 11. Sysnative — V1.1（**未実装・コード未許可**）

**次の条件を満たす実測があった場合のみ**、別 Goal で **許可パスを 2 本に限定**して追加を検討する。

- packaged Electron が **32bit / ia32** で動き、**System32 リダイレクト**が問題になる。
- **System32 exact のみ**では smoke / Signoff が通らない **実測**がある。
- 追加しても **任意実行口が広がらない**（引き続き PATH / alias 禁止）。

**V1.1 で許可してよいのは次の 2 本のみ（exact）**

```text
C:\Windows\System32\wsl.exe
C:\Windows\Sysnative\wsl.exe
```

**禁止は V1 と同じ**（PATH lookup、WindowsApps、`.cmd`、PowerShell、`cmd /c`、相対、UNC、ユーザー任意 exe）。

---

## 関連 Signoff 文書

- `HERMES_WSL2_WRAPPER_VALUE_CONFIRMATION.md`
- `HERMES_REAL_PROCESS_ADAPTER_FINAL_GATE.md`
