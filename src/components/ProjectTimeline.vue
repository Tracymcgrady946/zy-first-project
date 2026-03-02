<template>
  <div class="project-timeline">
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
        <p>点击上方项目节点查看详情</p>
      </div>
    </Transition>
  </div>

  <!-- 灯箱预览（挂到 body，避免 overflow 裁剪） -->
  <Teleport to="body">
    <Transition name="lb-fade">
      <div
        v-if="previewIdx !== null"
        class="pt-lightbox"
        @click.self="closePreview"
      >
        <!-- 关闭按钮 -->
        <button class="lb-close" @click="closePreview">✕</button>

        <!-- 主内容 -->
        <div class="lb-content">
          <Transition name="lb-card" mode="out-in">
            <div :key="previewIdx" class="lb-card-wrap">
              <img
                v-if="displayCards[previewIdx]?.type === 'image' && displayCards[previewIdx]?.src"
                :src="displayCards[previewIdx].src"
                :alt="displayCards[previewIdx].alt || ''"
                class="lb-img"
              />
              <div
                v-else
                class="lb-placeholder"
                :style="{ background: displayCards[previewIdx]?.gradient }"
              >
                <span class="lb-placeholder-label">{{ displayCards[previewIdx]?.label }}</span>
              </div>
            </div>
          </Transition>
        </div>

        <!-- 左右切换 -->
        <button
          v-if="displayCards.length > 1"
          class="lb-arrow lb-arrow--prev"
          @click="previewStep(-1)"
        >‹</button>
        <button
          v-if="displayCards.length > 1"
          class="lb-arrow lb-arrow--next"
          @click="previewStep(1)"
        >›</button>

        <!-- 分页点 -->
        <div class="lb-dots" v-if="displayCards.length > 1">
          <span
            v-for="(_, i) in displayCards"
            :key="i"
            class="lb-dot"
            :class="{ active: i === previewIdx }"
            @click="previewIdx = i"
          ></span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

import imgPage1 from '@/assets/img/project/page1.png'
import imgPage2 from '@/assets/img/project/page2.JPG'
import imgPage3 from '@/assets/img/project/page3.JPG'
import imgPage4 from '@/assets/img/project/page4.JPG'
import imgPage5 from '@/assets/img/project/page5.JPG'
import imgPage6 from '@/assets/img/project/page6.JPG'

const { t, tm } = useI18n()

// ── 卡片占位渐变色，顺序与 projectKeys 一一对应 ──
const CARD_GRADIENTS = [
  'linear-gradient(135deg, #0a2342 0%, #0e4bba 50%, #2997ff 100%)',
  'linear-gradient(135deg, #1a0533 0%, #6b21a8 55%, #c026d3 100%)',
  'linear-gradient(135deg, #0d2137 0%, #0d7377 55%, #14ffec 100%)',
  'linear-gradient(135deg, #1a1a0a 0%, #7c6f14 55%, #f5d020 100%)'
]

const CARD_W = 110
const CARD_H = 148

// 静态结构，文案从 i18n 读取
const projectKeys = ['huoliGo', 'fourHigh', 'fuwaiWeight', 'summaryHighlights']
const mediaMap = {
  huoliGo: [
    { type: 'image', src: imgPage1, alt: '活力Go - 页面1' },
    { type: 'image', src: imgPage2, alt: '活力Go - 页面2' }
  ],
  fourHigh: [
    { type: 'image', src: imgPage3, alt: '四高一重 - 页面1' },
    { type: 'image', src: imgPage4, alt: '四高一重 - 页面2' }
  ],
  fuwaiWeight: [
    { type: 'image', src: imgPage5, alt: '阜外减重 - 页面1' },
    { type: 'image', src: imgPage6, alt: '阜外减重 - 页面2' }
  ],
  summaryHighlights: []
}

const projects = computed(() =>
  projectKeys.map(key => ({
    key,
    name: t(`project.${key}.name`),
    media: mediaMap[key],
    techs: tm(`project.${key}.techs`),
    thought: t(`project.${key}.thought`)
  }))
)

// ── 选中状态（默认选中第一个）──
const selectedIdx = ref(0)
const selectedProject = computed(() => projects.value[selectedIdx.value] ?? null)

// ── 轮播卡片数据：有 media 用 media，否则每张卡对应一个项目渐变占位 ──
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

function closePreview() {
  previewIdx.value = null
}

function previewStep(dir) {
  const len = displayCards.value.length
  previewIdx.value = (previewIdx.value + dir + len) % len
}

function onEscKey(e) {
  if (e.key === 'Escape') closePreview()
}

// ── 3D 轮播状态 ──
const rotationAngle = ref(0)
const sceneRef = ref(null)
let rafId = null
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
  setTimeout(startAutoRotate, 2000)
}

function startAutoRotate() {
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
  startAutoRotate()
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
  if (val !== null) startAutoRotate()
  else stopAutoRotate()
}, { immediate: true })

function selectProject(idx) {
  selectedIdx.value = selectedIdx.value === idx ? null : idx
}

function closePanel() {
  selectedIdx.value = null
}

onMounted(() => window.addEventListener('keydown', onEscKey))
onBeforeUnmount(() => {
  stopAutoRotate()
  window.removeEventListener('keydown', onEscKey)
})
</script>

<style scoped>
.project-timeline {
  width: 100%;
  margin-top: 32px;
  color: var(--apple-text);
  font-family: var(--font-apple);
}

/* ── 水平轨道 ── */
.pt-rail {
  display: flex;
  align-items: flex-start;
  padding: 8px 0 0;
}

.pt-node-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
  padding: 0 4px;
  min-width: 72px;
}

.pt-node-wrap:hover .pt-dot {
  border-color: #2997ff;
  background: rgba(41, 151, 255, 0.25);
}

.pt-node-wrap.active .pt-dot {
  background: #2997ff;
  border-color: #2997ff;
  box-shadow: 0 0 14px rgba(41, 151, 255, 0.7);
}

.pt-node-wrap.active .pt-label {
  color: #2997ff;
}

.pt-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.06);
  position: relative;
  flex-shrink: 0;
  transition: all 0.3s;
}

.pt-ripple {
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  border: 1.5px solid #2997ff;
  opacity: 0;
  pointer-events: none;
}

.pt-node-wrap.active .pt-ripple {
  animation: pt-pulse 1.6s ease-out infinite;
}

@keyframes pt-pulse {
  0%   { transform: scale(0.9); opacity: 0.9; }
  100% { transform: scale(2.2); opacity: 0; }
}

.pt-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--apple-text-secondary);
  letter-spacing: 0.04em;
  transition: color 0.25s;
  white-space: nowrap;
}

/* ── 连接线 ── */
.pt-connector {
  flex: 1;
  height: 1px;
  margin-top: 7px;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0.06)
  );
  min-width: 20px;
}

/* ── 详情面板 ── */
.pt-panel {
  margin-top: 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(8px);
}

.pt-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.pt-panel-tag {
  background: linear-gradient(135deg, #0e4bba, #2997ff);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  letter-spacing: 0.06em;
}

.pt-close-btn {
  background: none;
  border: none;
  color: var(--apple-text-secondary);
  font-size: 13px;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
  line-height: 1;
}

.pt-close-btn:hover {
  color: var(--apple-text);
  background: rgba(255, 255, 255, 0.08);
}

/* ── 3D 轮播 ── */
.pt-carousel-scene {
  width: 100%;
  height: 192px;
  perspective: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  touch-action: none;
  position: relative;
  overflow: hidden;
}

.pt-carousel-scene:active {
  cursor: grabbing;
}

.pt-carousel-scene::before,
.pt-carousel-scene::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 48px;
  z-index: 10;
  pointer-events: none;
}

.pt-carousel-scene::before {
  left: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 100%);
}

.pt-carousel-scene::after {
  right: 0;
  background: linear-gradient(to left, rgba(0,0,0,0.55) 0%, transparent 100%);
}

.pt-carousel-stage {
  position: relative;
  transform-style: preserve-3d;
  width: v-bind('CARD_W + "px"');
  height: v-bind('CARD_H + "px"');
}

.pt-carousel-card {
  position: absolute;
  width: v-bind('CARD_W + "px"');
  height: v-bind('CARD_H + "px"');
  top: 0;
  left: 0;
  backface-visibility: hidden;
  border-radius: 12px;
  overflow: hidden;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.06);
  transition: box-shadow 0.3s;
}

.pt-carousel-card {
  cursor: pointer;
}

.pt-carousel-card:hover {
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.7),
    0 0 0 1px rgba(41, 151, 255, 0.3);
}

.pt-carousel-card:hover .pt-card-zoom-hint {
  opacity: 1;
}

/* ── 卡片放大提示图标 ── */
.pt-card-zoom-hint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.2s ease;
  border-radius: 12px;
  pointer-events: none;
  backdrop-filter: blur(2px);
}

.pt-card-inner {
  width: 100%;
  height: 100%;
}

.pt-card-inner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ── 渐变占位 ── */
.pt-card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.pt-card-placeholder::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255, 255, 255, 0.07) 50%,
    transparent 60%
  );
  background-size: 200% 100%;
  animation: pt-shimmer 2.8s infinite;
}

@keyframes pt-shimmer {
  0%   { background-position: 200% center; }
  100% { background-position: -200% center; }
}

.pt-card-placeholder-label {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.06em;
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 0 8px;
}

/* ── 轮播控制 ── */
.pt-carousel-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 4px 0 14px;
}

.pt-nav-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--apple-text);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  line-height: 1;
}

.pt-nav-btn:hover {
  background: rgba(41, 151, 255, 0.18);
  border-color: rgba(41, 151, 255, 0.4);
  transform: scale(1.08);
}

.pt-nav-btn:active {
  transform: scale(0.94);
}

.pt-drag-hint {
  font-size: 10px;
  color: var(--apple-text-secondary);
  opacity: 0.4;
  letter-spacing: 0.05em;
}

/* ── 面板内容 ── */
.pt-panel-body {
  padding: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 0;
  text-align: left;
}

.pt-tech-block,
.pt-thought-block {
  padding: 4px 0;
}

.pt-block-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--apple-text-secondary);
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  opacity: 0.7;
}

.pt-block-icon {
  font-size: 12px;
}

/* ── 技术列表 ── */
.pt-tech-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.pt-tech-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: var(--apple-text);
  line-height: 1.5;
  letter-spacing: 0.01em;
}

.pt-tech-dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #2997ff;
  flex-shrink: 0;
  margin-top: 6px;
}

/* ── 分隔线 ── */
.pt-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  margin: 14px 0;
}

/* ── 思考段落 ── */
.pt-thought-text {
  font-size: 13px;
  color: var(--apple-text-secondary);
  line-height: 1.75;
  margin: 0;
  letter-spacing: 0.02em;
  opacity: 0.85;
}

/* ── 空状态提示 ── */
.pt-empty-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 36px 0 12px;
  color: var(--apple-text-secondary);
  opacity: 0.3;
  pointer-events: none;
}

.pt-hint-arrow {
  font-size: 20px;
  animation: hint-bounce 1.6s ease-in-out infinite;
}

@keyframes hint-bounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-6px); }
}

.pt-empty-hint p {
  font-size: 12px;
  margin: 0;
  letter-spacing: 0.05em;
}

/* ══════════════════════════════════════════
   灯箱
══════════════════════════════════════════ */
.pt-lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 关闭按钮 */
.lb-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.2s;
  z-index: 10;
}

.lb-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

/* 主内容区 */
.lb-content {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: min(88vw, 640px);
  max-height: 80vh;
}

.lb-card-wrap {
  max-width: min(88vw, 640px);
  max-height: 78vh;
  border-radius: 18px;
  overflow: hidden;
  box-shadow:
    0 24px 80px rgba(0, 0, 0, 0.7),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lb-img {
  max-width: min(88vw, 640px);
  max-height: 78vh;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  border-radius: 18px;
}

.lb-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.lb-placeholder::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255, 255, 255, 0.06) 50%,
    transparent 60%
  );
  background-size: 200% 100%;
  animation: pt-shimmer 3s infinite;
}

.lb-placeholder-label {
  font-size: 18px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.65);
  letter-spacing: 0.08em;
  position: relative;
  z-index: 1;
}

/* 左右箭头 */
.lb-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 24px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.2s;
  line-height: 1;
}

.lb-arrow:hover {
  background: rgba(41, 151, 255, 0.3);
  border-color: rgba(41, 151, 255, 0.5);
  transform: translateY(-50%) scale(1.1);
}

.lb-arrow--prev { left: max(16px, 4vw); }
.lb-arrow--next { right: max(16px, 4vw); }

/* 分页点 */
.lb-dots {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  align-items: center;
}

.lb-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.lb-dot.active {
  background: #2997ff;
  transform: scale(1.3);
}

/* 灯箱过渡 */
.lb-fade-enter-active,
.lb-fade-leave-active {
  transition: opacity 0.3s ease;
}

.lb-fade-enter-from,
.lb-fade-leave-to {
  opacity: 0;
}

/* 卡片切换过渡 */
.lb-card-enter-active,
.lb-card-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}

.lb-card-enter-from {
  opacity: 0;
  transform: scale(0.94);
}

.lb-card-leave-to {
  opacity: 0;
  transform: scale(1.04);
}

/* ── 过渡动画 ── */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition:
    opacity 0.36s ease,
    transform 0.36s cubic-bezier(0.22, 1, 0.36, 1);
}

.panel-slide-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

.panel-slide-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
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
