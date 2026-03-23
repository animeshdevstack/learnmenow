import React, { useState, useEffect } from 'react'
import DashboardPage from '../../pages/admin/dashboard/Dashboard'
import {
  Users, BookOpen, Trophy, Target
} from 'lucide-react'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d')

  // Mock data for charts
  const examPerformanceData = [
    { name: 'Jan', students: 120, avgScore: 75, completions: 95 },
    { name: 'Feb', students: 150, avgScore: 78, completions: 120 },
    { name: 'Mar', students: 180, avgScore: 82, completions: 145 },
    { name: 'Apr', students: 200, avgScore: 79, completions: 160 },
    { name: 'May', students: 220, avgScore: 85, completions: 180 },
    { name: 'Jun', students: 250, avgScore: 88, completions: 210 },
  ]

  const subjectPerformanceData = [
    { name: 'Mathematics', students: 450, avgScore: 82, color: '#8884d8' },
    { name: 'Physics', students: 380, avgScore: 78, color: '#82ca9d' },
    { name: 'Chemistry', students: 320, avgScore: 75, color: '#ffc658' },
    { name: 'Biology', students: 290, avgScore: 80, color: '#ff7300' },
    { name: 'English', students: 410, avgScore: 85, color: '#00C49F' },
  ]

  const recentActivityData = [
    { id: 1, user: 'John Doe', action: 'Completed Math Exam', score: 85, time: '2 min ago' },
    { id: 2, user: 'Sarah Smith', action: 'Started Physics Quiz', score: null, time: '5 min ago' },
    { id: 3, user: 'Mike Johnson', action: 'Completed Chemistry Test', score: 92, time: '8 min ago' },
    { id: 4, user: 'Emily Brown', action: 'Joined Biology Course', score: null, time: '12 min ago' },
    { id: 5, user: 'David Wilson', action: 'Completed English Exam', score: 88, time: '15 min ago' },
  ]

  const statsCards = [
    {
      title: 'Total Students',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Exams',
      value: '24',
      change: '+3.2%',
      trend: 'up',
      icon: BookOpen,
      color: 'green'
    },
    {
      title: 'Avg. Score',
      value: '82.3%',
      change: '+5.1%',
      trend: 'up',
      icon: Trophy,
      color: 'purple'
    },
    {
      title: 'Completion Rate',
      value: '94.2%',
      change: '-1.8%',
      trend: 'down',
      icon: Target,
      color: 'orange'
    }
  ]

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleTimeRangeChange = (e) => {
    setSelectedTimeRange(e.target.value)
  }

  return (
    <DashboardPage 
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isLoading={isLoading}
      selectedTimeRange={selectedTimeRange}
      handleTimeRangeChange={handleTimeRangeChange}
      examPerformanceData={examPerformanceData}
      subjectPerformanceData={subjectPerformanceData}
      recentActivityData={recentActivityData}
      statsCards={statsCards}
    />
  )
}

export default Dashboard