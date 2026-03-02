<template>
  <div class="timeline-album">
    <!-- Header -->
    <div class="ta-header">
      <h3 class="ta-title">{{ $t('timeline.title') }}</h3>
      <p class="ta-subtitle">{{ $t('timeline.subtitle') }}</p>
    </div>

    <!-- Body: Timeline + Album -->
    <div class="ta-body">
      <!-- Left: Vertical Timeline -->
      <div class="ta-timeline">
        <div
          v-for="(node, idx) in timelineNodes"
          :key="node.year"
          class="ta-node"
          :class="{ active: selectedIdx === idx }"
          @click="selectNode(idx)"
        >
          <div class="node-track">
            <div class="node-dot">
              <span class="node-ripple"></span>
            </div>
            <div class="node-line" v-if="idx < timelineNodes.length - 1"></div>
          </div>
          <div class="node-text">
            <span class="node-year">{{ node.year }}</span>
            <span class="node-title">{{ node.title }}</span>
          </div>
        </div>
      </div>

      <!-- Right: 3D Album Panel -->
      <Transition name="album-appear">
        <div v-if="selectedNode" class="ta-album-panel">
          <!-- Album Header -->
          <div class="album-label">
            <span class="album-year-tag">{{ selectedNode.year }}</span>
            <span class="album-name">{{ selectedNode.title }}</span>
            <button class="album-close-btn" @click="closeAlbum">✕</button>
          </div>

          <!-- 3D Carousel -->
          <div
            class="carousel-scene"
            ref="sceneRef"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointerleave="onPointerUp"
          >
            <div class="carousel-stage" :style="stageStyle">
              <div
                v-for="(card, i) in displayCards"
                :key="i"
                class="carousel-card"
                :style="cardStyle(i, displayCards.length)"
              >
                <div class="card-inner">
                  <!-- ─── 视频卡片 ─── -->
                  <template v-if="card.type === 'video'">
                    <video
                      v-if="card.src"
                      :src="card.src"
                      :poster="card.poster || ''"
                      controls
                      preload="none"
                    ></video>
                    <div v-else class="card-placeholder">
                      <div class="ph-icon">▶</div>
                      <p class="ph-label">{{ $t('timeline.placeholder.video') }}</p>
                      <p class="ph-hint">media[{{ i }}]</p>
                    </div>
                  </template>

                  <!-- ─── 图片卡片 ─── -->
                  <template v-else>
                    <img v-if="card.src" :src="card.src" :alt="card.alt || ''" />
                    <div v-else class="card-placeholder">
                      <div class="ph-icon ph-icon--img"></div>
                      <p class="ph-label">{{ $t('timeline.placeholder.image') }}</p>
                      <p class="ph-hint">media[{{ i }}]</p>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div class="carousel-controls">
            <button class="nav-btn" @click="rotateBy(-1)">‹</button>
            <span class="nav-hint">{{ $t('timeline.dragHint') }}</span>
            <button class="nav-btn" @click="rotateBy(1)">›</button>
          </div>
        </div>
      </Transition>

      <!-- Empty Hint when nothing selected -->
      <Transition name="hint-fade">
        <div v-if="!selectedNode" class="ta-empty-hint">
          <div class="hint-arrow">←</div>
          <p>{{ $t('timeline.emptyHint') }}</p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// ╔══════════════════════════════════════════════════════════════╗
// ║  时间轴数据 — 在此处填入您的个人历史节点                        ║
// ║  media 数组格式：                                             ║
// ║    图片: { type: 'image', src: '/your/img.jpg', alt: '描述' } ║
// ║    视频: { type: 'video', src: '/your/video.mp4',            ║
// ║             poster: '/your/poster.jpg' }                     ║
// ╚══════════════════════════════════════════════════════════════╝
const nodeList = [
  {
    year: '2025',
    media: [
      // { type: 'image', src: '/images/2025/photo1.jpg', alt: '2025 精彩瞬间' },
      // { type: 'video', src: '/videos/2025/clip.mp4', poster: '/images/2025/poster.jpg' },
    ]
  },
  {
    year: '2024',
    media: [
      // { type: 'image', src: '/images/2024/photo1.jpg', alt: '2024 精彩瞬间' },
    ]
  },
  { year: '2023', media: [] },
  { year: '2022', media: [] },
  { year: '2021', media: [] },
  { year: '2020', media: [] }
]

// 节点标题跟随语言动态更新
const timelineNodes = computed(() =>
  nodeList.map(n => ({ ...n, title: t(`timeline.nodes.${n.year}`) }))
)

const PLACEHOLDER_COUNT = 5
const CARD_W = 130

const selectedIdx = ref(null)
const rotationAngle = ref(0)
const sceneRef = ref(null)

let rafId = null
let isDragging = false
let pointerStartX = 0
let angleOnDragStart = 0

const selectedNode = computed(() =>
  selectedIdx.value !== null ? timelineNodes.value[selectedIdx.value] : null
)

const displayCards = computed(() => {
  if (!selectedNode.value) return []
  const m = selectedNode.value.media
  if (m && m.length) return m
  return Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => ({
    type: 'image',
    src: '',
    alt: `slot-${i}`
  }))
})

const stageStyle = computed(() => ({
  transform: `rotateY(${rotationAngle.value}deg)`
}))

function cardStyle(i, count) {
  const angle = (360 / count) * i
  const r = Math.round((CARD_W / 2) / Math.tan(Math.PI / count))
  return {
    transform: `rotateY(${angle}deg) translateZ(${r}px)`
  }
}

function selectNode(idx) {
  if (selectedIdx.value === idx) {
    closeAlbum()
    return
  }
  selectedIdx.value = idx
  rotationAngle.value = 0
  startAutoRotate()
}

function closeAlbum() {
  selectedIdx.value = null
  stopAutoRotate()
}

function rotateBy(dir) {
  const count = displayCards.value.length
  if (!count) return
  stopAutoRotate()
  rotationAngle.value -= dir * (360 / count)
  setTimeout(startAutoRotate, 2000)
}

function startAutoRotate() {
  stopAutoRotate()
  let last = null
  function tick(ts) {
    if (last !== null) {
      rotationAngle.value -= (ts - last) * 0.008
    }
    last = ts
    rafId = requestAnimationFrame(tick)
  }
  rafId = requestAnimationFrame(tick)
}

function stopAutoRotate() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

function onPointerDown(e) {
  isDragging = true
  pointerStartX = e.clientX
  angleOnDragStart = rotationAngle.value
  stopAutoRotate()
  e.currentTarget.setPointerCapture(e.pointerId)
}

function onPointerMove(e) {
  if (!isDragging) return
  rotationAngle.value = angleOnDragStart + (e.clientX - pointerStartX) * 0.35
}

function onPointerUp() {
  if (!isDragging) return
  isDragging = false
  startAutoRotate()
}

onBeforeUnmount(stopAutoRotate)
</script>

<style scoped>
.timeline-album {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 32px 0 24px 28px;
  color: var(--apple-text);
  font-family: var(--font-apple);
  box-sizing: border-box;
}

/* ── Header ── */
.ta-header {
  margin-bottom: 28px;
  flex-shrink: 0;
}

.ta-title {
  font-size: clamp(15px, 1.6vw, 19px);
  font-weight: 600;
  letter-spacing: 0.04em;
  margin: 0 0 5px;
  background: linear-gradient(135deg, #f5f5f7 0%, #2997ff 70%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.ta-subtitle {
  font-size: 11px;
  color: var(--apple-text-secondary);
  margin: 0;
  letter-spacing: 0.05em;
  opacity: 0.7;
}

/* ── Body ── */
.ta-body {
  flex: 1;
  display: flex;
  gap: 20px;
  min-height: 0;
  overflow: hidden;
}

/* ── Timeline ── */
.ta-timeline {
  display: flex;
  flex-direction: column;
  min-width: 144px;
  max-width: 154px;
  overflow-y: auto;
  flex-shrink: 0;
  /* padding 为 node-ripple 波纹动画（scale 2.2 时各方向扩展约 24px）留出空间，
     避免被 overflow-y:auto 裁剪（强制 overflow-x 也非 visible） */
  padding: 20px 4px 0 24px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}

.ta-timeline::-webkit-scrollbar {
  width: 3px;
}
.ta-timeline::-webkit-scrollbar-track {
  background: transparent;
}
.ta-timeline::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.ta-node {
  display: flex;
  gap: 12px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;
  user-select: none;
}

.ta-node:hover .node-dot {
  border-color: #2997ff;
  background: rgba(41, 151, 255, 0.3);
}

.ta-node.active .node-dot {
  background: #2997ff;
  border-color: #2997ff;
  box-shadow: 0 0 14px rgba(41, 151, 255, 0.7);
}

.ta-node.active .node-year {
  color: #2997ff;
}

/* ── Node Track (dot + line) ── */
.node-track {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 14px;
}

.node-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.06);
  position: relative;
  flex-shrink: 0;
  transition: all 0.3s;
  margin-top: 5px;
}

.node-ripple {
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  border: 1.5px solid #2997ff;
  opacity: 0;
  pointer-events: none;
}

.ta-node.active .node-ripple {
  animation: node-pulse 1.6s ease-out infinite;
}

@keyframes node-pulse {
  0% {
    transform: scale(0.9);
    opacity: 0.9;
  }
  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}

.node-line {
  width: 1px;
  flex: 1;
  min-height: 24px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.18),
    rgba(255, 255, 255, 0.04)
  );
  margin: 4px 0;
}

/* ── Node Text ── */
.node-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 2px 0 22px;
}

.node-year {
  font-size: 14px;
  font-weight: 600;
  color: var(--apple-text);
  letter-spacing: 0.06em;
  transition: color 0.25s;
}

.node-title {
  font-size: 10px;
  color: var(--apple-text-secondary);
  letter-spacing: 0.03em;
  line-height: 1.4;
}

/* ── Album Panel ── */
.ta-album-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  min-width: 0;
}

.album-label {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.album-year-tag {
  background: linear-gradient(135deg, #0e4bba, #2997ff);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 20px;
  letter-spacing: 0.08em;
  flex-shrink: 0;
}

.album-name {
  font-size: 12px;
  color: var(--apple-text);
  letter-spacing: 0.02em;
  flex: 1;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.album-close-btn {
  background: none;
  border: none;
  color: var(--apple-text-secondary);
  font-size: 13px;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
  transition: color 0.2s, background 0.2s;
  flex-shrink: 0;
}

.album-close-btn:hover {
  color: var(--apple-text);
  background: rgba(255, 255, 255, 0.08);
}

/* ── 3D Carousel ── */
.carousel-scene {
  flex: 1;
  width: 100%;
  perspective: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  overflow: hidden;
  min-height: 0;
  touch-action: none;
  position: relative;
}

.carousel-scene:active {
  cursor: grabbing;
}

/* Fade edges for depth effect */
.carousel-scene::before,
.carousel-scene::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40px;
  z-index: 10;
  pointer-events: none;
}

.carousel-scene::before {
  left: 0;
  background: linear-gradient(
    to right,
    var(--apple-bg-hero) 0%,
    transparent 100%
  );
}

.carousel-scene::after {
  right: 0;
  background: linear-gradient(
    to left,
    var(--apple-bg-hero) 0%,
    transparent 100%
  );
}

.carousel-stage {
  position: relative;
  transform-style: preserve-3d;
  width: 130px;
  height: 170px;
}

.carousel-card {
  position: absolute;
  width: 130px;
  height: 170px;
  top: 0;
  left: 0;
  backface-visibility: hidden;
  border-radius: 14px;
  overflow: hidden;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.06);
  transition: box-shadow 0.3s;
}

.carousel-card:hover {
  box-shadow:
    0 8px 36px rgba(0, 0, 0, 0.7),
    0 0 0 1px rgba(41, 151, 255, 0.3);
}

.card-inner {
  width: 100%;
  height: 100%;
  background: #111;
}

.card-inner img,
.card-inner video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ── Placeholder Card ── */
.card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(41, 151, 255, 0.04) 100%
  );
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  color: var(--apple-text-secondary);
  position: relative;
  overflow: hidden;
}

/* Subtle shimmer on placeholder */
.card-placeholder::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255, 255, 255, 0.04) 50%,
    transparent 60%
  );
  background-size: 200% 100%;
  animation: shimmer 2.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
}

.ph-icon {
  font-size: 22px;
  opacity: 0.35;
  position: relative;
  z-index: 1;
}

.ph-icon--img {
  width: 28px;
  height: 28px;
  border: 2px solid currentColor;
  border-radius: 4px;
  opacity: 0.2;
  font-size: 0;
  position: relative;
}

.ph-icon--img::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.6;
}

.ph-label {
  font-size: 10px;
  margin: 0;
  opacity: 0.45;
  letter-spacing: 0.04em;
  position: relative;
  z-index: 1;
}

.ph-hint {
  font-size: 9px;
  font-family: 'SF Mono', 'Fira Code', monospace;
  opacity: 0.3;
  margin: 0;
  color: #2997ff;
  position: relative;
  z-index: 1;
}

/* ── Carousel Controls ── */
.carousel-controls {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
  padding-bottom: 4px;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--apple-text);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 17px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  line-height: 1;
}

.nav-btn:hover {
  background: rgba(41, 151, 255, 0.18);
  border-color: rgba(41, 151, 255, 0.4);
  transform: scale(1.08);
}

.nav-btn:active {
  transform: scale(0.94);
}

.nav-hint {
  font-size: 10px;
  color: var(--apple-text-secondary);
  opacity: 0.45;
  letter-spacing: 0.04em;
}

/* ── Empty Hint ── */
.ta-empty-hint {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--apple-text-secondary);
  opacity: 0.3;
  pointer-events: none;
}

.hint-arrow {
  font-size: 22px;
  animation: hint-bounce 1.6s ease-in-out infinite;
}

@keyframes hint-bounce {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-8px); }
}

.ta-empty-hint p {
  font-size: 12px;
  margin: 0;
  letter-spacing: 0.05em;
}

/* ── Transitions ── */
.album-appear-enter-active,
.album-appear-leave-active {
  transition:
    opacity 0.38s ease,
    transform 0.38s cubic-bezier(0.22, 1, 0.36, 1);
}

.album-appear-enter-from {
  opacity: 0;
  transform: translateX(18px) scale(0.97);
}

.album-appear-leave-to {
  opacity: 0;
  transform: translateX(18px) scale(0.97);
}

.hint-fade-enter-active,
.hint-fade-leave-active {
  transition: opacity 0.25s ease;
}

.hint-fade-enter-from,
.hint-fade-leave-to {
  opacity: 0;
}
</style>
