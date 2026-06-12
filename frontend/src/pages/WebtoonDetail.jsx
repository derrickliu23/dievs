// src/pages/WebtoonDetail.jsx
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api"
import ReviewForm from "../components/ReviewForm"

export default function WebtoonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [webtoon, setWebtoon] = useState(null)
  const [reviews, setReviews] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ rating: 5, content: "", status: "reading" })

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
		await api.put(`/reviews/${reviewId}`, {
				...editForm,
				rating: parseInt(editForm.rating)
		})
		setEditingId(null)
		fetchReviews()
	}

  if (!webtoon) return <p style={{ padding: 40, color: "#999" }}>loading...</p>

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div style={styles.page}>
      {/* nav */}
      <header style={styles.nav}>
        <button style={styles.back} onClick={() => navigate("/")}>
          ← back
        </button>
        <span style={styles.logo}>dievs</span>
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
            {avgRating && (
              <span style={styles.rating}>⭐ {avgRating} avg</span>
            )}
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
                  <label style={styles.editLabel}>rating</label>
                  <select
                    style={styles.editInput}
                    value={editForm.rating}
                    onChange={e => setEditForm({ ...editForm, rating: e.target.value })}
                  >
                    {[5, 4, 3, 2, 1].map(n => (
                      <option key={n} value={n}>{"★".repeat(n)} ({n})</option>
                    ))}
                  </select>

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
                    <div style={styles.stars}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} style={{ color: i < review.rating ? "#111" : "#ddd" }}>
                          ★
                        </span>
                      ))}
                    </div>
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
                          setEditForm({
                            rating: review.rating,
                            content: review.content || "",
                            status: review.status
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
    letterSpacing: "-0.03em"
  },
  back: {
    background: "none",
    border: "none",
    fontSize: 14,
    color: "#999",
    cursor: "pointer",
    fontWeight: 500
  },
  hero: {
    display: "flex",
    gap: 40,
    padding: "48px 40px",
    borderBottom: "1px solid #f0f0f0",
    maxWidth: 900,
    margin: "0 auto"
  },
  cover: {
    width: 180,
    height: 250,
    objectFit: "cover",
    borderRadius: 10,
    flexShrink: 0,
    boxShadow: "0 8px 24px rgba(0,0,0,0.10)"
  },
  placeholder: {
    width: 180,
    height: 250,
    background: "#f5f5f5",
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
    color: "#2563EB",
    marginBottom: 10
  },
  title: {
    fontSize: 34,
    fontWeight: 700,
    letterSpacing: "-0.03em",
    lineHeight: 1.15,
    marginBottom: 8
  },
  author: {
    fontSize: 15,
    color: "#888",
    marginBottom: 16
  },
  meta: {
    display: "flex",
    gap: 16,
    marginBottom: 16,
    alignItems: "center"
  },
  rating: {
    fontSize: 14,
    fontWeight: 600,
    color: "#111"
  },
  reviewCount: {
    fontSize: 13,
    color: "#aaa"
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 1.7,
    maxWidth: 480
  },
  content: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "40px 40px"
  },
  sectionHeader: {
    marginBottom: 20
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#111"
  },
  empty: {
    color: "#aaa",
    fontSize: 14,
    padding: "40px 0"
  },
  reviewList: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginTop: 24
  },
  review: {
    padding: "20px 24px",
    border: "1px solid #f0f0f0",
    borderRadius: 12,
    background: "#fff"
  },
  reviewTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  stars: {
    fontSize: 16,
    letterSpacing: 2
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: 500,
    padding: "4px 10px",
    borderRadius: 20
  },
  reviewContent: {
    fontSize: 14,
    color: "#444",
    lineHeight: 1.7,
    marginBottom: 10
  },
  reviewDate: {
    fontSize: 12,
    color: "#bbb"
  },
  deleteReview: {
    background: "none",
    border: "none",
    color: "#ccc",
    fontSize: 13,
    cursor: "pointer",
    fontWeight: 600,
    padding: "2px 6px",
    borderRadius: 4
  },
  editLabel: {
    display: "block",
    fontSize: 12,
    color: "#999",
    marginBottom: 6,
    fontWeight: 500
  },
  editInput: {
    display: "block",
    width: "100%",
    padding: "10px 14px",
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 8,
    color: "#111",
    fontSize: 14,
    marginBottom: 12,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit"
  },
  editBtn: {
    background: "none",
    border: "1px solid #eee",
    color: "#999",
    fontSize: 12,
    cursor: "pointer",
    fontWeight: 500,
    padding: "3px 10px",
    borderRadius: 6
  },
  saveBtn: {
    padding: "8px 20px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer"
  },
  cancelBtn: {
    padding: "8px 20px",
    background: "#f0f0f0",
    color: "#111",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer"
  }, 
  reviewed: {
    fontSize: 13,
    color: "#aaa",
    marginBottom: 24,
    fontStyle: "italic"
  }
}