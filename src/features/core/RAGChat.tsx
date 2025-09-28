import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { 
  Send, 
  User, 
  Loader, 
  Sparkles, 
  BarChart3,
  Mic,
  MicOff,
  Download,
  Star,
  Clock,
  MessageSquare,
  Brain,
  Database,
  Map,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Activity,
  CheckCircle,
  AlertCircle,
  Code,
  Layers,
  HelpCircle,
  BookOpen,
  Globe,
  RefreshCw
} from 'lucide-react'
import InteractiveChart from '../../components/charts/InteractiveChart'
import { useRAGChat, useOceanMap } from '../../hooks/useArgoData'

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
})

const RAGChat: React.FC = () => {
  const { messages, loading, error, sendMessage, clearMessages } = useRAGChat()
  const { mapData, loading: mapLoading, refetch: refetchMapData } = useOceanMap({})
  const [inputValue, setInputValue] = useState('')
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'sources' | 'history' | 'settings'>('chat')
  const [rightPanelView, setRightPanelView] = useState<'map' | 'chart'>('map')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const suggestedQueries = [
    "What are the temperature anomalies in the Arabian Sea this year?",
    "How many active ARGO floats are currently deployed globally?",
    "Show me salinity profiles by depth in tropical regions",
    "What is the relationship between ocean temperature and depth?",
    "Find floats with biogeochemical measurements in the Indian Ocean",
    "Explain how ARGO floats measure ocean parameters"
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return
    
    await sendMessage(inputValue)
    setInputValue('')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const MessageBubble = ({ message }: { message: any }) => (
    <motion.div
      className={`flex mb-6 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`flex max-w-5xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          message.type === 'user' 
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 ml-3' 
            : 'bg-gradient-to-r from-purple-500 to-purple-600 mr-3'
        }`}>
          {message.type === 'user' ? 
            <User className="w-5 h-5 text-white" /> : 
            <Brain className="w-5 h-5 text-white" />
          }
        </div>
        
        <div className={`px-5 py-4 rounded-2xl ${
          message.type === 'user' 
            ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white' 
            : 'glass-morphism text-white border border-ocean-700/30'
        }`}>
          <p className="text-sm leading-relaxed mb-2">{message.message}</p>

          {/* RAG Response Details */}
          {message.type === 'assistant' && message.result && (
            <div className="mt-4 space-y-4">
              
              {/* Confidence Score */}
              {message.result.confidence && (
                <div className="flex items-center space-x-2 text-xs">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-ocean-300">Confidence: {message.result.confidence}%</span>
                  <div className={`w-2 h-2 rounded-full ${
                    message.result.confidence > 80 ? 'bg-green-400' : 
                    message.result.confidence > 60 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}></div>
                </div>
              )}

              {/* Data Visualization */}
              {message.result.data && message.result.data.length > 0 && (
                <motion.div 
                  className="mt-4 p-4 bg-deep-700/50 rounded-lg border border-ocean-600/30"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Database className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-ocean-300">
                        Query Results ({message.result.rowCount} rows)
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-ocean-400 hover:text-ocean-300 text-xs px-2 py-1 bg-deep-600/50 rounded">
                        <Eye className="w-3 h-3" />
                      </button>
                      <button className="text-ocean-400 hover:text-ocean-300 text-xs px-2 py-1 bg-deep-600/50 rounded">
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Data Table Preview */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-ocean-600/30">
                          {message.result.columns?.slice(0, 4).map((col: string, i: number) => (
                            <th key={i} className="text-left py-2 px-3 text-ocean-300">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {message.result.data.slice(0, 3).map((row: any, i: number) => (
                          <tr key={i} className="border-b border-ocean-700/20">
                            {message.result.columns?.slice(0, 4).map((col: string, j: number) => (
                              <td key={j} className="py-2 px-3 text-ocean-200">
                                {typeof row[col] === 'number' ? row[col].toFixed(2) : String(row[col] || '-').slice(0, 20)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* Generated SQL Query */}
              {message.result.generatedSQL && (
                <motion.div 
                  className="mt-4 bg-gray-900 rounded-lg border border-gray-700 overflow-hidden"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                    <div className="flex items-center space-x-2">
                      <Code className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-300">Generated SQL</span>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(message.result.generatedSQL)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                      {message.result.generatedSQL}
                    </pre>
                  </div>
                </motion.div>
              )}

              {/* Sources and Retrieved Documents */}
              {message.result.retrievedDocs && message.result.retrievedDocs.length > 0 && (
                <div className="mt-4 p-3 bg-deep-700/30 rounded-lg border border-ocean-600/20">
                  <div className="flex items-center space-x-2 mb-3">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-ocean-300">Knowledge Sources Used</span>
                  </div>
                  <div className="space-y-2">
                    {message.result.retrievedDocs.slice(0, 3).map((doc: any, i: number) => (
                      <div key={i} className="flex items-start space-x-2 text-xs">
                        <div className={`w-2 h-2 rounded-full mt-1 ${
                          doc.type === 'schema' ? 'bg-blue-400' :
                          doc.type === 'data' ? 'bg-green-400' :
                          doc.type === 'documentation' ? 'bg-yellow-400' :
                          'bg-purple-400'
                        }`}></div>
                        <div>
                          <span className="text-ocean-300 capitalize">{doc.type}: </span>
                          <span className="text-ocean-200">{doc.content}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up Questions */}
              {message.result.followUpQuestions && message.result.followUpQuestions.length > 0 && (
                <div className="mt-4 p-3 bg-deep-700/20 rounded-lg border border-ocean-600/20">
                  <div className="flex items-center space-x-2 mb-3">
                    <HelpCircle className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-ocean-300">Suggested Follow-ups</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {message.result.followUpQuestions.map((question: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setInputValue(question)}
                        className="text-left p-2 text-xs bg-deep-600/30 hover:bg-deep-600/50 rounded border border-ocean-700/30 text-ocean-200 hover:text-white transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Message Footer */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2 text-xs opacity-60">
              <Clock className="w-3 h-3" />
              <span>{message.timestamp.toLocaleTimeString()}</span>
              {message.result?.executionTimeMs && (
                <>
                  <span>•</span>
                  <span>{message.result.executionTimeMs}ms</span>
                </>
              )}
            </div>
            
            {message.type === 'assistant' && (
              <div className="flex items-center space-x-2">
                <button className="text-ocean-400 hover:text-white transition-colors p-1">
                  <ThumbsUp className="w-3 h-3" />
                </button>
                <button className="text-ocean-400 hover:text-white transition-colors p-1">
                  <ThumbsDown className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => copyToClipboard(message.message)}
                  className="text-ocean-400 hover:text-white transition-colors p-1"
                >
                  <Copy className="w-3 h-3" />
                </button>
                <button className="text-ocean-400 hover:text-white transition-colors p-1">
                  <Star className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )

  const TabButton = ({ 
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
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
        isActive 
          ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' 
          : 'bg-deep-700/50 text-ocean-300 hover:text-white hover:bg-deep-600/50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={isActive ? 'text-white' : 'text-purple-400'}>{icon}</div>
      <span>{label}</span>
    </motion.button>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <div className="h-full flex flex-col">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-6">
              <AnimatePresence>
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </AnimatePresence>
              
              {loading && (
                <motion.div
                  className="flex justify-start mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div className="glass-morphism px-5 py-4 rounded-2xl border border-ocean-700/30">
                      <div className="flex items-center space-x-3">
                        <Loader className="w-5 h-5 text-ocean-400 animate-spin" />
                        <span className="text-ocean-300">Processing with RAG system...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Error Display */}
            {error && (
              <motion.div
                className="mb-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-300">{error}</span>
                </div>
              </motion.div>
            )}

            {/* Suggested Queries */}
            {messages.length === 0 && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-center mb-6">
                  <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">RAG-Powered Ocean AI</h3>
                  <p className="text-sm text-ocean-300">
                    Ask questions about ARGO ocean data using natural language. 
                    I'll search through scientific knowledge and generate precise queries.
                  </p>
                </div>
                
                <p className="text-sm text-ocean-300 mb-4">Try these example queries:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {suggestedQueries.slice(0, 6).map((query, index) => (
                    <motion.button
                      key={index}
                      className="text-left p-4 glass-morphism rounded-lg border border-ocean-700/30 hover:border-purple-500/50 transition-colors text-sm text-ocean-200 hover:text-white"
                      onClick={() => setInputValue(query)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {query}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Enhanced Input Area */}
            <div className="glass-morphism p-5 rounded-xl border border-ocean-700/30">
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsVoiceMode(!isVoiceMode)}
                  className={`p-3 rounded-lg transition-all ${
                    isVoiceMode 
                      ? 'bg-red-600 text-white' 
                      : 'bg-deep-700/50 text-ocean-300 hover:text-white hover:bg-deep-600/50'
                  }`}
                >
                  {isVoiceMode ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about ocean data, float locations, temperature patterns, or scientific insights..."
                  className="flex-1 bg-deep-700/50 text-white px-4 py-3 rounded-lg border border-ocean-600/30 focus:border-purple-500 focus:outline-none placeholder-ocean-400"
                  disabled={loading}
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || loading}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        )
      
      case 'sources':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Knowledge Sources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
                <div className="flex items-center space-x-3 mb-4">
                  <Database className="w-6 h-6 text-blue-400" />
                  <h4 className="text-lg font-semibold text-white">Database Schema</h4>
                </div>
                <p className="text-ocean-300 text-sm mb-4">
                  Complete database structure including ARGO floats, profiles, and measurements tables
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-ocean-200">Table relationships and foreign keys</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-ocean-200">Column descriptions and data types</span>
                  </div>
                </div>
              </div>
              
              <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
                <div className="flex items-center space-x-3 mb-4">
                  <BookOpen className="w-6 h-6 text-green-400" />
                  <h4 className="text-lg font-semibold text-white">Ocean Science Knowledge</h4>
                </div>
                <p className="text-ocean-300 text-sm mb-4">
                  Oceanographic concepts, measurement explanations, and scientific context
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-ocean-200">Temperature and salinity principles</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-ocean-200">Ocean regions and characteristics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
        
      default:
        return <div className="text-center text-ocean-300 py-8">Feature coming soon...</div>
    }
  }

  // Helper functions for visualization
  const hasGeographicData = (data: any[]): boolean => {
    if (!data || data.length === 0) return false
    return data.some(row => 
      (row.latitude && row.longitude) || 
      (row.deployment_latitude && row.deployment_longitude) ||
      (row.lat && row.lon)
    )
  }

  const shouldShowVisualization = (result: any): boolean => {
    return result && result.data && result.data.length > 0
  }

  const getChartType = (data: any[], columns: string[]): string => {
    if (!data || data.length === 0) return 'line'
    
    const lowerColumns = columns.map(col => col.toLowerCase())
    
    // Check for depth/pressure data
    if (lowerColumns.some(col => col.includes('depth') || col.includes('pressure'))) {
      return 'line'
    }
    
    // Check for time series data
    if (lowerColumns.some(col => col.includes('time') || col.includes('date'))) {
      return 'line'
    }
    
    // Check for count/frequency data
    if (lowerColumns.some(col => col.includes('count') || col.includes('frequency'))) {
      return 'bar'
    }
    
    return data.length <= 20 ? 'bar' : 'line'
  }

  const prepareChartData = (data: any[], columns: string[]) => {
    if (!data || data.length === 0) return null
    
    const numericColumns = columns.filter(col => {
      const sampleValues = data.slice(0, 5).map(row => row[col]).filter(val => val != null)
      return sampleValues.length > 0 && sampleValues.every(val => !isNaN(Number(val)))
    })
    
    if (numericColumns.length === 0) return null
    
    return {
      labels: data.slice(0, 20).map((_, i) => `Point ${i + 1}`),
      datasets: numericColumns.slice(0, 3).map((col, index) => ({
        label: col,
        data: data.slice(0, 20).map(row => Number(row[col]) || 0),
        borderColor: ['#10b981', '#3b82f6', '#f59e0b'][index],
        backgroundColor: ['#10b98120', '#3b82f620', '#f59e0b20'][index],
        tension: 0.4
      }))
    }
  }

  // Custom dark map tiles
  const darkMapUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  const darkMapAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

  return (
    <div className="h-full flex">
      {/* Left Side - Chat */}
      <div className="w-[30%] flex flex-col space-y-3 pr-3">
        {/* Compact Header */}
        <div className="glass-morphism p-3 rounded-lg border border-ocean-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">RAG Ocean Assistant</h2>
                <p className="text-xs text-ocean-300">Powered by retrieval-augmented generation and ocean science knowledge</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-purple-400">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium">RAG Online</span>
              </div>
              <button
                onClick={clearMessages}
                className="px-2 py-1 bg-deep-700/50 text-ocean-300 hover:text-white hover:bg-deep-600/50 rounded transition-colors text-xs"
              >
                Clear Chat
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <TabButton 
            id="chat" 
            label="Chat" 
            icon={<MessageSquare className="w-4 h-4" />}
            isActive={activeTab === 'chat'} 
            onClick={(id) => setActiveTab(id as any)} 
          />
          <TabButton 
            id="sources" 
            label="Knowledge Sources" 
            icon={<Layers className="w-4 h-4" />}
            isActive={activeTab === 'sources'} 
            onClick={(id) => setActiveTab(id as any)} 
          />
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>

      {/* Right Side - Map/Chart Panel */}
      <div className="w-[70%] flex flex-col space-y-2">
        {/* Compact Panel Header with Toggle */}
        <div className="glass-morphism p-2 rounded-lg border border-ocean-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-white">Visualization Panel</h3>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setRightPanelView('map')}
                className={`flex items-center space-x-1 px-2 py-1 rounded transition-all ${
                  rightPanelView === 'map' 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'bg-deep-700/50 text-ocean-300 hover:text-white'
                }`}
              >
                <Map className="w-3 h-3" />
                <span className="text-xs">Map</span>
              </button>
              <button
                onClick={() => setRightPanelView('chart')}
                className={`flex items-center space-x-1 px-2 py-1 rounded transition-all ${
                  rightPanelView === 'chart' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-deep-700/50 text-ocean-300 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3 h-3" />
                <span className="text-xs">Chart</span>
              </button>
              <button
                onClick={refetchMapData}
                className="p-1 bg-deep-700/50 text-ocean-300 hover:text-white rounded transition-colors"
                disabled={mapLoading}
              >
                <RefreshCw className={`w-3 h-3 ${mapLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Map View */}
        {rightPanelView === 'map' && (
          <div className="flex-1 glass-morphism rounded-xl border border-ocean-700/30 overflow-hidden">
            {mapLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex items-center space-x-2 text-ocean-300">
                  <Loader className="w-6 h-6 animate-spin" />
                  <span>Loading ocean data...</span>
                </div>
              </div>
            ) : (
              <div className="h-full">
                <MapContainer
                  center={[15, 75]} // Indian Ocean region
                  zoom={4}
                  style={{ height: '100%', width: '100%', backgroundColor: '#000000' }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    url={darkMapUrl}
                    attribution={darkMapAttribution}
                  />
                  
                  {/* Render floats from current query results with priority */}
                  {messages.length > 0 && (() => {
                    const lastMessage = messages[messages.length - 1]
                    if (lastMessage?.type === 'assistant' && lastMessage.result?.data && hasGeographicData(lastMessage.result.data)) {
                      return lastMessage.result.data.map((row: any, index: number) => {
                        const lat = row.latitude || row.deployment_latitude || row.lat
                        const lng = row.longitude || row.deployment_longitude || row.lon
                        
                        if (!lat || !lng) return null
                        
                        return (
                          <CircleMarker
                            key={`query-${index}`}
                            center={[lat, lng]}
                            radius={10}
                            pathOptions={{
                              color: '#ff6b6b',
                              fillColor: '#ff6b6b',
                              fillOpacity: 0.8,
                              weight: 2
                            }}
                          >
                            <Popup>
                              <div className="text-xs">
                                <div className="font-bold text-red-600 mb-1">Query Result</div>
                                {row.platform_number && <div><strong>Float:</strong> {row.platform_number}</div>}
                                <div><strong>Location:</strong> {lat.toFixed(2)}°, {lng.toFixed(2)}°</div>
                                {row.temperature && <div><strong>Temperature:</strong> {row.temperature}°C</div>}
                                {row.salinity && <div><strong>Salinity:</strong> {row.salinity} PSU</div>}
                                {row.oxygen && <div><strong>Oxygen:</strong> {row.oxygen} µmol/kg</div>}
                                {row.status && <div><strong>Status:</strong> {row.status}</div>}
                              </div>
                            </Popup>
                          </CircleMarker>
                        )
                      })
                    }
                    return null
                  })()}
                  
                  {/* Render all other floats */}
                  {mapData?.floats?.map((float) => (
                    <CircleMarker
                      key={`float-${float.id}`}
                      center={[float.lat, float.lon]}
                      radius={6}
                      pathOptions={{
                        color: float.status === 'ACTIVE' ? '#3b82f6' : '#6b7280',
                        fillColor: float.status === 'ACTIVE' ? '#3b82f6' : '#6b7280',
                        fillOpacity: 0.6,
                        weight: 1
                      }}
                    >
                      <Popup>
                        <div className="text-xs">
                          <div className="font-bold mb-1">{float.platform_number}</div>
                          <div><strong>Status:</strong> {float.status}</div>
                          <div><strong>Location:</strong> {float.lat.toFixed(2)}°, {float.lon.toFixed(2)}°</div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
              </div>
            )}
          </div>
        )}

        {/* Chart View */}
        {rightPanelView === 'chart' && (
          <div className="flex-1 glass-morphism rounded-xl border border-ocean-700/30 p-4">
            {messages.length > 0 ? (() => {
              const lastMessage = messages[messages.length - 1]
              if (lastMessage?.type === 'assistant' && lastMessage.result?.data && shouldShowVisualization(lastMessage.result)) {
                const chartData = prepareChartData(lastMessage.result.data, lastMessage.result.columns || Object.keys(lastMessage.result.data[0] || {}))
                if (chartData) {
                  return (
                    <div className="h-full">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-white">Query Results</h4>
                        <div className="flex items-center space-x-2 text-sm text-ocean-300">
                          <Activity className="w-4 h-4" />
                          <span>{lastMessage.result?.rowCount || 0} data points</span>
                        </div>
                      </div>
                      <div className="h-80">
                        <InteractiveChart
                          type={getChartType(lastMessage.result.data, lastMessage.result.columns || Object.keys(lastMessage.result.data[0] || {})) as any}
                          data={chartData}
                          title=""
                          height={300}
                          showControls={false}
                          animated={true}
                          interactive={true}
                        />
                      </div>
                    </div>
                  )
                }
              }
              return (
                <div className="h-full flex items-center justify-center text-ocean-300">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No chart data available</p>
                    <p className="text-sm mt-2">Ask a question to see data visualization</p>
                  </div>
                </div>
              )
            })() : (
              <div className="h-full flex items-center justify-center text-ocean-300">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No chart data available</p>
                  <p className="text-sm mt-2">Ask a question to see data visualization</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default RAGChat
