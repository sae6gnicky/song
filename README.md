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

## 싱크(타이밍) 조정 방법 — LRC 기반 ✅

이 프로젝트는 **`lyrics.lrc` 의 정확한 타임스탬프**를 그대로 사용합니다.
가사 한 줄 한 줄, 원소 하나하나가 LRC에 적힌 시각에 맞춰 등장하므로 음악과 자동으로 싱크됩니다.

- LRC 원문은 [`src/data/lrc.ts`](src/data/lrc.ts) 의 `LRC_TEXT` 에 들어 있습니다.
- `[mm:ss.xx]가사` 형식을 파싱해서 [`src/data/timeline.ts`](src/data/timeline.ts) 가
  자동으로 씬(Intro/Verse/Chorus/Rap/Bridge/Final/Outro)과 이벤트 타이밍을 계산합니다.
- 섹션 마커(`[Intro]`, `[Verse 1]` 등)를 기준으로 씬이 나뉘고,
  `수소 — H` 형태의 줄은 자동으로 원소로 인식되어 주기율표가 하이라이트됩니다.

### 타이밍을 다시 맞추고 싶다면

1. 싱크 툴로 새 `lyrics.lrc` 를 만든다.
2. 그 내용을 [`src/data/lrc.ts`](src/data/lrc.ts) 의 `LRC_TEXT` 에 붙여넣는다
   (또는 `public/lyrics.lrc` 도 함께 교체).
3. 끝. 씬과 원소 타이밍이 자동으로 다시 계산됩니다.

> 영상 전체 길이는 `public/One More.mp3` 의 실제 길이에 맞춰 자동 조정됩니다
> (오디오를 못 읽는 경우 LRC 마지막 시각 + 여유로 폴백).

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
    lrc.ts                # LRC 가사 원문(타임스탬프 포함)
    timeline.ts           # LRC 파싱 → 씬/이벤트 자동 생성
  scenes/
    timing.ts             # 씬 내 이벤트 타이밍 계산 헬퍼
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
