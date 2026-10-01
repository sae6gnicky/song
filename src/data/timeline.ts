// LRC 기반 타임라인 생성.
// lyrics.lrc(=LRC_TEXT)의 정확한 타임스탬프를 파싱하여
// 각 가사 줄을 "이벤트"로, 섹션 마커를 기준으로 "씬"으로 묶는다.

import { LRC_TEXT } from "./lrc";
import { getElement } from "./elements";

export const FPS = 30;
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;

// LRC에 없을 경우의 폴백 곡 길이
export const FALLBACK_DURATION_SEC = 232; // ≈ 3:52

export type SceneType =
  | "intro-symbols"
  | "intro-lyric"
  | "element-run"
  | "prechorus"
  | "chorus"
  | "final-chorus"
  | "outro";

// 한 줄(가사/원소) 이벤트
export interface LyricEvent {
  time: number; // 시작 시각(초)
  raw: string; // 원문
  symbol?: string; // 원소기호 (원소 줄인 경우)
  ko?: string; // 한글 (원소명 or 한글 가사)
  en?: string; // 영어 가사
}

export interface Scene {
  id: string;
  type: SceneType;
  title: string;
  start: number; // 초
  end: number; // 초
  events: LyricEvent[];
  highlightGroupNote?: string;
}

// ── LRC 파싱 ────────────────────────────────────────────
interface RawLine {
  time: number;
  text: string;
  isSection: boolean;
}

function parseLrc(text: string): RawLine[] {
  const lines: RawLine[] = [];
  const timeRe = /^\[(\d{1,2}):(\d{2})(?:\.(\d{1,2}))?\](.*)$/;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    // 메타 태그([by:...], [ar:...] 등)는 스킵
    if (/^\[[a-z]+:/i.test(line) && !timeRe.test(line)) continue;
    const m = line.match(timeRe);
    if (!m) continue;
    const min = parseInt(m[1], 10);
    const sec = parseInt(m[2], 10);
    const frac = m[3] ? parseInt(m[3].padEnd(2, "0"), 10) / 100 : 0;
    const time = min * 60 + sec + frac;
    let content = m[4].trim();
    // 섹션 마커: [Intro], [Verse 1] 등
    const sectionMatch = content.match(/^\[(.+)\]$/);
    if (sectionMatch) {
      lines.push({ time, text: sectionMatch[1].trim(), isSection: true });
    } else {
      lines.push({ time, text: content, isSection: false });
    }
  }
  return lines.sort((a, b) => a.time - b.time);
}

// 원소 줄 판별 및 기호 추출: "수소 — H", "은 — Ag"
function toEvent(text: string): LyricEvent {
  // "이름 — 기호" 또는 "이름 - 기호" (em-dash/hyphen)
  const dashSplit = text.split(/\s*[—–-]\s*/);
  if (dashSplit.length === 2) {
    const [ko, sym] = dashSplit;
    if (getElement(sym.trim())) {
      return { time: 0, raw: text, symbol: sym.trim(), ko: ko.trim() };
    }
  }
  // "H, He" 같은 인트로 기호 나열은 raw 그대로 두고 상위에서 처리
  const hasHangul = /[가-힣]/.test(text);
  const hasLatin = /[A-Za-z]/.test(text);
  if (hasHangul && !hasLatin) return { time: 0, raw: text, ko: text };
  if (hasLatin && !hasHangul) return { time: 0, raw: text, en: text };
  // 혼합(영문 위주 가사)
  return { time: 0, raw: text, en: text };
}

// 섹션 이름 → SceneType 매핑
function sectionType(title: string, isFirstIntro: boolean): SceneType {
  const t = title.toLowerCase();
  if (t.includes("final chorus")) return "final-chorus";
  if (t.includes("chorus")) return "chorus";
  if (t.includes("pre")) return "prechorus";
  if (t.includes("verse")) return "element-run";
  if (t.includes("rap") || t.includes("bridge")) return "element-run";
  if (t.includes("intro")) return isFirstIntro ? "intro-symbols" : "intro-lyric";
  return "element-run";
}

const GROUP_NOTES: Record<string, string> = {
  "Verse 1": "주기 1~3 · 족을 따라 채워지는 전자껍질",
  "Verse 2": "주기 4 · 전이 금속이 처음 등장 (3~12족)",
  Rap: "전이 금속 · 준금속 구간",
  Bridge: "란타넘족 (57~71) · f-블록",
  "Final Rap": "주기 7 · 악티늄족 + 초중원소",
};

// ── 씬 빌드 ─────────────────────────────────────────────
function buildScenes(totalSec: number): Scene[] {
  const raw = parseLrc(LRC_TEXT);
  const scenes: Scene[] = [];
  let current: Scene | null = null;
  let introCount = 0;
  let sectionCounter = 0;

  const pushEventToCurrent = (time: number, text: string) => {
    if (!current) {
      // 섹션 마커 없이 시작하는 경우 대비
      current = {
        id: `scene-${sectionCounter++}`,
        type: "intro-symbols",
        title: "INTRO",
        start: time,
        end: totalSec,
        events: [],
      };
      scenes.push(current);
    }
    const ev = toEvent(text);
    ev.time = time;
    current.events.push(ev);
  };

  for (const line of raw) {
    if (line.isSection) {
      const isIntro = /intro/i.test(line.text);
      if (isIntro) introCount++;
      const type = sectionType(line.text, isIntro && introCount === 1);
      // 인트로 두 번째 블록은 lyric 타입으로
      current = {
        id: `scene-${sectionCounter++}`,
        type,
        title: line.text.toUpperCase(),
        start: line.time,
        end: totalSec,
        events: [],
        highlightGroupNote: GROUP_NOTES[line.text],
      };
      scenes.push(current);
    } else {
      pushEventToCurrent(line.time, line.text);
    }
  }

  // 인트로 처리: 첫 인트로 안에서 "One, two, three, four"부터는 별도 lyric 씬으로 분리
  // (LRC상 [Intro] 하나에 기호 나열 + 영어 후렴이 함께 들어있음)
  const refined: Scene[] = [];
  for (const sc of scenes) {
    if (sc.type === "intro-symbols") {
      const symbolEvents = sc.events.filter(
        (e) => !e.en || /^[A-Za-z, ]+$/.test(e.raw)
      );
      // 기호 나열부(라틴 알파벳 + 콤마) vs 영어 문장부 분리
      const symbolPart = sc.events.filter((e) =>
        /^[A-Za-z]{1,2}(,\s*[A-Za-z]{1,2})*$/.test(e.raw)
      );
      const lyricPart = sc.events.filter(
        (e) => !/^[A-Za-z]{1,2}(,\s*[A-Za-z]{1,2})*$/.test(e.raw)
      );
      if (symbolPart.length && lyricPart.length) {
        refined.push({
          ...sc,
          id: sc.id + "-sym",
          type: "intro-symbols",
          events: symbolPart,
          end: lyricPart[0].time,
        });
        refined.push({
          ...sc,
          id: sc.id + "-lyr",
          type: "intro-lyric",
          start: lyricPart[0].time,
          events: lyricPart,
        });
      } else {
        refined.push(sc);
      }
    } else {
      refined.push(sc);
    }
  }

  // end 시각 보정: 다음 씬 시작 = 현재 씬 끝
  for (let i = 0; i < refined.length; i++) {
    refined[i].end = i + 1 < refined.length ? refined[i + 1].start : totalSec;
  }

  // Outro 분리: Final Chorus 안의 ELEMENT/One more/Let's go!를 별도 outro 씬으로
  const withOutro: Scene[] = [];
  for (const sc of refined) {
    if (sc.type === "final-chorus") {
      const outroIdx = sc.events.findIndex((e) =>
        /^ELEMENT$/i.test(e.raw.trim())
      );
      if (outroIdx >= 0) {
        const mainEvents = sc.events.slice(0, outroIdx);
        const outroEvents = sc.events.slice(outroIdx);
        withOutro.push({
          ...sc,
          events: mainEvents,
          end: outroEvents[0].time,
        });
        withOutro.push({
          id: sc.id + "-outro",
          type: "outro",
          title: "",
          start: outroEvents[0].time,
          end: sc.end,
          events: outroEvents,
        });
      } else {
        withOutro.push(sc);
      }
    } else {
      withOutro.push(sc);
    }
  }

  return withOutro;
}

// 실제 오디오 길이(초)를 받아 씬 배열 반환 (메모이즈)
const cache = new Map<number, Scene[]>();
export function getScenes(totalSec: number): Scene[] {
  const key = Math.round(totalSec * 100);
  if (!cache.has(key)) cache.set(key, buildScenes(totalSec));
  return cache.get(key)!;
}

// LRC 마지막 타임스탬프(초) — 폴백 길이 계산용
export function lrcLastTime(): number {
  const raw = parseLrc(LRC_TEXT);
  return raw.length ? raw[raw.length - 1].time : FALLBACK_DURATION_SEC;
}
