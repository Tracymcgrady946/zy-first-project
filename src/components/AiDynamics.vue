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

<style scoped src="@/assets/styles/components/AiDynamics.css"></style>
