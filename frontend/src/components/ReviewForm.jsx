// src/components/ReviewForm.jsx

import { useState } from "react"
import api from "../api"

export default function ReviewForm({ webtoonId, onSuccess }) {
  const [form, setForm] = useState({
    rating: 5,
    content: "",
    status: "reading"
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    await api.post("/reviews/", {
      ...form,
      webtoon_id: webtoonId,
      rating: parseInt(form.rating)  // ensure rating is a number not a string
    })
    onSuccess()
    // reset the form after submitting
    setForm({ rating: 5, content: "", status: "reading" })
  }

  return (
    <div style={styles.form}>
      <h3 style={styles.heading}>write a review</h3>

      {/* star rating — a simple dropdown for now */}
      <label style={styles.label}>rating</label>
      <select name="rating" value={form.rating} onChange={handleChange} style={styles.input}>
        {[5, 4, 3, 2, 1].map(n => (
          <option key={n} value={n}>{"⭐".repeat(n)} ({n})</option>
        ))}
      </select>

      {/* reading status */}
      <label style={styles.label}>status</label>
      <select name="status" value={form.status} onChange={handleChange} style={styles.input}>
        <option value="reading">reading</option>
        <option value="completed">completed</option>
        <option value="dropped">dropped</option>
      </select>

      {/* written review — optional */}
      <label style={styles.label}>thoughts (optional)</label>
      <textarea
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="what did you think?"
        style={{ ...styles.input, height: 80, resize: "vertical" }}
      />

      <button style={styles.button} onClick={handleSubmit}>submit</button>
    </div>
  )
}

const styles = {
  form: {
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: 10,
    padding: 20,
    marginBottom: 24
  },
  heading: {
    fontSize: 15,
    fontWeight: 600,
    marginBottom: 14,
    color: "#f0f0f0"
  },
  label: {
    display: "block",
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: "0.06em"
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px 14px",
    background: "#111",
    border: "1px solid #2a2a2a",
    borderRadius: 8,
    color: "#f0f0f0",
    fontSize: 14,
    marginBottom: 14,
    outline: "none",
    boxSizing: "border-box"
  },
  button: {
    padding: "10px 24px",
    background: "#f0f0f0",
    color: "#0f0f0f",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer"
  }
}