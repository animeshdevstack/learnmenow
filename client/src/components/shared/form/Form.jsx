import React, { useState, useEffect, useMemo, useRef } from 'react'
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react'
import Button from '../button/Button'
import './Form.css'

const Form = ({ 
  data = {}, 
  onSubmit, 
  onCancel, 
  mode = 'create',
  fields = [],
  title = 'Form'
}) => {
  const [formData, setFormData] = useState(() => {
    // Initialize form data only once
    const initialData = {}
    fields.forEach(field => {
      initialData[field.name] = data[field.name] || ''
    })
    return initialData
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Use ref to store fields to prevent re-initialization
  const fieldsRef = useRef(fields)
  fieldsRef.current = fields

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    fieldsRef.current.forEach(field => {
      const fieldValue = formData[field.name]
      const trimmedValue = fieldValue ? String(fieldValue).trim() : ''
      
      if (field.required && !trimmedValue) {
        newErrors[field.name] = `${field.label} is required`
      } else if (field.validation && trimmedValue) {
        const validationResult = field.validation(trimmedValue)
        if (validationResult !== true) {
          newErrors[field.name] = validationResult
        }
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Prepare data for submission
      const submitData = {}
      fieldsRef.current.forEach(field => {
        const fieldValue = formData[field.name]
        if (fieldValue !== undefined && fieldValue !== null) {
          submitData[field.name] = String(fieldValue).trim()
        }
      })
      
      await onSubmit(submitData)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const getFieldIcon = (type) => {
    switch (type) {
      case 'email': return <Mail size={16} />
      case 'phone': return <Phone size={16} />
      case 'password': return <Lock size={16} />
      default: return <User size={16} />
    }
  }

  return (
    <form onSubmit={handleSubmit} className="reusable-form">
      <div className="form-fields">
        {fieldsRef.current.map((field) => (
          <div key={field.name} className={`form-group ${field.fullWidth ? 'full-width' : ''}`}>
            <label htmlFor={field.name} className="form-label">
              {getFieldIcon(field.type)}
              {field.label} {field.required && '*'}
            </label>
            
            {field.type === 'password' ? (
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleInputChange}
                  className={`form-input password-input ${errors[field.name] ? 'error' : ''}`}
                  placeholder={field.placeholder}
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            ) : (
              <input
                type={field.type || 'text'}
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleInputChange}
                className={`form-input ${errors[field.name] ? 'error' : ''}`}
                placeholder={field.placeholder}
                autoComplete="off"
              />
            )}
            
            {errors[field.name] && (
              <span className="error-message">{errors[field.name]}</span>
            )}
          </div>
        ))}
      </div>

      <div className="form-actions">
        <Button
          type="button"
          variant="secondary"
          size="medium"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="medium"
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          {mode === 'create' ? 'Create' : 'Update'}
        </Button>
      </div>
    </form>
  )
}

export default Form
