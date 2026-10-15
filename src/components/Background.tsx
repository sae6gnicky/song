import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

// 은은하게 움직이는 그라디언트 배경 + 그리드 라인
export const Background: React.FC<{ hue?: number }> = ({ hue = 250 }) => {
  const frame = useCurrentFrame();
  const shift = Math.sin(frame / 90) * 8;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 120% at 50% ${
          30 + shift
        }%, #171a2e 0%, #0b0b16 55%, #06060d 100%)`,
      }}
    >
      {/* subtle grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(120% 120% at 50% 50%, black 40%, transparent 90%)",
        }}
      />
    </AbsoluteFill>
  );
};
