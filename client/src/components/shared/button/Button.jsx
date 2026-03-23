import React from 'react'
import './Button.css'

const Button = ({ 
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  icon,
  loading = false,
  ...props
}) => {
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="btn-spinner">
          <div className="spinner"></div>
        </div>
      )}
      {icon && !loading && (
        <span className="btn-icon">{icon}</span>
      )}
      {children && (
        <span className="btn-text">{children}</span>
      )}
    </button>
  )
}

export default Button
