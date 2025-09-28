/**
 * Custom React hooks for ARGO data management
 * Provides easy-to-use interfaces for all ARGO API operations
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { 
  argoAPI, 
  FloatData, 
  FileData, 
  SQLQueryResult, 
  ChatToSQLResult,
  RAGChatResult,
  DatabaseSchema,
  DashboardMetrics,
  OceanMapData 
} from '../services/api'

// Generic hook for API data fetching
export function useAsyncData<T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchFunction()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// Hook for GCS file browser
export function useArgoFiles(params: {
  file_type?: string
  platform_number?: string
  status?: string
  limit?: number
  offset?: number
} = {}) {
  const [files, setFiles] = useState<FileData[]>([])
  const [pagination, setPagination] = useState({
    total: 0,
    offset: 0,
    limit: 50,
    hasMore: false
  })
  const [statistics, setStatistics] = useState({
    totalFiles: 0,
    totalSizeGB: 0,
    averageFileSizeMB: 0,
    fileTypes: {} as Record<string, number>,
    statusDistribution: {} as Record<string, number>
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await argoAPI.getFiles(params)
      setFiles(response.files)
      setPagination(response.pagination)
      setStatistics(response.statistics)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch files')
      setFiles([])
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  return { 
    files, 
    pagination, 
    statistics, 
    loading, 
    error, 
    refetch: fetchFiles 
  }
}

// Hook for SQL query execution
export function useSQLQuery() {
  const [result, setResult] = useState<SQLQueryResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<Array<{ query: string; result: SQLQueryResult; timestamp: Date }>>([])

  const executeQuery = useCallback(async (query: string) => {
    if (!query.trim()) {
      setError('Query cannot be empty')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const queryResult = await argoAPI.executeSQLQuery(query)
      setResult(queryResult)
      
      // Add to history if successful
      if (queryResult.success) {
        setHistory(prev => [
          { query, result: queryResult, timestamp: new Date() },
          ...prev.slice(0, 9) // Keep last 10 queries
        ])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Query execution failed'
      setError(errorMessage)
      setResult({ success: false, error: errorMessage })
    } finally {
      setLoading(false)
    }
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  return { 
    result, 
    loading, 
    error, 
    history, 
    executeQuery, 
    clearHistory 
  }
}

// Hook for database schema
export function useDatabaseSchema() {
  return useAsyncData<DatabaseSchema>(
    () => argoAPI.getDatabaseSchema(),
    []
  )
}

// Hook for RAG-powered AI chat
export function useRAGChat() {
  const [messages, setMessages] = useState<Array<{
    id: string
    type: 'user' | 'assistant'
    message: string
    result?: RAGChatResult
    timestamp: Date
  }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (message: string, context?: any) => {
    if (!message.trim()) {
      setError('Message cannot be empty')
      return
    }

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Add user message
    const userMessage = {
      id: `${messageId}_user`,
      type: 'user' as const,
      message,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    try {
      setLoading(true)
      setError(null)
      
      const result = await argoAPI.ragChat(message, context)
      
      // Add assistant response
      const assistantMessage = {
        id: `${messageId}_assistant`,
        type: 'assistant' as const,
        message: result.success 
          ? (result.ragResponse || `I found ${result.rowCount || 0} results for your query.`)
          : `I couldn't process that request: ${result.error}`,
        result,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'RAG chat request failed'
      setError(errorMessage)
      
      const errorResponse = {
        id: `${messageId}_error`,
        type: 'assistant' as const,
        message: `Sorry, I encountered an error: ${errorMessage}`,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setLoading(false)
    }
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return { 
    messages, 
    loading, 
    error, 
    sendMessage, 
    clearMessages 
  }
}

// Legacy hook for backward compatibility (now using RAG)
export function useAIChatSQL() {
  return useRAGChat()
}

// Hook for ocean map data
export function useOceanMap(params: {
  region?: string
  status?: string
  float_type?: string
  has_measurements?: boolean
} = {}) {
  const [mapData, setMapData] = useState<OceanMapData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFloat, setSelectedFloat] = useState<string | null>(null)

  const fetchMapData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await argoAPI.getOceanMapData(params)
      setMapData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch map data')
      setMapData(null)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => {
    fetchMapData()
  }, [fetchMapData])

  const selectFloat = useCallback((floatId: string | null) => {
    setSelectedFloat(floatId)
  }, [])

  const getSelectedFloatData = useCallback(() => {
    if (!selectedFloat || !mapData) return null
    return mapData.floats.find(f => f.id === selectedFloat) || null
  }, [selectedFloat, mapData])

  return { 
    mapData, 
    loading, 
    error, 
    refetch: fetchMapData,
    selectedFloat,
    selectFloat,
    selectedFloatData: getSelectedFloatData()
  }
}

// Hook for dashboard metrics
export function useDashboardMetrics(refreshInterval?: number) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await argoAPI.getDashboardMetrics()
      setMetrics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics')
      setMetrics(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMetrics()

    // Set up auto-refresh if interval is provided
    if (refreshInterval && refreshInterval > 0) {
      intervalRef.current = setInterval(fetchMetrics, refreshInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchMetrics, refreshInterval])

  return { 
    metrics, 
    loading, 
    error, 
    refetch: fetchMetrics 
  }
}

// Hook for individual float details
export function useFloatDetails(platformNumber: string | null) {
  const [floatDetails, setFloatDetails] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFloatDetails = useCallback(async () => {
    if (!platformNumber) {
      setFloatDetails(null)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await argoAPI.getFloatDetails(platformNumber)
      setFloatDetails(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch float details')
      setFloatDetails(null)
    } finally {
      setLoading(false)
    }
  }, [platformNumber])

  useEffect(() => {
    fetchFloatDetails()
  }, [fetchFloatDetails])

  return { 
    floatDetails, 
    loading, 
    error, 
    refetch: fetchFloatDetails 
  }
}

// Hook for searching floats
export function useFloatSearch() {
  const [results, setResults] = useState<FloatData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  const searchFloats = useCallback(async (params: {
    query?: string
    region?: string
    status?: string
    float_type?: string
    has_data?: boolean
    limit?: number
  }) => {
    try {
      setLoading(true)
      setError(null)
      const data = await argoAPI.searchFloats(params)
      setResults(data)

      // Add to search history
      if (params.query) {
        setSearchHistory(prev => [
          params.query!,
          ...prev.filter(q => q !== params.query).slice(0, 9) // Keep last 10 unique searches
        ])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const clearResults = useCallback(() => {
    setResults([])
  }, [])

  const clearHistory = useCallback(() => {
    setSearchHistory([])
  }, [])

  return { 
    results, 
    loading, 
    error, 
    searchHistory,
    searchFloats, 
    clearResults,
    clearHistory
  }
}

// Hook for API connection status
export function useAPIConnection() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkConnection = useCallback(async () => {
    try {
      setLoading(true)
      const connected = await argoAPI.testConnection()
      setIsConnected(connected)
      setLastChecked(new Date())
    } catch {
      setIsConnected(false)
      setLastChecked(new Date())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkConnection()

    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000)
    return () => clearInterval(interval)
  }, [checkConnection])

  return { 
    isConnected, 
    loading, 
    lastChecked, 
    checkConnection 
  }
}

// Hook for real-time data updates (WebSocket placeholder)
export function useRealTimeUpdates(enabled: boolean = false) {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [updateCount, setUpdateCount] = useState(0)

  useEffect(() => {
    if (!enabled) return

    // Placeholder for WebSocket connection
    // In a real implementation, this would establish a WebSocket connection
    const interval = setInterval(() => {
      setLastUpdate(new Date())
      setUpdateCount(prev => prev + 1)
    }, 60000) // Mock update every minute

    return () => clearInterval(interval)
  }, [enabled])

  return { 
    lastUpdate, 
    updateCount, 
    isEnabled: enabled 
  }
}

export default {
  useAsyncData,
  useArgoFiles,
  useSQLQuery,
  useDatabaseSchema,
  useAIChatSQL,
  useOceanMap,
  useDashboardMetrics,
  useFloatDetails,
  useFloatSearch,
  useAPIConnection,
  useRealTimeUpdates
}
