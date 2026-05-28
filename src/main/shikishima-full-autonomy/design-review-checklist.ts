/**
 * Chapter 11 — design review checklist (automated assertions).
 */

export interface ChecklistItem {
  id: string;
  section: string;
  prompt: string;
  autoResult: "pass" | "hold" | "manual";
  note: string;
}

export interface DesignReviewInput {
  stackchanDeferred: boolean;
  phases2to10CodePresent: boolean;
  invariantsVerified: boolean;
  executionDisabled: boolean;
  voiceHermesBypassAbsent: boolean;
}

export function runDesignReviewChecklist(
  input: DesignReviewInput
): readonly ChecklistItem[] {
  return [
    {
      id: "11.1a",
      section: "ゴール定義",
      prompt: "完全自律の主語はしきしまか",
      autoResult: "pass",
      note: "master design §1"
    },
    {
      id: "11.1b",
      section: "ゴール定義",
      prompt: "StackChanは身体定義か",
      autoResult: input.stackchanDeferred ? "pass" : "manual",
      note: "deferred policy active"
    },
    {
      id: "11.2a",
      section: "Phase順序",
      prompt: "Phase1 DEFERREDで2-7先行",
      autoResult: input.stackchanDeferred ? "pass" : "hold",
      note: ""
    },
    {
      id: "11.2b",
      section: "Phase順序",
      prompt: "Phase7 planner-only",
      autoResult: input.phases2to10CodePresent ? "pass" : "hold",
      note: "secretary-planner-only.ts"
    },
    {
      id: "11.3a",
      section: "安全",
      prompt: "不変条件コード検証",
      autoResult: input.invariantsVerified ? "pass" : "hold",
      note: "autonomy-invariants.ts"
    },
    {
      id: "11.3b",
      section: "安全",
      prompt: "execution disabled",
      autoResult: input.executionDisabled ? "pass" : "hold",
      note: ""
    },
    {
      id: "11.4a",
      section: "実装一致",
      prompt: "Phase2-10コード存在",
      autoResult: input.phases2to10CodePresent ? "pass" : "hold",
      note: ""
    },
    {
      id: "11.4b",
      section: "実装一致",
      prompt: "音声Hermes非経由",
      autoResult: input.voiceHermesBypassAbsent ? "pass" : "hold",
      note: "architecture doc"
    },
    {
      id: "11.5a",
      section: "受け入れ",
      prompt: "FA PARTIALを精査で受理するか",
      autoResult: "manual",
      note: "human review"
    }
  ];
}

export function checklistAutoPassCount(items: readonly ChecklistItem[]): number {
  return items.filter((i) => i.autoResult === "pass").length;
}
