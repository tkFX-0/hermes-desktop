import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { buildControlCenterAppSnapshot } from "../../../src/main/ichikishima/control-center/control-center-app-snapshot";
import {
  controlCenterElectronHintsFromApp,
  derivePathResolutionFallback,
  evaluateZoneRelativeToProject,
  resolveControlCenterPathResolution,
  resolveControlCenterSnapshotSource,
} from "../../../src/main/ichikishima/control-center/control-center-project-root-resolution";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

describe("control-center-project-root-resolution", () => {
  const mainDir = path.join(projectRoot, "src", "main");
  const zoneOk = path.join(projectRoot, "sandbox", "hermes-autonomy-zone");

  it("dev mode resolves projectRoot via mainProcessDirname heuristic", () => {
    const r = resolveControlCenterPathResolution({
      mainProcessDirname: mainDir,
      sandboxSegments: ["sandbox", "hermes-autonomy-zone"],
      electron: { isPackaged: false },
    });
    expect(path.normalize(r.projectRootForProviders)).toBe(
      path.normalize(projectRoot),
    );
    expect(r.rendererSafe.pendingPackagingResolution).toBe(false);
    expect(r.rendererSafe.runtimeMode).toBe("electron_development");
  });

  it("packaged-like mode sets pending and packaged label", () => {
    const r = resolveControlCenterPathResolution({
      mainProcessDirname: mainDir,
      sandboxSegments: ["sandbox", "hermes-autonomy-zone"],
      electron: {
        isPackaged: true,
        appPath: path.join(mainDir, "index.js"),
        resourcesPath: undefined,
        userDataPath: undefined,
      },
    });
    expect(r.rendererSafe.pendingPackagingResolution).toBe(true);
    expect(r.rendererSafe.snapshotSourceLabel).toBe(
      "packaged_snapshot_path_resolution_pending",
    );
    expect(resolveControlCenterSnapshotSource(r)).toBe(
      "packaged_snapshot_path_resolution_pending",
    );
  });

  it("warns on external zone root and coerces zone", () => {
    const external = path.resolve(projectRoot, "..", "outside-zone");
    const r = resolveControlCenterPathResolution({
      mainProcessDirname: mainDir,
      sandboxSegments: ["sandbox", "hermes-autonomy-zone"],
      electron: { isPackaged: false },
      testOnlyExternalZoneRoot: external,
    });
    expect(r.rendererSafe.pathResolutionStatus).toBe(
      "zone_outside_project_warning",
    );
    expect(r.zoneRootForProviders.replace(/\\/g, "/")).toContain(
      "sandbox/hermes-autonomy-zone",
    );
    expect(
      evaluateZoneRelativeToProject(
        r.projectRootForProviders,
        r.zoneRootForProviders,
      ).ok,
    ).toBe(true);
  });

  it("derivePathResolutionFallback never embeds absolute paths in summary lines", () => {
    const d = derivePathResolutionFallback({
      projectRoot,
      zoneRoot: zoneOk,
      assumePackagedMode: true,
    });
    const merged = d.safeSummaryLines.join("\n");
    expect(/[A-Za-z]:\\/.test(merged)).toBe(false);
    expect(merged).not.toContain(projectRoot);
  });

  it("controlCenterElectronHintsFromApp survives getPath failures (mock)", () => {
    const h = controlCenterElectronHintsFromApp({
      isPackaged: true,
      getAppPath: () => "X:\\mock\\app.asar",
      getPath: () => {
        throw new Error("not_ready");
      },
    });
    expect(h.isPackaged).toBe(true);
    expect(h.userDataPath).toBeUndefined();
  });

  it("buildControlCenterAppSnapshot embeds path resolution fields and keeps productionReady false", () => {
    const snap = buildControlCenterAppSnapshot({
      projectRoot,
      zoneRoot: zoneOk,
      dateUtc: "2099-02-02",
      pilotLoop: null,
      assumePackagedResolutionTest: true,
    });
    expect(snap.productionReady).toBe(false);
    expect(snap.snapshotSourceLabel).toBe(
      "packaged_snapshot_path_resolution_pending",
    );
    expect(snap.pendingPackagingResolution).toBe(true);
    expect(snap.pathResolutionSafeSummaryLines.length).toBeGreaterThan(0);
    const blob = JSON.stringify(snap);
    expect(blob).not.toContain(projectRoot);
  });
});
