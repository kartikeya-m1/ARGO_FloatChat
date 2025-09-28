import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { 
  Search,
  Filter,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Activity,
  Settings,
  Download,
  RefreshCw,
  X,
  Plus,
  Star,
  Clock,
  Target,
  Layers,
  Globe,
  Zap
} from 'lucide-react'
import { SearchFilter } from '../../types'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const SearchFilters: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'saved' | 'builder'>('basic')

  // Add custom scrollbar styles
  React.useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(30, 58, 138, 0.1);
        border-radius: 3px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(251, 191, 36, 0.3);
        border-radius: 3px;
        transition: background 0.2s ease;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(251, 191, 36, 0.5);
      }
      .leaflet-popup-content-wrapper {
        background: transparent !important;
        box-shadow: none !important;
      }
      .leaflet-popup-content {
        margin: 0 !important;
      }
      .leaflet-popup-tip {
        background: rgba(30, 58, 138, 0.9) !important;
      }
    `
    document.head.appendChild(style)
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [])
  
  // Sample float data for the map
  const sampleFloats = [
    { id: '4902916', lat: 15.0, lng: 75.0, type: 'core', status: 'active', temperature: 26.5, salinity: 35.2 },
    { id: '5906467', lat: 12.0, lng: 80.0, type: 'bgc', status: 'active', temperature: 28.1, salinity: 34.8 },
    { id: '4901234', lat: 18.0, lng: 70.0, type: 'core', status: 'active', temperature: 24.3, salinity: 35.5 },
    { id: '5907890', lat: 10.0, lng: 85.0, type: 'bgc', status: 'active', temperature: 29.2, salinity: 34.2 },
    { id: '4905678', lat: 20.0, lng: 65.0, type: 'core', status: 'active', temperature: 22.8, salinity: 36.1 }
  ]
  
  const parameterFilters: SearchFilter[] = [
    { param: "Temperature", range: "2°C - 28°C", icon: <Thermometer className="w-4 h-4" /> },
    { param: "Salinity", range: "33.5 - 37.2 PSU", icon: <Droplets className="w-4 h-4" /> },
    { param: "Dissolved Oxygen", range: "0 - 300 μmol/kg", icon: <Wind className="w-4 h-4" /> },
    { param: "Chlorophyll", range: "0.1 - 10 mg/m³", icon: <Activity className="w-4 h-4" /> },
    { param: "pH", range: "7.8 - 8.3", icon: <Settings className="w-4 h-4" /> },
    { param: "Pressure", range: "0 - 2000 dbar", icon: <Target className="w-4 h-4" /> }
  ]

  const quickFilters = [
    { name: "Latest Profiles", query: "last 7 days", icon: <Clock />, count: "2,847" },
    { name: "Indian Ocean", query: "region: Indian Ocean", icon: <Globe />, count: "1,234" },
    { name: "Equatorial Zone", query: "lat: -5° to 5°", icon: <MapPin />, count: "567" },
    { name: "Arctic Region", query: "lat: > 66°N", icon: <Thermometer />, count: "89" },
    { name: "BGC Floats", query: "type: biogeochemical", icon: <Activity />, count: "456" },
    { name: "Deep Profiles", query: "depth: > 1500m", icon: <Layers />, count: "789" }
  ]

  const savedSearches = [
    {
      name: "Arabian Sea Temperature Study",
      description: "Temperature profiles in Arabian Sea during monsoon season",
      parameters: ["Temperature", "Depth", "Time"],
      region: "Arabian Sea",
      dateRange: "Jun-Sep 2023",
      results: "1,245 profiles",
      lastUsed: "2 days ago"
    },
    {
      name: "Bay of Bengal Salinity Analysis", 
      description: "Salinity variations near river discharge zones",
      parameters: ["Salinity", "Location", "Depth"],
      region: "Bay of Bengal",
      dateRange: "2020-2023",
      results: "3,567 profiles", 
      lastUsed: "1 week ago"
    },
    {
      name: "Southern Ocean BGC Survey",
      description: "Complete biogeochemical parameter analysis",
      parameters: ["O2", "pH", "Chlorophyll", "Nitrate"],
      region: "Southern Ocean",
      dateRange: "2021-2023",
      results: "892 profiles",
      lastUsed: "3 days ago"
    }
  ]


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
      className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
        isActive 
          ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-lg' 
          : 'bg-deep-700/50 text-ocean-300 hover:text-white hover:bg-deep-600/50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={isActive ? 'text-white' : 'text-yellow-400'}>{icon}</div>
      <span>{label}</span>
    </motion.button>
  )

  const QuickFilterCard = ({ filter, index }: { filter: any; index: number }) => (
    <motion.button
      className="glass-morphism p-1.5 rounded border border-ocean-700/30 hover:border-yellow-500/50 transition-all group text-left w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="text-yellow-400 group-hover:scale-110 transition-transform">
          {filter.icon}
        </div>
        <span className="text-xs px-1 py-0.5 bg-yellow-900/20 text-yellow-300 rounded text-xs">
          {filter.count}
        </span>
      </div>
      <h4 className="text-white font-medium text-xs mb-0.5 group-hover:text-yellow-100 transition-colors">
        {filter.name}
      </h4>
      <p className="text-ocean-300 text-xs group-hover:text-ocean-200 transition-colors truncate">
        {filter.query}
      </p>
    </motion.button>
  )

  const ParameterCard = ({ param, index }: { param: SearchFilter; index: number }) => (
    <motion.div
      className="glass-morphism p-2 rounded border border-ocean-700/30 hover:border-yellow-500/30 transition-all"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex items-center space-x-1.5 mb-1">
        <div className="text-yellow-400">{param.icon}</div>
        <div className="flex-1">
          <div className="text-white text-xs font-medium">{param.param}</div>
          <div className="text-ocean-300 text-xs">{param.range}</div>
        </div>
        <button className="text-ocean-400 hover:text-yellow-400 transition-colors">
          <Settings className="w-3 h-3" />
        </button>
      </div>
      <div className="flex space-x-1">
        <input
          type="range"
          className="flex-1 accent-yellow-500"
          min="0"
          max="100"
          defaultValue="50"
        />
      </div>
    </motion.div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="space-y-3">
            {/* Basic Search */}
            <div className="glass-morphism p-3 rounded-lg border border-ocean-700/30">
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
                <Search className="w-3 h-3 mr-1 text-yellow-400" />
                Basic Search
              </h3>
              <div className="space-y-2">
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <label className="text-ocean-300 text-xs mb-1 block">Float ID / Platform Number</label>
                    <input 
                      className="w-full bg-deep-700 text-white px-2 py-1.5 rounded border border-ocean-700/30 focus:border-yellow-500 focus:outline-none placeholder-ocean-500 text-sm" 
                      placeholder="e.g., 4902916, 5906467" 
                    />
                  </div>
                  <div>
                    <label className="text-ocean-300 text-xs mb-1 block">Date Range</label>
                    <div className="flex space-x-1">
                      <input 
                        type="date" 
                        className="flex-1 bg-deep-700 text-white px-1.5 py-1.5 rounded border border-ocean-700/30 focus:border-yellow-500 focus:outline-none text-sm" 
                      />
                      <input 
                        type="date" 
                        className="flex-1 bg-deep-700 text-white px-1.5 py-1.5 rounded border border-ocean-700/30 focus:border-yellow-500 focus:outline-none text-sm" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-ocean-300 text-xs mb-1 block">Geographic Region</label>
                    <div className="grid grid-cols-4 gap-1">
                      <input 
                        className="bg-deep-700 text-white px-1.5 py-1.5 rounded border border-ocean-700/30 focus:border-yellow-500 focus:outline-none text-sm" 
                        placeholder="Lat Min" 
                      />
                      <input 
                        className="bg-deep-700 text-white px-1.5 py-1.5 rounded border border-ocean-700/30 focus:border-yellow-500 focus:outline-none text-sm" 
                        placeholder="Lat Max" 
                      />
                      <input 
                        className="bg-deep-700 text-white px-1.5 py-1.5 rounded border border-ocean-700/30 focus:border-yellow-500 focus:outline-none text-sm" 
                        placeholder="Lon Min" 
                      />
                      <input 
                        className="bg-deep-700 text-white px-1.5 py-1.5 rounded border border-ocean-700/30 focus:border-yellow-500 focus:outline-none text-sm" 
                        placeholder="Lon Max" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Filters */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
                <Zap className="w-3 h-3 mr-1 text-yellow-400" />
                Quick Filters
              </h3>
              <div className="grid grid-cols-3 gap-1">
                {quickFilters.slice(0, 6).map((filter, index) => (
                  <QuickFilterCard key={index} filter={filter} index={index} />
                ))}
              </div>
            </div>
          </div>
        )
      
      case 'advanced':
        return (
          <div className="space-y-3">
            {/* Parameter Filters */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
                <Settings className="w-3 h-3 mr-1 text-yellow-400" />
                Parameter Filters
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {parameterFilters.slice(0, 4).map((param, index) => (
                  <ParameterCard key={index} param={param} index={index} />
                ))}
              </div>
            </div>

            {/* Advanced Options */}
            <div className="glass-morphism p-3 rounded-lg border border-ocean-700/30">
              <h4 className="text-sm font-semibold text-white mb-2">Advanced Options</h4>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <label className="text-ocean-300 text-xs mb-1 block">Float Type</label>
                  <select className="w-full bg-deep-700 text-white px-2 py-1.5 rounded border border-ocean-700/30 focus:border-yellow-500 focus:outline-none text-sm">
                    <option>All Types</option>
                    <option>Core ARGO</option>
                    <option>Biogeochemical</option>
                    <option>Deep ARGO</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-ocean-300 text-xs mb-1 block">Data Quality</label>
                    <select className="w-full bg-deep-700 text-white px-2 py-1.5 rounded border border-ocean-700/30 focus:border-yellow-500 focus:outline-none text-sm">
                      <option>All Quality</option>
                      <option>Real-time (0)</option>
                      <option>Delayed Mode (1)</option>
                      <option>Adjusted (2)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-ocean-300 text-xs mb-1 block">Depth Range (m)</label>
                    <div className="flex space-x-1">
                      <input 
                        className="flex-1 bg-deep-700 text-white px-1.5 py-1.5 rounded border border-ocean-700/30 focus:border-yellow-500 focus:outline-none text-sm" 
                        placeholder="Min" 
                      />
                      <input 
                        className="flex-1 bg-deep-700 text-white px-1.5 py-1.5 rounded border border-ocean-700/30 focus:border-yellow-500 focus:outline-none text-sm" 
                        placeholder="Max" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'saved':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center">
                <Star className="w-3 h-3 mr-1 text-yellow-400" />
                Saved Searches
              </h3>
              <button className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded hover:shadow-lg transition-all text-xs">
                <Plus className="w-3 h-3" />
                <span>Save</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {savedSearches.slice(0, 2).map((search, index) => (
                <motion.div
                  key={index}
                  className="glass-morphism p-3 rounded border border-ocean-700/30 hover:border-yellow-500/50 transition-all cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-sm font-semibold text-white">{search.name}</h4>
                    <div className="flex space-x-1">
                      <button className="text-ocean-400 hover:text-yellow-400 transition-colors">
                        <Star className="w-3 h-3" />
                      </button>
                      <button className="text-ocean-400 hover:text-red-400 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-ocean-300 text-xs mb-1">{search.description}</p>
                  
                  <div className="space-y-0.5 text-xs mb-1">
                    <div className="flex justify-between">
                      <span className="text-ocean-400">Region:</span>
                      <span className="text-white">{search.region}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ocean-400">Results:</span>
                      <span className="text-white">{search.results}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-1">
                    {search.parameters.slice(0, 3).map((param, i) => (
                      <span key={i} className="text-xs px-1 py-0.5 bg-yellow-900/20 text-yellow-300 rounded">
                        {param}
                      </span>
                    ))}
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-1 rounded hover:shadow-lg transition-all text-xs">
                    Run Search
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )
      
      case 'builder':
        return (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center">
              <Settings className="w-3 h-3 mr-1 text-yellow-400" />
              Query Builder
            </h3>
            
            <div className="glass-morphism p-3 rounded border border-ocean-700/30">
              <h4 className="text-sm font-semibold text-white mb-2">Build Custom Query</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-2 bg-deep-700/50 rounded text-xs">
                  <span className="text-ocean-300">SELECT</span>
                  <select className="bg-deep-600 text-white px-1.5 py-1 rounded border border-ocean-600/30 text-xs">
                    <option>Temperature</option>
                    <option>Salinity</option>
                    <option>Pressure</option>
                    <option>All Parameters</option>
                  </select>
                  <span className="text-ocean-300">FROM</span>
                  <select className="bg-deep-600 text-white px-1.5 py-1 rounded border border-ocean-600/30 text-xs">
                    <option>ARGO Floats</option>
                    <option>BGC Floats</option>
                    <option>Deep Floats</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2 p-2 bg-deep-700/50 rounded text-xs">
                  <span className="text-ocean-300">WHERE</span>
                  <select className="bg-deep-600 text-white px-1.5 py-1 rounded border border-ocean-600/30 text-xs">
                    <option>Temperature</option>
                    <option>Latitude</option>
                    <option>Longitude</option>
                    <option>Date</option>
                  </select>
                  <select className="bg-deep-600 text-white px-1.5 py-1 rounded border border-ocean-600/30 text-xs">
                    <option>&gt;</option>
                    <option>&lt;</option>
                    <option>=</option>
                    <option>BETWEEN</option>
                  </select>
                  <input className="bg-deep-600 text-white px-1.5 py-1 rounded border border-ocean-600/30 text-xs" placeholder="Value" />
                  <button className="px-1.5 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              <div className="mt-3 p-2 bg-deep-800/50 rounded font-mono text-xs">
                <div className="text-ocean-400 mb-1">Generated Query:</div>
                <div className="text-green-400">
                  SELECT temperature, salinity FROM argo_floats 
                  WHERE temperature &gt; 25
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  // Compact Map Component
  const CompactMap = () => (
    <div className="w-full" style={{ height: 'calc(100% - 48px)' }}>
      <MapContainer
        center={[15.0, 75.0]}
        zoom={4}
        className="w-full h-full rounded-b-xl"
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Ocean View">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        
        {sampleFloats.map((float) => (
          <Marker
            key={float.id}
            position={[float.lat, float.lng]}
            icon={L.divIcon({
              className: `float-marker ${float.type}`,
              html: `<div class="w-4 h-4 rounded-full ${
                float.type === 'bgc' ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500 animate-pulse'
              } border-2 border-white shadow-xl ring-2 ring-white/20"></div>`,
              iconSize: [16, 16],
              iconAnchor: [8, 8]
            })}
          >
            <Popup className="custom-popup">
              <div className="text-sm bg-deep-800 text-white p-3 rounded-lg">
                <div className="font-bold text-yellow-400 mb-2">Float {float.id}</div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-ocean-300">Type:</span>
                    <span className={`font-medium ${float.type === 'bgc' ? 'text-emerald-400' : 'text-blue-400'}`}>
                      {float.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ocean-300">Status:</span>
                    <span className="text-green-400 font-medium capitalize">{float.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ocean-300">Temp:</span>
                    <span className="text-white font-medium">{float.temperature}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ocean-300">Salinity:</span>
                    <span className="text-white font-medium">{float.salinity} PSU</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )

  return (
    <div className="h-screen flex flex-col p-4 bg-gradient-to-br from-deep-900 via-deep-800 to-ocean-900">
      

      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6 min-h-0">
        {/* Left Side - Search Filters (3/5 of the width) */}
        <div className="lg:col-span-3 flex flex-col min-h-0 order-2 lg:order-1">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-4">
            <TabButton 
              id="basic" 
              label="Basic Search" 
              icon={<Search className="w-4 h-4" />}
              isActive={activeTab === 'basic'} 
              onClick={(id) => setActiveTab(id as any)} 
            />
            <TabButton 
              id="advanced" 
              label="Advanced Filters" 
              icon={<Filter className="w-4 h-4" />}
              isActive={activeTab === 'advanced'} 
              onClick={(id) => setActiveTab(id as any)} 
            />
            <TabButton 
              id="saved" 
              label="Saved Searches" 
              icon={<Star className="w-4 h-4" />}
              isActive={activeTab === 'saved'} 
              onClick={(id) => setActiveTab(id as any)} 
            />
            <TabButton 
              id="builder" 
              label="Query Builder" 
              icon={<Settings className="w-4 h-4" />}
              isActive={activeTab === 'builder'} 
              onClick={(id) => setActiveTab(id as any)} 
            />
          </div>

          {/* Tab Content - Scrollable */}
          <div className="flex-1 min-h-0">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full overflow-y-auto pr-2 custom-scrollbar"
            >
              {renderTabContent()}
            </motion.div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex justify-center space-x-3 mt-4 pt-4 border-t border-ocean-700/30">
            <motion.button
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Clear All</span>
            </motion.button>
            <motion.button
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </motion.button>
          </div>
        </div>

        {/* Right Side - Map (2/5 of the width) */}
        <div className="lg:col-span-2 min-h-0 h-80 lg:h-auto order-1 lg:order-2">
          <div className="h-full rounded-xl overflow-hidden shadow-2xl border border-ocean-700/30 bg-gradient-to-br from-deep-800 to-ocean-800">
            <div className="bg-gradient-to-r from-deep-700 to-ocean-700 px-4 py-3 border-b border-ocean-600/30">
              <h3 className="text-white font-semibold text-sm flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-yellow-400" />
                Float Locations
                <span className="ml-auto text-xs text-ocean-300 bg-deep-600/50 px-2 py-1 rounded">
                  {sampleFloats.length} Active
                </span>
              </h3>
            </div>
            <div className="h-full">
              <CompactMap />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchFilters
