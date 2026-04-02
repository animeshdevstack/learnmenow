import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import Config from '@/config/config'

export const SCHEDULE_HISTORY_PAGE_SIZE = 10

/**
 * GET /user/schedule-history?page=&limit= — paginated snapshots (newest first).
 */
export function useScheduleHistory(token) {
  const [items, setItems] = useState(null)
  const [pagination, setPagination] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(Boolean(token))
  const [error, setError] = useState('')

  const refetch = useCallback(async () => {
    if (!token) {
      setItems(null)
      setPagination(null)
      setLoading(false)
      setError('')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { data: body } = await axios.get(Config.userScheduleHistoryUrl, {
        params: {
          page,
          limit: SCHEDULE_HISTORY_PAGE_SIZE,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
      if (body?.success && Array.isArray(body.data)) {
        setItems(body.data)
        setPagination(
          body.pagination && typeof body.pagination === 'object' ? body.pagination : null
        )
        if (body.pagination?.page != null) {
          setPage(body.pagination.page)
        }
      } else {
        setItems([])
        setPagination(null)
        setError(body?.message || 'Could not load schedule history.')
      }
    } catch (err) {
      setItems(null)
      setPagination(null)
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Could not load schedule history.'
      )
    } finally {
      setLoading(false)
    }
  }, [token, page])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return {
    items,
    pagination,
    page,
    setPage,
    pageSize: SCHEDULE_HISTORY_PAGE_SIZE,
    loading,
    error,
    refetch,
  }
}
