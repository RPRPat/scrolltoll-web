import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#0A0A0A",
          color: "white",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          width: "100%",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 108,
            fontWeight: 800,
            letterSpacing: "-0.04em",
          }}
        >
          <span style={{ color: "#39FF14" }}>SCROLL</span>
          <span style={{ color: "#FF2E97" }}>TOLL</span>
        </div>
        <div
          style={{
            color: "white",
            display: "flex",
            fontSize: 44,
            marginTop: 26,
          }}
        >
          Your Doom Scrolling Feeds the World
        </div>
      </div>
    ),
    size,
  );
}
