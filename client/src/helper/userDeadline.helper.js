import Config from '../config/config.jsx'
import { getAuthToken } from './auth.helper.jsx'

/**
 * GET /user/check-deadline (auth).
 * @returns {Promise<boolean|null>} `isDeadlinePassed` from API, or null if unauthenticated / invalid response / request failed
 */
export async function fetchIsDeadlinePassed() {
  const token = getAuthToken()
  if (!token) return null
  try {
    const res = await fetch(Config.userCheckDeadlineUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) return null
    const body = await res.json()
    if (body?.success !== true || typeof body?.isDeadlinePassed !== 'boolean') return null
    return body.isDeadlinePassed
  } catch {
    return null
  }
}

/**
 * After sign-in: dashboard while the plan is still active, planning once the deadline has passed,
 * otherwise competition (no plan / error).
 */
export async function getPostAuthUserPath() {
  const passed = await fetchIsDeadlinePassed()
  if (passed === false) return '/user/dashboard'
  if (passed === true) return '/user/planning'
  return '/user/competition'
}
