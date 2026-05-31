---
name: shikishima-multi-agent
description: しきしまエージェントチーム（しきしま・しずめ・つむぎ・はじめ・しるべ・ちはや）の協調。Discord スレッド記憶・!agent-test・役割分担。「みんなで考えて」「エージェントチームで」「複数視点でレビュー」で使用。
---

# しきしま — マルチエージェント協調

改変元: [ai-assistant-workspace/skills/multi-agent](https://github.com/karaage0703/ai-assistant-workspace)（MIT）

## エージェント役割

| ID | 役割 | 典型タスク |
|----|------|------------|
| shikishima | 管制・整理 | 要約・次の一手・!部屋状況 |
| shizume | 安全 | HOLD 判定・ゲート |
| tsumugi | 実装 | !kaihatu・コード・vitest |
| hajime | 計画 | タスク・ロードマップ |
| shirube | 記録 | ログ・Obsidian・調査 |
| chihaya | FX | MT5・killzone（HOLD 時停止） |

レジストリ: `src/shared/shikishima-agent-model-registry.json`

## 記憶（スレッド）

- 部屋×エージェント JSON: `.shikishima-memory/discord-threads/{channelId}.json`
- プロンプト注入: `scripts/lib/discord-agent-thread-store.mjs`
- **読みに行かないと話が飛ぶ**問題はスレッド常駐で緩和

## モード

### 1. ローカル順番テスト（API 課金なし）

```
!agent-test
順番での回答
```

`scripts/lib/agent-sequential-human-check.mjs`

### 2. 開発レーン（subscription）

司令部のみ:

```
!kaihatu <指示>
!kaihatuslot <指示>
```

### 3. 協調レビュー（Cursor 内）

1. しきしまが論点整理
2. しずめが安全チェック
3. つむぎが実装影響
4. はじめが次タスク
5. 1本に統合（重複削除）

## 回答待ち

- WSL `claude` / Groq は **完了を待ってから**統合
- 片方失敗でも得られた結果は報告（捏造しない）

## 禁止

- 全員同時に外部 Discord 送信
- 憲法 GO なしの execution 有効化
- エージェント個別の「ブラウザログイン」前提（Bot は Groq/WSL のみ）
