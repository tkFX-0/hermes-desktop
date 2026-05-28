/**
 * Guarded WebSocket transport — display-only face_mode JSON once per call.
 * Standalone WS path (no voice/dance/PCM local service imports).
 * Not invoked when actualDeviceSendEnabled is false (Rally 4A default).
 */

import * as crypto from "crypto";
import * as net from "net";
import type {
  StackChanDisplayTransport,
  StackChanDisplayTransportSendResult
} from "./stackchan-display-transport-types";

export type GuardedWsTransportDeps = {
  connectAndSendFaceMode?: (faceMode: string) => Promise<StackChanDisplayTransportSendResult>;
};

function wsSendText(sock: net.Socket, text: string): void {
  const payload = Buffer.from(text, "utf8");
  const mask = crypto.randomBytes(4);
  const masked = Buffer.alloc(payload.length);
  for (let i = 0; i < payload.length; i++) masked[i] = payload[i] ^ mask[i % 4];
  const n = payload.length;
  let header: Buffer;
  if (n < 126) header = Buffer.from([0x81, 0x80 | n]);
  else if (n < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 0x80 | 126;
    header.writeUInt16BE(n, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81;
    header[1] = 0x80 | 127;
    header.writeBigUInt64BE(BigInt(n), 2);
  }
  sock.write(Buffer.concat([header, mask, masked]));
}

function connectAndSendFaceModeDefault(faceMode: string): Promise<StackChanDisplayTransportSendResult> {
  const host = process.env.STACKCHAN_HOST ?? process.env.STACKCHAN_IP ?? "127.0.0.1";
  const port = 8080;
  const token = process.env.STACKCHAN_CONTROL_TOKEN ?? "";

  return new Promise((resolve) => {
    const key = crypto.randomBytes(16).toString("base64");
    const sock = net.createConnection({ host, port });
    sock.setTimeout(5000);

    const fail = (errorCode: string) => {
      try {
        sock.destroy();
      } catch {
        /* ignore */
      }
      resolve({ ok: false, errorCode });
    };

    sock.on("timeout", () => fail("ws_connect_timeout"));
    sock.on("error", () => fail("ws_connect_error"));

    sock.once("connect", () => {
      sock.write(
        [
          "GET / HTTP/1.1",
          `Host: ${host}:${port}`,
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Key: ${key}`,
          "Sec-WebSocket-Version: 13",
          "",
          ""
        ].join("\r\n")
      );
    });

    let buf = Buffer.alloc(0);
    const onData = (chunk: Buffer): void => {
      buf = Buffer.concat([buf, chunk]);
      if (!buf.includes(Buffer.from("\r\n\r\n"))) return;
      const status = buf.toString("ascii", 0, 12);
      if (!status.includes("101")) {
        fail("ws_handshake_failed");
        return;
      }
      sock.off("data", onData);
      sock.setTimeout(0);
      const payload = token
        ? JSON.stringify({ type: "face_mode", value: faceMode, token })
        : JSON.stringify({ type: "face_mode", value: faceMode });
      wsSendText(sock, payload);
      setTimeout(() => {
        sock.destroy();
        resolve({ ok: true });
      }, 200);
    };
    sock.on("data", onData);
  });
}

export function createGuardedWsStackChanDisplayTransport(
  deps: GuardedWsTransportDeps = {}
): StackChanDisplayTransport {
  const sendImpl = deps.connectAndSendFaceMode ?? connectAndSendFaceModeDefault;
  return {
    mode: "guarded-ws",
    sendFaceMode(faceMode: string) {
      return sendImpl(faceMode);
    }
  };
}
