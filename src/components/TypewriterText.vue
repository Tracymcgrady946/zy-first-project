<template>
  <span>
    <span v-for="(char, i) in displayedChars" :key="i">{{ char }}</span>
    <span v-if="showCursor" class="typewriter-cursor"></span>
  </span>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  text: { type: String, default: '' },
  speed: { type: Number, default: 120 },
  startAfter: { type: Number, default: 0 },
  showCursor: { type: Boolean, default: true }
})

const displayedChars = ref([])
let timer = null

function typeNext(index) {
  if (index >= props.text.length) return
  displayedChars.value.push(props.text[index])
  timer = setTimeout(() => typeNext(index + 1), props.speed)
}

watch(() => props.text, () => {
  clearTimeout(timer)
  displayedChars.value = []
  if (!props.text) return
  timer = setTimeout(() => typeNext(0), props.startAfter)
}, { immediate: true })

onBeforeUnmount(() => {
  clearTimeout(timer)
})
</script>
