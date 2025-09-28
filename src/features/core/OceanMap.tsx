import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, LayersControl, FeatureGroup } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import { 
  Map,
  Globe,
  Layers,
  MapPin,
  Navigation,
  Satellite,
  Thermometer,
  Droplets,
  Wind,
  Activity,
  Settings,
  Maximize2,
  Download,
  Share2,
  RefreshCw,
  Filter,
  Search,
  Target,
  Zap,
  Eye,
  BarChart3,
  Calendar,
  Clock,
  Anchor,
  Compass,
  Home
} from 'lucide-react'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom icons for different float types
const createFloatIcon = (_type: string, color: string) => {
  return L.divIcon({
    html: `<div style="
      width: 12px; 
      height: 12px; 
      background: ${color}; 
      border: 2px solid white; 
      border-radius: 50%; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      animation: pulse 2s infinite;
    "></div>`,
    className: 'custom-div-icon',
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  })
}

const OceanMap: React.FC = () => {
  const [mapView, setMapView] = useState<'global' | 'regional' | 'local'>('global')
  const [selectedLayer, setSelectedLayer] = useState<string>('temperature')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [selectedFloat, setSelectedFloat] = useState<string | null>(null)
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)
  const [showHeatLayer] = useState(false)
  const [is3DView, setIs3DView] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  
  const mapLayers = [
    { id: 'temperature', name: 'Sea Surface Temperature', icon: <Thermometer />, color: 'red', active: true },
    { id: 'salinity', name: 'Salinity Distribution', icon: <Droplets />, color: 'blue', active: false },
    { id: 'oxygen', name: 'Dissolved Oxygen', icon: <Wind />, color: 'green', active: false },
    { id: 'chlorophyll', name: 'Chlorophyll Concentration', icon: <Activity />, color: 'emerald', active: false },
    { id: 'currents', name: 'Ocean Currents', icon: <Navigation />, color: 'cyan', active: false },
    { id: 'bathymetry', name: 'Ocean Depth', icon: <Layers />, color: 'purple', active: false }
  ]

  // Enhanced float data with more detailed information
  const activeFloats = [
    { 
      id: '4902916', 
      lat: 15.5, 
      lon: 68.2, 
      type: 'Core', 
      lastUpdate: '2 hours ago', 
      temp: 26.8, 
      salinity: 35.2,
      depth: 2000,
      status: 'Active',
      trajectory: [[15.3, 68.0], [15.4, 68.1], [15.5, 68.2]],
      data: { oxygen: 4.2, ph: 8.1, chlorophyll: 0.3 }
    },
    { 
      id: '5906467', 
      lat: 12.3, 
      lon: 75.1, 
      type: 'BGC', 
      lastUpdate: '1 hour ago', 
      temp: 28.1, 
      salinity: 34.9,
      depth: 2000,
      status: 'Active',
      trajectory: [[12.1, 74.9], [12.2, 75.0], [12.3, 75.1]],
      data: { oxygen: 3.8, ph: 8.0, chlorophyll: 0.5 }
    },
    { 
      id: '2903521', 
      lat: 8.7, 
      lon: 77.5, 
      type: 'Deep', 
      lastUpdate: '3 hours ago', 
      temp: 29.2, 
      salinity: 34.5,
      depth: 4000,
      status: 'Active',
      trajectory: [[8.5, 77.3], [8.6, 77.4], [8.7, 77.5]],
      data: { oxygen: 3.5, ph: 7.9, chlorophyll: 0.7 }
    },
    { 
      id: '4903024', 
      lat: 20.1, 
      lon: 65.8, 
      type: 'Core', 
      lastUpdate: '45 min ago', 
      temp: 25.4, 
      salinity: 35.8,
      depth: 2000,
      status: 'Active',
      trajectory: [[19.9, 65.6], [20.0, 65.7], [20.1, 65.8]],
      data: { oxygen: 4.5, ph: 8.2, chlorophyll: 0.2 }
    },
    { 
      id: '6902845', 
      lat: 14.8, 
      lon: 72.3, 
      type: 'BGC', 
      lastUpdate: '1.5 hours ago', 
      temp: 27.3, 
      salinity: 35.1,
      depth: 2000,
      status: 'Active',
      trajectory: [[14.6, 72.1], [14.7, 72.2], [14.8, 72.3]],
      data: { oxygen: 4.0, ph: 8.1, chlorophyll: 0.4 }
    },
    // Additional Indian Ocean specific floats
    { 
      id: '7803456', 
      lat: 10.5, 
      lon: 79.8, 
      type: 'Core', 
      lastUpdate: '30 min ago', 
      temp: 28.5, 
      salinity: 34.7,
      depth: 2000,
      status: 'Active',
      trajectory: [[10.3, 79.6], [10.4, 79.7], [10.5, 79.8]],
      data: { oxygen: 3.9, ph: 8.0, chlorophyll: 0.6 }
    },
    { 
      id: '8904567', 
      lat: 18.2, 
      lon: 88.1, 
      type: 'BGC', 
      lastUpdate: '2.5 hours ago', 
      temp: 27.8, 
      salinity: 33.2,
      depth: 2000,
      status: 'Active',
      trajectory: [[18.0, 87.9], [18.1, 88.0], [18.2, 88.1]],
      data: { oxygen: 3.2, ph: 7.8, chlorophyll: 0.8 }
    }
  ]

  // Enhanced India-focused regions with detailed boundaries
  const indiaRegions = [
    { 
      name: 'Arabian Sea - Gujarat Coast', 
      center: [22.0, 69.0] as [number, number], 
      bounds: [[20.0, 67.0], [24.0, 71.0]] as [[number, number], [number, number]],
      floats: 247, 
      temp: '25.8°C', 
      description: 'High productivity region with strong seasonal variations',
      economicValue: '₹45,200 Cr',
      majorPorts: ['Kandla', 'Mumbai', 'Mangalore'],
      fishingZones: 8,
      color: '#3B82F6'
    },
    { 
      name: 'Arabian Sea - Kerala Coast', 
      center: [10.0, 75.0] as [number, number], 
      bounds: [[8.0, 74.0], [12.0, 76.0]] as [[number, number], [number, number]],
      floats: 189, 
      temp: '28.2°C', 
      description: 'Upwelling region with rich marine biodiversity',
      economicValue: '₹32,800 Cr',
      majorPorts: ['Kochi', 'Kozhikode', 'Vizhinjam'],
      fishingZones: 12,
      color: '#10B981'
    },
    { 
      name: 'Bay of Bengal - Tamil Nadu Coast', 
      center: [11.0, 81.0] as [number, number], 
      bounds: [[8.0, 79.0], [14.0, 83.0]] as [[number, number], [number, number]],
      floats: 203, 
      temp: '28.7°C', 
      description: 'Cyclone-prone region with monsoon influences',
      economicValue: '₹38,600 Cr',
      majorPorts: ['Chennai', 'Tuticorin', 'Ennore'],
      fishingZones: 10,
      color: '#8B5CF6'
    },
    { 
      name: 'Bay of Bengal - Andhra Pradesh Coast', 
      center: [15.5, 82.0] as [number, number], 
      bounds: [[13.5, 80.0], [17.5, 84.0]] as [[number, number], [number, number]],
      floats: 156, 
      temp: '27.9°C', 
      description: 'River discharge and coastal currents interaction',
      economicValue: '₹25,400 Cr',
      majorPorts: ['Visakhapatnam', 'Kakinada', 'Krishnapatnam'],
      fishingZones: 7,
      color: '#F59E0B'
    },
    { 
      name: 'Bay of Bengal - West Bengal Coast', 
      center: [21.5, 88.0] as [number, number], 
      bounds: [[20.0, 87.0], [23.0, 89.0]] as [[number, number], [number, number]],
      floats: 134, 
      temp: '26.4°C', 
      description: 'Delta region with high sediment load',
      economicValue: '₹28,400 Cr',
      majorPorts: ['Kolkata', 'Paradip', 'Haldia'],
      fishingZones: 6,
      color: '#EF4444'
    },
    { 
      name: 'Lakshadweep Sea', 
      center: [12.0, 72.0] as [number, number], 
      bounds: [[10.0, 71.0], [14.0, 74.0]] as [[number, number], [number, number]],
      floats: 67, 
      temp: '29.1°C', 
      description: 'Coral reef ecosystem with pristine waters',
      economicValue: '₹8,200 Cr',
      majorPorts: ['Kavaratti', 'Agatti'],
      fishingZones: 15,
      color: '#06B6D4'
    },
    { 
      name: 'Andaman Sea', 
      center: [12.0, 93.0] as [number, number], 
      bounds: [[10.0, 92.0], [14.0, 94.0]] as [[number, number], [number, number]],
      floats: 89, 
      temp: '29.5°C', 
      description: 'Isolated island ecosystem with unique marine life',
      economicValue: '₹12,600 Cr',
      majorPorts: ['Port Blair', 'Diglipur'],
      fishingZones: 8,
      color: '#84CC16'
    }
  ]

  const mapStats = [
    { label: 'Active Floats', value: '3,847', icon: <MapPin />, color: 'blue' },
    { label: 'Data Coverage', value: '94.2%', icon: <Globe />, color: 'green' },
    { label: 'Update Frequency', value: '15 min', icon: <RefreshCw />, color: 'purple' },
    { label: 'Zoom Levels', value: '18', icon: <Search />, color: 'orange' }
  ]

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

  // Add CSS for float icon animations in useEffect
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Map className="w-8 h-8 mr-3 text-blue-400" />
            Interactive Ocean Map
          </h2>
          <p className="text-ocean-300">Real-time ARGO float positions and oceanographic data visualization</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors">
            <Download className="w-4 h-4 text-ocean-300" />
            <span className="text-ocean-300 text-sm">Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors">
            <Share2 className="w-4 h-4 text-ocean-300" />
            <span className="text-ocean-300 text-sm">Share</span>
          </button>
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2 bg-deep-700/50 rounded-lg hover:bg-deep-600/50 transition-colors"
          >
            <Settings className="w-5 h-5 text-ocean-300" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
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
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-ocean-300 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Controls */}
        <div className="space-y-6">
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
                label="Regional Focus" 
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
              India Ocean Regions
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
                  onClick={() => {
                    setSelectedRegion(region.name)
                    mapInstance?.flyTo(region.center, 8, { duration: 1.5 })
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-white font-medium text-sm">{region.name}</span>
                    <span className="text-blue-400 text-xs">{region.floats} floats</span>
                  </div>
                  <div className="text-ocean-300 text-xs mb-2">{region.description}</div>
                  <div className="flex justify-between items-center">
                    <div className="text-green-400 text-xs font-medium">{region.temp}</div>
                    <div className="text-yellow-400 text-xs">{region.economicValue}</div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {region.majorPorts.slice(0, 2).map(port => (
                      <span key={port} className="text-xs px-2 py-1 bg-blue-900/20 text-blue-300 rounded">
                        {port}
                      </span>
                    ))}
                    {region.majorPorts.length > 2 && (
                      <span className="text-xs px-2 py-1 bg-ocean-900/20 text-ocean-400 rounded">
                        +{region.majorPorts.length - 2}
                      </span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
            
            {/* Regional Stats Summary */}
            <div className="mt-4 pt-4 border-t border-ocean-700/30">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="text-center">
                  <div className="text-white font-semibold">{indiaRegions.reduce((sum, r) => sum + r.floats, 0)}</div>
                  <div className="text-ocean-400">Total Floats</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-semibold">{indiaRegions.reduce((sum, r) => sum + r.fishingZones, 0)}</div>
                  <div className="text-ocean-400">Fishing Zones</div>
                </div>
              </div>
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
                  Live Data
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 bg-deep-700/50 rounded hover:bg-deep-600/50 transition-colors">
                  <RefreshCw className="w-4 h-4 text-ocean-300" />
                </button>
                <button className="p-2 bg-deep-700/50 rounded hover:bg-deep-600/50 transition-colors">
                  <Maximize2 className="w-4 h-4 text-ocean-300" />
                </button>
              </div>
            </div>

            {/* Interactive Leaflet Map */}
            <div className="relative h-96 rounded-lg overflow-hidden">
              <MapContainer
                center={
                  mapView === 'global' ? [15.0, 75.0] :
                  mapView === 'regional' ? [15.0, 80.0] :
                  selectedRegion ? indiaRegions.find(r => r.name === selectedRegion)?.center || [15.0, 75.0] :
                  [15.0, 75.0]
                }
                zoom={mapView === 'global' ? 5 : mapView === 'regional' ? 7 : 9}
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

                  {/* Data Overlays */}
                  <LayersControl.Overlay checked name="ARGO Floats">
                    <FeatureGroup>
                      {activeFloats.map((float) => (
                        <Marker
                          key={float.id}
                          position={[float.lat, float.lon]}
                          icon={createFloatIcon(
                            float.type,
                            float.type === 'Core' ? '#3B82F6' :
                            float.type === 'BGC' ? '#10B981' : '#8B5CF6'
                          )}
                          eventHandlers={{
                            click: () => setSelectedFloat(float.id)
                          }}
                        >
                          <Popup>
                            <div className="p-2 min-w-48">
                              <h4 className="font-semibold text-gray-800 mb-2">Float {float.id}</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Type:</span>
                                  <span className="font-medium">{float.type}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Temperature:</span>
                                  <span className="font-medium">{float.temp}°C</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Salinity:</span>
                                  <span className="font-medium">{float.salinity} PSU</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Depth:</span>
                                  <span className="font-medium">{float.depth}m</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Oxygen:</span>
                                  <span className="font-medium">{float.data.oxygen} mg/L</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Updated:</span>
                                  <span className="font-medium">{float.lastUpdate}</span>
                                </div>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </FeatureGroup>
                  </LayersControl.Overlay>

                  <LayersControl.Overlay name="Float Trajectories">
                    <FeatureGroup>
                      {activeFloats.map((float) => (
                        <Polyline
                          key={`${float.id}-trajectory`}
                            positions={float.trajectory as [number, number][]}
                          color={
                            float.type === 'Core' ? '#3B82F6' :
                            float.type === 'BGC' ? '#10B981' : '#8B5CF6'
                          }
                          weight={2}
                          opacity={0.7}
                        />
                      ))}
                    </FeatureGroup>
                  </LayersControl.Overlay>

                  <LayersControl.Overlay name="India Economic Zones">
                    <FeatureGroup>
                      {indiaRegions.map((region) => (
                        <React.Fragment key={region.name}>
                          <Circle
                            center={region.center}
                            radius={50000}
                            fillColor={region.color}
                            fillOpacity={0.2}
                            color={region.color}
                            weight={2}
                            eventHandlers={{
                              click: () => setSelectedRegion(region.name)
                            }}
                          >
                            <Popup>
                              <div className="p-3 min-w-64">
                                <h4 className="font-semibold text-gray-800 mb-2">{region.name}</h4>
                                <p className="text-sm text-gray-600 mb-3">{region.description}</p>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <span className="text-gray-500">Active Floats:</span>
                                    <div className="font-medium">{region.floats}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Avg Temperature:</span>
                                    <div className="font-medium">{region.temp}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Economic Value:</span>
                                    <div className="font-medium">{region.economicValue}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Fishing Zones:</span>
                                    <div className="font-medium">{region.fishingZones}</div>
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <span className="text-gray-500 text-xs">Major Ports:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {region.majorPorts.map(port => (
                                      <span key={port} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                        {port}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </Popup>
                          </Circle>
                        </React.Fragment>
                      ))}
                    </FeatureGroup>
                  </LayersControl.Overlay>

                  {/* Temperature Overlay */}
                  {selectedLayer === 'temperature' && (
                    <LayersControl.Overlay checked name="Temperature Layer">
                      <FeatureGroup>
                        {activeFloats.map((float) => (
                          <Circle
                            key={`temp-${float.id}`}
                            center={[float.lat, float.lon]}
                            radius={25000}
                            fillColor={
                              float.temp > 28 ? '#EF4444' :
                              float.temp > 26 ? '#F59E0B' :
                              float.temp > 24 ? '#10B981' : '#3B82F6'
                            }
                            fillOpacity={0.4}
                            stroke={false}
                          />
                        ))}
                      </FeatureGroup>
                    </LayersControl.Overlay>
                  )}

                  {/* Drawing Controls */}
                  <LayersControl.Overlay name="Drawing Tools">
                    <FeatureGroup>
                      <EditControl
                        position="topleft"
                        draw={{
                          rectangle: true,
                          polygon: true,
                          circle: true,
                          polyline: true,
                          marker: true,
                          circlemarker: false
                        }}
                        edit={{
                          edit: {},
                          remove: true
                        }}
                      />
                    </FeatureGroup>
                  </LayersControl.Overlay>
                </LayersControl>
              </MapContainer>

              {/* Map Controls Overlay */}
              <div className="absolute top-4 left-4 z-20 space-y-2">
                <motion.button
                  onClick={() => setIs3DView(!is3DView)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <Compass className="w-5 h-5 text-gray-700" />
                </motion.button>
                <motion.button
                  onClick={() => mapInstance?.fitBounds([[6, 65], [25, 95]])}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <Home className="w-5 h-5 text-gray-700" />
                </motion.button>
              </div>

              {/* Enhanced Selected Float Info */}
              {selectedFloat && (
                <motion.div
                  className="absolute top-4 right-4 z-20 glass-morphism p-4 rounded-lg border border-ocean-700/30 min-w-72 max-w-80"
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 20 }}
                >
                  {(() => {
                    const float = activeFloats.find(f => f.id === selectedFloat)
                    return float ? (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Anchor className="w-5 h-5 text-blue-400" />
                            <h4 className="text-white font-semibold">Float {float.id}</h4>
                          </div>
                          <button 
                            onClick={() => setSelectedFloat(null)}
                            className="text-ocean-400 hover:text-white text-xl leading-none"
                          >
                            ×
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                          <div className="space-y-2">
                            <div>
                              <span className="text-ocean-400 text-xs">Type</span>
                              <div className="text-white font-medium">{float.type}</div>
                            </div>
                            <div>
                              <span className="text-ocean-400 text-xs">Temperature</span>
                              <div className="text-white font-medium">{float.temp}°C</div>
                            </div>
                            <div>
                              <span className="text-ocean-400 text-xs">Salinity</span>
                              <div className="text-white font-medium">{float.salinity} PSU</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <span className="text-ocean-400 text-xs">Depth</span>
                              <div className="text-white font-medium">{float.depth}m</div>
                            </div>
                            <div>
                              <span className="text-ocean-400 text-xs">Oxygen</span>
                              <div className="text-white font-medium">{float.data.oxygen} mg/L</div>
                            </div>
                            <div>
                              <span className="text-ocean-400 text-xs">pH</span>
                              <div className="text-white font-medium">{float.data.ph}</div>
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <span className="text-ocean-400 text-xs">Position</span>
                          <div className="text-white font-medium">{float.lat.toFixed(3)}°N, {float.lon.toFixed(3)}°E</div>
                        </div>
                        <div className="mb-4">
                          <span className="text-ocean-400 text-xs">Last Update</span>
                          <div className="text-white font-medium">{float.lastUpdate}</div>
                        </div>
                        <div className="flex space-x-2">
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
                    ) : null
                  })()}
                </motion.div>
              )}
            </div>

            {/* Map Tools */}
            <div className="p-4 border-t border-ocean-700/30 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-ocean-300 text-sm">Showing {activeFloats.length} active floats</span>
                <span className="text-ocean-400 text-xs">• Updated 2 minutes ago</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 px-3 py-2 bg-deep-700/50 rounded hover:bg-deep-600/50 transition-colors">
                  <Filter className="w-4 h-4 text-ocean-300" />
                  <span className="text-ocean-300 text-sm">Filter</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded hover:shadow-lg transition-all">
                  <BarChart3 className="w-4 h-4" />
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

export default OceanMap
