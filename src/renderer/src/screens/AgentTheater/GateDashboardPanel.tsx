/**
 * GateDashboardPanel - display-only future/human-gated capability dashboard.
 * Gate state is visible only. No gate toggles, no action buttons, no API calls.
 * Design spec: AT_12_GATE_DASHBOARD_PANEL_EVIDENCE.md
 */

import type { GateDashboardItem } from "../../types/agent-theater-types";
import { GateStatusCard } from "./GateStatusCard";

const GATE_ITEMS: readonly GateDashboardItem[] = [
  {
    gateId: "PUSH-GO",
    title: "git push",
    status: "NEEDS_HUMAN",
    category: "push",
    plainLabel: "git push は人間GO",
    currentState: "waiting for explicit push GO",
    requiredHumanAction: "commit hash + scope approval",
    allowedNow: ["review", "readiness"],
    forbiddenNow: ["auto-push", "extra commit"],
    autonomyLevel: 5,
    evidenceTarget: "push readiness report",
  },
  {
    gateId: "RUNTIME-GO",
    title: "runtime start",
    status: "NEEDS_HUMAN",
    category: "runtime",
    plainLabel: "runtime起動はtime_window付きGO",
    currentState: "HOLD",
    requiredHumanAction: "date / time_window / command / stop conditions",
    allowedNow: ["request draft"],
    forbiddenNow: ["npm run dev", "port open"],
    autonomyLevel: 5,
    evidenceTarget: "runtime request report",
  },
  {
    gateId: "OAUTH-GO",
    title: "OAuth provider connection",
    status: "HOLD",
    category: "auth",
    plainLabel: "OAuth連携はprovider/scope/token policy付きGO",
    currentState: "HOLD",
    requiredHumanAction: "provider / purpose / scopes / token policy",
    allowedNow: ["plan", "review"],
    forbiddenNow: ["login", "token read"],
    autonomyLevel: 5,
    evidenceTarget: "OAuth GO record",
  },
  {
    gateId: "XS-READ",
    title: "x_search / social read",
    status: "FUTURE",
    category: "social",
    plainLabel: "x_search/SNS読み取りはread-only GO",
    currentState: "future read-only gate",
    requiredHumanAction: "source / topic / read-only window",
    allowedNow: ["policy docs"],
    forbiddenNow: ["post", "reply", "DM"],
    autonomyLevel: 5,
    evidenceTarget: "XS-READ evidence",
  },
  {
    gateId: "OBS-LOCAL",
    title: "Obsidian local note",
    status: "FUTURE",
    category: "local_note",
    plainLabel: "Obsidian local noteはlocal GO",
    currentState: "future local note gate",
    requiredHumanAction: "vault scope / folder / file / content rule",
    allowedNow: ["template", "plan"],
    forbiddenNow: ["write now", "sync/API"],
    autonomyLevel: 5,
    evidenceTarget: "OBS-LOCAL record",
  },
  {
    gateId: "EXTERNAL-WRITE",
    title: "external write",
    status: "BLOCKED",
    category: "external_write",
    plainLabel: "外部書き込みは明示GOなし禁止",
    currentState: "blocked by default",
    requiredHumanAction: "separate service-specific GO",
    allowedNow: ["draft only"],
    forbiddenNow: ["send", "post", "purchase"],
    autonomyLevel: 5,
    evidenceTarget: "external action gate",
  },
  {
    gateId: "PRODUCTION-READY",
    title: "productionReady",
    status: "LOCKED_FALSE",
    category: "production",
    plainLabel: "productionReady=false 維持",
    currentState: "false",
    requiredHumanAction: "separate production readiness gate",
    allowedNow: ["display false"],
    forbiddenNow: ["set true"],
    autonomyLevel: 5,
    evidenceTarget: "production readiness review",
  },
  {
    gateId: "EXECUTION-ENABLE",
    title: "execution",
    status: "LOCKED_DISABLED",
    category: "execution",
    plainLabel: "execution=disabled 維持",
    currentState: "disabled",
    requiredHumanAction: "separate execution enable gate",
    allowedNow: ["display disabled"],
    forbiddenNow: ["enable execution"],
    autonomyLevel: 5,
    evidenceTarget: "execution gate review",
  },
  {
    gateId: "STACKCHAN-PHYSICAL",
    title: "StackChan physical",
    status: "HOLD",
    category: "device",
    plainLabel: "物理動作は別Gate",
    currentState: "not approved",
    requiredHumanAction: "device arrival + physical test GO",
    allowedNow: ["display preview"],
    forbiddenNow: ["connect", "move"],
    autonomyLevel: 5,
    evidenceTarget: "physical device evidence",
  },
  {
    gateId: "VOICE-CAMERA-MIC",
    title: "voice / camera / mic",
    status: "HOLD",
    category: "media",
    plainLabel: "voice/camera/micは別Gate",
    currentState: "not approved",
    requiredHumanAction: "separate media permission GO",
    allowedNow: ["policy display"],
    forbiddenNow: ["record", "listen", "speak"],
    autonomyLevel: 5,
    evidenceTarget: "media permission evidence",
  },
  {
    gateId: "SPRITE-ASSET",
    title: "sprite / image asset",
    status: "FUTURE",
    category: "asset",
    plainLabel: "画像/sprite assetはAT-05後",
    currentState: "future optional asset gate",
    requiredHumanAction: "asset plan + license/originality review",
    allowedNow: ["CSS/SVG display"],
    forbiddenNow: ["commit PNG", "external URL"],
    autonomyLevel: 4,
    evidenceTarget: "AT-05 asset plan",
  },
  {
    gateId: "RUNTIME-VISUAL-RECHECK",
    title: "runtime visual recheck",
    status: "NEEDS_HUMAN",
    category: "review",
    plainLabel: "目視確認はtime_window GO",
    currentState: "HOLD",
    requiredHumanAction: "date / time_window / observation scope",
    allowedNow: ["checklist prep"],
    forbiddenNow: ["start runtime"],
    autonomyLevel: 5,
    evidenceTarget: "AT-14 evidence",
  },
] as const;

const SUMMARY_BADGES = [
  { key: "productionReady", value: "false", color: "#8b949e" },
  { key: "execution", value: "disabled", color: "#8b949e" },
  { key: "rawValuesReported", value: "false", color: "#8b949e" },
  { key: "runtime", value: "HOLD", color: "#f59e0b" },
  { key: "external write", value: "blocked", color: "#f85149" },
  { key: "Level 5", value: "human GO", color: "#f0883e" },
] as const;

const PANEL_LABEL: React.CSSProperties = {
  fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
  fontSize: 12,
  letterSpacing: 1.2,
  color: "#6e7681",
  marginBottom: 10,
  textTransform: "uppercase" as const,
};

const TAGLINE_STYLE: React.CSSProperties = {
  fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
  fontSize: 11,
  color: "#8b949e",
  fontStyle: "italic",
  lineHeight: 1.4,
};

interface GateDashboardPanelProps {
  readonly lang?: "ja" | "en";
}

export function GateDashboardPanel({ lang = "ja" }: GateDashboardPanelProps): React.JSX.Element {
  return (
    <div
      style={{
        background: "#0d1117",
        border: "1px solid #21262d",
        borderRadius: 8,
        padding: "16px",
        minWidth: 0,
      }}
    >
      <p style={PANEL_LABEL}>
        {lang === "ja" ? "GATE DASHBOARD · 未来ゲート" : "GATE DASHBOARD · FUTURE GATES"}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        {SUMMARY_BADGES.map((badge) => (
          <span
            key={badge.key}
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 11,
              color: badge.color,
              border: `1px solid ${badge.color}`,
              borderRadius: 2,
              padding: "1px 5px",
              whiteSpace: "nowrap" as const,
            }}
          >
            {badge.key}: {badge.value}
          </span>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
          gap: 10,
          marginBottom: 14,
        }}
      >
        {GATE_ITEMS.map((item) => (
          <GateStatusCard key={item.gateId} item={item} />
        ))}
      </div>

      <div style={{ height: 1, background: "#21262d", marginBottom: 8 }} />

      <div style={{ display: "flex", flexDirection: "column" as const, gap: 3 }}>
        <span style={TAGLINE_STYLE}>
          {lang === "ja" ? "Gateは見える化だけ。ONにする操作はここではしない。" : "Gates are visible only. Nothing is enabled here."}
        </span>
        <span style={TAGLINE_STYLE}>
          {lang === "ja" ? "AIは作るところまで。" : "AI builds, not deploys."}
        </span>
        <span style={TAGLINE_STYLE}>
          {lang === "ja" ? "鍵と発射ボタンは人間。" : "Humans hold the keys and the launch button."}
        </span>
      </div>
    </div>
  );
}
