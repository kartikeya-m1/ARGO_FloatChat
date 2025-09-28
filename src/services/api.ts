/**
 * API service for connecting React client to ARGO backend
 * Provides typed interfaces for all backend endpoints
 */

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

// Types for API responses
export interface FloatData {
  id: string
  platform_number: string
  lat: number
  lon: number
  status: string
  type: string
  manufacturer?: string
  lastUpdate: string
  temp?: number
  salinity?: number
  depth: number
  color: string
  data_availability: {
    core: boolean
    bgc: boolean
    deep: boolean
  }
  statistics: {
    profiles: number
    measurements: number
    hasData: boolean
  }
  deploymentDate?: string
  trajectory: [number, number][]
}

export interface FileData {
  id: string
  fileName: string
  fileType: string
  platformNumber: string
  fileSizeMB: number
  status: string
  statusColor: string
  downloadUrl?: string
  processedAt?: string
  createdAt: string
  nProfiles?: number
  nMeasurements?: number
}

export interface SQLQueryResult {
  success: boolean
  query?: string
  columns?: string[]
  data?: Array<Record<string, any>>
  rowCount?: number
  executionTimeMs?: number
  error?: string
  suggestions?: string[]
  metadata?: {
    hasMore: boolean
    dataTypes: string[]
  }
}

export interface ChatToSQLResult {
  success: boolean
  userMessage: string
  interpretedIntent: string
  generatedSQL?: string
  data?: Array<Record<string, any>>
  columns?: string[]
  rowCount?: number
  executionTimeMs?: number
  visualization?: {
    type: string
    config?: any
    suggested: boolean
  }
  insights?: string[]
  followUpQuestions?: string[]
  relatedQueries?: string[]
  error?: string
  fallbackQueries?: string[]
}

export interface RAGChatResult {
  success: boolean
  userMessage?: string
  ragResponse?: string
  confidence?: number
  sources?: Array<{
    id: string
    type: string
    relevance_score: number
    metadata: any
  }>
  generatedSQL?: string
  data?: any[]
  columns?: string[]
  rowCount?: number
  executionTimeMs?: number
  retrievedDocs?: Array<{
    id: string
    type: string
    content: string
    metadata: any
  }>
  visualization?: {
    type: string
    suggested?: boolean
    dataAvailable?: boolean
  }
  followUpQuestions?: string[]
  error?: string
  suggestions?: string[]
  fallbackQueries?: string[]
}

export interface DatabaseSchema {
  tables: Record<string, {
    description: string
    category: string
    rowCount: string
    primaryKey: string
    foreignKeys?: Record<string, string>
    columns: Record<string, {
      type: string
      desc: string
      example?: any
      values?: string[]
    }>
    sampleQueries: string[]
  }>
  relationships: Array<{
    from: string
    to: string
    type: string
    key: string
  }>
  commonJoins: Array<{
    description: string
    sql: string
  }>
  quickStats: Record<string, string>
}

export interface DashboardMetrics {
  overview: {
    totalFloats: number
    activeFloats: number
    totalProfiles: number
    totalMeasurements: number
    dataVolume: string
    lastUpdated: string
  }
  dataQuality: {
    floatsWithData: number
    dataCompleteness: number
    processingRate: number
    qualityScore: number
  }
  processing: {
    dailyDataVolume: string
    processingSpeed: string
    querySuccessRate: string
    activeConnections: string
  }
  regional: {
    arabianSea: number
    bayOfBengal: number
    southernWaters: number
  }
  trends: {
    weeklyGrowth: number
    monthlyGrowth: number
    dataIngestionRate: string
  }
}

export interface OceanMapData {
  floats: FloatData[]
  summary: {
    total_floats: number
    active_floats: number
    with_measurements: number
    coverage_percentage: number
    status_breakdown: Record<string, number>
    type_breakdown: Record<string, number>
    regions: Record<string, number>
  }
  lastUpdated: string
}

// API service class
export class ArgoAPIService {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  // Helper method for making requests
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, defaultOptions)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // GCS File Browser API - Using Dummy Data
  async getFiles(params: {
    file_type?: string
    platform_number?: string
    status?: string
    limit?: number
    offset?: number
  } = {}): Promise<{
    files: FileData[]
    pagination: {
      total: number
      offset: number
      limit: number
      hasMore: boolean
    }
    statistics: {
      totalFiles: number
      totalSizeGB: number
      averageFileSizeMB: number
      fileTypes: Record<string, number>
      statusDistribution: Record<string, number>
    }
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Generate dummy file data
    const dummyFiles: FileData[] = [
      {
        id: 'file_001',
        fileName: 'R2900123_001.nc',
        fileType: 'PROF',
        platformNumber: '2900123',
        fileSizeMB: 2.5,
        status: 'completed',
        statusColor: '#10B981',
        downloadUrl: '#',
        processedAt: '2024-09-29T10:30:00Z',
        createdAt: '2024-09-29T08:15:00Z',
        nProfiles: 45,
        nMeasurements: 1250
      },
      {
        id: 'file_002',
        fileName: 'R2900124_BGC.nc',
        fileType: 'BGC',
        platformNumber: '2900124',
        fileSizeMB: 4.2,
        status: 'processing',
        statusColor: '#F59E0B',
        downloadUrl: '#',
        processedAt: '2024-09-29T11:20:00Z',
        createdAt: '2024-09-29T09:45:00Z',
        nProfiles: 67,
        nMeasurements: 2890
      },
      {
        id: 'file_003',
        fileName: 'D2900125_META.nc',
        fileType: 'META',
        platformNumber: '2900125',
        fileSizeMB: 0.8,
        status: 'completed',
        statusColor: '#10B981',
        downloadUrl: '#',
        processedAt: '2024-09-29T12:00:00Z',
        createdAt: '2024-09-29T11:30:00Z',
        nProfiles: 12,
        nMeasurements: 340
      },
      {
        id: 'file_004',
        fileName: 'R2900126_TRAJ.nc',
        fileType: 'TRAJ',
        platformNumber: '2900126',
        fileSizeMB: 1.6,
        status: 'failed',
        statusColor: '#EF4444',
        downloadUrl: undefined,
        processedAt: undefined,
        createdAt: '2024-09-29T07:20:00Z',
        nProfiles: 0,
        nMeasurements: 0
      },
      {
        id: 'file_005',
        fileName: 'R2900127_PROF.nc',
        fileType: 'PROF',
        platformNumber: '2900127',
        fileSizeMB: 3.1,
        status: 'completed',
        statusColor: '#10B981',
        downloadUrl: '#',
        processedAt: '2024-09-29T13:45:00Z',
        createdAt: '2024-09-29T12:10:00Z',
        nProfiles: 52,
        nMeasurements: 1876
      }
    ]

    // Apply basic filtering
    let filteredFiles = dummyFiles
    
    if (params.file_type) {
      filteredFiles = filteredFiles.filter(f => f.fileType.toLowerCase().includes(params.file_type!.toLowerCase()))
    }
    
    if (params.platform_number) {
      filteredFiles = filteredFiles.filter(f => f.platformNumber.includes(params.platform_number!))
    }
    
    if (params.status) {
      filteredFiles = filteredFiles.filter(f => f.status === params.status)
    }

    // Apply pagination
    const limit = params.limit || 50
    const offset = params.offset || 0
    const paginatedFiles = filteredFiles.slice(offset, offset + limit)

    return {
      files: paginatedFiles,
      pagination: {
        total: filteredFiles.length,
        offset: offset,
        limit: limit,
        hasMore: offset + limit < filteredFiles.length
      },
      statistics: {
        totalFiles: 1247,
        totalSizeGB: 4.2,
        averageFileSizeMB: 2.8,
        fileTypes: {
          'PROF': 523,
          'BGC': 312,
          'META': 245,
          'TRAJ': 167
        },
        statusDistribution: {
          'completed': 1089,
          'processing': 98,
          'failed': 45,
          'pending': 15
        }
      }
    }
  }

  // SQL Query API
  async executeSQLQuery(query: string): Promise<SQLQueryResult> {
    return this.request('/api/client/query/execute', {
      method: 'POST',
      body: JSON.stringify({ query }),
    })
  }

  async getDatabaseSchema(): Promise<DatabaseSchema> {
    return this.request('/api/client/query/schema')
  }

  // RAG Chat API
  async ragChat(message: string, context?: any): Promise<RAGChatResult> {
    return this.request('/api/client/ai/rag-chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    })
  }

  // Ocean Map Data API - Using Dummy Data
  async getOceanMapData(params: {
    region?: string
    status?: string
    float_type?: string
    has_measurements?: boolean
  } = {}): Promise<OceanMapData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Generate dummy float data
    const dummyFloats: FloatData[] = [
      {
        id: 'float_001',
        platform_number: '2900123',
        lat: 15.5,
        lon: 68.2,
        status: 'Active',
        type: 'Core',
        manufacturer: 'SBE',
        lastUpdate: '2024-09-29T12:00:00Z',
        temp: 28.5,
        salinity: 35.2,
        depth: 2000,
        color: '#10B981',
        data_availability: {
          core: true,
          bgc: false,
          deep: true
        },
        statistics: {
          profiles: 156,
          measurements: 4520,
          hasData: true
        },
        deploymentDate: '2023-05-15T00:00:00Z',
        trajectory: [[68.2, 15.5], [68.1, 15.6], [67.9, 15.7]]
      },
      {
        id: 'float_002',
        platform_number: '2900124',
        lat: 12.8,
        lon: 75.4,
        status: 'Active',
        type: 'BGC',
        manufacturer: 'APEX',
        lastUpdate: '2024-09-29T11:30:00Z',
        temp: 26.8,
        salinity: 34.8,
        depth: 1500,
        color: '#3B82F6',
        data_availability: {
          core: true,
          bgc: true,
          deep: false
        },
        statistics: {
          profiles: 89,
          measurements: 2670,
          hasData: true
        },
        deploymentDate: '2023-08-22T00:00:00Z',
        trajectory: [[75.4, 12.8], [75.3, 12.9], [75.2, 13.0]]
      },
      {
        id: 'float_003',
        platform_number: '2900125',
        lat: 8.2,
        lon: 73.1,
        status: 'Inactive',
        type: 'Core',
        manufacturer: 'NOVA',
        lastUpdate: '2024-09-25T08:45:00Z',
        temp: 29.1,
        salinity: 35.5,
        depth: 1000,
        color: '#F59E0B',
        data_availability: {
          core: true,
          bgc: false,
          deep: false
        },
        statistics: {
          profiles: 234,
          measurements: 6890,
          hasData: true
        },
        deploymentDate: '2022-12-10T00:00:00Z',
        trajectory: [[73.1, 8.2], [73.0, 8.3], [72.9, 8.4]]
      },
      {
        id: 'float_004',
        platform_number: '2900126',
        lat: 20.1,
        lon: 65.7,
        status: 'Active',
        type: 'Deep',
        manufacturer: 'SBE',
        lastUpdate: '2024-09-29T13:15:00Z',
        temp: 24.2,
        salinity: 36.1,
        depth: 4000,
        color: '#8B5CF6',
        data_availability: {
          core: true,
          bgc: false,
          deep: true
        },
        statistics: {
          profiles: 67,
          measurements: 3450,
          hasData: true
        },
        deploymentDate: '2024-01-18T00:00:00Z',
        trajectory: [[65.7, 20.1], [65.6, 20.2], [65.5, 20.3]]
      },
      {
        id: 'float_005',
        platform_number: '2900127',
        lat: 18.9,
        lon: 72.3,
        status: 'Active',
        type: 'BGC',
        manufacturer: 'APEX',
        lastUpdate: '2024-09-29T14:00:00Z',
        temp: 27.3,
        salinity: 35.0,
        depth: 2500,
        color: '#EF4444',
        data_availability: {
          core: true,
          bgc: true,
          deep: true
        },
        statistics: {
          profiles: 123,
          measurements: 5210,
          hasData: true
        },
        deploymentDate: '2023-09-05T00:00:00Z',
        trajectory: [[72.3, 18.9], [72.2, 19.0], [72.1, 19.1]]
      }
    ]

    // Apply basic filtering
    let filteredFloats = dummyFloats
    
    if (params.region) {
      // Simple region filtering (Arabian Sea vs Bay of Bengal)
      if (params.region.toLowerCase().includes('arabian')) {
        filteredFloats = filteredFloats.filter(f => f.lon < 70)
      } else if (params.region.toLowerCase().includes('bengal')) {
        filteredFloats = filteredFloats.filter(f => f.lon > 70)
      }
    }
    
    if (params.status) {
      filteredFloats = filteredFloats.filter(f => f.status.toLowerCase() === params.status!.toLowerCase())
    }
    
    if (params.float_type) {
      filteredFloats = filteredFloats.filter(f => f.type.toLowerCase() === params.float_type!.toLowerCase())
    }
    
    if (params.has_measurements !== undefined) {
      filteredFloats = filteredFloats.filter(f => f.statistics.hasData === params.has_measurements)
    }

    return {
      floats: filteredFloats,
      summary: {
        total_floats: 5,
        active_floats: 4,
        with_measurements: 5,
        coverage_percentage: 78.5,
        status_breakdown: {
          'Active': 4,
          'Inactive': 1,
          'Deployed': 0,
          'Failed': 0
        },
        type_breakdown: {
          'Core': 2,
          'BGC': 2,
          'Deep': 1
        },
        regions: {
          'Arabian Sea': 2,
          'Bay of Bengal': 2,
          'Indian Ocean': 1
        }
      },
      lastUpdated: '2024-09-29T14:30:00Z'
    }
  }

  // Dashboard Metrics API
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return this.request('/api/client/dashboard/metrics')
  }

  // Individual Float Details API
  async getFloatDetails(platformNumber: string): Promise<{
    floatInfo: {
      platformNumber: string
      wmoId?: string
      status: string
      floatType: string
      manufacturer?: string
      model?: string
      deployment: {
        date?: string
        latitude: number
        longitude: number
        location?: string
      }
      specifications: {
        parkingDepth?: number
        profileDepth?: number
        cyclePeriodDays?: number
        expectedLifetimeCycles?: number
      }
      dataAvailability: {
        core: boolean
        bgc: boolean
        deep: boolean
      }
    }
    trajectory: {
      points: Array<{
        lat: number
        lon: number
        date?: string
        cycle: number
        measurements: number
        maxDepth?: number
      }>
      totalProfiles: number
      distanceTraveled: number
      averageSpeed: number
    }
    profiles: Array<{
      id: string
      cycleNumber: number
      measurementDate?: string
      latitude: number
      longitude: number
      maxPressure?: number
      nLevels?: number
      measurementCount: number
      dataMode?: string
      qualityFlag?: string
    }>
    dataFiles: Array<{
      id: string
      fileName: string
      fileType: string
      fileSizeMB: number
      status: string
      downloadUrl?: string
      processedAt?: string
      nProfiles?: number
      nMeasurements?: number
    }>
    measurements: {
      recent: number
      statistics: {
        temperature: {
          min?: number
          max?: number
          avg?: number
        }
        salinity: {
          min?: number
          max?: number
          avg?: number
        }
      }
      lastUpdate?: string
    }
    statistics: {
      totalProfiles: number
      totalMeasurements: number
      dataFiles: number
      dateRange: {
        first?: Date
        last?: Date
      }
    }
    status: {
      isActive: boolean
      lastContact?: string
      healthScore: number
    }
  }> {
    return this.request(`/api/client/floats/${platformNumber}/detailed`)
  }

  // Generic search/filter API - Using Dummy Data
  async searchFloats(params: {
    query?: string
    region?: string
    status?: string
    float_type?: string
    has_data?: boolean
    limit?: number
  } = {}): Promise<FloatData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Get ocean map data and extract floats
    const oceanMapData = await this.getOceanMapData({
      region: params.region,
      status: params.status,
      float_type: params.float_type,
      has_measurements: params.has_data
    })
    
    let filteredFloats = oceanMapData.floats
    
    // Apply text query filtering
    if (params.query) {
      const query = params.query.toLowerCase()
      filteredFloats = filteredFloats.filter(f => 
        f.platform_number.toLowerCase().includes(query) ||
        f.manufacturer?.toLowerCase().includes(query) ||
        f.type.toLowerCase().includes(query) ||
        f.status.toLowerCase().includes(query)
      )
    }
    
    // Apply limit
    if (params.limit) {
      filteredFloats = filteredFloats.slice(0, params.limit)
    }
    
    return filteredFloats
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: number }> {
    return this.request('/health')
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      await this.healthCheck()
      return true
    } catch {
      return false
    }
  }
}

// Create singleton instance
export const argoAPI = new ArgoAPIService()

// Export commonly used functions
export const {
  getFiles,
  executeSQLQuery,
  getDatabaseSchema,
  ragChat,
  getOceanMapData,
  getDashboardMetrics,
  getFloatDetails,
  searchFloats,
  testConnection
} = argoAPI

export default argoAPI
