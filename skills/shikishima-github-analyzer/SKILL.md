---
name: shikishima-github-analyzer
description: GitHub リポジトリの構造・技術スタックを読取専用で分析。hermes-desktop への取り込み検討用。「リポジトリ分析」「この GitHub を見て」で使用。clone・push は人間 GO。
---

# しきしま — GitHub リポジトリ分析

改変元: [ai-assistant-workspace/skills/github-repo-analyzer](https://github.com/karaage0703/ai-assistant-workspace)（MIT）

## 安全境界

- **読取・要約のみ**（デフォルト）
- `git clone` / `gh repo clone` は **ユーザー明示 GO 後**
- 秘密・`.env` を報告に含めない（redact）

## 手順

### 1. owner/repo 正規化

`https://github.com/owner/repo` → `owner/repo`

### 2. メタ情報

```powershell
gh repo view owner/repo --json name,description,primaryLanguage,updatedAt
```

### 3. 構造（浅い）

```powershell
gh api repos/owner/repo/contents
gh api repos/owner/repo/readme --jq .content
```

README は base64 デコードして要約。

### 4. しきしまへの適合評価

報告に含める:

- 目的（1段落）
- 技術スタック
- **しきしまに取り込めるもの**（Skills / パターン / スクリプト）
- **取り込まないもの**（外部 SaaS 必須・xangi 専用など）
- リスク（ライセンス・秘密・ネットワーク）

### 5. 参考リポ例

`karaage0703/ai-assistant-workspace` → `skills/`・`triggers/`・SessionStore パターン

## 出力テンプレ

```markdown
## リポジトリ分析: owner/repo
- 概要: ...
- スタック: ...
- しきしまへの提案: ...
- HOLD が必要な操作: clone / npm install / 外部 API
```
