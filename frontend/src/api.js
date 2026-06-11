// src/api.js

import axios from "axios"

// create a reusable axios instance pointed at our FastAPI backend
// this means we can write api.get("/webtoons") instead of
// axios.get("http://localhost:8000/webtoons") everywhere
const api = axios.create({
  baseURL: "http://localhost:8000"
})

export default api