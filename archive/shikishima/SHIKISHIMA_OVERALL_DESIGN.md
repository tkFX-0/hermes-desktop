# しきしま計画 — 全体設計書

## 0. Document Status

```text
document_type: overall_design
project: Shikishima / Hermes Desktop
status: accepted
decision: HOLD
execution: disabled
productionReady: false
Level 3: not approved
Final Shikishima 100%: not complete
```

この設計書は、しきしま計画の最終像、現在地、主要コンポーネント、安全境界、開発ロードマップ、運用ループをまとめる。

この文書は設計書であり、以下を承認しない。

```text
- 実行承認
- Level 3 承認
- productionReady true
- execution enabled
- git push
- deploy
- robot / StackChan runtime
- voice / camera / mic
- WSL / Hermes / wrapper execution
- raw values / secrets / local-only values の出力
```

---

# 1. Project Vision

## 1.1 しきしまの最終目的

しきしまは、ユーザーの開発・調査・運用・創作・収益化を支援する、ローカル中心の安全管理型AIエージェントシステムである。

最終的には以下を目指す。

```text
1. ローカルPC上で安全に常駐する Control Center
2. AIエージェント群による作業補助
3. ユーザー承認を必須とする実行ゲート
4. 開発・調査・記録・レビューの半自動化
5. 音声・画面・ロボット表情などの自然なインターフェース
6. 外部連携やクラウド連携は安全審査後に段階解放
7. 最終判断は常にユーザーが行う
```

しきしまの本質は、単なる自律AIではない。

```text
自律的に考えるが、勝手には実行しない。
支援はするが、承認権は奪わない。
止まるべき時に止まり、止まった理由を説明し、次の安全手順を作る。
```

---

# 2. Design Principles

## 2.1 最重要原則

```text
安全 > 自動化 > 速度 > 見た目
```

## 2.2 STOPの扱い

STOPは失敗ではない。STOPは、しきしまの安全機能が働いた結果である。

```text
1. STOP原因を分類する
2. 安全に自己解決できるものを処理する
3. docs / checklist / GO template / evidence を作る
4. source変更やruntime実行が必要なら人間GO境界で止める
5. 次に安全に進める作業へ移る
```

---

# 3. Current State

```text
Final Shikishima overall: approximately 16–18%
v3 Local Practical MVP: approximately 70–75%
Level B3 operation loop: 80%
clean B3 PASS: 4/5
Level 3: not approved
decision: HOLD
execution: disabled
productionReady: false
```

---

# 4. Final Shikishima 100% Definition

```text
1. Safety foundation verified
2. Local app operation stable
3. Level B3 clean operation evidence accepted (5/5)
4. Japanese UI usable for daily operation
5. Level 3 controlled local operation approved and verified
6. 5-agent system operates within approval gates
7. Memory / audit / approval flows usable
8. Voice layer approved and safely integrated
9. Robot / StackChan expression layer ready (physical connection setup)
10. External / remote / cloud operations approved and safely gated
```

---

# 5. System Architecture

## 5.1 全体構成

```text
User
  ↓
Shikishima Control Center (Electron)
  ↓
Safety Gate / Approval Layer
  ↓
Agent Team (5 agents)
  ↓
Tools / Local Files / Memory / External Services
```

## 5.2 主要レイヤー

```text
1. UI Layer          — Electron renderer, Control Center, 19 screens
2. Safety Layer      — GO/HOLD/REJECT, productionReady gate, redaction
3. Agent Layer       — 7 agents (hermes, ichikishima, approval, audit, memory, research, supervisor)
4. Local Runtime     — Electron, local app state, SQLite, Ollama candidate
5. External Boundary — Cloudflare, WSL, GitHub push, StackChan, voice
```

---

# 6. Agent Design

## 6.1 Agent Team (7 agents)

| Agent | Role | Status |
|---|---|---|
| hermes_worker | 開発作業補助・調査 | implemented |
| ichikishima_reviewer | Hermes提案審査 | implemented |
| approval_guardian | 承認キュー管理 | implemented |
| audit_keeper | 証跡記録 | implemented |
| memory_curator | 記憶候補整理 | implemented |
| research_agent | 調査・比較 | implemented |
| supervisor | 全体進捗管理 | implemented |

---

# 7. Safety Model

## 7.1 Core Safety Flags

```text
decision        : HOLD (current)
execution       : disabled (current)
productionReady : false (current)
rawValuesReported: false (always)
robotMotion     : HOLD (current)
Level 3         : not approved (current)
```

## 7.2 実行承認の必須条件

```text
1. 明示的な人間GO (time_window + session ID + command + scope)
2. 曖昧なGOは無効
3. 禁止: "進めておいて" "任せる" "できる範囲で" "自律的にやって"
```

---

# 8. UI Design

## 8.1 Control Center

安全状態の中心画面。表示: decision / execution / productionReady / raw values hidden / actions disabled / readiness labels / warnings.

## 8.2 日本語UI方針 (実装済み)

```text
内部キーは維持。UI表示文字列のみ日本語化。

例:
  本番準備: false（productionReady）
  判定: HOLD（decision）
  実行状態: disabled（execution）
  raw値: 非表示
  操作: すべて無効
```

## 8.3 日本語ロケール

- `/src/shared/i18n/locales/ja/` — 20ネームスペース実装済み
- config.ts / types.ts / index.ts に ja 追加済み

---

# 9. Data / Memory / Audit Design

## 9.1 Memory (SQLite)

保存: 会話要約、作業ログ、ユーザー方針、プロジェクト状態

保存禁止: raw secret / API key / token / local-only path

## 9.2 Audit

記録: session id / time_window / command / result / STOP reason / safety label visibility

## 9.3 Acceptance Record

人間が明示する。例: `accepted_as_level_b3_5_of_5_practical_local_mvp_operation_evidence`

---

# 10. Operation Levels

| Level | Description | Status |
|---|---|---|
| Level 0 | docs/planning only | active |
| Level 1 | local dry-run | PASS (evidence exists) |
| Level 2 | local controlled validation | PASS (evidence exists) |
| Level B3 | Practical Local MVP Operation | 4/5 clean PASS |
| Level 3 | controlled local operation | not approved |
| Production | — | not approved |

---

# 11. B3 Operation Loop

## 11.1 Session Flow

```text
1. Human issues session GO (time_window + session ID + command)
2. Pre-run checks
3. Launch only inside approved time_window (+30s buffer)
4. Observe target screen
5. Close app
6. Post-run checks
7. Classify result (CLEAN_B3_PASS / PASS_WITH_TIMING_CAVEAT / STOP)
8. Record evidence + human acceptance
```

## 11.2 Clean PASS Rule

Launch must be at least +30 seconds after window_start. Pre-window launch = PASS_WITH_TIMING_CAVEAT (not counted).

---

# 12. Roadmap to 100%

## 12.1 Scoring Model

| Phase | Weight | Current |
|---|---|---|
| A Safety foundation | 18% | ~15% |
| B Local validation | 15% | ~14% |
| C Level B3 operation | 12% | ~10% |
| D Japanese UI | 8% | ~6% (implemented) |
| E Local MVP daily loop | 12% | ~8% |
| F Level 3 | 10% | 0% |
| G Agent orchestration | 10% | 0% |
| H Voice layer | 5% | 0% |
| I Robot/StackChan | 5% | ~1% (design complete) |
| J External/deploy | 5% | 0% |

## 12.2 Next 10 Tasks

```text
1. Session-009 clean B3 PASS #5
2. B3 5/5 acceptance record
3. Japanese UI regression session
4. Level 3 gap closure plan
5. Level 3 GO wording draft
6. 5-agent orchestration dry-run
7. StackChan physical connection setup
8. Voice layer POC
9. CI/CD GitHub Actions
10. deploy readiness docs
```

---

# 13. StackChan Integration Design

## 13.1 現在地

```text
StackChan runtime: not approved (device not arrived)
robotMotion: HOLD
Connection design: complete (ready when device arrives)
```

## 13.2 接続準備済みコンポーネント

```text
src/main/ichikishima/stackchan/
  stackchan-connection.ts    — WiFi/Serial connection adapter
  stackchan-expression.ts    — Expression state machine
  stackchan-safety-gate.ts   — Prevents unauthorized motion
  stackchan-config.ts        — Device config (IP/port)
```

## 13.3 デバイス到着後の手順

```text
1. デバイスのIPアドレスをstackchan-config.tsに設定
2. 接続テスト: stackchan-connection.ts の testConnection()
3. 表情のみ: expression-only mode (motion HOLD)
4. Level B3 セッションで expression 確認
5. motion は別途 GO が必要
```

## 13.4 表情状態

```text
HOLD      → 待機表情
THINKING  → 考え中
WARNING   → 警告
COMPLETED → 完了
STOP      → 停止
```

---

# 14. Voice / Camera / Mic Design

```text
現在地: not approved

将来候補:
- VOICEVOX (ローカルTTS)
- Whisper (ローカルSTT)
- user-triggered only (自動録音禁止)
```

---

# 15. GitHub Actions CI/CD

```text
.github/workflows/
  build.yml      — typecheck + test + build on push/PR
  release.yml    — electron-builder パッケージング on tag
```

---

# 16. Strategic Warning

```text
危険な進め方:
  - clean PASSを甘く数える
  - timing caveatを無視する
  - commits_aheadを増やしたままruntimeを重ねる
  - 日本語UI実装とB3完走を混ぜる

正しい進め方:
  - clean PASSは厳格に数える
  - STOPは証跡化する
  - GO境界を守る
  - evidenceでだけ進捗率を上げる
```

---

# 17. Final Statement

```text
ユーザーが安心して任せられる。
AIが勝手に危険なことをしない。
止まるべき時に止まる。
止まった理由が分かる。
次の安全な一手が出る。
証跡が残る。
人間が最後の判断権を持つ。
```

---

この範囲では問題を検出していません
