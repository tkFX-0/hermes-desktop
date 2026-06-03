# Hermes WSL2 Wrapper — Local value fill-in Runbook（**人手・実行なし**）

**位置づけ**: ユーザーが **`wsl-wrapper-values.local.example.json`** を **gitignore されたローカル JSON** にコピーし、実値を記入したあと、**メモリ上で** `validateHermesWsl2WrapperHumanValuePacket` 等を通すまでの手順。**`wsl.exe`・wrapper 配置・`execFile`・実 Hermes は実行しない**。

関連: `HERMES_WSL2_WRAPPER_LOCAL_VALUE_STORAGE_POLICY.md`、`HERMES_WSL2_WRAPPER_HUMAN_VALUE_PACKET.md`、`HERMES_WSL2_WRAPPER_USER_NEXT_ACTION_CHECKLIST.md`、`HERMES_WSL2_WRAPPER_LOCAL_VALUE_VALIDATOR_RUNBOOK.md`、`HERMES_WSL2_WRAPPER_VALUE_SIGNOFF.md`（本 Runbook 完了後の redacted Signoff 用）、`sandbox/hermes-autonomy-zone/local-only/README.md`。

---

## 1. 目的

- 実値を **repo に残さず**、**同じ手順**で記入・検証できるようにする。
- **redacted summary のみ**を報告・Signoff 文書に転記し、**raw 値をチャットや PR に貼らない**。

---

## 2. 作業前提

- 作業マシンに **Node** と本リポジトリの clone がある（すでに開発環境がある想定）。
- **`wsl-wrapper-values.local.json` は `.gitignore` 済み** — 作成しても **git add しない**。
- **共有不要の段階ではチームに実値を送らない**（平文 Slack/メール/Git 禁止）。必要になったら暗号化または Secret Manager（別方針）。

---

## 3. example を local JSON にコピーする手順

1. リポジトリで `sandbox/hermes-autonomy-zone/local-only/wsl-wrapper-values.local.example.json` を開く。
2. 同ディレクトリに **`wsl-wrapper-values.local.json`** として **コピー**（内容はまだプレースホルダのままでよい）。
3. `git status` で **`wsl-wrapper-values.local.json` が untracked でも add しない**こと。誤って staged したら `git restore --staged` で外す。

---

## 4. 記入する値

`HERMES_WSL2_WRAPPER_HUMAN_VALUE_PACKET.md` §3 と整合。概要:

- **distroName** — WSL `-d` に渡す識別子（registry パターンに合致）。
- **unixUser** — `/home/<user>` 前提の POSIX ユーザー名。
- **wrapperPath** — **厳密一致** `/home/<unixUser>/.hermes-bridge/hermes-bridge-payload-once.sh` のみ。
- **windowsWslExePath** — **V1**: `C:\Windows\System32\wsl.exe` の正規化後 **exact match**（省略可の場合は契約に従う）。
- **allowedExecutableId** — `wsl-hermes-bridge-wrapper-v1` のみ。
- **timeoutMs / maxStdoutBytes / maxStderrBytes** — registry の design cap 内。
- **expectedPayloadSchemaVersion** — `hermes-bridge-payload/v1`。
- **logLevel** — `silent` | `minimal`（任意）。
- **signoffSource / operatorLabel** — **短文ラベル**（秘密・個人名の全面禁止ではないが、**過剰な実値の羅列は避ける**）。
- **signoffAtUnixMs** — 任意。記入する場合は妥当な ms 範囲。

---

## 5. 記入してはいけない値

`HERMES_WSL2_WRAPPER_HUMAN_VALUE_PACKET.md` §4 と整合。特に:

- **`C:\Windows\Sysnative\wsl.exe`**（V1 コード拒否）。
- PATH 依存の `wsl`、WindowsApps、`.cmd` / `.bat`、シェル経由のコマンド文字列。
- **`/mnt/c/...`**、tilde、`$HOME`、任意 wrapper パス。
- API キー・トークン・生 payload・stdout/stderr 全文・`.env` 内容。

---

## 6. 値の検証手順（**今回 Goal ではコマンド実行を必須にしない**）

コード上の正規経路:

1. `JSON.parse` で **オブジェクト**にする（**この Runbook の範囲では「ユーザーがローカルで実施する」説明のみ**。CI やエージェントが **ユーザー環境の実ファイルを読むことはしない**）。
2. （任意・推奨）`validateLocalOnlyValuePacketShape(parsed)` で **許可キーと粗い型**を確認（`fs` 不要・`hermes-wsl2-wrapper-human-value-packet.ts`）。
3. `coerceLocalOnlyJsonObjectToHumanValuePacket(parsed)` で packet に射影。
4. `validateHermesWsl2WrapperHumanValuePacket(packet)` で **本検証**。`packet_complete_execution_forbidden` になるまで項目を埋める。
5. `summarizeRedactedLocalValuePacket(parsed)` で **repo 貼り付け用の行**を得る（**raw path / distro 名 / unix ユーザー文字列は出さない**）。

**次 Goal（別承認）**: 上記を **単発スクリプトや REPL** で実行することを許可したうえでのみ、**ローカル JSON を読む**補助を追加してよい（本リポジトリに実値をコミットしないこと）。

**実装済みの prepared 経路（2026-05-05）**: local-only validator は `HERMES_WSL2_WRAPPER_LOCAL_VALUE_VALIDATOR_RUNBOOK.md` に従い、raw 値を返さず `GO` / `HOLD` / `REJECT` と count / policy boolean のみを返す。placeholder が残る場合は `HOLD`。

追記（2026-05-06）: 現在の redacted check は `HOLD`（placeholder 残り）。次はユーザーが local-only JSON を実値で埋め、validator を再実行する。`GO` 後も `wsl.exe` 実行ではなく redacted Signoff review と manual placement design review に進む。

---

## 7. redacted summary 作成方針

- **貼ってよいもの**: `summarizeRedactedLocalValuePacket` の **`lines`**、または `validateHermesWsl2WrapperHumanValuePacket` の **`safeSummaryLines`** 相当の **政策ラベル・件数・status**。
- **貼ってはいけないもの**: `wsl-wrapper-values.local.json` の **全文**、distro 名、unix ユーザー、**実 wrapper の絶対パス文字列**、argv の実引数、operator の実名（運用で必要なら **別・非 repo** で管理）。

---

## 8. Signoff への転記方針

1. `HERMES_WSL2_WRAPPER_VALUE_SIGNOFF.md` のテンプレを複製（または印刷体の外に保存）。
2. **redacted** 列には **「confirmed」＋伏せた説明**のみ（例: distro は **「redacted・pattern OK」** 程度）。**実文字列は書かない**。
3. 実値の所在は **「ローカル `wsl-wrapper-values.local.json`（非コミット）」** と記す。

---

## 9. Go / Hold / Reject

| 判定 | 条件（概要） |
|------|----------------|
| **Go** | `validateHermesWsl2WrapperHumanValuePacket` が **`packet_complete_execution_forbidden`**、かつ **拒否フィールドなし**。**それでも実行は別 Goal**（本 Runbookでは `wsl.exe` しない）。 |
| **Hold** | **pending** が残る、または人手でまだ照合したい項目がある。 |
| **Reject** | **`rejected`** — Sysnative、wrapper 形状、禁止パス、スキーマバージョン不一致など。修正して再検証。 |

---

## 10. 次 Goal への渡し方

- 本 Runbook と **redacted Signoff** が揃ったら、**Controlled Pilot / wrapper 配置 / `wsl.exe` 単発**などの **別 Goal** で **明示承認**を取る。
- 渡すのは **registry 方針・argv 固定・Signoff 参照**と **redacted summary**。**local JSON ファイルは渡さない**（共有が必要なら別ルート）。

---

## 11. STOP GATE（越えたら別 Goal）

以下は **本 Runbook の外**（別承認・別セッション）:

- **`wsl.exe` の実行**
- **WSL 内への wrapper 配置・自動コピー**
- **実 Hermes 起動**
- **`execFile` / `spawn` / shell の実機**
- **repo への実値コミット**
- **Control Center / Renderer への raw path 表示追加**
- **`productionReady: true`**
- **`npm install` / 外部通信**（検証用スクリプトを足す場合も別承認で範囲限定）

---

## 12. 実値を共有しない（V1）

- **V1**: 実値は **ローカルのみ**、**共有なし**。
- どうしても必要なら **V1.1 以降**で暗号化ファイルまたは Secret Manager（**平文 Git / チャット禁止**）。

この Runbook 範囲では **実値入力・実ファイル作成をエージェントや CI が代行しない**前提とする（**人がローカルで実施**）。
## 2026-05-06 Discovery-Only Fill-In Note

- Codex performed only bounded local discovery and did not record raw values in docs.
- Multiple WSL distros were discovered, so Codex did not guess the intended distro.
- Remaining HOLD requires selecting the intended distro and rerunning the validator.
- Local-only JSON remains gitignored and must not be staged or committed.
