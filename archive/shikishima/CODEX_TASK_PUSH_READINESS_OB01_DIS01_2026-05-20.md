# Codex Task — Push Readiness Review for OB-01 / DIS-01 / SC-PC-02 Batch

**date:** 2026-05-20
**status:** PENDING — awaiting Codex review
**issued_by:** tk (human)
**worker:** Codex

---

## 目的

origin/main より 4 commits ahead の内容を push してよいか監査する。
特に 3813c1e は main/preload IPC handler を追加しているため、
docs-only 扱いせず、source safety review を行う。

---

## 対象コミット

```text
3813c1e  feat(ob01/dis01): library write IPC + Discord read-only intake  ← 重点
b3d2808  docs: record stackchan pc setup and face capability check
3c48d7e  feat(theater): chat input below room, history as right-side dropdown
1711b27  feat(theater): move RoomChat immediately below PixelRoomStage
```

---

## ベースライン (確定値)

```text
branch:        main
head:          3813c1e61c94152a2ae795f7ad096a5d6d50fb4d
origin_main:   f19e36db9dd008636c775b9f21a6d274b9a9af74
commits_ahead: 4
staged:        0
tracked_dirty: 0
```

---

## 禁止事項 (実行しないこと)

```text
- git push
- git add
- git commit
- git reset
- source変更
- package変更
- npm install / npx
- runtime起動 / npm run dev
- Discord接続
- Obsidian実書き込み
- x_search
- Hermes/WSL
- Command Chat send
- StackChan追加Burn
- 外部API
- token作成/読取
```

---

## 確認コマンド (read-only のみ)

```bash
git branch --show-current
git rev-parse HEAD
git rev-parse origin/main
git rev-list --count origin/main..HEAD
git status --short
git log --oneline origin/main..HEAD
git diff --name-only origin/main..HEAD
git diff --stat origin/main..HEAD
git show --stat --name-only 3813c1e
git show 3813c1e -- src/main/library-export.ts
git show 3813c1e -- src/main/discord-intake.ts
git show 3813c1e -- src/main/index.ts
git show 3813c1e -- src/preload/index.ts
git show 3813c1e -- src/renderer/src/screens/AgentTheater/DiscordInboxPanel.tsx
git show 3813c1e -- src/renderer/src/screens/Library/LibraryMarkdownPreview.tsx
```

---

## 重点確認項目

### 全体

```text
- commits_ahead が 4 か
- staged が 0 か
- tracked_dirty が 0 か
- package.json / lockfile 変更がないか
- token / local-only / firmware ファイルが含まれていないか
- productionReady false
- execution disabled
- rawValuesReported false
- forbidden external action button が増えていないか
```

### 3813c1e — src/main/library-export.ts

```text
- OB01_DRY_RUN が true 固定か
- 実ディスク書き込みが dry-run で止まるか
- 書き込み先パスが固定/検証されているか (30_Evidence/ のみ)
- raw path を返さないか (redactedPath のみ)
- path containment check が機能しているか
```

### 3813c1e — src/main/discord-intake.ts

```text
- DIS01_HOLD が true 固定か
- DIS01_HOLD=true で Discord API コール不可か
- token を読み取らない/ログしないか
- 外部接続が実行されないか
- rawTokenReported が false リテラルか
```

### 3813c1e — preload (index.ts / index.d.ts)

```text
- expose 範囲が shikishimaLibraryWrite / shikishimaDiscordRead の 2 つだけか
- arbitrary file write ができないか
- arbitrary fetch / network ができないか
- 既存の hermesAPI から逸脱していないか
```

### 3813c1e — renderer

```text
- DiscordInboxPanel: HOLD 表記か / 実送信・実接続ボタンがないか
- LibraryMarkdownPreview: dry-run 表記か / 実書き込みが直接起きないか
- AgentTheaterPage: 追加パネルだけか / 既存安全性に影響がないか
```

---

## Final Report フォーマット

```yaml
RESULT:
  status: PASS / STOP
  reason:

baseline:
  branch:
  head:
  origin_main:
  commits_ahead:
  staged:
  tracked_dirty:
  untracked_count:

commits:
  - hash: 1711b27
    subject: feat(theater): move RoomChat immediately below PixelRoomStage
    classification: ui-only / docs / source+ipc / other
  - hash: 3c48d7e
    subject: feat(theater): chat input below room, history as right-side dropdown
    classification:
  - hash: b3d2808
    subject: docs: record stackchan pc setup and face capability check
    classification:
  - hash: 3813c1e
    subject: feat(ob01/dis01): library write IPC + Discord read-only intake
    classification:

source_review:
  main_ipc_added:          true/false
  preload_api_added:        true/false
  renderer_ui_added:        true/false
  package_changed:          true/false
  lockfile_changed:         true/false
  arbitrary_file_write_risk: true/false
  arbitrary_network_risk:   true/false
  token_risk:               true/false
  raw_path_risk:            true/false

ob01:
  dry_run_true:           true/false
  actual_write_possible:  true/false
  raw_path_reported:      true/false
  safe:                   true/false

dis01:
  hold_true:                    true/false
  discord_api_call_possible:    true/false
  token_logged:                 true/false
  message_sent:                 true/false
  safe:                         true/false

safety:
  runtime_started:          false
  npm_run_dev:              false
  x_search_executed:        false
  discord_connected:        false
  obsidian_written:         false
  hermes_bridge_connected:  false
  command_chat_sent:        false
  stackchan_controlled:     false
  external_api_write:       false
  productionReady:          false
  execution:                disabled
  rawValuesReported:        false
  git_push_performed:       false

push_readiness:
  safe_to_push:           true/false
  reason:
  recommended_push_scope: (e.g. all 4 commits / 3 commits only / STOP)
```

---

## 完了後の次アクション

```text
safe_to_push: true  → tk が push GO を発行 → ClaudeCode が git push
safe_to_push: false → 問題箇所を tk に報告 → 修正 → 再監査
```
