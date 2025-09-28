import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity,
  PlayCircle,
  Map,
  TrendingUp,
  BarChart3,
  LineChart,
  Settings,
  RefreshCw,
  Eye
} from 'lucide-react'
import { DataVisualization } from '../../types'
import InteractiveChart from '../../components/charts/InteractiveChart'
import OceanDataChart from '../../components/charts/OceanDataChart'

const VisualizationHub: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'maps' | 'charts' | 'animations' | 'advanced'>('charts')
  const [liveMode, setLiveMode] = useState(true)
  const [selectedFloat, setSelectedFloat] = useState<string>('4902916')

  // Generate realistic ocean data
  const generateOceanData = () => {
    const data = []
    const baseDate = new Date()
    
    for (let i = 0; i < 100; i++) {
      const timestamp = new Date(baseDate.getTime() - i * 6 * 60 * 60 * 1000) // Every 6 hours
      const depth = Math.random() * 2000
      const lat = 10 + Math.random() * 15 // Indian Ocean region
      const lon = 65 + Math.random() * 25
      
      // Realistic oceanographic relationships
      const surfaceTemp = 26 + Math.random() * 4
      const temperature = surfaceTemp - (depth / 1000) * (15 + Math.random() * 5)
      const salinity = 34.5 + Math.random() * 1.0 + (depth / 2000) * 0.5
      const oxygen = 6 - (depth / 1000) * 3 + Math.random() * 1
      const pH = 8.0 - (depth / 2000) * 0.3 + Math.random() * 0.2
      const chlorophyll = Math.max(0.1, 2 - (depth / 200) + Math.random() * 0.5)
      
      data.push({
        timestamp: timestamp.toISOString(),
        depth,
        temperature,
        salinity,
        oxygen: Math.max(0, oxygen),
        pH,
        chlorophyll,
        pressure: depth * 0.1 + 1013,
        lat,
        lon,
        floatId: ['4902916', '5906467', '2903521'][Math.floor(Math.random() * 3)]
      })
    }
    return data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }

  const oceanData = useMemo(() => generateOceanData(), [])

  // Sample chart data for Chart.js charts
  const temperatureChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Arabian Sea',
        data: [26.2, 26.8, 27.5, 28.2, 29.1, 29.8, 29.5, 29.2, 28.8, 28.1, 27.3, 26.5],
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: '#EF4444',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Bay of Bengal',
        data: [25.8, 26.5, 27.8, 28.9, 29.7, 29.3, 28.8, 28.5, 28.9, 28.3, 27.1, 26.2],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3B82F6',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }
    ]
  }

  const salinityDistributionData = {
    labels: ['33.0-33.5', '33.5-34.0', '34.0-34.5', '34.5-35.0', '35.0-35.5', '35.5-36.0'],
    datasets: [
      {
        label: 'Distribution',
        data: [12, 45, 67, 89, 56, 23],
        backgroundColor: [
          '#3B82F6',
          '#06B6D4',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  }

  const correlationData = Array.from({ length: 50 }, (_, i) => ({
    name: `Point ${i + 1}`,
    temperature: 24 + Math.random() * 8,
    salinity: 33.5 + Math.random() * 2,
    oxygen: 3 + Math.random() * 3,
    depth: Math.random() * 2000
  }))
  
  const visualizations: Record<string, DataVisualization[]> = {
    maps: [
      { 
        title: "Global Ocean Map", 
        desc: "Interactive Leaflet/Cesium visualization with real-time float positions", 
        type: "Interactive Map", 
        color: "blue" 
      },
      { 
        title: "Float Trajectories", 
        desc: "Historical paths and real-time tracking with metadata overlays", 
        type: "Trajectory Map", 
        color: "purple" 
      },
      { 
        title: "Parameter Heatmaps", 
        desc: "Temperature, salinity, and oxygen concentration overlays", 
        type: "Heatmap", 
        color: "red" 
      },
      { 
        title: "Regional Focus Maps", 
        desc: "Detailed views of Arabian Sea, Bay of Bengal, and Indian Ocean", 
        type: "Regional", 
        color: "emerald" 
      }
    ],
    charts: [
      { 
        title: "Depth-Time Profiles", 
        desc: "Interactive plots for temperature, salinity, oxygen, and chlorophyll", 
        type: "Profile Chart", 
        color: "green" 
      },
      { 
        title: "Time Series Analysis", 
        desc: "Multi-parameter trends with statistical analysis and forecasting", 
        type: "Time Series", 
        color: "blue" 
      },
      { 
        title: "Multi-Float Comparison", 
        desc: "Side-by-side analysis of different floats and regions", 
        type: "Comparison", 
        color: "pink" 
      },
      { 
        title: "Statistical Distributions", 
        desc: "Histograms, box plots, and probability distributions", 
        type: "Statistics", 
        color: "indigo" 
      }
    ],
    animations: [
      { 
        title: "Temporal Evolution", 
        desc: "Animated visualization of parameter changes over time", 
        type: "Time Animation", 
        color: "yellow" 
      },
      { 
        title: "Ocean Currents Flow", 
        desc: "Dynamic visualization of water movement and float drift", 
        type: "Flow Animation", 
        color: "cyan" 
      },
      { 
        title: "Seasonal Patterns", 
        desc: "Year-over-year comparison with seasonal cycle animations", 
        type: "Seasonal", 
        color: "orange" 
      },
      { 
        title: "3D Ocean Structure", 
        desc: "Three-dimensional visualization of ocean layers and features", 
        type: "3D Visualization", 
        color: "purple" 
      }
    ],
    advanced: [
      { 
        title: "Satellite Data Fusion", 
        desc: "Combined ARGO and satellite observations (SST, chlorophyll, altimetry)", 
        type: "Data Fusion", 
        color: "indigo" 
      },
      { 
        title: "Anomaly Detection Viz", 
        desc: "Machine learning-powered anomaly highlighting and exploration", 
        type: "AI Visualization", 
        color: "red" 
      },
      { 
        title: "Interactive Annotations", 
        desc: "Collaborative graph and map annotations with sharing capabilities", 
        type: "Collaborative", 
        color: "teal" 
      },
      { 
        title: "Custom Dashboard Builder", 
        desc: "Drag-and-drop interface for creating personalized dashboards", 
        type: "Dashboard", 
        color: "violet" 
      }
    ]
  }

  const quickStats = [
    { label: "Active Visualizations", value: "47", icon: <Activity className="w-5 h-5" />, color: "blue" },
    { label: "Data Points Plotted", value: "2.4M", icon: <BarChart3 className="w-5 h-5" />, color: "green" },
    { label: "Interactive Maps", value: "12", icon: <Map className="w-5 h-5" />, color: "purple" },
    { label: "Real-time Updates", value: "15/min", icon: <RefreshCw className="w-5 h-5" />, color: "orange" }
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
          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg' 
          : 'bg-deep-700/50 text-ocean-300 hover:text-white hover:bg-deep-600/50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={isActive ? 'text-white' : 'text-green-400'}>{icon}</div>
      <span>{label}</span>
    </motion.button>
  )

  const VizCard = ({ viz, index }: { viz: DataVisualization; index: number }) => (
    <motion.div
      className="glass-morphism p-6 rounded-xl border border-ocean-700/30 hover:border-green-500/50 transition-all cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <Activity className={`w-6 h-6 text-${viz.color}-400 group-hover:scale-110 transition-transform`} />
        <span className={`text-xs px-3 py-1 rounded-full bg-${viz.color}-900/20 text-${viz.color}-300`}>
          {viz.type}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-100 transition-colors">
        {viz.title}
      </h3>
      <p className="text-ocean-300 text-sm mb-4 group-hover:text-ocean-200 transition-colors">
        {viz.desc}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button className="p-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors">
            <Eye className="w-4 h-4 text-ocean-300" />
          </button>
          <button className="p-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors">
            <Settings className="w-4 h-4 text-ocean-300" />
          </button>
        </div>
        <motion.button 
          className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PlayCircle className="w-4 h-4 mr-1" />
          Launch
        </motion.button>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <motion.div
            key={index}
            className="glass-morphism p-4 rounded-lg border border-ocean-700/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`text-${stat.color}-400`}>{stat.icon}</div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-ocean-300 text-xs">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Category Navigation */}
      <div className="flex flex-wrap gap-4">
        <CategoryButton 
          id="maps" 
          label="Interactive Maps" 
          icon={<Map className="w-5 h-5" />}
          isActive={activeCategory === 'maps'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
        <CategoryButton 
          id="charts" 
          label="Charts & Graphs" 
          icon={<BarChart3 className="w-5 h-5" />}
          isActive={activeCategory === 'charts'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
        <CategoryButton 
          id="animations" 
          label="Animations & 3D" 
          icon={<PlayCircle className="w-5 h-5" />}
          isActive={activeCategory === 'animations'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
        <CategoryButton 
          id="advanced" 
          label="Advanced Analytics" 
          icon={<TrendingUp className="w-5 h-5" />}
          isActive={activeCategory === 'advanced'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
      </div>

      {/* Visualization Grid */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {visualizations[activeCategory].map((viz, index) => (
          <VizCard key={index} viz={viz} index={index} />
        ))}
      </motion.div>

      {/* Enhanced Interactive Charts Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <LineChart className="w-6 h-6 mr-2 text-green-400" />
            Interactive Ocean Data Visualization
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-ocean-300">Live Mode:</span>
              <button
                onClick={() => setLiveMode(!liveMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  liveMode ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    liveMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <select
              value={selectedFloat}
              onChange={(e) => setSelectedFloat(e.target.value)}
              className="bg-deep-700 text-white px-3 py-2 rounded border border-ocean-700/30 text-sm"
            >
              <option value="4902916">Float 4902916 (Arabian Sea)</option>
              <option value="5906467">Float 5906467 (Bay of Bengal)</option>
              <option value="2903521">Float 2903521 (Indian Ocean)</option>
            </select>
          </div>
        </div>

        {/* Ocean Data Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Temperature Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <OceanDataChart
              data={oceanData.filter(d => d.floatId === selectedFloat)}
              chartType="temperature_profile"
              title="Temperature-Depth Profile"
              subtitle="Real-time oceanographic measurements"
              height={350}
              onDataPointClick={(data) => console.log('Profile clicked:', data)}
            />
          </motion.div>

          {/* Time Series */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <OceanDataChart
              data={oceanData}
              chartType="time_series"
              parameter="temperature"
              title="Time Series Analysis"
              subtitle="Multi-parameter temporal evolution"
              height={350}
              onParameterChange={(param) => console.log('Parameter changed:', param)}
            />
          </motion.div>

          {/* Multi-Parameter Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <OceanDataChart
              data={oceanData}
              chartType="multi_parameter"
              title="Multi-Parameter Analysis"
              subtitle="Integrated oceanographic parameters"
              height={350}
            />
          </motion.div>

          {/* Correlation Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <OceanDataChart
              data={oceanData}
              chartType="correlation"
              title="Parameter Correlation"
              subtitle="Temperature vs Salinity relationships"
              height={350}
              onDataPointClick={(data) => console.log('Correlation clicked:', data)}
            />
          </motion.div>
        </div>

        {/* Chart.js Enhanced Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Temperature Trends */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <InteractiveChart
              type="line"
              data={temperatureChartData}
              title="Regional Temperature Comparison"
              description="Monthly sea surface temperature variations"
              height={300}
              animated={true}
              interactive={true}
              onDataPointClick={(data) => console.log('Temperature chart clicked:', data)}
            />
          </motion.div>

          {/* Salinity Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <InteractiveChart
              type="doughnut"
              data={salinityDistributionData}
              title="Salinity Distribution"
              description="Statistical distribution of salinity measurements"
              height={300}
              animated={true}
              interactive={true}
            />
          </motion.div>

          {/* Advanced Correlation Plot */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-2"
          >
            <InteractiveChart
              type="scatter"
              data={correlationData}
              title="Advanced Ocean Parameter Correlation"
              description="Multi-dimensional analysis of oceanographic relationships"
              height={400}
              animated={true}
              interactive={true}
              onDataPointClick={(data) => console.log('Scatter clicked:', data)}
            />
          </motion.div>
        </div>

      </div>

    </div>
  )
}

export default VisualizationHub
