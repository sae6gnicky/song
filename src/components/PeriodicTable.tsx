import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CATEGORY_COLORS,
  ELEMENTS,
  type ElementData,
} from "../data/elements";

interface PeriodicTableProps {
  // 현재 하이라이트할 원소기호 집합
  active: Set<string>;
  // 가장 최근(현재 포커스) 원소기호 — 크게 펄스
  focus?: string | null;
  // 카테고리 하이라이트(족 강조): 해당 카테고리만 색을 진하게
  focusCategories?: Set<string>;
  scale?: number;
}

const CELL = 58; // 셀 한 변 (px)
const GAP = 6;

export const PeriodicTable: React.FC<PeriodicTableProps> = ({
  active,
  focus,
  focusCategories,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const gridWidth = 18 * CELL + 17 * GAP;
  // main block rows 1..7, gap, f-block rows 8..9
  const gridHeight = 9 * CELL + 8 * GAP + 24; // +간격(f블록 분리)

  const yForRow = (row: number) => {
    // f-block(8,9)은 아래로 한 칸 더 띄움
    if (row >= 8) return (row - 1) * (CELL + GAP) + 24;
    return (row - 1) * (CELL + GAP);
  };

  return (
    <div
      style={{
        position: "relative",
        width: gridWidth,
        height: gridHeight,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {ELEMENTS.map((el) => (
        <Cell
          key={el.number}
          el={el}
          x={(el.col - 1) * (CELL + GAP)}
          y={yForRow(el.row)}
          isActive={active.has(el.symbol)}
          isFocus={focus === el.symbol}
          categoryActive={
            !focusCategories || focusCategories.has(el.category)
          }
          frame={frame}
          fps={fps}
        />
      ))}
    </div>
  );
};

interface CellProps {
  el: ElementData;
  x: number;
  y: number;
  isActive: boolean;
  isFocus: boolean;
  categoryActive: boolean;
  frame: number;
  fps: number;
}

const Cell: React.FC<CellProps> = ({
  el,
  x,
  y,
  isActive,
  isFocus,
  categoryActive,
  frame,
  fps,
}) => {
  const color = CATEGORY_COLORS[el.category];

  // 포커스 원소는 스프링으로 살짝 튀어오름
  const pop = isFocus
    ? spring({ frame: frame % 30, fps, config: { damping: 12, mass: 0.5 } })
    : 0;
  const focusScale = 1 + pop * 0.28;

  const baseOpacity = categoryActive ? 1 : 0.18;
  const bg = isActive ? color : "rgba(255,255,255,0.05)";
  const borderColor = isActive
    ? color
    : categoryActive
    ? "rgba(255,255,255,0.16)"
    : "rgba(255,255,255,0.06)";

  const glow = isFocus
    ? `0 0 24px ${color}, 0 0 48px ${color}`
    : isActive
    ? `0 0 10px ${color}88`
    : "none";

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: CELL,
        height: CELL,
        borderRadius: 8,
        background: bg,
        border: `2px solid ${borderColor}`,
        boxShadow: glow,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: baseOpacity,
        transform: `scale(${focusScale})`,
        zIndex: isFocus ? 10 : 1,
        transition: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 3,
          left: 6,
          fontSize: 10,
          color: isActive ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.4)",
          fontWeight: 600,
        }}
      >
        {el.number}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: isActive ? "#0b0b16" : "rgba(255,255,255,0.85)",
          lineHeight: 1,
        }}
      >
        {el.symbol}
      </div>
    </div>
  );
};

export { CELL as PERIODIC_CELL };
