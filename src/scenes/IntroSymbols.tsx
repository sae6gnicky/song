import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CATEGORY_COLORS, getElement } from "../data/elements";
import type { Scene } from "../data/timeline";

// 인트로: 원소기호를 하나씩 크게 튀어나오게
export const IntroSymbols: React.FC<{ scene: Scene; durationInFrames: number }> = ({
  scene,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const symbols = scene.lines.map((l) => l.symbol!).filter(Boolean);
  const per = durationInFrames / symbols.length;

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 28,
          justifyContent: "center",
          maxWidth: 1400,
        }}
      >
        {symbols.map((sym, i) => {
          const appear = i * per;
          const local = frame - appear;
          const s = spring({
            frame: Math.max(0, local),
            fps,
            config: { damping: 13, mass: 0.6 },
          });
          const el = getElement(sym);
          const color = el ? CATEGORY_COLORS[el.category] : "#fff";
          const opacity = interpolate(local, [0, 6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={sym + i}
              style={{
                fontSize: 120,
                fontWeight: 900,
                color,
                opacity,
                transform: `scale(${0.4 + s * 0.6})`,
                textShadow: `0 0 30px ${color}aa`,
                fontFamily: "var(--display-font, sans-serif)",
              }}
            >
              {sym}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
