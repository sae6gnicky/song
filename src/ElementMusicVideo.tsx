import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Background } from "./components/Background";
import { SCENES, sceneDurations } from "./data/timeline";
import { IntroSymbols } from "./scenes/IntroSymbols";
import { LyricScene } from "./scenes/LyricScene";
import { ElementRun } from "./scenes/ElementRun";
import { FinalChorus } from "./scenes/FinalChorus";
import { Outro } from "./scenes/Outro";

// 오디오 파일명 (public/ 아래). 저장소 파일명이 공백을 포함하므로 encode.
export const AUDIO_SRC = "One More.mp3";

const CHORUS_ACCENT = "#ffd166";
const PRECHORUS_ACCENT = "#8ac926";
const INTRO_ACCENT = "#4cc9f0";

export const ElementMusicVideo: React.FC<{ totalDurationInFrames: number }> = ({
  totalDurationInFrames,
}) => {
  const totalSec = totalDurationInFrames / 30;
  const scenes = sceneDurations(totalSec);

  return (
    <AbsoluteFill style={{ backgroundColor: "#06060d" }}>
      <Audio src={staticFile(AUDIO_SRC)} />
      <Background />

      {scenes.map(({ scene, fromFrame, durationInFrames }) => (
        <Sequence
          key={scene.id}
          from={fromFrame}
          durationInFrames={durationInFrames}
          name={`${scene.title || scene.type} (${scene.id})`}
        >
          {renderScene(scene.type, scene, durationInFrames)}
        </Sequence>
      ))}

      {/* 워터마크 / 타이틀 */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 40,
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: 4,
          color: "rgba(255,255,255,0.5)",
          fontFamily: "var(--display-font, sans-serif)",
        }}
      >
        ELEMENT · One More
      </div>
    </AbsoluteFill>
  );
};

function renderScene(
  type: string,
  scene: (typeof SCENES)[number],
  durationInFrames: number
) {
  switch (type) {
    case "intro-symbols":
      return <IntroSymbols scene={scene} durationInFrames={durationInFrames} />;
    case "intro-lyric":
      return (
        <LyricScene
          scene={scene}
          durationInFrames={durationInFrames}
          accent={INTRO_ACCENT}
          bigEnglish
        />
      );
    case "element-run":
      return <ElementRun scene={scene} durationInFrames={durationInFrames} />;
    case "prechorus":
      return (
        <LyricScene
          scene={scene}
          durationInFrames={durationInFrames}
          accent={PRECHORUS_ACCENT}
        />
      );
    case "chorus":
      return (
        <LyricScene
          scene={scene}
          durationInFrames={durationInFrames}
          accent={CHORUS_ACCENT}
          bigEnglish
        />
      );
    case "final-chorus":
      return <FinalChorus scene={scene} durationInFrames={durationInFrames} />;
    case "outro":
      return <Outro scene={scene} durationInFrames={durationInFrames} />;
    default:
      return null;
  }
}
