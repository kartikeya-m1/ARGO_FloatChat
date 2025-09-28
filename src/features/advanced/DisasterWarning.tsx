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
  Play
} from 'lucide-react'
import { DisasterEvent } from '../../types'

const DisasterWarning: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'cyclones' | 'tsunamis' | 'algal_blooms' | 'heatwaves'>('cyclones')

  const disasterTypes: Record<string, DisasterEvent[]> = {
    cyclones: [
      {
        title: "Cyclone Impact Simulator",
        desc: "ARGO + IMD cyclone data → storm surge prediction, heat content analysis, damage zone mapping",
        icon: <Waves className="w-6 h-6" />,
        color: "red"
      },
      {
        title: "Storm Surge Predictor",
        desc: "AI-powered storm surge height and inundation mapping for coastal vulnerability assessment",
        icon: <Activity className="w-6 h-6" />,
        color: "blue"
      },
      {
        title: "Track Prediction Enhanced",
        desc: "Machine learning models combining ocean heat content with atmospheric data for better tracking",
        icon: <Target className="w-6 h-6" />,
        color: "purple"
      },
      {
        title: "Intensity Forecasting",
        desc: "Ocean thermal energy analysis for cyclone intensification and weakening predictions",
        icon: <TrendingUp className="w-6 h-6" />,
        color: "orange"
      }
    ],
    tsunamis: [
      {
        title: "Tsunami Readiness System",
        desc: "AI detects sub-surface pressure and temperature anomalies from ARGO float networks",
        icon: <Activity className="w-6 h-6" />,
        color: "orange"
      },
      {
        title: "Deep Ocean Monitoring",
        desc: "Real-time analysis of deep ARGO float data for seismic ocean disturbances",
        icon: <Droplets className="w-6 h-6" />,
        color: "blue"
      },
      {
        title: "Wave Propagation Modeling",
        desc: "Advanced modeling of tsunami wave propagation using ocean density and current data",
        icon: <Waves className="w-6 h-6" />,
        color: "cyan"
      },
      {
        title: "Coastal Impact Assessment",
        desc: "AI-powered vulnerability mapping for tsunami impact on coastal communities",
        icon: <Shield className="w-6 h-6" />,
        color: "red"
      }
    ],
    algal_blooms: [
      {
        title: "Harmful Algal Bloom Predictor",
        desc: "ML predicts HAB formation using BGC parameters, temperature, and nutrient data",
        icon: <Droplets className="w-6 h-6" />,
        color: "green"
      },
      {
        title: "Dead Zone Monitoring",
        desc: "Oxygen depletion detection and hypoxic zone expansion prediction for marine ecosystems",
        icon: <Wind className="w-6 h-6" />,
        color: "purple"
      },
      {
        title: "Fisheries Impact Assessment",
        desc: "Economic impact modeling of algal blooms on fishing industry and aquaculture",
        icon: <Activity className="w-6 h-6" />,
        color: "blue"
      },
      {
        title: "Water Quality Alerts",
        desc: "Real-time water quality monitoring and public health alert system integration",
        icon: <Bell className="w-6 h-6" />,
        color: "red"
      }
    ],
    heatwaves: [
      {
        title: "Marine Heatwave Detector",
        desc: "AI identification of marine heatwave events and intensity classification system",
        icon: <Thermometer className="w-6 h-6" />,
        color: "red"
      },
      {
        title: "Ecosystem Impact Modeling",
        desc: "Predictive modeling of heatwave impacts on marine biodiversity and coral reefs",
        icon: <Activity className="w-6 h-6" />,
        color: "orange"
      },
      {
        title: "Coastal Temperature Index",
        desc: "Regional temperature anomaly tracking for Indian coastline vulnerability assessment",
        icon: <MapPin className="w-6 h-6" />,
        color: "yellow"
      },
      {
        title: "Climate Adaptation Planning",
        desc: "Long-term climate resilience planning using ocean warming trend analysis",
        icon: <TrendingUp className="w-6 h-6" />,
        color: "purple"
      }
    ]
  }

  const activeAlerts = [
    {
      id: 'cyclone-bay-bengal',
      type: 'Cyclone Formation',
      region: 'Bay of Bengal',
      severity: 'high',
      probability: 87,
      timeframe: '48-72 hours',
      affectedAreas: ['West Bengal', 'Odisha', 'Andhra Pradesh'],
      description: 'Deep depression likely to intensify into cyclone based on ocean heat content analysis'
    },
    {
      id: 'algal-bloom-arabian',
      type: 'Algal Bloom Risk',
      region: 'Arabian Sea',
      severity: 'medium',
      probability: 65,
      timeframe: '7-10 days',
      affectedAreas: ['Gujarat', 'Maharashtra coast'],
      description: 'Elevated nutrient levels and temperature conditions favor harmful algal bloom development'
    },
    {
      id: 'heatwave-southern',
      type: 'Marine Heatwave',
      region: 'Southern Indian Ocean',
      severity: 'low',
      probability: 42,
      timeframe: '2-3 weeks',
      affectedAreas: ['Tamil Nadu', 'Kerala coast'],
      description: 'Gradual temperature increase detected, monitoring for heatwave threshold breach'
    }
  ]

  const emergencyContacts = [
    { agency: 'Indian Meteorological Department', phone: '+91-11-2461-9877', type: 'Weather' },
    { agency: 'National Disaster Management Authority', phone: '+91-11-2674-9900', type: 'Disaster' },
    { agency: 'Indian Coast Guard', phone: '1554', type: 'Marine Emergency' },
    { agency: 'State Emergency Operations Center', phone: '1077', type: 'State Level' }
  ]

  const warningMetrics = [
    { label: 'Active Monitors', value: '2,847', icon: <Satellite />, color: 'blue' },
    { label: 'Alert Accuracy', value: '94.7%', icon: <Target />, color: 'green' },
    { label: 'Response Time', value: '&lt; 15 min', icon: <Clock />, color: 'orange' },
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
          <AlertCircle className={`w-6 h-6 ${
            alert.severity === 'high' ? 'text-red-400' :
            alert.severity === 'medium' ? 'text-yellow-400' :
            'text-green-400'
          }`} />
          <div>
            <h4 className="text-lg font-semibold text-white">{alert.type}</h4>
            <span className="text-sm text-ocean-300">{alert.region}</span>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${
            alert.severity === 'high' ? 'text-red-400' :
            alert.severity === 'medium' ? 'text-yellow-400' :
            'text-green-400'
          }`}>
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
          <div className={`font-medium ${
            alert.severity === 'high' ? 'text-red-400' :
            alert.severity === 'medium' ? 'text-yellow-400' :
            'text-green-400'
          }`}>
            {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <span className="text-ocean-400 text-sm">Affected Areas:</span>
        <div className="flex flex-wrap gap-2 mt-2">
          {alert.affectedAreas.map((area: string, i: number) => (
            <span key={i} className="text-xs px-2 py-1 bg-blue-900/20 text-blue-300 rounded">
              {area}
            </span>
          ))}
        </div>
      </div>

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
            <button className="flex items-center space-x-2 px-4 py-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors">
              <Settings className="w-4 h-4 text-ocean-300" />
              <span className="text-ocean-300">Configure</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeAlerts.map((alert, index) => (
            <AlertCard key={alert.id} alert={alert} index={index} />
          ))}
        </div>
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {disasterTypes[activeCategory].map((disaster, index) => (
          <motion.div
            key={index}
            className="glass-morphism p-6 rounded-xl border border-ocean-700/30 hover:border-red-500/50 transition-all cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className={`text-${disaster.color}-400 mb-4 group-hover:scale-110 transition-transform`}>
              {disaster.icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-red-100 transition-colors">
              {disaster.title}
            </h3>
            <p className="text-ocean-300 text-sm mb-4 group-hover:text-ocean-200 transition-colors">
              {disaster.desc}
            </p>
            <motion.button 
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-2 rounded-lg hover:shadow-lg transition-all flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="w-4 h-4 mr-2" />
              Activate Module
            </motion.button>
          </motion.div>
        ))}
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
              <div className="text-2xl font-bold text-white">2.4M</div>
              <div className="text-xs text-ocean-400">Registered Users</div>
            </div>
            <div className="text-center p-3 bg-deep-700/50 rounded-lg">
              <div className="text-2xl font-bold text-white">&lt; 30s</div>
              <div className="text-xs text-ocean-400">Alert Delivery</div>
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

export default DisasterWarning
