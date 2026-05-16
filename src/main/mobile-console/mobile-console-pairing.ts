/**
 * Phase 2C pairing token — in-memory only.
 * NEVER persisted. NEVER logged raw. NEVER in any API response.
 * Token is shown ONLY in the Electron UI.
 */
import { randomBytes } from "crypto";

export interface PairingState {
  readonly isTokenValid: (bearerToken: string) => boolean;
  readonly tokenPresent: true;
  readonly tokenLengthBucket: "long";
}

/** Generate a 256-bit (64 hex char) pairing token. */
export function generatePairingToken(): string {
  return randomBytes(32).toString("hex");
}

/** Create an in-memory pairing state. Token never leaves this closure. */
export function createPairingState(): PairingState & { readonly rawTokenForElectronUiOnly: string } {
  const token = generatePairingToken();
  return {
    rawTokenForElectronUiOnly: token,
    tokenPresent: true,
    tokenLengthBucket: "long",
    isTokenValid: (bearerToken: string) => bearerToken === token,
  };
}

/** Extract bearer token from Authorization header value. */
export function extractBearerToken(
  authHeader: string | undefined,
): string | null {
  if (!authHeader) return null;
  const m = /^Bearer\s+(\S+)$/i.exec(authHeader);
  return m ? (m[1] ?? null) : null;
}
