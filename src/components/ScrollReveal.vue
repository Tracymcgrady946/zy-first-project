<template>
  <div ref="root"
    class="scroll-reveal"
    :class="{ 'scroll-reveal--visible': isVisible }">
    <slot v-if="shouldRender"></slot>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  skip: { type: Boolean, default: false },
  eager: { type: Boolean, default: false }
})

const root = ref(null)
const isVisible = ref(false)
const shouldRender = ref(props.eager)
let observer = null

onMounted(() => {
  if (props.skip) {
    isVisible.value = true
    shouldRender.value = true
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          shouldRender.value = true
          isVisible.value = true
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0, rootMargin: '360px 0px' }
  )
  if (root.value) {
    observer.observe(root.value)
  }
})

onBeforeUnmount(() => {
  if (observer && root.value) {
    observer.unobserve(root.value)
  }
})
</script>

<style scoped>
.scroll-reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  content-visibility: auto;
  contain-intrinsic-size: 720px;
}

.scroll-reveal--visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
