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

<style scoped src="@/assets/styles/components/OnFootMap.css"></style>
