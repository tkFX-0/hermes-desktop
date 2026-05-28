#!/usr/bin/env node
/** Redacted StackChan WS auth probe. Sends a harmless face_mode command only. */
import * as crypto from "crypto";
import * as net from "net";
import {
  resolveStackChanHost,
  resolveStackChanToken
} from "../src/main/stackchan-voice-route/stackchan-voice-env.ts";

function encodeClientTextFrame(text) {
  const payload = Buffer.from(text, "utf8");
  const mask = crypto.randomBytes(4);
  const masked = Buffer.alloc(payload.length);
  for (let i = 0; i < payload.length; i++) masked[i] = payload[i] ^ mask[i % 4];
  const n = payload.length;
  let header;
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
  return Buffer.concat([header, mask, masked]);
}

function parseFrames(buffer) {
  const frames = [];
  let offset = 0;
  while (buffer.length - offset >= 2) {
    const b0 = buffer[offset];
    const b1 = buffer[offset + 1];
    const opcode = b0 & 0x0f;
    const masked = (b1 & 0x80) !== 0;
    let length = b1 & 0x7f;
    let headerLength = 2;
    if (length === 126) {
      if (buffer.length - offset < 4) break;
      length = buffer.readUInt16BE(offset + 2);
      headerLength = 4;
    } else if (length === 127) {
      if (buffer.length - offset < 10) break;
      const big = buffer.readBigUInt64BE(offset + 2);
      if (big > BigInt(Number.MAX_SAFE_INTEGER)) break;
      length = Number(big);
      headerLength = 10;
    }
    const maskLength = masked ? 4 : 0;
    const frameLength = headerLength + maskLength + length;
    if (buffer.length - offset < frameLength) break;
    const payloadStart = offset + headerLength + maskLength;
    let payload = Buffer.from(buffer.subarray(payloadStart, payloadStart + length));
    if (masked) {
      const mask = buffer.subarray(offset + headerLength, offset + headerLength + 4);
      for (let i = 0; i < payload.length; i++) payload[i] ^= mask[i % 4];
    }
    frames.push({ opcode, payload });
    offset += frameLength;
  }
  return { frames, rest: buffer.subarray(offset) };
}

function connectWs(host, port) {
  return new Promise((resolve, reject) => {
    const key = crypto.randomBytes(16).toString("base64");
    const sock = net.createConnection({ host, port });
    sock.setTimeout(5000);
    sock.on("timeout", () => reject(new Error("timeout")));
    sock.on("error", reject);
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
    const onData = (chunk) => {
      buf = Buffer.concat([buf, chunk]);
      const split = buf.indexOf("\r\n\r\n");
      if (split === -1) return;
      const status = buf.toString("ascii", 0, 12);
      sock.off("data", onData);
      sock.setTimeout(0);
      if (!status.includes("101")) reject(new Error("handshake_failed"));
      else resolve({ sock, rest: buf.subarray(split + 4) });
    };
    sock.on("data", onData);
  });
}

function waitForErrorOrTimeout(sock, initialBuffer, ms) {
  return new Promise((resolve) => {
    let buffer = initialBuffer;
    let done = false;
    const finish = (reason) => {
      if (done) return;
      done = true;
      sock.off("data", onData);
      clearTimeout(timer);
      resolve(reason);
    };
    const inspect = () => {
      const parsed = parseFrames(buffer);
      buffer = Buffer.from(parsed.rest);
      for (const frame of parsed.frames) {
        if (frame.opcode !== 1) continue;
        try {
          const msg = JSON.parse(frame.payload.toString("utf8"));
          if (msg?.type === "error" && typeof msg.reason === "string") {
            finish(msg.reason);
            return;
          }
        } catch {
          // ignore non-JSON text frames
        }
      }
    };
    const onData = (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      inspect();
    };
    const timer = setTimeout(() => finish(null), ms);
    sock.on("data", onData);
    inspect();
  });
}

const host = resolveStackChanHost();
const token = resolveStackChanToken();
const result = {
  hostConfigured: host !== "127.0.0.1",
  tokenPresent: token.length > 0,
  authProbe: "not_run",
  rejectedReason: null
};

try {
  const { sock, rest } = await connectWs(host, 8080);
  const payload = token
    ? { type: "face_mode", value: "normal", token }
    : { type: "face_mode", value: "normal" };
  sock.write(encodeClientTextFrame(JSON.stringify(payload)));
  const reason = await waitForErrorOrTimeout(sock, rest, 350);
  result.authProbe = reason ? "rejected" : "accepted_or_no_error";
  result.rejectedReason = reason;
  sock.destroy();
} catch (error) {
  result.authProbe = "connect_failed";
  result.rejectedReason = error instanceof Error ? error.message : "unknown";
}

console.log(JSON.stringify(result));
