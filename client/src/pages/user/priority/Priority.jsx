import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import {
  Alert,
  Box,
  Checkbox,
  FormControl,
  InputAdornment,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { CalendarMonth, MenuBook } from '@mui/icons-material'
import UserAuthShell from '@/components/user/UserAuthShell'
import UserLabeledSelect from '@/components/user/UserLabeledSelect'
import Button from '../../../components/shared/button/Button'
import {
  userDarkSelectMenuProps,
  userDarkSelectSx,
  userEmptyStateTextSx,
  userSelectFieldLabelSx,
  userSelectPlaceholderSx,
  userSelectValueSx,
} from '@/components/user/userAuthShell.theme'
import { getAuthToken } from '../../../helper/auth.helper'
import Config from '../../../config/config'
import '../planning/Planning.css'
import './Priority.css'

const brandMark = <MenuBook sx={{ color: 'white', fontSize: 22 }} />

const shellPaper = { maxWidth: 600, width: '100%', mx: 'auto' }

/** API values; order preserved when sending `preferredSlot` array. */
const PREFERRED_SLOT_OPTIONS = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'night', label: 'Night' },
  { value: 'late_night', label: 'Late Night' },
]

const SLOT_ORDER = PREFERRED_SLOT_OPTIONS.map((o) => o.value)

const sortSlots = (ids) => [...ids].sort((a, b) => SLOT_ORDER.indexOf(a) - SLOT_ORDER.indexOf(b))

/** UI order preserved; API receives all selected slots for per-day random slot + random times. */
const preferredSlotsForApi = (slots) => sortSlots(slots)

const HOUR_OPTIONS = Array.from({ length: 13 }, (_, i) => ({
  value: String(i),
  label: `${i} h`,
}))

const RANKS = [1, 2, 3, 4, 5]

/** Keep “Available time (weekdays/weekend)” on one line in the grid. */
const availabilityLabelSx = { whiteSpace: 'nowrap' }

const priorityDateFieldSx = {
  mt: 0.75,
  width: '100%',
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    color: '#f1f5f9',
    '& fieldset': { borderColor: 'rgba(71, 85, 105, 0.55)' },
    '&:hover fieldset': { borderColor: 'rgba(100, 116, 139, 0.85)' },
    '&.Mui-focused fieldset': { borderColor: '#06b6d4' },
  },
  '& .MuiInputBase-input': { color: '#f1f5f9' },
  '& .MuiSvgIcon-root': { color: 'rgba(203, 213, 225, 0.85)' },
}

const todayIsoDate = () => new Date().toISOString().slice(0, 10)

const Priority = () => {
  const navigate = useNavigate()
  const token = getAuthToken()
  const planning = useSelector((s) => s.planning)
  const { topics = [], competitionId } = planning

  const [priorities, setPriorities] = useState({})
  const [startDate, setStartDate] = useState('')
  const [deadline, setDeadline] = useState('')
  const [preferredSlots, setPreferredSlots] = useState([])
  const [weekdayHours, setWeekdayHours] = useState('')
  const [weekendHours, setWeekendHours] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const topicList = useMemo(() => topics.filter((t) => t?.id), [topics])

  const minStart = todayIsoDate()
  const minDeadline = startDate && startDate >= minStart ? startDate : minStart

  useEffect(() => {
    if (startDate && deadline && deadline < startDate) {
      setDeadline(startDate)
    }
  }, [startDate, deadline])

  const setRank = (topicId, rank) => {
    setPriorities((prev) => ({ ...prev, [topicId]: rank }))
  }

  const allPrioritiesSet =
    topicList.length > 0 && topicList.every((t) => priorities[t.id] != null && priorities[t.id] >= 1 && priorities[t.id] <= 5)

  const canSubmit =
    token &&
    topicList.length > 0 &&
    allPrioritiesSet &&
    startDate &&
    deadline &&
    preferredSlots.length > 0 &&
    weekdayHours !== '' &&
    weekendHours !== ''

  const handleSchedule = async () => {
    if (!canSubmit) return
    setSubmitError('')
    setSubmitting(true)
    try {
      const selectedTopics = topicList.map((t) => ({
        topicId: t.id,
        priority: priorities[t.id],
      }))
      const payload = {
        startDate,
        deadline,
        preferredSlots: preferredSlotsForApi(preferredSlots),
        studyTime: {
          weekdays: Number(weekdayHours),
          weekends: Number(weekendHours),
        },
        selectedTopics,
      }
      const res = await axios.post(Config.userScheduleUrl, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const routineData = res.data?.data
      if (routineData) {
        try {
          sessionStorage.setItem('learnMeNowRoutine', JSON.stringify(routineData))
        } catch {
          /* ignore quota / private mode */
        }
      }
      navigate('/user/schedule', { state: { routineData, competitionId, routineCreated: true } })
    } catch (err) {
      const msg =
        err.response?.data?.message || err.response?.data?.error || err.message || 'Could not generate your schedule.'
      setSubmitError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (!token) {
    return (
      <UserAuthShell title="Study Planner" brandMark={brandMark} paperAlign="stretch" containerMaxWidth="sm" paperSx={shellPaper}>
        <Alert severity="info" sx={{ mb: 2, width: '100%' }}>
          Sign in to set priorities and schedule your plan.
        </Alert>
        <Button type="button" variant="primary" className="btn-block planning-shell-cta" onClick={() => navigate('/user/login')}>
          Go to sign in
        </Button>
      </UserAuthShell>
    )
  }

  if (topicList.length === 0) {
    return (
      <UserAuthShell
        title="Study Planner"
        subtitle="Add topics from the previous step to set priorities."
        brandMark={brandMark}
        paperAlign="stretch"
        containerMaxWidth="sm"
        paperSx={shellPaper}
      >
        <Typography variant="body2" sx={{ ...userEmptyStateTextSx, mb: 2 }}>
          No topics selected yet. Complete planning and choose topics first.
        </Typography>
        <Button type="button" variant="primary" className="btn-block planning-shell-cta" onClick={() => navigate('/user/planning')}>
          Back to planning
        </Button>
      </UserAuthShell>
    )
  }

  return (
    <UserAuthShell title="Study Planner" brandMark={brandMark} paperAlign="stretch" containerMaxWidth="sm" paperSx={shellPaper}>
      <div className="priority-card">
        <h2 className="priority-card-title">Add Priority In Your Task</h2>
        {topicList.map((t) => (
          <div key={t.id} className="priority-topic-row">
            <span className="priority-topic-name">{t.name}</span>
            <div className="priority-ranks" role="group" aria-label={`Priority for ${t.name}`}>
              {RANKS.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`priority-rank-btn priority-rank-btn--${r} ${priorities[t.id] === r ? 'is-active' : ''}`}
                  onClick={() => setRank(t.id, r)}
                  aria-pressed={priorities[t.id] === r}
                  aria-label={`Priority ${r}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
            width: '100%',
          }}
        >
          <Box>
            <Typography component="label" htmlFor="priority-start" variant="body2" sx={userSelectFieldLabelSx}>
              Start date
            </Typography>
            <TextField
              id="priority-start"
              type="date"
              fullWidth
              size="small"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={priorityDateFieldSx}
              inputProps={{ min: minStart }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarMonth sx={{ color: 'rgba(203, 213, 225, 0.75)', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box>
            <Typography component="label" htmlFor="priority-deadline" variant="body2" sx={userSelectFieldLabelSx}>
              Deadline for completion
            </Typography>
            <TextField
              id="priority-deadline"
              type="date"
              fullWidth
              size="small"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={priorityDateFieldSx}
              inputProps={{ min: minDeadline }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarMonth sx={{ color: 'rgba(203, 213, 225, 0.75)', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 2,
            width: '100%',
            alignItems: 'start',
          }}
        >
          <UserLabeledSelect
            label="Weekday Hours"
            labelSx={availabilityLabelSx}
            selectId="priority-weekday-hours"
            value={weekdayHours}
            onChange={(e) => setWeekdayHours(e.target.value)}
            options={HOUR_OPTIONS}
            placeholder="Select study time"
            formatOptionLabel={(s) => s}
          />
          <UserLabeledSelect
            label="Weekend Hours"
            labelSx={availabilityLabelSx}
            selectId="priority-weekend-hours"
            value={weekendHours}
            onChange={(e) => setWeekendHours(e.target.value)}
            options={HOUR_OPTIONS}
            placeholder="Select study time"
            formatOptionLabel={(s) => s}
          />
          <FormControl fullWidth size="small" sx={{ width: '100%' }}>
            <Typography
              component="label"
              id="preferred-slot-label"
              htmlFor="preferred-slot-select"
              variant="body2"
              sx={userSelectFieldLabelSx}
            >
              Preferred time slot
            </Typography>
            <Select
              id="preferred-slot-select"
              multiple
              displayEmpty
              value={preferredSlots}
              onChange={(e) => {
                const v = e.target.value
                setPreferredSlots(sortSlots(typeof v === 'string' ? v.split(',') : v))
              }}
              inputProps={{ 'aria-labelledby': 'preferred-slot-label' }}
              renderValue={(selected) => {
                if (!selected?.length) {
                  return (
                    <Typography component="span" sx={userSelectPlaceholderSx}>
                      Select time slots
                    </Typography>
                  )
                }
                const labels = sortSlots(selected)
                  .map((id) => PREFERRED_SLOT_OPTIONS.find((o) => o.value === id)?.label)
                  .filter(Boolean)
                return (
                  <Typography component="span" sx={userSelectValueSx}>
                    {labels.join(', ')}
                  </Typography>
                )
              }}
              sx={{ ...userDarkSelectSx, mt: 0.75 }}
              MenuProps={{
                ...userDarkSelectMenuProps,
                autoFocus: false,
                PaperProps: {
                  ...userDarkSelectMenuProps.PaperProps,
                  sx: {
                    ...userDarkSelectMenuProps.PaperProps?.sx,
                    maxHeight: 320,
                  },
                },
              }}
            >
              {PREFERRED_SLOT_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value} dense>
                  <Checkbox
                    size="small"
                    checked={preferredSlots.includes(opt.value)}
                    tabIndex={-1}
                    disableRipple
                    sx={{
                      mr: 1,
                      py: 0,
                      color: 'rgba(148, 163, 184, 0.85)',
                      '&.Mui-checked': { color: '#06b6d4' },
                    }}
                  />
                  <ListItemText
                    primary={opt.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      color: 'rgba(226, 232, 240, 0.95)',
                    }}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {submitError && (
        <Alert severity="error" sx={{ mt: 2, width: '100%' }} onClose={() => setSubmitError('')}>
          {submitError}
        </Alert>
      )}

      <div className="priority-form-actions planning-actions">
        <Button type="button" variant="secondary" className="planning-back-btn" onClick={() => navigate('/user/planning')}>
          Back
        </Button>
      </div>

      <Button
        type="button"
        variant="primary"
        className="priority-schedule-btn btn-block"
        disabled={!canSubmit || submitting}
        loading={submitting}
        onClick={handleSchedule}
      >
        Schedule Plan
      </Button>
    </UserAuthShell>
  )
}

export default Priority
