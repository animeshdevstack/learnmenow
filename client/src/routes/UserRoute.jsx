import React from 'react'
import { Routes, Route } from 'react-router-dom'
import UserLogin from '../pages/user/auth/UserLogin'
import UserSignup from '../pages/user/auth/UserSignup'
import Dashboard from '../pages/user/dashboard/Dashboard'
import ForgetPassword from '../pages/user/auth/ForgetPassword'
import ResetPassword from '../pages/user/auth/ResetPassword'
import VerifyEmail from '../pages/user/auth/VerifyEmail'
import OAuthCallback from '../pages/user/auth/OAuthCallback'
import Competition from '../pages/user/competition/Competition'
import Planning from '../pages/user/planning/Planning'
import Priority from '../pages/user/priority/Priority'
import Schedule from '../pages/user/schedule/Schedule'
import TodayPlan from '../pages/user/dashboard/today-plan/TodayPlan'
import ActivePlan from '../pages/user/dashboard/active-plan/ActivePlan'

const UserRouting = () => {
  return (
      <Routes>
        <Route path="/" element={<UserLogin />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/competition" element={<Competition />} />
        <Route path="/planning" element={<Planning />} />
        <Route path="/priority" element={<Priority />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/today-plan" element={<TodayPlan />} />
        <Route path="/active-plan" element={<ActivePlan />} />
      </Routes>
  )
}

export default UserRouting