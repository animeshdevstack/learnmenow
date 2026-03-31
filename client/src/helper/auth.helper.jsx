import { jwtDecode } from 'jwt-decode'

export const USER_STORAGE_KEY = 'user'

// Authentication helper functions
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken')
  return !!token
}

export const getAuthToken = () => {
  return localStorage.getItem('authToken')
}

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/** Normalizes API `User` from POST /user/signin (FName, LName, Email, Role, _id, CompetitionId, …). */
export const normalizeSigninUser = (User) => {
  if (!User || typeof User !== 'object') return null
  const name = [User.FName, User.LName].filter(Boolean).join(' ').trim() || undefined
  const competitionId =
    User.CompetitionId ?? User.competitionId ?? undefined
  return {
    id: User._id ?? User.id,
    email: User.Email,
    name,
    firstName: User.FName,
    lastName: User.LName,
    phone: User.Phone,
    role: User.Role != null ? String(User.Role).toLowerCase() : undefined,
    isVerified: User.IsVerified,
    competitionId,
  }
}

const persistUserFromToken = (token) => {
  try {
    const decoded = jwtDecode(token)
    const profile = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role != null ? String(decoded.role).toLowerCase() : undefined,
      name: decoded.name,
    }
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile))
  } catch (error) {
    console.error('Error persisting user from token:', error)
  }
}

/**
 * Saves JWT and optional profile from API. If no API user (e.g. OAuth), derives profile from token.
 */
export const saveAuthSession = (token, apiUser) => {
  if (!token) return
  localStorage.setItem('authToken', token)
  if (apiUser) {
    const profile = normalizeSigninUser(apiUser)
    if (profile) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile))
      return
    }
  }
  persistUserFromToken(token)
}

export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token)
}

export const removeAuthToken = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem(USER_STORAGE_KEY)
}

export const setStoredUserCompetitionId = (competitionId) => {
  const stored = getStoredUser() || {}
  localStorage.setItem(
    USER_STORAGE_KEY,
    JSON.stringify({
      ...stored,
      competitionId: competitionId ?? undefined,
    })
  )
}

export const logout = () => {
  const redirectTo = isAdmin() ? '/auth' : '/user/login'
  removeAuthToken()
  window.location.href = redirectTo
}

// Decode JWT token and get user info
export const decodeToken = () => {
  try {
    const token = getAuthToken()
    if (!token) return null
    
    const decoded = jwtDecode(token)
    return decoded
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

// Get user role from token
export const getUserRole = () => {
  const info = getUserInfo()
  return info.role || null
}

// Check if user is admin
export const isAdmin = () => {
  const role = getUserRole()
  return role === 'admin'
}

// Check if user has specific role
export const hasRole = (requiredRole) => {
  const role = getUserRole()
  return role === requiredRole
}

// Get user info: prefer localStorage profile (full name, etc.), fallback to JWT
export const getUserInfo = () => {
  const stored = getStoredUser()
  const decoded = decodeToken()
  const roleRaw = stored?.role ?? decoded?.role
  return {
    id: stored?.id ?? decoded?.id,
    email: stored?.email ?? decoded?.email,
    role: roleRaw != null ? String(roleRaw).toLowerCase() : null,
    name: stored?.name ?? decoded?.name,
    firstName: stored?.firstName,
    lastName: stored?.lastName,
    phone: stored?.phone,
    isVerified: stored?.isVerified,
    competitionId: stored?.competitionId,
  }
}
