// 가사 타임라인 — 사용자 제공 타임스탬프 기반.
// 각 씬은 시작 시각(sec)과 타입을 가지며, 다음 씬 시작 전까지 지속된다.
// 원소 나열 씬은 elements 배열(원소기호)을 균등 분배해 하이라이트한다.

export const FPS = 30;
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;

// 곡 총 길이(초). 실제 오디오 길이에 맞춰 Root에서 재계산됨.
export const SONG_DURATION_SEC = 230; // 3:50

export type SceneType =
  | "intro-symbols" // 원소기호만 크게 (H, He ...)
  | "intro-lyric" // 영어 후렴 도입 가사
  | "element-run" // 원소 나열 (한글명 — 기호), 주기율표 하이라이트
  | "prechorus" // 족 설명 (일 족은 하나 ...)
  | "chorus" // One more 후렴
  | "final-chorus" // 마무리 후렴 + 전체 요약
  | "outro"; // ELEMENT / One more / Let's go!

export interface LyricLine {
  ko?: string; // 상단/메인 한글 or 텍스트
  en?: string; // 영어 텍스트
  symbol?: string; // 원소기호 (element-run에서 대형 표시 + 하이라이트)
}

export interface Scene {
  id: string;
  start: number; // sec
  type: SceneType;
  title?: string; // 섹션 라벨 (예: Verse 1)
  lines: LyricLine[]; // 이 씬 동안 순차 표시할 라인들
  // element-run 전용: 하이라이트할 원소기호 순서 (lines에서 자동 추출도 가능)
  highlightGroupNote?: string; // 화면 하단 안내(족 설명)
}

export const SCENES: Scene[] = [
  // ── Intro ──────────────────────────────────────────────
  {
    id: "intro-1",
    start: 0,
    type: "intro-symbols",
    title: "INTRO",
    lines: [
      { symbol: "H" }, { symbol: "He" },
      { symbol: "Li" }, { symbol: "Be" },
      { symbol: "B" }, { symbol: "C" }, { symbol: "N" }, { symbol: "O" },
      { symbol: "F" }, { symbol: "Ne" },
    ],
  },
  {
    id: "intro-2",
    start: 8,
    type: "intro-lyric",
    title: "INTRO",
    lines: [
      { en: "One, two, three, four" },
      { en: "Elements open the door" },
      { en: "Periodic rhythm" },
      { en: "Let the science hit the floor" },
    ],
  },

  // ── Verse 1 ────────────────────────────────────────────
  {
    id: "verse1-a",
    start: 16,
    type: "element-run",
    title: "VERSE 1",
    highlightGroupNote: "주기 1~3 · 족을 따라 채워지는 전자껍질",
    lines: [
      { ko: "수소", symbol: "H" }, { ko: "헬륨", symbol: "He" },
      { ko: "리튬", symbol: "Li" }, { ko: "베릴륨", symbol: "Be" },
      { ko: "붕소", symbol: "B" }, { ko: "탄소", symbol: "C" },
      { ko: "질소", symbol: "N" }, { ko: "산소", symbol: "O" },
      { ko: "플루오린", symbol: "F" }, { ko: "네온", symbol: "Ne" },
      { ko: "소듐", symbol: "Na" }, { ko: "마그네슘", symbol: "Mg" },
      { ko: "알루미늄", symbol: "Al" }, { ko: "규소", symbol: "Si" },
    ],
  },
  {
    id: "verse1-b",
    start: 29,
    type: "element-run",
    title: "VERSE 1",
    highlightGroupNote: "주기 3 · 15~18족",
    lines: [
      { ko: "인", symbol: "P" }, { ko: "황", symbol: "S" },
      { ko: "염소", symbol: "Cl" }, { ko: "아르곤", symbol: "Ar" },
    ],
  },

  // ── Pre-Chorus ─────────────────────────────────────────
  {
    id: "prechorus-1",
    start: 37,
    type: "prechorus",
    title: "PRE-CHORUS",
    lines: [
      { ko: "일 족은 하나", en: "Group 1 → 최외각 전자 1개" },
      { ko: "하나를 놓아", en: "give one away" },
      { ko: "이 족은 둘", en: "Group 2 → 최외각 전자 2개" },
      { ko: "둘을 놓아", en: "give two away" },
    ],
  },
  {
    id: "prechorus-2",
    start: 45,
    type: "prechorus",
    title: "PRE-CHORUS",
    lines: [
      { ko: "십삼 족 셋", en: "Group 13 → 3" },
      { ko: "십사 족 넷", en: "Group 14 → 4" },
      { ko: "십오 족 다섯", en: "Group 15 → 5" },
      { ko: "십육 족 여섯", en: "Group 16 → 6" },
      { ko: "십칠 족은 하나 부족", en: "Group 17 wants one more" },
      { ko: "하나를 더 원해", en: "" },
      { ko: "십팔 족은 가득 차", en: "Group 18 is full" },
      { ko: "더 바랄 게 없어", en: "" },
    ],
  },

  // ── Chorus ─────────────────────────────────────────────
  {
    id: "chorus-1",
    start: 59,
    type: "chorus",
    title: "CHORUS",
    lines: [
      { en: "One more, one more", ko: "17족은 하나가 더 필요해" },
      { en: "Seventeen wants one more" },
      { en: "One more, one more", ko: "1족은 하나를 내보내" },
      { en: "Group one lets one go" },
      { en: "Full shell, full shell", ko: "18족은 껍질이 가득 찼어" },
      { en: "Eighteen is complete" },
      { ko: "헬륨은 둘이면 충분해", en: "He: 2 electrons" },
      { ko: "네온부터 여덟이면 돼", en: "Ne~: 8 electrons" },
      { en: "One more" },
      { en: "One more" },
      { en: "Remember the elemental beat" },
    ],
  },

  // ── Verse 2 ────────────────────────────────────────────
  {
    id: "verse2",
    start: 83,
    type: "element-run",
    title: "VERSE 2",
    highlightGroupNote: "주기 4 · 전이 금속이 처음 등장 (3~12족)",
    lines: [
      { ko: "포타슘", symbol: "K" }, { ko: "칼슘", symbol: "Ca" },
      { ko: "스칸듐", symbol: "Sc" }, { ko: "타이타늄", symbol: "Ti" },
      { ko: "바나듐", symbol: "V" }, { ko: "크로뮴", symbol: "Cr" },
      { ko: "망가니즈", symbol: "Mn" }, { ko: "철", symbol: "Fe" },
      { ko: "코발트", symbol: "Co" }, { ko: "니켈", symbol: "Ni" },
      { ko: "구리", symbol: "Cu" }, { ko: "아연", symbol: "Zn" },
      { ko: "갈륨", symbol: "Ga" }, { ko: "저마늄", symbol: "Ge" },
      { ko: "비소", symbol: "As" }, { ko: "셀레늄", symbol: "Se" },
      { ko: "브로민", symbol: "Br" }, { ko: "크립톤", symbol: "Kr" },
    ],
  },

  // ── Chorus 2 ───────────────────────────────────────────
  {
    id: "chorus-2",
    start: 97,
    type: "chorus",
    title: "CHORUS",
    lines: [
      { en: "One more, one more", ko: "17족은 하나가 더 필요해" },
      { en: "Seventeen wants one more" },
      { en: "One more, one more", ko: "1족은 하나를 내보내" },
      { en: "Group one lets one go" },
      { en: "Full shell, full shell", ko: "18족은 껍질이 가득 찼어" },
      { en: "Eighteen is complete" },
      { ko: "헬륨은 둘이면 충분해", en: "He: 2 electrons" },
      { ko: "네온부터 여덟이면 돼", en: "Ne~: 8 electrons" },
    ],
  },

  // ── Rap (Period 5) ─────────────────────────────────────
  {
    id: "rap-1",
    start: 112,
    type: "element-run",
    title: "RAP",
    highlightGroupNote: "주기 5 · Rb → Xe",
    lines: [
      { ko: "루비듐", symbol: "Rb" }, { ko: "스트론튬", symbol: "Sr" },
      { ko: "이트륨", symbol: "Y" }, { ko: "지르코늄", symbol: "Zr" },
      { ko: "나이오븀", symbol: "Nb" }, { ko: "몰리브데넘", symbol: "Mo" },
      { ko: "테크네튬", symbol: "Tc" }, { ko: "루테늄", symbol: "Ru" },
      { ko: "로듐", symbol: "Rh" }, { ko: "팔라듐", symbol: "Pd" },
      { ko: "은", symbol: "Ag" }, { ko: "카드뮴", symbol: "Cd" },
      { ko: "인듐", symbol: "In" }, { ko: "주석", symbol: "Sn" },
      { ko: "안티모니", symbol: "Sb" }, { ko: "텔루륨", symbol: "Te" },
      { ko: "아이오딘", symbol: "I" }, { ko: "제논", symbol: "Xe" },
    ],
  },

  // ── Bridge (Lanthanides) ───────────────────────────────
  {
    id: "bridge",
    start: 127,
    type: "element-run",
    title: "BRIDGE · 란타넘족",
    highlightGroupNote: "란타넘족 (57~71) · f-블록",
    lines: [
      { ko: "세슘", symbol: "Cs" }, { ko: "바륨", symbol: "Ba" },
      { ko: "란타넘", symbol: "La" }, { ko: "세륨", symbol: "Ce" },
      { ko: "프라세오디뮴", symbol: "Pr" }, { ko: "네오디뮴", symbol: "Nd" },
      { ko: "프로메튬", symbol: "Pm" }, { ko: "사마륨", symbol: "Sm" },
      { ko: "유로퓸", symbol: "Eu" }, { ko: "가돌리늄", symbol: "Gd" },
      { ko: "터븀", symbol: "Tb" }, { ko: "디스프로슘", symbol: "Dy" },
      { ko: "홀뮴", symbol: "Ho" }, { ko: "어븀", symbol: "Er" },
      { ko: "툴륨", symbol: "Tm" }, { ko: "이터븀", symbol: "Yb" },
      { ko: "루테튬", symbol: "Lu" },
    ],
  },

  // ── Rap 2 (Period 6 rest) ──────────────────────────────
  {
    id: "rap-2",
    start: 148,
    type: "element-run",
    title: "RAP",
    highlightGroupNote: "주기 6 · Hf → Rn",
    lines: [
      { ko: "하프늄", symbol: "Hf" }, { ko: "탄탈럼", symbol: "Ta" },
      { ko: "텅스텐", symbol: "W" }, { ko: "레늄", symbol: "Re" },
      { ko: "오스뮴", symbol: "Os" }, { ko: "이리듐", symbol: "Ir" },
      { ko: "백금", symbol: "Pt" }, { ko: "금", symbol: "Au" },
      { ko: "수은", symbol: "Hg" }, { ko: "탈륨", symbol: "Tl" },
      { ko: "납", symbol: "Pb" }, { ko: "비스무트", symbol: "Bi" },
      { ko: "폴로늄", symbol: "Po" }, { ko: "아스타틴", symbol: "At" },
      { ko: "라돈", symbol: "Rn" },
    ],
  },

  // ── Final Rap (Period 7 + Actinides + super-heavy) ─────
  {
    id: "final-rap",
    start: 161,
    type: "element-run",
    title: "FINAL RAP · 악티늄족~초중원소",
    highlightGroupNote: "주기 7 · 악티늄족(89~103) + 초중원소",
    lines: [
      { ko: "프랑슘", symbol: "Fr" }, { ko: "라듐", symbol: "Ra" },
      { ko: "악티늄", symbol: "Ac" }, { ko: "토륨", symbol: "Th" },
      { ko: "프로트악티늄", symbol: "Pa" }, { ko: "우라늄", symbol: "U" },
      { ko: "넵투늄", symbol: "Np" }, { ko: "플루토늄", symbol: "Pu" },
      { ko: "아메리슘", symbol: "Am" }, { ko: "퀴륨", symbol: "Cm" },
      { ko: "버클륨", symbol: "Bk" }, { ko: "캘리포늄", symbol: "Cf" },
      { ko: "아인슈타이늄", symbol: "Es" }, { ko: "페르뮴", symbol: "Fm" },
      { ko: "멘델레븀", symbol: "Md" }, { ko: "노벨륨", symbol: "No" },
      { ko: "로렌슘", symbol: "Lr" },
      { ko: "러더포듐", symbol: "Rf" }, { ko: "더브늄", symbol: "Db" },
      { ko: "시보귬", symbol: "Sg" }, { ko: "보륨", symbol: "Bh" },
      { ko: "하슘", symbol: "Hs" }, { ko: "마이트너륨", symbol: "Mt" },
      { ko: "다름슈타튬", symbol: "Ds" }, { ko: "뢴트게늄", symbol: "Rg" },
      { ko: "코페르니슘", symbol: "Cn" }, { ko: "니호늄", symbol: "Nh" },
      { ko: "플레로븀", symbol: "Fl" }, { ko: "모스코븀", symbol: "Mc" },
      { ko: "리버모륨", symbol: "Lv" }, { ko: "테네신", symbol: "Ts" },
      { ko: "오가네손", symbol: "Og" },
    ],
  },

  // ── Final Chorus / Outro ───────────────────────────────
  {
    id: "final-chorus",
    start: 200,
    type: "final-chorus",
    title: "FINAL CHORUS",
    lines: [
      { en: "One, two, three, four", ko: "하나에서 시작해" },
      { en: "Five, six, seven, eight", ko: "여덟까지 올라가" },
      { ko: "일 족은 하나 · 이 족은 둘" },
      { ko: "십삼·십사·십오·십육 → 셋·넷·다섯·여섯" },
      { ko: "십칠은 하나 부족 · 십팔은 가득" },
      { ko: "헬륨은 둘 · 네온부터 여덟" },
      { en: "Full shell, full shell", ko: "이제 규칙을 알았어" },
      { en: "One to one-eighteen", ko: "1번부터 118번까지" },
      { en: "Names and symbols in our memory" },
    ],
  },
  {
    id: "outro",
    start: 224,
    type: "outro",
    title: "",
    lines: [
      { en: "ELEMENT" },
      { en: "One more" },
      { en: "Let's go!" },
    ],
  },
];

// 씬의 지속 프레임 계산 헬퍼
export function sceneDurations(totalSec: number) {
  return SCENES.map((scene, i) => {
    const next = SCENES[i + 1];
    const end = next ? next.start : totalSec;
    return {
      scene,
      fromFrame: Math.round(scene.start * FPS),
      durationInFrames: Math.max(1, Math.round((end - scene.start) * FPS)),
    };
  });
}
