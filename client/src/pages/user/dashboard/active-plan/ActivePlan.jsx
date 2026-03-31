import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Box, CircularProgress, Typography } from '@mui/material'
import { ArrowBack, CalendarMonth, Logout as LogoutIcon } from '@mui/icons-material'
import UserAuthShell from '@/components/user/UserAuthShell'
import Button from '@/components/shared/button/Button'
import ScheduleReadOnlyBody from '@/components/user/ScheduleReadOnlyBody'
import { userAccentSpinnerSx, userEmptyStateTextSx, userShellSubtitleSx, userShellTitleSx } from '@/components/user/userAuthShell.theme'
import { getAuthToken, logout } from '@/helper/auth.helper'
import { useActivePlan } from './useActivePlan'
import './ActivePlan.css'

const brandMark = <CalendarMonth sx={{ color: 'white', fontSize: 22 }} />
const shellPaper = { maxWidth: 900, width: '100%', mx: 'auto' }

const viewportPaperSx = {
  ...shellPaper,
  maxWidth: 920,
  height: { xs: 'calc(100dvh - 32px)', sm: 'calc(100dvh - 48px)' },
  maxHeight: { xs: 'calc(100dvh - 32px)', sm: 'calc(100dvh - 48px)' },
  overflow: 'hidden',
}

const ActivePlan = () => {
  const navigate = useNavigate()
  const token = getAuthToken()
  const { data, loading, error, refetch } = useActivePlan(token)

  if (!token) {
    return (
      <UserAuthShell
        title="Active plan"
        brandMark={brandMark}
        paperAlign="stretch"
        containerMaxWidth="sm"
        paperSx={shellPaper}
      >
        <Alert severity="info" sx={{ mb: 2, width: '100%' }}>
          Sign in to view your saved timetable.
        </Alert>
        <Button type="button" variant="primary" className="btn-block planning-shell-cta" onClick={() => navigate('/user/login')}>
          Go to sign in
        </Button>
      </UserAuthShell>
    )
  }

  const headerBlock = (
    <Box className="active-plan-popup__header" sx={{ flexShrink: 0, width: '100%' }}>
      <Box sx={{ flex: 1, minWidth: 0, pr: 1 }}>
        <Typography component="h1" variant="h5" sx={{ ...userShellTitleSx, width: '100%', mb: 0.5 }}>
          Active plan
        </Typography>
        <Typography variant="body2" sx={{ ...userShellSubtitleSx, width: '100%', mb: 0 }}>
          Your full generated schedule from the server (read-only).
        </Typography>
        <Typography variant="body2" sx={{ ...userShellSubtitleSx, width: '100%', mt: 1, opacity: 0.95 }}>
          To edit times, open the interactive schedule view — it syncs changes back when you save.
        </Typography>
      </Box>
      <Button
        type="button"
        variant="secondary"
        className="planning-back-btn active-plan-popup__back"
        onClick={() => navigate('/user/dashboard')}
        aria-label="Back to dashboard"
        icon={<ArrowBack sx={{ fontSize: 18 }} />}
      >
        Back
      </Button>
    </Box>
  )

  const footerActions = (
    <Box className="active-plan-actions">
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

  return (
    <UserAuthShell
      brandMark={brandMark}
      paperAlign="stretch"
      fullWidth
      className="active-plan-shell"
      paperSx={viewportPaperSx}
    >
      <Box
        className="active-plan-popup"
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', width: '100%' }}
      >
        {headerBlock}

        <Box className="active-plan-popup__scroll" sx={{ flex: 1, minHeight: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={userAccentSpinnerSx} />
            </Box>
          ) : error ? (
            <>
              <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                {error}
              </Alert>
              <Typography variant="body2" sx={{ ...userEmptyStateTextSx, mb: 2 }}>
                Generate a plan in Study Planner first. This page loads the copy stored for your account.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                <Button type="button" variant="secondary" className="planning-back-btn" onClick={() => void refetch()}>
                  Retry
                </Button>
                <Button type="button" variant="primary" className="planning-shell-cta" onClick={() => navigate('/user/planning')}>
                  Study Planner
                </Button>
              </Box>
            </>
          ) : (
            <ScheduleReadOnlyBody summary={data?.summary} topics={data?.topics} schedule={data?.schedule} />
          )}
        </Box>

        {footerActions}
      </Box>
    </UserAuthShell>
  )
}

export default ActivePlan
