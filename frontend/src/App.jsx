// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import WebtoonDetail from "./pages/WebtoonDetail"
import Stats from "./pages/Stats"
import Wishlist from "./pages/Wishlist"
import BackgroundArt from "./components/BackgroundArt"
import { useTheme } from "./utils/useTheme"

export default function App() {
  const { theme, toggle } = useTheme()

  return (
    <BrowserRouter>
      {/* fixed background art behind everything */}
      <BackgroundArt />

      {/* pass theme toggle down via context or prop */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Routes>
          <Route path="/"          element={<Home onThemeToggle={toggle} theme={theme} />} />
          <Route path="/webtoon/:id" element={<WebtoonDetail onThemeToggle={toggle} theme={theme} />} />
          <Route path="/stats"     element={<Stats onThemeToggle={toggle} theme={theme} />} />
          <Route path="/wishlist"  element={<Wishlist onThemeToggle={toggle} theme={theme} />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}