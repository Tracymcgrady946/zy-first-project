/**
 * 节假日数据，按语言分组
 * key 格式：'MM-DD'（固定节日）或 'YYYY-MM-DD'（农历节日）
 */
export const HOLIDAYS = {
  'zh-CN': {
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
  },
  'en-US': {
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
}

export function getHoliday (locale, year, month, day) {
  const map = HOLIDAYS[locale] || HOLIDAYS['zh-CN']
  const mm = String(month + 1).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return map[`${year}-${mm}-${dd}`] || map[`${mm}-${dd}`] || null
}
