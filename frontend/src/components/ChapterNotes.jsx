// src/components/ChapterNotes.jsx
import { useState, useEffect } from "react"
import api from "../api"

export default function ChapterNotes({ webtoonId }) {
  const [notes, setNotes] = useState([])
  const [chapter, setChapter] = useState("")
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotes()
  }, [webtoonId])

  async function fetchNotes() {
    const res = await api.get(`/chapter-notes/?webtoon_id=${webtoonId}`)
    setNotes(res.data)
    setLoading(false)
  }

  async function handleAdd() {
    if (!chapter || !note.trim()) return

    await api.post("/chapter-notes/", {
      webtoon_id: webtoonId,
      chapter: parseInt(chapter),
      note: note.trim()
    })

    setChapter("")
    setNote("")
    fetchNotes()
  }

  async function handleDelete(noteId) {
    await api.delete(`/chapter-notes/${noteId}`)
    fetchNotes()
  }

  return (
    <div style={styles.container}>
      <p style={styles.sectionLabel}>chapter notes</p>

      {/* add note form */}
      <div style={styles.form}>
        <input
          type="number"
          min="0"
          placeholder="ch."
          value={chapter}
          onChange={e => setChapter(e.target.value)}
          style={styles.chapterInput}
        />
        <input
          type="text"
          placeholder="what happened? what did you think?"
          value={note}
          onChange={e => setNote(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
          style={styles.noteInput}
        />
        <button style={styles.addBtn} onClick={handleAdd}>add</button>
      </div>

      {/* notes timeline */}
      {loading ? (
        <p style={styles.empty}>loading notes...</p>
      ) : notes.length === 0 ? (
        <p style={styles.empty}>no notes yet — jot down thoughts as you read each chapter</p>
      ) : (
        <div style={styles.timeline}>
          {notes.map(n => (
            <div key={n.id} style={styles.noteRow}>
              <div style={styles.chapterBadge}>ch. {n.chapter}</div>
              <div style={styles.noteContent}>
                <p style={styles.noteText}>{n.note}</p>
                <p style={styles.noteDate}>
                  {new Date(n.created_at).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric"
                  })}
                </p>
              </div>
              <button style={styles.deleteBtn} onClick={() => handleDelete(n.id)}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { marginTop: 40 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#111",
    marginBottom: 16
  },
  form: {
    display: "flex",
    gap: 8,
    marginBottom: 20
  },
  chapterInput: {
    width: 64,
    padding: "10px 12px",
    background: "#f7f7f7",
    border: "1px solid #eee",
    borderRadius: 8,
    color: "#111",
    fontSize: 13,
    outline: "none",
    fontFamily: "inherit",
    flexShrink: 0
  },
  noteInput: {
    flex: 1,
    padding: "10px 14px",
    background: "#f7f7f7",
    border: "1px solid #eee",
    borderRadius: 8,
    color: "#111",
    fontSize: 13,
    outline: "none",
    fontFamily: "inherit"
  },
  addBtn: {
    padding: "10px 18px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    flexShrink: 0
  },
  timeline: {
    display: "flex",
    flexDirection: "column",
    gap: 10
  },
  noteRow: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    padding: "12px 0",
    borderBottom: "1px solid #f5f5f5"
  },
  chapterBadge: {
    fontSize: 12,
    fontWeight: 600,
    color: "#2563EB",
    background: "#EFF4FF",
    padding: "4px 10px",
    borderRadius: 6,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  noteContent: {
    flex: 1
  },
  noteText: {
    fontSize: 13,
    color: "#333",
    lineHeight: 1.6,
    marginBottom: 4
  },
  noteDate: {
    fontSize: 11,
    color: "#bbb"
  },
  deleteBtn: {
    background: "none",
    border: "none",
    color: "#ccc",
    fontSize: 12,
    cursor: "pointer",
    fontWeight: 600,
    flexShrink: 0
  },
  empty: {
    fontSize: 13,
    color: "#aaa",
    padding: "20px 0"
  }
}