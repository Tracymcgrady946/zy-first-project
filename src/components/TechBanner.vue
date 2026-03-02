<template>
  <div class="tech-banner">
    <a
      v-for="(item, index) in links"
      :key="item.url"
      :href="item.url"
      target="_blank"
      rel="noopener noreferrer"
      class="tech-banner__card"
      :class="`tech-banner__card--${(index % 4) + 1}`"
    ><span class="tech-banner__text">{{ item.name }}</span></a>
  </div>
</template>

<script setup>
defineProps({
  links: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.tech-banner {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 24px;
  max-width: 100%;
}

.tech-banner__card {
  height: 200px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

.tech-banner__card:hover,
.tech-banner__card:active {
  transform: scale(1.05);
  text-decoration: none;
}

@media (min-width: 480px) {
  .tech-banner__card:hover {
    transform: scale(1.08);
  }
}

.tech-banner__text {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  text-align: center;
  padding: 0 8px;
}

@media (min-width: 480px) {
  .tech-banner {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-top: 32px;
  }
  .tech-banner__text { font-size: 16px; }
}

/* 四种渐变背景循环 */
.tech-banner__card--1 {
  background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
}

.tech-banner__card--2 {
  background: linear-gradient(135deg, #61dafb 0%, #20232a 100%);
}

.tech-banner__card--3 {
  background: linear-gradient(135deg, #646cff 0%, #213547 100%);
}

.tech-banner__card--4 {
  background: linear-gradient(135deg, #f0db4f 0%, #323330 100%);
}
</style>
