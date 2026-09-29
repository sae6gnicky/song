import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { PeriodicTable } from "../components/PeriodicTable";
import { Legend } from "../components/Legend";
import { ELEMENTS } from "../data/elements";
import { SectionLabel } from "./LyricScene";
import type { Scene } from "../data/timeline";

const ALL = new Set(ELEMENTS.map((e) => e.symbol));

// 최종 후렴: 전체 주기율표를 위에 크게 + 하단에 가사/범례 요약
export const FinalChorus: React.FC<{
  scene: Scene;
  durationInFrames: number;
}> = ({ scene, durationInFrames }) => {
  const frame = useCurrentFrame();
  const accent = "#4cc9f0";
  const n = scene.lines.length;
  const per = durationInFrames / n;
  const idx = Math.min(n - 1, Math.floor(frame / per));

  const tableOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <SectionLabel title={scene.title ?? "FINAL"} accent={accent} />

      <div
        style={{
          marginTop: 130,
          opacity: tableOpacity,
          transform: "scale(0.82)",
          transformOrigin: "top center",
        }}
      >
        <PeriodicTable active={ALL} focus={null} scale={1} />
      </div>

      {/* 현재 가사 라인 */}
      <div
        style={{
          position: "absolute",
          bottom: 150,
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "0 120px",
        }}
      >
        {scene.lines[idx]?.en && (
          <div
            style={{
              fontSize: 44,
              fontWeight: 800,
              color: accent,
              textShadow: `0 0 24px ${accent}aa`,
              fontFamily: "var(--display-font, sans-serif)",
            }}
          >
            {scene.lines[idx].en}
          </div>
        )}
        {scene.lines[idx]?.ko && (
          <div
            style={{
              fontSize: 34,
              fontWeight: 700,
              color: "#fff",
              marginTop: 6,
              fontFamily: "var(--kr-font, sans-serif)",
            }}
          >
            {scene.lines[idx].ko}
          </div>
        )}
      </div>

      <div style={{ position: "absolute", bottom: 50, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Legend />
      </div>
    </AbsoluteFill>
  );
};
