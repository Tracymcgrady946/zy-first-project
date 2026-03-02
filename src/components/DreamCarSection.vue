<template>
  <section id="dream-car" class="dream-car-section">
    <div class="dream-car-bg" :style="{ backgroundImage: `url(${carImage})` }"></div>
    <div class="dream-car-overlay"></div>
    <div class="dream-car-content">
      <p class="dream-car-sub">{{ $t('dreamCar.sub') }}</p>
      <h2 class="dream-car-title">{{ $t('dreamCar.title') }}</h2>
      <p class="dream-car-desc">{{ $t('dreamCar.desc') }}</p>
    </div>
  </section>
</template>

<script setup>
import carImage from '@/assets/img/xiaomi_car.jpg'
</script>

<style scoped>
.dream-car-section {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.dream-car-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transform: scale(1.04);
  transition: transform 8s ease;
}

.dream-car-section:hover .dream-car-bg {
  transform: scale(1);
}

.dream-car-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.72) 0%,
    rgba(0, 0, 0, 0.18) 50%,
    rgba(0, 0, 0, 0.04) 100%
  );
}

.dream-car-content {
  position: relative;
  z-index: 1;
  padding: 0 8vw 7vh;
  color: #fff;
}

.dream-car-sub {
  font-size: 0.85rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  opacity: 0.7;
  margin: 0 0 0.6rem;
}

.dream-car-title {
  font-size: clamp(2.4rem, 6vw, 5rem);
  font-weight: 700;
  margin: 0 0 1rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.dream-car-desc {
  font-size: clamp(0.95rem, 1.6vw, 1.15rem);
  opacity: 0.82;
  max-width: 520px;
  line-height: 1.7;
  margin: 0;
}
</style>
