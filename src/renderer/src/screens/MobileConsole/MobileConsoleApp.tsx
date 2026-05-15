import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Smartphone } from "lucide-react";
import {
  buildMobileSnapshot,
  MOBILE_CONSOLE_DEFAULT_SNAPSHOT,
} from "../../../../shared/mobile-console";
import type { MobileConsoleSnapshot } from "../../../../shared/mobile-console";
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

const SAFE_FALLBACK = buildMobileSnapshot(undefined, "static_phase1");

function getInitialSnapshot(): MobileConsoleSnapshot {
  return MOBILE_CONSOLE_DEFAULT_SNAPSHOT;
}

function TabBar({ active, onSelect }: { active: Tab; onSelect: (t: Tab) => void }): React.JSX.Element {
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 14, padding: "6px 0", borderBottom: "1px solid #30363d" }}>
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onSelect(tab.id)}
          style={{
            padding: "5px 10px", borderRadius: 5, border: "none",
            background: active === tab.id ? "#1f6feb" : "#21262d",
            color: active === tab.id ? "#f0f6fc" : "#8b949e",
            fontSize: 12, fontWeight: active === tab.id ? 600 : 400,
            cursor: "pointer", minWidth: 38,
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/** iPhone Private Console — Phase 2B-1: IPC-connected read-only / 実行なし */
export default function MobileConsoleApp(): React.JSX.Element {
  const [tab, setTab] = useState<Tab>("status");
  const [snapshot, setSnapshot] = useState<MobileConsoleSnapshot>(getInitialSnapshot);
  const [loading, setLoading] = useState(false);

  const fetchSnapshot = useCallback(async () => {
    setLoading(true);
    try {
      const api = window.mobileConsole;
      if (api?.getRedactedSnapshot) {
        const live = await api.getRedactedSnapshot();
        setSnapshot(live);
      } else {
        setSnapshot(SAFE_FALLBACK);
      }
    } catch {
      setSnapshot(SAFE_FALLBACK);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSnapshot();
  }, [fetchSnapshot]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", background: "#0d1117", color: "#c9d1d9", overflow: "auto", padding: 16, maxWidth: 430, margin: "0 auto", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Smartphone size={18} color="#58a6ff" aria-hidden />
        <span style={{ fontSize: 16, fontWeight: 600 }}>しきしま Private Console</span>
        <span style={{ marginLeft: "auto", fontSize: 10, color: "#8b949e", background: "#21262d", border: "1px solid #30363d", borderRadius: 3, padding: "2px 6px" }}>Phase 2B-1</span>
        <button
          type="button"
          onClick={() => void fetchSnapshot()}
          disabled={loading}
          style={{ background: "none", border: "1px solid #30363d", borderRadius: 4, padding: "3px 6px", cursor: loading ? "wait" : "pointer", color: "#8b949e" }}
          aria-label="スナップショットを更新"
        >
          <RefreshCw size={12} aria-hidden />
        </button>
      </div>

      <div style={{ background: "rgba(88,166,255,0.07)", border: "1px solid rgba(88,166,255,0.3)", borderRadius: 6, padding: "7px 12px", marginBottom: 12, fontSize: 11, color: "#58a6ff", lineHeight: 1.5 }}>
        このiPhone Private Console Phase 2B-1はIPC read-onlyです。<br />
        コマンド実行・push・Level 3承認・raw値表示はしません。<br />
        <span style={{ color: "#8b949e" }}>dataSource: {snapshot.dataSource}</span>
      </div>

      <TabBar active={tab} onSelect={setTab} />

      <div style={{ flex: 1 }}>
        {tab === "status"  && <MobileStatusCard  snapshot={snapshot} />}
        {tab === "b3"      && <MobileB3Progress  snapshot={snapshot} />}
        {tab === "go"      && <MobileGoDrafts />}
        {tab === "audit"   && <MobileAuditSummary snapshot={snapshot} />}
        {tab === "stop"    && <MobileStopHistory  snapshot={snapshot} />}
        {tab === "push"    && <MobilePushReadiness snapshot={snapshot} />}
        {tab === "agents"  && <MobileAgentTeam    snapshot={snapshot} />}
      </div>
    </div>
  );
}
