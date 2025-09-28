import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Database, 
  Upload, 
  Layers, 
  Brain, 
  Zap, 
  FileText, 
  PlayCircle, 
  Shield,
  Activity,
  CheckCircle
} from 'lucide-react'
import { FeatureCard } from '../../types'

const DataHandling: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ingestion' | 'storage' | 'processing' | 'apis'>('ingestion')
  
  const dataFeatures: FeatureCard[] = [
    { 
      title: "ARGO NetCDF Ingestion", 
      desc: "Automated daily ingestion from GDAC servers with real-time monitoring", 
      status: "Active", 
      icon: <Upload className="w-5 h-5" />, 
      color: "blue",
      progress: 98
    },
    { 
      title: "Hybrid Storage Architecture", 
      desc: "PostgreSQL + Parquet + FAISS optimization for multi-scale queries", 
      status: "Optimized", 
      icon: <Layers className="w-5 h-5" />, 
      color: "green",
      progress: 95
    },
    { 
      title: "RAG Pipeline", 
      desc: "LLM + MCP integration for natural language ocean data queries", 
      status: "AI-Powered", 
      icon: <Brain className="w-5 h-5" />, 
      color: "purple",
      progress: 87
    },
    { 
      title: "Redis Caching Layer", 
      desc: "High-speed data access with intelligent cache invalidation", 
      status: "Fast", 
      icon: <Zap className="w-5 h-5" />, 
      color: "yellow",
      progress: 92
    },
    { 
      title: "Vector Embeddings", 
      desc: "FAISS/Chroma vector storage for semantic data discovery", 
      status: "Indexed", 
      icon: <Database className="w-5 h-5" />, 
      color: "indigo",
      progress: 89
    },
    { 
      title: "Multimodal Input Support", 
      desc: "Coordinates, shapefiles, CSV, and voice input processing", 
      status: "Flexible", 
      icon: <FileText className="w-5 h-5" />, 
      color: "teal",
      progress: 85
    }
  ]

  const processingStats = [
    { label: "Daily Data Volume", value: "2.4 TB", trend: "+12%", icon: <Database /> },
    { label: "Processing Speed", value: "15ms avg", trend: "-8%", icon: <Zap /> },
    { label: "Query Success Rate", value: "99.7%", trend: "+0.2%", icon: <CheckCircle /> },
    { label: "Active Connections", value: "1,247", trend: "+24%", icon: <Activity /> }
  ]

  const ingestionSources = [
    { name: "ARGO GDAC Primary", status: "active", lastSync: "2 min ago", floats: 3847 },
    { name: "ARGO GDAC Mirror", status: "standby", lastSync: "5 min ago", floats: 3847 },
    { name: "BGC Extensions", status: "active", lastSync: "1 min ago", floats: 1234 },
    { name: "Deep ARGO", status: "active", lastSync: "3 min ago", floats: 456 }
  ]

  const TabButton = ({ id, label, isActive, onClick }: { 
    id: string; 
    label: string; 
    isActive: boolean; 
    onClick: (id: string) => void 
  }) => (
    <motion.button
      onClick={() => onClick(id)}
      className={`px-6 py-3 rounded-lg font-medium transition-all ${
        isActive 
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
          : 'bg-deep-700/50 text-ocean-300 hover:text-white hover:bg-deep-600/50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {label}
    </motion.button>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ingestion':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Data Ingestion Pipeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ingestionSources.map((source, index) => (
                <motion.div
                  key={index}
                  className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-white">{source.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      source.status === 'active' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                    }`}>
                      {source.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-ocean-300">
                      <span>Last Sync:</span>
                      <span className="text-white">{source.lastSync}</span>
                    </div>
                    <div className="flex justify-between text-ocean-300">
                      <span>Active Floats:</span>
                      <span className="text-white">{source.floats.toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )
      
      case 'storage':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Storage Architecture</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
                <Database className="w-8 h-8 text-blue-400 mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">PostgreSQL</h4>
                <p className="text-ocean-300 text-sm mb-4">Primary relational storage for structured ARGO metadata and profiles</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-ocean-400">Size:</span>
                    <span className="text-white">847 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ocean-400">Tables:</span>
                    <span className="text-white">23</span>
                  </div>
                </div>
              </div>
              
              <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
                <Layers className="w-8 h-8 text-green-400 mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">Parquet Files</h4>
                <p className="text-ocean-300 text-sm mb-4">Columnar storage for analytical queries and time-series data</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-ocean-400">Size:</span>
                    <span className="text-white">1.2 TB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ocean-400">Partitions:</span>
                    <span className="text-white">3,847</span>
                  </div>
                </div>
              </div>
              
              <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
                <Brain className="w-8 h-8 text-purple-400 mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">Vector Store</h4>
                <p className="text-ocean-300 text-sm mb-4">FAISS embeddings for semantic search and AI-powered queries</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-ocean-400">Vectors:</span>
                    <span className="text-white">2.4M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ocean-400">Dimensions:</span>
                    <span className="text-white">1,536</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'processing':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Real-time Processing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processingStats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-blue-400">{stat.icon}</div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      stat.trend.startsWith('+') ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                    }`}>
                      {stat.trend}
                    </span>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-1">{stat.value}</h4>
                  <p className="text-ocean-300 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )
      
      case 'apis':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">API Endpoints & Integration</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
                <h4 className="text-lg font-semibold text-white mb-4">RESTful APIs</h4>
                <div className="space-y-3">
                  {[
                    { endpoint: '/api/floats', method: 'GET', desc: 'Retrieve float data with filters' },
                    { endpoint: '/api/profiles', method: 'GET', desc: 'Get temperature/salinity profiles' },
                    { endpoint: '/api/search', method: 'POST', desc: 'Natural language search queries' },
                    { endpoint: '/api/export', method: 'GET', desc: 'Export data in various formats' }
                  ].map((api, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-deep-700/50 rounded-lg">
                      <div>
                        <span className="text-white font-mono text-sm">{api.endpoint}</span>
                        <p className="text-ocean-300 text-xs mt-1">{api.desc}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        api.method === 'GET' ? 'bg-blue-900/30 text-blue-400' : 'bg-green-900/30 text-green-400'
                      }`}>
                        {api.method}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
                <h4 className="text-lg font-semibold text-white mb-4">GraphQL Interface</h4>
                <div className="bg-deep-700/50 p-4 rounded-lg font-mono text-sm text-ocean-200">
                  <div className="text-blue-400">query</div>
                  <div className="ml-2 text-white">getFloatData(</div>
                  <div className="ml-4 text-green-400">region: BoundingBox</div>
                  <div className="ml-4 text-green-400">timeRange: DateRange</div>
                  <div className="ml-4 text-green-400">parameters: [String!]</div>
                  <div className="ml-2 text-white">) {`{`}</div>
                  <div className="ml-4 text-yellow-400">id temperature salinity</div>
                  <div className="ml-4 text-yellow-400">coordinates timestamp</div>
                  <div className="ml-2 text-white">{`}`}</div>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Database className="w-8 h-8 mr-3 text-blue-500" />
            Data Handling & Infrastructure
          </h2>
          <p className="text-ocean-300">Robust data ingestion, storage, and processing pipeline for ARGO ocean data</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">All Systems Operational</span>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {dataFeatures.map((feature, index) => (
          <motion.div
            key={index}
            className="glass-morphism p-6 rounded-xl border border-ocean-700/30 hover:border-blue-500/50 transition-all"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`text-${feature.color}-400`}>{feature.icon}</div>
              <span className={`text-xs px-3 py-1 rounded-full bg-${feature.color}-900/20 text-${feature.color}-300`}>
                {feature.status}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-ocean-300 text-sm mb-4">{feature.desc}</p>
            
            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-ocean-400">Performance</span>
                <span className="text-white">{feature.progress}%</span>
              </div>
              <div className="w-full bg-deep-700 rounded-full h-2">
                <motion.div 
                  className={`bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-600 h-2 rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${feature.progress}%` }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Advanced Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <PlayCircle className="w-6 h-6 mr-2 text-blue-400" />
            Voice-Enabled Assistant
          </h3>
          <p className="text-ocean-300 mb-6">Natural language voice queries for hands-free ocean data exploration with advanced speech recognition.</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-xs text-ocean-400">Languages Supported</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">95%</div>
              <div className="text-xs text-ocean-400">Accuracy Rate</div>
            </div>
          </div>
          <motion.button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            Start Voice Query
          </motion.button>
        </motion.div>
        
        <motion.div
          className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-green-400" />
            Data Transparency & Lineage
          </h3>
          <p className="text-ocean-300 mb-6">Complete traceability of data sources, processing steps, and methodology for full transparency.</p>
          <div className="space-y-3 mb-6">
            {['Source Attribution', 'Processing History', 'Quality Metrics', 'Version Control'].map((item, i) => (
              <div key={i} className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-ocean-200">{item}</span>
              </div>
            ))}
          </div>
          <motion.button 
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Shield className="w-4 h-4 mr-2" />
            View Data Lineage
          </motion.button>
        </motion.div>
      </div>

      {/* Detailed Tabs */}
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <TabButton 
            id="ingestion" 
            label="Data Ingestion" 
            isActive={activeTab === 'ingestion'} 
            onClick={(id) => setActiveTab(id as any)} 
          />
          <TabButton 
            id="storage" 
            label="Storage Architecture" 
            isActive={activeTab === 'storage'} 
            onClick={(id) => setActiveTab(id as any)} 
          />
          <TabButton 
            id="processing" 
            label="Processing Pipeline" 
            isActive={activeTab === 'processing'} 
            onClick={(id) => setActiveTab(id as any)} 
          />
          <TabButton 
            id="apis" 
            label="APIs & Integration" 
            isActive={activeTab === 'apis'} 
            onClick={(id) => setActiveTab(id as any)} 
          />
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-morphism p-8 rounded-xl border border-ocean-700/30"
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  )
}

export default DataHandling
