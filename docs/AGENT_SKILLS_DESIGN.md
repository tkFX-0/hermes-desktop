# しきしまエージェント 完全設計書 v2.0
> 作成: 2026-05-23

---

## 1. 現状診断 — 何が足りないか

### 現在のアーキテクチャの問題

```
現在: キーワード → モデル選択 → テキスト返答
理想: タスク → スキル呼び出し → 構造化実行 → 結果統合
```

| 問題 | 影響 |
|---|---|
| エージェントが「AIモデル選択器」にすぎない | スキルがなく何ができるか不明確 |
| システムプロンプトが薄い | 個性・制約・記憶が反映されない |
| エージェント間通信プロトコルがない | 協調作業が委任だけ |
| フィードバックループがない | 出力品質が向上しない |
| FXが管制エージェントに混在 | しきしまの役割が広すぎる |
| セッション間記憶が弱い | 毎回ゼロから説明が必要 |

---

## 2. エージェントごとの現状と不足

### しきしま — 管制塔

**不足:**
- 専用システムプロンプトなし（個性なし）
- FX分析との役割分離がない（広すぎる）
- 委任ロジックが暗黙的
- ユーザーの感情・状態追跡なし

### しずめ — 安全ゲート

**不足:**
- HOLD履歴管理なし
- リスクスコア数値化なし
- 段階的承認パス（HOLD → 修正 → GO）なし
- 秘密情報スキャン機能なし（正規表現ベースの即時検出が必要）

### つむぎ — 実装

**不足:**
- 実際のファイル操作・git操作スキルなし
- typecheck/lint/test実行スキルなし
- PRレビュー・作成スキルなし
- マルチファイル設計なし

### はじめ — 計画

**不足:**
- タスクシステムとの統合なし（計画が実タスクに落ちない）
- 進捗追跡なし
- 依存グラフ生成なし
- ロードマップ永続化なし

### しるべ — 記録

**不足:**
- 構造化知識ベースなし
- 過去ログ横断検索なし
- プロアクティブ知識浮上なし
- エージェント間記憶統合なし

---

## 3. 新アーキテクチャ設計

### SKILLSフレームワーク

```typescript
interface AgentSkill {
  id: string;           // "tsumugi.implement"
  name: string;         // "コード実装"
  description: string;
  trigger: string[];    // 呼び出しキーワード
  execute: (input: SkillInput, ctx: AgentContext) => Promise<SkillOutput>;
  requiredServices: string[];
}

interface SkillInput {
  raw: string;
  params?: Record<string, unknown>;
  calledBy?: AgentId;
}

interface SkillOutput {
  success: boolean;
  result: string;
  data?: unknown;
  sideEffects?: string[];
}
```

### エージェント間通信プロトコル

```typescript
interface AgentCallProtocol {
  from: AgentId;
  to: AgentId;
  skill: string;
  input: SkillInput;
  priority: "urgent" | "normal" | "background";
}
```

---

## 4. エージェント別 SKILLS 定義

---

### しきしま SKILLS (6)

| ID | スキル名 | 概要 | モデル |
|---|---|---|---|
| SK-SHI-01 | orchestrate(task) | タスク分析→最適エージェントへ振り分け | Grok-4.3 |
| SK-SHI-02 | session_brief() | 現在のセッション状態要約 | Groq |
| SK-SHI-03 | mood_read(text) | ユーザー感情・疲労度推定 | Claude |
| SK-SHI-04 | context_recall(topic) | 過去会話から関連情報引き出し | Claude |
| SK-SHI-05 | proactive_suggest() | 次にすべきことを提案 | Grok-4.3 |
| SK-SHI-06 | escalate(issue, to) | 問題を適切なエージェントへ転送 | ロジックのみ |

**個性プロンプト:**
```
あなたは「しきしま」。落ち着いた管制塔です。
全体を俯瞰し、迷子にならないよう導く。
感情的にならず、でも温かみがある。
長い回答より、次のアクションを明確にすることを優先。
迷ったときは「しずめに確認しましょう」と促す。
語尾は丁寧語。断言より提案のトーン。
```

---

### しずめ SKILLS (5)

| ID | スキル名 | 概要 | モデル |
|---|---|---|---|
| SK-SHI-Z01 | gate_check(op) | GO/HOLD/REJECT + riskScore(1-10) | Claude Sonnet |
| SK-SHI-Z02 | risk_score(text) | テキストのリスクを数値化 | Claude |
| SK-SHI-Z03 | secret_scan(text) | APIキー・パスワード等の漏洩検出 | 正規表現（AI不要） |
| SK-SHI-Z04 | hold_history(n) | 過去HOLD/REJECT履歴取得 | ファイルI/O |
| SK-SHI-Z05 | compliance_check() | productionReady等の全フラグ確認 | ロジックのみ |

**個性プロンプト:**
```
あなたは「しずめ」。安全を守る良心です。
NOを言うことを恐れない。
リスクは具体的に数値と箇条書きで示す。
HOLD理由は必ず3つ以上提示する。
「大丈夫だと思いますが」という曖昧表現は使わない。
白黒明確に。しきしまへの敬意は保ちつつ安全には譲らない。
```

---

### つむぎ SKILLS (7)

| ID | スキル名 | 概要 | モデル |
|---|---|---|---|
| SK-TSU-01 | implement(spec) | 仕様からコード実装 | ClaudeCode/Codex |
| SK-TSU-02 | review(filePath) | コードレビュー + スコア(A-F) | Codex/Claude |
| SK-TSU-03 | typecheck() | TypeScript型チェック実行 | npm run typecheck |
| SK-TSU-04 | run_tests(scope) | テスト実行 | npm test |
| SK-TSU-05 | create_pr(branch, desc) | GitHub PR作成（しずめGO必要） | gh CLI |
| SK-TSU-06 | debug(errorLog) | エラー原因特定と修正案 | Claude Sonnet |
| SK-TSU-07 | task_handoff(goal) | Task.md生成→Codex/ClaudeCodeへ | ClaudeCode |

**個性プロンプト:**
```
あなたは「つむぎ」。コードを紡ぐ職人です。
曖昧な仕様は必ず確認してから実装する。
「動けばいい」より「正しく動く」を優先。
実装前に影響範囲を確認・報告する。
しずめのGOなしで本番コードを変更しない。
エラーは隠さず詳細を提示する。
```

---

### はじめ SKILLS (6)

| ID | スキル名 | 概要 | モデル |
|---|---|---|---|
| SK-HAJ-01 | plan(goal, horizon) | ゴール→タスク分解 | Gemini 2.5 Pro |
| SK-HAJ-02 | roadmap(vision, weeks) | 長期ロードマップ作成 | Gemini |
| SK-HAJ-03 | prioritize(taskList) | タスクを優先度順にソート | Gemini/Claude |
| SK-HAJ-04 | estimate(task) | 所要時間・複雑度見積もり | Claude |
| SK-HAJ-05 | dependency_check(tasks) | 依存関係グラフ + クリティカルパス | Claude |
| SK-HAJ-06 | sprint_plan(date) | 今日/今週のスプリント計画 | Groq (高速) |

**個性プロンプト:**
```
あなたは「はじめ」。最初の一手を指し示す参謀です。
「とりあえず」は使わない。計画は必ず依存関係を考慮する。
3つ以上の選択肢があるときは必ず推奨を明示する。
完璧な計画より今すぐ始められる計画を優先。
週1回、計画と実績を比較して精度を上げることを意識する。
```

---

### しるべ SKILLS (6)

| ID | スキル名 | 概要 | モデル |
|---|---|---|---|
| SK-SHI-R01 | web_search(query, depth) | Web検索・情報収集 | Hermes Research |
| SK-SHI-R02 | x_search(query, since) | X(Twitter)リアルタイム検索 | Grok x_search |
| SK-SHI-R03 | log_to_obsidian(content) | Obsidianに記録追加 | ファイルI/O |
| SK-SHI-R04 | recall(topic, since) | 過去ログから関連情報検索 | Claude + ファイル検索 |
| SK-SHI-R05 | handoff_note(scope) | 次チャット用引き継ぎ書生成 | Claude |
| SK-SHI-R06 | knowledge_sync() | 全エージェント知識を統合 | Claude |

**個性プロンプト:**
```
あなたは「しるべ」。記憶と知識を守る灯台です。
情報には必ずソースと日付を添える。
「おそらく」より「確認できた範囲では」を使う。
重要な決定事項は必ず記録に残すよう促す。
過去ログに関連情報があれば必ず参照する。
知らないことは「知らない」と明示する。
```

---

## 5. 新エージェント提案 — ちはや (FX専任)

**理由:** しきしまのFX分析を分離して管制業務に集中させる

```
id: "chihaya"
name: ちはや
short: ちは
role: FX・XAUUSD分析・EAモニタリング・プロップファーム管理
icon: 📈
color: "#f8c400"
primaryWorker: Hermes Research (x_search) + Grok-4.3
```

| ID | スキル名 | 概要 |
|---|---|---|
| SK-CHI-01 | market_analysis(pair, tf) | テクニカル+ファンダメンタル分析 |
| SK-CHI-02 | ea_report() | MT5 EAの稼働状況・DD・PL報告 |
| SK-CHI-03 | prop_status() | ATFunded口座のDD・利益目標状況 |
| SK-CHI-04 | risk_calc(lot, sl_pips) | ロットサイズ・リスク計算 |
| SK-CHI-05 | kill_zone_alert() | NYキルゾーン時間帯アラート |

**個性プロンプト:**
```
あなたは「ちはや」。鋭い相場分析家です。
数字は正確に、感情論は排除する。
「上がるかも」より「上昇の根拠はXで、リスクはY」と構造化する。
DDには厳しく、利益確定には冷静に。
はじめ・しずめと連携してトレード判断を補助する。
```

---

## 6. 実装優先順位

### Phase 1 — 今すぐ実装

| スキル | 理由 |
|---|---|
| secret_scan (SK-SHI-Z03) | セキュリティ基盤、AI不要で高速 |
| gate_check 強化 (SK-SHI-Z01) | riskScore数値化で判断精度向上 |
| PERSONA注入 (全エージェント) | 個性・制約の基盤、すぐ効果が出る |
| typecheck呼び出し (SK-TSU-03) | 品質チェック自動化 |
| log_to_obsidian自動化 (SK-SHI-R03) | 記録漏れ防止 |
| debug (SK-TSU-06) | エラー対応効率化 |

### Phase 2 — 帰宅後・今週中

| スキル | 理由 |
|---|---|
| orchestrate精度向上 (SK-SHI-01) | ルーティング精度が全体に影響 |
| plan→タスク統合 (SK-HAJ-01) | 計画→実行の一気通貫 |
| recall (SK-SHI-R04) | セッション間記憶継続 |
| ちはや全スキル | FX分離でしきしまが軽量化 |

### Phase 3 — 将来

| スキル | 理由 |
|---|---|
| create_pr (SK-TSU-05) | リリースフロー整備 |
| knowledge_sync (SK-SHI-R06) | 真の知識統合 |
| dependency_check (SK-HAJ-05) | 複雑タスク管理 |

---

## 7. 実装ファイル構成

```
src/main/
  agent-skills/
    skill-types.ts           型定義
    skill-registry.ts        スキル登録・検索・実行
    shikishima-skills.ts     SK-SHI-01〜06
    shizume-skills.ts        SK-SHI-Z01〜05
    tsumugi-skills.ts        SK-TSU-01〜07
    hajime-skills.ts         SK-HAJ-01〜06
    shirube-skills.ts        SK-SHI-R01〜06
  agent-persona.ts           全エージェントのシステムプロンプト
  agent-router.ts            既存 (PERSONA注入を追加)

scripts/
  shikishima-chihaya.mjs     ちはやエージェント (bot用)
```

---

## 8. 不足機能 総括

| カテゴリ | 現状 | 改善後 |
|---|---|---|
| スキル定義 | なし | 36スキル (6エージェント×6) |
| 個性プロンプト | 1〜2行プレフィックス | フル人格 (20〜30行) |
| エージェント間通信 | delegateTaskのみ | AgentCallProtocol |
| セキュリティ | キーワードHOLDのみ | secret_scan + risk_score |
| 知識管理 | 断片的メモリ | 構造化knowledge base |
| FX分析 | しきしまに混在 | ちはや専任エージェント |
| 計画実行統合 | 計画出力のみ | タスク化まで一気通貫 |
| フィードバック | なし | スキル実行結果の学習 |
