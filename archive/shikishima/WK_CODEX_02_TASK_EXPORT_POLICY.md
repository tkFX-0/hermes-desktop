# WK-CODEX-02 Codex Task Export Policy

**date:** 2026-05-22
**status:** ACTIVE — exportCodexTaskMd() 実装済み (codex-service.ts)

---

## 目的

Phase 1 (人間ブリッジ) においてしきしまがCodex用Task.mdを生成する。
人間がCodexへコピーして実行する。自動送信は行わない。

---

## Task.md 必須フィールド

```markdown
# Codex Task — {タイトル}

Recommended Worker: Codex CLI (StackChan専用)
Scope: {スコープ}
Auth mode: OPENAI_API_KEY or ChatGPT login

## Objective
{目的}

## Safety Boundary
- productionReady: false
- execution: disabled
- git push: 未実施 (別途human GO)
- rawValuesReported: false

## Human Bridge Notice
このTaskは人間がCodexへコピーして実行します。
Shikishimaは自動的にCodexを起動しません。
結果はしるべへ証跡として戻してください。
```

---

## 禁止事項

Task.md に含めてはいけないもの:
- raw token / API key / credentials
- ローカルIPアドレス / プライベートパス
- git push 指示
- productionReady: true 指示
- execution: enabled 指示
- StackChan以外への指示

---

## 人間ブリッジフロー

```
1. つむぎ: Codex不可 → exportCodexTaskMd()でTask.md生成
2. しきしま: Task.mdをDiscord/UIに表示
3. 人間: Task.mdを読んでCodexへ貼る
4. Codex: StackChan scopeで実行
5. 人間: 結果をしきしまへ戻す
6. しるべ: 証跡保存
```
