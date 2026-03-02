export default {
  zh: {
    nav: {
      intro: '介绍',
      about: '关于',
      weather: '天气',
      calendar: '日历',
      contact: '联系'
    },
    hero: {
      name: '张岳',
      role: '前端工程师 · 个人介绍',
      introLines: [
        '你好，我是张岳。',
        '一名用 Vue 把想法做成产品的前端工程师。',
        '广阔天地、大有作为。'
      ],
      infoList: [
        { text: '性别 ： 男' },
        { text: '兴趣爱好 ： 打篮球 · 滑雪' },
        { text: '坐标 ： 上海' },
        { text: '最喜欢的城市 ： 青岛 · 杭州 · 万宁 · 瓦纳卡' },
        { text: 'xx@gmail.com', href: 'mailto:xx@gmail.com' }
      ]
    },
    sections: {
      about: {
        title: '关于我',
        description: '前端开发工程师，主攻 Vue 技术栈。相信代码与设计能改变体验，专注把想法落地成可用的产品。'
      },
      weather: {
        title: '未来 15 天天气',
        description: '实时获取当地天气预报，掌握两周内的气象变化。'
      },
      calendar: {
        title: '日历',
        description: '浏览月份日历，随时查看日期安排。'
      },
      contact: {
        title: '保持联系',
        description: '有想法或合作意向，欢迎通过邮件或社交平台联系我。'
      }
    },
    calendar: {
      weekdays: ['日', '一', '二', '三', '四', '五', '六'],
      today: '今天',
      backToToday: '回到今天',
      yearMonth: (y, m) => `${y} 年 ${m} 月`,
      holidays: {
        '01-01': '元旦',
        '05-01': '劳动',
        '10-01': '国庆',
        '2025-01-29': '春节',
        '2025-04-04': '清明',
        '2025-05-31': '端午',
        '2025-10-06': '中秋',
        '2026-02-17': '春节',
        '2026-04-05': '清明',
        '2026-06-20': '端午',
        '2026-09-25': '中秋',
        '2027-02-06': '春节',
        '2027-03-26': '清明',
        '2027-06-09': '端午',
        '2027-09-15': '中秋'
      }
    },
    weather: {
      loading: '正在获取天气数据…',
      retry: '重试',
      locating: '定位中…',
      myLocation: '📡 我的位置',
      today: '今天',
      noGeo: '浏览器不支持定位',
      geoFail: '定位失败，已显示默认城市天气',
      unavailable: '天气服务暂时不可用',
      fetchFail: '获取天气失败，请稍后重试',
      currentLocation: '当前位置',
      weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      defaultCity: '上海',
      weatherDesc (code) {
        if (code === 0) return { icon: '☀️', desc: '晴' }
        if (code <= 2) return { icon: '🌤️', desc: '少云' }
        if (code === 3) return { icon: '☁️', desc: '阴' }
        if (code <= 48) return { icon: '🌫️', desc: '雾' }
        if (code <= 55) return { icon: '🌦️', desc: '毛毛雨' }
        if (code <= 65) return { icon: '🌧️', desc: '雨' }
        if (code <= 67) return { icon: '🌨️', desc: '冻雨' }
        if (code <= 77) return { icon: '❄️', desc: '雪' }
        if (code <= 82) return { icon: '🌦️', desc: '阵雨' }
        if (code <= 86) return { icon: '🌨️', desc: '阵雪' }
        return { icon: '⛈️', desc: '雷暴' }
      }
    }
  },

  en: {
    nav: {
      intro: 'Intro',
      about: 'About',
      weather: 'Weather',
      calendar: 'Calendar',
      contact: 'Contact'
    },
    hero: {
      name: 'Zhang Yue',
      role: 'Front-End Engineer · Personal Page',
      introLines: [
        "Hi, I'm Zhang Yue.",
        'A front-end engineer who turns ideas into products with Vue.',
        'The world is vast — make your mark.'
      ],
      infoList: [
        { text: 'Gender ： Male' },
        { text: 'Hobbies ： Basketball · Skiing' },
        { text: 'Based in ： Shanghai' },
        { text: 'Fav. Cities ： Qingdao · Hangzhou · Wanning · Wānaka' },
        { text: 'xx@gmail.com', href: 'mailto:xx@gmail.com' }
      ]
    },
    sections: {
      about: {
        title: 'About Me',
        description: 'Front-end developer specializing in the Vue ecosystem. I believe great code and design transform user experiences, focused on shipping real products.'
      },
      weather: {
        title: '15-Day Forecast',
        description: 'Live local weather forecast to help you plan the next two weeks.'
      },
      calendar: {
        title: 'Calendar',
        description: 'Browse the monthly calendar and keep track of your dates.'
      },
      contact: {
        title: 'Get in Touch',
        description: 'Have an idea or want to collaborate? Reach out via email or social platforms.'
      }
    },
    calendar: {
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      today: 'Today',
      backToToday: 'Back to Today',
      yearMonth: (y, m) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December']
        return `${months[m - 1]} ${y}`
      },
      holidays: {
        '01-01': "New Year's",
        '05-01': 'Labor Day',
        '10-01': 'Natl. Day',
        '2025-01-29': 'Spring Fest.',
        '2025-04-04': 'Qingming',
        '2025-05-31': 'Dragon Boat',
        '2025-10-06': 'Mid-Autumn',
        '2026-02-17': 'Spring Fest.',
        '2026-04-05': 'Qingming',
        '2026-06-20': 'Dragon Boat',
        '2026-09-25': 'Mid-Autumn',
        '2027-02-06': 'Spring Fest.',
        '2027-03-26': 'Qingming',
        '2027-06-09': 'Dragon Boat',
        '2027-09-15': 'Mid-Autumn'
      }
    },
    weather: {
      loading: 'Loading weather data…',
      retry: 'Retry',
      locating: 'Locating…',
      myLocation: '📡 My Location',
      today: 'Today',
      noGeo: 'Geolocation is not supported',
      geoFail: 'Location failed, showing default city',
      unavailable: 'Weather service unavailable',
      fetchFail: 'Failed to fetch weather, please try again',
      currentLocation: 'Current Location',
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      defaultCity: 'Shanghai',
      weatherDesc (code) {
        if (code === 0) return { icon: '☀️', desc: 'Clear' }
        if (code <= 2) return { icon: '🌤️', desc: 'Partly Cloudy' }
        if (code === 3) return { icon: '☁️', desc: 'Overcast' }
        if (code <= 48) return { icon: '🌫️', desc: 'Fog' }
        if (code <= 55) return { icon: '🌦️', desc: 'Drizzle' }
        if (code <= 65) return { icon: '🌧️', desc: 'Rain' }
        if (code <= 67) return { icon: '🌨️', desc: 'Freezing Rain' }
        if (code <= 77) return { icon: '❄️', desc: 'Snow' }
        if (code <= 82) return { icon: '🌦️', desc: 'Showers' }
        if (code <= 86) return { icon: '🌨️', desc: 'Snow Showers' }
        return { icon: '⛈️', desc: 'Thunderstorm' }
      }
    }
  }
}
