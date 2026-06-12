<template>
  <div ref="rootRef"
    class="project-timeline">
    <!-- 水平时间轴轨道 -->
    <div class="pt-rail">
      <template v-for="(project, idx) in projects" :key="project.key">
        <div
          class="pt-node-wrap"
          :class="{ active: selectedIdx === idx }"
          @click="selectProject(idx)"
        >
          <div class="pt-dot">
            <span class="pt-ripple"></span>
          </div>
          <div class="pt-label">{{ project.name }}</div>
        </div>
        <div class="pt-connector" v-if="idx < projects.length - 1"></div>
      </template>
    </div>

    <!-- 详情面板 -->
    <Transition name="panel-slide">
      <div v-if="selectedProject" class="pt-panel">
        <!-- 面板头部 -->
        <div class="pt-panel-header">
          <span class="pt-panel-tag">{{ selectedProject.name }}</span>
          <button class="pt-close-btn" @click="closePanel">✕</button>
        </div>

        <!-- 3D 卡片轮播 -->
        <div
          class="pt-carousel-scene"
          ref="sceneRef"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointerleave="onPointerUp"
        >
          <div class="pt-carousel-stage" :style="stageStyle">
            <div
              v-for="(card, i) in displayCards"
              :key="i"
              class="pt-carousel-card"
              :data-card-idx="i"
              :style="cardStyle(i, displayCards.length)"
            >
              <div class="pt-card-inner">
                <img
                  v-if="card.type === 'image' && card.src"
                  :src="card.src"
                  :alt="card.alt || ''"
                  loading="lazy"
                  decoding="async"
                />
                <div
                  v-else
                  class="pt-card-placeholder"
                  :style="{ background: card.gradient }"
                >
                  <span class="pt-card-placeholder-label">{{ card.label }}</span>
                </div>
              </div>
              <!-- 悬停放大提示 -->
              <div class="pt-card-zoom-hint">⊕</div>
            </div>
          </div>
        </div>

        <!-- 轮播控制 -->
        <div class="pt-carousel-controls">
          <button class="pt-nav-btn" @click="rotateBy(-1)">‹</button>
          <span class="pt-drag-hint">{{ t('project.dragHint') }}</span>
          <button class="pt-nav-btn" @click="rotateBy(1)">›</button>
        </div>

        <!-- 技术 & 思考 -->
        <div class="pt-panel-body">
          <div class="pt-tech-block">
            <h4 class="pt-block-title">
              <span class="pt-block-icon">⚡</span> {{ t('project.techTitle') }}
            </h4>
            <ul class="pt-tech-list">
              <li v-for="(tech, i) in selectedProject.techs" :key="i">
                <span class="pt-tech-dot"></span>
                {{ tech }}
              </li>
            </ul>
          </div>
          <div class="pt-divider"></div>
          <div class="pt-thought-block">
            <h4 class="pt-block-title">
              <span class="pt-block-icon">💭</span> {{ t('project.thoughtTitle') }}
            </h4>
            <p class="pt-thought-text">{{ selectedProject.thought }}</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 空状态提示 -->
    <Transition name="hint-fade">
      <div v-if="!selectedProject" class="pt-empty-hint">
        <div class="pt-hint-arrow">↑</div>
        <p>{{ t('project.emptyHint') }}</p>
      </div>
    </Transition>
  </div>

  <MediaPreview :cards="displayCards" v-model="previewIdx" />
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocale } from '@/composables/useLocale.js'
import { api } from '@/api/index.js'
import MediaPreview from './MediaPreview.vue'

const { t } = useI18n()
const { locale } = useLocale()

const CARD_GRADIENTS = [
  'linear-gradient(135deg, #0a2342 0%, #0e4bba 50%, #2997ff 100%)',
  'linear-gradient(135deg, #1a0533 0%, #6b21a8 55%, #c026d3 100%)',
  'linear-gradient(135deg, #0d2137 0%, #0d7377 55%, #14ffec 100%)',
  'linear-gradient(135deg, #1a1a0a 0%, #7c6f14 55%, #f5d020 100%)'
]

const CARD_W = 110
const CARD_H = 148

const projects = ref([])

async function loadProjects() {
  try {
    projects.value = await api.getProjects(locale.value)
    if (projects.value.length && selectedIdx.value === null) {
      selectedIdx.value = 0
    }
  } catch (e) {
    console.error('Failed to load projects:', e)
  }
}

watch(locale, loadProjects)

const selectedIdx = ref(null)
const selectedProject = computed(() =>
  selectedIdx.value !== null ? projects.value[selectedIdx.value] : null
)

const displayCards = computed(() => {
  if (!selectedProject.value) return []
  const m = selectedProject.value.media
  if (m && m.length) return m
  return projects.value.map((p, i) => ({
    type: 'placeholder',
    gradient: CARD_GRADIENTS[i % CARD_GRADIENTS.length],
    label: p.name
  }))
})

// ── 灯箱预览状态 ──
const previewIdx = ref(null)

function openPreview(idx) {
  previewIdx.value = idx
}

// ── 3D 轮播状态 ──
const rotationAngle = ref(0)
const sceneRef = ref(null)
const rootRef = ref(null)
let rafId = null
let visibilityObserver = null
const isVisible = ref(false)
let isDragging = false
let hasDragged = false
let pointerStartX = 0
let angleOnDragStart = 0
let pointerDownTarget = null

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

function rotateBy(dir) {
  const count = displayCards.value.length
  if (!count) return
  stopAutoRotate()
  rotationAngle.value -= dir * (360 / count)
  setTimeout(() => {
    if (isVisible.value) startAutoRotate()
  }, 2000)
}

function startAutoRotate() {
  if (!isVisible.value || selectedIdx.value === null || !displayCards.value.length) return
  stopAutoRotate()
  let last = null
  function tick(ts) {
    if (last !== null) rotationAngle.value -= (ts - last) * 0.006
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
  hasDragged = false
  pointerDownTarget = e.target
  pointerStartX = e.clientX
  angleOnDragStart = rotationAngle.value
  stopAutoRotate()
  e.currentTarget.setPointerCapture(e.pointerId)
}

function onPointerMove(e) {
  if (!isDragging) return
  const dx = Math.abs(e.clientX - pointerStartX)
  if (dx > 5) hasDragged = true
  rotationAngle.value = angleOnDragStart + (e.clientX - pointerStartX) * 0.35
}

function onPointerUp(e) {
  if (!isDragging) return
  isDragging = false
  if (isVisible.value) startAutoRotate()
  // setPointerCapture 会把 click 事件吸附到 scene，所以在 pointerup 时手动判断点击的卡片
  if (!hasDragged && e.type === 'pointerup' && pointerDownTarget) {
    const cardEl = pointerDownTarget.closest('[data-card-idx]')
    if (cardEl) {
      const idx = parseInt(cardEl.dataset.cardIdx)
      if (!isNaN(idx)) openPreview(idx)
    }
  }
  pointerDownTarget = null
}

// ── 切换项目时重置轮播（immediate 确保初始选中也启动旋转）──
watch(selectedIdx, (val) => {
  rotationAngle.value = 0
  if (val !== null && isVisible.value) startAutoRotate()
  else stopAutoRotate()
}, { immediate: true })

function selectProject(idx) {
  selectedIdx.value = selectedIdx.value === idx ? null : idx
}

function closePanel() {
  selectedIdx.value = null
}

function setupVisibilityObserver () {
  visibilityObserver = new IntersectionObserver(([entry]) => {
    isVisible.value = Boolean(entry?.isIntersecting)
    if (isVisible.value) startAutoRotate()
    else stopAutoRotate()
  }, { threshold: 0.12 })

  if (rootRef.value) visibilityObserver.observe(rootRef.value)
}

onMounted(() => {
  loadProjects()
  setupVisibilityObserver()
})
onBeforeUnmount(() => {
  stopAutoRotate()
  if (visibilityObserver && rootRef.value) {
    visibilityObserver.unobserve(rootRef.value)
  }
})
</script>

<style scoped src="@/assets/styles/components/ProjectTimeline.css"></style>
