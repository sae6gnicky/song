import React, { useEffect } from "react";
import { Composition, staticFile, continueRender, delayRender } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { loadFont as loadKrFont } from "@remotion/google-fonts/NotoSansKR";
import { loadFont as loadDisplayFont } from "@remotion/google-fonts/Orbitron";
import { ElementMusicVideo, AUDIO_SRC } from "./ElementMusicVideo";
import {
  FPS,
  FALLBACK_DURATION_SEC,
  lrcLastTime,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "./data/timeline";

// LRC 마지막 가사 시각 + 여유 2.5초를 폴백 길이로 사용
const FALLBACK_SEC = Math.max(FALLBACK_DURATION_SEC, lrcLastTime() + 2.5);

// 한글 가독성 폰트(Noto Sans KR) + 영문 테크 폰트(Orbitron)
const kr = loadKrFont("normal", { weights: ["500", "700", "900"] });
const display = loadDisplayFont();

// CSS 변수로 폰트 패밀리 노출 (컴포넌트에서 var(--kr-font) 등으로 사용)
if (typeof document !== "undefined") {
  const root = document.documentElement;
  root.style.setProperty("--kr-font", kr.fontFamily);
  root.style.setProperty("--display-font", display.fontFamily);
}

export const RemotionRoot: React.FC = () => {
  // 폰트가 완전히 로드될 때까지 렌더 대기 (텍스트가 폰트 없이 캡처되는 것 방지)
  useEffect(() => {
    const handle = delayRender("loading-fonts");
    Promise.all([kr.waitUntilDone(), display.waitUntilDone()])
      .catch(() => undefined)
      .finally(() => continueRender(handle));
  }, []);

  return (
    <Composition
      id="ElementOneMore"
      component={ElementMusicVideo}
      durationInFrames={Math.round(FALLBACK_SEC * FPS)}
      fps={FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      defaultProps={{
        totalDurationInFrames: Math.round(FALLBACK_SEC * FPS),
      }}
      // 실제 오디오 길이에 맞춰 영상 길이/씬 배분 자동 조정
      calculateMetadata={async () => {
        try {
          const dur = await getAudioDurationInSeconds(staticFile(AUDIO_SRC));
          const frames = Math.max(1, Math.round(dur * FPS));
          return {
            durationInFrames: frames,
            props: { totalDurationInFrames: frames },
          };
        } catch (e) {
          const frames = Math.round(FALLBACK_SEC * FPS);
          return {
            durationInFrames: frames,
            props: { totalDurationInFrames: frames },
          };
        }
      }}
    />
  );
};
