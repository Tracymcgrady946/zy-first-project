<template>
  <div class="page-home">
    <AppNav :items="navItems" />
    <ScrollReveal>
      <HeroSection :hero="hero"
        @photo-error="onHeroPhotoError" />
    </ScrollReveal>
    <ScrollReveal v-for="section in sectionsBeforeDreamCar"
      :key="section.id">
      <SectionBlock :section-id="section.id"
        :title="section.title"
        :description="section.description"
        :theme="section.theme"
        :tech-links="section.techLinks">
        <ProjectTimeline v-if="section.id === 'about'" />
        <WeatherWidget v-if="section.id === 'weather'" />
        <CalendarWidget v-if="section.id === 'calendar'" />
      </SectionBlock>
    </ScrollReveal>
    <DreamCarSection />
    <ScrollReveal v-for="section in sectionsAfterDreamCar"
      :key="section.id">
      <SectionBlock :section-id="section.id"
        :title="section.title"
        :description="section.description"
        :theme="section.theme"
        :tech-links="section.techLinks">
      </SectionBlock>
    </ScrollReveal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppNav from '@/components/AppNav.vue'
import HeroSection from '@/components/HeroSection.vue'
import SectionBlock from '@/components/SectionBlock.vue'
import ScrollReveal from '@/components/ScrollReveal.vue'
import WeatherWidget from '@/components/WeatherWidget.vue'
import CalendarWidget from '@/components/CalendarWidget.vue'
import DreamCarSection from '@/components/DreamCarSection.vue'
import ProjectTimeline from '@/components/ProjectTimeline.vue'
import { typewriterConfig, sectionConfig } from '@/config/profile.js'
import heroPhoto from '@/assets/img/elon_musk_PNG43.png'

const { t, tm } = useI18n()

const photoUrl = ref(heroPhoto)

const navItems = computed(() => [
  { label: t('nav.intro'), href: '#intro' },
  { label: t('nav.about'), href: '#about' },
  { label: t('nav.weather'), href: '#weather' },
  { label: t('nav.calendar'), href: '#calendar' },
  { label: t('nav.dreamCar'), href: '#dream-car' },
  { label: t('nav.contact'), href: '#contact' }
])

const hero = computed(() => ({
  name: t('hero.name'),
  role: t('hero.role'),
  introLines: tm('hero.introLines'),
  infoList: [
    { icon: '♂',  label: t('hero.infoGender.label'),    value: t('hero.infoGender.value') },
    { icon: '✦',  label: t('hero.infoHobbies.label'),   value: t('hero.infoHobbies.value') },
    { icon: '◎',  label: t('hero.infoLocation.label'),  value: t('hero.infoLocation.value') },
    { icon: '✈',  label: t('hero.infoFavCities.label'), value: t('hero.infoFavCities.value') },
    { icon: '◈',  label: t('hero.infoGoals.label'),     value: t('hero.infoGoals.value') },
    { icon: '@',  label: 'Email', value: 'xx@gmail.com', href: 'mailto:xx@gmail.com' }
  ],
  photoUrl: photoUrl.value,
  photoAlt: t('hero.name'),
  typewriterSpeed: typewriterConfig.speed,
  typewriterStartAfter: typewriterConfig.startAfter,
  showCursor: typewriterConfig.showCursor
}))

const allSections = computed(() =>
  sectionConfig.map(cfg => ({
    ...cfg,
    title: t(`section.${cfg.id}.title`),
    description: t(`section.${cfg.id}.description`)
  }))
)

const sectionsBeforeDreamCar = computed(() =>
  allSections.value.filter(s => s.id !== 'contact')
)

const sectionsAfterDreamCar = computed(() =>
  allSections.value.filter(s => s.id === 'contact')
)

function onHeroPhotoError () {
  photoUrl.value = '/avatar.svg'
}
</script>

<style scoped>
.page-home {
  min-height: 100vh;
}
</style>
