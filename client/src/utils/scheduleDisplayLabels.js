/** Shared labels/formatters for schedule & today-plan UIs (keeps Schedule + TodayPlan DRY). */

export function formatCalendarDate(isoDate) {
  if (!isoDate || typeof isoDate !== 'string') return ''
  const parts = isoDate.split('-').map(Number)
  if (parts.length !== 3 || parts.some(Number.isNaN)) return isoDate
  const [y, m, d] = parts
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function slotLabel(value) {
  const map = {
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    night: 'Night',
    late_night: 'Late Night',
  }
  return map[value] || value
}

export function slotClockRangeTooltip(value) {
  const map = {
    morning: '05:00–12:00',
    afternoon: '12:00–17:00',
    evening: '17:00–21:00',
    night: '21:00–23:00',
    late_night: '23:00–24:00 or 00:00–05:00 (one segment per day, chosen at random)',
  }
  return map[value] || ''
}
