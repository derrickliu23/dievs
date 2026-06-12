// src/components/WebtoonSearch.jsx

import { useState, useEffect, useRef } from "react"
import api from "../api"

const ANILIST_URL = "https://graphql.anilist.co"

const SEARCH_QUERY = `
  query ($search: String) {
    Page(page: 1, perPage: 8) {
      media(search: $search, type: MANGA) {
        id
        title {
          english
          romaji
        }
        coverImage {
          large
        }
        genres
        description
        averageScore
        staff {
          edges {
            role
            node {
              name {
                full
              }
            }
          }
        }
      }
    }
  }
`

export default function WebtoonSearch({ onAdded }) {
  const [query, setQuery]       = useState("")
  const [results, setResults]   = useState([])
  const [loading, setLoading]   = useState(false)
  const [showDrop, setShowDrop] = useState(false)
  const [added, setAdded]       = useState({})

  // useRef stores the debounce timer between renders
  // unlike useState, changing a ref doesn't cause a re-render
  const debounceTimer = useRef(null)

  // containerRef lets us detect clicks outside the dropdown to close it
  const containerRef = useRef(null)

  // whenever query changes, set a 500ms timer to search
  // if the user types again before 500ms, clear the old timer and start fresh
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setShowDrop(false)
      return
    }

    // clear previous timer
    clearTimeout(debounceTimer.current)

    // set a new timer
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(query)
    }, 500)

    // cleanup: clear timer if component unmounts or query changes
    return () => clearTimeout(debounceTimer.current)
  }, [query])

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDrop(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function fetchSuggestions(search) {
    setLoading(true)
    const res = await fetch(ANILIST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: SEARCH_QUERY,
        variables: { search }
      })
    })
    const data = await res.json()
    setResults(data.data.Page.media)
    setShowDrop(true)
    setLoading(false)
  }

  async function handleAdd(media) {
    const authorEdge = media.staff.edges.find(e =>
      e.role.includes("Story") || e.role.includes("Art")
    )
    const author = authorEdge ? authorEdge.node.name.full : "Unknown"
    const description = media.description
      ? media.description.replace(/<[^>]+>/g, "").trim()
      : ""

    await api.post("/webtoons/", {
      title: media.title.english || media.title.romaji,
      author,
      genre: media.genres.slice(0, 3).join(", "),
      cover_url: media.coverImage.large,
      description
    })

    setAdded(prev => ({ ...prev, [media.id]: true }))
    onAdded()
  }

  return (
    // ref lets us detect outside clicks
    <div style={styles.container} ref={containerRef}>
      <div style={styles.inputWrapper}>
        <input
          style={styles.input}
          placeholder="search for a webtoon..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowDrop(true)}
        />

        {/* loading spinner — shows while fetching */}
        {loading && <span style={styles.spinner}>...</span>}

        {/* clear button — shows when there's text */}
        {query && !loading && (
          <button
            style={styles.clearInput}
            onClick={() => {
              setQuery("")
              setResults([])
              setShowDrop(false)
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* dropdown results */}
      {showDrop && results.length > 0 && (
        <div style={styles.dropdown}>
          {results.map(media => (
            <div key={media.id} style={styles.result}>
              <img
                src={media.coverImage.large}
                alt={media.title.english || media.title.romaji}
                style={styles.thumb}
              />

              <div style={styles.info}>
                <p style={styles.title}>
                  {media.title.english || media.title.romaji}
                </p>
                <p style={styles.genres}>{media.genres.slice(0, 3).join(", ")}</p>
                {media.averageScore && (
                  <p style={styles.score}>⭐ {(media.averageScore / 10).toFixed(1)}</p>
                )}
              </div>

              <button
                style={{
                  ...styles.addBtn,
                  background: added[media.id] ? "#f0f0f0" : "#111",
                  color: added[media.id] ? "#999" : "#fff",
                  cursor: added[media.id] ? "default" : "pointer"
                }}
                onClick={() => !added[media.id] && handleAdd(media)}
              >
                {added[media.id] ? "added" : "+ add"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    position: "relative",   // makes the dropdown position relative to this div
    marginBottom: 40
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  input: {
    width: "100%",
    padding: "12px 40px 12px 16px",  // right padding leaves room for clear button
    background: "#f7f7f7",
    border: "1px solid #eee",
    borderRadius: 10,
    color: "#111",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit"
  },
  spinner: {
    position: "absolute",
    right: 14,
    color: "#aaa",
    fontSize: 13,
    letterSpacing: 2
  },
  clearInput: {
    position: "absolute",
    right: 12,
    background: "none",
    border: "none",
    color: "#bbb",
    fontSize: 13,
    cursor: "pointer",
    fontWeight: 600,
    padding: 0
  },
  dropdown: {
    position: "absolute",   // floats over the page content below
    top: "calc(100% + 6px)",
    left: 0,
    right: 0,
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    zIndex: 100             // sits on top of everything else
  },
  result: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "10px 16px",
    borderBottom: "1px solid #f5f5f5",
    transition: "background 0.15s"
  },
  thumb: {
    width: 36,
    height: 50,
    objectFit: "cover",
    borderRadius: 4,
    flexShrink: 0
  },
  info: {
    flex: 1,
    minWidth: 0   // prevents text from overflowing flex container
  },
  title: {
    fontSize: 13,
    fontWeight: 600,
    color: "#111",
    marginBottom: 2,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"  // truncates long titles with ...
  },
  genres: {
    fontSize: 11,
    color: "#aaa",
    marginBottom: 1
  },
  score: {
    fontSize: 11,
    color: "#2563EB",
    fontWeight: 500
  },
  addBtn: {
    padding: "6px 14px",
    border: "none",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    flexShrink: 0
  }
}