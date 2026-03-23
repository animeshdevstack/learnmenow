import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Auth from '../../pages/admin/auth/Auth'
import Config from '../../config/config'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

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
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
  
    try {
      const { data } = await axios.post(`${Config.backendUrl}auth/login`, {
        email: formData.email,
        password: formData.password
      });
  
      console.log("✅ Login success:", data);
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify({
          id: data.user?.id || data.user?._id,
          email: data.user?.email,
          name: data.user?.name,
          role: data.user?.role || 'admin'
        }));
        // Navigate to admin dashboard after successful login
        navigate('/admin');
      }
  
    } catch (error) {
      console.error("❌ Login failed:", error);
      
      // Handle CORS errors specifically
      if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
        setErrors(prev => ({
          ...prev,
          api: "Server connection failed. Please check if the backend server is running on port 8080."
        }));
      } else if (error.response?.status === 401) {
        setErrors(prev => ({
          ...prev,
          api: "Invalid email or password. Please try again."
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          api: error.response?.data?.message || "Login failed. Please try again."
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Auth 
      formData={formData}
      errors={errors}
      isLoading={isLoading}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
    />
  )
}

export default Login
