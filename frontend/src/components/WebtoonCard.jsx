// src/components/WebtoonCard.jsx
import { useState } from "react"
import api from "../api"
import TierBadge from "./TierBadge"

const STATUS_COLORS = {
  reading:   { bg: "rgba(15,110,86,0.5)",   border: "rgba(93,202,165,0.3)",   badge: "rgba(15,110,86,0.85)",   text: "#9FE1CB" },
  completed: { bg: "rgba(83,74,183,0.5)",   border: "rgba(175,169,236,0.3)", badge: "rgba(83,74,183,0.85)",   text: "#CECBF6" },
  dropped:   { bg: "rgba(153,53,86,0.5)",   border: "rgba(237,147,177,0.3)", badge: "rgba(153,53,86,0.85)",   text: "#F4C0D1" },
  default:   { bg: "rgba(40,40,60,0.5)",    border: "rgba(255,255,255,0.1)", badge: "rgba(40,40,60,0.85)",    text: "#aaa" }
}

export default function WebtoonCard({ webtoon, review, onClick, onDeleted }) {
  const [hovered, setHovered] = useState(false)
  const sc = STATUS_COLORS[review?.status] || STATUS_COLORS.default

  async function handleDelete(e) {
    e.stopPropagation()
    if (!confirm(`Delete "${webtoon.title}"?`)) return
    await api.delete(`/webtoons/${webtoon.id}`)
    onDeleted()
  }

  return (
    <div
      className="glass"
      style={{
        ...styles.card,
        border: `0.5px solid ${sc.border}`,
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? `0 12px 32px rgba(0,0,0,0.2)` : "none"
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* delete button */}
      {hovered && (
        <button style={styles.deleteBtn} onClick={handleDelete}>✕</button>
      )}

      {/* cover / placeholder */}
      {webtoon.cover_url ? (
        <img src={webtoon.cover_url} alt={webtoon.title} style={styles.cover} />
      ) : (
        <div style={{ ...styles.placeholder, background: sc.bg }}>
          <span style={{ fontSize: 32, opacity: 0.3 }}>📖</span>
        </div>
      )}

      {/* status badge */}
      {review && (
        <div style={{ ...styles.statusBadge, background: sc.badge, color: sc.text }}>
          {review.status}
        </div>
      )}

      <div style={styles.info}>
        <div style={styles.titleRow}>
          <p style={styles.title}>{webtoon.title}</p>
          {review && <TierBadge value={review.rating} size="sm" />}
        </div>
        <p style={styles.author}>{webtoon.author}</p>
        <div style={styles.bottom}>
          {webtoon.genre && (
            <span style={styles.genre}>{webtoon.genre.split(",")[0]}</span>
          )}
          {review?.current_chapter > 0 && (
            <span style={styles.chapter}>ch. {review.current_chapter}</span>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  card: {
    borderRadius: 12,
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
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
    width: 26,
    height: 26,
    fontSize: 11,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    fontWeight: 600
  },
  cover: {
    width: "100%",
    height: 240,
    objectFit: "cover",
    display: "block"
  },
  placeholder: {
    width: "100%",
    height: 240,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  statusBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    fontSize: 9,
    fontWeight: 500,
    padding: "2px 8px",
    borderRadius: 4,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    zIndex: 1
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    marginBottom: 2
  },
  title: {
    fontSize: 13,
    fontWeight: 500,
    color: "var(--text-primary)",
    lineHeight: 1.4,
    letterSpacing: "-0.01em",
    flex: 1,
    minWidth: 0,           // allows text truncation
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  info: {
    padding: "10px 12px 14px"
  },
  title: {
    fontSize: 13,
    fontWeight: 500,
    color: "var(--text-primary)",
    marginBottom: 2,
    lineHeight: 1.4,
    letterSpacing: "-0.01em"
  },
  author: {
    fontSize: 11,
    color: "var(--text-muted)",
    marginBottom: 6
  },
  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  genre: {
    fontSize: 10,
    color: "var(--accent)",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.04em"
  },
  chapter: {
    fontSize: 10,
    color: "var(--text-muted)"
  }
}