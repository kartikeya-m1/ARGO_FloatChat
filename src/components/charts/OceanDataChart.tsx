import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ComposedChart,
  Brush,
  ZAxis
} from 'recharts'
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Waves,
  Settings,
  Download,
  Maximize2,
  MapPin
} from 'lucide-react'

interface OceanDataPoint {
  timestamp: string
  depth: number
  temperature: number
  salinity: number
  oxygen: number
  pH: number
  chlorophyll: number
  pressure: number
  lat: number
  lon: number
  floatId: string
}

interface OceanDataChartProps {
  data: OceanDataPoint[]
  chartType: 'temperature_profile' | 'time_series' | 'correlation' | 'spatial' | 'multi_parameter'
  parameter?: 'temperature' | 'salinity' | 'oxygen' | 'pH' | 'chlorophyll'
  title: string
  subtitle?: string
  height?: number
  showControls?: boolean
  onParameterChange?: (parameter: string) => void
  onDataPointClick?: (data: OceanDataPoint) => void
}

const OceanDataChart: React.FC<OceanDataChartProps> = ({
  data,
  chartType,
  parameter = 'temperature',
  title,
  subtitle,
  height = 400,
  showControls = true,
  onParameterChange,
  onDataPointClick: _onDataPointClick
}) => {
  const [selectedParameter, setSelectedParameter] = useState(parameter)
  const [showDepthProfile, setShowDepthProfile] = useState(false)
  const [selectedFloat, setSelectedFloat] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<'1D' | '7D' | '30D' | 'ALL'>('7D')

  const parameters = [
    { key: 'temperature', label: 'Temperature', unit: '°C', color: '#EF4444', icon: <Thermometer className="w-4 h-4" /> },
    { key: 'salinity', label: 'Salinity', unit: 'PSU', color: '#3B82F6', icon: <Droplets className="w-4 h-4" /> },
    { key: 'oxygen', label: 'Dissolved Oxygen', unit: 'mg/L', color: '#10B981', icon: <Wind className="w-4 h-4" /> },
    { key: 'pH', label: 'pH Level', unit: '', color: '#8B5CF6', icon: <Activity className="w-4 h-4" /> },
    { key: 'chlorophyll', label: 'Chlorophyll', unit: 'mg/m³', color: '#059669', icon: <Waves className="w-4 h-4" /> }
  ]

  const currentParam = parameters.find(p => p.key === selectedParameter) || parameters[0]

  // Process data based on chart type
  const processedData = useMemo(() => {
    switch (chartType) {
      case 'temperature_profile':
        return data
          .filter(d => selectedFloat ? d.floatId === selectedFloat : true)
          .map(d => ({
            depth: -d.depth, // Negative for oceanographic convention
            temperature: d.temperature,
            salinity: d.salinity,
            oxygen: d.oxygen,
            name: `${d.depth}m`
          }))
          .sort((a, b) => b.depth - a.depth) // Sort by depth (surface to bottom)

      case 'time_series':
        const now = new Date()
        const timeFilter = {
          '1D': 1,
          '7D': 7,
          '30D': 30,
          'ALL': 365
        }[timeRange]
        
        return data
          .filter(d => {
            const dataDate = new Date(d.timestamp)
            const daysDiff = (now.getTime() - dataDate.getTime()) / (1000 * 3600 * 24)
            return daysDiff <= timeFilter
          })
          .map(d => ({
            timestamp: new Date(d.timestamp).toLocaleDateString(),
            [selectedParameter]: d[selectedParameter as keyof OceanDataPoint],
            temperature: d.temperature,
            salinity: d.salinity,
            oxygen: d.oxygen,
            pH: d.pH,
            chlorophyll: d.chlorophyll,
            floatId: d.floatId
          }))

      case 'correlation':
        return data.map(d => ({
          temperature: d.temperature,
          salinity: d.salinity,
          oxygen: d.oxygen,
          pH: d.pH,
          chlorophyll: d.chlorophyll,
          depth: d.depth,
          floatId: d.floatId
        }))

      case 'spatial':
        return data.map(d => ({
          lat: d.lat,
          lon: d.lon,
          [selectedParameter]: d[selectedParameter as keyof OceanDataPoint],
          floatId: d.floatId,
          name: `Float ${d.floatId}`
        }))

      case 'multi_parameter':
        return data
          .reduce((acc: any[], d) => {
            const existing = acc.find(item => item.timestamp === d.timestamp)
            if (existing) {
              existing.temperature = (existing.temperature + d.temperature) / 2
              existing.salinity = (existing.salinity + d.salinity) / 2
              existing.oxygen = (existing.oxygen + d.oxygen) / 2
            } else {
              acc.push({
                timestamp: new Date(d.timestamp).toLocaleDateString(),
                temperature: d.temperature,
                salinity: d.salinity,
                oxygen: d.oxygen,
                pH: d.pH,
                chlorophyll: d.chlorophyll
              })
            }
            return acc
          }, [])

      default:
        return data
    }
  }, [data, chartType, selectedParameter, selectedFloat, timeRange])

  const renderChart = () => {
    const commonProps = {
      width: '100%',
      height: height
    }

    switch (chartType) {
      case 'temperature_profile':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={processedData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.2)" />
              <XAxis 
                type="number" 
                dataKey="temperature" 
                stroke="#e0f2fe"
                label={{ value: 'Temperature (°C)', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                type="number" 
                dataKey="depth" 
                stroke="#e0f2fe"
                label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid #0ea5e9',
                  borderRadius: '8px',
                  color: '#e0f2fe'
                }}
                formatter={(value: any, name: string) => [
                  `${value}${name === 'temperature' ? '°C' : name === 'salinity' ? ' PSU' : ' mg/L'}`,
                  name.charAt(0).toUpperCase() + name.slice(1)
                ]}
              />
              <Legend wrapperStyle={{ color: '#e0f2fe' }} />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#EF4444" 
                strokeWidth={3}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                name="Temperature"
              />
              {showDepthProfile && (
                <>
                  <Line 
                    type="monotone" 
                    dataKey="salinity" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                    name="Salinity"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="oxygen" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                    name="Oxygen"
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        )

      case 'time_series':
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart data={processedData}>
              <defs>
                <linearGradient id="parameterGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentParam.color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={currentParam.color} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.2)" />
              <XAxis 
                dataKey="timestamp" 
                stroke="#e0f2fe"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="#e0f2fe"
                label={{ value: `${currentParam.label} (${currentParam.unit})`, angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid #0ea5e9',
                  borderRadius: '8px',
                  color: '#e0f2fe'
                }}
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value: any) => [`${value} ${currentParam.unit}`, currentParam.label]}
              />
              <Legend wrapperStyle={{ color: '#e0f2fe' }} />
              <Area
                type="monotone"
                dataKey={selectedParameter}
                stroke={currentParam.color}
                fill="url(#parameterGradient)"
                strokeWidth={2}
                name={currentParam.label}
              />
              <Brush dataKey="timestamp" height={30} stroke={currentParam.color} />
            </AreaChart>
          </ResponsiveContainer>
        )

      case 'correlation':
        return (
          <ResponsiveContainer {...commonProps}>
            <ScatterChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.2)" />
              <XAxis 
                dataKey="temperature" 
                name="Temperature" 
                stroke="#e0f2fe"
                label={{ value: 'Temperature (°C)', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                dataKey="salinity" 
                name="Salinity" 
                stroke="#e0f2fe"
                label={{ value: 'Salinity (PSU)', angle: -90, position: 'insideLeft' }}
              />
              <ZAxis dataKey="depth" range={[50, 400]} name="Depth" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid #0ea5e9',
                  borderRadius: '8px',
                  color: '#e0f2fe'
                }}
                formatter={(value: any, name: string) => [value, name]}
                cursor={{ strokeDasharray: '3 3' }}
              />
              <Legend wrapperStyle={{ color: '#e0f2fe' }} />
              <Scatter 
                name="Ocean Data" 
                dataKey="salinity" 
                fill="#0ea5e9"
                fillOpacity={0.7}
              />
            </ScatterChart>
          </ResponsiveContainer>
        )

      case 'multi_parameter':
        return (
          <ResponsiveContainer {...commonProps}>
            <ComposedChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(14, 165, 233, 0.2)" />
              <XAxis dataKey="timestamp" stroke="#e0f2fe" />
              <YAxis yAxisId="left" stroke="#e0f2fe" />
              <YAxis yAxisId="right" orientation="right" stroke="#e0f2fe" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid #0ea5e9',
                  borderRadius: '8px',
                  color: '#e0f2fe'
                }}
              />
              <Legend wrapperStyle={{ color: '#e0f2fe' }} />
              <Bar yAxisId="left" dataKey="temperature" fill="#EF4444" name="Temperature (°C)" />
              <Line yAxisId="right" type="monotone" dataKey="salinity" stroke="#3B82F6" strokeWidth={2} name="Salinity (PSU)" />
              <Line yAxisId="right" type="monotone" dataKey="oxygen" stroke="#10B981" strokeWidth={2} name="Oxygen (mg/L)" />
            </ComposedChart>
          </ResponsiveContainer>
        )

      default:
        return <div className="flex items-center justify-center h-full text-ocean-300">Chart type not supported</div>
    }
  }

  const getParameterStats = () => {
    if (!data.length) return null

    const values = data.map(d => d[selectedParameter as keyof OceanDataPoint] as number)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length
    const trend = values.slice(-10).reduce((sum, val, i, arr) => {
      if (i === 0) return 0
      return sum + (val - arr[i-1])
    }, 0)

    return { min, max, avg, trend }
  }

  const stats = getParameterStats()

  return (
    <div className="glass-morphism rounded-xl border border-ocean-700/30 overflow-hidden">
      {/* Chart Header */}
      <div className="p-4 border-b border-ocean-700/30">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center">
              {currentParam.icon}
              <span className="ml-2">{title}</span>
            </h3>
            {subtitle && (
              <p className="text-sm text-ocean-300 mt-1">{subtitle}</p>
            )}
          </div>
          
          {showControls && (
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors">
                <Settings className="w-4 h-4 text-ocean-300" />
              </button>
              <button className="p-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors">
                <Download className="w-4 h-4 text-ocean-300" />
              </button>
              <button className="p-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors">
                <Maximize2 className="w-4 h-4 text-ocean-300" />
              </button>
            </div>
          )}
        </div>

        {/* Parameter Selection */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex space-x-2">
            {parameters.map((param) => (
              <motion.button
                key={param.key}
                onClick={() => {
                  setSelectedParameter(param.key as 'temperature' | 'salinity' | 'oxygen' | 'pH' | 'chlorophyll')
                  onParameterChange?.(param.key)
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedParameter === param.key
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-deep-700/50 text-ocean-300 hover:bg-deep-600/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {param.icon}
                <span>{param.label}</span>
              </motion.button>
            ))}
          </div>

          {chartType === 'time_series' && (
            <div className="flex space-x-1 ml-4">
              {(['1D', '7D', '30D', 'ALL'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    timeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-deep-700/50 text-ocean-300 hover:bg-deep-600/50'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-white">{stats.min.toFixed(2)}</div>
              <div className="text-xs text-ocean-400">Min {currentParam.unit}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-white">{stats.max.toFixed(2)}</div>
              <div className="text-xs text-ocean-400">Max {currentParam.unit}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-white">{stats.avg.toFixed(2)}</div>
              <div className="text-xs text-ocean-400">Avg {currentParam.unit}</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-semibold flex items-center justify-center ${stats.trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.trend > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {Math.abs(stats.trend).toFixed(2)}
              </div>
              <div className="text-xs text-ocean-400">Trend</div>
            </div>
          </div>
        )}

        {/* Special Controls */}
        {chartType === 'temperature_profile' && (
          <div className="mt-3 flex items-center space-x-4">
            <label className="flex items-center space-x-2 text-sm text-ocean-300">
              <input
                type="checkbox"
                checked={showDepthProfile}
                onChange={(e) => setShowDepthProfile(e.target.checked)}
                className="accent-blue-500"
              />
              <span>Show all parameters</span>
            </label>
            
            <select
              value={selectedFloat || ''}
              onChange={(e) => setSelectedFloat(e.target.value || null)}
              className="bg-deep-700 text-white px-3 py-1 rounded border border-ocean-700/30 text-sm"
            >
              <option value="">All Floats</option>
              {Array.from(new Set(data.map(d => d.floatId))).map(floatId => (
                <option key={floatId} value={floatId}>Float {floatId}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Chart Content */}
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {renderChart()}
        </motion.div>
      </div>

      {/* Chart Footer */}
      <div className="p-3 border-t border-ocean-700/30 bg-deep-800/30">
        <div className="flex items-center justify-between text-xs text-ocean-400">
          <div className="flex items-center space-x-4">
            <span>{data.length} data points</span>
            <span>•</span>
            <span>Updated 5 minutes ago</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Indian Ocean Region</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OceanDataChart
