// src/utils/useTheme.js
import { useState, useEffect } from "react"

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // check localStorage, default to dark
    return localStorage.getItem("dievs_theme") || "dark"
  })

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("dievs_theme", theme)
  }, [theme])

  function toggle() {
    setTheme(t => t === "dark" ? "light" : "dark")
  }

  return { theme, toggle }
}