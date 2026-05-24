# WK-CODEX-04 Codex CLI Controlled Run — GO Form

**date:** 2026-05-22
**status:** Phase 2 ACTIVE (OPENAI_API_KEY必要) / Phase 3 HOLD

---

## Phase 2 実行条件 (現在有効)

Phase 2 CLIは以下がすべて満たされた場合のみ実行:

```yaml
codex_available: true          # binary confirmed
api_key_present: true          # .env.local OPENAI_API_KEY 存在確認
scope: stackchan_only          # StackChan関連タスクのみ
sandbox_enabled: true          # Codexデフォルトsandbox
network_allowed: false         # オフライン実行
git_push: forbidden            # Codexにpushさせない
productionReady: false         # 変更不可
execution: disabled            # Codex実行自体はPhase2許可、automation HOLD
```

---

## Phase 3 HOLD — しきしまからの完全自動起動

Phase 3 (しきしまが自律的にCodexを繰り返し起動) は **別途人間GOが必要**。

Phase 3 解除条件 (すべて必要):
- [ ] Phase 2 で10回以上安全な実績
- [ ] しずめによるHOLD審査通過
- [ ] 人間による明示的GO (Discord / UI)
- [ ] sandbox + approval policy 設定確認
- [ ] StackChan scope限定の確認

---

## AWS環境でのCodex CLI設定

```bash
# Ubuntu EC2想定
npm i -g @openai/codex
export OPENAI_API_KEY="sk-..."  # AWS Secrets Managerから取得推奨

# 実行 (sandboxed, network off by default)
codex exec "StackChanのWebSocketコードをレビューして"
```

認証2択:
- A: `OPENAI_API_KEY` (AWS/CLI Worker向き、自動化しやすい)
- B: ChatGPT login (headless環境では困難、手動向き)

---

## 安全境界

```yaml
codex_scope: stackchan_only
codex_git_push: forbidden
codex_auto_loop: phase3_hold
codex_production_ready: forbidden
codex_execution_enabled: forbidden
rawApiKeyReported: false
```
