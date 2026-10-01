#!/usr/bin/env python3
"""
generate_images.py
==================
Google Gemini (Nano Banana Pro / Flash Image)로 "Eight Worlds"의
각 장면 이미지를 생성한다.

사용 모델
---------
- 기본값: gemini-3-pro-image-preview  (Nano Banana Pro, Gemini 3 Pro Image)
- --model 로 gemini-2.5-flash-image (Nano Banana) 등으로 바꿀 수 있음

실행 방법 (로컬, 인터넷 되는 곳에서)
------------------------------------
    export GEMINI_API_KEY="여기에_본인_키"
    pip install -r requirements.txt
    python generate_images.py

생성 결과는 ./build/images/scene_00_intro_solar_system.png 형태로 저장된다.
이미 존재하는 이미지는 건너뛴다(--force 로 재생성).

주의
----
- API 키는 코드/깃에 넣지 말 것. 반드시 환경변수(GEMINI_API_KEY)로 전달.
- Nano Banana로 생성된 이미지에는 SynthID 워터마크가 포함된다(구글 정책).
"""

import argparse
import os
import sys
import time
from pathlib import Path

from srt_utils import parse_srt
from scenes import build_scenes

HERE = Path(__file__).resolve().parent
SONG_DIR = HERE.parent                      # .../song
DEFAULT_SRT = SONG_DIR / "Eight Worlds.srt"
OUT_DIR = HERE / "build" / "images"

DEFAULT_MODEL = "gemini-3-pro-image-preview"   # Nano Banana Pro
ASPECT_RATIO = "16:9"                          # 가로 뮤직비디오
MAX_RETRIES = 4


def _client():
    """google-genai 클라이언트 생성. 키는 환경변수에서만 읽는다."""
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        sys.exit(
            "ERROR: 환경변수 GEMINI_API_KEY 가 없습니다.\n"
            "  export GEMINI_API_KEY=\"본인_API_키\"  를 먼저 실행하세요."
        )
    try:
        from google import genai  # noqa
    except ImportError:
        sys.exit(
            "ERROR: google-genai 패키지가 없습니다.\n"
            "  pip install -r requirements.txt  를 먼저 실행하세요."
        )
    from google import genai
    return genai.Client(api_key=api_key)


def _save_image_bytes(data: bytes, path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "wb") as f:
        f.write(data)


def _extract_image(response):
    """genai 응답에서 첫 이미지 바이트를 꺼낸다."""
    for cand in getattr(response, "candidates", []) or []:
        content = getattr(cand, "content", None)
        if not content:
            continue
        for part in getattr(content, "parts", []) or []:
            inline = getattr(part, "inline_data", None)
            if inline and getattr(inline, "data", None):
                return inline.data
    return None


def generate_one(client, model, scene, out_path, aspect_ratio):
    from google.genai import types

    prompt = scene.full_prompt()
    config = types.GenerateContentConfig(
        response_modalities=["Image"],
        image_config=types.ImageConfig(aspect_ratio=aspect_ratio),
    )

    last_err = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = client.models.generate_content(
                model=model,
                contents=prompt,
                config=config,
            )
            data = _extract_image(resp)
            if data:
                _save_image_bytes(data, out_path)
                return True
            last_err = "응답에 이미지가 없음"
        except Exception as e:  # noqa
            last_err = str(e)
        wait = 2 ** attempt
        print(f"    재시도 {attempt}/{MAX_RETRIES} (대기 {wait}s) — {last_err}")
        time.sleep(wait)
    print(f"    [실패] {scene.title}: {last_err}")
    return False


def main():
    ap = argparse.ArgumentParser(description="Eight Worlds 장면 이미지 생성 (Gemini)")
    ap.add_argument("--srt", default=str(DEFAULT_SRT), help="자막(SRT) 경로")
    ap.add_argument("--model", default=DEFAULT_MODEL, help="Gemini 이미지 모델명")
    ap.add_argument("--aspect", default=ASPECT_RATIO, help="이미지 비율 (예: 16:9, 9:16)")
    ap.add_argument("--out", default=str(OUT_DIR), help="이미지 출력 폴더")
    ap.add_argument("--force", action="store_true", help="이미 있는 이미지도 재생성")
    ap.add_argument("--only", type=int, default=None, help="특정 장면 인덱스만 생성")
    args = ap.parse_args()

    subs = parse_srt(args.srt)
    scenes = build_scenes(subs)
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"총 {len(scenes)}개 장면. 모델={args.model}, 비율={args.aspect}")
    client = _client()

    made, skipped, failed = 0, 0, 0
    for sc in scenes:
        if args.only is not None and sc.index != args.only:
            continue
        fname = f"scene_{sc.index:02d}_{sc.title}.png"
        out_path = out_dir / fname
        if out_path.exists() and not args.force:
            print(f"[skip] {fname} (이미 존재)")
            skipped += 1
            continue
        print(f"[gen ] {fname}  ({sc.start:.1f}s–{sc.end:.1f}s, {sc.duration:.1f}s)")
        ok = generate_one(client, args.model, sc, out_path, args.aspect)
        if ok:
            made += 1
            print(f"       저장: {out_path}")
        else:
            failed += 1

    print(f"\n완료: 생성 {made}, 건너뜀 {skipped}, 실패 {failed}")
    if failed:
        print("실패한 장면은 --only <인덱스> 로 다시 시도할 수 있습니다.")
        sys.exit(1)


if __name__ == "__main__":
    main()
