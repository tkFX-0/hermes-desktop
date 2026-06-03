# 人間 GO 質問票（調査完了後）

Date: 2026-05-30

## 1. Chisiki / CKT / gasvault

しずめ推奨: **当面 A（思想のみ）** — [CHISIKI_SHIZUME_SAFETY_GATE_2026-05-30.md](research/CHISIKI_SHIZUME_SAFETY_GATE_2026-05-30.md)


| 選択    | 意味                              |
| ----- | ------------------------------- |
| **A** | オンチェーンに触らない。課金枠ドキュメントのみ（**推奨**） |
| **B** | 将来: 外部ガス枠 env + 監査のみ（別 GO）      |
| **C** | 本番: ウォレット・CKT・RPC（広い GO 必須）     |


**あなたの選択（記入）**: A / B / C = C

平易説明: [CHISIKI_PLAIN_LANGUAGE_BRIEF_2026-05-30.md](research/CHISIKI_PLAIN_LANGUAGE_BRIEF_2026-05-30.md)

## 2. StackChan 音声


| 選択          | 意味                                                                  |
| ----------- | ------------------------------------------------------------------- |
| **今すぐ**     | `node scripts/shikishima-stackchan-resume.mjs` → preflight 再起動 → 聴感 |
| **HOLD 継続** | 自律実装優先。`stackchan-hold.mjs` 維持                                      |


**あなたの選択**: 今すぐ / HOLD 継続 =今すぐ

### 聴感チェック（今すぐの場合）

```powershell
node scripts/shikishima-voice-pilot-once.mjs
node scripts/shikishima-process-preflight.mjs --clean --restart-dev
```

Discord で短い返信 → StackChan から音が出るか、エラーが出ないか。

## 3. 記録

**記入済み（2026-05-30）**:

```text
[GO] Chisiki=C StackChan=resume 2026-05-30
```

- **Chisiki C**: 本番ウォレット・CKT・RPC は **コード未実装（CHI-C = H）**。別途広い GO が必要。
- **StackChan resume**: `node scripts/shikishima-stackchan-resume.mjs` → preflight 再起動 → 聴感。
- **意図別発話**: [STACKCHAN_OPERATOR_NOTIFY_2026-05-30.md](STACKCHAN_OPERATOR_NOTIFY_2026-05-30.md)

