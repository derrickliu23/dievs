// src/pages/Home.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import WebtoonCard from "../components/WebtoonCard"
import WebtoonForm from "../components/WebtoonForm"
import WebtoonSearch from "../components/WebtoonSearch"
import Recommendations from "../components/Recommendations"
import RatingSystemPicker from "../components/RatingSystemPicker"

export default function Home({ onThemeToggle, theme }) {
  const [webtoons, setWebtoons] = useState([])
  const [reviews, setReviews] = useState([])  // all reviews across all webtoons
  const [showForm, setShowForm] = useState(false)
  const [filters, setFilters] = useState({ status: "all", genre: "all", rating: "all" })
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date_added")
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    fetchWebtoons()
  }, [])

  async function fetchWebtoons() {
    const res = await api.get("/webtoons/")
    setWebtoons(res.data)

    // fetch reviews for every webtoon so we can filter by rating and status
    const allReviews = await Promise.all(
      res.data.map(w => api.get(`/reviews/?webtoon_id=${w.id}`).then(r => r.data))
    )
    // flatten into a single array
    setReviews(allReviews.flat())
  }

  function onWebtoonAdded() {
    fetchWebtoons()
    setShowForm(false)
  }

  // build a lookup of webtoon_id → review for quick access
  const reviewByWebtoon = {}
  reviews.forEach(r => { reviewByWebtoon[r.webtoon_id] = r })

  // collect all unique genres from webtoons
  const allGenres = [...new Set(
    webtoons
      .flatMap(w => w.genre ? w.genre.split(",").map(g => g.trim()) : [])
      .filter(Boolean)
  )].sort()

  // apply filters
  const filtered = webtoons
    .filter(w => {
      const review = reviewByWebtoon[w.id]
      if (searchQuery && !w.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (filters.status !== "all") {
        if (!review || review.status !== filters.status) return false
      }
      if (filters.genre !== "all") {
        if (!w.genre || !w.genre.toLowerCase().includes(filters.genre.toLowerCase())) return false
      }
      if (filters.rating !== "all") {
        if (!review || review.rating < parseInt(filters.rating)) return false
      }
      return true
    })
    .sort((a, b) => {
      const reviewA = reviewByWebtoon[a.id]
      const reviewB = reviewByWebtoon[b.id]

      if (sortBy === "title") {
        return a.title.localeCompare(b.title)
      }
      if (sortBy === "tier_high") {
        return (reviewB?.rating || 0) - (reviewA?.rating || 0)
      }
      if (sortBy === "tier_low") {
        return (reviewA?.rating || 0) - (reviewB?.rating || 0)
      }
      if (sortBy === "chapter") {
        return (reviewB?.current_chapter || 0) - (reviewA?.current_chapter || 0)
      }
      // default: date_added — newest first
      return new Date(b.created_at) - new Date(a.created_at)
    })

  const isFiltered = searchQuery !== "" || filters.status !== "all" || filters.genre !== "all" || filters.rating !== "all"

  function clearFilters() {
    setSearchQuery("")
    setFilters({ status: "all", genre: "all", rating: "all" })
  }

  return (
    <div style={styles.page}>
      {/* glass nav */}
      <header className="glass-strong" style={styles.nav}>
        <span style={styles.logo}>dievs</span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <RatingSystemPicker onChange={() => forceUpdate(n => n + 1)} />
          <button style={styles.navBtn} onClick={() => navigate("/stats")}>stats</button>
          <button style={styles.navBtn} onClick={() => navigate("/wishlist")}>wishlist</button>
          <button style={styles.themeBtn} onClick={onThemeToggle}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? "cancel" : "+ add manually"}
          </button>
        </div>
      </header>

      {/* hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Your webtoon shelf.</h1>
        <p style={styles.heroSub}>Search, rate, and review as you read.</p>
      </div>

      <div style={styles.content}>
        <WebtoonSearch onAdded={fetchWebtoons} />
        {showForm && <WebtoonForm onSuccess={onWebtoonAdded} />}

        {webtoons.length > 0 && (
          <>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionLabel}>your shelf</span>
              <span style={styles.sectionCount}>
                {isFiltered ? `${filtered.length} of ${webtoons.length}` : `${webtoons.length} titles`}
              </span>
            </div>

            <input
              className="glass-input"
              style={styles.shelfSearch}
              placeholder="search your shelf..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />

            <div style={styles.filterBar}>
              {["status", "genre", "rating", "sort"].map((_, i) => null)}
              <select className="glass-input" style={styles.filterSelect} value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
                <option value="all">all statuses</option>
                <option value="reading">reading</option>
                <option value="completed">completed</option>
                <option value="dropped">dropped</option>
              </select>
              <select className="glass-input" style={styles.filterSelect} value={filters.genre} onChange={e => setFilters({ ...filters, genre: e.target.value })}>
                <option value="all">all genres</option>
                {allGenres.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <select className="glass-input" style={styles.filterSelect} value={filters.rating} onChange={e => setFilters({ ...filters, rating: e.target.value })}>
                <option value="all">all ratings</option>
                <option value="6">S only</option>
                <option value="5">A and above</option>
                <option value="4">B and above</option>
                <option value="3">C and above</option>
              </select>
              <select className="glass-input" style={styles.filterSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="date_added">newest added</option>
                <option value="title">title (a-z)</option>
                <option value="tier_high">highest tier</option>
                <option value="tier_low">lowest tier</option>
                <option value="chapter">most chapters</option>
              </select>
              {isFiltered && (
                <button style={styles.clearBtn} onClick={clearFilters}>clear</button>
              )}
            </div>
          </>
        )}

        {webtoons.length === 0 && !showForm && (
          <p style={styles.empty}>search above to add your first webtoon</p>
        )}

        {webtoons.length > 0 && filtered.length === 0 && (
          <p style={styles.empty}>no webtoons match these filters</p>
        )}

        <div style={styles.grid}>
          {filtered.map(w => (
            <WebtoonCard
              key={w.id}
              webtoon={w}
              review={reviewByWebtoon[w.id]}
              onClick={() => navigate(`/webtoon/${w.id}`)}
              onDeleted={fetchWebtoons}
            />
          ))}
        </div>

        <Recommendations webtoons={webtoons} reviews={reviews} />
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh"
  },
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 40px"
  },
  logo: {
    fontSize: 22,
    fontWeight: 500,
    letterSpacing: "-0.04em",
    color: "var(--text-primary)"
  },
  navBtn: {
    padding: "7px 14px",
    background: "var(--bg-input)",
    color: "var(--text-secondary)",
    border: "0.5px solid var(--border)",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    backdropFilter: "blur(8px)",
    fontFamily: "inherit"
  },
  themeBtn: {
    padding: "7px 10px",
    background: "var(--bg-input)",
    border: "0.5px solid var(--border)",
    borderRadius: 8,
    fontSize: 14,
    cursor: "pointer",
    backdropFilter: "blur(8px)"
  },
  addBtn: {
    padding: "7px 16px",
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit"
  },
  hero: {
    padding: "56px 40px 40px",
    borderBottom: "0.5px solid var(--border)"
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 500,
    letterSpacing: "-0.05em",
    lineHeight: 1.05,
    marginBottom: 10,
    color: "var(--text-primary)"
  },
  heroSub: {
    fontSize: 15,
    color: "var(--text-muted)"
  },
  content: {
    maxWidth: 1040,
    margin: "0 auto",
    padding: "40px 40px"
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--text-muted)"
  },
  sectionCount: {
    fontSize: 13,
    color: "var(--text-muted)"
  },
  shelfSearch: {
    width: "100%",
    padding: "11px 16px",
    borderRadius: 10,
    fontSize: 14,
    marginBottom: 12,
    boxSizing: "border-box"
  },
  filterBar: {
    display: "flex",
    gap: 8,
    marginBottom: 28,
    flexWrap: "wrap",
    alignItems: "center"
  },
  filterSelect: {
    padding: "7px 12px",
    borderRadius: 8,
    fontSize: 13,
    cursor: "pointer"
  },
  clearBtn: {
    padding: "7px 14px",
    background: "none",
    border: "0.5px solid var(--border)",
    borderRadius: 8,
    color: "var(--text-muted)",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))",
    gap: 16
  },
  empty: {
    color: "var(--text-muted)",
    fontSize: 14,
    textAlign: "center",
    padding: "60px 0"
  }
}