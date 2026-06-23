// src/pages/Wishlist.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import WebtoonCard from "../components/WebtoonCard"

export default function Wishlist({ onThemeToggle, theme }) {
  const [webtoons, setWebtoons] = useState([])
  const [reviewedIds, setReviewedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const res = await api.get("/webtoons/")
    setWebtoons(res.data)

    // fetch reviews for every webtoon to figure out which ones have NO review
    const allReviews = await Promise.all(
      res.data.map(w => api.get(`/reviews/?webtoon_id=${w.id}`).then(r => r.data))
    )

    // build a set of webtoon ids that already have a review
    const idsWithReviews = new Set()
    allReviews.flat().forEach(r => idsWithReviews.add(r.webtoon_id))

    setReviewedIds(idsWithReviews)
    setLoading(false)
  }

  // wishlist = webtoons with no review at all (never started)
  const wishlist = webtoons.filter(w => !reviewedIds.has(w.id))

  async function fetchWebtoons() {
    fetchData()
  }

  return (
    <div style={styles.page}>
      <header className="glass-strong" style={{ ...styles.nav, position: "sticky", top: 0, zIndex: 50 }}>
        <button style={styles.back} onClick={() => navigate("/")}>← back</button>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button style={styles.themeBtn} onClick={onThemeToggle}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <span style={styles.logo}>dievs</span>
        </div>
      </header>

      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Your wishlist.</h1>
        <p style={styles.heroSub}>Webtoons you've saved but haven't started yet.</p>
      </div>

      <div style={styles.content}>
        {loading ? (
          <p style={styles.empty}>loading...</p>
        ) : wishlist.length === 0 ? (
          <p style={styles.empty}>
            nothing here yet — add a webtoon from the home page and skip the review to save it for later
          </p>
        ) : (
          <>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionLabel}>saved for later</span>
              <span style={styles.sectionCount}>{wishlist.length} titles</span>
            </div>

            <div style={styles.grid}>
              {wishlist.map(w => (
                <WebtoonCard
                  key={w.id}
                  webtoon={w}
                  onClick={() => navigate(`/webtoon/${w.id}`)}
                  onDeleted={fetchWebtoons}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: "100vh" },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 40px"
  },
  logo: { fontSize: 20, fontWeight: 500, letterSpacing: "-0.03em", color: "var(--text-primary)" },
  back: {
    background: "none",
    border: "none",
    fontSize: 14,
    color: "var(--text-muted)",
    cursor: "pointer",
    fontWeight: 500,
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
  hero: {
    padding: "48px 40px 32px",
    borderBottom: "0.5px solid var(--border)"
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 700,
    letterSpacing: "-0.03em",
    marginBottom: 6,
    color: "var(--text-primary)"
  },
  heroSub: { fontSize: 15, color: "var(--text-muted)" },
  content: { maxWidth: 1000, margin: "0 auto", padding: "40px 40px" },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--text-muted)"
  },
  sectionCount: { fontSize: 13, color: "var(--text-muted)" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 24
  },
  empty: {
    color: "var(--text-muted)",
    fontSize: 14,
    textAlign: "center",
    padding: "60px 0",
    maxWidth: 400,
    margin: "0 auto"
  }
}