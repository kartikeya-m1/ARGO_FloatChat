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
  Cpu,
  RefreshCw,
  Loader
} from 'lucide-react'
import { 
  useMarineBusinessInsights, 
  useEnergyBusinessInsights,
  formatEconomicImpact,
  formatROI 
} from '../../hooks/useAdvancedAnalytics'

const EnhancedBusinessApplications: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'marine' | 'energy' | 'insurance' | 'logistics'>('marine')
  const [, setSelectedApp] = useState<string | null>(null)

  // Real data hooks
  const { 
    insights: marineInsights, 
    loading: marineLoading, 
    error: marineError, 
    summary: marineSummary, 
    refetch: refetchMarine 
  } = useMarineBusinessInsights()
  
  const { 
    insights: energyInsights, 
    loading: energyLoading, 
    error: energyError, 
    summary: energySummary, 
    refetch: refetchEnergy 
  } = useEnergyBusinessInsights()

  // Calculate combined metrics
  const totalEconomicImpact = (marineSummary?.total_economic_impact || 0) + (energySummary?.total_economic_impact || 0)
  const totalImplementationCost = (marineSummary?.implementation_cost_total || 0) + (energySummary?.implementation_cost_total || 0)
  const averageROI = ((marineSummary?.average_roi || 0) + (energySummary?.average_roi || 0)) / 2

  const industryMetrics = [
    { label: "Active Partnerships", value: "127", icon: <Users />, color: "blue", trend: "+15%" },
    { label: "Revenue Generated", value: formatEconomicImpact(totalEconomicImpact), icon: <DollarSign />, color: "green", trend: "+23%" },
    { label: "Cost Savings", value: formatEconomicImpact(totalEconomicImpact * 2.5), icon: <TrendingUp />, color: "purple", trend: "+31%" },
    { label: "Deployment Success", value: formatROI(averageROI), icon: <Target />, color: "orange", trend: "+5%" }
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

  const AppCard = ({ app, index }: { app: any; index: number }) => (
    <motion.div
      className="glass-morphism p-6 rounded-xl border border-ocean-700/30 hover:border-orange-500/50 transition-all cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      onClick={() => setSelectedApp(app.title)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-orange-400 group-hover:scale-110 transition-transform">
          {getIconForInsight(app.insight_id)}
        </div>
        {app.roi_percentage && (
          <span className="text-xs px-2 py-1 bg-green-900/20 text-green-400 rounded">
            {formatROI(app.roi_percentage)} ROI
          </span>
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-100 transition-colors">
        {app.title}
      </h3>
      <p className="text-ocean-300 text-sm mb-4 group-hover:text-ocean-200 transition-colors">
        {app.description}
      </p>

      {app.economic_impact && (
        <div className="mb-4">
          <div className="text-sm text-ocean-400 mb-1">Economic Impact</div>
          <div className="text-2xl font-bold text-green-400">
            {formatEconomicImpact(app.economic_impact)}
          </div>
        </div>
      )}

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

  const getIconForInsight = (insightId: string) => {
    switch (insightId) {
      case 'enhanced_pfz_predictor': return <Fish className="w-6 h-6" />
      case 'aquaculture_optimization': return <Waves className="w-6 h-6" />
      case 'marine_risk_assessment': return <AlertCircle className="w-6 h-6" />
      case 'fisheries_sustainability_index': return <Activity className="w-6 h-6" />
      case 'offshore_wind_optimization': return <Zap className="w-6 h-6" />
      case 'ocean_thermal_energy_assessment': return <Factory className="w-6 h-6" />
      case 'tidal_energy_forecasting': return <Waves className="w-6 h-6" />
      case 'platform_operations_support': return <Target className="w-6 h-6" />
      default: return <Briefcase className="w-6 h-6" />
    }
  }

  const renderCategoryContent = () => {
    const currentInsights = activeCategory === 'marine' ? marineInsights : 
                          activeCategory === 'energy' ? energyInsights : []
    const currentLoading = activeCategory === 'marine' ? marineLoading : 
                         activeCategory === 'energy' ? energyLoading : false
    const currentError = activeCategory === 'marine' ? marineError : 
                       activeCategory === 'energy' ? energyError : null
    const refetch = activeCategory === 'marine' ? refetchMarine : refetchEnergy

    if (currentLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader className="w-6 h-6 text-orange-400 animate-spin" />
            <span className="text-ocean-300">Loading business insights...</span>
          </div>
        </div>
      )
    }

    if (currentError) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <div className="text-red-400 mb-2">Error loading business insights</div>
            <div className="text-ocean-400 text-sm mb-4">{currentError}</div>
            <button 
              onClick={refetch}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )
    }

    if (activeCategory === 'insurance' || activeCategory === 'logistics') {
      return (
        <div className="text-center py-12 text-ocean-400">
          <Briefcase className="w-12 h-12 mx-auto mb-4" />
          <div>{activeCategory === 'insurance' ? 'Insurance & Risk' : 'Shipping & Logistics'} applications</div>
          <div className="text-sm mt-2">Coming in Phase 3 - Advanced integrations</div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white capitalize">
            {activeCategory} Sector Applications
          </h3>
          <button 
            onClick={refetch}
            className="flex items-center space-x-2 px-4 py-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors"
            disabled={currentLoading}
          >
            <RefreshCw className={`w-4 h-4 text-ocean-300 ${currentLoading ? 'animate-spin' : ''}`} />
            <span className="text-ocean-300">Refresh</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {currentInsights?.map((app, index) => (
            <AppCard key={app.insight_id} app={app} index={index} />
          )) || []}
        </motion.div>

        {currentInsights && currentInsights.length === 0 && (
          <div className="text-center py-12 text-ocean-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-4" />
            <div>No business insights available</div>
            <div className="text-sm mt-2">Check data quality and try again</div>
          </div>
        )}
      </div>
    )
  }

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

      {/* Applications Content */}
      {renderCategoryContent()}

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

export default EnhancedBusinessApplications
