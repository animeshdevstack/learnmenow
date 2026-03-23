import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from '../components/Admin/login.component'
import NotFound from '../pages/NotFound'

const AuthRouting = () => {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  )
}

export default AuthRouting