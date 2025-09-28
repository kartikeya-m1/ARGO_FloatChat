import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Sparkles,
  Loader,
  X,
  Map,
  BarChart3,
  Activity,
  Download,
  Zap,
  Waves
} from 'lucide-react'
import { 
  useAIModels, 
  usePatternDetection, 
  useOceanPredictions,
  formatEconomicImpact,
  getSeverityColor,
  getConfidenceColor 
} from '../../hooks/useAdvancedAnalytics'

const EnhancedAIInsights: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'models' | 'patterns' | 'predictions' | 'insights'>('models')
  const [isTraining, setIsTraining] = useState(false)
  const [selectedModel, setSelectedModel] = useState<any>(null)
  const [modelStates, setModelStates] = useState<{[key: string]: {status: string, progress: number}}>({})
  const [showModelDetails, setShowModelDetails] = useState(false)

  // Real data hooks
  const { models, loading: modelsLoading, error: modelsError, summary, refetch: refetchModels } = useAIModels()
  const { patterns, loading: patternsLoading, error: patternsError, refetch: refetchPatterns } = usePatternDetection()
  const { predictions, loading: predictionsLoading, error: predictionsError, refetch: refetchPredictions } = useOceanPredictions()

  // Model control functions
  const toggleModelTraining = (modelId: string, currentStatus: string) => {
    setModelStates(prev => ({
      ...prev,
      [modelId]: {
        status: currentStatus === 'training' ? 'active' : 'training',
        progress: prev[modelId]?.progress || 0
      }
    }))
    
    // Simulate progress updates
    if (currentStatus !== 'training') {
      const interval = setInterval(() => {
        setModelStates(current => {
          const currentProgress = current[modelId]?.progress || 0
          if (currentProgress >= 100) {
            clearInterval(interval)
            return {
              ...current,
              [modelId]: { ...current[modelId], status: 'active' }
            }
          }
          return {
            ...current,
            [modelId]: { 
              ...current[modelId], 
              progress: Math.min(100, currentProgress + Math.random() * 5)
            }
          }
        })
      }, 1000)
    }
  }

  const openModelDetails = (model: any) => {
    setSelectedModel(model)
    setShowModelDetails(true)
  }

  const getModelState = (model: any) => {
    const state = modelStates[model.model_id]
    return state ? { 
      status: state.status, 
      progress: state.progress 
    } : { 
      status: model.status, 
      progress: model.progress 
    }
  }

  const modelMetrics = [
    { label: 'Active Models', value: summary?.active_models?.toString() || '0', icon: <Brain />, color: 'purple' },
    { label: 'Prediction Accuracy', value: summary?.average_accuracy ? `${summary.average_accuracy.toFixed(1)}%` : 'N/A', icon: <Target />, color: 'green' },
    { label: 'Patterns Detected', value: patterns?.length?.toString() || '0', icon: <Eye />, color: 'blue' },
    { label: 'Data Coverage', value: summary?.data_quality?.floats_count ? `${summary.data_quality.floats_count}` : '0', icon: <Clock />, color: 'orange' }
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

  const ModelCard = ({ model, index }: { model: any; index: number }) => (
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
          getModelState(model).status === 'active' ? 'bg-green-900/20 text-green-300' :
          getModelState(model).status === 'training' ? 'bg-yellow-900/20 text-yellow-300' :
          getModelState(model).status === 'testing' ? 'bg-blue-900/20 text-blue-300' :
          getModelState(model).status === 'running' ? 'bg-purple-900/20 text-purple-300' :
          'bg-gray-900/20 text-gray-300'
        }`}>
          {getModelState(model).status}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{model.title}</h3>
      <p className="text-ocean-300 text-sm mb-4">{model.description}</p>
      
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-ocean-400">Progress</span>
          <span className="text-white">{getModelState(model).progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-deep-700 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${getModelState(model).progress}%` }}
            transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
          />
        </div>
      </div>
      
      {model.accuracy && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-ocean-400">Accuracy</span>
            <span className={getConfidenceColor(model.accuracy)}>{model.accuracy.toFixed(1)}%</span>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <motion.button 
            className="p-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors"
            onClick={() => toggleModelTraining(model.model_id, getModelState(model).status)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={getModelState(model).status === 'training' ? 'Stop Training' : 'Start Training'}
          >
            {getModelState(model).status === 'training' ? 
              <Pause className="w-4 h-4 text-red-400" /> : 
              <Play className="w-4 h-4 text-green-400" />
            }
          </motion.button>
          <motion.button 
            className="p-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Model Settings"
          >
            <Settings className="w-4 h-4 text-ocean-300" />
          </motion.button>
        </div>
        <motion.button 
          className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
          onClick={() => openModelDetails(model)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Eye className="w-4 h-4 inline mr-1" />
          Details
        </motion.button>
      </div>
    </motion.div>
  )

  const PatternCard = ({ pattern, index }: { pattern: any; index: number }) => (
    <motion.div
      className={`glass-morphism p-6 rounded-xl border transition-all ${
        pattern.impact_level === 'high' ? 'border-red-500/50' :
        pattern.impact_level === 'medium' ? 'border-yellow-500/50' :
        'border-green-500/50'
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <AlertTriangle className={getSeverityColor(pattern.impact_level)} />
          <div>
            <h4 className="text-lg font-semibold text-white">{pattern.title}</h4>
            <span className="text-xs px-2 py-1 bg-purple-900/20 text-purple-300 rounded">
              {pattern.significance}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-sm font-medium ${getConfidenceColor(pattern.confidence)}`}>
            {pattern.confidence}%
          </div>
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
          <div className={`font-medium ${getSeverityColor(pattern.impact_level)}`}>
            {pattern.impact_level.charAt(0).toUpperCase() + pattern.impact_level.slice(1)}
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {pattern.related_parameters.map((param: string, i: number) => (
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
                <button 
                  onClick={refetchModels}
                  className="flex items-center space-x-2 px-4 py-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors"
                  disabled={modelsLoading}
                >
                  <RefreshCw className={`w-4 h-4 text-ocean-300 ${modelsLoading ? 'animate-spin' : ''}`} />
                  <span className="text-ocean-300">Refresh</span>
                </button>
              </div>
            </div>

            {modelsLoading && (
              <div className="flex items-center justify-center h-64">
                <div className="flex items-center space-x-2">
                  <Loader className="w-6 h-6 text-pink-400 animate-spin" />
                  <span className="text-ocean-300">Loading AI models...</span>
                </div>
              </div>
            )}

            {modelsError && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <div className="text-red-400 mb-2">Error loading AI models</div>
                  <div className="text-ocean-400 text-sm">{modelsError}</div>
                </div>
              </div>
            )}

            {!modelsLoading && !modelsError && models && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {models.map((model, index) => (
                  <ModelCard key={model.model_id} model={model} index={index} />
                ))}
              </div>
            )}
          </div>
        )
        
      case 'patterns':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Detected Patterns & Anomalies</h3>
              <button 
                onClick={refetchPatterns}
                className="flex items-center space-x-2 px-4 py-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors"
                disabled={patternsLoading}
              >
                <RefreshCw className={`w-4 h-4 text-ocean-300 ${patternsLoading ? 'animate-spin' : ''}`} />
                <span className="text-ocean-300">Refresh</span>
              </button>
            </div>

            {/* Pattern Analytics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="glass-morphism p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">{patterns?.length || 0}</div>
                    <div className="text-ocean-300 text-sm">Active Patterns</div>
                  </div>
                  <Eye className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              <div className="glass-morphism p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">2,801</div>
                    <div className="text-ocean-300 text-sm">Data Sources</div>
                  </div>
                  <Database className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <div className="glass-morphism p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">180</div>
                    <div className="text-ocean-300 text-sm">Days Analysis</div>
                  </div>
                  <Clock className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <div className="glass-morphism p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">Live</div>
                    <div className="text-ocean-300 text-sm">Detection</div>
                  </div>
                  <Activity className="w-8 h-8 text-orange-400" />
                </div>
              </div>
            </div>

            {patternsLoading && (
              <div className="flex items-center justify-center h-64">
                <div className="flex items-center space-x-2">
                  <Loader className="w-6 h-6 text-purple-400 animate-spin" />
                  <span className="text-ocean-300">Analyzing patterns...</span>
                </div>
              </div>
            )}

            {patternsError && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <div className="text-red-400 mb-2">Error loading patterns</div>
                  <div className="text-ocean-400 text-sm">{patternsError}</div>
                </div>
              </div>
            )}

            {!patternsLoading && !patternsError && patterns && (
              <>
                {/* Pattern Visualization Map */}
                <div className="glass-morphism p-6 rounded-xl mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white">Pattern Distribution Map</h4>
                    <Map className="w-5 h-5 text-ocean-400" />
                  </div>
                  <div className="bg-gradient-to-br from-deep-900 to-deep-800 rounded-lg p-8 border border-ocean-700/30 min-h-[200px] flex items-center justify-center">
                    <div className="text-center">
                      <Waves className="w-16 h-16 text-ocean-400 mx-auto mb-4" />
                      <div className="text-white font-semibold">Indian Ocean Pattern Analysis</div>
                      <div className="text-ocean-300 text-sm mt-2">
                        Real-time oceanographic pattern detection across {patterns.length} identified anomalies
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="bg-deep-800/50 p-3 rounded border border-red-500/20">
                          <div className="text-red-400 font-semibold">High Impact</div>
                          <div className="text-white text-lg">{patterns.filter(p => p.impact_level === 'high').length}</div>
                        </div>
                        <div className="bg-deep-800/50 p-3 rounded border border-yellow-500/20">
                          <div className="text-yellow-400 font-semibold">Medium Impact</div>
                          <div className="text-white text-lg">{patterns.filter(p => p.impact_level === 'medium').length}</div>
                        </div>
                        <div className="bg-deep-800/50 p-3 rounded border border-green-500/20">
                          <div className="text-green-400 font-semibold">Low Impact</div>
                          <div className="text-white text-lg">{patterns.filter(p => p.impact_level === 'low').length}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pattern Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {patterns.map((pattern, index) => (
                    <PatternCard key={pattern.pattern_id} pattern={pattern} index={index} />
                  ))}
                </div>
              </>
            )}

            {!patternsLoading && !patternsError && patterns && patterns.length === 0 && (
              <div className="text-center py-12 text-ocean-400">
                <Eye className="w-12 h-12 mx-auto mb-4" />
                <div>No anomalous patterns detected</div>
                <div className="text-sm mt-2">Ocean conditions appear normal</div>
              </div>
            )}
          </div>
        )
        
      case 'predictions':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">AI Predictions & Forecasts</h3>
              <button 
                onClick={refetchPredictions}
                className="flex items-center space-x-2 px-4 py-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors"
                disabled={predictionsLoading}
              >
                <RefreshCw className={`w-4 h-4 text-ocean-300 ${predictionsLoading ? 'animate-spin' : ''}`} />
                <span className="text-ocean-300">Refresh</span>
              </button>
            </div>

            {/* Prediction Analytics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="glass-morphism p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">{predictions?.length || 0}</div>
                    <div className="text-ocean-300 text-sm">Active Forecasts</div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <div className="glass-morphism p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {predictions ? 
                        Math.round(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length) || 0 
                        : 0
                      }%
                    </div>
                    <div className="text-ocean-300 text-sm">Avg Confidence</div>
                  </div>
                  <Target className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <div className="glass-morphism p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">90</div>
                    <div className="text-ocean-300 text-sm">Days Forecast</div>
                  </div>
                  <Clock className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              <div className="glass-morphism p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">6</div>
                    <div className="text-ocean-300 text-sm">AI Models</div>
                  </div>
                  <Brain className="w-8 h-8 text-orange-400" />
                </div>
              </div>
            </div>

            {predictionsLoading && (
              <div className="flex items-center justify-center h-64">
                <div className="flex items-center space-x-2">
                  <Loader className="w-6 h-6 text-blue-400 animate-spin" />
                  <span className="text-ocean-300">Generating predictions...</span>
                </div>
              </div>
            )}

            {predictionsError && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <div className="text-red-400 mb-2">Error loading predictions</div>
                  <div className="text-ocean-400 text-sm">{predictionsError}</div>
                </div>
              </div>
            )}

            {!predictionsLoading && !predictionsError && predictions && (
              <>
                {/* Prediction Forecast Chart */}
                <div className="glass-morphism p-6 rounded-xl mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white">Ocean Forecast Timeline</h4>
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="bg-gradient-to-r from-deep-900 via-deep-800 to-deep-900 rounded-lg p-6 border border-ocean-700/30 min-h-[250px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {predictions.slice(0, 6).map((prediction, index) => (
                        <div key={index} className="bg-deep-800/50 p-4 rounded-lg border border-ocean-700/20">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-ocean-300 text-xs font-medium">{prediction.parameter}</div>
                            <div className={`text-xs px-2 py-1 rounded ${getConfidenceColor(prediction.confidence)} bg-opacity-20`}>
                              {prediction.confidence}%
                            </div>
                          </div>
                          <div className="text-white font-semibold text-sm mb-2">{prediction.prediction}</div>
                          <div className="text-ocean-400 text-xs">{prediction.timeframe}</div>
                          <div className="mt-3 h-1 bg-deep-700 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${prediction.confidence}%` }}
                              transition={{ delay: index * 0.1, duration: 1 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Detailed Prediction Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {predictions.map((prediction, index) => (
                    <motion.div
                      key={index}
                      className="glass-morphism p-6 rounded-xl border border-ocean-700/30 hover:border-blue-500/50 transition-all"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <TrendingUp className="w-6 h-6 text-blue-400" />
                        <span className={`text-xs px-2 py-1 rounded ${getConfidenceColor(prediction.confidence)} bg-opacity-20`}>
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
                          <span className="text-white text-xs">{prediction.methodology}</span>
                        </div>
                        {prediction.historical_accuracy && (
                          <div className="flex justify-between">
                            <span className="text-ocean-400">Historical Accuracy:</span>
                            <span className="text-white">{prediction.historical_accuracy.toFixed(1)}%</span>
                          </div>
                        )}
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
              </>
            )}
          </div>
        )
        
      case 'insights':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Research Insights & Analytics</h3>
            
            {/* Data Quality Insights */}
            {summary?.data_quality && (
              <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
                <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Database className="w-6 h-6 mr-2 text-blue-400" />
                  Data Quality Analysis
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{summary.data_quality.floats_count}</div>
                    <div className="text-xs text-ocean-400">Total Floats</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{summary.data_quality.measurements_count}</div>
                    <div className="text-xs text-ocean-400">Measurements</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{summary.data_quality.temporal_coverage_months}</div>
                    <div className="text-xs text-ocean-400">Months Coverage</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {summary.data_quality.parameter_coverage.temperature.toFixed(1)}%
                    </div>
                    <div className="text-xs text-ocean-400">Temp Coverage</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-3 bg-deep-700/50 rounded-lg">
                    <div className="text-green-400 font-bold">{summary.data_quality.parameter_coverage.temperature.toFixed(1)}%</div>
                    <div className="text-ocean-400">Temperature</div>
                  </div>
                  <div className="text-center p-3 bg-deep-700/50 rounded-lg">
                    <div className="text-blue-400 font-bold">{summary.data_quality.parameter_coverage.salinity.toFixed(1)}%</div>
                    <div className="text-ocean-400">Salinity</div>
                  </div>
                  <div className="text-center p-3 bg-deep-700/50 rounded-lg">
                    <div className="text-purple-400 font-bold">{summary.data_quality.parameter_coverage.pressure.toFixed(1)}%</div>
                    <div className="text-ocean-400">Pressure</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Cross-Dataset Fusion Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <span className="text-white">{models?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ocean-400">Best Accuracy:</span>
                    <span className="text-white">{summary?.average_accuracy ? `${summary.average_accuracy.toFixed(1)}%` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ocean-400">Active Features:</span>
                    <span className="text-white">{summary?.total_models || 0}</span>
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

      {/* Model Details Modal */}
      <AnimatePresence>
        {showModelDetails && selectedModel && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModelDetails(false)}
          >
            <motion.div
              className="bg-gradient-to-br from-deep-800 to-deep-900 rounded-2xl border border-ocean-700/30 max-w-4xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-ocean-700/30">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedModel.title}</h2>
                  <p className="text-ocean-300 mt-1">{selectedModel.description}</p>
                </div>
                <button
                  onClick={() => setShowModelDetails(false)}
                  className="p-2 hover:bg-deep-700/50 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-ocean-300" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Model Performance Chart */}
                  <div className="glass-morphism p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Performance Metrics</h3>
                      <BarChart3 className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-ocean-300">Accuracy</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-deep-700 rounded-full">
                            <div 
                              className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                              style={{ width: `${selectedModel.accuracy || 0}%` }}
                            />
                          </div>
                          <span className="text-white">{(selectedModel.accuracy || 0).toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-ocean-300">Progress</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-deep-700 rounded-full">
                            <div 
                              className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                              style={{ width: `${getModelState(selectedModel).progress}%` }}
                            />
                          </div>
                          <span className="text-white">{getModelState(selectedModel).progress.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-ocean-300">Parameters</span>
                        <span className="text-white">{(selectedModel.parameters_count || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Training History */}
                  <div className="glass-morphism p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Training History</h3>
                      <Activity className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-ocean-300">Last Trained</span>
                        <span className="text-white">
                          {selectedModel.last_trained 
                            ? new Date(selectedModel.last_trained).toLocaleDateString() 
                            : 'N/A'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ocean-300">Status</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          getModelState(selectedModel).status === 'active' ? 'bg-green-900/20 text-green-300' :
                          getModelState(selectedModel).status === 'training' ? 'bg-yellow-900/20 text-yellow-300' :
                          'bg-blue-900/20 text-blue-300'
                        }`}>
                          {getModelState(selectedModel).status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ocean-300">Model ID</span>
                        <span className="text-white font-mono text-xs">{selectedModel.model_id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Live Data Visualization */}
                  <div className="lg:col-span-2 glass-morphism p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Live Data Analysis</h3>
                      <Waves className="w-5 h-5 text-ocean-400" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-deep-800 p-4 rounded-lg border border-ocean-700/30">
                        <div className="text-ocean-300 text-sm mb-1">Data Points</div>
                        <div className="text-2xl font-bold text-white">85,660+</div>
                        <div className="text-green-400 text-xs">Real ARGO data</div>
                      </div>
                      <div className="bg-deep-800 p-4 rounded-lg border border-ocean-700/30">
                        <div className="text-ocean-300 text-sm mb-1">Floats Coverage</div>
                        <div className="text-2xl font-bold text-white">2,801</div>
                        <div className="text-blue-400 text-xs">Indian Ocean</div>
                      </div>
                      <div className="bg-deep-800 p-4 rounded-lg border border-ocean-700/30">
                        <div className="text-ocean-300 text-sm mb-1">Update Rate</div>
                        <div className="text-2xl font-bold text-white">Real-time</div>
                        <div className="text-purple-400 text-xs">Live processing</div>
                      </div>
                    </div>
                  </div>

                  {/* Model Actions */}
                  <div className="lg:col-span-2 flex flex-wrap gap-4">
                    <motion.button
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Download className="w-4 h-4" />
                      <span>Export Model</span>
                    </motion.button>
                    <motion.button
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Zap className="w-4 h-4" />
                      <span>Optimize</span>
                    </motion.button>
                    <motion.button
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:shadow-lg transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleModelTraining(selectedModel.model_id, getModelState(selectedModel).status)}
                    >
                      {getModelState(selectedModel).status === 'training' ? 
                        <><Pause className="w-4 h-4" /><span>Stop Training</span></> :
                        <><Play className="w-4 h-4" /><span>Start Training</span></>
                      }
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EnhancedAIInsights
