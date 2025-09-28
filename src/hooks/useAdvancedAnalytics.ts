/**
 * Enhanced hooks for Phase 2 Advanced Analytics
 * AI/ML Insights, Business Applications, and Disaster Warning Systems
 */
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface AIModel {
  model_id: string
  title: string
  description: string
  status: 'active' | 'training' | 'testing' | 'development'
  progress: number
  accuracy?: number
  last_trained?: string
  parameters_count?: number
}

export interface PatternDetection {
  pattern_id: string
  title: string
  description: string
  confidence: number
  impact_level: 'high' | 'medium' | 'low'
  timeframe: string
  significance: string
  related_parameters: string[]
  detected_at: string
}

export interface PredictionResult {
  parameter: string
  prediction: string
  timeframe: string
  confidence: number
  region: string
  methodology: string
  historical_accuracy?: number
}

export interface BusinessInsight {
  insight_id: string
  category: 'marine' | 'energy' | 'insurance' | 'logistics'
  title: string
  description: string
  economic_impact?: number
  roi_percentage?: number
  implementation_cost?: number
}

export interface DisasterAlert {
  alert_id: string
  disaster_type: 'cyclone' | 'tsunami' | 'algal_bloom' | 'heatwave'
  region: string
  severity: 'high' | 'medium' | 'low'
  probability: number
  timeframe: string
  affected_areas: string[]
  description: string
  recommended_actions: string[]
}

// ============================================================================
// AI & ML INSIGHTS HOOKS
// ============================================================================

export const useAIModels = () => {
  const [models, setModels] = useState<AIModel[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<any>(null)

  const fetchAIModels = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.get(`${API_BASE_URL}/advanced/ai-insights/models`)
      
      if (response.data.success) {
        setModels(response.data.models)
        setSummary(response.data.summary)
      } else {
        throw new Error('Failed to fetch AI models')
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to fetch AI models')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAIModels()
  }, [fetchAIModels])

  return {
    models,
    loading,
    error,
    summary,
    refetch: fetchAIModels
  }
}

export const usePatternDetection = (region?: string, timeframeDays: number = 180) => {
  const [patterns, setPatterns] = useState<PatternDetection[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisSummary, setAnalysisSummary] = useState<any>(null)

  const fetchPatterns = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (region) params.append('region', region)
      params.append('timeframe_days', timeframeDays.toString())
      
      const response = await axios.get(`${API_BASE_URL}/advanced/ai-insights/patterns?${params}`)
      
      if (response.data.success) {
        setPatterns(response.data.patterns_detected)
        setAnalysisSummary(response.data.analysis_summary)
      } else {
        throw new Error('Failed to fetch patterns')
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to fetch patterns')
    } finally {
      setLoading(false)
    }
  }, [region, timeframeDays])

  useEffect(() => {
    fetchPatterns()
  }, [fetchPatterns])

  return {
    patterns,
    loading,
    error,
    analysisSummary,
    refetch: fetchPatterns
  }
}

export const useOceanPredictions = (forecastDays: number = 90, region?: string) => {
  const [predictions, setPredictions] = useState<PredictionResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [forecastSummary, setForecastSummary] = useState<any>(null)

  const fetchPredictions = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      params.append('forecast_days', forecastDays.toString())
      if (region) params.append('region', region)
      
      const response = await axios.get(`${API_BASE_URL}/advanced/ai-insights/predictions?${params}`)
      
      if (response.data.success) {
        setPredictions(response.data.predictions)
        setForecastSummary(response.data.forecast_summary)
      } else {
        throw new Error('Failed to fetch predictions')
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to fetch predictions')
    } finally {
      setLoading(false)
    }
  }, [forecastDays, region])

  useEffect(() => {
    fetchPredictions()
  }, [fetchPredictions])

  return {
    predictions,
    loading,
    error,
    forecastSummary,
    refetch: fetchPredictions
  }
}

// ============================================================================
// BUSINESS APPLICATIONS HOOKS
// ============================================================================

export const useMarineBusinessInsights = (applicationType?: 'pfz' | 'aquaculture' | 'risk' | 'sustainability') => {
  const [insights, setInsights] = useState<BusinessInsight[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<any>(null)

  const fetchInsights = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (applicationType) params.append('application_type', applicationType)
      
      const response = await axios.get(`${API_BASE_URL}/advanced/business/marine-applications?${params}`)
      
      if (response.data.success) {
        setInsights(response.data.insights)
        setSummary(response.data.summary)
      } else {
        throw new Error('Failed to fetch marine insights')
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to fetch marine insights')
    } finally {
      setLoading(false)
    }
  }, [applicationType])

  useEffect(() => {
    fetchInsights()
  }, [fetchInsights])

  return {
    insights,
    loading,
    error,
    summary,
    refetch: fetchInsights
  }
}

export const useEnergyBusinessInsights = (energyType?: 'wind' | 'thermal' | 'tidal' | 'platform') => {
  const [insights, setInsights] = useState<BusinessInsight[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<any>(null)

  const fetchInsights = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (energyType) params.append('energy_type', energyType)
      
      const response = await axios.get(`${API_BASE_URL}/advanced/business/energy-applications?${params}`)
      
      if (response.data.success) {
        setInsights(response.data.insights)
        setSummary(response.data.summary)
      } else {
        throw new Error('Failed to fetch energy insights')
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to fetch energy insights')
    } finally {
      setLoading(false)
    }
  }, [energyType])

  useEffect(() => {
    fetchInsights()
  }, [fetchInsights])

  return {
    insights,
    loading,
    error,
    summary,
    refetch: fetchInsights
  }
}

// ============================================================================
// DISASTER & EARLY WARNING HOOKS
// ============================================================================

export const useDisasterAlerts = (severity?: 'high' | 'medium' | 'low', disasterType?: 'cyclone' | 'tsunami' | 'algal_bloom' | 'heatwave') => {
  const [alerts, setAlerts] = useState<DisasterAlert[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [alertSummary, setAlertSummary] = useState<any>(null)

  const fetchAlerts = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (severity) params.append('severity', severity)
      if (disasterType) params.append('disaster_type', disasterType)
      
      const response = await axios.get(`${API_BASE_URL}/advanced/disaster/active-alerts?${params}`)
      
      if (response.data.success) {
        setAlerts(response.data.active_alerts)
        setAlertSummary(response.data.alert_summary)
      } else {
        throw new Error('Failed to fetch disaster alerts')
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to fetch disaster alerts')
    } finally {
      setLoading(false)
    }
  }, [severity, disasterType])

  useEffect(() => {
    fetchAlerts()
  }, [fetchAlerts])

  return {
    alerts,
    loading,
    error,
    alertSummary,
    refetch: fetchAlerts
  }
}

export const useCycloneAnalysis = (region: 'bay_of_bengal' | 'arabian_sea' | 'both' = 'both', daysAhead: number = 5) => {
  const [cycloneData, setCycloneData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCycloneAnalysis = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      params.append('region', region)
      params.append('days_ahead', daysAhead.toString())
      
      const response = await axios.get(`${API_BASE_URL}/advanced/disaster/cyclone-analysis?${params}`)
      
      if (response.data.success) {
        setCycloneData(response.data.cyclone_analysis)
      } else {
        throw new Error('Failed to fetch cyclone analysis')
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to fetch cyclone analysis')
    } finally {
      setLoading(false)
    }
  }, [region, daysAhead])

  useEffect(() => {
    fetchCycloneAnalysis()
  }, [fetchCycloneAnalysis])

  return {
    cycloneData,
    loading,
    error,
    refetch: fetchCycloneAnalysis
  }
}

// ============================================================================
// COMPREHENSIVE DASHBOARD HOOK
// ============================================================================

export const useComprehensiveDashboard = () => {
  const [dashboard, setDashboard] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.get(`${API_BASE_URL}/advanced/comprehensive-dashboard`)
      
      if (response.data.success) {
        setDashboard(response.data)
      } else {
        throw new Error('Failed to fetch comprehensive dashboard')
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to fetch comprehensive dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return {
    dashboard,
    loading,
    error,
    refetch: fetchDashboard
  }
}

// ============================================================================
// UTILITIES
// ============================================================================

export const formatEconomicImpact = (value?: number): string => {
  if (!value) return 'N/A'
  
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}B`
  } else {
    return `$${value.toFixed(1)}M`
  }
}

export const getSeverityColor = (severity: 'high' | 'medium' | 'low'): string => {
  switch (severity) {
    case 'high': return 'text-red-400'
    case 'medium': return 'text-yellow-400'
    case 'low': return 'text-green-400'
    default: return 'text-ocean-300'
  }
}

export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 80) return 'text-green-400'
  if (confidence >= 60) return 'text-yellow-400'
  return 'text-red-400'
}

export const formatROI = (roi?: number): string => {
  if (!roi) return 'N/A'
  return `${roi.toFixed(1)}%`
}

export default {
  useAIModels,
  usePatternDetection,
  useOceanPredictions,
  useMarineBusinessInsights,
  useEnergyBusinessInsights,
  useDisasterAlerts,
  useCycloneAnalysis,
  useComprehensiveDashboard,
  formatEconomicImpact,
  getSeverityColor,
  getConfidenceColor,
  formatROI
}
