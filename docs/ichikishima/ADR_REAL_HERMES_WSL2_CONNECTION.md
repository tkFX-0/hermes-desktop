# ADR: NousResearch `hermes-agent` 実接続 — Windows **ネイティブ exe 前提の破棄**と **WSL2 経路**

**状態**: 承認済み（文書のみ・実機未実施）。  
**決定日**: 2026-05-05  
**範囲**: Ichikishima / Controlled Pilot / Real Process Adapter の**設計境界**。**コード自動実行・`wsl.exe` 実起動・外部通信なし**。

---

## 1. 文脈

- **正とする upstream**: [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)（ユーザー提示の「本物 Hermes」）。
- 同 README 上、**Quick Install は Linux / macOS / **WSL2** / Android Termux 向け**であり、**ネイティブ Windows は未対応**と明記されている。
- したがって、**`%USERPROFILE%\.hermes\` に `hermes.exe` がある前提**で Controlled Pilot を組むのは**不整合**だった。

---

## 2. 決定

1. **Windows での Hermes CLI 本筋**は **`wsl.exe` 経由で WSL2 ディストリビューション内の `hermes` 等を使う**前提とする（ネイティブ exe は upstream が提供しない）。
2. **Controlled Pilot の「実行口」候補**は次の二層へ分離する。
   - **Windows 側 allowlist**: 例 `C:\Windows\System32\wsl.exe`（**狭い・固定 argv 必須**）。
   - **WSL 側**: 当該 distro 内の **wrapper スクリプト 1 パス**（stdout が **単一 JSON** のみになることを契約する）。`hermes-bridge-payload/v1` を**生成する責務**は wrapper／将来拡張とし、**公式 CLI がそのまま満たす保証はない**。
3. **`--mode bridge-payload-once`** は **hermes-desktop 側のingress契約（独自）**であり、**公式 `hermes` CLI に同名サブコマンド・同一挙動があるとは未確認**。**直接 `hermes --mode bridge-payload-once` を実機で試すことは、別 Signoff なしでは禁止**（Runbook / Final Gate と整合）。

---

## 3. 根拠（仕様ギャップ）

| 公式 CLI（README イメージ） | こちらの Bridge 契約 |
|----------------------------|----------------------|
| `hermes` / `hermes gateway` / `hermes setup` / `hermes model` 等 | stdout に **`hermes-bridge-payload/v1` の JSON を 1 回だけ**（余計なログなし） |

**無視して直叩きすると**: stdout に TUI・通常ログ・複数行が混ざり、`validateHermesBridgePayload` で fail-closed になり得る。

---

## 4. 推奨アーキテクチャ（初回実機前）

- **WSL2 内の wrapper スクリプト**（例: `/home/<user>/.hermes-bridge/hermes-bridge-payload-once.sh`）を **allowlist の唯一の「コマンド引数」**とし、`wsl.exe` の argv を **完全一致で固定**する。
- wrapper は **外部通信・secrets・任意シェル展開・任意コマンド連鎖を禁止**する設計とする（詳細は **`HERMES_WSL2_WRAPPER_CONTRACT.md`**）。

---

## 5. `wsl.exe` を allowlist に載せる際の追加ゲート

- `wsl.exe` は **任意 Linux コマンド実行口**になり得るため、**allowlist パス + `execFile` のみ + argv 完全一致 + 短命 + 出力上限**の**上に**、「**argv 形の監査可能性**」を人手で確認する**別ゲート**とする（**§12 Signoff / 「wsl 専用」チェックリスト**推奨）。

---

## 6. まだしないこと（本 ADR の直後も）

- `wsl.exe` / `hermes` の**実起動**、install スクリプト、**実 `execFile`**。
- wrapper スクリプトの**実ファイル作成**（別 Goal）。

---

## 付録 A — Pending / deferred（本 ADR 範囲・実行しない）

| 項目 | status | reason | nextRequiredAction |
|------|--------|--------|---------------------|
| WSL DistroName | pending | requires user value | 人手 で `wsl -l -v` 相当を確認し別 Goal に記載 |
| WSL unix user（ホーム配下論理） | pending | requires user value | Distro とセットで確認 |
| wrapper 実ファイルパス | pending | deferred / separate goal | `HERMES_WSL2_WRAPPER_CONTRACT.md` に従い **ファイル作成 Goal** でのみ |
| `bridge-payload-once` と公式 CLI の一致 | pending | upstream 未確認 | ドキュメント突合レビューを別フェーズへ |
| 実 `_execFile_/wsl` 起動 | blocked | STOP GATE | `HERMES_REAL_PROCESS_ADAPTER_FINAL_GATE.md` と Sign-off |

---

## 7. 関連文書

- `HERMES_WSL2_WRAPPER_CONTRACT.md`
- `HERMES_EXECUTION_SPEC_DISCOVERY.md`
- `HERMES_REAL_PROCESS_ADAPTER_FINAL_GATE.md`
- `CONTROLLED_PILOT_VALUE_CONFIRMATION_REPORT.md`（Windows exe 未発見の経緯）

---

## 8. この範囲では問題を検出していません

（実機・子プロセス・外部通信を伴わない文書決定に限る。）
