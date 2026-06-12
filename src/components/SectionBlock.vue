<template>
  <section :id="sectionId"
    class="section"
    :class="sectionThemeClass">
    <div class="section-inner">
      <h2 class="section-title">{{ title }}</h2>
      <p class="section-desc">{{ description }}</p>
      <TechBanner v-if="techLinks && techLinks.length"
        :links="techLinks" />
      <slot></slot>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import TechBanner from './TechBanner.vue'

const props = defineProps({
  sectionId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  theme: { type: String, default: '' },
  techLinks: { type: Array, default: null }
})

const sectionThemeClass = computed(() => props.theme ? `section-${props.theme}` : '')
</script>

<style scoped src="@/assets/styles/components/SectionBlock.css"></style>
