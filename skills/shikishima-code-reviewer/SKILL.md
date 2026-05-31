---
name: shikishima-code-reviewer
description: しきしま向けコードレビュー。ローカル diff・PR・!kaihatu 後の自動レビュー（checklist+vitest）と連携。「PRレビュー」「コードレビュー」「!kaihatu レビュー」「変更点をレビュー」で使用。git push・本番適用は HOLD。
---

# しきしま — コードレビュー

改変元: [ai-assistant-workspace/skills/code-reviewer](https://github.com/karaage0703/ai-assistant-workspace)（MIT）

## しきしま安全境界（必須）

- `decision=HOLD` / `execution=disabled` / `productionReady=false`
- **git push 禁止**（人間が明示承認するまで）
- GitHub への PR コメント投稿は **ユーザーが依頼した場合のみ**
- `.env`・API キー・秘密・MT5/EA 本番は触らない

## いつ使うか

- `!kaihatu` / つむぎ開発の直後
- ローカル `git diff` のレビュー
- `gh pr view` / `gh pr diff` が使える PR レビュー（投稿は GO 後）

## 手順（ローカル優先）

### 1. 変更範囲の把握

```powershell
git status
git diff
git diff --stat
```

対象が PR なら:

```powershell
gh pr view <番号> --json title,body,files
gh pr diff <番号>
```

### 2. 自動チェック（しきしま標準）

```powershell
npx vitest run tests/hermes/zone/full-autonomy --reporter=dot
```

設計 checklist は `src/main/shikishima-full-autonomy/design-review-checklist.ts` の観点に沿う。

### 3. レビュー観点

| 観点 | しきしま固有 |
|------|----------------|
| 安全 | autonomy-invariants・HOLD 維持 |
| 範囲 | 依頼外ファイルを含まないか |
| テスト | zone vitest が増えているか |
| Discord | 外部送信・メンション allowlist |
| 秘密 | ログにトークン/raw 値がないか |

重要度: **【必須】** / **【推奨】** / **【提案】**

### 4. 出力形式（Discord / チャット向け）

```
🛡️ しずめ — 自動レビュー
判定: GO_PREPARED | HOLD
vitest: passed=N / failed=M
ブロッカー: ...
推奨次手: ...
本番反映: HOLD（人間 GO）
```

### 5. GitHub 投稿（人間 GO 後のみ）

ユーザーが「PR にコメントして」と明示したときだけ:

1. 該当行への個別コメント（`gh api` … `/pulls/comments`）
2. サマリー（`gh pr review --comment`）

## マルチエージェント（任意）

WSL に `claude` / subscription レーンがある場合:

- **しずめ**: 安全・HOLD
- **つむぎ**: 実装・テスト
- **はじめ**: 次の一手・タスク分解

Codex/Gemini は **ユーザーが明示したときのみ**。結果は統合して1本の報告にまとめる。

## 連携ファイル

- `scripts/lib/kaihatu-auto-review.mjs`
- `scripts/lib/discord-command-catalog.mjs`（`!kaihatu-test`）
