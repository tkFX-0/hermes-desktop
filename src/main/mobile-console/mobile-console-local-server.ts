/**
 * MobileConsole localhost-only GET server — Phase 2B-2.
 *
 * STARTUP POLICY (Option A):
 *   This module is NOT wired to main/index.ts in Phase 2B-2.
 *   Auto-start is NOT enabled.
 *   Phase 2C will wire `startMobileConsoleLocalServer()` after
 *   pairing token and LAN controls are in place.
 *
 * BIND POLICY:
 *   Binds to 127.0.0.1 only. 0.0.0.0 throws at startup.
 *
 * ENDPOINT POLICY:
 *   GET-only. All writes (POST/PUT/PATCH/DELETE) → 405.
 *   Unknown routes → 404.
 *   No execution. No push. No Level 3 mutation.
 */
import { createServer, Server } from "http";
import type { IncomingMessage, ServerResponse } from "http";
import {
  MOBILE_CONSOLE_ALLOWED_BIND_HOST,
  MOBILE_CONSOLE_DEFAULT_PORT,
  assertBindHost,
  isAllowedMethod,
  writeJsonResponse,
  writeErrorResponse,
  writeHtmlResponse,
} from "./mobile-console-http-security";
import { buildLiveMobileConsoleSnapshot } from "./mobile-console-snapshot-service";
import { extractBearerToken } from "./mobile-console-pairing";
import type { ControlCenterDataProviderParams } from "../ichikishima/control-center/control-center-data-provider";

export interface MobileConsoleLocalServerOptions {
  getParams: () => ControlCenterDataProviderParams;
  port?: number;
  /** Override bind host for testing. Production must always be 127.0.0.1 (Phase 2B-2) or LAN IP (Phase 2C). */
  host?: string;
  /** Phase 2C pairing token. If provided, all non-health endpoints require it. */
  pairingToken?: string;
}

const ROUTES: ReadonlySet<string> = new Set([
  "/mobile/health",
  "/mobile/ui",
  "/mobile/status",
  "/mobile/snapshot",
]);

function buildMobileUiHtml(): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Shikishima Mobile Console</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0d1117;color:#c9d1d9;font-family:-apple-system,BlinkMacSystemFont,sans-serif;padding:16px;max-width:430px;margin:0 auto}
h1{font-size:15px;font-weight:600;color:#e6edf3;margin-bottom:4px}
.phase{font-size:10px;background:#21262d;border:1px solid #30363d;border-radius:3px;padding:2px 6px;color:#8b949e;vertical-align:middle;margin-left:6px}
.banner{background:rgba(88,166,255,0.07);border:1px solid rgba(88,166,255,0.3);border-radius:6px;padding:7px 12px;margin:10px 0;font-size:11px;color:#58a6ff;line-height:1.6}
.card{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:12px;margin-bottom:10px}
label{font-size:11px;color:#8b949e;display:block;margin-bottom:5px}
input[type=password]{width:100%;background:#0d1117;border:1px solid #30363d;border-radius:6px;padding:8px 10px;color:#e6edf3;font-size:13px;font-family:monospace;outline:none;-webkit-appearance:none}
input[type=password]:focus{border-color:#1f6feb}
button{width:100%;background:#1f6feb;border:none;border-radius:6px;padding:9px;color:#fff;font-size:13px;font-weight:600;cursor:pointer;margin-top:8px}
button:disabled{background:#21262d;color:#8b949e;cursor:not-allowed}
.field{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #21262d}
.field:last-child{border-bottom:none}
.fl{font-size:11px;color:#8b949e}
.fv{font-size:12px;font-weight:600;font-family:monospace}
.hold{color:#a371f7}.dis{color:#58a6ff}.f{color:#3fb950}.na{color:#fb923c}.dim{color:#8b949e;font-size:10px}
.error{background:rgba(248,81,73,0.1);border:1px solid rgba(248,81,73,0.4);border-radius:6px;padding:8px 12px;color:#f85149;font-size:12px;margin-top:6px}
.hidden{display:none}
</style>
</head>
<body>
<h1>Shikishima Mobile Console<span class="phase">Phase 2C</span></h1>
<div class="banner">read-only &middot; redacted-only &middot; no execution &middot; no raw values &middot; no device control</div>
<div class="card">
<label>Pairing token</label>
<input type="password" id="tok" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="pairing token">
<button id="btn" onclick="go()">Check redacted snapshot</button>
</div>
<div class="card hidden" id="sp">
<div class="field"><span class="fl">decision</span><span class="fv hold" id="fd">-</span></div>
<div class="field"><span class="fl">execution</span><span class="fv dis" id="fe">-</span></div>
<div class="field"><span class="fl">productionReady</span><span class="fv f" id="fr">-</span></div>
<div class="field"><span class="fl">rawValuesReported</span><span class="fv f" id="fw">-</span></div>
<div class="field"><span class="fl">Level 3</span><span class="fv na" id="fl3">-</span></div>
<div class="field"><span class="fl">B3 progress</span><span class="fv" id="fb">-</span></div>
<div class="field"><span class="fl">Session-009</span><span class="fv na" id="fs9">not countable</span></div>
<div class="field"><span class="fl">dataSource</span><span class="fv dim" id="fs">-</span></div>
</div>
<div class="error hidden" id="ep"></div>
<script>
function st(id,v){var e=document.getElementById(id);if(e)e.textContent=String(v);}
function show(id){var e=document.getElementById(id);if(e)e.classList.remove('hidden');}
function hide(id){var e=document.getElementById(id);if(e)e.classList.add('hidden');}
async function go(){
  var btn=document.getElementById('btn');
  var t=document.getElementById('tok').value;
  if(!t){err('Token is required');return;}
  btn.disabled=true;hide('ep');hide('sp');
  try{
    var r=await fetch('/mobile/snapshot',{headers:{'Authorization':'Bearer '+t}});
    t=null;
    if(r.status===401){err('Invalid token');btn.disabled=false;return;}
    if(!r.ok){err('Server error: '+r.status);btn.disabled=false;return;}
    var d=await r.json();
    st('fd',d.decision??'-');
    st('fe',d.execution??'-');
    st('fr',String(d.productionReady??'-'));
    st('fw',String(d.rawValuesReported??'-'));
    st('fl3',d.level3??'-');
    var b=d.b3Progress;
    st('fb',b?(b.current+'/'+b.required):'-');
    st('fs9',b&&b.current>=b.required?'requires human review':'not countable');
    st('fs',d.dataSource??'-');
    show('sp');
  }catch(e){t=null;err('Connection failed');}
  finally{btn.disabled=false;}
}
function err(m){var e=document.getElementById('ep');if(e){e.textContent=m;show('ep');}}
</script>
</body>
</html>`;
}

function handleRequest(
  req: IncomingMessage,
  res: ServerResponse,
  opts: MobileConsoleLocalServerOptions,
): void {
  if (!isAllowedMethod(req.method)) {
    writeErrorResponse(res, 405, "method_not_allowed");
    return;
  }

  const pathname = (req.url ?? "/").split("?")[0];

  if (pathname === "/mobile/health") {
    writeJsonResponse(res, 200, {
      ok: true,
      phase: "2b-2",
      rawValuesReported: false,
    });
    return;
  }

  if (pathname === "/mobile/ui") {
    writeHtmlResponse(res, 200, buildMobileUiHtml());
    return;
  }

  if (opts.pairingToken) {
    const bearer = extractBearerToken(req.headers["authorization"] as string | undefined);
    if (!bearer || bearer !== opts.pairingToken) {
      writeErrorResponse(res, 401, "unauthorized");
      return;
    }
  }

  if (pathname === "/mobile/status" || pathname === "/mobile/snapshot") {
    try {
      const snapshot = buildLiveMobileConsoleSnapshot({
        controlCenterParams: opts.getParams(),
      });
      const dataSource = opts.pairingToken
        ? ("redacted_snapshot_phase2c_same_lan" as const)
        : ("redacted_snapshot_phase2b_localhost" as const);
      writeJsonResponse(res, 200, { ...snapshot, dataSource });
    } catch {
      writeErrorResponse(res, 500, "snapshot_unavailable");
    }
    return;
  }

  if (!ROUTES.has(pathname)) {
    writeErrorResponse(res, 404, "not_found");
    return;
  }

  writeErrorResponse(res, 500, "not_available");
}

export interface MobileConsoleLocalServerInstance {
  readonly server: Server;
  readonly host: string;
  readonly port: number;
  readonly stop: () => Promise<void>;
}

/**
 * Start the localhost-only GET server.
 *
 * IMPORTANT: This function is NOT called from main/index.ts in Phase 2B-2.
 * It is wired in Phase 2C after pairing token is in place.
 */
export async function startMobileConsoleLocalServer(
  opts: MobileConsoleLocalServerOptions,
): Promise<MobileConsoleLocalServerInstance> {
  const host = opts.host ?? MOBILE_CONSOLE_ALLOWED_BIND_HOST;
  const port = opts.port ?? MOBILE_CONSOLE_DEFAULT_PORT;

  // Phase 2B-2 (no token): localhost-only guard. Phase 2C (token present): caller
  // (startPhase2cServer) already ran assertPhase2cBindHost — do not override with
  // the stricter 127.0.0.1-only check, which would reject LAN IPs.
  if (!opts.pairingToken) {
    assertBindHost(host);
  }

  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    handleRequest(req, res, opts);
  });

  await new Promise<void>((resolve, reject) => {
    server.on("error", reject);
    server.listen(port, host, () => {
      server.removeListener("error", reject);
      resolve();
    });
  });

  const stop = (): Promise<void> =>
    new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });

  return { server, host, port, stop };
}
