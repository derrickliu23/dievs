// src/components/TierBadge.jsx
import { getTier } from "../utils/tiers"

// size can be "sm", "md", or "lg"
export default function TierBadge({ value, size = "md" }) {
  const tier = getTier(value)

  const sizes = {
    sm: { width: 28, height: 28, fontSize: 13 },
    md: { width: 40, height: 40, fontSize: 18 },
    lg: { width: 52, height: 52, fontSize: 22 }
  }

  const s = sizes[size]

  return (
    <div style={{
      width: s.width,
      height: s.height,
      borderRadius: 8,
      background: tier.color,
      border: `0.5px solid ${tier.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: s.fontSize,
      fontWeight: 600,
      color: tier.text,
      fontFamily: "inherit",
      flexShrink: 0
    }}>
      {tier.label}
    </div>
  )
}