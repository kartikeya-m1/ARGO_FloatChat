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

  // Ocean Map Data API
  async getOceanMapData(params: {
    region?: string
    status?: string
    float_type?: string
    has_measurements?: boolean
  } = {}): Promise<OceanMapData> {
    const queryParams = new URLSearchParams()
    // Only add parameters that have actual values (not empty strings or undefined)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString())
      }
    })

    return this.request(`/api/client/visualization/ocean-map?${queryParams}`)
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

  // Generic search/filter API
  async searchFloats(params: {
    query?: string
    region?: string
    status?: string
    float_type?: string
    has_data?: boolean
    limit?: number
  } = {}): Promise<FloatData[]> {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })

    const response = await this.request<OceanMapData>(`/api/client/visualization/ocean-map?${queryParams}`)
    return response.floats
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
