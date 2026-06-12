<template>
  <div class="tech-banner">
    <a
      v-for="(item, index) in links"
      :key="item.url"
      :href="item.url"
      target="_blank"
      rel="noopener noreferrer"
      class="tech-banner__card"
      :class="`tech-banner__card--${(index % 4) + 1}`"
    ><span class="tech-banner__text">{{ item.name }}</span></a>
  </div>
</template>

<script setup>
defineProps({
  links: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped src="@/assets/styles/components/TechBanner.css"></style>
