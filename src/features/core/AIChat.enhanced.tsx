import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { 
  Send, 
  Bot, 
  User, 
  Loader, 
  Sparkles, 
  BarChart3,
  Mic,
  MicOff,
  Settings,
  Download,
  Share2,
  RefreshCw,
  Star,
  Clock,
  MessageSquare,
  Zap,
  Brain,
  Database,
  Map,
  FileText,
  Volume2,
  VolumeX,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Search,
  Filter,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  Eye,
  Play,
  Pause,
  Camera,
  Image as ImageIcon,
  Paperclip,
  Code,
  Terminal,
  Maximize2,
  Table,
  Info
} from 'lucide-react'
import { useAIChatSQL } from '../../hooks/useArgoData'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  message: string
  timestamp: Date
  result?: any
  metadata?: {
    confidence?: number
    executionTime?: number
    rowCount?: number
    query?: string
    visualization?: any
    insights?: string[]
    followUpQuestions?: string[]
  }
}

const EnhancedAIChat: React.FC = () => {
  const [inputValue, setInputValue] = useState('')
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'insights' | 'history' | 'settings'>('chat')
  const [selectedModel, setSelectedModel] = useState<'ocean-ai' | 'gpt-4' | 'claude'>('ocean-ai')
  const [conversationMode, setConversationMode] = useState<'research' | 'analysis' | 'exploration'>('exploration')
  const [showAdvancedInput, setShowAdvancedInput] = useState(false)
  const [mapMode, setMapMode] = useState<'global' | 'results'>('results')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Use real AI Chat hook
  const { 
    messages, 
    loading, 
    error, 
    sendMessage, 
    clearMessages 
  } = useAIChatSQL()
  
  // Global map data (for right panel when no results yet)
  // Lazy import to avoid heavy loading when not needed
  const [globalMapData, setGlobalMapData] = useState<Array<{lat:number; lon:number; id?: string; platform_number?: string}>>([])
  useEffect(() => {
    let aborted = false
    ;(async () => {
      try {
        const base = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
        const res = await fetch(`${base}/api/client/visualization/ocean-map`)
        if (!res.ok) return
        const data = await res.json()
        if (!aborted) {
          const pts = (data?.floats || []).slice(0, Number((import.meta as any).env.VITE_MAX_MAP_MARKERS || 500)).map((f:any) => ({ lat: f.lat, lon: f.lon, id: f.id, platform_number: f.platform_number }))
          setGlobalMapData(pts.filter((p:any) => typeof p.lat === 'number' && typeof p.lon === 'number'))
        }
      } catch {}
    })()
    return () => { aborted = true }
  }, [])

  // Helper to extract lat/lon from the latest assistant message result
  const latestResultPoints = (() => {
    const lastAssistant = [...messages].reverse().find(m => m.type === 'assistant' && m.result && m.result.data)
    if (!lastAssistant) return [] as Array<{lat:number; lon:number; label?: string}>
    const rows = lastAssistant.result.data as any[]
    if (!Array.isArray(rows)) return []
    const candidates = ['lat','latitude']
    const candidatesLon = ['lon','longitude','lng']
    // Find matching column keys from the first row
    const sample = rows[0] || {}
    const latKey = Object.keys(sample).find(k => candidates.includes(k.toLowerCase()))
    const lonKey = Object.keys(sample).find(k => candidatesLon.includes(k.toLowerCase()))
    if (!latKey || !lonKey) return []
    return rows
      .map(r => ({ lat: Number(r[latKey]), lon: Number(r[lonKey]), label: Object.values(r).slice(0,3).join(' · ') }))
      .filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lon))
      .slice(0, Number((import.meta as any).env.VITE_MAX_MAP_MARKERS || 500))
  })()

  // Leaflet default marker fix (only once)
  useEffect(() => {
    // @ts-ignore
    delete (L.Icon.Default.prototype as any)?._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    })
  }, [])

  // Suggested queries for getting started
  const suggestedQueries = [
    "How many active ARGO floats are there in the Indian Ocean?",
    "Show me temperature variations above 28°C with location data",
    "Compare salinity levels between Arabian Sea and Bay of Bengal",
    "Which floats have the most recent measurement data?", 
    "What's the distribution of float types in our database?",
    "Find floats deployed by different manufacturers",
    "Show me temperature profiles by depth",
    "Which regions have the highest float concentration?",
    "What's the data quality score for our measurements?",
    "Find anomalies in recent temperature readings"
  ]

  const conversationTemplates = [
    {
      id: 'data-exploration',
      name: 'Data Exploration',
      description: 'Explore oceanographic patterns and trends',
      category: 'Analysis',
      startingQuery: 'Show me an overview of all available ARGO float data with regional breakdown',
      icon: <Search className="w-5 h-5" />
    },
    {
      id: 'temperature-analysis',
      name: 'Temperature Analysis',
      description: 'Analyze temperature patterns and anomalies',
      category: 'Science',
      startingQuery: 'Analyze temperature variations in the Arabian Sea with statistical summary',
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      id: 'float-tracking',
      name: 'Float Performance',
      description: 'Track float status and data quality',
      category: 'Monitoring',
      startingQuery: 'Show me the status and performance metrics of all ARGO floats',
      icon: <Activity className="w-5 h-5" />
    },
    {
      id: 'regional-comparison',
      name: 'Regional Comparison',
      description: 'Compare oceanographic parameters between regions',
      category: 'Research',
      startingQuery: 'Compare ocean conditions between different Indian Ocean regions',
      icon: <Map className="w-5 h-5" />
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    await sendMessage(inputValue.trim())
    setInputValue('')
  }

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestedQuery = (query: string) => {
    setInputValue(query)
    setActiveTab('chat')
    inputRef.current?.focus()
  }

  const handleTemplateSelect = (template: any) => {
    setInputValue(template.startingQuery)
    setActiveTab('chat')
    inputRef.current?.focus()
  }

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode)
    // In a real implementation, this would start/stop voice recognition
  }

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking)
    // In a real implementation, this would start/stop text-to-speech
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadData = (data: any[], filename: string) => {
    if (!data || data.length === 0) return
    
    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]
          return typeof value === 'string' && value.includes(',') 
            ? `"${value.replace(/"/g, '""')}"` 
            : value
        }).join(',')
      )
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}_${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const MessageBubble = ({ message }: { message: ChatMessage }) => (
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
            : 'bg-gradient-to-r from-blue-500 to-blue-600 mr-3'
        }`}>
          {message.type === 'user' ? 
            <User className="w-5 h-5 text-white" /> : 
            <Bot className="w-5 h-5 text-white" />
          }
        </div>
        
        <div className={`px-5 py-4 rounded-2xl ${
          message.type === 'user' 
            ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white' 
            : 'glass-morphism text-white border border-ocean-700/30'
        }`}>
          <p className="text-sm leading-relaxed mb-2">{message.message}</p>
          
          {/* Show SQL Query if available */}
          {message.result?.generatedSQL && (
            <motion.div 
              className="mt-4 bg-deep-700/50 rounded-lg border border-ocean-600/30 overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between px-4 py-2 bg-deep-800 border-b border-ocean-700/30">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-ocean-300">Generated SQL Query</span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => copyToClipboard(message.result.generatedSQL)}
                    className="text-ocean-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4 overflow-x-auto">
                <pre className="text-sm text-ocean-200 font-mono whitespace-pre-wrap">
                  {message.result.generatedSQL}
                </pre>
              </div>
            </motion.div>
          )}

          {/* Show Data Results Table */}
          {message.result?.data && message.result.data.length > 0 && (
            <motion.div 
              className="mt-4 bg-deep-700/50 rounded-lg border border-ocean-600/30 overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between px-4 py-2 bg-deep-800 border-b border-ocean-700/30">
                <div className="flex items-center space-x-2">
                  <Table className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-ocean-300">
                    Query Results ({message.result.rowCount} rows)
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => downloadData(message.result.data, 'ai_query_results')}
                    className="text-ocean-400 hover:text-white transition-colors"
                    title="Download as CSV"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="text-ocean-400 hover:text-white transition-colors">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto max-h-64">
                <table className="w-full text-sm">
                  <thead className="bg-deep-800">
                    <tr>
                      {message.result.columns?.map((col: string, index: number) => (
                        <th key={index} className="text-left p-3 text-ocean-300 font-medium whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {message.result.data.slice(0, 10).map((row: any, index: number) => (
                      <tr key={index} className="border-b border-ocean-700/20">
                        {message.result.columns?.map((col: string, colIndex: number) => (
                          <td key={colIndex} className="p-3 text-ocean-200 whitespace-nowrap">
                            {row[col] !== null && row[col] !== undefined 
                              ? String(row[col]) 
                              : <span className="text-ocean-500 italic">null</span>
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {message.result.data.length > 10 && (
                  <div className="text-center py-2 text-ocean-400 text-xs">
                    Showing first 10 of {message.result.data.length} results. Download for complete data.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Show AI Insights */}
          {message.result?.insights && message.result.insights.length > 0 && (
            <motion.div 
              className="mt-4 p-4 bg-deep-700/30 rounded-lg border border-blue-600/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center space-x-2 mb-3">
                <Brain className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-300 font-medium">AI Insights</span>
              </div>
              <div className="space-y-2">
                {message.result.insights.map((insight: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Sparkles className="w-3 h-3 text-blue-400 mt-1 flex-shrink-0" />
                    <span className="text-ocean-200 text-sm">{insight}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Show Follow-up Questions */}
          {message.result?.followUpQuestions && message.result.followUpQuestions.length > 0 && (
            <motion.div 
              className="mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="text-sm text-ocean-300 mb-2">💡 Follow-up questions:</div>
              <div className="space-y-2">
                {message.result.followUpQuestions.slice(0, 3).map((question: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuery(question)}
                    className="block w-full text-left p-2 text-sm bg-deep-700/30 rounded hover:bg-deep-600/30 transition-colors text-ocean-200 hover:text-white"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Enhanced Metadata for AI responses */}
          {message.type === 'assistant' && message.result && (
            <div className="mt-4 p-3 bg-deep-700/20 rounded-lg border border-ocean-600/10">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                {message.result.executionTimeMs && (
                  <div>
                    <span className="text-ocean-400">Execution:</span>
                    <div className="text-white font-medium">{message.result.executionTimeMs}ms</div>
                  </div>
                )}
                {message.result.rowCount !== undefined && (
                  <div>
                    <span className="text-ocean-400">Results:</span>
                    <div className="text-white font-medium">{message.result.rowCount} rows</div>
                  </div>
                )}
                <div>
                  <span className="text-ocean-400">Intent:</span>
                  <div className="text-white font-medium capitalize">{message.result.interpretedIntent?.replace(/_/g, ' ')}</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Error Display */}
          {message.result?.success === false && message.result.error && (
            <motion.div 
              className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 font-medium text-sm">Query Error</span>
              </div>
              <div className="text-red-300 text-sm mb-2">{message.result.error}</div>
              {message.result.fallbackQueries && (
                <div>
                  <div className="text-ocean-300 text-xs mb-2">Try these instead:</div>
                  <div className="space-y-1">
                    {message.result.fallbackQueries.slice(0, 2).map((query: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuery(query)}
                        className="block text-left text-xs text-blue-400 hover:text-blue-300"
                      >
                        • {query}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Message Footer with Actions */}
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs opacity-60 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {message.timestamp.toLocaleTimeString()}
            </p>
            
            {message.type === 'assistant' && (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => copyToClipboard(message.message)}
                  className="text-ocean-400 hover:text-white transition-colors p-1"
                  title="Copy message"
                >
                  <Copy className="w-3 h-3" />
                </button>
                
                <button 
                  onClick={toggleSpeaking}
                  className="text-ocean-400 hover:text-white transition-colors p-1"
                  title="Read aloud"
                >
                  {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                </button>
                
                <button 
                  className="text-ocean-400 hover:text-white transition-colors p-1"
                  title="Share"
                >
                  <Share2 className="w-3 h-3" />
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
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
          : 'bg-deep-700/50 text-ocean-300 hover:text-white hover:bg-deep-600/50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={isActive ? 'text-white' : 'text-blue-400'}>{icon}</div>
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
              {messages.length === 0 && (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    AI Ocean Data Assistant
                  </h3>
                  <p className="text-ocean-300 mb-6 max-w-md mx-auto">
                    Ask questions about ARGO float data in natural language. I'll convert your questions to SQL queries and provide insights.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {suggestedQueries.slice(0, 6).map((query, index) => (
                      <motion.button
                        key={index}
                        className="text-left p-3 glass-morphism rounded-lg border border-ocean-700/30 hover:border-blue-500/50 transition-colors text-sm text-ocean-200 hover:text-white"
                        onClick={() => handleSuggestedQuery(query)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.6 }}
                      >
                        <Zap className="w-4 h-4 inline mr-2 text-blue-400" />
                        {query}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

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
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="glass-morphism px-5 py-4 rounded-2xl border border-ocean-700/30">
                      <div className="flex items-center space-x-3">
                        <Loader className="w-5 h-5 text-blue-400 animate-spin" />
                        <span className="text-ocean-300">Analyzing your query and fetching data...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  className="flex justify-start mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mr-3">
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="glass-morphism px-5 py-4 rounded-2xl border border-red-700/30">
                      <div className="text-red-300">
                        Sorry, I encountered an error: {error}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Enhanced Input Area */}
            <div className="glass-morphism p-5 rounded-xl border border-ocean-700/30">
              <div className="flex space-x-3">
                <button
                  onClick={toggleVoiceMode}
                  className={`p-3 rounded-lg transition-all ${
                    isVoiceMode 
                      ? 'bg-red-600 text-white' 
                      : 'bg-deep-700/50 text-ocean-300 hover:text-white hover:bg-deep-600/50'
                  }`}
                  title={isVoiceMode ? 'Stop voice input' : 'Start voice input'}
                >
                  {isVoiceMode ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleInputKeyPress}
                  placeholder="Ask about ARGO data... (e.g., 'Show me temperature data above 25°C')"
                  className="flex-1 bg-deep-700/50 text-white px-4 py-3 rounded-lg border border-ocean-600/30 focus:border-blue-500 focus:outline-none placeholder-ocean-400"
                  disabled={loading}
                />
                
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || loading}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                >
                  {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </motion.button>
              </div>
            </div>
          </div>
        )
      
      case 'insights':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Conversation Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conversationTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  className="glass-morphism p-6 rounded-xl border border-ocean-700/30 hover:border-blue-500/50 transition-all cursor-pointer"
                  onClick={() => handleTemplateSelect(template)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-blue-400">{template.icon}</div>
                    <div>
                      <h4 className="text-white font-semibold">{template.name}</h4>
                      <span className="text-xs px-2 py-1 bg-blue-900/20 text-blue-400 rounded">
                        {template.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-ocean-300 text-sm mb-3">{template.description}</p>
                  <p className="text-ocean-400 text-xs italic">"{template.startingQuery}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        )
      
      case 'history':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Chat History</h3>
              {messages.length > 0 && (
                <button
                  onClick={clearMessages}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Clear History
                </button>
              )}
            </div>
            
            {messages.length === 0 ? (
              <div className="text-center py-12 text-ocean-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                <div>No conversation history</div>
                <div className="text-sm mt-2">Start chatting to see your conversation history</div>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.map((message, index) => (
                  <div key={message.id} className="glass-morphism p-4 rounded-lg border border-ocean-700/30">
                    <div className="flex items-center space-x-2 mb-2">
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Bot className="w-4 h-4 text-blue-400" />
                      )}
                      <span className="text-white text-sm font-medium">
                        {message.type === 'user' ? 'You' : 'AI Assistant'}
                      </span>
                      <span className="text-ocean-400 text-xs">
                        {message.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-ocean-200 text-sm">{message.message}</div>
                    {message.result?.rowCount && (
                      <div className="text-ocean-400 text-xs mt-2">
                        Returned {message.result.rowCount} rows in {message.result.executionTimeMs}ms
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      
      case 'settings':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">AI Assistant Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
                <h4 className="text-lg font-semibold text-white mb-4">Model Configuration</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-ocean-300 text-sm mb-2 block">AI Model</label>
                    <select 
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value as any)}
                      className="w-full bg-deep-700 text-white px-3 py-2 rounded border border-ocean-700/30"
                    >
                      <option value="ocean-ai">Ocean AI (Specialized for ARGO data)</option>
                      <option value="gpt-4">GPT-4 (Advanced reasoning)</option>
                      <option value="claude">Claude (Detailed analysis)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-ocean-300 text-sm mb-2 block">Conversation Mode</label>
                    <select 
                      value={conversationMode}
                      onChange={(e) => setConversationMode(e.target.value as any)}
                      className="w-full bg-deep-700 text-white px-3 py-2 rounded border border-ocean-700/30"
                    >
                      <option value="exploration">Exploration (Broad queries)</option>
                      <option value="analysis">Analysis (Detailed insights)</option>
                      <option value="research">Research (Scientific focus)</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={showAdvancedInput}
                        onChange={(e) => setShowAdvancedInput(e.target.checked)}
                        className="accent-blue-500" 
                      />
                      <span className="text-ocean-300 text-sm">Show advanced query options</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
                <h4 className="text-lg font-semibold text-white mb-4">Response Preferences</h4>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="accent-blue-500" />
                      <span className="text-ocean-300 text-sm">Show SQL queries</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="accent-blue-500" />
                      <span className="text-ocean-300 text-sm">Display data insights</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="accent-blue-500" />
                      <span className="text-ocean-300 text-sm">Suggest follow-up questions</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="accent-blue-500" />
                      <span className="text-ocean-300 text-sm">Auto-generate visualizations</span>
                    </label>
                  </div>
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
    <div className="h-full overflow-hidden grid grid-cols-1 xl:grid-cols-2 gap-4">
      {/* Left: Chat Panel */}
      <div className="h-full min-h-0 flex flex-col space-y-4">
        {/* Header */}
        <div className="glass-morphism p-4 rounded-xl border border-ocean-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">AI Ocean Assistant</h2>
                <p className="text-xs text-ocean-300">Chat left • Map right • Responsive</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2">
          <TabButton id="chat" label="Chat" icon={<MessageSquare className="w-4 h-4" />} isActive={activeTab === 'chat'} onClick={(id) => setActiveTab(id as any)} />
          <TabButton id="insights" label="Templates" icon={<Brain className="w-4 h-4" />} isActive={activeTab === 'insights'} onClick={(id) => setActiveTab(id as any)} />
          <TabButton id="history" label="History" icon={<Clock className="w-4 h-4" />} isActive={activeTab === 'history'} onClick={(id) => setActiveTab(id as any)} />
          <TabButton id="settings" label="Settings" icon={<Settings className="w-4 h-4" />} isActive={activeTab === 'settings'} onClick={(id) => setActiveTab(id as any)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="h-full">
            {renderTabContent()}
          </motion.div>
        </div>
      </div>

      {/* Right: Map Panel */}
      <div className="h-full min-h-0 flex flex-col space-y-4">
        <div className="glass-morphism p-4 rounded-xl border border-ocean-700/30 flex items-center justify-between">
          <div className="text-white font-semibold">Spatial View</div>
          <div className="flex items-center space-x-2">
            <button onClick={() => setMapMode('results')} className={`px-3 py-1 rounded-lg text-sm ${mapMode==='results' ? 'bg-ocean-700/40 text-white' : 'bg-deep-700/50 text-ocean-300 hover:text-white'}`}>Results</button>
            <button onClick={() => setMapMode('global')} className={`px-3 py-1 rounded-lg text-sm ${mapMode==='global' ? 'bg-ocean-700/40 text-white' : 'bg-deep-700/50 text-ocean-300 hover:text-white'}`}>Global</button>
          </div>
        </div>
        <div className="flex-1 min-h-0 rounded-xl overflow-hidden border border-ocean-700/30 relative z-0">
          <MapContainer center={[12, 75]} zoom={mapMode==='global' ? 3 : 4} className="h-full w-full z-0 rounded-xl" zoomControl={true} preferCanvas>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors, &copy; CARTO'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {(mapMode === 'results' ? latestResultPoints : globalMapData).map((p:any, idx:number) => (
              <Marker key={idx} position={[p.lat, p.lon] as [number, number]}>
                <Popup>
                  <div className="text-sm">
                    <div className="font-semibold">{p.platform_number || p.label || 'Point'}</div>
                    <div className="text-ocean-400">Lat {p.lat.toFixed(3)}, Lon {p.lon.toFixed(3)}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  )
}

export default EnhancedAIChat
