import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  CONTROL_CENTER_READONLY_IPC_BINDING,
  CONTROL_CENTER_V1_DISABLED_ACTION_IDS,
} from "../../../src/main/ichikishima/control-center/control-center-data-provider";

const MOCKUPS_DIR = path.resolve(
  __dirname,
  "../../../archive/ichikishima/mockups",
);

function mockupText(name: string): string {
  return readFileSync(path.join(MOCKUPS_DIR, name), "utf8");
}

describe("control-center static shell (mockups)", () => {
  const sampleJson = (): unknown =>
    JSON.parse(mockupText("control-center-v1-snapshot.sample.json"));

  it("sample snapshot matches readonly contract literals", () => {
    const s = sampleJson();
    expect(s && typeof s === "object").toBe(true);
    const o = s as Record<string, unknown>;

    expect(o.ipcBinding).toEqual(CONTROL_CENTER_READONLY_IPC_BINDING);
    expect(o.requiresUserApproval).toBe(true);
    expect(o.canExecuteDangerousActions).toBe(false);
    expect(o.disabledActions).toEqual([
      ...CONTROL_CENTER_V1_DISABLED_ACTION_IDS,
    ]);

    expect(Array.isArray(o.statusCards)).toBe(true);
    expect(Array.isArray(o.nextGoals)).toBe(true);
    expect(
      typeof o.latestReports === "object" && o.latestReports !== null,
    ).toBe(true);

    const text = mockupText(
      "control-center-v1-snapshot.sample.json",
    ).toLowerCase();
    expect(text).not.toMatch(/\bPRIVATE_KEY\b|\bsk-live-\b|\bOPENAI_SECRET\b/);
    expect(text).not.toMatch(/"allowedapis"\s*:\s*\[/);
    expect(text).not.toMatch(/"forbiddenapis"\s*:\s*\[/);
  });

  it("static shell files avoid external CDN and outbound fetch patterns", () => {
    const html = mockupText("control-center-v1-static-shell.html");
    const css = mockupText("control-center-v1-static-shell.css");
    const js = mockupText("control-center-v1-static-shell.js");
    const combined = `${html}\n${css}\n${js}`;

    expect(combined).not.toMatch(/https?:\/\//);
    expect(combined).not.toMatch(/fetch\s*\(\s*[`'"]https?:/);
    expect(combined).not.toMatch(/<script[^>]+src\s*=\s*["']https?:/i);

    expect(combined.toLowerCase()).not.toMatch(/xmlhttprequest/);
    expect(js).not.toMatch(/require\s*\(\s*["']child_process["']\s*\)/);
    expect(js).not.toMatch(/require\s*\(\s*["']fs["']\s*\)/);

    expect(html.includes('type="application/json"')).toBe(true);
    expect(js.includes("FileReader")).toBe(true);
    expect(js).not.toMatch(/fetch\s*\(/);
    expect(css).not.toMatch(/@import\s+/);
  });

  it("pipeline buttons are disabled; parse button stays enabled without pipeline class", () => {
    const html = mockupText("control-center-v1-static-shell.html");
    for (const [, inner] of html.matchAll(/class="pipeline"([^>]*)>/g)) {
      expect(inner).toMatch(/\bdisabled\b/);
    }

    expect(html).toContain("cc-parse-paste-btn");
    expect(html).not.toMatch(/class="pipeline"[^\n]*cc-parse-paste-btn/);

    expect(html.toLowerCase()).toContain("dangerous actions disabled");
    expect(html.includes("No external network")).toBe(true);
    expect(html).toMatch(/Signoff|pendingPackagingResolution/);
    expect(html.toLowerCase()).toMatch(/resolver.*smoke/);
  });

  it("sample carries appFoundationPreview with productionReady false and eight rooms", () => {
    const o = sampleJson() as Record<string, unknown>;
    expect(o.appFoundationPreview).toBeDefined();
    const af = o.appFoundationPreview as Record<string, unknown>;
    expect(af.productionReady).toBe(false);
    expect(String(af.controlledPilotStation)).toContain("waiting_for");
    expect(String(af.realHermesProcessStatus)).toContain("not_running");
    const ids = af.controlCenterRoomIds as unknown[];
    expect(Array.isArray(ids)).toBe(true);
    expect(ids).toHaveLength(8);
    expect(String(af.agentTeamStation ?? "")).toContain("dry_run");
  });

  it("sample includes appShellParityPreview aligned with Renderer shell sections", () => {
    const o = sampleJson() as Record<string, unknown>;
    const p = o.appShellParityPreview as Record<string, unknown>;
    expect(p).toBeDefined();
    expect(p.agentTeamSummary).toBeDefined();
    expect(p.visualizationModel).toBeDefined();
    expect(p.memorySummary).toBeDefined();
  });

  it("sample appFoundationPreview exposes pathResolutionUi without absolute path hints", () => {
    const o = sampleJson() as Record<string, unknown>;
    const af = o.appFoundationPreview as Record<string, unknown>;
    expect(af.pathResolutionUi).toBeDefined();
    const ui = af.pathResolutionUi as Record<string, unknown>;
    const lines = JSON.stringify(ui.safeSummaryLines).toLowerCase();
    expect(lines).not.toMatch(/users\/|\\\\[a-z]|c:\\/i);
  });
});
