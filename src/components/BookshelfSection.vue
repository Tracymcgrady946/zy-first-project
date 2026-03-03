<template>
  <section id="reading"
    class="reading-section">
    <!-- Section header -->
    <div class="reading-header">
      <h2 class="reading-title">{{ $t('section.reading.title') }}</h2>
      <p class="reading-desc">{{ $t('section.reading.description') }}</p>
    </div>

    <!-- Bookshelf layout -->
    <div class="reading-layout">
      <!-- ─── Left: Bookshelf ─── -->
      <div class="bs-shelf-area" ref="shelfRef">
        <!-- Hanging lamp fixture -->
        <div class="bs-lamp">
          <div class="bs-wire"></div>
          <div class="bs-shade"></div>
          <div class="bs-glow"></div>
        </div>

        <!-- Warm light cone -->
        <div class="bs-light-beam"
          aria-hidden="true"></div>

        <!-- Shelf cabinet -->
        <div class="bs-cabinet">
          <!-- Top shelf row -->
          <div class="bs-row">
            <div v-for="book in rows[0]"
              :key="book.id"
              class="bs-book"
              :class="{ 'bs-book--active': activeId === book.id }"
              :style="{ '--bc': book.color, '--bh': book.height + 'px', '--bw': book.width + 'px' }"
              :title="book.title"
              @click="select(book)">
              <span class="bs-spine">{{ book.title }}</span>
            </div>
          </div>
          <div class="bs-plank"></div>

          <!-- Bottom shelf row -->
          <div class="bs-row">
            <div v-for="book in rows[1]"
              :key="book.id"
              class="bs-book"
              :class="{ 'bs-book--active': activeId === book.id }"
              :style="{ '--bc': book.color, '--bh': book.height + 'px', '--bw': book.width + 'px' }"
              :title="book.title"
              @click="select(book)">
              <span class="bs-spine">{{ book.title }}</span>
            </div>
          </div>
          <div class="bs-plank"></div>
        </div>
      </div>

      <!-- ─── Right: Book detail panel ─── -->
      <div class="bs-detail-area" :style="detailStyle">
        <Transition name="bs-slide"
          mode="out-in">
          <div v-if="activeBook"
            :key="activeBook.id"
            class="bs-card">
            <!-- Fixed header: cover banner + book metadata -->
            <div class="bs-card-head">
              <div class="bs-cover"
                :style="{ background: `linear-gradient(150deg, ${activeBook.color}f2 0%, ${activeBook.color}80 65%, rgba(0,0,0,0.5) 100%)` }">
                <p class="bs-cover-title">{{ activeBook.title }}</p>
                <p class="bs-cover-author">{{ activeBook.author }}</p>
              </div>
              <div class="bs-info-top">
                <div>
                  <h3 class="bs-book-name">{{ activeBook.title }}</h3>
                  <p class="bs-book-author">{{ activeBook.author }}</p>
                </div>
                <div class="bs-book-stat">
                  <span class="bs-year">{{ activeBook.year }} 读完</span>
                  <div class="bs-rating">
                    <span v-for="n in 5"
                      :key="n"
                      class="bs-star"
                      :class="{ lit: n <= activeBook.rating }">★</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Scrollable body: intro + notes -->
            <div class="bs-card-body">
              <div class="bs-block">
                <h4 class="bs-block-label">内容简介</h4>
                <p class="bs-block-text">{{ activeBook.intro }}</p>
              </div>

              <div class="bs-block">
                <h4 class="bs-block-label">读后感 · 笔记</h4>
                <p class="bs-block-text">{{ activeBook.notes }}</p>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else
            class="bs-empty">
            <span class="bs-empty-icon">📚</span>
            <p class="bs-empty-hint">点击书架上的书籍</p>
            <p class="bs-empty-sub">探索读书笔记与感想</p>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const books = [
  {
    id: 1,
    title: '人类简史',
    author: '尤瓦尔·赫拉利',
    color: '#9B6A2F',
    height: 172, width: 38,
    year: '2023',
    rating: 5,
    intro: '从认知革命、农业革命到科学革命，赫拉利以宏观视角重新梳理了人类700万年的历史。他提出了一个震撼性论断：人类之所以能统治世界，不是因为更聪明，而是因为能够创造并相信"虚构的故事"——宗教、国家、金钱与法律。',
    notes: '1. 农业革命是人类史上最大的骗局\n小麦"驯化"了人类，而非人类驯化了小麦。农业革命从个体角度看是退步——更辛苦、食物更单一——却从种群角度推动了文明进程。让我开始质疑"进步"的真实含义。\n\n2. 虚构让人类统治世界\n货币、公司、法律、国家都是人类集体相信的"故事"。这些虚构不是谎言，而是构建文明的工具。只有人类能与素昧平生的数百万人合作，因为我们共享同样的虚构现实。\n\n3. 幸福感从未真正增加\n从狩猎采集到农业社会再到工业时代，生产力提升了千倍，个体的幸福感却未必同步增长。这让我对"更多、更快、更好"的现代信条有了更批判性的审视。'
  },
  {
    id: 2,
    title: '穷查理宝典',
    author: '查理·芒格',
    color: '#1E3A5F',
    height: 188, width: 46,
    year: '2024',
    rating: 5,
    intro: '查理·芒格毕生的思维精华，涵盖投资哲学、商业洞察和人生智慧。核心思想是"多元思维模型"——从物理学、心理学、经济学等多个学科借鉴工具，用跨学科视角解决复杂问题，是一套思考框架和人生哲学。',
    notes: '1. 反转，永远反转\n与其思考如何成功，不如先想清楚如何避免失败。应用到产品设计：与其想用户喜欢什么，不如先列出所有用户会讨厌的体验，逐一消除。这是一种非常实用的逆向思维工具。\n\n2. 多元思维模型\n单一学科的知识容易让人用一把锤子看到处都是钉子。芒格强调从物理学、心理学、经济学等多学科借鉴工具，用跨学科视角解决复杂问题。这让我开始主动跨领域阅读。\n\n3. 心理倾向清单\n这章让我意识到自己有多少认知偏差：社会认同偏差、可得性启发、确认偏见……认识到偏差的存在是克服它的第一步，促使我开始建立自己的思维模型库。'
  },
  {
    id: 3,
    title: '活着',
    author: '余华',
    color: '#7A1A1A',
    height: 160, width: 30,
    year: '2022',
    rating: 5,
    intro: '富贵一生的起伏，跌宕的命运，亲人一个个离去，而他依然"活着"。余华用极度克制的笔法写出了极度沉重的生命哲学：活着本身就是意义，不需要任何附加条件。这是我读过最沉重也最有力量的中文小说之一。',
    notes: '读完后很久都有一种难以言说的感受。余华的语言几乎没有多余的修饰，却能让每一次死亡都像一把钝刀落下。\n\n让我思考最多的是：福贵没有"活出意义"，没有实现自我，没有改变世界——他只是活着。但这本书却让我感受到这种"只是活着"的深刻尊严。\n\n在追求效率、成功、意义的时代，这是一个重要的反向提醒：生命本身就值得尊重，不需要任何附加条件来证明它的价值。'
  },
  {
    id: 4,
    title: '置身事内',
    author: '兰小欢',
    color: '#1E4A28',
    height: 168, width: 38,
    year: '2024',
    rating: 4,
    intro: '一本理解中国经济运行逻辑的入门书。从地方政府的行为逻辑出发，解释了土地财政、城镇化、债务风险等中国特色经济现象的根本驱动力。读懂这本书，才能真正理解过去30年中国经济腾飞的内在机制。',
    notes: '1. 土地财政的真实逻辑\n之前对"土地财政"的理解停留在"政府靠卖地赚钱"，读完才明白这是一套完整的城市化融资机制——地方政府以土地为抵押融资，用未来的税收偿还，本质上是一种跨时间的套利。\n\n2. 城镇化放缓后的压力\n这套机制在高速城镇化阶段极为有效，但当城镇化增速放缓、土地升值预期消退，债务偿还的压力就会集中爆发。这解释了当前许多地方政府困境的深层原因。\n\n3. 理解政府行为是理解行业的前提\n要真正看懂一个行业的发展，必须理解政府在其中的激励机制和行为逻辑。政府不只是"规则制定者"，本身也是最重要的市场参与者之一。'
  },
  {
    id: 5,
    title: '原则',
    author: '瑞·达里奥',
    color: '#1A3570',
    height: 190, width: 50,
    year: '2023',
    rating: 4,
    intro: '桥水基金创始人达里奥将40年人生和工作原则系统化呈现。核心理念是"极度透明"和"可信度加权决策"，提供了一套应对现实、处理关系、建立组织文化的具体方法论。',
    notes: '1. 痛苦 + 反思 = 进步\n这个公式是全书的核心。大多数人本能地逃避痛苦，但成功者把每一次失败都当成数据点。我开始把工作中的 bug 和项目失败都记录下来，强迫自己用 5 Whys 分析根本原因，而不只是写"下次注意"。\n\n2. 可信度加权决策\n他对"可信度"的定义很独特：不是声望或资历，而是"在这个领域有过成功记录，且能清晰解释逻辑的人"。这改变了我在技术方案评估时的权重分配——资历不等于正确。\n\n3. 极度透明的代价与价值\n桥水内部的极度透明文化让很多人不适应，但它能快速暴露问题、减少政治博弈。让我思考：在团队中，适度透明是否比维持表面和谐更有长期价值？'
  },
  {
    id: 6,
    title: '三体',
    author: '刘慈欣',
    color: '#2D1B69',
    height: 178, width: 42,
    year: '2022',
    rating: 5,
    intro: '人类文明与三体文明的第一次接触，从文化大革命延伸至宇宙尽头。刘慈欣构建了冷酷的宇宙观："黑暗森林法则"——宇宙是黑暗的森林，每个文明都是带枪的猎人，一旦暴露，必然消亡。这是中国科幻的巅峰之作。',
    notes: '1. 黑暗森林法则的冷酷推导\n生存需求 + 文明扩张 + 通信不对称 = 宇宙中所有文明必然相互猎杀。这个推导过程极度简洁却令人不寒而栗，让我重新理解了"信息暴露"在竞争中的风险代价。\n\n2. 与现实世界惊人相似\n黑暗森林法则和国际关系、商业竞争有惊人的结构性相似：在信息不对称的竞争环境中，过早暴露实力往往不是最优策略。弱小时的低调与强大后的亮相，都有其内在逻辑。\n\n3. 对合作与竞争的重新理解\n读完后，我不再把"合作"视为理所当然的善。合作是在特定条件下的理性选择，而非道德命令。理解这一点，让我对商业合作的本质有了更清醒的认知。'
  },
  {
    id: 7,
    title: '心流',
    author: '米哈里·契克森米哈',
    color: '#4A2A18',
    height: 162, width: 34,
    year: '2024',
    rating: 4,
    intro: '积极心理学的奠基之作。作者提出"心流"（Flow）概念——当挑战与技能完美匹配时，人会进入忘我的、高度专注的最优体验状态。从科学角度解释了为何某些活动让人充实，另一些让人空虚。',
    notes: '1. 挑战与能力的匹配是关键\n太容易的任务导致无聊，太难的任务导致焦虑，只有恰好超出能力边界一点点的挑战才能产生心流。这解释了为什么某些下午写代码能"忘记时间"，而某些早上却完全进入不了状态。\n\n2. 主动设计心流环境\n心流不是随机降临的，而是可以主动创造的。我开始把大任务拆解到"刚好有挑战性"的颗粒度，在开始前清除干扰，做中刻意阻断手机通知。\n\n3. 用心流筛选值得投入的事\n当我用"这件事能给我带来心流吗"来评估任务时，很多原本看起来"应该做"的事自然地从清单上消失了。这是一种比"优先级"更本质的筛选标准。'
  },
  {
    id: 8,
    title: '当下的力量',
    author: '埃克哈特·托利',
    color: '#1A4040',
    height: 155, width: 32,
    year: '2023',
    rating: 4,
    intro: '一本关于"活在当下"的心灵书籍。托利认为人类大部分的痛苦来自对过去的懊悔和对未来的忧虑，真正的宁静只存在于"当下这一刻"。融合了禅宗、道家和西方心理学的智慧，提供了一种全新的存在方式。',
    notes: '1. 觉察"思维的噪音"\n大脑中不断出现的念头——担心项目能否按时交付、后悔上周做的决定——并不是"我"本身，而是"思维"在运作。当能够从"观察者"角度看待这些念头，它们就不再那么有控制力了。\n\n2. 当下是唯一真实存在的时间\n过去只存在于记忆中，未来只存在于想象中，唯有当下是真实发生的。这个观点听起来简单，但真正内化后会改变对焦虑和压力的态度。\n\n3. 实践中的局限\n这本书有时会显得过于"玄学"，需要反复阅读才能体会。但在工作压力大时，"回到当下"这个练习确实有帮助，值得长期实践。'
  },
  {
    id: 9,
    title: '通往奴役之路',
    author: '弗里德里希·哈耶克',
    color: '#1AB048',
    height: 155, width: 32,
    year: '2023',
    rating: 5,
    intro: '这本书写于二战时期，背景是欧洲法西斯主义和社会主义计划经济的兴起。哈耶克试图解释：为什么一些原本追求公平与效率的制度，最后却可能走向专制。',
    notes: '1. 计划经济可能威胁自由\n如果国家全面控制经济（生产什么、卖多少、定什么价格），就必须集中权力。而权力一旦集中，就容易侵蚀个人自由。这不是说福利国家必然走向专制，而是全面的计划经济存在这种内在风险。\n\n2. 自由市场是分散决策系统\n哈耶克提出一个重要思想：没有人能掌握全部信息。市场价格本身就是一种信息系统，如果政府替代市场，就会失去这套信息机制，决策质量必然下降。\n\n3. 法治比结果更重要\n自由社会的关键不是结果平等，而是规则一致：法律对所有人一样、政府权力受到限制。\n\n4. 对我的启示\n制度设计的关键在于激励机制，而非初衷。好的初衷配上错误的制度设计，同样可能产生糟糕的结果。'
  }
]

const rows = [books.slice(0, 4), books.slice(4)]
const activeId = ref(null)
const activeBook = computed(() => books.find(b => b.id === activeId.value) || null)

function select (book) {
  activeId.value = activeId.value === book.id ? null : book.id
}

const shelfRef = ref(null)
const shelfHeight = ref(0)

function syncHeight () {
  if (shelfRef.value) {
    shelfHeight.value = shelfRef.value.offsetHeight
  }
}

const detailStyle = computed(() =>
  shelfHeight.value > 0 ? { height: shelfHeight.value + 'px' } : {}
)

let ro = null
onMounted(() => {
  syncHeight()
  ro = new ResizeObserver(syncHeight)
  if (shelfRef.value) ro.observe(shelfRef.value)
})
onUnmounted(() => { if (ro) ro.disconnect() })
</script>

<style scoped>
/* ──────────────────────────────────────────────
   Section wrapper
────────────────────────────────────────────── */
.reading-section {
  background: #0a0a0a;
  padding: 72px 16px 88px;
  padding-left: calc(16px + env(safe-area-inset-left));
  padding-right: calc(16px + env(safe-area-inset-right));
  padding-bottom: calc(88px + env(safe-area-inset-bottom));
  width: 100%;
}

/* ──────────────────────────────────────────────
   Section header
────────────────────────────────────────────── */
.reading-header {
  max-width: 680px;
  margin: 0 auto 52px;
  text-align: center;
}

.reading-title {
  font-size: clamp(24px, 3.5vw, 32px);
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 0 0 12px;
  background: linear-gradient(90deg, #f5f5f7 0%, #2997ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.reading-desc {
  font-size: 17px;
  line-height: 1.55;
  letter-spacing: 0.01em;
  margin: 0;
  background: linear-gradient(90deg, #a1a1a6 0%, #2997ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

/* ──────────────────────────────────────────────
   Two-column layout
────────────────────────────────────────────── */
.reading-layout {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  max-width: min(92vw, 960px);
  margin: 0 auto;
}

/* ──────────────────────────────────────────────
   Left: Bookshelf area
────────────────────────────────────────────── */
.bs-shelf-area {
  flex: 0 0 42%;
  position: relative;
  padding-top: 70px;
}

/* ──────────────────────────────────────────────
   Hanging lamp
────────────────────────────────────────────── */
.bs-lamp {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
}

.bs-wire {
  width: 2px;
  height: 26px;
  background: linear-gradient(to bottom, #3a3a3a 0%, #504030 100%);
}

.bs-shade {
  width: 68px;
  height: 36px;
  background: linear-gradient(180deg, #171208 0%, #23190c 55%, #171208 100%);
  clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
  border-radius: 0 0 3px 3px;
  box-shadow: inset 0 -1px 0 rgba(255, 210, 80, 0.08),
    0 0 12px rgba(0, 0, 0, 0.6);
}

.bs-glow {
  width: 72px;
  height: 5px;
  background: linear-gradient(
    to right,
    rgba(255, 210, 80, 0.4) 0%,
    rgba(255, 230, 120, 0.95) 50%,
    rgba(255, 210, 80, 0.4) 100%
  );
  border-radius: 0 0 50% 50%;
  box-shadow: 0 0 6px 3px rgba(255, 218, 80, 0.85),
    0 0 18px 9px rgba(255, 200, 60, 0.45),
    0 0 45px 22px rgba(255, 185, 40, 0.22),
    0 0 90px 45px rgba(255, 165, 20, 0.09);
}

/* ──────────────────────────────────────────────
   Light beam / cone effect
────────────────────────────────────────────── */
.bs-light-beam {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 115%;
  height: calc(100% - 60px);
  background: radial-gradient(
    ellipse 82% 58% at 50% 0%,
    rgba(255, 222, 100, 0.14) 0%,
    rgba(255, 210, 80, 0.08) 22%,
    rgba(255, 195, 60, 0.04) 45%,
    rgba(255, 180, 40, 0.01) 62%,
    transparent 72%
  );
  pointer-events: none;
  z-index: 2;
}

/* ──────────────────────────────────────────────
   Shelf cabinet
────────────────────────────────────────────── */
.bs-cabinet {
  position: relative;
  border: 1px solid rgba(255, 210, 80, 0.07);
  border-radius: 6px;
  padding: 18px 18px 0;
  z-index: 3;
  background: radial-gradient(
      ellipse 85% 38% at 50% 0%,
      rgba(255, 200, 60, 0.045) 0%,
      transparent 68%
    ),
    #060503;
  box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.92),
    0 10px 50px rgba(0, 0, 0, 0.75), inset 1px 1px 0 rgba(255, 220, 80, 0.04);
}

/* ──────────────────────────────────────────────
   Shelf row
────────────────────────────────────────────── */
.bs-row {
  display: flex;
  align-items: flex-end;
  gap: 5px;
  min-height: 196px;
  position: relative;
  z-index: 4;
}

/* ──────────────────────────────────────────────
   Shelf plank
────────────────────────────────────────────── */
.bs-plank {
  height: 14px;
  background: linear-gradient(to bottom, #2e2214, #1c1409, #100e06);
  border-radius: 1px;
  margin: 0 -5px 18px;
  position: relative;
  z-index: 4;
  box-shadow: 0 5px 14px rgba(0, 0, 0, 0.85), 0 2px 5px rgba(0, 0, 0, 0.65),
    inset 0 1px 0 rgba(255, 200, 80, 0.07);
}

.bs-plank:last-child {
  margin-bottom: 0;
}

/* ──────────────────────────────────────────────
   Book
────────────────────────────────────────────── */
.bs-book {
  flex: 0 0 var(--bw);
  height: var(--bh);
  background-color: var(--bc);
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.48) 0%,
    rgba(0, 0, 0, 0.16) 14%,
    rgba(255, 255, 255, 0.03) 65%,
    rgba(255, 255, 255, 0.09) 84%,
    rgba(0, 0, 0, 0.32) 100%
  );
  border-radius: 1px 3px 3px 1px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  will-change: transform;
  transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.28s ease, filter 0.28s ease;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.55), -1px 0 3px rgba(0, 0, 0, 0.45),
    inset 1px 0 0 rgba(255, 255, 255, 0.06);
}

.bs-book:hover {
  transform: translateY(-13px);
  filter: brightness(1.22);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.6), -1px 0 4px rgba(0, 0, 0, 0.45),
    0 13px 22px rgba(0, 0, 0, 0.55);
}

.bs-book--active {
  transform: translateY(-17px) !important;
  filter: brightness(1.3) !important;
  box-shadow: 0 0 0 2px rgba(41, 151, 255, 0.65),
    0 0 18px rgba(41, 151, 255, 0.28), 0 17px 34px rgba(0, 0, 0, 0.65),
    2px 0 6px rgba(0, 0, 0, 0.55) !important;
}

/* ──────────────────────────────────────────────
   Book spine text
────────────────────────────────────────────── */
.bs-spine {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.82);
  letter-spacing: 0.06em;
  white-space: nowrap;
  overflow: hidden;
  max-height: calc(var(--bh) - 18px);
  pointer-events: none;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.75);
  line-height: 1;
  padding: 6px 0;
}

/* ──────────────────────────────────────────────
   Right: Detail area
────────────────────────────────────────────── */
.bs-detail-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ──────────────────────────────────────────────
   Book card
────────────────────────────────────────────── */
.bs-card {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background: #0d0d0d;
  overflow: hidden;
}

/* Fixed header (cover + metadata) */
.bs-card-head {
  flex-shrink: 0;
}

/* Scrollable body */
.bs-card-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 18px 20px;
}

.bs-card-body::-webkit-scrollbar {
  width: 4px;
}

.bs-card-body::-webkit-scrollbar-track {
  background: transparent;
}

.bs-card-body::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

/* Decorative cover banner */
.bs-cover {
  width: 100%;
  min-height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 14px 18px;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.bs-cover::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
}

.bs-cover::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.015) 0px,
    rgba(255, 255, 255, 0.015) 1px,
    transparent 1px,
    transparent 20px
  );
}

.bs-cover-title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  position: relative;
  z-index: 1;
  margin: 0;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.6);
  letter-spacing: -0.01em;
}

.bs-cover-author {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.68);
  position: relative;
  z-index: 1;
  margin: 4px 0 0;
}

.bs-info-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 14px 18px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: #0d0d0d;
}

.bs-book-name {
  font-size: 17px;
  font-weight: 700;
  color: #f5f5f7;
  margin: 0 0 4px;
  letter-spacing: -0.01em;
}

.bs-book-author {
  font-size: 13px;
  color: #86868b;
  margin: 0;
}

.bs-book-stat {
  text-align: right;
  flex-shrink: 0;
  margin-left: 12px;
}

.bs-year {
  font-size: 11px;
  color: #86868b;
  display: block;
  margin-bottom: 5px;
  white-space: nowrap;
}

.bs-rating {
  display: flex;
  gap: 2px;
  justify-content: flex-end;
}

.bs-star {
  font-size: 13px;
  color: #2c2c2e;
  transition: color 0.2s;
}

.bs-star.lit {
  color: #ffd60a;
}

.bs-block {
  margin-top: 16px;
}

.bs-block:first-child {
  margin-top: 0;
}

.bs-block-label {
  font-size: 10px;
  font-weight: 700;
  color: #2997ff;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 0 0 7px;
}

.bs-block-text {
  font-size: 13px;
  line-height: 1.88;
  color: #a1a1a6;
  margin: 0;
  white-space: pre-line;
}

/* ──────────────────────────────────────────────
   Empty state
────────────────────────────────────────────── */
.bs-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.bs-empty-icon {
  font-size: 44px;
  display: block;
  margin-bottom: 12px;
  opacity: 0.3;
  filter: grayscale(0.4);
}

.bs-empty-hint {
  font-size: 15px;
  color: #86868b;
  margin: 0;
}

.bs-empty-sub {
  font-size: 13px;
  color: #3a3a3c;
  margin: 0;
}

/* ──────────────────────────────────────────────
   Slide transition
────────────────────────────────────────────── */
.bs-slide-enter-active,
.bs-slide-leave-active {
  transition: all 0.3s ease;
}

.bs-slide-enter-from {
  opacity: 0;
  transform: translateX(18px);
}

.bs-slide-leave-to {
  opacity: 0;
  transform: translateX(-14px);
}

/* ──────────────────────────────────────────────
   Responsive
────────────────────────────────────────────── */
@media (max-width: 680px) {
  .reading-section {
    padding-top: 48px;
    padding-bottom: calc(64px + env(safe-area-inset-bottom));
  }

  .reading-layout {
    flex-direction: column;
    max-width: 100%;
    gap: 28px;
  }

  .bs-shelf-area {
    flex: none;
    width: 100%;
  }

  .bs-row {
    min-height: 160px;
    justify-content: center;
  }

  .bs-empty {
    min-height: 220px;
  }

  .bs-card {
    overflow-y: visible;
  }
}
</style>
