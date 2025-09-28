import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Database, 
  Play, 
  Download, 
  Copy, 
  History, 
  Code, 
  Table, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  BarChart3, 
  Info,
  RefreshCw,
  Save,
  Trash2,
  Eye,
  Zap,
  BookOpen,
  Search,
  Filter
} from 'lucide-react'
import { useSQLQuery, useDatabaseSchema } from '../../hooks/useArgoData'

const SQLQueryInterface: React.FC = () => {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'editor' | 'schema' | 'history' | 'examples'>('editor')
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [autoExecute, setAutoExecute] = useState(false)
  const [savedQueries, setSavedQueries] = useState<Array<{id: string, name: string, query: string}>>([])
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  // Use our custom hooks for real data
  const { 
    result, 
    loading, 
    error, 
    history, 
    executeQuery, 
    clearHistory 
  } = useSQLQuery()
  
  const { 
    data: schema, 
    loading: schemaLoading, 
    error: schemaError 
  } = useDatabaseSchema()

  // Sample queries for quick access
  const sampleQueries = [
    {
      name: "Active Floats Overview",
      query: "SELECT platform_number, status, deployment_latitude, deployment_longitude, manufacturer FROM argo_floats WHERE status = 'active' LIMIT 20",
      description: "Get basic information about active ARGO floats"
    },
    {
      name: "Float Count by Region",
      query: `SELECT 
  CASE 
    WHEN deployment_latitude BETWEEN 8 AND 24 AND deployment_longitude BETWEEN 68 AND 76 THEN 'Arabian Sea'
    WHEN deployment_latitude BETWEEN 8 AND 22 AND deployment_longitude BETWEEN 80 AND 95 THEN 'Bay of Bengal'  
    WHEN deployment_latitude BETWEEN -8 AND 6 AND deployment_longitude BETWEEN 72 AND 94 THEN 'Southern Waters'
    ELSE 'Other Regions'
  END as region,
  COUNT(*) as float_count
FROM argo_floats 
WHERE deployment_latitude IS NOT NULL AND deployment_longitude IS NOT NULL
GROUP BY region
ORDER BY float_count DESC`,
      description: "Count floats by Indian Ocean regions"
    },
    {
      name: "Temperature Analysis",
      query: `SELECT 
  ROUND(AVG(m.temperature)::numeric, 2) as avg_temperature,
  ROUND(MIN(m.temperature)::numeric, 2) as min_temperature, 
  ROUND(MAX(m.temperature)::numeric, 2) as max_temperature,
  COUNT(*) as measurement_count
FROM argo_measurements m 
WHERE m.temperature IS NOT NULL`,
      description: "Analyze temperature measurements"
    },
    {
      name: "Recent Profiles with Measurements",
      query: `SELECT 
  f.platform_number,
  p.measurement_date,
  p.latitude,
  p.longitude,
  COUNT(m.id) as measurements
FROM argo_profiles p
JOIN argo_floats f ON p.float_id = f.id
LEFT JOIN argo_measurements m ON p.id = m.profile_id
GROUP BY f.platform_number, p.measurement_date, p.latitude, p.longitude
ORDER BY p.measurement_date DESC
LIMIT 20`,
      description: "Get recent profiles with measurement counts"
    },
    {
      name: "File Processing Status",
      query: `SELECT 
  file_type,
  status,
  COUNT(*) as file_count,
  ROUND(SUM(file_size)/1024/1024::numeric, 2) as total_size_mb
FROM argo_data_files 
GROUP BY file_type, status
ORDER BY file_type, status`,
      description: "Check data file processing status"
    }
  ]

  const handleExecuteQuery = () => {
    if (query.trim()) {
      executeQuery(query.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault()
      handleExecuteQuery()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Could add toast notification here
  }

  const downloadResults = () => {
    if (result?.data && result.data.length > 0) {
      const headers = result.columns || []
      const csvContent = [
        headers.join(','),
        ...result.data.map(row => 
          headers.map(col => {
            const value = row[col]
            // Handle values that might contain commas
            return typeof value === 'string' && value.includes(',') 
              ? `"${value.replace(/"/g, '""')}"` 
              : value
          }).join(',')
        )
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `argo_query_results_${Date.now()}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }
  }

  const saveQuery = () => {
    if (!query.trim()) return
    
    const name = prompt('Enter a name for this query:')
    if (name) {
      const newQuery = {
        id: Date.now().toString(),
        name,
        query: query.trim()
      }
      setSavedQueries(prev => [...prev, newQuery])
    }
  }

  const loadQuery = (queryText: string) => {
    setQuery(queryText)
    setActiveTab('editor')
  }

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
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
        isActive 
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
          : 'bg-deep-700/50 text-ocean-300 hover:text-white hover:bg-deep-600/50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={isActive ? 'text-white' : 'text-blue-400'}>{icon}</div>
      <span>{label}</span>
    </motion.button>
  )

  const renderTableSchema = (tableName: string, tableInfo: any) => (
    <motion.div
      key={tableName}
      className="glass-morphism p-4 rounded-lg border border-ocean-700/30 mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Table className="w-4 h-4 text-blue-400" />
          <h4 className="text-lg font-semibold text-white">{tableName}</h4>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-blue-900/20 text-blue-400 px-2 py-1 rounded">
            {tableInfo.rowCount} rows
          </span>
          <span className="text-xs bg-purple-900/20 text-purple-400 px-2 py-1 rounded">
            {tableInfo.category}
          </span>
        </div>
      </div>
      
      <p className="text-ocean-300 text-sm mb-4">{tableInfo.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {Object.entries(tableInfo.columns).slice(0, 8).map(([colName, colInfo]: [string, any]) => (
          <div key={colName} className="bg-deep-700/30 p-2 rounded">
            <div className="flex items-center justify-between mb-1">
              <code className="text-blue-400 text-sm font-mono">{colName}</code>
              <span className="text-xs bg-green-900/20 text-green-400 px-1 rounded">
                {colInfo.type}
              </span>
            </div>
            <p className="text-ocean-400 text-xs">{colInfo.desc}</p>
            {colInfo.example && (
              <p className="text-ocean-500 text-xs mt-1">
                e.g., {typeof colInfo.example === 'string' ? `"${colInfo.example}"` : colInfo.example}
              </p>
            )}
          </div>
        ))}
      </div>
      
      <div className="border-t border-ocean-700/30 pt-3">
        <h5 className="text-sm font-medium text-white mb-2">Sample Queries:</h5>
        <div className="space-y-2">
          {tableInfo.sampleQueries.slice(0, 2).map((sampleQuery: string, index: number) => (
            <div key={index} className="bg-deep-700/30 p-2 rounded">
              <code className="text-ocean-200 text-xs font-mono">{sampleQuery}</code>
              <button
                onClick={() => loadQuery(sampleQuery)}
                className="ml-2 text-blue-400 hover:text-blue-300 text-xs"
              >
                Use
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'editor':
        return (
          <div className="space-y-6">
            {/* Query Editor */}
            <div className="glass-morphism p-4 rounded-xl border border-ocean-700/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Code className="w-5 h-5 mr-2 text-blue-400" />
                  SQL Query Editor
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuery('')}
                    className="p-2 text-ocean-400 hover:text-white hover:bg-red-600/20 rounded transition-colors"
                    title="Clear query"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(query)}
                    className="p-2 text-ocean-400 hover:text-white hover:bg-blue-600/20 rounded transition-colors"
                    title="Copy query"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={saveQuery}
                    disabled={!query.trim()}
                    className="p-2 text-ocean-400 hover:text-white hover:bg-green-600/20 rounded transition-colors disabled:opacity-50"
                    title="Save query"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your SQL query here... (Press Ctrl+Enter to execute)"
                className="w-full h-48 bg-deep-700 text-white p-4 rounded-lg border border-ocean-600/30 focus:border-blue-500 focus:outline-none font-mono text-sm resize-vertical"
              />
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                  <div className="text-ocean-400 text-sm">
                    {query.length} characters
                  </div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={autoExecute}
                      onChange={(e) => setAutoExecute(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-ocean-300 text-sm">Auto-execute on paste</span>
                  </label>
                </div>
                
                <motion.button
                  onClick={handleExecuteQuery}
                  disabled={!query.trim() || loading}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  <span>{loading ? 'Executing...' : 'Execute Query'}</span>
                </motion.button>
              </div>
            </div>

            {/* Query Results */}
            <AnimatePresence>
              {(result || loading || error) && (
                <motion.div
                  className="glass-morphism p-6 rounded-xl border border-ocean-700/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      {loading ? (
                        <RefreshCw className="w-5 h-5 mr-2 text-blue-400 animate-spin" />
                      ) : result?.success ? (
                        <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 mr-2 text-red-400" />
                      )}
                      Query Results
                    </h3>
                    
                    {result?.success && result.data && result.data.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={downloadResults}
                          className="flex items-center space-x-1 px-3 py-1 bg-deep-700/50 text-ocean-300 rounded hover:bg-deep-600/50 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span className="text-sm">CSV</span>
                        </button>
                        <div className="text-ocean-400 text-sm">
                          {result.rowCount} rows • {result.executionTimeMs}ms
                        </div>
                      </div>
                    )}
                  </div>

                  {loading && (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-center">
                        <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
                        <div className="text-ocean-300">Executing query...</div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <span className="text-red-400 font-medium">Query Error</span>
                      </div>
                      <div className="text-red-300 text-sm">{error}</div>
                    </div>
                  )}

                  {result?.success === false && result.error && (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <span className="text-red-400 font-medium">SQL Error</span>
                      </div>
                      <div className="text-red-300 text-sm mb-3">{result.error}</div>
                      {result.suggestions && (
                        <div>
                          <div className="text-ocean-300 text-sm font-medium mb-2">Suggestions:</div>
                          <ul className="text-ocean-400 text-sm space-y-1">
                            {result.suggestions.map((suggestion, index) => (
                              <li key={index}>• {suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {result?.success && result.data && (
                    <div className="overflow-x-auto">
                      {result.data.length === 0 ? (
                        <div className="text-center py-8 text-ocean-400">
                          <Info className="w-12 h-12 mx-auto mb-2" />
                          <div>Query executed successfully but returned no results</div>
                        </div>
                      ) : (
                        <table className="w-full min-w-full">
                          <thead>
                            <tr className="border-b border-ocean-700/30">
                              {result.columns?.map((column, index) => (
                                <th key={index} className="text-left p-3 text-ocean-300 font-medium whitespace-nowrap">
                                  {column}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {result.data.slice(0, 100).map((row, index) => ( // Limit to 100 rows for performance
                              <tr key={index} className="border-b border-ocean-700/20 hover:bg-deep-700/20">
                                {result.columns?.map((column, colIndex) => (
                                  <td key={colIndex} className="p-3 text-ocean-200 text-sm max-w-xs truncate">
                                    {row[column] !== null && row[column] !== undefined 
                                      ? String(row[column]) 
                                      : <span className="text-ocean-500 italic">null</span>
                                    }
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                      {result.data.length > 100 && (
                        <div className="text-center py-4 text-ocean-400 text-sm">
                          Showing first 100 of {result.data.length} results. Download CSV for complete data.
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      
      case 'schema':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Database Schema</h3>
              {schema && (
                <div className="text-ocean-300 text-sm">
                  Last updated: {schema.quickStats.lastUpdated ? new Date(schema.quickStats.lastUpdated).toLocaleString() : 'Unknown'}
                </div>
              )}
            </div>
            
            {schemaLoading && (
              <div className="flex items-center justify-center h-32">
                <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
              </div>
            )}
            
            {schemaError && (
              <div className="text-center text-red-400">
                Error loading schema: {schemaError}
              </div>
            )}
            
            {schema && (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="glass-morphism p-4 rounded-lg border border-ocean-700/30 text-center">
                    <div className="text-2xl font-bold text-white">{schema.quickStats.totalFloats}</div>
                    <div className="text-ocean-300 text-sm">Total Floats</div>
                  </div>
                  <div className="glass-morphism p-4 rounded-lg border border-ocean-700/30 text-center">
                    <div className="text-2xl font-bold text-white">{schema.quickStats.totalProfiles}</div>
                    <div className="text-ocean-300 text-sm">Profiles</div>
                  </div>
                  <div className="glass-morphism p-4 rounded-lg border border-ocean-700/30 text-center">
                    <div className="text-2xl font-bold text-white">{schema.quickStats.totalMeasurements}</div>
                    <div className="text-ocean-300 text-sm">Measurements</div>
                  </div>
                  <div className="glass-morphism p-4 rounded-lg border border-ocean-700/30 text-center">
                    <div className="text-2xl font-bold text-white">{schema.quickStats.dataVolume}</div>
                    <div className="text-ocean-300 text-sm">Data Volume</div>
                  </div>
                </div>

                {/* Tables */}
                <div className="space-y-4">
                  {Object.entries(schema.tables).map(([tableName, tableInfo]) => 
                    renderTableSchema(tableName, tableInfo)
                  )}
                </div>

                {/* Common Joins */}
                <div className="glass-morphism p-6 rounded-xl border border-ocean-700/30">
                  <h4 className="text-lg font-semibold text-white mb-4">Common JOIN Patterns</h4>
                  <div className="space-y-4">
                    {schema.commonJoins.map((join, index) => (
                      <div key={index} className="bg-deep-700/30 p-4 rounded-lg">
                        <div className="text-ocean-300 text-sm mb-2">{join.description}</div>
                        <div className="bg-deep-800 p-3 rounded font-mono text-sm text-ocean-200 overflow-x-auto">
                          {join.sql}
                        </div>
                        <button
                          onClick={() => loadQuery(join.sql)}
                          className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
                        >
                          Use this query
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )
      
      case 'history':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Query History</h3>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="flex items-center space-x-1 text-red-400 hover:text-red-300 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear History</span>
                </button>
              )}
            </div>
            
            {history.length === 0 ? (
              <div className="text-center py-12 text-ocean-400">
                <Clock className="w-12 h-12 mx-auto mb-4" />
                <div>No query history yet</div>
                <div className="text-sm mt-2">Your executed queries will appear here</div>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item, index) => (
                  <motion.div
                    key={index}
                    className="glass-morphism p-4 rounded-lg border border-ocean-700/30"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {item.result.success ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span className="text-white text-sm font-medium">
                          Query {history.length - index}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-ocean-400 text-xs">
                          {item.timestamp.toLocaleString()}
                        </span>
                        {item.result.success && (
                          <span className="text-ocean-400 text-xs">
                            {item.result.rowCount} rows • {item.result.executionTimeMs}ms
                          </span>
                        )}
                        <button
                          onClick={() => loadQuery(item.query)}
                          className="text-blue-400 hover:text-blue-300 text-xs"
                        >
                          Load
                        </button>
                      </div>
                    </div>
                    <div className="bg-deep-700/30 p-3 rounded font-mono text-sm text-ocean-200 overflow-x-auto">
                      {item.query}
                    </div>
                    {!item.result.success && item.result.error && (
                      <div className="mt-2 text-red-400 text-sm">
                        Error: {item.result.error}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )
      
      case 'examples':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Example Queries</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sampleQueries.map((sample, index) => (
                <motion.div
                  key={index}
                  className="glass-morphism p-6 rounded-xl border border-ocean-700/30 hover:border-blue-500/50 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-white">{sample.name}</h4>
                    <button
                      onClick={() => loadQuery(sample.query)}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Use Query
                    </button>
                  </div>
                  <p className="text-ocean-300 text-sm mb-4">{sample.description}</p>
                  <div className="bg-deep-700/50 p-3 rounded font-mono text-xs text-ocean-200 overflow-x-auto">
                    {sample.query.length > 200 ? `${sample.query.substring(0, 200)}...` : sample.query}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Database className="w-8 h-8 mr-3 text-blue-500" />
            SQL Query Interface
          </h2>
          <p className="text-ocean-300">Execute SQL queries on ARGO oceanographic database with safety controls</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <TabButton 
          id="editor" 
          label="Query Editor" 
          icon={<Code className="w-4 h-4" />}
          isActive={activeTab === 'editor'} 
          onClick={(id) => setActiveTab(id as any)} 
        />
        <TabButton 
          id="schema" 
          label="Database Schema" 
          icon={<Table className="w-4 h-4" />}
          isActive={activeTab === 'schema'} 
          onClick={(id) => setActiveTab(id as any)} 
        />
        <TabButton 
          id="history" 
          label="Query History" 
          icon={<History className="w-4 h-4" />}
          isActive={activeTab === 'history'} 
          onClick={(id) => setActiveTab(id as any)} 
        />
        <TabButton 
          id="examples" 
          label="Example Queries" 
          icon={<BookOpen className="w-4 h-4" />}
          isActive={activeTab === 'examples'} 
          onClick={(id) => setActiveTab(id as any)} 
        />
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  )
}

export default SQLQueryInterface
