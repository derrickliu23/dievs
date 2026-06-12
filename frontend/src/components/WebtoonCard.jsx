// src/components/WebtoonCard.jsx
import { useState } from "react"
import api from "../api"
import TierBadge from "./TierBadge"

export default function WebtoonCard({ webtoon, review, onClick, onDeleted }) {
  const [hovered, setHovered] = useState(false)

  async function handleDelete(e) {
    e.stopPropagation()
    if (!confirm(`Delete "${webtoon.title}"?`)) return
    await api.delete(`/webtoons/${webtoon.id}`)
    onDeleted()
  }

  return (
    <div
      style={{
        ...styles.card,
        boxShadow: hovered
          ? "0 8px 24px rgba(0,0,0,0.10)"
          : "0 2px 8px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-2px)" : "none"
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <button style={styles.deleteBtn} onClick={handleDelete}>✕</button>
      )}

      {/* status badge — shows reading status if reviewed */}
      {review && (
        <div style={{
          ...styles.statusBadge,
          background: review.status === "completed" ? "#111" :
                      review.status === "dropped" ? "#e5e5e5" : "#2563EB"
        }}>
          {review.status}
        </div>
      )}

      {webtoon.cover_url ? (
        <img src={webtoon.cover_url} alt={webtoon.title} style={styles.cover} />
      ) : (
        <div style={styles.placeholder}>
          <span style={styles.placeholderText}>no cover</span>
        </div>
      )}

      <div style={styles.info}>
        <p style={styles.title}>{webtoon.title}</p>
        <p style={styles.author}>{webtoon.author}</p>
        <div style={styles.bottom}>
          {webtoon.genre && (
            <p style={styles.genre}>{webtoon.genre.split(",")[0]}</p>
          )}
          {review && <TierBadge value={review.rating} size="sm" />}
        </div>
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    cursor: "pointer",
    transition: "box-shadow 0.2s, transform 0.2s",
    border: "1px solid #f0f0f0",
    position: "relative"
  },
  deleteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 28,
    height: 28,
    fontSize: 12,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    fontWeight: 600
  },
  statusBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    color: "#fff",
    fontSize: 10,
    fontWeight: 600,
    padding: "3px 8px",
    borderRadius: 20,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    zIndex: 1
  },
  cover: {
    width: "100%",
    height: 250,
    objectFit: "cover",
    display: "block"
  },
  placeholder: {
    width: "100%",
    height: 250,
    background: "#f5f5f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  placeholderText: {
    fontSize: 12,
    color: "#bbb",
    fontWeight: 500
  },
  info: {
    padding: "12px 14px 16px"
  },
  title: {
    fontSize: 13,
    fontWeight: 600,
    color: "#111",
    marginBottom: 3,
    lineHeight: 1.4,
    letterSpacing: "-0.01em"
  },
  author: {
    fontSize: 12,
    color: "#999",
    marginBottom: 6
  },
  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  genre: {
    fontSize: 11,
    color: "#2563EB",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.04em"
  },
  rating: {
    fontSize: 11,
    color: "#111",
    letterSpacing: 1
  }
}