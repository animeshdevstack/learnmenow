import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import Config from '@/config/config'

/**
 * GET /user/active-plan — full saved schedule (summary, topics, days).
 */
export function useActivePlan(token) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(Boolean(token))
  const [error, setError] = useState('')

  const refetch = useCallback(async () => {
    if (!token) {
      setData(null)
      setLoading(false)
      setError('')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { data: body } = await axios.get(Config.userActivePlanUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
      if (body?.success && body.data != null) {
        setData(body.data)
      } else {
        setData(null)
        setError(body?.message || 'Could not load your active plan.')
      }
    } catch (err) {
      setData(null)
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Could not load your active plan.'
      )
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { data, loading, error, refetch }
}
