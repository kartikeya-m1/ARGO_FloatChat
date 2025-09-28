import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler
} from 'chart.js'
import { Line, Bar, Doughnut, Radar, Scatter } from 'react-chartjs-2'
import {
  LineChart,
  Line as RechartsLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  ZAxis,
  ComposedChart
} from 'recharts'
import { Download, Maximize2, Settings, Share2, RefreshCw, Zap, TrendingUp, Eye } from 'lucide-react'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string
    borderWidth?: number
    fill?: boolean
    tension?: number
  }>
}

interface InteractiveChartProps {
  type: 'line' | 'bar' | 'doughnut' | 'radar' | 'scatter' | 'area' | 'composed'
  data: ChartData | any[]
  title: string
  description?: string
  width?: number | string
  height?: number | string
  showControls?: boolean
  animated?: boolean
  interactive?: boolean
  theme?: 'ocean' | 'dark' | 'light'
  onDataPointClick?: (data: any) => void
}

const InteractiveChart: React.FC<InteractiveChartProps> = ({
  type,
  data,
  title,
  description,
  width = '100%',
  height = 400,
  showControls = true,
  animated = true,
  interactive = true,
  theme = 'ocean',
  onDataPointClick
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [chartType, setChartType] = useState(type)
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const chartRef = useRef<any>(null)

  // Ocean theme colors
  const oceanTheme = {
    primary: '#0ea5e9',
    secondary: '#06b6d4',
    accent: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    background: 'rgba(14, 165, 233, 0.1)',
    grid: 'rgba(14, 165, 233, 0.2)',
    text: '#e0f2fe'
  }

  // Chart.js options with ocean theme
  const chartJsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: animated ? {
      duration: 2000,
      easing: 'easeInOutQuart' as const
    } : false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: oceanTheme.text,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: oceanTheme.text,
        bodyColor: oceanTheme.text,
        borderColor: oceanTheme.primary,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        mode: 'index' as const,
        intersect: false
      }
    },
    scales: chartType !== 'doughnut' && chartType !== 'radar' ? {
      x: {
        grid: {
          color: oceanTheme.grid,
          borderColor: oceanTheme.primary
        },
        ticks: {
          color: oceanTheme.text
        }
      },
      y: {
        grid: {
          color: oceanTheme.grid,
          borderColor: oceanTheme.primary
        },
        ticks: {
          color: oceanTheme.text
        }
      }
    } : undefined,
    onClick: interactive ? (event: any, elements: any) => {
      if (elements.length > 0 && onDataPointClick) {
        const dataIndex = elements[0].index
        onDataPointClick({ index: dataIndex, data: data })
      }
    } : undefined
  }

  // Generate sample ocean data if not provided
  const processedData = Array.isArray(data) ? data : (data || {})

  const renderChartJsChart = () => {
    // Validate Chart.js data structure
    const validatedData = processedData && processedData.datasets ? processedData : {
      labels: [],
      datasets: []
    }
    
    const commonProps = {
      ref: chartRef,
      data: validatedData,
      options: chartJsOptions,
      width,
      height
    }

    switch (chartType) {
      case 'line':
        return <Line {...commonProps} />
      case 'bar':
        return <Bar {...commonProps} />
      case 'doughnut':
        return <Doughnut {...commonProps} />
      case 'radar':
        return <Radar {...commonProps} />
      default:
        return <Line {...commonProps} />
    }
  }

  const renderRechartsChart = () => {
    const rechartsData = Array.isArray(data) ? data : []
    
    // Early return if no data
    if (rechartsData.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-ocean-700/30 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-ocean-400" />
            </div>
            <p className="text-ocean-300">No data available</p>
          </div>
        </div>
      )
    }
    
    switch (chartType) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={rechartsData}>
              <defs>
                <linearGradient id="oceanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={oceanTheme.primary} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={oceanTheme.primary} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={oceanTheme.grid} />
              <XAxis dataKey="name" stroke={oceanTheme.text} />
              <YAxis stroke={oceanTheme.text} />
              <RechartsTooltip 
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: `1px solid ${oceanTheme.primary}`,
                  borderRadius: '8px',
                  color: oceanTheme.text
                }}
              />
              <RechartsLegend wrapperStyle={{ color: oceanTheme.text }} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={oceanTheme.primary} 
                fill="url(#oceanGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )
      
      case 'composed':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart data={rechartsData}>
              <CartesianGrid strokeDasharray="3 3" stroke={oceanTheme.grid} />
              <XAxis dataKey="name" stroke={oceanTheme.text} />
              <YAxis stroke={oceanTheme.text} />
              <RechartsTooltip 
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: `1px solid ${oceanTheme.primary}`,
                  borderRadius: '8px',
                  color: oceanTheme.text
                }}
              />
              <RechartsLegend wrapperStyle={{ color: oceanTheme.text }} />
              <RechartsBar dataKey="temperature" fill={oceanTheme.danger} />
              <RechartsLine type="monotone" dataKey="salinity" stroke={oceanTheme.secondary} strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        )
      
      case 'scatter':
        // Transform data to match scatter chart expectations
        const scatterData = rechartsData.map((item, index) => ({
          x: item.temperature || item.x || index,
          y: item.salinity || item.y || index,
          z: item.depth || item.z || 100,
          name: item.name || `Point ${index + 1}`,
          temperature: item.temperature || 0,
          salinity: item.salinity || 0,
          oxygen: item.oxygen || 0,
          depth: item.depth || 0
        }))
        
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ScatterChart data={scatterData}>
              <CartesianGrid strokeDasharray="3 3" stroke={oceanTheme.grid} />
              <XAxis dataKey="x" name="Temperature" stroke={oceanTheme.text} />
              <YAxis dataKey="y" name="Salinity" stroke={oceanTheme.text} />
              <ZAxis dataKey="z" range={[60, 400]} name="Depth" />
              <RechartsTooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: `1px solid ${oceanTheme.primary}`,
                  borderRadius: '8px',
                  color: oceanTheme.text
                }}
              />
              <Scatter name="Ocean Data" dataKey="y" fill={oceanTheme.primary} />
            </ScatterChart>
          </ResponsiveContainer>
        )
      
      default:
        return renderChartJsChart()
    }
  }

  const exportChart = () => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image()
      const link = document.createElement('a')
      link.download = `${title.replace(/\s+/g, '_')}_chart.png`
      link.href = url
      link.click()
    }
  }

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className={`glass-morphism rounded-xl border border-ocean-700/30 overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      {/* Chart Header */}
      <div className="p-4 border-b border-ocean-700/30 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
            {title}
          </h3>
          {description && (
            <p className="text-sm text-ocean-300 mt-1">{description}</p>
          )}
        </div>
        
        {showControls && (
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={refreshData}
              className="p-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors"
              whileHover={{ scale: 1.05 }}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 text-ocean-300 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
            
            <motion.button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <Settings className="w-4 h-4 text-ocean-300" />
            </motion.button>
            
            <motion.button
              onClick={exportChart}
              className="p-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <Download className="w-4 h-4 text-ocean-300" />
            </motion.button>
            
            <motion.button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <Maximize2 className="w-4 h-4 text-ocean-300" />
            </motion.button>
          </div>
        )}
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-ocean-700/30 bg-deep-800/50"
          >
            <div className="p-4">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="text-sm text-ocean-300 mb-2 block">Chart Type</label>
                  <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value as any)}
                    className="bg-deep-700 text-white px-3 py-2 rounded border border-ocean-700/30 text-sm"
                  >
                    <option value="line">Line Chart</option>
                    <option value="bar">Bar Chart</option>
                    <option value="area">Area Chart</option>
                    <option value="doughnut">Doughnut Chart</option>
                    <option value="radar">Radar Chart</option>
                    <option value="scatter">Scatter Plot</option>
                    <option value="composed">Composed Chart</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 text-sm text-ocean-300">
                    <input
                      type="checkbox"
                      checked={animated}
                      onChange={(e) => setAnimated(e.target.checked)}
                      className="accent-blue-500"
                    />
                    <span>Animated</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 text-sm text-ocean-300">
                    <input
                      type="checkbox"
                      checked={interactive}
                      onChange={(e) => setInteractive(e.target.checked)}
                      className="accent-blue-500"
                    />
                    <span>Interactive</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chart Content */}
      <div className="p-4">
        <motion.div
          initial={animated ? { opacity: 0, scale: 0.9 } : {}}
          animate={animated ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          style={{ height: typeof height === 'number' ? `${height}px` : height }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-ocean-300">Loading chart data...</span>
              </div>
            </div>
          ) : (
            <div className="h-full">
              {['area', 'composed', 'scatter'].includes(chartType) ? renderRechartsChart() : renderChartJsChart()}
            </div>
          )}
        </motion.div>
      </div>

      {/* Chart Footer */}
      <div className="p-3 border-t border-ocean-700/30 bg-deep-800/30">
        <div className="flex items-center justify-between text-xs text-ocean-400">
          <div className="flex items-center space-x-4">
            <span>Real-time data</span>
            <span>•</span>
            <span>Updated 2 minutes ago</span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Interactive mode {interactive ? 'enabled' : 'disabled'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InteractiveChart
