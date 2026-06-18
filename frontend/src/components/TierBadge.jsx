// src/components/TierBadge.jsx
import { getActiveSystem } from "../utils/tiers"

export default function TierBadge({ value, size = "md" }) {
  const system = getActiveSystem()
  const level = system.levels.find(l => l.value === value) || system.levels[system.levels.length - 1]

  const sizes = {
    sm: { minWidth: 28, height: 24, fontSize: 11, padding: "3px 6px" },
    md: { minWidth: 40, height: 32, fontSize: 13, padding: "4px 8px" },
    lg: { minWidth: 52, height: 40, fontSize: 15, padding: "5px 10px" }
  }

  const s = sizes[size]

  return (
    <div style={{
      minWidth: s.minWidth,
      height: s.height,
      borderRadius: 8,
      background: level.color,
      border: `0.5px solid ${level.border}`,
      display: "inline-flex",       // shrinks/grows to fit content
      alignItems: "center",
      justifyContent: "center",
      fontSize: s.fontSize,
      fontWeight: 600,
      color: level.text,
      fontFamily: "inherit",
      flexShrink: 0,
      padding: s.padding,
      whiteSpace: "nowrap",          // prevents wrapping mid-emoji
      lineHeight: 1
    }}>
      {level.label}
    </div>
  )
}