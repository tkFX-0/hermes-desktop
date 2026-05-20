/**
 * PixelRoomWalls — dense back wall, PXR-05C: clearer indoor/outdoor separation.
 * Stronger window frames, indoor warm ambient, wall trim, roof line.
 * CSS-only. No image assets.
 */

const MONO = '"IBM Plex Mono", ui-monospace, monospace';
const SANS = '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif';

/* ── Detailed night window with clear indoor/outdoor separation ── */
function NightWindow({
  style,
}: {
  style?: React.CSSProperties;
}): React.JSX.Element {
  return (
    <div aria-hidden style={{ position: "relative", ...style }}>
      {/*
       * Outer frame — clearly part of the indoor wall.
       * Inner pane is near-pure black (outdoor night) vs the warm dark-blue wall.
       */}
      <div
        style={{
          width: 84,
          height: 64,
          border: "3.5px solid rgba(60,85,175,0.70)",
          borderRadius: 4,
          background:
            "#000208" /* near-black night sky — much darker than wall */,
          overflow: "hidden",
          boxShadow:
            "inset 0 0 14px rgba(0,0,0,0.92), " +
            "0 0 8px rgba(88,166,255,0.12), " +
            "0 2px 16px rgba(0,0,0,0.5)" /* indoor depth shadow */,
        }}
      >
        {/* OUTSIDE NIGHT SKY — pure dark, clearly "outdoors" */}
        <div
          style={{ position: "absolute", inset: 0, background: "#000308" }}
        />

        {/* Stars */}
        {[
          [7, 5],
          [19, 9],
          [36, 4],
          [52, 11],
          [14, 17],
          [44, 7],
          [60, 14],
          [28, 12],
          [55, 20],
          [8, 22],
        ].map(([x, y], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: i % 3 === 0 ? 2 : 1.5,
              height: i % 3 === 0 ? 2 : 1.5,
              borderRadius: "50%",
              background: "#fff",
              opacity: 0.4 + (i % 4) * 0.12,
            }}
          />
        ))}

        {/* Moon */}
        <div
          style={{
            position: "absolute",
            right: 8,
            top: 5,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "radial-gradient(circle, #f0e8c0 30%, #c8b880 100%)",
            boxShadow: "0 0 6px rgba(232,224,192,0.6)",
          }}
        />

        {/* Window dividers (cross frame) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            marginLeft: -1,
            width: 2,
            background: "rgba(40,60,140,0.7)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "45%",
            marginTop: -1,
            height: 2,
            background: "rgba(40,60,140,0.7)",
          }}
        />

        {/* City skyline */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 16,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, transparent 0%, #050818 60%)",
            }}
          />
          {[2, 8, 14, 21, 27, 34, 39, 46, 52, 58, 64, 70].map((lx, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: lx,
                bottom: 0,
                width: i % 2 === 0 ? 3 : 4,
                height: 5 + ((i * 3) % 8),
                background:
                  i % 3 === 0 ? "#f0883e" : i % 3 === 1 ? "#7eb8ff" : "#1a2650",
                opacity: i % 3 === 2 ? 0.85 : 0.55,
              }}
            />
          ))}
        </div>
      </div>

      {/* Window sill — protrudes into room, clearly indoor surface */}
      <div
        style={{
          width: 92,
          height: 7,
          background: "linear-gradient(180deg, #1e2c50 0%, #101e3a 100%)",
          border: "1px solid rgba(55,80,170,0.50)",
          borderTop: "2.5px solid rgba(70,100,200,0.65)",
          borderRadius: "0 0 3px 3px",
          marginTop: -1,
          marginLeft: -4,
          boxShadow: "0 2px 6px rgba(0,0,0,0.55)",
        }}
      />
    </div>
  );
}

/* ── Wall control panel with blinking LEDs ── */
function WallControlPanel({
  accent,
  style,
}: {
  accent: string;
  style?: React.CSSProperties;
}): React.JSX.Element {
  return (
    <div
      aria-hidden
      style={{
        width: 62,
        height: 50,
        border: `1.5px solid ${accent}50`,
        borderRadius: 4,
        background: "#01060c",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: "5px 5px",
        boxShadow: `0 0 6px ${accent}10`,
        ...style,
      }}
    >
      <div
        style={{
          fontSize: 5.5,
          fontFamily: MONO,
          color: `${accent}88`,
          marginBottom: 1,
          letterSpacing: 0.5,
        }}
      >
        SYSTEM
      </div>
      {[
        { color: accent, lit: true, label: "STAT" },
        { color: "#3fb950", lit: false, label: "RDY" },
        { color: "#f0883e", lit: true, label: "HOLD" },
        { color: "#f85149", lit: true, label: "LOCK" },
      ].map((row, i) => (
        <div key={i} style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              flexShrink: 0,
              background: row.lit ? row.color : "transparent",
              border: `1px solid ${row.color}66`,
              boxShadow: row.lit ? `0 0 5px ${row.color}` : "none",
            }}
            className={row.lit ? "pxr-blink" : undefined}
          />
          <div
            style={{
              flex: 1,
              height: 3,
              borderRadius: 1,
              background: `${row.color}${row.lit ? "44" : "18"}`,
            }}
          />
          <span
            style={{
              fontFamily: MONO,
              fontSize: 4.5,
              color: `${row.color}88`,
              width: 16,
            }}
          >
            {row.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Status board ── */
function StatusBoard(): React.JSX.Element {
  const agents: [string, string, string][] = [
    ["しきしま", "管制デスク", "#7eb8ff"],
    ["しずめ", "安全ゲート", "#f85149"],
    ["むすび", "計画デスク", "#3fb950"],
    ["つむぐ", "開発ベンチ", "#f0883e"],
    ["しるべ", "記録ログ", "#b07fff"],
  ];
  return (
    <div
      aria-hidden
      style={{
        width: 140,
        minHeight: 88,
        border: "1.5px solid rgba(88,166,255,0.4)",
        borderRadius: 5,
        background: "rgba(3,8,22,0.9)",
        padding: "6px 9px",
        boxShadow: "0 0 12px rgba(88,166,255,0.1)",
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 7.5,
          color: "#7eb8ff",
          letterSpacing: 1.5,
          marginBottom: 6,
          textTransform: "uppercase" as const,
        }}
      >
        管制ボード
      </div>
      {agents.map(([name, role, color]) => (
        <div
          key={name}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            marginBottom: 4,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              flexShrink: 0,
              background: color,
              boxShadow: `0 0 5px ${color}`,
            }}
          />
          <span
            style={{ fontFamily: MONO, fontSize: 8, color, letterSpacing: 0.3 }}
          >
            {name}
          </span>
          <span style={{ fontFamily: SANS, fontSize: 7, color: "#5566aa" }}>
            {role}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Back wall bookshelf ── */
function WallBookshelf(): React.JSX.Element {
  const colors = [
    "#b07fff",
    "#3fb950",
    "#f0883e",
    "#7eb8ff",
    "#f85149",
    "#b07fff",
    "#3fb950",
    "#f0883e",
  ];
  return (
    <div
      aria-hidden
      style={{
        width: 68,
        border: "1.5px solid rgba(176,127,255,0.4)",
        borderRadius: 4,
        background: "rgba(3,1,12,0.9)",
        padding: "4px 5px",
        boxShadow: "0 0 8px rgba(176,127,255,0.08)",
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 6,
          color: "#b07fff88",
          marginBottom: 3,
          letterSpacing: 0.5,
        }}
      >
        ARCHIVE
      </div>
      {[colors.slice(0, 3), colors.slice(3, 6), colors.slice(6)].map(
        (shelf, si) => (
          <div key={si} style={{ marginBottom: 4 }}>
            <div
              style={{
                display: "flex",
                gap: 1.5,
                alignItems: "flex-end",
                marginBottom: 1.5,
              }}
            >
              {shelf.map((c, bi) => (
                <div
                  key={bi}
                  style={{
                    width: 7,
                    height: 10 + bi * 3,
                    background: c,
                    borderRadius: "1px 1px 0 0",
                    opacity: 0.82,
                  }}
                />
              ))}
            </div>
            <div
              style={{ height: 1.5, background: "rgba(176,127,255,0.25)" }}
            />
          </div>
        ),
      )}
    </div>
  );
}

/* ── Wall lamp with warm glow ── */
function WallLamp({
  color = "#f0883e",
  style,
}: {
  color?: string;
  style?: React.CSSProperties;
}): React.JSX.Element {
  return (
    <div
      aria-hidden
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...style,
      }}
    >
      <div style={{ width: 2, height: 12, background: "#5a4020" }} />
      <div
        style={{
          width: 18,
          height: 9,
          background: color,
          borderRadius: "3px 3px 8px 8px",
          opacity: 0.9,
          boxShadow: `0 2px 12px ${color}99, 0 0 20px ${color}55`,
        }}
      />
      <div
        style={{
          width: 36,
          height: 12,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${color}38 0%, transparent 70%)`,
          marginTop: -3,
        }}
      />
    </div>
  );
}

/* ── Pixel plant ── */
function PixelPlant({
  style,
}: {
  style?: React.CSSProperties;
}): React.JSX.Element {
  return (
    <div
      aria-hidden
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...style,
      }}
    >
      <div style={{ display: "flex", gap: 2, marginBottom: -3 }}>
        <div
          style={{
            width: 11,
            height: 15,
            background: "#1a4d1a",
            borderRadius: "50% 50% 20% 20%",
            transform: "rotate(-18deg)",
            opacity: 0.85,
          }}
        />
        <div
          style={{
            width: 11,
            height: 18,
            background: "#267326",
            borderRadius: "50% 50% 20% 20%",
            opacity: 0.9,
          }}
        />
        <div
          style={{
            width: 11,
            height: 14,
            background: "#1a4d1a",
            borderRadius: "50% 50% 20% 20%",
            transform: "rotate(18deg)",
            opacity: 0.85,
          }}
        />
      </div>
      <div
        style={{
          width: 20,
          height: 12,
          background: "#5c3d20",
          borderRadius: "2px 2px 5px 5px",
          border: "1px solid #3d2810",
        }}
      />
    </div>
  );
}

/* ── Main walls ── */
export function PixelRoomWalls(): React.JSX.Element {
  return (
    <>
      {/*
       * Ceiling plane — clearly separate from the back wall.
       * Slightly warmer/lighter to suggest an indoor ceiling with overhead lights.
       */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "12%",
          zIndex: 5,
          background: "linear-gradient(180deg, #09102a 0%, #070e22 100%)",
          borderBottom: "2px solid rgba(80,110,220,0.45)",
        }}
      />

      {/* Ceiling center light bloom (overhead fixture glow) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "40%",
          height: "14%",
          zIndex: 5,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(120,160,255,0.18) 0%, transparent 80%)",
          pointerEvents: "none",
        }}
      />

      {/* Back wall — indoor panel texture */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "12%",
          left: 0,
          right: 0,
          height: "31%",
          zIndex: 5,
          background:
            "linear-gradient(180deg, #040b1e 0%, #050c20 60%, #060d22 100%)",
          /* horizontal panel lines (every 52px) + subtle vertical grid */
          backgroundImage:
            "linear-gradient(rgba(55,80,180,0.22) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(40,60,140,0.10) 1px, transparent 1px)",
          backgroundSize: "100% 52px, 72px 100%",
          borderBottom: "3px solid rgba(60,85,180,0.60)",
        }}
      />

      {/* Indoor ambient light — warm center bloom on back wall */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "12%",
          left: "20%",
          right: "20%",
          height: "30%",
          zIndex: 5,
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(88,120,220,0.09) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Wall/floor junction — strong deep shadow at the base */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "41%",
          left: 0,
          right: 0,
          height: 70,
          zIndex: 6,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.20) 60%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Wall/floor accent line — glowing baseboard */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "43%",
          left: 0,
          right: 0,
          height: 3,
          zIndex: 6,
          background:
            "linear-gradient(90deg, rgba(30,50,120,0.3), rgba(88,166,255,0.55), rgba(30,50,120,0.3))",
          boxShadow: "0 0 8px rgba(88,166,255,0.25)",
        }}
      />

      {/* Baseboard trim panel */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "42.5%",
          left: 14,
          right: 14,
          height: 5,
          zIndex: 6,
          background: "rgba(20,35,90,0.70)",
          borderTop: "1px solid rgba(70,95,200,0.40)",
          borderBottom: "1px solid rgba(10,20,55,0.60)",
        }}
      />

      {/* LEFT: control panel */}
      <div
        aria-hidden
        style={{ position: "absolute", top: "4%", left: "2%", zIndex: 6 }}
      >
        <WallControlPanel accent="#f85149" />
      </div>

      {/* LEFT: wall lamp */}
      <div style={{ position: "absolute", top: "3%", left: "13%", zIndex: 6 }}>
        <WallLamp color="#f0883e" />
      </div>

      {/* LEFT: night window */}
      <div
        aria-hidden
        style={{ position: "absolute", top: "13%", left: "16%", zIndex: 6 }}
      >
        <NightWindow />
      </div>

      {/* LEFT: plant */}
      <div style={{ position: "absolute", top: "22%", left: "12%", zIndex: 6 }}>
        <PixelPlant />
      </div>

      {/* CENTER: status board */}
      <div
        style={{
          position: "absolute",
          top: "4%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 6,
        }}
      >
        <StatusBoard />
      </div>

      {/* CENTER: room label */}
      <div
        style={{
          position: "absolute",
          top: "1.5%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 7,
          fontFamily: MONO,
          fontSize: 9,
          letterSpacing: 2.5,
          color: "rgba(126,184,255,0.5)",
          textTransform: "uppercase" as const,
          whiteSpace: "nowrap",
          textShadow: "0 0 8px rgba(88,166,255,0.3)",
        }}
      >
        🌙 管制室 · NIGHT OPS
      </div>

      {/* RIGHT: wall lamp */}
      <div style={{ position: "absolute", top: "3%", right: "13%", zIndex: 6 }}>
        <WallLamp color="#7eb8ff" />
      </div>

      {/* RIGHT: night window */}
      <div
        aria-hidden
        style={{ position: "absolute", top: "13%", right: "16%", zIndex: 6 }}
      >
        <NightWindow />
      </div>

      {/* RIGHT: bookshelf */}
      <div
        aria-hidden
        style={{ position: "absolute", top: "4%", right: "2%", zIndex: 6 }}
      >
        <WallBookshelf />
      </div>

      {/* RIGHT: plant */}
      <div
        style={{ position: "absolute", top: "22%", right: "12%", zIndex: 6 }}
      >
        <PixelPlant />
      </div>

      {/* Left side wall sliver */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 14,
          bottom: 0,
          zIndex: 5,
          background: "linear-gradient(90deg, #010204 0%, #030610 100%)",
          borderRight: "1px solid rgba(30,50,120,0.45)",
        }}
      />

      {/* Right side wall sliver */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 14,
          bottom: 0,
          zIndex: 5,
          background: "linear-gradient(270deg, #010204 0%, #030610 100%)",
          borderLeft: "1px solid rgba(30,50,120,0.45)",
        }}
      />

      {/* Stars */}
      {[
        [4, 3],
        [11, 8],
        [21, 4],
        [32, 11],
        [46, 5],
        [58, 8],
        [69, 3],
        [80, 9],
        [88, 5],
        [93, 12],
        [38, 15],
        [62, 16],
        [25, 18],
        [72, 13],
        [50, 2],
      ].map(([x, y], i) => (
        <div
          key={i}
          aria-hidden
          style={{
            position: "absolute",
            left: `${x}%`,
            top: `${y}%`,
            width: i % 3 === 0 ? 2 : 1.5,
            height: i % 3 === 0 ? 2 : 1.5,
            borderRadius: "50%",
            background: "#fff",
            opacity: 0.14 + (i % 4) * 0.07,
            zIndex: 5,
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
}
