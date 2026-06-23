// src/pages/WebtoonDetail.jsx
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api"
import ReviewForm from "../components/ReviewForm"
import { getActiveSystem } from "../utils/tiers"
import TierBadge from "../components/TierBadge"
import ChapterNotes from "../components/ChapterNotes"

export default function WebtoonDetail({ onThemeToggle, theme }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [webtoon, setWebtoon] = useState(null)
  const [reviews, setReviews] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ rating: 5, content: "", status: "reading" })
  const system = getActiveSystem()

  useEffect(() => {
    fetchWebtoon()
    fetchReviews()
  }, [id])

  async function fetchWebtoon() {
    const res = await api.get(`/webtoons/${id}`)
    setWebtoon(res.data)
  }

  async function fetchReviews() {
    const res = await api.get(`/reviews/?webtoon_id=${id}`)
    setReviews(res.data)
  }

  // add this function to handle saving the edit
	async function handleEditSave(reviewId) {
    try {
      const payload = {
        webtoon_id: parseInt(id),
        rating: parseInt(editForm.rating),
        content: editForm.content,
        status: editForm.status,
        current_chapter: editForm.current_chapter || 0
      }
      await api.put(`/reviews/${reviewId}`, payload)
      setEditingId(null)
      fetchReviews()
    } catch (error) {
      console.error("Error saving review:", error)
      alert("Failed to save review: " + (error.response?.data?.detail || error.message))
    }
  }

  if (!webtoon) return <p style={{ padding: 40, color: "#999" }}>loading...</p>

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div style={styles.page}>
      {/* nav */}
      <header className="glass-strong" style={{ ...styles.nav, position: "sticky", top: 0, zIndex: 50 }}>
        <button style={styles.back} onClick={() => navigate("/")}>← back</button>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button style={styles.themeBtn} onClick={onThemeToggle}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <span style={styles.logo}>dievs</span>
        </div>
      </header>

      {/* hero banner */}
      <div style={styles.hero}>
        {webtoon.cover_url ? (
          <img src={webtoon.cover_url} alt={webtoon.title} style={styles.cover} />
        ) : (
          <div style={styles.placeholder} />
        )}

        <div style={styles.heroInfo}>
          {webtoon.genre && (
            <p style={styles.genre}>{webtoon.genre.split(",")[0].toUpperCase()}</p>
          )}
          <h1 style={styles.title}>{webtoon.title}</h1>
          <p style={styles.author}>by {webtoon.author}</p>

          <div style={styles.meta}>
            {avgRating && <TierBadge value={Math.round(parseFloat(avgRating))} size="md" />}
            <span style={styles.reviewCount}>{reviews.length} reviews</span>
          </div>

          {webtoon.description && (
            <p style={styles.description}>{webtoon.description.slice(0, 300)}
              {webtoon.description.length > 300 ? "..." : ""}
            </p>
          )}
        </div>
      </div>

      {/* reviews section */}
      <div style={styles.content}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionLabel}>reviews</span>
        </div>

        {reviews.length === 0 ? (
          <ReviewForm webtoonId={parseInt(id)} onSuccess={fetchReviews} />
        ) : (
          <p style={styles.reviewed}>
            you've already reviewed this — edit it below
          </p>
        )}

        {reviews.length === 0 && (
          <p style={styles.empty}>no reviews yet — be the first!</p>
        )}

        <div style={styles.reviewList}>
          {reviews.map(review => (
            <div key={review.id} style={styles.review}>
              {editingId === review.id ? (
                // --- edit mode ---
                <div>
                  {/* replace the rating select in edit mode with this */}
                  <label style={styles.editLabel}>tier</label>
                  <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                    {system.levels.map(level => (
                      <button
                        key={level.value}
                        onClick={() => setEditForm({ ...editForm, rating: level.value })}
                        style={{
                          ...styles.tierBtn,
                          background: level.color,
                          border: editForm.rating === level.value ? `2px solid ${level.text}` : `0.5px solid ${level.border}`,
                          color: level.text,
                          transform: editForm.rating === level.value ? "scale(1.1)" : "scale(1)"
                        }}
                      >
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{level.label}</span>
                        <span style={{ fontSize: 9, opacity: 0.8 }}>{level.description}</span>
                      </button>
                    ))}
                  </div>

                  <label style={styles.editLabel}>status</label>
                  <select
                    style={styles.editInput}
                    value={editForm.status}
                    onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option value="reading">reading</option>
                    <option value="completed">completed</option>
                    <option value="dropped">dropped</option>
                  </select>

                  <label style={styles.editLabel}>current chapter</label>
                  <input
                    type="number"
                    min="0"
                    value={editForm.current_chapter}
                    onChange={e => setEditForm({ ...editForm, current_chapter: parseInt(e.target.value) || 0 })}
                    style={styles.editInput}
                  />

                  <label style={styles.editLabel}>thoughts</label>
                  <textarea
                    style={{ ...styles.editInput, height: 80, resize: "vertical" }}
                    value={editForm.content}
                    onChange={e => setEditForm({ ...editForm, content: e.target.value })}
                  />

                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <button style={styles.saveBtn} onClick={() => handleEditSave(review.id)}>
                      save
                    </button>
                    <button style={styles.cancelBtn} onClick={() => setEditingId(null)}>
                      cancel
                    </button>
                  </div>
                </div>
              ) : (
                // --- view mode ---
                <>
                  <div style={styles.reviewTop}>
                    <TierBadge value={review.rating} size="md" />
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{
                        ...styles.statusBadge,
                        background: review.status === "completed" ? "#111" : "#f0f0f0",
                        color: review.status === "completed" ? "#fff" : "#555"
                      }}>
                        {review.status}
                      </span>
                      <button
                        style={styles.editBtn}
                        onClick={() => {
                          setEditingId(review.id)
                          // add to editForm state when clicking edit
                          setEditForm({
                            rating: review.rating,
                            content: review.content || "",
                            status: review.status,
                            current_chapter: review.current_chapter || 0   // add this
                          })
                        }}
                      >
                        edit
                      </button>
                      <button
                        style={styles.deleteReview}
                        onClick={async () => {
                          if (!confirm("Delete this review?")) return
                          await api.delete(`/reviews/${review.id}`)
                          fetchReviews()
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  {review.current_chapter > 0 && (
                    <p style={styles.chapterBadge}>ch. {review.current_chapter}</p>
                  )}
                  {review.content && (
                    <p style={styles.reviewContent}>{review.content}</p>
                  )}
                  <p style={styles.reviewDate}>
                    {new Date(review.created_at).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric"
                    })}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>

        <ChapterNotes webtoonId={parseInt(id)} />
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: "100vh" },  // remove background: "#fff"
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 40px"
  },
  logo: {
    fontSize: 20,
    fontWeight: 500,
    letterSpacing: "-0.03em",
    color: "var(--text-primary)"
  },
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
    display: "flex",
    gap: 40,
    padding: "48px 40px",
    borderBottom: "0.5px solid var(--border)",
    maxWidth: 900,
    margin: "0 auto"
  },
  cover: {
    width: 180,
    height: 250,
    objectFit: "cover",
    borderRadius: 10,
    flexShrink: 0,
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
  },
  placeholder: {
    width: 180,
    height: 250,
    background: "var(--bg-input)",
    borderRadius: 10,
    flexShrink: 0
  },
  heroInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  genre: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.08em",
    color: "var(--accent)",
    marginBottom: 10
  },
  title: {
    fontSize: 34,
    fontWeight: 700,
    letterSpacing: "-0.03em",
    lineHeight: 1.15,
    marginBottom: 8,
    color: "var(--text-primary)"
  },
  author: {
    fontSize: 15,
    color: "var(--text-muted)",
    marginBottom: 16
  },
  meta: {
    display: "flex",
    gap: 16,
    marginBottom: 16,
    alignItems: "center"
  },
  reviewCount: {
    fontSize: 13,
    color: "var(--text-muted)"
  },
  description: {
    fontSize: 14,
    color: "var(--text-secondary)",
    lineHeight: 1.7,
    maxWidth: 480
  },
  content: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "40px 40px"
  },
  sectionHeader: { marginBottom: 20 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--text-muted)"
  },
  empty: {
    color: "var(--text-muted)",
    fontSize: 14,
    padding: "40px 0"
  },
  reviewed: {
    fontSize: 13,
    color: "var(--text-muted)",
    marginBottom: 24,
    fontStyle: "italic"
  },
  reviewList: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginTop: 24
  },
  review: {
    padding: "20px 24px",
    border: "0.5px solid var(--border)",
    borderRadius: 12,
    background: "var(--bg-card)",
    backdropFilter: "blur(16px)"
  },
  reviewTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: 500,
    padding: "4px 10px",
    borderRadius: 20
  },
  reviewContent: {
    fontSize: 14,
    color: "var(--text-secondary)",
    lineHeight: 1.7,
    marginBottom: 10
  },
  reviewDate: {
    fontSize: 12,
    color: "var(--text-muted)"
  },
  chapterBadge: {
    fontSize: 12,
    color: "var(--text-muted)",
    fontWeight: 500,
    marginBottom: 6
  },
  deleteReview: {
    background: "none",
    border: "none",
    color: "var(--text-muted)",
    fontSize: 13,
    cursor: "pointer",
    fontWeight: 600,
    padding: "2px 6px",
    borderRadius: 4
  },
  editLabel: {
    display: "block",
    fontSize: 12,
    color: "var(--text-muted)",
    marginBottom: 6,
    fontWeight: 500
  },
  editInput: {
    display: "block",
    width: "100%",
    padding: "10px 14px",
    background: "var(--bg-input)",
    border: "0.5px solid var(--border)",
    borderRadius: 8,
    color: "var(--text-primary)",
    fontSize: 14,
    marginBottom: 12,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    backdropFilter: "blur(8px)"
  },
  editBtn: {
    background: "none",
    border: "0.5px solid var(--border)",
    color: "var(--text-muted)",
    fontSize: 12,
    cursor: "pointer",
    fontWeight: 500,
    padding: "3px 10px",
    borderRadius: 6,
    fontFamily: "inherit"
  },
  saveBtn: {
    padding: "8px 20px",
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit"
  },
  cancelBtn: {
    padding: "8px 20px",
    background: "var(--bg-input)",
    color: "var(--text-secondary)",
    border: "0.5px solid var(--border)",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit"
  },
  tierBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 56,
    borderRadius: 8,
    cursor: "pointer",
    transition: "transform 0.15s, border 0.15s",
    gap: 2,
    fontFamily: "inherit",
    padding: 0
  }
}