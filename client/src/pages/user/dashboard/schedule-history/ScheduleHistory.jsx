import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material'
import {
  ArrowBack,
  ChevronLeft,
  ChevronRight,
  ExpandMore,
  History as HistoryIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material'
import UserAuthShell from '@/components/user/UserAuthShell'
import Button from '@/components/shared/button/Button'
import ScheduleReadOnlyBody from '@/components/user/ScheduleReadOnlyBody'
import {
  userAccentSpinnerSx,
  userEmptyStateTextSx,
  userShellSubtitleSx,
  userShellTitleSx,
} from '@/components/user/userAuthShell.theme'
import { getAuthToken, logout } from '@/helper/auth.helper'
import { slotLabel } from '@/utils/scheduleDisplayLabels'
import { useScheduleHistory } from './useScheduleHistory'
import './ScheduleHistory.css'

const brandMark = <HistoryIcon sx={{ color: 'white', fontSize: 22 }} />
const shellPaper = { maxWidth: 900, width: '100%', mx: 'auto' }

const viewportPaperSx = {
  ...shellPaper,
  maxWidth: 920,
  height: { xs: 'calc(100dvh - 32px)', sm: 'calc(100dvh - 48px)' },
  maxHeight: { xs: 'calc(100dvh - 32px)', sm: 'calc(100dvh - 48px)' },
  overflow: 'hidden',
}

function countSessions(schedule) {
  if (!Array.isArray(schedule)) return 0
  return schedule.reduce(
    (n, day) => n + (Array.isArray(day?.sessions) ? day.sessions.length : 0),
    0
  )
}

function formatWhen(iso) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

function formatCreatedDate(iso) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleDateString(undefined, { dateStyle: 'medium' })
  } catch {
    return '—'
  }
}

function formatCreatedTime(iso) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleTimeString(undefined, { timeStyle: 'short' })
  } catch {
    return '—'
  }
}

/** Sum of each day’s `availableMinutes` in this snapshot. */
function sumAvailableMinutes(schedule) {
  if (!Array.isArray(schedule)) return null
  let sum = 0
  let has = false
  for (const day of schedule) {
    const m = day?.availableMinutes
    if (typeof m === 'number' && Number.isFinite(m)) {
      sum += m
      has = true
    }
  }
  return has ? sum : null
}

/** Distinct `preferredSlot` values across days, human-readable. */
function preferredSlotsSummary(schedule) {
  if (!Array.isArray(schedule)) return '—'
  const slots = new Set()
  for (const day of schedule) {
    const s = day?.preferredSlot
    if (s != null && String(s).trim() !== '') slots.add(String(s).trim())
  }
  if (slots.size === 0) return '—'
  return [...slots].map(slotLabel).join(', ')
}

const ScheduleHistory = () => {
  const navigate = useNavigate()
  const token = getAuthToken()
  const { items: historyItems, pagination, setPage, pageSize, loading, error, refetch } = useScheduleHistory(token)

  const items = useMemo(() => (Array.isArray(historyItems) ? historyItems : []), [historyItems])

  const rangeLabel = useMemo(() => {
    if (!pagination || pagination.total === 0) return null
    const start = (pagination.page - 1) * pagination.limit + 1
    const end = Math.min(pagination.page * pagination.limit, pagination.total)
    return `Showing ${start}–${end} of ${pagination.total}`
  }, [pagination])

  const showPaginationBar =
    Boolean(token) && !loading && !error && pagination && pagination.total > 0

  if (!token) {
    return (
      <UserAuthShell
        title="Schedule history"
        brandMark={brandMark}
        paperAlign="stretch"
        containerMaxWidth="sm"
        paperSx={shellPaper}
      >
        <Alert severity="info" sx={{ mb: 2, width: '100%' }}>
          Sign in to view your saved schedule history.
        </Alert>
        <Button type="button" variant="primary" className="btn-block planning-shell-cta" onClick={() => navigate('/user/login')}>
          Go to sign in
        </Button>
      </UserAuthShell>
    )
  }

  const headerBlock = (
    <Box className="schedule-history-popup__header">
      <Box sx={{ flex: 1, minWidth: 0, pr: 1 }}>
        <Typography component="h1" variant="h5" sx={{ ...userShellTitleSx, width: '100%', mb: 0.5 }}>
          Schedule history
        </Typography>
        <Typography variant="body2" sx={{ ...userShellSubtitleSx, width: '100%', mb: 0 }}>
          Snapshots from each time you generate a plan in Study Planner. Newest first, {pageSize} per page.
        </Typography>
        <Typography variant="body2" sx={{ ...userShellSubtitleSx, width: '100%', mt: 1, opacity: 0.9 }}>
          Expand a row for day-by-day sessions. Page controls stay at the bottom.
        </Typography>
      </Box>
      <Button
        type="button"
        variant="secondary"
        className="planning-back-btn schedule-history-popup__back"
        onClick={() => navigate('/user/dashboard')}
        aria-label="Back to dashboard"
        icon={<ArrowBack sx={{ fontSize: 18 }} />}
      >
        Back
      </Button>
    </Box>
  )

  const footerActions = (
    <Box className="active-plan-actions schedule-history-actions">
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
        className="active-plan-popup schedule-history-popup"
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', width: '100%' }}
      >
        {headerBlock}

        <Box className="schedule-history-popup__scroll active-plan-popup__scroll" sx={{ flex: 1, minHeight: 0 }}>
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
                If you just signed in, try again. History is created when you generate a schedule from Study Planner.
              </Typography>
              <Button type="button" variant="secondary" className="planning-back-btn" onClick={() => void refetch()}>
                Retry
              </Button>
            </>
          ) : items.length === 0 ? (
            <div className="schedule-history-empty">
              <Typography variant="body2" sx={userEmptyStateTextSx}>
                No history yet. Generate a timetable from Study Planner — each run is saved here with your user id and full
                day/session breakdown.
              </Typography>
            </div>
          ) : (
            items.map((entry, index) => {
              const days = Array.isArray(entry.schedule) ? entry.schedule.length : 0
              const sessions = countSessions(entry.schedule)
              const totalAvailableMin = sumAvailableMinutes(entry.schedule)
              const slotsLine = preferredSlotsSummary(entry.schedule)
              const globalIndex = pagination ? (pagination.page - 1) * pagination.limit + index : index
              const summaryTitle =
                globalIndex === 0 ? 'Latest snapshot' : `Snapshot ${globalIndex + 1} of ${pagination?.total ?? '—'}`

              return (
                <Accordion
                  key={entry.id || index}
                  defaultExpanded={globalIndex === 0}
                  disableGutters
                  className="schedule-history-accordion"
                  sx={{
                    mb: 1.25,
                    bgcolor: 'rgba(15, 23, 42, 0.4)',
                    border: '1px solid rgba(100, 116, 139, 0.35)',
                    borderRadius: '12px !important',
                    '&:before': { display: 'none' },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'rgba(148, 163, 184, 0.95)' }} />}>
                    <Box sx={{ width: '100%', pr: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: 'rgba(226, 232, 240, 0.98)', fontWeight: 600 }}>
                        {summaryTitle}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.95)', display: 'block', mt: 0.5 }}>
                        {formatWhen(entry.createdAt)} · {days} day{days !== 1 ? 's' : ''} · {sessions} session
                        {sessions !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="schedule-history-meta">
                      <div>
                        <div className="schedule-history-meta__label">createdAt</div>
                        <div className="schedule-history-meta__value">{formatCreatedDate(entry.createdAt)}</div>
                      </div>
                      <div>
                        <div className="schedule-history-meta__label">Time</div>
                        <div className="schedule-history-meta__value">{formatCreatedTime(entry.createdAt)}</div>
                      </div>
                      <div>
                        <div className="schedule-history-meta__label">availableMinutes</div>
                        <div className="schedule-history-meta__value">
                          {totalAvailableMin != null ? totalAvailableMin : '—'}
                        </div>
                      </div>
                      <div>
                        <div className="schedule-history-meta__label">preferredSlot</div>
                        <div className="schedule-history-meta__value">{slotsLine}</div>
                      </div>
                    </div>
                    <ScheduleReadOnlyBody summary={null} topics={[]} schedule={entry.schedule} />
                  </AccordionDetails>
                </Accordion>
              )
            })
          )}
        </Box>

        {showPaginationBar ? (
          <Box
            className="schedule-history-pagination-bar"
            component="nav"
            aria-label="Schedule history pagination"
          >
            <Button
              type="button"
              variant="secondary"
              size="small"
              className="planning-back-btn schedule-history-pagination-bar__btn"
              disabled={pagination.page <= 1}
              onClick={() => setPage(pagination.page - 1)}
              aria-label="Previous page"
              icon={<ChevronLeft sx={{ fontSize: 20 }} />}
            >
              Previous
            </Button>
            <Box className="schedule-history-pagination-bar__center">
              <Typography component="p" variant="body2" className="schedule-history-pagination-bar__page">
                Page {pagination.page} of {pagination.totalPages}
              </Typography>
              {rangeLabel ? (
                <Typography variant="caption" component="p" className="schedule-history-pagination-bar__range">
                  {rangeLabel}
                </Typography>
              ) : null}
            </Box>
            <Button
              type="button"
              variant="secondary"
              size="small"
              className="planning-back-btn schedule-history-pagination-bar__btn schedule-history-pagination-bar__btn--next"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage(pagination.page + 1)}
              aria-label="Next page"
              icon={<ChevronRight sx={{ fontSize: 20 }} />}
            >
              Next
            </Button>
          </Box>
        ) : null}

        {footerActions}
      </Box>
    </UserAuthShell>
  )
}

export default ScheduleHistory
