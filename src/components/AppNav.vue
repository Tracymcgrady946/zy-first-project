<template>
  <nav class="apple-nav">
    <!-- 桌面端：正常展示所有链接 -->
    <a v-for="item in items"
      :key="item.href"
      :href="item.href"
      class="nav-link"
      @click.prevent="onNavClick(item.href)">{{ item.label }}</a>
    <button class="lang-toggle"
      @click="toggleLocale">
      {{ locale === 'zh-CN' ? 'EN' : '中' }}
    </button>

    <!-- 移动端：右侧汉堡按钮 -->
    <button class="hamburger"
      :class="{ open: menuOpen }"
      @click="menuOpen = !menuOpen"
      aria-label="菜单">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </nav>

  <!-- 移动端下拉菜单 -->
  <Transition name="slide-down">
    <div v-if="menuOpen"
      class="mobile-menu">
      <a v-for="item in items"
        :key="item.href"
        :href="item.href"
        class="mobile-menu-link"
        @click.prevent="onMobileNavClick(item.href)">{{ item.label }}</a>
    </div>
  </Transition>

  <!-- 遮罩层 -->
  <Transition name="fade">
    <div v-if="menuOpen"
      class="mobile-overlay"
      @click="menuOpen = false"></div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import { useLocale } from '@/composables/useLocale.js'

defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

const { locale, toggleLocale } = useLocale()
const menuOpen = ref(false)
const REVEAL_SECTIONS_EVENT = 'app:reveal-sections'

function scrollToHref (href, delay = 0) {
  if (!href?.startsWith('#')) return

  const id = href.slice(1)
  window.dispatchEvent(new CustomEvent(REVEAL_SECTIONS_EVENT))

  setTimeout(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (!el) return

        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        history.pushState(null, '', href)

        setTimeout(() => {
          el.scrollIntoView({ behavior: 'auto', block: 'start' })
        }, 700)
      })
    })
  }, delay)
}

function onNavClick (href) {
  scrollToHref(href)
}

function onMobileNavClick (href) {
  menuOpen.value = false
  scrollToHref(href, 300)
}
</script>

<style scoped src="@/assets/styles/components/AppNav.css"></style>
