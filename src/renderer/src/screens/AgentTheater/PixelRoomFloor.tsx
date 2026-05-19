/**
 * PixelRoomFloor — richer CSS floor for 2.5D pixel room.
 * PXR-05B: stronger depth, visible tiles, vignette.
 */

export function PixelRoomFloor(): React.JSX.Element {
  return (
    <>
      {/* Main floor — dark tile grid */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: "57%",
        zIndex: 1,
        background: "#050d1a",
        backgroundImage:
          "linear-gradient(rgba(30,50,120,0.3) 1px, transparent 1px)," +
          "linear-gradient(90deg, rgba(30,50,120,0.3) 1px, transparent 1px)",
        backgroundSize: "44px 30px",
      }} />

      {/* Alternating tile checkerboard (subtle) */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: "57%",
        zIndex: 1,
        backgroundImage:
          "repeating-conic-gradient(rgba(20,35,90,0.12) 0% 25%, transparent 0% 50%)",
        backgroundSize: "44px 30px",
        pointerEvents: "none",
      }} />

      {/* Wall→floor shadow (depth) */}
      <div aria-hidden style={{
        position: "absolute",
        top: "41%", left: 0, right: 0,
        height: 70,
        zIndex: 2,
        background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* Front edge darkening */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: 28,
        zIndex: 2,
        background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.55) 100%)",
        pointerEvents: "none",
      }} />

      {/* Side vignette left */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: 0, left: 0,
        width: 80, height: "57%",
        zIndex: 2,
        background: "linear-gradient(90deg, rgba(0,0,0,0.4) 0%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* Side vignette right */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: 0, right: 0,
        width: 80, height: "57%",
        zIndex: 2,
        background: "linear-gradient(270deg, rgba(0,0,0,0.4) 0%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* Center aisle glow */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: "2%", left: "50%",
        transform: "translateX(-50%)",
        width: "30%", height: "40%",
        zIndex: 1,
        background: "radial-gradient(ellipse, rgba(88,166,255,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
    </>
  );
}
