// src/components/WebtoonForm.jsx

import { useState } from "react"
import api from "../api"

export default function WebtoonForm({ onSuccess }) {
  // form state — one field per input
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    cover_url: "",
    description: ""
  })

  // update the right field when any input changes
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    // basic validation
    if (!form.title || !form.author) {
      alert("Title and author are required")
      return
    }

    await api.post("/webtoons/", form)

    // tell the parent component the form succeeded
    onSuccess()
  }

  return (
    <div style={styles.form}>
      <h2 style={styles.heading}>add a webtoon</h2>
      {["title", "author", "genre", "cover_url", "description"].map(field => (
        <input
          key={field}
          name={field}
          placeholder={field.replace("_", " ")}
          value={form[field]}
          onChange={handleChange}
          style={styles.input}
        />
      ))}
      <button style={styles.button} onClick={handleSubmit}>add</button>
    </div>
  )
}

const styles = {
  form: {
    background: "var(--bg-card)",
    backdropFilter: "blur(16px)",
    border: "0.5px solid var(--border)",
    borderRadius: 12,
    padding: "24px 28px",
    marginBottom: 32
  },
  heading: {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#111",
    marginBottom: 16
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px 14px",
    background: "var(--bg-input)",
    border: "0.5px solid var(--border)",
    borderRadius: 8,
    color: "var(--text-primary)",
    fontSize: 14,
    marginBottom: 10,
    outline: "none",
    boxSizing: "border-box",
    backdropFilter: "blur(8px)"
  },
  button: {
    padding: "10px 24px",
    background: "var(--accent)",
      color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit"
  }
}