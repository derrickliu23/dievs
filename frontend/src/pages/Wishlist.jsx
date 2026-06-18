// src/pages/Wishlist.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import WebtoonCard from "../components/WebtoonCard"

export default function Wishlist() {
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
      <header style={styles.nav}>
        <button style={styles.back} onClick={() => navigate("/")}>← back</button>
        <span style={styles.logo}>dievs</span>
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
  page: { minHeight: "100vh", background: "#fff" },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    borderBottom: "1px solid #f0f0f0"
  },
  logo: { fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em" },
  back: {
    background: "none",
    border: "none",
    fontSize: 14,
    color: "#999",
    cursor: "pointer",
    fontWeight: 500,
    fontFamily: "inherit"
  },
  hero: {
    padding: "48px 40px 32px",
    borderBottom: "1px solid #f0f0f0"
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 700,
    letterSpacing: "-0.03em",
    marginBottom: 6
  },
  heroSub: {
    fontSize: 15,
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
    marginBottom: 20
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#111"
  },
  sectionCount: { fontSize: 13, color: "#aaa" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 24
  },
  empty: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    padding: "60px 0",
    maxWidth: 400,
    margin: "0 auto"
  }
}