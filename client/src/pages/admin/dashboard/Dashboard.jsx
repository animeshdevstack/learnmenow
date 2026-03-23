import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Users, BookOpen, Trophy, TrendingUp, TrendingDown, Activity,
  Calendar, Clock, Target, Award, BarChart3, PieChart as PieChartIcon,
  Eye, Download, Filter, Plus, Settings, Bell, User, LogOut
} from 'lucide-react';
import SearchBox from '../../../components/shared/search/SearchBox';
import Button from '../../../components/shared/button/Button';
import './Dashboard.css';

const DashboardPage = ({ 
  activeTab,
  setActiveTab,
  isLoading,
  selectedTimeRange,
  handleTimeRangeChange,
  examPerformanceData,
  subjectPerformanceData,
  recentActivityData,
  statsCards
}) => {

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Loading Dashboard...
        </motion.h2>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <motion.header 
        className="dashboard-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-left">
          <h1>Admin Dashboard</h1>
          <p>Welcome back! Here's what's happening with your competition platform.</p>
        </div>
        <div className="header-right">
          <SearchBox
            placeholder="Search..."
            width="200px"
          />
          <motion.button 
            className="notification-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </motion.button>
          <motion.button 
            className="profile-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User size={20} />
          </motion.button>
          {/* <Link to="/admin/auth">
            <motion.button 
              className="logout-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={20} />
            </motion.button>
          </Link> */}
        </div>
      </motion.header>

      {/* Stats Cards */}
      <motion.div 
        className="stats-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {statsCards.map((card, index) => {
          const IconComponent = card.icon || Users; // Default icon if not provided
          return (
            <motion.div
              key={card.title}
              className={`stat-card stat-card-${card.color}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}
            >
              <div className="stat-icon">
                <IconComponent size={24} />
              </div>
            <div className="stat-content">
              <h3>{card.title}</h3>
              <div className="stat-value">{card.value}</div>
              <div className={`stat-change ${card.trend}`}>
                {card.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {card.change}
              </div>
            </div>
          </motion.div>
          );
        })}
      </motion.div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Charts Section */}
        <motion.div 
          className="charts-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="section-header">
            <h2>Performance Analytics</h2>
            <div className="time-range-selector">
              <select 
                value={selectedTimeRange} 
                onChange={handleTimeRangeChange}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>

          <div className="charts-grid">
            {/* Performance Trend Chart */}
            <motion.div 
              className="chart-card"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="chart-header">
                <h3>Performance Trend</h3>
                <BarChart3 size={20} />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={examPerformanceData}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="students" 
                    stroke="#8884d8" 
                    fillOpacity={1} 
                    fill="url(#colorStudents)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="avgScore" 
                    stroke="#82ca9d" 
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Subject Performance Chart */}
            <motion.div 
              className="chart-card"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="chart-header">
                <h3>Subject Performance</h3>
                <PieChartIcon size={20} />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={subjectPerformanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="students"
                  >
                    {subjectPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Score Distribution Chart */}
            <motion.div 
              className="chart-card"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="chart-header">
                <h3>Score Distribution</h3>
                <Activity size={20} />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgScore" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Recent Activity */}
            <motion.div 
              className="activity-card"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="chart-header">
                <h3>Recent Activity</h3>
                <Clock size={20} />
              </div>
              <div className="activity-list">
                {recentActivityData.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    className="activity-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="activity-avatar">
                      <User size={16} />
                    </div>
                    <div className="activity-content">
                      <div className="activity-user">{activity.user}</div>
                      <div className="activity-action">{activity.action}</div>
                      <div className="activity-time">{activity.time}</div>
                    </div>
                    {activity.score && (
                      <div className="activity-score">
                        {activity.score}%
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="quick-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Button 
              variant="primary"
              size="large"
              icon={<Plus size={24} />}
            >
              Create New Exam
            </Button>
            <Button 
              variant="secondary"
              size="large"
              icon={<Users size={24} />}
            >
              Manage Students
            </Button>
            <Button 
              variant="success"
              size="large"
              icon={<BookOpen size={24} />}
            >
              Add Questions
            </Button>
            <Button 
              variant="warning"
              size="large"
              icon={<Download size={24} />}
            >
              Export Reports
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
