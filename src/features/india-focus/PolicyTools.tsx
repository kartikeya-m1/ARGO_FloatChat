import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Building,
  MessageSquare,
  Globe,
  Heart,
  GraduationCap,
  Users,
  Phone,
  Mail,
  Share2,
  Bot,
  Smartphone,
  Radio,
  Tv,
  Bell,
  FileText,
  BarChart3,
  Vote,
  Calculator,
  Target,
  TrendingUp,
  Clock,
  MapPin,
  Zap,
  Eye,
  Settings
} from 'lucide-react'
import { PolicyTool } from '../../types'

const PolicyTools: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'chatbots' | 'simulations' | 'health' | 'education'>('chatbots')
  const [selectedRegion, setSelectedRegion] = useState<'national' | 'coastal' | 'island'>('national')

  const policyTools: Record<string, PolicyTool[]> = {
    chatbots: [
      {
        title: "Ocean WhatsApp Bot",
        desc: "Ask questions like 'How's the Arabian Sea today?' via WhatsApp, Telegram, and voice assistants",
        icon: <MessageSquare className="w-6 h-6" />,
        color: "sky"
      },
      {
        title: "Multilingual Voice Assistant", 
        desc: "Ocean data queries in 12 Indian languages with voice recognition and text-to-speech",
        icon: <Phone className="w-6 h-6" />,
        color: "green"
      },
      {
        title: "SMS Alert System",
        desc: "Critical ocean alerts and fishing zone updates delivered via SMS for feature phone users",
        icon: <Mail className="w-6 h-6" />,
        color: "blue"
      },
      {
        title: "Social Media Integration",
        desc: "Real-time ocean updates and citizen reports through Twitter, Facebook, and Instagram bots",
        icon: <Share2 className="w-6 h-6" />,
        color: "purple"
      }
    ],
    simulations: [
      {
        title: "Climate Policy Simulator",
        desc: "Interactive tool: What happens with +2°C Indian Ocean warming? Economic & ecological impacts",
        icon: <Globe className="w-6 h-6" />,
        color: "purple"
      },
      {
        title: "Coastal Impact Modeler",
        desc: "Visualize sea level rise impacts on coastal infrastructure and communities over time",
        icon: <Building className="w-6 h-6" />,
        color: "red"
      },
      {
        title: "Policy Cost-Benefit Analyzer",
        desc: "Economic analysis of marine conservation policies with real-time ocean data integration",
        icon: <Calculator className="w-6 h-6" />,
        color: "green"
      },
      {
        title: "Fisheries Management Simulator",
        desc: "Test different fishing quota scenarios and their impact on marine ecosystems and economy",
        icon: <Target className="w-6 h-6" />,
        color: "blue"
      }
    ],
    health: [
      {
        title: "Ocean Health Scorecard",
        desc: "Real-time health ratings for India's EEZ with citizen-friendly explanations and recommendations",
        icon: <Heart className="w-6 h-6" />,
        color: "rose"
      },
      {
        title: "Pollution Impact Tracker",
        desc: "Track ocean pollution sources and their impact on marine life and human health",
        icon: <BarChart3 className="w-6 h-6" />,
        color: "orange"
      },
      {
        title: "Marine Protected Area Monitor",
        desc: "Real-time monitoring and reporting system for MPA effectiveness and compliance",
        icon: <Eye className="w-6 h-6" />,
        color: "green"
      },
      {
        title: "Citizen Water Quality Reporter",
        desc: "Mobile app for citizens to report water quality issues with photo and location data",
        icon: <Smartphone className="w-6 h-6" />,
        color: "blue"
      }
    ],
    education: [
      {
        title: "School Ocean Dashboard",
        desc: "Simplified, gamified ocean data dashboards with educational quizzes for K-12 students",
        icon: <GraduationCap className="w-6 h-6" />,
        color: "teal"
      },
      {
        title: "Teacher Resource Hub",
        desc: "Lesson plans, activities, and real ocean data for classroom teaching and projects",
        icon: <FileText className="w-6 h-6" />,
        color: "purple"
      },
      {
        title: "Virtual Ocean Field Trips",
        desc: "Immersive AR/VR experiences of different ocean regions with live data integration",
        icon: <Globe className="w-6 h-6" />,
        color: "cyan"
      },
      {
        title: "Community Science Projects",
        desc: "Citizen science initiatives connecting communities with ocean research and conservation",
        icon: <Users className="w-6 h-6" />,
        color: "green"
      }
    ]
  }

  const engagementMetrics = [
    { label: "Active Users", value: "2.4M", icon: <Users />, color: "blue", growth: "+23%" },
    { label: "Daily Queries", value: "47.2K", icon: <MessageSquare />, color: "green", growth: "+18%" },
    { label: "Languages Supported", value: "12", icon: <Globe />, color: "purple", growth: "+3" },
    { label: "Response Time", value: "&lt; 3 sec", icon: <Clock />, color: "orange", growth: "-15%" }
  ]

  const communicationChannels = [
    {
      channel: "WhatsApp Bot",
      users: "1.2M active",
      language: "Hindi, English, Bengali",
      usage: "Daily ocean updates, fishing alerts",
      satisfaction: "4.6/5"
    },
    {
      channel: "Voice Assistant",
      users: "340K active", 
      language: "12 Indian languages",
      usage: "Voice queries, hands-free updates",
      satisfaction: "4.4/5"
    },
    {
      channel: "SMS Alerts",
      users: "890K subscribers",
      language: "Regional languages",
      usage: "Emergency alerts, weather warnings",
      satisfaction: "4.7/5"
    },
    {
      channel: "Mobile App",
      users: "560K downloads",
      language: "Multilingual interface", 
      usage: "Detailed data, visualizations",
      satisfaction: "4.5/5"
    }
  ]

  const policyScenarios = [
    {
      title: "Marine Sanctuary Expansion",
      description: "Impact of increasing protected areas from 2% to 10% of EEZ",
      economicImpact: "₹2,400 Cr investment",
      environmentalImpact: "+35% fish population recovery",
      timeframe: "10-year implementation",
      stakeholders: ["Fishers", "Government", "NGOs", "Tourism"]
    },
    {
      title: "Plastic Ban Implementation",
      description: "Complete single-use plastic ban in coastal areas and its ocean impact",
      economicImpact: "₹1,800 Cr compliance cost",
      environmentalImpact: "-60% marine plastic pollution",
      timeframe: "5-year phased rollout",
      stakeholders: ["Industry", "Citizens", "Government", "Environment"]
    },
    {
      title: "Blue Carbon Trading",
      description: "Establishing carbon credit market for mangrove and seagrass conservation",
      economicImpact: "₹5,600 Cr revenue potential",
      environmentalImpact: "+25% carbon sequestration",
      timeframe: "3-year pilot program",
      stakeholders: ["Coastal Communities", "Carbon Market", "Government"]
    }
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
          ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-lg' 
          : 'bg-deep-700/50 text-ocean-300 hover:text-white hover:bg-deep-600/50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={isActive ? 'text-white' : 'text-sky-400'}>{icon}</div>
      <span>{label}</span>
    </motion.button>
  )

  const ToolCard = ({ tool, index }: { tool: PolicyTool; index: number }) => (
    <motion.div
      className="glass-morphism p-6 rounded-xl border border-ocean-700/30 hover:border-sky-500/50 transition-all cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <div className={`text-${tool.color}-400 mb-4 group-hover:scale-110 transition-transform`}>
        {tool.icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-sky-100 transition-colors">
        {tool.title}
      </h3>
      <p className="text-ocean-300 text-sm mb-4 group-hover:text-ocean-200 transition-colors">
        {tool.desc}
      </p>
      <motion.button 
        className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white py-2 rounded-lg hover:shadow-lg transition-all flex items-center justify-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Zap className="w-4 h-4 mr-2" />
        Launch Tool
      </motion.button>
    </motion.div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {engagementMetrics.map((metric, index) => (
          <motion.div
            key={index}
            className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`text-${metric.color}-400`}>{metric.icon}</div>
              <span className={`text-xs px-2 py-1 rounded ${
                metric.growth.startsWith('+') || metric.growth.startsWith('-') && metric.label === 'Response Time'
                  ? 'bg-green-900/30 text-green-400' 
                  : 'bg-blue-900/30 text-blue-400'
              }`}>
                {metric.growth}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
            <p className="text-ocean-300 text-sm">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Communication Channels Overview */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <MessageSquare className="w-6 h-6 mr-2 text-sky-400" />
          Multi-Channel Communication Platform
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {communicationChannels.map((channel, index) => (
            <motion.div
              key={index}
              className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">{channel.channel}</h4>
                <span className="text-xs px-3 py-1 bg-sky-900/20 text-sky-400 rounded">
                  {channel.satisfaction}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ocean-400">Active Users:</span>
                  <span className="text-white font-medium">{channel.users}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ocean-400">Languages:</span>
                  <span className="text-white">{channel.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ocean-400">Primary Use:</span>
                  <span className="text-white">{channel.usage}</span>
                </div>
              </div>
              
              <button className="w-full mt-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white py-2 rounded-lg hover:shadow-lg transition-all">
                <Eye className="w-4 h-4 inline mr-2" />
                View Analytics
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Category Navigation */}
      <div className="flex flex-wrap gap-4">
        <CategoryButton 
          id="chatbots" 
          label="Communication Bots" 
          icon={<Bot className="w-5 h-5" />}
          isActive={activeCategory === 'chatbots'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
        <CategoryButton 
          id="simulations" 
          label="Policy Simulations" 
          icon={<Calculator className="w-5 h-5" />}
          isActive={activeCategory === 'simulations'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
        <CategoryButton 
          id="health" 
          label="Ocean Health Monitoring" 
          icon={<Heart className="w-5 h-5" />}
          isActive={activeCategory === 'health'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
        <CategoryButton 
          id="education" 
          label="Public Education" 
          icon={<GraduationCap className="w-5 h-5" />}
          isActive={activeCategory === 'education'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
      </div>

      {/* Tool Cards */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {policyTools[activeCategory].map((tool, index) => (
          <ToolCard key={index} tool={tool} index={index} />
        ))}
      </motion.div>

      

      {/* Ocean Health Scorecard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Heart className="w-6 h-6 mr-2 text-rose-400" />
            Real-time Ocean Health Scorecard
          </h3>
          <p className="text-ocean-300 mb-6">Citizen-friendly health ratings for India's maritime zones with actionable recommendations.</p>
          
          <div className="space-y-4 mb-6">
            {[
              { region: "Arabian Sea", score: 78, status: "Good", trend: "+2%" },
              { region: "Bay of Bengal", score: 65, status: "Fair", trend: "-1%" },
              { region: "Lakshadweep Waters", score: 89, status: "Excellent", trend: "+5%" },
              { region: "Andaman Sea", score: 82, status: "Good", trend: "+3%" }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-deep-700/50 rounded-lg">
                <div>
                  <div className="text-white font-medium">{item.region}</div>
                  <div className={`text-sm ${
                    item.status === 'Excellent' ? 'text-green-400' :
                    item.status === 'Good' ? 'text-blue-400' :
                    item.status === 'Fair' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {item.status}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-lg">{item.score}</div>
                  <div className={`text-xs ${
                    item.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {item.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white py-3 rounded-lg hover:shadow-lg transition-all">
            <Heart className="w-4 h-4 inline mr-2" />
            View Detailed Report
          </button>
        </motion.div>
        
        <motion.div
          className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Vote className="w-6 h-6 mr-2 text-green-400" />
            Citizen Participation Dashboard
          </h3>
          <p className="text-ocean-300 mb-6">Track citizen engagement in ocean conservation and policy feedback initiatives.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-deep-700/50 rounded-lg">
              <div className="text-2xl font-bold text-green-400">15.7K</div>
              <div className="text-xs text-ocean-400">Policy Feedback</div>
            </div>
            <div className="text-center p-4 bg-deep-700/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">8.2K</div>
              <div className="text-xs text-ocean-400">Conservation Actions</div>
            </div>
            <div className="text-center p-4 bg-deep-700/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">23.1K</div>
              <div className="text-xs text-ocean-400">Data Reports</div>
            </div>
            <div className="text-center p-4 bg-deep-700/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-400">91%</div>
              <div className="text-xs text-ocean-400">Satisfaction</div>
            </div>
          </div>
          
          <div className="space-y-2 text-sm mb-6">
            {['Beach Cleanup Reports', 'Water Quality Monitoring', 'Marine Life Sightings', 'Pollution Alerts'].map((activity, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-ocean-200">{activity}</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
          
          <button className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg hover:shadow-lg transition-all">
            <Users className="w-4 h-4 inline mr-2" />
            Join Community
          </button>
        </motion.div>
      </div>

      
    </div>
  )
}

export default PolicyTools
