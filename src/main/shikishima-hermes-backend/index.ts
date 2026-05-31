/**
 * Hermes backend (しきしま arrangement) — public surface.
 *
 * Drop-in: set SHIKISHIMA_HERMES_BACKEND_ENABLED=1 and the transport env
 * (API base or WSL CLI) to route しきしま replies through the Hermes agent.
 */

export * from "./hermes-backend-config";
export * from "./hermes-backend-client";
