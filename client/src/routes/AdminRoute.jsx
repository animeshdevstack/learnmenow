import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminProtectedRoute from './AdminProtectedRoute'
import Dashboard from '../components/Admin/dashboard'
import UserManagement from '../pages/admin/user-management/UserManagement'
import CompetitionManagement from '../pages/admin/competition-management/CompetitionManagement'
import SubjectManagement from '../pages/admin/subject-management/SubjectManagement'
import ChapterManagement from '../pages/admin/chapter-management/ChapterManagement'
import TopicManagement from '../pages/admin/topic-management/TopicManagement'
import NotFound from '../pages/NotFound'
import MainNavbar from '../navbar/admin/main-navbar/MainNavbar'
import SideNavbar from '../navbar/admin/side-navbar/SideNavbar'
import './AdminLayout.css'

const AdminRouting = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeModule, setActiveModule] = useState('home')

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <AdminProtectedRoute>
      <div className="admin-layout">
        <MainNavbar 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen} 
        />
        <SideNavbar 
          isOpen={isSidebarOpen}
          activeModule={activeModule}
          setActiveModule={setActiveModule}
        />
            <main className={`admin-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/competition" element={<CompetitionManagement />} />
                <Route path="/competition/:competitionId/subjects" element={<SubjectManagement />} />
                <Route path="/competition/:competitionId/subjects/:subjectId/chapters" element={<ChapterManagement />} />
                <Route path="/competition/:competitionId/subjects/:subjectId/chapters/:chapterId/topics" element={<TopicManagement />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
      </div>
    </AdminProtectedRoute>
  )
}

export default AdminRouting