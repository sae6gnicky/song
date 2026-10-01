import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Background } from "./components/Background";
import { getScenes, FPS, type Scene } from "./data/timeline";
import { IntroSymbols } from "./scenes/IntroSymbols";
import { LyricScene } from "./scenes/LyricScene";
import { ElementRun } from "./scenes/ElementRun";
import { FinalChorus } from "./scenes/FinalChorus";
import { Outro } from "./scenes/Outro";

// 오디오 파일명 (public/ 아래).
export const AUDIO_SRC = "One More.mp3";

const CHORUS_ACCENT = "#ffd166";
const PRECHORUS_ACCENT = "#8ac926";
const INTRO_ACCENT = "#4cc9f0";

export const ElementMusicVideo: React.FC<{ totalDurationInFrames: number }> = ({
  totalDurationInFrames,
}) => {
  const totalSec = totalDurationInFrames / FPS;
  const scenes = getScenes(totalSec);

  return (
    <AbsoluteFill style={{ backgroundColor: "#06060d" }}>
      <Audio src={staticFile(AUDIO_SRC)} />
      <Background />

      {scenes.map((scene) => {
        const from = Math.round(scene.start * FPS);
        const duration = Math.max(1, Math.round((scene.end - scene.start) * FPS));
        return (
          <Sequence
            key={scene.id}
            from={from}
            durationInFrames={duration}
            name={`${scene.title || scene.type} (${scene.id})`}
          >
            {renderScene(scene, duration)}
          </Sequence>
        );
      })}

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

function renderScene(scene: Scene, durationInFrames: number) {
  switch (scene.type) {
    case "intro-symbols":
      return <IntroSymbols scene={scene} />;
    case "intro-lyric":
      return <LyricScene scene={scene} accent={INTRO_ACCENT} bigEnglish />;
    case "element-run":
      return <ElementRun scene={scene} />;
    case "prechorus":
      return <LyricScene scene={scene} accent={PRECHORUS_ACCENT} />;
    case "chorus":
      return <LyricScene scene={scene} accent={CHORUS_ACCENT} bigEnglish />;
    case "final-chorus":
      return <FinalChorus scene={scene} />;
    case "outro":
      return <Outro scene={scene} />;
    default:
      return null;
  }
}
