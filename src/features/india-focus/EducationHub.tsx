import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen,
  FileText,
  Target,
  PlayCircle,
  Users,
  Star,
  Award,
  Clock,
  Filter,
  Gamepad2,
  Video,
  MessageSquare,
  Globe,
  Zap,
  TrendingUp
} from 'lucide-react'

const EducationHub: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'tutorials' | 'interactive' | 'research' | 'community'>('tutorials')
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')


  const tutorials = [
    {
      id: 'argo-basics',
      title: 'Understanding ARGO Floats',
      description: 'Introduction to ARGO float technology and data collection methods',
      duration: '15 min',
      difficulty: 'beginner',
      category: 'basics',
      progress: 0,
      rating: 4.8,
      enrolled: 1247
    },
    {
      id: 'temperature-analysis',
      title: 'Temperature Profile Analysis',
      description: 'Learn to analyze and interpret ocean temperature depth profiles',
      duration: '25 min',
      difficulty: 'intermediate',
      category: 'analysis',
      progress: 0,
      rating: 4.6,
      enrolled: 892
    },
    {
      id: 'bgc-parameters',
      title: 'Biogeochemical Parameters',
      description: 'Deep dive into BGC sensor data: oxygen, pH, chlorophyll, and nutrients',
      duration: '35 min',
      difficulty: 'advanced',
      category: 'bgc',
      progress: 0,
      rating: 4.9,
      enrolled: 456
    },
    {
      id: 'monsoon-ocean',
      title: 'Monsoon-Ocean Interactions',
      description: 'Understanding how monsoons affect ocean conditions in the Indian Ocean',
      duration: '20 min',
      difficulty: 'intermediate',
      category: 'climate',
      progress: 0,
      rating: 4.7,
      enrolled: 678
    },
    {
      id: 'data-visualization',
      title: 'Creating Ocean Data Visualizations',
      description: 'Master the art of creating compelling visualizations from ocean data',
      duration: '30 min',
      difficulty: 'intermediate',
      category: 'visualization',
      progress: 0,
      rating: 4.5,
      enrolled: 534
    },
    {
      id: 'climate-research',
      title: 'Climate Change Research Methods',
      description: 'Advanced techniques for climate change research using ocean data',
      duration: '45 min',
      difficulty: 'advanced',
      category: 'research',
      progress: 0,
      rating: 4.8,
      enrolled: 234
    }
  ]

  const interactiveTools = [
    {
      title: 'Ocean Data Explorer',
      description: 'Interactive tool to explore ARGO float data with guided exercises',
      type: 'hands-on',
      users: '2.4K active',
      icon: <Target className="w-6 h-6" />
    },
    {
      title: 'Climate Simulator',
      description: 'Simulate ocean-climate interactions and see real-time impacts',
      type: 'simulation',
      users: '1.8K active', 
      icon: <Globe className="w-6 h-6" />
    },
    {
      title: 'Ocean Quiz Challenge',
      description: 'Test your ocean knowledge with adaptive quizzes and leaderboards',
      type: 'gamified',
      users: '3.2K participants',
      icon: <Gamepad2 className="w-6 h-6" />
    },
    {
      title: 'Virtual Field Trip',
      description: 'Take virtual expeditions to different ocean regions and depths',
      type: 'immersive',
      users: '950 explorers',
      icon: <Video className="w-6 h-6" />
    }
  ]

  const communityStats = [
    { label: 'Active Learners', value: '12.4K', icon: <Users />, color: 'blue' },
    { label: 'Courses Completed', value: '28.7K', icon: <Award />, color: 'green' },
    { label: 'Study Groups', value: '156', icon: <MessageSquare />, color: 'purple' },
    { label: 'Success Rate', value: '87.3%', icon: <TrendingUp />, color: 'orange' }
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
          ? 'bg-gradient-to-r from-teal-600 to-cyan-700 text-white shadow-lg' 
          : 'bg-deep-700/50 text-ocean-300 hover:text-white hover:bg-deep-600/50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={isActive ? 'text-white' : 'text-teal-400'}>{icon}</div>
      <span>{label}</span>
    </motion.button>
  )

  const TutorialCard = ({ tutorial, index }: { tutorial: any; index: number }) => (
    <motion.div
      className="glass-morphism p-6 rounded-xl border border-ocean-700/30 hover:border-teal-500/50 transition-all cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-teal-100 transition-colors">
            {tutorial.title}
          </h4>
          <p className="text-ocean-300 text-sm mb-3 group-hover:text-ocean-200 transition-colors">
            {tutorial.description}
          </p>
        </div>
        <div className="flex items-center space-x-1 ml-4">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-yellow-400 text-sm font-medium">{tutorial.rating}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-ocean-400" />
            <span className="text-ocean-300">{tutorial.duration}</span>
          </div>
          <span className={`px-2 py-1 rounded text-xs ${
            tutorial.difficulty === 'beginner' ? 'bg-green-900/20 text-green-400' :
            tutorial.difficulty === 'intermediate' ? 'bg-yellow-900/20 text-yellow-400' :
            'bg-red-900/20 text-red-400'
          }`}>
            {tutorial.difficulty}
          </span>
        </div>
        <div className="flex items-center space-x-1 text-ocean-400">
          <Users className="w-4 h-4" />
          <span>{tutorial.enrolled}</span>
        </div>
      </div>
      
      {tutorial.progress > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-ocean-400">Progress</span>
            <span className="text-white">{tutorial.progress}%</span>
          </div>
          <div className="w-full bg-deep-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full"
              style={{ width: `${tutorial.progress}%` }}
            />
          </div>
        </div>
      )}
      
      <motion.button
        className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-2 rounded-lg hover:shadow-lg transition-all flex items-center justify-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <PlayCircle className="w-4 h-4 mr-2" />
        {tutorial.progress > 0 ? 'Continue Learning' : 'Start Learning'}
      </motion.button>
    </motion.div>
  )

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'tutorials':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Learning Tutorials</h3>
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedDifficulty(level)}
                      className={`px-3 py-1 rounded text-sm transition-all ${
                        selectedDifficulty === level
                          ? 'bg-teal-600 text-white'
                          : 'bg-deep-700/50 text-ocean-300 hover:bg-deep-600/50'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors">
                  <Filter className="w-4 h-4 text-ocean-300" />
                  <span className="text-ocean-300 text-sm">Filter</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials
                .filter(tutorial => selectedDifficulty === 'beginner' || tutorial.difficulty === selectedDifficulty)
                .map((tutorial, index) => (
                  <TutorialCard key={tutorial.id} tutorial={tutorial} index={index} />
                ))}
            </div>
          </div>
        )
        
      case 'interactive':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Interactive Learning Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {interactiveTools.map((tool, index) => (
                <motion.div
                  key={index}
                  className="glass-morphism p-6 rounded-xl border border-ocean-700/30 hover:border-teal-500/50 transition-all"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-teal-400">{tool.icon}</div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{tool.title}</h4>
                      <span className="text-xs px-2 py-1 bg-teal-900/20 text-teal-400 rounded">
                        {tool.type}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-ocean-300 text-sm mb-4">{tool.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-ocean-400 text-sm">{tool.users}</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs">Live</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-2 rounded-lg hover:shadow-lg transition-all">
                    <Zap className="w-4 h-4 inline mr-2" />
                    Launch Tool
                  </button>
                </motion.div>
              ))}
            </div>
            
            {/* Climate Simulator Section */}
            <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Globe className="w-6 h-6 mr-2 text-cyan-400" />
                Climate Impact Simulator
              </h4>
              <p className="text-ocean-300 mb-6">Interactive learning tool for understanding ocean-climate connections with real-time feedback and scenario modeling.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-deep-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-cyan-400">12</div>
                  <div className="text-xs text-ocean-400">Climate Scenarios</div>
                </div>
                <div className="text-center p-4 bg-deep-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-cyan-400">47</div>
                  <div className="text-xs text-ocean-400">Interactive Models</div>
                </div>
                <div className="text-center p-4 bg-deep-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-cyan-400">2.1K</div>
                  <div className="text-xs text-ocean-400">Students Engaged</div>
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 rounded-lg hover:shadow-lg transition-all">
                <PlayCircle className="w-4 h-4 inline mr-2" />
                Launch Climate Simulator
              </button>
            </div>
          </div>
        )
        
      case 'research':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Research & Publications</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
                <h4 className="text-lg font-semibold text-white mb-4">Monthly Research Spotlight</h4>
                <div className="space-y-4">
                  {[
                    {
                      title: "Indian Ocean Warming Trends",
                      authors: "Dr. Sharma et al.",
                      journal: "Nature Climate Change",
                      impact: "High Impact",
                      date: "March 2024"
                    },
                    {
                      title: "Monsoon-Ocean Feedback Mechanisms", 
                      authors: "Dr. Patel, Dr. Kumar",
                      journal: "Journal of Climate",
                      impact: "Medium Impact",
                      date: "February 2024"
                    },
                    {
                      title: "BGC Float Data Analysis",
                      authors: "Dr. Rao et al.",
                      journal: "Ocean Science",
                      impact: "High Impact", 
                      date: "January 2024"
                    }
                  ].map((paper, i) => (
                    <div key={i} className="p-4 bg-deep-700/50 rounded-lg border border-ocean-700/30">
                      <h5 className="text-white font-medium mb-2">{paper.title}</h5>
                      <div className="text-sm text-ocean-300 mb-2">{paper.authors}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-ocean-400">{paper.journal} • {paper.date}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          paper.impact === 'High Impact' ? 'bg-green-900/20 text-green-400' : 'bg-yellow-900/20 text-yellow-400'
                        }`}>
                          {paper.impact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
                <h4 className="text-lg font-semibold text-white mb-4">Student Research Projects</h4>
                <p className="text-ocean-300 text-sm mb-4">Support and showcase student research using ARGO data</p>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-ocean-400">Active Projects:</span>
                    <span className="text-white">23</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ocean-400">Published Papers:</span>
                    <span className="text-white">8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ocean-400">Conference Presentations:</span>
                    <span className="text-white">15</span>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg hover:shadow-lg transition-all">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Submit Research Proposal
                </button>
              </div>
            </div>
          </div>
        )
        
      case 'community':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Learning Community</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
                  Discussion Forums
                </h4>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-ocean-400">Active Discussions:</span>
                    <span className="text-white">147</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ocean-400">Expert Mentors:</span>
                    <span className="text-white">23</span>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg hover:shadow-lg transition-all">
                  Join Discussions
                </button>
              </div>
              
              <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-400" />
                  Study Groups
                </h4>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-ocean-400">Active Groups:</span>
                    <span className="text-white">156</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ocean-400">Avg Group Size:</span>
                    <span className="text-white">8 members</span>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-2 rounded-lg hover:shadow-lg transition-all">
                  Find Study Group
                </button>
              </div>
              
              <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-400" />
                  Achievements
                </h4>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-ocean-400">Certificates Earned:</span>
                    <span className="text-white">3.2K</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ocean-400">Badges Unlocked:</span>
                    <span className="text-white">8.7K</span>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-2 rounded-lg hover:shadow-lg transition-all">
                  View Leaderboard
                </button>
              </div>
            </div>
          </div>
        )
        
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
     

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {communityStats.map((stat, index) => (
          <motion.div
            key={index}
            className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`text-${stat.color}-400`}>{stat.icon}</div>
              <div className={`w-2 h-2 bg-${stat.color}-400 rounded-full animate-pulse`}></div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-ocean-300 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>


      {/* Category Navigation */}
      <div className="flex flex-wrap gap-4">
        <CategoryButton 
          id="tutorials" 
          label="Tutorials & Courses" 
          icon={<BookOpen className="w-5 h-5" />}
          isActive={activeCategory === 'tutorials'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
        <CategoryButton 
          id="interactive" 
          label="Interactive Tools" 
          icon={<Gamepad2 className="w-5 h-5" />}
          isActive={activeCategory === 'interactive'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
        <CategoryButton 
          id="research" 
          label="Research Hub" 
          icon={<FileText className="w-5 h-5" />}
          isActive={activeCategory === 'research'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
        <CategoryButton 
          id="community" 
          label="Community" 
          icon={<Users className="w-5 h-5" />}
          isActive={activeCategory === 'community'} 
          onClick={(id) => setActiveCategory(id as any)} 
        />
      </div>

      {/* Category Content */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderCategoryContent()}
      </motion.div>

      {/* Gamified Challenges */}
      <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Gamepad2 className="w-6 h-6 mr-2 text-purple-400" />
          Ocean Data Challenges & Competitions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-white mb-3">Weekly Challenge: "Find the Warmest Waters"</h4>
            <p className="text-ocean-300 text-sm mb-4">Use ARGO temperature data to identify the warmest ocean regions this week</p>
            <div className="flex items-center justify-between text-sm mb-4">
              <span className="text-ocean-400">Participants: 1,234</span>
              <span className="text-green-400">Prize: Ocean Explorer Badge</span>
            </div>
            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:shadow-lg transition-all">
              Join Challenge
            </button>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-white mb-3">Monthly Quiz: "ARGO Float Knowledge"</h4>
            <p className="text-ocean-300 text-sm mb-4">Test your understanding of ARGO float technology and data interpretation</p>
            <div className="flex items-center justify-between text-sm mb-4">
              <span className="text-ocean-400">Average Score: 89%</span>
              <span className="text-yellow-400">High Score: 98%</span>
            </div>
            <button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-2 rounded-lg hover:shadow-lg transition-all">
              Take Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EducationHub
