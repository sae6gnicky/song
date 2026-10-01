#!/usr/bin/env python3
"""
build_video.py
==============
생성된 장면 이미지들 + 음악(mp3) + 가사(SRT)를 합쳐
"Eight Worlds" 뮤직비디오(mp4)를 만든다.

처리 내용
---------
1. 각 장면 이미지에 Ken Burns 효과(천천히 줌인/팬)를 적용해
   장면 길이만큼의 클립을 만든다.
2. 장면들을 crossfade(부드러운 디졸브)로 이어붙인다.
3. 가사 SRT를 자막으로 입힌다(한글 폰트 지원).
4. 원곡 mp3를 오디오로 입힌다.

필요 조건
---------
- ffmpeg / ffprobe 설치 (brew install ffmpeg / apt install ffmpeg)
- 한글 자막용 폰트 (대부분 OS에 기본 탑재. --font 로 지정 가능)

실행
----
    python build_video.py
결과: ./build/Eight_Worlds_MV.mp4
"""

import argparse
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from srt_utils import parse_srt
from scenes import build_scenes

HERE = Path(__file__).resolve().parent
SONG_DIR = HERE.parent
DEFAULT_SRT = SONG_DIR / "Eight Worlds.srt"
DEFAULT_MP3 = SONG_DIR / "Eight Worlds.mp3"
IMG_DIR = HERE / "build" / "images"
OUT_FILE = HERE / "build" / "Eight_Worlds_MV.mp4"

W, H = 1920, 1080
FPS = 30
XFADE = 0.8  # 장면 전환 디졸브 길이(초)


def _run(cmd):
    print("  $", " ".join(str(c) for c in cmd))
    subprocess.run(cmd, check=True)


def _check_ffmpeg():
    for exe in ("ffmpeg", "ffprobe"):
        if shutil.which(exe) is None:
            sys.exit(
                f"ERROR: '{exe}' 가 설치되어 있지 않습니다.\n"
                "  macOS:  brew install ffmpeg\n"
                "  Ubuntu: sudo apt-get install ffmpeg"
            )


def _audio_duration(mp3):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(mp3)],
        capture_output=True, text=True, check=True,
    )
    return float(out.stdout.strip())


def _find_font():
    """한글 자막에 쓸 폰트 파일을 OS별로 탐색."""
    candidates = [
        "/System/Library/Fonts/AppleSDGothicNeo.ttc",         # macOS
        "/System/Library/Fonts/Supplemental/AppleGothic.ttf",  # macOS
        "/usr/share/fonts/truetype/nanum/NanumGothic.ttf",     # Ubuntu (fonts-nanum)
        "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
        "C:/Windows/Fonts/malgun.ttf",                         # Windows
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
    return None


def _make_scene_clip(img, duration, out_clip, zoom_dir):
    """
    한 장면 이미지를 Ken Burns 효과가 들어간 영상 클립으로 변환.
    zoom_dir: 'in' 이면 서서히 확대, 'out' 이면 서서히 축소.
    """
    frames = max(1, int(round(duration * FPS)))
    # 큰 해상도로 올려서 흔들림/계단현상 방지 후 zoompan
    scale_up = f"scale={W*2}:{H*2}:force_original_aspect_ratio=increase," \
               f"crop={W*2}:{H*2}"
    if zoom_dir == "in":
        z = "min(zoom+0.0008,1.25)"
    else:
        z = "if(eq(on,0),1.25,max(zoom-0.0008,1.0))"
    zoompan = (
        f"zoompan=z='{z}':d={frames}:"
        f"x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':"
        f"s={W}x{H}:fps={FPS}"
    )
    vf = f"{scale_up},{zoompan},format=yuv420p"
    _run([
        "ffmpeg", "-y", "-loop", "1", "-i", str(img),
        "-t", f"{duration:.3f}", "-vf", vf, "-r", str(FPS),
        "-c:v", "libx264", "-pix_fmt", "yuv420p", str(out_clip),
    ])


def _concat_with_xfade(clips, durations, out_path):
    """클립들을 crossfade로 이어붙인다."""
    if len(clips) == 1:
        shutil.copy(clips[0], out_path)
        return

    inputs = []
    for c in clips:
        inputs += ["-i", str(c)]

    # xfade 체인 구성
    filter_parts = []
    prev = "0:v"
    offset = 0.0
    for i in range(1, len(clips)):
        offset += durations[i - 1] - XFADE
        out_label = f"v{i}"
        filter_parts.append(
            f"[{prev}][{i}:v]xfade=transition=fade:duration={XFADE}:"
            f"offset={offset:.3f}[{out_label}]"
        )
        prev = out_label
    filtergraph = ";".join(filter_parts)

    _run([
        "ffmpeg", "-y", *inputs,
        "-filter_complex", filtergraph,
        "-map", f"[{prev}]",
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", str(FPS),
        str(out_path),
    ])


def _burn_subtitles_and_audio(video, srt, mp3, font, out_path, total_dur):
    """자막을 입히고 오디오를 합쳐 최종 영상 생성."""
    srt_esc = str(srt).replace("\\", "/").replace(":", r"\:").replace("'", r"\'")
    style = (
        "FontSize=22,PrimaryColour=&H00FFFFFF,OutlineColour=&H99000000,"
        "BorderStyle=1,Outline=2,Shadow=1,MarginV=60,Alignment=2"
    )
    if font:
        fontdir = os.path.dirname(font)
        fontname = os.path.splitext(os.path.basename(font))[0]
        sub_filter = (
            f"subtitles='{srt_esc}':fontsdir='{fontdir}':"
            f"force_style='FontName={fontname},{style}'"
        )
    else:
        sub_filter = f"subtitles='{srt_esc}':force_style='{style}'"

    _run([
        "ffmpeg", "-y", "-i", str(video), "-i", str(mp3),
        "-vf", sub_filter,
        "-map", "0:v", "-map", "1:a",
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-t", f"{total_dur:.3f}",
        "-shortest", str(out_path),
    ])


def main():
    ap = argparse.ArgumentParser(description="Eight Worlds 뮤직비디오 합성")
    ap.add_argument("--srt", default=str(DEFAULT_SRT))
    ap.add_argument("--mp3", default=str(DEFAULT_MP3))
    ap.add_argument("--images", default=str(IMG_DIR))
    ap.add_argument("--out", default=str(OUT_FILE))
    ap.add_argument("--font", default=None, help="자막 폰트 파일 경로(.ttf/.ttc)")
    ap.add_argument("--no-subs", action="store_true", help="자막 없이 합성")
    args = ap.parse_args()

    _check_ffmpeg()

    subs = parse_srt(args.srt)
    scenes = build_scenes(subs)
    img_dir = Path(args.images)

    # 이미지 존재 확인
    missing = []
    for sc in scenes:
        p = img_dir / f"scene_{sc.index:02d}_{sc.title}.png"
        if not p.exists():
            missing.append(p.name)
    if missing:
        sys.exit(
            "ERROR: 다음 장면 이미지가 없습니다. 먼저 generate_images.py 를 실행하세요:\n  "
            + "\n  ".join(missing)
        )

    audio_dur = _audio_duration(args.mp3)
    # 마지막 장면은 오디오 끝까지 늘려 공백 방지
    if scenes:
        scenes[-1].end = max(scenes[-1].end, audio_dur)

    font = args.font or _find_font()
    if not args.no_subs and not font:
        print("경고: 한글 폰트를 찾지 못했습니다. 자막이 깨질 수 있어요. "
              "--font 로 폰트를 지정하거나 fonts-nanum 설치를 권장합니다.")

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as td:
        td = Path(td)
        clips, durations = [], []
        print(f"\n[1/3] 장면 클립 {len(scenes)}개 생성 (Ken Burns)")
        for i, sc in enumerate(scenes):
            img = img_dir / f"scene_{sc.index:02d}_{sc.title}.png"
            # 전환 겹침을 고려해 각 클립을 XFADE 만큼 더 길게
            dur = sc.duration + (XFADE if i < len(scenes) - 1 else 0)
            clip = td / f"clip_{i:02d}.mp4"
            zoom_dir = "in" if i % 2 == 0 else "out"
            _make_scene_clip(img, dur, clip, zoom_dir)
            clips.append(clip)
            durations.append(dur)

        print("\n[2/3] 장면 crossfade 연결")
        silent = td / "silent.mp4"
        _concat_with_xfade(clips, durations, silent)

        print("\n[3/3] 자막 + 음악 합성")
        if args.no_subs:
            _run([
                "ffmpeg", "-y", "-i", str(silent), "-i", str(args.mp3),
                "-map", "0:v", "-map", "1:a",
                "-c:v", "libx264", "-pix_fmt", "yuv420p",
                "-c:a", "aac", "-b:a", "192k", "-shortest", str(out_path),
            ])
        else:
            _burn_subtitles_and_audio(
                silent, args.srt, args.mp3, font, out_path, audio_dur
            )

    print(f"\n✅ 완성: {out_path}")


if __name__ == "__main__":
    main()
