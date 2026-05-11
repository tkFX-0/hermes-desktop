import { useState, useEffect } from "react";

const DASHBOARD_URL = "http://localhost:8765";

export default function Research(): React.JSX.Element {
  const [alive, setAlive] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`${DASHBOARD_URL}/api/status`)
      .then((r) => r.json())
      .then(() => setAlive(true))
      .catch(() => setAlive(false));
  }, []);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", background: "#0d1117" }}>
      {alive === false && (
        <div style={{
          padding: "24px", textAlign: "center", color: "#8b949e",
          background: "#161b22", borderBottom: "1px solid #30363d",
          fontSize: 13,
        }}>
          ダッシュボードに接続できません。ヘルメスを起動してください。
          <button
            onClick={() => {
              fetch(`${DASHBOARD_URL}/api/status`)
                .then(() => setAlive(true))
                .catch(() => setAlive(false));
            }}
            style={{
              marginLeft: 12, padding: "4px 12px", borderRadius: 6,
              background: "#1f2d3d", color: "#58a6ff",
              border: "1px solid #30363d", cursor: "pointer", fontSize: 12,
            }}
          >
            再接続
          </button>
        </div>
      )}
      <iframe
        src={DASHBOARD_URL}
        style={{ flex: 1, border: "none", width: "100%", height: "100%" }}
        title="Hermes HTFEA Research Dashboard"
        onLoad={() => setAlive(true)}
        onError={() => setAlive(false)}
      />
    </div>
  );
}
