<template>
  <Teleport to="body">
    <Transition name="lb-fade">
      <div
        v-if="modelValue !== null"
        class="lb-overlay"
        @click.self="close"
      >
        <!-- 关闭按钮 -->
        <button class="lb-close" @click="close">✕</button>

        <!-- 主内容 -->
        <div class="lb-content">
          <Transition name="lb-card">
            <div :key="modelValue" class="lb-card-wrap">
              <!-- 视频 -->
              <video
                v-if="current?.type === 'video' && current?.src"
                :src="current.src"
                :poster="current.poster || ''"
                controls
                class="lb-video"
              ></video>
              <!-- 图片 -->
              <img
                v-else-if="current?.src"
                :src="current.src"
                :alt="current.alt || ''"
                class="lb-img"
              />
              <!-- 渐变占位（如 ProjectTimeline 的纯色卡片）-->
              <div
                v-else-if="current?.gradient"
                class="lb-gradient"
                :style="{ background: current.gradient }"
              >
                <span class="lb-gradient-label">{{ current.label }}</span>
              </div>
              <!-- 空占位 -->
              <div v-else class="lb-empty">
                <div class="lb-empty-icon"></div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- 左右切换箭头 -->
        <button
          v-if="cards.length > 1"
          class="lb-arrow lb-arrow--prev"
          @click="step(-1)"
        >‹</button>
        <button
          v-if="cards.length > 1"
          class="lb-arrow lb-arrow--next"
          @click="step(1)"
        >›</button>

        <!-- 分页圆点 -->
        <div class="lb-dots" v-if="cards.length > 1">
          <span
            v-for="(_, i) in cards"
            :key="i"
            class="lb-dot"
            :class="{ active: i === modelValue }"
            @click="$emit('update:modelValue', i)"
          ></span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  cards: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const current = computed(() =>
  props.modelValue !== null ? props.cards[props.modelValue] : null
)

function close () {
  emit('update:modelValue', null)
}

function step (dir) {
  const len = props.cards.length
  if (!len) return
  emit('update:modelValue', (props.modelValue + dir + len) % len)
}

function onEscKey (e) {
  if (e.key === 'Escape') close()
}

// 打开时注册 ESC，关闭时移除
watch(
  () => props.modelValue,
  (val) => {
    if (val !== null) {
      window.addEventListener('keydown', onEscKey)
    } else {
      window.removeEventListener('keydown', onEscKey)
    }
  }
)

onBeforeUnmount(() => window.removeEventListener('keydown', onEscKey))
</script>

<style scoped>
/* ── 遮罩层 ── */
.lb-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── 关闭按钮 ── */
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

/* ── 内容区 ── */
.lb-content {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: min(88vw, 640px);
  max-height: 80vh;
  position: relative;
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

/* 离开时绝对定位，让新旧图片在同一位置叠加淡入淡出 */
.lb-card-leave-active {
  position: absolute;
  inset: 0;
  margin: auto;
}

/* ── 图片 ── */
.lb-img {
  max-width: min(88vw, 640px);
  max-height: 78vh;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  border-radius: 18px;
}

/* ── 视频 ── */
.lb-video {
  max-width: min(88vw, 640px);
  max-height: 78vh;
  width: auto;
  height: auto;
  display: block;
  border-radius: 18px;
  outline: none;
}

/* ── 渐变占位 ── */
.lb-gradient {
  width: 320px;
  height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border-radius: 18px;
}

.lb-gradient::before {
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
  animation: lb-shimmer 3s infinite;
}

@keyframes lb-shimmer {
  0%   { background-position: 200% center; }
  100% { background-position: -200% center; }
}

.lb-gradient-label {
  font-size: 18px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.65);
  letter-spacing: 0.08em;
  position: relative;
  z-index: 1;
}

/* ── 空占位 ── */
.lb-empty {
  width: 320px;
  height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 18px;
}

.lb-empty-icon {
  width: 48px;
  height: 48px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  position: relative;
}

.lb-empty-icon::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
}

/* ── 左右箭头 ── */
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

/* ── 分页圆点 ── */
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

/* ── 过渡动画 ── */
.lb-fade-enter-active,
.lb-fade-leave-active {
  transition: opacity 0.3s ease;
}

.lb-fade-enter-from,
.lb-fade-leave-to {
  opacity: 0;
}

.lb-card-enter-active,
.lb-card-leave-active {
  transition: opacity 0.22s ease;
}

.lb-card-enter-from,
.lb-card-leave-to {
  opacity: 0;
}
</style>
