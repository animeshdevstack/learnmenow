import React from 'react'
import { Box, Chip, Divider, Tooltip, Typography } from '@mui/material'
import { Schedule as ScheduleIcon } from '@mui/icons-material'
import { CalendarMonth } from '@mui/icons-material'
import { userEmptyStateTextSx, userSelectFieldLabelSx } from '@/components/user/userAuthShell.theme'
import { formatCalendarDate, slotClockRangeTooltip, slotLabel } from '@/utils/scheduleDisplayLabels'
import '@/pages/user/schedule/Schedule.css'

/**
 * Read-only timetable: summary, topic allocation, sessions by day.
 * Shared by Active Plan (server) and can be reused elsewhere.
 */
export default function ScheduleReadOnlyBody({ summary, topics = [], schedule = [] }) {
  const topicRows = Array.isArray(topics) ? topics : []
  const dayRows = Array.isArray(schedule) ? schedule : []

  return (
    <>
      {summary && typeof summary === 'object' && (
        <Box className="schedule-summary" sx={{ mb: 2.5 }}>
          <Box className="schedule-summary__grid">
            <div className="schedule-summary__item">
              <span className="schedule-summary__label">Plan period</span>
              <span className="schedule-summary__value">
                {summary.startDate && summary.deadline
                  ? `${formatCalendarDate(summary.startDate)} → ${formatCalendarDate(summary.deadline)}`
                  : '—'}
              </span>
            </div>
            <div className="schedule-summary__item schedule-summary__item--slots">
              <span className="schedule-summary__label">Preferred slots</span>
              <span className="schedule-summary__value schedule-summary__value--slots">
                <span className="schedule-summary__chips">
                  {(summary.preferredSlots && summary.preferredSlots.length > 0
                    ? summary.preferredSlots
                    : summary.preferredSlot
                      ? [summary.preferredSlot]
                      : []
                  ).map((s) => (
                    <Tooltip key={s} title={slotClockRangeTooltip(s)} placement="bottom">
                      <span className="schedule-summary__chip-wrap">
                        <Chip size="small" label={slotLabel(s)} className="schedule-chip" />
                      </span>
                    </Tooltip>
                  ))}
                </span>
              </span>
            </div>
            <div className="schedule-summary__item">
              <span className="schedule-summary__label">Scheduled</span>
              <span className="schedule-summary__value">
                {summary.totalScheduledHours != null ? `${summary.totalScheduledHours} h` : '—'}
                <Typography component="span" variant="caption" sx={{ display: 'block', color: 'rgba(148, 163, 184, 0.95)', mt: 0.25 }}>
                  of {summary.totalAvailableHours != null ? `${summary.totalAvailableHours} h` : '—'} available
                </Typography>
              </span>
            </div>
            <div className="schedule-summary__item">
              <span className="schedule-summary__label">Topics</span>
              <span className="schedule-summary__value">{summary.totalTopics ?? topicRows.length}</span>
            </div>
          </Box>
        </Box>
      )}

      {topicRows.length > 0 && (
        <section className="schedule-section" aria-labelledby="readonly-topics-heading">
          <Typography id="readonly-topics-heading" variant="subtitle2" sx={{ ...userSelectFieldLabelSx, mb: 1.5 }}>
            Topic allocation
          </Typography>
          <div className="schedule-topics">
            {topicRows.map((t) => (
              <div key={t.topicId} className="schedule-topic-card">
                <div className="schedule-topic-card__title">{t.topicName}</div>
                <div className="schedule-topic-card__meta">{[t.subjectName, t.chapterName].filter(Boolean).join(' · ')}</div>
                <div className="schedule-topic-card__stats">
                  <Chip size="small" label={`Priority ${t.userPriority}`} className="schedule-chip" />
                  <span className="schedule-topic-card__hours">
                    {t.allocatedHours != null ? `${t.allocatedHours} h` : `${t.allocatedMinutes} min`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <Divider sx={{ borderColor: 'rgba(71, 85, 105, 0.45)', my: 2.5 }} />

      <section className="schedule-section" aria-labelledby="readonly-days-heading">
        <Typography
          id="readonly-days-heading"
          variant="subtitle2"
          sx={{ ...userSelectFieldLabelSx, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <ScheduleIcon sx={{ fontSize: 18, opacity: 0.9 }} />
          Sessions by day
        </Typography>

        {dayRows.length === 0 ? (
          <Typography variant="body2" sx={userEmptyStateTextSx}>
            No days in this plan yet.
          </Typography>
        ) : (
          <div className="schedule-days">
            {dayRows.map((day) => (
              <article key={day.date} className="schedule-day">
                <header className="schedule-day__header">
                  <CalendarMonth sx={{ fontSize: 20, color: 'rgba(6, 182, 212, 0.95)' }} />
                  <div>
                    <div className="schedule-day__date">{formatCalendarDate(day.date)}</div>
                    <div className="schedule-day__sub">
                      <Chip
                        size="small"
                        label={day.dayType === 'weekend' ? 'Weekend' : 'Weekday'}
                        className="schedule-chip schedule-chip--muted"
                      />
                      <span className="schedule-day__meta">
                        {slotLabel(day.preferredSlot)} · {day.usedMinutes} / {day.availableMinutes} min
                        {day.overflowPastSlot ? ' · extends past slot' : ''}
                      </span>
                    </div>
                  </div>
                </header>
                <ul className="schedule-day__sessions">
                  {(day.sessions || []).map((s, idx) => (
                    <li key={`${s.topicId}-${s.startTime}-${idx}`} className="schedule-session">
                      <div className="schedule-session__time">
                        <span className="schedule-time-pill schedule-time-pill--static" role="img" aria-label="Session time">
                          <span className="schedule-time-pill__range">
                            {s.startTime} – {s.endTime}
                          </span>
                        </span>
                        {s.spansNextDay || (s.endDate && s.startDate && s.endDate !== s.startDate) ? (
                          <span className="schedule-session__nextday">ends {formatCalendarDate(s.endDate)}</span>
                        ) : null}
                      </div>
                      <div className="schedule-session__body">
                        <div className="schedule-session__topic">{s.topicName}</div>
                        <div className="schedule-session__crumb">{[s.subjectName, s.chapterName].filter(Boolean).join(' · ')}</div>
                        <div className="schedule-session__dur">{s.durationMinutes} min</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
