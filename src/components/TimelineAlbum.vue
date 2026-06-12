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
        <div v-for="(node, idx) in timelineNodes"
          :key="node.year"
          class="ta-node"
          :class="{ active: selectedIdx === idx }"
          @click="selectNode(idx)">
          <div class="node-track">
            <div class="node-dot">
              <span class="node-ripple"></span>
            </div>
            <div class="node-line"
              v-if="idx < timelineNodes.length - 1"></div>
          </div>
          <div class="node-text">
            <span class="node-year">{{ node.year }}</span>
            <span class="node-title">{{ node.title }}</span>
          </div>
        </div>
      </div>

      <!-- Right: 3D Album Panel -->
      <Transition name="album-appear">
        <div v-if="selectedNode"
          class="ta-album-panel">
          <!-- Album Header -->
          <div class="album-label">
            <span class="album-year-tag">{{ selectedNode.year }}</span>
            <span class="album-name">{{ selectedNode.title }}</span>
            <button class="album-close-btn"
              @click="closeAlbum">✕</button>
          </div>

          <!-- 3D Carousel -->
          <div class="carousel-scene"
            ref="sceneRef"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointerleave="onPointerUp">
            <div class="carousel-stage"
              :style="stageStyle">
              <div v-for="(card, i) in displayCards"
                :key="i"
                class="carousel-card"
                :data-card-idx="i"
                :style="cardStyle(i, displayCards.length)">
                <div class="card-inner">
                  <!-- ─── 视频卡片 ─── -->
                  <template v-if="card.type === 'video'">
                    <video v-if="card.src"
                      :src="card.src"
                      :poster="card.poster || ''"
                      controls
                      preload="none"></video>
                    <div v-else
                      class="card-placeholder">
                      <div class="ph-icon">▶</div>
                      <p class="ph-label">{{ $t('timeline.placeholder.video') }}</p>
                      <p class="ph-hint">media[{{ i }}]</p>
                    </div>
                  </template>

                  <!-- ─── 图片卡片 ─── -->
                  <template v-else>
                    <img v-if="card.src"
                      :src="card.src"
                      :alt="card.alt || ''"
                      loading="lazy"
                      decoding="async" />
                    <div v-else
                      class="card-placeholder">
                      <div class="ph-icon ph-icon--img"></div>
                      <p class="ph-label">{{ $t('timeline.placeholder.image') }}</p>
                      <p class="ph-hint">media[{{ i }}]</p>
                    </div>
                  </template>
                </div>
                <!-- 悬停放大提示 -->
                <div class="card-zoom-hint">⊕</div>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div class="carousel-controls">
            <button class="nav-btn"
              @click="rotateBy(-1)">‹</button>
            <span class="nav-hint">{{ $t('timeline.dragHint') }}</span>
            <button class="nav-btn"
              @click="rotateBy(1)">›</button>
          </div>
        </div>
      </Transition>

      <!-- Empty Hint when nothing selected -->
      <Transition name="hint-fade">
        <div v-if="!selectedNode"
          class="ta-empty-hint">
          <div class="hint-arrow">←</div>
          <p>{{ $t('timeline.emptyHint') }}</p>
        </div>
      </Transition>
    </div>
  </div>
  <MediaPreview :cards="displayCards"
    v-model="previewIdx" />
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocale } from '@/composables/useLocale.js'
import { api } from '@/api/index.js'
import MediaPreview from './MediaPreview.vue'

const { t } = useI18n()
const { locale } = useLocale()

const placeholderImages = [
  '/uploads/profile/page1.png',
  '/uploads/profile/page2.png',
  '/uploads/profile/page3.png',
  '/uploads/profile/page4.png',
  '/uploads/profile/page5.png',
  '/uploads/profile/page6.png',
]

const timelineNodes = ref([])

async function loadTimeline() {
  try {
    timelineNodes.value = await api.getTimeline(locale.value)
  } catch (e) {
    console.error('Failed to load timeline:', e)
  }
}

watch(locale, loadTimeline)

const PLACEHOLDER_COUNT = 5
const CARD_W = 130

const selectedIdx = ref(0)
const rotationAngle = ref(0)
const sceneRef = ref(null)

const previewIdx = ref(null)

function openPreview (idx) {
  previewIdx.value = idx
}

let rafId = null
let isDragging = false
let hasDragged = false
let pointerStartX = 0
let angleOnDragStart = 0
let pointerDownTarget = null

const selectedNode = computed(() =>
  selectedIdx.value !== null ? timelineNodes.value[selectedIdx.value] : null
)

const displayCards = computed(() => {
  if (!selectedNode.value) return []
  const m = selectedNode.value.media
  if (m && m.length) return m
  return Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => ({
    type: 'image',
    src: placeholderImages[i % placeholderImages.length],
    alt: `placeholder-${i}`
  }))
})

const stageStyle = computed(() => ({
  transform: `rotateY(${rotationAngle.value}deg)`
}))

function cardStyle (i, count) {
  const angle = (360 / count) * i
  const r = Math.round((CARD_W / 2) / Math.tan(Math.PI / count))
  return {
    transform: `rotateY(${angle}deg) translateZ(${r}px)`
  }
}

function selectNode (idx) {
  if (selectedIdx.value === idx) {
    closeAlbum()
    return
  }
  selectedIdx.value = idx
  rotationAngle.value = 0
  startAutoRotate()
}

function closeAlbum () {
  selectedIdx.value = null
  stopAutoRotate()
}

function rotateBy (dir) {
  const count = displayCards.value.length
  if (!count) return
  stopAutoRotate()
  rotationAngle.value -= dir * (360 / count)
  setTimeout(startAutoRotate, 2000)
}

function startAutoRotate () {
  stopAutoRotate()
  let last = null
  function tick (ts) {
    if (last !== null) {
      rotationAngle.value -= (ts - last) * 0.008
    }
    last = ts
    rafId = requestAnimationFrame(tick)
  }
  rafId = requestAnimationFrame(tick)
}

function stopAutoRotate () {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

function onPointerDown (e) {
  isDragging = true
  hasDragged = false
  pointerDownTarget = e.target
  pointerStartX = e.clientX
  angleOnDragStart = rotationAngle.value
  stopAutoRotate()
  e.currentTarget.setPointerCapture(e.pointerId)
}

function onPointerMove (e) {
  if (!isDragging) return
  if (Math.abs(e.clientX - pointerStartX) > 5) hasDragged = true
  rotationAngle.value = angleOnDragStart + (e.clientX - pointerStartX) * 0.35
}

function onPointerUp (e) {
  if (!isDragging) return
  isDragging = false
  startAutoRotate()
  if (!hasDragged && e.type === 'pointerup' && pointerDownTarget) {
    const cardEl = pointerDownTarget.closest('[data-card-idx]')
    if (cardEl) {
      const idx = parseInt(cardEl.dataset.cardIdx)
      if (!isNaN(idx)) openPreview(idx)
    }
  }
  pointerDownTarget = null
}

onMounted(async () => {
  await loadTimeline()
  startAutoRotate()
})
onBeforeUnmount(stopAutoRotate)
</script>

<style scoped src="@/assets/styles/components/TimelineAlbum.css"></style>
