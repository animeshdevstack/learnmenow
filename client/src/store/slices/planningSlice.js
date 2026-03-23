import { createSlice } from '@reduxjs/toolkit'

/**
 * Persists the user’s competition → subject → chapter → selected topics flow
 * for the Priority step and routine generation.
 * @typedef {{ id: string, name: string }} PlanningTopic
 */

const initialState = {
  competitionId: null,
  subjectId: null,
  chapterId: null,
  subjectName: '',
  chapterName: '',
  /** @type {PlanningTopic[]} */
  topics: [],
}

const planningSlice = createSlice({
  name: 'planning',
  initialState,
  reducers: {
    setPlanningSelection: (state, action) => {
      const p = action.payload || {}
      state.competitionId = p.competitionId ?? null
      state.subjectId = p.subjectId ?? null
      state.chapterId = p.chapterId ?? null
      state.subjectName = p.subjectName ?? ''
      state.chapterName = p.chapterName ?? ''
      state.topics = Array.isArray(p.topics) ? p.topics : []
    },
    clearPlanningSelection: () => ({ ...initialState }),
  },
})

export const { setPlanningSelection, clearPlanningSelection } = planningSlice.actions
export default planningSlice.reducer
