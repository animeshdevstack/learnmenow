import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Home, 
  ArrowLeft, 
  LogIn,
  AlertCircle
} from 'lucide-react'
import './NotFound.css'

const NotFound = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleGoHome = () => {
    navigate('/')
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleGoToAuth = () => {
    navigate('/auth')
  }

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        {/* 404 Icon and Title */}
        <div className="error-section">
          <div className="error-icon">
            <AlertCircle size={120} />
          </div>
          <h1 className="error-title">404</h1>
          <h2 className="error-subtitle">Page Not Found</h2>
          <p className="error-description">
            The page <code className="error-url">{location.pathname}</code> could not be found.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="action-section">
          <button 
            className="action-btn primary"
            onClick={handleGoHome}
          >
            <Home size={18} />
            Go Home
          </button>
          
          <button 
            className="action-btn secondary"
            onClick={handleGoBack}
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          
          <button 
            className="action-btn tertiary"
            onClick={handleGoToAuth}
          >
            <LogIn size={18} />
            Login
          </button>
        </div>

        {/* Footer */}
        <div className="footer">
          <p>&copy; 2024 LearnMeNow. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default NotFound