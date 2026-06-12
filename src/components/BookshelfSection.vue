<template>
  <section id="reading"
    class="reading-section">
    <!-- Section header -->
    <div class="reading-header">
      <h2 class="reading-title">{{ section?.title }}</h2>
      <p class="reading-desc">{{ section?.description }}</p>
    </div>

    <!-- Bookshelf layout -->
    <div class="reading-layout">
      <!-- ─── Left: Bookshelf ─── -->
      <div class="bs-shelf-area" ref="shelfRef">
        <!-- Hanging lamp fixture -->
        <div class="bs-lamp">
          <div class="bs-wire"></div>
          <div class="bs-shade"></div>
          <div class="bs-glow"></div>
        </div>

        <!-- Warm light cone -->
        <div class="bs-light-beam"
          aria-hidden="true"></div>

        <!-- Shelf cabinet -->
        <div class="bs-cabinet">
          <!-- Top shelf row -->
          <div class="bs-row">
            <div v-for="book in rows[0]"
              :key="book.id"
              class="bs-book"
              :class="{ 'bs-book--active': activeId === book.id }"
              :style="{ '--bc': book.color, '--bh': book.height + 'px', '--bw': book.width + 'px' }"
              :title="book.title"
              @click="select(book)">
              <span class="bs-spine">{{ book.title }}</span>
            </div>
          </div>
          <div class="bs-plank"></div>

          <!-- Bottom shelf row -->
          <div class="bs-row">
            <div v-for="book in rows[1]"
              :key="book.id"
              class="bs-book"
              :class="{ 'bs-book--active': activeId === book.id }"
              :style="{ '--bc': book.color, '--bh': book.height + 'px', '--bw': book.width + 'px' }"
              :title="book.title"
              @click="select(book)">
              <span class="bs-spine">{{ book.title }}</span>
            </div>
          </div>
          <div class="bs-plank"></div>
        </div>
      </div>

      <!-- ─── Right: Book detail panel ─── -->
      <div class="bs-detail-area"
        ref="detailRef"
        :style="detailStyle">
        <Transition name="bs-slide"
          mode="out-in">
          <div v-if="activeBook"
            :key="activeBook.id"
            class="bs-card">
            <!-- Fixed header: cover banner + book metadata -->
            <div class="bs-card-head">
              <div class="bs-cover"
                :style="{ background: `linear-gradient(150deg, ${activeBook.color}f2 0%, ${activeBook.color}80 65%, rgba(0,0,0,0.5) 100%)` }">
                <div class="bs-cover-copy">
                  <p class="bs-cover-title">{{ activeBook.title }}</p>
                  <p class="bs-cover-author">{{ activeBook.author }}</p>
                </div>
                <div class="bs-book-stat bs-book-stat--overlay">
                  <span class="bs-year">{{ activeBook.year }} 读完</span>
                  <div class="bs-rating">
                    <span v-for="n in 5"
                      :key="n"
                      class="bs-star"
                      :class="{ lit: n <= activeBook.rating }">★</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Scrollable body: intro + notes -->
            <div class="bs-card-body">
              <div class="bs-block">
                <h4 class="bs-block-label">内容简介</h4>
                <p class="bs-block-text">{{ activeBook.intro }}</p>
              </div>

              <div class="bs-block">
                <h4 class="bs-block-label">读后感 · 笔记</h4>
                <p class="bs-block-text">{{ activeBook.notes }}</p>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else
            class="bs-empty">
            <span class="bs-empty-icon">📚</span>
            <p class="bs-empty-hint">点击书架上的书籍</p>
            <p class="bs-empty-sub">探索读书笔记与感想</p>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { api } from '@/api/index.js'

defineProps({
  section: {
    type: Object,
    default: null
  }
})

const books = ref([])

async function loadBooks() {
  try {
    books.value = await api.getBooks()
  } catch (e) {
    console.error('Failed to load books:', e)
  }
}

onMounted(loadBooks)

const rows = computed(() => {
  const list = books.value
  return [list.slice(0, 4), list.slice(4)]
})
const activeId = ref(null)
const activeBook = computed(() => books.value.find(b => b.id === activeId.value) || null)

async function select (book) {
  const isOpening = activeId.value !== book.id
  activeId.value = isOpening ? book.id : null

  if (isOpening) {
    await nextTick()
    revealDetailOnMobile()
  }
}

const shelfRef = ref(null)
const detailRef = ref(null)
const shelfHeight = ref(0)

function syncHeight () {
  if (shelfRef.value) {
    shelfHeight.value = shelfRef.value.offsetHeight
  }
}

const detailStyle = computed(() =>
  shelfHeight.value > 0 ? { height: shelfHeight.value + 'px' } : {}
)

function revealDetailOnMobile () {
  if (!window.matchMedia('(max-width: 680px)').matches || !detailRef.value) return

  detailRef.value.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

let ro = null
onMounted(() => {
  syncHeight()
  ro = new ResizeObserver(syncHeight)
  if (shelfRef.value) ro.observe(shelfRef.value)
})
onUnmounted(() => { if (ro) ro.disconnect() })
</script>

<style scoped src="@/assets/styles/components/BookshelfSection.css"></style>
