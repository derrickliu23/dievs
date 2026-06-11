// src/App.jsx

// BrowserRouter enables client-side routing — clicking links
// changes the URL without reloading the page
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import WebtoonDetail from "./pages/WebtoonDetail"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* home page — shows all webtoons */}
        <Route path="/" element={<Home />} />

        {/* detail page — shows a single webtoon and its reviews */}
        {/* :id is a URL parameter — e.g. /webtoon/3 */}
        <Route path="/webtoon/:id" element={<WebtoonDetail />} />
      </Routes>
    </BrowserRouter>
  )
}