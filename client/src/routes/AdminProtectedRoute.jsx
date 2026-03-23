import React from 'react'
import { Navigate } from 'react-router-dom'
import { isAuthenticated, isAdmin } from '../helper/auth.helper'

const AdminProtectedRoute = ({ children }) => {
  const isAuth = isAuthenticated()
  const isAdminUser = isAdmin()
  
  // If not authenticated, redirect to login
  if (!isAuth) {
    return <Navigate to="/auth" replace />
  }
  
  // If authenticated but not admin, redirect to unauthorized page or user dashboard
  if (!isAdminUser) {
    return <Navigate to="/user" replace />
  }
  
  // If authenticated and is admin, allow access
  return children
}

export default AdminProtectedRoute
