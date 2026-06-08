<template>
  <section id="contact"
    class="ai-dynamics">
    <div class="ai-dynamics-inner">
      <h2 class="ai-dynamics-title">AI 动态</h2>
      <p class="ai-dynamics-desc">聚合最新 AI 头条、知乎热议与 GitHub 爆火项目，随时掌握前沿脉搏。</p>

      <div class="ai-dynamics-grid">
        <!-- 左栏：AI 头条新闻 -->
        <div class="ai-col">
          <div class="ai-col-header">
            <span class="ai-col-icon">📰</span>
            <h3 class="ai-col-title">AI 头条</h3>
            <span class="ai-col-badge">最新</span>
          </div>
          <ul class="ai-list">
            <li v-for="(item, i) in newsList"
              :key="i"
              class="ai-item ai-item--news">
              <a :href="item.url"
                target="_blank"
                rel="noopener noreferrer"
                class="ai-item-link">
                <span class="ai-item-index">{{ i + 1 }}</span>
                <div class="ai-item-content">
                  <p class="ai-item-title">{{ item.title }}</p>
                  <div class="ai-item-meta">
                    <span class="ai-item-source">{{ item.source }}</span>
                    <span class="ai-item-dot">·</span>
                    <span class="ai-item-time">{{ item.time }}</span>
                  </div>
                </div>
                <span class="ai-item-arrow">→</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- 中栏：知乎热议 -->
        <div class="ai-col">
          <div class="ai-col-header">
            <span class="ai-col-icon">💬</span>
            <h3 class="ai-col-title">知乎热议</h3>
            <span class="ai-col-badge ai-col-badge--zhihu">热门</span>
          </div>
          <ul class="ai-list">
            <li v-for="(item, i) in zhihuList"
              :key="i"
              class="ai-item ai-item--zhihu">
              <a :href="item.url"
                target="_blank"
                rel="noopener noreferrer"
                class="ai-item-link">
                <span class="ai-item-index">{{ i + 1 }}</span>
                <div class="ai-item-content">
                  <p class="ai-item-title">{{ item.title }}</p>
                  <div class="ai-item-meta">
                    <template v-if="item.meta">
                      <span class="ai-item-votes">{{ item.meta }}</span>
                    </template>
                    <template v-else>
                      <span class="ai-item-votes">{{ item.votes }} 关注</span>
                      <span class="ai-item-dot">·</span>
                      <span class="ai-item-answers">{{ item.answers }} 回答</span>
                    </template>
                  </div>
                </div>
                <span class="ai-item-arrow">→</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- 右栏：GitHub 热门项目 -->
        <div class="ai-col">
          <div class="ai-col-header">
            <span class="ai-col-icon">⭐</span>
            <h3 class="ai-col-title">GitHub 爆火</h3>
            <span class="ai-col-badge ai-col-badge--github">Trending</span>
          </div>
          <ul class="ai-list">
            <li v-for="(item, i) in githubList"
              :key="i"
              class="ai-item ai-item--github">
              <a :href="item.url"
                target="_blank"
                rel="noopener noreferrer"
                class="ai-item-link">
                <span class="ai-item-index">{{ i + 1 }}</span>
                <div class="ai-item-content">
                  <p class="ai-item-title ai-item-repo">{{ item.repo }}</p>
                  <p class="ai-item-desc">{{ item.desc }}</p>
                  <div class="ai-item-meta">
                    <span class="ai-item-lang"
                      :style="{ background: item.langColor }"></span>
                    <span class="ai-item-source">{{ item.lang }}</span>
                    <span class="ai-item-dot">·</span>
                    <span class="ai-item-stars">⭐ {{ item.stars }}</span>
                  </div>
                </div>
                <span class="ai-item-arrow">→</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/api/index.js'

const newsList = ref([])
const zhihuList = ref([])
const githubList = ref([])

async function loadAiDynamics () {
  try {
    const data = await api.getAiDynamics()
    newsList.value = data.newsList || []
    zhihuList.value = data.zhihuList || []
    githubList.value = data.githubList || []
  } catch (e) {
    console.error('Failed to load AI dynamics:', e)
  }
}

onMounted(loadAiDynamics)
</script>

<style scoped>
.ai-dynamics {
  background: #0d0d0d;
  padding: 72px 24px 96px;
  padding-left: calc(24px + env(safe-area-inset-left));
  padding-right: calc(24px + env(safe-area-inset-right));
  padding-bottom: calc(26px + env(safe-area-inset-bottom));
  width: 100%;
  box-sizing: border-box;
}

.ai-dynamics-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.ai-dynamics-title {
  font-size: clamp(24px, 3.5vw, 32px);
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
  text-align: center;
  background: linear-gradient(90deg, #f5f5f7 0%, #2997ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.ai-dynamics-desc {
  font-size: 17px;
  line-height: 1.55;
  letter-spacing: 0.01em;
  text-align: center;
  margin-bottom: 48px;
  background: linear-gradient(90deg, #a1a1a6 0%, #2997ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

/* 三栏网格 */
.ai-dynamics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 900px) {
  .ai-dynamics-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* 单栏容器 */
.ai-col {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: border-color 0.25s;
}

.ai-col:hover {
  border-color: rgba(41, 151, 255, 0.2);
}

/* 栏标题行 */
.ai-col-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.ai-col-icon {
  font-size: 18px;
  line-height: 1;
}

.ai-col-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--apple-text);
  letter-spacing: 0.01em;
  flex: 1;
  margin: 0;
}

.ai-col-badge {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 3px 9px;
  border-radius: 20px;
  background: rgba(41, 151, 255, 0.15);
  color: #2997ff;
  border: 1px solid rgba(41, 151, 255, 0.25);
}

.ai-col-badge--zhihu {
  background: rgba(0, 122, 255, 0.12);
  color: #4facfe;
  border-color: rgba(79, 172, 254, 0.25);
}

.ai-col-badge--github {
  background: rgba(110, 231, 183, 0.1);
  color: #6ee7b7;
  border-color: rgba(110, 231, 183, 0.25);
}

/* 列表 */
.ai-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 单条目 */
.ai-item {
  border-radius: 12px;
  overflow: hidden;
  transition: background 0.2s;
}

.ai-item:hover {
  background: rgba(255, 255, 255, 0.04);
}

.ai-item-link {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 10px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.ai-item-index {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
  font-size: 11px;
  font-weight: 700;
  color: var(--apple-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}

.ai-item--news .ai-item-index {
  background: rgba(41, 151, 255, 0.12);
  color: #2997ff;
}
.ai-item--zhihu .ai-item-index {
  background: rgba(79, 172, 254, 0.12);
  color: #4facfe;
}
.ai-item--github .ai-item-index {
  background: rgba(110, 231, 183, 0.12);
  color: #6ee7b7;
}

.ai-item-content {
  flex: 1;
  min-width: 0;
}

.ai-item-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--apple-text);
  line-height: 1.5;
  margin: 0 0 5px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s;
}

.ai-item:hover .ai-item-title {
  color: #2997ff;
}

.ai-item--zhihu:hover .ai-item-title {
  color: #4facfe;
}

.ai-item--github:hover .ai-item-title {
  color: #6ee7b7;
}

.ai-item-repo {
  font-family: "SF Mono", "Fira Code", monospace;
  font-size: 12.5px;
  letter-spacing: 0.01em;
}

.ai-item-desc {
  font-size: 12px;
  color: var(--apple-text-secondary);
  line-height: 1.45;
  margin: 0 0 5px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ai-item-meta {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.ai-item-source,
.ai-item-time,
.ai-item-votes,
.ai-item-answers,
.ai-item-stars {
  font-size: 11px;
  color: var(--apple-gray);
}

.ai-item-dot {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.2);
}

.ai-item-lang {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ai-item-arrow {
  flex-shrink: 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.15);
  margin-top: 2px;
  transition: color 0.2s, transform 0.2s;
}

.ai-item:hover .ai-item-arrow {
  color: rgba(41, 151, 255, 0.6);
  transform: translateX(3px);
}

.ai-item--zhihu:hover .ai-item-arrow {
  color: rgba(79, 172, 254, 0.6);
}

.ai-item--github:hover .ai-item-arrow {
  color: rgba(110, 231, 183, 0.6);
}
</style>
