import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, LayersControl, FeatureGroup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import { 
  Map,
  Globe,
  Layers,
  MapPin,
  Navigation,
  Thermometer,
  Droplets,
  Activity,
  Settings,
  Maximize2,
  Download,
  RefreshCw,
  Filter,
  Target,
  Eye,
  BarChart3,
  Anchor,
  Home,
  AlertCircle,
  TrendingUp,
  Database
} from 'lucide-react'
import { useOceanMap, useFloatDetails } from '../../hooks/useArgoData'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom icons for different float types and statuses
const createFloatIcon = (floatData: any) => {
  const { status, type, statistics } = floatData
  
  // Determine color based on status and data availability
  let color = '#3498db' // default blue
  if (status === 'active') {
    color = statistics?.hasData ? '#10B981' : '#3B82F6' // Green if has data, blue if active only
  } else if (status === 'inactive') {
    color = '#F59E0B' // Orange
  } else if (status === 'dead') {
    color = '#EF4444' // Red
  }
  
  // Add special border for BGC floats
  const borderWidth = type === 'BGC' ? 3 : 2
  const size = statistics?.hasData ? 14 : 12
  
  return L.divIcon({
    html: `<div style="
      width: ${size}px; 
      height: ${size}px; 
      background: ${color}; 
      border: ${borderWidth}px solid white; 
      border-radius: 50%; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      animation: pulse 2s infinite;
    "></div>`,
    className: 'custom-div-icon',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  })
}

const EnhancedOceanMap: React.FC = () => {
  const [mapView, setMapView] = useState<'global' | 'regional' | 'local'>('global')
  const [, setSelectedLayer] = useState<string>('floats')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [selectedFloat, setSelectedFloat] = useState<string | null>(null)
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [mapFilters, setMapFilters] = useState({
    region: undefined,
    status: undefined, 
    float_type: undefined,
    has_measurements: undefined as boolean | undefined
  })

  // Use real data hooks - pass empty object to get ALL floats
  const { 
    mapData, 
    loading, 
    error, 
    refetch: refetchMapData,
    selectFloat,
    selectedFloatData 
  } = useOceanMap({})

  // Call useFloatDetails but don't destructure since we don't use the values
  useFloatDetails(selectedFloat)

  // Map layer configurations
  const mapLayers = [
    { id: 'floats', name: 'ARGO Floats', icon: <MapPin />, color: 'blue', active: true },
    { id: 'temperature', name: 'Sea Surface Temperature', icon: <Thermometer />, color: 'red', active: false },
    { id: 'salinity', name: 'Salinity Distribution', icon: <Droplets />, color: 'blue', active: false },
    { id: 'trajectories', name: 'Float Trajectories', icon: <Navigation />, color: 'purple', active: false },
    { id: 'regions', name: 'Indian Ocean Regions', icon: <Target />, color: 'green', active: false }
  ]

  // India-focused regions with real float counts
  const indiaRegions = [
    { 
      name: 'Arabian Sea - West Coast', 
      center: [20.0, 70.0] as [number, number], 
      bounds: [[8.0, 68.0], [24.0, 76.0]] as [[number, number], [number, number]],
      floats: mapData?.summary.regions?.arabian_sea || 0,
      description: 'Western Indian Ocean with monsoon upwelling'
    },
    { 
      name: 'Bay of Bengal - East Coast', 
      center: [15.0, 88.0] as [number, number], 
      bounds: [[8.0, 80.0], [22.0, 95.0]] as [[number, number], [number, number]],
      floats: mapData?.summary.regions?.bay_of_bengal || 0,
      description: 'Eastern Indian Ocean with river discharge influences'
    },
    { 
      name: 'Southern Waters - Andaman Sea', 
      center: [5.0, 85.0] as [number, number], 
      bounds: [[-8.0, 72.0], [12.0, 94.0]] as [[number, number], [number, number]],
      floats: mapData?.summary.regions?.southern_waters || 0,
      description: 'Southern Indian Ocean with deep water formation'
    }
  ]

  const mapStats = [
    { 
      label: 'Total Floats', 
      value: mapData?.summary.total_floats?.toLocaleString() || '0', 
      icon: <MapPin />, 
      color: 'blue' 
    },
    { 
      label: 'Active Floats', 
      value: mapData?.summary.active_floats?.toLocaleString() || '0', 
      icon: <Activity />, 
      color: 'green' 
    },
    { 
      label: 'With Data', 
      value: mapData?.summary.with_measurements?.toLocaleString() || '0', 
      icon: <Database />, 
      color: 'purple' 
    },
    { 
      label: 'Coverage', 
      value: `${mapData?.summary.coverage_percentage || 0}%`, 
      icon: <Globe />, 
      color: 'orange' 
    }
  ]

  const handleFilterChange = (key: string, value: any) => {
    setMapFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleFloatClick = (floatId: string) => {
    setSelectedFloat(floatId)
    selectFloat(floatId)
  }

  const flyToRegion = (region: any) => {
    setSelectedRegion(region.name)
    mapInstance?.flyTo(region.center, 8, { duration: 1.5 })
  }

  // Add CSS for float icon animations
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.8; }
      }
      .custom-div-icon div {
        animation: pulse 2s infinite;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const ViewButton = ({ 
    id, 
    label, 
    isActive, 
    onClick 
  }: { 
    id: string; 
    label: string; 
    isActive: boolean; 
    onClick: (id: string) => void 
  }) => (
    <motion.button
      onClick={() => onClick(id)}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${
        isActive 
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
          : 'bg-deep-700/50 text-ocean-300 hover:text-white hover:bg-deep-600/50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {label}
    </motion.button>
  )

  const LayerToggle = ({ layer }: { layer: any }) => (
    <motion.div
      className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
        layer.active 
          ? `bg-${layer.color}-900/20 border-${layer.color}-500/50` 
          : 'bg-deep-700/30 border-ocean-700/30 hover:border-ocean-600/50'
      }`}
      whileHover={{ scale: 1.02 }}
      onClick={() => setSelectedLayer(layer.id)}
    >
      <div className="flex items-center space-x-3">
        <div className={`text-${layer.color}-400`}>{layer.icon}</div>
        <span className={`text-sm font-medium ${layer.active ? 'text-white' : 'text-ocean-300'}`}>
          {layer.name}
        </span>
      </div>
      <div className={`w-4 h-4 rounded border-2 ${
        layer.active 
          ? `bg-${layer.color}-500 border-${layer.color}-500` 
          : 'border-ocean-600'
      }`}>
        {layer.active && <div className="w-full h-full bg-white rounded-sm scale-50"></div>}
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Map className="w-8 h-8 mr-3 text-blue-400" />
            Enhanced Ocean Map
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => refetchMapData()}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-ocean-300 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-ocean-300 text-sm">Refresh</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors">
            <Download className="w-4 h-4 text-ocean-300" />
            <span className="text-ocean-300 text-sm">Export</span>
          </button>
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors"
          >
            <Settings className="w-5 h-5 text-ocean-300" />
          </button>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mapStats.map((stat, index) => (
          <motion.div
            key={index}
            className="glass-morphism p-4 rounded-xl border border-ocean-700/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`text-${stat.color}-400`}>{stat.icon}</div>
              <div className={`w-2 h-2 bg-${loading ? 'yellow' : 'green'}-400 rounded-full ${loading ? 'animate-pulse' : ''}`}></div>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-ocean-300 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          className="glass-morphism p-4 rounded-xl border border-red-500/30 bg-red-900/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-medium">Error loading map data</span>
          </div>
          <div className="text-red-300 text-sm mt-1">{error}</div>
          <button 
            onClick={() => refetchMapData()}
            className="mt-3 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Controls */}
        <div className="space-y-6">
          {/* Filters */}
          <div className="glass-morphism p-4 rounded-xl border border-ocean-700/30">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-blue-400" />
              Filters
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-ocean-300 text-sm mb-2 block">Region</label>
                <select 
                  value={mapFilters.region}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                  className="w-full bg-deep-700 text-white px-3 py-2 rounded border border-ocean-700/30"
                >
                  <option value="">All Regions</option>
                  <option value="arabian_sea">Arabian Sea</option>
                  <option value="bay_of_bengal">Bay of Bengal</option>
                  <option value="southern_waters">Southern Waters</option>
                </select>
              </div>
              
              <div>
                <label className="text-ocean-300 text-sm mb-2 block">Status</label>
                <select 
                  value={mapFilters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full bg-deep-700 text-white px-3 py-2 rounded border border-ocean-700/30"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="dead">Dead</option>
                </select>
              </div>
              
              <div>
                <label className="text-ocean-300 text-sm mb-2 block">Float Type</label>
                <select 
                  value={mapFilters.float_type}
                  onChange={(e) => handleFilterChange('float_type', e.target.value)}
                  className="w-full bg-deep-700 text-white px-3 py-2 rounded border border-ocean-700/30"
                >
                  <option value="">All Types</option>
                  <option value="core">Core</option>
                  <option value="bgc">BGC</option>
                  <option value="deep">Deep</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={mapFilters.has_measurements === true}
                    onChange={(e) => handleFilterChange('has_measurements', e.target.checked ? true : undefined)}
                    className="accent-blue-500" 
                  />
                  <span className="text-ocean-300 text-sm">Only floats with measurements</span>
                </label>
              </div>
            </div>
          </div>

          {/* View Controls */}
          <div className="glass-morphism p-4 rounded-xl border border-ocean-700/30">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-blue-400" />
              Map View
            </h3>
            <div className="space-y-2">
              <ViewButton 
                id="global" 
                label="Global Ocean" 
                isActive={mapView === 'global'} 
                onClick={(id) => setMapView(id as any)} 
              />
              <ViewButton 
                id="regional" 
                label="Indian Ocean" 
                isActive={mapView === 'regional'} 
                onClick={(id) => setMapView(id as any)} 
              />
              <ViewButton 
                id="local" 
                label="Local Detail" 
                isActive={mapView === 'local'} 
                onClick={(id) => setMapView(id as any)} 
              />
            </div>
          </div>

          {/* Layer Controls */}
          <div className="glass-morphism p-4 rounded-xl border border-ocean-700/30">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Layers className="w-5 h-5 mr-2 text-blue-400" />
              Data Layers
            </h3>
            <div className="space-y-2">
              {mapLayers.map((layer, index) => (
                <LayerToggle key={index} layer={layer} />
              ))}
            </div>
          </div>

          {/* India-Focused Region Quick Access */}
          <div className="glass-morphism p-4 rounded-xl border border-ocean-700/30">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-400" />
              Indian Ocean Regions
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {indiaRegions.map((region, index) => (
                <motion.button
                  key={index}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedRegion === region.name
                      ? 'bg-blue-900/30 border-blue-500/50'
                      : 'bg-deep-700/30 border-ocean-700/30 hover:border-blue-500/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => flyToRegion(region)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-white font-medium text-sm">{region.name}</span>
                    <span className="text-blue-400 text-xs">{region.floats} floats</span>
                  </div>
                  <div className="text-ocean-300 text-xs">{region.description}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Map Area */}
        <div className="lg:col-span-3">
          <div className="glass-morphism rounded-xl border border-ocean-700/30 overflow-hidden">
            {/* Map Header */}
            <div className="p-4 border-b border-ocean-700/30 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold text-white">
                  {mapView === 'global' ? 'Global Ocean View' : 
                   mapView === 'regional' ? 'Indian Ocean Region' : 'Local Area Detail'}
                </h3>
                <span className="text-xs px-2 py-1 bg-green-900/20 text-green-400 rounded">
                  {loading ? 'Loading...' : 'Live Data'}
                </span>
                {mapData && (
                  <span className="text-xs text-ocean-400">
                    Updated: {new Date(mapData.lastUpdated).toLocaleTimeString()}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 bg-deep-700/50 rounded hover:bg-deep-600/50 transition-colors">
                  <Maximize2 className="w-4 h-4 text-ocean-300" />
                </button>
              </div>
            </div>

            {/* Interactive Leaflet Map */}
            <div className="relative h-96 rounded-lg overflow-hidden">
              {loading && (
                <div className="absolute inset-0 bg-deep-800/50 backdrop-blur-sm z-50 flex items-center justify-center">
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
                    <span className="text-ocean-300">Loading float data...</span>
                  </div>
                </div>
              )}

              {mapData && (
                <MapContainer
                  center={
                    mapView === 'global' ? [0.0, 70.0] :
                    mapView === 'regional' ? [15.0, 80.0] :
                    selectedRegion ? 
                      indiaRegions.find(r => r.name === selectedRegion)?.center || [15.0, 75.0] :
                      [0.0, 70.0]
                  }
                  zoom={mapView === 'global' ? 3 : mapView === 'regional' ? 7 : 9}
                  className="h-full w-full z-10"
                  ref={setMapInstance}
                >
                  <LayersControl position="topright">
                    {/* Base Layers */}
                    <LayersControl.BaseLayer checked name="Ocean View">
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                    </LayersControl.BaseLayer>
                    
                    <LayersControl.BaseLayer name="Satellite View">
                      <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution="Tiles &copy; Esri"
                      />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="Dark Ocean">
                      <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                      />
                    </LayersControl.BaseLayer>

                    {/* ARGO Floats Layer */}
                    <LayersControl.Overlay checked name="ARGO Floats">
                      <FeatureGroup>
                        {mapData.floats.map((float) => (
                          <Marker
                            key={float.id}
                            position={[float.lat, float.lon]}
                            icon={createFloatIcon(float)}
                            eventHandlers={{
                              click: () => handleFloatClick(float.id)
                            }}
                          >
                            <Popup>
                              <div className="p-2 min-w-64">
                                <h4 className="font-semibold text-gray-800 mb-2">
                                  Float {float.platform_number}
                                </h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`font-medium ${
                                      float.status === 'active' ? 'text-green-600' : 
                                      float.status === 'inactive' ? 'text-orange-600' : 'text-red-600'
                                    }`}>
                                      {float.status}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Type:</span>
                                    <span className="font-medium">{float.type}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Position:</span>
                                    <span className="font-medium">
                                      {float.lat.toFixed(3)}°, {float.lon.toFixed(3)}°
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Profiles:</span>
                                    <span className="font-medium">{float.statistics.profiles}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Measurements:</span>
                                    <span className="font-medium">{float.statistics.measurements}</span>
                                  </div>
                                  {float.manufacturer && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Manufacturer:</span>
                                      <span className="font-medium">{float.manufacturer}</span>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Data availability badges */}
                                <div className="flex flex-wrap gap-1 mt-3">
                                  {float.data_availability.core && (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                      Core
                                    </span>
                                  )}
                                  {float.data_availability.bgc && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                      BGC
                                    </span>
                                  )}
                                  {float.data_availability.deep && (
                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                                      Deep
                                    </span>
                                  )}
                                </div>

                                <button
                                  onClick={() => handleFloatClick(float.id)}
                                  className="w-full mt-3 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                                >
                                  View Details
                                </button>
                              </div>
                            </Popup>
                          </Marker>
                        ))}
                      </FeatureGroup>
                    </LayersControl.Overlay>

                    {/* Float Trajectories */}
                    <LayersControl.Overlay name="Float Trajectories">
                      <FeatureGroup>
                        {mapData.floats.filter(f => f.trajectory.length > 1).map((float) => (
                          <Polyline
                            key={`${float.id}-trajectory`}
                            positions={float.trajectory}
                            color={float.color}
                            weight={2}
                            opacity={0.7}
                          />
                        ))}
                      </FeatureGroup>
                    </LayersControl.Overlay>

                    {/* Regional Boundaries */}
                    <LayersControl.Overlay name="Indian Ocean Regions">
                      <FeatureGroup>
                        {indiaRegions.map((region) => (
                          <React.Fragment key={region.name}>
                            <Circle
                              center={region.center}
                              radius={200000} // 200km radius
                              fillColor="#3B82F6"
                              fillOpacity={0.1}
                              color="#3B82F6"
                              weight={2}
                              eventHandlers={{
                                click: () => flyToRegion(region)
                              }}
                            >
                              <Popup>
                                <div className="p-3">
                                  <h4 className="font-semibold text-gray-800 mb-2">{region.name}</h4>
                                  <p className="text-sm text-gray-600 mb-3">{region.description}</p>
                                  <div className="grid grid-cols-1 gap-2 text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Active Floats:</span>
                                      <span className="font-medium">{region.floats}</span>
                                    </div>
                                  </div>
                                </div>
                              </Popup>
                            </Circle>
                          </React.Fragment>
                        ))}
                      </FeatureGroup>
                    </LayersControl.Overlay>
                  </LayersControl>
                </MapContainer>
              )}

              {/* Map Controls Overlay */}
              <div className="absolute top-4 left-4 z-20 space-y-2">
                <motion.button
                  onClick={() => mapInstance?.fitBounds([[6, 65], [25, 95]])}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  title="Fit to Indian Ocean"
                >
                  <Home className="w-5 h-5 text-gray-700" />
                </motion.button>
              </div>

              {/* Enhanced Selected Float Info */}
              {selectedFloat && selectedFloatData && (
                <motion.div
                  className="absolute top-4 right-4 z-20 glass-morphism p-4 rounded-lg border border-ocean-700/30 min-w-72 max-w-80"
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 20 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Anchor className="w-5 h-5 text-blue-400" />
                      <h4 className="text-white font-semibold">Float {selectedFloatData.platform_number}</h4>
                    </div>
                    <button 
                      onClick={() => setSelectedFloat(null)}
                      className="text-ocean-400 hover:text-white text-xl leading-none"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-ocean-400 text-xs">Status</span>
                        <div className="text-white font-medium">{selectedFloatData.status}</div>
                      </div>
                      <div>
                        <span className="text-ocean-400 text-xs">Type</span>
                        <div className="text-white font-medium">{selectedFloatData.type}</div>
                      </div>
                    </div>

                    <div>
                      <span className="text-ocean-400 text-xs">Position</span>
                      <div className="text-white font-medium">
                        {selectedFloatData.lat.toFixed(4)}°N, {selectedFloatData.lon.toFixed(4)}°E
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-ocean-400 text-xs">Profiles</span>
                        <div className="text-white font-medium">{selectedFloatData.statistics.profiles}</div>
                      </div>
                      <div>
                        <span className="text-ocean-400 text-xs">Measurements</span>
                        <div className="text-white font-medium">{selectedFloatData.statistics.measurements}</div>
                      </div>
                    </div>

                    {selectedFloatData.manufacturer && (
                      <div>
                        <span className="text-ocean-400 text-xs">Manufacturer</span>
                        <div className="text-white font-medium">{selectedFloatData.manufacturer}</div>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-2">
                      <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg hover:shadow-lg transition-all text-sm">
                        <Eye className="w-4 h-4 inline mr-1" />
                        Details
                      </button>
                      <button className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 rounded-lg hover:shadow-lg transition-all text-sm">
                        <BarChart3 className="w-4 h-4 inline mr-1" />
                        Data
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Map Footer with Stats */}
            <div className="p-4 border-t border-ocean-700/30 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-ocean-300 text-sm">
                  Showing {mapData?.floats.length || 0} floats
                </span>
                <span className="text-ocean-400 text-xs">
                  • {mapData?.summary.with_measurements || 0} with data
                </span>
                <span className="text-ocean-400 text-xs">
                  • Last updated: {mapData ? new Date(mapData.lastUpdated).toLocaleTimeString() : 'Never'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded hover:shadow-lg transition-all">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">Analyze Region</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedOceanMap
