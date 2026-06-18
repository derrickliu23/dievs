// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import WebtoonDetail from "./pages/WebtoonDetail"
import Stats from "./pages/Stats"
import Wishlist from "./pages/Wishlist"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/webtoon/:id" element={<WebtoonDetail />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </BrowserRouter>
  )
}