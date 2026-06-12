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
const REVEAL_SECTIONS_EVENT = 'app:reveal-sections'

function reveal () {
  shouldRender.value = true
  isVisible.value = true
  if (observer && root.value) {
    observer.unobserve(root.value)
  }
}

onMounted(() => {
  if (props.skip) {
    reveal()
    return
  }

  window.addEventListener(REVEAL_SECTIONS_EVENT, reveal)
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal()
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
  window.removeEventListener(REVEAL_SECTIONS_EVENT, reveal)
})
</script>

<style scoped src="@/assets/styles/components/ScrollReveal.css"></style>
