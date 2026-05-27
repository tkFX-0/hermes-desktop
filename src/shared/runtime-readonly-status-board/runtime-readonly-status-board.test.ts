import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  buildRuntimeReadonlyStatusBoardFixtureInput,
  createRuntimeReadonlyStatusBoardHoldFallbackSnapshot,
  createRuntimeReadonlyStatusBoardSnapshot,
  createRuntimeReadonlyStatusBoardViewModel,
  renderRuntimeReadonlyStatusBoardMarkdown
} from "./runtime-readonly-status-board";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("runtime readonly status board", () => {
  it("does not import Node fs in implementation module", () => {
    const source = readFileSync(join(__dirname, "runtime-readonly-status-board.ts"), "utf8");

    expect(source).not.toMatch(/from\s+["']node:fs["']/);
    expect(source).not.toMatch(/from\s+["']fs["']/);
  });

  it("creates snapshot with expected sections and safety", () => {
    const boardSnapshot = createRuntimeReadonlyStatusBoardSnapshot(
      buildRuntimeReadonlyStatusBoardFixtureInput()
    );

    expect(boardSnapshot.readonlyOnly).toBe(true);
    expect(boardSnapshot.sections.map((section) => section.id)).toEqual([
      "operator_review",
      "human_gate_queue",
      "discord_send",
      "external_action_guard",
      "runtime",
      "production"
    ]);
    expect(boardSnapshot.sections.find((section) => section.id === "runtime")?.status).toBe("HOLD");
    expect(boardSnapshot.sections.find((section) => section.id === "production")?.status).toBe("HOLD");
    expect(boardSnapshot.safety.productionReady).toBe(false);
    expect(boardSnapshot.safety.execution).toBe("disabled");
    expect(boardSnapshot.safety.actualDiscordSend).toBe(false);
    expect(boardSnapshot.routeSummary.length).toBe(6);
  });

  it("reflects discord route HOLD_PENDING_LOCAL_CREDENTIALS", () => {
    const boardSnapshot = createRuntimeReadonlyStatusBoardSnapshot(
      buildRuntimeReadonlyStatusBoardFixtureInput()
    );
    const discordSection = boardSnapshot.sections.find((section) => section.id === "discord_send");

    expect(discordSection?.status).toBe("PASS_WITH_CAVEAT");
    expect(boardSnapshot.routeSummary.find((route) => route.routeId === "discord_one_shot_send")?.status).toBe(
      "HOLD_PENDING_LOCAL_CREDENTIALS"
    );
  });

  it("reflects queue route EXECUTED_ONCE", () => {
    const boardSnapshot = createRuntimeReadonlyStatusBoardSnapshot(
      buildRuntimeReadonlyStatusBoardFixtureInput()
    );

    expect(
      boardSnapshot.routeSummary.find(
        (route) => route.routeId === "human_gate_queue_repo_local_mutation"
      )?.status
    ).toBe("EXECUTED_ONCE");
  });

  it("renders markdown and view model", () => {
    const boardSnapshot = createRuntimeReadonlyStatusBoardSnapshot(
      buildRuntimeReadonlyStatusBoardFixtureInput()
    );
    const markdown = renderRuntimeReadonlyStatusBoardMarkdown(boardSnapshot);
    const viewModel = createRuntimeReadonlyStatusBoardViewModel(boardSnapshot);

    expect(boardSnapshot.markdown).toContain("# しきしま Read-only Status Board");
    expect(markdown).toContain("productionReady: false");
    expect(markdown).not.toMatch(/sk-[A-Za-z0-9]/);
    expect(viewModel.surface).toBe("runtime-readonly-status-board-view-model");
    expect(viewModel.cards.length).toBe(6);
    expect(viewModel.routeRows.length).toBe(6);
    expect(viewModel.safetyStrip.some((item) => item.label === "execution")).toBe(true);
    expect(viewModel.safetyStrip.find((item) => item.label === "actualDiscordSend")?.value).toBe("false");
  });

  it("creates HOLD fallback snapshot", () => {
    const fallback = createRuntimeReadonlyStatusBoardHoldFallbackSnapshot({
      rendererWired: true
    });
    expect(fallback.status).toBe("HOLD");
    expect(fallback.safety.actualDiscordSend).toBe(false);
    expect(fallback.markdown).toContain("Read-only Status Board");
  });

  it("records guarded route statuses in route summary", () => {
    const boardSnapshot = createRuntimeReadonlyStatusBoardSnapshot(
      buildRuntimeReadonlyStatusBoardFixtureInput()
    );
    const byId = Object.fromEntries(boardSnapshot.routeSummary.map((route) => [route.routeId, route]));

    expect(byId.git_push?.status).toBe("HOLD_PENDING_HUMAN_GO");
    expect(byId.runtime_start?.status).toBe("HOLD_PENDING_HUMAN_GO");
    expect(byId.obsidian_write?.status).toBe("HOLD_PENDING_IMPLEMENTATION");
    expect(byId.external_api_write?.status).toBe("HOLD_PENDING_HUMAN_GO");
  });
});
