import { describe, expect, it, vi } from "vitest";
import {
  resolveHermesBackendConfig,
  evaluateHermesBackendReadiness,
  HERMES_BACKEND_DEFAULTS
} from "../../../../src/main/shikishima-hermes-backend/hermes-backend-config";
import {
  hermesChat,
  type HermesHttpFn,
  type HermesCliFn
} from "../../../../src/main/shikishima-hermes-backend/hermes-backend-client";

describe("Hermes backend config", () => {
  it("is disabled by default (drop-in safe)", () => {
    const cfg = resolveHermesBackendConfig({});
    expect(cfg.enabled).toBe(false);
    expect(cfg.mode).toBe("api");
    expect(cfg.apiBase).toBe(HERMES_BACKEND_DEFAULTS.apiBase);
    const readiness = evaluateHermesBackendReadiness(cfg);
    expect(readiness.ready).toBe(false);
    expect(readiness.summary).toContain("OFF");
  });

  it("reports ready when api env is filled", () => {
    const cfg = resolveHermesBackendConfig({
      SHIKISHIMA_HERMES_BACKEND_ENABLED: "1",
      SHIKISHIMA_HERMES_MODE: "api",
      SHIKISHIMA_HERMES_API_BASE: "http://127.0.0.1:8080/v1",
      SHIKISHIMA_HERMES_MODEL: "anthropic/claude-sonnet-4.6"
    });
    expect(cfg.enabled).toBe(true);
    const readiness = evaluateHermesBackendReadiness(cfg);
    expect(readiness.ready).toBe(true);
  });

  it("never leaks the API key value in readiness summary", () => {
    const cfg = resolveHermesBackendConfig({
      SHIKISHIMA_HERMES_BACKEND_ENABLED: "1",
      SHIKISHIMA_HERMES_API_KEY: "super-secret-key",
      SHIKISHIMA_HERMES_MODE: "api"
    });
    const readiness = evaluateHermesBackendReadiness(cfg);
    expect(readiness.summary).not.toContain("super-secret-key");
    expect(JSON.stringify(readiness)).not.toContain("super-secret-key");
    // 空欄は既定値にフォールバックするため READY になる (drop-in)
    expect(readiness.ready).toBe(true);
  });
});

describe("Hermes backend client", () => {
  it("returns disabled when env off", async () => {
    const r = await hermesChat({ prompt: "hi" }, { env: {} });
    expect(r.ok).toBe(false);
    expect(r.backend).toBe("hermes-disabled");
  });

  it("calls API transport and parses OpenAI response", async () => {
    const http: HermesHttpFn = vi.fn(async () => ({
      status: 200,
      json: { choices: [{ message: { content: "  こんにちは  " } }] }
    }));
    const r = await hermesChat(
      { prompt: "hi", model: "anthropic/claude-sonnet-4.6" },
      {
        http,
        env: {
          SHIKISHIMA_HERMES_BACKEND_ENABLED: "1",
          SHIKISHIMA_HERMES_MODE: "api",
          SHIKISHIMA_HERMES_API_BASE: "http://127.0.0.1:8080/v1",
          SHIKISHIMA_HERMES_MODEL: "anthropic/claude-sonnet-4.6"
        }
      }
    );
    expect(r.ok).toBe(true);
    expect(r.text).toBe("こんにちは");
    expect(r.backend).toBe("hermes-api");
    expect(http).toHaveBeenCalledOnce();
  });

  it("fails gracefully on http error", async () => {
    const http: HermesHttpFn = vi.fn(async () => ({ status: 500, text: "err" }));
    const r = await hermesChat(
      { prompt: "hi" },
      {
        http,
        env: {
          SHIKISHIMA_HERMES_BACKEND_ENABLED: "1",
          SHIKISHIMA_HERMES_MODE: "api",
          SHIKISHIMA_HERMES_API_BASE: "http://127.0.0.1:8080/v1",
          SHIKISHIMA_HERMES_MODEL: "m"
        }
      }
    );
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("http_500");
  });

  it("uses CLI transport in cli mode", async () => {
    const cli: HermesCliFn = vi.fn(async () => ({ ok: true, stdout: "cli-answer" }));
    const r = await hermesChat(
      { prompt: "hi" },
      {
        cli,
        env: {
          SHIKISHIMA_HERMES_BACKEND_ENABLED: "1",
          SHIKISHIMA_HERMES_MODE: "cli",
          SHIKISHIMA_HERMES_MODEL: "anthropic/claude-sonnet-4.6"
        }
      }
    );
    expect(r.ok).toBe(true);
    expect(r.text).toBe("cli-answer");
    expect(r.backend).toBe("hermes-cli");
    expect(cli).toHaveBeenCalledOnce();
  });

  it("dry-run never calls transport", async () => {
    const http: HermesHttpFn = vi.fn(async () => ({ status: 200, json: {} }));
    const r = await hermesChat(
      { prompt: "hi" },
      {
        http,
        env: {
          SHIKISHIMA_HERMES_BACKEND_ENABLED: "1",
          SHIKISHIMA_HERMES_MODE: "api",
          SHIKISHIMA_HERMES_API_BASE: "http://127.0.0.1:8080/v1",
          SHIKISHIMA_HERMES_MODEL: "m",
          SHIKISHIMA_HERMES_DRY_RUN: "1"
        }
      }
    );
    expect(r.ok).toBe(true);
    expect(r.backend).toBe("hermes-dry-run");
    expect(http).not.toHaveBeenCalled();
  });
});
