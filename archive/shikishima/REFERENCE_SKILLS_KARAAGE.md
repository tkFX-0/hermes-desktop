# 参考 Skills — ai-assistant-workspace

Date: 2026-05-30  
出典: [karaage0703/ai-assistant-workspace](https://github.com/karaage0703/ai-assistant-workspace)（MIT）

## 導入したもの（しきしま改変版）

| 元スキル | しきしま版 | 配置 |
|----------|------------|------|
| code-reviewer | `shikishima-code-reviewer` | `skills/` + `.agents/skills/` |
| multi-agent | `shikishima-multi-agent` | 同上 |
| xangi-kaizen | `shikishima-kaizen-rca` | 同上 |
| github-repo-analyzer | `shikishima-github-analyzer` | 同上 |

## 意図的に未導入（理由）

| 元スキル | 理由 |
|----------|------|
| workspace-rag | 別サービス（port 7890）・しきしまは `discord-threads` JSON で代替 |
| notion-manager / google-workspace | 外部 OAuth・本番連携は HOLD |
| xangi-settings / xangi-onboarding | xangi 専用 |
| cat-diary / health-advisor | 個人生活系・スコープ外 |
| diary / podcast / youtube-notes | 必要時に個別 GO |

## Cursor での使い方

1. Agent がタスクに応じて `SKILL.md` を自動参照（`.agents/skills/`）
2. 明示トリガー例:
   - 「PR をしきしま流れでレビューして」→ code-reviewer
   - 「Bot が返らない原因をなぜなぜで」→ kaizen-rca
   - 「ai-assistant-workspace から取り込める Skills は？」→ github-analyzer

## しきしま連携

- Discord: `!kaihatu` → `kaihatu-auto-review.mjs`（code-reviewer 観点と一致）
- 記憶: `discord-agent-thread-store.mjs`（SessionStore 相当）
- 一覧: `docs/shikishima/DISCORD_COMMAND_PIN.md`

## 再同期

上游を追う場合:

```powershell
git clone --depth 1 https://github.com/karaage0703/ai-assistant-workspace .tmp/ai-assistant-workspace-ref
# 差分を見て skills/shikishima-* を手動マージ（自動コピーはしない）
```

## ライセンス

MIT（上游リポジトリに従う）。改変部分の著作表示は本ファイルと各 `SKILL.md` 先頭。
