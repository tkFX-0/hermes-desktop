/**
 * HTTP security helpers for the MobileConsole localhost server.
 * Enforces 127.0.0.1-only binding and safe response headers.
 * No CORS wildcard. No execution. No mutation.
 */
import type { ServerResponse } from "http";

/** Only this host is permitted. 0.0.0.0 / LAN IPs are rejected at startup. */
export const MOBILE_CONSOLE_ALLOWED_BIND_HOST = "127.0.0.1" as const;

/** Default port. Non-privileged, avoids common conflicts. */
export const MOBILE_CONSOLE_DEFAULT_PORT = 3030 as const;

/** Methods allowed. All others get 405. */
const ALLOWED_METHODS = new Set(["GET", "HEAD"]);

export function assertBindHost(host: string): void {
  if (host !== MOBILE_CONSOLE_ALLOWED_BIND_HOST) {
    throw new Error(
      `mobile_console_server:forbidden_bind_host:${host} — only 127.0.0.1 allowed`,
    );
  }
}

export function isAllowedMethod(method: string | undefined): boolean {
  return ALLOWED_METHODS.has((method ?? "").toUpperCase());
}

/** Write safe JSON response. Never includes stack traces or absolute paths. */
export function writeJsonResponse(
  res: ServerResponse,
  status: number,
  body: unknown,
): void {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(json),
    // No CORS header — Phase 2B-2 is localhost-only
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(json);
}

/** Safe error response — no stack, no path, no internal info. */
export function writeErrorResponse(
  res: ServerResponse,
  status: number,
  code: string,
): void {
  writeJsonResponse(res, status, {
    ok: false,
    error: code,
    rawValuesReported: false,
  });
}

/** Write safe HTML response with security headers. No CORS. */
export function writeHtmlResponse(
  res: ServerResponse,
  status: number,
  html: string,
): void {
  const bytes = Buffer.from(html, "utf-8");
  res.writeHead(status, {
    "Content-Type": "text/html; charset=utf-8",
    "Content-Length": bytes.length,
    "Cache-Control": "no-store",
    "Content-Security-Policy":
      "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'none'",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
  });
  res.end(bytes);
}
