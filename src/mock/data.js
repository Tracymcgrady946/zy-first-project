/**
 * 前端硬编码数据，当 VITE_USE_BACKEND=false 或 ?mock=1 时使用
 * 图片使用 import 引入，确保 mock 模式下不依赖后端 /uploads
 */
import profilePhoto from '../assets/img/elon_musk_PNG43.jpg'
import profile1 from '../assets/img/profile/page1.png'
import profile2 from '../assets/img/profile/page2.png'
import profile3 from '../assets/img/profile/page3.png'
import profile4 from '../assets/img/profile/page4.png'
import profile5 from '../assets/img/profile/page5.png'
import vitalityGo1 from '../assets/img/project/vitality-go/vitality-go-1.PNG'
import vitalityGo2 from '../assets/img/project/vitality-go/vitality-go-2.PNG'
import vitalityGo3 from '../assets/img/project/vitality-go/vitality-go-3.PNG'
import vitalityGo4 from '../assets/img/project/vitality-go/vitality-go-4.PNG'
import fourHigh1 from '../assets/img/project/four-high/four-high-1.PNG'
import fourHigh2 from '../assets/img/project/four-high/four-high-2.PNG'
import fourHigh3 from '../assets/img/project/four-high/four-high-3.PNG'
import fourHigh4 from '../assets/img/project/four-high/four-high-4.PNG'
import fourHigh5 from '../assets/img/project/four-high/four-high-5.PNG'
import fourHigh6 from '../assets/img/project/four-high/four-high-6.PNG'
import fourHigh7 from '../assets/img/project/four-high/four-high-7.PNG'
import fourHigh8 from '../assets/img/project/four-high/four-high-8.PNG'
import fourHigh9 from '../assets/img/project/four-high/four-high-9.PNG'
import weightManage1 from '../assets/img/project/weight-manage/weight-manage-1.PNG'
import weightManage2 from '../assets/img/project/weight-manage/weight-manage-2.PNG'
import weightManage3 from '../assets/img/project/weight-manage/weight-manage-3.PNG'
import weightManage4 from '../assets/img/project/weight-manage/weight-manage-4.PNG'
import weightManage5 from '../assets/img/project/weight-manage/weight-manage-5.PNG'
import weightManage6 from '../assets/img/project/weight-manage/weight-manage-6.PNG'
import weightManage7 from '../assets/img/project/weight-manage/weight-manage-7.PNG'

const timelinePlaceholderMedia = [
  { type: 'image', src: profile1, alt: '时光' },
  { type: 'image', src: profile2, alt: '时光' },
  { type: 'image', src: profile3, alt: '时光' },
  { type: 'image', src: profile4, alt: '时光' },
  { type: 'image', src: profile5, alt: '时光' }
]

const profileZhCN = {
  name: '张岳',
  role: '前端工程师 · 个人介绍',
  photo_url: profilePhoto,
  introLines: [
    '一名前端工程师，也是一名持续用 AI 重塑工作方式的实践者。',
    '我关注产品体验、工程效率，也相信技术最终要服务于真实生活。'
  ],
  infoList: [
    { icon: '♂', label: '性别', value: '男', href: null },
    { icon: '✦', label: '爱好', value: '篮球 · 滑雪', href: null },
    { icon: '◎', label: '坐标', value: '上海', href: null },
    { icon: '✈', label: '最爱城市', value: '青岛 · 杭州 · 万宁 · 瓦纳卡', href: null },
    { icon: '◈', label: '2026 目标', value: 'English · AI 前端实践 · AI 跨行业', href: null },
    { icon: '@', label: 'Email', value: 'xx@gmail.com', href: 'mailto:xx@gmail.com' }
  ]
}

const profileEnUS = {
  name: 'Zhang Yue',
  role: 'Front-End Engineer · Personal Page',
  photo_url: profilePhoto,
  introLines: [
    'A front-end engineer and a practitioner reshaping my workflow with AI.',
    'I care about product experience, engineering efficiency, and technology that serves real life.'
  ],
  infoList: [
    { icon: '♂', label: 'Gender', value: 'Male', href: null },
    { icon: '✦', label: 'Hobbies', value: 'Basketball · Skiing', href: null },
    { icon: '◎', label: 'Based in', value: 'Shanghai', href: null },
    { icon: '✈', label: 'Fav. Cities', value: 'Qingdao · Hangzhou · Wanning · Wānaka', href: null },
    { icon: '◈', label: '2026 Goals', value: 'English · AI Front-End · AI Industries', href: null },
    { icon: '@', label: 'Email', value: 'xx@gmail.com', href: 'mailto:xx@gmail.com' }
  ]
}

const navZhCN = [
  { label: '介绍', href: '#intro' },
  { label: '项目经历', href: '#about' },
  { label: '阅读', href: '#reading' },
  { label: 'Skill', href: '#skills' },
  { label: 'AI 动态', href: '#contact' }
]

const navEnUS = [
  { label: 'Intro', href: '#intro' },
  { label: 'Projects', href: '#about' },
  { label: 'Reading', href: '#reading' },
  { label: 'Skills', href: '#skills' },
  { label: 'AI Pulse', href: '#contact' }
]

const sectionsZhCN = [
  { id: 'about', title: '项目经历', description: '在以往项目中获得的经验以及思考', theme: 'about' },
  { id: 'reading', title: '阅读', description: '在书架上取下一本，翻开那些改变过我思考方式的文字。', theme: null },
  { id: 'skills', title: '我的 Skill', description: '按表格罗列当前本机安装的 Codex skills，每次展开 10 条。', theme: 'skills' },
  { id: 'contact', title: 'AI 动态', description: '聚合最新 AI 头条、知乎热议与 GitHub 爆火项目，随时掌握前沿脉搏。', theme: 'contact' }
]

const sectionsEnUS = [
  { id: 'about', title: 'Project Experience', description: 'Experience and reflections gained from previous projects.', theme: 'about' },
  { id: 'reading', title: 'Reading', description: 'Pick a book off the shelf and explore the words that changed the way I think.', theme: null },
  { id: 'skills', title: 'My Skills', description: 'A local inventory of Codex skills installed on this machine.', theme: 'skills' },
  { id: 'contact', title: 'AI Pulse', description: 'Aggregating the latest AI headlines, Zhihu discussions, and trending GitHub projects.', theme: 'contact' }
]

const siteConfig = {
  typewriter_speed: '100',
  typewriter_start_after: '800',
  typewriter_show_cursor: 'false'
}

const projectsZhCN = [
  {
    key: 'huoliGo',
    name: '活力Go',
    thought: '在健康类产品中，数据可视化是激励用户坚持的核心手段，但过度的数据展示反而容易让用户焦虑。如何在「有效反馈」和「轻量体验」之间找到平衡，是我在这个项目里思考最多的设计命题。同时也让我意识到，前端工程师对产品逻辑的理解深度，直接决定了组件设计的合理性。',
    techs: [
      'Vue3 + Vite 构建移动端 H5，配合 Pinia 统一状态管理',
      '基于 Canvas 实现运动轨迹与热力图可视化',
      '高德地图 SDK 深度集成，支持实时定位与路线规划',
      '自定义 WebSocket 心跳机制，保障实时消息稳定推送',
      '封装统一请求拦截器，处理 Token 刷新与错误降级'
    ],
    media: [
      { type: 'image', src: vitalityGo1, alt: '活力Go' },
      { type: 'image', src: vitalityGo2, alt: '活力Go' },
      { type: 'image', src: vitalityGo3, alt: '活力Go' },
      { type: 'image', src: vitalityGo4, alt: '活力Go' }
    ]
  },
  {
    key: 'fourHigh',
    name: '四高一重',
    thought: '慢病管理系统中，医生端和患者端的信息密度诉求截然不同——医生需要高密度的数据看板，患者却需要极简的操作引导。如何设计一套组件库同时服务两种截然不同的用户心智，是整个项目最大的挑战，也让我对「以角色为中心的设计」有了更深的认识。',
    techs: [
      'Vue3 + Element Plus 构建医疗中后台，模块化路由分权',
      'ECharts 绘制血压/血糖/血脂等多维健康指标趋势图',
      'JSON Schema 驱动动态表单，支持多种题型与条件联动',
      '虚拟滚动优化万级患者列表，首屏渲染时间降低 60%',
      '基于 RBAC 模型实现医生、护士、管理员三端权限隔离'
    ],
    media: [
      { type: 'image', src: fourHigh1, alt: '四高一重' },
      { type: 'image', src: fourHigh2, alt: '四高一重' },
      { type: 'image', src: fourHigh3, alt: '四高一重' },
      { type: 'image', src: fourHigh4, alt: '四高一重' },
      { type: 'image', src: fourHigh5, alt: '四高一重' },
      { type: 'image', src: fourHigh6, alt: '四高一重' },
      { type: 'image', src: fourHigh7, alt: '四高一重' },
      { type: 'image', src: fourHigh8, alt: '四高一重' },
      { type: 'image', src: fourHigh9, alt: '四高一重' }
    ]
  },
  {
    key: 'fuwaiWeight',
    name: '阜外减重',
    thought: '医院信息化项目让我意识到，与后端工程师和产品经理的深度协同，比技术选型本身更重要。流程设计的严谨性直接影响患者的实际就医体验——哪怕一个按钮的文案不准确，都可能引发真实的医疗误解。这个项目让我对「负责任的前端开发」有了全新的理解。',
    techs: [
      'uni-app 跨端开发，微信小程序与 H5 双端同构',
      '体重 / BMI 折线图，支持阶段目标标注与里程碑动效',
      '饮食打卡模块，封装热量计算与营养素分析逻辑',
      'RESTful API 对接医院 HIS 系统，处理复杂数据映射',
      '医患消息系统，支持图文消息与复诊提醒推送'
    ],
    media: [
      { type: 'image', src: weightManage1, alt: '阜外减重' },
      { type: 'image', src: weightManage2, alt: '阜外减重' },
      { type: 'image', src: weightManage3, alt: '阜外减重' },
      { type: 'image', src: weightManage4, alt: '阜外减重' },
      { type: 'image', src: weightManage5, alt: '阜外减重' },
      { type: 'image', src: weightManage6, alt: '阜外减重' },
      { type: 'image', src: weightManage7, alt: '阜外减重' }
    ]
  },
  {
    key: 'summaryHighlights',
    name: '总结-项目中的亮点',
    thought: '回顾多个项目的积累，真正让我成长的不是某一项具体技术，而是在不同业务场景下反复锻炼出的「系统性思维」——如何设计出既能快速迭代、又足够稳定的前端架构。每个项目的痛点都是一次重构机会，而每次重构都让我对「简洁即正确」的工程哲学有更深的体会。',
    techs: [
      '跨项目抽象可复用组件库，统一设计语言与交互规范',
      '性能优化实践：虚拟滚动、懒加载、代码分割，首屏提速 40%+',
      '封装通用请求层，统一处理 Token 刷新、错误码映射与降级策略',
      '基于 RBAC 模型设计多角色权限体系，支持菜单、按钮级细粒度控制',
      '引入 ECharts + Canvas 双引擎可视化方案，兼顾灵活性与渲染性能',
      '建立前端工程规范：ESLint + Prettier + Husky，保障团队代码一致性'
    ],
    media: []
  }
]

const projectsEnUS = [
  {
    key: 'huoliGo',
    name: 'Vitality Go',
    thought: "In health-focused products, data visualization is the key driver of user motivation — yet information overload can easily cause anxiety. Finding the balance between 'meaningful feedback' and 'lightweight experience' was the central design question I wrestled with.",
    techs: [
      'Built mobile H5 with Vue3 + Vite, unified state management via Pinia',
      'Canvas-based activity trail and heatmap visualizations',
      'Deep integration with Amap SDK for real-time location and route planning',
      'Custom WebSocket heartbeat mechanism for stable real-time messaging',
      'Unified request interceptor with Token refresh and graceful error fallback'
    ],
    media: [
      { type: 'image', src: vitalityGo1, alt: 'Vitality Go' },
      { type: 'image', src: vitalityGo2, alt: 'Vitality Go' },
      { type: 'image', src: vitalityGo3, alt: 'Vitality Go' },
      { type: 'image', src: vitalityGo4, alt: 'Vitality Go' }
    ]
  },
  {
    key: 'fourHigh',
    name: 'Four-High One-Heavy',
    thought: "In chronic disease management, doctors and patients have completely opposite information-density needs — doctors require dense dashboards while patients need ultra-simple guidance.",
    techs: [
      'Vue3 + Element Plus mid-to-back-end architecture with modular role-based routing',
      'ECharts multi-dimensional health trend charts for BP, glucose, lipids, and more',
      'JSON Schema-driven dynamic forms supporting conditional logic and multiple field types',
      'Virtual scrolling optimization for tens-of-thousands patient lists — 60% faster first paint',
      'RBAC model enforcing permission isolation across doctor, nurse, and admin roles'
    ],
    media: [
      { type: 'image', src: fourHigh1, alt: 'Four-High' },
      { type: 'image', src: fourHigh2, alt: 'Four-High' },
      { type: 'image', src: fourHigh3, alt: 'Four-High' },
      { type: 'image', src: fourHigh4, alt: 'Four-High' },
      { type: 'image', src: fourHigh5, alt: 'Four-High' },
      { type: 'image', src: fourHigh6, alt: 'Four-High' },
      { type: 'image', src: fourHigh7, alt: 'Four-High' },
      { type: 'image', src: fourHigh8, alt: 'Four-High' },
      { type: 'image', src: fourHigh9, alt: 'Four-High' }
    ]
  },
  {
    key: 'fuwaiWeight',
    name: 'Fuwai Weight Management',
    thought: "This hospital project made me realize that deep collaboration with back-end engineers and product managers matters more than any technology choice.",
    techs: [
      'Cross-platform development with uni-app, isomorphic across WeChat Mini Program and H5',
      'Weight / BMI trend chart with milestone annotations and celebration animations',
      'Meal-tracking module with calorie calculation and nutrient analysis logic',
      'RESTful API integration with hospital HIS systems, handling complex data mapping',
      'Doctor-patient messaging system supporting rich media and follow-up reminders'
    ],
    media: [
      { type: 'image', src: weightManage1, alt: 'Weight Management' },
      { type: 'image', src: weightManage2, alt: 'Weight Management' },
      { type: 'image', src: weightManage3, alt: 'Weight Management' },
      { type: 'image', src: weightManage4, alt: 'Weight Management' },
      { type: 'image', src: weightManage5, alt: 'Weight Management' },
      { type: 'image', src: weightManage6, alt: 'Weight Management' },
      { type: 'image', src: weightManage7, alt: 'Weight Management' }
    ]
  },
  {
    key: 'summaryHighlights',
    name: 'Summary — Project Highlights',
    thought: "Looking back across multiple projects, what truly drove my growth wasn't any single technology — it was the 'systems thinking' forged through tackling different business domains.",
    techs: [
      'Abstracted a cross-project reusable component library with unified design language',
      'Performance optimizations — virtual scrolling, lazy loading, code splitting — 40%+ faster first paint',
      'Generic request layer encapsulating Token refresh, error-code mapping, and graceful fallback',
      'RBAC-based multi-role permission system with menu- and button-level granularity',
      'Dual-engine visualization strategy with ECharts + Canvas, balancing flexibility and render performance',
      'Established front-end engineering standards: ESLint + Prettier + Husky for team-wide consistency'
    ],
    media: []
  }
]

const timelineZhCN = [
  { year: '2026', title: '崭新征程', media: timelinePlaceholderMedia },
  { year: '2025', title: '当下此刻', media: timelinePlaceholderMedia },
  { year: '2024', title: '逐梦前行', media: timelinePlaceholderMedia },
  { year: '2023', title: '探索远方', media: timelinePlaceholderMedia },
  { year: '2022', title: '沉淀成长', media: timelinePlaceholderMedia },
  { year: '2021', title: '温暖记忆', media: timelinePlaceholderMedia },
  { year: '2020', title: '新的起点', media: timelinePlaceholderMedia }
]

const timelineEnUS = [
  { year: '2026', title: 'New Chapter', media: timelinePlaceholderMedia },
  { year: '2025', title: 'Present Day', media: timelinePlaceholderMedia },
  { year: '2024', title: 'Chasing Dreams', media: timelinePlaceholderMedia },
  { year: '2023', title: 'Exploring Horizons', media: timelinePlaceholderMedia },
  { year: '2022', title: 'Growing & Reflecting', media: timelinePlaceholderMedia },
  { year: '2021', title: 'Cherished Memories', media: timelinePlaceholderMedia },
  { year: '2020', title: 'New Beginnings', media: timelinePlaceholderMedia }
]

const books = [
  { id: 1, title: '人类简史', author: '尤瓦尔·赫拉利', color: '#9B6A2F', height: 172, width: 38, year: '2023', rating: 5, intro: '从认知革命、农业革命到科学革命，赫拉利以宏观视角重新梳理了人类700万年的历史。他提出了一个震撼性论断：人类之所以能统治世界，不是因为更聪明，而是因为能够创造并相信"虚构的故事"——宗教、国家、金钱与法律。', notes: '1. 农业革命是人类史上最大的骗局\n小麦"驯化"了人类，而非人类驯化了小麦。农业革命从个体角度看是退步——更辛苦、食物更单一——却从种群角度推动了文明进程。让我开始质疑"进步"的真实含义。\n\n2. 虚构让人类统治世界\n货币、公司、法律、国家都是人类集体相信的"故事"。这些虚构不是谎言，而是构建文明的工具。只有人类能与素昧平生的数百万人合作，因为我们共享同样的虚构现实。\n\n3. 幸福感从未真正增加\n从狩猎采集到农业社会再到工业时代，生产力提升了千倍，个体的幸福感却未必同步增长。这让我对"更多、更快、更好"的现代信条有了更批判性的审视。' },
  { id: 2, title: '穷查理宝典', author: '查理·芒格', color: '#1E3A5F', height: 188, width: 46, year: '2024', rating: 5, intro: '查理·芒格毕生的思维精华，涵盖投资哲学、商业洞察和人生智慧。核心思想是"多元思维模型"——从物理学、心理学、经济学等多个学科借鉴工具，用跨学科视角解决复杂问题，是一套思考框架和人生哲学。', notes: '1. 反转，永远反转\n与其思考如何成功，不如先想清楚如何避免失败。应用到产品设计：与其想用户喜欢什么，不如先列出所有用户会讨厌的体验，逐一消除。这是一种非常实用的逆向思维工具。\n\n2. 多元思维模型\n单一学科的知识容易让人用一把锤子看到处都是钉子。芒格强调从物理学、心理学、经济学等多学科借鉴工具，用跨学科视角解决复杂问题。这让我开始主动跨领域阅读。\n\n3. 心理倾向清单\n这章让我意识到自己有多少认知偏差：社会认同偏差、可得性启发、确认偏见……认识到偏差的存在是克服它的第一步，促使我开始建立自己的思维模型库。' },
  { id: 3, title: '活着', author: '余华', color: '#7A1A1A', height: 160, width: 30, year: '2022', rating: 5, intro: '富贵一生的起伏，跌宕的命运，亲人一个个离去，而他依然"活着"。余华用极度克制的笔法写出了极度沉重的生命哲学：活着本身就是意义，不需要任何附加条件。这是我读过最沉重也最有力量的中文小说之一。', notes: '读完后很久都有一种难以言说的感受。余华的语言几乎没有多余的修饰，却能让每一次死亡都像一把钝刀落下。\n\n让我思考最多的是：福贵没有"活出意义"，没有实现自我，没有改变世界——他只是活着。但这本书却让我感受到这种"只是活着"的深刻尊严。\n\n在追求效率、成功、意义的时代，这是一个重要的反向提醒：生命本身就值得尊重，不需要任何附加条件来证明它的价值。' },
  { id: 4, title: '保重', author: '大冰', color: '#355C6D', height: 168, width: 38, year: '2024', rating: 4, intro: '大冰延续他擅长的江湖故事与人间烟火，把漂泊、相逢、告别和自我安顿写进一个个具体的人身上。书名"保重"像一句临别叮嘱，也像提醒自己：热闹会散场，生活还要继续。', notes: '1. 保重是一种温柔的边界\n不是所有关系都能一直同行，有些人只能陪你走一段。真正成熟的告别，不是用力挽留，而是认真记得，然后各自保重。\n\n2. 普通人的故事也有重量\n书里的动人之处，不在于情节多么宏大，而在于每个人都带着自己的难处继续生活。这让我重新看见日常里那些不被表达的坚韧。\n\n3. 热闹之后仍要回到自己\n故事可以让人短暂靠近远方，但读完之后，真正重要的还是回到自己的生活，把眼前的路走稳。' },
  { id: 5, title: '原则', author: '瑞·达里奥', color: '#1A3570', height: 190, width: 50, year: '2023', rating: 4, intro: '桥水基金创始人达里奥将40年人生和工作原则系统化呈现。核心理念是"极度透明"和"可信度加权决策"，提供了一套应对现实、处理关系、建立组织文化的具体方法论。', notes: '1. 痛苦 + 反思 = 进步\n这个公式是全书的核心。大多数人本能地逃避痛苦，但成功者把每一次失败都当成数据点。我开始把工作中的 bug 和项目失败都记录下来，强迫自己用 5 Whys 分析根本原因，而不只是写"下次注意"。\n\n2. 可信度加权决策\n他对"可信度"的定义很独特：不是声望或资历，而是"在这个领域有过成功记录，且能清晰解释逻辑的人"。这改变了我在技术方案评估时的权重分配——资历不等于正确。\n\n3. 极度透明的代价与价值\n桥水内部的极度透明文化让很多人不适应，但它能快速暴露问题、减少政治博弈。让我思考：在团队中，适度透明是否比维持表面和谐更有长期价值？' },
  { id: 6, title: '三体', author: '刘慈欣', color: '#2D1B69', height: 178, width: 42, year: '2022', rating: 5, intro: '人类文明与三体文明的第一次接触，从文化大革命延伸至宇宙尽头。刘慈欣构建了冷酷的宇宙观："黑暗森林法则"——宇宙是黑暗的森林，每个文明都是带枪的猎人，一旦暴露，必然消亡。这是中国科幻的巅峰之作。', notes: '1. 黑暗森林法则的冷酷推导\n生存需求 + 文明扩张 + 通信不对称 = 宇宙中所有文明必然相互猎杀。这个推导过程极度简洁却令人不寒而栗，让我重新理解了"信息暴露"在竞争中的风险代价。\n\n2. 与现实世界惊人相似\n黑暗森林法则和国际关系、商业竞争有惊人的结构性相似：在信息不对称的竞争环境中，过早暴露实力往往不是最优策略。弱小时的低调与强大后的亮相，都有其内在逻辑。\n\n3. 对合作与竞争的重新理解\n读完后，我不再把"合作"视为理所当然的善。合作是在特定条件下的理性选择，而非道德命令。理解这一点，让我对商业合作的本质有了更清醒的认知。' },
  { id: 7, title: '文城', author: '余华', color: '#6A3B28', height: 162, width: 34, year: '2024', rating: 5, intro: '余华写一个男人寻找妻子与"文城"的故事，也写动荡时代里人的执念、失去与命运。它不像《活着》那样极度压缩，却同样把人的苦难写得克制、荒凉，又带着一种说不清的温情。', notes: '1. 人会被一个念头带着走很久\n林祥福寻找文城，表面是在找一个地方，实际是在找一个承诺、一段关系和一个无法放下的答案。很多人生选择，都是被这样的执念推着向前。\n\n2. 命运常常不讲道理\n余华厉害的地方，是让苦难看起来不是戏剧化安排，而像生活本身突然落下的一场雪。人没有太多选择，只能在失去里继续往前。\n\n3. 文城也许不是地点，而是心里的归处\n读到最后会觉得，真正被寻找的不是某座城，而是一个人对安稳、信任和归属的想象。' },
  { id: 8, title: '当下的力量', author: '埃克哈特·托利', color: '#1A4040', height: 155, width: 32, year: '2023', rating: 4, intro: '一本关于"活在当下"的心灵书籍。托利认为人类大部分的痛苦来自对过去的懊悔和对未来的忧虑，真正的宁静只存在于"当下这一刻"。融合了禅宗、道家和西方心理学的智慧，提供了一种全新的存在方式。', notes: '1. 觉察"思维的噪音"\n大脑中不断出现的念头——担心项目能否按时交付、后悔上周做的决定——并不是"我"本身，而是"思维"在运作。当能够从"观察者"角度看待这些念头，它们就不再那么有控制力了。\n\n2. 当下是唯一真实存在的时间\n过去只存在于记忆中，未来只存在于想象中，唯有当下是真实发生的。这个观点听起来简单，但真正内化后会改变对焦虑和压力的态度。\n\n3. 实践中的局限\n这本书有时会显得过于"玄学"，需要反复阅读才能体会。但在工作压力大时，"回到当下"这个练习确实有帮助，值得长期实践。' },
  { id: 9, title: '通往奴役之路', author: '弗里德里希·哈耶克', color: '#1AB048', height: 155, width: 32, year: '2023', rating: 5, intro: '这本书写于二战时期，背景是欧洲法西斯主义和社会主义计划经济的兴起。哈耶克试图解释：为什么一些原本追求公平与效率的制度，最后却可能走向专制。', notes: '1. 计划经济可能威胁自由\n如果国家全面控制经济（生产什么、卖多少、定什么价格），就必须集中权力。而权力一旦集中，就容易侵蚀个人自由。这不是说福利国家必然走向专制，而是全面的计划经济存在这种内在风险。\n\n2. 自由市场是分散决策系统\n哈耶克提出一个重要思想：没有人能掌握全部信息。市场价格本身就是一种信息系统，如果政府替代市场，就会失去这套信息机制，决策质量必然下降。\n\n3. 法治比结果更重要\n自由社会的关键不是结果平等，而是规则一致：法律对所有人一样、政府权力受到限制。\n\n4. 对我的启示\n制度设计的关键在于激励机制，而非初衷。好的初衷配上错误的制度设计，同样可能产生糟糕的结果。' },
  { id: 10, title: '百年孤独', author: '加西亚·马尔克斯', color: '#6F5B2A', height: 176, width: 38, year: '2024', rating: 5, intro: '布恩迪亚家族七代人的兴衰史，也是马孔多从诞生、繁盛到消失的寓言。马尔克斯用魔幻现实主义把家族命运、拉美历史、记忆与孤独交织在一起，让荒诞像日常一样自然，让现实反而显得更加深刻。', notes: '1. 孤独不是一个人的状态，而是一种命运的循环\n书中每一代人都在重复相似的欲望、执念和失败。名字重复，性格重复，选择也重复。读到最后会意识到，真正困住人的不只是外部环境，还有无法看见自身循环的盲点。\n\n2. 记忆决定一个地方是否存在\n马孔多最动人的地方，是它既像真实村镇，又像一场被集体记忆支撑的梦。当人们遗忘历史、遗忘名字、遗忘过往的原因，现实也开始松动。这让我想到，一个人也需要整理自己的记忆，否则很多经历只会变成模糊的情绪。\n\n3. 魔幻现实主义的力量\n这本书最厉害的地方，不是把幻想写得多奇特，而是把荒诞写得像生活本身。它提醒我：现实并不总是线性的、理性的、可解释的。很多时候，理解生活需要的不只是逻辑，也需要想象力和承受复杂性的能力。' }
]

const aiDynamics = {
  newsList: [
    { title: 'Microsoft Build 2026 发布 MAI-Thinking-1、MAI-Code-1 与新 Agent 平台', source: 'Microsoft Blog', time: '6月2日', url: 'https://blogs.microsoft.com/blog/2026/06/02/microsoft-build-2026-be-yourself-at-work/' },
    { title: 'Google 汇总 I/O 2026 AI 更新，Gemini 3.5 与 Gemini Omni 成为主线', source: 'Google Blog', time: '6月5日', url: 'https://blog.google/innovation-and-ai/technology/ai/google-ai-updates-may-2026/' },
    { title: 'Google 将 Gemini in Chrome 与 auto browse 带到 Android', source: 'Google Blog', time: '5月12日', url: 'https://blog.google/products-and-platforms/products/chrome/bringing-chrome-ai-to-android/' },
    { title: 'OpenAI 与 Dell 合作，把 Codex 带到混合云和本地企业环境', source: 'OpenAI', time: '5月18日', url: 'https://openai.com/index/dell-codex-enterprise-partnership/' },
    { title: 'OpenAI 推出 Deployment Company，帮助企业落地生产级 AI 系统', source: 'OpenAI', time: '5月11日', url: 'https://openai.com/index/openai-launches-the-deployment-company/' }
  ],
  zhihuList: [
    { title: 'AI 编程代理会怎样改变前端工程师的工作流？', meta: '知乎搜索 · 前端 / Agent', url: 'https://www.zhihu.com/search?q=AI%E7%BC%96%E7%A8%8B%E4%BB%A3%E7%90%86%20%E5%89%8D%E7%AB%AF' },
    { title: 'Cursor、Claude Code、Codex 到底适合哪些不同场景？', meta: '知乎搜索 · 开发工具对比', url: 'https://www.zhihu.com/search?q=Cursor%20Claude%20Code%20Codex' },
    { title: '公司内部落地 AI Agent，最大阻力是模型能力还是流程治理？', meta: '知乎搜索 · 企业 AI 落地', url: 'https://www.zhihu.com/search?q=AI%20Agent%20%E4%BC%81%E4%B8%9A%E8%90%BD%E5%9C%B0' },
    { title: '长期使用 AI 写代码，如何控制代码质量和技术债？', meta: '知乎搜索 · 工程质量', url: 'https://www.zhihu.com/search?q=AI%E5%86%99%E4%BB%A3%E7%A0%81%20%E6%8A%80%E6%9C%AF%E5%80%BA' },
    { title: '本地大模型、云端大模型和混合部署，开发者该如何选择？', meta: '知乎搜索 · 本地模型 / 云端模型', url: 'https://www.zhihu.com/search?q=%E6%9C%AC%E5%9C%B0%E5%A4%A7%E6%A8%A1%E5%9E%8B%20%E4%BA%91%E7%AB%AF%E5%A4%A7%E6%A8%A1%E5%9E%8B' }
  ],
  githubList: [
    { repo: 'anomalyco / opencode', desc: '开源 AI coding agent，近期 AI 榜单增长靠前', lang: 'TypeScript', langColor: '#3178c6', stars: '+925 / 24h', url: 'https://github.com/anomalyco/opencode' },
    { repo: 'anthropics / claude-code', desc: 'Claude Code 命令行代理，开发者热度持续走高', lang: 'TypeScript', langColor: '#3178c6', stars: '+575 / 24h', url: 'https://github.com/anthropics/claude-code' },
    { repo: 'openai / codex', desc: 'OpenAI Codex CLI / coding agent 工具链', lang: 'TypeScript', langColor: '#3178c6', stars: '+548 / 24h', url: 'https://github.com/openai/codex' },
    { repo: 'ggml-org / llama.cpp', desc: '本地 LLM 推理核心项目，仍是开源模型生态基础设施', lang: 'C++', langColor: '#f34b7d', stars: '+410 / 24h', url: 'https://github.com/ggml-org/llama.cpp' },
    { repo: 'open-webui / open-webui', desc: '自托管 AI Web UI，适合本地模型和私有知识库场景', lang: 'Svelte', langColor: '#ff3e00', stars: '+305 / 24h', url: 'https://github.com/open-webui/open-webui' }
  ]
}

const techLinks = [
  { name: 'Vue', url: 'https://vuejs.org' },
  { name: 'React', url: 'https://react.dev' },
  { name: 'Vite', url: 'https://vitejs.dev' },
  { name: 'MDN', url: 'https://developer.mozilla.org' }
]

export function getMockProfile(locale) {
  return locale === 'en-US' ? profileEnUS : profileZhCN
}

export function getMockNav(locale) {
  return locale === 'en-US' ? navEnUS : navZhCN
}

export function getMockSections(locale) {
  return locale === 'en-US' ? sectionsEnUS : sectionsZhCN
}

export function getMockConfig() {
  return siteConfig
}

export function getMockProjects(locale) {
  return locale === 'en-US' ? projectsEnUS : projectsZhCN
}

export function getMockTimeline(locale) {
  return locale === 'en-US' ? timelineEnUS : timelineZhCN
}

export function getMockBooks() {
  return books
}

export function getMockAiDynamics() {
  return aiDynamics
}

export function getMockTechLinks() {
  return techLinks
}
