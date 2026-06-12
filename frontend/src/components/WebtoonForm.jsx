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
    background: "#f7f7f7",
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
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 8,
    color: "#111",
    fontSize: 14,
    marginBottom: 10,
    outline: "none",
    boxSizing: "border-box"
  },
  button: {
    padding: "10px 24px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer"
  }
}