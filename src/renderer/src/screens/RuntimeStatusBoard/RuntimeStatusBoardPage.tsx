import { useCallback, useEffect, useState } from "react";
import "./RuntimeStatusBoardPage.css";
import { createRuntimeReadonlyStatusBoardHoldFallbackSnapshot } from "../../../../shared/runtime-readonly-status-board/runtime-readonly-status-board";
import { createRuntimeReadonlyStatusBoardViewModel } from "../../../../shared/runtime-readonly-status-board/runtime-readonly-status-board";
import type { RuntimeReadonlyStatusBoardSnapshot } from "../../../../shared/runtime-readonly-status-board/runtime-readonly-status-board-types";

function toneClass(tone: string): string {
  if (tone === "ready") return "rsb-chip-ready";
  if (tone === "blocked") return "rsb-chip-blocked";
  if (tone === "hold") return "rsb-chip-hold";
  return "rsb-chip-neutral";
}

export function RuntimeStatusBoardPage(): React.JSX.Element {
  const [snapshot, setSnapshot] = useState<RuntimeReadonlyStatusBoardSnapshot>(() =>
    createRuntimeReadonlyStatusBoardHoldFallbackSnapshot({
      preloadExposed: false,
      rendererWired: true
    })
  );
  const [ipcUnavailable, setIpcUnavailable] = useState(true);

  const loadSnapshot = useCallback(async () => {
    const api = window.shikishimaStatusBoard;
    if (!api?.getSnapshot) {
      setIpcUnavailable(true);
      setSnapshot(
        createRuntimeReadonlyStatusBoardHoldFallbackSnapshot({
          preloadExposed: false,
          rendererWired: true
        })
      );
      return;
    }

    try {
      const result = await api.getSnapshot();
      setSnapshot(result.snapshot);
      setIpcUnavailable(!result.ok);
    } catch {
      setIpcUnavailable(true);
      setSnapshot(
        createRuntimeReadonlyStatusBoardHoldFallbackSnapshot({
          ipcConnected: false,
          preloadExposed: true,
          rendererWired: true
        })
      );
    }
  }, []);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  const viewModel = createRuntimeReadonlyStatusBoardViewModel(snapshot);

  return (
    <div className="rsb-page" data-testid="runtime-status-board-page">
      <header className="rsb-header">
        <h1>{viewModel.title}</h1>
        <p className="rsb-readonly-banner">Read-only / display-only — no execution controls</p>
        {ipcUnavailable ? (
          <p className="rsb-fallback-banner" data-testid="rsb-ipc-fallback">
            Status board IPC unavailable — showing safe HOLD fallback.
          </p>
        ) : null}
        <button type="button" className="rsb-refresh" onClick={() => void loadSnapshot()}>
          Refresh snapshot
        </button>
      </header>

      <section className="rsb-chips" aria-label="Status chips">
        {viewModel.statusChips.map((chip) => (
          <span key={chip.label} className={`rsb-chip ${toneClass(chip.tone)}`}>
            {chip.label}: {chip.value}
          </span>
        ))}
      </section>

      <section className="rsb-cards" aria-label="Status sections">
        {viewModel.cards.map((card) => (
          <article key={card.id} className="rsb-card" data-testid={`rsb-card-${card.id}`}>
            <h2>{card.title}</h2>
            <p>
              <strong>status:</strong> {card.status}
            </p>
            <p>{card.summary}</p>
            {card.nextAction ? (
              <p>
                <strong>next:</strong> {card.nextAction}
              </p>
            ) : null}
          </article>
        ))}
      </section>

      <section className="rsb-routes" aria-label="External action routes">
        <h2>External Action Routes</h2>
        <ul>
          {viewModel.routeRows.map((row) => (
            <li key={row.routeId}>
              {row.routeId}: {row.status} ({row.effectClass}) — Human GO required
            </li>
          ))}
        </ul>
      </section>

      <section className="rsb-safety" aria-label="Safety boundary" data-testid="rsb-safety">
        <h2>Safety Boundary</h2>
        <ul>
          {viewModel.safetyStrip.map((item) => (
            <li key={item.label}>
              {item.label}: {item.value}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
