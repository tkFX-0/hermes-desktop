#!/usr/bin/env node
/** Redacted StackChan preflight (no host/IP in output). */
import * as net from "net";
import { resolveStackChanHost } from "../src/main/stackchan-voice-route/stackchan-voice-env.ts";
import { checkStackchanLocalStatus } from "../src/main/stackchan-local-service.ts";

function tcpProbe(host, port, ms = 4000) {
  return new Promise((resolve) => {
    const sock = net.createConnection({ host, port });
    sock.setTimeout(ms);
    sock.once("connect", () => {
      sock.destroy();
      resolve({ ok: true, error: null });
    });
    sock.once("timeout", () => {
      sock.destroy();
      resolve({ ok: false, error: "timeout" });
    });
    sock.once("error", (e) => {
      sock.destroy();
      resolve({ ok: false, error: e.code || "connect_failed" });
    });
  });
}

const host = resolveStackChanHost();
const tcp = await tcpProbe(host, 8080);
const s = await checkStackchanLocalStatus();
console.log(
  JSON.stringify({
    connected: s.connected,
    voicevoxReady: s.voicevoxReady,
    stackchanIp: s.stackchanIp,
    hostConfigured: host !== "127.0.0.1",
    hostLooksLocalhost: host.startsWith("127."),
    hostLooksPrivateLan:
      /^192\.168\./.test(host) ||
      /^10\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(host),
    tcpPort8080: tcp.ok,
    tcpError: tcp.error,
    styleId: s.styleId ?? null,
    battery: s.battery ?? null
  })
);
