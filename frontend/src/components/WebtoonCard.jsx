// src/components/WebtoonCard.jsx

export default function WebtoonCard({ webtoon, onClick }) {
  return (
    <div style={styles.card} onClick={onClick}>
      {/* show cover image if available, otherwise a placeholder */}
      {webtoon.cover_url ? (
        <img src={webtoon.cover_url} alt={webtoon.title} style={styles.cover} />
      ) : (
        <div style={styles.placeholder}>no cover</div>
      )}

      <div style={styles.info}>
        <p style={styles.title}>{webtoon.title}</p>
        <p style={styles.author}>{webtoon.author}</p>
        {webtoon.genre && <p style={styles.genre}>{webtoon.genre}</p>}
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: 10,
    overflow: "hidden",
    cursor: "pointer",
    transition: "border-color 0.2s"
  },
  cover: {
    width: "100%",
    height: 260,
    objectFit: "cover"
  },
  placeholder: {
    width: "100%",
    height: 260,
    background: "#2a2a2a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#555",
    fontSize: 13
  },
  info: {
    padding: "12px 14px"
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 4,
    color: "#f0f0f0"
  },
  author: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4
  },
  genre: {
    fontSize: 11,
    color: "#555"
  }
}