// src/components/BackgroundArt.jsx
import { useEffect, useRef } from "react"

export default function BackgroundArt() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      draw()
    }

    function draw() {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const isDark = document.documentElement.getAttribute("data-theme") === "dark"
      const teal   = isDark ? "rgba(29,158,117," : "rgba(15,110,86,"
      const purple = isDark ? "rgba(83,74,183,"  : "rgba(83,74,183,"
      const amber  = isDark ? "rgba(186,117,23," : "rgba(186,117,23,"

      // --- glowing blobs ---
      const blobs = [
        { x: w * 0.1,  y: h * 0.15, r: 280, color: teal   + "0.18)" },
        { x: w * 0.85, y: h * 0.75, r: 320, color: purple + "0.13)" },
        { x: w * 0.75, y: h * 0.1,  r: 200, color: teal   + "0.12)" },
        { x: w * 0.15, y: h * 0.8,  r: 220, color: purple + "0.10)" },
        { x: w * 0.5,  y: h * 0.5,  r: 180, color: amber  + "0.06)" },
      ]
      blobs.forEach(b => {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        g.addColorStop(0, b.color)
        g.addColorStop(1, "transparent")
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fill()
      })

      // --- manga panel borders ---
      ctx.strokeStyle = teal + "0.12)"
      ctx.lineWidth = 0.8
      const panels = [
        [w * 0.02, h * 0.05, w * 0.22, h * 0.55],
        [w * 0.76, h * 0.42, w * 0.22, h * 0.55],
        [w * 0.4,  h * 0.75, w * 0.20, h * 0.22],
      ]
      panels.forEach(([x, y, pw, ph]) => {
        ctx.strokeStyle = teal + "0.10)"
        ctx.strokeRect(x, y, pw, ph)
        ctx.strokeStyle = teal + "0.05)"
        ctx.strokeRect(x + 6, y + 6, pw - 12, ph - 12)
      })

      // --- speed lines (diagonal) ---
      ctx.strokeStyle = teal + "0.06)"
      ctx.lineWidth = 0.5
      for (let i = 0; i < 8; i++) {
        const yOff = h * 0.3 + i * 28
        ctx.beginPath()
        ctx.moveTo(0, yOff)
        ctx.lineTo(w, yOff - 20)
        ctx.stroke()
      }

      // --- action lines bursting from top right ---
      const origin = { x: w * 0.92, y: -50 }
      ctx.strokeStyle = teal + "0.06)"
      ctx.lineWidth = 0.4
      for (let i = 0; i < 12; i++) {
        const angle = Math.PI * 0.5 + (i / 12) * Math.PI * 0.6
        ctx.beginPath()
        ctx.moveTo(origin.x, origin.y)
        ctx.lineTo(origin.x + Math.cos(angle) * w, origin.y + Math.sin(angle) * h * 1.5)
        ctx.stroke()
      }

      // --- halftone dot clusters ---
      const clusters = [
        { x: w * 0.88, y: h * 0.08, color: teal   + "0.12)" },
        { x: w * 0.08, y: h * 0.65, color: purple + "0.10)" },
        { x: w * 0.55, y: h * 0.92, color: teal   + "0.08)" },
      ]
      clusters.forEach(({ x, y, color }) => {
        ctx.fillStyle = color
        for (let row = 0; row < 4; row++) {
          for (let col = 0; col < 4; col++) {
            const offset = row % 2 === 0 ? 0 : 6
            ctx.beginPath()
            ctx.arc(x + col * 12 + offset, y + row * 12, 2, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      })

      // --- speech bubble outlines ---
      const bubbles = [
        { x: w * 0.3, y: h * 0.06, w: 90, h: 40 },
        { x: w * 0.65, y: h * 0.85, w: 70, h: 32 },
      ]
      bubbles.forEach(b => {
        ctx.strokeStyle = teal + "0.12)"
        ctx.lineWidth = 0.6
        ctx.beginPath()
        ctx.roundRect(b.x, b.y, b.w, b.h, 10)
        ctx.stroke()
        // tail
        ctx.beginPath()
        ctx.moveTo(b.x + 20, b.y + b.h)
        ctx.lineTo(b.x + 30, b.y + b.h + 16)
        ctx.lineTo(b.x + 40, b.y + b.h)
        ctx.stroke()
      })
    }

    resize()
    window.addEventListener("resize", resize)

    // redraw when theme changes
    const observer = new MutationObserver(draw)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] })

    return () => {
      window.removeEventListener("resize", resize)
      observer.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0
      }}
    />
  )
}