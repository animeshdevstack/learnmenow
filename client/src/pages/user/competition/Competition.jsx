import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material'
import { EmojiEvents } from '@mui/icons-material'
import UserAuthShell from '@/components/user/UserAuthShell'
import UserLabeledSelect from '@/components/user/UserLabeledSelect'
import { toSelectOptions } from '@/components/user/userSelectOptions'
import {
  userEmptyStateTextSx,
  userPrimaryCtaButtonSx,
  userAccentSpinnerSx,
  userSpinnerCenterSx,
  userTextNavLinkSx,
} from '@/components/user/userAuthShell.theme'
import Config from '../../../config/config'
import { getAuthToken, getUserInfo, setStoredUserCompetitionId } from '../../../helper/auth.helper'
import { useCompetitions } from './useCompetitions'

const brandMark = <EmojiEvents sx={{ color: 'white', fontSize: 22 }} />

const Competition = () => {
  const navigate = useNavigate()
  const token = getAuthToken()
  const existingCompetitionId = getUserInfo().competitionId
  const { competitions, loading, error } = useCompetitions(token)
  const competitionOptions = useMemo(() => toSelectOptions(competitions), [competitions])
  const [selectedId, setSelectedId] = useState('')
  const [nextLoading, setNextLoading] = useState(false)
  const [nextError, setNextError] = useState('')

  useEffect(() => {
    setNextError('')
  }, [selectedId])

  useEffect(() => {
    if (!token || !existingCompetitionId) return
    navigate('/user/planning', { replace: true, state: { competitionId: String(existingCompetitionId) } })
  }, [token, existingCompetitionId, navigate])

  const handleNext = async () => {
    if (!selectedId || !token) return
    setNextError('')
    setNextLoading(true)
    try {
      const { data } = await axios.put(
        `${Config.backendUrl}user/update-competition`,
        { CompetitionId: selectedId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      const savedCompetitionId = String(data?.updatedUser?.CompetitionId ?? selectedId)
      setStoredUserCompetitionId(savedCompetitionId)
      navigate('/user/planning', { state: { competitionId: savedCompetitionId } })
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Could not save your competition. Please try again.'
      setNextError(msg)
    } finally {
      setNextLoading(false)
    }
  }

  if (!token) {
    return (
      <UserAuthShell
        title="Competitions"
        brandMark={brandMark}
        paperAlign="stretch"
        containerMaxWidth="xs"
        paperSx={{ maxWidth: 400, width: '100%', mx: 'auto' }}
      >
        <Alert severity="info" sx={{ mb: 2, width: '100%' }}>
          Sign in to view and select competitions.
        </Alert>
        <Button
          component={Link}
          to="/user/login"
          variant="contained"
          fullWidth
          sx={userPrimaryCtaButtonSx}
        >
          Go to sign in
        </Button>
      </UserAuthShell>
    )
  }

  return (
    <UserAuthShell
      title="Competitions"
      subtitle="Choose a competition to continue."
      brandMark={brandMark}
      paperAlign="stretch"
      containerMaxWidth="xs"
      paperSx={{ maxWidth: 400, width: '100%', mx: 'auto' }}
    >
      {loading ? (
        <Box sx={userSpinnerCenterSx}>
          <CircularProgress sx={userAccentSpinnerSx} />
        </Box>
      ) : (
        <>
          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}

          <UserLabeledSelect
            label="Competition"
            selectId="competition-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            options={competitionOptions}
            placeholder="Choose a competition"
            noneLabel="None (clear)"
            formatOptionLabel={(s) => s}
          />

          {!loading && !error && competitions.length === 0 && (
            <Typography variant="body2" sx={{ ...userEmptyStateTextSx, mt: 2 }}>
              There are no competitions available yet.
            </Typography>
          )}

          {nextError && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }} onClose={() => setNextError('')}>
              {nextError}
            </Alert>
          )}

          <Box className="user-form-actions">
            <Button
              component={Link}
              to="/user/dashboard"
              variant="text"
              size="medium"
              sx={{ ...userTextNavLinkSx, mt: 0 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              size="medium"
              disabled={!selectedId || !!error || nextLoading}
              onClick={handleNext}
              sx={userPrimaryCtaButtonSx}
            >
              {nextLoading ? 'Saving…' : 'Next'}
            </Button>
          </Box>
        </>
      )}
    </UserAuthShell>
  )
}

export default Competition
