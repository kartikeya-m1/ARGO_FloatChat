import React, { useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Waves, 
  Database, 
  Brain, 
  BarChart3, 
  MessageSquare, 
  Globe, 
  Zap, 
  Users,
  ChevronDown,
  Menu,
  X
} from 'lucide-react'

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { scrollYProgress } = useScroll()
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const features = [
    {
      icon: <Database className="w-8 h-8" />,
      title: "ARGO Data Processing",
      description: "Advanced NetCDF data ingestion and processing with argopy library integration"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Queries",
      description: "Natural language queries powered by state-of-the-art LLMs and RAG pipelines"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Interactive Visualizations",
      description: "Real-time ocean data visualizations with geospatial mapping and analytics"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Conversational Interface",
      description: "Chat with your data using intuitive natural language commands"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Ocean Coverage",
      description: "Access to worldwide ARGO float data with comprehensive spatial coverage"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Analytics",
      description: "Fast query processing with TimescaleDB and optimized data pipelines"
    }
  ]

  const NavBar = () => (
    <motion.nav 
      className="fixed top-0 w-full z-50 glass-morphism border-b border-ocean-500/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-ocean-400 to-ocean-600 rounded-full flex items-center justify-center">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">FloatChat</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-ocean-200 hover:text-white transition-colors">Features</a>
            <a href="#about" className="text-ocean-200 hover:text-white transition-colors">About</a>
            <a href="#contact" className="text-ocean-200 hover:text-white transition-colors">Contact</a>
            <motion.button
              className="bg-gradient-to-r from-ocean-500 to-ocean-600 text-white px-6 py-2 rounded-lg hover:from-ocean-600 hover:to-ocean-700 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            className="md:hidden mt-4 py-4 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <a href="#features" className="block text-ocean-200 hover:text-white transition-colors">Features</a>
            <a href="#about" className="block text-ocean-200 hover:text-white transition-colors">About</a>
            <a href="#contact" className="block text-ocean-200 hover:text-white transition-colors">Contact</a>
            <button
              className="w-full bg-gradient-to-r from-ocean-500 to-ocean-600 text-white px-6 py-2 rounded-lg hover:from-ocean-600 hover:to-ocean-700 transition-all"
              onClick={() => navigate('/dashboard')}
            >
              Get Started
            </button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )

  return (
    <div className="min-h-screen bg-deep-900 text-white overflow-hidden">
      <NavBar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Animated Background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-ocean-600/20 via-ocean-800/30 to-deep-900"
          style={{ y, opacity }}
        />

        {/* Floating Particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-ocean-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-ocean-400 via-ocean-300 to-ocean-500 bg-clip-text text-transparent"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Explore Ocean Data
          </motion.h1>
          
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Like Never Before
          </motion.h2>

          <motion.p 
            className="text-xl md:text-2xl text-ocean-200 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            FloatChat revolutionizes oceanographic research with AI-powered conversational interfaces for ARGO float data discovery and visualization
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row gap-6 justify-center items-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.button
              className="bg-gradient-to-r from-ocean-500 to-ocean-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-ocean-600 hover:to-ocean-700 transition-all shadow-2xl"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
            >
              Dive Into Data
            </motion.button>
            
            <motion.button
              className="glass-morphism text-ocean-200 px-8 py-4 rounded-lg text-lg font-semibold hover:text-white transition-all border border-ocean-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Watch Demo
            </motion.button>
          </motion.div>

          <motion.div
            className="mt-16"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 text-ocean-400 mx-auto" />
          </motion.div>
        </div>

        {/* Wave Animation */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-24" viewBox="0 0 1200 120" fill="none">
            <motion.path
              d="M0 60C150 20 300 100 450 60C600 20 750 100 900 60C1050 20 1200 100 1200 60V120H0V60Z"
              fill="rgba(14, 165, 233, 0.1)"
              animate={{
                d: [
                  "M0 60C150 20 300 100 450 60C600 20 750 100 900 60C1050 20 1200 100 1200 60V120H0V60Z",
                  "M0 80C150 40 300 80 450 80C600 40 750 80 900 80C1050 40 1200 80 1200 80V120H0V80Z",
                  "M0 60C150 20 300 100 450 60C600 20 750 100 900 60C1050 20 1200 100 1200 60V120H0V60Z"
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Powerful Features</h2>
            <p className="text-xl text-ocean-200 max-w-3xl mx-auto">
              Advanced tools and capabilities designed for oceanographic research and data analysis
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="glass-morphism p-8 rounded-xl hover:bg-white/10 transition-all group"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="text-ocean-400 mb-4 group-hover:text-ocean-300 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-ocean-200">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-900/20 to-deep-800/20"></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Explore the Ocean's Secrets?
            </h2>
            <p className="text-xl text-ocean-200 mb-8 max-w-2xl mx-auto">
              Join researchers worldwide in discovering insights from ARGO float data using the power of AI
            </p>
            <motion.button
              className="bg-gradient-to-r from-ocean-500 to-ocean-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:from-ocean-600 hover:to-ocean-700 transition-all shadow-2xl"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
            >
              Start Exploring Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ocean-800/30 py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-ocean-400 to-ocean-600 rounded-full flex items-center justify-center">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">FloatChat</span>
            </div>
            <p className="text-ocean-300">© 2024 FloatChat. Revolutionizing ocean data exploration.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage