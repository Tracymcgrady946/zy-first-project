<template>
  <section id="quotes"
    class="quotes-section">
    <div class="quotes-inner">
      <h2 class="quotes-title">{{ title }}</h2>

      <div class="quote-draw">
        <div class="quote-draw__head">
          <div class="quote-draw__copy">
            <p class="quote-draw__label">{{ labels.drawTitle }}</p>
            <p class="quote-draw__sub">{{ labels.drawSubtitle }}</p>
          </div>
          <button type="button"
            class="quote-draw__button"
            @click="drawQuote">
            {{ isDrawn ? labels.redraw : labels.draw }}
          </button>
        </div>

        <div class="quote-card-stage">
          <button type="button"
            class="quote-card"
            :class="{
              'quote-card--drawn': isDrawn,
              'quote-card--spin-first': isShuffling && spinMode === 'first',
              'quote-card--spin-redraw': isShuffling && spinMode === 'redraw'
            }"
            @click="drawQuote">
            <span class="quote-card__rotor">
              <span class="quote-card__face quote-card__face--back">
                <span class="quote-card__flow-border"
                  aria-hidden="true">
                  <span class="quote-card__flow-edge quote-card__flow-edge--top"></span>
                  <span class="quote-card__flow-edge quote-card__flow-edge--right"></span>
                  <span class="quote-card__flow-edge quote-card__flow-edge--bottom"></span>
                  <span class="quote-card__flow-edge quote-card__flow-edge--left"></span>
                  <span class="quote-card__flow-corner quote-card__flow-corner--top-left"></span>
                  <span class="quote-card__flow-corner quote-card__flow-corner--top-right"></span>
                  <span class="quote-card__flow-corner quote-card__flow-corner--bottom-right"></span>
                  <span class="quote-card__flow-corner quote-card__flow-corner--bottom-left"></span>
                </span>
                <span class="quote-card__back-mark">?</span>
                <span class="quote-card__back-title">{{ labels.cardBackTitle }}</span>
                <span class="quote-card__back-sub">{{ labels.cardBackSub }}</span>
              </span>

              <span class="quote-card__face quote-card__face--front">
                <span class="quote-card__flow-border"
                  aria-hidden="true">
                  <span class="quote-card__flow-edge quote-card__flow-edge--top"></span>
                  <span class="quote-card__flow-edge quote-card__flow-edge--right"></span>
                  <span class="quote-card__flow-edge quote-card__flow-edge--bottom"></span>
                  <span class="quote-card__flow-edge quote-card__flow-edge--left"></span>
                  <span class="quote-card__flow-corner quote-card__flow-corner--top-left"></span>
                  <span class="quote-card__flow-corner quote-card__flow-corner--top-right"></span>
                  <span class="quote-card__flow-corner quote-card__flow-corner--bottom-right"></span>
                  <span class="quote-card__flow-corner quote-card__flow-corner--bottom-left"></span>
                </span>
                <span class="quote-card__day">{{ dateParts.day }}</span>
                <span class="quote-card__month">{{ dateParts.month }}</span>
                <span class="quote-card__weekday">{{ dateParts.weekday }}</span>
                <span class="quote-card__divider"></span>
                <span class="quote-card__text"
                  :class="selectedQuoteTextClass">{{ selectedQuoteText || labels.emptyQuote }}</span>
                <span class="quote-card__ornament"
                  aria-hidden="true">
                  <span class="quote-card__ornament-line"></span>
                  <span class="quote-card__ornament-grid"></span>
                </span>
              </span>
            </span>
          </button>
        </div>
      </div>

      <div class="quotes-archive-head">
        <h3 class="quotes-subtitle">{{ labels.archiveTitle }}</h3>
        <button type="button"
          class="quotes-archive-toggle"
          :class="{ 'quotes-archive-toggle--open': archiveExpanded }"
          :aria-expanded="archiveExpanded"
          :aria-label="archiveExpanded ? labels.collapseArchive : labels.expandArchive"
          @click="archiveExpanded = !archiveExpanded">
          <span class="quotes-archive-toggle__icon"
            aria-hidden="true"></span>
        </button>
      </div>

      <div v-show="archiveExpanded"
        class="quotes-list">
        <article v-for="(quote, index) in quotes"
          :key="quote.id || index"
          class="quote-item">
          <span class="quote-index">{{ String(index + 1).padStart(2, '0') }}</span>
          <p class="quote-text">{{ quote.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useLocale } from '@/composables/useLocale.js'
import { api } from '@/api/index.js'

const { locale } = useLocale()

const title = computed(() => locale.value === 'en-US' ? 'Quotes' : '语录')

const quotes = ref([])
const selectedIndex = ref(-1)
const isDrawn = ref(false)
const isShuffling = ref(false)
const archiveExpanded = ref(false)
const spinMode = ref('first')
let shuffleTimer = null

const labels = computed(() => {
  if (locale.value === 'en-US') {
    return {
      drawTitle: 'Draw a Quote',
      drawSubtitle: 'Open a card like a quiet answer book.',
      draw: 'Draw',
      redraw: 'Draw Again',
      cardBackTitle: 'Click to Draw',
      cardBackSub: 'A quote for this moment',
      archiveTitle: 'All Quotes',
      expandArchive: 'Expand all quotes',
      collapseArchive: 'Collapse all quotes',
      emptyQuote: 'Click to draw your quote.'
    }
  }

  return {
    drawTitle: '今日抽一句',
    drawSubtitle: '像答案之书一样，随机翻开一张属于此刻的卡牌。',
    draw: '抽卡',
    redraw: '再抽一张',
    cardBackTitle: '点击抽卡',
    cardBackSub: '一张属于此刻的语录',
    archiveTitle: '全部语录',
    expandArchive: '展开全部语录',
    collapseArchive: '收起全部语录',
    emptyQuote: '点击抽取你的语录。'
  }
})

const dateParts = computed(() => {
  const now = new Date()
  const isEnglish = locale.value === 'en-US'
  return {
    day: String(now.getDate()).padStart(2, '0'),
    month: `${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(now).toUpperCase()} ${now.getFullYear()}`,
    weekday: new Intl.DateTimeFormat(isEnglish ? 'en-US' : 'zh-CN', { weekday: 'long' }).format(now)
  }
})

const selectedQuote = computed(() => quotes.value[selectedIndex.value] || null)
const selectedQuoteText = computed(() => selectedQuote.value?.text || '')
const selectedQuoteTextClass = computed(() => {
  const length = selectedQuoteText.value.length
  if (length > 110) return 'quote-card__text--compact'
  if (length > 90) return 'quote-card__text--medium'
  return ''
})

function drawQuote () {
  if (!quotes.value.length || isShuffling.value) return

  let nextIndex = Math.floor(Math.random() * quotes.value.length)
  if (quotes.value.length > 1) {
    while (nextIndex === selectedIndex.value) {
      nextIndex = Math.floor(Math.random() * quotes.value.length)
    }
  }

  clearTimeout(shuffleTimer)
  spinMode.value = isDrawn.value ? 'redraw' : 'first'
  isShuffling.value = true
  selectedIndex.value = nextIndex
  isDrawn.value = true
  shuffleTimer = setTimeout(() => {
    isShuffling.value = false
  }, 760)
}

async function loadQuotes () {
  try {
    quotes.value = await api.getQuotes(locale.value)
    selectedIndex.value = -1
    isDrawn.value = false
  } catch (error) {
    console.error('Failed to load quotes:', error)
    quotes.value = []
  }
}

watch(locale, loadQuotes)
onMounted(loadQuotes)
onBeforeUnmount(() => {
  clearTimeout(shuffleTimer)
})
</script>

<style scoped>
.quotes-section {
  width: 100%;
  background: #080808;
  padding: 72px 18px 96px;
  padding-left: calc(18px + env(safe-area-inset-left));
  padding-right: calc(18px + env(safe-area-inset-right));
  padding-bottom: calc(96px + env(safe-area-inset-bottom));
}

.quotes-inner {
  max-width: 980px;
  margin: 0 auto;
}

.quotes-title {
  font-size: clamp(24px, 3.5vw, 32px);
  font-weight: 600;
  letter-spacing: 0;
  margin: 0 0 12px;
  text-align: center;
  background: linear-gradient(90deg, #f5f5f7 0%, #6ee7b7 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.quote-draw {
  margin: 34px 0 44px;
}

.quote-draw__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 20px;
}

.quote-draw__copy {
  min-width: 0;
}

.quote-draw__label {
  margin: 0 0 6px;
  color: rgba(245, 245, 247, 0.94);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0;
}

.quote-draw__sub {
  margin: 0;
  color: var(--apple-text-secondary);
  font-size: 14px;
  line-height: 1.55;
}

.quote-draw__button {
  flex: 0 0 auto;
  border: 1px solid rgba(110, 231, 183, 0.42);
  border-radius: 999px;
  background: rgba(110, 231, 183, 0.1);
  color: #9ff6d1;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}

.quote-draw__button:hover {
  border-color: rgba(110, 231, 183, 0.7);
  background: rgba(110, 231, 183, 0.16);
  transform: translateY(-1px);
}

.quote-card-stage {
  display: flex;
  justify-content: center;
  perspective: 1100px;
  padding: 12px 0 30px;
}

.quote-card {
  position: relative;
  display: block;
  width: min(100%, 430px);
  min-height: 520px;
  border: 0;
  border-radius: 18px;
  padding: 0;
  background: transparent;
  cursor: pointer;
  transform: rotateX(6deg) rotateY(-6deg);
  transform-style: preserve-3d;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  touch-action: manipulation;
}

.quote-card:hover {
  transform: rotateX(4deg) rotateY(-4deg) translateY(-3px);
}

.quote-card__rotor {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform: rotateY(0deg);
  transition: transform 0.64s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.quote-card--drawn .quote-card__rotor {
  transform: rotateY(180deg);
}

.quote-card--spin-first .quote-card__rotor {
  animation: quote-card-first-spin 0.72s cubic-bezier(0.18, 0.9, 0.22, 1) both;
}

.quote-card--spin-redraw .quote-card__rotor {
  animation: quote-card-redraw-spin 0.72s cubic-bezier(0.18, 0.9, 0.22, 1) both;
}

@keyframes quote-card-first-spin {
  0% {
    transform: rotateY(0deg);
  }

  54% {
    transform: rotateY(330deg);
  }

  100% {
    transform: rotateY(540deg);
  }
}

@keyframes quote-card-redraw-spin {
  0% {
    transform: rotateY(180deg);
  }

  54% {
    transform: rotateY(420deg);
  }

  100% {
    transform: rotateY(540deg);
  }
}

.quote-card__face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  backface-visibility: hidden;
  isolation: isolate;
  box-shadow:
    0 34px 74px rgba(0, 0, 0, 0.62),
    inset 0 1px 0 rgba(255, 255, 255, 0.16);
}

.quote-card__face::before {
  content: "";
  position: absolute;
  inset: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  pointer-events: none;
  z-index: 2;
}

.quote-card__flow-border {
  position: absolute;
  inset: 5px;
  pointer-events: none;
  z-index: 3;
}

.quote-card__flow-edge {
  position: absolute;
  display: block;
  overflow: hidden;
  background: rgba(110, 231, 183, 0.28);
  box-shadow: 0 0 10px rgba(110, 231, 183, 0.24);
}

.quote-card__flow-edge::after {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.95;
  filter:
    drop-shadow(0 0 4px rgba(255, 255, 255, 0.72))
    drop-shadow(0 0 9px rgba(110, 231, 183, 0.9));
}

.quote-card__flow-edge--top,
.quote-card__flow-edge--bottom {
  left: 18px;
  right: 18px;
  height: 2px;
}

.quote-card__flow-edge--top {
  top: 0;
}

.quote-card__flow-edge--bottom {
  bottom: 0;
}

.quote-card__flow-edge--left,
.quote-card__flow-edge--right {
  top: 18px;
  bottom: 18px;
  width: 2px;
}

.quote-card__flow-edge--left {
  left: 0;
}

.quote-card__flow-edge--right {
  right: 0;
}

.quote-card__flow-edge--top::after,
.quote-card__flow-edge--bottom::after {
  background: linear-gradient(
    90deg,
    transparent 0%,
    #b9ffe4 18%,
    #ffffff 24%,
    #6ee7b7 32%,
    transparent 48%,
    transparent 100%
  );
  background-size: 230% 100%;
  animation: quote-card-flow-x 2.1s linear infinite;
}

.quote-card__flow-edge--bottom::after {
  animation-delay: -1.05s;
}

.quote-card__flow-edge--left::after,
.quote-card__flow-edge--right::after {
  background: linear-gradient(
    180deg,
    transparent 0%,
    #b9ffe4 18%,
    #ffffff 24%,
    #6ee7b7 32%,
    transparent 48%,
    transparent 100%
  );
  background-size: 100% 230%;
  animation: quote-card-flow-y 2.1s linear infinite;
}

.quote-card__flow-edge--right::after {
  animation-delay: -0.52s;
}

.quote-card__flow-edge--left::after {
  animation-delay: -1.57s;
}

.quote-card__flow-corner {
  position: absolute;
  width: 38px;
  height: 38px;
  overflow: hidden;
  border-radius: 18px;
}

.quote-card__flow-corner::before,
.quote-card__flow-corner::after {
  content: "";
  position: absolute;
  width: 34px;
  height: 34px;
  border: 2px solid rgba(110, 231, 183, 0.32);
  border-radius: 18px;
}

.quote-card__flow-corner::before {
  filter: drop-shadow(0 0 5px rgba(110, 231, 183, 0.35));
}

.quote-card__flow-corner::after {
  border-color: rgba(255, 255, 255, 0.88);
  opacity: 0.95;
  filter:
    drop-shadow(0 0 5px rgba(255, 255, 255, 0.78))
    drop-shadow(0 0 11px rgba(110, 231, 183, 0.94));
  animation: quote-card-corner-flow 2.1s linear infinite;
}

.quote-card__flow-corner--top-left {
  top: 0;
  left: 0;
}

.quote-card__flow-corner--top-left::before,
.quote-card__flow-corner--top-left::after {
  top: 0;
  left: 0;
  border-right-color: transparent;
  border-bottom-color: transparent;
}

.quote-card__flow-corner--top-right {
  top: 0;
  right: 0;
}

.quote-card__flow-corner--top-right::before,
.quote-card__flow-corner--top-right::after {
  top: 0;
  right: 0;
  border-bottom-color: transparent;
  border-left-color: transparent;
}

.quote-card__flow-corner--bottom-right {
  right: 0;
  bottom: 0;
}

.quote-card__flow-corner--bottom-right::before,
.quote-card__flow-corner--bottom-right::after {
  right: 0;
  bottom: 0;
  border-top-color: transparent;
  border-left-color: transparent;
}

.quote-card__flow-corner--bottom-left {
  bottom: 0;
  left: 0;
}

.quote-card__flow-corner--bottom-left::before,
.quote-card__flow-corner--bottom-left::after {
  bottom: 0;
  left: 0;
  border-top-color: transparent;
  border-right-color: transparent;
}

.quote-card__flow-corner--top-right::after {
  animation-delay: -0.52s;
}

.quote-card__flow-corner--bottom-right::after {
  animation-delay: -1.05s;
}

.quote-card__flow-corner--bottom-left::after {
  animation-delay: -1.57s;
}

@keyframes quote-card-flow-x {
  to {
    background-position: -230% 0;
  }
}

@keyframes quote-card-flow-y {
  to {
    background-position: 0 -230%;
  }
}

@keyframes quote-card-corner-flow {
  0%,
  38% {
    opacity: 0.18;
  }

  48% {
    opacity: 1;
  }

  58% {
    opacity: 0.18;
  }

  100% {
    opacity: 0.18;
  }
}

.quote-card__face--back {
  justify-content: center;
  gap: 16px;
  background:
    radial-gradient(circle at 50% 28%, rgba(110, 231, 183, 0.24), transparent 32%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.02) 36%),
    linear-gradient(155deg, #1c1d1f 0%, #101112 52%, #070708 100%);
  color: #f5f5f7;
  transform: rotateY(0deg);
}

.quote-card__face--front {
  align-items: stretch;
  padding: 38px 34px 32px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.02) 35%),
    radial-gradient(circle at 20% 10%, rgba(110, 231, 183, 0.22), transparent 36%),
    linear-gradient(155deg, #1c1d1f 0%, #101112 52%, #070708 100%);
  color: #f5f5f7;
  transform: rotateY(180deg);
}

.quote-card__back-mark {
  color: rgba(110, 231, 183, 0.85);
  font-size: 92px;
  font-weight: 800;
  line-height: 1;
  text-shadow: 0 18px 46px rgba(110, 231, 183, 0.28);
}

.quote-card__back-title {
  color: rgba(245, 245, 247, 0.92);
  font-size: 22px;
  font-weight: 750;
  letter-spacing: 0;
}

.quote-card__back-sub {
  color: rgba(245, 245, 247, 0.48);
  font-size: 14px;
  line-height: 1.5;
}

.quote-card__day,
.quote-card__month,
.quote-card__weekday,
.quote-card__text,
.quote-card__ornament {
  position: relative;
  z-index: 1;
}

.quote-card__day {
  color: rgba(255, 255, 255, 0.92);
  font-size: 80px;
  font-weight: 820;
  line-height: 0.95;
  text-align: center;
}

.quote-card__month {
  margin-top: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 20px;
  font-weight: 750;
  letter-spacing: 0.09em;
  text-align: center;
}

.quote-card__weekday {
  margin-top: 12px;
  color: rgba(255, 255, 255, 0.48);
  font-size: 15px;
  font-weight: 650;
  text-align: center;
}

.quote-card__divider {
  position: relative;
  z-index: 1;
  width: 82px;
  height: 1px;
  margin: 34px auto 34px;
  background: linear-gradient(90deg, transparent, rgba(110, 231, 183, 0.82), transparent);
}

.quote-card__text {
  display: block;
  color: #f4f1ec;
  background: linear-gradient(135deg, #ffffff 0%, #dff8ee 42%, #6ee7b7 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 24px;
  font-weight: 730;
  line-height: 1.78;
  letter-spacing: 0;
  text-align: left;
}

.quote-card__text--medium {
  font-size: 20px;
  line-height: 1.72;
}

.quote-card__text--compact {
  font-size: 15px;
  line-height: 1.58;
  font-weight: 680;
}

.quote-card__ornament {
  display: grid;
  place-items: center;
  gap: 14px;
  width: 100%;
  margin-top: auto;
  padding-top: 30px;
}

.quote-card__ornament-line {
  position: relative;
  display: block;
  width: min(72%, 230px);
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(110, 231, 183, 0.16) 18%,
    rgba(255, 255, 255, 0.42) 50%,
    rgba(110, 231, 183, 0.16) 82%,
    transparent 100%
  );
}

.quote-card__ornament-line::before,
.quote-card__ornament-line::after {
  content: "";
  position: absolute;
  top: -3px;
  width: 28px;
  height: 7px;
  border-top: 1px solid rgba(110, 231, 183, 0.34);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.quote-card__ornament-line::before {
  left: 18%;
  transform: skewX(-28deg);
}

.quote-card__ornament-line::after {
  right: 18%;
  transform: skewX(28deg);
}

.quote-card__ornament-grid {
  display: block;
  width: min(54%, 168px);
  height: 28px;
  opacity: 0.72;
  background-image:
    radial-gradient(circle, rgba(110, 231, 183, 0.28) 0 1px, transparent 1.6px),
    linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.07), transparent);
  background-size: 14px 10px, 100% 1px;
  background-position: center, center;
  mask-image: linear-gradient(90deg, transparent 0%, #000 18%, #000 82%, transparent 100%);
}

.quotes-archive-head {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  margin-bottom: 16px;
}

.quotes-subtitle {
  margin: 0;
  color: rgba(245, 245, 247, 0.88);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0;
}

.quotes-archive-toggle {
  position: relative;
  display: inline-grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid rgba(110, 231, 183, 0.34);
  border-radius: 50%;
  background: rgba(110, 231, 183, 0.08);
  color: #9ff6d1;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.quotes-archive-toggle:hover {
  border-color: rgba(110, 231, 183, 0.62);
  background: rgba(110, 231, 183, 0.14);
  transform: translateY(-1px);
}

.quotes-archive-toggle__icon {
  width: 8px;
  height: 8px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: translateY(-2px) rotate(45deg);
  transition: transform 0.22s ease;
}

.quotes-archive-toggle--open .quotes-archive-toggle__icon {
  transform: translateY(2px) rotate(225deg);
}

.quotes-list {
  display: grid;
  gap: 14px;
}

.quote-item {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  gap: 18px;
  padding: 22px 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
}

.quote-index {
  color: #6ee7b7;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1.8;
}

.quote-text {
  color: var(--apple-text);
  font-size: 16px;
  line-height: 1.85;
  letter-spacing: 0;
  margin: 0;
}

@media (max-width: 640px) {
  .quotes-section {
    padding-top: 56px;
    padding-bottom: calc(72px + env(safe-area-inset-bottom));
  }

  .quote-draw {
    margin-top: 30px;
    margin-bottom: 36px;
  }

  .quote-draw__head {
    gap: 14px;
  }

  .quote-draw__label {
    font-size: 19px;
  }

  .quote-draw__sub {
    font-size: 13px;
  }

  .quote-draw__button {
    padding: 9px 14px;
    font-size: 13px;
  }

  .quote-card-stage {
    padding-bottom: 22px;
  }

  .quote-card {
    min-height: 532px;
  }

  .quote-card__face--front {
    padding: 34px 28px 30px;
  }

  .quote-card__day {
    font-size: 76px;
  }

  .quote-card__month {
    font-size: 19px;
  }

  .quote-card__divider {
    margin-top: 32px;
    margin-bottom: 32px;
  }

  .quote-card__text {
    font-size: 21px;
    line-height: 1.72;
  }

  .quote-card__text--medium {
    font-size: 18px;
    line-height: 1.68;
  }

  .quote-card__text--compact {
    font-size: 14px;
    line-height: 1.54;
  }

  .quote-item {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 18px 16px;
  }

  .quote-text {
    font-size: 15px;
    line-height: 1.8;
  }
}
</style>
