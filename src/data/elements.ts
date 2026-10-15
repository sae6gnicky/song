// 주기율표 118개 원소 데이터
// group: IUPAC 족 번호(1~18). 란타넘족/악티늄족은 group 0 으로 표시하고 별도 행에 배치.
// col/row: 주기율표 그리드 좌표(1-indexed). 18열 x (7 + 2 f-block) 행.
// category: 족/블록별 색상 구분에 사용.

export type ElementCategory =
  | "alkali-metal"
  | "alkaline-earth"
  | "transition-metal"
  | "post-transition-metal"
  | "metalloid"
  | "nonmetal"
  | "halogen"
  | "noble-gas"
  | "lanthanide"
  | "actinide";

export interface ElementData {
  number: number;
  symbol: string;
  ko: string; // 한글 이름
  group: number; // 1..18, f-block은 0
  period: number;
  col: number; // grid column 1..18
  row: number; // grid row 1..7 (main), 8/9 for f-block display rows
  category: ElementCategory;
}

// 족(그룹)별 대표 색상
export const CATEGORY_COLORS: Record<ElementCategory, string> = {
  "alkali-metal": "#ff5964", // 1족
  "alkaline-earth": "#ff9f45", // 2족
  "transition-metal": "#ffd166", // 3~12족
  "post-transition-metal": "#8ac926", // 전이후 금속
  metalloid: "#43aa8b", // 준금속
  nonmetal: "#4cc9f0", // 비금속
  halogen: "#4361ee", // 17족
  "noble-gas": "#b5179e", // 18족
  lanthanide: "#f72585", // 란타넘족
  actinide: "#c77dff", // 악티늄족
};

export const CATEGORY_LABELS_KO: Record<ElementCategory, string> = {
  "alkali-metal": "알칼리 금속 (1족)",
  "alkaline-earth": "알칼리 토금속 (2족)",
  "transition-metal": "전이 금속 (3~12족)",
  "post-transition-metal": "전이후 금속",
  metalloid: "준금속",
  nonmetal: "비금속",
  halogen: "할로젠 (17족)",
  "noble-gas": "비활성 기체 (18족)",
  lanthanide: "란타넘족",
  actinide: "악티늄족",
};

export const ELEMENTS: ElementData[] = [
  { number: 1, symbol: "H", ko: "수소", group: 1, period: 1, col: 1, row: 1, category: "nonmetal" },
  { number: 2, symbol: "He", ko: "헬륨", group: 18, period: 1, col: 18, row: 1, category: "noble-gas" },
  { number: 3, symbol: "Li", ko: "리튬", group: 1, period: 2, col: 1, row: 2, category: "alkali-metal" },
  { number: 4, symbol: "Be", ko: "베릴륨", group: 2, period: 2, col: 2, row: 2, category: "alkaline-earth" },
  { number: 5, symbol: "B", ko: "붕소", group: 13, period: 2, col: 13, row: 2, category: "metalloid" },
  { number: 6, symbol: "C", ko: "탄소", group: 14, period: 2, col: 14, row: 2, category: "nonmetal" },
  { number: 7, symbol: "N", ko: "질소", group: 15, period: 2, col: 15, row: 2, category: "nonmetal" },
  { number: 8, symbol: "O", ko: "산소", group: 16, period: 2, col: 16, row: 2, category: "nonmetal" },
  { number: 9, symbol: "F", ko: "플루오린", group: 17, period: 2, col: 17, row: 2, category: "halogen" },
  { number: 10, symbol: "Ne", ko: "네온", group: 18, period: 2, col: 18, row: 2, category: "noble-gas" },
  { number: 11, symbol: "Na", ko: "소듐", group: 1, period: 3, col: 1, row: 3, category: "alkali-metal" },
  { number: 12, symbol: "Mg", ko: "마그네슘", group: 2, period: 3, col: 2, row: 3, category: "alkaline-earth" },
  { number: 13, symbol: "Al", ko: "알루미늄", group: 13, period: 3, col: 13, row: 3, category: "post-transition-metal" },
  { number: 14, symbol: "Si", ko: "규소", group: 14, period: 3, col: 14, row: 3, category: "metalloid" },
  { number: 15, symbol: "P", ko: "인", group: 15, period: 3, col: 15, row: 3, category: "nonmetal" },
  { number: 16, symbol: "S", ko: "황", group: 16, period: 3, col: 16, row: 3, category: "nonmetal" },
  { number: 17, symbol: "Cl", ko: "염소", group: 17, period: 3, col: 17, row: 3, category: "halogen" },
  { number: 18, symbol: "Ar", ko: "아르곤", group: 18, period: 3, col: 18, row: 3, category: "noble-gas" },
  { number: 19, symbol: "K", ko: "포타슘", group: 1, period: 4, col: 1, row: 4, category: "alkali-metal" },
  { number: 20, symbol: "Ca", ko: "칼슘", group: 2, period: 4, col: 2, row: 4, category: "alkaline-earth" },
  { number: 21, symbol: "Sc", ko: "스칸듐", group: 3, period: 4, col: 3, row: 4, category: "transition-metal" },
  { number: 22, symbol: "Ti", ko: "타이타늄", group: 4, period: 4, col: 4, row: 4, category: "transition-metal" },
  { number: 23, symbol: "V", ko: "바나듐", group: 5, period: 4, col: 5, row: 4, category: "transition-metal" },
  { number: 24, symbol: "Cr", ko: "크로뮴", group: 6, period: 4, col: 6, row: 4, category: "transition-metal" },
  { number: 25, symbol: "Mn", ko: "망가니즈", group: 7, period: 4, col: 7, row: 4, category: "transition-metal" },
  { number: 26, symbol: "Fe", ko: "철", group: 8, period: 4, col: 8, row: 4, category: "transition-metal" },
  { number: 27, symbol: "Co", ko: "코발트", group: 9, period: 4, col: 9, row: 4, category: "transition-metal" },
  { number: 28, symbol: "Ni", ko: "니켈", group: 10, period: 4, col: 10, row: 4, category: "transition-metal" },
  { number: 29, symbol: "Cu", ko: "구리", group: 11, period: 4, col: 11, row: 4, category: "transition-metal" },
  { number: 30, symbol: "Zn", ko: "아연", group: 12, period: 4, col: 12, row: 4, category: "transition-metal" },
  { number: 31, symbol: "Ga", ko: "갈륨", group: 13, period: 4, col: 13, row: 4, category: "post-transition-metal" },
  { number: 32, symbol: "Ge", ko: "저마늄", group: 14, period: 4, col: 14, row: 4, category: "metalloid" },
  { number: 33, symbol: "As", ko: "비소", group: 15, period: 4, col: 15, row: 4, category: "metalloid" },
  { number: 34, symbol: "Se", ko: "셀레늄", group: 16, period: 4, col: 16, row: 4, category: "nonmetal" },
  { number: 35, symbol: "Br", ko: "브로민", group: 17, period: 4, col: 17, row: 4, category: "halogen" },
  { number: 36, symbol: "Kr", ko: "크립톤", group: 18, period: 4, col: 18, row: 4, category: "noble-gas" },
  { number: 37, symbol: "Rb", ko: "루비듐", group: 1, period: 5, col: 1, row: 5, category: "alkali-metal" },
  { number: 38, symbol: "Sr", ko: "스트론튬", group: 2, period: 5, col: 2, row: 5, category: "alkaline-earth" },
  { number: 39, symbol: "Y", ko: "이트륨", group: 3, period: 5, col: 3, row: 5, category: "transition-metal" },
  { number: 40, symbol: "Zr", ko: "지르코늄", group: 4, period: 5, col: 4, row: 5, category: "transition-metal" },
  { number: 41, symbol: "Nb", ko: "나이오븀", group: 5, period: 5, col: 5, row: 5, category: "transition-metal" },
  { number: 42, symbol: "Mo", ko: "몰리브데넘", group: 6, period: 5, col: 6, row: 5, category: "transition-metal" },
  { number: 43, symbol: "Tc", ko: "테크네튬", group: 7, period: 5, col: 7, row: 5, category: "transition-metal" },
  { number: 44, symbol: "Ru", ko: "루테늄", group: 8, period: 5, col: 8, row: 5, category: "transition-metal" },
  { number: 45, symbol: "Rh", ko: "로듐", group: 9, period: 5, col: 9, row: 5, category: "transition-metal" },
  { number: 46, symbol: "Pd", ko: "팔라듐", group: 10, period: 5, col: 10, row: 5, category: "transition-metal" },
  { number: 47, symbol: "Ag", ko: "은", group: 11, period: 5, col: 11, row: 5, category: "transition-metal" },
  { number: 48, symbol: "Cd", ko: "카드뮴", group: 12, period: 5, col: 12, row: 5, category: "transition-metal" },
  { number: 49, symbol: "In", ko: "인듐", group: 13, period: 5, col: 13, row: 5, category: "post-transition-metal" },
  { number: 50, symbol: "Sn", ko: "주석", group: 14, period: 5, col: 14, row: 5, category: "post-transition-metal" },
  { number: 51, symbol: "Sb", ko: "안티모니", group: 15, period: 5, col: 15, row: 5, category: "metalloid" },
  { number: 52, symbol: "Te", ko: "텔루륨", group: 16, period: 5, col: 16, row: 5, category: "metalloid" },
  { number: 53, symbol: "I", ko: "아이오딘", group: 17, period: 5, col: 17, row: 5, category: "halogen" },
  { number: 54, symbol: "Xe", ko: "제논", group: 18, period: 5, col: 18, row: 5, category: "noble-gas" },
  { number: 55, symbol: "Cs", ko: "세슘", group: 1, period: 6, col: 1, row: 6, category: "alkali-metal" },
  { number: 56, symbol: "Ba", ko: "바륨", group: 2, period: 6, col: 2, row: 6, category: "alkaline-earth" },
  // 란타넘족 (57~71) — f-block, row 8
  { number: 57, symbol: "La", ko: "란타넘", group: 0, period: 6, col: 3, row: 8, category: "lanthanide" },
  { number: 58, symbol: "Ce", ko: "세륨", group: 0, period: 6, col: 4, row: 8, category: "lanthanide" },
  { number: 59, symbol: "Pr", ko: "프라세오디뮴", group: 0, period: 6, col: 5, row: 8, category: "lanthanide" },
  { number: 60, symbol: "Nd", ko: "네오디뮴", group: 0, period: 6, col: 6, row: 8, category: "lanthanide" },
  { number: 61, symbol: "Pm", ko: "프로메튬", group: 0, period: 6, col: 7, row: 8, category: "lanthanide" },
  { number: 62, symbol: "Sm", ko: "사마륨", group: 0, period: 6, col: 8, row: 8, category: "lanthanide" },
  { number: 63, symbol: "Eu", ko: "유로퓸", group: 0, period: 6, col: 9, row: 8, category: "lanthanide" },
  { number: 64, symbol: "Gd", ko: "가돌리늄", group: 0, period: 6, col: 10, row: 8, category: "lanthanide" },
  { number: 65, symbol: "Tb", ko: "터븀", group: 0, period: 6, col: 11, row: 8, category: "lanthanide" },
  { number: 66, symbol: "Dy", ko: "디스프로슘", group: 0, period: 6, col: 12, row: 8, category: "lanthanide" },
  { number: 67, symbol: "Ho", ko: "홀뮴", group: 0, period: 6, col: 13, row: 8, category: "lanthanide" },
  { number: 68, symbol: "Er", ko: "어븀", group: 0, period: 6, col: 14, row: 8, category: "lanthanide" },
  { number: 69, symbol: "Tm", ko: "툴륨", group: 0, period: 6, col: 15, row: 8, category: "lanthanide" },
  { number: 70, symbol: "Yb", ko: "이터븀", group: 0, period: 6, col: 16, row: 8, category: "lanthanide" },
  { number: 71, symbol: "Lu", ko: "루테튬", group: 0, period: 6, col: 17, row: 8, category: "lanthanide" },
  { number: 72, symbol: "Hf", ko: "하프늄", group: 4, period: 6, col: 4, row: 6, category: "transition-metal" },
  { number: 73, symbol: "Ta", ko: "탄탈럼", group: 5, period: 6, col: 5, row: 6, category: "transition-metal" },
  { number: 74, symbol: "W", ko: "텅스텐", group: 6, period: 6, col: 6, row: 6, category: "transition-metal" },
  { number: 75, symbol: "Re", ko: "레늄", group: 7, period: 6, col: 7, row: 6, category: "transition-metal" },
  { number: 76, symbol: "Os", ko: "오스뮴", group: 8, period: 6, col: 8, row: 6, category: "transition-metal" },
  { number: 77, symbol: "Ir", ko: "이리듐", group: 9, period: 6, col: 9, row: 6, category: "transition-metal" },
  { number: 78, symbol: "Pt", ko: "백금", group: 10, period: 6, col: 10, row: 6, category: "transition-metal" },
  { number: 79, symbol: "Au", ko: "금", group: 11, period: 6, col: 11, row: 6, category: "transition-metal" },
  { number: 80, symbol: "Hg", ko: "수은", group: 12, period: 6, col: 12, row: 6, category: "transition-metal" },
  { number: 81, symbol: "Tl", ko: "탈륨", group: 13, period: 6, col: 13, row: 6, category: "post-transition-metal" },
  { number: 82, symbol: "Pb", ko: "납", group: 14, period: 6, col: 14, row: 6, category: "post-transition-metal" },
  { number: 83, symbol: "Bi", ko: "비스무트", group: 15, period: 6, col: 15, row: 6, category: "post-transition-metal" },
  { number: 84, symbol: "Po", ko: "폴로늄", group: 16, period: 6, col: 16, row: 6, category: "post-transition-metal" },
  { number: 85, symbol: "At", ko: "아스타틴", group: 17, period: 6, col: 17, row: 6, category: "halogen" },
  { number: 86, symbol: "Rn", ko: "라돈", group: 18, period: 6, col: 18, row: 6, category: "noble-gas" },
  { number: 87, symbol: "Fr", ko: "프랑슘", group: 1, period: 7, col: 1, row: 7, category: "alkali-metal" },
  { number: 88, symbol: "Ra", ko: "라듐", group: 2, period: 7, col: 2, row: 7, category: "alkaline-earth" },
  // 악티늄족 (89~103) — f-block, row 9
  { number: 89, symbol: "Ac", ko: "악티늄", group: 0, period: 7, col: 3, row: 9, category: "actinide" },
  { number: 90, symbol: "Th", ko: "토륨", group: 0, period: 7, col: 4, row: 9, category: "actinide" },
  { number: 91, symbol: "Pa", ko: "프로트악티늄", group: 0, period: 7, col: 5, row: 9, category: "actinide" },
  { number: 92, symbol: "U", ko: "우라늄", group: 0, period: 7, col: 6, row: 9, category: "actinide" },
  { number: 93, symbol: "Np", ko: "넵투늄", group: 0, period: 7, col: 7, row: 9, category: "actinide" },
  { number: 94, symbol: "Pu", ko: "플루토늄", group: 0, period: 7, col: 8, row: 9, category: "actinide" },
  { number: 95, symbol: "Am", ko: "아메리슘", group: 0, period: 7, col: 9, row: 9, category: "actinide" },
  { number: 96, symbol: "Cm", ko: "퀴륨", group: 0, period: 7, col: 10, row: 9, category: "actinide" },
  { number: 97, symbol: "Bk", ko: "버클륨", group: 0, period: 7, col: 11, row: 9, category: "actinide" },
  { number: 98, symbol: "Cf", ko: "캘리포늄", group: 0, period: 7, col: 12, row: 9, category: "actinide" },
  { number: 99, symbol: "Es", ko: "아인슈타이늄", group: 0, period: 7, col: 13, row: 9, category: "actinide" },
  { number: 100, symbol: "Fm", ko: "페르뮴", group: 0, period: 7, col: 14, row: 9, category: "actinide" },
  { number: 101, symbol: "Md", ko: "멘델레븀", group: 0, period: 7, col: 15, row: 9, category: "actinide" },
  { number: 102, symbol: "No", ko: "노벨륨", group: 0, period: 7, col: 16, row: 9, category: "actinide" },
  { number: 103, symbol: "Lr", ko: "로렌슘", group: 0, period: 7, col: 17, row: 9, category: "actinide" },
  { number: 104, symbol: "Rf", ko: "러더포듐", group: 4, period: 7, col: 4, row: 7, category: "transition-metal" },
  { number: 105, symbol: "Db", ko: "더브늄", group: 5, period: 7, col: 5, row: 7, category: "transition-metal" },
  { number: 106, symbol: "Sg", ko: "시보귬", group: 6, period: 7, col: 6, row: 7, category: "transition-metal" },
  { number: 107, symbol: "Bh", ko: "보륨", group: 7, period: 7, col: 7, row: 7, category: "transition-metal" },
  { number: 108, symbol: "Hs", ko: "하슘", group: 8, period: 7, col: 8, row: 7, category: "transition-metal" },
  { number: 109, symbol: "Mt", ko: "마이트너륨", group: 9, period: 7, col: 9, row: 7, category: "transition-metal" },
  { number: 110, symbol: "Ds", ko: "다름슈타튬", group: 10, period: 7, col: 10, row: 7, category: "transition-metal" },
  { number: 111, symbol: "Rg", ko: "뢴트게늄", group: 11, period: 7, col: 11, row: 7, category: "transition-metal" },
  { number: 112, symbol: "Cn", ko: "코페르니슘", group: 12, period: 7, col: 12, row: 7, category: "post-transition-metal" },
  { number: 113, symbol: "Nh", ko: "니호늄", group: 13, period: 7, col: 13, row: 7, category: "post-transition-metal" },
  { number: 114, symbol: "Fl", ko: "플레로븀", group: 14, period: 7, col: 14, row: 7, category: "post-transition-metal" },
  { number: 115, symbol: "Mc", ko: "모스코븀", group: 15, period: 7, col: 15, row: 7, category: "post-transition-metal" },
  { number: 116, symbol: "Lv", ko: "리버모륨", group: 16, period: 7, col: 16, row: 7, category: "post-transition-metal" },
  { number: 117, symbol: "Ts", ko: "테네신", group: 17, period: 7, col: 17, row: 7, category: "halogen" },
  { number: 118, symbol: "Og", ko: "오가네손", group: 18, period: 7, col: 18, row: 7, category: "noble-gas" },
];

export const ELEMENT_BY_SYMBOL: Record<string, ElementData> = Object.fromEntries(
  ELEMENTS.map((e) => [e.symbol, e])
);

export function getElement(symbol: string): ElementData | undefined {
  return ELEMENT_BY_SYMBOL[symbol];
}
