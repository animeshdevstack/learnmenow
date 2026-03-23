import { useEffect, useState } from 'react'
import axios from 'axios'
import Config from '../../../config/config'

export function useCompetitions(token) {
  const [competitions, setCompetitions] = useState([])
  const [loading, setLoading] = useState(Boolean(token))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    let cancelled = false

    const run = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await axios.get(`${Config.backendUrl}competition`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (cancelled) return

        if (response.data?.success && Array.isArray(response.data.allCompetion)) {
          setCompetitions(
            response.data.allCompetion.map((c) => ({
              ...c,
              _id: c.id ?? c._id,
            }))
          )
        } else {
          setCompetitions([])
          setError('No competitions were returned.')
        }
      } catch (err) {
        if (cancelled) return
        console.error('Error fetching competitions:', err)
        setError(
          err.response?.data?.message || 'Could not load competitions. Please try again.'
        )
        setCompetitions([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [token])

  return { competitions, loading, error }
}
