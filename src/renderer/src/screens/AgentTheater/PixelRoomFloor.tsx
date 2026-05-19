/**
 * PixelRoomFloor — CSS perspective floor grid for the 2.5D pixel room stage.
 * Absolute positioned within the stage. Covers bottom 55% of stage.
 */

export function PixelRoomFloor(): React.JSX.Element {
  return (
    <>
      {/* Main floor surface */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: "57%",
        zIndex: 1,
        background: "#05090f",
        backgroundImage:
          "linear-gradient(rgba(30,50,120,0.22) 1px, transparent 1px)," +
          "linear-gradient(90deg, rgba(30,50,120,0.22) 1px, transparent 1px)",
        backgroundSize: "44px 28px",
      }} />

      {/* Floor → wall transition gradient (depth shadow) */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: "53%",
        left: 0, right: 0,
        height: 60,
        zIndex: 2,
        background: "linear-gradient(180deg, transparent 0%, rgba(2,5,15,0.7) 100%)",
        pointerEvents: "none",
      }} />

      {/* Front edge shadow */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: 20,
        zIndex: 2,
        background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 100%)",
        pointerEvents: "none",
      }} />

      {/* Center-convergence lines for slight depth feel */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: "57%",
        zIndex: 2,
        backgroundImage:
          "linear-gradient(rgba(30,50,120,0.12) 1px, transparent 1px)",
        backgroundSize: "100% 14px",
        backgroundPosition: "0 0",
        pointerEvents: "none",
        maskImage: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 50%)",
        WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 50%)",
      }} />
    </>
  );
}
