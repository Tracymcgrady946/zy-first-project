<template>
  <div class="on-foot-map"
    :class="{ 'on-foot-map--active': mapVisible }">
    <header class="of-header">
      <p class="of-kicker">{{ copy.kicker }}</p>
      <h3 class="of-title">{{ copy.title }}</h3>
      <p v-if="copy.desc"
        class="of-desc">{{ copy.desc }}</p>
    </header>

    <div class="of-map-shell">
      <div ref="mapEl"
        class="of-map"></div>

      <div v-if="loading"
        class="of-state">
        <span class="of-spinner"></span>
        <p>{{ copy.loading }}</p>
      </div>

      <div v-else-if="error"
        class="of-state of-state--error">
        <p>{{ error }}</p>
      </div>

      <div class="of-tip">
        {{ copy.tip }}
      </div>
    </div>

    <Teleport to="body">
      <Transition name="of-preview-fade">
        <div v-if="previewPhoto"
          class="of-preview"
          @click="closePreview">
          <button class="of-preview-close"
            type="button"
            :aria-label="copy.close"
            @click.stop="closePreview">×</button>
          <img :src="previewPhoto.src"
            :alt="previewPhoto.alt || copy.previewAlt" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { api } from '@/api/index.js'
import { useLocale } from '@/composables/useLocale.js'

const AMAP_KEY = 'b1c1cbd84fa4721a7387e21a978b3977'
const AMAP_SCRIPT_ID = 'amap-js-api'

const { locale } = useLocale()

const mapEl = ref(null)
const loading = ref(true)
const error = ref('')
const previewPhoto = ref(null)
const mapVisible = ref(false)

let amapLoadPromise = null
let map = null
let markers = []
let activeOverlay = null
let activeHike = null
let activePhotoIndex = 0
let ignoreNextMapClick = false
let visibilityObserver = null

const copy = computed(() => {
  if (locale.value === 'en-US') {
    return {
      kicker: 'Hiking Footprints',
      title: 'Hikes On The Map',
      desc: '',
      loading: 'Loading hiking map...',
      tip: 'Click a marker to show photos',
      prev: 'Previous',
      next: 'Next',
      zoom: 'View larger',
      close: 'Close',
      previewAlt: 'Hiking photo',
    }
  }

  return {
    kicker: 'On Foot',
    title: '徒步足迹',
    desc: '',
    loading: '正在加载徒步地图...',
    tip: '点击地点展示照片',
    prev: '上一张',
    next: '下一张',
    zoom: '放大查看',
    close: '关闭',
    previewAlt: '徒步照片',
  }
})

onMounted(init)
onBeforeUnmount(destroyMap)
watch(locale, () => {
  if (map) loadAndRender()
})

async function init () {
  try {
    loading.value = true
    error.value = ''
    await loadAmap()
    createMap()
    await loadAndRender()
  } catch (e) {
    error.value = e?.message || '徒步地图加载失败'
  } finally {
    loading.value = false
  }
}

function loadAmap () {
  if (window.AMap) return Promise.resolve(window.AMap)
  if (amapLoadPromise) return amapLoadPromise

  amapLoadPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(AMAP_SCRIPT_ID)
    if (existing) {
      existing.addEventListener('load', () => resolve(window.AMap), { once: true })
      existing.addEventListener('error', () => reject(new Error('高德地图脚本加载失败')), { once: true })
      return
    }

    window._AMapSecurityConfig = window._AMapSecurityConfig || {}

    const script = document.createElement('script')
    script.id = AMAP_SCRIPT_ID
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}&plugin=AMap.Geocoder`
    script.async = true
    script.onload = () => resolve(window.AMap)
    script.onerror = () => reject(new Error('高德地图脚本加载失败'))
    document.head.appendChild(script)
  })

  return amapLoadPromise
}

function createMap () {
  if (map || !mapEl.value) return

  map = new window.AMap.Map(mapEl.value, {
    center: [119.56, 28.95],
    zoom: 6,
    viewMode: '2D',
    mapStyle: 'amap://styles/darkblue',
    resizeEnable: true,
    scrollWheel: false,
    animateEnable: false,
  })

  map.on('click', () => {
    if (ignoreNextMapClick) {
      ignoreNextMapClick = false
      return
    }
    closePhotoStack()
  })
  setupVisibilityObserver()
}

function setupVisibilityObserver () {
  visibilityObserver = new IntersectionObserver(([entry]) => {
    mapVisible.value = Boolean(entry?.isIntersecting)
    setMapRenderActive(mapVisible.value)
  }, { threshold: 0.08 })

  if (mapEl.value) visibilityObserver.observe(mapEl.value)
}

function setMapRenderActive (active) {
  if (!map?.setStatus) return
  map.setStatus({
    animateEnable: false,
    jogEnable: active,
  })
}

async function loadAndRender () {
  loading.value = true
  error.value = ''
  closePhotoStack()
  clearMarkers()

  try {
    const hikes = await api.getOnFootHikes(locale.value)
    const resolved = await resolvePositions(hikes)
    renderMarkers(resolved)
    fitMap(resolved)
  } catch (e) {
    error.value = e?.message || '徒步地点加载失败'
  } finally {
    loading.value = false
  }
}

async function resolvePositions (hikes) {
  const geocoder = await createGeocoder().catch(() => null)
  if (!geocoder) return hikes

  const tasks = hikes.map(hike => resolvePosition(geocoder, hike))
  return Promise.all(tasks)
}

function createGeocoder () {
  return new Promise((resolve) => {
    const timer = window.setTimeout(() => {
      resolve(null)
    }, 1200)

    window.AMap.plugin('AMap.Geocoder', () => {
      window.clearTimeout(timer)
      resolve(new window.AMap.Geocoder({ city: '全国' }))
    })
  })
}

function resolvePosition (geocoder, hike) {
  const query = hike.amapQuery || hike.address
  if (!query) return Promise.resolve(hike)

  return new Promise((resolve) => {
    const timer = window.setTimeout(() => {
      resolve(hike)
    }, 1200)

    geocoder.getLocation(query, (status, result) => {
      const location = result?.geocodes?.[0]?.location
      if (status === 'complete' && location) {
        window.clearTimeout(timer)
        resolve({ ...hike, lng: Number(location.lng), lat: Number(location.lat) })
        return
      }

      window.clearTimeout(timer)
      resolve(hike)
    })
  })
}

function renderMarkers (hikes) {
  hikes.forEach(hike => {
    const lng = Number(hike.lng)
    const lat = Number(hike.lat)
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) return

    const marker = new window.AMap.Marker({
      position: [lng, lat],
      content: createMarkerElement(hike),
      offset: new window.AMap.Pixel(-10, -10),
      zIndex: 100,
      bubble: false,
    })

    markers.push(marker)
  })

  if (markers.length) map.add(markers)
}

function fitMap (hikes) {
  const points = hikes.filter(hike =>
    Number.isFinite(Number(hike.lng)) && Number.isFinite(Number(hike.lat))
  )
  if (!points.length) return

  const lngs = points.map(item => Number(item.lng))
  const lats = points.map(item => Number(item.lat))
  const bounds = new window.AMap.Bounds(
    [Math.min(...lngs) - 0.12, Math.min(...lats) - 0.12],
    [Math.max(...lngs) + 0.12, Math.max(...lats) + 0.12]
  )

  map.setBounds(bounds, false, [48, 48, 48, 48])
}

function clearMarkers () {
  if (markers.length && map) map.remove(markers)
  markers = []
}

function showPhotoStack (hike) {
  closePhotoStack()
  const lng = Number(hike.lng)
  const lat = Number(hike.lat)
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return
  activeHike = hike
  activePhotoIndex = 0

  activeOverlay = createPhotoOverlay(hike, activePhotoIndex)
  map.add(activeOverlay)
  map.setCenter([lng, lat])
}

function createPhotoOverlay (hike, index) {
  activeOverlay = new window.AMap.Marker({
    position: [Number(hike.lng), Number(hike.lat)],
    content: createPhotoStackElement(hike, index),
    offset: new window.AMap.Pixel(getPopupOffsetX(), getPopupOffsetY()),
    zIndex: 220,
    bubble: false,
  })

  return activeOverlay
}

function updatePhotoStack (delta) {
  if (!activeHike || !map) return
  const photos = normalizePhotos(activeHike.photos)
  if (photos.length <= 1) return

  activePhotoIndex = (activePhotoIndex + delta + photos.length) % photos.length
  if (activeOverlay) map.remove(activeOverlay)
  activeOverlay = createPhotoOverlay(activeHike, activePhotoIndex)
  map.add(activeOverlay)
}

function closePhotoStack () {
  if (!activeOverlay || !map) return
  map.remove(activeOverlay)
  activeOverlay = null
  activeHike = null
  activePhotoIndex = 0
}

function getPopupOffsetX () {
  return window.matchMedia('(max-width: 680px)').matches ? -116 : -132
}

function getPopupOffsetY () {
  return window.matchMedia('(max-width: 680px)').matches ? -238 : -268
}

function createMarkerElement (hike) {
  const button = document.createElement('button')
  button.className = 'of-marker'
  button.type = 'button'
  button.style.setProperty('--pin', hike.color || '#22c55e')
  button.setAttribute('aria-label', hike.name)
  button.innerHTML = `
    <span class="of-marker-dot"></span>
    <span class="of-marker-label">
      <strong>${escapeHtml(hike.shortName || hike.name)}</strong>
      <em>${escapeHtml(hike.date)}</em>
    </span>
  `
  button.addEventListener('click', event => {
    event.stopPropagation()
    ignoreNextMapClick = true
    showPhotoStack(hike)
  })

  return button
}

function createPhotoStackElement (hike, index) {
  const photos = normalizePhotos(hike.photos)
  const current = photos[index]
  const prev = photos[(index - 1 + photos.length) % photos.length]
  const next = photos[(index + 1) % photos.length]
  const root = document.createElement('div')
  root.className = 'of-photo-stack'
  root.style.setProperty('--accent', hike.color || '#22c55e')
  root.innerHTML = `
      ${createPhotoCard(prev, 'of-photo-card--left', hike)}
      ${createPhotoCard(next, 'of-photo-card--right', hike)}
      ${createPhotoCard(current, 'of-photo-card--main', hike)}
      <div class="of-photo-tools">
        <button type="button"
          data-action="prev"
          ${photos.length <= 1 ? 'disabled' : ''}
          aria-label="${escapeAttr(copy.value.prev)}">‹</button>
        <span>${index + 1} / ${photos.length}</span>
        <button type="button"
          data-action="next"
          ${photos.length <= 1 ? 'disabled' : ''}
          aria-label="${escapeAttr(copy.value.next)}">›</button>
        <button type="button"
          data-action="zoom"
          aria-label="${escapeAttr(copy.value.zoom)}">⤢</button>
      </div>
      <span class="of-photo-leader"></span>
  `

  root.addEventListener('click', event => event.stopPropagation())
  root.querySelector('[data-action="prev"]')?.addEventListener('click', event => {
    event.stopPropagation()
    updatePhotoStack(-1)
  })
  root.querySelector('[data-action="next"]')?.addEventListener('click', event => {
    event.stopPropagation()
    updatePhotoStack(1)
  })
  root.querySelector('[data-action="zoom"]')?.addEventListener('click', event => {
    event.stopPropagation()
    openPreview(current)
  })
  root.querySelector('.of-photo-card--main')?.addEventListener('click', event => {
    event.stopPropagation()
    openPreview(current)
  })

  return root
}

function createPhotoCard (photo, className, hike) {
  const hasPhoto = Boolean(photo?.src)
  const imageStyle = hasPhoto
    ? `background-image: linear-gradient(145deg, rgba(255,255,255,.14), transparent 42%), url(${photo.src});`
    : `background-image: linear-gradient(145deg, ${hike.color}66, #111827);`
  const label = hasPhoto ? '' : '<span class="of-photo-placeholder">照片待补充</span>'

  return `
    <article class="of-photo-card ${className}">
      <div class="of-photo-img"
        role="img"
        aria-label="${escapeAttr(photo?.alt || hike.name)}"
        style="${imageStyle}">
        ${label}
      </div>
      <div class="of-photo-meta">
        <strong>${escapeHtml(hike.name)}</strong>
        <span>${escapeHtml(hike.status)} · ${escapeHtml(hike.date)}</span>
      </div>
    </article>
  `
}

function normalizePhotos (photos = []) {
  return photos.length ? photos : [{ src: '', alt: '照片待补充' }]
}

function openPreview (photo) {
  if (!photo?.src) return
  previewPhoto.value = photo
}

function closePreview () {
  previewPhoto.value = null
}

function destroyMap () {
  closePhotoStack()
  clearMarkers()
  if (visibilityObserver && mapEl.value) {
    visibilityObserver.unobserve(mapEl.value)
  }
  if (map) {
    map.destroy()
    map = null
  }
}

function escapeHtml (value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]))
}

function escapeAttr (value) {
  return escapeHtml(value).replace(/`/g, '&#96;')
}
</script>

<style scoped>
.on-foot-map {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: clamp(22px, 4vw, 44px);
  color: #f5f5f7;
}

.of-header {
  flex: none;
  margin-bottom: 18px;
}

.of-kicker {
  margin: 0 0 8px;
  color: #22c55e;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.of-title {
  margin: 0;
  font-size: clamp(22px, 3vw, 30px);
  line-height: 1.2;
  font-weight: 650;
  letter-spacing: 0;
  background: linear-gradient(90deg, #f5f5f7 0%, #22c55e 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.of-desc {
  max-width: 560px;
  margin: 10px 0 0;
  color: #a1a1a6;
  font-size: 14px;
  line-height: 1.7;
}

.of-map-shell {
  position: relative;
  flex: 1;
  min-height: 500px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  background: #07111f;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.38);
  contain: layout paint;
}

.of-map {
  position: absolute;
  inset: 0;
}

.of-state {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #cbd5e1;
  background: rgba(5, 5, 5, 0.72);
  backdrop-filter: blur(12px);
  text-align: center;
  padding: 24px;
}

.of-state--error {
  color: #fecaca;
}

.of-state p {
  margin: 0;
  font-size: 13px;
}

.of-spinner {
  width: 28px;
  height: 28px;
  border: 2px solid rgba(255, 255, 255, 0.16);
  border-top-color: #22c55e;
  border-radius: 50%;
  animation: of-spin 0.9s linear infinite;
}

.of-tip {
  position: absolute;
  left: 18px;
  bottom: 18px;
  z-index: 3;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  padding: 8px 12px;
  color: #cbd5e1;
  background: rgba(0, 0, 0, 0.62);
  backdrop-filter: blur(10px);
  font-size: 12px;
  pointer-events: none;
}

@keyframes of-spin {
  to {
    transform: rotate(360deg);
  }
}

:deep(.amap-logo),
:deep(.amap-copyright) {
  opacity: 0.66;
}

:deep(.of-marker) {
  position: relative;
  display: block;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  font: inherit;
}

:deep(.of-marker-dot) {
  position: absolute;
  inset: 0;
  display: block;
  border: 2px solid rgba(255, 255, 255, 0.96);
  border-radius: inherit;
  background: var(--pin);
  box-shadow:
    0 0 0 9px color-mix(in srgb, var(--pin), transparent 82%),
    0 0 30px var(--pin);
}

:deep(.of-marker-dot::after) {
  content: "";
  position: absolute;
  inset: -12px;
  border: 1px solid var(--pin);
  border-radius: inherit;
  animation: of-pulse 1.9s ease-out infinite;
}

.on-foot-map:not(.on-foot-map--active) :deep(.of-marker-dot::after) {
  animation: none;
  opacity: 0;
}

:deep(.of-marker-label) {
  position: absolute;
  left: 50%;
  top: 30px;
  min-width: 118px;
  transform: translateX(-50%);
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 12px;
  padding: 8px 10px;
  color: #fff;
  background: rgba(0, 0, 0, 0.68);
  backdrop-filter: blur(12px);
  text-align: left;
  white-space: nowrap;
}

:deep(.of-marker-label strong) {
  display: block;
  font-size: 12px;
  line-height: 1.2;
  font-weight: 650;
}

:deep(.of-marker-label em) {
  display: block;
  margin-top: 4px;
  color: #cbd5e1;
  font-size: 11px;
  font-style: normal;
  line-height: 1.2;
}

@keyframes of-pulse {
  from {
    opacity: 0.85;
    transform: scale(0.65);
  }

  to {
    opacity: 0;
    transform: scale(1.45);
  }
}

:deep(.of-photo-stack) {
  position: relative;
  width: 264px;
  height: 236px;
  perspective: 1300px;
  pointer-events: auto;
  animation: of-rise 0.28s ease-out both;
}

:deep(.of-photo-card) {
  position: absolute;
  left: 50%;
  top: 12px;
  width: 142px;
  height: 178px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  background: #111827;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.52);
  transform-style: preserve-3d;
  cursor: pointer;
}

:deep(.of-photo-card::before) {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.28), transparent 34%);
  mix-blend-mode: screen;
  opacity: 0.7;
  pointer-events: none;
}

:deep(.of-photo-card--left) {
  margin-left: -120px;
  transform: rotateY(-42deg) rotateZ(-14deg) translateZ(-54px);
  opacity: 0.82;
}

:deep(.of-photo-card--right) {
  margin-left: -22px;
  transform: rotateY(38deg) rotateZ(13deg) translateZ(-42px);
  opacity: 0.86;
}

:deep(.of-photo-card--main) {
  top: 0;
  width: 158px;
  height: 198px;
  margin-left: -79px;
  border-color: rgba(255, 255, 255, 0.34);
  box-shadow:
    0 42px 110px color-mix(in srgb, var(--accent), transparent 74%),
    0 30px 92px rgba(0, 0, 0, 0.62);
  transform: rotateX(9deg) rotateY(-10deg) translateZ(62px);
}

:deep(.of-photo-img) {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-position: center;
  background-size: cover;
  color: #cbd5e1;
  text-align: center;
}

:deep(.of-photo-meta) {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  z-index: 3;
  border-radius: 12px;
  padding: 10px;
  color: #fff;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.76), rgba(0, 0, 0, 0.2));
}

:deep(.of-photo-meta strong) {
  display: block;
  margin-bottom: 4px;
  font-size: 13px;
  line-height: 1.25;
  font-weight: 650;
}

:deep(.of-photo-meta span) {
  color: #d1d5db;
  font-size: 11px;
}

:deep(.of-photo-tools) {
  position: absolute;
  left: 50%;
  bottom: 14px;
  z-index: 8;
  display: flex;
  align-items: center;
  gap: 8px;
  transform: translateX(-50%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  padding: 5px;
  background: rgba(0, 0, 0, 0.66);
  backdrop-filter: blur(12px);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.36);
}

:deep(.of-photo-tools button) {
  width: 26px;
  height: 26px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}

:deep(.of-photo-tools button:hover) {
  background: rgba(34, 197, 94, 0.32);
}

:deep(.of-photo-tools button:disabled) {
  cursor: default;
  opacity: 0.38;
}

:deep(.of-photo-tools span) {
  min-width: 34px;
  color: #d1d5db;
  font-size: 11px;
  text-align: center;
}

:deep(.of-photo-placeholder) {
  border: 1px dashed rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.28);
  color: #d1d5db;
  font-size: 12px;
}

:deep(.of-photo-leader) {
  position: absolute;
  left: 50%;
  bottom: 46px;
  width: 2px;
  height: 40px;
  transform: translateX(-50%);
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.72), transparent);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.24);
}

.of-preview {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.82);
  backdrop-filter: blur(14px);
}

.of-preview img {
  max-width: min(92vw, 1080px);
  max-height: 86vh;
  border-radius: 18px;
  object-fit: contain;
  box-shadow: 0 30px 100px rgba(0, 0, 0, 0.7);
}

.of-preview-close {
  position: fixed;
  top: 18px;
  right: 18px;
  z-index: 10001;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
}

.of-preview-fade-enter-active,
.of-preview-fade-leave-active {
  transition: opacity 0.2s ease;
}

.of-preview-fade-enter-from,
.of-preview-fade-leave-to {
  opacity: 0;
}

@keyframes of-rise {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 768px) {
  .on-foot-map {
    min-height: 620px;
    padding: 0;
  }

  .of-header {
    margin-bottom: 16px;
  }

  .of-map-shell {
    min-height: 520px;
    border-radius: 18px;
  }

  :deep(.of-marker-label) {
    min-width: 104px;
    padding: 7px 9px;
  }

  :deep(.of-marker-label strong) {
    font-size: 11px;
  }

  :deep(.of-photo-stack) {
    width: 232px;
    height: 224px;
    transform: scale(0.88);
    transform-origin: bottom center;
  }

  :deep(.of-photo-card) {
    width: 132px;
    height: 166px;
  }

  :deep(.of-photo-card--left) {
    margin-left: -110px;
  }

  :deep(.of-photo-card--right) {
    margin-left: -20px;
  }

  :deep(.of-photo-card--main) {
    width: 148px;
    height: 184px;
    margin-left: -74px;
  }

  :deep(.of-photo-meta strong) {
    font-size: 12px;
  }

  .of-tip {
    left: 12px;
    bottom: 12px;
  }

  .of-preview {
    padding: 14px;
  }

  .of-preview img {
    max-width: 94vw;
    max-height: 82vh;
    border-radius: 14px;
  }
}
</style>
