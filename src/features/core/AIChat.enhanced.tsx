import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { 
  Send, 
  Sparkles, 
  Mic,
  MicOff,
  Settings,
  Download,
  Share2,
  Clock,
  MessageSquare,
  Zap,
  Brain,
  Database,
  Map,
  Volume2,
  VolumeX,
  Copy,
  Search,
  TrendingUp,
  Activity,
  AlertCircle,
  Maximize2,
  Table
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
    if (!lastAssistant || !lastAssistant.result) return [] as Array<{lat:number; lon:number; label?: string}>
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

  const MessageBubble = ({ message }: { message: ChatMessage }) => {
    // Get user initials for avatar (in real app, this would come from user data)
    const getUserInitials = () => {
      return 'YU' // You - could be dynamic based on actual user data
    }

    const getAIInitials = () => {
      return 'AI'
    }

    return (
      <motion.div
        className={`flex mb-8 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className={`flex max-w-5xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Enhanced Avatar with Initials */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
            message.type === 'user' 
              ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 ml-4 border-2 border-emerald-400/30' 
              : 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 mr-4 border-2 border-blue-400/30'
          }`}>
            <span className="text-white font-bold text-sm tracking-wide">
              {message.type === 'user' ? getUserInitials() : getAIInitials()}
            </span>
          </div>
          
          <div className={`px-6 py-5 rounded-2xl shadow-lg backdrop-blur-sm ${
            message.type === 'user' 
              ? 'bg-gradient-to-br from-emerald-600/90 via-emerald-700/90 to-teal-700/90 text-gray-100 border border-emerald-400/20' 
              : 'bg-gradient-to-br from-[#1a1a1a]/95 via-[#2a2a2a]/90 to-[#1e1e1e]/95 text-gray-100 border border-gray-600/30'
          }`}>
            <p className="text-sm leading-relaxed mb-3 font-medium">{message.message}</p>
          
          {/* Show SQL Query if available */}
          {message.result?.generatedSQL && (
            <motion.div 
              className="mt-5 bg-[#0f0f0f]/80 rounded-xl border border-gray-600/30 overflow-hidden backdrop-blur-sm shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] border-b border-gray-600/40">
                <div className="flex items-center space-x-3">
                  <Database className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-semibold text-gray-200">Generated SQL Query</span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => copyToClipboard(message.result.generatedSQL)}
                    className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-700/50"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-5 overflow-x-auto">
                <pre className="text-sm text-gray-200 font-mono whitespace-pre-wrap leading-relaxed">
                  {message.result.generatedSQL}
                </pre>
              </div>
            </motion.div>
          )}

          {/* Show Data Results Table */}
          {message.result?.data && message.result.data.length > 0 && (
            <motion.div 
              className="mt-5 bg-[#0f0f0f]/80 rounded-xl border border-gray-600/30 overflow-hidden backdrop-blur-sm shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] border-b border-gray-600/40">
                <div className="flex items-center space-x-3">
                  <Table className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-semibold text-gray-200">
                    Query Results ({message.result.rowCount} rows)
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => downloadData(message.result.data, 'ai_query_results')}
                    className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-700/50"
                    title="Download as CSV"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-700/50">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto max-h-64">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a]">
                    <tr>
                      {message.result.columns?.map((col: string, index: number) => (
                        <th key={index} className="text-left p-4 text-gray-300 font-semibold whitespace-nowrap border-b border-gray-600/30">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {message.result.data.slice(0, 10).map((row: any, index: number) => (
                      <tr key={index} className="border-b border-gray-700/30 hover:bg-gray-800/20 transition-colors">
                        {message.result.columns?.map((col: string, colIndex: number) => (
                          <td key={colIndex} className="p-4 text-gray-200 whitespace-nowrap">
                            {row[col] !== null && row[col] !== undefined 
                              ? String(row[col]) 
                              : <span className="text-gray-500 italic">null</span>
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {message.result.data.length > 10 && (
                  <div className="text-center py-3 text-gray-400 text-sm bg-gradient-to-r from-[#1a1a1a]/50 to-[#2a2a2a]/50">
                    Showing first 10 of {message.result.data.length} results. Download for complete data.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Show AI Insights */}
          {message.result?.insights && message.result.insights.length > 0 && (
            <motion.div 
              className="mt-5 p-5 bg-gradient-to-br from-blue-500/10 via-indigo-600/10 to-purple-700/10 rounded-xl border border-blue-400/20 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-blue-300 font-semibold">AI Insights</span>
              </div>
              <div className="space-y-3">
                {message.result.insights.map((insight: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-200 text-sm leading-relaxed">{insight}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Show Follow-up Questions */}
          {message.result?.followUpQuestions && message.result.followUpQuestions.length > 0 && (
            <motion.div 
              className="mt-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="text-sm text-gray-300 mb-3 font-medium">💡 Follow-up questions:</div>
              <div className="space-y-2">
                {message.result.followUpQuestions.slice(0, 3).map((question: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuery(question)}
                    className="block w-full text-left p-3 text-sm bg-[#2a2a2a]/60 rounded-lg hover:bg-[#2a2a2a]/80 transition-all duration-200 text-gray-200 hover:text-white border border-gray-600/20 hover:border-gray-500/40"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Enhanced Metadata for AI responses */}
          {message.type === 'assistant' && message.result && (
            <div className="mt-5 p-4 bg-gradient-to-r from-[#0f0f0f]/60 to-[#1a1a1a]/60 rounded-xl border border-gray-700/20 backdrop-blur-sm">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                {message.result.executionTimeMs && (
                  <div>
                    <span className="text-gray-400 font-medium">Execution:</span>
                    <div className="text-gray-100 font-semibold">{message.result.executionTimeMs}ms</div>
                  </div>
                )}
                {message.result.rowCount !== undefined && (
                  <div>
                    <span className="text-gray-400 font-medium">Results:</span>
                    <div className="text-gray-100 font-semibold">{message.result.rowCount} rows</div>
                  </div>
                )}
                <div>
                  <span className="text-gray-400 font-medium">Intent:</span>
                  <div className="text-gray-100 font-semibold capitalize">{message.result.interpretedIntent?.replace(/_/g, ' ')}</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Error Display */}
          {message.result?.success === false && message.result.error && (
            <motion.div 
              className="mt-5 p-4 bg-gradient-to-br from-red-900/20 via-red-800/15 to-red-900/20 border border-red-400/30 rounded-xl backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-center space-x-3 mb-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-300 font-semibold text-sm">Query Error</span>
              </div>
              <div className="text-red-200 text-sm mb-3 leading-relaxed">{message.result.error}</div>
              {message.result.fallbackQueries && (
                <div>
                  <div className="text-gray-300 text-xs mb-2 font-medium">Try these instead:</div>
                  <div className="space-y-2">
                    {message.result.fallbackQueries.slice(0, 2).map((query: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuery(query)}
                        className="block text-left text-xs text-blue-400 hover:text-blue-300 transition-colors"
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
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-600/20">
            <p className="text-xs text-gray-400 flex items-center font-medium">
              <Clock className="w-3 h-3 mr-1.5" />
              {message.timestamp.toLocaleTimeString()}
            </p>
            
            {message.type === 'assistant' && (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => copyToClipboard(message.message)}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700/50"
                  title="Copy message"
                >
                  <Copy className="w-4 h-4" />
                </button>
                
                <button 
                  onClick={toggleSpeaking}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700/50"
                  title="Read aloud"
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                
                <button 
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700/50"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
  }

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
      className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30' 
          : 'bg-[#2a2a2a]/60 text-gray-300 hover:text-gray-100 hover:bg-[#2a2a2a]/80 border border-gray-600/20 hover:border-gray-500/40'
      }`}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`${isActive ? 'text-white' : 'text-blue-400'} transition-colors`}>{icon}</div>
      <span className="text-sm">{label}</span>
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
                  className="text-center py-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border-2 border-blue-400/30">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-100 mb-4 tracking-tight">
                    AI Ocean Data Assistant
                  </h3>
                  <p className="text-gray-300 mb-8 max-w-md mx-auto text-lg leading-relaxed">
                    Ask questions about ARGO float data in natural language. I'll convert your questions to SQL queries and provide insights.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                    {suggestedQueries.slice(0, 6).map((query, index) => (
                      <motion.button
                        key={index}
                        className="text-left p-5 bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a2a2a]/60 backdrop-blur-xl rounded-xl border border-gray-600/30 hover:border-blue-400/50 transition-all duration-300 text-sm text-gray-200 hover:text-white shadow-lg hover:shadow-xl group"
                        onClick={() => handleSuggestedQuery(query)}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.6 }}
                      >
                        <div className="flex items-center">
                          <Zap className="w-5 h-5 mr-3 text-blue-400 group-hover:text-blue-300 transition-colors" />
                          <span className="font-medium leading-relaxed">{query}</span>
                        </div>
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
                  className="flex justify-start mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-full flex items-center justify-center mr-4 shadow-lg border-2 border-blue-400/30">
                      <span className="text-white font-bold text-sm tracking-wide">AI</span>
                    </div>
                    <div className="bg-gradient-to-br from-[#1a1a1a]/95 via-[#2a2a2a]/90 to-[#1e1e1e]/95 px-6 py-5 rounded-2xl border border-gray-600/30 shadow-lg backdrop-blur-sm">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-6 h-6 rounded-full border-2 border-blue-500/30"></div>
                          <div className="w-6 h-6 rounded-full border-2 border-t-blue-500 absolute top-0 animate-spin"></div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-200 font-medium">Analyzing your query...</span>
                          <div className="flex space-x-1 mt-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  className="flex justify-start mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-full flex items-center justify-center mr-4 shadow-lg border-2 border-red-400/30">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="bg-gradient-to-br from-red-900/20 via-red-800/15 to-red-900/20 px-6 py-5 rounded-2xl border border-red-400/30 backdrop-blur-sm shadow-lg">
                      <div className="text-red-200 font-medium">
                        Sorry, I encountered an error: <span className="text-red-100">{error}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Enhanced Input Area */}
            <div className="bg-gradient-to-r from-[#1a1a1a]/95 to-[#2a2a2a]/90 backdrop-blur-xl p-6 rounded-2xl border border-gray-600/30 shadow-2xl">
              <div className="flex space-x-4">
                <button
                  onClick={toggleVoiceMode}
                  className={`p-3 rounded-xl transition-all duration-300 shadow-lg ${
                    isVoiceMode 
                      ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-red-500/25 border border-red-400/30' 
                      : 'bg-[#2a2a2a]/80 text-gray-300 hover:text-white hover:bg-[#2a2a2a] border border-gray-600/30 hover:border-gray-500/50'
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
                  className="flex-1 bg-[#2a2a2a]/80 text-gray-100 px-5 py-4 rounded-xl border border-gray-600/40 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 placeholder-gray-400 font-medium transition-all duration-300 shadow-inner"
                  disabled={loading}
                />
                
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || loading}
                  className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-indigo-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 border border-blue-400/30 font-semibold"
                  whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -1 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <div className="relative w-5 h-5">
                      <div className="w-5 h-5 rounded-full border-2 border-white/30"></div>
                      <div className="w-5 h-5 rounded-full border-2 border-t-white absolute top-0 animate-spin"></div>
                    </div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        )
      
      case 'insights':
        return (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-100 tracking-tight">Conversation Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {conversationTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  className="bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a2a2a]/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-600/30 hover:border-blue-400/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl group"
                  onClick={() => handleTemplateSelect(template)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-blue-400 group-hover:text-blue-300 transition-colors">{template.icon}</div>
                    <div>
                      <h4 className="text-gray-100 font-bold text-lg">{template.name}</h4>
                      <span className="text-xs px-3 py-1 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 text-blue-400 rounded-full border border-blue-400/30">
                        {template.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">{template.description}</p>
                  <p className="text-gray-400 text-sm italic bg-[#0f0f0f]/40 p-3 rounded-xl border border-gray-700/30">"{template.startingQuery}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        )
      
      case 'history':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-100 tracking-tight">Chat History</h3>
              {messages.length > 0 && (
                <button
                  onClick={clearMessages}
                  className="text-red-400 hover:text-red-300 text-sm font-medium px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all duration-300"
                >
                  Clear History
                </button>
              )}
            </div>
            
            {messages.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <MessageSquare className="w-16 h-16 mx-auto mb-6 text-gray-500" />
                <div className="text-xl font-semibold text-gray-300 mb-2">No conversation history</div>
                <div className="text-sm text-gray-400">Start chatting to see your conversation history</div>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {messages.map((message) => (
                  <div key={message.id} className="bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a2a2a]/60 backdrop-blur-xl p-5 rounded-2xl border border-gray-600/30 shadow-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      {message.type === 'user' ? (
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">YU</span>
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">AI</span>
                        </div>
                      )}
                      <span className="text-gray-100 text-sm font-semibold">
                        {message.type === 'user' ? 'You' : 'AI Assistant'}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {message.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-gray-200 text-sm leading-relaxed mb-3">{message.message}</div>
                    {message.result?.rowCount && (
                      <div className="text-gray-400 text-xs bg-[#0f0f0f]/40 p-2 rounded-lg">
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
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-100 tracking-tight">AI Assistant Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a2a2a]/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-600/30 shadow-lg">
                <h4 className="text-lg font-bold text-gray-100 mb-6">Model Configuration</h4>
                <div className="space-y-5">
                  <div>
                    <label className="text-gray-300 text-sm mb-3 block font-medium">AI Model</label>
                    <select 
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value as any)}
                      className="w-full bg-[#2a2a2a]/80 text-gray-100 px-4 py-3 rounded-xl border border-gray-600/40 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    >
                      <option value="ocean-ai">Ocean AI (Specialized for ARGO data)</option>
                      <option value="gpt-4">GPT-4 (Advanced reasoning)</option>
                      <option value="claude">Claude (Detailed analysis)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm mb-3 block font-medium">Conversation Mode</label>
                    <select 
                      value={conversationMode}
                      onChange={(e) => setConversationMode(e.target.value as any)}
                      className="w-full bg-[#2a2a2a]/80 text-gray-100 px-4 py-3 rounded-xl border border-gray-600/40 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    >
                      <option value="exploration">Exploration (Broad queries)</option>
                      <option value="analysis">Analysis (Detailed insights)</option>
                      <option value="research">Research (Scientific focus)</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center space-x-3 p-3 bg-[#0f0f0f]/40 rounded-xl border border-gray-700/30">
                      <input 
                        type="checkbox" 
                        checked={showAdvancedInput}
                        onChange={(e) => setShowAdvancedInput(e.target.checked)}
                        className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2" 
                      />
                      <span className="text-gray-300 text-sm font-medium">Show advanced query options</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a2a2a]/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-600/30 shadow-lg">
                <h4 className="text-lg font-bold text-gray-100 mb-6">Response Preferences</h4>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center space-x-3 p-3 bg-[#0f0f0f]/40 rounded-xl border border-gray-700/30">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2" />
                      <span className="text-gray-300 text-sm font-medium">Show SQL queries</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center space-x-3 p-3 bg-[#0f0f0f]/40 rounded-xl border border-gray-700/30">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2" />
                      <span className="text-gray-300 text-sm font-medium">Display data insights</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center space-x-3 p-3 bg-[#0f0f0f]/40 rounded-xl border border-gray-700/30">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2" />
                      <span className="text-gray-300 text-sm font-medium">Suggest follow-up questions</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center space-x-3 p-3 bg-[#0f0f0f]/40 rounded-xl border border-gray-700/30">
                      <input type="checkbox" className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2" />
                      <span className="text-gray-300 text-sm font-medium">Auto-generate visualizations</span>
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
    <div className="h-full overflow-hidden grid grid-cols-1 xl:grid-cols-2 gap-6 bg-gradient-to-br from-[#1a1a1a] via-[#1e1e1e] to-[#0f0f0f] p-4">
      {/* Left: Chat Panel */}
      <div className="h-full min-h-0 flex flex-col space-y-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a1a1a]/90 to-[#2a2a2a]/90 backdrop-blur-xl p-5 rounded-2xl border border-gray-700/30 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-100 tracking-tight">AI Ocean Assistant</h2>
                <p className="text-sm text-gray-400 font-medium">Smart ARGO Data Analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-emerald-500/20 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-sm"></div>
                <span className="text-xs font-semibold text-emerald-300">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-[#1a1a1a]/60 backdrop-blur-xl p-1 rounded-xl border border-gray-700/40">
          <TabButton id="chat" label="Chat" icon={<MessageSquare className="w-4 h-4" />} isActive={activeTab === 'chat'} onClick={(id) => setActiveTab(id as any)} />
          <TabButton id="insights" label="Templates" icon={<Brain className="w-4 h-4" />} isActive={activeTab === 'insights'} onClick={(id) => setActiveTab(id as any)} />
          <TabButton id="history" label="History" icon={<Clock className="w-4 h-4" />} isActive={activeTab === 'history'} onClick={(id) => setActiveTab(id as any)} />
          <TabButton id="settings" label="Settings" icon={<Settings className="w-4 h-4" />} isActive={activeTab === 'settings'} onClick={(id) => setActiveTab(id as any)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-hidden bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a2a2a]/60 backdrop-blur-xl rounded-2xl border border-gray-700/30 shadow-inner">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="h-full p-6">
            {renderTabContent()}
          </motion.div>
        </div>
      </div>

      {/* Right: Map Panel */}
      <div className="h-full min-h-0 flex flex-col space-y-4">
        <div className="bg-gradient-to-r from-[#1a1a1a]/95 to-[#2a2a2a]/90 backdrop-blur-xl p-5 rounded-2xl border border-gray-600/30 shadow-2xl flex items-center justify-between">
          <div className="text-gray-100 font-bold text-lg">Spatial View</div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setMapMode('results')} 
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                mapMode==='results' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg border border-blue-400/30' 
                  : 'bg-[#2a2a2a]/60 text-gray-300 hover:text-white hover:bg-[#2a2a2a]/80 border border-gray-600/30'
              }`}
            >
              Results
            </button>
            <button 
              onClick={() => setMapMode('global')} 
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                mapMode==='global' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg border border-blue-400/30' 
                  : 'bg-[#2a2a2a]/60 text-gray-300 hover:text-white hover:bg-[#2a2a2a]/80 border border-gray-600/30'
              }`}
            >
              Global
            </button>
          </div>
        </div>
        <div className="flex-1 min-h-0 rounded-2xl overflow-hidden border border-gray-600/30 relative z-0 shadow-2xl">
          <MapContainer center={[12, 75]} zoom={mapMode==='global' ? 3 : 4} className="h-full w-full z-0 rounded-2xl" zoomControl={true} preferCanvas>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors, &copy; CARTO'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {(mapMode === 'results' ? latestResultPoints : globalMapData).map((p:any, idx:number) => (
              <Marker key={idx} position={[p.lat, p.lon] as [number, number]}>
                <Popup>
                  <div className="text-sm bg-[#1a1a1a] text-gray-200 p-2 rounded">
                    <div className="font-semibold text-gray-100">{p.platform_number || p.label || 'Point'}</div>
                    <div className="text-gray-400">Lat {p.lat.toFixed(3)}, Lon {p.lon.toFixed(3)}</div>
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
