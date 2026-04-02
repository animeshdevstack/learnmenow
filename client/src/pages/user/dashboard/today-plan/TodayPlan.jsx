import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Box, Chip, CircularProgress, Tooltip, Typography } from '@mui/material'
import { ArrowBack, CalendarMonth, CheckCircle, Logout as LogoutIcon, Today } from '@mui/icons-material'
import UserAuthShell from '@/components/user/UserAuthShell'
import Button from '@/components/shared/button/Button'
import { userAccentSpinnerSx, userEmptyStateTextSx, userShellSubtitleSx, userShellTitleSx } from '@/components/user/userAuthShell.theme'
import { getAuthToken, logout } from '@/helper/auth.helper'
import { useTodayPlan } from './useTodayPlan'
import { formatCalendarDate, slotClockRangeTooltip, slotLabel } from '@/utils/scheduleDisplayLabels'
import './TodayPlan.css'

const brandMark = <Today sx={{ color: 'white', fontSize: 22 }} />
const shellPaper = { maxWidth: 720, width: '100%', mx: 'auto' }

const viewportPaperSx = {
  ...shellPaper,
  maxWidth: 720,
  height: { xs: 'calc(100dvh - 32px)', sm: 'calc(100dvh - 48px)' },
  maxHeight: { xs: 'calc(100dvh - 32px)', sm: 'calc(100dvh - 48px)' },
  overflow: 'hidden',
}

function SessionRows({ day, scheduleId, busyKey, onToggleSession }) {
  const sessions = Array.isArray(day?.sessions) ? day.sessions : []
  if (sessions.length === 0) {
    return <p className="today-plan-empty">No study blocks scheduled for today.</p>
  }

  return (
    <ul className="today-plan-sessions" aria-label="Today's sessions">
      {sessions.map((s, idx) => {
        const rowKey = `${s.topicId}-${idx}`
        const busy = busyKey === rowKey
        const done = Boolean(s.isCompleted)
        const statusLabel = done ? 'Done' : 'Mark done'
        const ariaLabel = `${statusLabel}: ${s.topicName || 'session'}`

        return (
          <li
            key={`${s.topicId}-${s.startTime}-${idx}`}
            className={`today-plan-session${done ? ' today-plan-session--completed' : ''}`}
          >
            <div className="today-plan-session__left">
              <span className="today-plan-time">
                {s.startTime} – {s.endTime}
              </span>
              {s.spansNextDay || (s.endDate && s.startDate && s.endDate !== s.startDate) ? (
                <div className="today-plan-session__nextday">ends {formatCalendarDate(s.endDate)}</div>
              ) : null}
            </div>
            <div className="today-plan-session__body">
              <div className="today-plan-session__topic">{s.topicName}</div>
              <div className="today-plan-session__crumb">{[s.subjectName, s.chapterName].filter(Boolean).join(' · ')}</div>
              <div className="today-plan-session__dur">{s.durationMinutes} min</div>
            </div>
            <div className="today-plan-session__actions">
              <Tooltip title={done ? 'Mark as not done' : 'Mark this block as done'} placement="left">
                <button
                  type="button"
                  className={`today-plan-session__status${done ? ' today-plan-session__status--done' : ''}`}
                  disabled={!scheduleId || busy}
                  onClick={() => onToggleSession(s, idx)}
                  aria-pressed={done}
                  aria-label={ariaLabel}
                >
                  {busy ? (
                    <CircularProgress size={14} thickness={5} sx={{ color: 'inherit' }} />
                  ) : done ? (
                    <>
                      <CheckCircle className="today-plan-session__status-icon" aria-hidden />
                      <span>Done</span>
                    </>
                  ) : (
                    <span>Mark done</span>
                  )}
                </button>
              </Tooltip>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

const TodayPlan = () => {
  const navigate = useNavigate()
  const token = getAuthToken()
  const { data, loading, error, refetch, patchSessionCompletion } = useTodayPlan(token)
  const [busyKey, setBusyKey] = useState(null)
  const [completionError, setCompletionError] = useState('')

  const day = data?.day
  const summary = data?.summary
  const scheduleId = data?.scheduleId

  const handleToggleSession = async (session, idx) => {
    if (!scheduleId || !day?.date || !session?.topicId) {
      setCompletionError('Cannot update this session. Try refreshing the page.')
      return
    }
    if (!session?.startTime || !session?.endTime) {
      setCompletionError('Session is missing time range. Try refreshing the page.')
      return
    }
    const key = `${session.topicId}-${idx}`
    setBusyKey(key)
    setCompletionError('')
    try {
      await patchSessionCompletion({
        scheduleId,
        date: day.date,
        topicId: session.topicId,
        startTime: session.startTime,
        endTime: session.endTime,
        isCompleted: !Boolean(session.isCompleted),
      })
      await refetch()
    } catch (err) {
      setCompletionError(
        err.response?.data?.message || err.message || 'Could not update completion. Try again.'
      )
    } finally {
      setBusyKey(null)
    }
  }

  if (!token) {
    return (
      <UserAuthShell
        title="Today's plan"
        brandMark={brandMark}
        paperAlign="stretch"
        containerMaxWidth="sm"
        paperSx={shellPaper}
      >
        <Alert severity="info" sx={{ mb: 2, width: '100%' }}>
          Sign in to see today&apos;s schedule.
        </Alert>
        <Button type="button" variant="primary" className="btn-block planning-shell-cta" onClick={() => navigate('/user/login')}>
          Go to sign in
        </Button>
      </UserAuthShell>
    )
  }

  const headerBlock = (
    <Box className="today-plan-popup__header" sx={{ flexShrink: 0, width: '100%' }}>
      <Box sx={{ flex: 1, minWidth: 0, pr: 1 }}>
        <Typography component="h1" variant="h5" sx={{ ...userShellTitleSx, width: '100%', mb: 0.5 }}>
          Today&apos;s plan
        </Typography>
        <Typography variant="body2" sx={{ ...userShellSubtitleSx, width: '100%', mb: 0 }}>
          Your study sessions for today only.
        </Typography>
        <Typography variant="body2" sx={{ ...userShellSubtitleSx, width: '100%', mt: 1, opacity: 0.95 }}>
          Pulled from your saved timetable. Use Done to record progress for today only.
        </Typography>
      </Box>
      <Button
        type="button"
        variant="secondary"
        className="planning-back-btn today-plan-popup__back"
        onClick={() => navigate('/user/dashboard')}
        aria-label="Back to dashboard"
        icon={<ArrowBack sx={{ fontSize: 18 }} />}
      >
        Back
      </Button>
    </Box>
  )

  const footerActions = (
    <Box className="today-plan-actions">
      <Button
        type="button"
        variant="secondary"
        className="planning-back-btn"
        onClick={() => logout()}
        aria-label="Sign out"
        icon={<LogoutIcon sx={{ fontSize: 18, opacity: 0.9 }} />}
      >
        Sign out
      </Button>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
        <Button type="button" variant="primary" className="planning-shell-cta" onClick={() => navigate('/user/dashboard')}>
          Dashboard
        </Button>
        <Button type="button" variant="primary" className="planning-shell-cta" onClick={() => void refetch()}>
          Refresh
        </Button>
      </Box>
    </Box>
  )

  const scrollBody = loading ? (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
      <CircularProgress sx={userAccentSpinnerSx} />
    </Box>
  ) : error ? (
    <>
      <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
        {error}
      </Alert>
      <Typography variant="body2" sx={{ ...userEmptyStateTextSx, mb: 2 }}>
        If you have not generated a plan yet, or today is outside your plan dates, nothing will show here.
      </Typography>
    </>
  ) : (
    <>
      {summary?.startDate && summary?.deadline ? (
        <div className="today-plan-meta-row">
          <Typography variant="caption" className="today-plan-meta" component="span">
            Plan window: {summary.startDate} → {summary.deadline}
          </Typography>
        </div>
      ) : null}

      {day ? (
        <article className="today-plan-day">
          {completionError ? (
            <Alert severity="warning" sx={{ mb: 1.5, width: '100%' }} onClose={() => setCompletionError('')}>
              {completionError}
            </Alert>
          ) : null}
          <header className="today-plan-day__header">
            <CalendarMonth sx={{ fontSize: 22, color: 'rgba(6, 182, 212, 0.95)', flexShrink: 0 }} />
            <div>
              <div className="today-plan-day__title">{formatCalendarDate(day.date)}</div>
              <div className="today-plan-day__sub">
                <Chip
                  size="small"
                  label={day.dayType === 'weekend' ? 'Weekend' : 'Weekday'}
                  className="schedule-chip schedule-chip--muted"
                />
                <Tooltip title={slotClockRangeTooltip(day.preferredSlot)} placement="bottom">
                  <span>
                    <Chip size="small" label={slotLabel(day.preferredSlot)} className="schedule-chip" />
                  </span>
                </Tooltip>
                <span className="today-plan-day__meta">
                  {day.usedMinutes ?? '—'} / {day.availableMinutes ?? '—'} min
                  {day.overflowPastSlot ? ' · extends past slot' : ''}
                </span>
              </div>
            </div>
          </header>
          <SessionRows
            day={day}
            scheduleId={scheduleId}
            busyKey={busyKey}
            onToggleSession={handleToggleSession}
          />
        </article>
      ) : (
        <Alert severity="info" sx={{ width: '100%' }}>
          No data for today.
        </Alert>
      )}
    </>
  )

  return (
    <UserAuthShell
      brandMark={brandMark}
      paperAlign="stretch"
      fullWidth
      className="today-plan-shell"
      paperSx={viewportPaperSx}
    >
      <Box
        className="today-plan-popup"
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', width: '100%' }}
      >
        {headerBlock}

        <Box className="today-plan-popup__scroll" sx={{ flex: 1, minHeight: 0 }}>
          {scrollBody}
        </Box>

        {footerActions}
      </Box>
    </UserAuthShell>
  )
}

export default TodayPlan
