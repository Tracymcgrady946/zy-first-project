<template>
  <div class="ww">
    <div v-if="loading" class="ww-status">
      <div class="ww-spinner"></div>
      <span>{{ t('weather.loading') }}</span>
    </div>
    <div v-else-if="error" class="ww-status ww-error">
      <span>{{ error }}</span>
      <button class="ww-btn" @click="fetchWeather(lat, lon)">{{ t('weather.retry') }}</button>
    </div>
    <template v-else>
      <div class="ww-header">
        <span class="ww-place">📍 {{ locationName }}</span>
        <button class="ww-locate" @click="locateAndFetch" :disabled="locating">
          {{ locating ? t('weather.locating') : t('weather.myLocation') }}
        </button>
      </div>
      <div class="ww-scroll">
        <div
          v-for="(day, i) in forecastDisplay"
          :key="i"
          class="ww-day"
          :class="{ 'ww-day--today': i === 0 }"
        >
          <div class="ww-weekday">{{ i === 0 ? t('weather.today') : day.weekday }}</div>
          <div class="ww-date">{{ day.date }}</div>
          <div class="ww-icon">{{ day.icon }}</div>
          <div class="ww-desc">{{ day.desc }}</div>
          <div class="ww-temp">
            <span class="ww-max">{{ day.max }}°</span>
            <span class="ww-min">{{ day.min }}°</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocale } from '@/composables/useLocale.js'

const { t } = useI18n()
const { locale } = useLocale()

const DEFAULT_LAT = 31.2304
const DEFAULT_LON = 121.4737

// 天气代码 → 语义 key（与 JSON 中 weather.desc.* 对应）
const WEATHER_ICONS = {
  clear: '☀️', partlyCloudy: '🌤️', overcast: '☁️',
  fog: '🌫️', drizzle: '🌦️', rain: '🌧️',
  freezingRain: '🌨️', snow: '❄️', showers: '🌦️',
  snowShowers: '🌨️', thunderstorm: '⛈️'
}

function getWeatherKey(code) {
  if (code === 0) return 'clear'
  if (code <= 2) return 'partlyCloudy'
  if (code === 3) return 'overcast'
  if (code <= 48) return 'fog'
  if (code <= 55) return 'drizzle'
  if (code <= 65) return 'rain'
  if (code <= 67) return 'freezingRain'
  if (code <= 77) return 'snow'
  if (code <= 82) return 'showers'
  if (code <= 86) return 'snowShowers'
  return 'thunderstorm'
}

const loading = ref(true)
const error = ref(null)
const rawForecast = ref([])
const isDefaultLocation = ref(true)
const customLocationName = ref('')
const lat = ref(DEFAULT_LAT)
const lon = ref(DEFAULT_LON)
const locating = ref(false)

const locationName = computed(() =>
  isDefaultLocation.value ? t('weather.defaultCity') : customLocationName.value
)

const forecastDisplay = computed(() =>
  rawForecast.value.map(item => {
    const key = getWeatherKey(item.code)
    return {
      ...item,
      weekday: new Intl.DateTimeFormat(locale.value, { weekday: 'short' }).format(new Date(item.dateStr)),
      icon: WEATHER_ICONS[key],
      desc: t(`weather.desc.${key}`)
    }
  })
)

async function fetchWeather(latVal, lonVal) {
  loading.value = true
  error.value = null
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${latVal}&longitude=${lonVal}` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
      `&timezone=auto&forecast_days=15`
    const res = await fetch(url)
    if (!res.ok) throw new Error(t('weather.unavailable'))
    const data = await res.json()
    rawForecast.value = data.daily.time.map((dateStr, i) => {
      const d = new Date(dateStr)
      return {
        dateStr,
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        code: data.daily.weather_code[i],
        max: Math.round(data.daily.temperature_2m_max[i]),
        min: Math.round(data.daily.temperature_2m_min[i])
      }
    })
  } catch (e) {
    error.value = e.message || t('weather.fetchFail')
  } finally {
    loading.value = false
  }
}

function locateAndFetch() {
  if (!navigator.geolocation) {
    error.value = t('weather.noGeo')
    return
  }
  locating.value = true
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      lat.value = pos.coords.latitude
      lon.value = pos.coords.longitude
      isDefaultLocation.value = false
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse` +
          `?lat=${lat.value}&lon=${lon.value}&format=json&accept-language=${locale.value}`
        )
        const geo = await res.json()
        customLocationName.value =
          geo.address?.city ||
          geo.address?.town ||
          geo.address?.county ||
          t('weather.currentLocation')
      } catch {
        customLocationName.value = t('weather.currentLocation')
      }
      await fetchWeather(lat.value, lon.value)
      locating.value = false
    },
    () => {
      error.value = t('weather.geoFail')
      locating.value = false
    },
    { timeout: 8000 }
  )
}

onMounted(() => {
  fetchWeather(lat.value, lon.value)
})
</script>

<style scoped>
.ww {
  margin-top: 24px;
  width: 100%;
}

.ww-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--apple-text-secondary);
  font-size: 15px;
  padding: 32px 0;
}

.ww-error {
  color: #ff6b6b;
}

.ww-spinner {
  width: 28px;
  height: 28px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--apple-link);
  border-radius: 50%;
  animation: ww-spin 0.8s linear infinite;
}

@keyframes ww-spin {
  to {
    transform: rotate(360deg);
  }
}

.ww-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
}

.ww-place {
  font-size: 14px;
  color: var(--apple-text-secondary);
  letter-spacing: 0.02em;
}

.ww-locate {
  background: rgba(41, 151, 255, 0.12);
  border: 1px solid rgba(41, 151, 255, 0.3);
  color: var(--apple-link);
  font-size: 13px;
  padding: 5px 14px;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
  font-family: var(--font-apple);
  -webkit-tap-highlight-color: transparent;
  white-space: nowrap;
}

.ww-locate:hover:not(:disabled) {
  background: rgba(41, 151, 255, 0.22);
}

.ww-locate:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ww-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-width: thin;
  scrollbar-color: rgba(41, 151, 255, 0.2) transparent;
}

.ww-scroll::-webkit-scrollbar {
  height: 4px;
}

.ww-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.ww-scroll::-webkit-scrollbar-thumb {
  background: rgba(41, 151, 255, 0.2);
  border-radius: 2px;
}

.ww-day {
  flex: 0 0 76px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 14px 6px 12px;
  text-align: center;
  transition: background 0.2s, border-color 0.2s;
}

.ww-day:hover {
  background: rgba(255, 255, 255, 0.07);
}

.ww-day--today {
  background: rgba(41, 151, 255, 0.12);
  border-color: rgba(41, 151, 255, 0.35);
}

.ww-weekday {
  font-size: 12px;
  font-weight: 600;
  color: var(--apple-text);
  margin-bottom: 2px;
}

.ww-day--today .ww-weekday {
  color: var(--apple-link);
}

.ww-date {
  font-size: 11px;
  color: var(--apple-text-secondary);
  margin-bottom: 10px;
}

.ww-icon {
  font-size: 26px;
  line-height: 1;
  margin-bottom: 7px;
}

.ww-desc {
  font-size: 11px;
  color: var(--apple-text-secondary);
  margin-bottom: 10px;
  white-space: nowrap;
}

.ww-temp {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 4px;
}

.ww-max {
  font-size: 14px;
  font-weight: 600;
  color: var(--apple-text);
}

.ww-min {
  font-size: 12px;
  color: var(--apple-text-secondary);
}

.ww-btn {
  background: rgba(41, 151, 255, 0.12);
  border: 1px solid rgba(41, 151, 255, 0.3);
  color: var(--apple-link);
  font-size: 14px;
  padding: 7px 18px;
  border-radius: 20px;
  cursor: pointer;
  font-family: var(--font-apple);
  transition: background 0.2s;
}

.ww-btn:hover {
  background: rgba(41, 151, 255, 0.22);
}
</style>
