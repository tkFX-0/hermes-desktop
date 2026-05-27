import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RuntimeStatusBoardPage } from "./RuntimeStatusBoardPage";

describe("RuntimeStatusBoardPage", () => {
  it("shows HOLD fallback when preload API is unavailable", async () => {
    const original = window.shikishimaStatusBoard;
    // @ts-expect-error test override
    delete window.shikishimaStatusBoard;

    render(<RuntimeStatusBoardPage />);

    expect(
      await screen.findByText(/Status board IPC unavailable — showing safe HOLD fallback/i)
    ).toBeTruthy();
    expect(screen.getByTestId("rsb-safety")).toHaveTextContent("productionReady: false");
    expect(screen.getByTestId("rsb-safety")).toHaveTextContent("execution: disabled");
    expect(screen.getByTestId("rsb-card-runtime")).toHaveTextContent("status: HOLD");
    expect(screen.queryByRole("button", { name: /send/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /execute/i })).toBeNull();
    expect(screen.queryByRole("textbox")).toBeNull();

    window.shikishimaStatusBoard = original;
  });

  it("renders snapshot from preload getSnapshot", async () => {
    window.shikishimaStatusBoard = {
      getSnapshot: vi.fn().mockResolvedValue({
        ok: true,
        snapshot: {
          surface: "runtime-readonly-status-board-snapshot",
          readonlyOnly: true,
          displayOnly: true,
          status: "READY_FOR_HUMAN_REVIEW",
          generatedAtLabel: "2026-05-26",
          sections: [
            {
              id: "operator_review",
              title: "Operator Review",
              status: "READY_FOR_HUMAN_REVIEW",
              summary: "ok",
              requiresExplicitHumanGo: true
            },
            {
              id: "human_gate_queue",
              title: "Human Gate Queue",
              status: "PASS_WITH_CAVEAT",
              summary: "queue",
              requiresExplicitHumanGo: true
            },
            {
              id: "discord_send",
              title: "Discord Send",
              status: "PASS_WITH_CAVEAT",
              summary: "discord",
              requiresExplicitHumanGo: true
            },
            {
              id: "external_action_guard",
              title: "External Action Guard",
              status: "MIXED",
              summary: "guard",
              requiresExplicitHumanGo: true
            },
            {
              id: "runtime",
              title: "Runtime",
              status: "HOLD",
              summary: "runtime hold",
              requiresExplicitHumanGo: true
            },
            {
              id: "production",
              title: "Production",
              status: "HOLD",
              summary: "production hold",
              requiresExplicitHumanGo: true
            }
          ],
          routeSummary: [
            {
              routeId: "discord_one_shot_send",
              status: "HOLD_PENDING_LOCAL_CREDENTIALS",
              effectClass: "network_write",
              requiresExplicitHumanGo: true,
              actualExecutionCount: 0
            }
          ],
          recommendedHumanAction: "Review",
          markdown: "# board",
          safety: {
            readonlyOnly: true,
            displayOnly: true,
            productionReady: false,
            execution: "disabled",
            runtimeStarted: false,
            actualDiscordSend: false,
            tokenRead: false,
            networkCall: false,
            externalApiWrite: false,
            obsidianWrite: false,
            stackChanConnected: false,
            rawValuesReported: false,
            ipcConnected: true,
            preloadExposed: true,
            rendererWired: true,
            reactUiImplemented: true,
            redacted: true
          }
        }
      })
    };

    render(<RuntimeStatusBoardPage />);

    expect(await screen.findByText(/Operator Review/)).toBeTruthy();
    expect(screen.getByText(/discord_one_shot_send: HOLD_PENDING_LOCAL_CREDENTIALS/)).toBeTruthy();
    expect(screen.queryByRole("button", { name: /^send$/i })).toBeNull();
  });
});
