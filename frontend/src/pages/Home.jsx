// src/pages/Home.jsx

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import WebtoonCard from "../components/WebtoonCard"
import WebtoonForm from "../components/WebtoonForm"

export default function Home() {
  // webtoons holds the list fetched from the backend
  const [webtoons, setWebtoons] = useState([])

  // controls whether the add webtoon form is visible
  const [showForm, setShowForm] = useState(false)

  const navigate = useNavigate()

  // fetch all webtoons when the page loads
  useEffect(() => {
    fetchWebtoons()
  }, [])

  async function fetchWebtoons() {
    const res = await api.get("/webtoons/")
    setWebtoons(res.data)
  }

  // called by WebtoonForm after a new webtoon is created
  // refreshes the list and hides the form
  function onWebtoonAdded() {
    fetchWebtoons()
    setShowForm(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>dievs</h1>
        <p style={styles.subtitle}>rate and review webtoons</p>
        <button style={styles.button} onClick={() => setShowForm(!showForm)}>
          {showForm ? "cancel" : "+ add webtoon"}
        </button>
      </div>

      {/* show the add form if showForm is true */}
      {showForm && <WebtoonForm onSuccess={onWebtoonAdded} />}

      {/* show a message if there are no webtoons yet */}
      {webtoons.length === 0 && !showForm && (
        <p style={styles.empty}>no webtoons yet — add one above</p>
      )}

      {/* render a card for each webtoon */}
      <div style={styles.grid}>
        {webtoons.map(webtoon => (
          <WebtoonCard
            key={webtoon.id}
            webtoon={webtoon}
            onClick={() => navigate(`/webtoon/${webtoon.id}`)}
          />
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#f0f0f0",
    minHeight: "100vh",
    background: "#0f0f0f"
  },
  header: {
    marginBottom: 40
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 4
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20
  },
  button: {
    padding: "10px 20px",
    background: "#f0f0f0",
    color: "#0f0f0f",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 20,
    marginTop: 20
  },
  empty: {
    color: "#888",
    fontSize: 14,
    marginTop: 40,
    textAlign: "center"
  }
}