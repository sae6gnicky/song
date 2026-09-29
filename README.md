# ELEMENT — One More · 주기율표 타이포그래피 뮤직비디오

Remotion으로 만든 **주기율표 음악 모션그래픽 뮤직비디오** 프로젝트입니다.
곡 `One More.mp3`에 맞춰 원소기호 · 한글 이름 · 주기율표를 **족(group)별 색상**으로 보여주며,
가사 타임스탬프에 맞춰 애니메이션이 싱크됩니다.

- 해상도: **1920×1080 (16:9)**, 30fps
- 곡 길이: 약 3:50 (실제 오디오 길이에 맞춰 자동 조정)
- 118개 전체 원소 데이터 포함 (기호 / 한글명 / 원자번호 / 족 / 주기 / 카테고리)

## 필요 환경

- Node.js 18 이상 (권장: 20/22)
- 인터넷 연결 (최초 `npm install` 및 Google Fonts 로드 시)

## 설치 & 실행

```bash
# 1) 의존성 설치
npm install

# 2) 미리보기 (Remotion Studio) — 브라우저에서 타임라인 확인/스크럽
npm run dev

# 3) mp4 렌더링
npm run render          # out/video.mp4
# 또는 고화질
npm run render:hd
```

> `npm run dev` 로 Remotion Studio를 열면 타임라인을 스크럽하면서
> 가사·원소 등장 타이밍이 음악과 맞는지 바로 확인할 수 있습니다.

## 싱크(타이밍) 조정 방법

모든 타이밍은 [`src/data/timeline.ts`](src/data/timeline.ts) 의 `SCENES` 배열에서 관리합니다.
각 씬의 `start` 값(초)이 해당 구간이 시작되는 시각입니다. 현재 값은 아래 타임스탬프 기준입니다.

| 시각 | 섹션 |
|------|------|
| 0:00 | Intro (원소기호) |
| 0:08 | Intro (영어 후렴) |
| 0:16 | Verse 1 (H~Si) |
| 0:29 | Verse 1 (P~Ar) |
| 0:37 | Pre-Chorus (1·2족) |
| 0:45 | Pre-Chorus (13~18족) |
| 0:59 | Chorus |
| 1:23 | Verse 2 (K~Kr, 전이금속) |
| 1:37 | Chorus |
| 1:52 | Rap (Rb~Xe) |
| 2:07 | Bridge (란타넘족) |
| 2:28 | Rap (Hf~Rn) |
| 2:41 | Final Rap (악티늄족~초중원소) |
| 3:20 | Final Chorus |
| 3:44 | Outro (ELEMENT / One more / Let's go!) |

각 `element-run` 씬 안에서 원소들은 씬 길이에 맞춰 **균등 분배**되어 순차 하이라이트됩니다.
특정 원소 타이밍을 더 맞추고 싶으면 씬을 쪼개거나 `start` 값을 조정하세요.

## 오디오 파일

`public/One More.mp3` 를 사용합니다. 파일명을 바꾸면
[`src/ElementMusicVideo.tsx`](src/ElementMusicVideo.tsx) 상단의 `AUDIO_SRC` 도 함께 수정하세요.

## 프로젝트 구조

```
src/
  index.ts                # Remotion 진입점
  Root.tsx                # Composition 등록 + 폰트/오디오 길이 처리
  ElementMusicVideo.tsx   # 씬 시퀀싱(메인 조립)
  data/
    elements.ts           # 118개 원소 데이터 + 족별 색상
    timeline.ts           # 씬 구조 + 타임스탬프
  components/
    PeriodicTable.tsx     # 18×9 주기율표 그리드
    Background.tsx         # 배경 그라디언트/그리드
    Legend.tsx             # 족 색상 범례
  scenes/
    IntroSymbols.tsx       # 원소기호 인트로
    LyricScene.tsx         # 가사(영/한) 씬 + 섹션 라벨
    ElementRun.tsx         # 원소 나열 + 주기율표 하이라이트
    FinalChorus.tsx        # 전체 주기율표 + 요약
    Outro.tsx              # 마무리
```

## 색상(족/카테고리) 기준

`src/data/elements.ts` 의 `CATEGORY_COLORS` 참고. 알칼리 금속, 알칼리 토금속,
전이 금속, 전이후 금속, 준금속, 비금속, 할로젠, 비활성 기체, 란타넘족, 악티늄족으로 구분합니다.
