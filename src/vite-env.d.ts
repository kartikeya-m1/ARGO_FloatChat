/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  
  // Map Configuration
  readonly VITE_DEFAULT_MAP_CENTER_LAT: string
  readonly VITE_DEFAULT_MAP_CENTER_LON: string
  readonly VITE_DEFAULT_MAP_ZOOM: string
  
  // Feature Flags
  readonly VITE_ENABLE_VOICE_CHAT: string
  readonly VITE_ENABLE_SQL_INTERFACE: string
  readonly VITE_ENABLE_FILE_BROWSER: string
  readonly VITE_ENABLE_AI_INSIGHTS: string
  readonly VITE_ENABLE_ML_FEATURES: string
  readonly VITE_ENABLE_BUSINESS_FEATURES: string
  
  // Performance Settings
  readonly VITE_MAX_MAP_MARKERS: string
  readonly VITE_DEFAULT_PAGE_SIZE: string
  readonly VITE_QUERY_TIMEOUT: string
  readonly VITE_MAP_CLUSTERING: string
  readonly VITE_ENABLE_VIRTUAL_SCROLLING: string
  
  // UI Preferences
  readonly VITE_THEME: string
  readonly VITE_ENABLE_ANIMATIONS: string
  readonly VITE_AUTO_REFRESH_INTERVAL: string
  
  // Development Settings
  readonly VITE_DEBUG_MODE: string
  readonly VITE_MOCK_DATA: string
  readonly VITE_ENABLE_CONSOLE_LOGS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
