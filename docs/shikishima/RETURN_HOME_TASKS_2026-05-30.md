# 帰宅時タスクまとめ（2026-05-30）

最終更新: 2026-05-30T16:15 JST 相当

## いま動いているもの（PASS 確認済み）

| 項目 | 状態 |
|------|------|
| SideBot | 稼働（PID は `shikishima-process-preflight.mjs` で確認） |
| 自律ワークフロー | **1件アクティブ** `wf-mpsjl3fk` |
| オーケストレータ | 緩和 ON・15分 tick・`exit=0` |
| ワークフロー keepalive | 3分ごと（再起動後も継続） |
| 安全不変 | `decision=HOLD` / `execution=disabled` / 本番 execute 不可 |

## 自律ワークフロー（メインタスク）

**ID:** `wf-mpsjl3fk`  
**指示:** `@しきしま EA研究をしてください スタート証拠金は2万円です`  
**現在:** コード修正後は起動時 **heal** または `!workflow settle` で **human** へ落ちる想定（空回し停止）。反映前のスナップショット: `eval` / cycle 3 / HOLD。

### サイクル1の経過（ログより）

| 段階 | 結果 |
|------|------|
| instruction → dev | OK |
| dev | **fail**（`lastDevOk: false`） |
| research | OK（governance 記録） |
| record (MT5 BT) | **ok**（`backtestOk: true`） |
| eval | **HOLD** · `evalNeedsHuman: true` |
| 自動ループ | `eval HOLD → auto loop dev` → **cycle 2 / dev** へ |

### サイクル2でやること

1. **dev** — `!kaihatu` / WSL 開発レーンで EA 研究の実装・調査タスク  
2. **research → record → eval** — 再評価  
3. **human** — 必要なら人間確認（`autonomousDevAutoLoop` が ON なら再ループも可）

### Discord コマンド

```
!workflow status
!workflow pause
!workflow settle
!workflow resume
!dev-pipeline
!kaihatu <具体的な一行指示>
@つむぎ EA/MQL5/バックテストの続きを
```

空回し停止の詳細: `WORKFLOW_BACKLOG_FIX_2026-05-30.md`

## 帰宅前〜帰宅で完了した作業

1. **ちはや廃止** — 正規5体へ。EA/MT5 は **つむぎ** にルーティング（`CHIHAYA_REMOVED_2026-05-30.md`）
2. **返答停止の原因** — `!tnt` 後 Bot 未起動 → 修復・再起動
3. **オーケストレータ制限洗い出し + 緩和** — `ORCHESTRATOR_GATES_AUDIT_2026-05-30.md`
4. **スコープ付き GO** — MT5 BT / 自律開発（本番・ライブ売買は HOLD）
5. **ワークフロー再起動耐性** — checkpoint / 起動時 resume / 3分 keepalive / handoff 自動 enqueue

## 触っていない・HOLD のまま

- ライブ売買・git push・本番 `execution=enabled`
- `stackchan.voice`（憲法 GO 必須）
- 既存 EA ソースの無断変更

## 既知の副次課題（開発ブロックではない）

- StackChan `midNodTimer is not defined`（Discord 音声読み上げのみ）
- agent-team tick は `interval_not_elapsed` で次回まで待ち
- **dev 段の WSL 失敗** — cycle1 で `lastDevOk: false`。`!dev-pipeline` で preflight 確認推奨

## 次の人手アクション（優先順）

1. **Bot 再起動** — `node scripts/shikishima-process-preflight.mjs --clean --restart-dev`  
2. 司令部で `!workflow status` — **human** になっているか確認（未なら `!workflow settle`）  
3. EA 再開: `!dev-pipeline` → `!kaihatu EA研究: Githubから2万円スタート向けEA候補を列挙`  
4. 急ぎの単発返答: `@つむぎ` に直接依頼（ワークフローと並行可）

## 参照ファイル

- `.shikishima-memory/autonomous-workflow-queue.json`
- `.shikishima-memory/handoff.json`
- `docs/shikishima/EXECUTION_SCOPE_GO_2026-05-30.md`
- `node scripts/shikishima-workflow-resume-audit.mjs`
