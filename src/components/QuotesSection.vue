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

<style scoped src="@/assets/styles/components/QuotesSection.css"></style>
