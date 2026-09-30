import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Scene } from "../data/timeline";
import { activeIndex, timedEvents } from "./timing";

// 영어/한글 가사 라인을 정확한 시각에 순차 표시
export const LyricScene: React.FC<{
  scene: Scene;
  accent?: string;
  bigEnglish?: boolean;
}> = ({ scene, accent = "#4cc9f0", bigEnglish }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const events = timedEvents(scene);
  const currentIdx = activeIndex(events, frame);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "0 120px",
      }}
    >
      {scene.title && <SectionLabel title={scene.title} accent={accent} />}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 22,
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {events.map((ev, i) => {
          const local = frame - ev.localFrame;
          const s = spring({
            frame: Math.max(0, local),
            fps,
            config: { damping: 200 },
          });
          const opacity = interpolate(local, [0, 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const y = interpolate(s, [0, 1], [30, 0]);
          const isCurrent = i === currentIdx;

          return (
            <div key={i} style={{ opacity, transform: `translateY(${y}px)` }}>
              {ev.en && (
                <div
                  style={{
                    fontSize: bigEnglish ? 66 : 46,
                    fontWeight: 800,
                    color: isCurrent ? accent : "rgba(255,255,255,0.9)",
                    textShadow: isCurrent ? `0 0 24px ${accent}aa` : "none",
                    lineHeight: 1.15,
                    fontFamily: "var(--display-font, sans-serif)",
                  }}
                >
                  {ev.en}
                </div>
              )}
              {ev.ko && (
                <div
                  style={{
                    fontSize: ev.en ? 26 : 44,
                    fontWeight: ev.en ? 500 : 700,
                    color: ev.en
                      ? "rgba(255,255,255,0.6)"
                      : isCurrent
                      ? accent
                      : "rgba(255,255,255,0.9)",
                    marginTop: ev.en ? 4 : 0,
                    textShadow:
                      !ev.en && isCurrent ? `0 0 20px ${accent}88` : "none",
                    fontFamily: "var(--kr-font, sans-serif)",
                  }}
                >
                  {ev.ko}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const SectionLabel: React.FC<{ title: string; accent: string }> = ({
  title,
  accent,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 70,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity,
      }}
    >
      <span
        style={{
          fontSize: 22,
          letterSpacing: 8,
          fontWeight: 700,
          color: accent,
          border: `2px solid ${accent}`,
          borderRadius: 999,
          padding: "8px 22px",
          textShadow: `0 0 16px ${accent}`,
          fontFamily: "var(--display-font, sans-serif)",
        }}
      >
        {title}
      </span>
    </div>
  );
};
