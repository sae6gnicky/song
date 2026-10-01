"""
scenes.py
=========
"Eight Worlds" 뮤직비디오의 장면(scene) 정의.

가사의 타임스탬프(SRT)를 "의미 단위 장면"으로 묶고,
각 장면마다 색연필풍 + 따뜻하고 몽환적 + 과학적으로 정확한
이미지 생성 프롬프트를 부여한다.

과학적 정확성 원칙
------------------
- 행성 상대 크기, 색, 대기 성분, 위성 수, 자전 특성 등
  가사에 담긴 사실을 그대로 반영한다.
- 수성: 위성 0, 금성: 역행 자전/황산 구름, 지구: 달 1개,
  화성: 위성 2개(포보스/데이모스), 목성: 대적점/갈릴레이 위성 4,
  토성: 고리/타이탄/엔셀라두스, 천왕성: 옆으로 누운 자전축/위성 27,
  해왕성: 가장 빠른 바람/위성 14.
"""

from dataclasses import dataclass, field


# 모든 이미지에 공통으로 적용되는 스타일 지시문.
# 색연필 질감 + 따뜻하고 몽환적 + 과학적 정확성.
STYLE_SUFFIX = (
    "Artistic style: soft colored-pencil illustration, visible pencil strokes and "
    "paper grain texture, warm and dreamy atmosphere, gentle glowing light, "
    "pastel yet rich tones, storybook illustration feel. "
    "Scientific accuracy is essential: planet colors, relative sizes, atmospheres, "
    "rings, and moon counts must be astronomically correct. "
    "Cinematic vertical-friendly composition, no text, no words, no letters, "
    "no watermark, high detail."
)


@dataclass
class Scene:
    """하나의 장면: 가사 구간 + 이미지 프롬프트."""

    index: int
    start: float          # 시작 시간(초)
    end: float            # 끝 시간(초)
    srt_indices: list     # 이 장면이 포함하는 SRT 자막 번호들
    title: str            # 사람이 읽기 쉬운 장면 이름
    prompt: str           # Gemini에 보낼 이미지 생성 프롬프트 (STYLE_SUFFIX 제외)

    def full_prompt(self) -> str:
        return f"{self.prompt} {STYLE_SUFFIX}"

    @property
    def duration(self) -> float:
        return round(self.end - self.start, 3)


# 장면별 (SRT 자막 번호 범위, 제목, 프롬프트) 정의.
# 번호는 Eight Worlds.srt 의 자막 번호와 일치한다.
_SCENE_SPECS = [
    (
        [1, 2, 3, 4],
        "intro_solar_system",
        "A dreamy wide view of the whole Solar System at dusk turning to night: "
        "the Sun on the far left glowing warm gold, and all eight planets lined up "
        "in correct order and correct relative size — tiny Mercury, Venus, Earth, "
        "small reddish Mars, then huge Jupiter, ringed Saturn, pale-blue Uranus and "
        "deep-blue Neptune — floating in a soft neon-tinted starry sky.",
    ),
    (
        [5, 6, 7, 8, 9, 10],
        "mercury",
        "Mercury, the smallest planet, closest to the Sun. A small heavily cratered "
        "grey rocky world shown very near a large warm glowing Sun. One side blazing "
        "hot and bright, the other side in cold dark shadow, showing extreme "
        "temperature contrast. Almost no atmosphere, no moons around it, bare rocky "
        "surface, lonely and fast-moving feel.",
    ),
    (
        [11, 12, 13, 14, 15, 16],
        "venus",
        "Venus, completely wrapped in thick pale-yellow sulfuric-acid clouds, glowing "
        "hotter than Mercury due to a runaway greenhouse effect. A dense choking "
        "carbon-dioxide atmosphere, calm windless surface hidden beneath the clouds, "
        "no moons and no rings. A subtle visual hint that it spins backwards "
        "(retrograde rotation). Warm smouldering orange-yellow dreamy glow.",
    ),
    (
        [17, 18, 19, 20, 21, 22],
        "earth",
        "Earth, a vivid blue planet shining with life. Blue liquid-water oceans, green "
        "and brown continents, swirling white clouds of a clean nitrogen-oxygen "
        "atmosphere, and a single grey Moon nearby. A solid rocky world full of life, "
        "warm and hopeful, the only world where life is confirmed.",
    ),
    (
        [23, 24, 25, 26, 27, 28],
        "mars",
        "Mars, the red planet. A cold rusty-red rocky world colored by iron oxide "
        "(rust), with a thin carbon-dioxide atmosphere and a swirling reddish dust "
        "storm sweeping across the surface. Two small irregular potato-shaped moons, "
        "Phobos and Deimos, following in the dark nearby. Chilly and windswept mood.",
    ),
    (
        [29, 30, 31, 32, 33, 34],
        "terrestrial_chorus",
        "A warm group portrait of the four small rocky terrestrial planets close to "
        "the Sun: Mercury, Venus, Earth and Mars, lined up together in correct order "
        "and correct relative sizes, all solid rocky worlds, glowing in the warm light "
        "of the nearby Sun. Inner Solar System, cozy and united feeling.",
    ),
    (
        [35, 36, 37, 38, 39, 40],
        "bridge_giants",
        "A sweeping dreamy transition from the small inner worlds toward the giant outer "
        "planets. Eight planet silhouettes glowing softly in a cosmic haze, the four "
        "giants — Jupiter, Saturn, Uranus, Neptune — rising grandly onto a cosmic "
        "stage, bathed in a soft blue-to-gold gradient of light.",
    ),
    (
        [41, 42, 43, 44, 45, 46],
        "jupiter",
        "Jupiter, the largest planet, a giant gas world of swirling hydrogen and helium "
        "banded clouds in cream, orange and brown stripes. The famous Great Red Spot, "
        "a giant storm, swirling on its surface. No solid surface, deep layered clouds, "
        "and its four large Galilean moons (Io, Europa, Ganymede, Callisto) orbiting "
        "around the king of planets. Majestic and powerful.",
    ),
    (
        [47, 48, 49, 50, 51, 52],
        "saturn",
        "Saturn, a pale-gold gas giant with magnificent bright rings made of ice and "
        "rock, low density, hydrogen atmosphere. Many moons around it: large hazy "
        "orange Titan with its thick atmosphere, and small icy Enceladus visibly "
        "spraying jets of ice and water vapor into space. Elegant golden crystalline glow.",
    ),
    (
        [53, 54, 55, 56, 57, 58],
        "uranus",
        "Uranus, a pale cyan-blue ice giant tipped on its side, rotating almost lying "
        "down with its axis nearly horizontal. A cold methane-rich atmosphere giving "
        "a smooth pale blue-green color, faint thin rings, and many faint moons "
        "drifting far away. Strange, serene, cold and dreamy blue world.",
    ),
    (
        [59, 60, 61, 62, 63, 64],
        "neptune",
        "Neptune, the farthest planet, a deep vivid-blue ice giant at the dark cold edge "
        "of the Solar System. Bright methane-blue atmosphere with white streaky clouds "
        "and the fastest, strongest winds in the Solar System. Several faint moons "
        "trailing in the darkness. Deep, mysterious, luminous blue glow against black space.",
    ),
    (
        [65, 66, 67, 68],
        "jovian_chorus",
        "A grand group portrait of the four large outer giant planets: huge Jupiter, "
        "ringed Saturn, pale Uranus and deep-blue Neptune, lined up in correct order "
        "and correct relative sizes, big and light with rings and many moons, floating "
        "in deep cosmic space with no solid floor. Vast, awe-inspiring, cosmic.",
    ),
    (
        [69, 70, 71, 72, 73, 74, 75, 76],
        "chorus_reprise",
        "A soaring full view of the entire Solar System in correct order from the warm "
        "Sun outward: Mercury, Venus, Earth, Mars, then Jupiter, Saturn, Uranus, "
        "Neptune, all glowing softly in a cosmic haze from first warm light to the blue "
        "far end. Harmonious, flowing, the whole system moving together.",
    ),
    (
        [77, 78, 79, 80, 81, 82, 83, 84],
        "terrestrial_vs_jovian",
        "A split dreamy comparison scene: on one side the four small dense rocky "
        "terrestrial planets with thin atmospheres and solid ground; on the other side "
        "the four huge gas and ice giants — Jupiter and Saturn as gas giants bathed in "
        "warm light, Uranus and Neptune as ice giants in cool night blue. Different "
        "worlds, yet connected by flowing lines of light.",
    ),
    (
        [85, 86, 87, 88, 89, 90],
        "all_eight_named",
        "All eight planets glowing in a single elegant horizontal line in correct order "
        "and relative size: Mercury, Venus, Earth, Mars as four inner worlds under "
        "starlight, and Jupiter, Saturn, Uranus, Neptune as four outer worlds under a "
        "silvery moon. Each world distinct but aligned in gentle rhythm.",
    ),
    (
        [91, 92, 93, 94],
        "rhythm_aligns",
        "Eight planets glowing in a single luminous line from the Sun to the deep blue "
        "far edge, each a different world but aligned in harmony, soft trails of light "
        "connecting them like a cosmic melody. Warm, united, flowing composition.",
    ),
    (
        [95, 96, 97, 98],
        "outro",
        "A tender closing scene: the Sun's warm light fading on the far horizon while the "
        "eight planets remain, dancing softly far away in the deep starry night, lined "
        "up in a perfect glowing line. Peaceful, dreamy, nostalgic end of a cosmic story.",
    ),
]


def build_scenes(subtitles):
    """
    SRT 자막 리스트(parse_srt 결과)를 받아 Scene 객체 리스트를 만든다.

    subtitles: list of dict {index, start, end, text}
    """
    by_index = {s["index"]: s for s in subtitles}
    scenes = []
    for i, (srt_ids, title, prompt) in enumerate(_SCENE_SPECS):
        present = [n for n in srt_ids if n in by_index]
        if not present:
            continue
        start = by_index[present[0]]["start"]
        end = by_index[present[-1]]["end"]
        scenes.append(
            Scene(
                index=i,
                start=start,
                end=end,
                srt_indices=present,
                title=title,
                prompt=prompt,
            )
        )
    return scenes
