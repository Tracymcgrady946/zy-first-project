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

<style scoped>
.section {
  padding: 48px 16px 64px;
  padding-left: calc(16px + env(safe-area-inset-left));
  padding-right: calc(16px + env(safe-area-inset-right));
  padding-bottom: calc(64px + env(safe-area-inset-bottom));
  width: 100%;
  text-align: center;
}

.section-inner {
  max-width: 680px;
  margin: 0 auto;
  text-align: center;
  padding: 0;
}

@media (min-width: 480px) {
  .section {
    padding-top: 72px;
    padding-left: calc(24px + env(safe-area-inset-left));
    padding-right: calc(24px + env(safe-area-inset-right));
    padding-bottom: calc(88px + env(safe-area-inset-bottom));
  }
}

.section-title {
  font-size: clamp(24px, 3.5vw, 32px);
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
  background: linear-gradient(90deg, #f5f5f7 0%, #2997ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.section-desc {
  font-size: 17px;
  color: var(--apple-text-secondary);
  line-height: 1.55;
  letter-spacing: 0.01em;
  background: linear-gradient(90deg, #a1a1a6 0%, #2997ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.section-about {
  background: #0a0a0a;
}

.section-contact {
  background: #0d0d0d;
}
</style>
