import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  Menu,
  Notification,
  Tray,
  nativeImage,
  screen,
} from "electron";

// GPU/Renderer 対策 (Windows 11)
// disableHardwareAcceleration のみ使用。
// disable-gpu + use-angle=swiftshader は矛盾 (前者がGPUプロセスを殺すため後者が機能しない)。
app.disableHardwareAcceleration();
app.commandLine.appendSwitch("no-sandbox");
app.commandLine.appendSwitch("disable-setuid-sandbox");

// シングルインスタンス強制 (複数起動でウィンドウが開かなくなる問題を防止)
const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  // 2つ目のインスタンス → 既存ウィンドウをフォーカスして即終了
  app.quit();
}

import { join } from "path";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { exec, spawn } from "child_process";
import { registerControlCenterReadonlyIpcHandlers } from "./ichikishima/control-center/control-center-readonly-ipc";
import { registerRuntimeReadonlyStatusBoardIpcHandlers } from "./runtime-readonly-status-board/runtime-readonly-status-board-ipc";
import {
  registerMobileConsoleIpcHandler,
  MOBILE_CONSOLE_PHASE_2C_ENABLED,
  startPhase2cServer,
} from "./mobile-console";
import type { Phase2cStartResult } from "./mobile-console";
import {
  controlCenterElectronHintsFromApp,
  resolveControlCenterPathResolution,
} from "./ichikishima/control-center/control-center-project-root-resolution";
import type { ControlCenterDataProviderParams } from "./ichikishima/control-center/control-center-data-provider";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import type { AppUpdater } from "electron-updater";
import icon from "../../resources/icon.png?asset";
import {
  checkInstallStatus,
  runInstall,
  getHermesVersion,
  clearVersionCache,
  runHermesDoctor,
  runHermesUpdate,
  checkOpenClawExists,
  runClawMigrate,
  runHermesBackup,
  runHermesImport,
  runHermesDump,
  listMcpServers,
  discoverMemoryProviders,
  readLogs,
  InstallProgress,
} from "./installer";
import {
  sendMessage,
  startGateway,
  stopGateway,
  isGatewayRunning,
  isRemoteMode,
  testRemoteConnection,
  stopHealthPolling,
  restartGateway,
} from "./hermes";
import {
  getClaw3dStatus,
  setupClaw3d,
  startDevServer,
  stopDevServer,
  startAdapter,
  stopAdapter,
  startAll as startClaw3dAll,
  stopAll as stopClaw3d,
  getClaw3dLogs,
  setClaw3dPort,
  getClaw3dPort,
  setClaw3dWsUrl,
  getClaw3dWsUrl,
  Claw3dSetupProgress,
} from "./claw3d";
import {
  readEnv,
  setEnvValue,
  getConfigValue,
  setConfigValue,
  getHermesHome,
  getModelConfig,
  setModelConfig,
  getCredentialPool,
  setCredentialPool,
  getConnectionConfig,
  setConnectionConfig,
  getPlatformEnabled,
  setPlatformEnabled,
} from "./config";
import { listSessions, getSessionMessages, searchSessions } from "./sessions";
import {
  syncSessionCache,
  listCachedSessions,
  updateSessionTitle,
} from "./session-cache";
import { listModels, addModel, removeModel, updateModel } from "./models";
import {
  listProfiles,
  createProfile,
  deleteProfile,
  setActiveProfile,
} from "./profiles";
import {
  readMemory,
  addMemoryEntry,
  updateMemoryEntry,
  removeMemoryEntry,
  writeUserProfile,
} from "./memory";
import { readSoul, writeSoul, resetSoul } from "./soul";
import { getToolsets, setToolsetEnabled } from "./tools";
import {
  listInstalledSkills,
  listBundledSkills,
  getSkillContent,
  installSkill,
  uninstallSkill,
} from "./skills";
import {
  listCronJobs,
  createCronJob,
  removeCronJob,
  pauseCronJob,
  resumeCronJob,
  triggerCronJob,
} from "./cronjobs";
import { getAppLocale, setAppLocale } from "./locale";
import { writeEvidenceNote } from "./library-export";
import type { LibraryWriteRequest } from "./library-export";
import { executeDiscordReadIntake } from "./shikishima-full-autonomy/discord-read-executor";
import { readDiscordChannel } from "./discord-intake";
import { sendDiscordMessage, getDiscordChannelIds } from "./discord-intake";
import { startDailyResearchPipeline } from "./research-pipeline";
import type { ResearchReportInput } from "./research-report-generator";
import { stopNewsWatcher } from "./news-watcher";
import { grokChat, checkXPremiumQuota } from "./shikishima-grok-chat";
import { claudeCodeTask } from "./claude-code-service";
import { dispatchToAgent, routeTask } from "./agent-router";
import { AGENT_DEFINITIONS, WORKER_DEFINITIONS } from "./agent-definitions";
import {
  flushSessionToMediumMemory,
  addLongTermFact,
  loadLongTermMemory,
  loadMediumTermMemory,
} from "./memory-network";
import { checkGroqAvailability } from "./groq-service";
import { checkGeminiAvailability } from "./gemini-service";
import { startSideBot, stopSideBot } from "./sidebot-service";
import { isSidebotHoldActive } from "./sidebot-hold";
import {
  stackchanPetMode,
  checkStackchanLocalStatus,
  startStackchanLocalStatusCheck,
  stopStackchanLocalStatusCheck,
  setVoicevoxSpeed,
  getVoicevoxSpeed,
  setVoicevoxSpeaker,
  getVoicevoxSpeaker,
} from "./stackchan-local-service";
import {
  startSttServer,
  stopSttServer,
  getSttServiceState,
  checkWhisperInstalled,
} from "./stackchan-stt-service";
import {
  createActionPreflight,
  prepareChannelOutputBundle,
  prepareStackchanSpeechDraft,
} from "./shikishima-core";

import { resolveShikishimaRuntimeMode } from "./shikishima-runtime-mode";
import { guardedStackchanSayLocal } from "./stackchan-guarded-bridge";

process.on("uncaughtException", (err) => {
  console.error("[MAIN UNCAUGHT]", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("[MAIN UNHANDLED REJECTION]", reason);
});

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let currentChatAbort: (() => void) | null = null;
let phase2cInstance: Phase2cStartResult | null = null;

// Extend app with quit flag to distinguish tray-hide vs real quit
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Electron {
    interface App { isQuitting: boolean }
  }
}
app.isQuitting = false;

// UI-01: window bounds persistence
interface WindowBounds { x: number; y: number; width: number; height: number; }
function windowBoundsPath(): string {
  return join(app.getPath("userData"), "window-bounds.json");
}
function loadWindowBounds(): WindowBounds | null {
  try {
    const p = windowBoundsPath();
    if (!existsSync(p)) return null;
    const parsed = JSON.parse(readFileSync(p, "utf8")) as unknown;
    if (typeof parsed !== "object" || parsed === null) return null;
    const b = parsed as Record<string, unknown>;
    if (
      typeof b.x !== "number" || typeof b.y !== "number" ||
      typeof b.width !== "number" || typeof b.height !== "number" ||
      b.width < 800 || b.height < 600
    ) return null;
    const bounds = { x: b.x, y: b.y, width: b.width, height: b.height };
    // 保存された位置が実際にモニター上で視認できなければ無効化
    // 最低200×200px以上の重複がないと実用上見えないため棄却する
    const display = screen.getDisplayMatching(bounds);
    const wa = display.workArea;
    const overlapX = Math.min(bounds.x + bounds.width, wa.x + wa.width) - Math.max(bounds.x, wa.x);
    const overlapY = Math.min(bounds.y + bounds.height, wa.y + wa.height) - Math.max(bounds.y, wa.y);
    return (overlapX >= 200 && overlapY >= 200) ? bounds : null;
  } catch { /* ignore */ }
  return null;
}
function saveWindowBounds(win: BrowserWindow): void {
  try { writeFileSync(windowBoundsPath(), JSON.stringify(win.getBounds()), "utf8"); }
  catch { /* ignore */ }
}

function getIchikishimaControlCenterReadonlyParams(): ControlCenterDataProviderParams {
  const resolved = resolveControlCenterPathResolution({
    mainProcessDirname: __dirname,
    sandboxSegments: ["sandbox", "hermes-autonomy-zone"],
    electron: controlCenterElectronHintsFromApp(app),
  });
  return {
    projectRoot: resolved.projectRootForProviders,
    zoneRoot: resolved.zoneRootForProviders,
    dateUtc: new Date().toISOString().slice(0, 10),
    pilotLoop: null,
    pathResolutionRendererSafe: resolved.rendererSafe,
  };
}

function createWindow(): void {
  const savedBounds = loadWindowBounds();
  mainWindow = new BrowserWindow({
    width: savedBounds?.width ?? 1100,
    height: savedBounds?.height ?? 750,
    x: savedBounds?.x,
    y: savedBounds?.y,
    minWidth: 800,
    minHeight: 600,
    show: false,
    backgroundColor: "#0d1117",
    autoHideMenuBar: true,
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : undefined,
    ...(process.platform === "darwin"
      ? { trafficLightPosition: { x: 16, y: 16 } }
      : {}),
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      webviewTag: true,
    },
  });

  mainWindow.on("ready-to-show", () => {
    console.log("[Window] ready-to-show fired");
    mainWindow!.show();
    mainWindow!.focus();
  });

  // フォールバック: ready-to-show が発火しなかった場合でも 6 秒後に強制表示
  setTimeout(() => {
    if (mainWindow && !mainWindow.isVisible()) {
      console.warn("[Window] ready-to-show 未発火 — 強制表示");
      mainWindow.show();
      mainWindow.focus();
    } else if (mainWindow) {
      console.log("[Window] fallback: already visible, focus only");
      mainWindow.focus();
    }
  }, 6000);

  // Minimize → hide to tray
  mainWindow.on("minimize", () => {
    mainWindow?.hide();
  });

  // Close button → hide to tray (not quit)
  mainWindow.on("close", (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      mainWindow?.hide();
    }
  });

  // UI-01: save bounds on resize/move so they survive restarts
  mainWindow.on("resize", () => { if (mainWindow) saveWindowBounds(mainWindow); });
  mainWindow.on("move",   () => { if (mainWindow) saveWindowBounds(mainWindow); });

  mainWindow.webContents.on("render-process-gone", (_event, details) => {
    console.error(
      "[CRASH] Renderer process gone:",
      details.reason,
      details.exitCode,
    );
  });

  mainWindow.webContents.on(
    "console-message",
    (_event, level, message, line, sourceId) => {
      if (level >= 2) {
        console.error(`[RENDERER ERROR] ${message} (${sourceId}:${line})`);
      }
    },
  );

  mainWindow.webContents.on(
    "did-fail-load",
    (_event, errorCode, errorDescription) => {
      console.error("[LOAD FAIL]", errorCode, errorDescription);
    },
  );

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    mainWindow.webContents.once("did-finish-load", () => {
      if (process.env.SHIKISHIMA_OPEN_DEVTOOLS === "1") {
        mainWindow?.webContents.openDevTools({ mode: "detach" });
      }
    });
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

function createTray(): void {
  const img = nativeImage.createFromPath(join(__dirname, "../../resources/icon.png"));
  tray = new Tray(img.resize({ width: 16, height: 16 }));
  tray.setToolTip("しきしま — Shikishima");

  const menu = Menu.buildFromTemplate([
    {
      label: "しきしまを開く",
      click: () => { mainWindow?.show(); mainWindow?.focus(); },
    },
    { type: "separator" },
    {
      label: "Ollama 起動",
      click: () => {
        spawn("ollama", ["serve"], { detached: true, stdio: "ignore" }).unref();
      },
    },
    {
      label: "Ollama 停止",
      click: () => {
        exec("taskkill /IM ollama.exe /F");
      },
    },
    { type: "separator" },
    {
      label: "リサーチレポートを今すぐ送信",
      click: () => { startDailyResearchPipeline(); },
    },
    { type: "separator" },
    {
      label: "終了",
      click: () => { app.isQuitting = true; app.quit(); },
    },
  ]);

  tray.setContextMenu(menu);

  // Left-click: 常にウィンドウを前面表示 (トグルによる誤クローズを防止)
  tray.on("click", () => {
    mainWindow?.show();
    mainWindow?.focus();
  });

  // Double-click always shows
  tray.on("double-click", () => {
    mainWindow?.show();
    mainWindow?.focus();
  });
}

function setupIPC(): void {
  ipcMain.handle("shikishima-get-runtime-mode", () =>
    resolveShikishimaRuntimeMode(app.getAppPath()),
  );

  registerControlCenterReadonlyIpcHandlers(ipcMain, {
    getParams: getIchikishimaControlCenterReadonlyParams,
  });
  registerRuntimeReadonlyStatusBoardIpcHandlers(ipcMain);
  registerMobileConsoleIpcHandler(ipcMain, {
    getParams: getIchikishimaControlCenterReadonlyParams,
  });

  // Phase 2C connection info — for Electron UI display only
  ipcMain.handle("mobile-console.getPhase2cConnectionInfo", () => {
    if (!phase2cInstance) {
      return { active: false, phase2cEnabled: MOBILE_CONSOLE_PHASE_2C_ENABLED };
    }
    return {
      active: true,
      phase2cEnabled: MOBILE_CONSOLE_PHASE_2C_ENABLED,
      lanUrl: phase2cInstance.lanUrlForElectronUiOnly,
      pairingToken: phase2cInstance.pairing.rawTokenForElectronUiOnly,
      pairingTokenPresent: true,
      pairingTokenRawReported: false,
    };
  });

  // Installation
  ipcMain.handle("check-install", () => {
    return checkInstallStatus();
  });

  ipcMain.handle("start-install", async (event) => {
    try {
      await runInstall((progress: InstallProgress) => {
        event.sender.send("install-progress", progress);
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

  // Hermes engine info
  ipcMain.handle("get-hermes-version", async () => getHermesVersion());
  ipcMain.handle("refresh-hermes-version", async () => {
    clearVersionCache();
    return getHermesVersion();
  });
  ipcMain.handle("run-hermes-doctor", () => runHermesDoctor());
  ipcMain.handle("run-hermes-update", async (event) => {
    try {
      await runHermesUpdate((progress: InstallProgress) => {
        event.sender.send("install-progress", progress);
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

  // OpenClaw migration
  ipcMain.handle("check-openclaw", () => checkOpenClawExists());
  ipcMain.handle("run-claw-migrate", async (event) => {
    try {
      await runClawMigrate((progress: InstallProgress) => {
        event.sender.send("install-progress", progress);
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

  // Configuration (profile-aware)
  ipcMain.handle("get-locale", () => getAppLocale());
  ipcMain.handle("set-locale", (_event, locale: "en" | "zh-CN") =>
    setAppLocale(locale),
  );

  ipcMain.handle("get-env", (_event, profile?: string) => readEnv(profile));

  ipcMain.handle(
    "set-env",
    (_event, key: string, value: string, profile?: string) => {
      setEnvValue(key, value, profile);
      // Restart gateway so it picks up the new API key
      if (
        (isGatewayRunning() && key.endsWith("_API_KEY")) ||
        key.endsWith("_TOKEN") ||
        key === "HF_TOKEN"
      ) {
        restartGateway(profile);
      }
      return true;
    },
  );

  ipcMain.handle("get-config", (_event, key: string, profile?: string) =>
    getConfigValue(key, profile),
  );

  ipcMain.handle(
    "set-config",
    (_event, key: string, value: string, profile?: string) => {
      setConfigValue(key, value, profile);
      return true;
    },
  );

  ipcMain.handle("get-hermes-home", (_event, profile?: string) =>
    getHermesHome(profile),
  );

  ipcMain.handle("get-model-config", (_event, profile?: string) =>
    getModelConfig(profile),
  );

  ipcMain.handle(
    "set-model-config",
    (
      _event,
      provider: string,
      model: string,
      baseUrl: string,
      profile?: string,
    ) => {
      const prev = getModelConfig(profile);
      setModelConfig(provider, model, baseUrl, profile);

      // Restart gateway when provider, model, or endpoint changes so it picks up new config
      if (
        isGatewayRunning() &&
        (prev.provider !== provider ||
          prev.model !== model ||
          prev.baseUrl !== baseUrl)
      ) {
        restartGateway(profile);
      }

      return true;
    },
  );

  // Connection mode (local vs remote)
  ipcMain.handle("is-remote-mode", () => isRemoteMode());
  ipcMain.handle("get-connection-config", () => getConnectionConfig());

  ipcMain.handle(
    "set-connection-config",
    (_event, mode: "local" | "remote", remoteUrl: string, apiKey?: string) => {
      setConnectionConfig({ mode, remoteUrl, apiKey: apiKey || "" });
      return true;
    },
  );

  ipcMain.handle(
    "test-remote-connection",
    (_event, url: string, apiKey?: string) => testRemoteConnection(url, apiKey),
  );

  // Chat — lazy-start gateway on first message
  ipcMain.handle(
    "send-message",
    async (
      event,
      message: string,
      profile?: string,
      resumeSessionId?: string,
      history?: Array<{ role: string; content: string }>,
    ) => {
      if (!isRemoteMode() && !isGatewayRunning()) {
        startGateway(profile);
      }

      if (currentChatAbort) {
        currentChatAbort();
      }

      let fullResponse = "";
      const chatStartTime = Date.now();
      let resolveChat: (v: { response: string; sessionId?: string }) => void;
      let rejectChat: (reason?: unknown) => void;
      const promise = new Promise<{ response: string; sessionId?: string }>(
        (res, rej) => {
          resolveChat = res;
          rejectChat = rej;
        },
      );

      const handle = await sendMessage(
        message,
        {
          onChunk: (chunk) => {
            fullResponse += chunk;
            event.sender.send("chat-chunk", chunk);
          },
          onDone: (sessionId) => {
            currentChatAbort = null;
            event.sender.send("chat-done", sessionId || "");
            resolveChat({ response: fullResponse, sessionId });
            // Desktop notification when window is not focused and response took >10s
            if (
              mainWindow &&
              !mainWindow.isFocused() &&
              Date.now() - chatStartTime > 10000
            ) {
              const preview = fullResponse
                .replace(/[#*_`~\n]+/g, " ")
                .trim()
                .slice(0, 80);
              new Notification({
                title: "Hermes Agent",
                body: preview || "Response ready",
              }).show();
            }
          },
          onError: (error) => {
            currentChatAbort = null;
            event.sender.send("chat-error", error);
            rejectChat(new Error(error));
            // Notify on error too if window not focused
            if (mainWindow && !mainWindow.isFocused()) {
              new Notification({
                title: "Hermes Agent — Error",
                body: error.slice(0, 100),
              }).show();
            }
          },
          onToolProgress: (tool) => {
            event.sender.send("chat-tool-progress", tool);
          },
          onUsage: (usage) => {
            event.sender.send("chat-usage", usage);
          },
        },
        profile,
        resumeSessionId,
        history,
      );

      currentChatAbort = handle.abort;
      return promise;
    },
  );

  ipcMain.handle("abort-chat", () => {
    if (currentChatAbort) {
      currentChatAbort();
      currentChatAbort = null;
    }
  });

  // Gateway
  ipcMain.handle("start-gateway", () => startGateway());
  ipcMain.handle("stop-gateway", () => {
    stopGateway(true);
    return true;
  });
  ipcMain.handle("gateway-status", () => isGatewayRunning());

  // Platform toggles (config.yaml platforms section)
  ipcMain.handle("get-platform-enabled", (_event, profile?: string) =>
    getPlatformEnabled(profile),
  );
  ipcMain.handle(
    "set-platform-enabled",
    (_event, platform: string, enabled: boolean, profile?: string) => {
      setPlatformEnabled(platform, enabled, profile);
      // Restart gateway so it picks up the new platform config
      if (isGatewayRunning()) {
        restartGateway(profile);
      }
      return true;
    },
  );

  // Sessions
  ipcMain.handle("list-sessions", (_event, limit?: number, offset?: number) => {
    return listSessions(limit, offset);
  });

  ipcMain.handle("get-session-messages", (_event, sessionId: string) => {
    return getSessionMessages(sessionId);
  });

  // Profiles
  ipcMain.handle("list-profiles", async () => listProfiles());
  ipcMain.handle("create-profile", (_event, name: string, clone: boolean) =>
    createProfile(name, clone),
  );
  ipcMain.handle("delete-profile", (_event, name: string) =>
    deleteProfile(name),
  );
  ipcMain.handle("set-active-profile", (_event, name: string) => {
    setActiveProfile(name);
    return true;
  });

  // Memory
  ipcMain.handle("read-memory", (_event, profile?: string) =>
    readMemory(profile),
  );
  ipcMain.handle(
    "add-memory-entry",
    (_event, content: string, profile?: string) =>
      addMemoryEntry(content, profile),
  );
  ipcMain.handle(
    "update-memory-entry",
    (_event, index: number, content: string, profile?: string) =>
      updateMemoryEntry(index, content, profile),
  );
  ipcMain.handle(
    "remove-memory-entry",
    (_event, index: number, profile?: string) =>
      removeMemoryEntry(index, profile),
  );
  ipcMain.handle(
    "write-user-profile",
    (_event, content: string, profile?: string) =>
      writeUserProfile(content, profile),
  );

  // Soul
  ipcMain.handle("read-soul", (_event, profile?: string) => readSoul(profile));
  ipcMain.handle("write-soul", (_event, content: string, profile?: string) => {
    return writeSoul(content, profile);
  });
  ipcMain.handle("reset-soul", (_event, profile?: string) =>
    resetSoul(profile),
  );

  // Tools
  ipcMain.handle("get-toolsets", (_event, profile?: string) =>
    getToolsets(profile),
  );
  ipcMain.handle(
    "set-toolset-enabled",
    (_event, key: string, enabled: boolean, profile?: string) => {
      return setToolsetEnabled(key, enabled, profile);
    },
  );

  // Skills
  ipcMain.handle("list-installed-skills", (_event, profile?: string) =>
    listInstalledSkills(profile),
  );
  ipcMain.handle("list-bundled-skills", () => listBundledSkills());
  ipcMain.handle("get-skill-content", (_event, skillPath: string) =>
    getSkillContent(skillPath),
  );
  ipcMain.handle(
    "install-skill",
    (_event, identifier: string, profile?: string) =>
      installSkill(identifier, profile),
  );
  ipcMain.handle("uninstall-skill", (_event, name: string, profile?: string) =>
    uninstallSkill(name, profile),
  );

  // Session cache (fast local cache with generated titles)
  ipcMain.handle(
    "list-cached-sessions",
    (_event, limit?: number, offset?: number) =>
      listCachedSessions(limit, offset),
  );
  ipcMain.handle("sync-session-cache", () => syncSessionCache());
  ipcMain.handle(
    "update-session-title",
    (_event, sessionId: string, title: string) =>
      updateSessionTitle(sessionId, title),
  );

  // Session search
  ipcMain.handle("search-sessions", (_event, query: string, limit?: number) =>
    searchSessions(query, limit),
  );

  // Credential Pool
  ipcMain.handle("get-credential-pool", () => getCredentialPool());
  ipcMain.handle(
    "set-credential-pool",
    (
      _event,
      provider: string,
      entries: Array<{ key: string; label: string }>,
    ) => {
      setCredentialPool(provider, entries);
      return true;
    },
  );

  // Models
  ipcMain.handle("list-models", () => listModels());
  ipcMain.handle(
    "add-model",
    (_event, name: string, provider: string, model: string, baseUrl: string) =>
      addModel(name, provider, model, baseUrl),
  );
  ipcMain.handle("remove-model", (_event, id: string) => removeModel(id));
  ipcMain.handle(
    "update-model",
    (_event, id: string, fields: Record<string, string>) =>
      updateModel(id, fields),
  );

  // Claw3D
  ipcMain.handle("claw3d-status", () => getClaw3dStatus());

  ipcMain.handle("claw3d-setup", async (event) => {
    try {
      await setupClaw3d((progress: Claw3dSetupProgress) => {
        event.sender.send("claw3d-setup-progress", progress);
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

  ipcMain.handle("claw3d-get-port", () => getClaw3dPort());
  ipcMain.handle("claw3d-set-port", (_event, port: number) => {
    setClaw3dPort(port);
    return true;
  });
  ipcMain.handle("claw3d-get-ws-url", () => getClaw3dWsUrl());
  ipcMain.handle("claw3d-set-ws-url", (_event, url: string) => {
    setClaw3dWsUrl(url);
    return true;
  });

  ipcMain.handle("claw3d-start-all", () => startClaw3dAll());
  ipcMain.handle("claw3d-stop-all", () => {
    stopClaw3d();
    return true;
  });
  ipcMain.handle("claw3d-get-logs", () => getClaw3dLogs());

  ipcMain.handle("claw3d-start-dev", () => startDevServer());
  ipcMain.handle("claw3d-stop-dev", () => {
    stopDevServer();
    return true;
  });
  ipcMain.handle("claw3d-start-adapter", () => startAdapter());
  ipcMain.handle("claw3d-stop-adapter", () => {
    stopAdapter();
    return true;
  });

  // Cron Jobs
  ipcMain.handle(
    "list-cron-jobs",
    (_event, includeDisabled?: boolean, profile?: string) =>
      listCronJobs(includeDisabled, profile),
  );
  ipcMain.handle(
    "create-cron-job",
    (
      _event,
      schedule: string,
      prompt?: string,
      name?: string,
      deliver?: string,
      profile?: string,
    ) => createCronJob(schedule, prompt, name, deliver, profile),
  );
  ipcMain.handle("remove-cron-job", (_event, jobId: string, profile?: string) =>
    removeCronJob(jobId, profile),
  );
  ipcMain.handle("pause-cron-job", (_event, jobId: string, profile?: string) =>
    pauseCronJob(jobId, profile),
  );
  ipcMain.handle("resume-cron-job", (_event, jobId: string, profile?: string) =>
    resumeCronJob(jobId, profile),
  );
  ipcMain.handle(
    "trigger-cron-job",
    (_event, jobId: string, profile?: string) => triggerCronJob(jobId, profile),
  );

  // Shell
  ipcMain.handle("open-external", (_event, url: string) => {
    shell.openExternal(url);
  });

  // Backup / Import
  ipcMain.handle("run-hermes-backup", (_event, profile?: string) =>
    runHermesBackup(profile),
  );
  ipcMain.handle(
    "run-hermes-import",
    (_event, archivePath: string, profile?: string) =>
      runHermesImport(archivePath, profile),
  );

  // Debug dump
  ipcMain.handle("run-hermes-dump", () => runHermesDump());

  // MCP servers
  ipcMain.handle("list-mcp-servers", (_event, profile?: string) =>
    listMcpServers(profile),
  );

  // Memory providers
  ipcMain.handle("discover-memory-providers", (_event, profile?: string) =>
    discoverMemoryProviders(profile),
  );

  // Log viewer
  ipcMain.handle("read-logs", (_event, logFile?: string, lines?: number) =>
    readLogs(logFile, lines),
  );

  // OB-01: Library evidence write (dry-run until explicit GO)
  ipcMain.handle("shikishima-library-write", (_event, req: LibraryWriteRequest) =>
    writeEvidenceNote(req),
  );

  // DIS-01: Discord read-only intake (constitutional GO or HOLD)
  ipcMain.handle("shikishima-discord-read", async (_event, channelId: string, limit?: number) => {
    const result = await executeDiscordReadIntake(
      { channelId, limit: limit ?? 10 },
      readDiscordChannel
    );
    return {
      success: result.success,
      error: result.error,
      messages: result.messages,
      readCount: result.readCount,
      requestedLimit: limit ?? 10,
      preflight: createActionPreflight({
        actionId: "DISCORD-READ",
        actionKind: "discord_read",
        actor: "shirube",
        source: "renderer",
        targetSummary: result.channelIdConfigured
          ? "discord channel read (constitutional GO)"
          : "discord channel read: channel missing",
        evidencePath: "docs/shikishima/CONSTITUTIONAL_GO_ALL_2026-05-28.md",
        requestedEffects: ["external_read"],
      }),
      decision: result.decision,
      reasons: result.reasons,
      productionReady: false,
      execution: "disabled",
      rawValuesReported: false,
    };
  });

  // RESEARCH-PIPELINE: Generate article → Discord + Obsidian 40_Research/
  // User GO: "永久記憶としてレポート作成を許可"
  ipcMain.handle(
    "shikishima-research-publish",
    (_event, input: ResearchReportInput) => ({
      success: false,
      preflight: createActionPreflight({
        actionId: "RESEARCH-PUBLISH",
        actionKind: "discord_write",
        actor: "shikishima",
        source: "renderer",
        targetSummary: input.title,
        evidencePath: "docs/shikishima/RESEARCH_PIPELINE_GO_EVIDENCE.md",
        requestedEffects: ["discord_write", "obsidian_write"],
      }),
      note: "Research publish is draft-only until explicit human GO.",
      productionReady: false,
      execution: "disabled",
      rawValuesReported: false,
    }),
  );

  // GROK CHAT: legacy IPC — routes to agent-router (Groq/Claude) while Grok Research HOLD
  ipcMain.handle("shikishima-grok-chat", async (_event, message: string) => {
    const { dispatchToAgent } = await import("./agent-router");
    const { isGlobalGrokResearchHold } = await import("./shikishima-agent-backend-policy");
    if (isGlobalGrokResearchHold()) {
      const r = await dispatchToAgent(message);
      return {
        success: r.success,
        reply: r.reply,
        durationMs: r.durationMs,
        error: r.error
      };
    }
    return grokChat(message);
  });

  ipcMain.handle(
    "shikishima-channel-output-draft",
    (_event, req: {
      responseId?: string;
      agentId?: "shikishima" | "shizume" | "hajime" | "tsumugi" | "shirube";
      modelId?: string;
      fullResponse: string;
      spokenResponse?: string;
      reasoningLevel?: "quick" | "standard" | "deep" | "critical";
      evidenceFile?: string;
    }) =>
      prepareChannelOutputBundle({
        responseId: req.responseId ?? `resp-${Date.now()}`,
        agentId: req.agentId ?? "shikishima",
        modelId: req.modelId ?? "renderer-chat",
        fullResponse: req.fullResponse,
        spokenResponse: req.spokenResponse,
        reasoningLevel: req.reasoningLevel ?? "standard",
        evidenceFile: req.evidenceFile ?? "docs/shikishima/CHANNEL_OUTPUT_DRAFT_EVIDENCE.md",
      }),
  );

  // GROK QUOTA: Check X Premium xai-oauth status
  ipcMain.handle(
    "shikishima-grok-quota",
    () => checkXPremiumQuota(),
  );

  // CLAUDE CODE: coding tasks via claude CLI (Pro subscription, no API key)
  ipcMain.handle(
    "claude-code-task",
    (_event, prompt: string) => claudeCodeTask(prompt),
  );

  // AGENT ROUTER: 5-agent intelligent routing (IPC for renderer)
  ipcMain.handle(
    "agent-dispatch",
    (_event, message: string) => dispatchToAgent(message),
  );
  ipcMain.handle(
    "agent-route",
    (_event, message: string) => routeTask(message),
  );
  // AT-AGENT-00: エージェント定義取得 (renderer表示用)
  ipcMain.handle("agent-definitions", () => {
    return { agents: AGENT_DEFINITIONS, workers: WORKER_DEFINITIONS };
  });

  // AI SERVICE AVAILABILITY
  ipcMain.handle("groq-availability", () => checkGroqAvailability());
  ipcMain.handle("gemini-availability", () => checkGeminiAvailability());

  // Memory Network IPC
  ipcMain.handle("memory-get-long", () => {
    return loadLongTermMemory();
  });
  ipcMain.handle("memory-get-medium", () => {
    return loadMediumTermMemory();
  });
  ipcMain.handle("memory-add-fact", (_event, category: string, key: string, value: string) => {
    addLongTermFact({ category: category as "user"|"project"|"preference"|"milestone"|"rule", key, value });
    return true;
  });

  // STACKCHAN: local WebSocket (pet-fw ws:8080) + VOICEVOX TTS
  ipcMain.handle("stackchan-status", () => checkStackchanLocalStatus());
  ipcMain.handle("stackchan-say", async (_event, text: string) => {
    const draft = prepareStackchanSpeechDraft({
      responseId: `stackchan-${Date.now()}`,
      agentId: "shikishima",
      fullResponse: text,
      requestedSpokenResponse: text,
      reasoningLevel: "standard",
      actionId: "STACKCHAN-SAY-IPC",
      evidencePath: "docs/shikishima/STACKCHAN_SPEECH_ONE_SHOT_EVIDENCE.md",
    });
    const spoken = await guardedStackchanSayLocal(String(text), app.getAppPath());
    if (spoken.skipped === "stackchan_hold") {
      return {
        ok: false,
        error: "STACKCHAN_HOLD",
        draft,
        productionReady: false,
        execution: "disabled",
        rawValuesReported: false,
      };
    }
    if (spoken.error === "constitutional_stackchan_voice_required") {
      return {
        ok: false,
        error: "NEEDS_HUMAN",
        draft,
        productionReady: false,
        execution: "disabled",
        rawValuesReported: false,
      };
    }
    return {
      ok: spoken.ok,
      error: spoken.error,
      draft,
      productionReady: false,
      execution: "disabled",
      rawValuesReported: false,
    };
  });
  ipcMain.handle("stackchan-face", (_event, emotion: string) => ({
    ok: false,
    error: "NEEDS_HUMAN",
    preflight: createActionPreflight({
      actionId: "STACKCHAN-FACE-IPC",
      actionKind: "stackchan_motion",
      actor: "shikishima",
      source: "renderer",
      targetSummary: `face expression draft: ${emotion}`,
      evidencePath: "docs/shikishima/STACKCHAN_FACE_ONE_SHOT_EVIDENCE.md",
      requestedEffects: ["display_face_change"],
    }),
    productionReady: false,
    execution: "disabled",
    rawValuesReported: false,
  }));
  ipcMain.handle("stackchan-set-speed", (_event, speed: number) => { setVoicevoxSpeed(speed); return getVoicevoxSpeed(); });
  ipcMain.handle("stackchan-get-speed", () => getVoicevoxSpeed());
  ipcMain.handle("stackchan-set-speaker", (_event, id: number) => { setVoicevoxSpeaker(id); return getVoicevoxSpeaker(); });
  ipcMain.handle("stackchan-get-speaker", () => getVoicevoxSpeaker());

  // STT Server (Option B — StackChan mic → Whisper → AI → speak)
  ipcMain.handle("stt-state", () => getSttServiceState());
  ipcMain.handle("stt-check-whisper", () => checkWhisperInstalled());
}

function buildMenu(): void {
  const isMac = process.platform === "darwin";

  const template: Electron.MenuItemConstructorOptions[] = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" as const },
              { type: "separator" as const },
              { role: "services" as const },
              { type: "separator" as const },
              { role: "hide" as const },
              { role: "hideOthers" as const },
              { role: "unhide" as const },
              { type: "separator" as const },
              { role: "quit" as const },
            ],
          },
        ]
      : []),
    {
      label: "Chat",
      submenu: [
        {
          label: "New Chat",
          accelerator: "CmdOrCtrl+N",
          click: (): void => {
            mainWindow?.webContents.send("menu-new-chat");
          },
        },
        { type: "separator" },
        {
          label: "Search Sessions",
          accelerator: "CmdOrCtrl+K",
          click: (): void => {
            mainWindow?.webContents.send("menu-search-sessions");
          },
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
        ...(is.dev
          ? [
              { type: "separator" as const },
              { role: "reload" as const },
              { role: "toggleDevTools" as const },
            ]
          : []),
      ],
    },
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        ...(isMac
          ? [{ type: "separator" as const }, { role: "front" as const }]
          : [{ role: "close" as const }]),
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Hermes Agent on GitHub",
          click: (): void => {
            shell.openExternal("https://github.com/fathah/Hermes-Agent");
          },
        },
        {
          label: "Report an Issue",
          click: (): void => {
            shell.openExternal("https://github.com/fathah/Hermes-Agent/issues");
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function setupUpdater(): void {
  // IPC handlers must always be registered to avoid invoke errors
  ipcMain.handle("get-app-version", () => app.getVersion());

  if (!app.isPackaged) {
    // Skip auto-update in dev mode
    ipcMain.handle("check-for-updates", async () => null);
    ipcMain.handle("download-update", () => true);
    ipcMain.handle("install-update", () => {});
    return;
  }

  // Dynamic import to avoid electron-updater issues in dev mode
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { autoUpdater } = require("electron-updater") as {
    autoUpdater: AppUpdater;
  };

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on("update-available", (info) => {
    mainWindow?.webContents.send("update-available", {
      version: info.version,
      releaseNotes: info.releaseNotes,
    });
  });

  autoUpdater.on("download-progress", (progress) => {
    mainWindow?.webContents.send("update-download-progress", {
      percent: Math.round(progress.percent),
    });
  });

  autoUpdater.on("update-downloaded", () => {
    mainWindow?.webContents.send("update-downloaded");
  });

  autoUpdater.on("error", (err) => {
    mainWindow?.webContents.send("update-error", err.message);
  });

  ipcMain.handle("check-for-updates", async () => {
    try {
      const result = await autoUpdater.checkForUpdates();
      return result?.updateInfo?.version || null;
    } catch {
      return null;
    }
  });

  ipcMain.handle("download-update", () => {
    autoUpdater.downloadUpdate();
    return true;
  });

  ipcMain.handle("install-update", () => {
    autoUpdater.quitAndInstall(false, true);
  });

  setTimeout(() => {
    autoUpdater.checkForUpdates().catch(() => {});
  }, 5000);
}

// しずめ暫定ヘルスチェック — 起動時に問題を検出してDiscordに報告
async function runStartupHealthCheck(): Promise<void> {
  const issues: string[] = [];

  // Groq APIキー確認
  const groqAvail = checkGroqAvailability();
  if (!groqAvail.available) {
    issues.push("WARN: GROQ_API_KEY未設定 → しきしま会話がGrokフォールバック (クォータ消費)");
  }

  // Whisper STT確認
  const whisperOk = await checkWhisperInstalled();
  if (!whisperOk) {
    issues.push("WARN: faster-whisper未インストール → StackChanマイク機能(Option B)は非稼働");
  }

  // 問題なければ報告しない
  if (issues.length === 0) {
    console.log("[HealthCheck] All checks passed");
    return;
  }

  // Discord #指示チャンネルに通知
  const { commandChannelId } = getDiscordChannelIds();
  if (commandChannelId) {
    const msg = [
      "[しずめ 起動チェック]",
      ...issues.map((i) => `- ${i}`),
    ].join("\n");
    sendDiscordMessage(commandChannelId, msg.slice(0, 2000)).catch(() => {});
  }
  console.warn("[HealthCheck] Issues found:", issues);
}

// 2つ目のインスタンスが起動しようとしたら既存ウィンドウを前面に出す
app.on("second-instance", () => {
  if (mainWindow) {
    if (!mainWindow.isVisible()) mainWindow.show();
    mainWindow.focus();
  }
});

app.whenReady().then(() => {
  app.name = "Hermes";
  electronApp.setAppUserModelId("com.nousresearch.hermes");

  const runtimeMode = resolveShikishimaRuntimeMode(app.getAppPath());
  const shadowMode = runtimeMode.shadowModeEffective;
  if (runtimeMode.discordOnlyUi) {
    process.env.SHIKISHIMA_DISCORD_ONLY_UI = "1";
    console.log("[Shikishima] Discord-only UI — Control Center not required");
  }

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  buildMenu();
  setupIPC();
  createWindow();
  createTray();
  setupUpdater();

  if (MOBILE_CONSOLE_PHASE_2C_ENABLED && !runtimeMode.discordOnlyUi) {
    startPhase2cServer({ getParams: getIchikishimaControlCenterReadonlyParams })
      .then((result) => { phase2cInstance = result; })
      .catch((err) => { console.error("[Phase2C] start failed:", err); });
  }

  // Shikishima Research Pipeline — daily 08:00 JST
  if (shadowMode) {
    console.log("[Shikishima] shadow mode: daily research pipeline HOLD");
  } else {
    startDailyResearchPipeline();
  }
  // NEWS_WATCHER_HOLD: Grokクォータ節約 + StackChan音声安定化待ち
  // 再開条件: Groq APIキー設定済み + StackChan動作確認後
  // startNewsWatcher();

  // サイドボット (shikishima-bot.mjs) を子プロセスとして起動
  // Discord + STT + StackChan統合エージェント — Electron内蔵 Discord polling は停止
  if (isSidebotHoldActive(app.getAppPath())) {
    console.log(
      shadowMode ? "[Shikishima] shadow mode: sidebot HOLD" : "[Shikishima] sidebot HOLD",
    );
  } else {
    if (shadowMode) {
      console.log("[Shikishima] shadow mode: sidebot START (ops release)");
    }
    startSideBot();
  }

  // StackChan — local status check (pet-fw ws:8080 + VOICEVOX)
  if (shadowMode) {
    console.log("[Shikishima] shadow mode: StackChan status check HOLD");
  } else {
    startStackchanLocalStatusCheck();
  }

  // しずめ暫定: 起動時ヘルスチェック → 問題をDiscordレポートに通知
  if (shadowMode) {
    console.log("[Shikishima] shadow mode: startup Discord health report HOLD");
  } else {
    setTimeout(() => {
      runStartupHealthCheck().catch((e) => console.error("[HealthCheck]", e));
    }, 5000);
  }

  // StackChan PC-side event server — receives all events from StackChan firmware
  // Routes: POST /audio (STT), POST /event (pat/touch), POST /camera (photo)
  if (shadowMode) {
    console.log("[Shikishima] shadow mode: StackChan STT/event server HOLD");
  } else {
  startSttServer({
    onTranscript: async (transcript) => {
      console.log(`[STT→Agent] "${transcript}"`);
      const result = await dispatchToAgent(transcript);
      if (result.success && result.reply) {
        const spoken = await guardedStackchanSayLocal(result.reply, app.getAppPath());
        if (spoken.skipped) {
          console.log(`[STT→StackChan] skipped: ${spoken.skipped}`);
        } else if (!spoken.ok && spoken.error) {
          console.log(`[STT→StackChan] blocked: ${spoken.error}`);
        }
      }
    },
    onPatEvent: async (_mode, pcMode) => {
      // Pat reaction: voice + face expression via VOICEVOX
      await stackchanPetMode(pcMode).catch((e: Error) =>
        console.error("[StackChan Pat] error:", e.message),
      );
    },
    onCameraCapture: async (_jpeg, _savedPath) => {
      console.log("[StackChan Camera] captured one frame (redacted path)");
      // UI notification via IPC (future: send to renderer)
    },
  });
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  // On Windows/Linux: keep running in tray unless explicitly quitting
  if (process.platform !== "darwin" && app.isQuitting) {
    stopGateway();
    stopClaw3d();
    stopNewsWatcher();
    tray?.destroy();
    app.quit();
  }
});

app.on("before-quit", () => {
  flushSessionToMediumMemory(); // 中期記憶に今日の会話を保存
  stopHealthPolling();
  if (currentChatAbort) {
    currentChatAbort();
    currentChatAbort = null;
  }
  stopSideBot();
  stopGateway();
  stopClaw3d();
  stopStackchanLocalStatusCheck();
  stopSttServer();
});
