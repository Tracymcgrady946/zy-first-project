<template>
  <nav class="apple-nav">
    <!-- 桌面端：正常展示所有链接 -->
    <a
      v-for="item in items"
      :key="item.href"
      :href="item.href"
      class="nav-link"
    >{{ item.label }}</a>
    <button class="lang-toggle" @click="toggleLocale">
      {{ locale === 'zh-CN' ? 'EN' : '中' }}
    </button>

    <!-- 移动端：右侧汉堡按钮 -->
    <button class="hamburger" :class="{ open: menuOpen }" @click="menuOpen = !menuOpen" aria-label="菜单">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </nav>

  <!-- 移动端下拉菜单 -->
  <Transition name="slide-down">
    <div v-if="menuOpen" class="mobile-menu">
      <a
        v-for="item in items"
        :key="item.href"
        :href="item.href"
        class="mobile-menu-link"
        @click="menuOpen = false"
      >{{ item.label }}</a>
    </div>
  </Transition>

  <!-- 遮罩层 -->
  <Transition name="fade">
    <div v-if="menuOpen" class="mobile-overlay" @click="menuOpen = false"></div>
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
</script>

<style scoped>
.apple-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 48px;
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.02em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transition: background 0.3s ease;
}

.nav-link {
  color: var(--apple-text);
  padding: 10px 14px;
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border-radius: 6px;
  transition: color 0.2s ease, background 0.2s ease;
}

.nav-link:hover {
  color: var(--apple-text);
  background: rgba(255, 255, 255, 0.08);
  text-decoration: none;
}

.lang-toggle {
  margin-left: 8px;
  background: rgba(41, 151, 255, 0.12);
  border: 1px solid rgba(41, 151, 255, 0.35);
  color: var(--apple-link);
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-apple);
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: background 0.2s ease, border-color 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.lang-toggle:hover {
  background: rgba(41, 151, 255, 0.22);
  border-color: rgba(41, 151, 255, 0.6);
}

/* 汉堡按钮 */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.2s ease;
  position: absolute;
  right: 12px;
}

.hamburger:hover {
  background: rgba(255, 255, 255, 0.08);
}

.hamburger span {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--apple-text);
  border-radius: 2px;
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform-origin: center;
}

.hamburger.open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger.open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* 移动端下拉菜单 */
.mobile-menu {
  position: fixed;
  top: 48px;
  left: 0;
  right: 0;
  background: rgba(18, 18, 20, 0.96);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  z-index: 9998;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 8px 0;
}

.mobile-menu-link {
  color: var(--apple-text);
  padding: 14px 24px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.02em;
  transition: background 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.mobile-menu-link:last-child {
  border-bottom: none;
}

.mobile-menu-link:active {
  background: rgba(255, 255, 255, 0.08);
}

/* 遮罩层 */
.mobile-overlay {
  position: fixed;
  inset: 0;
  z-index: 9997;
  background: rgba(0, 0, 0, 0.4);
}

/* 过渡动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 移动端：隐藏普通链接，显示汉堡按钮 */
@media (max-width: 600px) {
  .nav-link {
    display: none;
  }

  .hamburger {
    display: flex;
  }

  .apple-nav {
    justify-content: center;
  }

  .lang-toggle {
    margin-left: 0;
  }
}

/* 桌面端：隐藏下拉菜单相关 */
@media (min-width: 601px) {
  .mobile-menu,
  .mobile-overlay {
    display: none !important;
  }

  .apple-nav a { padding: 8px 10px; min-width: auto; }
}
</style>
