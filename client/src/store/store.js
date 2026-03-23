import { configureStore } from '@reduxjs/toolkit'
import planningReducer from './slices/planningSlice'

export const store = configureStore({
  reducer: {
    planning: planningReducer,
  },
})
