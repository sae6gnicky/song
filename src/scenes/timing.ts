import { FPS, type LyricEvent, type Scene } from "../data/timeline";

// 씬 내에서 각 이벤트가 등장하는 로컬 프레임 계산
export interface TimedEvent extends LyricEvent {
  localFrame: number; // 씬 시작 기준 등장 프레임
}

export function timedEvents(scene: Scene): TimedEvent[] {
  return scene.events.map((e) => ({
    ...e,
    localFrame: Math.max(0, Math.round((e.time - scene.start) * FPS)),
  }));
}

// 현재 프레임에서 활성(이미 등장한) 이벤트의 인덱스 반환 (-1 = 아직 없음)
export function activeIndex(events: TimedEvent[], frame: number): number {
  let idx = -1;
  for (let i = 0; i < events.length; i++) {
    if (frame >= events[i].localFrame) idx = i;
    else break;
  }
  return idx;
}
