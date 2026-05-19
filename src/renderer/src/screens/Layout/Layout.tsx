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
import { BarChart2, LayoutDashboard, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "../../components/useI18n";
import { PageShell } from "../../components/Shell/PageShell";
import { AgentTheaterPage } from "../AgentTheater/AgentTheaterPage";
import { OperatorPage } from "../Operator/OperatorPage";
import { CommandChatPage } from "../CommandChat/CommandChatPage";
import { StackChanPage } from "../StackChan/StackChanPage";
import { OutboxPage } from "../Outbox/OutboxPage";
import { QueuePage } from "../Queue/QueuePage";
import { GoPage } from "../GoPage/GoPage";
import { EvidencePage } from "../Evidence/EvidencePage";
import { StopPage } from "../Stop/StopPage";
import { PushPage } from "../Push/PushPage";
import { CommandSettingsPage } from "../CommandSettings/CommandSettingsPage";
import { CommandHelpPage } from "../CommandHelp/CommandHelpPage";
import type { PageId } from "../../../../shared/ichikishima/ui-page-types";
import {
  toSafetyStripData,
  toOperatorPageData,
  toChatPageData,
} from "../../utils/snapshot-to-page";
import type {
  LocalChatMessage,
  StackChanStatusData,
  PushReadinessData,
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
  | "mobileConsole";

const NAV_ITEMS: { view: View; icon: LucideIcon; labelKey: string }[] = [
  {
    view: "controlCenter",
    icon: LayoutDashboard as LucideIcon,
    labelKey: "navigation.controlCenter",
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
];

const CC_HOLD_STACKCHAN: StackChanStatusData = {
  connection: "unknown",
  physicalOperation: false,
  voiceActive: false,
  cameraActive: false,
  micActive: false,
  stale: true,
} as const;

const CC_HOLD_PUSH: PushReadinessData = {
  branch: "—",
  commitsAhead: 0,
  staged: 0,
  trackedDirty: 0,
  pushGoReceived: false,
  stale: true,
} as const;

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
  const [view, setView] = useState<View>("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [activeProfile, setActiveProfile] = useState("default");
  // Lazy mount: only render Office after first visit, then keep mounted
  const [officeVisited, setOfficeVisited] = useState(false);
  // Remote mode — many screens show "not available" instead of empty data
  const [remoteMode, setRemoteMode] = useState(false);
  // Command Center state
  const [ccPage, setCcPage] = useState<PageId>("operator");
  const [ccMessages, setCcMessages] = useState<LocalChatMessage[]>([]);
  const [ccSettings, setCcSettings] = useState<LocalSettingsData>(CC_DEFAULT_SETTINGS);

  // Re-check remote mode on tab switch (picks up Settings changes)
  useEffect(() => {
    window.hermesAPI.isRemoteMode().then(setRemoteMode);
  }, [view]);

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

  function handleCcSettingUpdate<K extends keyof LocalSettingsData>(
    key: K,
    value: LocalSettingsData[K],
  ): void {
    setCcSettings((prev) => ({ ...prev, [key]: value }));
  }

  function renderCcPage(): React.ReactNode {
    switch (ccPage) {
      case "theater":
        return (
          <AgentTheaterPage
            decision={toOperatorPageData(null).decision}
            lang="ja"
          />
        );
      case "operator":
      case "inspector":
        return <OperatorPage data={toOperatorPageData(null)} lang="ja" />;
      case "chat":
        return (
          <CommandChatPage
            messages={ccMessages}
            safety={toChatPageData(null)}
            onSend={(content) =>
              setCcMessages((prev) => [
                ...prev,
                {
                  id: `local-${Date.now()}`,
                  role: "user" as const,
                  content,
                  timestampUnixMs: Date.now(),
                },
              ])
            }
            lang="ja"
          />
        );
      case "stackchan":
        return (
          <StackChanPage
            status={CC_HOLD_STACKCHAN}
            onCopyStatus={() =>
              void navigator.clipboard.writeText("StackChan: unknown / stale")
            }
            lang="ja"
          />
        );
      case "outbox":
        return <OutboxPage items={[]} onCopy={() => {}} stale lang="ja" />;
      case "queue":
        return <QueuePage items={[]} onCopySummary={() => {}} stale lang="ja" />;
      case "go":
        return <GoPage templates={[]} onCopyTemplate={() => {}} stale lang="ja" />;
      case "evidence":
        return <EvidencePage records={[]} onCopy={() => {}} stale lang="ja" />;
      case "stop":
        return <StopPage events={[]} onCopy={() => {}} stale lang="ja" />;
      case "push":
        return (
          <PushPage
            data={CC_HOLD_PUSH}
            onCopySummary={() =>
              void navigator.clipboard.writeText("push: stale")
            }
            lang="ja"
          />
        );
      case "settings":
        return (
          <CommandSettingsPage
            settings={ccSettings}
            onUpdateSetting={handleCcSettingUpdate}
            lang="ja"
          />
        );
      case "help":
      default:
        return <CommandHelpPage lang="ja" />;
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
            }}
          >
            <PageShell
              activePage={ccPage}
              onNavigate={setCcPage}
              safety={toSafetyStripData(null)}
              lang="ja"
            >
              {renderCcPage()}
            </PageShell>
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
      </main>
    </div>
  );
}

export default Layout;
