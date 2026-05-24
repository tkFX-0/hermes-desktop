# WK-CODEX-03 Codex Result Intake Policy

**date:** 2026-05-22
**status:** DESIGN — Phase 1: 人間が手動で戻す / Phase 2: codexTask()が直接取込

---

## 目的

CodexのTaskResult(コード変更・提案・レビュー)をしきしまへ戻す手順を定義する。

---

## Phase 1 — 人間ブリッジ取込

```
1. 人間がCodexの出力をコピー
2. しきしまのDiscord/#指示チャンネルに貼る
3. しきしまが受信 → しるべへ証跡として転送
4. はじめが次アクション判断
```

### Discord経由取込フォーマット (推奨)
```
[Codex Result] タイトル
---
{Codexの出力テキスト}
---
スコープ: StackChan
status: done / partial / failed
```

---

## Phase 2 — CLI直接取込

`codexTask()` の戻り値:
```typescript
interface CodexResult {
  success: boolean;
  output: string;      // Codexの標準出力 (ANSI stripped)
  durationMs: number;
  phase: "phase2_cli";
  error?: string;
}
```

取込後のフロー:
1. `output` → しるべが証跡ファイルに保存
2. 成功 → はじめが次アクション提示
3. 失敗 → ClaudeCodeへルーティング or HOLD

---

## 証跡フォーマット

しるべが保存する証跡:

```yaml
codex_result:
  task_title: {タイトル}
  scope: stackchan_only
  status: success / partial / failed
  output_preview: {最初の200文字}
  full_output_path: docs/evidence/{date}-codex-result.md
  rawValueIncluded: false
  productionReady: false
  execution: disabled
  timestamp: {ISO 8601}
```

---

## 禁止事項

- Codex結果をgit pushに直結させない
- Codex結果だけでproductionReady=trueにしない
- Codex結果のエラーをOllamaで自動補完しない
