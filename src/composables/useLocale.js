import { useI18n } from 'vue-i18n'

export function useLocale() {
  const { locale } = useI18n()

  function toggleLocale() {
    const next = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
    locale.value = next
    localStorage.setItem('locale', next)
    document.documentElement.lang = next === 'zh-CN' ? 'zh-CN' : 'en'
  }

  return { locale, toggleLocale }
}
