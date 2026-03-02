<template>
  <section class="hero" :class="{ 'hero--scrolled': isScrolled }" id="intro">
    <!-- Left Column: Personal Info -->
    <div class="hero-left">
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
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 13px;
  letter-spacing: 0.01em;
}

.hero-info li {
  margin-bottom: 5px;
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
