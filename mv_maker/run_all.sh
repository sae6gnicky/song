#!/usr/bin/env bash
# run_all.sh — 이미지 생성부터 영상 합성까지 한 번에 실행.
#
# 사용법:
#   export GEMINI_API_KEY="본인_키"
#   bash run_all.sh
set -euo pipefail
cd "$(dirname "$0")"

if [ -z "${GEMINI_API_KEY:-}" ] && [ -z "${GOOGLE_API_KEY:-}" ]; then
  echo "ERROR: GEMINI_API_KEY 환경변수를 먼저 설정하세요."
  echo '  export GEMINI_API_KEY="본인_API_키"'
  exit 1
fi

echo "==> 1) 장면 이미지 생성 (Gemini)"
python generate_images.py "$@"

echo "==> 2) 뮤직비디오 합성 (ffmpeg)"
python build_video.py

echo "==> 완료! build/Eight_Worlds_MV.mp4 를 확인하세요."
