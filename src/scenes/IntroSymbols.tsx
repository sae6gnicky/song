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
import { timedEvents } from "./timing";

// 인트로: "H, He" 같은 줄을 정확한 시각에 등장시키며 기호별로 크게 표시
export const IntroSymbols: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 각 줄을 콤마로 분해해 (기호, 등장프레임) 목록 생성
  const events = timedEvents(scene);
  const symbols: { sym: string; appear: number }[] = [];
  for (let li = 0; li < events.length; li++) {
    const ev = events[li];
    const parts = ev.raw.split(/,\s*/).map((s) => s.trim()).filter(Boolean);
    const next = events[li + 1];
    const span = (next ? next.localFrame : ev.localFrame + fps) - ev.localFrame;
    parts.forEach((sym, pi) => {
      const appear = ev.localFrame + Math.round((span / parts.length) * pi);
      symbols.push({ sym, appear });
    });
  }

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 28,
          justifyContent: "center",
          maxWidth: 1400,
        }}
      >
        {symbols.map(({ sym, appear }, i) => {
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
