import React from 'react'
import { X } from 'lucide-react'
import './Dialog.css'

const Dialog = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  showCloseButton = true 
}) => {
  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'dialog-small'
      case 'large': return 'dialog-large'
      case 'extra-large': return 'dialog-extra-large'
      default: return 'dialog-medium'
    }
  }

  return (
    <div className="dialog-backdrop" onClick={handleBackdropClick}>
      <div className={`dialog-container ${getSizeClass()}`}>
        <div className="dialog-header">
          <h2 className="dialog-title">{title}</h2>
          {showCloseButton && (
            <button className="dialog-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          )}
        </div>
        <div className="dialog-content">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Dialog
