<template>
  <section id="contact" class="ai-dynamics">
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
            <li v-for="(item, i) in newsList" :key="i" class="ai-item ai-item--news">
              <a :href="item.url" target="_blank" rel="noopener noreferrer" class="ai-item-link">
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
            <li v-for="(item, i) in zhihuList" :key="i" class="ai-item ai-item--zhihu">
              <a :href="item.url" target="_blank" rel="noopener noreferrer" class="ai-item-link">
                <span class="ai-item-index">{{ i + 1 }}</span>
                <div class="ai-item-content">
                  <p class="ai-item-title">{{ item.title }}</p>
                  <div class="ai-item-meta">
                    <span class="ai-item-votes">{{ item.votes }} 关注</span>
                    <span class="ai-item-dot">·</span>
                    <span class="ai-item-answers">{{ item.answers }} 回答</span>
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
            <li v-for="(item, i) in githubList" :key="i" class="ai-item ai-item--github">
              <a :href="item.url" target="_blank" rel="noopener noreferrer" class="ai-item-link">
                <span class="ai-item-index">{{ i + 1 }}</span>
                <div class="ai-item-content">
                  <p class="ai-item-title ai-item-repo">{{ item.repo }}</p>
                  <p class="ai-item-desc">{{ item.desc }}</p>
                  <div class="ai-item-meta">
                    <span class="ai-item-lang" :style="{ background: item.langColor }"></span>
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
const newsList = [
  {
    title: 'OpenAI 正式发布 GPT-4.5，推理能力与长上下文全面升级',
    source: 'OpenAI Blog',
    time: '2 小时前',
    url: 'https://openai.com/blog'
  },
  {
    title: 'Google DeepMind Gemini 2.0 Flash 实验版开放，实时多模态交互成真',
    source: '36氪',
    time: '5 小时前',
    url: 'https://36kr.com'
  },
  {
    title: 'Anthropic Claude 3.7 Sonnet 发布，编程能力跻身行业第一',
    source: 'Anthropic',
    time: '1 天前',
    url: 'https://www.anthropic.com/news'
  },
  {
    title: 'Meta 开源 Llama 4，支持百万 token 超长上下文理解',
    source: 'InfoQ',
    time: '2 天前',
    url: 'https://www.infoq.cn'
  },
  {
    title: '微软 Copilot Studio 重磅升级，Agent 自动化流程全面提速',
    source: 'Microsoft Blog',
    time: '3 天前',
    url: 'https://blogs.microsoft.com'
  }
]

const zhihuList = [
  {
    title: '2026 年 AI 前端工程师需要掌握哪些核心技能？',
    votes: '3.2k',
    answers: '218',
    url: 'https://www.zhihu.com/search?q=AI%E5%89%8D%E7%AB%AF'
  },
  {
    title: '如何看待 AI 替代程序员这件事——焦虑还是机会？',
    votes: '8.7k',
    answers: '562',
    url: 'https://www.zhihu.com/search?q=AI%E6%9B%BF%E4%BB%A3%E7%A8%8B%E5%BA%8F%E5%91%98'
  },
  {
    title: '用了一年 Cursor 之后，我的真实开发效率提升了多少？',
    votes: '5.1k',
    answers: '341',
    url: 'https://www.zhihu.com/search?q=Cursor+AI'
  },
  {
    title: '大模型的"幻觉"问题为什么这么难从根本上解决？',
    votes: '12k',
    answers: '893',
    url: 'https://www.zhihu.com/search?q=%E5%A4%A7%E6%A8%A1%E5%9E%8B%E5%B9%BB%E8%A7%89'
  },
  {
    title: '普通人如何利用 AI 实现可持续的副业收入？',
    votes: '21k',
    answers: '1.4k',
    url: 'https://www.zhihu.com/search?q=AI+%E5%89%AF%E4%B8%9A'
  }
]

const githubList = [
  {
    repo: 'deepseek-ai / DeepSeek-V3',
    desc: '开源 MoE 大模型，671B 参数，综合性能超越闭源模型',
    lang: 'Python',
    langColor: '#3572A5',
    stars: '98.2k',
    url: 'https://github.com/deepseek-ai/DeepSeek-V3'
  },
  {
    repo: 'lobehub / lobe-chat',
    desc: '现代化 AI 聊天框架，支持多模型、插件与私有部署',
    lang: 'TypeScript',
    langColor: '#3178c6',
    stars: '54.1k',
    url: 'https://github.com/lobehub/lobe-chat'
  },
  {
    repo: 'microsoft / autogen',
    desc: '多智能体对话框架，构建自主 AI 协作工作流',
    lang: 'Python',
    langColor: '#3572A5',
    stars: '43.8k',
    url: 'https://github.com/microsoft/autogen'
  },
  {
    repo: 'vercel / ai',
    desc: 'Vercel AI SDK，轻松为 Next.js 应用接入大模型能力',
    lang: 'TypeScript',
    langColor: '#3178c6',
    stars: '16.3k',
    url: 'https://github.com/vercel/ai'
  },
  {
    repo: 'browser-use / browser-use',
    desc: '让 AI Agent 像人一样操作浏览器，自动化 Web 任务',
    lang: 'Python',
    langColor: '#3572A5',
    stars: '31.5k',
    url: 'https://github.com/browser-use/browser-use'
  }
]
</script>

<style scoped>
.ai-dynamics {
  background: #0d0d0d;
  padding: 72px 24px 96px;
  padding-left: calc(24px + env(safe-area-inset-left));
  padding-right: calc(24px + env(safe-area-inset-right));
  padding-bottom: calc(96px + env(safe-area-inset-bottom));
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

.ai-item--news .ai-item-index { background: rgba(41, 151, 255, 0.12); color: #2997ff; }
.ai-item--zhihu .ai-item-index { background: rgba(79, 172, 254, 0.12); color: #4facfe; }
.ai-item--github .ai-item-index { background: rgba(110, 231, 183, 0.12); color: #6ee7b7; }

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
