import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Box, Typography } from '@mui/material'
import { ArrowBack, CalendarMonth, Dashboard as DashboardIcon, Logout as LogoutIcon, Today } from '@mui/icons-material'
import UserAuthShell from '@/components/user/UserAuthShell'
import Button from '../../../components/shared/button/Button'
import { getAuthToken, getUserInfo, logout } from '../../../helper/auth.helper'
import { userEmptyStateTextSx, userShellSubtitleSx, userShellTitleSx } from '@/components/user/userAuthShell.theme'
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

  const refreshRoutineFromStorage = useCallback(() => {
    try {
      const raw = sessionStorage.getItem(ROUTINE_STORAGE_KEY)
      if (raw) setRoutineSnapshot(JSON.parse(raw))
      else setRoutineSnapshot(null)
    } catch {
      setRoutineSnapshot(null)
    }
  }, [])

  useEffect(() => {
    refreshRoutineFromStorage()
  }, [refreshRoutineFromStorage])

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
      brandMark={brandMark}
      paperAlign="stretch"
      fullWidth
      paperSx={{ ...shellPaper, maxWidth: 800 }}
    >
      <Box className="user-dashboard-popup__header">
        <Box sx={{ flex: 1, minWidth: 0, pr: 1 }}>
          <Typography component="h1" variant="h5" sx={{ ...userShellTitleSx, width: '100%', mb: 0.5 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ ...userShellSubtitleSx, width: '100%', mb: 0 }}>
            Welcome back, {displayName}
          </Typography>
          <Typography variant="body2" sx={{ ...userShellSubtitleSx, width: '100%', mt: 1, opacity: 0.95 }}>
            Jump back into your learning flow — competition, planning, priorities, and your timetable.
          </Typography>
        </Box>
        <Button
          type="button"
          variant="secondary"
          className="planning-back-btn user-dashboard-popup__back"
          onClick={() => navigate('/user/priority')}
          aria-label="Back to Study Planner"
          icon={<ArrowBack sx={{ fontSize: 18 }} />}
        >
          Back
        </Button>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', minHeight: 0 }}>
        <Box className="user-dashboard-banner" sx={{ mb: 1.25 }}>
          <Today className="user-dashboard-banner__icon" />
          <div>
            <div className="user-dashboard-banner__label">Today&apos;s plan</div>
            <div className="user-dashboard-banner__text">
              {todayBannerLine}
            </div>
          </div>
          <div className="user-dashboard-banner__links">
            <Link to="/user/today-plan" className="user-dashboard-banner__link">
              Today
            </Link>
          </div>
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
            <div className="user-dashboard-banner__links">
              <Link to="/user/active-plan" className="user-dashboard-banner__link">
                Open schedule
              </Link>
            </div>
          </Box>
        ) : (
          <div className="user-dashboard-hint">
            <Typography variant="body2" sx={{ ...userEmptyStateTextSx, mb: 0 }}>
              No timetable in this browser yet. Use Study Planner to generate a plan, then it will show here.
            </Typography>
          </div>
        )}
      </Box>

      <Box
        sx={{
          mt: 'auto',
          pt: 2,
          borderTop: '1px solid rgba(71, 85, 105, 0.4)',
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
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
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', justifyContent: 'flex-end' }}>
          <Button type="button" variant="secondary" className="planning-back-btn" onClick={() => navigate('/user/priority')}>
            Back to Study Planner
          </Button>
        </Box>
      </Box>
    </UserAuthShell>
  )
}

export default Dashboard
