import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain,
  TrendingUp,
  Layers,
  Target,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Share2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Cpu,
  Network,
  Eye,
  Sparkles
} from 'lucide-react'
import { AIModel } from '../../types'

const AIInsights: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'models' | 'patterns' | 'predictions' | 'insights'>('models')
  const [isTraining, setIsTraining] = useState(false)

  const aiModels: AIModel[] = [
    { 
      title: "Ocean Forecasting", 
      desc: "LSTM/Transformer models for spatio-temporal ocean parameter predictions", 
      status: "Training", 
      progress: 78 
    },
    { 
      title: "Anomaly Detection", 
      desc: "AI-driven identification of unusual patterns and outliers in ocean data", 
      status: "Active", 
      progress: 94 
    },
    { 
      title: "Pattern Recognition", 
      desc: "Unsupervised clustering and correlation analysis for oceanic patterns", 
      status: "Running", 
      progress: 67 
    },
    { 
      title: "Climate Impact Modeling", 
      desc: "Machine learning models for climate change impact assessment", 
      status: "Development", 
      progress: 45 
    },
    {
      title: "Biogeochemical Prediction",
      desc: "Neural networks for BGC parameter forecasting and ecosystem modeling",
      status: "Testing",
      progress: 83
    },
    {
      title: "Float Trajectory Prediction",
      desc: "Deep learning models for predicting ARGO float movement patterns",
      status: "Active",
      progress: 91
    }
  ]

  const detectedPatterns = [
    {
      id: 'warming-trend',
      title: 'Arabian Sea Warming Acceleration',
      description: 'AI detected 23% increase in warming rate over the past 18 months',
      confidence: 92,
      impactLevel: 'high',
      relatedParams: ['Temperature', 'Heat Content'],
      timeframe: 'Last 18 months',
      significance: 'Climate Change Indicator'
    },
    {
      id: 'oxygen-depletion', 
      title: 'Bay of Bengal Oxygen Minimum Zone Expansion',
      description: 'Machine learning identifies expanding OMZ affecting marine ecosystems',
      confidence: 87,
      impactLevel: 'medium',
      relatedParams: ['Dissolved Oxygen', 'pH'],
      timeframe: 'Last 2 years',
      significance: 'Ecosystem Impact'
    },
    {
      id: 'salinity-anomaly',
      title: 'Unusual Salinity Stratification Pattern',
      description: 'Novel stratification patterns detected in the Southern Indian Ocean',
      confidence: 79,
      impactLevel: 'medium',
      relatedParams: ['Salinity', 'Density'],
      timeframe: 'Last 6 months',
      significance: 'Circulation Change'
    },
    {
      id: 'chlorophyll-spike',
      title: 'Equatorial Chlorophyll Anomaly',
      description: 'Unexpected chlorophyll concentration patterns linked to upwelling changes',
      confidence: 85,
      impactLevel: 'low',
      relatedParams: ['Chlorophyll', 'Nutrients'],
      timeframe: 'Last 3 months',
      significance: 'Productivity Change'
    }
  ]

  const predictions = [
    {
      parameter: 'Sea Surface Temperature',
      prediction: '+0.8°C increase',
      timeframe: 'Next 6 months',
      confidence: 89,
      region: 'Arabian Sea',
      methodology: 'LSTM Neural Network'
    },
    {
      parameter: 'Dissolved Oxygen',
      prediction: '15% decrease in OMZ',
      timeframe: 'Next 12 months', 
      confidence: 76,
      region: 'Bay of Bengal',
      methodology: 'Random Forest Ensemble'
    },
    {
      parameter: 'Salinity Distribution',
      prediction: 'Freshening in surface layers',
      timeframe: 'Next 3 months',
      confidence: 82,
      region: 'Indian Ocean',
      methodology: 'Transformer Model'
    },
    {
      parameter: 'Chlorophyll Concentration',
      prediction: '25% bloom intensity increase',
      timeframe: 'Next monsoon season',
      confidence: 71,
      region: 'Coastal India',
      methodology: 'CNN-LSTM Hybrid'
    }
  ]

  const researchInsights = [
    {
      title: 'Ocean Heat Content Analysis',
      description: 'AI reveals accelerating heat accumulation in upper 700m layer',
      papers: 'Generated 3 research papers',
      citations: '47 citations',
      impact: 'High'
    },
    {
      title: 'Monsoon-Ocean Interaction Study',
      description: 'Machine learning uncovers new patterns in monsoon-ocean feedback loops',
      papers: 'Generated 2 research papers',
      citations: '23 citations',
      impact: 'Medium'
    },
    {
      title: 'BGC Parameter Correlations',
      description: 'Novel biogeochemical relationships discovered through AI analysis',
      papers: 'Generated 1 research paper',
      citations: '12 citations',
      impact: 'Medium'
    }
  ]

  const modelMetrics = [
    { label: 'Active Models', value: '12', icon: <Brain />, color: 'purple' },
    { label: 'Prediction Accuracy', value: '87.3%', icon: <Target />, color: 'green' },
    { label: 'Patterns Detected', value: '156', icon: <Eye />, color: 'blue' },
    { label: 'Training Hours', value: '2.4K', icon: <Clock />, color: 'orange' }
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
          ? 'bg-gradient-to-r from-pink-600 to-purple-700 text-white shadow-lg' 
          : 'bg-deep-700/50 text-ocean-300 hover:text-white hover:bg-deep-600/50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={isActive ? 'text-white' : 'text-pink-400'}>{icon}</div>
      <span>{label}</span>
    </motion.button>
  )

  const ModelCard = ({ model, index }: { model: AIModel; index: number }) => (
    <motion.div
      className="glass-morphism p-6 rounded-xl border border-ocean-700/30 hover:border-pink-500/50 transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-4">
        <Brain className="w-6 h-6 text-pink-400" />
        <span className={`text-xs px-3 py-1 rounded-full ${
          model.status === 'Active' ? 'bg-green-900/20 text-green-300' :
          model.status === 'Training' ? 'bg-yellow-900/20 text-yellow-300' :
          model.status === 'Testing' ? 'bg-blue-900/20 text-blue-300' :
          'bg-purple-900/20 text-purple-300'
        }`}>
          {model.status}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{model.title}</h3>
      <p className="text-ocean-300 text-sm mb-4">{model.desc}</p>
      
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-ocean-400">Progress</span>
          <span className="text-white">{model.progress}%</span>
        </div>
        <div className="w-full bg-deep-700 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${model.progress}%` }}
            transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button className="p-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors">
            {model.status === 'Training' ? <Pause className="w-4 h-4 text-orange-400" /> : <Play className="w-4 h-4 text-green-400" />}
          </button>
          <button className="p-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors">
            <Settings className="w-4 h-4 text-ocean-300" />
          </button>
        </div>
        <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all">
          <Eye className="w-4 h-4 inline mr-1" />
          Details
        </button>
      </div>
    </motion.div>
  )

  const PatternCard = ({ pattern, index }: { pattern: any; index: number }) => (
    <motion.div
      className={`glass-morphism p-6 rounded-xl border transition-all ${
        pattern.impactLevel === 'high' ? 'border-red-500/50' :
        pattern.impactLevel === 'medium' ? 'border-yellow-500/50' :
        'border-green-500/50'
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <AlertTriangle className={`w-6 h-6 ${
            pattern.impactLevel === 'high' ? 'text-red-400' :
            pattern.impactLevel === 'medium' ? 'text-yellow-400' :
            'text-green-400'
          }`} />
          <div>
            <h4 className="text-lg font-semibold text-white">{pattern.title}</h4>
            <span className="text-xs px-2 py-1 bg-purple-900/20 text-purple-300 rounded">
              {pattern.significance}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-white">{pattern.confidence}%</div>
          <div className="text-xs text-ocean-400">Confidence</div>
        </div>
      </div>
      
      <p className="text-ocean-300 text-sm mb-4">{pattern.description}</p>
      
      <div className="grid grid-cols-2 gap-4 text-xs mb-4">
        <div>
          <span className="text-ocean-400">Timeframe:</span>
          <div className="text-white">{pattern.timeframe}</div>
        </div>
        <div>
          <span className="text-ocean-400">Impact Level:</span>
          <div className={`font-medium ${
            pattern.impactLevel === 'high' ? 'text-red-400' :
            pattern.impactLevel === 'medium' ? 'text-yellow-400' :
            'text-green-400'
          }`}>
            {pattern.impactLevel.charAt(0).toUpperCase() + pattern.impactLevel.slice(1)}
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {pattern.relatedParams.map((param: string, i: number) => (
          <span key={i} className="text-xs px-2 py-1 bg-blue-900/20 text-blue-300 rounded">
            {param}
          </span>
        ))}
      </div>
      
      <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:shadow-lg transition-all">
        <Database className="w-4 h-4 inline mr-2" />
        Analyze Pattern
      </button>
    </motion.div>
  )

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'models':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">AI Models & Algorithms</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setIsTraining(!isTraining)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isTraining ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                  }`}
                >
                  {isTraining ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isTraining ? 'Stop Training' : 'Start Training'}</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors">
                  <RefreshCw className="w-4 h-4 text-ocean-300" />
                  <span className="text-ocean-300">Refresh</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {aiModels.map((model, index) => (
                <ModelCard key={index} model={model} index={index} />
              ))}
            </div>
          </div>
        )
        
      case 'patterns':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Detected Patterns & Anomalies</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {detectedPatterns.map((pattern, index) => (
                <PatternCard key={pattern.id} pattern={pattern} index={index} />
              ))}
            </div>
          </div>
        )
        
      case 'predictions':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">AI Predictions & Forecasts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {predictions.map((prediction, index) => (
                <motion.div
                  key={index}
                  className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                    <span className="text-xs px-2 py-1 bg-blue-900/20 text-blue-300 rounded">
                      {prediction.confidence}% confidence
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-white mb-2">{prediction.parameter}</h4>
                  <p className="text-green-400 font-medium mb-2">{prediction.prediction}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-ocean-400">Timeframe:</span>
                      <span className="text-white">{prediction.timeframe}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ocean-400">Region:</span>
                      <span className="text-white">{prediction.region}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ocean-400">Method:</span>
                      <span className="text-white">{prediction.methodology}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 h-2 bg-deep-700 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${prediction.confidence}%` }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )
        
      case 'insights':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Research Insights & Publications</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {researchInsights.map((insight, index) => (
                <motion.div
                  key={index}
                  className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                    <span className={`text-xs px-2 py-1 rounded ${
                      insight.impact === 'High' ? 'bg-red-900/20 text-red-400' :
                      insight.impact === 'Medium' ? 'bg-yellow-900/20 text-yellow-400' :
                      'bg-green-900/20 text-green-400'
                    }`}>
                      {insight.impact} Impact
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-white mb-3">{insight.title}</h4>
                  <p className="text-ocean-300 text-sm mb-4">{insight.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-ocean-400">Papers:</span>
                      <span className="text-white">{insight.papers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ocean-400">Citations:</span>
                      <span className="text-white">{insight.citations}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <button className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-2 rounded-lg hover:shadow-lg transition-all">
                      View Paper
                    </button>
                    <button className="p-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors">
                      <Share2 className="w-4 h-4 text-ocean-300" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Cross-Dataset Fusion Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
                <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Layers className="w-6 h-6 mr-2 text-purple-400" />
                  Cross-Dataset Fusion
                </h4>
                <p className="text-ocean-300 mb-4">AI-powered integration of ARGO with satellite and other ocean datasets for comprehensive analysis</p>
                <div className="space-y-3">
                  {['ARGO + Satellite SST', 'ARGO + Altimetry', 'ARGO + Ocean Color', 'ARGO + Reanalysis'].map((dataset, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-deep-700/50 rounded">
                      <span className="text-white text-sm">{dataset}</span>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg hover:shadow-lg transition-all">
                  <Network className="w-4 h-4 inline mr-2" />
                  Fusion Analytics
                </button>
              </div>
              
              <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
                <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Cpu className="w-6 h-6 mr-2 text-blue-400" />
                  AutoML Pipeline
                </h4>
                <p className="text-ocean-300 mb-4">Automated machine learning pipeline for discovering new patterns and relationships in ocean data</p>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-ocean-400">Models Tested:</span>
                    <span className="text-white">247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ocean-400">Best Accuracy:</span>
                    <span className="text-white">94.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ocean-400">Features Generated:</span>
                    <span className="text-white">1,245</span>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 rounded-lg hover:shadow-lg transition-all">
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  Run AutoML
                </button>
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
            <Brain className="w-8 h-8 mr-3 text-pink-500" />
            AI & Machine Learning Insights
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-pink-400">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">AI Models Active</span>
          </div>
        </div>
      </div>

      {/* Model Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modelMetrics.map((metric, index) => (
          <motion.div
            key={index}
            className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`text-${metric.color}-400`}>{metric.icon}</div>
              <div className={`w-2 h-2 bg-${metric.color}-400 rounded-full animate-pulse`}></div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
            <p className="text-ocean-300 text-sm">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Category Navigation */}
      <div className="flex flex-wrap gap-4">
        <CategoryButton 
          id="models" 
          label="AI Models" 
          icon={<Brain className="w-5 h-5" />}
          isActive={activeCategory === 'models'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
        <CategoryButton 
          id="patterns" 
          label="Pattern Detection" 
          icon={<Eye className="w-5 h-5" />}
          isActive={activeCategory === 'patterns'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
        <CategoryButton 
          id="predictions" 
          label="Predictions" 
          icon={<TrendingUp className="w-5 h-5" />}
          isActive={activeCategory === 'predictions'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
        <CategoryButton 
          id="insights" 
          label="Research Insights" 
          icon={<Sparkles className="w-5 h-5" />}
          isActive={activeCategory === 'insights'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
      </div>

      {/* Category Content */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderCategoryContent()}
      </motion.div>
    </div>
  )
}

export default AIInsights
