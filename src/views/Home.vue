<template>
  <div class="page-home">
    <AppNav :items="navItems" />
    <ScrollReveal :skip="true">
      <HeroSection v-if="hero"
        :hero="hero"
        @photo-error="onHeroPhotoError" />
    </ScrollReveal>

    <!-- About (project experience) section -->
    <ScrollReveal v-if="aboutSection">
      <SectionBlock :section-id="aboutSection.id"
        :title="aboutSection.title"
        :description="aboutSection.description"
        :theme="aboutSection.theme">
        <ProjectTimeline />
      </SectionBlock>
    </ScrollReveal>

    <!-- Reading / Bookshelf section -->
    <ScrollReveal>
      <BookshelfSection :section="readingSection" />
    </ScrollReveal>

    <!-- Remaining standalone sections -->
    <ScrollReveal v-for="section in sectionsMiddle"
      :key="section.id">
      <SectionBlock :section-id="section.id"
        :title="section.title"
        :description="section.description"
        :theme="section.theme">
        <SkillsTable v-if="section.id === 'skills'" />
      </SectionBlock>
    </ScrollReveal>

    <ScrollReveal>
      <AiDynamics :section="contactSection" />
    </ScrollReveal>

    <ScrollReveal eager>
      <QuotesSection />
    </ScrollReveal>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useLocale } from '@/composables/useLocale.js'
import { api } from '@/api/index.js'
import AppNav from '@/components/AppNav.vue'
import HeroSection from '@/components/HeroSection.vue'
import SectionBlock from '@/components/SectionBlock.vue'
import ScrollReveal from '@/components/ScrollReveal.vue'
import SkillsTable from '@/components/SkillsTable.vue'
import ProjectTimeline from '@/components/ProjectTimeline.vue'
import BookshelfSection from '@/components/BookshelfSection.vue'
import AiDynamics from '@/components/AiDynamics.vue'
import QuotesSection from '@/components/QuotesSection.vue'

const { locale } = useLocale()
const REMOVED_SECTION_IDS = ['weather', 'calendar', 'dream-car']
const skillsSection = computed(() => {
  if (locale.value === 'en-US') {
    return {
      id: 'skills',
      title: 'My Skills',
      description: 'A local inventory of Codex skills installed on this machine.',
      theme: 'skills'
    }
  }

  return {
    id: 'skills',
    title: '我的 Skill',
    description: '一个完整的 Skill 通常包含简短的描述、详细的执行指南、检查标准，甚至包含自动化脚本。',
    theme: 'skills'
  }
})

const profileData = ref(null)
const navItems = ref([])
const sections = ref([])
const siteConfig = ref({})
let initialScrollFixed = false

const hero = computed(() => {
  if (!profileData.value) return null
  const p = profileData.value
  return {
    name: p.name,
    role: p.role,
    introLines: p.introLines,
    infoList: p.infoList,
    photoUrl: p.photo_url,
    photoAlt: p.name,
    typewriterSpeed: Number(siteConfig.value.typewriter_speed) || 100,
    typewriterStartAfter: Number(siteConfig.value.typewriter_start_after) || 800,
    showCursor: siteConfig.value.typewriter_show_cursor === 'true',
  }
})

const aboutSection = computed(() =>
  sections.value.find(s => s.id === 'about') || null
)

const readingSection = computed(() =>
  sections.value.find(s => s.id === 'reading') || null
)

const sectionsMiddle = computed(() =>
  sections.value.filter(s => !['about', 'contact', 'reading'].includes(s.id))
)

const contactSection = computed(() =>
  sections.value.find(s => s.id === 'contact') || null
)

async function loadData () {
  try {
    const [profile, nav, secs, config] = await Promise.all([
      api.getProfile(locale.value),
      api.getNav(locale.value),
      api.getSections(locale.value),
      api.getConfig(),
    ])
    profileData.value = profile
    navItems.value = normalizeNav(nav)
    sections.value = normalizeSections(secs)
    siteConfig.value = config
    await nextTick()
    resetPlainEntryScroll()
  } catch (e) {
    console.error('Failed to load page data:', e)
  }
}

function resetPlainEntryScroll () {
  if (initialScrollFixed || window.location.hash) return
  initialScrollFixed = true

  const root = document.documentElement
  const previousScrollBehavior = root.style.scrollBehavior

  const reset = () => {
    root.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
    root.scrollTop = 0
    document.body.scrollTop = 0
  }

  reset()
  requestAnimationFrame(() => {
    reset()
    setTimeout(reset, 120)
    setTimeout(() => {
      root.style.scrollBehavior = previousScrollBehavior
    }, 180)
  })
}

function normalizeNav (nav) {
  const filtered = nav.filter(item =>
    !REMOVED_SECTION_IDS.some(id => item.href === `#${id}`)
  )
  if (filtered.some(item => item.href === '#skills')) return filtered

  const skillItem = {
    label: locale.value === 'en-US' ? 'Skills' : 'Skill',
    href: '#skills'
  }
  const readingIndex = filtered.findIndex(item => item.href === '#reading')
  const insertIndex = readingIndex >= 0 ? readingIndex + 1 : filtered.length
  return [
    ...filtered.slice(0, insertIndex),
    skillItem,
    ...filtered.slice(insertIndex)
  ]
}

function normalizeSections (secs) {
  const filtered = secs.filter(section => !REMOVED_SECTION_IDS.includes(section.id))
  if (filtered.some(section => section.id === 'skills')) return filtered

  const readingIndex = filtered.findIndex(section => section.id === 'reading')
  const insertIndex = readingIndex >= 0 ? readingIndex + 1 : filtered.length
  return [
    ...filtered.slice(0, insertIndex),
    skillsSection.value,
    ...filtered.slice(insertIndex)
  ]
}

function onHeroPhotoError () {
  if (profileData.value) {
    profileData.value = { ...profileData.value, photo_url: '/avatar.svg' }
  }
}

watch(locale, loadData)
onMounted(loadData)
</script>

<style scoped>
.page-home {
  min-height: 100vh;
}
</style>
