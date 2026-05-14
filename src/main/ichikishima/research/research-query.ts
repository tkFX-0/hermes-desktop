export type ResearchQueryKind =
  | "document_lookup"
  | "path_inventory"
  | "codebase_scan"
  | "config_review";

export interface ResearchQuery {
  kind: ResearchQueryKind;
  subject: string;
  maxResults?: number;
}

export interface ResearchResult {
  kind: ResearchQueryKind;
  subject: string;
  findings: string[];
  riskFlags: string[];
  requiresUserReview: true;
}

const RISK_KEYWORDS = [
  "secret",
  "password",
  "token",
  "api_key",
  "credential",
  ".env",
  "private",
];

export function processResearchQuery(query: ResearchQuery): ResearchResult {
  const riskFlags: string[] = [];

  const subjectLower = query.subject.toLowerCase();
  for (const kw of RISK_KEYWORDS) {
    if (subjectLower.includes(kw)) {
      riskFlags.push(`sensitive_keyword_in_subject: ${kw}`);
    }
  }

  return {
    kind: query.kind,
    subject: query.subject,
    findings: [],
    riskFlags,
    requiresUserReview: true,
  };
}
