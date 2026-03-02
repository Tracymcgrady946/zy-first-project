<template>
  <nav class="apple-nav">
    <a
      v-for="item in items"
      :key="item.href"
      :href="item.href"
    >{{ item.label }}</a>
    <button class="lang-toggle" @click="toggleLocale">
      {{ locale === 'zh-CN' ? 'EN' : '中' }}
    </button>
  </nav>
</template>

<script setup>
import { useLocale } from '@/composables/useLocale.js'

defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

const { locale, toggleLocale } = useLocale()
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

.apple-nav a {
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

@media (min-width: 480px) {
  .apple-nav { gap: 2px; }
  .apple-nav a { padding: 8px 10px; min-width: auto; }
}

.apple-nav a:hover {
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
</style>
