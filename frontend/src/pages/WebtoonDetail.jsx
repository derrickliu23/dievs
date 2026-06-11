// src/pages/WebtoonDetail.jsx

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api"
import ReviewForm from "../components/ReviewForm"

export default function WebtoonDetail() {
  // useParams reads the :id from the URL e.g. /webtoon/3 → id = "3"
  const { id } = useParams()
  const navigate = useNavigate()

  const [webtoon, setWebtoon] = useState(null)
  const [reviews, setReviews] = useState([])

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

  function onReviewAdded() {
    fetchReviews()
  }

  if (!webtoon) return <p style={{ color: "#888", padding: 40 }}>loading...</p>

  // calculate average rating
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div style={styles.container}>
      <button style={styles.back} onClick={() => navigate("/")}>← back</button>

      <div style={styles.header}>
        {/* cover image */}
        {webtoon.cover_url ? (
          <img src={webtoon.cover_url} alt={webtoon.title} style={styles.cover} />
        ) : (
          <div style={styles.placeholder}>no cover</div>
        )}

        <div style={styles.info}>
          <h1 style={styles.title}>{webtoon.title}</h1>
          <p style={styles.author}>by {webtoon.author}</p>
          {webtoon.genre && <p style={styles.genre}>{webtoon.genre}</p>}
          {webtoon.description && <p style={styles.description}>{webtoon.description}</p>}
          {avgRating && <p style={styles.rating}>⭐ {avgRating} avg ({reviews.length} reviews)</p>}
        </div>
      </div>

      <h2 style={styles.sectionTitle}>reviews</h2>

      {/* add review form */}
      <ReviewForm webtoonId={parseInt(id)} onSuccess={onReviewAdded} />

      {/* list of reviews */}
      {reviews.length === 0 && (
        <p style={styles.empty}>no reviews yet — be the first!</p>
      )}

      {reviews.map(review => (
        <div key={review.id} style={styles.review}>
          <div style={styles.reviewHeader}>
            <span style={styles.stars}>{"⭐".repeat(review.rating)}</span>
            <span style={styles.status}>{review.status}</span>
          </div>
          {review.content && <p style={styles.reviewContent}>{review.content}</p>}
          <p style={styles.reviewDate}>
            {new Date(review.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: 800,
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#f0f0f0",
    minHeight: "100vh",
    background: "#0f0f0f"
  },
  back: {
    background: "none",
    border: "none",
    color: "#888",
    fontSize: 14,
    cursor: "pointer",
    marginBottom: 24,
    padding: 0
  },
  header: {
    display: "flex",
    gap: 24,
    marginBottom: 40
  },
  cover: {
    width: 160,
    height: 220,
    objectFit: "cover",
    borderRadius: 8,
    flexShrink: 0
  },
  placeholder: {
    width: 160,
    height: 220,
    background: "#2a2a2a",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#555",
    fontSize: 13,
    flexShrink: 0
  },
  info: {
    flex: 1
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 6
  },
  author: {
    fontSize: 14,
    color: "#888",
    marginBottom: 6
  },
  genre: {
    fontSize: 13,
    color: "#555",
    marginBottom: 10
  },
  description: {
    fontSize: 14,
    color: "#aaa",
    lineHeight: 1.6,
    marginBottom: 10
  },
  rating: {
    fontSize: 14,
    color: "#f0f0f0"
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 16
  },
  empty: {
    color: "#888",
    fontSize: 14,
    marginTop: 16
  },
  review: {
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8
  },
  stars: {
    fontSize: 14
  },
  status: {
    fontSize: 12,
    color: "#888",
    background: "#2a2a2a",
    padding: "2px 8px",
    borderRadius: 4
  },
  reviewContent: {
    fontSize: 14,
    color: "#ccc",
    lineHeight: 1.6,
    marginBottom: 8
  },
  reviewDate: {
    fontSize: 12,
    color: "#555"
  }
}