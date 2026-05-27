import { useState, useCallback, useEffect } from "react";
import Chat, { ChatMessage } from "../Chat/Chat";
import Sessions from "../Sessions/Sessions";
import Agents from "../Agents/Agents";
import Settings from "../Settings/Settings";
import Skills from "../Skills/Skills";
import Soul from "../Soul/Soul";
import Memory from "../Memory/Memory";
import Tools from "../Tools/Tools";
import Gateway from "../Gateway/Gateway";
import Office from "../Office/Office";
import Models from "../Models/Models";
import Schedules from "../Schedules/Schedules";
import Research from "../Research/Research";
import MobileConsoleApp from "../MobileConsole/MobileConsoleApp";
import RemoteNotice from "../../components/RemoteNotice";
import hermeslogo from "../../assets/hermes.png";
import {
  ChatBubble,
  Clock,
  Users,
  Settings as SettingsIcon,
  Puzzle,
  Sparkles,
  Brain,
  Wrench,
  Signal,
  Building,
  Layers,
  Timer,
  Download,
} from "../../assets/icons";
import {
  BarChart2,
  LayoutDashboard,
  Smartphone,
  Sun,
  Moon,
  Monitor,
  BookOpen,
  Activity
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "../../components/useI18n";
import { useTheme } from "../../components/theme-context";
import { SafetyStrip } from "../../components/Shell/SafetyStrip";
import { AgentTheaterPage } from "../AgentTheater/AgentTheaterPage";
import { LibraryExportPage } from "../Library/LibraryExportPage";
import { OperatorPage } from "../Operator/OperatorPage";
import { RuntimeStatusBoardPage } from "../RuntimeStatusBoard";
import {
  toSafetyStripData,
  toOperatorPageData,
} from "../../utils/snapshot-to-page";
import {
  snapshotToSafeSummary,
  holdSummary,
  type SafeSnapshotSummary,
} from "../../../../shared/ichikishima/ui-snapshot-helpers";
import { parseControlCenterShellSnapshot } from "../../../../shared/ichikishima/control-center-shell-ui-contract";
import type {
  LocalChatMessage,
  LocalSettingsData,
} from "../../types/service-contracts";

type View =
  | "chat"
  | "sessions"
  | "agents"
  | "office"
  | "models"
  | "skills"
  | "soul"
  | "memory"
  | "tools"
  | "schedules"
  | "gateway"
  | "settings"
  | "research"
  | "controlCenter"
  | "statusBoard"
  | "mobileConsole"
  | "library";

const NAV_ITEMS: { view: View; icon: LucideIcon; labelKey: string }[] = [
  {
    view: "controlCenter",
    icon: LayoutDashboard as LucideIcon,
    labelKey: "navigation.controlCenter",
  },
  {
    view: "statusBoard",
    icon: Activity as LucideIcon,
    labelKey: "navigation.statusBoard",
  },
  {
    view: "mobileConsole",
    icon: Smartphone as LucideIcon,
    labelKey: "navigation.mobileConsole",
  },
  { view: "chat", icon: ChatBubble, labelKey: "navigation.chat" },
  { view: "sessions", icon: Clock, labelKey: "navigation.sessions" },
  { view: "agents", icon: Users, labelKey: "navigation.agents" },
  { view: "office", icon: Building, labelKey: "navigation.office" },
  { view: "models", icon: Layers, labelKey: "navigation.models" },
  { view: "skills", icon: Puzzle, labelKey: "navigation.skills" },
  { view: "soul", icon: Sparkles, labelKey: "navigation.soul" },
  { view: "memory", icon: Brain, labelKey: "navigation.memory" },
  { view: "tools", icon: Wrench, labelKey: "navigation.tools" },
  { view: "schedules", icon: Timer, labelKey: "navigation.schedules" },
  { view: "gateway", icon: Signal, labelKey: "navigation.gateway" },
  { view: "settings", icon: SettingsIcon, labelKey: "navigation.settings" },
  {
    view: "research",
    icon: BarChart2 as LucideIcon,
    labelKey: "navigation.research",
  },
  {
    view: "library",
    icon: BookOpen as LucideIcon,
    labelKey: "navigation.library",
  },
];

const CC_DEFAULT_SETTINGS: LocalSettingsData = {
  language: "ja",
  theme: "light",
  safetyStripDensity: "normal",
  defaultPage: "operator",
  snapshotRefreshIntervalSeconds: 60,
  staleThresholdSeconds: 60,
  onStale: "switch-to-hold",
  toastEnabled: true,
  toastLingerSeconds: 5,
} as const;

function Layout(): React.JSX.Element {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();
  const [view, setView] = useState<View>("controlCenter");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [activeProfile, setActiveProfile] = useState("default");
  // Lazy mount: only render Office after first visit, then keep mounted
  const [officeVisited, setOfficeVisited] = useState(false);
  // Remote mode — many screens show "not available" instead of empty data
  const [remoteMode, setRemoteMode] = useState(false);
  // Command Center state
  const [ccMessages, setCcMessages] = useState<LocalChatMessage[]>([]);
  const [ccSettings] = useState<LocalSettingsData>(CC_DEFAULT_SETTINGS);
  const [ccSafeSummary, setCcSafeSummary] = useState<SafeSnapshotSummary>(
    () => holdSummary(0, "unavailable"),
  );
  const [stackchanOnline, setStackchanOnline] = useState(false);
  const [voicevoxReady, setVoicevoxReady] = useState(false);
  const [stackchanStyle, setStackchanStyle] = useState<string | undefined>(undefined);
  const [stackchanBattery, setStackchanBattery] = useState<number | undefined>(undefined);

  // StackChan + VOICEVOX status polling — 15s interval
  useEffect(() => {
    const check = (): void => {
      window.hermesAPI.stackchanStatus()
        .then((s) => {
          setStackchanOnline(s.connected);
          setVoicevoxReady(s.voicevoxReady);
          setStackchanStyle(s.styleId);
          setStackchanBattery(s.battery);
        })
        .catch(() => { setStackchanOnline(false); setVoicevoxReady(false); });
    };
    check();
    const id = setInterval(check, 15000);
    return () => clearInterval(id);
  }, []);

  // Re-check remote mode on tab switch (picks up Settings changes)
  useEffect(() => {
    window.hermesAPI.isRemoteMode().then(setRemoteMode);
  }, [view]);

  // CC-01/02: Poll Control Center snapshot when the controlCenter tab is active
  useEffect(() => {
    if (view !== "controlCenter") return;
    const intervalSec = ccSettings.snapshotRefreshIntervalSeconds ?? 30;

    async function fetchSnapshot(): Promise<void> {
      try {
        const raw: unknown = await window.ichikishimaControlCenter.getAppSnapshot();
        if (!raw) { setCcSafeSummary(holdSummary(0, "snapshot_null")); return; }
        const parsed = parseControlCenterShellSnapshot(raw);
        if (!parsed.ok) { setCcSafeSummary(holdSummary(0, parsed.errorCode)); return; }
        setCcSafeSummary(snapshotToSafeSummary(parsed.snapshot, intervalSec));
      } catch {
        setCcSafeSummary(holdSummary(0, "ipc_error"));
      }
    }

    void fetchSnapshot();
    const tid = window.setInterval(() => { void fetchSnapshot(); }, intervalSec * 1000);
    return () => window.clearInterval(tid);
  }, [view, ccSettings.snapshotRefreshIntervalSeconds]);

  // Auto-update state
  const [updateVersion, setUpdateVersion] = useState<string | null>(null);
  const [updateState, setUpdateState] = useState<
    "available" | "downloading" | "ready" | null
  >(null);
  const [downloadPercent, setDownloadPercent] = useState(0);

  useEffect(() => {
    const cleanupAvailable = window.hermesAPI.onUpdateAvailable((info) => {
      setUpdateVersion(info.version);
      setUpdateState("available");
    });
    const cleanupProgress = window.hermesAPI.onUpdateDownloadProgress(
      (info) => {
        setDownloadPercent(info.percent);
      },
    );
    const cleanupDownloaded = window.hermesAPI.onUpdateDownloaded(() => {
      setUpdateState("ready");
    });
    return () => {
      cleanupAvailable();
      cleanupProgress();
      cleanupDownloaded();
    };
  }, []);

  async function handleUpdate(): Promise<void> {
    if (updateState === "available") {
      setUpdateState("downloading");
      await window.hermesAPI.downloadUpdate();
    } else if (updateState === "ready") {
      await window.hermesAPI.installUpdate();
    }
  }

  const handleNewChat = useCallback(() => {
    // Abort any in-flight chat before clearing
    window.hermesAPI.abortChat();
    setMessages([]);
    setCurrentSessionId(null);
    setView("chat");
  }, []);

  // Listen for menu IPC events (Cmd+N, Cmd+K from app menu)
  useEffect(() => {
    const cleanupNewChat = window.hermesAPI.onMenuNewChat(() => {
      handleNewChat();
    });
    const cleanupSearch = window.hermesAPI.onMenuSearchSessions(() => {
      setView("sessions");
    });
    return () => {
      cleanupNewChat();
      cleanupSearch();
    };
  }, [handleNewChat]);

  const handleSelectProfile = useCallback((name: string) => {
    setActiveProfile(name);
    setMessages([]);
    setCurrentSessionId(null);
  }, []);

  const handleResumeSession = useCallback(async (sessionId: string) => {
    const dbMessages = await window.hermesAPI.getSessionMessages(sessionId);
    const chatMessages: ChatMessage[] = dbMessages.map((m) => ({
      id: `db-${m.id}`,
      role: m.role === "user" ? "user" : "agent",
      content: m.content,
    }));
    setMessages(chatMessages);
    setCurrentSessionId(sessionId);
    setView("chat");
  }, []);

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={hermeslogo} height={30} alt="" />
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ view: v, icon: Icon, labelKey }) => (
            <button
              key={v}
              className={`sidebar-nav-item ${view === v ? "active" : ""}`}
              onClick={() => {
                if (v === "office") setOfficeVisited(true);
                setView(v);
              }}
            >
              <Icon size={16} />
              {t(labelKey)}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          {/* UI-02: theme toggle */}
          <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
            {(["light", "dark", "system"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                title={t}
                style={{
                  flex: 1,
                  padding: "4px 0",
                  borderRadius: 4,
                  border: "1px solid var(--border, rgba(255,255,255,0.06))",
                  background: theme === t ? "var(--bg-active, #424242)" : "transparent",
                  color: theme === t ? "var(--text-primary, #ececec)" : "var(--text-muted, #8e8e8e)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {t === "light" && <Sun size={12} />}
                {t === "dark"  && <Moon size={12} />}
                {t === "system" && <Monitor size={12} />}
              </button>
            ))}
          </div>
          {updateState && (
            <button className="sidebar-update-btn" onClick={handleUpdate}>
              <Download size={13} />
              {updateState === "available" && (
                <span>
                  {t("common.updateAvailable", { version: updateVersion })}
                </span>
              )}
              {updateState === "downloading" && (
                <span>
                  {t("common.downloading", { percent: downloadPercent })}
                </span>
              )}
              {updateState === "ready" && (
                <span>{t("common.restartToUpdate")}</span>
              )}
            </button>
          )}
          <div className="sidebar-footer-text">
            {activeProfile === "default" ? t("common.appName") : activeProfile}
          </div>
        </div>
      </aside>

      <main className="content">
        <div
          style={{
            display: view === "chat" ? "flex" : "none",
            flex: 1,
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Chat
            messages={messages}
            setMessages={setMessages}
            sessionId={currentSessionId}
            profile={activeProfile}
            onNewChat={handleNewChat}
          />
        </div>
        {view === "sessions" &&
          (remoteMode ? (
            <RemoteNotice feature="Sessions" />
          ) : (
            <Sessions
              onResumeSession={handleResumeSession}
              onNewChat={handleNewChat}
              currentSessionId={currentSessionId}
            />
          ))}
        {view === "agents" &&
          (remoteMode ? (
            <RemoteNotice feature="Profiles" />
          ) : (
            <Agents
              activeProfile={activeProfile}
              onSelectProfile={handleSelectProfile}
              onChatWith={(name: string) => {
                handleSelectProfile(name);
                setView("chat");
              }}
            />
          ))}
        {officeVisited && (
          <div
            style={{
              display: view === "office" ? "flex" : "none",
              flex: 1,
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Office visible={view === "office"} />
          </div>
        )}
        {view === "models" && <Models />}
        {view === "skills" &&
          (remoteMode ? (
            <RemoteNotice feature="Skills" />
          ) : (
            <Skills profile={activeProfile} />
          ))}
        {view === "soul" &&
          (remoteMode ? (
            <RemoteNotice feature="Persona" />
          ) : (
            <Soul profile={activeProfile} />
          ))}
        {view === "memory" &&
          (remoteMode ? (
            <RemoteNotice feature="Memory" />
          ) : (
            <Memory profile={activeProfile} />
          ))}
        {view === "tools" &&
          (remoteMode ? (
            <RemoteNotice feature="Tools" />
          ) : (
            <Tools profile={activeProfile} />
          ))}
        {view === "schedules" &&
          (remoteMode ? (
            <RemoteNotice feature="Schedules" />
          ) : (
            <Schedules profile={activeProfile} />
          ))}
        {view === "gateway" &&
          (remoteMode ? (
            <RemoteNotice feature="Gateway" />
          ) : (
            <Gateway profile={activeProfile} />
          ))}
        <div
          style={{
            display: view === "settings" ? "flex" : "none",
            flex: 1,
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Settings profile={activeProfile} visible={view === "settings"} />
        </div>
        {view === "research" && (
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Research />
          </div>
        )}
        {view === "controlCenter" && (
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              overflow: "hidden",
              minHeight: 0,
              background: "#0d1117",
            }}
          >
            {/* Safety invariants strip — always visible */}
            <SafetyStrip
              decision={toSafetyStripData(ccSafeSummary).decision}
              productionReady={toSafetyStripData(ccSafeSummary).productionReady}
              execution={toSafetyStripData(ccSafeSummary).execution}
              stale={toSafetyStripData(ccSafeSummary).stale}
            />

            {/* Integrated scrollable body */}
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
              {/* 1. Room tabs (部屋 / 3D / カード) + Chat */}
              <AgentTheaterPage
                decision={toOperatorPageData(ccSafeSummary).decision}
                messages={ccMessages}
                stackchanOnline={stackchanOnline}
                voicevoxReady={voicevoxReady}
                stackchanStyle={stackchanStyle}
                stackchanBattery={stackchanBattery}
                onSend={async (content) => {
                  // Add user message immediately
                  const userMsg: LocalChatMessage = {
                    id: `user-${Date.now()}`,
                    role: "user" as const,
                    content,
                    timestampUnixMs: Date.now(),
                  };
                  setCcMessages((prev) => [...prev, userMsg]);
                  // thinking state managed via placeholder message

                  // Add "thinking" placeholder
                  const thinkingId = `thinking-${Date.now()}`;
                  setCcMessages((prev) => [...prev, {
                    id: thinkingId,
                    role: "assistant" as const,
                    content: "…",
                    timestampUnixMs: Date.now(),
                  }]);

                  // Send to Grok 4.3 via xai-oauth
                  try {
                    const result = await window.hermesAPI.shikishimaGrokChat(content);
                    const reply = result.success
                      ? result.reply
                      : `[エラー] ${result.error ?? "応答なし"}`;
                    // Replace thinking placeholder with real reply
                    setCcMessages((prev) =>
                      prev.map((m) =>
                        m.id === thinkingId
                          ? { ...m, id: `grok-${Date.now()}`, content: reply }
                          : m,
                      ),
                    );
                    // StackChan/Discord outputs are prepared as display-only drafts until human GO.
                    if (result.success) {
                      window.hermesAPI.shikishimaChannelOutputDraft({
                        responseId: `grok-${Date.now()}`,
                        agentId: "shikishima",
                        modelId: "grok-chat-renderer",
                        fullResponse: reply,
                        spokenResponse: reply,
                        reasoningLevel: "standard",
                        evidenceFile: "docs/shikishima/CHANNEL_OUTPUT_DRAFT_EVIDENCE.md",
                      }).catch(() => {/* draft failure is non-blocking */});
                    }
                  } catch (e) {
                    setCcMessages((prev) =>
                      prev.map((m) =>
                        m.id === thinkingId
                          ? { ...m, id: `err-${Date.now()}`, content: `[接続エラー] ${e instanceof Error ? e.message : String(e)}` }
                          : m,
                      ),
                    );
                  } finally {
                    // complete
                  }
                }}
                lang="ja"
              />

              {/* 2. Operator status */}
              <div style={{ padding: "0 20px 16px" }}>
                <OperatorPage
                  data={toOperatorPageData(ccSafeSummary)}
                  lang="ja"
                />
              </div>
            </div>

            {/* Footer — safety disclaimer */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 4,
                padding: "5px 16px",
                borderTop: "1px solid #21262d",
                background: "#080c14",
                flexShrink: 0,
              }}
            >
              <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, color: "#484f58", letterSpacing: 0.5 }}>
                しきしま · Private Console
              </span>
              <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, color: "#484f58", letterSpacing: 0.5 }}>
                このUIから外部実行は発生しません
              </span>
            </div>
          </div>
        )}
        {view === "statusBoard" && (
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              overflow: "hidden",
              minHeight: 0,
            }}
          >
            <RuntimeStatusBoardPage />
          </div>
        )}
        {view === "mobileConsole" && (
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <MobileConsoleApp />
          </div>
        )}
        {view === "library" && (
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <LibraryExportPage lang="ja" />
          </div>
        )}
      </main>
    </div>
  );
}

export default Layout;
