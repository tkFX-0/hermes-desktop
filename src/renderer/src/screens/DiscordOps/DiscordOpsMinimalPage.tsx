/**
 * Discord-only minimal UI — no Control Center polling required.
 */

import { useEffect, useState } from "react";

interface RuntimeModePayload {
  discordOnlyUi: boolean;
  constitutionalGoActive: boolean;
  operationalReleaseActive: boolean;
  shadowModeEffective: boolean;
  humanGoNote: string | null;
}

export function DiscordOpsMinimalPage(): React.JSX.Element {
  const [mode, setMode] = useState<RuntimeModePayload | null>(null);
  const [sidebot, setSidebot] = useState<string>("…");
  const [stackchan, setStackchan] = useState<string>("…");

  useEffect(() => {
    window.hermesAPI
      .shikishimaGetRuntimeMode?.()
      .then((m) => setMode(m as RuntimeModePayload))
      .catch(() => setMode(null));
    window.hermesAPI
      .stackchanStatus()
      .then((s) => setStackchan(s.connected ? "connected" : "offline"))
      .catch(() => setStackchan("error"));
  }, []);

  return (
    <div
      style={{
        flex: 1,
        padding: 24,
        background: "#0d1117",
        color: "#c9d1d9",
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: 13,
        lineHeight: 1.6,
      }}
    >
      <h1 style={{ fontSize: 18, marginBottom: 8 }}>しきしま · Discord 運用</h1>
      <p style={{ color: "#8b949e", marginBottom: 20 }}>
        確認は Discord の指示チャンネルで行います。管制センターは不要です。
      </p>
      <table style={{ borderCollapse: "collapse", width: "100%", maxWidth: 520 }}>
        <tbody>
          <tr>
            <td style={{ padding: "6px 12px 6px 0", color: "#8b949e" }}>憲法GO</td>
            <td>{mode?.constitutionalGoActive ? "active" : "off"}</td>
          </tr>
          <tr>
            <td style={{ padding: "6px 12px 6px 0", color: "#8b949e" }}>Track D</td>
            <td>{mode?.operationalReleaseActive ? "active" : "off"}</td>
          </tr>
          <tr>
            <td style={{ padding: "6px 12px 6px 0", color: "#8b949e" }}>Shadow</td>
            <td>{mode?.shadowModeEffective ? "HOLD" : "services on"}</td>
          </tr>
          <tr>
            <td style={{ padding: "6px 12px 6px 0", color: "#8b949e" }}>StackChan</td>
            <td>{stackchan}</td>
          </tr>
          <tr>
            <td style={{ padding: "6px 12px 6px 0", color: "#8b949e" }}>SideBot</td>
            <td>{sidebot}</td>
          </tr>
        </tbody>
      </table>
      <p style={{ marginTop: 24, color: "#58a6ff" }}>
        Discord: 指示チャンネルにメッセージ / !status !help
      </p>
      <p style={{ marginTop: 8, color: "#8b949e", fontSize: 11 }}>
        モデル一覧: src/shared/shikishima-agent-model-registry.json
      </p>
    </div>
  );
}
