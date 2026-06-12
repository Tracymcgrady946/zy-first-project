<template>
  <section class="hero"
    :class="{ 'hero--scrolled': isScrolled }"
    id="intro">
    <!-- Left Column: Personal Info -->
    <div class="hero-left">
      <header class="hero-header">
        <h1 class="hero-name">{{ hero.name }}</h1>
        <p class="hero-role">{{ hero.role }}</p>
      </header>

      <img class="hero-photo"
        :src="hero.photoUrl"
        :alt="hero.photoAlt"
        @error="onPhotoError" />

      <div class="hero-intro">
        <p v-for="(line, index) in hero.introLines"
          :key="index"
          class="intro-line">
          <TypewriterText :text="line"
            :speed="hero.typewriterSpeed"
            :start-after="getLineStartAfter(index)"
            :show-cursor="hero.showCursor" />
        </p>
      </div>

      <ul class="hero-info">
        <li v-for="(item, index) in hero.infoList"
          :key="index"
          class="info-row">
          <span class="info-icon">{{ item.icon }}</span>
          <span class="info-label">{{ item.label }}</span>
          <a v-if="item.href"
            class="info-value info-link"
            :href="item.href">{{ item.value }}</a>
          <span v-else
            class="info-value">{{ item.value }}</span>
        </li>
      </ul>
    </div>

    <!-- Vertical Divider -->
    <div class="hero-divider"></div>

    <!-- Right Column: Hiking map -->
    <div class="hero-right">
      <OnFootMap />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import TypewriterText from './TypewriterText.vue'
import OnFootMap from './OnFootMap.vue'

const props = defineProps({
  hero: { type: Object, required: true }
})

const emit = defineEmits(['photo-error'])

const isScrolled = ref(false)
let scrollTicking = false

function onScroll () {
  if (scrollTicking) return
  scrollTicking = true
  requestAnimationFrame(() => {
    const next = window.scrollY > 80
    if (isScrolled.value !== next) {
      isScrolled.value = next
    }
    scrollTicking = false
  })
}

function getLineStartAfter (index) {
  const { introLines, typewriterSpeed, typewriterStartAfter } = props.hero
  if (index === 0) return typewriterStartAfter
  let delay = typewriterStartAfter
  for (let i = 0; i < index; i++) {
    delay += introLines[i].length * typewriterSpeed
    delay += i === 0 ? 400 : 800
  }
  return delay
}

function onPhotoError () {
  emit('photo-error')
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped src="@/assets/styles/components/HeroSection.css"></style>
