import { describe, expect, it } from "vitest";
import {
  resolveDevPipelineConfig,
  resolveDevBackendChain,
  formatDevPipelineStatus,
  DEV_CHAIN
} from "../../../../scripts/lib/dev-pipeline-router.mjs";

describe("dev pipeline router", () => {
  it("defaults to subscription-only when billing mode set", () => {
    const cfg = resolveDevPipelineConfig({
      SHIKISHIMA_BILLING_MODE: "subscription_only",
      SHIKISHIMA_DEV_PIPELINE_ENABLED: "1"
    });
    expect(cfg.subscriptionOnly).toBe(true);
    expect(cfg.enabled).toBe(true);
  });

  it("prefers Windows agent CLI for composer when agent_cli mode", () => {
    const cfg = resolveDevPipelineConfig({
      SHIKISHIMA_DEV_PIPELINE_ENABLED: "1",
      SHIKISHIMA_COMPOSER_MODE: "agent_cli"
    });
    const chain = resolveDevBackendChain(cfg, {
      windows: { agent: { present: true } },
      tools: { hermes: { present: true }, claude: { present: true } }
    });
    expect(chain[0]).toEqual({ id: "composer", via: "cursor-agent-cli-win" });
  });

  it("falls back to hermes-brain when no agent cli", () => {
    const cfg = resolveDevPipelineConfig({ SHIKISHIMA_DEV_PIPELINE_ENABLED: "1" });
    const chain = resolveDevBackendChain(cfg, {
      tools: { hermes: { present: true }, claude: { present: true } }
    });
    expect(chain[0].via).toBe("hermes-brain");
  });

  it("skips codex when subscription only and no CLI", () => {
    const cfg = resolveDevPipelineConfig({
      SHIKISHIMA_SUBSCRIPTION_ONLY: "1"
    });
    const chain = resolveDevBackendChain(cfg, {
      tools: { claude: { present: true }, hermes: { present: true } }
    });
    expect(chain.some((c) => c.id === "codex")).toBe(false);
  });

  it("DEV_CHAIN order is fixed", () => {
    expect(DEV_CHAIN).toEqual(["composer", "claude", "codex"]);
  });

  it("formatDevPipelineStatus lists priority chain without duplicate composer", () => {
    const cfg = resolveDevPipelineConfig({
      SHIKISHIMA_DEV_PIPELINE_ENABLED: "1",
      SHIKISHIMA_DEV_PRIMARY: "composer"
    });
    const report = formatDevPipelineStatus(cfg, {
      windows: { agent: { present: true }, agentLogin: { loggedIn: false, hint: "test" } },
      tools: { hermes: { present: true }, claude: { present: true }, codex: { present: true } },
      login: {
        claude: { loggedIn: true, hint: "ok" },
        codex: { loggedIn: true, hint: "ok" }
      }
    });
    const priorityLine = report.split("\n").find((l) => l.startsWith("優先:"));
    expect(priorityLine).toBe("優先: composer → claude → codex");
    expect((priorityLine?.match(/composer/g) ?? []).length).toBe(1);
  });
});
