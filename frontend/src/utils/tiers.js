// src/utils/tiers.js

// each system maps numeric values 1-6 to a visual representation
// keeping 6 levels across all systems means the database doesn't need to change
export const RATING_SYSTEMS = {
  tiers: {
    name: "tiers",
    label: "F-S Tier",
    levels: [
      { value: 6, label: "S", color: "#EEEDFE", border: "#AFA9EC", text: "#3C3489", description: "masterpiece" },
      { value: 5, label: "A", color: "#E1F5EE", border: "#5DCAA5", text: "#085041", description: "great" },
      { value: 4, label: "B", color: "#E6F1FB", border: "#85B7EB", text: "#0C447C", description: "good" },
      { value: 3, label: "C", color: "#FAEEDA", border: "#EF9F27", text: "#633806", description: "decent" },
      { value: 2, label: "D", color: "#FAECE7", border: "#F0997B", text: "#711B0C", description: "weak" },
      { value: 1, label: "F", color: "#FCEBEB", border: "#F09595", text: "#501313", description: "dropped" },
    ]
  },
  stars: {
    name: "stars",
    label: "Stars",
    levels: [
      { value: 6, label: "★★★★★+", color: "#FFF8E1", border: "#FFD54F", text: "#7A5C00", description: "exceptional" },
      { value: 5, label: "★★★★★", color: "#FFF8E1", border: "#FFD54F", text: "#7A5C00", description: "excellent" },
      { value: 4, label: "★★★★", color: "#FFF8E1", border: "#FFD54F", text: "#7A5C00", description: "great" },
      { value: 3, label: "★★★", color: "#FFF8E1", border: "#FFD54F", text: "#7A5C00", description: "good" },
      { value: 2, label: "★★", color: "#FFF8E1", border: "#FFD54F", text: "#7A5C00", description: "weak" },
      { value: 1, label: "★", color: "#FFF8E1", border: "#FFD54F", text: "#7A5C00", description: "poor" },
    ]
  },
  hearts: {
    name: "hearts",
    label: "Hearts",
    levels: [
      { value: 6, label: "♥♥♥♥♥♥", color: "#FCE9EE", border: "#F48FB1", text: "#9C2D52", description: "obsessed" },
      { value: 5, label: "♥♥♥♥♥", color: "#FCE9EE", border: "#F48FB1", text: "#9C2D52", description: "loved it" },
      { value: 4, label: "♥♥♥♥", color: "#FCE9EE", border: "#F48FB1", text: "#9C2D52", description: "really liked" },
      { value: 3, label: "♥♥♥", color: "#FCE9EE", border: "#F48FB1", text: "#9C2D52", description: "liked it" },
      { value: 2, label: "♥♥", color: "#FCE9EE", border: "#F48FB1", text: "#9C2D52", description: "okay" },
      { value: 1, label: "♥", color: "#FCE9EE", border: "#F48FB1", text: "#9C2D52", description: "didn't like" },
    ]
  },
  flames: {
    name: "flames",
    label: "Flames",
    levels: [
      { value: 6, label: "🔥🔥🔥🔥🔥🔥", color: "#FFEEE5", border: "#FF8A50", text: "#B33B00", description: "fire" },
      { value: 5, label: "🔥🔥🔥🔥🔥", color: "#FFEEE5", border: "#FF8A50", text: "#B33B00", description: "amazing" },
      { value: 4, label: "🔥🔥🔥🔥", color: "#FFEEE5", border: "#FF8A50", text: "#B33B00", description: "great" },
      { value: 3, label: "🔥🔥🔥", color: "#FFEEE5", border: "#FF8A50", text: "#B33B00", description: "good" },
      { value: 2, label: "🔥🔥", color: "#FFEEE5", border: "#FF8A50", text: "#B33B00", description: "mid" },
      { value: 1, label: "🔥", color: "#FFEEE5", border: "#FF8A50", text: "#B33B00", description: "not it" },
    ]
  }
}

// read the user's chosen system from localStorage, default to tiers
export function getActiveSystem() {
  const saved = localStorage.getItem("dievs_rating_system")
  return RATING_SYSTEMS[saved] || RATING_SYSTEMS.tiers
}

// save the user's choice
export function setActiveSystem(systemName) {
  localStorage.setItem("dievs_rating_system", systemName)
}

// get a specific level from the active system by its numeric value
export function getLevel(value) {
  const system = getActiveSystem()
  return system.levels.find(l => l.value === value) || system.levels[system.levels.length - 1]
}

// keep TIERS export for backward compatibility with existing imports
export const TIERS = RATING_SYSTEMS.tiers.levels
export function getTier(value) {
  return getLevel(value)
}