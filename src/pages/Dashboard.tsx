import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Map,
  MessageSquare,
  Search,
  Download,
  Filter,
  Globe,
  Waves,
  Activity,
  Thermometer,
  Droplets,
  Menu,
  Brain,
  TrendingUp,
  Bell,
  Target,
  GraduationCap,
  Building,
  AlertCircle,
  Database,
  Briefcase
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Import new modular components
import {
  DataHandling,
  VisualizationHub, 
  SearchFilters,
  AIChat,
  OceanMap,
  AIInsights,
  BusinessApplications,
  DisasterWarning,
  EducationHub,
  BlueEconomy,
  PolicyTools,
  ResearchTools
} from '../features'

// import MetricsPanel from '../components/MetricsPanel'

type ViewType =
  | 'overview'
  | 'data_handling'
  | 'visualization'
  | 'search_filters'
  | 'ai_insights'
  | 'business_apps'
  | 'education_hub'
  | 'alerts'
  | 'disaster_early_warning'
  | 'blue_economy'
  | 'policy_citizen_tools'
  | 'research_tools'
  | 'chat'
  | 'map'

const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()

  const sidebarItems = [
    
    // Core Functionality Categories
    { id: 'data_handling', label: 'Data Handling', icon: <Database className="w-5 h-5" />, color: 'text-blue-500', category: 'core' },
    { id: 'visualization', label: 'Visualization Hub', icon: <Activity className="w-5 h-5" />, color: 'text-green-500', category: 'core' },
    { id: 'search_filters', label: 'Search & Filters', icon: <Search className="w-5 h-5" />, color: 'text-yellow-500', category: 'core' },
    { id: 'chat', label: 'AI Chat', icon: <MessageSquare className="w-5 h-5" />, color: 'text-emerald-400', category: 'core' },
    { id: 'map', label: 'Ocean Map', icon: <Map className="w-5 h-5" />, color: 'text-blue-400', category: 'core' },
    
    // Advanced Features
    { id: 'ai_insights', label: 'AI & ML Insights', icon: <Brain className="w-5 h-5" />, color: 'text-pink-500', category: 'advanced' },
    { id: 'business_apps', label: 'Business Applications', icon: <Briefcase className="w-5 h-5" />, color: 'text-orange-500', category: 'advanced' },
    { id: 'disaster_early_warning', label: 'Disaster & Early Warning', icon: <AlertCircle className="w-5 h-5" />, color: 'text-red-500', category: 'advanced' },
    
    // Engagement & Outreach (currently none)
    
    // India Focus
    { id: 'education_hub', label: 'Education Hub', icon: <GraduationCap className="w-5 h-5" />, color: 'text-teal-500', category: 'india' },
    { id: 'blue_economy', label: "India's Blue Economy", icon: <TrendingUp className="w-5 h-5" />, color: 'text-emerald-500', category: 'india' },
    { id: 'policy_citizen_tools', label: 'Citizen & Policy Tools', icon: <Building className="w-5 h-5" />, color: 'text-sky-500', category: 'india' },
    { id: 'research_tools', label: 'Researcher Super Tools', icon: <Target className="w-5 h-5" />, color: 'text-purple-400', category: 'india' },
    
    // Quick Access
    
  ]

  const oceanMetrics = [
    { label: 'Active Floats', value: '3,847', trend: '+12%', icon: <Waves className="w-6 h-6" />, color: 'ocean' },
    { label: 'Temperature Range', value: '2°C - 28°C', trend: 'Normal', icon: <Thermometer className="w-6 h-6" />, color: 'coral' },
    { label: 'Salinity Range', value: '33.5 - 37.2 PSU', trend: 'Stable', icon: <Droplets className="w-6 h-6" />, color: 'blue' },
    { label: 'Data Points', value: '2.4M', trend: '+8.5%', icon: <Activity className="w-6 h-6" />, color: 'green' }
  ]

  const recentQueries = [
    "Show salinity profiles near the equator in March 2023",
    "Compare BGC parameters in the Arabian Sea",
    "Find nearest ARGO floats to latitude 25°N, longitude 65°E",
    "Temperature trends in the North Atlantic over last 6 months"
  ]

  const Sidebar = () => (
    <motion.div
      className={`fixed left-0 top-0 h-full z-40 backdrop-blur-lg border-r border-gray-900/80 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-16'
      } flex flex-col overflow-hidden rounded-r-2xl shadow-2xl`}
      style={{ 
        background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,1) 100%)',
        boxShadow: '0 0 50px rgba(0,0,0,0.8)'
      }}
      initial={{ x: -100 }}
      animate={{ x: 0 }}
    >
      {/* Logo */}
      <div className="p-4 border-b border-gray-900/60">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-3 group"
          aria-label="Go to Home"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-cyan-500/40">
            <Waves className="w-6 h-6 text-white" />
          </div>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col text-left"
            >
              <span className="text-xl font-bold text-white group-hover:text-cyan-100">FloatChat</span>
              <span className="text-xs text-gray-400 group-hover:text-white">Ocean Intelligence</span>
            </motion.div>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`mt-3 flex-1 pr-0 ${!sidebarOpen ? 'space-y-3' : ''}`}>
        {/* Core Categories */}
        {sidebarOpen && (
          <div className="px-3 mb-2">
            <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wide">Core Features</span>
          </div>
        )}
        {sidebarItems.filter(item => item.category === 'core').map((item) => (
          <motion.button
            key={item.id}
            className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-cyan-600/40 hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 ${
              currentView === item.id ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30' : 'hover:border-gray-700/50'
            }`}
            onClick={() => setCurrentView(item.id as ViewType)}
            whileHover={{ x: 8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              boxShadow: currentView === item.id ? '0 4px 20px rgba(6, 182, 212, 0.3)' : '0 2px 10px rgba(0,0,0,0.3)'
            }}
          >
            <span className={`${item.color} group-hover:scale-110 transition-transform duration-200`}>
              {item.icon}
            </span>
            {sidebarOpen && (
              <motion.span
                className={`ml-4 text-gray-300 group-hover:text-white text-[14px] font-medium ${currentView === item.id ? 'text-white' : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {item.label}
              </motion.span>
            )}
          </motion.button>
        ))}
        
        {/* Advanced Features */}
        {sidebarOpen && (
          <div className="px-3 mb-2 mt-3">
            <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wide">Advanced</span>
          </div>
        )}
        {sidebarItems.filter(item => item.category === 'advanced').map((item) => (
          <motion.button
            key={item.id}
            className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-cyan-600/40 hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 ${
              currentView === item.id ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30' : 'hover:border-gray-700/50'
            }`}
            onClick={() => setCurrentView(item.id as ViewType)}
            whileHover={{ x: 8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              boxShadow: currentView === item.id ? '0 4px 20px rgba(6, 182, 212, 0.3)' : '0 2px 10px rgba(0,0,0,0.3)'
            }}
          >
            <span className={`${item.color} group-hover:scale-110 transition-transform duration-200`}>
              {item.icon}
            </span>
            {sidebarOpen && (
              <motion.span
                className={`ml-4 text-gray-300 group-hover:text-white text-[14px] font-medium ${currentView === item.id ? 'text-white' : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {item.label}
              </motion.span>
            )}
          </motion.button>
        ))}
        
        {/* India Focus */}
        {sidebarOpen && (
          <div className="px-3 mb-2 mt-3">
            <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wide">India Focus</span>
          </div>
        )}
        {sidebarItems.filter(item => item.category === 'india').map((item) => (
          <motion.button
            key={item.id}
            className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-cyan-600/40 hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 ${
              currentView === item.id ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30' : 'hover:border-gray-700/50'
            }`}
            onClick={() => setCurrentView(item.id as ViewType)}
            whileHover={{ x: 8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              boxShadow: currentView === item.id ? '0 4px 20px rgba(6, 182, 212, 0.3)' : '0 2px 10px rgba(0,0,0,0.3)'
            }}
          >
            <span className={`${item.color} group-hover:scale-110 transition-transform duration-200`}>
              {item.icon}
            </span>
            {sidebarOpen && (
              <motion.span
                className={`ml-4 text-gray-300 group-hover:text-white text-[14px] font-medium ${currentView === item.id ? 'text-white' : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {item.label}
              </motion.span>
            )}
          </motion.button>
        ))}
        
        
        {sidebarItems.filter(item => item.category === 'engagement').map((item) => (
          <motion.button
            key={item.id}
            className={`w-full flex items-center px-3 py-2 text-left hover:bg-ocean-800/30 transition-colors group ${
              currentView === item.id ? 'bg-ocean-700/30 border-r-2 border-ocean-400' : ''
            }`}
            onClick={() => setCurrentView(item.id as ViewType)}
            whileHover={{ x: 5 }}
          >
            <span className={`${item.color} group-hover:scale-110 transition-transform`}>
              {item.icon}
            </span>
            {sidebarOpen && (
              <motion.span
                className="ml-3 text-ocean-100 group-hover:text-white text-[13px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {item.label}
              </motion.span>
            )}
          </motion.button>
        ))}
        
        
        {sidebarItems.filter(item => item.category === 'quick').map((item) => (
          <motion.button
            key={item.id}
            className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-ocean-600/40 hover:bg-white/5 ${
              currentView === item.id ? 'bg-white/10' : ''
            }`}
            onClick={() => setCurrentView(item.id as ViewType)}
            whileHover={{ x: 5 }}
          >
            <span className={`${item.color} group-hover:scale-110 transition-transform`}>
              {item.icon}
            </span>
            {sidebarOpen && (
              <motion.span
                className={`ml-3 text-ocean-100 group-hover:text-white text-[13px] ${currentView === item.id ? 'text-white' : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {item.label}
              </motion.span>
            )}
          </motion.button>
        ))}
        
        
      </nav>

      
    </motion.div>
  )

  const TopBar = () => (
    <motion.div
      className="fixed top-0 right-0 left-0 h-16 backdrop-blur-lg border-b border-gray-900/80 z-30"
      style={{ 
        marginLeft: sidebarOpen ? '16rem' : '4rem',
        background: 'linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,1) 100%)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.8)'
      }}
      initial={{ y: -50 }}
      animate={{ y: 0 }}
    >
      <div className="flex items-center justify-between px-6 h-full">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-white capitalize">
            {currentView.replace('_', ' ')}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentView('overview')}
            className="text-gray-400 hover:text-white transition-all duration-300 text-sm px-4 py-2.5 rounded-xl border border-gray-800/60 hover:bg-gradient-to-r hover:from-gray-800/30 hover:to-gray-700/30 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20"
          >
            Overview
          </button>
          <div className="relative">
            <Search className="w-5 h-5 text-cyan-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ocean data..."
              className="bg-gray-900/80 text-white pl-10 pr-4 py-2.5 rounded-xl border border-gray-800/60 focus:border-cyan-500 focus:outline-none w-64 backdrop-blur-sm transition-all duration-300 focus:shadow-lg focus:shadow-cyan-500/20"
            />
          </div>
          <button className="text-gray-400 hover:text-white transition-all duration-300 p-2.5 rounded-xl hover:bg-gradient-to-r hover:from-gray-800/30 hover:to-gray-700/30 hover:shadow-lg">
            <Filter className="w-5 h-5" />
          </button>
          <button className="text-gray-400 hover:text-white transition-all duration-300 p-2.5 rounded-xl hover:bg-gradient-to-r hover:from-gray-800/30 hover:to-gray-700/30 hover:shadow-lg">
            <Download className="w-5 h-5" />
          </button>
          <button
            className="text-gray-400 hover:text-white transition-all duration-300 p-2.5 rounded-xl hover:bg-gradient-to-r hover:from-gray-800/30 hover:to-gray-700/30 hover:shadow-lg relative"
            onClick={() => setCurrentView('alerts')}
            aria-label="Open alerts"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  )

  const OverviewView = () => (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {oceanMetrics.map((metric, index) => (
          <motion.div
            key={index}
            className="p-6 rounded-2xl border-2 shadow-2xl cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${metric.color === 'blue' ? 'rgba(59, 130, 246, 0.15)' : metric.color === 'green' ? 'rgba(34, 197, 94, 0.15)' : metric.color === 'purple' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(236, 72, 153, 0.15)'} 0%, ${metric.color === 'blue' ? 'rgba(29, 78, 216, 0.2)' : metric.color === 'green' ? 'rgba(21, 128, 61, 0.2)' : metric.color === 'purple' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(190, 24, 93, 0.2)'} 100%)`,
              backdropFilter: 'blur(20px)',
              borderColor: metric.color === 'blue' ? 'rgba(59, 130, 246, 0.3)' : metric.color === 'green' ? 'rgba(34, 197, 94, 0.3)' : metric.color === 'purple' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(236, 72, 153, 0.3)',
              boxShadow: `0 8px 32px ${metric.color === 'blue' ? 'rgba(59, 130, 246, 0.3)' : metric.color === 'green' ? 'rgba(34, 197, 94, 0.3)' : metric.color === 'purple' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(236, 72, 153, 0.3)'}, inset 0 1px 0 rgba(255,255,255,0.1)`
            }}
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.6,
              ease: "easeOut"
            }}
            whileHover={{ 
              scale: 1.05, 
              y: -8,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${metric.color === 'blue' ? 'text-blue-400' : metric.color === 'green' ? 'text-green-400' : metric.color === 'purple' ? 'text-purple-400' : 'text-pink-400'} transition-colors duration-300`}>
                {metric.icon}
              </div>
              <span className={`text-sm px-3 py-1 rounded-full font-semibold ${metric.color === 'blue' ? 'text-blue-100 bg-blue-500/30' : metric.color === 'green' ? 'text-green-100 bg-green-500/30' : metric.color === 'purple' ? 'text-purple-100 bg-purple-500/30' : 'text-pink-100 bg-pink-500/30'} transition-all duration-300`}>
                {metric.trend}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-2 transition-colors duration-300">{metric.value}</h3>
            <p className="text-gray-300 text-sm font-medium transition-colors duration-300">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          className="p-6 rounded-2xl border-2 shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.2) 100%)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(16, 185, 129, 0.3)',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}
          initial={{ x: -20, opacity: 0, scale: 0.95 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ 
            delay: 0.2,
            duration: 0.6,
            ease: "easeOut"
          }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <MessageSquare className="w-6 h-6 mr-3 text-emerald-400" />
            Recent AI Queries
          </h3>
          <div className="space-y-3">
            {recentQueries.map((query, index) => (
              <motion.div
                key={index}
                className="p-4 rounded-xl border-2 cursor-pointer group"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)',
                  backdropFilter: 'blur(10px)',
                  borderColor: 'rgba(16, 185, 129, 0.2)'
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: 0.3 + index * 0.1,
                  duration: 0.5,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  x: 8,
                  scale: 1.02,
                  borderColor: 'rgba(16, 185, 129, 0.5)',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.15) 100%)',
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                <p className="text-gray-200 text-sm group-hover:text-white transition-all duration-300 font-medium">
                  {query}
                </p>
              </motion.div>
            ))}
          </div>
          <motion.button
            className="mt-6 w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/50 transition-all duration-300"
            whileHover={{ 
              scale: 1.05,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentView('chat')}
          >
            Start New Chat
          </motion.button>
        </motion.div>

        <motion.div
          className="p-6 rounded-2xl border-2 shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(8, 145, 178, 0.2) 100%)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(6, 182, 212, 0.3)',
            boxShadow: '0 8px 32px rgba(6, 182, 212, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}
          initial={{ x: 20, opacity: 0, scale: 0.95 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ 
            delay: 0.3,
            duration: 0.6,
            ease: "easeOut"
          }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Globe className="w-6 h-6 mr-3 text-cyan-400" />
            Global Ocean Status
          </h3>
          <div className="space-y-3">
            {[
              { ocean: 'Pacific Ocean', status: 'Active', color: 'text-emerald-400', bgColor: 'rgba(34, 197, 94, 0.1)' },
              { ocean: 'Atlantic Ocean', status: 'Active', color: 'text-emerald-400', bgColor: 'rgba(34, 197, 94, 0.1)' },
              { ocean: 'Indian Ocean', status: 'Limited', color: 'text-yellow-400', bgColor: 'rgba(251, 191, 36, 0.1)' },
              { ocean: 'Arctic Ocean', status: 'Seasonal', color: 'text-red-400', bgColor: 'rgba(248, 113, 113, 0.1)' }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="p-4 rounded-xl border-2 cursor-pointer group"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)',
                  backdropFilter: 'blur(10px)',
                  borderColor: 'rgba(6, 182, 212, 0.2)'
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: 0.4 + index * 0.1,
                  duration: 0.5,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  x: -8,
                  scale: 1.02,
                  borderColor: 'rgba(6, 182, 212, 0.5)',
                  background: `linear-gradient(135deg, ${item.bgColor} 0%, rgba(6, 182, 212, 0.15) 100%)`,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-gray-200 text-sm group-hover:text-white transition-all duration-300 font-medium">
                    {item.ocean}
                  </p>
                  <span className={`text-sm font-semibold ${item.color} transition-all duration-300`}>
                    {item.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.button
            className="mt-6 w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-300"
            whileHover={{ 
              scale: 1.05,
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentView('map')}
          >
            View Global Map
          </motion.button>
        </motion.div>
      </div>

      {/* <MetricsPanel /> */}
    </div>
  )

  
  
  
  
  
  
  
  
  
  


  

  const AlertsView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Bell className="w-7 h-7 mr-3 text-red-500" />
        Alerts & Notifications
      </h2>
      <div className="p-6 rounded-xl border border-gray-800/60 shadow-2xl"
           style={{
             background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.9) 100%)',
             backdropFilter: 'blur(20px)',
             boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)'
           }}>
        <p className="text-gray-400">Alert system coming soon...</p>
      </div>
    </div>
  )

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <OverviewView />
      case 'data_handling':
        return <DataHandling />
      case 'visualization':
        return <VisualizationHub />
      case 'search_filters':
        return <SearchFilters />
      case 'ai_insights':
        return <AIInsights />
      case 'business_apps':
        return <BusinessApplications />
      case 'education_hub':
        return <EducationHub />
      case 'alerts':
        return <AlertsView />
      case 'disaster_early_warning':
        return <DisasterWarning />
      case 'blue_economy':
        return <BlueEconomy />
      case 'policy_citizen_tools':
        return <PolicyTools />
      case 'research_tools':
        return <ResearchTools />
      case 'chat':
        return <AIChat />
      case 'map':
        return <OceanMap />
      default:
        return <OverviewView />
    }
  }

  return (
    <div className="min-h-screen bg-black" style={{ backgroundColor: '#000000' }}>
      <Sidebar />
      <TopBar />
      
      <main 
        className="overflow-y-auto"
        style={{ marginLeft: sidebarOpen ? '16rem' : '4rem', height: '100vh', paddingTop: '4rem' }}
      >
        <div className="px-4 pt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default Dashboard