// src/pages/Home.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import WebtoonCard from "../components/WebtoonCard"
import WebtoonForm from "../components/WebtoonForm"
import WebtoonSearch from "../components/WebtoonSearch"
import Recommendations from "../components/Recommendations"

export default function Home() {
  const [webtoons, setWebtoons] = useState([])
  const [reviews, setReviews] = useState([])  // all reviews across all webtoons
  const [showForm, setShowForm] = useState(false)
  const [filters, setFilters] = useState({ status: "all", genre: "all", rating: "all" })
  const navigate = useNavigate()

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
  const filtered = webtoons.filter(w => {
    const review = reviewByWebtoon[w.id]

    // status filter — check the review's status
    if (filters.status !== "all") {
      if (!review || review.status !== filters.status) return false
    }

    // genre filter — check if the webtoon's genre includes the selected one
    if (filters.genre !== "all") {
      if (!w.genre || !w.genre.toLowerCase().includes(filters.genre.toLowerCase())) return false
    }

    // rating filter — check review rating is >= selected minimum
    if (filters.rating !== "all") {
      if (!review || review.rating < parseInt(filters.rating)) return false
    }

    return true
  })

  const isFiltered = filters.status !== "all" || filters.genre !== "all" || filters.rating !== "all"

  function clearFilters() {
    setFilters({ status: "all", genre: "all", rating: "all" })
  }

  return (
    <div style={styles.page}>
      <header style={styles.nav}>
        <span style={styles.logo}>dievs</span>
        <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? "cancel" : "+ add manually"}
        </button>
      </header>

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

            {/* filter bar */}
            <div style={styles.filterBar}>
              {/* status filter */}
              <select
                style={styles.filterSelect}
                value={filters.status}
                onChange={e => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="all">all statuses</option>
                <option value="reading">reading</option>
                <option value="completed">completed</option>
                <option value="dropped">dropped</option>
              </select>

              {/* genre filter */}
              <select
                style={styles.filterSelect}
                value={filters.genre}
                onChange={e => setFilters({ ...filters, genre: e.target.value })}
              >
                <option value="all">all genres</option>
                {allGenres.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>

              {/* rating filter */}
              <select
                style={styles.filterSelect}
                value={filters.rating}
                onChange={e => setFilters({ ...filters, rating: e.target.value })}
              >
                <option value="all">all ratings</option>
                <option value="5">★★★★★ only</option>
                <option value="4">★★★★ and above</option>
                <option value="3">★★★ and above</option>
                <option value="2">★★ and above</option>
              </select>

              {/* clear button — only show when filters are active */}
              {isFiltered && (
                <button style={styles.clearBtn} onClick={clearFilters}>
                  clear
                </button>
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

        {/* recommendations — only shows when there's shelf data */}
        <Recommendations webtoons={webtoons} reviews={reviews} />
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#fff"
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    borderBottom: "1px solid #f0f0f0"
  },
  logo: {
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: "-0.03em",
    color: "#111"
  },
  addBtn: {
    padding: "8px 16px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer"
  },
  hero: {
    padding: "60px 40px 40px",
    borderBottom: "1px solid #f0f0f0"
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: 700,
    letterSpacing: "-0.04em",
    marginBottom: 8,
    lineHeight: 1.1
  },
  heroSub: {
    fontSize: 16,
    color: "#888"
  },
  content: {
    maxWidth: 1000,
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
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#111"
  },
  sectionCount: {
    fontSize: 13,
    color: "#aaa"
  },
  filterBar: {
    display: "flex",
    gap: 10,
    marginBottom: 24,
    flexWrap: "wrap",
    alignItems: "center"
  },
  filterSelect: {
    padding: "8px 14px",
    background: "#f7f7f7",
    border: "1px solid #eee",
    borderRadius: 8,
    color: "#111",
    fontSize: 13,
    fontFamily: "inherit",
    outline: "none",
    cursor: "pointer"
  },
  clearBtn: {
    padding: "8px 14px",
    background: "none",
    border: "1px solid #eee",
    borderRadius: 8,
    color: "#999",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 24
  },
  empty: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    padding: "60px 0"
  }
}