import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Box, CircularProgress, Typography } from '@mui/material'
import { MenuBook } from '@mui/icons-material'
import UserAuthShell from '../../../components/user/UserAuthShell'
import UserLabeledSelect from '../../../components/user/UserLabeledSelect'
import UserTopicCheckboxList from '../../../components/user/UserTopicCheckboxList'
import Button from '../../../components/shared/button/Button'
import '../../../components/shared/form/Form.css'
import {
  userAccentSpinnerSx,
  userEmptyStateTextSx,
  userSelectFieldLabelSx,
} from '../../../components/user/userAuthShell.theme'
import { usePlanningFlow } from './usePlanningFlow'
import { entityId, toSelectOptions } from '../../../components/user/userSelectOptions'
import './Planning.css'

const brandMark = <MenuBook sx={{ color: 'white', fontSize: 22 }} />

const shellPaper = { maxWidth: 560, width: '100%', mx: 'auto' }

const Planning = () => {
  const navigate = useNavigate()
  const {
    token,
    competitionId,
    subjects,
    chapters,
    topics,
    subjectId,
    chapterId,
    selectedTopicIds,
    loadingSubjects,
    loadingChapters,
    loadingTopics,
    listError,
    setListError,
    onSubjectChange,
    onChapterChange,
    toggleTopic,
    handleNext,
    busy,
  } = usePlanningFlow()

  const subjectOptions = useMemo(() => toSelectOptions(subjects), [subjects])
  const chapterOptions = useMemo(() => toSelectOptions(chapters), [chapters])

  if (!token) {
    return (
      <UserAuthShell title="Study Planner" brandMark={brandMark} paperAlign="stretch" containerMaxWidth="sm" paperSx={shellPaper}>
        <Alert severity="info" sx={{ mb: 2, width: '100%' }}>
          Sign in to build your study plan.
        </Alert>
        <Button type="button" variant="primary" className="btn-block planning-shell-cta" onClick={() => navigate('/user/login')}>
          Go to sign in
        </Button>
      </UserAuthShell>
    )
  }

  if (!competitionId) {
    return (
      <UserAuthShell
        title="Study Planner"
        subtitle="Choose a competition first to load subjects and topics."
        brandMark={brandMark}
        paperAlign="stretch"
        containerMaxWidth="sm"
        paperSx={shellPaper}
      >
        <Alert severity="warning" sx={{ mb: 2, width: '100%' }}>
          No competition is selected. Go back and pick one to continue.
        </Alert>
        <Button type="button" variant="primary" className="btn-block planning-shell-cta" onClick={() => navigate('/user/competition')}>
          Select competition
        </Button>
      </UserAuthShell>
    )
  }

  return (
    <UserAuthShell
      title="Study Planner"
      subtitle="Pick a subject, chapter, and the topics you want to focus on."
      brandMark={brandMark}
      paperAlign="stretch"
      containerMaxWidth="sm"
      paperSx={shellPaper}
    >
      {loadingSubjects ? (
        <Box className="planning-spinner">
          <CircularProgress sx={userAccentSpinnerSx} />
        </Box>
      ) : (
        <>
          {listError && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }} onClose={() => setListError('')}>
              {listError}
            </Alert>
          )}

          <Box className="planning-form-grid">
            <UserLabeledSelect
              label="Subject"
              selectId="subject-select"
              value={subjectId}
              onChange={onSubjectChange}
              options={subjectOptions}
              placeholder="Choose a subject"
            />
            <UserLabeledSelect
              label="Subject types"
              selectId="chapter-select"
              value={chapterId}
              onChange={onChapterChange}
              options={chapterOptions}
              placeholder={subjectId ? 'Choose a subject type' : 'Choose a subject first'}
              disabled={!subjectId || loadingChapters}
              readableWhenDisabled
            />
          </Box>

          {!loadingSubjects && !listError && subjects.length === 0 && (
            <Typography variant="body2" sx={{ ...userEmptyStateTextSx, mt: 2 }}>
              No subjects are available for this competition yet.
            </Typography>
          )}

          <Box className="planning-topics-block">
            <Typography component="label" id="topics-label" variant="body2" sx={userSelectFieldLabelSx}>
              Choose topics
            </Typography>
            <Box role="group" aria-labelledby="topics-label" className="planning-topics-panel">
              {loadingTopics ? (
                <Box className="planning-spinner planning-spinner--compact">
                  <CircularProgress size={28} sx={userAccentSpinnerSx} />
                </Box>
              ) : !chapterId ? (
                <Typography variant="body2" sx={userEmptyStateTextSx}>
                  Select a chapter to list topics.
                </Typography>
              ) : topics.length === 0 ? (
                <Typography variant="body2" sx={userEmptyStateTextSx}>
                  No topics found for this chapter.
                </Typography>
              ) : (
                <UserTopicCheckboxList
                  items={topics}
                  getId={entityId}
                  getLabel={(t) => t?.Name}
                  selectedIds={selectedTopicIds}
                  onToggle={toggleTopic}
                />
              )}
            </Box>
          </Box>

          <div className="form-actions form-actions--split planning-actions">
            <Button
              type="button"
              variant="secondary"
              size="medium"
              className="planning-back-btn"
              onClick={() => navigate('/user/competition', { state: { competitionId } })}
            >
              Back
            </Button>
            <Button
              type="button"
              variant="primary"
              size="medium"
              className="planning-next-btn"
              disabled={!subjectId || !chapterId || selectedTopicIds.size === 0 || busy}
              onClick={handleNext}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </UserAuthShell>
  )
}

export default Planning
