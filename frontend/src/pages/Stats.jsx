// src/pages/Stats.jsx
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from "chart.js"
import { getActiveSystem, getLevel } from "../utils/tiers"
import api from "../api"

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip)

export default function Stats({ onThemeToggle, theme }) {
  const [webtoons, setWebtoons] = useState([])
  const [reviews, setReviews]   = useState([])
  const [loading, setLoading]   = useState(true)
  const chartRef  = useRef(null)
  const chartInst = useRef(null)
  const navigate  = useNavigate()
  const system    = getActiveSystem()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const res = await api.get("/webtoons/")
    setWebtoons(res.data)

    const allReviews = await Promise.all(
      res.data.map(w => api.get(`/reviews/?webtoon_id=${w.id}`).then(r => r.data))
    )
    setReviews(allReviews.flat())
    setLoading(false)
  }

  function getGenreStats() {
    const counts = {}
    webtoons.forEach(w => {
      if (!w.genre) return
      w.genre.split(",").forEach(g => {
        const genre = g.trim()
        counts[genre] = (counts[genre] || 0) + 1
      })
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
  }

  function getTierStats() {
    const counts = {}
    system.levels.forEach(l => { counts[l.label] = 0 })
    reviews.forEach(r => {
      const level = getLevel(r.rating)
      counts[level.label] = (counts[level.label] || 0) + 1
    })
    return counts
  }

  function getAvgTier() {
    if (reviews.length === 0) return null
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    return getLevel(Math.round(avg))
  }

  function getTopGenre() {
    const stats = getGenreStats()
    return stats.length > 0 ? stats[0][0] : "—"
  }

  useEffect(() => {
    if (loading || !chartRef.current) return

    const genreStats = getGenreStats()
    if (genreStats.length === 0) return

    const labels = genreStats.map(([g]) => g)
    const data   = genreStats.map(([, count]) => count)
    const maxVal = Math.max(...data)

    // read current theme from the DOM
    const isDark     = document.documentElement.getAttribute("data-theme") === "dark"
    const labelColor = isDark ? "#aaa" : "#555"
    const gridColor = isDark ?  "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)"
    const fillColor  = isDark ? "rgba(29,158,117,0.15)"  : "rgba(15,110,86,0.10)"
    const lineColor  = isDark ? "#1D9E75"                : "#0F6E56"
    const dotColor   = isDark ? "#1D9E75"                : "#0F6E56"

    if (chartInst.current) chartInst.current.destroy()

    chartInst.current = new Chart(chartRef.current, {
      type: "radar",
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: fillColor,
          borderColor: lineColor,
          borderWidth: 2,
          pointBackgroundColor: dotColor,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? "rgba(20,20,30,0.9)" : "rgba(255,255,255,0.95)",
            titleColor: isDark ? "#f0f0f0" : "#111",
            bodyColor: isDark ? "#aaa" : "#555",
            borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
            borderWidth: 1,
            callbacks: {
              label: ctx => ` ${ctx.raw} title${ctx.raw !== 1 ? "s" : ""}`
            }
          }
        },
        scales: {
          r: {
            min: 0,
            max: maxVal + 1,
            ticks: { stepSize: 1, display: false },
            grid: { color: gridColor },
            angleLines: { color: gridColor },
            pointLabels: {
              font: { size: 12, family: "Inter, sans-serif", weight: "500" },
              color: labelColor
            }
          }
        }
      }
    })

    return () => { if (chartInst.current) chartInst.current.destroy() }
  }, [loading, webtoons, reviews, theme])  // ← theme in dependency array so it redraws on toggle

  const tierStats = getTierStats()
  const avgTier   = getAvgTier()
  const maxTier   = Math.max(...Object.values(tierStats), 1)

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

      <div style={styles.content}>
        <h1 style={styles.title}>your stats</h1>
        <p style={styles.subtitle}>based on your shelf</p>

        {loading ? (
          <p style={styles.empty}>loading...</p>
        ) : webtoons.length === 0 ? (
          <p style={styles.empty}>add some webtoons to see your stats</p>
        ) : (
          <>
            <div style={styles.cards}>
              <div style={styles.card}>
                <p style={styles.cardLabel}>titles</p>
                <p style={styles.cardValue}>{webtoons.length}</p>
              </div>
              <div style={styles.card}>
                <p style={styles.cardLabel}>top genre</p>
                <p style={styles.cardValue}>{getTopGenre()}</p>
              </div>
              <div style={styles.card}>
                <p style={styles.cardLabel}>avg rating</p>
                <p style={{
                  ...styles.cardValue,
                  color: avgTier ? avgTier.text : "#111",
                  fontSize: avgTier && avgTier.label.length > 2 ? 14 : 22
                }}>
                  {avgTier ? avgTier.label : "—"}
                </p>
              </div>
              <div style={styles.card}>
                <p style={styles.cardLabel}>reviews</p>
                <p style={styles.cardValue}>{reviews.length}</p>
              </div>
            </div>

            <div style={styles.section}>
              <p style={styles.sectionLabel}>genre interests</p>
              <div style={styles.chartWrap}>
                <canvas
                  id="genreRadar"
                  ref={chartRef}
                  role="img"
                  aria-label={`Radar chart showing genre reading interests across ${getGenreStats().map(([g, c]) => `${g}: ${c}`).join(", ")}`}
                />
              </div>
            </div>

            <div style={styles.section}>
              <p style={styles.sectionLabel}>rating distribution</p>
              <div style={styles.tierChart}>
                {system.levels.map(level => {
                  const count  = tierStats[level.label] || 0
                  const height = maxTier > 0 ? Math.max((count / maxTier) * 120, count > 0 ? 20 : 4) : 4
                  return (
                    <div key={level.label} style={styles.tierCol}>
                      <span style={styles.tierCount}>{count > 0 ? count : ""}</span>
                      <div style={{
                        ...styles.tierBar,
                        height,
                        background: level.color,
                        border: `0.5px solid ${level.border}`
                      }} />
                      <span style={{ fontSize: 11, fontWeight: 500, color: level.text, textAlign: "center" }}>
                        {level.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div style={styles.section}>
              <p style={styles.sectionLabel}>reading status</p>
              <div style={styles.statusRow}>
                {["reading", "completed", "dropped"].map(status => {
                  const count = reviews.filter(r => r.status === status).length
                  const pct   = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0
                  return (
                    <div key={status} style={styles.statusCard}>
                      <p style={styles.statusCount}>{count}</p>
                      <p style={styles.statusLabel}>{status}</p>
                      <p style={styles.statusPct}>{pct}%</p>
                    </div>
                  )
                })}
              </div>
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
  content: { maxWidth: 760, margin: "0 auto", padding: "56px 40px" },
  title: {
    fontSize: 36,
    fontWeight: 700,
    letterSpacing: "-0.03em",
    marginBottom: 6,
    color: "var(--text-primary)"
  },
  subtitle: { fontSize: 15, color: "var(--text-muted)", marginBottom: 40 },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
    marginBottom: 56
  },
  card: {
    background: "var(--bg-card)",
    backdropFilter: "blur(16px)",
    border: "0.5px solid var(--border)",
    borderRadius: 12,
    padding: "20px 22px"
  },
  cardLabel: { fontSize: 12, color: "var(--text-muted)", marginBottom: 6, fontWeight: 500 },
  cardValue: { fontSize: 22, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.02em" },
  section: { marginBottom: 64 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    marginBottom: 20
  },
  chartWrap: { position: "relative", height: 420, width: "100%" },
  tierChart: { display: "flex", gap: 16, alignItems: "flex-end", height: 200, paddingBottom: 28 },
  tierCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6
  },
  tierCount: { fontSize: 12, color: "var(--text-muted)", height: 16 },
  tierBar: { width: "100%", borderRadius: 6, transition: "height 0.3s" },
  statusRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 },
  statusCard: {
    background: "var(--bg-card)",
    backdropFilter: "blur(16px)",
    border: "0.5px solid var(--border)",
    borderRadius: 12,
    padding: "28px 20px",
    textAlign: "center"
  },
  statusCount: { fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 6, color: "var(--text-primary)" },
  statusLabel: { fontSize: 13, color: "var(--text-muted)", marginBottom: 4, textTransform: "capitalize" },
  statusPct: { fontSize: 12, color: "var(--text-muted)" },
  empty: { color: "var(--text-muted)", fontSize: 14, padding: "60px 0", textAlign: "center" }
}