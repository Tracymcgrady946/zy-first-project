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

<style scoped src="@/assets/styles/components/MediaPreview.css"></style>
