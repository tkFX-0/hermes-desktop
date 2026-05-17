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
import MobileApprovalQueueCard from "./MobileApprovalQueueCard";
import MobileDisplayTerminalCard from "./MobileDisplayTerminalCard";

interface Phase2cInfo {
  active: boolean;
  phase2cEnabled: boolean;
  lanUrl?: string;
  pairingToken?: string;
}

type Tab = "status" | "b3" | "approval" | "display" | "go" | "audit" | "stop" | "push" | "agents" | "connect";

const TABS: { id: Tab; label: string }[] = [
  { id: "status",  label: "状態"   },
  { id: "b3",      label: "B3"     },
  { id: "approval", label: "Queue" },
  { id: "display", label: "Face" },
  { id: "go",      label: "GO"     },
  { id: "audit",   label: "証跡"   },
  { id: "stop",    label: "STOP"   },
  { id: "push",    label: "Push"   },
  { id: "agents",  label: "AG"     },
  { id: "connect", label: "接続"   },
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

function Phase2cConnectionPanel({ info }: { info: Phase2cInfo }): React.JSX.Element {
  if (!info.phase2cEnabled || !info.active) {
    return (
      <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: 16, color: "#8b949e", fontSize: 13 }}>
        <div style={{ fontWeight: 600, marginBottom: 6, color: "#c9d1d9" }}>Phase 2C — 同一LAN接続</div>
        <div>MOBILE_CONSOLE_PHASE_2C_ENABLED = false</div>
        <div style={{ marginTop: 6, fontSize: 11 }}>Phase 2C GOが承認されると、ここにLAN URLとペアリングトークンが表示されます。</div>
      </div>
    );
  }
  return (
    <div style={{ background: "#0d2818", border: "1px solid #2ea04333", borderRadius: 8, padding: 16, fontSize: 13 }}>
      <div style={{ fontWeight: 600, marginBottom: 10, color: "#3fb950" }}>Phase 2C アクティブ</div>
      <div style={{ marginBottom: 8 }}>
        <span style={{ color: "#8b949e", fontSize: 11 }}>LAN URL</span>
        <div style={{ fontFamily: "monospace", background: "#161b22", borderRadius: 4, padding: "4px 8px", marginTop: 3, color: "#58a6ff", fontSize: 13, wordBreak: "break-all" }}>{info.lanUrl}</div>
      </div>
      <div>
        <span style={{ color: "#8b949e", fontSize: 11 }}>ペアリングトークン (Electron UI のみ表示)</span>
        <div style={{ fontFamily: "monospace", background: "#161b22", borderRadius: 4, padding: "4px 8px", marginTop: 3, color: "#f778ba", fontSize: 11, wordBreak: "break-all", letterSpacing: 1 }}>{info.pairingToken}</div>
        <div style={{ marginTop: 4, fontSize: 10, color: "#8b949e" }}>このトークンはElectron UIのみに表示。ログ・git・APIに含めない。</div>
      </div>
    </div>
  );
}

/** iPhone Private Console — Phase 2C: same-LAN with pairing token / 実行なし */
export default function MobileConsoleApp(): React.JSX.Element {
  const [tab, setTab] = useState<Tab>("status");
  const [snapshot, setSnapshot] = useState<MobileConsoleSnapshot>(getInitialSnapshot);
  const [phase2cInfo, setPhase2cInfo] = useState<Phase2cInfo>({ active: false, phase2cEnabled: false });
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
      if (api?.getPhase2cConnectionInfo) {
        const connInfo = await api.getPhase2cConnectionInfo();
        setPhase2cInfo({
          active: connInfo.active,
          phase2cEnabled: connInfo.phase2cEnabled,
          lanUrl: connInfo.lanUrl,
          pairingToken: connInfo.pairingToken,
        });
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

  const phaseLabel = phase2cInfo.active ? "2C" : "2B-2";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", background: "#0d1117", color: "#c9d1d9", overflow: "auto", padding: 16, maxWidth: 430, margin: "0 auto", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Smartphone size={18} color="#58a6ff" aria-hidden />
        <span style={{ fontSize: 16, fontWeight: 600 }}>しきしま Private Console</span>
        <span style={{ marginLeft: "auto", fontSize: 10, color: "#8b949e", background: "#21262d", border: "1px solid #30363d", borderRadius: 3, padding: "2px 6px" }}>Phase {phaseLabel}</span>
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
        iPhone Private Console — read-onlyスナップショット。<br />
        コマンド実行・push・Level 3承認・raw値表示はしません。<br />
        <span style={{ color: "#8b949e" }}>dataSource: {snapshot.dataSource}</span>
      </div>

      <TabBar active={tab} onSelect={setTab} />

      <div style={{ flex: 1 }}>
        {tab === "status"  && <MobileStatusCard   snapshot={snapshot} />}
        {tab === "b3"      && <MobileB3Progress   snapshot={snapshot} />}
        {tab === "approval" && <MobileApprovalQueueCard snapshot={snapshot} />}
        {tab === "display" && <MobileDisplayTerminalCard snapshot={snapshot} />}
        {tab === "go"      && <MobileGoDrafts />}
        {tab === "audit"   && <MobileAuditSummary snapshot={snapshot} />}
        {tab === "stop"    && <MobileStopHistory  snapshot={snapshot} />}
        {tab === "push"    && <MobilePushReadiness snapshot={snapshot} />}
        {tab === "agents"  && <MobileAgentTeam    snapshot={snapshot} />}
        {tab === "connect" && <Phase2cConnectionPanel info={phase2cInfo} />}
      </div>
    </div>
  );
}
