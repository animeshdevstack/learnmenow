import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Box, Typography } from '@mui/material'
import {
  CalendarMonth,
  Dashboard as DashboardIcon,
  EmojiEvents,
  Logout as LogoutIcon,
  MenuBook,
  Schedule as ScheduleIcon,
  Today,
  Tune,
} from '@mui/icons-material'
import UserAuthShell from '../../../components/user/UserAuthShell'
import Button from '../../../components/shared/button/Button'
import { getAuthToken, getUserInfo, logout } from '../../../helper/auth.helper'
import { userEmptyStateTextSx, userShellSubtitleSx } from '../../../components/user/userAuthShell.theme'
import './Dashboard.css'

const ROUTINE_STORAGE_KEY = 'learnMeNowRoutine'

const brandMark = <DashboardIcon sx={{ color: 'white', fontSize: 22 }} />

const shellPaper = { maxWidth: 720, width: '100%', mx: 'auto' }

const formatShortRange = (start, end) => {
  if (!start || !end) return ''
  return `${start} → ${end}`
}

const Dashboard = () => {
  const navigate = useNavigate()
  const token = getAuthToken()
  const user = getUserInfo()
  const displayName = user?.name || user?.firstName || user?.email?.split('@')[0] || 'there'

  const [routineSnapshot, setRoutineSnapshot] = useState(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(ROUTINE_STORAGE_KEY)
      if (raw) setRoutineSnapshot(JSON.parse(raw))
    } catch {
      setRoutineSnapshot(null)
    }
  }, [])

  const summary = routineSnapshot?.summary
  const schedule = routineSnapshot?.schedule
  const hasRoutine = Boolean(summary && schedule?.length)

  const todayIso = useMemo(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }, [])

  const todayDay = useMemo(() => {
    if (!schedule?.length) return null
    return schedule.find((d) => d.date === todayIso) || null
  }, [schedule, todayIso])

  const todayBannerLine = useMemo(() => {
    if (!hasRoutine) return "Generate a plan to see today's sessions."
    if (!summary?.startDate || !summary?.deadline) return '—'
    if (todayIso < summary.startDate) return `Your plan starts on ${summary.startDate} · no sessions today`
    if (todayIso > summary.deadline) return `Your plan ended on ${summary.deadline} · today is outside the window`
    const sessions = todayDay?.sessions || []
    const n = sessions.length
    const used = todayDay?.usedMinutes
    if (n === 0) return 'No study blocks today'
    const usedPart = used != null ? ` · ${used} min planned` : ''
    return `${n} session${n !== 1 ? 's' : ''}${usedPart}`
  }, [hasRoutine, summary?.deadline, summary?.startDate, todayDay, todayIso])

  const navCards = useMemo(
    () => [
      {
        to: '/user/competition',
        title: 'Competition',
        description: 'Choose the exam or competition you are preparing for.',
        icon: <EmojiEvents className="user-dashboard-card__icon" />,
      },
      {
        to: '/user/planning',
        title: 'Topic planning',
        description: 'Pick subjects, chapters, and topics to study.',
        icon: <MenuBook className="user-dashboard-card__icon" />,
      },
      {
        to: '/user/priority',
        title: 'Study Planner',
        description: 'Set priorities, dates, and generate your timetable.',
        icon: <Tune className="user-dashboard-card__icon" />,
      },
      {
        to: '/user/schedule',
        title: 'Schedule',
        description: hasRoutine
          ? `Plan loaded: ${formatShortRange(summary?.startDate, summary?.deadline)}`
          : 'View and adjust your generated study sessions.',
        icon: <ScheduleIcon className="user-dashboard-card__icon" />,
        highlight: hasRoutine,
      },
    ],
    [hasRoutine, summary?.deadline, summary?.startDate]
  )

  if (!token) {
    return (
      <UserAuthShell title="Dashboard" brandMark={brandMark} paperAlign="stretch" containerMaxWidth="sm" paperSx={shellPaper}>
        <Alert severity="info" sx={{ mb: 2, width: '100%' }}>
          Sign in to open your dashboard.
        </Alert>
        <Button type="button" variant="primary" className="btn-block planning-shell-cta" onClick={() => navigate('/user/login')}>
          Go to sign in
        </Button>
      </UserAuthShell>
    )
  }

  return (
    <UserAuthShell
      title="Dashboard"
      subtitle={`Welcome back, ${displayName}`}
      brandMark={brandMark}
      paperAlign="stretch"
      fullWidth
      paperSx={{ ...shellPaper, maxWidth: 800 }}
    >
      <Typography variant="body2" sx={{ ...userShellSubtitleSx, mb: 2.5, width: '100%' }}>
        Jump back into your learning flow — competition, planning, priorities, and your timetable.
      </Typography>

      {/* Same layout as Active plan — Today’s sessions summary */}
      <Box className="user-dashboard-banner" sx={{ mb: 1.25 }}>
        <Today className="user-dashboard-banner__icon" />
        <div>
          <div className="user-dashboard-banner__label">Today&apos;s plan</div>
          <div className="user-dashboard-banner__text">
            {todayBannerLine}
          </div>
        </div>
        <Link to="/user/schedule" className="user-dashboard-banner__link">
          Open schedule
        </Link>
      </Box>

      {hasRoutine ? (
        <Box className="user-dashboard-banner">
          <CalendarMonth className="user-dashboard-banner__icon" />
          <div>
            <div className="user-dashboard-banner__label">Active plan</div>
            <div className="user-dashboard-banner__text">
              {formatShortRange(summary.startDate, summary.deadline)}
              {summary.totalScheduledHours != null ? (
                <span className="user-dashboard-banner__meta"> · {summary.totalScheduledHours} h scheduled</span>
              ) : null}
            </div>
          </div>
          <Link to="/user/schedule" className="user-dashboard-banner__link">
            Open schedule
          </Link>
        </Box>
      ) : (
        <div className="user-dashboard-hint">
          <Typography variant="body2" sx={{ ...userEmptyStateTextSx, mb: 0 }}>
            No timetable in this browser yet. Use Study Planner to generate a plan, then it will show here.
          </Typography>
        </div>
      )}

      <div className="user-dashboard-grid">
        {navCards.map((card) => (
          <Link key={card.to} to={card.to} className={`user-dashboard-card${card.highlight ? ' user-dashboard-card--active' : ''}`}>
            <div className="user-dashboard-card__icon-wrap">{card.icon}</div>
            <div className="user-dashboard-card__body">
              <div className="user-dashboard-card__title">{card.title}</div>
              <div className="user-dashboard-card__desc">{card.description}</div>
            </div>
          </Link>
        ))}
      </div>

      <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(71, 85, 105, 0.4)', width: '100%' }}>
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
      </Box>
    </UserAuthShell>
  )
}

export default Dashboard
