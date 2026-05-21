# Memory Candidate Spec

## 1. 目的

イツキシマが会話、作業ログ、Hermes変更レポートから「記憶すべき候補」を抽出し、長期記憶へ確定する前に分類・審査できるようにする。

この仕様はmemory DB実装ではない。memory DBの読み取り、書き込み、SQLite接続、既存memory機能への接続は行わない。

## 2. 記憶カテゴリ

### transient_memory

- 一時的な文脈。
- 自動候補化はよい。
- 長期保存しない。

### working_memory

- 現在作業中のタスク。
- 自動候補化はよい。
- 期限や作業文脈として扱う。

### project_memory

- プロジェクト方針。
- 実装状態。
- 設計決定。
- 候補化はよいが確定は確認付き。

### episode_memory

- 重要な出来事。
- 作業上の失敗/成功。
- 候補化はよいが確定は確認付き。

### long_term_profile

- ユーザーの好み。
- 価値観。
- 継続的傾向。
- 必ず承認必須。

### safety_policy_memory

- 禁止領域。
- 承認境界。
- 外部通信ルール。
- 自動売買禁止。
- MT5/EA隔離。
- AIが勝手に更新禁止。

### forbidden_memory

- APIキー。
- secrets。
- `.env` 内容。
- 個人情報の生データ。
- 取引履歴の詳細。
- 健康/金融/個人属性のセンシティブ情報。
- 保存禁止または拒否。

## 3. 戻り値

```ts
interface ExtractMemoryCandidatesResult {
  candidates: MemoryCandidate[];
  rejected: MemoryCandidate[];
  warnings: string[];
}
```

候補:

```ts
interface MemoryCandidate {
  id: string;
  category:
    | "transient_memory"
    | "working_memory"
    | "project_memory"
    | "episode_memory"
    | "long_term_profile"
    | "safety_policy_memory"
    | "forbidden_memory";
  text: string;
  reason: string;
  confidence: number;
  proposedAction:
    | "auto_candidate"
    | "requires_user_approval"
    | "reject"
    | "forbidden";
  requiresUserApproval: boolean;
  riskLevel: "low" | "medium" | "high";
  source:
    | "conversation"
    | "hermes_report"
    | "user_instruction"
    | "system_event";
  createdAt: string;
}
```

## 4. 必須ルール

1. `safety_policy_memory` は必ず `requiresUserApproval:true`。
2. `long_term_profile` は必ず `requiresUserApproval:true`。
3. `forbidden_memory` は `proposedAction:"forbidden"` または `reject`。
4. APIキー、secrets、`.env` 内容は保存候補にしない。
5. 「覚えておいて」と明示されても、安全ポリシーやセンシティブ情報は確認または拒否。
6. Memory Agentは候補を作るだけで、確定保存しない。
7. 自動更新してよいのは一時的な作業文脈候補まで。
8. 判断に迷う場合は `requiresUserApproval:true` または `reject` に倒す。

## 5. 初期実装

`extractMemoryCandidates` は最小分類ロジックである。

- 入力テキストを1候補として分類する。
- 秘密情報やセンシティブ情報を検出した場合は、本文を保存せず `[redacted forbidden memory]` として `rejected` に入れる。
- memory DBには接続しない。
- 自動保存しない。
