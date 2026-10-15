import React from "react";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS_KO,
  type ElementCategory,
} from "../data/elements";

// 족/카테고리 색상 범례
const ORDER: ElementCategory[] = [
  "alkali-metal",
  "alkaline-earth",
  "transition-metal",
  "post-transition-metal",
  "metalloid",
  "nonmetal",
  "halogen",
  "noble-gas",
  "lanthanide",
  "actinide",
];

export const Legend: React.FC<{ highlight?: Set<string> }> = ({
  highlight,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px 18px",
        maxWidth: 1100,
        justifyContent: "center",
      }}
    >
      {ORDER.map((cat) => {
        const dim = highlight && !highlight.has(cat);
        return (
          <div
            key={cat}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              opacity: dim ? 0.3 : 1,
              fontSize: 16,
              color: "rgba(255,255,255,0.85)",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                background: CATEGORY_COLORS[cat],
                boxShadow: `0 0 8px ${CATEGORY_COLORS[cat]}88`,
              }}
            />
            {CATEGORY_LABELS_KO[cat]}
          </div>
        );
      })}
    </div>
  );
};
