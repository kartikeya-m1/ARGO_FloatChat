import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  AlertCircle,
  Waves,
  Activity,
  Droplets,
  Thermometer,
  Wind,
  Bell,
  Shield,
  Target,
  Clock,
  MapPin,
  Users,
  Phone,
  Siren,
  Satellite,
  TrendingUp,
  CheckCircle,
  Settings,
  Play,
  RefreshCw,
  Loader
} from 'lucide-react'
import { 
  useDisasterAlerts, 
  useCycloneAnalysis,
  getSeverityColor,
  getConfidenceColor 
} from '../../hooks/useAdvancedAnalytics'

const EnhancedDisasterWarning: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'cyclones' | 'tsunamis' | 'algal_blooms' | 'heatwaves'>('cyclones')

  // Real data hooks
  const { alerts, loading: alertsLoading, error: alertsError, alertSummary, refetch: refetchAlerts } = useDisasterAlerts()
  const { cycloneData, loading: cycloneLoading, error: cycloneError, refetch: refetchCyclone } = useCycloneAnalysis()

  const emergencyContacts = [
    { agency: 'Indian Meteorological Department', phone: '+91-11-2461-9877', type: 'Weather' },
    { agency: 'National Disaster Management Authority', phone: '+91-11-2674-9900', type: 'Disaster' },
    { agency: 'Indian Coast Guard', phone: '1554', type: 'Marine Emergency' },
    { agency: 'State Emergency Operations Center', phone: '1077', type: 'State Level' }
  ]

  const warningMetrics = [
    { label: 'Active Monitors', value: '2,847', icon: <Satellite />, color: 'blue' },
    { label: 'Alert Accuracy', value: cycloneData ? `${cycloneData.formation_probability.toFixed(1)}%` : 'N/A', icon: <Target />, color: 'green' },
    { label: 'Response Time', value: '< 15 min', icon: <Clock />, color: 'orange' },
    { label: 'Coverage Area', value: '100%', icon: <Shield />, color: 'purple' }
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
          ? 'bg-gradient-to-r from-red-600 to-orange-700 text-white shadow-lg' 
          : 'bg-deep-700/50 text-ocean-300 hover:text-white hover:bg-deep-600/50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={isActive ? 'text-white' : 'text-red-400'}>{icon}</div>
      <span>{label}</span>
    </motion.button>
  )

  const AlertCard = ({ alert, index }: { alert: any; index: number }) => (
    <motion.div
      className={`glass-morphism p-6 rounded-xl border transition-all ${
        alert.severity === 'high' ? 'border-red-500/70 bg-red-900/10' :
        alert.severity === 'medium' ? 'border-yellow-500/70 bg-yellow-900/10' :
        'border-green-500/70 bg-green-900/10'
      }`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <AlertCircle className={getSeverityColor(alert.severity)} />
          <div>
            <h4 className="text-lg font-semibold text-white">{alert.disaster_type.replace('_', ' ').toUpperCase()}</h4>
            <span className="text-sm text-ocean-300">{alert.region}</span>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getSeverityColor(alert.severity)}`}>
            {alert.probability}%
          </div>
          <div className="text-xs text-ocean-400">Probability</div>
        </div>
      </div>

      <p className="text-ocean-300 text-sm mb-4">{alert.description}</p>

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <span className="text-ocean-400">Timeframe:</span>
          <div className="text-white font-medium">{alert.timeframe}</div>
        </div>
        <div>
          <span className="text-ocean-400">Severity:</span>
          <div className={`font-medium ${getSeverityColor(alert.severity)}`}>
            {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <span className="text-ocean-400 text-sm">Affected Areas:</span>
        <div className="flex flex-wrap gap-2 mt-2">
          {alert.affected_areas.map((area: string, i: number) => (
            <span key={i} className="text-xs px-2 py-1 bg-blue-900/20 text-blue-300 rounded">
              {area}
            </span>
          ))}
        </div>
      </div>

      {alert.recommended_actions && alert.recommended_actions.length > 0 && (
        <div className="mb-4">
          <span className="text-ocean-400 text-sm">Recommended Actions:</span>
          <div className="mt-2 space-y-1">
            {alert.recommended_actions.slice(0, 3).map((action: string, i: number) => (
              <div key={i} className="text-xs text-ocean-200 flex items-start">
                <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                {action}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        <button className={`flex-1 py-2 rounded-lg font-medium transition-all ${
          alert.severity === 'high' ? 'bg-red-600 text-white' :
          alert.severity === 'medium' ? 'bg-yellow-600 text-white' :
          'bg-green-600 text-white'
        }`}>
          <Bell className="w-4 h-4 inline mr-2" />
          Issue Alert
        </button>
        <button className="p-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors">
          <Settings className="w-4 h-4 text-ocean-300" />
        </button>
      </div>
    </motion.div>
  )

  const CycloneAnalysisCard = () => {
    if (cycloneLoading) {
      return (
        <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center space-x-2">
              <Loader className="w-5 h-5 text-blue-400 animate-spin" />
              <span className="text-ocean-300">Loading cyclone analysis...</span>
            </div>
          </div>
        </div>
      )
    }

    if (cycloneError || !cycloneData) {
      return (
        <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-red-400 text-sm mb-2">Cyclone analysis unavailable</div>
            <div className="text-ocean-400 text-xs">{cycloneError || 'No data'}</div>
          </div>
        </div>
      )
    }

    return (
      <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Waves className="w-5 h-5 mr-2 text-blue-400" />
          Cyclone Formation Analysis
        </h4>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getConfidenceColor(cycloneData.formation_probability)}`}>
              {cycloneData.formation_probability.toFixed(1)}%
            </div>
            <div className="text-xs text-ocean-400">Formation Probability</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">
              {cycloneData.risk_assessment?.formation_risk || 'N/A'}
            </div>
            <div className="text-xs text-ocean-400">Risk Level</div>
          </div>
        </div>

        <div className="space-y-2 mb-4 text-sm">
          <div className="flex justify-between">
            <span className="text-ocean-400">Intensity Forecast:</span>
            <span className="text-white">{cycloneData.intensity_forecast}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ocean-400">Region:</span>
            <span className="text-white capitalize">{cycloneData.region.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ocean-400">Forecast Period:</span>
            <span className="text-white">{cycloneData.forecast_period_days} days</span>
          </div>
          {cycloneData.risk_assessment?.landfall_probability && (
            <div className="flex justify-between">
              <span className="text-ocean-400">Landfall Probability:</span>
              <span className="text-white">{cycloneData.risk_assessment.landfall_probability.toFixed(1)}%</span>
            </div>
          )}
        </div>

        <button 
          onClick={refetchCyclone}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg hover:shadow-lg transition-all"
          disabled={cycloneLoading}
        >
          <RefreshCw className={`w-4 h-4 inline mr-2 ${cycloneLoading ? 'animate-spin' : ''}`} />
          Update Analysis
        </button>
      </div>
    )
  }

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'cyclones':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CycloneAnalysisCard />
            <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-400" />
                Track Prediction Model
              </h4>
              <p className="text-ocean-300 mb-4 text-sm">
                Machine learning enhanced cyclone track prediction combining ocean heat content with atmospheric data.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-deep-700/50 rounded">
                  <span className="text-white text-sm">Ocean Heat Content</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex items-center justify-between p-2 bg-deep-700/50 rounded">
                  <span className="text-white text-sm">SST Analysis</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex items-center justify-between p-2 bg-deep-700/50 rounded">
                  <span className="text-white text-sm">Atmospheric Coupling</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
              </div>
              <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:shadow-lg transition-all">
                <Play className="w-4 h-4 inline mr-2" />
                Run Prediction
              </button>
            </div>
          </div>
        )

      case 'tsunamis':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-orange-400" />
                Deep Ocean Monitoring
              </h4>
              <p className="text-ocean-300 mb-4 text-sm">
                Real-time analysis of ARGO float data for seismic ocean disturbances and pressure anomalies.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ocean-400">Active Deep Floats:</span>
                  <span className="text-white">847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ocean-400">Monitoring Depth:</span>
                  <span className="text-white">&gt; 1500m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ocean-400">Detection Threshold:</span>
                  <span className="text-white">±50 dbar</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 rounded-lg hover:shadow-lg transition-all">
                <Play className="w-4 h-4 inline mr-2" />
                Activate Monitoring
              </button>
            </div>

            <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Waves className="w-5 h-5 mr-2 text-cyan-400" />
                Wave Propagation Model
              </h4>
              <p className="text-ocean-300 mb-4 text-sm">
                Advanced modeling using ocean density and current data for tsunami wave propagation prediction.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ocean-400">Model Resolution:</span>
                  <span className="text-white">0.1° × 0.1°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ocean-400">Propagation Speed:</span>
                  <span className="text-white">~800 km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ocean-400">Forecast Range:</span>
                  <span className="text-white">24 hours</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2 rounded-lg hover:shadow-lg transition-all">
                <Play className="w-4 h-4 inline mr-2" />
                Run Simulation
              </button>
            </div>
          </div>
        )

      case 'algal_blooms':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Droplets className="w-5 h-5 mr-2 text-green-400" />
                Harmful Algal Bloom Prediction
              </h4>
              <p className="text-ocean-300 mb-4 text-sm">
                Machine learning predicts HAB formation using BGC parameters, temperature, and nutrient data.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ocean-400">BGC Float Coverage:</span>
                  <span className="text-white">156 floats</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ocean-400">Chlorophyll Monitoring:</span>
                  <span className="text-green-400">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ocean-400">Prediction Accuracy:</span>
                  <span className="text-white">84.7%</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 rounded-lg hover:shadow-lg transition-all">
                <Play className="w-4 h-4 inline mr-2" />
                Generate Forecast
              </button>
            </div>

            <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Wind className="w-5 h-5 mr-2 text-purple-400" />
                Dead Zone Monitoring
              </h4>
              <p className="text-ocean-300 mb-4 text-sm">
                Oxygen depletion detection and hypoxic zone expansion prediction for marine ecosystems.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ocean-400">O2 Threshold:</span>
                  <span className="text-white">&lt; 2 mg/L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ocean-400">Affected Area:</span>
                  <span className="text-white">~4,500 km²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ocean-400">Expansion Rate:</span>
                  <span className="text-white">+2.3%/year</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg hover:shadow-lg transition-all">
                <Play className="w-4 h-4 inline mr-2" />
                Monitor Zones
              </button>
            </div>
          </div>
        )

      case 'heatwaves':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Thermometer className="w-5 h-5 mr-2 text-red-400" />
                Marine Heatwave Detection
              </h4>
              <p className="text-ocean-300 mb-4 text-sm">
                AI identification of marine heatwave events and intensity classification system.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ocean-400">Threshold:</span>
                  <span className="text-white">+2°C above climatology</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ocean-400">Current Anomaly:</span>
                  <span className="text-yellow-400">+1.3°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ocean-400">Risk Level:</span>
                  <span className="text-green-400">Moderate</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-gradient-to-r from-red-600 to-orange-600 text-white py-2 rounded-lg hover:shadow-lg transition-all">
                <Play className="w-4 h-4 inline mr-2" />
                Detect Events
              </button>
            </div>

            <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
                Climate Adaptation Planning
              </h4>
              <p className="text-ocean-300 mb-4 text-sm">
                Long-term climate resilience planning using ocean warming trend analysis.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ocean-400">Warming Rate:</span>
                  <span className="text-white">+0.13°C/decade</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ocean-400">Projection (2050):</span>
                  <span className="text-orange-400">+2.1°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ocean-400">Confidence:</span>
                  <span className="text-white">89%</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:shadow-lg transition-all">
                <Play className="w-4 h-4 inline mr-2" />
                Generate Plan
              </button>
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
            <AlertCircle className="w-8 h-8 mr-3 text-red-500" />
            Disaster & Early Warning Systems
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-red-400">
            <Siren className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-medium">Alert Systems Active</span>
          </div>
        </div>
      </div>

      {/* Warning System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {warningMetrics.map((metric, index) => (
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

      {/* Active Alerts */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <Bell className="w-6 h-6 mr-2 text-red-400" />
            Active Alerts & Warnings
          </h3>
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all">
              <Siren className="w-4 h-4" />
              <span>Emergency Broadcast</span>
            </button>
            <button 
              onClick={refetchAlerts}
              className="flex items-center space-x-2 px-4 py-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors"
              disabled={alertsLoading}
            >
              <RefreshCw className={`w-4 h-4 text-ocean-300 ${alertsLoading ? 'animate-spin' : ''}`} />
              <span className="text-ocean-300">Refresh</span>
            </button>
          </div>
        </div>
        
        {alertsLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <Loader className="w-6 h-6 text-red-400 animate-spin" />
              <span className="text-ocean-300">Loading active alerts...</span>
            </div>
          </div>
        )}

        {alertsError && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <div className="text-red-400 mb-2">Error loading alerts</div>
              <div className="text-ocean-400 text-sm">{alertsError}</div>
            </div>
          </div>
        )}

        {!alertsLoading && !alertsError && alerts && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {alerts.map((alert, index) => (
              <AlertCard key={alert.alert_id} alert={alert} index={index} />
            ))}
          </div>
        )}

        {!alertsLoading && !alertsError && alerts && alerts.length === 0 && (
          <div className="text-center py-12 text-ocean-400">
            <CheckCircle className="w-12 h-12 mx-auto mb-4" />
            <div>No active disaster alerts</div>
            <div className="text-sm mt-2">All systems normal</div>
          </div>
        )}
      </div>

      {/* Category Navigation */}
      <div className="flex flex-wrap gap-4">
        <CategoryButton 
          id="cyclones" 
          label="Cyclone Systems" 
          icon={<Waves className="w-5 h-5" />}
          isActive={activeCategory === 'cyclones'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
        <CategoryButton 
          id="tsunamis" 
          label="Tsunami Detection" 
          icon={<Activity className="w-5 h-5" />}
          isActive={activeCategory === 'tsunamis'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
        <CategoryButton 
          id="algal_blooms" 
          label="Algal Blooms & Dead Zones" 
          icon={<Droplets className="w-5 h-5" />}
          isActive={activeCategory === 'algal_blooms'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
        <CategoryButton 
          id="heatwaves" 
          label="Marine Heatwaves" 
          icon={<Thermometer className="w-5 h-5" />}
          isActive={activeCategory === 'heatwaves'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
      </div>

      {/* Disaster Type Applications */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderCategoryContent()}
      </motion.div>

      {/* Emergency Response */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Phone className="w-6 h-6 mr-2 text-green-400" />
            Emergency Response Network
          </h3>
          <p className="text-ocean-300 mb-6">Direct communication channels with disaster management authorities and response teams.</p>
          
          <div className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-deep-700/50 rounded-lg border border-ocean-700/30">
                <div>
                  <div className="text-white font-medium text-sm">{contact.agency}</div>
                  <div className="text-ocean-400 text-xs">{contact.type}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-400 font-mono text-sm">{contact.phone}</span>
                  <button className="p-2 bg-green-600/20 rounded-lg hover:bg-green-600/30 transition-colors">
                    <Phone className="w-4 h-4 text-green-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-400" />
            Community Alert System
          </h3>
          <p className="text-ocean-300 mb-6">Multi-channel public warning system with SMS, app notifications, and social media integration.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-deep-700/50 rounded-lg">
              <div className="text-2xl font-bold text-white">
                {alertSummary?.regions_affected?.length || 0}
              </div>
              <div className="text-xs text-ocean-400">Active Regions</div>
            </div>
            <div className="text-center p-3 bg-deep-700/50 rounded-lg">
              <div className="text-2xl font-bold text-white">
                {alertSummary?.total_alerts || 0}
              </div>
              <div className="text-xs text-ocean-400">Total Alerts</div>
            </div>
          </div>
          
          <div className="space-y-2 text-sm mb-6">
            {['SMS/WhatsApp Alerts', 'Mobile App Notifications', 'Social Media Broadcasts', 'Radio/TV Integration', 'Siren Network Control'].map((channel, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-ocean-200">{channel}</span>
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
            ))}
          </div>
          
          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all">
            <Siren className="w-4 h-4 inline mr-2" />
            Test Alert System
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default EnhancedDisasterWarning
