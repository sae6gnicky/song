"""
srt_utils.py
============
SRT 자막 파일을 읽고 쓰는 유틸리티.
"""

import re


_TIME_RE = re.compile(
    r"(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*"
    r"(\d{2}):(\d{2}):(\d{2})[,.](\d{3})"
)


def _to_seconds(h, m, s, ms):
    return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000.0


def parse_srt(path):
    """
    SRT 파일을 파싱해서 자막 리스트를 반환한다.

    반환: list of dict {index:int, start:float, end:float, text:str}
    """
    with open(path, "r", encoding="utf-8-sig") as f:
        raw = f.read()

    # 빈 줄 기준으로 블록 분리
    blocks = re.split(r"\n\s*\n", raw.strip())
    subs = []
    for block in blocks:
        lines = [ln for ln in block.splitlines() if ln.strip() != ""]
        if len(lines) < 2:
            continue
        # 첫 줄: 번호(없을 수도 있음)
        idx = None
        time_line_i = 0
        if lines[0].strip().isdigit():
            idx = int(lines[0].strip())
            time_line_i = 1
        m = _TIME_RE.search(lines[time_line_i])
        if not m:
            continue
        start = _to_seconds(*m.group(1, 2, 3, 4))
        end = _to_seconds(*m.group(5, 6, 7, 8))
        text = " ".join(lines[time_line_i + 1:]).strip()
        if idx is None:
            idx = len(subs) + 1
        subs.append({"index": idx, "start": start, "end": end, "text": text})
    return subs


def _fmt_ass_time(t):
    """ASS 자막용 시간 포맷: H:MM:SS.cs"""
    cs = int(round(t * 100))
    h, cs = divmod(cs, 360000)
    m, cs = divmod(cs, 6000)
    s, cs = divmod(cs, 100)
    return f"{h:d}:{m:02d}:{s:02d}:{cs:02d}".replace(":", ":", 2)
