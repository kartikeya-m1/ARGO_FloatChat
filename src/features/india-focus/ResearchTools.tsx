import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Target,
  Brain,
  Layers,
  Search,
  TrendingUp,
  Database,
  FileText,
  BarChart3,
  GitBranch,
  Cpu,
  Zap,
  Globe,
  Users,
  Award,
  Download,
  Share2,
  Play,
  Settings,
  Eye,
  Beaker,
  Microscope,
  BookOpen,
  Code,
  Workflow
} from 'lucide-react'
import { ResearchTool } from '../../types'

const ResearchTools: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'ai_copilot' | 'data_fusion' | 'hypothesis' | 'collaboration'>('ai_copilot')
  const [selectedComplexity, setSelectedComplexity] = useState<'basic' | 'advanced' | 'expert'>('advanced')

  const researchTools: Record<string, ResearchTool[]> = {
    ai_copilot: [
      {
        title: "AI Research Copilot",
        desc: "Natural language interface: Ask questions, fetch data, run statistical analysis, and produce publication-ready plots",
        icon: <Brain className="w-6 h-6" />,
        color: "purple"
      },
      {
        title: "Automated Literature Review",
        desc: "AI-powered synthesis of oceanographic research papers with ARGO data relevance scoring",
        icon: <BookOpen className="w-6 h-6" />,
        color: "blue"
      },
      {
        title: "Smart Code Generator",
        desc: "Generate Python/R/MATLAB code for ocean data analysis based on research questions",
        icon: <Code className="w-6 h-6" />,
        color: "green"
      },
      {
        title: "Methodology Recommender",
        desc: "AI suggests optimal statistical and ML methods based on data characteristics and research goals",
        icon: <Workflow className="w-6 h-6" />,
        color: "orange"
      }
    ],
    data_fusion: [
      {
        title: "Multi-Dataset Integration",
        desc: "Seamlessly combine ARGO, satellite altimetry, ocean color, and reanalysis data with temporal alignment",
        icon: <Layers className="w-6 h-6" />,
        color: "cyan"
      },
      {
        title: "Cross-Validation Engine",
        desc: "Automated quality control and validation across multiple ocean observation platforms",
        icon: <Target className="w-6 h-6" />,
        color: "red"
      },
      {
        title: "Spatial-Temporal Interpolation",
        desc: "Advanced gap-filling algorithms for creating continuous ocean state estimates",
        icon: <Globe className="w-6 h-6" />,
        color: "indigo"
      },
      {
        title: "Data Lake Management",
        desc: "Unified access to petabytes of ocean data with intelligent caching and preprocessing",
        icon: <Database className="w-6 h-6" />,
        color: "blue"
      }
    ],
    hypothesis: [
      {
        title: "Anomaly-to-Hypothesis Engine",
        desc: "AI automatically generates research questions from detected patterns and anomalies in ocean data",
        icon: <Search className="w-6 h-6" />,
        color: "indigo"
      },
      {
        title: "Causal Discovery Framework",
        desc: "Machine learning tools to identify causal relationships in complex ocean-climate systems",
        icon: <GitBranch className="w-6 h-6" />,
        color: "purple"
      },
      {
        title: "Predictive Experiment Designer",
        desc: "AI-guided experimental design for ocean field campaigns and data collection strategies",
        icon: <Beaker className="w-6 h-6" />,
        color: "green"
      },
      {
        title: "Research Gap Identifier",
        desc: "Systematic analysis of knowledge gaps in ocean science using AI and literature mining",
        icon: <Microscope className="w-6 h-6" />,
        color: "orange"
      }
    ],
    collaboration: [
      {
        title: "Global Research Network",
        desc: "Connect with 2,400+ ocean researchers worldwide for data sharing and collaboration",
        icon: <Users className="w-6 h-6" />,
        color: "blue"
      },
      {
        title: "Peer Review Assistant",
        desc: "AI-powered review of research methodologies and statistical approaches before submission",
        icon: <Award className="w-6 h-6" />,
        color: "yellow"
      },
      {
        title: "Real-time Collaboration Suite",
        desc: "Shared workspace for multi-institutional research projects with version control",
        icon: <GitBranch className="w-6 h-6" />,
        color: "green"
      },
      {
        title: "Open Science Platform",
        desc: "Publish datasets, code, and reproducible research workflows with DOI assignment",
        icon: <FileText className="w-6 h-6" />,
        color: "purple"
      }
    ]
  }

  const researchMetrics = [
    { label: "Active Researchers", value: "2,847", icon: <Users />, color: "blue", growth: "+28%" },
    { label: "Publications Generated", value: "156", icon: <FileText />, color: "green", growth: "+45%" },
    { label: "Datasets Integrated", value: "23", icon: <Database />, color: "purple", growth: "+12%" },
    { label: "Analysis Success Rate", value: "94.7%", icon: <Target />, color: "orange", growth: "+8%" }
  ]

  const activeProjects = [
    {
      title: "Indian Ocean Meridional Overturning Circulation",
      lead: "Dr. Sharma, NIOT",
      institution: "National Institute of Ocean Technology",
      duration: "24 months",
      funding: "₹2.8 Cr",
      status: "Active",
      progress: 67,
      publications: 3,
      datasets: 12
    },
    {
      title: "Bay of Bengal Oxygen Minimum Zone Dynamics",
      lead: "Dr. Patel, IISC",
      institution: "Indian Institute of Science",
      duration: "18 months", 
      funding: "₹1.9 Cr",
      status: "Analysis Phase",
      progress: 83,
      publications: 2,
      datasets: 8
    },
    {
      title: "Arabian Sea Marine Heatwave Prediction",
      lead: "Dr. Kumar, INCOIS",
      institution: "Indian National Centre for Ocean Information Services",
      duration: "36 months",
      funding: "₹4.2 Cr",
      status: "Data Collection",
      progress: 45,
      publications: 1,
      datasets: 15
    }
  ]

  const trendingResearch = [
    {
      topic: "Machine Learning in Oceanography",
      papers: 247,
      growth: "+89%",
      applications: ["Prediction Models", "Pattern Recognition", "Data Fusion"]
    },
    {
      topic: "Climate Change Impact Assessment",
      papers: 189,
      growth: "+67%", 
      applications: ["Sea Level Rise", "Ocean Warming", "Acidification"]
    },
    {
      topic: "Biogeochemical Cycle Modeling",
      papers: 134,
      growth: "+54%",
      applications: ["Carbon Cycle", "Nutrient Distribution", "Oxygen Dynamics"]
    },
    {
      topic: "High-Resolution Ocean Modeling",
      papers: 98,
      growth: "+43%",
      applications: ["Mesoscale Dynamics", "Coastal Processes", "Extreme Events"]
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
          ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg' 
          : 'bg-deep-700/50 text-ocean-300 hover:text-white hover:bg-deep-600/50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={isActive ? 'text-white' : 'text-purple-400'}>{icon}</div>
      <span>{label}</span>
    </motion.button>
  )

  const ToolCard = ({ tool, index }: { tool: ResearchTool; index: number }) => (
    <motion.div
      className="glass-morphism p-6 rounded-xl border border-ocean-700/30 hover:border-purple-500/50 transition-all cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <div className={`text-${tool.color}-400 mb-4 group-hover:scale-110 transition-transform`}>
        {tool.icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-100 transition-colors">
        {tool.title}
      </h3>
      <p className="text-ocean-300 text-sm mb-4 group-hover:text-ocean-200 transition-colors">
        {tool.desc}
      </p>
      <motion.button 
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg hover:shadow-lg transition-all flex items-center justify-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Play className="w-4 h-4 mr-2" />
        Launch Tool
      </motion.button>
    </motion.div>
  )

  return (
    <div className="space-y-8">
      

      {/* Research Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {researchMetrics.map((metric, index) => (
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
                metric.growth.startsWith('+') ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
              }`}>
                {metric.growth}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
            <p className="text-ocean-300 text-sm">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Active Research Projects */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <FileText className="w-6 h-6 mr-2 text-blue-400" />
          Active Research Projects
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {activeProjects.map((project, index) => (
            <motion.div
              key={index}
              className="glass-morphism p-6 rounded-xl border border-ocean-700/30 hover:border-blue-500/50 transition-all"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-4">
                <h4 className="text-lg font-semibold text-white leading-tight">{project.title}</h4>
                <span className={`text-xs px-2 py-1 rounded ${
                  project.status === 'Active' ? 'bg-green-900/20 text-green-400' :
                  project.status === 'Analysis Phase' ? 'bg-blue-900/20 text-blue-400' :
                  'bg-yellow-900/20 text-yellow-400'
                }`}>
                  {project.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                <div>
                  <span className="text-ocean-400">Lead:</span>
                  <span className="text-white ml-2">{project.lead}</span>
                </div>
                <div>
                  <span className="text-ocean-400">Institution:</span>
                  <span className="text-white ml-2">{project.institution}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-ocean-400">Duration:</span>
                    <div className="text-white">{project.duration}</div>
                  </div>
                  <div>
                    <span className="text-ocean-400">Funding:</span>
                    <div className="text-white">{project.funding}</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-ocean-400">Progress</span>
                  <span className="text-white">{project.progress}%</span>
                </div>
                <div className="w-full bg-deep-700 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{project.publications}</div>
                  <div className="text-xs text-ocean-400">Publications</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{project.datasets}</div>
                  <div className="text-xs text-ocean-400">Datasets</div>
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:shadow-lg transition-all">
                <Eye className="w-4 h-4 inline mr-2" />
                View Project Details
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Category Navigation */}
      <div className="flex flex-wrap gap-4">
        <CategoryButton 
          id="ai_copilot" 
          label="AI Research Copilot" 
          icon={<Brain className="w-5 h-5" />}
          isActive={activeCategory === 'ai_copilot'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
        <CategoryButton 
          id="data_fusion" 
          label="Data Fusion Platform" 
          icon={<Layers className="w-5 h-5" />}
          isActive={activeCategory === 'data_fusion'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
        <CategoryButton 
          id="hypothesis" 
          label="Hypothesis Generation" 
          icon={<Search className="w-5 h-5" />}
          isActive={activeCategory === 'hypothesis'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
        <CategoryButton 
          id="collaboration" 
          label="Collaboration Hub" 
          icon={<Users className="w-5 h-5" />}
          isActive={activeCategory === 'collaboration'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
      </div>

      {/* Research Tools */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {researchTools[activeCategory].map((tool, index) => (
          <ToolCard key={index} tool={tool} index={index} />
        ))}
      </motion.div>

      

      {/* Advanced Analytics Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Cpu className="w-6 h-6 mr-2 text-orange-400" />
            10-Year Trend Extractor
          </h3>
          <p className="text-ocean-300 mb-6">AI-powered detection of long-term warming, cooling, and biogeochemical trends with statistical significance testing.</p>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-ocean-300 text-sm mb-2 block">Parameter Selection</label>
              <select className="w-full bg-deep-700 text-white px-3 py-2 rounded border border-ocean-700/30 focus:border-orange-500 focus:outline-none">
                <option>Temperature (All Depths)</option>
                <option>Salinity Distribution</option>
                <option>Oxygen Concentration</option>
                <option>pH Levels</option>
                <option>Chlorophyll Trends</option>
              </select>
            </div>
            <div>
              <label className="text-ocean-300 text-sm mb-2 block">Regional Focus</label>
              <select className="w-full bg-deep-700 text-white px-3 py-2 rounded border border-ocean-700/30 focus:border-orange-500 focus:outline-none">
                <option>Global Analysis</option>
                <option>Indian Ocean</option>
                <option>Arabian Sea</option>
                <option>Bay of Bengal</option>
                <option>Southern Ocean</option>
              </select>
            </div>
          </div>
          
          <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg hover:shadow-lg transition-all">
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Extract Trends
          </button>
        </motion.div>
        
        <motion.div
          className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-yellow-400" />
            Publication Assistant
          </h3>
          <p className="text-ocean-300 mb-6">AI-powered writing assistant for oceanographic research papers with automated figure generation and citation management.</p>
          
          <div className="space-y-3 mb-6 text-sm">
            <div className="flex justify-between">
              <span className="text-ocean-400">Papers Assisted:</span>
              <span className="text-white">2,847</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ocean-400">Average Impact Factor:</span>
              <span className="text-white">4.2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ocean-400">Acceptance Rate:</span>
              <span className="text-green-400">94.7%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ocean-400">Time Saved:</span>
              <span className="text-white">67%</span>
            </div>
          </div>
          
          <div className="space-y-2 mb-6">
            {['Abstract Generation', 'Figure Creation', 'Citation Management', 'Peer Review Preparation'].map((feature, i) => (
              <div key={i} className="flex items-center text-sm">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                <span className="text-ocean-200">{feature}</span>
              </div>
            ))}
          </div>
          
          <button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-3 rounded-lg hover:shadow-lg transition-all">
            <FileText className="w-4 h-4 inline mr-2" />
            Start Writing
          </button>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center space-x-4">
        <motion.button
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <GitBranch className="w-4 h-4" />
          <span>Start New Project</span>
        </motion.button>
        <motion.button
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Share2 className="w-4 h-4" />
          <span>Share Research</span>
        </motion.button>
      </div>
    </div>
  )
}

export default ResearchTools
