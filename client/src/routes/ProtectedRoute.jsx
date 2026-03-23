import React from 'react'
import { Navigate } from 'react-router-dom'
import { isAuthenticated } from '../helper/auth.helper'

const ProtectedRoute = ({ children }) => {
  const isAuth = isAuthenticated()
  
  if (!isAuth) {
    return <Navigate to="/auth" replace />
  }
  
  return children
}

export default ProtectedRoute
