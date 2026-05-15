import { useState } from "react";
import { Smartphone } from "lucide-react";
import MobileStatusCard from "./MobileStatusCard";
import MobileB3Progress from "./MobileB3Progress";
import MobileGoDrafts from "./MobileGoDrafts";
import MobileAuditSummary from "./MobileAuditSummary";
import MobileStopHistory from "./MobileStopHistory";
import MobilePushReadiness from "./MobilePushReadiness";
import MobileAgentTeam from "./MobileAgentTeam";

type Tab = "status" | "b3" | "go" | "audit" | "stop" | "push" | "agents";

const TABS: { id: Tab; label: string }[] = [
  { id: "status",  label: "状態"   },
  { id: "b3",      label: "B3"     },
  { id: "go",      label: "GO"     },
  { id: "audit",   label: "証跡"   },
  { id: "stop",    label: "STOP"   },
  { id: "push",    label: "Push"   },
  { id: "agents",  label: "AG"     },
];

function TabBar({ active, onSelect }: { active: Tab; onSelect: (t: Tab) => void }): React.JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        flexWrap: "wrap",
        marginBottom: 14,
        padding: "6px 0",
        borderBottom: "1px solid #30363d",
      }}
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onSelect(tab.id)}
          style={{
            padding: "5px 10px",
            borderRadius: 5,
            border: "none",
            background: active === tab.id ? "#1f6feb" : "#21262d",
            color: active === tab.id ? "#f0f6fc" : "#8b949e",
            fontSize: 12,
            fontWeight: active === tab.id ? 600 : 400,
            cursor: "pointer",
            minWidth: 38,
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/** iPhone Private Console — Phase 1 静的UIのみ / 実行なし / APIなし */
export default function MobileConsoleApp(): React.JSX.Element {
  const [tab, setTab] = useState<Tab>("status");

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#0d1117",
        color: "#c9d1d9",
        overflow: "auto",
        padding: 16,
        maxWidth: 430,
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Smartphone size={18} color="#58a6ff" aria-hidden />
        <span style={{ fontSize: 16, fontWeight: 600 }}>しきしま Private Console</span>
        <span style={{
          marginLeft: "auto",
          fontSize: 10,
          color: "#8b949e",
          background: "#21262d",
          border: "1px solid #30363d",
          borderRadius: 3,
          padding: "2px 6px",
        }}>Phase 1 静的</span>
      </div>

      {/* Static notice */}
      <div style={{
        background: "rgba(88,166,255,0.07)",
        border: "1px solid rgba(88,166,255,0.3)",
        borderRadius: 6,
        padding: "7px 12px",
        marginBottom: 12,
        fontSize: 11,
        color: "#58a6ff",
        lineHeight: 1.5,
      }}>
        このiPhone Private Console Phase 1は静的/read-onlyです。<br />
        コマンド実行・push・Level 3承認・raw値表示はしません。
      </div>

      <TabBar active={tab} onSelect={setTab} />

      <div style={{ flex: 1 }}>
        {tab === "status"  && <MobileStatusCard />}
        {tab === "b3"      && <MobileB3Progress />}
        {tab === "go"      && <MobileGoDrafts />}
        {tab === "audit"   && <MobileAuditSummary />}
        {tab === "stop"    && <MobileStopHistory />}
        {tab === "push"    && <MobilePushReadiness />}
        {tab === "agents"  && <MobileAgentTeam />}
      </div>
    </div>
  );
}
