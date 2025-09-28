import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Maximize2
} from 'lucide-react'
import InteractiveChart from '../../components/charts/InteractiveChart'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  type?: 'text' | 'data' | 'visualization' | 'map' | 'analysis' | 'chart' | 'code' | 'image' | 'file'
  metadata?: {
    confidence?: number
    dataSources?: string[]
    processingTime?: number
    relatedFloats?: string[]
    chartData?: any
    visualization?: {
      type: string
      data: any
      config?: any
    }
    files?: Array<{
      name: string
      size: number
      type: string
      url?: string
    }>
    code?: {
      language: string
      content: string
      output?: string
    }
  }
  reactions?: Array<{
    type: 'like' | 'dislike' | 'helpful' | 'bookmark'
    userId: string
    timestamp: Date
  }>
  rating?: number
  isStreaming?: boolean
  isTyping?: boolean
}

interface ConversationTemplate {
  id: string
  name: string
  description: string
  category: string
  startingQuery: string
  icon: React.ReactNode
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your advanced AI assistant for ARGO ocean data exploration. I can help you discover insights from oceanographic data using natural language queries, voice commands, and complex analytical questions. What would you like to explore today?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
      metadata: {
        confidence: 100,
        dataSources: ['System'],
        processingTime: 0
      }
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'templates' | 'history' | 'settings'>('chat')
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [showAdvancedInput, setShowAdvancedInput] = useState(false)
  const [selectedModel, setSelectedModel] = useState<'gpt-4' | 'claude' | 'ocean-ai'>('ocean-ai')
  const [conversationMode, setConversationMode] = useState<'research' | 'analysis' | 'exploration'>('exploration')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const conversationTemplates: ConversationTemplate[] = [
    {
      id: 'temperature-analysis',
      name: 'Temperature Analysis',
      description: 'Analyze temperature patterns and trends',
      category: 'Analysis',
      startingQuery: 'Show me temperature variations in the Arabian Sea over the past year with seasonal analysis',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      id: 'float-tracking',
      name: 'Float Tracking',
      description: 'Track and analyze float movements',
      category: 'Monitoring',
      startingQuery: 'Track float 4902916 and analyze its trajectory with ocean current correlations',
      icon: <Map className="w-5 h-5" />
    },
    {
      id: 'bgc-research',
      name: 'BGC Research',
      description: 'Biogeochemical parameter research',
      category: 'Research',
      startingQuery: 'Compare dissolved oxygen and chlorophyll levels in the Bay of Bengal during monsoon vs winter',
      icon: <Brain className="w-5 h-5" />
    },
    {
      id: 'climate-impact',
      name: 'Climate Impact',
      description: 'Climate change impact analysis',
      category: 'Climate',
      startingQuery: 'Analyze long-term warming trends in the Indian Ocean and their ecosystem impacts',
      icon: <Zap className="w-5 h-5" />
    }
  ]

  const suggestedQueries = [
    "What are the temperature anomalies in the Arabian Sea this month?",
    "Compare salinity profiles between monsoon and post-monsoon seasons",
    "Show me the most active BGC floats in the Bay of Bengal",
    "Analyze oxygen depletion patterns in the Indian Ocean",
    "Find correlations between chlorophyll and temperature in equatorial waters",
    "What's the current status of Deep ARGO floats in the Southern Ocean?"
  ]

  const recentConversations = [
    {
      title: "Arabian Sea Temperature Study",
      timestamp: "2 hours ago",
      messages: 12,
      preview: "Analyzed temperature variations with seasonal patterns..."
    },
    {
      title: "BGC Float Performance Analysis", 
      timestamp: "Yesterday",
      messages: 8,
      preview: "Reviewed biogeochemical sensor data quality..."
    },
    {
      title: "Monsoon Impact Assessment",
      timestamp: "3 days ago", 
      messages: 15,
      preview: "Comprehensive analysis of monsoon effects on ocean parameters..."
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateAIResponse = (query: string): { content: string; type: string; metadata: any } => {
    const query_lower = query.toLowerCase()
    
    // Chart/visualization responses
    if (query_lower.includes('chart') || query_lower.includes('plot') || query_lower.includes('graph') || query_lower.includes('visualiz')) {
      return {
        content: "I've generated an interactive visualization based on your query. The chart shows real-time ocean data with advanced analytics capabilities. You can interact with the data points to explore deeper insights.",
        type: 'chart',
        metadata: {
          confidence: 96,
          dataSources: ['ARGO Core', 'BGC Floats', 'Satellite Data'],
          processingTime: 2340,
          relatedFloats: ['4902916', '5906467', '2903521'],
          chartData: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Ocean Temperature',
              data: [26.2, 26.8, 27.5, 28.2, 29.1, 29.8],
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              borderColor: '#EF4444',
              borderWidth: 3,
              fill: true,
              tension: 0.4
            }]
          },
          visualization: {
            type: 'line',
            data: {},
            config: { animated: true, interactive: true }
          }
        }
      }
    }

    // Code generation responses
    if (query_lower.includes('code') || query_lower.includes('python') || query_lower.includes('script') || query_lower.includes('algorithm')) {
      return {
        content: "I've generated Python code for ocean data analysis based on your request. This script uses oceanographic best practices and includes data validation, statistical analysis, and visualization components.",
        type: 'code',
        metadata: {
          confidence: 92,
          dataSources: ['ARGO Programming Guidelines', 'Oceanographic Python Libraries'],
          processingTime: 1890,
          code: {
            language: 'python',
            content: `import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from scipy import stats

# Load ARGO ocean data
def analyze_ocean_temperature(data):
    """
    Analyze ocean temperature profiles with statistical methods
    """
    # Calculate depth-averaged temperature
    depth_avg_temp = np.mean(data['temperature'])
    
    # Identify thermocline depth
    temp_gradient = np.gradient(data['temperature'], data['depth'])
    thermocline_depth = data['depth'][np.argmin(temp_gradient)]
    
    # Statistical analysis
    temp_stats = {
        'mean': np.mean(data['temperature']),
        'std': np.std(data['temperature']),
        'min': np.min(data['temperature']),
        'max': np.max(data['temperature'])
    }
    
    return temp_stats, thermocline_depth

# Visualization
def plot_temperature_profile(depth, temperature):
    plt.figure(figsize=(10, 8))
    plt.plot(temperature, -depth, 'b-', linewidth=2)
    plt.xlabel('Temperature (°C)')
    plt.ylabel('Depth (m)')
    plt.title('Ocean Temperature Profile')
    plt.grid(True, alpha=0.3)
    plt.show()`,
            output: "Analysis complete. Thermocline depth: 147m, Average temperature: 27.3°C"
          }
        }
      }
    }

    // Regular ocean data responses
    const responses = {
      temperature: {
        content: "Based on ARGO float data analysis, I found significant temperature patterns in your requested area. The analysis shows surface temperatures ranging from 26.8°C to 29.2°C with a clear thermocline at 150m depth. I've processed data from 47 active floats with 94% confidence.",
        type: 'analysis',
        metadata: {
          confidence: 94,
          dataSources: ['ARGO Core', 'BGC Floats', 'Satellite SST'],
          processingTime: 1240,
          relatedFloats: ['4902916', '5906467', '2903521']
        }
      },
      salinity: {
        content: "Salinity analysis reveals interesting spatial variations. The profiles show ranges of 33.8-35.9 PSU with distinct freshwater influences near river discharge zones. Statistical analysis indicates significant correlations with precipitation patterns.",
        type: 'analysis',
        metadata: {
          confidence: 87,
          dataSources: ['ARGO Core', 'River Discharge Data'],
          processingTime: 980,
          relatedFloats: ['4903024', '6902845']
        }
      },
      bgc: {
        content: "BGC parameter analysis shows complex biogeochemical cycles. Dissolved oxygen levels display seasonal variations (180-250 μmol/kg) with chlorophyll concentrations peaking during upwelling events. AI models detect emerging patterns in nutrient distribution.",
        type: 'analysis',
        metadata: {
          confidence: 91,
          dataSources: ['BGC ARGO', 'Satellite Ocean Color'],
          processingTime: 1560,
          relatedFloats: ['5906467', '2903521']
        }
      },
      map: {
        content: "I've generated an interactive map showing the distribution of ocean parameters in your region of interest. The map includes real-time float positions, current trajectories, and data overlays for comprehensive spatial analysis.",
        type: 'map',
        metadata: {
          confidence: 88,
          dataSources: ['ARGO Network', 'Satellite Altimetry'],
          processingTime: 2100,
          relatedFloats: ['4902916', '5906467', '2903521', '4903024']
        }
      },
      default: {
        content: "I'm processing your ocean data query using advanced AI algorithms. Let me analyze the available ARGO float data and provide you with comprehensive insights including statistical analysis and trend detection.",
        type: 'text',
        metadata: {
          confidence: 85,
          dataSources: ['ARGO Database'],
          processingTime: 1100,
          relatedFloats: []
        }
      }
    }

    if (query_lower.includes('temperature') || query_lower.includes('thermal')) return responses.temperature
    if (query_lower.includes('salinity') || query_lower.includes('salt')) return responses.salinity
    if (query_lower.includes('bgc') || query_lower.includes('oxygen') || query_lower.includes('chlorophyll')) return responses.bgc
    if (query_lower.includes('map') || query_lower.includes('location') || query_lower.includes('spatial')) return responses.map
    return responses.default
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate AI processing with realistic delay
    setTimeout(() => {
      const response = simulateAIResponse(inputValue)
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'bot',
        timestamp: new Date(),
        type: response.type as any,
        metadata: response.metadata
      }
      
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, Math.random() * 1000 + 1500) // 1.5-2.5 second delay
  }

  const handleTemplateSelect = (template: ConversationTemplate) => {
    setInputValue(template.startingQuery)
    setActiveTab('chat')
  }

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode)
    // In a real implementation, this would start/stop voice recognition
  }

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking)
    // In a real implementation, this would start/stop text-to-speech
  }

  const addReaction = (messageId: string, reactionType: 'like' | 'dislike' | 'helpful' | 'bookmark') => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || []
        const existingReaction = reactions.find(r => r.type === reactionType && r.userId === 'current-user')
        
        if (existingReaction) {
          return {
            ...msg,
            reactions: reactions.filter(r => !(r.type === reactionType && r.userId === 'current-user'))
          }
        } else {
          return {
            ...msg,
            reactions: [...reactions, {
              type: reactionType,
              userId: 'current-user',
              timestamp: new Date()
            }]
          }
        }
      }
      return msg
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const MessageBubble = ({ message }: { message: Message }) => (
    <motion.div
      className={`flex mb-6 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`flex max-w-5xl ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          message.sender === 'user' 
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 ml-3' 
            : 'bg-gradient-to-r from-green-500 to-green-600 mr-3'
        }`}>
          {message.sender === 'user' ? 
            <User className="w-5 h-5 text-white" /> : 
            <Bot className="w-5 h-5 text-white" />
          }
        </div>
        
        <div className={`px-5 py-4 rounded-2xl ${
          message.sender === 'user' 
            ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white' 
            : 'glass-morphism text-white border border-ocean-700/30'
        }`}>
          <p className="text-sm leading-relaxed mb-2">{message.content}</p>
          
          {/* Chart Visualization */}
          {message.type === 'chart' && message.metadata?.chartData && (
            <motion.div 
              className="mt-4 p-4 bg-deep-700/50 rounded-lg border border-ocean-600/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-ocean-300 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Interactive Data Visualization
                </span>
                <div className="flex space-x-2">
                  <button className="text-ocean-400 hover:text-ocean-300 text-xs px-2 py-1 bg-deep-600/50 rounded">
                    <Maximize2 className="w-3 h-3" />
                  </button>
                  <button className="text-ocean-400 hover:text-ocean-300 text-xs px-2 py-1 bg-deep-600/50 rounded">
                    <Download className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="h-64">
                <InteractiveChart
                  type="line"
                  data={message.metadata.chartData}
                  title="AI Generated Chart"
                  height={240}
                  showControls={false}
                  animated={true}
                  interactive={true}
                />
              </div>
            </motion.div>
          )}

          {/* Code Block */}
          {message.type === 'code' && message.metadata?.code && (
            <motion.div 
              className="mt-4 bg-gray-900 rounded-lg border border-gray-700 overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">
                    {message.metadata.code.language.toUpperCase()}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => copyToClipboard(message.metadata!.code!.content)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                  {message.metadata.code.content}
                </pre>
              </div>
              {message.metadata.code.output && (
                <div className="px-4 py-2 bg-green-900/20 border-t border-gray-700">
                  <div className="flex items-center space-x-2 mb-1">
                    <Terminal className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-400">Output:</span>
                  </div>
                  <pre className="text-sm text-green-300 font-mono">
                    {message.metadata.code.output}
                  </pre>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Enhanced Metadata for AI responses */}
          {message.sender === 'bot' && message.metadata && (
            <div className="mt-4 p-3 bg-deep-700/30 rounded-lg border border-ocean-600/20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
                <div>
                  <span className="text-ocean-400">Confidence:</span>
                  <div className="text-white font-medium flex items-center">
                    {message.metadata.confidence}%
                    <div className={`ml-2 w-2 h-2 rounded-full ${
                      (message.metadata?.confidence || 0) > 90 ? 'bg-green-400' : 
                      (message.metadata?.confidence || 0) > 70 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></div>
                  </div>
                </div>
                <div>
                  <span className="text-ocean-400">Processing:</span>
                  <div className="text-white font-medium">{message.metadata.processingTime}ms</div>
                </div>
                <div>
                  <span className="text-ocean-400">Sources:</span>
                  <div className="text-white font-medium">{message.metadata.dataSources?.length || 0}</div>
                </div>
                <div>
                  <span className="text-ocean-400">Floats:</span>
                  <div className="text-white font-medium">{message.metadata.relatedFloats?.length || 0}</div>
                </div>
              </div>
              
              {message.metadata.dataSources && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {message.metadata.dataSources.map((source: string, i: number) => (
                    <span key={i} className="text-xs px-2 py-1 bg-blue-900/20 text-blue-300 rounded">
                      {source}
                    </span>
                  ))}
                </div>
              )}

              {message.metadata.relatedFloats && message.metadata.relatedFloats.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {message.metadata.relatedFloats.map((floatId: string, i: number) => (
                    <span key={i} className="text-xs px-2 py-1 bg-green-900/20 text-green-300 rounded">
                      Float {floatId}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Analysis Visualization */}
          {message.type === 'analysis' && (
            <motion.div 
              className="mt-4 p-4 bg-deep-700/50 rounded-lg border border-ocean-600/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-ocean-300 flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  Generated Analysis Report
                </span>
                <div className="flex space-x-2">
                  <button className="text-ocean-400 hover:text-ocean-300 text-xs px-2 py-1 bg-deep-600/50 rounded">
                    <Eye className="w-3 h-3 mr-1" />
                    View Full
                  </button>
                  <button className="text-ocean-400 hover:text-ocean-300 text-xs px-2 py-1 bg-deep-600/50 rounded">
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </button>
                </div>
              </div>
              <div className="h-40 bg-gradient-to-br from-ocean-800/50 to-deep-800/50 rounded flex items-center justify-center border border-ocean-700/20">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-ocean-400/50 mx-auto mb-2" />
                  <span className="text-ocean-300 text-sm">Interactive analysis report</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Map Visualization */}
          {message.type === 'map' && (
            <motion.div 
              className="mt-4 p-4 bg-deep-700/50 rounded-lg border border-ocean-600/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-ocean-300 flex items-center">
                  <Map className="w-4 h-4 mr-2" />
                  Interactive Map Visualization
                </span>
                <div className="flex space-x-2">
                  <button className="text-ocean-400 hover:text-ocean-300 text-xs px-2 py-1 bg-deep-600/50 rounded">
                    <Maximize2 className="w-3 h-3 mr-1" />
                    Fullscreen
                  </button>
                </div>
              </div>
              <div className="h-40 bg-gradient-to-br from-blue-800/50 to-deep-800/50 rounded flex items-center justify-center border border-ocean-700/20">
                <div className="text-center">
                  <Map className="w-12 h-12 text-blue-400/50 mx-auto mb-2" />
                  <span className="text-ocean-300 text-sm">Click to open interactive map</span>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Message Footer with Actions */}
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs opacity-60 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {message.timestamp.toLocaleTimeString()}
            </p>
            
            {message.sender === 'bot' && (
              <div className="flex items-center space-x-2">
                {/* Reaction Buttons */}
                <button 
                  onClick={() => addReaction(message.id, 'like')}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    message.reactions?.some(r => r.type === 'like' && r.userId === 'current-user')
                      ? 'bg-green-600 text-white'
                      : 'text-ocean-400 hover:text-white hover:bg-green-600/20'
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                </button>
                
                <button 
                  onClick={() => addReaction(message.id, 'dislike')}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    message.reactions?.some(r => r.type === 'dislike' && r.userId === 'current-user')
                      ? 'bg-red-600 text-white'
                      : 'text-ocean-400 hover:text-white hover:bg-red-600/20'
                  }`}
                >
                  <ThumbsDown className="w-3 h-3" />
                </button>

                <button 
                  onClick={() => copyToClipboard(message.content)}
                  className="text-ocean-400 hover:text-white transition-colors p-1"
                >
                  <Copy className="w-3 h-3" />
                </button>
                
                <button 
                  onClick={toggleSpeaking}
                  className="text-ocean-400 hover:text-white transition-colors p-1"
                >
                  {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                </button>
                
                <button 
                  onClick={() => addReaction(message.id, 'bookmark')}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    message.reactions?.some(r => r.type === 'bookmark' && r.userId === 'current-user')
                      ? 'bg-yellow-600 text-white'
                      : 'text-ocean-400 hover:text-white hover:bg-yellow-600/20'
                  }`}
                >
                  <Star className="w-3 h-3" />
                </button>
                
                <button className="text-ocean-400 hover:text-white transition-colors p-1">
                  <Share2 className="w-3 h-3" />
                </button>

                <button className="text-ocean-400 hover:text-white transition-colors p-1">
                  <MoreHorizontal className="w-3 h-3" />
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
              
              {isLoading && (
                <motion.div
                  className="flex justify-start mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-3">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="glass-morphism px-5 py-4 rounded-2xl border border-ocean-700/30">
                      <div className="flex items-center space-x-3">
                        <Loader className="w-5 h-5 text-ocean-400 animate-spin" />
                        <span className="text-ocean-300">Processing your query with AI analysis...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Queries */}
            {messages.length === 1 && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-sm text-ocean-300 mb-4">Try these advanced queries:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {suggestedQueries.slice(0, 6).map((query, index) => (
                    <motion.button
                      key={index}
                      className="text-left p-4 glass-morphism rounded-lg border border-ocean-700/30 hover:border-green-500/50 transition-colors text-sm text-ocean-200 hover:text-white"
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
                  onClick={toggleVoiceMode}
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
                  placeholder="Ask advanced questions about ocean data... (e.g., 'Analyze temperature anomalies with statistical significance')"
                  className="flex-1 bg-deep-700/50 text-white px-4 py-3 rounded-lg border border-ocean-600/30 focus:border-green-500 focus:outline-none placeholder-ocean-400"
                  disabled={isLoading}
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        )
      
      case 'templates':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Conversation Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conversationTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  className="glass-morphism p-6 rounded-xl border border-ocean-700/30 hover:border-green-500/50 transition-all cursor-pointer"
                  onClick={() => handleTemplateSelect(template)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-green-400">{template.icon}</div>
                    <div>
                      <h4 className="text-white font-semibold">{template.name}</h4>
                      <span className="text-xs px-2 py-1 bg-green-900/20 text-green-400 rounded">
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
            <h3 className="text-xl font-semibold text-white">Recent Conversations</h3>
            <div className="space-y-4">
              {recentConversations.map((conversation, index) => (
                <motion.div
                  key={index}
                  className="glass-morphism p-4 rounded-xl border border-ocean-700/30 hover:border-green-500/50 transition-all cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{conversation.title}</h4>
                    <div className="flex items-center space-x-2 text-xs text-ocean-400">
                      <MessageSquare className="w-4 h-4" />
                      <span>{conversation.messages} messages</span>
                    </div>
                  </div>
                  <p className="text-ocean-300 text-sm mb-2">{conversation.preview}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-ocean-400 text-xs">{conversation.timestamp}</span>
                    <button className="text-green-400 hover:text-green-300 text-xs">Continue</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )
      
      case 'settings':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">AI Assistant Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
                <h4 className="text-lg font-semibold text-white mb-4">Response Preferences</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-ocean-300 text-sm mb-2 block">Response Detail Level</label>
                    <select className="w-full bg-deep-700 text-white px-3 py-2 rounded border border-ocean-700/30">
                      <option>Detailed with metadata</option>
                      <option>Standard responses</option>
                      <option>Concise answers</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-ocean-300 text-sm mb-2 block">Auto-generate visualizations</label>
                    <input type="checkbox" defaultChecked className="accent-green-500" />
                  </div>
                </div>
              </div>
              <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
                <h4 className="text-lg font-semibold text-white mb-4">Voice Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-ocean-300 text-sm mb-2 block">Voice Speed</label>
                    <input type="range" className="w-full accent-green-500" />
                  </div>
                  <div>
                    <label className="text-ocean-300 text-sm mb-2 block">Auto-read responses</label>
                    <input type="checkbox" className="accent-green-500" />
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
    <div className="h-full flex flex-col space-y-6">
      {/* Enhanced Header */}
      <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">Advanced AI Ocean Assistant</h2>
              <p className="text-sm text-ocean-300">Powered by natural language processing and machine learning</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">AI Online</span>
            </div>
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
          id="templates" 
          label="Templates" 
          icon={<FileText className="w-4 h-4" />}
          isActive={activeTab === 'templates'} 
          onClick={(id) => setActiveTab(id as any)} 
        />
        <TabButton 
          id="history" 
          label="History" 
          icon={<Clock className="w-4 h-4" />}
          isActive={activeTab === 'history'} 
          onClick={(id) => setActiveTab(id as any)} 
        />
        <TabButton 
          id="settings" 
          label="Settings" 
          icon={<Settings className="w-4 h-4" />}
          isActive={activeTab === 'settings'} 
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
  )
}

export default AIChat
