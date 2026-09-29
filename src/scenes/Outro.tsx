import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Scene } from "../data/timeline";

// 아웃트로: ELEMENT / One more / Let's go!
export const Outro: React.FC<{ scene: Scene; durationInFrames: number }> = ({
  scene,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = scene.lines.length;
  const per = durationInFrames / (n + 1);

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", gap: 10 }}
    >
      {scene.lines.map((line, i) => {
        const appear = i * per;
        const local = frame - appear;
        const s = spring({
          frame: Math.max(0, local),
          fps,
          config: { damping: 12, mass: 0.7 },
        });
        const opacity = interpolate(local, [0, 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const big = i === 0;
        const last = i === n - 1;
        return (
          <div
            key={i}
            style={{
              fontSize: big ? 160 : last ? 110 : 70,
              fontWeight: 900,
              letterSpacing: big ? 12 : 2,
              color: last ? "#ff5964" : "#fff",
              opacity,
              transform: `scale(${0.6 + s * 0.4})`,
              textShadow: last
                ? "0 0 60px #ff5964"
                : "0 0 40px rgba(76,201,240,0.6)",
              fontFamily: "var(--display-font, sans-serif)",
            }}
          >
            {line.en}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
