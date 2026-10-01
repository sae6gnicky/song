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

  // 줄이 많은 씬(Pre-Chorus 12줄, Chorus 11줄)에서 큰 글씨가 넘치지 않도록
  // 줄 수에 따라 크기/간격을 부드럽게 축소 (8줄 이하는 100%, 그 이상은 점점 축소)
  const n = events.length;
  const fit = n <= 8 ? 1 : Math.max(0.66, 8 / n);
  const gap = Math.round(24 * fit);

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
          gap,
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
                    fontSize: Math.round((bigEnglish ? 66 : 46) * fit),
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
                    // 한글 단독 가사는 영어 가사와 비슷한 크기로 크게 (가독성)
                    fontSize: Math.round((ev.en ? 30 : bigEnglish ? 62 : 58) * fit),
                    fontWeight: ev.en ? 500 : 700,
                    color: ev.en
                      ? "rgba(255,255,255,0.65)"
                      : isCurrent
                      ? accent
                      : "rgba(255,255,255,0.92)",
                    marginTop: ev.en ? 6 : 0,
                    lineHeight: 1.25,
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
