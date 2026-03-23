import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Home, 
  Users, 
  Trophy,
  ChevronRight,
  ChevronDown,
  LogOut
} from 'lucide-react'
import './SideNavbar.css'

const SideNavbar = ({ isOpen, activeModule, setActiveModule }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    localStorage.clear() // Clear all localStorage data
    // Navigate to login page
    navigate('/auth', { replace: true })
  }
  const modules = [
    {
      id: 'home',
      name: 'Home',
      icon: Home,
      path: '/admin'
    },
    {
      id: 'user',
      name: 'User Management',
      icon: Users,
      path: '/admin/users'
    },
    {
      id: 'competition',
      name: 'Competition',
      icon: Trophy,
      path: '/admin/competition'
    }
  ]

  return (
    <aside className={`side-navbar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Trophy size={24} />
          </div>
          <span className="logo-text">LearnMeNow</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          {/* <h3 className="nav-section-title">Main Modules</h3> */}
          <ul className="nav-list">
            {modules.map((module) => {
              const IconComponent = module.icon
              const isActive = activeModule === module.id
              
              return (
                <li key={module.id} className="nav-item">
                  <button
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveModule(module.id)
                      navigate(module.path)
                    }}
                  >
                    <div className="nav-link-content">
                      <IconComponent size={20} className="nav-icon" />
                      <span className="nav-text">{module.name}</span>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

      </nav>

      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          <div className="logout-content">
            <LogOut size={20} className="logout-icon" />
            <span className="logout-text">Logout</span>
          </div>
        </button>
      </div>
    </aside>
  )
}

export default SideNavbar
