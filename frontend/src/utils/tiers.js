// src/utils/tiers.js

// each tier maps to a numeric value stored in the database
// this means we don't need to change the backend at all
export const TIERS = [
  { label: "S", value: 6, color: "#EEEDFE", border: "#AFA9EC", text: "#3C3489", description: "masterpiece" },
  { label: "A", value: 5, color: "#E1F5EE", border: "#5DCAA5", text: "#085041", description: "great" },
  { label: "B", value: 4, color: "#E6F1FB", border: "#85B7EB", text: "#0C447C", description: "good" },
  { label: "C", value: 3, color: "#FAEEDA", border: "#EF9F27", text: "#633806", description: "decent" },
  { label: "D", value: 2, color: "#FAECE7", border: "#F0997B", text: "#711B0C", description: "weak" },
  { label: "F", value: 1, color: "#FCEBEB", border: "#F09595", text: "#501313", description: "dropped" },
]

// get a tier object by its numeric value
export function getTier(value) {
  return TIERS.find(t => t.value === value) || TIERS[TIERS.length - 1]
}