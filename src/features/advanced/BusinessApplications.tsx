import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Briefcase,
  TrendingUp,
  Map,
  Shield,
  Zap,
  Activity,
  AlertCircle,
  DollarSign,
  Ship,
  Factory,
  Fish,
  Waves,
  BarChart3,
  Target,
  Settings,
  Play,
  Download,
  Share2,
  Clock,
  Users,
  Globe,
  Cpu
} from 'lucide-react'
import { BusinessApplication } from '../../types'

const BusinessApplications: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'marine' | 'energy' | 'insurance' | 'logistics'>('marine')
  const [, setSelectedApp] = useState<string | null>(null)

  const businessApps: Record<string, BusinessApplication[]> = {
    marine: [
      {
        title: "Enhanced PFZ Predictor 2.0",
        desc: "AI-powered fishing zone forecasts combining ARGO, satellite, and ML for 3-5 day predictions",
        icon: <Fish className="w-6 h-6" />,
        color: "green"
      },
      {
        title: "Aquaculture Optimization",
        desc: "Ocean condition monitoring for optimal fish farming site selection and management",
        icon: <Waves className="w-6 h-6" />,
        color: "blue"
      },
      {
        title: "Marine Risk Assessment",
        desc: "Real-time analysis of storm surge, algal blooms, and dead zone predictions",
        icon: <AlertCircle className="w-6 h-6" />,
        color: "red"
      },
      {
        title: "Fisheries Sustainability Index",
        desc: "Comprehensive scoring system for sustainable fishing practices and stock management",
        icon: <Activity className="w-6 h-6" />,
        color: "emerald"
      }
    ],
    energy: [
      {
        title: "Offshore Wind Optimization",
        desc: "Ocean-atmosphere interaction analysis for wind farm site selection and operations",
        icon: <Zap className="w-6 h-6" />,
        color: "yellow"
      },
      {
        title: "Ocean Thermal Energy Assessment",
        desc: "Temperature gradient analysis for OTEC potential evaluation and planning",
        icon: <Factory className="w-6 h-6" />,
        color: "orange"
      },
      {
        title: "Tidal Energy Forecasting",
        desc: "Current and tidal prediction models for renewable energy generation planning",
        icon: <Waves className="w-6 h-6" />,
        color: "cyan"
      },
      {
        title: "Platform Operations Support",
        desc: "Weather and sea state forecasting for offshore oil and gas operations",
        icon: <Target className="w-6 h-6" />,
        color: "purple"
      }
    ],
    insurance: [
      {
        title: "Climate Risk Modeling",
        desc: "Advanced climate impact assessment for marine insurance underwriting",
        icon: <Shield className="w-6 h-6" />,
        color: "purple"
      },
      {
        title: "Catastrophic Event Prediction",
        desc: "Early warning systems for hurricanes, tsunamis, and extreme weather events",
        icon: <AlertCircle className="w-6 h-6" />,
        color: "red"
      },
      {
        title: "Asset Vulnerability Analysis",
        desc: "Coastal infrastructure risk assessment using sea level and storm surge data",
        icon: <DollarSign className="w-6 h-6" />,
        color: "green"
      },
      {
        title: "Parametric Insurance Triggers",
        desc: "Automated insurance claim triggers based on ocean parameter thresholds",
        icon: <Settings className="w-6 h-6" />,
        color: "blue"
      }
    ],
    logistics: [
      {
        title: "Smart Shipping Routes",
        desc: "Fuel-efficient route optimization using real-time ocean currents and conditions",
        icon: <Ship className="w-6 h-6" />,
        color: "blue"
      },
      {
        title: "Port Operations Optimization",
        desc: "Tide, weather, and sea state forecasting for efficient port operations",
        icon: <Map className="w-6 h-6" />,
        color: "indigo"
      },
      {
        title: "Supply Chain Resilience",
        desc: "Ocean-climate impact assessment for global supply chain planning",
        icon: <Globe className="w-6 h-6" />,
        color: "green"
      },
      {
        title: "Maritime Safety Intelligence",
        desc: "Real-time safety alerts and navigation assistance for maritime operations",
        icon: <Shield className="w-6 h-6" />,
        color: "red"
      }
    ]
  }

  const industryMetrics = [
    { label: "Active Partnerships", value: "127", icon: <Users />, color: "blue", trend: "+15%" },
    { label: "Revenue Generated", value: "$2.4M", icon: <DollarSign />, color: "green", trend: "+23%" },
    { label: "Cost Savings", value: "$8.7M", icon: <TrendingUp />, color: "purple", trend: "+31%" },
    { label: "Deployment Success", value: "94.2%", icon: <Target />, color: "orange", trend: "+5%" }
  ]

  const CategoryButton = ({ 
    id, 
    label, 
    icon, 
    isActive, 
    onClick 
  }: { 
    id: string; 
    label: string; 
    icon: React.ReactNode;
    isActive: boolean; 
    onClick: (id: string) => void 
  }) => (
    <motion.button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-3 px-6 py-4 rounded-xl font-medium transition-all ${
        isActive 
          ? 'bg-gradient-to-r from-orange-600 to-red-700 text-white shadow-lg' 
          : 'bg-deep-700/50 text-ocean-300 hover:text-white hover:bg-deep-600/50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={isActive ? 'text-white' : 'text-orange-400'}>{icon}</div>
      <span>{label}</span>
    </motion.button>
  )

  const AppCard = ({ app, index }: { app: BusinessApplication; index: number }) => (
    <motion.div
      className="glass-morphism p-6 rounded-xl border border-ocean-700/30 hover:border-orange-500/50 transition-all cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      onClick={() => setSelectedApp(app.title)}
    >
      <div className={`text-${app.color}-400 mb-4 group-hover:scale-110 transition-transform`}>
        {app.icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-100 transition-colors">
        {app.title}
      </h3>
      <p className="text-ocean-300 text-sm mb-4 group-hover:text-ocean-200 transition-colors">
        {app.desc}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button className="p-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors">
            <BarChart3 className="w-4 h-4 text-ocean-300" />
          </button>
          <button className="p-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors">
            <Settings className="w-4 h-4 text-ocean-300" />
          </button>
        </div>
        <motion.button 
          className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Play className="w-4 h-4 mr-1" />
          Deploy
        </motion.button>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Briefcase className="w-8 h-8 mr-3 text-orange-500" />
            Business & Industry Applications
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors">
            <Download className="w-4 h-4 text-ocean-300" />
            <span className="text-ocean-300 text-sm">Export Report</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors">
            <Share2 className="w-4 h-4 text-ocean-300" />
            <span className="text-ocean-300 text-sm">Share</span>
          </button>
        </div>
      </div>

      {/* Industry Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {industryMetrics.map((metric, index) => (
          <motion.div
            key={index}
            className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`text-${metric.color}-400`}>{metric.icon}</div>
              <span className={`text-xs px-2 py-1 rounded ${
                metric.trend.startsWith('+') ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
              }`}>
                {metric.trend}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
            <p className="text-ocean-300 text-sm">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Category Navigation */}
      <div className="flex flex-wrap gap-4">
        <CategoryButton 
          id="marine" 
          label="Marine & Fisheries" 
          icon={<Fish className="w-5 h-5" />}
          isActive={activeCategory === 'marine'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
        <CategoryButton 
          id="energy" 
          label="Energy & Resources" 
          icon={<Zap className="w-5 h-5" />}
          isActive={activeCategory === 'energy'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
        <CategoryButton 
          id="insurance" 
          label="Insurance & Risk" 
          icon={<Shield className="w-5 h-5" />}
          isActive={activeCategory === 'insurance'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
        <CategoryButton 
          id="logistics" 
          label="Shipping & Logistics" 
          icon={<Ship className="w-5 h-5" />}
          isActive={activeCategory === 'logistics'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
      </div>

      {/* Applications Grid */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {businessApps[activeCategory].map((app, index) => (
          <AppCard key={index} app={app} index={index} />
        ))}
      </motion.div>

      

      {/* Ocean-Economy Correlation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-blue-400" />
            Ocean-Economy Correlation Engine
          </h3>
          <p className="text-ocean-300 mb-6">Advanced analytics linking ocean conditions with economic indicators and market trends.</p>
          
          <div className="space-y-4 mb-6">
            {[
              { metric: "Fishing Industry GDP", correlation: "0.87", trend: "Strong positive" },
              { metric: "Shipping Fuel Costs", correlation: "-0.64", trend: "Negative correlation" },
              { metric: "Tourism Revenue", correlation: "0.73", trend: "Seasonal positive" },
              { metric: "Insurance Claims", correlation: "0.91", trend: "Strong positive" }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-deep-700/50 rounded-lg">
                <div>
                  <div className="text-white text-sm font-medium">{item.metric}</div>
                  <div className="text-ocean-400 text-xs">{item.trend}</div>
                </div>
                <div className={`text-lg font-bold ${
                  parseFloat(item.correlation) > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {item.correlation}
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all">
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Run Economic Analysis
          </button>
        </motion.div>
        
        <motion.div
          className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Cpu className="w-6 h-6 mr-2 text-purple-400" />
            AI-Powered Business Intelligence
          </h3>
          <p className="text-ocean-300 mb-6">Automated insights and recommendations for strategic business decisions.</p>
          
          <div className="space-y-3 mb-6">
            {[
              "Market opportunity identification",
              "Risk assessment and mitigation",
              "Competitive advantage analysis",
              "Investment timing optimization",
              "Operational efficiency gains",
              "Revenue forecasting models"
            ].map((feature, i) => (
              <div key={i} className="flex items-center text-sm">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                <span className="text-ocean-200">{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:shadow-lg transition-all text-sm">
              <Clock className="w-4 h-4 inline mr-1" />
              Schedule Report
            </button>
            <button className="bg-deep-700/50 border border-ocean-600/30 text-ocean-300 py-2 rounded-lg hover:bg-deep-600/50 transition-all text-sm">
              <Settings className="w-4 h-4 inline mr-1" />
              Configure
            </button>
          </div>
        </motion.div>
      </div>

      
    </div>
  )
}

export default BusinessApplications
