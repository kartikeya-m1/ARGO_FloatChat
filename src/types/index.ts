// Shared types and interfaces for FloatChat application

export interface OceanMetric {
  label: string
  value: string
  trend: string
  icon: React.ReactNode
  color: string
}

export interface FeatureCard {
  title: string
  desc: string
  status?: string
  icon: React.ReactNode
  color: string
  progress?: number
  count?: string
}

export interface Alert {
  type: string
  message: string
  time: string
  color: string
}

export interface DataVisualization {
  title: string
  desc: string
  type: string
  color: string
}

export interface ResearchTool {
  title: string
  desc: string
  icon: React.ReactNode
  color: string
}

export interface BusinessApplication {
  title: string
  desc: string
  icon: React.ReactNode
  color: string
}

export interface EducationResource {
  title: string
  count: string
  desc: string
  icon: React.ReactNode
}

export interface EconomicIndicator {
  title: string
  desc: string
  icon: React.ReactNode
  color: string
}

export interface DisasterEvent {
  title: string
  desc: string
  icon: React.ReactNode
  color: string
}

export interface PolicyTool {
  title: string
  desc: string
  icon: React.ReactNode
  color: string
}

export interface SearchFilter {
  param: string
  range: string
  icon: React.ReactNode
}

export interface FloatData {
  id: string
  latitude: number
  longitude: number
  temperature: number
  salinity: number
  depth: number
  timestamp: string
}

export interface AIModel {
  title: string
  desc: string
  status: string
  progress: number
}

// Theme colors for consistent UI
export const THEME_COLORS = {
  ocean: {
    50: '#f0f9ff',
    100: '#e0f2fe', 
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e'
  },
  deep: {
    700: '#1e293b',
    800: '#0f172a', 
    900: '#020617'
  }
} as const

export type ViewType =
  | 'overview'
  | 'data_handling'
  | 'visualization'
  | 'search_filters'
  | 'ai_insights'
  | 'business_apps'
  | 'education_hub'
  | 'alerts'
  | 'disaster_early_warning'
  | 'blue_economy'
  | 'policy_citizen_tools'
  | 'research_tools'
  | 'chat'
  | 'map'
