import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import Config from '../../config/config'
import { getAuthToken } from '../../helper/auth.helper'

const TopicManagement = (chapterId, subjectId, competitionId) => {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [error, setError] = useState('')
  const [chapterName, setChapterName] = useState('')
  const [subjectName, setSubjectName] = useState('')
  const [competitionName, setCompetitionName] = useState('')

  // Fetch all topics for the chapter
  const fetchTopics = async () => {
    try {
      setLoading(true)
      const token = getAuthToken()
      const response = await axios.get(`${Config.backendUrl}topic/filter/chapter/${chapterId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.data.success) {
        // Map the API response to include _id for consistency
        const topicsWithId = response.data.allTopic.map(topic => ({
          ...topic,
          _id: topic.id
        }))
        setTopics(topicsWithId)
      }
    } catch (error) {
      console.error('Error fetching topics:', error)
      setError('Failed to fetch topics')
    } finally {
      setLoading(false)
    }
  }

  // Fetch chapter name for breadcrumb
  const fetchChapterName = async () => {
    try {
      const token = getAuthToken()
      const response = await axios.get(`${Config.backendUrl}chapter/${chapterId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.data.success) {
        setChapterName(response.data.getChapter?.Name || 'Chapter')
      }
    } catch (error) {
      console.error('Error fetching chapter name:', error)
      setChapterName('Chapter')
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
    if (chapterId) {
      fetchTopics()
      fetchChapterName()
    }
    if (subjectId) {
      fetchSubjectName()
    }
    if (competitionId) {
      fetchCompetitionName()
    }
  }, [chapterId, subjectId, competitionId])

  // Create topic
  const handleCreateTopic = async (topicData) => {
    try {
      const token = getAuthToken()
      const response = await axios.post(`${Config.backendUrl}topic`, {
        ...topicData,
        chapterId: chapterId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.data.success) {
        // Add the new topic with the ID from the response
        const newTopic = {
          ...response.data.topicData,
          _id: response.data.topicData.id || response.data.topicData._id
        }
        setTopics(prev => [...prev, newTopic])
        setShowCreateDialog(false)
        setError('')
      }
    } catch (error) {
      console.error('Error creating topic:', error)
      setError('Failed to create topic')
    }
  }

  // Update topic
  const handleUpdateTopic = async (topicData) => {
    try {
      const token = getAuthToken()
      const response = await axios.put(`${Config.backendUrl}topic/${selectedTopic._id}`, topicData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.data.success) {
        setTopics(prev => prev.map(topic => 
          topic._id === selectedTopic._id ? { ...topic, ...response.data.updatedTopic } : topic
        ))
        setShowEditDialog(false)
        setSelectedTopic(null)
        setError('')
      }
    } catch (error) {
      console.error('Error updating topic:', error)
      setError('Failed to update topic')
    }
  }

  // Delete topic
  const handleDeleteTopic = async () => {
    try {
      const token = getAuthToken()
      const response = await axios.delete(`${Config.backendUrl}topic/${selectedTopic._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.data.success) {
        setTopics(prev => prev.filter(topic => topic._id !== selectedTopic._id))
        setShowDeleteDialog(false)
        setSelectedTopic(null)
        setError('')
      }
    } catch (error) {
      console.error('Error deleting topic:', error)
      setError('Failed to delete topic')
    }
  }

  // Filter and search topics
  const filteredTopics = topics.filter(topic => {
    const matchesSearch = 
      topic.Name.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  const handleEditClick = (topic) => {
    setSelectedTopic(topic)
    setShowEditDialog(true)
  }

  const handleDeleteClick = (topic) => {
    setSelectedTopic(topic)
    setShowDeleteDialog(true)
  }

  // Topic form fields configuration
  const topicFormFields = useMemo(() => [
    {
      name: 'Name',
      label: 'Topic Name',
      type: 'text',
      required: true,
      placeholder: 'Enter topic name',
      validation: (value) => {
        if (!value.trim()) return 'Topic name is required'
        if (value.trim().length < 2) return 'Topic name must be at least 2 characters'
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

  // Edit form fields - same as create for topic
  const editFormFields = useMemo(() => topicFormFields, [topicFormFields])

  return {
    // State
    topics: filteredTopics,
    loading,
    searchTerm,
    setSearchTerm,
    showCreateDialog,
    setShowCreateDialog,
    showEditDialog,
    setShowEditDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    selectedTopic,
    setSelectedTopic,
    error,
    setError,
    chapterName,
    setChapterName,
    subjectName,
    setSubjectName,
    competitionName,
    setCompetitionName,
    
    // Actions
    handleCreateTopic,
    handleUpdateTopic,
    handleDeleteTopic,
    handleEditClick,
    handleDeleteClick,
    
    // Form configurations
    topicFormFields,
    editFormFields
  }
}

export default TopicManagement
