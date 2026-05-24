import {
  addForbiddenPhraseCorrection,
  createDefaultProfilePolicy,
  type ProfilePolicy,
} from "./profile-policy";

export interface ProfileCorrectionCommand {
  phrase: string;
  reason: string;
  scope: "all_paths" | "stackchan_only" | "discord_only" | "fx_only";
  createdAt: string;
}

export interface ProfileCorrectionStore {
  policy: ProfilePolicy;
  corrections: readonly ProfileCorrectionCommand[];
}

export function createProfileCorrectionStore(
  basePolicy: ProfilePolicy = createDefaultProfilePolicy(),
): ProfileCorrectionStore {
  return {
    policy: basePolicy,
    corrections: [],
  };
}

export function applyProfileCorrection(
  store: ProfileCorrectionStore,
  command: ProfileCorrectionCommand,
): ProfileCorrectionStore {
  const nextPolicy = addForbiddenPhraseCorrection(
    store.policy,
    command.phrase,
    `${command.scope}: ${command.reason}`,
    command.createdAt,
  );

  return {
    policy: nextPolicy,
    corrections: [...store.corrections, command],
  };
}
