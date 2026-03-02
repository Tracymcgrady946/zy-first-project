<template>
  <div class="cal">
    <div class="cal-header">
      <button class="cal-nav" @click="prevMonth" :aria-label="t('calendar.backToToday')">‹</button>
      <span class="cal-title">{{ calendarTitle }}</span>
      <button class="cal-nav" @click="nextMonth">›</button>
    </div>
    <div class="cal-grid">
      <div class="cal-weekday" v-for="d in tm('calendar.weekdays')" :key="d">{{ d }}</div>
      <div
        v-for="(cell, i) in cells"
        :key="i"
        class="cal-cell"
        :class="{
          'cal-cell--empty': !cell.day,
          'cal-cell--today': cell.isToday,
          'cal-cell--holiday': cell.holiday
        }"
        :title="cell.holiday || undefined"
      >
        <span v-if="cell.day">{{ cell.day }}</span>
        <span v-if="cell.holiday" class="cal-holiday-label">{{ cell.holiday }}</span>
      </div>
    </div>
    <div class="cal-footer">
      <button class="cal-today-btn" @click="goToday">{{ t('calendar.backToToday') }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocale } from '@/composables/useLocale.js'
import { getHoliday } from '@/data/holidays.js'

const { t, tm } = useI18n()
const { locale } = useLocale()

const now = new Date()

const year = ref(now.getFullYear())
const month = ref(now.getMonth())
const todayYear = now.getFullYear()
const todayMonth = now.getMonth()
const todayDate = now.getDate()

const calendarTitle = computed(() => {
  const d = new Date(year.value, month.value)
  if (locale.value === 'zh-CN') {
    return `${year.value} 年 ${month.value + 1} 月`
  }
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(d)
})

const cells = computed(() => {
  const firstDay = new Date(year.value, month.value, 1).getDay()
  const daysInMonth = new Date(year.value, month.value + 1, 0).getDate()
  const result = []
  for (let i = 0; i < firstDay; i++) {
    result.push({ day: null, isToday: false, holiday: null })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    result.push({
      day: d,
      isToday: d === todayDate && month.value === todayMonth && year.value === todayYear,
      holiday: getHoliday(locale.value, year.value, month.value, d)
    })
  }
  return result
})

function prevMonth() {
  if (month.value === 0) {
    month.value = 11
    year.value--
  } else {
    month.value--
  }
}

function nextMonth() {
  if (month.value === 11) {
    month.value = 0
    year.value++
  } else {
    month.value++
  }
}

function goToday() {
  year.value = todayYear
  month.value = todayMonth
}
</script>

<style scoped>
.cal {
  margin-top: 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 22px 20px 18px;
  width: 100%;
  box-sizing: border-box;
}

.cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.cal-nav {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--apple-text);
  width: 36px;
  height: 36px;
  border-radius: 10px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  font-family: var(--font-apple);
  -webkit-tap-highlight-color: transparent;
  line-height: 1;
}

.cal-nav:hover {
  background: rgba(255, 255, 255, 0.12);
}

.cal-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--apple-text);
  letter-spacing: 0.02em;
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.cal-weekday {
  font-size: 12px;
  font-weight: 600;
  color: var(--apple-text-secondary);
  text-align: center;
  padding: 4px 0 8px;
  letter-spacing: 0.04em;
}

.cal-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--apple-text);
  border-radius: 50%;
  cursor: default;
  transition: background 0.15s;
  position: relative;
}

.cal-cell:not(.cal-cell--empty):not(.cal-cell--today):hover {
  background: rgba(255, 255, 255, 0.08);
}

.cal-cell--empty {
  pointer-events: none;
}

.cal-cell--today {
  background: var(--apple-link);
  color: #fff;
  font-weight: 700;
}

.cal-cell--today::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 1px solid rgba(41, 151, 255, 0.4);
}

.cal-cell--holiday span:first-child {
  color: #ff6b6b;
}

.cal-cell--today.cal-cell--holiday span:first-child {
  color: #fff;
}

.cal-holiday-label {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 8px;
  color: #ff6b6b;
  white-space: nowrap;
  line-height: 1;
  pointer-events: none;
}

.cal-cell--today .cal-holiday-label {
  color: rgba(255, 255, 255, 0.85);
}

.cal-footer {
  margin-top: 16px;
  text-align: center;
}

.cal-today-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--apple-text-secondary);
  font-size: 13px;
  padding: 6px 18px;
  border-radius: 20px;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
  font-family: var(--font-apple);
  -webkit-tap-highlight-color: transparent;
}

.cal-today-btn:hover {
  border-color: var(--apple-link);
  color: var(--apple-link);
}
</style>
