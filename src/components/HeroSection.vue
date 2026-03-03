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

    <!-- Right Column: Timeline & 3D Album -->
    <div class="hero-right">
      <TimelineAlbum />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import TypewriterText from './TypewriterText.vue'
import TimelineAlbum from './TimelineAlbum.vue'

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
    isScrolled.value = window.scrollY > 80
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

<style scoped>
/* ── Section Layout ── */
.hero {
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  align-items: stretch;
  padding: 80px 0 60px;
  padding-top: calc(80px + env(safe-area-inset-top));
  background: var(--apple-bg-hero);
}

@media (min-width: 480px) {
  .hero {
    padding: 100px 0 80px;
    padding-top: calc(100px + env(safe-area-inset-top));
  }
}

/* ── Left Column ── */
.hero-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 5vw;
}

/* ── Divider ── */
.hero-divider {
  width: 1px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 20%,
    rgba(255, 255, 255, 0.1) 80%,
    transparent 100%
  );
  align-self: stretch;
}

/* ── Right Column ── */
.hero-right {
  display: flex;
  align-items: stretch;
  overflow: hidden;
}

.hero-right > * {
  flex: 1;
  min-width: 0;
}

/* ── Scroll Fade ── */
.hero--scrolled .hero-header,
.hero--scrolled .hero-photo,
.hero--scrolled .hero-intro,
.hero--scrolled .hero-info {
  transform: scale(0.98);
  opacity: 0.92;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease;
}

/* ── Name & Role ── */
.hero-header {
  margin-bottom: 24px;
}

.hero-name {
  font-size: clamp(24px, 3vw, 34px);
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

.hero-role {
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--apple-text-secondary);
  opacity: 0.9;
}

/* ── Photo ── */
.hero-photo {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 24px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.4);
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

@media (min-width: 480px) {
  .hero-photo {
    width: 130px;
    height: 130px;
    margin-bottom: 28px;
  }
}

/* ── Intro Lines ── */
.hero-intro {
  max-width: 420px;
  margin: 0 auto;
  text-align: center;
}

.intro-line {
  font-size: clamp(17px, 2.2vw, 22px);
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

/* ── Info List ── */
.hero-info {
  list-style: none;
  width: 100%;
  max-width: 360px;
  margin-top: 28px;
  padding: 14px 0 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.info-row {
  display: grid;
  grid-template-columns: 22px 72px 1fr;
  align-items: baseline;
  gap: 0 10px;
  padding: 6px 8px;
  border-radius: 8px;
  transition: background 0.18s;
}

.info-row + .info-row {
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.info-row:hover {
  background: rgba(255, 255, 255, 0.04);
}

.info-icon {
  font-size: 12px;
  color: #2997ff;
  opacity: 0.7;
  text-align: center;
  line-height: 1.8;
  letter-spacing: 0;
}

.info-label {
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--apple-text-secondary);
  opacity: 0.6;
  white-space: nowrap;
  line-height: 1.8;
}

.info-value {
  font-size: 12.5px;
  color: #e2e2e7;
  line-height: 1.6;
  word-break: break-word;
}

.info-link {
  color: #2997ff;
  text-decoration: none;
  transition: opacity 0.2s;
}

.info-link:hover {
  opacity: 0.75;
  text-decoration: underline;
  text-decoration-color: rgba(41, 151, 255, 0.45);
  text-underline-offset: 2px;
}

/* ── Responsive: Stack on mobile ── */
@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    padding: 80px 16px 60px;
    padding-top: calc(80px + env(safe-area-inset-top));
  }

  .hero-left {
    padding: 0;
  }

  .hero-divider {
    width: 80%;
    height: 1px;
    margin: 32px auto;
    background: linear-gradient(
      to right,
      transparent 0%,
      rgba(255, 255, 255, 0.1) 30%,
      rgba(255, 255, 255, 0.1) 70%,
      transparent 100%
    );
  }

  .hero-right {
    min-height: 480px;
  }
}
</style>
