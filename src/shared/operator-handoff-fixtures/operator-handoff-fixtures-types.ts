import type { OperatorHandoffAssemblyInput } from "../operator-handoff-assembly/operator-handoff-assembly-types";
import type { OperatorHandoffAssemblyResult } from "../operator-handoff-assembly/operator-handoff-assembly-types";

export type OperatorHandoffFixtureProfile = "PASS" | "PASS_WITH_CAVEAT" | "HOLD" | "BLOCKED";

export type OperatorHandoffFixtureEntry = {
  profile: OperatorHandoffFixtureProfile;
  input: OperatorHandoffAssemblyInput;
  result: OperatorHandoffAssemblyResult;
};

export type OperatorHandoffFixtureRegistry = {
  pass: OperatorHandoffFixtureEntry;
  passWithCaveat: OperatorHandoffFixtureEntry;
  hold: OperatorHandoffFixtureEntry;
  blocked: OperatorHandoffFixtureEntry;
};
