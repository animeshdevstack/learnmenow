import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import Config from '../../config/config'
import { getAuthToken } from '../../helper/auth.helper'

const ChapterManagement = (subjectId, competitionId) => {
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [error, setError] = useState('')
  const [subjectName, setSubjectName] = useState('')
  const [competitionName, setCompetitionName] = useState('')

  // Fetch all chapters for the subject
  const fetchChapters = async () => {
    try {
      setLoading(true)
      const token = getAuthToken()
      const response = await axios.get(`${Config.backendUrl}chapter/filter/subject/${subjectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.data.success) {
        // Map the API response to include _id for consistency
        const chaptersWithId = response.data.allChapter.map(chapter => ({
          ...chapter,
          _id: chapter.id
        }))
        setChapters(chaptersWithId)
      }
    } catch (error) {
      console.error('Error fetching chapters:', error)
      setError('Failed to fetch chapters')
    } finally {
      setLoading(false)
    }
  }

  // Fetch subject name for breadcrumb
  const fetchSubjectName = async () => {
    try {
      const token = getAuthToken()
      const response = await axios.get(`${Config.backendUrl}subject/${subjectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.data.success) {
        setSubjectName(response.data.getSubject?.Name || 'Subject')
      }
    } catch (error) {
      console.error('Error fetching subject name:', error)
      setSubjectName('Subject')
    }
  }

  // Fetch competition name for breadcrumb
  const fetchCompetitionName = async () => {
    try {
      const token = getAuthToken()
      const response = await axios.get(`${Config.backendUrl}competition/${competitionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.data.success) {
        setCompetitionName(response.data.getCompetition?.Name || 'Competition')
      }
    } catch (error) {
      console.error('Error fetching competition name:', error)
      setCompetitionName('Competition')
    }
  }

  useEffect(() => {
    if (subjectId) {
      fetchChapters()
      fetchSubjectName()
    }
    if (competitionId) {
      fetchCompetitionName()
    }
  }, [subjectId, competitionId])

  // Create chapter
  const handleCreateChapter = async (chapterData) => {
    try {
      const token = getAuthToken()
      const response = await axios.post(`${Config.backendUrl}chapter`, {
        ...chapterData,
        subjectId: subjectId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.data.success) {
        // Add the new chapter with the ID from the response
        const newChapter = {
          ...response.data.chapterData,
          _id: response.data.chapterData.id || response.data.chapterData._id
        }
        setChapters(prev => [...prev, newChapter])
        setShowCreateDialog(false)
        setError('')
      }
    } catch (error) {
      console.error('Error creating chapter:', error)
      setError('Failed to create chapter')
    }
  }

  // Update chapter
  const handleUpdateChapter = async (chapterData) => {
    try {
      const token = getAuthToken()
      const response = await axios.put(`${Config.backendUrl}chapter/${selectedChapter._id}`, chapterData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.data.success) {
        setChapters(prev => prev.map(chapter => 
          chapter._id === selectedChapter._id ? { ...chapter, ...response.data.updatedChapter } : chapter
        ))
        setShowEditDialog(false)
        setSelectedChapter(null)
        setError('')
      }
    } catch (error) {
      console.error('Error updating chapter:', error)
      setError('Failed to update chapter')
    }
  }

  // Delete chapter
  const handleDeleteChapter = async () => {
    try {
      const token = getAuthToken()
      const response = await axios.delete(`${Config.backendUrl}chapter/${selectedChapter._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.data.success) {
        setChapters(prev => prev.filter(chapter => chapter._id !== selectedChapter._id))
        setShowDeleteDialog(false)
        setSelectedChapter(null)
        setError('')
      }
    } catch (error) {
      console.error('Error deleting chapter:', error)
      setError('Failed to delete chapter')
    }
  }

  // Filter and search chapters
  const filteredChapters = chapters.filter(chapter => {
    const matchesSearch = 
      chapter.Name.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  const handleEditClick = (chapter) => {
    setSelectedChapter(chapter)
    setShowEditDialog(true)
  }

  const handleDeleteClick = (chapter) => {
    setSelectedChapter(chapter)
    setShowDeleteDialog(true)
  }

  // Chapter form fields configuration
  const chapterFormFields = useMemo(() => [
    {
      name: 'Name',
      label: 'Chapter Name',
      type: 'text',
      required: true,
      placeholder: 'Enter chapter name',
      validation: (value) => {
        if (!value.trim()) return 'Chapter name is required'
        if (value.trim().length < 2) return 'Chapter name must be at least 2 characters'
        return true
      }
    },
    {
      name: 'Duration',
      label: 'Duration (minutes)',
      type: 'number',
      required: true,
      placeholder: 'Enter duration in minutes',
      validation: (value) => {
        if (!value) return 'Duration is required'
        if (isNaN(value) || value < 1) return 'Duration must be a positive number'
        return true
      }
    },
    {
      name: 'Priority',
      label: 'Priority',
      type: 'number',
      required: true,
      placeholder: 'Enter priority',
      validation: (value) => {
        if (!value) return 'Priority is required'
        if (isNaN(value) || value < 1) return 'Priority must be a positive number'
        return true
      }
    }
  ], [])

  // Edit form fields - same as create for chapter
  const editFormFields = useMemo(() => chapterFormFields, [chapterFormFields])

  return {
    // State
    chapters: filteredChapters,
    loading,
    searchTerm,
    setSearchTerm,
    showCreateDialog,
    setShowCreateDialog,
    showEditDialog,
    setShowEditDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    selectedChapter,
    setSelectedChapter,
    error,
    setError,
    subjectName,
    setSubjectName,
    competitionName,
    setCompetitionName,
    
    // Actions
    handleCreateChapter,
    handleUpdateChapter,
    handleDeleteChapter,
    handleEditClick,
    handleDeleteClick,
    
    // Form configurations
    chapterFormFields,
    editFormFields
  }
}

export default ChapterManagement
