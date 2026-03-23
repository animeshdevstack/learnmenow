/** Parse "HH:mm" to minutes from midnight (0–1439 typical). */
export function parseHM(hhmm) {
  if (!hhmm || typeof hhmm !== 'string') return 0
  const [h, m] = hhmm.split(':').map((x) => parseInt(x, 10))
  if (Number.isNaN(h) || Number.isNaN(m)) return 0
  return h * 60 + m
}

/** Minutes 0–1439 → "HH:mm" */
export function formatHM(mins) {
  const m = ((mins % 1440) + 1440) % 1440
  const h = Math.floor(m / 60)
  const mm = m % 60
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

export function addDaysIso(dateStr, days) {
  const d = new Date(`${dateStr}T12:00:00.000Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().split('T')[0]
}

/**
 * Fixed duration: compute end clock + end date from new start (same rules as server wall-clock add).
 */
export function computeEndFromStart(startTimeHHMM, durationMinutes, calendarStartDateStr) {
  const startM = parseHM(startTimeHHMM)
  const endTotal = startM + durationMinutes
  const dayOverflow = Math.floor(endTotal / 1440)
  const endM = endTotal % 1440
  const endDate = addDaysIso(calendarStartDateStr, dayOverflow)
  return {
    endTime: formatHM(endM),
    endDate,
    spansNextDay: endDate !== calendarStartDateStr,
    startDate: calendarStartDateStr,
  }
}

/** Two half-open intervals [a,b) and [c,d) overlap iff a < d && c < b */
export function intervalsOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd
}

/**
 * Session s on a day row: [parseHM(start), parseHM(start)+duration).
 * @returns {boolean} true if candidate [candidateStart, +duration) overlaps any other session on the same day.
 */
export function conflictsWithSiblings(daySessions, excludeIndex, candidateStartHHMM, durationMinutes) {
  const a0 = parseHM(candidateStartHHMM)
  const a1 = a0 + durationMinutes
  for (let j = 0; j < daySessions.length; j++) {
    if (j === excludeIndex) continue
    const s = daySessions[j]
    const b0 = parseHM(s.startTime)
    const b1 = b0 + s.durationMinutes
    if (intervalsOverlap(a0, a1, b0, b1)) return true
  }
  return false
}
