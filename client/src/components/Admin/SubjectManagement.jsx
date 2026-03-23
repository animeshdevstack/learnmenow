import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import Config from '../../config/config'
import { getAuthToken } from '../../helper/auth.helper'

const SubjectManagement = (competitionId) => {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [error, setError] = useState('')
  const [competitionName, setCompetitionName] = useState('')

  // Fetch all subjects for the competition
  const fetchSubjects = async () => {
    try {
      setLoading(true)
      const token = getAuthToken()
      const response = await axios.get(`${Config.backendUrl}subject/filter/compition/${competitionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.data.success) {
        // Map the API response to include _id for consistency
        const subjectsWithId = response.data.allsubject.map(subject => ({
          ...subject,
          _id: subject.id
        }))
        setSubjects(subjectsWithId)
      }
    } catch (error) {
      console.error('Error fetching subjects:', error)
      setError('Failed to fetch subjects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (competitionId) {
      fetchSubjects()
    }
  }, [competitionId])

  // Create subject
  const handleCreateSubject = async (subjectData) => {
    try {
      const token = getAuthToken()
      const response = await axios.post(`${Config.backendUrl}subject`, {
        ...subjectData,
        competionId: competitionId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.data.success) {
        // Add the new subject with the ID from the response
        const newSubject = {
          ...response.data.subjectData,
          _id: response.data.subjectData.id || response.data.subjectData._id
        }
        setSubjects(prev => [...prev, newSubject])
        setShowCreateDialog(false)
        setError('')
      }
    } catch (error) {
      console.error('Error creating subject:', error)
      setError('Failed to create subject')
    }
  }

  // Update subject
  const handleUpdateSubject = async (subjectData) => {
    try {
      const token = getAuthToken()
      const response = await axios.put(`${Config.backendUrl}subject/${selectedSubject._id}`, subjectData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.data.success) {
        setSubjects(prev => prev.map(subject => 
          subject._id === selectedSubject._id ? { ...subject, ...response.data.updatedSubject } : subject
        ))
        setShowEditDialog(false)
        setSelectedSubject(null)
        setError('')
      }
    } catch (error) {
      console.error('Error updating subject:', error)
      setError('Failed to update subject')
    }
  }

  // Delete subject
  const handleDeleteSubject = async () => {
    try {
      const token = getAuthToken()
      const response = await axios.delete(`${Config.backendUrl}subject/${selectedSubject._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.data.success) {
        setSubjects(prev => prev.filter(subject => subject._id !== selectedSubject._id))
        setShowDeleteDialog(false)
        setSelectedSubject(null)
        setError('')
      }
    } catch (error) {
      console.error('Error deleting subject:', error)
      setError('Failed to delete subject')
    }
  }

  // Filter and search subjects
  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = 
      subject.Name.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  const handleEditClick = (subject) => {
    setSelectedSubject(subject)
    setShowEditDialog(true)
  }

  const handleDeleteClick = (subject) => {
    setSelectedSubject(subject)
    setShowDeleteDialog(true)
  }

  // Subject form fields configuration
  const subjectFormFields = useMemo(() => [
    {
      name: 'Name',
      label: 'Subject Name',
      type: 'text',
      required: true,
      placeholder: 'Enter subject name',
      validation: (value) => {
        if (!value.trim()) return 'Subject name is required'
        if (value.trim().length < 2) return 'Subject name must be at least 2 characters'
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

  // Edit form fields - same as create for subject
  const editFormFields = useMemo(() => subjectFormFields, [subjectFormFields])

  return {
    // State
    subjects: filteredSubjects,
    loading,
    searchTerm,
    setSearchTerm,
    showCreateDialog,
    setShowCreateDialog,
    showEditDialog,
    setShowEditDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    selectedSubject,
    setSelectedSubject,
    error,
    setError,
    competitionName,
    setCompetitionName,
    
    // Actions
    handleCreateSubject,
    handleUpdateSubject,
    handleDeleteSubject,
    handleEditClick,
    handleDeleteClick,
    
    // Form configurations
    subjectFormFields,
    editFormFields
  }
}

export default SubjectManagement
