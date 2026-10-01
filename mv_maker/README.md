# 🪐 Eight Worlds — 뮤직비디오 메이커

태양계 교육용 K-pop 곡 **"Eight Worlds"**의 뮤직비디오를 자동으로 만드는 파이프라인입니다.

- 🎨 **Google Gemini (Nano Banana Pro)** 로 색연필 느낌의 **따뜻하고 몽환적이지만 과학적으로 정확한** 행성 일러스트를 생성
- 🎬 **ffmpeg** 로 이미지에 부드러운 줌/팬(Ken Burns) 효과 + 장면 전환(디졸브) + **가사 자막 싱크** + 원곡을 합쳐 mp4로 완성

가사의 과학적 사실(행성 크기·색·대기·위성 수·자전 특성 등)을 그대로 이미지 프롬프트에 반영해, 노래 내용과 그림이 정확히 맞물립니다.

---

## 📁 구성

```
mv_maker/
├── scenes.py            # 17개 장면 정의 + 과학적으로 정확한 색연필풍 프롬프트
├── srt_utils.py         # SRT 가사 파서
├── generate_images.py   # ① Gemini로 장면 이미지 생성
├── build_video.py       # ② ffmpeg로 음악·자막 싱크 영상 합성
├── run_all.sh           # ①+② 한 번에 실행
├── requirements.txt
├── .env.example         # API 키 넣는 예시 (실제 키는 .env 에, git 커밋 금지)
└── build/               # 산출물 (이미지 + 최종 mp4) — git 에 안 올라감
```

장면은 가사 타임스탬프에 맞춰 **17개 구간**으로 나뉩니다 (인트로 → 수성 → 금성 → 지구 → 화성 → 지구형 후렴 → 브릿지 → 목성 → 토성 → 천왕성 → 해왕성 → 목성형 후렴 → 후렴 반복 → 지구형vs목성형 → 8행성 호명 → 리듬 → 아웃트로). 전체 약 4분 58초를 빈틈없이 커버합니다.

---

## ✅ 준비물

1. **Python 3.10+**
2. **ffmpeg** (영상 합성용)
   - macOS: `brew install ffmpeg`
   - Ubuntu/Debian: `sudo apt-get install ffmpeg`
   - Windows: <https://ffmpeg.org/download.html> 또는 `winget install ffmpeg`
3. **한글 자막 폰트** (대부분 OS에 기본 탑재)
   - Ubuntu에서 한글이 깨지면: `sudo apt-get install fonts-nanum`
4. **Gemini API 키** — [Google AI Studio](https://aistudio.google.com/)에서 발급
   - ⚠️ Nano Banana Pro(이미지 생성)는 **결제 설정(billing)** 이 필요할 수 있습니다.

---

## 🚀 실행 방법

### 1) 의존성 설치

```bash
cd mv_maker
pip install -r requirements.txt
```

### 2) API 키 설정 (환경변수)

> 🔐 **키를 코드나 깃에 넣지 마세요.** 반드시 환경변수로만 전달합니다.

```bash
export GEMINI_API_KEY="여기에_본인_Gemini_API_키"
```

### 3) 한 방에 실행

```bash
bash run_all.sh
```

또는 단계별로:

```bash
# ① 장면 이미지 17장 생성 → build/images/
python generate_images.py

# ② 음악 + 가사 자막 싱크 영상 합성 → build/Eight_Worlds_MV.mp4
python build_video.py
```

완성 파일: **`build/Eight_Worlds_MV.mp4`** 🎉

---

## 🎛️ 자주 쓰는 옵션

### 이미지 생성 (`generate_images.py`)

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| `--model` | Gemini 이미지 모델 | `gemini-3-pro-image-preview` (Nano Banana **Pro**) |
| `--aspect` | 이미지 비율 (`16:9`, `9:16` 등) | `16:9` |
| `--only N` | 특정 장면(인덱스 N)만 생성 | 전체 |
| `--force` | 이미 있는 이미지도 다시 생성 | off |

```bash
# 더 저렴/빠른 Flash 모델로 생성하고 싶다면:
python generate_images.py --model gemini-2.5-flash-image

# 세로형(쇼츠/릴스)으로 만들고 싶다면 (영상도 세로로 맞추려면 build_video.py의 W,H도 조정):
python generate_images.py --aspect 9:16

# 3번 장면(지구)만 다시 생성:
python generate_images.py --only 3 --force
```

### 영상 합성 (`build_video.py`)

| 옵션 | 설명 |
|------|------|
| `--font /경로/폰트.ttf` | 자막 폰트 직접 지정 (한글 깨질 때) |
| `--no-subs` | 자막 없이 합성 |

```bash
python build_video.py --font /usr/share/fonts/truetype/nanum/NanumGothic.ttf
```

---

## 🔁 마음에 안 드는 장면만 다시 뽑기

1. `build/images/` 에서 생성된 그림을 확인
2. 다시 그리고 싶은 장면 번호 확인 (파일명 `scene_03_earth.png` → 인덱스 3)
3. 프롬프트를 바꾸고 싶으면 `scenes.py` 의 해당 장면 설명을 수정
4. `python generate_images.py --only 3 --force` 로 그 장면만 재생성
5. `python build_video.py` 로 다시 합성

---

## 🧪 참고

- 생성 이미지에는 Google 정책에 따라 보이지 않는 **SynthID 워터마크**가 포함됩니다.
- `scenes.py` 의 `STYLE_SUFFIX` 를 수정하면 전체 그림 스타일(색연필 질감·분위기)을 한 번에 바꿀 수 있습니다.
- API 호출이 실패하면 자동으로 지수 백오프로 최대 4회 재시도합니다.
