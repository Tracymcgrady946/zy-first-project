<template>
  <div class="app">
    <Home />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Home from '@/views/Home.vue'

onMounted(() => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
})
</script>

<style scoped>
.app {
  min-height: 100vh;
}
</style>
