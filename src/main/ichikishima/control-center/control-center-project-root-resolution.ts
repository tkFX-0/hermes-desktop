/**
 * Control Center — projectRoot / zoneRoot / snapshot source の解決（read-only）。
 * packaged 実起動・ファイル作成・外部通信は行わない。
 */
import { existsSync } from "node:fs";
import { join } from "node:path";

import type { App } from "electron";

import {
  isInsidePath,
  resolveExistingPath,
  validatePathInput,
} from "../autonomy-zone/path-guard";

/** Main プロセスが観測する Electron ランタイム区分。 */
export type ControlCenterRuntimeMode =
  | "electron_development"
  | "electron_packaged_pending";

/**
 * Renderer / Snapshot に載せるソースラベル（短文キー）。
 * 本番 READY や検証済みを意味しない。
 */
export type ControlCenterSnapshotSourceLabel =
  | "development_snapshot_dev_only_source"
  | "packaged_snapshot_path_resolution_pending";

/** パス解決の論理状態（絶対パス文字列は含めない）。 */
export type ControlCenterPathResolutionStatus =
  | "dev_repo_layout_ok"
  | "dev_repo_layout_marker_missing"
  | "packaged_unverified_fallback_layout"
  | "zone_outside_project_warning";

export interface ControlCenterElectronPathHints {
  readonly isPackaged: boolean;
  /** `app.getAppPath()` — 候補のみ、単独では projectRoot に昇格しない */
  readonly appPath?: string;
  /** `process.resourcesPath` — 候補のみ */
  readonly resourcesPath?: string;
  /** `app.getPath("userData")` — 候補・ログ永続は別設計。projectRoot には使わない */
  readonly userDataPath?: string;
}

export interface ControlCenterPathResolutionInput {
  /** main バンドルの `__dirname`（例: `out/main`） */
  readonly mainProcessDirname: string;
  readonly sandboxSegments: readonly string[];
  readonly electron?: ControlCenterElectronPathHints;
  /**
   * テスト専用: projectRoot 決定後に zone を意図的に project 外へずらす（警告分岐の検証）
   */
  readonly testOnlyExternalZoneRoot?: string;
}

/** IPC / Renderer 向け。絶対パス・env・secrets を含めない。 */
export interface ControlCenterPathResolutionRendererSafe {
  readonly runtimeMode: ControlCenterRuntimeMode;
  readonly snapshotSourceLabel: ControlCenterSnapshotSourceLabel;
  readonly pathResolutionStatus: ControlCenterPathResolutionStatus;
  readonly pendingPackagingResolution: boolean;
  readonly safeSummaryLines: readonly string[];
}

export interface ControlCenterPathResolutionMainResult {
  readonly projectRootForProviders: string;
  readonly zoneRootForProviders: string;
  readonly rendererSafe: ControlCenterPathResolutionRendererSafe;
}

const ICHI_DOC_MARK = join("archive", "ichikishima");

function hasRepoMarker(projectRoot: string): boolean {
  try {
    const marker = join(projectRoot, ICHI_DOC_MARK);
    return existsSync(marker);
  } catch {
    return false;
  }
}

/**
 * packaged 時に「docs が見える」ルートを軽く探索。見つからなければフォールバック。
 * resourcesPath / userData は projectRoot に採用しない（候補スキャンのみ）。
 */
function pickPackagedProjectRootCandidate(
  mainProcessDirname: string,
  hints: ControlCenterElectronPathHints | undefined,
): string {
  const fall = join(mainProcessDirname, "../..");
  const candidates: string[] = [fall];
  if (hints?.appPath) {
    candidates.push(join(hints.appPath, ".."));
    candidates.push(hints.appPath);
  }
  if (hints?.resourcesPath) {
    candidates.push(hints.resourcesPath);
    candidates.push(join(hints.resourcesPath, "app"));
  }
  for (const c of candidates) {
    try {
      if (validatePathInput(c, "candidateRoot") !== undefined) continue;
      const r = resolveExistingPath(c);
      if (hasRepoMarker(r)) return r;
    } catch {
      /* next */
    }
  }
  return resolveExistingPath(fall);
}

function buildRendererSafe(params: {
  runtimeMode: ControlCenterRuntimeMode;
  status: ControlCenterPathResolutionStatus;
  pendingPackagingResolution: boolean;
  markerFound: boolean;
  zoneCoercionOccurred: boolean;
}): ControlCenterPathResolutionRendererSafe {
  const snapshotSourceLabel: ControlCenterSnapshotSourceLabel =
    params.runtimeMode === "electron_development"
      ? "development_snapshot_dev_only_source"
      : "packaged_snapshot_path_resolution_pending";

  const lines: string[] = [];
  if (params.runtimeMode === "electron_development") {
    lines.push("Development snapshot / dev-only source.");
    lines.push("Packaged path resolution: not applicable in dev layout.");
  } else {
    lines.push(
      "Packaged path resolution pending (not verified in this build).",
    );
    lines.push(
      "Using fallback layout; snapshot data may not match a dev checkout.",
    );
  }
  if (!params.markerFound) {
    lines.push(
      "Repo marker (archive/ichikishima) not found at resolved project root.",
    );
  }
  if (params.zoneCoercionOccurred) {
    lines.push(
      "Zone root was outside project; coerced to sandbox under projectRoot.",
    );
  }
  lines.push("productionReady:false — not production verified.");

  return {
    runtimeMode: params.runtimeMode,
    snapshotSourceLabel,
    pathResolutionStatus: params.status,
    pendingPackagingResolution: params.pendingPackagingResolution,
    safeSummaryLines: lines,
  };
}

export function resolveControlCenterProjectRoot(
  input: ControlCenterPathResolutionInput,
): string {
  const devDefault = resolveExistingPath(
    join(input.mainProcessDirname, "../.."),
  );
  if (!input.electron?.isPackaged) {
    return devDefault;
  }
  return pickPackagedProjectRootCandidate(
    input.mainProcessDirname,
    input.electron,
  );
}

export function resolveControlCenterZoneRoot(
  projectRootAbsolute: string,
  sandboxSegments: readonly string[],
): string {
  return resolveExistingPath(join(projectRootAbsolute, ...sandboxSegments));
}

/**
 * zone が project 外の場合は canonical sandbox に矯正し、warning 状態にする。
 */
export function resolveControlCenterPathResolution(
  input: ControlCenterPathResolutionInput,
): ControlCenterPathResolutionMainResult {
  const projectRootForProviders = resolveControlCenterProjectRoot(input);
  let zoneRootForProviders = resolveControlCenterZoneRoot(
    projectRootForProviders,
    input.sandboxSegments,
  );

  let zoneInside = false;
  try {
    const p = resolveExistingPath(projectRootForProviders);
    const z = resolveExistingPath(zoneRootForProviders);
    zoneInside = isInsidePath(z, p);
  } catch {
    zoneInside = false;
  }

  if (input.testOnlyExternalZoneRoot) {
    zoneRootForProviders = resolveExistingPath(input.testOnlyExternalZoneRoot);
    try {
      const p = resolveExistingPath(projectRootForProviders);
      const z = resolveExistingPath(zoneRootForProviders);
      zoneInside = isInsidePath(z, p);
    } catch {
      zoneInside = false;
    }
  }

  let zoneCoercionOccurred = false;
  if (!zoneInside) {
    zoneCoercionOccurred = true;
    zoneRootForProviders = resolveControlCenterZoneRoot(
      projectRootForProviders,
      input.sandboxSegments,
    );
  }

  const packaged = input.electron?.isPackaged === true;
  const runtimeMode: ControlCenterRuntimeMode = packaged
    ? "electron_packaged_pending"
    : "electron_development";

  const markerFound = hasRepoMarker(projectRootForProviders);

  let status: ControlCenterPathResolutionStatus;
  if (zoneCoercionOccurred) {
    status = "zone_outside_project_warning";
  } else if (packaged) {
    status = "packaged_unverified_fallback_layout";
  } else if (markerFound) {
    status = "dev_repo_layout_ok";
  } else {
    status = "dev_repo_layout_marker_missing";
  }

  const rendererSafe = buildRendererSafe({
    runtimeMode,
    status,
    pendingPackagingResolution: packaged,
    markerFound,
    zoneCoercionOccurred,
  });

  return {
    projectRootForProviders,
    zoneRootForProviders,
    rendererSafe,
  };
}

/** Electron `app` から hints を組み立て（main のみ呼ぶ）。 */
export function controlCenterElectronHintsFromApp(
  appLike: Pick<App, "isPackaged" | "getAppPath" | "getPath">,
): ControlCenterElectronPathHints {
  let appPath: string | undefined;
  let userDataPath: string | undefined;
  try {
    appPath = appLike.getAppPath();
  } catch {
    appPath = undefined;
  }
  try {
    userDataPath = appLike.getPath("userData");
  } catch {
    userDataPath = undefined;
  }
  return {
    isPackaged: appLike.isPackaged,
    appPath,
    resourcesPath: process.resourcesPath,
    userDataPath,
  };
}

export function summarizeControlCenterPathResolution(
  result: ControlCenterPathResolutionMainResult,
): readonly string[] {
  return [...result.rendererSafe.safeSummaryLines];
}

export function sanitizeControlCenterPathResolutionForRenderer(
  result: ControlCenterPathResolutionMainResult,
): ControlCenterPathResolutionRendererSafe {
  return result.rendererSafe;
}

/**
 * テスト・診断用: zone が project 外かどうか（絶対パスを受け取る）。
 */
export function evaluateZoneRelativeToProject(
  projectRootAbsolute: string,
  zoneRootAbsolute: string,
): { readonly ok: boolean; readonly code: string } {
  try {
    const pBad = validatePathInput(projectRootAbsolute, "projectRoot");
    if (pBad !== undefined) return { ok: false, code: "invalid_project_root" };
    const zBad = validatePathInput(zoneRootAbsolute, "zoneRoot");
    if (zBad !== undefined) return { ok: false, code: "invalid_zone_root" };
    const pr = resolveExistingPath(projectRootAbsolute);
    const zr = resolveExistingPath(zoneRootAbsolute);
    return isInsidePath(zr, pr)
      ? { ok: true, code: "zone_inside_project" }
      : { ok: false, code: "zone_outside_project" };
  } catch {
    return { ok: false, code: "path_resolution_error" };
  }
}

export function resolveControlCenterSnapshotSource(
  result: ControlCenterPathResolutionMainResult,
): ControlCenterSnapshotSourceLabel {
  return result.rendererSafe.snapshotSourceLabel;
}

export interface PathResolutionBareParamsFallback {
  readonly projectRoot: string;
  readonly zoneRoot: string;
  readonly assumePackagedMode?: boolean;
}

/**
 * Renderer へ渡す `pathResolution*` を明示注入できないときの後方互換導線（絶対パスは返さない）。
 */
export function derivePathResolutionFallback(
  bare: PathResolutionBareParamsFallback,
): ControlCenterPathResolutionRendererSafe {
  const packaged = bare.assumePackagedMode === true;
  const markerFound = hasRepoMarker(bare.projectRoot);
  const zoneEv = evaluateZoneRelativeToProject(bare.projectRoot, bare.zoneRoot);
  const violated = !zoneEv.ok && zoneEv.code === "zone_outside_project";
  let status: ControlCenterPathResolutionStatus;
  if (violated) {
    status = "zone_outside_project_warning";
  } else if (packaged) {
    status = "packaged_unverified_fallback_layout";
  } else if (markerFound) {
    status = "dev_repo_layout_ok";
  } else {
    status = "dev_repo_layout_marker_missing";
  }
  const runtimeMode: ControlCenterRuntimeMode = packaged
    ? "electron_packaged_pending"
    : "electron_development";

  return buildRendererSafe({
    runtimeMode,
    status,
    pendingPackagingResolution: packaged,
    markerFound,
    zoneCoercionOccurred: violated,
  });
}
