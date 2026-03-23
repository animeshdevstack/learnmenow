import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import Config from '../../config/config'
import { getAuthToken } from '../../helper/auth.helper'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [error, setError] = useState('')

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = getAuthToken()
      const response = await axios.get(`${Config.backendUrl}user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.data.success) {
        setUsers(response.data.getAllUser)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Create user
  const handleCreateUser = async (userData) => {
    try {
      const token = getAuthToken()
      const response = await axios.post(`${Config.backendUrl}user`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.data.success) {
        setUsers(prev => [...prev, response.data.savedUser])
        setShowCreateDialog(false)
        setError('')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      setError('Failed to create user')
    }
  }

  // Update user
  const handleUpdateUser = async (userData) => {
    try {
      const token = getAuthToken()
      const response = await axios.put(`${Config.backendUrl}user/${selectedUser._id}`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.data.success) {
        setUsers(prev => prev.map(user => 
          user._id === selectedUser._id ? response.data.updatedUser : user
        ))
        setShowEditDialog(false)
        setSelectedUser(null)
        setError('')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      setError('Failed to update user')
    }
  }

  // Delete user
  const handleDeleteUser = async () => {
    try {
      const token = getAuthToken()
      const response = await axios.delete(`${Config.backendUrl}user/${selectedUser._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain'
        }
      })
      
      if (response.data.success) {
        setUsers(prev => prev.filter(user => user._id !== selectedUser._id))
        setShowDeleteDialog(false)
        setSelectedUser(null)
        setError('')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      setError('Failed to delete user')
    }
  }

  // Filter and search users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.FName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.LName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Phone.toString().includes(searchTerm)
    
    const matchesRole = filterRole === 'all' || user.Role.toLowerCase() === filterRole.toLowerCase()
    
    return matchesSearch && matchesRole
  })

  const handleEditClick = (user) => {
    setSelectedUser(user)
    setShowEditDialog(true)
  }

  const handleDeleteClick = (user) => {
    setSelectedUser(user)
    setShowDeleteDialog(true)
  }

  const getRoleBadgeClass = (role) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'role-badge admin'
      case 'user':
        return 'role-badge user'
      default:
        return 'role-badge default'
    }
  }

  // User form fields configuration - memoized to prevent infinite re-renders
  const userFormFields = useMemo(() => [
    {
      name: 'FName',
      label: 'First Name',
      type: 'text',
      required: true,
      placeholder: 'Enter first name',
      validation: (value) => {
        if (!value.trim()) return 'First name is required'
        return true
      }
    },
    {
      name: 'LName',
      label: 'Last Name',
      type: 'text',
      required: true,
      placeholder: 'Enter last name',
      validation: (value) => {
        if (!value.trim()) return 'Last name is required'
        return true
      }
    },
    {
      name: 'Email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter email address',
      validation: (value) => {
        if (!value.trim()) return 'Email is required'
        if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email'
        return true
      }
    },
    {
      name: 'Phone',
      label: 'Phone Number',
      type: 'phone',
      required: true,
      placeholder: 'Enter phone number',
      validation: (value) => {
        if (!value.trim()) return 'Phone number is required'
        if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) return 'Please enter a valid 10-digit phone number'
        return true
      }
    },
    {
      name: 'Password',
      label: 'Password',
      type: 'password',
      required: true,
      placeholder: 'Enter password',
      validation: (value) => {
        if (!value.trim()) return 'Password is required'
        if (value.length < 6) return 'Password must be at least 6 characters'
        return true
      }
    }
  ], []) // Empty dependency array since these fields are static

  // Edit form fields (without password) - also memoized
  const editFormFields = useMemo(() => 
    userFormFields.filter(field => field.name !== 'Password'), 
    [userFormFields]
  )

  return {
    // State
    users: filteredUsers,
    loading,
    searchTerm,
    setSearchTerm,
    filterRole,
    setFilterRole,
    showCreateDialog,
    setShowCreateDialog,
    showEditDialog,
    setShowEditDialog,
    showDeleteDialog,
    setShowDeleteDialog,
    selectedUser,
    setSelectedUser,
    error,
    setError,
    
    // Actions
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleEditClick,
    handleDeleteClick,
    getRoleBadgeClass,
    
    // Form configurations
    userFormFields,
    editFormFields
  }
}

export default UserManagement