<template>
  <div ref="root"
    class="scroll-reveal"
    :class="{ 'scroll-reveal--visible': isVisible }">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const root = ref(null)
const isVisible = ref(false)
let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0, rootMargin: '0px' }
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
}

.scroll-reveal--visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
