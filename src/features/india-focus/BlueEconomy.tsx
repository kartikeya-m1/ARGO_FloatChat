import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp,
  Waves,
  Map,
  Activity,
  Target,
  DollarSign,
  Ship,
  Fish,
  Factory,
  Users,
  BarChart3,
  PieChart,
  TrendingDown,
  ArrowUpRight,
  MapPin,
  Globe,
  Zap,
  Settings,
  Download,
  Share2,
  Eye
} from 'lucide-react'
import { EconomicIndicator } from '../../types'

const BlueEconomy: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'fisheries' | 'shipping' | 'coastal' | 'renewable'>('fisheries')
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '1Y' | '5Y'>('1Y')

  const economicSectors: Record<string, EconomicIndicator[]> = {
    fisheries: [
      {
        title: "Enhanced PFZ Predictor 2.0",
        desc: "AI-powered fishing zone forecasts using ARGO + satellite + ML for 3-5 day predictions with 85% accuracy improvement",
        icon: <Fish className="w-6 h-6" />,
        color: "emerald"
      },
      {
        title: "Catch Efficiency Optimizer",
        desc: "Real-time optimization of fishing operations based on ocean temperature, currents, and chlorophyll data",
        icon: <Target className="w-6 h-6" />,
        color: "blue"
      },
      {
        title: "Sustainable Yield Calculator",
        desc: "ML models predicting sustainable fish catch limits based on ocean health and stock assessments",
        icon: <Activity className="w-6 h-6" />,
        color: "green"
      },
      {
        title: "Market Price Predictor",
        desc: "Economic forecasting linking ocean conditions with fish market prices and supply chain dynamics",
        icon: <DollarSign className="w-6 h-6" />,
        color: "yellow"
      }
    ],
    shipping: [
      {
        title: "Smart Route Optimizer",
        desc: "Fuel-efficient shipping route planning using real-time ocean currents and weather conditions",
        icon: <Ship className="w-6 h-6" />,
        color: "blue"
      },
      {
        title: "Port Efficiency Analytics",
        desc: "Optimize port operations using tide predictions, weather forecasts, and vessel traffic analysis",
        icon: <Activity className="w-6 h-6" />,
        color: "purple"
      },
      {
        title: "Fuel Cost Reduction",
        desc: "AI-driven fuel optimization achieving 15-20% cost savings through current-aware navigation",
        icon: <DollarSign className="w-6 h-6" />,
        color: "green"
      },
      {
        title: "Carbon Footprint Tracker",
        desc: "Monitor and reduce maritime carbon emissions through optimized routing and operations",
        icon: <Waves className="w-6 h-6" />,
        color: "cyan"
      }
    ],
    coastal: [
      {
        title: "Aquaculture Site Selection",
        desc: "AI-powered analysis for optimal aquaculture farm locations using ocean parameter data",
        icon: <Fish className="w-6 h-6" />,
        color: "indigo"
      },
      {
        title: "Tourism Revenue Forecasting",
        desc: "Predict coastal tourism revenue based on ocean conditions, weather, and seasonal patterns",
        icon: <Users className="w-6 h-6" />,
        color: "orange"
      },
      {
        title: "Coastal Economic Dashboard",
        desc: "Real-time economic indicators linking ocean health with regional coastal economic performance",
        icon: <BarChart3 className="w-6 h-6" />,
        color: "blue"
      },
      {
        title: "Infrastructure Planning",
        desc: "Sea level rise and climate data for coastal infrastructure investment and planning decisions",
        icon: <Map className="w-6 h-6" />,
        color: "red"
      }
    ],
    renewable: [
      {
        title: "Offshore Wind Assessment",
        desc: "Ocean-atmosphere interaction analysis for optimal offshore wind farm site selection and operations",
        icon: <Zap className="w-6 h-6" />,
        color: "yellow"
      },
      {
        title: "Tidal Energy Forecasting",
        desc: "Precise tidal and current predictions for renewable energy generation planning and optimization",
        icon: <Waves className="w-6 h-6" />,
        color: "cyan"
      },
      {
        title: "Ocean Thermal Energy",
        desc: "OTEC potential assessment using temperature gradient analysis and economic feasibility modeling",
        icon: <Factory className="w-6 h-6" />,
        color: "orange"
      },
      {
        title: "Wave Energy Mapping",
        desc: "Wave power resource assessment and energy generation potential analysis for Indian coastline",
        icon: <Activity className="w-6 h-6" />,
        color: "purple"
      }
    ]
  }

  const economicMetrics = [
    { 
      label: "Blue Economy Value", 
      value: "₹3.2 Lakh Cr", 
      change: "+8.5%", 
      icon: <DollarSign />, 
      color: "green",
      description: "Total contribution to Indian GDP"
    },
    { 
      label: "Employment Generated", 
      value: "4.2M Jobs", 
      change: "+12.3%", 
      icon: <Users />, 
      color: "blue",
      description: "Direct and indirect employment"
    },
    { 
      label: "Export Revenue", 
      value: "₹45,600 Cr", 
      change: "+15.2%", 
      icon: <TrendingUp />, 
      color: "purple",
      description: "Marine exports value"
    },
    { 
      label: "Efficiency Gain", 
      value: "23.7%", 
      change: "+5.1%", 
      icon: <Target />, 
      color: "orange",
      description: "AI-driven improvements"
    }
  ]

  const regionalAnalysis = [
    {
      region: "Gujarat Coast",
      gdpContribution: "₹45,200 Cr",
      majorSectors: ["Shipping", "Fisheries", "Renewable"],
      growth: "+11.2%",
      employment: "890K",
      coordinates: [22.2587, 71.1924]
    },
    {
      region: "Kerala Coast", 
      gdpContribution: "₹32,800 Cr",
      majorSectors: ["Tourism", "Fisheries", "Aquaculture"],
      growth: "+8.7%",
      employment: "650K",
      coordinates: [10.8505, 76.2711]
    },
    {
      region: "Tamil Nadu Coast",
      gdpContribution: "₹38,600 Cr", 
      majorSectors: ["Ports", "Renewable", "Fisheries"],
      growth: "+9.4%",
      employment: "720K",
      coordinates: [11.1271, 78.6569]
    },
    {
      region: "West Bengal Coast",
      gdpContribution: "₹28,400 Cr",
      majorSectors: ["Fisheries", "Shipping", "Aquaculture"], 
      growth: "+7.8%",
      employment: "580K",
      coordinates: [22.9868, 87.8550]
    }
  ]

  const predictions = [
    {
      sector: "Fisheries Yield",
      current: "12.8 MT",
      predicted: "15.6 MT",
      improvement: "+21.9%",
      timeframe: "Next 12 months",
      confidence: 87
    },
    {
      sector: "Shipping Efficiency", 
      current: "72.3%",
      predicted: "89.1%",
      improvement: "+23.2%",
      timeframe: "Next 6 months",
      confidence: 92
    },
    {
      sector: "Tourism Revenue",
      current: "₹8,200 Cr",
      predicted: "₹11,400 Cr",
      improvement: "+39.0%",
      timeframe: "Next 18 months", 
      confidence: 78
    }
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
          ? 'bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-lg' 
          : 'bg-deep-700/50 text-ocean-300 hover:text-white hover:bg-deep-600/50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={isActive ? 'text-white' : 'text-emerald-400'}>{icon}</div>
      <span>{label}</span>
    </motion.button>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
            <TrendingUp className="w-8 h-8 mr-3 text-emerald-500" />
            AI for India's Blue Economy
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            {(['1M', '3M', '1Y', '5Y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  timeRange === range
                    ? 'bg-emerald-600 text-white'
                    : 'bg-deep-700/50 text-ocean-300 hover:bg-deep-600/50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors">
            <Download className="w-4 h-4 text-ocean-300" />
            <span className="text-ocean-300 text-sm">Export Report</span>
          </button>
        </div>
      </div>

      {/* Economic Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {economicMetrics.map((metric, index) => (
          <motion.div
            key={index}
            className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`text-${metric.color}-400`}>{metric.icon}</div>
              <span className={`text-xs px-2 py-1 rounded flex items-center ${
                metric.change.startsWith('+') ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
              }`}>
                {metric.change.startsWith('+') ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {metric.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
            <p className="text-ocean-300 text-sm mb-1">{metric.label}</p>
            <p className="text-ocean-400 text-xs">{metric.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Regional Economic Analysis */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <MapPin className="w-6 h-6 mr-2 text-emerald-400" />
          Regional Blue Economy Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {regionalAnalysis.map((region, index) => (
            <motion.div
              key={index}
              className="glass-morphism p-6 rounded-xl border border-ocean-700/30 hover:border-emerald-500/50 transition-all"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">{region.region}</h4>
                <span className={`text-sm px-3 py-1 rounded ${
                  parseFloat(region.growth.slice(1)) > 10 ? 'bg-green-900/20 text-green-400' :
                  parseFloat(region.growth.slice(1)) > 7 ? 'bg-yellow-900/20 text-yellow-400' :
                  'bg-blue-900/20 text-blue-400'
                }`}>
                  {region.growth}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="text-ocean-400">GDP Contribution:</span>
                  <div className="text-white font-semibold">{region.gdpContribution}</div>
                </div>
                <div>
                  <span className="text-ocean-400">Employment:</span>
                  <div className="text-white font-semibold">{region.employment}</div>
                </div>
              </div>
              
              <div className="mb-4">
                <span className="text-ocean-400 text-sm">Major Sectors:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {region.majorSectors.map((sector, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-emerald-900/20 text-emerald-300 rounded">
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-2 rounded-lg hover:shadow-lg transition-all">
                <Eye className="w-4 h-4 inline mr-2" />
                Detailed Analysis
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Category Navigation */}
      <div className="flex flex-wrap gap-4">
        <CategoryButton 
          id="fisheries" 
          label="Fisheries & Aquaculture" 
          icon={<Fish className="w-5 h-5" />}
          isActive={activeCategory === 'fisheries'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
        <CategoryButton 
          id="shipping" 
          label="Shipping & Logistics" 
          icon={<Ship className="w-5 h-5" />}
          isActive={activeCategory === 'shipping'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
        <CategoryButton 
          id="coastal" 
          label="Coastal Economy" 
          icon={<Map className="w-5 h-5" />}
          isActive={activeCategory === 'coastal'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
        <CategoryButton 
          id="renewable" 
          label="Marine Renewable" 
          icon={<Zap className="w-5 h-5" />}
          isActive={activeCategory === 'renewable'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
      </div>

      {/* Sector Applications */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {economicSectors[activeCategory].map((indicator, index) => (
          <motion.div
            key={index}
            className="glass-morphism p-6 rounded-xl border border-ocean-700/30 hover:border-emerald-500/50 transition-all cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className={`text-${indicator.color}-400 mb-4 group-hover:scale-110 transition-transform`}>
              {indicator.icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-100 transition-colors">
              {indicator.title}
            </h3>
            <p className="text-ocean-300 text-sm mb-4 group-hover:text-ocean-200 transition-colors">
              {indicator.desc}
            </p>
            <motion.button 
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-2 rounded-lg hover:shadow-lg transition-all flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Target className="w-4 h-4 mr-2" />
              Explore Impact
            </motion.button>
          </motion.div>
        ))}
      </motion.div>

      {/* AI Predictions & Forecasts */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-blue-400" />
          AI Economic Predictions
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {predictions.map((prediction, index) => (
            <motion.div
              key={index}
              className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">{prediction.sector}</h4>
                <span className="text-xs px-2 py-1 bg-blue-900/20 text-blue-300 rounded">
                  {prediction.confidence}% confidence
                </span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-ocean-400">Current:</span>
                  <span className="text-white font-medium">{prediction.current}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ocean-400">Predicted:</span>
                  <span className="text-green-400 font-medium">{prediction.predicted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ocean-400">Improvement:</span>
                  <span className="text-emerald-400 font-bold">{prediction.improvement}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ocean-400">Timeframe:</span>
                  <span className="text-white">{prediction.timeframe}</span>
                </div>
              </div>
              
              <div className="w-full bg-deep-700 rounded-full h-2 mb-4">
                <motion.div 
                  className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${prediction.confidence}%` }}
                  transition={{ delay: index * 0.2 + 0.5, duration: 1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Economic Impact Modeling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-green-400" />
            Economic Impact Calculator
          </h3>
          <p className="text-ocean-300 mb-6">Calculate the economic impact of ocean condition changes on various blue economy sectors.</p>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-ocean-300 text-sm mb-2 block">Select Scenario</label>
              <select className="w-full bg-deep-700 text-white px-3 py-2 rounded border border-ocean-700/30 focus:border-emerald-500 focus:outline-none">
                <option>Ocean warming +1°C</option>
                <option>Sea level rise +20cm</option>
                <option>Monsoon intensity +15%</option>
                <option>Ocean acidification +0.1 pH</option>
              </select>
            </div>
            <div>
              <label className="text-ocean-300 text-sm mb-2 block">Time Horizon</label>
              <select className="w-full bg-deep-700 text-white px-3 py-2 rounded border border-ocean-700/30 focus:border-emerald-500 focus:outline-none">
                <option>5 years</option>
                <option>10 years</option>
                <option>25 years</option>
                <option>50 years</option>
              </select>
            </div>
          </div>
          
          <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:shadow-lg transition-all">
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Calculate Impact
          </button>
        </motion.div>
        
        <motion.div
          className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Globe className="w-6 h-6 mr-2 text-blue-400" />
            Policy Impact Dashboard
          </h3>
          <p className="text-ocean-300 mb-6">Real-time tracking of blue economy policies and their measured impacts on economic indicators.</p>
          
          <div className="space-y-3 mb-6">
            {[
              { policy: "Sagarmala Project", impact: "+12.3% port efficiency", status: "Active" },
              { policy: "Blue Revolution", impact: "+8.7% aquaculture yield", status: "Ongoing" },
              { policy: "Deep Ocean Mission", impact: "+₹850 Cr investment", status: "Planning" },
              { policy: "Marine Fisheries Bill", impact: "+15% sustainable practices", status: "Implemented" }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-deep-700/50 rounded-lg">
                <div>
                  <div className="text-white text-sm font-medium">{item.policy}</div>
                  <div className="text-emerald-400 text-xs">{item.impact}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  item.status === 'Active' ? 'bg-green-900/20 text-green-400' :
                  item.status === 'Ongoing' ? 'bg-blue-900/20 text-blue-400' :
                  item.status === 'Planning' ? 'bg-yellow-900/20 text-yellow-400' :
                  'bg-purple-900/20 text-purple-400'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
          
          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all">
            <Settings className="w-4 h-4 inline mr-2" />
            Policy Analysis
          </button>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center space-x-4">
        <motion.button
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:shadow-lg transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <PieChart className="w-4 h-4" />
          <span>Generate Report</span>
        </motion.button>
        <motion.button
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Share2 className="w-4 h-4" />
          <span>Share Insights</span>
        </motion.button>
      </div>
    </div>
  )
}

export default BlueEconomy
