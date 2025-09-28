import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react'

const MetricsPanel: React.FC = () => {
  const recentActivity = [
    { time: '2 min ago', event: 'Float 4902345 transmitted new data', type: 'data' },
    { time: '15 min ago', event: 'Quality control completed for Pacific region', type: 'quality' },
    { time: '1 hour ago', event: 'New float deployed in Arabian Sea', type: 'deployment' },
    { time: '2 hours ago', event: 'Temperature anomaly detected in North Atlantic', type: 'alert' },
    { time: '4 hours ago', event: 'Weekly data sync completed successfully', type: 'system' }
  ]

  const performanceMetrics = [
    { label: 'Data Ingestion Rate', value: '2.4k/hour', trend: 8.5, icon: <Activity className="w-5 h-5" /> },
    { label: 'Processing Speed', value: '1.2s avg', trend: -12.3, icon: <Clock className="w-5 h-5" /> },
    { label: 'Float Response Rate', value: '94.2%', trend: 2.1, icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'Data Quality Score', value: '98.7%', trend: 1.5, icon: <TrendingUp className="w-5 h-5" /> }
  ]

  const getEventColor = (type: string) => {
    switch (type) {
      case 'data': return 'text-blue-400'
      case 'quality': return 'text-green-400'
      case 'deployment': return 'text-purple-400'
      case 'alert': return 'text-coral-400'
      case 'system': return 'text-ocean-400'
      default: return 'text-ocean-300'
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'data': return '📊'
      case 'quality': return '✅'
      case 'deployment': return '🚀'
      case 'alert': return '⚠️'
      case 'system': return '⚙️'
      default: return '📋'
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Performance Metrics */}
      <motion.div
        className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-semibold text-white mb-6">Performance Metrics</h3>
        <div className="space-y-4">
          {performanceMetrics.map((metric, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between p-4 bg-deep-700/30 rounded-lg border border-ocean-800/20 hover:border-ocean-600/30 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <div className="flex items-center space-x-3">
                <div className="text-ocean-400">
                  {metric.icon}
                </div>
                <div>
                  <div className="text-sm text-ocean-300">{metric.label}</div>
                  <div className="text-lg font-semibold text-white">{metric.value}</div>
                </div>
              </div>
              <div className={`flex items-center space-x-1 ${
                metric.trend > 0 ? 'text-green-400' : 'text-coral-400'
              }`}>
                {metric.trend > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {Math.abs(metric.trend)}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-deep-700/20 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div className="text-lg">{getEventIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${getEventColor(activity.type)} leading-relaxed`}>
                  {activity.event}
                </p>
                <p className="text-xs text-ocean-400 mt-1">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.button
          className="w-full mt-4 text-center text-sm text-ocean-400 hover:text-ocean-300 transition-colors"
          whileHover={{ y: -2 }}
        >
          View all activity →
        </motion.button>
      </motion.div>
    </div>
  )
}

export default MetricsPanel