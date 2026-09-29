import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PeriodicTable } from "../components/PeriodicTable";
import { SectionLabel } from "./LyricScene";
import { CATEGORY_COLORS, CATEGORY_LABELS_KO, getElement } from "../data/elements";
import type { Scene } from "../data/timeline";

// 원소 나열: 왼쪽 대형 타이포(한글명 + 기호), 오른쪽 주기율표 채워짐
export const ElementRun: React.FC<{
  scene: Scene;
  durationInFrames: number;
}> = ({ scene, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const symbols = scene.lines.map((l) => l.symbol!).filter(Boolean);
  const per = durationInFrames / symbols.length;
  const idx = Math.min(symbols.length - 1, Math.floor(frame / per));
  const currentSymbol = symbols[idx];
  const currentLine = scene.lines[idx];
  const el = getElement(currentSymbol);
  const accent = el ? CATEGORY_COLORS[el.category] : "#4cc9f0";

  // 지금까지 등장한 원소 누적 하이라이트
  const active = new Set(symbols.slice(0, idx + 1));

  // 현재 원소 등장 애니메이션 (per 구간 내 로컬 프레임)
  const localInStep = frame - idx * per;
  const pop = spring({
    frame: Math.max(0, localInStep),
    fps,
    config: { damping: 14, mass: 0.6 },
  });
  const symbolScale = 0.6 + pop * 0.4;
  const koOpacity = interpolate(localInStep, [2, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {scene.title && <SectionLabel title={scene.title} accent={accent} />}

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "0 80px",
          gap: 40,
        }}
      >
        {/* 왼쪽: 대형 타이포 */}
        <div
          style={{
            flex: "0 0 620px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 34,
              fontWeight: 600,
              color: "rgba(255,255,255,0.55)",
              opacity: koOpacity,
              fontFamily: "var(--kr-font, sans-serif)",
            }}
          >
            {el ? `원자번호 ${el.number}` : ""}
          </div>
          <div
            style={{
              fontSize: 260,
              fontWeight: 900,
              lineHeight: 1,
              color: accent,
              textShadow: `0 0 50px ${accent}aa`,
              transform: `scale(${symbolScale})`,
              transformOrigin: "left center",
              fontFamily: "var(--display-font, sans-serif)",
            }}
          >
            {currentSymbol}
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#fff",
              opacity: koOpacity,
              marginTop: 8,
              fontFamily: "var(--kr-font, sans-serif)",
            }}
          >
            {currentLine?.ko}
          </div>
          {el && (
            <div
              style={{
                marginTop: 18,
                fontSize: 22,
                fontWeight: 700,
                color: accent,
                border: `2px solid ${accent}`,
                borderRadius: 999,
                padding: "6px 18px",
                opacity: koOpacity,
                fontFamily: "var(--kr-font, sans-serif)",
              }}
            >
              {el.group >= 1
                ? `${el.group}족 · ${el.period}주기`
                : `${el.period}주기 · f-블록`}
              {"  ·  "}
              {CATEGORY_LABELS_KO[el.category]}
            </div>
          )}
          {scene.highlightGroupNote && (
            <div
              style={{
                marginTop: 22,
                fontSize: 20,
                color: "rgba(255,255,255,0.45)",
                fontFamily: "var(--kr-font, sans-serif)",
              }}
            >
              {scene.highlightGroupNote}
            </div>
          )}
        </div>

        {/* 오른쪽: 주기율표 그리드 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PeriodicTable active={active} focus={currentSymbol} scale={0.92} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
