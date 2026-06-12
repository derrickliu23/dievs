// src/components/ReviewForm.jsx
import { useState } from "react"
import api from "../api"
import { TIERS } from "../utils/tiers"

export default function ReviewForm({ webtoonId, onSuccess }) {
  const [form, setForm] = useState({
    rating: 5,    // default to A tier
    content: "",
    status: "reading"
  })

  async function handleSubmit() {
    await api.post("/reviews/", {
      ...form,
      webtoon_id: webtoonId,
      rating: parseInt(form.rating)
    })
    onSuccess()
    setForm({ rating: 5, content: "", status: "reading" })
  }

  return (
    <div style={styles.form}>
      <h3 style={styles.heading}>write a review</h3>

      {/* tier picker */}
      <label style={styles.label}>tier</label>
      <div style={styles.tierRow}>
        {TIERS.map(tier => (
          <button
            key={tier.value}
            onClick={() => setForm({ ...form, rating: tier.value })}
            style={{
              ...styles.tierBtn,
              background: tier.color,
              border: form.rating === tier.value
                ? `2px solid ${tier.text}`
                : `0.5px solid ${tier.border}`,
              color: tier.text,
              transform: form.rating === tier.value ? "scale(1.1)" : "scale(1)"
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 600 }}>{tier.label}</span>
            <span style={{ fontSize: 10, opacity: 0.8 }}>{tier.description}</span>
          </button>
        ))}
      </div>

      {/* status */}
      <label style={styles.label}>status</label>
      <select
        name="status"
        value={form.status}
        onChange={e => setForm({ ...form, status: e.target.value })}
        style={styles.input}
      >
        <option value="reading">reading</option>
        <option value="completed">completed</option>
        <option value="dropped">dropped</option>
      </select>

      {/* thoughts */}
      <label style={styles.label}>thoughts (optional)</label>
      <textarea
        value={form.content}
        onChange={e => setForm({ ...form, content: e.target.value })}
        placeholder="what did you think?"
        style={{ ...styles.input, height: 80, resize: "vertical" }}
      />

      <button style={styles.button} onClick={handleSubmit}>submit</button>
    </div>
  )
}

const styles = {
  form: {
    background: "#f7f7f7",
    borderRadius: 12,
    padding: "24px 28px",
    marginBottom: 8
  },
  heading: {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#111",
    marginBottom: 16
  },
  label: {
    display: "block",
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
    fontWeight: 500
  },
  tierRow: {
    display: "flex",
    gap: 8,
    marginBottom: 16,
    flexWrap: "wrap"
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
    fontFamily: "inherit"
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px 14px",
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 8,
    color: "#111",
    fontSize: 14,
    marginBottom: 14,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit"
  },
  button: {
    padding: "10px 24px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit"
  }
}