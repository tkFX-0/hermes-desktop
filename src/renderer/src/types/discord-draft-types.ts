// DIS-02: Discord draft response types
// Local-only. No Discord write. DIS-03 GO required to send.

export type Dis02Classification = "GO" | "HOLD" | "DEFER";

export interface Dis02Draft {
  readonly messageId: string;
  readonly authorName: string;
  readonly contentPreview: string;
  readonly timestamp: string;
  readonly userRequestSummary: string;
  readonly shikishimaResponseDraft: string;
  readonly classification: Dis02Classification;
  readonly level5Detected: boolean;
  readonly level5Description: string;
  readonly requiredHumanConfirmation: readonly string[];
  readonly forbiddenActionsDetected: boolean;
  readonly nextGate: string;
}

export interface Dis02Session {
  readonly sessionId: string;
  readonly createdAt: string;
  readonly sourceChannel: string;
  readonly drafts: readonly Dis02Draft[];
  readonly localOnly: true;
  readonly discordWritePerformed: false;
}
