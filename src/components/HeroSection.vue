<template>
  <section class="hero" :class="{ 'hero--scrolled': isScrolled }" id="intro">
    <header class="hero-header">
      <h1 class="hero-name">{{ hero.name }}</h1>
      <p class="hero-role">{{ hero.role }}</p>
    </header>
    <img
      class="hero-photo"
      :src="hero.photoUrl"
      :alt="hero.photoAlt"
      @error="onPhotoError"
    />
    <div class="hero-intro">
      <p
        v-for="(line, index) in hero.introLines"
        :key="index"
        class="intro-line"
      >
        <TypewriterText
          :text="line"
          :speed="hero.typewriterSpeed"
          :start-after="getLineStartAfter(index)"
          :show-cursor="hero.showCursor"
        />
      </p>
    </div>
    <ul class="hero-info">
      <li v-for="(item, index) in hero.infoList" :key="index">
        <a v-if="item.href" :href="item.href">{{ item.text }}</a>
        <template v-else>{{ item.text }}</template>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import TypewriterText from './TypewriterText.vue'

const props = defineProps({
  hero: { type: Object, required: true }
})

const emit = defineEmits(['photo-error'])

const isScrolled = ref(false)
let scrollTicking = false

function onScroll() {
  if (scrollTicking) return
  scrollTicking = true
  requestAnimationFrame(() => {
    isScrolled.value = window.scrollY > 80
    scrollTicking = false
  })
}

function getLineStartAfter(index) {
  const { introLines, typewriterSpeed, typewriterStartAfter } = props.hero
  if (index === 0) return typewriterStartAfter
  let delay = typewriterStartAfter
  for (let i = 0; i < index; i++) {
    delay += introLines[i].length * typewriterSpeed
    delay += i === 0 ? 400 : 800
  }
  return delay
}

function onPhotoError() {
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

<style scoped>
.hero {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 16px 60px;
  padding-top: calc(80px + env(safe-area-inset-top));
  background: var(--apple-bg-hero);
}

@media (min-width: 480px) {
  .hero {
    padding: 100px 24px 80px;
    padding-top: calc(100px + env(safe-area-inset-top));
  }
}

.hero-header {
  margin-bottom: 24px;
}

.hero-name {
  font-size: clamp(26px, 4vw, 36px);
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.2;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #f5f5f7 0%, #2997ff 50%, #7ec8ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.hero--scrolled .hero-header,
.hero--scrolled .hero-photo,
.hero--scrolled .hero-intro,
.hero--scrolled .hero-info {
  transform: scale(0.98);
  opacity: 0.92;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease;
}

.hero-role {
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--apple-text-secondary);
  opacity: 0.9;
}

.hero-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 24px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.4);
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

@media (min-width: 480px) {
  .hero-photo {
    width: 140px;
    height: 140px;
    margin-bottom: 32px;
  }
}

.hero-intro {
  max-width: 480px;
  margin: 0 auto;
  text-align: center;
}

.intro-line {
  font-size: clamp(19px, 2.8vw, 24px);
  font-weight: 400;
  line-height: 1.65;
  margin-bottom: 0.4em;
  min-height: 1.65em;
  letter-spacing: -0.01em;
  background: linear-gradient(90deg, #f5f5f7 0%, #2997ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.hero-info {
  list-style: none;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 15px;
  letter-spacing: 0.01em;
}

.hero-info li {
  margin-bottom: 6px;
  background: linear-gradient(90deg, #f5f5f7 0%, #2997ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.hero-info li:last-child {
  margin-bottom: 0;
}

.hero-info a {
  background: linear-gradient(90deg, #f5f5f7 0%, #2997ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  text-decoration: underline;
  text-decoration-color: rgba(245, 245, 247, 0.3);
  text-underline-offset: 3px;
  transition: text-decoration-color 0.2s ease;
}

.hero-info a:hover {
  text-decoration-color: #2997ff;
}
</style>
