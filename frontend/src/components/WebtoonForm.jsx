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
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: 10,
    padding: 24,
    marginBottom: 32
  },
  heading: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 16,
    color: "#f0f0f0"
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
    marginBottom: 10,
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