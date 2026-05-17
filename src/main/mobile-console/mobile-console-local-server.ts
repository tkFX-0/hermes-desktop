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

export function buildMobileUiHtml(): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Shikishima Mobile Console</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0d1117;color:#c9d1d9;font-family:-apple-system,BlinkMacSystemFont,sans-serif;padding:16px;max-width:430px;margin:0 auto}
h1{font-size:15px;font-weight:600;color:#e6edf3;margin-bottom:2px}
.sub{font-size:10px;color:#8b949e;margin-bottom:10px}
.phase{font-size:10px;background:#21262d;border:1px solid #30363d;border-radius:3px;padding:2px 6px;color:#8b949e;vertical-align:middle;margin-left:6px}
.banner{background:rgba(88,166,255,0.07);border:1px solid rgba(88,166,255,0.3);border-radius:6px;padding:7px 12px;margin:10px 0;font-size:11px;color:#58a6ff;line-height:1.6}
.card{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:12px;margin-bottom:10px}
.card-title{font-size:12px;font-weight:600;color:#58a6ff;margin-bottom:8px;letter-spacing:.03em}
label{font-size:11px;color:#8b949e;display:block;margin-bottom:5px}
input[type=password]{width:100%;background:#0d1117;border:1px solid #30363d;border-radius:6px;padding:8px 10px;color:#e6edf3;font-size:13px;font-family:monospace;outline:none;-webkit-appearance:none}
input[type=password]:focus{border-color:#1f6feb}
button{width:100%;background:#1f6feb;border:none;border-radius:6px;padding:9px;color:#fff;font-size:13px;font-weight:600;cursor:pointer;margin-top:8px}
button:disabled{background:#21262d;color:#8b949e;cursor:not-allowed}
.field{display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid #21262d}
.field:last-child{border-bottom:none}
.fl{font-size:11px;color:#8b949e}
.fv{font-size:12px;font-weight:600;font-family:monospace}
.hold{color:#a371f7}.dis{color:#58a6ff}.safe{color:#3fb950}.warn{color:#fb923c}.dim{color:#8b949e;font-size:10px}
.error{background:rgba(248,81,73,0.1);border:1px solid rgba(248,81,73,0.4);border-radius:6px;padding:8px 12px;color:#f85149;font-size:12px;margin-top:6px}
.hidden{display:none}
.koma-card{background:#0d1e2e;border:1px solid #1f4068;border-radius:8px;padding:12px;margin-bottom:10px}
.koma-header{font-size:13px;font-weight:700;color:#79c0ff;margin-bottom:6px}
.koma-state{display:inline-block;font-size:11px;font-weight:600;background:#1f4068;color:#79c0ff;border-radius:4px;padding:2px 8px;margin-bottom:6px;font-family:monospace}
.koma-msg{font-size:12px;color:#c9d1d9;line-height:1.5}
.caveat-card{background:rgba(210,153,34,0.07);border:1px solid rgba(210,153,34,0.4);border-radius:8px;padding:10px 12px;margin-bottom:10px;font-size:11px;color:#d29922;line-height:1.6}
.caveat-title{font-weight:700;margin-bottom:4px}
.next-card{background:rgba(88,166,255,0.06);border:1px solid rgba(88,166,255,0.25);border-radius:8px;padding:10px 12px;margin-bottom:10px}
.next-title{font-size:11px;color:#8b949e;margin-bottom:4px}
.next-val{font-size:12px;color:#c9d1d9;line-height:1.5}
.prog-card{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:10px 12px;margin-bottom:10px;font-size:11px;color:#8b949e}
.prog-pass{color:#3fb950;font-weight:600}
.prog-inprog{color:#d29922;font-weight:600}
.approval-card{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:10px 12px;margin-bottom:10px}
.approval-head{display:flex;justify-content:space-between;gap:8px;align-items:flex-start;margin-bottom:7px}
.approval-title{font-size:12px;font-weight:700;color:#e6edf3;line-height:1.4}
.approval-meta{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:7px}
.pill{display:inline-block;border-radius:999px;padding:2px 7px;font-size:9px;font-weight:700;letter-spacing:.02em;text-transform:uppercase}
.risk-low{background:rgba(63,185,80,.14);color:#3fb950}.risk-medium{background:rgba(210,153,34,.14);color:#d29922}.risk-high{background:rgba(251,146,60,.14);color:#fb923c}.risk-critical{background:rgba(248,81,73,.14);color:#f85149}
.state-pill{background:#21262d;color:#c9d1d9}.display-pill{background:rgba(88,166,255,.12);color:#58a6ff}
.approval-text{font-size:11px;color:#c9d1d9;line-height:1.5;margin:5px 0}
.approval-label{color:#8b949e;font-size:10px;margin-right:4px}
.approval-actions{display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;margin-top:8px}
.approval-actions button{margin-top:0;background:#21262d;color:#8b949e;border:1px solid #30363d;font-size:10px;padding:6px;cursor:not-allowed}
.display-preview{background:rgba(163,113,247,.07);border:1px solid rgba(163,113,247,.35);border-radius:8px;padding:10px 12px;margin-bottom:10px}
.display-face{font-family:ui-monospace,monospace;font-size:22px;line-height:1;text-align:center;color:#a371f7;background:#0d1117;border:1px solid #30363d;border-radius:7px;padding:12px;margin:8px 0}
.display-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px}
.display-cell{background:#0d1117;border:1px solid #30363d;border-radius:6px;padding:7px}
.display-cell .fl{display:block;margin-bottom:3px}
.outbox-card{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:10px 12px;margin-bottom:10px}
.outbox-body{font-family:ui-monospace,monospace;font-size:10px;line-height:1.5;background:#0d1117;border:1px solid #30363d;border-radius:6px;padding:8px;margin-top:6px;white-space:pre-wrap;color:#c9d1d9}
</style>
</head>
<body>
<h1>Shikishima Mobile Console<span class="phase">Phase 2C</span></h1>
<div class="sub">read-only &middot; redacted-only &middot; no execution &middot; no device control</div>
<div class="banner">安全境界: HOLD / disabled / productionReady=false / rawValues非表示<br>コマンド実行・push・Level 3承認・raw値表示は行いません。</div>

<div class="card">
<label>Pairing token</label>
<input type="password" id="tok" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="pairing token">
<button id="btn" onclick="go()">スナップショット取得</button>
</div>

<div id="ep" class="error hidden"></div>

<div id="koma-section" class="koma-card hidden">
<div class="koma-header">こましき 🐾</div>
<div class="koma-state" id="koma-state">HOLD</div>
<div class="koma-msg" id="koma-msg">まだ待機だよ。人間GOが必要だよ。</div>
</div>

<div id="caveat-section" class="caveat-card hidden">
<div class="caveat-title">Caveat（既知注意事項）</div>
<div id="caveat-text"></div>
</div>

<div id="sp" class="card hidden">
<div class="card-title">しきしま 安全状態</div>
<div class="field"><span class="fl">decision</span><span class="fv hold" id="fd">-</span></div>
<div class="field"><span class="fl">execution</span><span class="fv dis" id="fe">-</span></div>
<div class="field"><span class="fl">productionReady</span><span class="fv safe" id="fr">-</span></div>
<div class="field"><span class="fl">rawValuesReported</span><span class="fv safe" id="fw">-</span></div>
<div class="field"><span class="fl">Level 3</span><span class="fv warn" id="fl3">-</span></div>
<div class="field"><span class="fl">B3 / L3-A</span><span class="fv" id="fb">-</span></div>
<div class="field"><span class="fl">phase</span><span class="fv dim" id="fph">-</span></div>
<div class="field"><span class="fl">dataSource</span><span class="fv dim" id="fs">-</span></div>
</div>

<div id="next-section" class="next-card hidden">
<div class="next-title">次の必要アクション（人間）</div>
<div class="next-val" id="next-val">-</div>
</div>

<div id="prog-section" class="prog-card hidden">
<div style="margin-bottom:4px"><span class="prog-pass" id="prog-val">-</span></div>
<div id="sess-val" style="font-size:11px"></div>
</div>

<div id="display-section" class="display-preview hidden">
<div class="card-title">Display Terminal Preview</div>
<div class="dim">Display-only / Physical device not connected / StackChan has not arrived / No robot motion / No voice / camera / mic</div>
<div class="display-face" id="display-face">(-_-)</div>
<div class="approval-text" id="display-message">-</div>
<div class="approval-text"><span class="approval-label">safety:</span><span id="display-safety">-</span></div>
<div class="display-grid">
<div class="display-cell"><span class="fl">terminal</span><span class="fv" id="display-kind">-</span></div>
<div class="display-cell"><span class="fl">connection</span><span class="fv" id="display-connection">-</span></div>
<div class="display-cell"><span class="fl">expression</span><span class="fv" id="display-expression">-</span></div>
<div class="display-cell"><span class="fl">physical</span><span class="fv safe" id="display-physical">false</span></div>
<div class="display-cell"><span class="fl">voice/camera/mic</span><span class="fv safe" id="display-av">disabled</span></div>
<div class="display-cell"><span class="fl">execution</span><span class="fv dis" id="display-exec">disabled</span></div>
</div>
</div>

<div id="approval-section" class="card hidden">
<div class="card-title">Approval Queue</div>
<div class="dim" style="margin-bottom:8px">Display-only / No execution / Human decision required</div>
<div id="approval-list"></div>
</div>

<div id="outbox-section" class="card hidden">
<div class="card-title">Draft Outbox</div>
<div class="dim" style="margin-bottom:8px">Draft-only / No external write / No send / No remote creation / Human copy required</div>
<div id="outbox-list"></div>
</div>

<script>
var KOMA_MSGS={
  GO:"準備OKだよ。人間GOが来たら進めるよ。",
  HOLD:"まだ待機だよ。人間GOが必要だよ。",
  REJECT:"却下されたよ。理由を確認してね。",
  PASS:"証跡まで残ったよ。安全に完了！",
  STOP:"ここで止めよう。安全確認が先だよ。",
  REVIEW_READY:"レビュー待ちだよ。人間の確認を待っているよ。",
  PUSH_WAITING:"pushは人間GO待ちだよ。",
  RUNTIME_RUNNING:"観察中だよ。閉じる前にiPhone確認してね。",
  CAVEAT:"通ったけど注意あり。caveatを確認してね。",
  SLEEPY:"アイドル中だよ。何かあれば呼んでね。"
};
var CAVEAT_MSGS={
  "windows_manual_installer_required_non_blocking":
    "Hermes CLIはWindowsでは手動インストールが必要です。自動インストールはしません。観察はcaveat付きで継続できます。"
};
function st(id,v){var e=document.getElementById(id);if(e)e.textContent=String(v);}
function show(id){var e=document.getElementById(id);if(e)e.classList.remove('hidden');}
function hide(id){var e=document.getElementById(id);if(e)e.classList.add('hidden');}
function esc(v){return String(v??'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function riskClass(r){return r==='critical'?'risk-critical':r==='high'?'risk-high':r==='medium'?'risk-medium':'risk-low';}
function faceGlyph(state){return state==='stop'?'(X_X)':state==='pass'?'(^_^)':state==='pass_with_caveat'?'(^_^;)':state==='push_waiting'?'(o_o)':state==='caution'?'(! !)':state==='sleepy'?'(-.-)':'(-_-)';}
function renderDisplayPreview(preview){
  if(!preview)return;
  st('display-face',faceGlyph(preview.expressionState));
  st('display-message',preview.displayMessage||'-');
  st('display-safety',preview.safetyNote||'-');
  st('display-kind',preview.terminalKind||'-');
  st('display-connection',preview.connectionState||'-');
  st('display-expression',preview.expressionState||'-');
  st('display-physical',String(preview.physicalOperation===true));
  var av=(preview.voiceEnabled||preview.cameraEnabled||preview.microphoneEnabled)?'enabled':'disabled';
  st('display-av',av);
  st('display-exec',preview.execution||'disabled');
  show('display-section');
}
function renderApprovalQueue(items){
  var list=document.getElementById('approval-list');
  if(!list)return;
  var safe=Array.isArray(items)?items:[];
  if(safe.length===0){list.innerHTML='<div class="dim">No approval queue items.</div>';show('approval-section');return;}
  list.innerHTML=safe.map(function(item){
    return '<div class="approval-card">'+
      '<div class="approval-head"><div class="approval-title">'+esc(item.title)+'</div><span class="pill display-pill">display-only</span></div>'+
      '<div class="approval-meta">'+
        '<span class="pill '+riskClass(item.riskLevel)+'">'+esc(item.riskLevel)+'</span>'+
        '<span class="pill state-pill">'+esc(item.decisionState)+'</span>'+
        '<span class="pill state-pill">'+esc(item.actionKind)+'</span>'+
      '</div>'+
      '<div class="approval-text">'+esc(item.summary)+'</div>'+
      '<div class="approval-text"><span class="approval-label">required:</span>'+esc(item.requiredHumanAction)+'</div>'+
      (item.blockedReason?'<div class="approval-text"><span class="approval-label">blocked:</span>'+esc(item.blockedReason)+'</div>':'')+
      (item.safeNextStep?'<div class="approval-text"><span class="approval-label">next:</span>'+esc(item.safeNextStep)+'</div>':'')+
      (item.evidenceRef?'<div class="approval-text"><span class="approval-label">evidence:</span>'+esc(item.evidenceRef)+'</div>':'')+
      '<div class="approval-actions"><button disabled>Approve inactive</button><button disabled>Hold inactive</button><button disabled>Reject inactive</button></div>'+
    '</div>';
  }).join('');
  show('approval-section');
}
function renderDraftOutbox(items){
  var list=document.getElementById('outbox-list');
  if(!list)return;
  var safe=Array.isArray(items)?items:[];
  if(safe.length===0){list.innerHTML='<div class="dim">No draft outbox items.</div>';show('outbox-section');return;}
  list.innerHTML=safe.map(function(item){
    return '<div class="outbox-card">'+
      '<div class="approval-head"><div class="approval-title">'+esc(item.title)+'</div><span class="pill display-pill">draft-only</span></div>'+
      '<div class="approval-meta">'+
        '<span class="pill '+riskClass(item.riskLevel)+'">'+esc(item.riskLevel)+'</span>'+
        '<span class="pill state-pill">'+esc(item.draftState)+'</span>'+
        '<span class="pill state-pill">'+esc(item.actionKind)+'</span>'+
      '</div>'+
      '<div class="approval-text">'+esc(item.summary)+'</div>'+
      '<div class="approval-text"><span class="approval-label">destination:</span>'+esc(item.destinationLabel)+'</div>'+
      '<div class="outbox-body">'+esc(item.bodyPreview)+'</div>'+
      '<div class="approval-text"><span class="approval-label">blocked:</span>'+esc(item.blockedReason)+'</div>'+
      '<div class="approval-text"><span class="approval-label">next:</span>'+esc(item.safeNextStep)+'</div>'+
      '<div class="approval-actions"><button disabled>Send inactive</button><button disabled>Create remote inactive</button><button disabled>Pay inactive</button></div>'+
    '</div>';
  }).join('');
  show('outbox-section');
}
async function go(){
  var btn=document.getElementById('btn');
  var t=document.getElementById('tok').value;
  if(!t){err('Token is required');return;}
  btn.disabled=true;hide('ep');hide('sp');hide('koma-section');hide('caveat-section');hide('next-section');hide('prog-section');hide('display-section');hide('approval-section');hide('outbox-section');
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
    st('fb',b?(b.current+'/'+b.required+' ('+b.nextSession+')'):'- ');
    st('fph',d.phase??'-');
    st('fs',d.dataSource??'-');
    show('sp');
    var ks=d.komashikiState||'HOLD';
    st('koma-state',ks);
    st('koma-msg',KOMA_MSGS[ks]||KOMA_MSGS['HOLD']);
    show('koma-section');
    if(d.caveats&&d.caveats.length>0){
      var ct=d.caveats.map(function(c){return CAVEAT_MSGS[c]||c;}).join('<br>');
      document.getElementById('caveat-text').innerHTML=ct;
      show('caveat-section');
    }
    if(d.nextHumanAction){st('next-val',d.nextHumanAction);show('next-section');}
    if(d.phaseProgress){
      st('prog-val',d.phaseProgress);
      if(d.currentSession)st('sess-val','現在: '+d.currentSession);
      show('prog-section');
    }
    renderDisplayPreview(d.displayTerminalPreview);
    renderApprovalQueue(d.approvalQueue);
    renderDraftOutbox(d.draftOutbox);
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
