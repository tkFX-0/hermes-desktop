# Hermes WSL2 Wrapper — **local-only** 実値保管方針（**コミット禁止**）

**位置づけ**: `HERMES_WSL2_WRAPPER_HUMAN_VALUE_PACKET.md` で扱う値のうち、**環境依存の実値**を **リポジトリに残さない**ための運用。**`wsl.exe` 実行・ファイル自動配置・外部送信なし**。

関連: `HERMES_WSL2_WRAPPER_PARAMETER_REGISTRY_SPEC.md`、`hermes-wsl2-wrapper-human-value-packet.ts`（`humanValuePacketToRegistry`、`validateLocalOnlyValuePacketShape`、`summarizeRedactedLocalValuePacket`）、`HERMES_WSL2_WRAPPER_HUMAN_VALUE_PACKET.md`。**人手記入〜redacted Signoff の手順**: `HERMES_WSL2_WRAPPER_LOCAL_VALUE_FILL_IN_RUNBOOK.md`、`HERMES_WSL2_WRAPPER_USER_NEXT_ACTION_CHECKLIST.md`、`HERMES_WSL2_WRAPPER_LOCAL_VALUE_VALIDATOR_RUNBOOK.md`、`HERMES_WSL2_WRAPPER_VALUE_SIGNOFF.md`。

---

## 1. 目的

- **実 distro / unix user / 実パス / signoff 時刻**を **repo にコミットしない**。
- 開発者が **同じ形**でローカルにだけ置ける **template / example** を提供する。
- **実行直前の正規モデルは `HermesWsl2WrapperParameterRegistry`**（packet 生値を exec に直接渡さない）。

---

## 2. 二層モデル（当面維持）

| 層 | 役割 | Master の意味 |
|----|------|----------------|
| **Human value packet**（入力） | 人が記入・確認・Signoff | **人間レビュー用**の欄 |
| **`HermesWsl2WrapperParameterRegistry`**（検証） | `validate*` / `summarize*` / CC safe summary | **実行前の機械検証用** |

**正規変換経路（V1）**:

```text
ローカル JSON（.gitignore） または 手入力
  → HermesWsl2WrapperHumanValuePacket 形状
  → validateHermesWsl2WrapperHumanValuePacket()
  → humanValuePacketToRegistry()
  → validateHermesWsl2WrapperParameterRegistry()
  → summarize* → Control Center（safe summary のみ）
```

**実行系（将来 Goal）に渡すのは registry 経由の検証済み境界のみ。**packet の生オブジェクトを `execFile` に直結しない。

**Validator prepared（2026-05-05）**: local-only JSON reader は固定パスのみを読み、redacted validation report だけを返す。raw JSON / raw path / raw argv は返さない。実値未記入または placeholder は `HOLD`。

追記（2026-05-06）: manual placement design is documented in `HERMES_WSL2_DUMMY_WRAPPER_MANUAL_PLACEMENT_PLAN.md`. No WSL file placement is performed by this policy.

---

## 3. repo に **置いてよい**もの

- **プレースホルダのみ**の template: `sandbox/hermes-autonomy-zone/local-only/wsl-wrapper-values.local.example.json`
- **README**（運用手順・禁止事項）
- **redacted** な報告書・Signoff 写し（実パス・実ユーザー名を伏せた版）
- **空欄の** Signoff テンプレ（**redacted 版のみ repo に可**・本文は **`HERMES_WSL2_WRAPPER_VALUE_SIGNOFF.md`**）

---

## 4. repo に **置いてはいけない**もの

- **実値**を含む `wsl-wrapper-values.local.json`（**git 追跡禁止** — `.gitignore` 済み）
- `.env` や secrets ストアへの **混在コピー**
- **raw** Control Center snapshot（実装は safe summary のみ）
- API キー・トークン・パスワード全文

---

## 5. 推奨保管場所（優先順）

1. **ローカル ignored JSON**（本リポジトリ方針）  
   - パス: `sandbox/hermes-autonomy-zone/local-only/wsl-wrapper-values.local.json`  
   - **`.gitignore` で除外**。作業者が **手元で** example をコピーしてリネームし、値を記入。

2. **Electron `userData` 配下**（将来）  
   - 別 Goal で実装検討。**今はコードで読み込まない**。

3. **手動 Signoff 文書（紙・別システム）**  
   - repo に残すのは **redacted 版のみ**。

---

## 6. ファイル命名

| ファイル | 用途 |
|----------|------|
| `wsl-wrapper-values.local.example.json` | **コミット可**。プレースホルダのみ。 |
| `wsl-wrapper-values.local.json` | **コミット禁止**（実値）。`.gitignore`。 |

---

## 7. Control Center

- **表示**: `HermesWsl2WrapperHumanValuePacketSafeSummary` / registry safe summary のみ（**raw path・argv 全文なし** — 既存契約）。

---

## 8. Signoff に残すもの

- **redacted summary**（件数・status・次アクション・policy ラベル）  
- 実値は **repo 外**または **ignored ファイル**に限定。

---

## 9. 統合タイミング（将来）

- Human packet と registry の **単一 master 化**は、**人手 1 回記入・Signoff・運用が安定してから**（別文書の V1.1 / V2 議論参照）。**今は分離維持**。

---

## 10. 関連パス

- Example: `sandbox/hermes-autonomy-zone/local-only/wsl-wrapper-values.local.example.json`
- README: `sandbox/hermes-autonomy-zone/local-only/README.md`
- **Fill-in Runbook**: `HERMES_WSL2_WRAPPER_LOCAL_VALUE_FILL_IN_RUNBOOK.md`
- **Redacted Signoff テンプレ**: `HERMES_WSL2_WRAPPER_VALUE_SIGNOFF.md`
