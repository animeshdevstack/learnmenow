import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { CalendarMonth, MenuBook, Schedule as ScheduleIcon } from '@mui/icons-material'
import UserAuthShell from '@/components/user/UserAuthShell'
import Button from '../../../components/shared/button/Button'
import { getAuthToken } from '../../../helper/auth.helper'
import Config from '../../../config/config'
import { userEmptyStateTextSx, userSelectFieldLabelSx } from '@/components/user/userAuthShell.theme'
import { computeEndFromStart, conflictsWithSiblings } from './scheduleHelpers'
import { formatCalendarDate, slotClockRangeTooltip, slotLabel } from '../../../utils/scheduleDisplayLabels'
import './Schedule.css'

const ROUTINE_STORAGE_KEY = 'learnMeNowRoutine'

const brandMark = <MenuBook sx={{ color: 'white', fontSize: 22 }} />

const shellPaper = { maxWidth: 900, width: '100%', mx: 'auto' }

const Schedule = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const token = getAuthToken()
  const theme = useTheme()
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down('md'))

  const routineData = useMemo(() => {
    const fromState = location.state?.routineData
    if (fromState && typeof fromState === 'object') return fromState
    try {
      const raw = sessionStorage.getItem(ROUTINE_STORAGE_KEY)
      if (raw) return JSON.parse(raw)
    } catch {
      /* ignore */
    }
    return null
  }, [location.state])

  const { summary } = routineData || {}
  const scheduleId = routineData?.scheduleId

  const [localSchedule, setLocalSchedule] = useState([])
  const [localTopics, setLocalTopics] = useState([])
  const [hydrated, setHydrated] = useState(false)

  const [editTarget, setEditTarget] = useState(null)
  const [draftStart, setDraftStart] = useState('')
  const [editError, setEditError] = useState('')
  const draftStartRef = useRef('')
  const timeInputRef = useRef(null)
  const skipBlurCommitRef = useRef(false)

  useEffect(() => {
    draftStartRef.current = draftStart
  }, [draftStart])

  const [doneLoading, setDoneLoading] = useState(false)
  const [doneError, setDoneError] = useState('')

  useEffect(() => {
    if (!routineData) return
    setLocalSchedule(JSON.parse(JSON.stringify(routineData.schedule || [])))
    setLocalTopics(JSON.parse(JSON.stringify(routineData.topics || [])))
    setHydrated(true)
  }, [routineData])

  useEffect(() => {
    if (!routineData || !hydrated) return
    try {
      sessionStorage.setItem(
        ROUTINE_STORAGE_KEY,
        JSON.stringify({
          ...routineData,
          schedule: localSchedule,
          topics: localTopics,
        })
      )
    } catch {
      /* ignore */
    }
  }, [localSchedule, localTopics, routineData, hydrated])

  const openEdit = useCallback((dayIndex, sessionIndex) => {
    const day = localSchedule[dayIndex]
    const s = day?.sessions?.[sessionIndex]
    if (!s) return
    const start = s.startTime || '09:00'
    setDraftStart(start)
    draftStartRef.current = start
    setEditError('')
    setEditTarget({ dayIndex, sessionIndex })
  }, [localSchedule])

  const closeEdit = useCallback(() => {
    setEditTarget(null)
    setEditError('')
  }, [])

  useEffect(() => {
    if (editTarget && timeInputRef.current) {
      const t = window.setTimeout(() => timeInputRef.current?.focus(), 0)
      return () => window.clearTimeout(t)
    }
    return undefined
  }, [editTarget])

  const commitSessionStart = useCallback(() => {
    if (!editTarget) return false
    const { dayIndex, sessionIndex } = editTarget
    const day = localSchedule[dayIndex]
    const s = day?.sessions?.[sessionIndex]
    if (!day || !s) return false

    const nextStart = draftStartRef.current
    if (!nextStart || !/^\d{2}:\d{2}$/.test(nextStart)) {
      setEditError('Invalid time.')
      return false
    }

    const dur = Number(s.durationMinutes) || 0
    if (dur <= 0) {
      setEditError('Invalid duration.')
      return false
    }

    if (conflictsWithSiblings(day.sessions, sessionIndex, nextStart, dur)) {
      setEditError('Overlaps another session this day.')
      queueMicrotask(() => timeInputRef.current?.focus())
      return false
    }

    const anchorDate = s.startDate || day.date
    const { endTime, endDate, spansNextDay, startDate } = computeEndFromStart(nextStart, dur, anchorDate)

    setLocalSchedule((prev) => {
      const next = prev.map((d, di) =>
        di !== dayIndex
          ? d
          : {
              ...d,
              sessions: d.sessions.map((sess, si) =>
                si !== sessionIndex
                  ? sess
                  : {
                      ...sess,
                      startTime: nextStart,
                      endTime,
                      startDate,
                      endDate,
                      spansNextDay,
                    }
              ),
            }
      )
      return next
    })

    closeEdit()
    return true
  }, [closeEdit, editTarget, localSchedule])

  const cancelEdit = useCallback(() => {
    skipBlurCommitRef.current = true
    closeEdit()
    window.setTimeout(() => {
      skipBlurCommitRef.current = false
    }, 0)
  }, [closeEdit])

  const handleDone = async () => {
    if (!token) return
    if (!scheduleId) {
      setDoneError('Missing schedule id. Generate your plan again from Study Planner.')
      return
    }
    setDoneError('')
    setDoneLoading(true)
    try {
      await axios.put(
        Config.userScheduleByIdUrl(scheduleId),
        {
          topics: localTopics,
          schedule: localSchedule,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      navigate('/user/dashboard', { replace: true, state: location.state })
    } catch (err) {
      const msg =
        err.response?.data?.message || err.response?.data?.error || err.message || 'Could not save your schedule.'
      setDoneError(msg)
    } finally {
      setDoneLoading(false)
    }
  }

  if (!token) {
    return (
      <UserAuthShell title="Your schedule" brandMark={brandMark} paperAlign="stretch" containerMaxWidth="sm" paperSx={shellPaper}>
        <Alert severity="info" sx={{ mb: 2, width: '100%' }}>
          Sign in to view your study schedule.
        </Alert>
        <Button type="button" variant="primary" className="btn-block planning-shell-cta" onClick={() => navigate('/user/login')}>
          Go to sign in
        </Button>
      </UserAuthShell>
    )
  }

  if (!routineData || !summary) {
    return (
      <UserAuthShell
        title="Your schedule"
        subtitle="No routine loaded yet."
        brandMark={brandMark}
        paperAlign="stretch"
        containerMaxWidth="sm"
        paperSx={shellPaper}
      >
        <Typography variant="body2" sx={{ ...userEmptyStateTextSx, mb: 2 }}>
          Generate a plan from Study Planner to see your timetable here. If you already created one, open this page again right after
          generating, or return to priorities and submit again.
        </Typography>
        <Button type="button" variant="primary" className="btn-block planning-shell-cta" onClick={() => navigate('/user/priority')}>
          Go to Study Planner
        </Button>
      </UserAuthShell>
    )
  }

  const timetableDialog = (
    <Dialog
      open={hydrated}
      fullScreen={fullScreenDialog}
      maxWidth="md"
      fullWidth
      scroll="paper"
      className="schedule-main-dialog"
      PaperProps={{
        className: 'schedule-dialog-paper',
      }}
    >
      <DialogTitle className="schedule-dialog-title">
        <Typography component="span" variant="h6" sx={{ fontWeight: 700 }}>
          Study timetable
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(148, 163, 184, 0.95)', mt: 0.5, fontWeight: 400 }}>
          Scroll inside this panel. Tap the time pill to change start only — end time follows; duration is fixed.
        </Typography>
      </DialogTitle>
      <DialogContent dividers className="schedule-dialog-body">
        <Box className="schedule-summary" sx={{ mb: 2.5 }}>
          <Box className="schedule-summary__grid">
            <div className="schedule-summary__item">
              <span className="schedule-summary__label">Plan period</span>
              <span className="schedule-summary__value">
                {formatCalendarDate(summary.startDate)} → {formatCalendarDate(summary.deadline)}
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
              <span className="schedule-summary__value">{summary.totalTopics ?? localTopics.length}</span>
            </div>
          </Box>
        </Box>

        {localTopics.length > 0 && (
          <section className="schedule-section" aria-labelledby="schedule-topics-heading">
            <Typography id="schedule-topics-heading" variant="subtitle2" sx={{ ...userSelectFieldLabelSx, mb: 1.5 }}>
              Topic allocation
            </Typography>
            <div className="schedule-topics">
              {localTopics.map((t) => (
                <div key={t.topicId} className="schedule-topic-card">
                  <div className="schedule-topic-card__title">{t.topicName}</div>
                  <div className="schedule-topic-card__meta">
                    {[t.subjectName, t.chapterName].filter(Boolean).join(' · ')}
                  </div>
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

        <section className="schedule-section" aria-labelledby="schedule-days-heading">
          <Typography id="schedule-days-heading" variant="subtitle2" sx={{ ...userSelectFieldLabelSx, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScheduleIcon sx={{ fontSize: 18, opacity: 0.9 }} />
            Sessions by day
          </Typography>

          {localSchedule.length === 0 ? (
            <Typography variant="body2" sx={userEmptyStateTextSx}>
              No session rows returned. Try adjusting dates or availability in Study Planner.
            </Typography>
          ) : (
            <div className="schedule-days">
              {localSchedule.map((day, dayIndex) => (
                <article key={day.date} className="schedule-day">
                  <header className="schedule-day__header">
                    <CalendarMonth sx={{ fontSize: 20, color: 'rgba(6, 182, 212, 0.95)' }} />
                    <div>
                      <div className="schedule-day__date">{formatCalendarDate(day.date)}</div>
                      <div className="schedule-day__sub">
                        <Chip size="small" label={day.dayType === 'weekend' ? 'Weekend' : 'Weekday'} className="schedule-chip schedule-chip--muted" />
                        <span className="schedule-day__meta">
                          {slotLabel(day.preferredSlot)} · {day.usedMinutes} / {day.availableMinutes} min
                          {day.overflowPastSlot ? ' · extends past slot' : ''}
                        </span>
                      </div>
                    </div>
                  </header>
                  <ul className="schedule-day__sessions">
                    {(day.sessions || []).map((s, idx) => {
                      const editing =
                        editTarget?.dayIndex === dayIndex && editTarget?.sessionIndex === idx
                      const anchorDate = s.startDate || day.date
                      const dur = Number(s.durationMinutes) || 0
                      const previewEnd =
                        editing && draftStart && /^\d{2}:\d{2}$/.test(draftStart)
                          ? computeEndFromStart(draftStart, dur, anchorDate).endTime
                          : s.endTime

                      return (
                        <li key={`${s.topicId}-${s.startTime}-${idx}`} className="schedule-session">
                          <div className="schedule-session__time">
                            {editing ? (
                              <div className="schedule-time-pill-col">
                                <div className="schedule-time-pill schedule-time-pill--edit">
                                  <input
                                    ref={timeInputRef}
                                    type="time"
                                    step={60}
                                    className="schedule-time-pill__input"
                                    value={draftStart}
                                    onChange={(e) => {
                                      const v = e.target.value
                                      setDraftStart(v)
                                      draftStartRef.current = v
                                      setEditError('')
                                    }}
                                    onBlur={() => {
                                      if (skipBlurCommitRef.current) return
                                      commitSessionStart()
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault()
                                        commitSessionStart()
                                      }
                                      if (e.key === 'Escape') {
                                        e.preventDefault()
                                        cancelEdit()
                                      }
                                    }}
                                  />
                                  <span className="schedule-time-pill__dash" aria-hidden>
                                    –
                                  </span>
                                  <span className="schedule-time-pill__end">{previewEnd}</span>
                                </div>
                                {editError ? (
                                  <span className="schedule-time-pill__err" role="alert">
                                    {editError}
                                  </span>
                                ) : null}
                              </div>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  className="schedule-time-pill"
                                  onClick={() => openEdit(dayIndex, idx)}
                                >
                                  <span className="schedule-time-pill__range">
                                    {s.startTime} – {s.endTime}
                                  </span>
                                </button>
                                {s.spansNextDay || (s.endDate && s.startDate && s.endDate !== s.startDate) ? (
                                  <span className="schedule-session__nextday">ends {formatCalendarDate(s.endDate)}</span>
                                ) : null}
                              </>
                            )}
                          </div>
                          <div className="schedule-session__body">
                            <div className="schedule-session__topic">{s.topicName}</div>
                            <div className="schedule-session__crumb">
                              {[s.subjectName, s.chapterName].filter(Boolean).join(' · ')}
                            </div>
                            <div className="schedule-session__dur">{s.durationMinutes} min</div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </section>
      </DialogContent>
      <DialogActions className="schedule-dialog-actions" sx={{ flexWrap: 'wrap', gap: 1, px: 2, py: 1.5 }}>
        {!scheduleId ? (
          <Alert severity="warning" sx={{ width: '100%', py: 0.5 }}>
            This plan has no server id. Generate again from Study Planner to enable saving.
          </Alert>
        ) : null}
        {doneError ? (
          <Alert severity="error" sx={{ width: '100%', py: 0.5 }}>
            {doneError}
          </Alert>
        ) : null}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            <Button type="button" variant="secondary" className="planning-back-btn" onClick={() => navigate('/user/priority')}>
              Back to Study Planner
            </Button>
            <Button type="button" variant="primary" className="planning-shell-cta" onClick={() => navigate('/user/dashboard', { state: location.state })}>
              Go to dashboard
            </Button>
          </Box>
          <Button
            type="button"
            variant="primary"
            className="planning-shell-cta"
            onClick={handleDone}
            disabled={doneLoading || !scheduleId}
          >
            {doneLoading ? <CircularProgress size={22} color="inherit" sx={{ mr: 1 }} /> : null}
            Done
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )

  return (
    <Box className="schedule-page-root">
      <UserAuthShell
        title=""
        subtitle=""
        brandMark={brandMark}
        paperAlign="stretch"
        fullWidth
        paperSx={{
          ...shellPaper,
          maxWidth: 900,
          width: '100%',
          mx: 'auto',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'none',
          background: 'transparent',
          p: 0,
        }}
      >
        <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 1 }}>
          {!hydrated ? (
            <CircularProgress sx={{ color: 'rgba(6, 182, 212, 0.9)' }} />
          ) : (
            timetableDialog
          )}
        </Box>
      </UserAuthShell>
    </Box>
  )
}

export default Schedule
