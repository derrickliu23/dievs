// src/components/RatingSystemPicker.jsx
import { useState } from "react"
import { RATING_SYSTEMS, getActiveSystem, setActiveSystem } from "../utils/tiers"

export default function RatingSystemPicker({ onChange }) {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(getActiveSystem().name)

  function handleSelect(systemName) {
    setActiveSystem(systemName)
    setCurrent(systemName)
    setOpen(false)
    // tell the parent to re-render everything that shows ratings
    onChange()
  }

  return (
    <div style={styles.container}>
      <button style={styles.trigger} onClick={() => setOpen(!open)}>
        rating style: {RATING_SYSTEMS[current].label}
      </button>

      {open && (
        <div style={styles.dropdown}>
          {Object.values(RATING_SYSTEMS).map(system => (
            <button
              key={system.name}
              style={{
                ...styles.option,
                background: current === system.name ? "#f7f7f7" : "transparent"
              }}
              onClick={() => handleSelect(system.name)}
            >
              <span style={styles.optionLabel}>{system.label}</span>
              <span style={styles.preview}>
                {system.levels.slice(0, 3).map(l => l.label).join("  ")}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { position: "relative" },
  trigger: {
    padding: "7px 14px",
    background: "var(--bg-input)",
    border: "0.5px solid var(--border)",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    color: "var(--text-secondary)",
    cursor: "pointer",
    fontFamily: "inherit",
    backdropFilter: "blur(8px)"
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 6px)",
    right: 0,
    background: "var(--bg-nav)",
    backdropFilter: "blur(20px)",
    border: "0.5px solid var(--border)",
    borderRadius: 10,
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    overflow: "hidden",
    minWidth: 220,
    zIndex: 100
  },
  option: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    padding: "10px 16px",
    border: "none",
    borderBottom: "0.5px solid var(--border)",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
    background: "transparent"
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "var(--text-primary)",
    marginBottom: 2
  },
  preview: {
    fontSize: 12,
    color: "var(--text-muted)"
  }
}