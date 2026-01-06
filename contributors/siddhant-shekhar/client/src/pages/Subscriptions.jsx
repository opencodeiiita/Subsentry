import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Filter, 
  Search, 
  SortAsc, 
  SortDesc, 
  Grid, 
  List,
  Plus,
  AlertCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  MoreHorizontal
} from 'lucide-react'
import SubscriptionCard from '../components/SubscriptionCard'
import SubscriptionTable from '../components/SubscriptionTable'
import FilterPanel from '../components/FilterPanel'
import EmptyState from '../components/EmptyState'
import LoadingSpinner from '../components/LoadingSpinner'
import StatsCards from '../components/StatsCards'
import { useSubscriptions } from '../hooks/useSubscriptions'

const SORT_OPTIONS = [
  { value: 'renewalDate', label: 'Renewal Date', field: 'renewalDate' },
  { value: 'amount', label: 'Amount', field: 'amount' },
  { value: 'name', label: 'Name', field: 'name' },
  { value: 'createdAt', label: 'Date Added', field: 'createdAt' },
]

const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list'
}

export default function Subscriptions() {
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('renewalDate')
  const [sortOrder, setSortOrder] = useState('asc')
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    isTrial: '',
    renewalFrom: '',
    renewalTo: ''
  })

  const {
    subscriptions,
    summary,
    loading,
    error,
    pagination,
    refetch
  } = useSubscriptions({
    search: searchQuery,
    sortBy,
    sortOrder,
    ...filters,
    includeSummary: true
  })

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({
      status: '',
      category: '',
      isTrial: '',
      renewalFrom: '',
      renewalTo: ''
    })
    setSearchQuery('')
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '') || searchQuery !== ''

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-danger-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to load subscriptions
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={refetch}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
          <p className="text-gray-500 mt-1">
            Manage and track all your recurring subscriptions
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-ghost ${showFilters ? 'bg-gray-100' : ''}`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-primary-600 rounded-full">
                !
              </span>
            )}
          </button>
          
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() => setViewMode(VIEW_MODES.GRID)}
              className={`p-2 ${viewMode === VIEW_MODES.GRID ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode(VIEW_MODES.LIST)}
              className={`p-2 ${viewMode === VIEW_MODES.LIST ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Subscription
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {summary && <StatsCards summary={summary} />}

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input min-w-0"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="btn-ghost p-2"
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClear={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : subscriptions.length === 0 ? (
        <EmptyState 
          hasFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />
      ) : (
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === VIEW_MODES.GRID ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions.map((subscription, index) => (
                <motion.div
                  key={subscription.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <SubscriptionCard subscription={subscription} />
                </motion.div>
              ))}
            </div>
          ) : (
            <SubscriptionTable subscriptions={subscriptions} />
          )}
        </motion.div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              disabled={!pagination.hasPrevPage}
              className="btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={!pagination.hasNextPage}
              className="btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
          
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{pagination.totalItems}</span>{' '}
                results
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                disabled={!pagination.hasPrevPage}
                className="btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        page === pagination.currentPage
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>
              
              <button
                disabled={!pagination.hasNextPage}
                className="btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}