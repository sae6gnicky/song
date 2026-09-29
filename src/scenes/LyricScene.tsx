import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Scene } from "../data/timeline";

// 영어/한글 가사 라인을 순차적으로 표시 (Intro-lyric, Chorus, Pre-chorus, Final)
export const LyricScene: React.FC<{
  scene: Scene;
  durationInFrames: number;
  accent?: string;
  bigEnglish?: boolean;
}> = ({ scene, durationInFrames, accent = "#4cc9f0", bigEnglish }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = scene.lines.length;
  const per = durationInFrames / n;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "0 120px",
      }}
    >
      {scene.title && (
        <SectionLabel title={scene.title} accent={accent} />
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 22,
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {scene.lines.map((line, i) => {
          const appear = i * per;
          const local = frame - appear;
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
          const isCurrent = frame >= appear && frame < appear + per;

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `translateY(${y}px)`,
              }}
            >
              {line.en && (
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
                  {line.en}
                </div>
              )}
              {line.ko && (
                <div
                  style={{
                    fontSize: line.en ? 26 : 44,
                    fontWeight: line.en ? 500 : 700,
                    color: line.en
                      ? "rgba(255,255,255,0.6)"
                      : isCurrent
                      ? accent
                      : "rgba(255,255,255,0.9)",
                    marginTop: line.en ? 4 : 0,
                    textShadow:
                      !line.en && isCurrent ? `0 0 20px ${accent}88` : "none",
                    fontFamily: "var(--kr-font, sans-serif)",
                  }}
                >
                  {line.ko}
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
