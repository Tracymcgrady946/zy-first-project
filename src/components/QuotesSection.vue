<template>
  <section id="quotes"
    class="quotes-section">
    <div class="quotes-inner">
      <h2 class="quotes-title">{{ title }}</h2>

      <div class="quotes-list">
        <article v-for="(quote, index) in quotes"
          :key="index"
          class="quote-item">
          <span class="quote-index">{{ String(index + 1).padStart(2, '0') }}</span>
          <p class="quote-text">{{ quote }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useLocale } from '@/composables/useLocale.js'

const { locale } = useLocale()

const title = computed(() => locale.value === 'en-US' ? 'Quotes' : '语录')
const description = computed(() =>
  locale.value === 'en-US'
    ? 'Notes worth revisiting at the end of the page.'
    : '放在页面底部，留给自己反复回看的几句话。'
)

const quotes = [
  '大彻大悟，并非源于经历万千或发现伟大真理，而是终于允许自己失控，洞见生命本质的广阔流动。你终于明白，真实胜过正确，体验胜过结果，存在本身即是圆满。越是追求顺畅、线性、确定性的生活，现实越会让你受挫，你越容易被击败。世界，从来都是不确定的。',
  '人生的本质，就是一个人活着。不要对别人心存太多期待，我们总是想要找到能为自己分担痛苦和悲伤的人，可大多时候，我们那些惊天动地的伤痛，在别人眼里，不过是随手拂过的尘埃。或许，成年人的孤独，就是悲喜自渡，而这也正是我们难得的自由。',
  '实际上开心不值得追求。内心的自治和圆融，内心的平静和安稳，那个东西它才值得高于开心去追求的一个东西啊。',
  '终有一天你会静下心来，像个局外人一样回顾自己的故事。然后笑着摇头，浮生不过梦一场。这世间什么都是假的，而你却认真了一辈子。把尘事看清一些，把人际看浅一些。把得失看淡一些，把成败看开一些。一念执着万般皆苦，一念放下万般自在。',
  '你贪念的最终是牢笼，你恐惧的恰恰是解脱！'
]
</script>

<style scoped>
.quotes-section {
  width: 100%;
  background: #080808;
  padding: 72px 18px 96px;
  padding-left: calc(18px + env(safe-area-inset-left));
  padding-right: calc(18px + env(safe-area-inset-right));
  padding-bottom: calc(96px + env(safe-area-inset-bottom));
}

.quotes-inner {
  max-width: 980px;
  margin: 0 auto;
}

.quotes-title {
  font-size: clamp(24px, 3.5vw, 32px);
  font-weight: 600;
  letter-spacing: 0;
  margin: 0 0 12px;
  text-align: center;
  background: linear-gradient(90deg, #f5f5f7 0%, #6ee7b7 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.quotes-desc {
  max-width: 640px;
  margin: 0 auto 38px;
  color: var(--apple-text-secondary);
  font-size: 16px;
  line-height: 1.6;
  text-align: center;
}

.quotes-list {
  display: grid;
  gap: 14px;
}

.quote-item {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  gap: 18px;
  padding: 22px 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
}

.quote-index {
  color: #6ee7b7;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1.8;
}

.quote-text {
  color: var(--apple-text);
  font-size: 16px;
  line-height: 1.85;
  letter-spacing: 0;
  margin: 0;
}

@media (max-width: 640px) {
  .quotes-section {
    padding-top: 56px;
    padding-bottom: calc(72px + env(safe-area-inset-bottom));
  }

  .quotes-desc {
    margin-bottom: 28px;
  }

  .quote-item {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 18px 16px;
  }

  .quote-text {
    font-size: 15px;
    line-height: 1.8;
  }
}
</style>
