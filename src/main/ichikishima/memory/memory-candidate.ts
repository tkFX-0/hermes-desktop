export type MemoryCandidateCategory =
  | "transient_memory"
  | "working_memory"
  | "project_memory"
  | "episode_memory"
  | "long_term_profile"
  | "safety_policy_memory"
  | "forbidden_memory";

export type MemoryCandidateAction =
  | "auto_candidate"
  | "requires_user_approval"
  | "reject"
  | "forbidden";

export type MemoryCandidateRiskLevel = "low" | "medium" | "high";

export type MemoryCandidateSource =
  | "conversation"
  | "hermes_report"
  | "user_instruction"
  | "system_event";

export interface ExtractMemoryCandidatesInput {
  text: string;
  source: MemoryCandidateSource;
  createdAt?: string;
  confidenceHint?: number;
}

export interface MemoryCandidate {
  id: string;
  category: MemoryCandidateCategory;
  text: string;
  reason: string;
  confidence: number;
  proposedAction: MemoryCandidateAction;
  requiresUserApproval: boolean;
  riskLevel: MemoryCandidateRiskLevel;
  source: MemoryCandidateSource;
  createdAt: string;
}

export interface ExtractMemoryCandidatesResult {
  candidates: MemoryCandidate[];
  rejected: MemoryCandidate[];
  warnings: string[];
}

interface ClassificationRule {
  category: MemoryCandidateCategory;
  terms: string[];
  reason: string;
  confidence: number;
}

const forbiddenTerms = [
  ".env",
  "apiキー",
  "api key",
  "apikey",
  "secrets",
  "secret",
  "token",
  "取引履歴",
  "個人情報の生データ",
  "口座番号",
  "秘密鍵",
];

const safetyPolicyTerms = [
  "禁止領域",
  "承認境界",
  "外部通信ルール",
  "自動売買禁止",
  "MT5/EA隔離",
  "MT5隔離",
  "EA隔離",
  "安全ポリシー",
  "git push禁止",
];

const classificationRules: ClassificationRule[] = [
  {
    category: "working_memory",
    terms: ["現在作業中", "作業中", "次は", "todo", "タスク", "期限"],
    reason: "現在の作業文脈として扱えるため",
    confidence: 0.72,
  },
  {
    category: "project_memory",
    terms: [
      "プロジェクト方針",
      "設計決定",
      "実装状態",
      "Hermes変更レポート",
      "READY_FOR_LOCAL_PILOT",
      "SHADOW_MODE_READY",
    ],
    reason: "プロジェクトの方針または実装状態に関係するため",
    confidence: 0.78,
  },
  {
    category: "episode_memory",
    terms: ["失敗", "成功", "学び", "振り返り", "重要な出来事"],
    reason: "作業上の重要な出来事として扱えるため",
    confidence: 0.68,
  },
  {
    category: "long_term_profile",
    terms: ["好み", "好き", "嫌い", "価値観", "作業スタイル", "いつも"],
    reason: "ユーザーの長期的傾向に関係する可能性があるため",
    confidence: 0.7,
  },
  {
    category: "transient_memory",
    terms: ["今だけ", "一時的", "直近", "今見ている", "この会話"],
    reason: "一時的な文脈として扱えるため",
    confidence: 0.66,
  },
];

function includesAny(text: string, terms: string[]): boolean {
  const lowerText = text.toLowerCase();
  return terms.some((term) => lowerText.includes(term.toLowerCase()));
}

function clampConfidence(value: number | undefined, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.min(1, value));
}

function makeCandidate(
  input: ExtractMemoryCandidatesInput,
  params: Omit<MemoryCandidate, "id" | "source" | "createdAt">,
  index: number,
): MemoryCandidate {
  return {
    id: `memcand_${index + 1}`,
    source: input.source,
    createdAt: input.createdAt ?? new Date().toISOString(),
    ...params,
  };
}

function actionForCategory(
  category: MemoryCandidateCategory,
  confidence: number,
): Pick<
  MemoryCandidate,
  "proposedAction" | "requiresUserApproval" | "riskLevel"
> {
  if (category === "forbidden_memory") {
    return {
      proposedAction: "forbidden",
      requiresUserApproval: true,
      riskLevel: "high",
    };
  }

  if (category === "safety_policy_memory" || category === "long_term_profile") {
    return {
      proposedAction: "requires_user_approval",
      requiresUserApproval: true,
      riskLevel: category === "safety_policy_memory" ? "high" : "medium",
    };
  }

  if (confidence < 0.6) {
    return {
      proposedAction: "requires_user_approval",
      requiresUserApproval: true,
      riskLevel: "medium",
    };
  }

  if (category === "project_memory" || category === "episode_memory") {
    return {
      proposedAction: "requires_user_approval",
      requiresUserApproval: true,
      riskLevel: "medium",
    };
  }

  return {
    proposedAction: "auto_candidate",
    requiresUserApproval: false,
    riskLevel: "low",
  };
}

function classifyText(input: ExtractMemoryCandidatesInput): ClassificationRule {
  if (includesAny(input.text, safetyPolicyTerms)) {
    return {
      category: "safety_policy_memory",
      terms: safetyPolicyTerms,
      reason: "安全ポリシーまたは承認境界に関係するため",
      confidence: 0.86,
    };
  }

  return (
    classificationRules.find((rule) => includesAny(input.text, rule.terms)) ?? {
      category: "project_memory",
      terms: [],
      reason: "明確な分類が難しいため、確認付きプロジェクト記憶候補として扱う",
      confidence: 0.45,
    }
  );
}

export function extractMemoryCandidates(
  input: ExtractMemoryCandidatesInput,
): ExtractMemoryCandidatesResult {
  const warnings: string[] = [
    "Memory Agent only creates candidates; it does not persist memory.",
  ];

  if (input.text.trim().length === 0) {
    return {
      candidates: [],
      rejected: [],
      warnings: [...warnings, "Input text is empty."],
    };
  }

  if (includesAny(input.text, forbiddenTerms)) {
    const confidence = clampConfidence(input.confidenceHint, 0.95);
    const rejected = makeCandidate(
      input,
      {
        category: "forbidden_memory",
        text: "[redacted forbidden memory]",
        reason: "秘密情報またはセンシティブ情報を含むため保存候補にしません",
        confidence,
        ...actionForCategory("forbidden_memory", confidence),
      },
      0,
    );

    return {
      candidates: [],
      rejected: [rejected],
      warnings: [
        ...warnings,
        "Forbidden memory was rejected and redacted from candidate text.",
      ],
    };
  }

  const rule = classifyText(input);
  const confidence = clampConfidence(input.confidenceHint, rule.confidence);
  const candidate = makeCandidate(
    input,
    {
      category: rule.category,
      text: input.text.trim(),
      reason: rule.reason,
      confidence,
      ...actionForCategory(rule.category, confidence),
    },
    0,
  );

  return {
    candidates: [candidate],
    rejected: [],
    warnings,
  };
}
