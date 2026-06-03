# Controlled Pilot — 実行ファイル・argv・stdout・Signoff 値確認（文書のみ）

**実施タイプ**: リポジトリ内ドキュメント／README の**読取のみ**。**実 Hermes 起動・`execFile`・`child_process`・外部通信・secrets/.env 参照なし**。

**親レポート**: Controlled Pilot 実機前準備 Run の要約は **`GOAL_COMPLETION_REPORT.md`**（§2 達成したこと）および **`IMPLEMENTATION_HANDOFF.md`** を参照。

**更新（2026-05-05）**: **NousResearch/hermes-agent はネイティブ Windows を Quick Install 対象としない**（上游 README）。**`%USERPROFILE%\.hermes\` に `hermes.exe` が無いことは自然**。**本命は WSL2 内 `hermes` / `wsl.exe` + WSL wrapper**（`ADR_REAL_HERMES_WSL2_CONNECTION.md`）。

---

## 1. 実 Hermes 実行ファイル候補

| ソース | 内容 |
|--------|------|
| **本リポジトリ** | **特定の Hermes CLI バイナリパスはコミットしない**（テストはダミー絶対パス）。 |
| **Windows（過去の仮定）** | **`hermes.exe` を前提にしない**。探索 0 件は **ADR と整合**。 |
| **Windows（本命候補）** | **`C:\Windows\System32\wsl.exe`（例）** + **固定 argv** + **WSL 内 wrapper スクリプト**（`HERMES_WSL2_WRAPPER_CONTRACT.md`）。`hermes-controlled-pilot-config` の **`adapterKind: wsl_wrapper`**。 |
| **WSL 内** | 上游の **`hermes` CLI**（対話・サブコマンド中心）。**stdout 単一 JSON は wrapper 契約側**で収斂する想定。 |

---

## 2. 固定 argv（`--mode` / `bridge-payload-once`）対応状況

| 項目 | 状態 |
|------|------|
| **本リポの推奨（ingress 用）** | `["--mode", "bridge-payload-once"]` は **ドキュメント候補**（**公式 CLI に同フラグがあるかは未確認**）。 |
| **`wsl.exe` 経路** | **`["-d", "<Distro>", "--", "/abs/wrapper.sh"]`（厳格 4 トークン）**が config で検証可能。 |
| **結論** | **直叩きで公式 `hermes` に渡す前提は置かない**。**wrapper または別仕様確認 Goal 後**に実機。 |

---

## 3. stdout に `hermes-bridge-payload/v1` JSON を一度だけ出せる仕様か

| 項目 | 状態 |
|------|------|
| **hermes-desktop 側の契約** | `validateHermesBridgePayload`・単一 JSON stdout（`HERMES_BRIDGE_PAYLOAD_CONTRACT.md`）。 |
| **官方 CLI がそのまま満たすか** | **未確認**。TUI/ログ混在リスクのため **wrapper 契約を推奨**（`HERMES_WSL2_WRAPPER_CONTRACT.md`）。 |

---

## 4. signoff 関連の候補（最終採用はユーザー承認）

実行時点の **Unix ms（候補）**: **`1777944488925`**  
（当時の `Date.now()`。**実機 Goal では再取得推奨**。）

| フィールド | 候補値 |
|------------|--------|
| signoffSource | `HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md §12` |
| operatorLabel | `user` |

---

## 5. Controlled Pilot 実機 1 回に必要な値 — 分類表

| キー | 状態 | メモ |
|------|------|------|
| executablePath | **候補あり**（Windows） | 例 `C:\Windows\System32\wsl.exe`。**実在はユーザー確認** |
| adapterKind | **候補あり** | **`wsl_wrapper`**（`wsl.exe` 時必須） |
| allowedExecutableId | **未確認** | 例 `wsl-hermes-bridge-wrapper-v1` |
| argv | **候補あり** | **wsl**: 厳格 4 トークン。**`bridge-payload-once` は wsl 経路では通常使わない** |
| cwd | **候補あり** | Zone 規則内の絶対パス |
| timeoutMs / maxStdoutBytes / maxStderrBytes | **候補あり** | ユーザー明示 |
| humanSignoffConfirmed / enableRealProcessExecution | **未確認**（実機時 true） | |
| signoffAtUnixMs / signoffSource / operatorLabel | **候補あり** | 上表 |
| zoneRoot / projectRoot | **候補あり** | 既存 Zone／clone ルート |

---

## 6. 未確認項目（実機 Goal 前に埋める）

- **WSL distro 名**・**wrapper の実パス**（書込は別 Goal）。
- **上游 `hermes` が `--mode bridge-payload-once` を解釈するか**（未確認のまま直叩きしない）。
- **signoff の本採用値**。

---

## 7. 検証コマンド（このレポート作成時・参考）

- `npm run typecheck:node`
- `npx vitest run tests/ichikishima/hermes/hermes-controlled-pilot-*.test.ts`

---

## 8. 判定

**この範囲では問題を検出していません**（実プロセス未実行・secrets 未参照に限る）。
