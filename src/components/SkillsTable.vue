<template>
  <div class="skills-panel">
    <div class="skills-meta">
      <span>{{ visibleCountText }}</span>
      <span>{{ labels.source }}</span>
    </div>

    <div class="skills-table-wrap">
      <table class="skills-table">
        <thead>
          <tr>
            <th>{{ labels.name }}</th>
            <th>{{ labels.purpose }}</th>
            <th>{{ labels.whenToUse }}</th>
            <th>{{ labels.path }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="skill in visibleSkills"
            :key="skill.name">
            <td class="skill-name">{{ skill.name }}</td>
            <td>{{ purposeFor(skill) }}</td>
            <td>{{ usageFor(skill) }}</td>
            <td class="skill-path">{{ skill.path }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="canShowMore || canCollapse"
      class="skills-actions">
      <button v-if="canShowMore"
        class="skills-more"
        type="button"
        @click="showMore">
        {{ labels.showMore }}
      </button>
      <button v-if="canCollapse"
        class="skills-more skills-more--secondary"
        type="button"
        @click="collapse">
        {{ labels.collapse }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useLocale } from '@/composables/useLocale.js'
import { localSkills } from '@/data/localSkills.js'

const PAGE_SIZE = 10
const visibleCount = ref(PAGE_SIZE)
const { locale } = useLocale()

const labels = computed(() => {
  if (locale.value === 'en-US') {
    return {
      source: 'Source: ~/.codex/skills',
      name: 'Skill',
      purpose: 'Purpose',
      whenToUse: 'When to use',
      path: 'Path',
      empty: 'No description',
      showMore: 'Show 10 more',
      collapse: 'Collapse',
      visible: (current, total) => `${current} of ${total} skills`
    }
  }

  return {
    source: '来源：~/.codex/skills',
    name: 'Skill',
    purpose: '功能',
    whenToUse: '什么时候使用',
    path: '路径',
    empty: '暂无说明',
    showMore: '继续展开 10 条',
    collapse: '收起',
    visible: (current, total) => `已展示 ${current} / ${total} 条`
  }
})

const visibleSkills = computed(() => localSkills.slice(0, visibleCount.value))
const canShowMore = computed(() => visibleCount.value < localSkills.length)
const canCollapse = computed(() => visibleCount.value > PAGE_SIZE)
const visibleCountText = computed(() =>
  labels.value.visible(visibleSkills.value.length, localSkills.length)
)

function showMore() {
  visibleCount.value = Math.min(visibleCount.value + PAGE_SIZE, localSkills.length)
}

function collapse() {
  visibleCount.value = PAGE_SIZE
}

function purposeFor(skill) {
  if (locale.value !== 'en-US') {
    return zhSkillCopy[skill.name]?.purpose || `用于处理 ${skill.name} 相关工作流。`
  }

  const description = skill.description || ''
  if (!description) return labels.value.empty
  if (/^Use when/i.test(description)) {
    return `Guides ${skill.name} related workflows.`
  }
  return description
}

function usageFor(skill) {
  if (locale.value !== 'en-US') {
    return zhSkillCopy[skill.name]?.usage || `当任务涉及 ${skill.name} 或该工作流时使用。`
  }

  const description = skill.description || ''
  if (/^Use when/i.test(description)) return description
  return `Use when the task matches ${skill.name} or this workflow.`
}

const zhSkillCopy = {
  autoplan: {
    purpose: '自动串联 CEO、设计、工程和开发体验评审，给方案做完整审查和决策。',
    usage: '当已有方案需要一次完整自动评审、希望快速发现范围和执行风险时使用。'
  },
  benchmark: {
    purpose: '检测网页或交互流程的性能变化，帮助发现性能回归。',
    usage: '当上线前后需要比较性能、确认页面没有变慢时使用。'
  },
  'benchmark-models': {
    purpose: '对不同模型执行同一组 skill 任务，比较效果和稳定性。',
    usage: '当需要为某类任务选择更合适的模型或验证模型差异时使用。'
  },
  brainstorming: {
    purpose: '在动手实现前梳理需求、目标、设计方向和关键取舍。',
    usage: '当要做新功能、新组件、创意页面或行为改动，但需求还需要展开时使用。'
  },
  browse: {
    purpose: '用无头浏览器快速访问页面、截图、交互和验证页面状态。',
    usage: '当需要测试网页、复现前端问题、检查本地或线上页面效果时使用。'
  },
  canary: {
    purpose: '部署后做持续观测，检查关键页面和流程是否正常。',
    usage: '当发布完成后需要短时间盯住线上健康状态时使用。'
  },
  careful: {
    purpose: '给删除、重置、覆盖等危险命令加安全检查。',
    usage: '当操作可能破坏文件、仓库或运行环境时使用。'
  },
  codex: {
    purpose: '封装 Codex CLI 的常用使用方式，支持不同执行模式。',
    usage: '当需要通过命令行调用 Codex、评审或执行任务时使用。'
  },
  'context-restore': {
    purpose: '恢复之前保存的工作上下文。',
    usage: '当中断后需要接着旧任务继续做，或需要找回前一次进展时使用。'
  },
  'context-save': {
    purpose: '保存当前工作状态、关键结论和后续步骤。',
    usage: '当任务较长、需要换线程或暂停前保留上下文时使用。'
  },
  cso: {
    purpose: '从安全负责人视角审视方案、代码和风险。',
    usage: '当任务涉及权限、数据、安全边界、风险控制时使用。'
  },
  'design-consultation': {
    purpose: '理解产品目标并提出完整视觉方向、设计系统和页面风格。',
    usage: '当要确定产品设计方向、视觉基调或 UI 方案时使用。'
  },
  'design-html': {
    purpose: '把设计方向落成高质量 HTML/CSS 页面。',
    usage: '当设计已经明确，需要产出可运行静态页面时使用。'
  },
  'design-review': {
    purpose: '检查视觉层级、间距、排版、交互和页面质感问题，并给出修复。',
    usage: '当前端页面做完后，需要从设计质量角度验收和修正时使用。'
  },
  'design-shotgun': {
    purpose: '一次生成多个设计变体，便于对比和选择方向。',
    usage: '当还没确定视觉方向，希望快速探索多个方案时使用。'
  },
  'devex-review': {
    purpose: '审查开发者体验，包括项目结构、命令、文档和调试流程。',
    usage: '当项目让开发者难以上手、构建或排查问题时使用。'
  },
  'document-generate': {
    purpose: '为功能、模块或项目生成缺失文档。',
    usage: '当代码已经存在但说明、接入文档或使用文档不足时使用。'
  },
  'document-release': {
    purpose: '发布后同步更新文档。',
    usage: '当功能上线、接口变化或版本发布后需要整理说明时使用。'
  },
  'find-skills': {
    purpose: '查找、发现和安装适合某类任务的 agent skills。',
    usage: '当不知道是否有现成 skill 能解决问题，或想扩展能力时使用。'
  },
  freeze: {
    purpose: '限制本轮只能编辑指定目录。',
    usage: '当需要避免误改其他目录或控制变更范围时使用。'
  },
  gstack: {
    purpose: '提供网页 QA、浏览器测试和相关 gstack 工作流入口。',
    usage: '当需要用 gstack 做页面验证、浏览器操作或质量检查时使用。'
  },
  'gstack-openclaw-ceo-review': {
    purpose: '从 CEO 或创始人视角挑战计划、范围和产品判断。',
    usage: '当需要判断方案是否值得做、是否够大、是否方向正确时使用。'
  },
  'gstack-openclaw-investigate': {
    purpose: '先查根因再修复问题，避免只做表面补丁。',
    usage: '当出现报错、异常行为、回归或需要根因分析时使用。'
  },
  'gstack-openclaw-office-hours': {
    purpose: '用 YC office hours 风格审视想法、用户和产品机会。',
    usage: '当想讨论一个产品想法、设计方向或是否值得做时使用。'
  },
  'gstack-openclaw-retro': {
    purpose: '基于提交历史和质量指标生成工程复盘。',
    usage: '当需要周报、复盘、团队产出分析或趋势观察时使用。'
  },
  'gstack-upgrade': {
    purpose: '升级 gstack 到最新版本。',
    usage: '当 gstack skill 或工具提示版本过旧，需要更新时使用。'
  },
  guard: {
    purpose: '开启完整安全模式，包含危险命令提醒和目录边界控制。',
    usage: '当任务涉及高风险操作，或希望整轮都更谨慎时使用。'
  },
  'hackernews-frontpage': {
    purpose: '抓取 Hacker News 首页标题、分数和评论数。',
    usage: '当需要快速了解 HN 当前热门内容时使用。'
  },
  'hatch-pet': {
    purpose: '创建、修复、验证和打包 Codex 可用的动画宠物素材。',
    usage: '当需要生成或维护 Codex pet、动图或 spritesheet 时使用。'
  },
  health: {
    purpose: '生成代码质量和项目健康度仪表盘。',
    usage: '当需要了解项目质量、风险热点或技术债概况时使用。'
  },
  investigate: {
    purpose: '系统化调试并追踪问题根因。',
    usage: '当遇到 bug、报错、性能异常或行为不符合预期时使用。'
  },
  'ios-clean': {
    purpose: '移除 iOS 调试桥接包及相关 DEBUG 接线。',
    usage: '当 iOS 项目需要清理调试辅助代码时使用。'
  },
  'ios-design-review': {
    purpose: '在真实设备视角审查 iOS 应用视觉效果。',
    usage: '当 SwiftUI 或 iOS 页面需要视觉验收和修正时使用。'
  },
  'ios-fix': {
    purpose: '自动定位并修复 iOS 应用问题。',
    usage: '当 iOS 应用出现 bug、构建错误或交互问题时使用。'
  },
  'ios-qa': {
    purpose: '在真实设备上执行 iOS 应用 QA。',
    usage: '当 iOS 页面或流程需要端到端验证时使用。'
  },
  'ios-sync': {
    purpose: '根据最新模板重新生成 iOS debug bridge。',
    usage: '当 iOS 调试桥接能力需要更新或同步时使用。'
  },
  'land-and-deploy': {
    purpose: '处理合入、发布和部署流程。',
    usage: '当本地改动准备落地、提交、发布或部署时使用。'
  },
  'landing-report': {
    purpose: '查看待合入或待发布队列状态。',
    usage: '当需要了解版本队列、工作区状态或发布阻塞点时使用。'
  },
  learn: {
    purpose: '记录和管理项目经验、踩坑和可复用结论。',
    usage: '当发现需要长期保留的项目知识或操作经验时使用。'
  },
  'make-pdf': {
    purpose: '把 Markdown 转成排版质量更好的 PDF。',
    usage: '当需要交付报告、文档或正式 PDF 文件时使用。'
  },
  'office-hours': {
    purpose: '用 YC office hours 方式讨论创业、产品和方向问题。',
    usage: '当需要高质量追问、挑战假设或打磨想法时使用。'
  },
  'open-gstack-browser': {
    purpose: '打开带扩展的 GStack Browser。',
    usage: '当需要 AI 控制浏览器、检查网页或运行浏览器技能时使用。'
  },
  'pair-agent': {
    purpose: '把远程 AI agent 与浏览器配对协作。',
    usage: '当需要另一个 agent 一起观察或操作浏览器时使用。'
  },
  'plan-ceo-review': {
    purpose: '从 CEO 或创始人视角评审计划。',
    usage: '当需要检查计划是否有商业价值、优先级是否正确时使用。'
  },
  'plan-design-review': {
    purpose: '从设计师视角评审计划。',
    usage: '当计划涉及 UI、交互、视觉质量或用户体验时使用。'
  },
  'plan-devex-review': {
    purpose: '从开发者体验视角评审计划。',
    usage: '当计划会影响项目结构、命令、文档或开发流程时使用。'
  },
  'plan-eng-review': {
    purpose: '从工程管理视角评审计划。',
    usage: '当需要检查技术方案、风险、依赖和交付路径时使用。'
  },
  'plan-tune': {
    purpose: '观察并调优计划阶段的提问敏感度和协作方式。',
    usage: '当计划沟通过程需要更符合个人偏好时使用。'
  },
  qa: {
    purpose: '系统测试网页应用并修复发现的问题。',
    usage: '当功能完成后需要做真实页面 QA 和修复时使用。'
  },
  'qa-only': {
    purpose: '只做 QA 报告，不直接修改代码。',
    usage: '当只想要测试结果、问题清单和风险说明时使用。'
  },
  retro: {
    purpose: '生成周度工程复盘。',
    usage: '当需要总结近期开发工作、提交质量和改进点时使用。'
  },
  review: {
    purpose: '在合入前做代码评审。',
    usage: '当准备提交或合并改动，需要找 bug、风险和缺失测试时使用。'
  },
  scrape: {
    purpose: '从网页中抓取结构化数据。',
    usage: '当需要读取网页内容、列表、排行或页面数据时使用。'
  },
  'setup-browser-cookies': {
    purpose: '把真实浏览器 cookies 导入无头浏览器会话。',
    usage: '当测试需要登录态或站点权限时使用。'
  },
  'setup-deploy': {
    purpose: '配置 land-and-deploy 所需的部署设置。',
    usage: '当第一次部署或部署配置不完整时使用。'
  },
  'setup-gbrain': {
    purpose: '安装并初始化 gbrain，配置本地知识库和 MCP。',
    usage: '当需要让 agent 使用代码知识库或项目记忆时使用。'
  },
  ship: {
    purpose: '执行完整发版流程：检查、测试、版本、日志、提交、推送和 PR。',
    usage: '当改动已经准备好进入正式交付流程时使用。'
  },
  skillify: {
    purpose: '把成功的网页抓取流程固化成可复用 browser skill。',
    usage: '当某个 scrape 流程以后还会反复使用时使用。'
  },
  soultrace: {
    purpose: '通过 SoulTrace API 做人格测评。',
    usage: '当用户想了解人格类型、心理特质或做测评时使用。'
  },
  spec: {
    purpose: '把模糊想法拆成清晰、可执行的规格说明。',
    usage: '当需求还不够具体，需要先形成可实施方案时使用。'
  },
  'sync-gbrain': {
    purpose: '同步代码到 gbrain，并刷新 agent 搜索指引。',
    usage: '当项目代码变化较大，需要更新知识库时使用。'
  },
  unfreeze: {
    purpose: '取消 freeze 设置的编辑目录限制。',
    usage: '当需要恢复对所有目录的编辑权限时使用。'
  },
  'using-superpowers': {
    purpose: '说明如何发现和使用 skills。',
    usage: '当会话开始或需要按 skill 工作流执行任务时使用。'
  },
  'vue-page-api-mock': {
    purpose: '按 API 优先方式生成 Vue 页面，并用 mock 数据兜底。',
    usage: '当根据设计稿、PRD 或描述生成 Vue/Vite 页面时使用。'
  }
}
</script>

<style scoped>
.skills-panel {
  margin: 28px auto 0;
  width: min(100%, 1040px);
  text-align: left;
}

.skills-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  color: var(--apple-text-secondary);
  font-size: 13px;
}

.skills-table-wrap {
  overflow-x: auto;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  scrollbar-color: rgba(41, 151, 255, 0.45) rgba(255, 255, 255, 0.05);
  scrollbar-width: thin;
}

.skills-table-wrap::-webkit-scrollbar {
  height: 8px;
}

.skills-table-wrap::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0 0 8px 8px;
}

.skills-table-wrap::-webkit-scrollbar-thumb {
  background: rgba(41, 151, 255, 0.45);
  border-radius: 999px;
}

.skills-table-wrap::-webkit-scrollbar-thumb:hover {
  background: rgba(41, 151, 255, 0.65);
}

.skills-table {
  width: 100%;
  min-width: 920px;
  border-collapse: collapse;
  color: var(--apple-text);
  font-size: 14px;
}

.skills-table th,
.skills-table td {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  vertical-align: top;
}

.skills-table th {
  color: var(--apple-text-secondary);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.skills-table tr:last-child td {
  border-bottom: 0;
}

.skill-name {
  width: 170px;
  color: #6ee7b7;
  font-weight: 600;
  white-space: nowrap;
}

.skill-path {
  width: 230px;
  color: var(--apple-text-secondary);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  word-break: break-all;
}

.skills-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 18px;
  flex-wrap: wrap;
}

.skills-more {
  border: 1px solid rgba(41, 151, 255, 0.28);
  border-radius: 8px;
  background: rgba(41, 151, 255, 0.12);
  color: var(--apple-link);
  cursor: pointer;
  font-family: var(--font-apple);
  font-size: 14px;
  padding: 9px 18px;
  transition: background 0.2s, border-color 0.2s;
}

.skills-more:hover {
  background: rgba(41, 151, 255, 0.2);
  border-color: rgba(41, 151, 255, 0.45);
}

.skills-more--secondary {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.12);
  color: var(--apple-text-secondary);
}

.skills-more--secondary:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--apple-text);
}

@media (max-width: 640px) {
  .skills-meta {
    flex-direction: column;
  }

  .skills-panel {
    margin-top: 22px;
  }

  .skills-table {
    min-width: 860px;
    font-size: 13px;
  }

  .skills-table th,
  .skills-table td {
    padding: 12px;
  }

  .skill-name {
    width: 150px;
  }

  .skill-path {
    width: 210px;
  }
}
</style>
