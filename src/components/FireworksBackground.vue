<template>
  <canvas ref="canvasRef"
    class="fireworks-background"
    aria-hidden="true"></canvas>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const canvasRef = ref(null)

let ctx = null
let rafId = null
let width = 0
let height = 0
let dpr = 1
let lastFrame = 0
let nextLaunchAt = 0
let reduceMotion = false
let isMobile = false
let launchTimers = []
const rockets = []
const sparks = []

const COLORS = [
  [255, 214, 120],
  [255, 124, 185],
  [120, 214, 255],
  [132, 255, 201],
  [196, 166, 255],
  [255, 246, 220]
]

function random (min, max) {
  return min + Math.random() * (max - min)
}

function pickColor () {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

function scheduleNextLaunch (now) {
  nextLaunchAt = now + random(isMobile ? 1520 : 1240, isMobile ? 2900 : 2360)
}

function resize () {
  const canvas = canvasRef.value
  if (!canvas) return

  dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)
  width = window.innerWidth
  height = window.innerHeight
  canvas.width = Math.floor(width * dpr)
  canvas.height = Math.floor(height * dpr)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  ctx = canvas.getContext('2d', { alpha: true })
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function launchRocket () {
  if (!width || !height) return

  const color = pickColor()
  const targetY = random(height * 0.12, height * 0.46)
  rockets.push({
    x: random(width * 0.12, width * 0.88),
    y: height + 24,
    vx: random(-0.28, 0.28),
    vy: random(-8.4, -6.6),
    targetY,
    color,
    trail: [],
    life: 1
  })
}

function burst (rocket) {
  const count = isMobile ? 56 : 78
  const baseColor = rocket.color
  const ringCount = Math.floor(count * 0.72)

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / ringCount + random(-0.08, 0.08)
    const speed = i < ringCount ? random(1.4, 4.1) : random(0.5, 2.4)
    const color = Math.random() > 0.24 ? baseColor : pickColor()
    sparks.push({
      x: rocket.x,
      y: rocket.y,
      px: rocket.x,
      py: rocket.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gravity: random(0.018, 0.034),
      friction: random(0.974, 0.988),
      color,
      alpha: random(0.78, 1),
      decay: random(0.008, 0.016),
      radius: random(1.05, 2.05),
      shimmer: random(0.5, 1.2)
    })
  }
}

function burstAt (x, y) {
  burst({
    x,
    y,
    color: pickColor()
  })
}

function drawRocket (rocket) {
  const [r, g, b] = rocket.color
  ctx.beginPath()
  ctx.moveTo(rocket.x, rocket.y)
  for (const point of rocket.trail) {
    ctx.lineTo(point.x, point.y)
  }
  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.34)`
  ctx.lineWidth = 1.2
  ctx.stroke()

  const glow = ctx.createRadialGradient(rocket.x, rocket.y, 0, rocket.x, rocket.y, 9)
  glow.addColorStop(0, `rgba(255, 255, 255, ${0.95 * rocket.life})`)
  glow.addColorStop(0.28, `rgba(${r}, ${g}, ${b}, ${0.62 * rocket.life})`)
  glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(rocket.x, rocket.y, 9, 0, Math.PI * 2)
  ctx.fill()
}

function drawSpark (spark) {
  const [r, g, b] = spark.color
  const glowAlpha = Math.max(0, spark.alpha)
  const tailScale = isMobile ? 9 : 11

  const tailX = spark.x - spark.vx * tailScale
  const tailY = spark.y - spark.vy * tailScale

  const pulse = 0.75 + Math.sin(performance.now() * 0.012 * spark.shimmer) * 0.25
  const glowSize = spark.radius * 4.2
  const glow = ctx.createRadialGradient(spark.x, spark.y, 0, spark.x, spark.y, glowSize)
  glow.addColorStop(0, `rgba(255, 255, 255, ${0.72 * glowAlpha * pulse})`)
  glow.addColorStop(0.32, `rgba(${r}, ${g}, ${b}, ${0.58 * glowAlpha})`)
  glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(spark.x, spark.y, glowSize, 0, Math.PI * 2)
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(tailX, tailY)
  ctx.lineTo(spark.x, spark.y)
  ctx.strokeStyle = `rgba(255, 255, 255, ${0.54 * glowAlpha})`
  ctx.lineWidth = Math.max(0.6, spark.radius * 0.5)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(tailX, tailY)
  ctx.lineTo(spark.x, spark.y)
  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.74 * glowAlpha})`
  ctx.lineWidth = Math.max(0.9, spark.radius * 0.9)
  ctx.stroke()
}

function tick (now) {
  if (!ctx) return

  const delta = Math.min(32, now - lastFrame || 16) / 16.67
  lastFrame = now

  ctx.clearRect(0, 0, width, height)
  ctx.globalCompositeOperation = 'lighter'

  if (now >= nextLaunchAt && rockets.length < (isMobile ? 2 : 3)) {
    launchRocket()
    scheduleNextLaunch(now)
  }

  for (let i = rockets.length - 1; i >= 0; i--) {
    const rocket = rockets[i]
    rocket.trail.unshift({ x: rocket.x, y: rocket.y })
    rocket.trail = rocket.trail.slice(0, 10)
    rocket.x += rocket.vx * delta
    rocket.y += rocket.vy * delta
    rocket.vy += 0.035 * delta
    rocket.life -= 0.0025 * delta
    drawRocket(rocket)

    if (rocket.y <= rocket.targetY || rocket.vy >= -1 || rocket.life <= 0) {
      burst(rocket)
      rockets.splice(i, 1)
    }
  }

  const maxSparks = isMobile ? 210 : 290
  if (sparks.length > maxSparks) {
    sparks.splice(0, sparks.length - maxSparks)
  }

  for (let i = sparks.length - 1; i >= 0; i--) {
    const spark = sparks[i]
    spark.px = spark.x
    spark.py = spark.y
    spark.vx *= spark.friction
    spark.vy = spark.vy * spark.friction + spark.gravity * delta
    spark.x += spark.vx * delta
    spark.y += spark.vy * delta
    spark.alpha -= spark.decay * delta
    drawSpark(spark)

    if (spark.alpha <= 0 || spark.y > height + 40) {
      sparks.splice(i, 1)
    }
  }

  ctx.globalCompositeOperation = 'source-over'
  rafId = requestAnimationFrame(tick)
}

function start () {
  if (reduceMotion || rafId !== null) return
  lastFrame = performance.now()
  scheduleNextLaunch(lastFrame - 1000)
  rafId = requestAnimationFrame(tick)
}

function stop () {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

function onVisibilityChange () {
  if (document.hidden) {
    stop()
  } else {
    start()
  }
}

onMounted(() => {
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  isMobile = window.matchMedia('(max-width: 680px)').matches
  resize()
  window.addEventListener('resize', resize, { passive: true })
  document.addEventListener('visibilitychange', onVisibilityChange)
  launchRocket()
  launchTimers = [
    setTimeout(() => burstAt(width * 0.72, height * 0.24), 1200)
  ]
  start()
})

onBeforeUnmount(() => {
  stop()
  launchTimers.forEach(window.clearTimeout)
  launchTimers = []
  window.removeEventListener('resize', resize)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<style scoped src="@/assets/styles/components/FireworksBackground.css"></style>
