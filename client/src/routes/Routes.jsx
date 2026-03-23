import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminRouting from './AdminRoute'
import UserRouting from './UserRoute'
import AuthRouting from './AuthRoute'
import NotFound from '../pages/NotFound'

const Routing = () => {
  return (
      <Routes>
        <Route path="/admin/*" element={<AdminRouting />} />
        <Route path="/user/*" element={<UserRouting />} />
        <Route path="/auth/*" element={<AuthRouting />} />
        <Route path="/" element={<Navigate to="/user" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  )
}

export default Routing