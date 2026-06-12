// src/components/Recommendations.jsx

import { useState, useEffect } from "react"
import api from "../api"

const ANILIST_URL = "https://graphql.anilist.co"

// query AniList for popular webtoons in a specific genre
const GENRE_QUERY = `
  query ($genre: String) {
    Page(page: 1, perPage: 10) {
      media(genre: $genre, type: MANGA, sort: POPULARITY_DESC) {
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

async function fetchByGenre(genre) {
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: GENRE_QUERY,
      variables: { genre }
    })
  })
  const data = await res.json()
  return data.data?.Page?.media || []
}

export default function Recommendations({ webtoons, reviews }) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState({})

  // rebuild recommendations whenever shelf or reviews change
  useEffect(() => {
    if (webtoons.length === 0) return
    buildRecommendations()
  }, [webtoons, reviews])

  async function buildRecommendations() {
    setLoading(true)

    // build a lookup of webtoon_id → review
    const reviewByWebtoon = {}
    reviews.forEach(r => { reviewByWebtoon[r.webtoon_id] = r })

    // collect genres from highly rated webtoons (4+ stars)
    const highRatedGenres = webtoons
      .filter(w => reviewByWebtoon[w.id]?.rating >= 4)
      .flatMap(w => w.genre ? w.genre.split(",").map(g => g.trim()) : [])

    // collect genres from currently reading webtoons
    const readingGenres = webtoons
      .filter(w => reviewByWebtoon[w.id]?.status === "reading")
      .flatMap(w => w.genre ? w.genre.split(",").map(g => g.trim()) : [])

    // combine and deduplicate genres, prioritizing high rated
    const allGenres = [...new Set([...highRatedGenres, ...readingGenres])]

    if (allGenres.length === 0) {
      setLoading(false)
      return
    }

    // build a set of titles already on the shelf for filtering
    const shelfTitles = new Set(
      webtoons.map(w => w.title.toLowerCase())
    )

    // fetch recommendations for up to 3 genres
    const genresToFetch = allGenres.slice(0, 3)
    const results = await Promise.all(genresToFetch.map(fetchByGenre))

    // flatten, deduplicate by id, and filter out shelf titles
    const seen = new Set()
    const filtered = results
      .flat()
      .filter(media => {
        const title = (media.title.english || media.title.romaji).toLowerCase()
        if (seen.has(media.id)) return false
        if (shelfTitles.has(title)) return false
        seen.add(media.id)
        return true
      })
      .slice(0, 12)  // cap at 12 recommendations

    setRecommendations(filtered)
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
  }

  // don't show the section if there's nothing to recommend
  if (!loading && recommendations.length === 0) return null

  return (
    <div style={styles.container}>
      <div style={styles.sectionHeader}>
        <span style={styles.sectionLabel}>recommended for you</span>
        <span style={styles.sectionSub}>based on your shelf</span>
      </div>

      {loading ? (
        <p style={styles.loading}>finding recommendations...</p>
      ) : (
        <div style={styles.row}>
          {recommendations.map(media => {
            const title = media.title.english || media.title.romaji
            const isAdded = added[media.id]

            return (
              <div key={media.id} style={styles.card}>
                <div style={styles.coverWrap}>
                  <img
                    src={media.coverImage.large}
                    alt={title}
                    style={styles.cover}
                  />
                  {/* add button overlaid on cover */}
                  <button
                    style={{
                      ...styles.addBtn,
                      background: isAdded ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.75)",
                      cursor: isAdded ? "default" : "pointer"
                    }}
                    onClick={() => !isAdded && handleAdd(media)}
                  >
                    {isAdded ? "added ✓" : "+ add"}
                  </button>
                </div>

                <div style={styles.info}>
                  <p style={styles.title}>{title}</p>
                  {media.genres[0] && (
                    <p style={styles.genre}>{media.genres[0]}</p>
                  )}
                  {media.averageScore && (
                    <p style={styles.score}>
                      ⭐ {(media.averageScore / 10).toFixed(1)}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    marginTop: 56
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#111"
  },
  sectionSub: {
    fontSize: 13,
    color: "#aaa"
  },
  loading: {
    fontSize: 13,
    color: "#aaa",
    padding: "20px 0"
  },
  // horizontal scrolling row instead of a grid
  // so it doesn't take up too much vertical space
  row: {
    display: "flex",
    gap: 16,
    overflowX: "auto",
    paddingBottom: 12,
    // hide scrollbar on webkit browsers
    scrollbarWidth: "none"
  },
  card: {
    flexShrink: 0,   // prevents cards from shrinking in the flex row
    width: 140
  },
  coverWrap: {
    position: "relative",
    marginBottom: 10
  },
  cover: {
    width: 140,
    height: 196,
    objectFit: "cover",
    borderRadius: 8,
    display: "block",
    border: "1px solid #f0f0f0"
  },
  addBtn: {
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8,
    padding: "6px 0",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "inherit"
  },
  info: {
    padding: "0 2px"
  },
  title: {
    fontSize: 12,
    fontWeight: 600,
    color: "#111",
    marginBottom: 3,
    lineHeight: 1.4,
    // clamp to 2 lines max
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden"
  },
  genre: {
    fontSize: 11,
    color: "#2563EB",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    marginBottom: 2
  },
  score: {
    fontSize: 11,
    color: "#999"
  }
}