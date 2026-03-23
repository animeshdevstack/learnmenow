import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Config from '../../../config/config'
import { getAuthToken, getUserInfo } from '../../../helper/auth.helper'
import { setPlanningSelection } from '../../../store/slices/planningSlice'
import { entityId } from '@/components/user/userSelectOptions'

export function usePlanningFlow() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const token = getAuthToken()

  const competitionId = useMemo(() => {
    const fromState = location.state?.competitionId
    const fromQuery = searchParams.get('competition')
    const fromProfile = getUserInfo().competitionId
    const raw = fromState ?? fromQuery ?? fromProfile
    return raw != null && raw !== '' ? String(raw) : ''
  }, [location.state, searchParams])

  const [subjects, setSubjects] = useState([])
  const [chapters, setChapters] = useState([])
  const [topics, setTopics] = useState([])

  const [subjectId, setSubjectId] = useState('')
  const [chapterId, setChapterId] = useState('')
  const [selectedTopicIds, setSelectedTopicIds] = useState(() => new Set())

  const [loadingSubjects, setLoadingSubjects] = useState(false)
  const [loadingChapters, setLoadingChapters] = useState(false)
  const [loadingTopics, setLoadingTopics] = useState(false)
  const [listError, setListError] = useState('')

  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  )

  const fetchSubjects = useCallback(async () => {
    if (!competitionId || !token) return
    setListError('')
    setLoadingSubjects(true)
    try {
      const { data } = await axios.get(`${Config.backendUrl}subject/filter/compition/${competitionId}`, {
        headers: authHeaders,
      })
      const rows = data?.allsubject ?? data?.allSubject ?? []
      setSubjects(Array.isArray(rows) ? rows : [])
    } catch (err) {
      const msg =
        err.response?.data?.message || err.response?.data?.error || err.message || 'Could not load subjects.'
      setListError(msg)
      setSubjects([])
    } finally {
      setLoadingSubjects(false)
    }
  }, [authHeaders, competitionId, token])

  const fetchChapters = useCallback(
    async (subId) => {
      if (!subId || !token) {
        setChapters([])
        return
      }
      setListError('')
      setLoadingChapters(true)
      try {
        const { data } = await axios.get(`${Config.backendUrl}chapter/filter/subject/${subId}`, {
          headers: authHeaders,
        })
        const rows = data?.allChapter ?? []
        setChapters(Array.isArray(rows) ? rows : [])
      } catch (err) {
        const msg =
          err.response?.data?.message || err.response?.data?.error || err.message || 'Could not load chapters.'
        setListError(msg)
        setChapters([])
      } finally {
        setLoadingChapters(false)
      }
    },
    [authHeaders, token]
  )

  const fetchTopics = useCallback(
    async (chId) => {
      if (!chId || !token) {
        setTopics([])
        return
      }
      setListError('')
      setLoadingTopics(true)
      try {
        const { data } = await axios.get(`${Config.backendUrl}topic/filter/chapter/${chId}`, {
          headers: authHeaders,
        })
        const rows = data?.allTopic ?? []
        setTopics(Array.isArray(rows) ? rows : [])
      } catch (err) {
        const msg =
          err.response?.data?.message || err.response?.data?.error || err.message || 'Could not load topics.'
        setListError(msg)
        setTopics([])
      } finally {
        setLoadingTopics(false)
      }
    },
    [authHeaders, token]
  )

  useEffect(() => {
    if (!competitionId || !token) return
    setSubjectId('')
    setChapterId('')
    setSelectedTopicIds(new Set())
    fetchSubjects()
  }, [competitionId, token, fetchSubjects])

  useEffect(() => {
    if (!subjectId) {
      setChapters([])
      setChapterId('')
      return
    }
    fetchChapters(subjectId)
  }, [subjectId, fetchChapters])

  useEffect(() => {
    if (!chapterId) {
      setTopics([])
      setSelectedTopicIds(new Set())
      return
    }
    fetchTopics(chapterId)
  }, [chapterId, fetchTopics])

  useEffect(() => {
    setSelectedTopicIds(new Set())
  }, [chapterId])

  const onSubjectChange = (e) => {
    setSubjectId(e.target.value)
    setChapterId('')
  }

  const onChapterChange = (e) => {
    setChapterId(e.target.value)
  }

  const toggleTopic = (id) => {
    const sid = String(id)
    setSelectedTopicIds((prev) => {
      const next = new Set(prev)
      if (next.has(sid)) next.delete(sid)
      else next.add(sid)
      return next
    })
  }

  const handleNext = () => {
    if (!subjectId || !chapterId || selectedTopicIds.size === 0 || !competitionId) return
    const sub = subjects.find((s) => entityId(s) === String(subjectId))
    const ch = chapters.find((c) => entityId(c) === String(chapterId))
    const topicRows = topics
      .filter((t) => selectedTopicIds.has(entityId(t)))
      .map((t) => ({ id: entityId(t), name: t.Name || 'Untitled' }))
    dispatch(
      setPlanningSelection({
        competitionId,
        subjectId,
        chapterId,
        subjectName: sub?.Name ?? '',
        chapterName: ch?.Name ?? '',
        topics: topicRows,
      })
    )
    navigate('/user/priority')
  }

  const busy = loadingSubjects || loadingChapters || loadingTopics

  return {
    token,
    competitionId,
    subjects,
    chapters,
    topics,
    subjectId,
    chapterId,
    selectedTopicIds,
    loadingSubjects,
    loadingChapters,
    loadingTopics,
    listError,
    setListError,
    onSubjectChange,
    onChapterChange,
    toggleTopic,
    handleNext,
    busy,
  }
}
