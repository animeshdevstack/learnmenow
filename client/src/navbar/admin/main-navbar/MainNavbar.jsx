import React from 'react'
import { 
  Bell, 
  User, 
  LogOut, 
  Search, 
  Settings,
  Menu
} from 'lucide-react'
import { logout } from '../../../helper/auth.helper'
import './MainNavbar.css'

const MainNavbar = ({ toggleSidebar, isSidebarOpen }) => {
  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="main-navbar">
      <div className="navbar-left">
        <button 
          className="menu-toggle-btn"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </button>
        <div className="navbar-brand">
          <h2>Admin Dashboard</h2>
        </div>
      </div>

      <div className="navbar-right">
        <button className="navbar-btn notification-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
        
        <button className="navbar-btn settings-btn">
          <Settings size={20} />
        </button>
        
        <div className="user-menu">
          <button className="navbar-btn user-btn">
            <User size={20} />
          </button>
          <div className="user-dropdown">
            <div className="user-info">
              <div className="user-avatar">
                <User size={16} />
              </div>
              <div className="user-details">
                <span className="user-name">Admin User</span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default MainNavbar
