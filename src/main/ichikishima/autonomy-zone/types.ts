export type ZoneRiskReason =
  | "empty_root"
  | "project_root"
  | "outside_project_root"
  | "os_root"
  | "user_home"
  | "denied_path"
  | "invalid_path_input"
  | "path_resolution_failed";

export interface ZonePathPolicy {
  defaultRelativeRoot: string;
  envVarName: string;
  deniedSegments: readonly string[];
  deniedSegmentPrefixes: readonly string[];
  deniedSegmentSuffixes: readonly string[];
  deniedSubstrings: readonly string[];
}

export type DenyReasonCode =
  | "denied_segment"
  | "denied_segment_prefix"
  | "denied_segment_suffix"
  | "denied_substring";

export type DenylistResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      reason: string;
      reasonCode: DenyReasonCode;
      matchedRule: string;
    };

export type PathGuardReasonCode =
  | "invalid_path_input"
  | "outside_zone"
  | "path_resolution_failed";

export interface ZonePathCheckInput {
  zoneRoot: string;
  targetPath: string;
  basePath?: string;
}

export type ZonePathCheckResult =
  | {
      ok: true;
      normalizedPath: string;
      realPath: string;
      relativePath: string;
      inZone: true;
    }
  | {
      ok: false;
      reason: string;
      reasonCode: PathGuardReasonCode;
      normalizedPath?: string;
      realPath?: string;
    };

export type PathGuardResult = ZonePathCheckResult;

export type ReadPermissionReasonCode =
  | "DENIED_BY_PATH_GUARD"
  | "DENIED_BY_DENYLIST";

export interface ReadPermissionCheckInput {
  zoneRoot: string;
  targetPath: string;
  basePath?: string;
  policy?: Partial<ZonePathPolicy>;
}

export type ReadPermissionCheckResult =
  | {
      ok: true;
      normalizedPath: string;
      realPath: string;
      relativePath: string;
      reasonCode: null;
      reason: null;
    }
  | {
      ok: false;
      normalizedPath?: string;
      realPath?: string;
      relativePath?: string;
      reasonCode: ReadPermissionReasonCode;
      reason: string;
      matchedRule?: string;
    };

export type ReadEncoding = "utf8";

export type ReadFailureReasonCode =
  | "NOT_IMPLEMENTED"
  | "DENIED_BY_PATH_GUARD"
  | "DENIED_BY_DENYLIST"
  | "INVALID_READ_OPTIONS"
  | "FILE_NOT_FOUND"
  | "TARGET_IS_DIRECTORY"
  | "FILE_TOO_LARGE"
  | "BINARY_NOT_ALLOWED"
  | "READ_FAILED";

export interface ReadZoneFileInput {
  zoneRoot: string;
  requestedPath: string;
  encoding?: ReadEncoding;
  maxBytes?: number;
  allowBinary?: boolean;
  requestId?: string;
  actor: "hermes" | "ichikishima" | "user" | "system";
}

export interface ReadZoneFileSuccess {
  ok: true;
  normalizedPath: string;
  content: string;
  bytesRead: number;
  truncated: boolean;
  auditEventCandidate: ReadAuditEventCandidate;
}

export interface ReadZoneFileFailure {
  ok: false;
  normalizedPath?: string;
  reasonCode: ReadFailureReasonCode;
  reason: string;
  content: null;
  auditEventCandidate: ReadAuditEventCandidate;
}

export type ReadZoneFileResult = ReadZoneFileSuccess | ReadZoneFileFailure;

export interface ReadAuditEventCandidate {
  eventId?: string;
  requestId?: string;
  actor: ReadZoneFileInput["actor"];
  action: "read";
  status: "success" | "denied" | "error";
  normalizedPath?: string;
  maskedPath?: string;
  reasonCode?: ReadFailureReasonCode;
  reason?: string;
  bytesRead?: number;
  truncated?: boolean;
  contentIncluded: false;
  timestamp: string;
}

export type WritePermissionReasonCode =
  | "DENIED_BY_PATH_GUARD"
  | "DENIED_BY_DENYLIST"
  | "INVALID_WRITE_OPTIONS"
  | "FILE_ALREADY_EXISTS"
  | "PARENT_DIRECTORY_MISSING"
  | "TARGET_IS_DIRECTORY"
  | "FILE_TOO_LARGE";

export interface WritePermissionCheckInput {
  zoneRoot: string;
  targetPath: string;
  contentBytes?: number;
  maxBytes?: number;
  overwrite?: boolean;
  createDirs?: boolean;
  basePath?: string;
  policy?: Partial<ZonePathPolicy>;
}

export type WritePermissionCheckResult =
  | {
      ok: true;
      normalizedPath: string;
      realPath: string;
      relativePath: string;
      reasonCode: null;
      reason: null;
      overwrite: boolean;
      createDirs: boolean;
    }
  | {
      ok: false;
      normalizedPath?: string;
      realPath?: string;
      relativePath?: string;
      reasonCode: WritePermissionReasonCode;
      reason: string;
      matchedRule?: string;
    };

export type WriteEncoding = "utf8";

export type WriteFailureReasonCode =
  | "NOT_IMPLEMENTED"
  | "DENIED_BY_PATH_GUARD"
  | "DENIED_BY_DENYLIST"
  | "INVALID_WRITE_OPTIONS"
  | "FILE_ALREADY_EXISTS"
  | "PARENT_DIRECTORY_MISSING"
  | "TARGET_IS_DIRECTORY"
  | "FILE_TOO_LARGE"
  | "WRITE_FAILED";

export interface WriteZoneFileInput {
  zoneRoot: string;
  requestedPath: string;
  content: string;
  encoding?: WriteEncoding;
  maxBytes?: number;
  overwrite?: boolean;
  createDirs?: boolean;
  requestId?: string;
  actor: "hermes" | "ichikishima" | "user" | "system";
}

export interface WriteZoneFileSuccess {
  ok: true;
  normalizedPath: string;
  bytesWritten: number;
  created: boolean;
  overwritten: boolean;
  auditEventCandidate: WriteAuditEventCandidate;
}

export interface WriteZoneFileFailure {
  ok: false;
  normalizedPath?: string;
  reasonCode: WriteFailureReasonCode;
  reason: string;
  bytesWritten: 0;
  auditEventCandidate: WriteAuditEventCandidate;
}

export type WriteZoneFileResult = WriteZoneFileSuccess | WriteZoneFileFailure;

export interface WriteAuditEventCandidate {
  eventId?: string;
  requestId?: string;
  actor: WriteZoneFileInput["actor"];
  action: "write";
  status: "success" | "denied" | "error";
  normalizedPath?: string;
  maskedPath?: string;
  reasonCode?: WriteFailureReasonCode;
  reason?: string;
  bytesWritten?: number;
  created?: boolean;
  overwritten?: boolean;
  contentIncluded: false;
  timestamp: string;
}

export type ApprovalActionType = "delete" | "execute" | "network" | "git";

export type ApprovalRiskLevel = "low" | "medium" | "high" | "critical";

export interface ApprovalRequestInput {
  requestId?: string;
  actionType: ApprovalActionType;
  actor: "hermes" | "ichikishima" | "user" | "system";
  targetPaths?: readonly string[];
  commands?: readonly string[];
  externalUrls?: readonly string[];
  riskLevel: ApprovalRiskLevel;
  reason: string;
  expectedResult: string;
  rollbackPlan: string;
  testPlan: string;
  requiresUserApproval?: true;
}

export interface ApprovalRequest {
  requestId?: string;
  actionType: ApprovalActionType;
  actor: ApprovalRequestInput["actor"];
  targetPaths: string[];
  commands: string[];
  externalUrls: string[];
  riskLevel: ApprovalRiskLevel;
  reason: string;
  expectedResult: string;
  rollbackPlan: string;
  testPlan: string;
  requiresUserApproval: true;
  createdAt: string;
}

export type DeleteFailureReasonCode =
  | "DELETE_REQUIRES_APPROVAL"
  | "DENIED_BY_PATH_GUARD"
  | "DENIED_BY_DENYLIST";

export interface DeleteZoneFileInput {
  zoneRoot: string;
  requestedPath: string;
  requestId?: string;
  actor: "hermes" | "ichikishima" | "user" | "system";
  policy?: Partial<ZonePathPolicy>;
}

export interface DeleteAuditEventCandidate {
  eventId?: string;
  requestId?: string;
  actor: DeleteZoneFileInput["actor"];
  action: "delete";
  status: "denied" | "error";
  normalizedPath?: string;
  maskedPath?: string;
  reasonCode: DeleteFailureReasonCode;
  reason: string;
  deleted: false;
  contentIncluded: false;
  timestamp: string;
}

export interface DeleteZoneFileResult {
  ok: false;
  normalizedPath?: string;
  reasonCode: DeleteFailureReasonCode;
  reason: string;
  deleted: false;
  auditEventCandidate: DeleteAuditEventCandidate;
  approvalRequestCandidate?: ApprovalRequest;
}

export type BlockedOperationReasonCode =
  | "EXECUTE_REQUIRES_APPROVAL"
  | "NETWORK_REQUIRES_APPROVAL"
  | "GIT_REQUIRES_APPROVAL";

export interface ExecuteCommandInput {
  command: string;
  args?: readonly string[];
  cwd?: string;
  requestId?: string;
  actor: "hermes" | "ichikishima" | "user" | "system";
  reason?: string;
}

export interface NetworkAccessInput {
  url: string;
  method?: string;
  requestId?: string;
  actor: "hermes" | "ichikishima" | "user" | "system";
  reason?: string;
}

export interface GitOperationInput {
  operation: string;
  args?: readonly string[];
  repositoryPath?: string;
  requestId?: string;
  actor: "hermes" | "ichikishima" | "user" | "system";
  reason?: string;
}

export interface BlockedOperationAuditEventCandidate {
  eventId?: string;
  requestId?: string;
  actor: ExecuteCommandInput["actor"];
  action: "execute" | "network" | "git";
  status: "denied";
  reasonCode: BlockedOperationReasonCode;
  reason: string;
  contentIncluded: false;
  timestamp: string;
}

export interface BlockedOperationResult {
  ok: false;
  reasonCode: BlockedOperationReasonCode;
  reason: string;
  executed: false;
  auditEventCandidate: BlockedOperationAuditEventCandidate;
  approvalRequestCandidate: ApprovalRequest;
}

export interface ZoneConfig {
  projectRoot: string;
  root: string;
  source: "configured" | "env" | "default";
}

export type ZoneValidationResult =
  | {
      ok: true;
      config: ZoneConfig;
      normalizedRoot: string;
    }
  | {
      ok: false;
      reason: string;
      reasonCode: ZoneRiskReason;
      normalizedRoot?: string;
      matchedRule?: string;
    };

export interface ResolveZoneConfigOptions {
  projectRoot: string;
  configuredRoot?: string | null;
  env?: NodeJS.ProcessEnv;
  policy?: Partial<ZonePathPolicy>;
}
