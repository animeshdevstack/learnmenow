import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import Config from '../../config/config'
import { getAuthToken } from '../../helper/auth.helper'

const CompetitionManagement = () => {
  const [competitions, setCompetitions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCompetition, setSelectedCompetition] = useState(null)
  const [error, setError] = useState('')

  // Fetch all competitions
  const fetchCompetitions = async () => {
    try {
      setLoading(true)
      const token = getAuthToken()
      const response = await axios.get(`${Config.backendUrl}competition`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.data.success) {
        // The API returns 'id' field, map it to '_id' for consistency
        const competitionsWithId = response.data.allCompetion.map(competition => ({
          ...competition,
          _id: competition.id
        }))
        console.log('Mapped competitions with IDs:', competitionsWithId)
        setCompetitions(competitionsWithId)
      }
    } catch (error) {
      console.error('Error fetching competitions:', error)
      setError('Failed to fetch competitions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompetitions()
  }, [])

  // Create competition
  const handleCreateCompetition = async (competitionData) => {
    try {
      const token = getAuthToken()
      const response = await axios.post(`${Config.backendUrl}competition/`, competitionData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.data.success) {
        // Add the new competition with the ID from the response
        const newCompetition = {
          ...response.data.compititonName,
          _id: response.data.compititonName.id || response.data.compititonName._id
        }
        setCompetitions(prev => [...prev, newCompetition])
        setShowCreateDialog(false)
        setError('')
      }
    } catch (error) {
      console.error('Error creating competition:', error)
      setError('Failed to create competition')
    }
  }

  // Update competition
  const handleUpdateCompetition = async (competitionData) => {
    try {
      const token = getAuthToken()
      const response = await axios.put(`${Config.backendUrl}competition/${selectedCompetition._id}`, competitionData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.data.success) {
        setCompetitions(prev => prev.map(competition => 
          competition._id === selectedCompetition._id ? response.data.updatedCompition : competition
        ))
        setShowEditDialog(false)
        setSelectedCompetition(null)
        setError('')
      }
    } catch (error) {
      console.error('Error updating competition:', error)
      setError('Failed to update competition')
    }
  }

  // Delete competition
  const handleDeleteCompetition = async () => {
    try {
      const token = getAuthToken()
      const response = await axios.delete(`${Config.backendUrl}competition/${selectedCompetition._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.data.success) {
        setCompetitions(prev => prev.filter(competition => competition._id !== selectedCompetition._id))
        setShowDeleteDialog(false)
        setSelectedCompetition(null)
        setError('')
      }
    } catch (error) {
      console.error('Error deleting competition:', error)
      setError('Failed to delete competition')
    }
  }

  // Filter and search competitions
  const filteredCompetitions = competitions.filter(competition => {
    const matchesSearch = 
      competition.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (competition.Desciption && competition.Desciption.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesSearch
  })

  const handleEditClick = (competition) => {
    setSelectedCompetition(competition)
    setShowEditDialog(true)
  }

  const handleDeleteClick = (competition) => {
    setSelectedCompetition(competition)
    setShowDeleteDialog(true)
  }

  // Competition form fields configuration - memoized to prevent infinite re-renders
  const competitionFormFields = useMemo(() => [
    {
      name: 'Name',
      label: 'Competition Name',
      type: 'text',
      required: true,
      placeholder: 'Enter competition name',
      validation: (value) => {
        if (!value.trim()) return 'Competition name is required'
        if (value.trim().length < 2) return 'Competition name must be at least 2 characters'
        return true
      }
    },
    {
      name: 'Desciption',
      label: 'Description',
      type: 'textarea',
      required: false,
      placeholder: 'Enter competition description',
      validation: (value) => {
        return true
      }
    }
  ], []) // Empty dependency array since these fields are static

  // Edit form fields - same as create for competition
  const editFormFields = useMemo(() => competitionFormFields, [competitionFormFields])

  return {
    // State
    competitions: filteredCompetitions,
    loading,
    searchTerm,
    setSearchTerm,
    showCreateDialog,
    setShowCreateDialog,
    showEditDialog,
    setShowEditDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    selectedCompetition,
    setSelectedCompetition,
    error,
    setError,
    
    // Actions
    handleCreateCompetition,
    handleUpdateCompetition,
    handleDeleteCompetition,
    handleEditClick,
    handleDeleteClick,
    
    // Form configurations
    competitionFormFields,
    editFormFields
  }
}

export default CompetitionManagement
